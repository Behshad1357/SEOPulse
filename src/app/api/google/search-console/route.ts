import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { google } from "googleapis";
import { createOAuth2Client } from "@/lib/google";

// Define types for GSC API responses
interface GSCRow {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
}

interface GSCTotals {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

// Cache configuration - prevents excessive API calls
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: unknown; timestamp: number }>();

function getCachedData(key: string): unknown | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteUrl = searchParams.get("siteUrl");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's Google tokens
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("google_access_token, google_refresh_token, google_token_expiry")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Profile fetch error:", profileError);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    if (!profile.google_refresh_token) {
      return NextResponse.json(
        { error: "Google not connected", code: "NOT_CONNECTED" },
        { status: 400 }
      );
    }

    // Create authenticated OAuth2 client
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({
      access_token: profile.google_access_token,
      refresh_token: profile.google_refresh_token,
    });

    // Check if token needs refresh
    const now = Date.now();
    const tokenExpiry = profile.google_token_expiry
      ? new Date(profile.google_token_expiry).getTime()
      : 0;

    if (tokenExpiry && now >= tokenExpiry - 60000) {
      // Refresh 1 minute before expiry
      try {
        console.log("Refreshing Google access token...");
        const { credentials } = await oauth2Client.refreshAccessToken();

        // Save new tokens to database
        await supabase
          .from("profiles")
          .update({
            google_access_token: credentials.access_token,
            google_token_expiry: credentials.expiry_date
              ? new Date(credentials.expiry_date).toISOString()
              : null,
          })
          .eq("id", user.id);

        oauth2Client.setCredentials(credentials);
        console.log("Token refreshed successfully");
      } catch (refreshError: unknown) {
        const errorMessage = refreshError instanceof Error ? refreshError.message : "Unknown error";
        console.error("Token refresh failed:", refreshError);

        // If refresh fails, clear tokens and require reconnection
        if (
          errorMessage.includes("invalid_grant") ||
          errorMessage.includes("Token has been expired")
        ) {
          await supabase
            .from("profiles")
            .update({
              google_access_token: null,
              google_refresh_token: null,
              google_token_expiry: null,
            })
            .eq("id", user.id);

          return NextResponse.json(
            {
              error: "Google authentication expired. Please reconnect.",
              code: "TOKEN_EXPIRED",
            },
            { status: 401 }
          );
        }
        throw refreshError;
      }
    }

    // Create Search Console client
    const searchconsole = google.searchconsole({
      version: "v1",
      auth: oauth2Client,
    });

    // Calculate dates if not provided (default: last 28 days)
    const end = endDate || new Date().toISOString().split("T")[0];
    const start =
      startDate ||
      new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    // If no siteUrl provided, return list of available sites
    if (!siteUrl) {
      const cacheKey = `sites_${user.id}`;
      const cachedSites = getCachedData(cacheKey);

      if (cachedSites) {
        return NextResponse.json(cachedSites);
      }

      try {
        const sites = await searchconsole.sites.list();
        const siteEntries = sites.data.siteEntry || [];

        // Format sites for easier use
        const formattedSites = siteEntries.map((site) => ({
          siteUrl: site.siteUrl,
          permissionLevel: site.permissionLevel,
        }));

        const response = { sites: formattedSites };
        setCachedData(cacheKey, response);

        return NextResponse.json(response);
      } catch (siteError: unknown) {
        const errorMessage = siteError instanceof Error ? siteError.message : "Unknown error";
        console.error("Error fetching sites:", siteError);
        return NextResponse.json(
          { error: "Failed to fetch sites", details: errorMessage },
          { status: 500 }
        );
      }
    }

    // Check cache for this specific query
    const cacheKey = `gsc_${user.id}_${siteUrl}_${start}_${end}`;
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      console.log("Returning cached GSC data");
      return NextResponse.json(cachedData);
    }

    // Fetch search analytics data in parallel
    console.log(`Fetching GSC data for ${siteUrl} from ${start} to ${end}`);

    const [performanceData, queryData, pageData, countryData, deviceData] =
      await Promise.all([
        // Daily performance data
        searchconsole.searchanalytics
          .query({
            siteUrl,
            requestBody: {
              startDate: start,
              endDate: end,
              dimensions: ["date"],
              rowLimit: 100,
            },
          })
          .catch((err) => {
            console.error("Performance query error:", err);
            return { data: { rows: [] } };
          }),

        // Top queries
        searchconsole.searchanalytics
          .query({
            siteUrl,
            requestBody: {
              startDate: start,
              endDate: end,
              dimensions: ["query"],
              rowLimit: 25,
            },
          })
          .catch((err) => {
            console.error("Query data error:", err);
            return { data: { rows: [] } };
          }),

        // Top pages
        searchconsole.searchanalytics
          .query({
            siteUrl,
            requestBody: {
              startDate: start,
              endDate: end,
              dimensions: ["page"],
              rowLimit: 25,
            },
          })
          .catch((err) => {
            console.error("Page data error:", err);
            return { data: { rows: [] } };
          }),

        // Country breakdown
        searchconsole.searchanalytics
          .query({
            siteUrl,
            requestBody: {
              startDate: start,
              endDate: end,
              dimensions: ["country"],
              rowLimit: 10,
            },
          })
          .catch((err) => {
            console.error("Country data error:", err);
            return { data: { rows: [] } };
          }),

        // Device breakdown
        searchconsole.searchanalytics
          .query({
            siteUrl,
            requestBody: {
              startDate: start,
              endDate: end,
              dimensions: ["device"],
              rowLimit: 5,
            },
          })
          .catch((err) => {
            console.error("Device data error:", err);
            return { data: { rows: [] } };
          }),
      ]);

    // Process performance data
    const rows: GSCRow[] = (performanceData.data.rows || []) as GSCRow[];

    // Calculate totals with proper null checking
    const totals: GSCTotals = rows.reduce(
      (acc: GSCTotals, row: GSCRow): GSCTotals => ({
        clicks: acc.clicks + (row.clicks ?? 0),
        impressions: acc.impressions + (row.impressions ?? 0),
        ctr: 0,
        position: 0,
      }),
      { clicks: 0, impressions: 0, ctr: 0, position: 0 }
    );

    // Calculate weighted averages
    if (rows.length > 0) {
      // CTR should be total clicks / total impressions
      totals.ctr = totals.impressions > 0 ? totals.clicks / totals.impressions : 0;

      // Position should be weighted by impressions
      const weightedPosition = rows.reduce(
        (acc: number, row: GSCRow) => acc + (row.position ?? 0) * (row.impressions ?? 0),
        0
      );
      totals.position = totals.impressions > 0 ? weightedPosition / totals.impressions : 0;
    }

    // Format traffic data for chart (sorted by date)
    const trafficData = rows
      .map((row: GSCRow) => ({
        date: row.keys?.[0] || "",
        clicks: row.clicks ?? 0,
        impressions: row.impressions ?? 0,
        ctr: row.ctr ?? 0,
        position: row.position ?? 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Format query data
    const queryRows: GSCRow[] = (queryData.data.rows || []) as GSCRow[];
    const queries = queryRows.map((row: GSCRow) => ({
      keyword: row.keys?.[0] || "",
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }));

    // Format page data
    const pageRows: GSCRow[] = (pageData.data.rows || []) as GSCRow[];
    const pages = pageRows.map((row: GSCRow) => ({
      page: row.keys?.[0] || "",
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }));

    // Format country data
    const countryRows: GSCRow[] = (countryData.data.rows || []) as GSCRow[];
    const countries = countryRows.map((row: GSCRow) => ({
      country: row.keys?.[0] || "",
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }));

    // Format device data
    const deviceRows: GSCRow[] = (deviceData.data.rows || []) as GSCRow[];
    const devices = deviceRows.map((row: GSCRow) => ({
      device: row.keys?.[0] || "",
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }));

    // Calculate trends (compare last 7 days vs previous 7 days)
    const trends = calculateTrends(trafficData);

    const response = {
      totals,
      trafficData,
      queries,
      pages,
      countries,
      devices,
      trends,
      dateRange: { start, end },
      siteUrl,
    };

    // Cache the response
    setCachedData(cacheKey, response);

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("GSC API error:", error);

    const errorWithCode = error as { code?: number; message?: string };

    // Handle specific Google API errors
    if (errorWithCode.code === 401 || errorWithCode.code === 403) {
      return NextResponse.json(
        { error: "Google authentication expired", code: "AUTH_EXPIRED" },
        { status: 401 }
      );
    }

    if (errorWithCode.code === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later.", code: "RATE_LIMIT" },
        { status: 429 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch GSC data", details: errorMessage },
      { status: 500 }
    );
  }
}

// Helper function to calculate trends
interface TrafficDataPoint {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface TrendResult {
  clicks: { value: number; percentage: number };
  impressions: { value: number; percentage: number };
  ctr: { value: number; percentage: number };
  position: { value: number; percentage: number };
}

function calculateTrends(trafficData: TrafficDataPoint[]): TrendResult {
  if (trafficData.length < 14) {
    return {
      clicks: { value: 0, percentage: 0 },
      impressions: { value: 0, percentage: 0 },
      ctr: { value: 0, percentage: 0 },
      position: { value: 0, percentage: 0 },
    };
  }

  const recentDays = trafficData.slice(-7);
  const previousDays = trafficData.slice(-14, -7);

  const recentTotals = recentDays.reduce(
    (acc, day) => ({
      clicks: acc.clicks + day.clicks,
      impressions: acc.impressions + day.impressions,
    }),
    { clicks: 0, impressions: 0 }
  );

  const previousTotals = previousDays.reduce(
    (acc, day) => ({
      clicks: acc.clicks + day.clicks,
      impressions: acc.impressions + day.impressions,
    }),
    { clicks: 0, impressions: 0 }
  );

  const calculateChange = (recent: number, previous: number): number => {
    if (previous === 0) return recent > 0 ? 100 : 0;
    return ((recent - previous) / previous) * 100;
  };

  // Calculate average position (lower is better)
  const recentPosition =
    recentDays.reduce((acc, day) => acc + day.position, 0) / recentDays.length;
  const previousPosition =
    previousDays.reduce((acc, day) => acc + day.position, 0) / previousDays.length;

  const recentCtr = recentTotals.impressions > 0 
    ? recentTotals.clicks / recentTotals.impressions 
    : 0;
  const previousCtr = previousTotals.impressions > 0 
    ? previousTotals.clicks / previousTotals.impressions 
    : 0;

  return {
    clicks: {
      value: recentTotals.clicks - previousTotals.clicks,
      percentage: calculateChange(recentTotals.clicks, previousTotals.clicks),
    },
    impressions: {
      value: recentTotals.impressions - previousTotals.impressions,
      percentage: calculateChange(recentTotals.impressions, previousTotals.impressions),
    },
    ctr: {
      value: recentCtr - previousCtr,
      percentage: calculateChange(recentCtr, previousCtr),
    },
    position: {
      value: previousPosition - recentPosition, // Positive means improvement
      percentage: calculateChange(previousPosition, recentPosition), // Inverted
    },
  };
}
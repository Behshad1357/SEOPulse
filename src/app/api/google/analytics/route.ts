import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { createOAuth2Client } from "@/lib/google";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's Google tokens
    const { data: profile } = await supabase
      .from("profiles")
      .select("google_access_token, google_refresh_token")
      .eq("id", user.id)
      .single();

    if (!profile?.google_refresh_token) {
      return NextResponse.json(
        { error: "Google not connected", code: "NOT_CONNECTED" },
        { status: 400 }
      );
    }

    // Create authenticated client
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({
      access_token: profile.google_access_token,
      refresh_token: profile.google_refresh_token,
    });

    // If no propertyId, list available GA4 properties
    if (!propertyId) {
      // Use Admin API to list accounts and properties
      const response = await fetch(
        "https://analyticsadmin.googleapis.com/v1beta/accountSummaries",
        {
          headers: {
            Authorization: `Bearer ${profile.google_access_token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("GA Admin API error:", error);
        return NextResponse.json(
          { error: "Failed to fetch GA properties", properties: [] },
          { status: 200 }
        );
      }

      const data = await response.json();
      const properties: any[] = [];

      // Extract properties from account summaries
      (data.accountSummaries || []).forEach((account: any) => {
        (account.propertySummaries || []).forEach((property: any) => {
          properties.push({
            propertyId: property.property.replace("properties/", ""),
            displayName: property.displayName,
            accountName: account.displayName,
          });
        });
      });

      return NextResponse.json({ properties });
    }

    // Fetch GA4 data for specific property
    const analyticsDataClient = new BetaAnalyticsDataClient({
      authClient: oauth2Client as any,
    });

    // Get last 28 days of data
    const [trafficResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "newUsers" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
        { name: "screenPageViews" },
      ],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    // Get traffic sources
    const [sourcesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
      dimensions: [{ name: "sessionSource" }],
      metrics: [{ name: "sessions" }, { name: "totalUsers" }],
      limit: 10,
    });

    // Get top pages
    const [pagesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
      ],
      limit: 10,
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    });

    // Format traffic data
    const trafficData = (trafficResponse.rows || []).map((row) => ({
      date: row.dimensionValues?.[0]?.value || "",
      sessions: parseInt(row.metricValues?.[0]?.value || "0"),
      users: parseInt(row.metricValues?.[1]?.value || "0"),
      newUsers: parseInt(row.metricValues?.[2]?.value || "0"),
      bounceRate: parseFloat(row.metricValues?.[3]?.value || "0"),
      avgSessionDuration: parseFloat(row.metricValues?.[4]?.value || "0"),
      pageViews: parseInt(row.metricValues?.[5]?.value || "0"),
    }));

    // Calculate totals
    const totals = trafficData.reduce(
      (acc, day) => ({
        sessions: acc.sessions + day.sessions,
        users: acc.users + day.users,
        newUsers: acc.newUsers + day.newUsers,
        pageViews: acc.pageViews + day.pageViews,
        bounceRate: 0,
        avgSessionDuration: 0,
      }),
      { sessions: 0, users: 0, newUsers: 0, pageViews: 0, bounceRate: 0, avgSessionDuration: 0 }
    );

    // Calculate averages
    if (trafficData.length > 0) {
      totals.bounceRate =
        trafficData.reduce((acc, day) => acc + day.bounceRate, 0) / trafficData.length;
      totals.avgSessionDuration =
        trafficData.reduce((acc, day) => acc + day.avgSessionDuration, 0) / trafficData.length;
    }

    // Format sources
    const sources = (sourcesResponse.rows || []).map((row) => ({
      source: row.dimensionValues?.[0]?.value || "Unknown",
      sessions: parseInt(row.metricValues?.[0]?.value || "0"),
      users: parseInt(row.metricValues?.[1]?.value || "0"),
    }));

    // Format pages
    const pages = (pagesResponse.rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || "",
      pageViews: parseInt(row.metricValues?.[0]?.value || "0"),
      avgDuration: parseFloat(row.metricValues?.[1]?.value || "0"),
      bounceRate: parseFloat(row.metricValues?.[2]?.value || "0"),
    }));

    return NextResponse.json({
      totals,
      trafficData,
      sources,
      pages,
      propertyId,
    });
  } catch (error: any) {
    console.error("GA API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data", details: error.message },
      { status: 500 }
    );
  }
}
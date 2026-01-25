import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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
      .select("google_access_token, google_refresh_token, google_token_expiry")
      .eq("id", user.id)
      .single();

    if (!profile?.google_refresh_token) {
      return NextResponse.json(
        { error: "Google not connected", properties: [] },
        { status: 200 }
      );
    }

    // Refresh token if needed
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({
      access_token: profile.google_access_token,
      refresh_token: profile.google_refresh_token,
    });

    const now = Date.now();
    const tokenExpiry = profile.google_token_expiry
      ? new Date(profile.google_token_expiry).getTime()
      : 0;

    let accessToken = profile.google_access_token;

    if (tokenExpiry && now >= tokenExpiry - 60000) {
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        accessToken = credentials.access_token;

        await supabase
          .from("profiles")
          .update({
            google_access_token: credentials.access_token,
            google_token_expiry: credentials.expiry_date
              ? new Date(credentials.expiry_date).toISOString()
              : null,
          })
          .eq("id", user.id);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return NextResponse.json(
          { error: "Failed to refresh token", properties: [] },
          { status: 200 }
        );
      }
    }

    // If no propertyId, list available GA4 properties
    if (!propertyId) {
      try {
        const response = await fetch(
          "https://analyticsadmin.googleapis.com/v1beta/accountSummaries",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("GA Admin API error:", errorData);
          return NextResponse.json({ properties: [] });
        }

        const data = await response.json();
        const properties: any[] = [];

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
      } catch (err) {
        console.error("Error fetching GA properties:", err);
        return NextResponse.json({ properties: [] });
      }
    }

    // Fetch GA4 data for specific property using REST API
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Run report for daily data
    const reportResponse = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
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
        }),
      }
    );

    // Run report for traffic sources
    const sourcesResponse = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: "sessionSource" }],
          metrics: [{ name: "sessions" }, { name: "totalUsers" }],
          limit: 10,
        }),
      }
    );

    // Run report for top pages
    const pagesResponse = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: "pagePath" }],
          metrics: [
            { name: "screenPageViews" },
            { name: "averageSessionDuration" },
            { name: "bounceRate" },
          ],
          limit: 10,
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        }),
      }
    );

    const [reportData, sourcesData, pagesData] = await Promise.all([
      reportResponse.json(),
      sourcesResponse.json(),
      pagesResponse.json(),
    ]);

    // Format traffic data
    const trafficData = (reportData.rows || []).map((row: any) => ({
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
      (acc: any, day: any) => ({
        sessions: acc.sessions + day.sessions,
        users: acc.users + day.users,
        newUsers: acc.newUsers + day.newUsers,
        pageViews: acc.pageViews + day.pageViews,
        bounceRate: 0,
        avgSessionDuration: 0,
      }),
      { sessions: 0, users: 0, newUsers: 0, pageViews: 0, bounceRate: 0, avgSessionDuration: 0 }
    );

    if (trafficData.length > 0) {
      totals.bounceRate =
        trafficData.reduce((acc: number, day: any) => acc + day.bounceRate, 0) /
        trafficData.length;
      totals.avgSessionDuration =
        trafficData.reduce((acc: number, day: any) => acc + day.avgSessionDuration, 0) /
        trafficData.length;
    }

    // Format sources
    const sources = (sourcesData.rows || []).map((row: any) => ({
      source: row.dimensionValues?.[0]?.value || "Unknown",
      sessions: parseInt(row.metricValues?.[0]?.value || "0"),
      users: parseInt(row.metricValues?.[1]?.value || "0"),
    }));

    // Format pages
    const pages = (pagesData.rows || []).map((row: any) => ({
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
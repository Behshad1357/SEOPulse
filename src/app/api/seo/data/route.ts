import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSEOMetrics, getKeywordData } from "@/lib/search-console";
import { getDateRange } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const websiteId = searchParams.get("websiteId");

  if (!websiteId) {
    return NextResponse.json({ error: "Website ID required" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get website
    const { data: website } = await supabase
      .from("websites")
      .select("*")
      .eq("id", websiteId)
      .eq("user_id", user.id)
      .single();

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    // Get user profile with Google tokens
    const { data: profile } = await supabase
      .from("profiles")
      .select("google_access_token, google_refresh_token")
      .eq("id", user.id)
      .single();

    if (!profile?.google_access_token || !profile?.google_refresh_token) {
      return NextResponse.json({ error: "Google not connected" }, { status: 400 });
    }

    const siteUrl = website.gsc_property_id || website.url;
    const { startDate, endDate } = getDateRange(28);

    // Fetch data
    const [metricsData, keywords] = await Promise.all([
      getSEOMetrics(profile.google_access_token, profile.google_refresh_token, siteUrl),
      getKeywordData(profile.google_access_token, profile.google_refresh_token, siteUrl, startDate, endDate),
    ]);

    return NextResponse.json({
      metrics: metricsData.current,
      traffic: metricsData.traffic,
      keywords,
    });
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSEOInsights } from "@/lib/gemini";
import { getSEOMetrics, getKeywordData } from "@/lib/search-console";
import { getDateRange } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { websiteId } = await request.json();

    if (!websiteId) {
      return NextResponse.json({ error: "Website ID required" }, { status: 400 });
    }

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

    // Get profile with tokens
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

    // Fetch SEO data
    const [metricsData, keywords] = await Promise.all([
      getSEOMetrics(profile.google_access_token, profile.google_refresh_token, siteUrl),
      getKeywordData(profile.google_access_token, profile.google_refresh_token, siteUrl, startDate, endDate),
    ]);

    // Generate AI insights
    const insights = await generateSEOInsights(metricsData.current, keywords, website.url);

    // Save insights to database
    const insightsToInsert = insights.map((insight) => ({
      website_id: websiteId,
      type: insight.type,
      title: insight.title,
      description: insight.description,
      priority: insight.priority,
    }));

    await supabase.from("ai_insights").insert(insightsToInsert);

    return NextResponse.json({ insights: insightsToInsert });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}
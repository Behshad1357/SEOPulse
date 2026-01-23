import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface GSCData {
  totals: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  };
  trends: {
    clicks: { value: number; percentage: number };
    impressions: { value: number; percentage: number };
    ctr: { value: number; percentage: number };
    position: { value: number; percentage: number };
  };
  queries: Array<{
    keyword: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  pages: Array<{
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  siteUrl: string;
}

export async function POST(request: Request) {
  console.log("=== AI Insights API Called ===");
  
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("Error: Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured");
      const body = await request.json();
      return NextResponse.json({
        insights: generateFallbackInsights(body),
        source: "fallback",
        reason: "API key not configured",
      });
    }

    console.log("Gemini API Key exists:", process.env.GEMINI_API_KEY.substring(0, 10) + "...");

    const gscData: GSCData = await request.json();
    console.log("GSC Data received:", {
      siteUrl: gscData.siteUrl,
      clicks: gscData.totals?.clicks,
      impressions: gscData.totals?.impressions,
      queriesCount: gscData.queries?.length,
    });

    // If no data, return fallback
    if (!gscData.totals || (gscData.totals.clicks === 0 && gscData.totals.impressions === 0)) {
      console.log("No data available, returning fallback insights");
      return NextResponse.json({
        insights: generateNoDataInsights(gscData.siteUrl),
        source: "no-data",
      });
    }

    // Build the prompt for AI analysis
    const prompt = `You are an SEO expert analyst. Analyze this Google Search Console data and provide exactly 3 actionable SEO insights.

Website: ${gscData.siteUrl}

PERFORMANCE SUMMARY:
- Total Clicks: ${gscData.totals.clicks.toLocaleString()}
- Total Impressions: ${gscData.totals.impressions.toLocaleString()}
- Average CTR: ${(gscData.totals.ctr * 100).toFixed(2)}%
- Average Position: ${gscData.totals.position.toFixed(1)}

WEEK-OVER-WEEK TRENDS:
- Clicks: ${gscData.trends?.clicks?.percentage > 0 ? "+" : ""}${(gscData.trends?.clicks?.percentage || 0).toFixed(1)}%
- Impressions: ${gscData.trends?.impressions?.percentage > 0 ? "+" : ""}${(gscData.trends?.impressions?.percentage || 0).toFixed(1)}%
- CTR: ${gscData.trends?.ctr?.percentage > 0 ? "+" : ""}${(gscData.trends?.ctr?.percentage || 0).toFixed(1)}%
- Position: ${(gscData.trends?.position?.value || 0) > 0 ? "improved by " : "dropped by "}${Math.abs(gscData.trends?.position?.value || 0).toFixed(1)} positions

TOP KEYWORDS:
${(gscData.queries || [])
  .slice(0, 5)
  .map(
    (q, i) =>
      `${i + 1}. "${q.keyword}" - ${q.clicks} clicks, position ${q.position.toFixed(1)}, CTR ${(q.ctr * 100).toFixed(1)}%`
  )
  .join("\n") || "No keywords data"}

TOP PAGES:
${(gscData.pages || [])
  .slice(0, 3)
  .map(
    (p, i) =>
      `${i + 1}. ${p.page} - ${p.clicks} clicks, position ${p.position.toFixed(1)}`
  )
  .join("\n") || "No pages data"}

Provide exactly 3 insights. Focus on:
1. Quick wins (high impressions but low CTR = improve meta descriptions)
2. Rising/falling keywords or pages
3. Position improvements needed (keywords in positions 8-20 that could reach page 1)

You MUST respond with ONLY a valid JSON array in this exact format, no other text before or after:
[
  {
    "type": "opportunity",
    "title": "Brief title here",
    "description": "Actionable insight with specific data here",
    "priority": "high"
  },
  {
    "type": "recommendation",
    "title": "Brief title here",
    "description": "Actionable insight with specific data here",
    "priority": "medium"
  },
  {
    "type": "anomaly",
    "title": "Brief title here",
    "description": "Actionable insight with specific data here",
    "priority": "low"
  }
]

Rules:
- "type" must be one of: "opportunity", "anomaly", "recommendation"
- "priority" must be one of: "high", "medium", "low"
- "title" should be max 50 characters
- "description" should be max 150 characters and include specific numbers from the data
- Return ONLY the JSON array, nothing else`;

    console.log("Calling Gemini API...");

    // Use Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log("Gemini raw response:", responseText.substring(0, 200) + "...");

    // Parse the AI response
    let insights;
    try {
      // Clean up the response in case it has markdown code blocks
      const cleanedResponse = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      insights = JSON.parse(cleanedResponse);

      // Validate the response structure
      if (!Array.isArray(insights)) {
        throw new Error("Response is not an array");
      }
      
      console.log("Successfully parsed", insights.length, "insights");
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      console.error("Raw response was:", responseText);
      // Return fallback insights if parsing fails
      insights = generateFallbackInsights(gscData);
    }

    // Add IDs and timestamps to insights
    const formattedInsights = insights.slice(0, 3).map((insight: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      website_id: gscData.siteUrl,
      type: validateType(insight.type),
      title: String(insight.title || "SEO Insight").slice(0, 50),
      description: String(insight.description || "Review your SEO performance.").slice(0, 200),
      priority: validatePriority(insight.priority),
      created_at: new Date().toISOString(),
    }));

    console.log("Returning", formattedInsights.length, "formatted insights");

    return NextResponse.json({ 
      insights: formattedInsights,
      source: "gemini",
    });
  } catch (error) {
    console.error("AI insights error:", error);

    // Try to return fallback insights even on error
    try {
      const body = await request.clone().json();
      return NextResponse.json({
        insights: generateFallbackInsights(body),
        source: "error-fallback",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } catch {
      return NextResponse.json({
        error: "Failed to generate insights",
        insights: [],
      });
    }
  }
}

// Validate insight type
function validateType(type: string): "opportunity" | "anomaly" | "recommendation" {
  const validTypes = ["opportunity", "anomaly", "recommendation"];
  return validTypes.includes(type) ? (type as "opportunity" | "anomaly" | "recommendation") : "recommendation";
}

// Validate priority
function validatePriority(priority: string): "high" | "medium" | "low" {
  const validPriorities = ["high", "medium", "low"];
  return validPriorities.includes(priority) ? (priority as "high" | "medium" | "low") : "medium";
}

// Insights for sites with no data
function generateNoDataInsights(siteUrl: string) {
  return [
    {
      id: `no-data-1-${Date.now()}`,
      website_id: siteUrl,
      type: "recommendation" as const,
      title: "Submit Your Sitemap",
      description: "Submit your sitemap.xml to Google Search Console to help Google discover and index your pages faster.",
      priority: "high" as const,
      created_at: new Date().toISOString(),
    },
    {
      id: `no-data-2-${Date.now()}`,
      website_id: siteUrl,
      type: "recommendation" as const,
      title: "Create Quality Content",
      description: "Focus on creating helpful, original content that answers user questions. This is the foundation of good SEO.",
      priority: "medium" as const,
      created_at: new Date().toISOString(),
    },
    {
      id: `no-data-3-${Date.now()}`,
      website_id: siteUrl,
      type: "opportunity" as const,
      title: "Be Patient with New Sites",
      description: "New websites typically take 2-4 weeks to start appearing in search results. Keep creating content!",
      priority: "low" as const,
      created_at: new Date().toISOString(),
    },
  ];
}

// Fallback insights if AI fails
function generateFallbackInsights(data: GSCData) {
  const insights = [];

  // Check for CTR opportunities
  if (data.queries && data.queries.length > 0) {
    const lowCtrKeywords = data.queries.filter(
      (q) => q.ctr < 0.02 && q.impressions > 100
    );
    if (lowCtrKeywords.length > 0) {
      insights.push({
        type: "opportunity",
        title: "Improve Click-Through Rates",
        description: `${lowCtrKeywords.length} keywords have low CTR (<2%). Update meta descriptions to improve clicks.`,
        priority: "high",
      });
    }

    // Check for position improvements
    const nearFirstPage = data.queries.filter(
      (q) => q.position > 10 && q.position < 20
    );
    if (nearFirstPage.length > 0) {
      insights.push({
        type: "recommendation",
        title: "Keywords Near First Page",
        description: `${nearFirstPage.length} keywords are close to page 1. Focus content optimization on these.`,
        priority: "medium",
      });
    }
  }

  // Traffic trend insight
  if (data.trends && data.trends.clicks && data.trends.clicks.percentage !== 0) {
    insights.push({
      type: data.trends.clicks.percentage > 0 ? "opportunity" : "anomaly",
      title:
        data.trends.clicks.percentage > 0
          ? "Traffic Growing"
          : "Traffic Declining",
      description: `Clicks ${data.trends.clicks.percentage > 0 ? "increased" : "decreased"} by ${Math.abs(data.trends.clicks.percentage).toFixed(1)}% this week.`,
      priority: Math.abs(data.trends.clicks.percentage) > 20 ? "high" : "medium",
    });
  }

  // Default insight if we have no data
  if (insights.length === 0) {
    insights.push({
      type: "recommendation",
      title: "Start Tracking Your SEO",
      description:
        "Connect your Google Search Console to get personalized AI insights.",
      priority: "medium",
    });
  }

  return insights.slice(0, 3).map((insight, index) => ({
    id: `fallback-${Date.now()}-${index}`,
    website_id: data.siteUrl || "unknown",
    ...insight,
    created_at: new Date().toISOString(),
  }));
}
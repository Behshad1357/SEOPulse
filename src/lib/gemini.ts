import { GoogleGenerativeAI } from "@google/generative-ai";
import type { SEOMetrics, KeywordData, AIInsight } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateSEOInsights(
  metrics: SEOMetrics,
  keywords: KeywordData[],
  websiteUrl: string
): Promise<Omit<AIInsight, "id" | "website_id" | "created_at">[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const keywordList = keywords
    .slice(0, 10)
    .map((k, i) => {
      const pos = k.position.toFixed(1);
      return i + 1 + ". " + k.keyword + " - Clicks: " + k.clicks + ", Position: " + pos;
    })
    .join("\n");

  const clicksChange = metrics.clicks_change > 0 ? "+" + metrics.clicks_change.toFixed(1) : metrics.clicks_change.toFixed(1);
  const impressionsChange = metrics.impressions_change > 0 ? "+" + metrics.impressions_change.toFixed(1) : metrics.impressions_change.toFixed(1);
  const ctrPercent = (metrics.ctr * 100).toFixed(2);
  const positionAvg = metrics.position.toFixed(1);

  const prompt = "You are an SEO expert. Analyze this SEO data and provide actionable insights.\n\n" +
    "Website: " + websiteUrl + "\n\n" +
    "Metrics (last 28 days):\n" +
    "- Clicks: " + metrics.clicks + " (" + clicksChange + "%)\n" +
    "- Impressions: " + metrics.impressions + " (" + impressionsChange + "%)\n" +
    "- CTR: " + ctrPercent + "%\n" +
    "- Position: " + positionAvg + "\n\n" +
    "Top Keywords:\n" + keywordList + "\n\n" +
    "Provide exactly 3 insights in JSON format:\n" +
    "[\n" +
    "  {\"type\": \"summary\", \"title\": \"Brief title\", \"description\": \"Insight text\", \"priority\": \"medium\"},\n" +
    "  {\"type\": \"recommendation\", \"title\": \"Brief title\", \"description\": \"Insight text\", \"priority\": \"high\"},\n" +
    "  {\"type\": \"opportunity\", \"title\": \"Brief title\", \"description\": \"Insight text\", \"priority\": \"low\"}\n" +
    "]\n\n" +
    "Return ONLY the JSON array.";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const startIndex = text.indexOf("[");
    const endIndex = text.lastIndexOf("]");
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error("No JSON array found");
    }

    const jsonString = text.substring(startIndex, endIndex + 1);
    const insights = JSON.parse(jsonString);
    return insights;
  } catch (error) {
    console.error("Gemini error:", error);

    const topKeyword = keywords.length > 0 ? keywords[0].keyword : "your keywords";

    return [
      {
        type: "summary" as const,
        title: "Performance Summary",
        description: "Your site received " + metrics.clicks + " clicks from " + metrics.impressions + " impressions.",
        priority: "medium" as const,
      },
      {
        type: "recommendation" as const,
        title: "Improve Click-Through Rate",
        description: "Your CTR is " + ctrPercent + "%. Optimize meta titles and descriptions.",
        priority: "high" as const,
      },
      {
        type: "opportunity" as const,
        title: "Focus on Top Keywords",
        description: "Create more content around " + topKeyword + " to increase traffic.",
        priority: "low" as const,
      },
    ];
  }
}
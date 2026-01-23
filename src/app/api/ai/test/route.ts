import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "GEMINI_API_KEY not configured",
        keyExists: false,
      });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Test prompt
    const testPrompt = `You are an SEO expert. Given this sample data:
- Website: example.com
- Clicks: 500
- Impressions: 10000
- CTR: 5%
- Average Position: 15

Provide exactly 2 SEO insights in this JSON format:
[
  {
    "type": "opportunity",
    "title": "Your title here",
    "description": "Your description here",
    "priority": "high"
  }
]

Return ONLY valid JSON array, nothing else.`;

    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the response
    let parsed;
    let parseError = null;
    try {
      const cleaned = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      parseError = e instanceof Error ? e.message : "Parse error";
    }

    return NextResponse.json({
      success: true,
      keyExists: true,
      keyPrefix: process.env.GEMINI_API_KEY.substring(0, 10) + "...",
      rawResponse: text,
      parsed: parsed,
      parseError: parseError,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({
      success: false,
      error: errorMessage,
      keyExists: !!process.env.GEMINI_API_KEY,
    });
  }
}
// src/app/api/ai/insights/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

// Expected CTR by position (industry benchmarks)
const EXPECTED_CTR: Record<number, number> = {
  1: 0.319, 2: 0.246, 3: 0.185, 4: 0.133, 5: 0.095,
  6: 0.068, 7: 0.051, 8: 0.036, 9: 0.028, 10: 0.023,
  11: 0.015, 12: 0.012, 13: 0.010, 14: 0.008, 15: 0.007,
  16: 0.006, 17: 0.005, 18: 0.005, 19: 0.004, 20: 0.004
};

function getExpectedCTR(position: number): number {
  if (position > 100) return 0.0001;
  if (position > 50) return 0.0005;
  if (position > 30) return 0.001;
  if (position > 20) return 0.002;
  const rounded = Math.min(Math.max(Math.round(position), 1), 20);
  return EXPECTED_CTR[rounded] || 0.003;
}

function getPageName(url: string): string {
  if (url === '/' || url.endsWith('.com') || url.endsWith('.com/') || url.endsWith('.digital') || url.endsWith('.digital/')) return 'Homepage';
  const slug = url.split('/').filter(Boolean).pop() || url;
  return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Generate SMART insights based on actual data
function generateDataDrivenInsights(data: GSCData) {
  const insights: any[] = [];
  const domain = (data.siteUrl || '')
    .replace('sc-domain:', '')
    .replace(/https?:\/\//, '')
    .replace(/\/$/, '');

  const { clicks, impressions, ctr, position } = data.totals;
  const queries = data.queries || [];
  const pages = data.pages || [];

  // ============================================
  // 1. POSITION-AWARE CTR ANALYSIS
  // ============================================
  const expectedCTR = getExpectedCTR(position);
  const actualCTR = ctr;
  const ctrRatio = expectedCTR > 0 ? actualCTR / expectedCTR : 0;

  if (impressions > 0) {
    if (position > 50) {
      insights.push({
        id: `insight-position-${Date.now()}`,
        website_id: data.siteUrl,
        type: "anomaly",
        title: "Rankings Need Major Improvement",
        description: `Your average position is ${position.toFixed(1)} (page ${Math.ceil(position / 10)}). At this depth, even great title tags won't get clicks — less than 0.1% of users scroll past page 5. Your #1 priority should be improving content quality and building backlinks to move pages into the top 30.`,
        priority: "high",
        created_at: new Date().toISOString(),
        action_steps: [
          `Your site averages position ${position.toFixed(0)} — focus on content quality over CTR optimization`,
          "Identify your highest-impression pages and make them 2x better than top-ranking competitors",
          "Build internal links between all your pages to distribute authority",
          "Target long-tail keywords (4+ words) that are easier to rank for",
          "Aim to get each page to position 30 or better before worrying about CTR",
        ],
      });
    } else if (position > 20) {
      insights.push({
        id: `insight-position-${Date.now()}`,
        website_id: data.siteUrl,
        type: "opportunity",
        title: `Striking Distance: Push Pages to Page 1-2`,
        description: `Average position ${position.toFixed(1)} means you're on page ${Math.ceil(position / 10)}. You're getting ${impressions} impressions but only ${clicks} clicks (${(actualCTR * 100).toFixed(2)}% CTR). At this position, expected CTR is ~${(expectedCTR * 100).toFixed(2)}%, so your CTR is ${ctrRatio >= 1 ? 'above' : 'below'} average for your ranking.`,
        priority: "high",
        created_at: new Date().toISOString(),
        action_steps: [
          "Focus on moving your best pages from page 3+ to page 1-2",
          "Add 500-1000 words of comprehensive content to each page",
          "Build 3-5 internal links to each important page",
          "Research 'People Also Ask' questions and answer them in your content",
          "Update content with fresh data, examples, and the current year",
        ],
      });
    } else if (position > 10) {
      const potentialClicks = Math.round(impressions * EXPECTED_CTR[8]) - clicks;
      insights.push({
        id: `insight-position-${Date.now()}`,
        website_id: data.siteUrl,
        type: "opportunity",
        title: `Page 2 → Page 1 Could Mean +${Math.max(potentialClicks, 1)} Clicks`,
        description: `Average position ${position.toFixed(1)} (page 2). You're getting ${impressions} impressions but only ${clicks} clicks. Moving to page 1 (position 8) could increase clicks to ~${Math.round(impressions * EXPECTED_CTR[8])}/month.`,
        priority: "high",
        created_at: new Date().toISOString(),
        action_steps: [
          "You're very close to page 1 — small improvements can have big impact",
          "Make your content more comprehensive than the current #1 result",
          "Add FAQ schema markup to get rich snippets",
          "Build 2-3 quality backlinks from relevant sites",
          "Improve page load speed — every second counts at this ranking level",
        ],
      });
    } else {
      insights.push({
        id: `insight-position-${Date.now()}`,
        website_id: data.siteUrl,
        type: ctrRatio < 0.7 ? "anomaly" : "opportunity",
        title: ctrRatio < 0.7 
          ? `Page 1 but CTR Below Average` 
          : `Strong Page 1 Rankings — Optimize CTR`,
        description: `Average position ${position.toFixed(1)} (page 1) with ${(actualCTR * 100).toFixed(2)}% CTR. ${
          ctrRatio < 0.7 
            ? `Expected CTR at this position is ~${(expectedCTR * 100).toFixed(1)}% — yours is ${Math.round((1 - ctrRatio) * 100)}% below average. Improving your title tags and meta descriptions could gain ${Math.round(impressions * (expectedCTR - actualCTR))} more clicks.`
            : `Your CTR is ${ctrRatio >= 1.2 ? 'above' : 'near'} average for this position. Focus on defending rankings and improving weaker pages.`
        }`,
        priority: ctrRatio < 0.7 ? "high" : "medium",
        created_at: new Date().toISOString(),
        action_steps: ctrRatio < 0.7 ? [
          "Your rankings are good but people aren't clicking — your search snippets need work",
          "Rewrite title tags: include keyword + benefit + differentiator (under 60 chars)",
          "Write meta descriptions with a clear value prop and CTA (under 155 chars)",
          "Add FAQ or Review schema for rich snippets that stand out",
          "Check if Google is rewriting your titles — if so, make them more relevant",
        ] : [
          "Great position! Focus on maintaining rankings with regular content updates",
          "Monitor for new competitors entering the top 10",
          "Keep building backlinks slowly and consistently",
          "Update content quarterly with fresh data and examples",
          "Consider expanding to related keywords to grow traffic further",
        ],
      });
    }
  }

  // ============================================
  // 2. PAGE-SPECIFIC OPPORTUNITIES
  // ============================================
  if (pages.length > 0) {
    // Find highest-impression pages that aren't getting clicks
    const wastedPages = pages
      .filter(p => p.impressions > 20 && p.clicks < 2)
      .sort((a, b) => b.impressions - a.impressions);

    if (wastedPages.length > 0) {
      const topWasted = wastedPages[0];
      const pageName = getPageName(topWasted.page);
      
      insights.push({
        id: `insight-wasted-${Date.now()}`,
        website_id: data.siteUrl,
        type: "opportunity",
        title: `"${pageName}" — ${topWasted.impressions} Impressions Wasted`,
        description: `Your page "${pageName}" appears in ${topWasted.impressions} searches at position ${topWasted.position.toFixed(1)} but only gets ${topWasted.clicks} clicks. ${
          topWasted.position > 30 
            ? 'The main issue is ranking position — improve content to rank higher.'
            : 'The issue is your search snippet — improve your title tag and meta description.'
        }`,
        priority: "high",
        created_at: new Date().toISOString(),
        action_steps: topWasted.position > 30 ? [
          `"${pageName}" gets impressions but ranks at position ${topWasted.position.toFixed(0)} — too deep for clicks`,
          "Research the top 3 results for this keyword and identify content gaps",
          `Expand the article to cover all subtopics (aim for 2000+ words)`,
          "Add a FAQ section targeting 'People Also Ask' questions",
          "Build 3+ internal links from your other pages to this one",
          "Consider if you're targeting the right keyword — maybe a long-tail variant is better",
        ] : [
          `"${pageName}" ranks at position ${topWasted.position.toFixed(0)} but gets zero clicks — your search snippet needs work`,
          "Write a new title tag: Primary Keyword + Benefit (under 60 characters)",
          "Write a meta description that answers 'why should I click this?' (under 155 characters)",
          "Add structured data (FAQ, HowTo, or Article schema) for rich snippets",
          "Check Google to see what your listing looks like vs competitors",
        ],
      });
    }

    // Find best performing page
    const bestPage = pages
      .filter(p => p.clicks > 0)
      .sort((a, b) => b.clicks - a.clicks)[0];

    if (bestPage) {
      const bestPageName = getPageName(bestPage.page);
      insights.push({
        id: `insight-best-${Date.now()}`,
        website_id: data.siteUrl,
        type: "recommendation",
        title: `Double Down on "${bestPageName}"`,
        description: `"${bestPageName}" is your best performer with ${bestPage.clicks} clicks from ${bestPage.impressions} impressions (${(bestPage.ctr * 100).toFixed(2)}% CTR) at position ${bestPage.position.toFixed(1)}. ${
          bestPage.position > 10
            ? `Moving to top 10 could dramatically increase clicks — page 1 results get 95% of all clicks.`
            : `This page is working well. Create related content to build a topic cluster around it.`
        }`,
        priority: "medium",
        created_at: new Date().toISOString(),
        action_steps: bestPage.position > 10 ? [
          `"${bestPageName}" already gets clicks at position ${bestPage.position.toFixed(0)} — imagine it on page 1`,
          "This is your highest-ROI page to improve right now",
          "Add 500+ words of unique, comprehensive content",
          "Build 3-5 internal links from other pages using keyword-rich anchor text",
          "Try to get 1-2 backlinks from relevant external sites",
        ] : [
          `"${bestPageName}" is your star performer — protect and expand it`,
          "Create 3-5 related blog posts that link back to this page",
          "Keep the content updated monthly with fresh data",
          "Add FAQ schema if not already present",
          "Target related long-tail keywords in supporting articles",
        ],
      });
    }
  }

  // ============================================
  // 3. KEYWORD OPPORTUNITIES (EXPANDED RANGE)
  // ============================================
  if (queries.length > 0) {
    // Quick wins: positions 8-30 (not just 8-20)
    const quickWins = queries
      .filter(q => q.position >= 8 && q.position <= 30 && q.impressions >= 5)
      .sort((a, b) => b.impressions - a.impressions);

    // Striking distance: positions 30-60
    const strikingDistance = queries
      .filter(q => q.position > 30 && q.position <= 60 && q.impressions > 10)
      .sort((a, b) => b.impressions - a.impressions);

    // High impression keywords regardless of position
    const highImpression = queries
      .filter(q => q.impressions > 50)
      .sort((a, b) => b.impressions - a.impressions);

    if (quickWins.length > 0) {
      const topQuickWin = quickWins[0];
      const potentialClicks = Math.round(topQuickWin.impressions * EXPECTED_CTR[5]) - topQuickWin.clicks;
      insights.push({
        id: `insight-quickwin-${Date.now()}`,
        website_id: data.siteUrl,
        type: "opportunity",
        title: `Quick Win: "${topQuickWin.keyword}" at Position ${topQuickWin.position.toFixed(0)}`,
        description: `"${topQuickWin.keyword}" ranks at position ${topQuickWin.position.toFixed(1)} with ${topQuickWin.impressions} impressions and ${topQuickWin.clicks} clicks. ${
          topQuickWin.position <= 15
            ? `Moving to top 5 could gain ~${Math.max(potentialClicks, 1)} more clicks/month.`
            : `Getting to page 1 should be the priority for this keyword.`
        }${quickWins.length > 1 ? ` Plus ${quickWins.length - 1} more keywords in striking distance.` : ''}`,
        priority: "high",
        created_at: new Date().toISOString(),
        action_steps: [
          `"${topQuickWin.keyword}" is your best quick win — it's already on page ${Math.ceil(topQuickWin.position / 10)}`,
          "Ensure this exact keyword appears in your title tag, H1, and first paragraph",
          "Answer the search intent completely — what does someone searching this want?",
          "Add related keywords naturally throughout the content",
          `${quickWins.length > 1 ? `You have ${quickWins.length} keywords in positions 8-30 — prioritize by impressions` : 'Focus all internal linking efforts on this keyword'}`,
        ],
      });
    } else if (strikingDistance.length > 0) {
      const topStriking = strikingDistance[0];
      insights.push({
        id: `insight-striking-${Date.now()}`,
        website_id: data.siteUrl,
        type: "opportunity",
        title: `Potential: "${topStriking.keyword}" at Position ${topStriking.position.toFixed(0)}`,
        description: `"${topStriking.keyword}" gets ${topStriking.impressions} impressions at position ${topStriking.position.toFixed(1)}. It's not on page 1 yet, but Google clearly considers your content relevant. Improving content quality could push this to page 1-2.`,
        priority: "medium",
        created_at: new Date().toISOString(),
        action_steps: [
          `"${topStriking.keyword}" ranks at position ${topStriking.position.toFixed(0)} — needs content improvement to reach page 1`,
          "Search this keyword in Google and study the top 3 results",
          "Identify what topics, sections, or data they cover that your page doesn't",
          "Expand your content to be the most comprehensive result",
          "Add FAQ section and schema markup",
        ],
      });
    } else if (highImpression.length > 0) {
      const topKeyword = highImpression[0];
      insights.push({
        id: `insight-keyword-${Date.now()}`,
        website_id: data.siteUrl,
        type: "recommendation",
        title: `Focus Keyword: "${topKeyword.keyword}"`,
        description: `Your highest-impression keyword "${topKeyword.keyword}" gets ${topKeyword.impressions} impressions at position ${topKeyword.position.toFixed(1)}. This keyword has search demand — make it your priority content to improve.`,
        priority: "medium",
        created_at: new Date().toISOString(),
        action_steps: [
          `"${topKeyword.keyword}" is your highest-demand keyword — focus here first`,
          "Create or improve a dedicated page targeting this exact keyword",
          "Make it the most comprehensive resource on this topic",
          "Build internal links from every relevant page on your site",
          "Monitor position weekly to track improvement",
        ],
      });
    }
  }

  // ============================================
  // 4. TREND ANALYSIS
  // ============================================
  if (data.trends) {
    const clicksTrend = data.trends.clicks?.percentage || 0;
    const impressionsTrend = data.trends.impressions?.percentage || 0;

    if (clicksTrend < -20) {
      insights.push({
        id: `insight-trend-${Date.now()}`,
        website_id: data.siteUrl,
        type: "anomaly",
        title: `⚠️ Traffic Drop: Clicks Down ${Math.abs(clicksTrend).toFixed(0)}%`,
        description: `Your clicks dropped ${Math.abs(clicksTrend).toFixed(1)}% compared to the previous period. ${
          impressionsTrend < -10
            ? `Impressions also dropped ${Math.abs(impressionsTrend).toFixed(1)}% — this suggests ranking losses.`
            : `But impressions are stable — this suggests a CTR problem, not a ranking problem.`
        }`,
        priority: "high",
        created_at: new Date().toISOString(),
        action_steps: impressionsTrend < -10 ? [
          "Check Google Search Console for any manual actions or security issues",
          "Look for specific pages or keywords that lost rankings",
          "Check if a Google algorithm update happened recently",
          "Review if any content was accidentally removed or changed",
          "Check for technical issues: site speed, crawl errors, broken pages",
        ] : [
          "Impressions are stable but clicks are down — your search snippets are the issue",
          "Check if Google changed your title tags (they sometimes rewrite them)",
          "Review your meta descriptions for the pages losing clicks",
          "Check if competitors added rich snippets that push your listing down",
          "Consider if search intent shifted — does your content still match what people want?",
        ],
      });
    } else if (clicksTrend > 20) {
      insights.push({
        id: `insight-trend-${Date.now()}`,
        website_id: data.siteUrl,
        type: "opportunity",
        title: `📈 Traffic Growing: Clicks Up ${clicksTrend.toFixed(0)}%`,
        description: `Great news — clicks increased by ${clicksTrend.toFixed(1)}% compared to last period. ${
          impressionsTrend > 10
            ? `Impressions also grew ${impressionsTrend.toFixed(1)}% — your content is gaining visibility.`
            : `Even though impressions are flat, more people are clicking — your snippets are working.`
        }`,
        priority: "medium",
        created_at: new Date().toISOString(),
        action_steps: [
          "Momentum is on your side — now is the time to publish more content",
          "Identify which pages/keywords drove the growth and create related content",
          "Build on what's working: analyze your best-performing titles and descriptions",
          "Set up a regular content publishing schedule to maintain growth",
          "Consider creating a content cluster around your growing topics",
        ],
      });
    }
  }

  // ============================================
  // 5. SITE-SPECIFIC FOUNDATION ADVICE
  // ============================================
  if (clicks < 10) {
    insights.push({
      id: `insight-foundation-${Date.now()}`,
      website_id: data.siteUrl,
      type: "recommendation",
      title: "Build Your SEO Foundation",
      description: `${domain} is in the early growth stage with ${clicks} total clicks and ${impressions} impressions. This is normal for newer sites. Focus on these fundamentals before advanced tactics.`,
      priority: "high",
      created_at: new Date().toISOString(),
      action_steps: [
        "Submit your sitemap.xml to Google Search Console (Settings → Sitemaps)",
        "Make sure every page has a unique, keyword-focused title tag under 60 characters",
        "Write meta descriptions for all pages (under 155 characters with a CTA)",
        `Create 5-10 blog posts targeting keywords related to ${domain}'s niche`,
        "Interlink all your pages — every blog post should link to 2-3 other pages",
        "Set up Google Business Profile if you serve a local area",
        "Publish 1-2 new pieces of content per week consistently",
      ],
    });
  }

  // Sort: high priority first
  insights.sort((a: any, b: any) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return (priorityOrder[a.priority as keyof typeof priorityOrder] || 1) - 
           (priorityOrder[b.priority as keyof typeof priorityOrder] || 1);
  });

  return insights.slice(0, 6);
}

export async function POST(request: Request) {
  console.log("=== AI Insights API Called ===");

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const gscData: GSCData = await request.json();

    console.log("GSC Data received:", {
      siteUrl: gscData.siteUrl,
      clicks: gscData.totals?.clicks,
      impressions: gscData.totals?.impressions,
      position: gscData.totals?.position,
      queriesCount: gscData.queries?.length,
      pagesCount: gscData.pages?.length,
    });

    // If no data at all, return basic starter insights
    if (!gscData.totals || (gscData.totals.clicks === 0 && gscData.totals.impressions === 0)) {
      return NextResponse.json({
        insights: generateNoDataInsights(gscData.siteUrl),
        source: "no-data",
      });
    }

    // Generate data-driven insights (no AI needed for most cases)
    const smartInsights = generateDataDrivenInsights(gscData);

    // If we have enough data AND Gemini key, enhance with AI
    if (
      process.env.GEMINI_API_KEY &&
      gscData.totals.clicks >= 50 &&
      gscData.totals.impressions >= 500
    ) {
      try {
        const aiInsight = await getGeminiInsight(gscData);
        if (aiInsight) {
          // Add AI insight to the beginning
          smartInsights.unshift(aiInsight);
        }
      } catch (aiError) {
        console.error("Gemini error (non-critical):", aiError);
        // Continue with data-driven insights
      }
    }

    return NextResponse.json({
      insights: smartInsights.slice(0, 6),
      source: gscData.totals.clicks >= 50 ? "ai-enhanced" : "data-driven",
    });
  } catch (error) {
    console.error("AI insights error:", error);
    return NextResponse.json({
      error: "Failed to generate insights",
      insights: [],
    });
  }
}

// Gemini enhancement for high-traffic sites
async function getGeminiInsight(data: GSCData) {
  if (!process.env.GEMINI_API_KEY) return null;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are an expert SEO consultant. Analyze this data and give ONE unique, specific, highly actionable insight that a data algorithm might miss.

Website: ${data.siteUrl}
Clicks: ${data.totals.clicks} | Impressions: ${data.totals.impressions}
CTR: ${(data.totals.ctr * 100).toFixed(2)}% | Avg Position: ${data.totals.position.toFixed(1)}

Top keywords: ${data.queries.slice(0, 5).map(q => `"${q.keyword}" (pos ${q.position.toFixed(1)}, ${q.impressions} imp)`).join(', ')}

Top pages: ${data.pages.slice(0, 3).map(p => `${p.page} (pos ${p.position.toFixed(1)}, ${p.impressions} imp)`).join(', ')}

Trends: Clicks ${data.trends?.clicks?.percentage > 0 ? '+' : ''}${(data.trends?.clicks?.percentage || 0).toFixed(1)}% | Impressions ${data.trends?.impressions?.percentage > 0 ? '+' : ''}${(data.trends?.impressions?.percentage || 0).toFixed(1)}%

Respond with ONLY valid JSON:
{
  "title": "Brief, specific title (max 60 chars)",
  "description": "Detailed, actionable insight referencing specific keywords/pages from the data (200-300 chars)",
  "priority": "high",
  "action_steps": ["step 1", "step 2", "step 3"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(text);

    return {
      id: `ai-gemini-${Date.now()}`,
      website_id: data.siteUrl,
      type: "recommendation" as const,
      title: `🤖 ${String(parsed.title || 'AI Insight').slice(0, 60)}`,
      description: String(parsed.description || '').slice(0, 400),
      priority: "high" as const,
      created_at: new Date().toISOString(),
      action_steps: Array.isArray(parsed.action_steps) ? parsed.action_steps.slice(0, 5) : [],
    };
  } catch (e) {
    console.error("Gemini parse error:", e);
    return null;
  }
}

function generateNoDataInsights(siteUrl: string) {
  const domain = (siteUrl || '')
    .replace('sc-domain:', '')
    .replace(/https?:\/\//, '');

  return [
    {
      id: `no-data-1-${Date.now()}`,
      website_id: siteUrl,
      type: "recommendation" as const,
      title: "Submit Your Sitemap to Google",
      description: `${domain} has no search data yet. The first step is making sure Google can find your pages. Go to Google Search Console → Sitemaps → submit your sitemap.xml URL.`,
      priority: "high" as const,
      created_at: new Date().toISOString(),
      action_steps: [
        "Go to Google Search Console",
        "Click 'Sitemaps' in the left menu",
        "Enter your sitemap URL (usually yourdomain.com/sitemap.xml)",
        "Click Submit and wait 24-48 hours for Google to process it",
                "Check back in the 'Pages' report to see which pages Google has indexed",
      ],
    },
    {
      id: `no-data-2-${Date.now()}`,
      website_id: siteUrl,
      type: "recommendation" as const,
      title: "Create Your First 5 Pages of Content",
      description: `Google needs content to rank. Create at least 5 high-quality pages targeting specific keywords your audience searches for. Each page should be 1500+ words and focused on one topic.`,
      priority: "high" as const,
      created_at: new Date().toISOString(),
      action_steps: [
        "Research 5 keywords your target audience searches for (use Google autocomplete)",
        "Create one comprehensive page for each keyword",
        "Make each page 1500+ words with clear H1, H2 subheadings",
        "Include your target keyword in the title, H1, first paragraph, and meta description",
        "Interlink all pages to each other naturally",
      ],
    },
    {
      id: `no-data-3-${Date.now()}`,
      website_id: siteUrl,
      type: "opportunity" as const,
      title: "New Sites Take 2-8 Weeks to Appear",
      description: `It's normal for new sites to have no data initially. Google needs time to discover, crawl, and index your pages. Focus on creating great content and the traffic will come.`,
      priority: "low" as const,
      created_at: new Date().toISOString(),
      action_steps: [
        "Use 'URL Inspection' in GSC to manually request indexing for important pages",
        "Share your content on social media to help Google discover it faster",
        "Make sure your site loads fast (test at pagespeed.web.dev)",
        "Be patient — most sites see first impressions within 2-4 weeks",
        "Check back weekly to monitor progress",
      ],
    },
  ];
}
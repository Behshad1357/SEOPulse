// src/app/api/analyze-pages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

interface PageData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface PageIssue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'ctr' | 'ranking' | 'content' | 'technical' | 'opportunity';
  title: string;
  description: string;
  current: string;
  recommendation: string;
  impact: number;
  fixTime: 'quick' | 'medium' | 'long';
}

interface PageOpportunity {
  id: string;
  type: 'quick_win' | 'growth' | 'maintain';
  title: string;
  description: string;
  potentialClicks: number;
  effort: 'low' | 'medium' | 'high';
}

// Admin client for bypassing RLS
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );
}

// Industry-standard CTR by position
const EXPECTED_CTR: Record<number, number> = {
  1: 0.319, 2: 0.246, 3: 0.185, 4: 0.133, 5: 0.095,
  6: 0.068, 7: 0.051, 8: 0.036, 9: 0.028, 10: 0.023,
  11: 0.015, 12: 0.012, 13: 0.010, 14: 0.008, 15: 0.007,
  16: 0.006, 17: 0.005, 18: 0.005, 19: 0.004, 20: 0.004
};

function getExpectedCTR(position: number): number {
  const roundedPos = Math.min(Math.max(Math.round(position), 1), 20);
  return EXPECTED_CTR[roundedPos] || 0.003;
}

function generatePageId(): string {
  return `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function analyzePageSEO(page: PageData): {
  score: number;
  issues: PageIssue[];
  opportunities: PageOpportunity[];
  metrics: any;
} {
  const issues: PageIssue[] = [];
  const opportunities: PageOpportunity[] = [];
  let score = 100;

  const expectedCTR = getExpectedCTR(page.position);
  const actualCTR = page.ctr;
  const ctrRatio = expectedCTR > 0 ? actualCTR / expectedCTR : 0;
  const ctrGap = expectedCTR - actualCTR;

  // ========== CTR Analysis ==========
  if (ctrRatio < 0.4 && page.impressions > 100) {
    issues.push({
      id: generatePageId(),
      type: 'critical',
      category: 'ctr',
      title: 'Critical: CTR severely underperforming',
      description: `Your page is getting ${page.impressions} impressions but only ${page.clicks} clicks. At position ${page.position.toFixed(1)}, you should be getting ~${(expectedCTR * 100).toFixed(1)}% CTR, but you're at ${(actualCTR * 100).toFixed(2)}%.`,
      current: `${(actualCTR * 100).toFixed(2)}% CTR`,
      recommendation: 'Rewrite your title tag with power words (e.g., "Ultimate", "2026", numbers). Add emotional triggers or brackets [Updated] to stand out.',
      impact: 10,
      fixTime: 'quick'
    });
    score -= 30;

    const potentialCTR = expectedCTR * 0.8;
    const potentialClicks = Math.round(page.impressions * potentialCTR) - page.clicks;
    if (potentialClicks > 0) {
      opportunities.push({
        id: generatePageId(),
        type: 'quick_win',
        title: `Gain ~${potentialClicks} more clicks/month`,
        description: `By improving your title and meta description to industry-average CTR, you could gain approximately ${potentialClicks} additional clicks.`,
        potentialClicks,
        effort: 'low'
      });
    }
  } else if (ctrRatio < 0.7 && page.impressions > 50) {
    issues.push({
      id: generatePageId(),
      type: 'warning',
      category: 'ctr',
      title: 'Below average click-through rate',
      description: `Your CTR of ${(actualCTR * 100).toFixed(2)}% is below the expected ${(expectedCTR * 100).toFixed(1)}% for position ${page.position.toFixed(1)}.`,
      current: `${(actualCTR * 100).toFixed(2)}% CTR`,
      recommendation: 'Test a new meta description with a clear value proposition. Include a call-to-action like "Learn how" or "Discover".',
      impact: 7,
      fixTime: 'quick'
    });
    score -= 15;
  } else if (ctrRatio >= 1.2) {
    opportunities.push({
      id: generatePageId(),
      type: 'maintain',
      title: 'Excellent CTR - maintain this!',
      description: `Your CTR of ${(actualCTR * 100).toFixed(2)}% is ${Math.round((ctrRatio - 1) * 100)}% above average. Your title/description is working well.`,
      potentialClicks: 0,
      effort: 'low'
    });
  }

  // ========== Position Analysis ==========
  if (page.position >= 4 && page.position <= 10 && page.impressions > 200) {
    issues.push({
      id: generatePageId(),
      type: 'warning',
      category: 'ranking',
      title: 'Ranking on page 1 but below the fold',
      description: `Position ${page.position.toFixed(1)} means users have to scroll to find you. Moving to top 3 could 3x your clicks.`,
      current: `Position ${page.position.toFixed(1)}`,
      recommendation: 'Add 500+ words of comprehensive content. Build 2-3 internal links from high-authority pages. Get 1 quality backlink.',
      impact: 8,
      fixTime: 'medium'
    });
    score -= 10;

    const top3CTR = EXPECTED_CTR[3];
    const potentialClicks = Math.round(page.impressions * top3CTR) - page.clicks;
    if (potentialClicks > 5) {
      opportunities.push({
        id: generatePageId(),
        type: 'growth',
        title: `Move to top 3: +${potentialClicks} potential clicks`,
        description: `If you can improve from position ${page.position.toFixed(1)} to top 3, you could gain ~${potentialClicks} more clicks.`,
        potentialClicks,
        effort: 'medium'
      });
    }
  } else if (page.position > 10 && page.position <= 20 && page.impressions > 100) {
    issues.push({
      id: generatePageId(),
      type: 'critical',
      category: 'ranking',
      title: 'Page 2 ranking - almost there!',
      description: `At position ${page.position.toFixed(1)}, you're on page 2. Only 0.63% of users click on page 2 results. You need to reach page 1.`,
      current: `Position ${page.position.toFixed(1)} (Page 2)`,
      recommendation: 'This page needs significant content improvement. Analyze top 3 competitors and add what they cover that you don\'t. Build 3-5 quality backlinks.',
      impact: 9,
      fixTime: 'long'
    });
    score -= 25;
  } else if (page.position > 20) {
    issues.push({
      id: generatePageId(),
      type: 'info',
      category: 'ranking',
      title: 'Low ranking - needs major work',
      description: `Position ${page.position.toFixed(1)} means almost no organic visibility. Consider if this keyword is worth pursuing.`,
      current: `Position ${page.position.toFixed(1)}`,
      recommendation: 'Either heavily invest in this page (rewrite, get backlinks) or redirect it to a stronger page on the same topic.',
      impact: 5,
      fixTime: 'long'
    });
    score -= 15;
  } else if (page.position <= 3 && page.impressions > 100) {
    opportunities.push({
      id: generatePageId(),
      type: 'maintain',
      title: 'Top 3 ranking - protect this position',
      description: `Position ${page.position.toFixed(1)} is excellent. Focus on maintaining this ranking and optimizing CTR.`,
      potentialClicks: 0,
      effort: 'low'
    });
  }

  // ========== High Impressions, Low Clicks ==========
  if (page.impressions > 500 && page.clicks < 5) {
    issues.push({
      id: generatePageId(),
      type: 'critical',
      category: 'opportunity',
      title: 'Massive untapped potential',
      description: `${page.impressions.toLocaleString()} impressions but only ${page.clicks} clicks! Your listing is appearing but not compelling users to click.`,
      current: `${page.impressions} impressions → ${page.clicks} clicks`,
      recommendation: 'Your title/meta are failing. Try these formulas: "How to [X] in 2026", "[Number] Best [X] (Tested)", "The Complete Guide to [X]"',
      impact: 10,
      fixTime: 'quick'
    });
    score -= 20;
  }

  // ========== Low Impressions Analysis ==========
  if (page.impressions < 50 && page.position < 20) {
    issues.push({
      id: generatePageId(),
      type: 'info',
      category: 'content',
      title: 'Low search volume keyword',
      description: `Only ${page.impressions} impressions suggests low search demand for this page's target keyword.`,
      current: `${page.impressions} monthly impressions`,
      recommendation: 'Research related keywords with higher volume. Consider expanding the page to target multiple related queries.',
      impact: 4,
      fixTime: 'medium'
    });
    score -= 5;
  }

  // ========== Quick Win Detection ==========
  if (page.position >= 8 && page.position <= 15 && page.impressions > 300 && ctrRatio < 0.8) {
    opportunities.push({
      id: generatePageId(),
      type: 'quick_win',
      title: 'Quick win: Title tag optimization',
      description: `A better title tag alone could boost CTR by 20-30% and potentially improve rankings. This is the highest-ROI fix for this page.`,
      potentialClicks: Math.round(page.clicks * 0.25),
      effort: 'low'
    });
  }

  score = Math.max(0, Math.min(100, score));
  issues.sort((a, b) => b.impact - a.impact);

  return {
    score,
    issues: issues.slice(0, 5),
    opportunities: opportunities.slice(0, 3),
    metrics: {
      clicks: page.clicks,
      impressions: page.impressions,
      ctr: page.ctr,
      position: page.position,
      expectedCtr: expectedCTR,
      ctrGap
    }
  };
}

async function getUserFromCookies(): Promise<{ userId: string; plan: string } | null> {
  try {
    const cookieStore = await cookies();
    
    // Try different cookie names that Supabase might use
    const possibleCookieNames = [
      'sb-egislyqtbkxqbbtjcktv-auth-token',
      'supabase-auth-token',
      'sb-access-token'
    ];
    
    for (const cookieName of possibleCookieNames) {
      const sessionCookie = cookieStore.get(cookieName)?.value;
      if (sessionCookie) {
        try {
          const session = JSON.parse(sessionCookie);
          const userId = session?.user?.id || session?.[0]?.user?.id;
          if (userId) {
            // Get user plan from database
            const adminClient = createAdminClient();
            const { data: profile } = await adminClient
              .from('profiles')
              .select('plan')
              .eq('id', userId)
              .single();
            
            return {
              userId,
              plan: profile?.plan || 'free'
            };
          }
        } catch (e) {
          // Continue to next cookie
          continue;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user from cookies:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const userInfo = await getUserFromCookies();
    
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pages, websiteId, siteUrl } = await req.json();

    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json({ error: "No pages data provided" }, { status: 400 });
    }

    const pageLimit = userInfo.plan === 'free' ? 5 : userInfo.plan === 'pro' ? 50 : 500;
    const pagesToAnalyze = pages.slice(0, pageLimit);
    
    const analyzedPages = pagesToAnalyze.map((page: PageData) => {
      const analysis = analyzePageSEO(page);
      return {
        website_id: websiteId,
        user_id: userInfo.userId,
        page_url: page.page,
        score: analysis.score,
        issues: analysis.issues,
        opportunities: analysis.opportunities,
        metrics: analysis.metrics,
        last_analyzed: new Date().toISOString()
      };
    });

    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('page_scores')
      .upsert(analyzedPages, { 
        onConflict: 'website_id,page_url',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: "Failed to save page scores" }, { status: 500 });
    }

    const summary = {
      totalPages: analyzedPages.length,
      avgScore: Math.round(analyzedPages.reduce((acc, p) => acc + p.score, 0) / analyzedPages.length),
      criticalIssues: analyzedPages.reduce((acc, p) => 
        acc + p.issues.filter((i: PageIssue) => i.type === 'critical').length, 0),
      quickWins: analyzedPages.reduce((acc, p) => 
        acc + p.opportunities.filter((o: PageOpportunity) => o.type === 'quick_win').length, 0),
      potentialClicks: analyzedPages.reduce((acc, p) => 
        acc + p.opportunities.reduce((sum: number, o: PageOpportunity) => sum + o.potentialClicks, 0), 0),
      limitReached: pages.length > pageLimit,
      analyzedCount: pagesToAnalyze.length,
      totalAvailable: pages.length
    };

    return NextResponse.json({ 
      success: true, 
      pages: data,
      summary,
      plan: userInfo.plan
    });

  } catch (error) {
    console.error('Error analyzing pages:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userInfo = await getUserFromCookies();
    
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: "Website ID required" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    
    const { data, error } = await adminClient
      .from('page_scores')
      .select('*')
      .eq('website_id', websiteId)
      .eq('user_id', userInfo.userId)
      .order('score', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: "Failed to fetch page scores" }, { status: 500 });
    }

    return NextResponse.json({ pages: data || [] });

  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
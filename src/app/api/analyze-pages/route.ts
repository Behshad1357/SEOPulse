// src/app/api/analyze-pages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

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
  category: string;
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

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function analyzePageSEO(page: PageData) {
  const issues: PageIssue[] = [];
  const opportunities: PageOpportunity[] = [];
  let score = 100;

  const expectedCTR = getExpectedCTR(page.position);
  const actualCTR = page.ctr;
  const ctrRatio = expectedCTR > 0 ? actualCTR / expectedCTR : 0;
  const ctrGap = expectedCTR - actualCTR;

  // CTR Analysis
  if (ctrRatio < 0.4 && page.impressions > 100) {
    issues.push({
      id: generateId(),
      type: 'critical',
      category: 'ctr',
      title: 'Critical: CTR severely underperforming',
      description: `Getting ${page.impressions} impressions but only ${page.clicks} clicks. Expected ~${(expectedCTR * 100).toFixed(1)}% CTR at position ${page.position.toFixed(1)}, but actual is ${(actualCTR * 100).toFixed(2)}%.`,
      current: `${(actualCTR * 100).toFixed(2)}% CTR`,
      recommendation: 'Rewrite title tag with power words. Add year, numbers, or brackets [Updated 2026] to stand out.',
      impact: 10,
      fixTime: 'quick'
    });
    score -= 30;

    const potentialClicks = Math.round(page.impressions * expectedCTR * 0.8) - page.clicks;
    if (potentialClicks > 0) {
      opportunities.push({
        id: generateId(),
        type: 'quick_win',
        title: `Gain ~${potentialClicks} more clicks/month`,
        description: `Improving title/meta to average CTR could gain ${potentialClicks} clicks.`,
        potentialClicks,
        effort: 'low'
      });
    }
  } else if (ctrRatio < 0.7 && page.impressions > 50) {
    issues.push({
      id: generateId(),
      type: 'warning',
      category: 'ctr',
      title: 'Below average click-through rate',
      description: `CTR of ${(actualCTR * 100).toFixed(2)}% is below expected ${(expectedCTR * 100).toFixed(1)}%.`,
      current: `${(actualCTR * 100).toFixed(2)}% CTR`,
      recommendation: 'Test a new meta description with clear value proposition and call-to-action.',
      impact: 7,
      fixTime: 'quick'
    });
    score -= 15;
  } else if (ctrRatio >= 1.2) {
    opportunities.push({
      id: generateId(),
      type: 'maintain',
      title: 'Excellent CTR - keep it up!',
      description: `CTR is ${Math.round((ctrRatio - 1) * 100)}% above average.`,
      potentialClicks: 0,
      effort: 'low'
    });
  }

  // Position Analysis
  if (page.position >= 4 && page.position <= 10 && page.impressions > 200) {
    issues.push({
      id: generateId(),
      type: 'warning',
      category: 'ranking',
      title: 'Page 1 but below the fold',
      description: `Position ${page.position.toFixed(1)} means users must scroll. Top 3 could 3x clicks.`,
      current: `Position ${page.position.toFixed(1)}`,
      recommendation: 'Add 500+ words of content. Build 2-3 internal links. Get 1 quality backlink.',
      impact: 8,
      fixTime: 'medium'
    });
    score -= 10;

    const potentialClicks = Math.round(page.impressions * EXPECTED_CTR[3]) - page.clicks;
    if (potentialClicks > 5) {
      opportunities.push({
        id: generateId(),
        type: 'growth',
        title: `Move to top 3: +${potentialClicks} clicks`,
        description: `Improving to top 3 could gain ~${potentialClicks} more clicks.`,
        potentialClicks,
        effort: 'medium'
      });
    }
  } else if (page.position > 10 && page.position <= 20 && page.impressions > 100) {
    issues.push({
      id: generateId(),
      type: 'critical',
      category: 'ranking',
      title: 'Page 2 - almost there!',
      description: `Position ${page.position.toFixed(1)} (page 2). Only 0.63% of users click page 2 results.`,
      current: `Position ${page.position.toFixed(1)} (Page 2)`,
      recommendation: 'Significant content improvement needed. Analyze top 3 competitors. Build 3-5 backlinks.',
      impact: 9,
      fixTime: 'long'
    });
    score -= 25;
  } else if (page.position > 20) {
    issues.push({
      id: generateId(),
      type: 'info',
      category: 'ranking',
      title: 'Low ranking - needs major work',
      description: `Position ${page.position.toFixed(1)} has almost no visibility.`,
      current: `Position ${page.position.toFixed(1)}`,
      recommendation: 'Either heavily invest in this page or redirect to a stronger page.',
      impact: 5,
      fixTime: 'long'
    });
    score -= 15;
  } else if (page.position <= 3 && page.impressions > 100) {
    opportunities.push({
      id: generateId(),
      type: 'maintain',
      title: 'Top 3 ranking - protect it!',
      description: `Position ${page.position.toFixed(1)} is excellent. Focus on maintaining.`,
      potentialClicks: 0,
      effort: 'low'
    });
  }

  // High impressions, low clicks
  if (page.impressions > 500 && page.clicks < 5) {
    issues.push({
      id: generateId(),
      type: 'critical',
      category: 'opportunity',
      title: 'Massive untapped potential',
      description: `${page.impressions.toLocaleString()} impressions but only ${page.clicks} clicks!`,
      current: `${page.impressions} impressions → ${page.clicks} clicks`,
      recommendation: 'Title/meta failing badly. Try: "How to [X] in 2026" or "[Number] Best [X]"',
      impact: 10,
      fixTime: 'quick'
    });
    score -= 20;
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

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = getAdminClient();
    
    // Get user plan
    const { data: profile } = await adminClient
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    const plan = profile?.plan || 'free';

    const { pages, websiteId, siteUrl } = await req.json();

    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json({ error: "No pages data provided" }, { status: 400 });
    }

    if (!websiteId) {
      return NextResponse.json({ error: "Website ID required" }, { status: 400 });
    }

    const pageLimit = plan === 'free' ? 5 : plan === 'pro' ? 50 : 500;
    const pagesToAnalyze = pages.slice(0, pageLimit);
    
    const analyzedPages = pagesToAnalyze.map((page: PageData) => {
      const analysis = analyzePageSEO(page);
      return {
        website_id: websiteId,
        user_id: user.id,
        page_url: page.page,
        score: analysis.score,
        issues: analysis.issues,
        opportunities: analysis.opportunities,
        metrics: analysis.metrics,
        last_analyzed: new Date().toISOString()
      };
    });

    const { data, error } = await adminClient
      .from('page_scores')
      .upsert(analyzedPages, { 
        onConflict: 'website_id,page_url',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: "Failed to save page scores", details: error.message }, { status: 500 });
    }

    const summary = {
      totalPages: analyzedPages.length,
      avgScore: Math.round(analyzedPages.reduce((acc, p) => acc + p.score, 0) / analyzedPages.length),
      criticalIssues: analyzedPages.reduce((acc, p) => 
        acc + p.issues.filter((i: PageIssue) => i.type === 'critical').length, 0),
      quickWins: analyzedPages.reduce((acc, p) => 
        acc + p.opportunities.filter((o: PageOpportunity) => o.type === 'quick_win').length, 0),
      potentialClicks: analyzedPages.reduce((acc, p) => 
        acc + p.opportunities.reduce((sum, o: PageOpportunity) => sum + o.potentialClicks, 0), 0),
    };

    return NextResponse.json({ success: true, pages: data, summary, plan });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: "Website ID required" }, { status: 400 });
    }

    const adminClient = getAdminClient();
    
    const { data, error } = await adminClient
      .from('page_scores')
      .select('*')
      .eq('website_id', websiteId)
      .eq('user_id', user.id)
      .order('score', { ascending: true });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch page scores" }, { status: 500 });
    }

    return NextResponse.json({ pages: data || [] });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
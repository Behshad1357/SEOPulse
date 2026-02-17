// src/app/api/analyze-pages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getEffectivePlan } from '@/lib/admin-users';

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

// Extended expected CTR benchmarks (industry average from Advanced Web Ranking)
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
  const roundedPos = Math.min(Math.max(Math.round(position), 1), 20);
  return EXPECTED_CTR[roundedPos] || 0.003;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Extract page type from URL for context-aware recommendations
function getPageType(url: string): string {
  const path = url.toLowerCase();
  if (path === '/' || path.includes('homepage') || path.endsWith('.com') || path.endsWith('.com/')) return 'homepage';
  if (path.includes('/blog/') || path.includes('/post/') || path.includes('/article/')) return 'blog';
  if (path.includes('/product/') || path.includes('/shop/')) return 'product';
  if (path.includes('/category/') || path.includes('/tag/')) return 'category';
  if (path.includes('/about') || path.includes('/contact') || path.includes('/privacy') || path.includes('/terms')) return 'utility';
  if (path.includes('/service') || path.includes('/pricing')) return 'landing';
  return 'page';
}

// Get position-tier label
function getPositionTier(position: number): { tier: string; label: string; color: string } {
  if (position <= 3) return { tier: 'top3', label: 'Top 3', color: 'green' };
  if (position <= 10) return { tier: 'page1', label: 'Page 1', color: 'blue' };
  if (position <= 20) return { tier: 'page2', label: 'Page 2', color: 'yellow' };
  if (position <= 50) return { tier: 'page3to5', label: `Page ${Math.ceil(position / 10)}`, color: 'orange' };
  return { tier: 'deep', label: `Page ${Math.ceil(position / 10)}`, color: 'red' };
}

// Smart recommendations based on page type and position
function getPositionRecommendation(position: number, pageType: string, impressions: number): string {
  const tier = getPositionTier(position);
  
  if (tier.tier === 'deep') {
    // Position 50+
    if (impressions < 20) {
      return `This page ranks at position ${Math.round(position)} with very few impressions. Consider: 1) Check if this page is thin content (< 300 words) and expand it to 1500+ words, 2) Make sure the page targets a specific keyword in the title/H1, 3) If the topic is covered by another page, redirect this one to consolidate authority.`;
    }
    return `Position ${Math.round(position)} means Google sees this content but doesn't rank it well. Action plan: 1) Research what the top 3 results cover that you don't, 2) Add comprehensive sections, FAQs, and data, 3) Build 3-5 internal links from your strongest pages, 4) Consider if this keyword is too competitive and target a long-tail variant instead.`;
  }
  
  if (tier.tier === 'page3to5') {
    // Position 21-50
    if (pageType === 'blog') {
      return `This blog post is on page ${Math.ceil(position / 10)}. To break into top 20: 1) Update the content with fresh data and examples, 2) Add a FAQ section targeting related questions, 3) Improve internal linking from your homepage and related posts, 4) Check if the content matches search intent (informational vs transactional).`;
    }
    return `Position ${Math.round(position)} is the "striking distance" zone. Steps to improve: 1) Analyze the top 10 results for your target keyword, 2) Add missing subtopics they cover, 3) Improve page speed and Core Web Vitals, 4) Get 2-3 quality backlinks from relevant sites.`;
  }
  
  if (tier.tier === 'page2') {
    // Position 11-20
    return `Position ${Math.round(position)} — you're SO close to page 1! High-impact actions: 1) Add 500+ words of unique, valuable content, 2) Optimize your title tag with your primary keyword near the front, 3) Build 2-3 internal links from high-authority pages on your site, 4) Get 1 quality backlink from a relevant site in your niche.`;
  }
  
  if (tier.tier === 'page1') {
    // Position 4-10
    return `Page 1 but below the fold — users need to scroll to find you. To break into top 3: 1) Make your content the most comprehensive result, 2) Add schema markup (FAQ, HowTo, or Article), 3) Improve page load speed to under 2 seconds, 4) Add original images, data, or case studies that competitors lack.`;
  }
  
  // Top 3
  return `Top 3 position — excellent! Focus on defending: 1) Keep content updated monthly, 2) Monitor for new competitors, 3) Add fresh data and examples quarterly, 4) Maintain your backlink profile.`;
}

function getCTRRecommendation(position: number, ctr: number, pageType: string, url: string): string {
  const pageName = url.split('/').pop()?.replace(/-/g, ' ') || 'this page';
  
  if (ctr === 0) {
    if (position > 50) {
      return `Zero clicks is expected at position ${Math.round(position)} — focus on improving rankings first before optimizing CTR. No one scrolls to page ${Math.ceil(position / 10)}.`;
    }
    if (position > 20) {
      return `Getting impressions but zero clicks at position ${Math.round(position)}. Your snippet is appearing in searches but nobody clicks. Fix: 1) Write a compelling title under 60 chars with your keyword + a hook, 2) Write a meta description under 155 chars with a clear benefit and CTA.`;
    }
    return `Zero clicks despite being on page ${Math.ceil(position / 10)} is unusual. Check: 1) Is your title tag compelling? Add numbers, year, or brackets like [2026 Guide], 2) Is your meta description written or is Google auto-generating one?, 3) Do competitors have rich snippets (stars, images, FAQs) stealing clicks?`;
  }
  
  if (pageType === 'blog') {
    return `For blog content about "${pageName}": 1) Use a "How to" or "X Best" or "[Number] Ways" title format, 2) Add the current year [2026] to signal freshness, 3) Write a meta description that teases the key takeaway, 4) Add FAQ schema to potentially get rich snippets.`;
  }
  
  if (pageType === 'homepage') {
    return `For your homepage: 1) Include your brand name + primary value prop in the title, 2) Meta description should clearly state what you do and for whom, 3) Add Organization schema markup, 4) Make sure your favicon displays correctly in search results.`;
  }
  
  return `Improve CTR for "${pageName}": 1) Front-load your primary keyword in the title tag, 2) Add emotional triggers: "Ultimate", "Complete", "Proven", 3) Write a meta description that answers "why should I click this?", 4) Test adding [Brackets] or (Parentheses) — they increase CTR by 33%.`;
}

function analyzePageSEO(page: PageData) {
  const issues: PageIssue[] = [];
  const opportunities: PageOpportunity[] = [];
  
  const expectedCTR = getExpectedCTR(page.position);
  const actualCTR = page.ctr;
  const ctrRatio = expectedCTR > 0 ? actualCTR / expectedCTR : 0;
  const ctrGap = expectedCTR - actualCTR;
  const pageType = getPageType(page.page);
  const posTier = getPositionTier(page.position);

  // ============================================
  // SCORING - Much more nuanced now
  // ============================================
  let score = 0;
  
  // Position Score (0-40 points)
  if (page.position <= 3) score += 40;
  else if (page.position <= 5) score += 35;
  else if (page.position <= 10) score += 28;
  else if (page.position <= 15) score += 20;
  else if (page.position <= 20) score += 15;
  else if (page.position <= 30) score += 10;
  else if (page.position <= 50) score += 5;
  else score += 0; // Position 50+ gets 0 points for position

  // CTR Score (0-30 points)
  if (page.position > 50) {
    // Don't penalize CTR for deep pages — CTR is expected to be ~0%
    score += 10; // Give baseline points
  } else if (ctrRatio >= 1.5) score += 30;
  else if (ctrRatio >= 1.0) score += 25;
  else if (ctrRatio >= 0.7) score += 18;
  else if (ctrRatio >= 0.4) score += 10;
  else if (actualCTR > 0) score += 5;
  else score += 0; // 0% CTR

  // Impressions Score (0-15 points) — signals relevance
  if (page.impressions >= 1000) score += 15;
  else if (page.impressions >= 500) score += 12;
  else if (page.impressions >= 100) score += 9;
  else if (page.impressions >= 20) score += 5;
  else score += 2;

  // Clicks Score (0-15 points)
  if (page.clicks >= 100) score += 15;
  else if (page.clicks >= 50) score += 12;
  else if (page.clicks >= 10) score += 9;
  else if (page.clicks >= 1) score += 5;
  else score += 0;

  // Cap score at 100
  score = Math.min(100, Math.max(0, score));

  // ============================================
  // ISSUES - Context-aware and specific
  // ============================================

  // Issue: Position > 50 (deep pages)
  if (page.position > 50) {
    issues.push({
      id: generateId(),
      type: page.impressions > 50 ? 'critical' : 'warning',
      category: 'ranking',
      title: `Buried on page ${Math.ceil(page.position / 10)} — needs significant work`,
      description: `Position ${page.position.toFixed(1)} gets virtually zero organic traffic. ${
        page.impressions > 50 
          ? `However, ${page.impressions} impressions means Google is considering this page for relevant queries.`
          : `With only ${page.impressions} impressions, Google barely considers this page relevant.`
      }`,
      current: `Position ${page.position.toFixed(1)} (${posTier.label})`,
      recommendation: getPositionRecommendation(page.position, pageType, page.impressions),
      impact: page.impressions > 100 ? 8 : 4,
      fixTime: 'long'
    });
  }
  // Issue: Position 21-50
  else if (page.position > 20) {
    issues.push({
      id: generateId(),
      type: 'warning',
      category: 'ranking',
      title: `Ranking on ${posTier.label} — within striking distance`,
      description: `Position ${page.position.toFixed(1)} with ${page.impressions} impressions. ${
        page.impressions > 100
          ? 'Good impression volume means this keyword has potential.'
          : 'Low impressions suggest a niche or long-tail keyword.'
      }`,
      current: `Position ${page.position.toFixed(1)} (${posTier.label})`,
      recommendation: getPositionRecommendation(page.position, pageType, page.impressions),
      impact: 7,
      fixTime: 'medium'
    });
  }
  // Issue: Position 11-20 (page 2)
  else if (page.position > 10) {
    issues.push({
      id: generateId(),
      type: 'critical',
      category: 'ranking',
      title: 'Page 2 — so close to page 1!',
      description: `Position ${page.position.toFixed(1)} is agonizingly close. Only 0.63% of users click page 2 results. Moving to page 1 could increase clicks dramatically.`,
      current: `Position ${page.position.toFixed(1)} (Page 2)`,
      recommendation: getPositionRecommendation(page.position, pageType, page.impressions),
      impact: 9,
      fixTime: 'medium'
    });

    const potentialClicks = Math.round(page.impressions * EXPECTED_CTR[8]) - page.clicks;
    if (potentialClicks > 0) {
      opportunities.push({
        id: generateId(),
        type: 'growth',
        title: `Move to page 1: +${potentialClicks} clicks/month`,
        description: `Breaking into position 8 could gain approximately ${potentialClicks} more monthly clicks.`,
        potentialClicks,
        effort: 'medium'
      });
    }
  }
  // Issue: Position 4-10 (page 1, below fold)
  else if (page.position > 3) {
    issues.push({
      id: generateId(),
      type: 'warning',
      category: 'ranking',
      title: 'Page 1 but below the fold',
      description: `Position ${page.position.toFixed(1)} is on page 1 but most clicks go to top 3 results (75%+ of all clicks).`,
      current: `Position ${page.position.toFixed(1)} (Page 1)`,
      recommendation: getPositionRecommendation(page.position, pageType, page.impressions),
      impact: 8,
      fixTime: 'medium'
    });

    const potentialClicks = Math.round(page.impressions * EXPECTED_CTR[3]) - page.clicks;
    if (potentialClicks > 3) {
      opportunities.push({
        id: generateId(),
        type: 'growth',
        title: `Reach top 3: +${potentialClicks} clicks/month`,
        description: `Moving from position ${page.position.toFixed(0)} to top 3 could gain ~${potentialClicks} clicks.`,
        potentialClicks,
        effort: 'medium'
      });
    }
  }
  // Top 3 — celebration!
  else {
    opportunities.push({
      id: generateId(),
      type: 'maintain',
      title: '🏆 Top 3 ranking — protect this position!',
      description: `Position ${page.position.toFixed(1)} is excellent. ${page.clicks} clicks from ${page.impressions} impressions. Keep content updated to maintain.`,
      potentialClicks: 0,
      effort: 'low'
    });
  }

  // ============================================
  // CTR ISSUES - Only when relevant
  // ============================================
  
  // Only analyze CTR for pages where it matters (position < 50)
  if (page.position <= 50) {
    if (actualCTR === 0 && page.impressions > 50) {
      issues.push({
        id: generateId(),
        type: page.position <= 20 ? 'critical' : 'warning',
        category: 'ctr',
        title: `Zero clicks despite ${page.impressions} impressions`,
        description: `Your page appears in search results but nobody clicks. ${
          page.position <= 20
            ? 'At this ranking, you should be getting clicks. Your title/meta description needs urgent attention.'
            : 'Improving your ranking should be the priority, then optimize CTR.'
        }`,
        current: `0% CTR (0 clicks from ${page.impressions} impressions)`,
        recommendation: getCTRRecommendation(page.position, actualCTR, pageType, page.page),
        impact: page.position <= 20 ? 9 : 5,
        fixTime: 'quick'
      });

      if (page.position <= 20) {
        const potentialClicks = Math.round(page.impressions * expectedCTR * 0.7);
        if (potentialClicks > 0) {
          opportunities.push({
            id: generateId(),
            type: 'quick_win',
            title: `Fix title/meta: gain ~${potentialClicks} clicks/month`,
            description: `A compelling title and meta description could capture ${potentialClicks} of those ${page.impressions} impressions.`,
            potentialClicks,
            effort: 'low'
          });
        }
      }
    }
    else if (ctrRatio < 0.4 && page.impressions > 100 && page.position <= 20) {
      issues.push({
        id: generateId(),
        type: 'critical',
        category: 'ctr',
        title: 'CTR significantly below average',
        description: `Getting ${(actualCTR * 100).toFixed(2)}% CTR but expected ~${(expectedCTR * 100).toFixed(1)}% at position ${page.position.toFixed(0)}. That's ${Math.round((1 - ctrRatio) * 100)}% below benchmark.`,
        current: `${(actualCTR * 100).toFixed(2)}% CTR (expected: ${(expectedCTR * 100).toFixed(1)}%)`,
        recommendation: getCTRRecommendation(page.position, actualCTR, pageType, page.page),
        impact: 8,
        fixTime: 'quick'
      });

      const potentialClicks = Math.round(page.impressions * expectedCTR * 0.8) - page.clicks;
      if (potentialClicks > 0) {
        opportunities.push({
          id: generateId(),
          type: 'quick_win',
          title: `Optimize snippet: +${potentialClicks} clicks/month`,
          description: `Improving to average CTR for your position could gain ${potentialClicks} additional clicks.`,
          potentialClicks,
          effort: 'low'
        });
      }
    }
    else if (ctrRatio < 0.7 && page.impressions > 50 && page.position <= 20) {
      issues.push({
        id: generateId(),
        type: 'warning',
        category: 'ctr',
        title: 'CTR slightly below average',
        description: `${(actualCTR * 100).toFixed(2)}% CTR vs expected ${(expectedCTR * 100).toFixed(1)}% for position ${page.position.toFixed(0)}.`,
        current: `${(actualCTR * 100).toFixed(2)}% CTR`,
        recommendation: getCTRRecommendation(page.position, actualCTR, pageType, page.page),
        impact: 5,
        fixTime: 'quick'
      });
    }
    else if (ctrRatio >= 1.2 && page.position <= 20) {
      const aboveAvg = Math.round((ctrRatio - 1) * 100);
      opportunities.push({
        id: generateId(),
        type: 'maintain',
        title: `Strong CTR — ${aboveAvg}% above average`,
        description: `Your snippet outperforms competitors at similar positions. Whatever you're doing with your title/meta, keep it up!`,
        potentialClicks: 0,
        effort: 'low'
      });
    }
  }

  // ============================================
  // HIGH POTENTIAL ALERTS
  // ============================================
  
  if (page.impressions > 500 && page.clicks < 5 && page.position <= 30) {
    issues.push({
      id: generateId(),
      type: 'critical',
      category: 'opportunity',
      title: `🔥 High-potential page: ${page.impressions.toLocaleString()} impressions wasted`,
      description: `This page appears in ${page.impressions.toLocaleString()} searches but captures only ${page.clicks} clicks. ${
        page.position <= 20 
          ? 'At this position, a better title and meta description could unlock significant traffic.'
          : `First priority: improve from position ${page.position.toFixed(0)} to top 20.`
      }`,
      current: `${page.impressions.toLocaleString()} impressions → ${page.clicks} clicks (${(actualCTR * 100).toFixed(2)}% conversion)`,
      recommendation: page.position <= 20
        ? getCTRRecommendation(page.position, actualCTR, pageType, page.page)
        : getPositionRecommendation(page.position, pageType, page.impressions),
      impact: 10,
      fixTime: page.position <= 20 ? 'quick' : 'long'
    });
  }

  // Sort issues by impact
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
      ctrGap,
      positionTier: posTier.label,
      pageType
    }
  };
}

// ============================================
// POST & GET handlers (keep the same)
// ============================================

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = getAdminClient();
    
    const { data: profile } = await adminClient
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    const plan = getEffectivePlan(user?.email, profile?.plan);

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
      avgScore: Math.round(analyzedPages.reduce((acc: number, p: any) => acc + p.score, 0) / analyzedPages.length),
      criticalIssues: analyzedPages.reduce((acc: number, p: any) => 
        acc + p.issues.filter((i: PageIssue) => i.type === 'critical').length, 0),
      quickWins: analyzedPages.reduce((acc: number, p: any) => 
        acc + p.opportunities.filter((o: PageOpportunity) => o.type === 'quick_win').length, 0),
      potentialClicks: analyzedPages.reduce((acc: number, p: any) => 
        acc + p.opportunities.reduce((sum: number, o: PageOpportunity) => sum + o.potentialClicks, 0), 0),
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
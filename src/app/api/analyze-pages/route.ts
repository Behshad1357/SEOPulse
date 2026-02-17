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

function getPageType(url: string): string {
  const path = url.toLowerCase();
  if (path === '/' || path.includes('homepage') || path.endsWith('.com') || path.endsWith('.com/') || path.endsWith('.digital') || path.endsWith('.digital/')) return 'homepage';
  if (path.includes('/blog/') || path.includes('/post/') || path.includes('/article/')) return 'blog';
  if (path === '/blog' || path === '/blog/') return 'blog_index';
  if (path.includes('/product/') || path.includes('/shop/')) return 'product';
  if (path.includes('/category/') || path.includes('/tag/')) return 'category';
  if (path.includes('/about') || path.includes('/contact') || path.includes('/privacy') || path.includes('/terms')) return 'utility';
  if (path.includes('/service') || path.includes('/pricing')) return 'landing';
  return 'page';
}

function getPageName(url: string): string {
  if (url === '/' || url.endsWith('.com') || url.endsWith('.com/') || url.endsWith('.digital') || url.endsWith('.digital/')) return 'Homepage';
  const slug = url.split('/').filter(Boolean).pop() || url;
  return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getPositionTier(position: number): { tier: string; label: string } {
  if (position <= 3) return { tier: 'top3', label: 'Top 3' };
  if (position <= 10) return { tier: 'page1', label: 'Page 1' };
  if (position <= 20) return { tier: 'page2', label: 'Page 2' };
  if (position <= 50) return { tier: 'striking', label: `Page ${Math.ceil(position / 10)}` };
  return { tier: 'deep', label: `Page ${Math.ceil(position / 10)}` };
}

function isLowValuePage(pageType: string, impressions: number): boolean {
  // Blog index, utility pages with very low impressions are low value
  if (pageType === 'blog_index' && impressions < 20) return true;
  if (pageType === 'utility' && impressions < 10) return true;
  return false;
}

function getSpecificRecommendation(page: PageData, pageType: string): string {
  const pageName = getPageName(page.page);
  const pos = Math.round(page.position);
  
  // ===== DEEP PAGES (50+) =====
  if (page.position > 50) {
    if (pageType === 'homepage') {
      return `Your homepage is at position ${pos} — this suggests a fundamental SEO issue. Action plan: 1) Check if your homepage has a clear H1 with your main keyword, 2) Make sure you have 300+ words of unique content on the homepage, 3) Verify your site is properly indexed (search "site:yourdomain.com" in Google), 4) Submit your sitemap in Google Search Console, 5) Check for any manual actions or penalties in GSC.`;
    }
    if (pageType === 'blog') {
      if (page.impressions > 100) {
        return `"${pageName}" has ${page.impressions} impressions at position ${pos} — Google knows about it but ranks competitors higher. To improve: 1) Search your target keyword and study the top 3 results — what do they cover that you don't?, 2) Expand your article to 2000+ words with subheadings for each subtopic, 3) Add original data, screenshots, or examples, 4) Include a FAQ section with 5+ related questions, 5) Build 3+ internal links from your other blog posts to this page.`;
      }
      return `"${pageName}" ranks at position ${pos} with minimal impressions. This might be a content quality or keyword targeting issue. Steps: 1) Make sure your title exactly matches a keyword people search for (use Google autocomplete), 2) Check if another page on your site targets the same keyword (keyword cannibalization), 3) Ensure the article is comprehensive — at least 1500 words, 4) Add the target keyword to: title, H1, first paragraph, 2-3 H2s, and meta description.`;
    }
    if (pageType === 'landing') {
      return `Your ${pageName.toLowerCase()} page is buried at position ${pos}. For commercial pages: 1) Make sure the page title includes your main keyword + a differentiator (e.g., "SEO Tools Pricing — Free Plan Available"), 2) Add testimonials or social proof, 3) Include comparison tables if applicable, 4) Build internal links from blog posts that discuss related topics, 5) Consider if this page should target a different, less competitive keyword.`;
    }
    return `Position ${pos} means this page is essentially invisible. Quick assessment: 1) Does the page have a clear target keyword in the title?, 2) Is the content at least 1000 words and comprehensive?, 3) Does any other page on your site target the same keyword?, 4) Is the page linked from your navigation or other pages? If you answer "no" to any of these, fix that first.`;
  }

  // ===== STRIKING DISTANCE (21-50) =====
  if (page.position > 20) {
    if (pageType === 'blog') {
      return `"${pageName}" is on page ${Math.ceil(page.position / 10)} — within striking distance! Specific actions: 1) Add 500+ words covering subtopics you're missing (check "People Also Ask" in Google), 2) Update the publish date and add "[Updated ${new Date().getFullYear()}]" to the title, 3) Add a table of contents at the top, 4) Link to this post from 3+ other pages on your site using keyword-rich anchor text, 5) Share it on social media to drive some direct traffic signals.`;
    }
    if (pageType === 'homepage') {
      return `Homepage at position ${pos} means competitors are outranking you for your core terms. Priority fixes: 1) Ensure your title tag is: "Primary Keyword — Brand Name" format, 2) Add clear H2 sections covering your key services/features, 3) Include at least 500 words of unique homepage content, 4) Make sure every blog post links back to the homepage, 5) Get listed on relevant directories and business profiles.`;
    }
    return `"${pageName}" at position ${pos} — needs a push to reach page 1-2. Steps: 1) Audit the content against top 10 results for completeness, 2) Add schema markup (Article, FAQ, or HowTo), 3) Improve page speed (aim for < 2.5s LCP), 4) Build 2-3 internal links with descriptive anchor text, 5) Try to get 1 external backlink from a relevant site.`;
  }

  // ===== PAGE 2 (11-20) =====
  if (page.position > 10) {
    if (pageType === 'blog') {
      return `"${pageName}" is SO close to page 1! High-impact actions: 1) Add an "Expert Tips" or "Pro Tips" section that competitors don't have, 2) Include a custom graphic, chart, or infographic, 3) Add FAQ schema markup to potentially get a rich snippet, 4) Get 1-2 internal links from your highest-traffic pages, 5) Reach out to one site that links to a competitor's similar article and suggest yours as an alternative.`;
    }
    return `Almost on page 1! For "${pageName}": 1) Make your content 20% more comprehensive than the #1 result, 2) Add multimedia: images with alt text, embedded video if possible, 3) Ensure your title tag is under 60 characters and compelling, 4) Add the primary keyword to your URL if it's not there, 5) Build 2 quality backlinks from relevant sites.`;
  }

  // ===== PAGE 1 BELOW FOLD (4-10) =====
  if (page.position > 3) {
    return `"${pageName}" is on page 1 at position ${pos}! To crack top 3: 1) Your content must be THE definitive resource — more thorough than any competitor, 2) Add structured data (FAQ schema is easiest to implement), 3) Optimize for featured snippets: add a clear definition paragraph after your H1, 4) Improve page experience: speed, mobile usability, no intrusive interstitials, 5) Earn 2-3 more backlinks from authoritative sites in your niche.`;
  }

  // ===== TOP 3 =====
  return `"${pageName}" is in the top 3 — excellent! Defend it: 1) Update content quarterly with fresh data, 2) Monitor competitors entering the top 10, 3) Keep building backlinks slowly, 4) Ensure page speed stays fast, 5) Consider adding a video to increase time-on-page.`;
}

function getCTRRecommendation(page: PageData, pageType: string): string {
  const pageName = getPageName(page.page);
  
  if (page.ctr === 0 && page.position > 30) {
    return `Zero clicks is expected at position ${Math.round(page.position)}. Focus on improving rankings first — CTR optimization only matters once you're on page 1-2.`;
  }

  if (page.ctr === 0 && page.position <= 30) {
    return `Getting ${page.impressions} impressions with zero clicks means your search snippet isn't compelling. Fix: 1) Write a new title tag: "${pageName} — [Unique Benefit] | Your Brand" (under 60 chars), 2) Write a meta description that starts with an action verb: "Learn...", "Discover...", "Get..." (under 155 chars), 3) Add structured data to potentially get rich snippets (stars, FAQs, etc.), 4) Check if Google is rewriting your title — if so, make your title more relevant to the queries.`;
  }

  if (pageType === 'blog') {
    return `Improve CTR for "${pageName}": 1) Title formula: "[Number] [Adjective] Ways to [Desired Outcome] in ${new Date().getFullYear()}", 2) Add brackets or parentheses: [Guide], [Updated], (With Examples), 3) Meta description: Promise a specific benefit in the first 70 characters, 4) Add FAQ schema to get expandable results in search.`;
  }

  if (pageType === 'homepage') {
    return `Homepage CTR fix: 1) Title format: "Brand Name — Clear Value Proposition in 5-7 Words", 2) Meta description: "[Brand] helps [audience] [achieve X]. [Social proof]. Get started free.", 3) Add Organization schema, 4) Make sure your favicon displays in search results (helps recognition).`;
  }

  if (pageType === 'landing') {
    return `For "${pageName}": 1) Include price or "Free" in title if applicable — numbers boost CTR, 2) Meta description: Lead with your differentiator, end with CTA, 3) Add Review/Product schema if applicable, 4) Title under 60 chars with primary keyword first.`;
  }

  return `CTR improvement for "${pageName}": 1) Front-load your keyword in the title tag, 2) Add emotional/power words: "Ultimate", "Complete", "Proven", "Essential", 3) Include the year or "[Updated]" to signal freshness, 4) Write a meta description that answers "why should I click?" in 155 characters.`;
}

function analyzePageSEO(page: PageData, allPages?: PageData[]) {
  const issues: PageIssue[] = [];
  const opportunities: PageOpportunity[] = [];
  
  const expectedCTR = getExpectedCTR(page.position);
  const actualCTR = page.ctr;
  const ctrRatio = expectedCTR > 0 ? actualCTR / expectedCTR : 0;
  const ctrGap = expectedCTR - actualCTR;
  const pageType = getPageType(page.page);
  const pageName = getPageName(page.page);
  const posTier = getPositionTier(page.position);
  const lowValue = isLowValuePage(pageType, page.impressions);

  // ============================================
  // SCORING
  // ============================================
  let score = 0;
  
  // Position Score (0-40 points)
  if (page.position <= 3) score += 40;
  else if (page.position <= 5) score += 35;
  else if (page.position <= 10) score += 28;
  else if (page.position <= 15) score += 22;
  else if (page.position <= 20) score += 17;
  else if (page.position <= 30) score += 12;
  else if (page.position <= 50) score += 6;
  else score += 0;

  // CTR Score (0-25 points)
  if (page.position <= 30) {
    // Only judge CTR when position is relevant
    if (ctrRatio >= 1.5) score += 25;
    else if (ctrRatio >= 1.0) score += 20;
    else if (ctrRatio >= 0.7) score += 14;
    else if (ctrRatio >= 0.4) score += 8;
    else if (actualCTR > 0) score += 4;
    else score += 0;
  } else {
    // Deep pages: don't penalize CTR, give small baseline
    if (actualCTR > 0) score += 10;
    else score += 3;
  }

  // Impressions Score (0-15 points)
  if (page.impressions >= 1000) score += 15;
  else if (page.impressions >= 500) score += 12;
  else if (page.impressions >= 200) score += 10;
  else if (page.impressions >= 100) score += 8;
  else if (page.impressions >= 50) score += 5;
  else if (page.impressions >= 10) score += 3;
  else score += 1;

  // Clicks Score (0-15 points)
  if (page.clicks >= 100) score += 15;
  else if (page.clicks >= 50) score += 12;
  else if (page.clicks >= 20) score += 10;
  else if (page.clicks >= 10) score += 8;
  else if (page.clicks >= 5) score += 6;
  else if (page.clicks >= 1) score += 3;
  else score += 0;

  // Bonus: Page type relevance (0-5 points)
  if (pageType === 'homepage' || pageType === 'landing') score += 3;
  else if (pageType === 'blog') score += 4;
  else if (pageType === 'blog_index' || pageType === 'utility') score += 1;
  else score += 2;

  score = Math.min(100, Math.max(0, score));

  // ============================================
  // LOW VALUE PAGE CHECK
  // ============================================
  if (lowValue) {
    // Don't generate issues for low-value pages, just a note
    if (pageType === 'blog_index') {
      opportunities.push({
        id: generateId(),
        type: 'maintain',
        title: `Blog index page — low priority`,
        description: `This is your blog listing page. It naturally gets few direct search clicks. Focus on individual blog posts instead.`,
        potentialClicks: 0,
        effort: 'low'
      });
    }
    
    return {
      score,
      issues,
      opportunities,
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
  // POSITION ISSUES
  // ============================================

  if (page.position > 50) {
    issues.push({
      id: generateId(),
      type: page.impressions > 100 ? 'critical' : 'warning',
      category: 'ranking',
      title: `Buried on ${posTier.label} — ${page.impressions > 100 ? 'high potential hidden' : 'needs significant work'}`,
      description: `"${pageName}" at position ${page.position.toFixed(1)} gets virtually zero organic traffic. ${
        page.impressions > 100 
          ? `But ${page.impressions} impressions means Google IS showing this page — it just ranks too low for clicks.`
          : `With ${page.impressions} impressions, this page has minimal search visibility.`
      }`,
      current: `Position ${page.position.toFixed(1)} (${posTier.label})`,
      recommendation: getSpecificRecommendation(page, pageType),
      impact: page.impressions > 100 ? 8 : 4,
      fixTime: 'long'
    });

    // Only add opportunity if there's real potential
    if (page.impressions > 200) {
      const potentialIfPage2 = Math.round(page.impressions * 0.01); // ~1% CTR if they reach page 2
      if (potentialIfPage2 > 0) {
        opportunities.push({
          id: generateId(),
          type: 'growth',
          title: `Move "${pageName}" to page 2: +${potentialIfPage2} clicks`,
          description: `This page gets ${page.impressions} impressions. Reaching page 2 could unlock ~${potentialIfPage2} clicks/month.`,
          potentialClicks: potentialIfPage2,
          effort: 'high'
        });
      }
    }
  }
  else if (page.position > 20) {
    issues.push({
      id: generateId(),
      type: 'warning',
      category: 'ranking',
      title: `"${pageName}" on ${posTier.label} — within striking distance`,
      description: `Position ${page.position.toFixed(1)} with ${page.impressions} impressions. ${
        page.impressions > 100
          ? 'Healthy impression volume means this keyword has real search demand.'
          : 'Low impressions — may be a niche keyword or the page needs better targeting.'
      }`,
      current: `Position ${page.position.toFixed(1)} (${posTier.label})`,
      recommendation: getSpecificRecommendation(page, pageType),
      impact: 6,
      fixTime: 'medium'
    });

    const potentialIfPage1 = Math.round(page.impressions * 0.03) - page.clicks;
    if (potentialIfPage1 > 0) {
      opportunities.push({
        id: generateId(),
        type: 'growth',
        title: `Push "${pageName}" to page 1: +${potentialIfPage1} clicks`,
        description: `Reaching page 1 (top 10) could gain ~${potentialIfPage1} more clicks/month.`,
        potentialClicks: potentialIfPage1,
        effort: 'medium'
      });
    }
  }
  else if (page.position > 10) {
    issues.push({
      id: generateId(),
      type: 'critical',
      category: 'ranking',
      title: `"${pageName}" on page 2 — SO close to page 1!`,
      description: `Position ${page.position.toFixed(1)} is agonizingly close to page 1. Only 0.63% of searchers go to page 2. ${page.impressions} impressions shows this keyword has demand.`,
      current: `Position ${page.position.toFixed(1)} (Page 2)`,
      recommendation: getSpecificRecommendation(page, pageType),
      impact: 9,
      fixTime: 'medium'
    });

    const potentialClicks = Math.round(page.impressions * EXPECTED_CTR[8]) - page.clicks;
    if (potentialClicks > 0) {
      opportunities.push({
        id: generateId(),
        type: 'quick_win',
        title: `Get "${pageName}" to page 1: +${potentialClicks} clicks`,
        description: `A small ranking boost to position 8 could gain ~${potentialClicks} clicks/month.`,
        potentialClicks,
        effort: 'medium'
      });
    }
  }
  else if (page.position > 3) {
    issues.push({
      id: generateId(),
      type: 'warning',
      category: 'ranking',
      title: `"${pageName}" — page 1 but below the fold`,
      description: `Position ${page.position.toFixed(1)} is good but top 3 gets 75%+ of all clicks. You're leaving traffic on the table.`,
      current: `Position ${page.position.toFixed(1)} (Page 1, below fold)`,
      recommendation: getSpecificRecommendation(page, pageType),
      impact: 8,
      fixTime: 'medium'
    });

    const potentialClicks = Math.round(page.impressions * EXPECTED_CTR[3]) - page.clicks;
    if (potentialClicks > 2) {
      opportunities.push({
        id: generateId(),
        type: 'growth',
        title: `Top 3 for "${pageName}": +${potentialClicks} clicks`,
        description: `Moving to top 3 could gain ~${potentialClicks} more clicks/month.`,
        potentialClicks,
        effort: 'medium'
      });
    }
  }
  else {
    // Top 3 ranking
    if (page.impressions > 20 || page.clicks > 0) {
      opportunities.push({
        id: generateId(),
        type: 'maintain',
        title: `🏆 "${pageName}" — Top 3! Defend this position`,
        description: `Position ${page.position.toFixed(1)} is excellent. ${page.clicks} clicks from ${page.impressions} impressions. ${
          page.clicks === 0 && page.impressions < 20 
            ? 'Low volume keyword — consider if this position matters for your business.'
            : 'Keep content fresh and monitor for competitor movement.'
        }`,
        potentialClicks: 0,
        effort: 'low'
      });
    } else {
      // Top 3 but nearly zero data — probably branded or very niche
      opportunities.push({
        id: generateId(),
        type: 'maintain',
        title: `"${pageName}" ranks top 3 (low volume)`,
        description: `Position ${page.position.toFixed(1)} with only ${page.impressions} impressions. This might be a branded term or very niche query. Low priority unless this keyword matters strategically.`,
        potentialClicks: 0,
        effort: 'low'
      });
    }
  }

  // ============================================
  // CTR ISSUES (only for position < 30)
  // ============================================
  
  if (page.position <= 30) {
    if (actualCTR === 0 && page.impressions > 50) {
      issues.push({
        id: generateId(),
        type: page.position <= 20 ? 'critical' : 'warning',
        category: 'ctr',
        title: `Zero clicks on "${pageName}" despite ${page.impressions} impressions`,
        description: `Your search listing is appearing but failing to attract clicks. ${
          page.position <= 10
            ? 'Being on page 1 with zero clicks suggests a serious snippet problem.'
            : page.position <= 20
            ? 'Page 2 CTR is naturally low, but some clicks are expected.'
            : 'Improving position is the priority, but your snippet matters too.'
        }`,
        current: `0% CTR (${page.impressions} impressions → 0 clicks)`,
        recommendation: getCTRRecommendation(page, pageType),
        impact: page.position <= 10 ? 9 : page.position <= 20 ? 7 : 4,
        fixTime: 'quick'
      });

      if (page.position <= 20) {
        const potentialClicks = Math.max(1, Math.round(page.impressions * expectedCTR * 0.6));
        opportunities.push({
          id: generateId(),
          type: 'quick_win',
          title: `Fix snippet: gain ~${potentialClicks} clicks/month`,
          description: `A better title and meta description for "${pageName}" could capture ${potentialClicks} of those ${page.impressions} impressions.`,
          potentialClicks,
          effort: 'low'
        });
      }
    }
    else if (ctrRatio < 0.5 && page.impressions > 50 && page.position <= 20 && actualCTR > 0) {
      issues.push({
        id: generateId(),
        type: 'warning',
        category: 'ctr',
        title: `"${pageName}" CTR below average`,
        description: `${(actualCTR * 100).toFixed(2)}% CTR vs expected ${(expectedCTR * 100).toFixed(1)}% at position ${page.position.toFixed(0)}. You're getting ${Math.round((1 - ctrRatio) * 100)}% fewer clicks than typical.`,
        current: `${(actualCTR * 100).toFixed(2)}% CTR (expected: ${(expectedCTR * 100).toFixed(1)}%)`,
        recommendation: getCTRRecommendation(page, pageType),
        impact: 6,
        fixTime: 'quick'
      });

      const potentialClicks = Math.round(page.impressions * expectedCTR * 0.8) - page.clicks;
      if (potentialClicks > 1) {
        opportunities.push({
          id: generateId(),
          type: 'quick_win',
          title: `Better snippet for "${pageName}": +${potentialClicks} clicks`,
          description: `Reaching average CTR for your position could gain ~${potentialClicks} clicks.`,
          potentialClicks,
          effort: 'low'
        });
      }
    }
    else if (ctrRatio >= 1.3 && page.impressions > 20) {
      const aboveAvg = Math.round((ctrRatio - 1) * 100);
      opportunities.push({
        id: generateId(),
        type: 'maintain',
        title: `✅ "${pageName}" — CTR ${aboveAvg}% above average`,
        description: `Your search snippet outperforms competitors. Great title and meta description work!`,
        potentialClicks: 0,
        effort: 'low'
      });
    }
  }

  // ============================================
  // HIGH-POTENTIAL ALERT
  // ============================================
  if (page.impressions > 300 && page.clicks < 3 && page.position <= 30) {
    // Remove duplicate issues, add this as priority
    issues.unshift({
      id: generateId(),
      type: 'critical',
      category: 'opportunity',
      title: `🔥 "${pageName}" — ${page.impressions} impressions going to waste!`,
      description: `This page appears in ${page.impressions.toLocaleString()} searches but only gets ${page.clicks} clicks. ${
        page.position <= 20 
          ? 'At this position, fixing your title and meta description should be your #1 priority.'
          : `First, improve from position ${page.position.toFixed(0)} to top 20, then optimize your snippet.`
      }`,
      current: `${page.impressions} impressions → ${page.clicks} clicks`,
      recommendation: page.position <= 20
        ? getCTRRecommendation(page, pageType)
        : getSpecificRecommendation(page, pageType),
      impact: 10,
      fixTime: page.position <= 20 ? 'quick' : 'long'
    });
  }

  // Sort by impact, limit
  issues.sort((a, b) => b.impact - a.impact);
  // Remove duplicate categories if too many similar issues
  const seenCategories = new Set();
  const dedupedIssues = issues.filter(issue => {
    const key = `${issue.category}-${issue.type}`;
    if (seenCategories.has(key)) return false;
    seenCategories.add(key);
    return true;
  });

  return {
    score,
    issues: dedupedIssues.slice(0, 4),
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
// API HANDLERS
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
      const analysis = analyzePageSEO(page, pagesToAnalyze);
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
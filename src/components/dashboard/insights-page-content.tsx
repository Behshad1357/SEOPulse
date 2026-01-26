"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectGoogleButton } from "@/components/dashboard/connect-google-button";
import { SiteSelector } from "@/components/dashboard/site-selector";
import {
  Sparkles,
  Loader2,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Calendar,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { useGSCData } from "@/hooks/useGSCData";
import { SEOHealthScore } from "@/components/dashboard/seo-health-score";
import { KeywordOpportunities } from "@/components/dashboard/keyword-opportunities";
import { SEOChecklist } from "@/components/dashboard/seo-checklist";
import { trackAIInsightsGenerated } from "@/lib/analytics";

interface Insight {
  id: string;
  website_id: string;
  type: "opportunity" | "anomaly" | "recommendation";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  created_at: string;
  action_steps?: string[];
  learn_more_url?: string;
}

interface InsightsPageContentProps {
  isGoogleConnected: boolean;
  userId: string;
}

const typeConfig = {
  opportunity: {
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    label: "Opportunity",
  },
  anomaly: {
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    label: "Anomaly",
  },
  recommendation: {
    icon: Lightbulb,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Recommendation",
  },
};

const priorityConfig = {
  high: {
    color: "bg-red-100 text-red-700 border-red-200",
    label: "High Priority",
  },
  medium: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    label: "Medium",
  },
  low: {
    color: "bg-green-100 text-green-700 border-green-200",
    label: "Low",
  },
};

// Detailed insights for low-traffic/new sites
const getLowTrafficInsights = (
  siteUrl: string,
  clicks: number,
  impressions: number
): Insight[] => {
  const insights: Insight[] = [];
  const domain = siteUrl
    .replace("sc-domain:", "")
    .replace(/https?:\/\//, "")
    .replace(/\/$/, "");

  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

  if (impressions > 0 && ctr < 2) {
    insights.push({
      id: `insight-ctr-${Date.now()}`,
      website_id: siteUrl,
      type: "opportunity",
      title: "Improve Your Click-Through Rate",
      description: `Your CTR is ${ctr.toFixed(2)}% (${clicks} clicks from ${impressions} impressions). The average CTR for position 1 is ~30%. Even small improvements in your title tags and meta descriptions can significantly increase clicks.`,
      priority: "high",
      created_at: new Date().toISOString(),
      action_steps: [
        "Write compelling title tags under 60 characters that include your target keyword",
        "Create meta descriptions under 155 characters with a clear call-to-action",
        "Use numbers, questions, or power words to stand out in search results",
        "Add structured data (Schema markup) to get rich snippets",
      ],
      learn_more_url: "https://developers.google.com/search/docs/appearance/title-link",
    });
  }

  if (impressions > 50 && clicks < 5) {
    insights.push({
      id: `insight-visibility-${Date.now()}`,
      website_id: siteUrl,
      type: "anomaly",
      title: "High Visibility, Low Engagement",
      description: `You're appearing ${impressions} times in search results but only getting ${clicks} click(s). This suggests your listings aren't compelling enough or you're ranking for irrelevant keywords.`,
      priority: "high",
      created_at: new Date().toISOString(),
      action_steps: [
        "Check which keywords you're ranking for in Google Search Console",
        "Ensure your content actually matches the search intent for those keywords",
        "Review competitors' titles and descriptions for the same keywords",
        "Consider if the keywords are too competitive (ranking on page 2+)",
      ],
      learn_more_url: "https://search.google.com/search-console",
    });
  }

  if (clicks < 10) {
    insights.push({
      id: `insight-newsite-${Date.now()}`,
      website_id: siteUrl,
      type: "recommendation",
      title: "Build Topical Authority",
      description: `For ${domain}, focus on becoming an authority in your niche. Google rewards sites that demonstrate expertise, authoritativeness, and trustworthiness (E-E-A-T).`,
      priority: "high",
      created_at: new Date().toISOString(),
      action_steps: [
        "Create a content cluster: 1 pillar page + 5-10 supporting articles on related topics",
        "Interlink your content to show topical relationships",
        "Add author bios with credentials to build trust",
        "Get backlinks from relevant, authoritative sites in your niche",
        "Publish consistently (aim for 2-4 quality articles per month)",
      ],
      learn_more_url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    });
  }

  insights.push({
    id: `insight-technical-${Date.now()}`,
    website_id: siteUrl,
    type: "recommendation",
    title: "Complete Your Technical SEO Checklist",
    description: `Ensure ${domain} has a solid technical foundation. Technical issues can prevent Google from properly crawling and indexing your content.`,
    priority: "medium",
    created_at: new Date().toISOString(),
    action_steps: [
      "Submit your sitemap.xml to Google Search Console",
      "Check for crawl errors in GSC and fix any issues",
      "Ensure your site loads in under 3 seconds (use PageSpeed Insights)",
      "Make sure your site is mobile-friendly (use Mobile-Friendly Test)",
      "Implement HTTPS if not already done",
      "Add robots.txt file with proper directives",
    ],
    learn_more_url: "https://pagespeed.web.dev/",
  });

  insights.push({
    id: `insight-content-${Date.now()}`,
    website_id: siteUrl,
    type: "opportunity",
    title: "Optimize Existing Content",
    description: `Even with limited traffic, you can improve rankings by optimizing your existing pages. Focus on making each page the best resource for its target keyword.`,
    priority: "medium",
    created_at: new Date().toISOString(),
    action_steps: [
      "Use your target keyword in the H1, first paragraph, and subheadings",
      "Add relevant images with descriptive alt text",
      "Include internal links to and from other relevant pages",
      "Answer related questions (check 'People Also Ask' in Google)",
      "Update content regularly to keep it fresh",
      "Aim for comprehensive content (typically 1,500-2,500 words for competitive topics)",
    ],
    learn_more_url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
  });

  insights.push({
    id: `insight-quickwins-${Date.now()}`,
    website_id: siteUrl,
    type: "opportunity",
    title: "Quick Wins for Immediate Impact",
    description: `These actions can be completed today and may show results within weeks.`,
    priority: "high",
    created_at: new Date().toISOString(),
    action_steps: [
      "Claim and optimize your Google Business Profile (if local business)",
      "Add your site to Bing Webmaster Tools for additional traffic",
      "Create social media profiles linking to your site",
      "Find and fix any broken links (404 errors)",
      "Optimize your 3 most important pages first",
    ],
    learn_more_url: "https://www.bing.com/webmasters",
  });

  return insights;
};

export function InsightsPageContent({
  isGoogleConnected,
  userId,
}: InsightsPageContentProps) {
  const {
    data,
    sites,
    loading: gscLoading,
    isConnected,
    selectedSite,
    setSelectedSite,
  } = useGSCData();

  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedInsights((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (data && isConnected && selectedSite) {
      generateInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isConnected, selectedSite]);

  const generateInsights = async () => {
    if (!data) return;

    setLoading(true);
    try {
      if (data.totals.clicks < 50 || data.totals.impressions < 500) {
        const localInsights = getLowTrafficInsights(
          selectedSite || "",
          data.totals.clicks,
          data.totals.impressions
        );
        setInsights(localInsights);
        setLastGenerated(new Date());
        
        // Track AI insights generated
        trackAIInsightsGenerated(selectedSite || "", localInsights.length);
        
        setLoading(false);
        return;
      }

      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totals: data.totals,
          trends: data.trends,
          queries: data.queries.slice(0, 15),
          pages: data.pages.slice(0, 10),
          siteUrl: selectedSite,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.insights && result.insights.length > 0) {
          setInsights(result.insights);
          setLastGenerated(new Date());
          
          // Track AI insights generated
          trackAIInsightsGenerated(selectedSite || "", result.insights.length);
        }
      }
    } catch (error) {
      console.error("Error generating insights:", error);
      const localInsights = getLowTrafficInsights(
        selectedSite || "",
        data.totals.clicks,
        data.totals.impressions
      );
      setInsights(localInsights);
      setLastGenerated(new Date());
    } finally {
      setLoading(false);
    }
  };

  if (!isGoogleConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-500 mt-1">
            AI-powered recommendations to improve your SEO
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-3 bg-blue-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Connect Google Search Console
            </h3>
            <p className="text-gray-500 text-center max-w-sm mb-6">
              Connect your Google Search Console to get AI-powered insights
              about your SEO performance.
            </p>
            <ConnectGoogleButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gscLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-500 mt-1">
            AI-powered recommendations to improve your SEO
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading your data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-500 mt-1">
            AI-powered recommendations to improve your SEO
          </p>
        </div>
        <div className="flex items-center gap-3">
          {sites.length > 0 && (
            <SiteSelector
              sites={sites}
              selectedSite={selectedSite}
              onSelect={setSelectedSite}
            />
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={generateInsights}
            disabled={loading || !data}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Last Generated */}
      {lastGenerated && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          Last generated: {lastGenerated.toLocaleString()}
        </div>
      )}

      {/* Data Summary */}
      {data && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div>
                <span className="text-gray-500">Analyzing:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {selectedSite?.replace("sc-domain:", "").replace(/https?:\/\//, "")}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Period:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {data.dateRange.start} to {data.dateRange.end}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Total Clicks:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {data.totals.clicks.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Impressions:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {data.totals.impressions.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEO Health Score */}
      {data && (
        <SEOHealthScore
          clicks={data.totals.clicks}
          impressions={data.totals.impressions}
          ctr={data.totals.ctr}
          position={data.totals.position}
        />
      )}

      {/* Keyword Opportunities */}
      {data && data.queries && data.queries.length > 0 && (
        <KeywordOpportunities keywords={data.queries} />
      )}

      {/* SEO Checklist */}
      {selectedSite && <SEOChecklist siteUrl={selectedSite} />}

      {/* Loading Insights */}
      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            <span className="ml-3 text-gray-600">Analyzing your data...</span>
          </CardContent>
        </Card>
      )}

      {/* Insights List */}
      {!loading && insights.length > 0 && (
        <div className="space-y-4">
          {insights.map((insight) => {
            const typeInfo = typeConfig[insight.type];
            const priorityInfo = priorityConfig[insight.priority];
            const IconComponent = typeInfo.icon;
            const isExpanded = expandedInsights.has(insight.id);

            return (
              <Card
                key={insight.id}
                className={`${typeInfo.bgColor} ${typeInfo.borderColor} border hover:shadow-md transition-all cursor-pointer`}
                onClick={() => toggleExpanded(insight.id)}
              >
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white shadow-sm">
                      <IconComponent className={`w-5 h-5 ${typeInfo.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${typeInfo.bgColor} ${typeInfo.color} border ${typeInfo.borderColor}`}>
                          {typeInfo.label}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityInfo.color}`}>
                          {priorityInfo.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                      <p className="text-sm text-gray-700">{insight.description}</p>

                      {isExpanded && insight.action_steps && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Action Steps
                          </h4>
                          <ul className="space-y-2">
                            {insight.action_steps.map((step, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                                  {index + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                          {insight.learn_more_url && (
                            <a
                              href={insight.learn_more_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Learn more
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* No Insights State */}
      {!loading && insights.length === 0 && data && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-3 bg-gray-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Generating Insights...</h3>
            <p className="text-gray-500 text-center max-w-sm mb-4">
              Click the button below to generate AI insights based on your data.
            </p>
            <Button onClick={generateInsights} disabled={loading}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Insights
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
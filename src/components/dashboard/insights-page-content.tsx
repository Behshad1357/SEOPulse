// src/components/dashboard/insights-page-content.tsx
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
  Target,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { useGSCData } from "@/hooks/useGSCData";
import { SEOHealthScore } from "@/components/dashboard/seo-health-score";
import { KeywordOpportunities } from "@/components/dashboard/keyword-opportunities";
import { SEOChecklist } from "@/components/dashboard/seo-checklist";
import { trackAIInsightsGenerated } from "@/lib/analytics";
import Link from "next/link";

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

// Position-aware CTR benchmarks
const EXPECTED_CTR: Record<number, number> = {
  1: 0.319, 2: 0.246, 3: 0.185, 4: 0.133, 5: 0.095,
  6: 0.068, 7: 0.051, 8: 0.036, 9: 0.028, 10: 0.023,
};

function getExpectedCTR(position: number): number {
  if (position > 50) return 0.0005;
  if (position > 30) return 0.001;
  if (position > 20) return 0.002;
  const rounded = Math.min(Math.max(Math.round(position), 1), 10);
  return EXPECTED_CTR[rounded] || 0.003;
}

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
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totals: data.totals,
          trends: data.trends,
          queries: data.queries.slice(0, 20),
          pages: data.pages.slice(0, 15),
          siteUrl: selectedSite,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.insights && result.insights.length > 0) {
          setInsights(result.insights);
          setLastGenerated(new Date());
          trackAIInsightsGenerated(selectedSite || "", result.insights.length);
        }
      }
    } catch (error) {
      console.error("Error generating insights:", error);
    } finally {
      setLoading(false);
    }
  };

  // Not connected state
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

  // Loading state
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

  // Calculate position-aware metrics for display
  const avgPosition = data?.totals?.position || 0;
  const expectedCTR = getExpectedCTR(avgPosition);
  const actualCTR = data?.totals?.ctr || 0;
  const ctrPerformance = expectedCTR > 0 ? ((actualCTR / expectedCTR) * 100).toFixed(0) : '0';
  const positionPage = Math.ceil(avgPosition / 10);

  // Count keyword categories
  const queries = data?.queries || [];
  const quickWinKeywords = queries.filter(q => q.position >= 8 && q.position <= 30);
  const strikingKeywords = queries.filter(q => q.position > 30 && q.position <= 60);
  const topKeywords = queries.filter(q => q.position <= 7);
  const deepKeywords = queries.filter(q => q.position > 60);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-500 mt-1">
            Data-driven recommendations for your SEO
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

      {/* Data Summary - Enhanced */}
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

      {/* Position-Aware CTR Card - NEW */}
      {data && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              CTR Analysis (Position-Adjusted)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Your CTR</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(actualCTR * 100).toFixed(2)}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">
                  Expected CTR at Pos {avgPosition.toFixed(0)} (Page {positionPage})
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(expectedCTR * 100).toFixed(2)}%
                </p>
              </div>
              <div className={`rounded-lg p-4 ${
                Number(ctrPerformance) >= 100 
                  ? 'bg-green-50' 
                  : Number(ctrPerformance) >= 70 
                  ? 'bg-yellow-50' 
                  : 'bg-red-50'
              }`}>
                <p className="text-sm text-gray-500 mb-1">Performance vs Benchmark</p>
                <p className={`text-2xl font-bold ${
                  Number(ctrPerformance) >= 100 
                    ? 'text-green-700' 
                    : Number(ctrPerformance) >= 70 
                    ? 'text-yellow-700' 
                    : 'text-red-700'
                }`}>
                  {ctrPerformance}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {Number(ctrPerformance) >= 100 
                    ? '✅ Above average for your position' 
                    : Number(ctrPerformance) >= 70
                    ? '⚠️ Slightly below average'
                    : avgPosition > 30
                    ? '📍 Improve rankings first, then CTR'
                    : '❌ Title/meta needs improvement'}
                </p>
              </div>
            </div>
            {avgPosition > 30 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>💡 Note:</strong> Your average position is {avgPosition.toFixed(1)} (page {positionPage}). 
                  At this ranking depth, low CTR is normal — less than 1% of users scroll past page 3. 
                  <strong> Focus on improving rankings before optimizing CTR.</strong>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Keyword Distribution - NEW */}
      {data && queries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Keyword Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-2xl font-bold text-green-700">{topKeywords.length}</p>
                <p className="text-xs text-green-600 font-medium">Top 7 (Page 1)</p>
                <p className="text-xs text-gray-500 mt-1">Protect these</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-2xl font-bold text-blue-700">{quickWinKeywords.length}</p>
                <p className="text-xs text-blue-600 font-medium">Pos 8-30 (Quick Wins)</p>
                <p className="text-xs text-gray-500 mt-1">Highest ROI to improve</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <p className="text-2xl font-bold text-yellow-700">{strikingKeywords.length}</p>
                <p className="text-xs text-yellow-600 font-medium">Pos 30-60 (Striking)</p>
                <p className="text-xs text-gray-500 mt-1">Need content work</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-2xl font-bold text-gray-700">{deepKeywords.length}</p>
                <p className="text-xs text-gray-600 font-medium">Pos 60+ (Deep)</p>
                <p className="text-xs text-gray-500 mt-1">Major work needed</p>
              </div>
            </div>

            {/* Quick Win Keywords List */}
            {quickWinKeywords.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  🎯 Quick Win Keywords (Positions 8-30)
                </h4>
                <div className="space-y-2">
                  {quickWinKeywords.slice(0, 5).map((kw, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-100">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          &quot;{kw.keyword}&quot;
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {kw.impressions} impressions
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">
                          {kw.clicks} clicks
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                          Pos {kw.position.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {quickWinKeywords.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{quickWinKeywords.length - 5} more quick win keywords
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Striking Distance Keywords */}
            {strikingKeywords.length > 0 && quickWinKeywords.length === 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  🎯 Striking Distance Keywords (Positions 30-60)
                </h4>
                <div className="space-y-2">
                  {strikingKeywords.slice(0, 5).map((kw, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-100">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          &quot;{kw.keyword}&quot;
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {kw.impressions} impressions
                        </span>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                        Pos {kw.position.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {quickWinKeywords.length === 0 && strikingKeywords.length === 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  No keywords in positions 8-60 yet. Keep publishing quality content — 
                  as Google discovers your pages, keywords will start appearing here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cross-link to Page Scores */}
      {data && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Page-by-Page Analysis</p>
                  <p className="text-sm text-gray-600">
                    Get specific fix recommendations for each URL
                  </p>
                </div>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  View Page Scores
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Keyword Opportunities Component */}
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

      {/* AI Insights List */}
      {!loading && insights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Recommendations
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              {insights.length} insights
            </span>
          </h2>

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
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {insight.title}
                      </h3>
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
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Ready to Generate Insights
            </h3>
            <p className="text-gray-500 text-center max-w-sm mb-4">
              Click the button below to analyze your data and generate personalized recommendations.
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
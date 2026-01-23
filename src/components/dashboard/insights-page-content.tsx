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
  ArrowRight,
  Calendar
} from "lucide-react";
import { useGSCData } from "@/hooks/useGSCData";

interface Insight {
  id: string;
  website_id: string;
  type: "opportunity" | "anomaly" | "recommendation";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  created_at: string;
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
  high: { color: "bg-red-100 text-red-700 border-red-200", label: "High Priority" },
  medium: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", label: "Medium" },
  low: { color: "bg-green-100 text-green-700 border-green-200", label: "Low" },
};

export function InsightsPageContent({ isGoogleConnected, userId }: InsightsPageContentProps) {
  const { data, sites, loading: gscLoading, isConnected, selectedSite, setSelectedSite } = useGSCData();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  // Fetch AI insights when data is available
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
              Connect your Google Search Console to get AI-powered insights about your SEO performance.
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

      {/* Loading Insights */}
      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            <span className="ml-3 text-gray-600">
              Analyzing your data with AI...
            </span>
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

            return (
              <Card
                key={insight.id}
                className={`${typeInfo.bgColor} ${typeInfo.borderColor} border hover:shadow-md transition-shadow`}
              >
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-white shadow-sm`}>
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
                      <p className="text-sm text-gray-700">
                        {insight.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* No Data State */}
      {!loading && insights.length === 0 && data && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-3 bg-gray-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {data.totals.clicks === 0 
                ? "Not Enough Data Yet" 
                : "Generating Insights..."}
            </h3>
            <p className="text-gray-500 text-center max-w-sm mb-4">
              {data.totals.clicks === 0
                ? "Your site needs more search traffic before we can generate meaningful insights. Keep creating great content!"
                : "Click the button below to generate AI insights based on your data."}
            </p>
            {data.totals.clicks > 0 && (
              <Button onClick={generateInsights} disabled={loading}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Insights
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tips for New Sites */}
      {data && data.totals.clicks === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Tips to Get Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
                <div>
                  <p className="font-medium text-gray-900">Submit your sitemap</p>
                  <p className="text-sm text-gray-500">Go to Google Search Console and submit your sitemap.xml</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</span>
                <div>
                  <p className="font-medium text-gray-900">Create quality content</p>
                  <p className="text-sm text-gray-500">Write helpful, original content that answers user questions</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</span>
                <div>
                  <p className="font-medium text-gray-900">Be patient</p>
                  <p className="text-sm text-gray-500">It can take 2-4 weeks for Google to index and rank new content</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
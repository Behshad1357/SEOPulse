"use client";

import { useState, useEffect } from "react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TrafficChart } from "@/components/dashboard/traffic-chart";
import { KeywordsTable } from "@/components/dashboard/keywords-table";
import { InsightsCard } from "@/components/dashboard/insights-card";
import { SiteSelector } from "@/components/dashboard/site-selector";
import { ConnectGoogleButton } from "@/components/dashboard/connect-google-button";
import { 
  MousePointer, 
  Eye, 
  Percent, 
  Hash, 
  RefreshCw, 
  AlertCircle,
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGSCData } from "@/hooks/useGSCData";

// Demo data for users without Google connected
const demoMetrics = {
  clicks: 12453,
  impressions: 456789,
  ctr: 0.0273,
  position: 14.2,
  clicks_change: 12.5,
  impressions_change: 8.3,
  ctr_change: 3.2,
  position_change: -2.1,
};

const demoTraffic = [
  { date: "2024-01-01", clicks: 400, impressions: 12000 },
  { date: "2024-01-02", clicks: 430, impressions: 13500 },
  { date: "2024-01-03", clicks: 448, impressions: 14200 },
  { date: "2024-01-04", clicks: 470, impressions: 15100 },
  { date: "2024-01-05", clicks: 540, impressions: 16800 },
  { date: "2024-01-06", clicks: 580, impressions: 17500 },
  { date: "2024-01-07", clicks: 620, impressions: 18900 },
  { date: "2024-01-08", clicks: 590, impressions: 18200 },
  { date: "2024-01-09", clicks: 610, impressions: 19100 },
  { date: "2024-01-10", clicks: 680, impressions: 21000 },
  { date: "2024-01-11", clicks: 720, impressions: 22500 },
  { date: "2024-01-12", clicks: 750, impressions: 23800 },
  { date: "2024-01-13", clicks: 790, impressions: 25100 },
  { date: "2024-01-14", clicks: 820, impressions: 26500 },
];

const demoKeywords = [
  { keyword: "seo tools", clicks: 1234, impressions: 45678, ctr: 0.027, position: 8.5, previous_position: 10.2, trend: "up" as const },
  { keyword: "website analytics", clicks: 987, impressions: 34567, ctr: 0.0285, position: 12.3, previous_position: 11.8, trend: "down" as const },
  { keyword: "keyword research", clicks: 876, impressions: 29876, ctr: 0.0293, position: 15.1, previous_position: 15.0, trend: "stable" as const },
  { keyword: "backlink checker", clicks: 654, impressions: 23456, ctr: 0.0279, position: 18.7, previous_position: 22.3, trend: "up" as const },
  { keyword: "rank tracker", clicks: 543, impressions: 19876, ctr: 0.0273, position: 21.2, previous_position: 19.5, trend: "down" as const },
];

const demoInsights = [
  {
    id: "1",
    website_id: "demo",
    type: "opportunity" as const,
    title: "Rising Keyword Opportunity",
    description: "The keyword 'backlink checker' improved by 3.6 positions. Consider creating more content around this topic.",
    priority: "high" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    website_id: "demo",
    type: "anomaly" as const,
    title: "Traffic Spike Detected",
    description: "Your clicks increased by 25% on Jan 10. This might be due to improved rankings for 'seo tools'.",
    priority: "medium" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    website_id: "demo",
    type: "recommendation" as const,
    title: "Improve CTR for Top Keywords",
    description: "Your CTR is below average. Consider updating meta descriptions for better click-through rates.",
    priority: "low" as const,
    created_at: new Date().toISOString(),
  },
];

interface DashboardContentProps {
  isGoogleConnected: boolean;
  hasWebsites: boolean;
  userPlan: string;
  userId: string;
}

export function DashboardContent({ 
  isGoogleConnected, 
  hasWebsites, 
  userPlan,
  userId 
}: DashboardContentProps) {
  const { 
    data, 
    sites, 
    loading, 
    error, 
    isConnected, 
    refetch, 
    selectedSite, 
    setSelectedSite 
  } = useGSCData();

  const [insights, setInsights] = useState(demoInsights);
  const [insightsLoading, setInsightsLoading] = useState(false);

  // Determine what data to show - ensure it's always a boolean
  const showRealData: boolean = !!(isConnected && data && !error);

  // Fetch AI insights when data is loaded
  useEffect(() => {
    if (showRealData && selectedSite) {
      fetchAIInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRealData, selectedSite]);

  const fetchAIInsights = async () => {
    if (!data) return;
    
    setInsightsLoading(true);
    try {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totals: data.totals,
          trends: data.trends,
          queries: data.queries.slice(0, 10),
          pages: data.pages.slice(0, 10),
          siteUrl: selectedSite,
        }),
      });

      if (response.ok) {
        const aiInsights = await response.json();
        if (aiInsights.insights && aiInsights.insights.length > 0) {
          setInsights(aiInsights.insights);
        }
      }
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      // Keep demo insights if AI fails
    } finally {
      setInsightsLoading(false);
    }
  };

  const metrics = showRealData && data ? {
    clicks: data.totals.clicks,
    impressions: data.totals.impressions,
    ctr: data.totals.ctr,
    position: data.totals.position,
    clicks_change: data.trends?.clicks?.percentage || 0,
    impressions_change: data.trends?.impressions?.percentage || 0,
    ctr_change: data.trends?.ctr?.percentage || 0,
    position_change: data.trends?.position?.percentage || 0,
  } : demoMetrics;

  const trafficData = showRealData && data ? data.trafficData.map(item => ({
    date: item.date,
    clicks: item.clicks,
    impressions: item.impressions,
  })) : demoTraffic;

  const keywords = showRealData && data ? data.queries.map(q => ({
    keyword: q.keyword,
    clicks: q.clicks,
    impressions: q.impressions,
    ctr: q.ctr,
    position: q.position,
    previous_position: q.position,
    trend: "stable" as const,
  })) : demoKeywords;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            {showRealData
              ? `Performance data for ${selectedSite || "your website"}`
              : isGoogleConnected
              ? "Loading your SEO data..."
              : "Connect Google Search Console to see your real data"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Site Selector */}
          {isConnected && sites.length > 0 && (
            <SiteSelector 
              sites={sites} 
              selectedSite={selectedSite} 
              onSelect={setSelectedSite} 
            />
          )}

          {/* Refresh Button */}
          {isConnected && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refetch}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Connection Status Banners */}
      {!isGoogleConnected && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">👋 Demo Mode</p>
              <p className="text-sm text-blue-600 mt-1">
                You&apos;re seeing sample data. Connect Google Search Console to see your real SEO metrics!
              </p>
            </div>
            <ConnectGoogleButton />
          </div>
        </div>
      )}

      {isGoogleConnected && !isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">Connection Issue</p>
              <p className="text-sm text-yellow-600">
                {error || "Unable to fetch data. Please try reconnecting your Google account."}
              </p>
            </div>
            <ConnectGoogleButton isConnected={false} />
          </div>
        </div>
      )}

      {isConnected && sites.length === 0 && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">No Sites Found</p>
              <p className="text-sm text-yellow-600">
                No websites found in your Google Search Console. Make sure you have verified properties in GSC.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading your SEO data...</span>
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && (
        <>
          {/* Date Range Indicator */}
          {showRealData && data?.dateRange && (
            <p className="text-sm text-gray-500">
              Showing data from {data.dateRange.start} to {data.dateRange.end}
            </p>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Clicks"
              value={metrics.clicks}
              change={metrics.clicks_change}
              icon={<MousePointer className="w-5 h-5" />}
            />
            <MetricCard
              title="Impressions"
              value={metrics.impressions}
              change={metrics.impressions_change}
              icon={<Eye className="w-5 h-5" />}
            />
            <MetricCard
              title="Avg. CTR"
              value={metrics.ctr}
              change={metrics.ctr_change}
              format="percentage"
              icon={<Percent className="w-5 h-5" />}
            />
            <MetricCard
              title="Avg. Position"
              value={metrics.position}
              change={metrics.position_change}
              format="position"
              icon={<Hash className="w-5 h-5" />}
            />
          </div>

          {/* Charts and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TrafficChart data={trafficData} />
            </div>
            <div>
              <InsightsCard 
                insights={insights} 
                loading={insightsLoading}
                isRealData={showRealData}
              />
            </div>
          </div>

          {/* Keywords Table */}
          <KeywordsTable 
            keywords={keywords} 
            isRealData={showRealData}
          />
        </>
      )}
    </div>
  );
}
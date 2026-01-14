import { createClient } from "@/lib/supabase/server";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TrafficChart } from "@/components/dashboard/traffic-chart";
import { KeywordsTable } from "@/components/dashboard/keywords-table";
import { InsightsCard } from "@/components/dashboard/insights-card";
import { MousePointer, Eye, Percent, Hash } from "lucide-react";

// Demo data for initial display
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
  { date: "Jan 1", clicks: 400, impressions: 12000 },
  { date: "Jan 2", clicks: 430, impressions: 13500 },
  { date: "Jan 3", clicks: 448, impressions: 14200 },
  { date: "Jan 4", clicks: 470, impressions: 15100 },
  { date: "Jan 5", clicks: 540, impressions: 16800 },
  { date: "Jan 6", clicks: 580, impressions: 17500 },
  { date: "Jan 7", clicks: 620, impressions: 18900 },
  { date: "Jan 8", clicks: 590, impressions: 18200 },
  { date: "Jan 9", clicks: 610, impressions: 19100 },
  { date: "Jan 10", clicks: 680, impressions: 21000 },
  { date: "Jan 11", clicks: 720, impressions: 22500 },
  { date: "Jan 12", clicks: 750, impressions: 23800 },
  { date: "Jan 13", clicks: 790, impressions: 25100 },
  { date: "Jan 14", clicks: 820, impressions: 26500 },
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

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's websites
  const { data: websites } = await supabase
    .from("websites")
    .select("*")
    .eq("user_id", user?.id);

  const hasWebsites = websites && websites.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          {hasWebsites
            ? "Overview of your SEO performance"
            : "Welcome! Connect a website to see your real data."}
        </p>
      </div>

      {/* Demo Banner */}
      {!hasWebsites && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>👋 Demo Mode:</strong> You're seeing sample data. Connect your Google Search Console to see your real SEO metrics!
          </p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Clicks"
          value={demoMetrics.clicks}
          change={demoMetrics.clicks_change}
          icon={<MousePointer className="w-5 h-5" />}
        />
        <MetricCard
          title="Impressions"
          value={demoMetrics.impressions}
          change={demoMetrics.impressions_change}
          icon={<Eye className="w-5 h-5" />}
        />
        <MetricCard
          title="Avg. CTR"
          value={demoMetrics.ctr}
          change={demoMetrics.ctr_change}
          format="percentage"
          icon={<Percent className="w-5 h-5" />}
        />
        <MetricCard
          title="Avg. Position"
          value={demoMetrics.position}
          change={demoMetrics.position_change}
          format="position"
          icon={<Hash className="w-5 h-5" />}
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrafficChart data={demoTraffic} />
        </div>
        <div>
          <InsightsCard insights={demoInsights} />
        </div>
      </div>

      {/* Keywords Table */}
      <KeywordsTable keywords={demoKeywords} />
    </div>
  );
}
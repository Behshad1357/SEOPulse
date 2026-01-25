"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  MousePointerClick,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";

interface GATotals {
  sessions: number;
  users: number;
  newUsers: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface GASource {
  source: string;
  sessions: number;
  users: number;
}

interface GAPage {
  path: string;
  pageViews: number;
  avgDuration: number;
  bounceRate: number;
}

interface GADashboardCardProps {
  totals: GATotals;
  sources: GASource[];
  pages: GAPage[];
}

export function GADashboardCard({ totals, sources, pages }: GADashboardCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* GA Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Users"
          value={formatNumber(totals.users)}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Sessions"
          value={formatNumber(totals.sessions)}
          icon={<MousePointerClick className="w-5 h-5" />}
          color="green"
        />
        <MetricCard
          title="Page Views"
          value={formatNumber(totals.pageViews)}
          icon={<Eye className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          title="Avg. Duration"
          value={formatDuration(totals.avgSessionDuration)}
          icon={<Clock className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Traffic Sources & Top Pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sources.length > 0 ? (
              <div className="space-y-3">
                {sources.slice(0, 5).map((source, i) => {
                  const totalSessions = sources.reduce((a, s) => a + s.sessions, 0);
                  const percentage = totalSessions > 0 
                    ? ((source.sessions / totalSessions) * 100).toFixed(1) 
                    : 0;
                  
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-900 capitalize">
                            {source.source === "(direct)" ? "Direct" : source.source}
                          </span>
                          <span className="text-gray-500">
                            {source.sessions} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No traffic source data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Top Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pages.length > 0 ? (
              <div className="space-y-2">
                {pages.slice(0, 5).map((page, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {page.path === "/" ? "Homepage" : page.path}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDuration(page.avgDuration)} avg. time
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatNumber(page.pageViews)}
                      </p>
                      <p className="text-xs text-gray-500">views</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No page data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bounce Rate & New Users */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-100">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Bounce Rate</p>
                <p className="text-2xl font-bold text-red-700">
                  {(totals.bounceRate * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                {totals.bounceRate > 0.6 ? (
                  <ArrowUpRight className="w-6 h-6 text-red-500" />
                ) : totals.bounceRate < 0.4 ? (
                  <ArrowDownRight className="w-6 h-6 text-green-500" />
                ) : (
                  <Minus className="w-6 h-6 text-yellow-500" />
                )}
              </div>
            </div>
            <p className="text-xs text-red-500 mt-2">
              {totals.bounceRate > 0.6
                ? "High - Consider improving page content"
                : totals.bounceRate < 0.4
                ? "Great! Users are engaging well"
                : "Average - Room for improvement"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">New Users</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatNumber(totals.newUsers)}
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Users className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-green-500 mt-2">
              {totals.users > 0
                ? `${((totals.newUsers / totals.users) * 100).toFixed(0)}% of total users are new`
                : "Start driving traffic to see data"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Small Metric Card Component
function MetricCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "orange";
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  const iconBgClasses = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    purple: "bg-purple-100",
    orange: "bg-orange-100",
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBgClasses[color]}`}>{icon}</div>
        <div>
          <p className="text-xs font-medium opacity-80">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
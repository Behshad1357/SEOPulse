"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb, TrendingUp, AlertTriangle, Loader2, Sparkles } from "lucide-react";

interface Insight {
  id: string;
  website_id: string;
  type: "opportunity" | "anomaly" | "recommendation";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  created_at: string;
}

interface InsightsCardProps {
  insights: Insight[];
  loading?: boolean;
  isRealData?: boolean;
}

const typeIcons = {
  opportunity: <TrendingUp className="w-4 h-4 text-green-500" />,
  anomaly: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
  recommendation: <Lightbulb className="w-4 h-4 text-blue-500" />,
};

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

export function InsightsCard({ insights, loading = false, isRealData = false }: InsightsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
          AI Insights
          {isRealData && (
            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              Live
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="ml-2 text-sm text-gray-500">Generating insights...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{typeIcons[insight.type]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {insight.title}
                      </h4>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded border ${
                          priorityColors[insight.priority]
                        }`}
                      >
                        {insight.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {insights.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Lightbulb className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No insights available yet</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
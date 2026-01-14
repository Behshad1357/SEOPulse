import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkles, AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";
import type { AIInsight } from "@/types";

interface InsightsCardProps {
  insights: AIInsight[];
}

const insightIcons = {
  summary: Sparkles,
  anomaly: AlertTriangle,
  recommendation: Lightbulb,
  opportunity: TrendingUp,
};

const priorityColors = {
  high: "border-l-red-500 bg-red-50",
  medium: "border-l-yellow-500 bg-yellow-50",
  low: "border-l-green-500 bg-green-50",
};

export function InsightsCard({ insights }: InsightsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No insights yet. Connect a website to get started!
            </p>
          ) : (
            insights.map((insight) => {
              const Icon = insightIcons[insight.type];
              return (
                <div
                  key={insight.id}
                  className={cn(
                    "p-4 rounded-lg border-l-4",
                    priorityColors[insight.priority]
                  )}
                >
                  <div className="flex items-start">
                    <Icon className="w-5 h-5 mr-3 mt-0.5 text-gray-600" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
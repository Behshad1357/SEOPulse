import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNumber, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  format?: "number" | "percentage" | "position";
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, change, format = "number", icon }: MetricCardProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0;

  // For position, lower is better
  const isPositionImproved = format === "position" ? change < 0 : change > 0;

  const formatValue = () => {
    switch (format) {
      case "percentage":
        return `${(value * 100).toFixed(2)}%`;
      case "position":
        return value.toFixed(1);
      default:
        return formatNumber(value);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
        <div className="mt-2">
          <p className="text-3xl font-bold text-gray-900">{formatValue()}</p>
          <div className="flex items-center mt-2">
            {isNeutral ? (
              <Minus className="w-4 h-4 text-gray-400" />
            ) : isPositionImproved ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={cn(
                "ml-1 text-sm font-medium",
                isNeutral && "text-gray-500",
                isPositionImproved && "text-green-600",
                !isPositionImproved && !isNeutral && "text-red-600"
              )}
            >
              {formatPercentage(Math.abs(change))}
            </span>
            <span className="ml-1 text-sm text-gray-500">vs last period</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
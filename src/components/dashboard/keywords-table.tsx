"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Search } from "lucide-react";

interface Keyword {
  keyword: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  previous_position?: number;
  trend?: "up" | "down" | "stable";
}

interface KeywordsTableProps {
  keywords: Keyword[];
  isRealData?: boolean;
}

export function KeywordsTable({ keywords, isRealData = false }: KeywordsTableProps) {
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Search className="w-5 h-5 mr-2" />
          Top Keywords
          {isRealData && (
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Live Data
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Keyword
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  Clicks
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  Impressions
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  CTR
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  Position
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((keyword, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-900 truncate max-w-[200px] block">
                      {keyword.keyword}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-gray-900">
                      {formatNumber(keyword.clicks)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-gray-600">
                      {formatNumber(keyword.impressions)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-gray-600">
                      {(keyword.ctr * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-gray-900">
                      {keyword.position.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getTrendIcon(keyword.trend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {keywords.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No keyword data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
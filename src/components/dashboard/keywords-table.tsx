import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { KeywordData } from "@/types";

interface KeywordsTableProps {
  keywords: KeywordData[];
}

export function KeywordsTable({ keywords }: KeywordsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Keywords</CardTitle>
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
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-900">
                      {keyword.keyword}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-gray-600">
                      {keyword.clicks.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-gray-600">
                      {keyword.impressions.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-gray-600">
                      {(keyword.ctr * 100).toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-gray-600">
                      {keyword.position.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      {keyword.trend === "up" && (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      )}
                      {keyword.trend === "down" && (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      {keyword.trend === "stable" && (
                        <Minus className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
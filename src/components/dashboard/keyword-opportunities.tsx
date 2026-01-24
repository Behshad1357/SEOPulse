"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, Zap } from "lucide-react";

interface Keyword {
  keyword: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface KeywordOpportunitiesProps {
  keywords: Keyword[];
}

export function KeywordOpportunities({ keywords }: KeywordOpportunitiesProps) {
  // Categorize keywords
  const quickWins = keywords.filter(k => k.position >= 8 && k.position <= 20 && k.impressions > 10);
  const lowCTR = keywords.filter(k => k.position <= 10 && k.ctr < 0.03 && k.impressions > 20);
  const topPerformers = keywords.filter(k => k.position <= 5).slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Quick Wins */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700">
            <Target className="w-4 h-4" />
            Quick Wins
          </CardTitle>
          <p className="text-xs text-green-600">
            Keywords close to page 1 (positions 8-20)
          </p>
        </CardHeader>
        <CardContent>
          {quickWins.length > 0 ? (
            <div className="space-y-2">
              {quickWins.slice(0, 5).map((kw, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate flex-1 mr-2">
                    {kw.keyword}
                  </span>
                  <span className="text-green-600 font-medium whitespace-nowrap">
                    #{kw.position.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No keywords in positions 8-20 yet. Keep creating content!
            </p>
          )}
          {quickWins.length > 0 && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="text-xs text-green-700">
                💡 These {quickWins.length} keywords need just a small push to reach page 1!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Low CTR Opportunities */}
      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-yellow-700">
            <Zap className="w-4 h-4" />
            CTR Opportunities
          </CardTitle>
          <p className="text-xs text-yellow-600">
            High ranking but low clicks
          </p>
        </CardHeader>
        <CardContent>
          {lowCTR.length > 0 ? (
            <div className="space-y-2">
              {lowCTR.slice(0, 5).map((kw, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate flex-1 mr-2">
                    {kw.keyword}
                  </span>
                  <span className="text-yellow-600 font-medium whitespace-nowrap">
                    {(kw.ctr * 100).toFixed(1)}% CTR
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No low-CTR keywords detected. Great job on your titles!
            </p>
          )}
          {lowCTR.length > 0 && (
            <div className="mt-3 pt-3 border-t border-yellow-200">
              <p className="text-xs text-yellow-700">
                💡 Improve titles & meta descriptions to increase clicks
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700">
            <TrendingUp className="w-4 h-4" />
            Top Performers
          </CardTitle>
          <p className="text-xs text-blue-600">
            Your best ranking keywords
          </p>
        </CardHeader>
        <CardContent>
          {topPerformers.length > 0 ? (
            <div className="space-y-2">
              {topPerformers.map((kw, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate flex-1 mr-2">
                    {kw.keyword}
                  </span>
                  <span className="text-blue-600 font-medium whitespace-nowrap">
                    #{kw.position.toFixed(0)} • {kw.clicks} clicks
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No top-5 rankings yet. Focus on your quick wins!
            </p>
          )}
          {topPerformers.length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-700">
                💡 Protect these rankings with fresh content updates
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
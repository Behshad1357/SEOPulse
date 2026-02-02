// src/components/dashboard/page-score-card.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  AlertCircle,
  Info,
  Zap,
  TrendingUp,
  Shield,
  Clock,
  Target
} from "lucide-react";

// Types defined locally to avoid import issues
interface PageIssue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: string;
  title: string;
  description: string;
  current: string;
  recommendation: string;
  impact: number;
  fixTime: 'quick' | 'medium' | 'long';
}

interface PageOpportunity {
  id: string;
  type: 'quick_win' | 'growth' | 'maintain';
  title: string;
  description: string;
  potentialClicks: number;
  effort: 'low' | 'medium' | 'high';
}

interface PageMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  expectedCtr: number;
  ctrGap: number;
}

interface PageScore {
  id: string;
  website_id: string;
  user_id: string;
  page_url: string;
  score: number;
  issues: PageIssue[];
  opportunities: PageOpportunity[];
  metrics: PageMetrics;
  last_analyzed: string;
  created_at: string;
  updated_at: string;
}

interface PageScoreCardProps {
  pageScore: PageScore;
  rank: number;
}

const issueTypeConfig = {
  critical: {
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  warning: {
    icon: AlertCircle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  info: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  }
};

const opportunityTypeConfig = {
  quick_win: {
    icon: Zap,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    label: 'Quick Win'
  },
  growth: {
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    label: 'Growth'
  },
  maintain: {
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    label: 'Maintain'
  }
};

const fixTimeConfig = {
  quick: { label: '<30 min', color: 'text-green-600' },
  medium: { label: '1-2 hours', color: 'text-yellow-600' },
  long: { label: '2+ hours', color: 'text-red-600' }
};

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-yellow-100';
  if (score >= 40) return 'bg-orange-100';
  return 'bg-red-100';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Needs Work';
  if (score >= 40) return 'Poor';
  return 'Critical';
}

function formatPageUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname === '/' ? 'Homepage' : urlObj.pathname;
  } catch {
    return url;
  }
}

export function PageScoreCard({ pageScore, rank }: PageScoreCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const criticalCount = pageScore.issues.filter(i => i.type === 'critical').length;
  const warningCount = pageScore.issues.filter(i => i.type === 'warning').length;
  const quickWinCount = pageScore.opportunities.filter(o => o.type === 'quick_win').length;

  return (
    <Card className={`transition-all hover:shadow-md ${
      pageScore.score < 40 ? 'border-red-200' : 
      pageScore.score < 60 ? 'border-yellow-200' : 
      'border-gray-200'
    }`}>
      <CardContent className="p-4">
        {/* Header Row */}
        <div 
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Rank */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
            {rank}
          </div>

          {/* Score Circle */}
          <div className={`flex-shrink-0 w-14 h-14 rounded-full ${getScoreBgColor(pageScore.score)} flex flex-col items-center justify-center`}>
            <span className={`text-lg font-bold ${getScoreColor(pageScore.score)}`}>
              {pageScore.score}
            </span>
            <span className={`text-[10px] ${getScoreColor(pageScore.score)}`}>
              {getScoreLabel(pageScore.score)}
            </span>
          </div>

          {/* Page Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 truncate">
                {formatPageUrl(pageScore.page_url)}
              </h3>
              <a 
                href={pageScore.page_url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-gray-400 hover:text-blue-600"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span>{pageScore.metrics.clicks} clicks</span>
              <span>{pageScore.metrics.impressions.toLocaleString()} impressions</span>
              <span>Pos {pageScore.metrics.position.toFixed(1)}</span>
              <span>{(pageScore.metrics.ctr * 100).toFixed(2)}% CTR</span>
            </div>
          </div>

          {/* Issue Summary Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {criticalCount > 0 && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                {criticalCount} critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                {warningCount} warning
              </span>
            )}
            {quickWinCount > 0 && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {quickWinCount} quick win
              </span>
            )}
          </div>

          {/* Expand Toggle */}
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
            {/* Issues */}
            {pageScore.issues.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Issues to Fix ({pageScore.issues.length})
                </h4>
                <div className="space-y-3">
                  {pageScore.issues.map((issue) => {
                    const config = issueTypeConfig[issue.type];
                    const IconComponent = config.icon;
                    const timeConfig = fixTimeConfig[issue.fixTime];

                    return (
                      <div 
                        key={issue.id}
                        className={`p-3 rounded-lg ${config.bgColor} border ${config.borderColor}`}
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className={`font-medium ${config.color}`}>{issue.title}</h5>
                              <span className={`text-xs flex items-center gap-1 ${timeConfig.color}`}>
                                <Clock className="w-3 h-3" />
                                {timeConfig.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{issue.description}</p>
                            <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">Current:</p>
                              <p className="text-sm text-gray-700">{issue.current}</p>
                            </div>
                            <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                              <p className="text-xs text-green-600 mb-1">💡 Fix:</p>
                              <p className="text-sm text-green-800">{issue.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Opportunities */}
            {pageScore.opportunities.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Opportunities ({pageScore.opportunities.length})
                </h4>
                <div className="space-y-2">
                  {pageScore.opportunities.map((opp) => {
                    const config = opportunityTypeConfig[opp.type];
                    const IconComponent = config.icon;

                    return (
                      <div 
                        key={opp.id}
                        className={`p-3 rounded-lg ${config.bgColor} flex items-start gap-3`}
                      >
                        <IconComponent className={`w-5 h-5 ${config.color} flex-shrink-0`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                              {config.label}
                            </span>
                            {opp.potentialClicks > 0 && (
                              <span className="text-xs text-green-600 font-medium">
                                +{opp.potentialClicks} potential clicks
                              </span>
                            )}
                          </div>
                          <h5 className="font-medium text-gray-900 mt-1">{opp.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{opp.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
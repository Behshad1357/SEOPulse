// src/types/page-scores.ts

export interface PageIssue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'ctr' | 'ranking' | 'content' | 'technical' | 'opportunity';
  title: string;
  description: string;
  current: string;
  recommendation: string;
  impact: number; // 1-10
  fixTime: 'quick' | 'medium' | 'long'; // <30min, 1-2hrs, 2hrs+
}

export interface PageOpportunity {
  id: string;
  type: 'quick_win' | 'growth' | 'maintain';
  title: string;
  description: string;
  potentialClicks: number;
  effort: 'low' | 'medium' | 'high';
}

export interface PageMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  expectedCtr: number;
  ctrGap: number; // difference from expected
}

export interface PageScore {
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

export interface PageScoreSummary {
  totalPages: number;
  avgScore: number;
  criticalIssues: number;
  quickWins: number;
  potentialClicks: number;
}
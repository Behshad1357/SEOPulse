// User & Auth
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: "free" | "pro" | "agency";
  created_at: string;
}

// Website/Property
export interface Website {
  id: string;
  user_id: string;
  url: string;
  name: string;
  gsc_property_id: string | null;
  ga4_property_id: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// SEO Metrics
export interface SEOMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  clicks_change: number;
  impressions_change: number;
  ctr_change: number;
  position_change: number;
}

// Keyword Data
export interface KeywordData {
  keyword: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  previous_position: number | null;
  trend: "up" | "down" | "stable";
}

// Page Data
export interface PageData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

// Traffic Data for Charts
export interface TrafficDataPoint {
  date: string;
  clicks: number;
  impressions: number;
}

// AI Insight
export interface AIInsight {
  id: string;
  website_id: string;
  type: "summary" | "anomaly" | "recommendation" | "opportunity";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  created_at: string;
}

// Dashboard Data
export interface DashboardData {
  metrics: SEOMetrics;
  traffic: TrafficDataPoint[];
  keywords: KeywordData[];
  pages: PageData[];
  insights: AIInsight[];
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Subscription Plans
export interface Plan {
  id: string;
  name: string;
  price: number;
  websites_limit: number;
  features: string[];
  stripe_price_id: string;
}

// Google OAuth Tokens
export interface GoogleTokens {
  access_token: string;
  refresh_token: string;
  expiry_date: number;
}
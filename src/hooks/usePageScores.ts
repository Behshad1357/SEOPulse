// src/hooks/usePageScores.ts
"use client";

import { useState, useCallback } from "react";
import type { PageScore, PageScoreSummary } from "@/types/page-scores";

interface UsePageScoresReturn {
  pages: PageScore[];
  summary: PageScoreSummary | null;
  loading: boolean;
  analyzing: boolean;
  error: string | null;
  plan: string;
  analyzePages: (gscPages: any[], websiteId: string, siteUrl: string) => Promise<void>;
  fetchPageScores: (websiteId: string) => Promise<void>;
}

export function usePageScores(): UsePageScoresReturn {
  const [pages, setPages] = useState<PageScore[]>([]);
  const [summary, setSummary] = useState<PageScoreSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>('free');

  const analyzePages = useCallback(async (
    gscPages: any[], 
    websiteId: string, 
    siteUrl: string
  ) => {
    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages: gscPages, websiteId, siteUrl })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze pages');
      }

      setPages(result.pages || []);
      setSummary(result.summary || null);
      setPlan(result.plan || 'free');
    } catch (err) {
      console.error('Error analyzing pages:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze pages');
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const fetchPageScores = useCallback(async (websiteId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/analyze-pages?websiteId=${websiteId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch page scores');
      }

      setPages(result.pages || []);
      
      // Calculate summary from fetched pages
      if (result.pages && result.pages.length > 0) {
        const fetchedPages = result.pages as PageScore[];
        setSummary({
          totalPages: fetchedPages.length,
          avgScore: Math.round(
            fetchedPages.reduce((acc, p) => acc + p.score, 0) / fetchedPages.length
          ),
          criticalIssues: fetchedPages.reduce((acc, p) => 
            acc + p.issues.filter(i => i.type === 'critical').length, 0),
          quickWins: fetchedPages.reduce((acc, p) => 
            acc + p.opportunities.filter(o => o.type === 'quick_win').length, 0),
          potentialClicks: fetchedPages.reduce((acc, p) => 
            acc + p.opportunities.reduce((sum, o) => sum + o.potentialClicks, 0), 0)
        });
      }
    } catch (err) {
      console.error('Error fetching page scores:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch page scores');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    pages,
    summary,
    loading,
    analyzing,
    error,
    plan,
    analyzePages,
    fetchPageScores
  };
}
// src/components/dashboard/page-opportunities.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Target,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Zap,
  Lock,
  ChevronRight
} from "lucide-react";
import { useGSCData } from "@/hooks/useGSCData";
import { PageScoreCard } from "./page-score-card";
import { SiteSelector } from "./site-selector";
import Link from "next/link";

interface PageScore {
  id: string;
  website_id: string;
  user_id: string;
  page_url: string;
  score: number;
  issues: any[];
  opportunities: any[];
  metrics: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    expectedCtr: number;
    ctrGap: number;
  };
  last_analyzed: string;
  created_at: string;
  updated_at: string;
}

interface PageScoreSummary {
  totalPages: number;
  avgScore: number;
  criticalIssues: number;
  quickWins: number;
  potentialClicks: number;
}

interface PageOpportunitiesProps {
  websiteId?: string;
}

export function PageOpportunities({ websiteId }: PageOpportunitiesProps) {
  const { 
    data, 
    sites, 
    loading: gscLoading, 
    isConnected, 
    selectedSite, 
    setSelectedSite 
  } = useGSCData();

  const [pages, setPages] = useState<PageScore[]>([]);
  const [summary, setSummary] = useState<PageScoreSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>('free');
  const [pagesData, setPagesData] = useState<any[]>([]);

  // Fetch pages data from GSC when site changes
  useEffect(() => {
    if (isConnected && selectedSite) {
      fetchPagesFromGSC();
    }
  }, [isConnected, selectedSite]);

  // Fetch existing scores on mount
  useEffect(() => {
    if (websiteId) {
      fetchPageScores(websiteId);
    }
  }, [websiteId]);

  const fetchPagesFromGSC = async () => {
    if (!selectedSite) return;
    
    setLoading(true);
    try {
      const encodedUrl = encodeURIComponent(selectedSite);
      const response = await fetch(`/api/google/search-console/pages?siteUrl=${encodedUrl}`);
      
      if (response.ok) {
        const result = await response.json();
        setPagesData(result.pages || []);
      } else {
        // Fallback: try to get pages from the main GSC data
        if (data?.pages && data.pages.length > 0) {
          setPagesData(data.pages);
        }
      }
    } catch (err) {
      console.error('Error fetching pages:', err);
      // Fallback to data.pages if available
      if (data?.pages && data.pages.length > 0) {
        setPagesData(data.pages);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPageScores = async (webId: string) => {
    try {
      const response = await fetch(`/api/analyze-pages?websiteId=${webId}`);
      const result = await response.json();

      if (response.ok && result.pages) {
        setPages(result.pages);
        calculateSummary(result.pages);
      }
    } catch (err) {
      console.error('Error fetching page scores:', err);
    }
  };

  const calculateSummary = (pageScores: PageScore[]) => {
    if (pageScores.length === 0) return;
    
    setSummary({
      totalPages: pageScores.length,
      avgScore: Math.round(
        pageScores.reduce((acc, p) => acc + p.score, 0) / pageScores.length
      ),
      criticalIssues: pageScores.reduce((acc, p) => 
        acc + p.issues.filter((i: any) => i.type === 'critical').length, 0),
      quickWins: pageScores.reduce((acc, p) => 
        acc + p.opportunities.filter((o: any) => o.type === 'quick_win').length, 0),
      potentialClicks: pageScores.reduce((acc, p) => 
        acc + p.opportunities.reduce((sum: number, o: any) => sum + (o.potentialClicks || 0), 0), 0)
    });
  };

  const handleAnalyze = async () => {
  const pagesToUse = pagesData.length > 0 ? pagesData : data?.pages;
  
  if (!pagesToUse || pagesToUse.length === 0) {
    setError('No pages data available. Make sure your site has impressions in Google Search Console.');
    return;
  }

  if (!selectedSite) {
    setError('No site selected.');
    return;
  }

  setAnalyzing(true);
  setError(null);

  try {
    // First, get or create the website record
    let currentWebsiteId = websiteId;
    
    if (!currentWebsiteId) {
      console.log('Creating website for:', selectedSite);
      
      const createResponse = await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          siteUrl: selectedSite,
          name: selectedSite.replace('sc-domain:', '').replace(/https?:\/\//, '')
        })
      });
      
      const createResult = await createResponse.json();
      console.log('Website creation result:', createResult);
      
      if (createResponse.ok && createResult.website?.id) {
        currentWebsiteId = createResult.website.id;
      } else {
        const errorMsg = createResult.details || createResult.error || 'Failed to create website';
        setError(`Website creation failed: ${errorMsg}`);
        setAnalyzing(false);
        return;
      }
    }

    console.log('Analyzing pages with websiteId:', currentWebsiteId);

    const response = await fetch('/api/analyze-pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        pages: pagesToUse, 
        websiteId: currentWebsiteId, 
        siteUrl: selectedSite 
      })
    });

    const result = await response.json();
    console.log('Analysis result:', result);

    if (!response.ok) {
      throw new Error(result.error || result.details || 'Failed to analyze pages');
    }

    setPages(result.pages || []);
    setSummary(result.summary || null);
    setPlan(result.plan || 'free');
    
    // Clear error on success
    setError(null);
    
  } catch (err) {
    console.error('Error analyzing pages:', err);
    setError(err instanceof Error ? err.message : 'Failed to analyze pages');
  } finally {
    setAnalyzing(false);
  }
};

  // Loading state
  if (gscLoading || loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading page data...</span>
        </CardContent>
      </Card>
    );
  }

  // Not connected state
  if (!isConnected) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="p-3 bg-blue-100 rounded-full mb-4">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Connect Google Search Console
          </h3>
          <p className="text-gray-500 text-center max-w-sm mb-4">
            Connect your GSC account to get page-by-page SEO scores and recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Determine available pages
  const availablePages = pagesData.length > 0 ? pagesData : (data?.pages || []);
  const hasPages = availablePages.length > 0;
  const showUpgradeMessage = plan === 'free' && availablePages.length > 5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Page Priority Scores
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            AI-powered page-by-page analysis with specific fixes
          </p>
        </div>
        <div className="flex items-center gap-3">
          {sites.length > 1 && (
            <SiteSelector
              sites={sites}
              selectedSite={selectedSite}
              onSelect={setSelectedSite}
            />
          )}
          <Button
            onClick={handleAnalyze}
            disabled={analyzing || !hasPages}
            variant={pages.length > 0 ? "outline" : "default"}
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                {pages.length > 0 ? "Re-analyze" : "Analyze Pages"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Debug Info - Remove after testing */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4 text-sm">
          <p><strong>Debug:</strong> Available pages: {availablePages.length} | Website ID: {websiteId || 'none'} | Selected Site: {selectedSite || 'none'}</p>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">{summary.totalPages}</p>
              <p className="text-xs text-blue-600">Pages Analyzed</p>
            </CardContent>
          </Card>
          <Card className={`bg-gradient-to-br ${
            summary.avgScore >= 70 ? 'from-green-50 to-green-100 border-green-200' :
            summary.avgScore >= 50 ? 'from-yellow-50 to-yellow-100 border-yellow-200' :
            'from-red-50 to-red-100 border-red-200'
          }`}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${
                summary.avgScore >= 70 ? 'text-green-700' :
                summary.avgScore >= 50 ? 'text-yellow-700' :
                'text-red-700'
              }`}>{summary.avgScore}</p>
              <p className={`text-xs ${
                summary.avgScore >= 70 ? 'text-green-600' :
                summary.avgScore >= 50 ? 'text-yellow-600' :
                'text-red-600'
              }`}>Avg Score</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-700">{summary.criticalIssues}</p>
              <p className="text-xs text-red-600">Critical Issues</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{summary.quickWins}</p>
              <p className="text-xs text-green-600">Quick Wins</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-700">+{summary.potentialClicks}</p>
              <p className="text-xs text-purple-600">Potential Clicks</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Free Plan Upgrade Banner */}
      {showUpgradeMessage && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    Analyzing {Math.min(5, availablePages.length)} of {availablePages.length} pages
                  </p>
                  <p className="text-sm text-gray-600">
                    Upgrade to Pro to analyze all your pages
                  </p>
                </div>
              </div>
              <Link href="/pricing">
                <Button size="sm">
                  Upgrade to Pro
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Scores List */}
      {pages.length > 0 ? (
        <div className="space-y-3">
          {pages.map((pageScore, index) => (
            <PageScoreCard 
              key={pageScore.id} 
              pageScore={pageScore} 
              rank={index + 1}
            />
          ))}
        </div>
      ) : hasPages ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-3 bg-blue-100 rounded-full mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Ready to Analyze
            </h3>
            <p className="text-gray-500 text-center max-w-sm mb-4">
              Found {availablePages.length} pages in Google Search Console. Click the button above to generate SEO scores and recommendations.
            </p>
            <Button onClick={handleAnalyze} disabled={analyzing}>
              <Target className="w-4 h-4 mr-2" />
              Analyze {Math.min(plan === 'free' ? 5 : 50, availablePages.length)} Pages
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-3 bg-gray-100 rounded-full mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Pages Found
            </h3>
            <p className="text-gray-500 text-center max-w-sm">
              We couldn&apos;t find any pages with data in Google Search Console. This usually means your site is new or hasn&apos;t received any impressions yet.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchPagesFromGSC}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
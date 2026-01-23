"use client";

import { useState, useEffect, useCallback } from "react";

interface GSCTotals {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface TrafficDataPoint {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface QueryData {
  keyword: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface PageData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface TrendData {
  value: number;
  percentage: number;
}

interface GSCData {
  totals: GSCTotals;
  trafficData: TrafficDataPoint[];
  queries: QueryData[];
  pages: PageData[];
  countries: any[];
  devices: any[];
  trends: {
    clicks: TrendData;
    impressions: TrendData;
    ctr: TrendData;
    position: TrendData;
  };
  dateRange: { start: string; end: string };
  siteUrl: string;
}

interface GSCSite {
  siteUrl: string;
  permissionLevel: string;
}

interface UseGSCDataReturn {
  data: GSCData | null;
  sites: GSCSite[];
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  refetch: () => void;
  selectedSite: string | null;
  setSelectedSite: (site: string) => void;
}

export function useGSCData(initialSiteUrl?: string): UseGSCDataReturn {
  const [data, setData] = useState<GSCData | null>(null);
  const [sites, setSites] = useState<GSCSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [selectedSite, setSelectedSite] = useState<string | null>(
    initialSiteUrl || null
  );

  // Fetch list of available sites
  const fetchSites = useCallback(async () => {
    try {
      const response = await fetch("/api/google/search-console");
      const result = await response.json();

      if (result.error) {
        if (
          result.code === "NOT_CONNECTED" ||
          result.code === "TOKEN_EXPIRED"
        ) {
          setIsConnected(false);
          setError(null);
        } else {
          setError(result.error);
        }
        return [];
      }

      setIsConnected(true);
      setSites(result.sites || []);

      // Auto-select first site if none selected
      if (!selectedSite && result.sites?.length > 0) {
        setSelectedSite(result.sites[0].siteUrl);
      }

      return result.sites || [];
    } catch (err) {
      console.error("Error fetching sites:", err);
      setError("Failed to fetch sites");
      return [];
    }
  }, [selectedSite]);

  // Fetch data for selected site
  const fetchSiteData = useCallback(async (siteUrl: string) => {
    if (!siteUrl) return;

    setLoading(true);
    setError(null);

    try {
      const encodedUrl = encodeURIComponent(siteUrl);
      const response = await fetch(
        `/api/google/search-console?siteUrl=${encodedUrl}`
      );
      const result = await response.json();

      if (result.error) {
        if (
          result.code === "NOT_CONNECTED" ||
          result.code === "TOKEN_EXPIRED"
        ) {
          setIsConnected(false);
          setData(null);
        } else {
          setError(result.error);
        }
        return;
      }

      setIsConnected(true);
      setData(result);
    } catch (err) {
      console.error("Error fetching GSC data:", err);
      setError("Failed to fetch search console data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load - fetch sites
  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  // Fetch data when site changes
  useEffect(() => {
    if (selectedSite) {
      fetchSiteData(selectedSite);
    } else {
      setLoading(false);
    }
  }, [selectedSite, fetchSiteData]);

  // Refetch function
  const refetch = useCallback(() => {
    if (selectedSite) {
      fetchSiteData(selectedSite);
    } else {
      fetchSites();
    }
  }, [selectedSite, fetchSiteData, fetchSites]);

  return {
    data,
    sites,
    loading,
    error,
    isConnected,
    refetch,
    selectedSite,
    setSelectedSite,
  };
}
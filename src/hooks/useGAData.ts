"use client";

import { useState, useEffect, useCallback } from "react";

interface GAProperty {
  propertyId: string;
  displayName: string;
  accountName: string;
}

interface GATrafficData {
  date: string;
  sessions: number;
  users: number;
  newUsers: number;
  bounceRate: number;
  avgSessionDuration: number;
  pageViews: number;
}

interface GASource {
  source: string;
  sessions: number;
  users: number;
}

interface GAPage {
  path: string;
  pageViews: number;
  avgDuration: number;
  bounceRate: number;
}

interface GATotals {
  sessions: number;
  users: number;
  newUsers: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface GAData {
  totals: GATotals;
  trafficData: GATrafficData[];
  sources: GASource[];
  pages: GAPage[];
  propertyId: string;
}

interface UseGADataReturn {
  data: GAData | null;
  properties: GAProperty[];
  loading: boolean;
  error: string | null;
  selectedProperty: string | null;
  setSelectedProperty: (id: string) => void;
  refetch: () => void;
}

export function useGAData(): UseGADataReturn {
  const [data, setData] = useState<GAData | null>(null);
  const [properties, setProperties] = useState<GAProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  // Fetch list of GA properties
  const fetchProperties = useCallback(async () => {
    try {
      const response = await fetch("/api/google/analytics");
      const result = await response.json();

      if (result.error) {
        if (result.error.includes("not connected")) {
          setError(null);
          setProperties([]);
        } else {
          setError(result.error);
        }
        return [];
      }

      setProperties(result.properties || []);

      // Auto-select first property
      if (!selectedProperty && result.properties?.length > 0) {
        setSelectedProperty(result.properties[0].propertyId);
      }

      return result.properties || [];
    } catch (err) {
      console.error("Error fetching GA properties:", err);
      setError("Failed to fetch analytics properties");
      return [];
    }
  }, [selectedProperty]);

  // Fetch data for selected property
  const fetchPropertyData = useCallback(async (propertyId: string) => {
    if (!propertyId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/google/analytics?propertyId=${propertyId}`
      );
      const result = await response.json();

      if (result.error) {
        setError(result.error);
        setData(null);
      } else {
        setData(result);
      }
    } catch (err) {
      console.error("Error fetching GA data:", err);
      setError("Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Fetch data when property changes
  useEffect(() => {
    if (selectedProperty) {
      fetchPropertyData(selectedProperty);
    } else {
      setLoading(false);
    }
  }, [selectedProperty, fetchPropertyData]);

  // Refetch function
  const refetch = useCallback(() => {
    if (selectedProperty) {
      fetchPropertyData(selectedProperty);
    } else {
      fetchProperties();
    }
  }, [selectedProperty, fetchPropertyData, fetchProperties]);

  return {
    data,
    properties,
    loading,
    error,
    selectedProperty,
    setSelectedProperty,
    refetch,
  };
}
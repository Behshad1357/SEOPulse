import { google } from "googleapis";
import { createAuthenticatedClient } from "./google";
import type { KeywordData, TrafficDataPoint, SEOMetrics } from "@/types";
import { calculatePercentageChange } from "./utils";

interface GSCRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export async function getSearchConsoleProperties(
  accessToken: string,
  refreshToken: string
) {
  const auth = createAuthenticatedClient(accessToken, refreshToken);
  const searchconsole = google.searchconsole({ version: "v1", auth });

  const response = await searchconsole.sites.list();
  return response.data.siteEntry || [];
}

export async function getKeywordData(
  accessToken: string,
  refreshToken: string,
  siteUrl: string,
  startDate: string,
  endDate: string
): Promise<KeywordData[]> {
  const auth = createAuthenticatedClient(accessToken, refreshToken);
  const searchconsole = google.searchconsole({ version: "v1", auth });

  try {
    const response = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 100,
      },
    });

    const rows = (response.data.rows || []) as GSCRow[];

    // Sort by clicks descending
    rows.sort((a, b) => b.clicks - a.clicks);

    return rows.map((row) => ({
      keyword: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
      previous_position: null,
      trend: "stable" as const,
    }));
  } catch (error) {
    console.error("Error fetching keyword data:", error);
    return [];
  }
}

export async function getSEOMetrics(
  accessToken: string,
  refreshToken: string,
  siteUrl: string
): Promise<{ current: SEOMetrics; traffic: TrafficDataPoint[] }> {
  const auth = createAuthenticatedClient(accessToken, refreshToken);
  const searchconsole = google.searchconsole({ version: "v1", auth });

  // Current period (last 28 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 28);

  // Previous period
  const prevEndDate = new Date(startDate);
  prevEndDate.setDate(prevEndDate.getDate() - 1);
  const prevStartDate = new Date(prevEndDate);
  prevStartDate.setDate(prevStartDate.getDate() - 28);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  try {
    const [currentResponse, previousResponse] = await Promise.all([
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ["date"],
          rowLimit: 500,
        },
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: formatDate(prevStartDate),
          endDate: formatDate(prevEndDate),
          dimensions: ["date"],
          rowLimit: 500,
        },
      }),
    ]);

    const currentRows = (currentResponse.data.rows || []) as GSCRow[];
    const previousRows = (previousResponse.data.rows || []) as GSCRow[];

    const currentTotals = currentRows.reduce(
      (acc, row) => ({
        clicks: acc.clicks + row.clicks,
        impressions: acc.impressions + row.impressions,
        ctr: acc.ctr + row.ctr,
        position: acc.position + row.position,
      }),
      { clicks: 0, impressions: 0, ctr: 0, position: 0 }
    );

    const previousTotals = previousRows.reduce(
      (acc, row) => ({
        clicks: acc.clicks + row.clicks,
        impressions: acc.impressions + row.impressions,
        ctr: acc.ctr + row.ctr,
        position: acc.position + row.position,
      }),
      { clicks: 0, impressions: 0, ctr: 0, position: 0 }
    );

    const currentAvgCtr = currentRows.length > 0 ? currentTotals.ctr / currentRows.length : 0;
    const currentAvgPosition = currentRows.length > 0 ? currentTotals.position / currentRows.length : 0;
    const previousAvgCtr = previousRows.length > 0 ? previousTotals.ctr / previousRows.length : 0;
    const previousAvgPosition = previousRows.length > 0 ? previousTotals.position / previousRows.length : 0;

    const traffic: TrafficDataPoint[] = currentRows.map((row) => ({
      date: new Date(row.keys[0]).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      clicks: row.clicks,
      impressions: row.impressions,
    }));

    return {
      current: {
        clicks: currentTotals.clicks,
        impressions: currentTotals.impressions,
        ctr: currentAvgCtr,
        position: currentAvgPosition,
        clicks_change: calculatePercentageChange(currentTotals.clicks, previousTotals.clicks),
        impressions_change: calculatePercentageChange(currentTotals.impressions, previousTotals.impressions),
        ctr_change: calculatePercentageChange(currentAvgCtr, previousAvgCtr),
        position_change: calculatePercentageChange(currentAvgPosition, previousAvgPosition),
      },
      traffic,
    };
  } catch (error) {
    console.error("Error fetching SEO metrics:", error);
    return {
      current: {
        clicks: 0,
        impressions: 0,
        ctr: 0,
        position: 0,
        clicks_change: 0,
        impressions_change: 0,
        ctr_change: 0,
        position_change: 0,
      },
      traffic: [],
    };
  }
}
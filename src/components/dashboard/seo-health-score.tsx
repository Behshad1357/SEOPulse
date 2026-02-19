// src/components/dashboard/seo-health-score.tsx
"use client";

import { useEffect, useState } from "react";

interface SEOHealthScoreProps {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

const EXPECTED_CTR: Record<number, number> = {
  1: 0.319, 2: 0.246, 3: 0.185, 4: 0.133, 5: 0.095,
  6: 0.068, 7: 0.051, 8: 0.036, 9: 0.028, 10: 0.023,
};

function getExpectedCTR(position: number): number {
  if (position > 100) return 0.0001;
  if (position > 50) return 0.0005;
  if (position > 30) return 0.001;
  if (position > 20) return 0.002;
  const rounded = Math.min(Math.max(Math.round(position), 1), 10);
  return EXPECTED_CTR[rounded] || 0.003;
}

export function SEOHealthScore({
  clicks,
  impressions,
  ctr,
  position,
}: SEOHealthScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const calculateScore = () => {
    let score = 0;

    // Position Score (max 30 points) — most important
    if (position > 0 && position <= 3) score += 30;
    else if (position <= 5) score += 25;
    else if (position <= 10) score += 20;
    else if (position <= 20) score += 15;
    else if (position <= 30) score += 10;
    else if (position <= 50) score += 5;
    else score += 2;

    // CTR Score RELATIVE to position (max 25 points)
    const expectedCTR = getExpectedCTR(position);
    const ctrRatio = expectedCTR > 0 ? ctr / expectedCTR : 0;
    
    if (ctrRatio >= 1.5) score += 25;
    else if (ctrRatio >= 1.0) score += 20;
    else if (ctrRatio >= 0.7) score += 15;
    else if (ctrRatio >= 0.3) score += 8;
    else if (ctr > 0) score += 3;
    else {
      // 0% CTR — but don't penalize harshly if position is deep
      if (position > 50) score += 5; // expected at deep positions
      else if (position > 20) score += 2;
      else score += 0; // 0 CTR on page 1-2 is a real problem
    }

    // Impressions Score (max 25 points) — shows Google considers you relevant
    if (impressions >= 10000) score += 25;
    else if (impressions >= 5000) score += 22;
    else if (impressions >= 1000) score += 18;
    else if (impressions >= 500) score += 14;
    else if (impressions >= 100) score += 10;
    else if (impressions >= 20) score += 6;
    else if (impressions > 0) score += 3;

    // Clicks Score (max 20 points) — actual engagement
    if (clicks >= 1000) score += 20;
    else if (clicks >= 500) score += 18;
    else if (clicks >= 100) score += 15;
    else if (clicks >= 50) score += 12;
    else if (clicks >= 10) score += 8;
    else if (clicks >= 1) score += 4;
    else score += 0;

    return Math.min(100, Math.max(0, score));
  };

  const score = calculateScore();
  const expectedCTR = getExpectedCTR(position);
  const ctrRatio = expectedCTR > 0 ? ctr / expectedCTR : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedScore((prev) => {
          if (prev >= score) {
            clearInterval(interval);
            return score;
          }
          return prev + 1;
        });
      }, 20);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (s: number) => {
    if (s >= 80) return { color: "#22c55e", label: "Excellent", bg: "bg-green-500" };
    if (s >= 60) return { color: "#84cc16", label: "Good", bg: "bg-lime-500" };
    if (s >= 40) return { color: "#eab308", label: "Fair", bg: "bg-yellow-500" };
    if (s >= 20) return { color: "#f97316", label: "Needs Work", bg: "bg-orange-500" };
    return { color: "#ef4444", label: "Critical", bg: "bg-red-500" };
  };

  const scoreInfo = getScoreColor(animatedScore);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Position-aware CTR label
  const getCTRLabel = () => {
    if (position > 50) return "Expected at this depth";
    if (ctrRatio >= 1.2) return "Above average for position";
    if (ctrRatio >= 0.7) return "Normal for position";
    if (ctr > 0) return "Below average for position";
    return position > 20 ? "Normal at this depth" : "Needs improvement";
  };

  // Position label
  const getPositionLabel = () => {
    if (position <= 3) return "Excellent — Top 3";
    if (position <= 10) return "Good — Page 1";
    if (position <= 20) return "Close — Page 2";
    if (position <= 50) return `Page ${Math.ceil(position / 10)} — Needs work`;
    return `Page ${Math.ceil(position / 10)} — Major work needed`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Health Score</h3>

      <div className="flex items-center gap-8">
        {/* Circular Progress */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64" cy="64" r="45"
              stroke="#e5e7eb" strokeWidth="10" fill="none"
            />
            <circle
              cx="64" cy="64" r="45"
              stroke={scoreInfo.color}
              strokeWidth="10" fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{animatedScore}</span>
            <span className="text-xs text-gray-500">out of 100</span>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="flex-1">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${scoreInfo.bg} mb-3`}>
            {scoreInfo.label}
          </div>

          <div className="space-y-2">
            <ScoreBreakdownItem
              label="Average Position"
              value={position > 0 ? `${position.toFixed(1)} (${getPositionLabel()})` : "N/A"}
              score={position <= 3 ? 100 : position <= 10 ? 70 : position <= 20 ? 50 : position <= 50 ? 20 : 5}
            />
            <ScoreBreakdownItem
              label="Click-Through Rate"
              value={`${(ctr * 100).toFixed(2)}% (${getCTRLabel()})`}
              score={ctrRatio >= 1.5 ? 100 : ctrRatio >= 1.0 ? 80 : ctrRatio >= 0.7 ? 60 : ctr > 0 ? 30 : position > 50 ? 20 : 0}
            />
            <ScoreBreakdownItem
              label="Visibility"
              value={`${impressions.toLocaleString()} impressions`}
              score={impressions >= 5000 ? 100 : impressions >= 1000 ? 70 : impressions >= 100 ? 40 : impressions > 0 ? 15 : 0}
            />
            <ScoreBreakdownItem
              label="Engagement"
              value={`${clicks.toLocaleString()} clicks`}
              score={clicks >= 100 ? 100 : clicks >= 10 ? 60 : clicks > 0 ? 20 : 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBreakdownItem({
  label,
  value,
  score,
}: {
  label: string;
  value: string;
  score: number;
}) {
  const getBarColor = (s: number) => {
    if (s >= 80) return "bg-green-500";
    if (s >= 50) return "bg-yellow-500";
    if (s >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{label}</span>
          <span className="font-medium text-gray-900 text-xs">{value}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${getBarColor(score)} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}
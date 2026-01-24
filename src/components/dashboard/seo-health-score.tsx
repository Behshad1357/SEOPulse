"use client";

import { useEffect, useState } from "react";

interface SEOHealthScoreProps {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  pagesIndexed?: number;
}

export function SEOHealthScore({
  clicks,
  impressions,
  ctr,
  position,
}: SEOHealthScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Calculate SEO Health Score (0-100)
  const calculateScore = () => {
    let score = 0;

    // CTR Score (max 25 points)
    // Average CTR is ~2%, excellent is >5%
    const ctrPercent = ctr * 100;
    if (ctrPercent >= 5) score += 25;
    else if (ctrPercent >= 3) score += 20;
    else if (ctrPercent >= 2) score += 15;
    else if (ctrPercent >= 1) score += 10;
    else if (ctrPercent > 0) score += 5;

    // Position Score (max 25 points)
    // Position 1-3 is excellent, 4-10 is good
    if (position > 0 && position <= 3) score += 25;
    else if (position <= 5) score += 20;
    else if (position <= 10) score += 15;
    else if (position <= 20) score += 10;
    else if (position <= 50) score += 5;

    // Impressions Score (max 25 points)
    // Shows visibility
    if (impressions >= 10000) score += 25;
    else if (impressions >= 5000) score += 20;
    else if (impressions >= 1000) score += 15;
    else if (impressions >= 100) score += 10;
    else if (impressions > 0) score += 5;

    // Clicks Score (max 25 points)
    // Shows engagement
    if (clicks >= 1000) score += 25;
    else if (clicks >= 500) score += 20;
    else if (clicks >= 100) score += 15;
    else if (clicks >= 10) score += 10;
    else if (clicks > 0) score += 5;

    return Math.min(100, Math.max(0, score));
  };

  const score = calculateScore();

  // Animate score on mount
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

  // Get color based on score
  const getScoreColor = (s: number) => {
    if (s >= 80) return { color: "#22c55e", label: "Excellent", bg: "bg-green-500" };
    if (s >= 60) return { color: "#84cc16", label: "Good", bg: "bg-lime-500" };
    if (s >= 40) return { color: "#eab308", label: "Fair", bg: "bg-yellow-500" };
    if (s >= 20) return { color: "#f97316", label: "Needs Work", bg: "bg-orange-500" };
    return { color: "#ef4444", label: "Critical", bg: "bg-red-500" };
  };

  const scoreInfo = getScoreColor(animatedScore);

  // Calculate stroke dashoffset for circular progress
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Health Score</h3>
      
      <div className="flex items-center gap-8">
        {/* Circular Progress */}
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="10"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke={scoreInfo.color}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Score text in center */}
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
              label="Click-Through Rate" 
              value={`${(ctr * 100).toFixed(2)}%`}
              score={ctr >= 0.05 ? 100 : ctr >= 0.02 ? 60 : ctr > 0 ? 30 : 0}
            />
            <ScoreBreakdownItem 
              label="Average Position" 
              value={position > 0 ? position.toFixed(1) : "N/A"}
              score={position <= 10 ? 100 : position <= 20 ? 60 : position <= 50 ? 30 : 0}
            />
            <ScoreBreakdownItem 
              label="Visibility" 
              value={`${impressions.toLocaleString()} impressions`}
              score={impressions >= 1000 ? 100 : impressions >= 100 ? 60 : impressions > 0 ? 30 : 0}
            />
            <ScoreBreakdownItem 
              label="Engagement" 
              value={`${clicks.toLocaleString()} clicks`}
              score={clicks >= 100 ? 100 : clicks >= 10 ? 60 : clicks > 0 ? 30 : 0}
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
  score 
}: { 
  label: string; 
  value: string; 
  score: number;
}) {
  const getBarColor = (s: number) => {
    if (s >= 80) return "bg-green-500";
    if (s >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{label}</span>
          <span className="font-medium text-gray-900">{value}</span>
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
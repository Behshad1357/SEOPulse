"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, ChevronRight, Trophy } from "lucide-react";

interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  impact: "high" | "medium" | "low";
}

const defaultChecklist: ChecklistItem[] = [
  {
    id: "sitemap",
    category: "Technical",
    task: "Submit sitemap to Google Search Console",
    description: "Helps Google discover all your pages faster",
    difficulty: "easy",
    impact: "high",
  },
  {
    id: "meta-titles",
    category: "On-Page",
    task: "Optimize title tags for top 5 pages",
    description: "Include target keyword, keep under 60 characters",
    difficulty: "easy",
    impact: "high",
  },
  {
    id: "meta-descriptions",
    category: "On-Page",
    task: "Write compelling meta descriptions",
    description: "Include call-to-action, keep under 155 characters",
    difficulty: "easy",
    impact: "medium",
  },
  {
    id: "h1-tags",
    category: "On-Page",
    task: "Ensure each page has one H1 tag",
    description: "H1 should include your primary keyword",
    difficulty: "easy",
    impact: "medium",
  },
  {
    id: "internal-links",
    category: "On-Page",
    task: "Add internal links between related pages",
    description: "Helps users and search engines navigate your site",
    difficulty: "medium",
    impact: "high",
  },
  {
    id: "mobile-friendly",
    category: "Technical",
    task: "Test mobile-friendliness",
    description: "Use Google's Mobile-Friendly Test tool",
    difficulty: "easy",
    impact: "high",
  },
  {
    id: "page-speed",
    category: "Technical",
    task: "Improve page load speed",
    description: "Aim for under 3 seconds load time",
    difficulty: "hard",
    impact: "high",
  },
  {
    id: "https",
    category: "Technical",
    task: "Ensure HTTPS is enabled",
    description: "Security is a ranking factor",
    difficulty: "medium",
    impact: "medium",
  },
  {
    id: "alt-text",
    category: "On-Page",
    task: "Add alt text to all images",
    description: "Describe images for accessibility and SEO",
    difficulty: "easy",
    impact: "low",
  },
  {
    id: "content-length",
    category: "Content",
    task: "Create comprehensive content",
    description: "Aim for 1,500+ words for competitive topics",
    difficulty: "hard",
    impact: "high",
  },
];

interface SEOChecklistProps {
  siteUrl: string;
}

export function SEOChecklist({ siteUrl }: SEOChecklistProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const storageKey = `seo-checklist-${siteUrl}`;

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setCompletedTasks(new Set(JSON.parse(saved)));
    }
  }, [storageKey]);

  // Save progress
  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      localStorage.setItem(storageKey, JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const progress = (completedTasks.size / defaultChecklist.length) * 100;
  const completedCount = completedTasks.size;
  const totalCount = defaultChecklist.length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-purple-600 bg-purple-100";
      case "medium": return "text-blue-600 bg-blue-100";
      case "low": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  // Group by category
  const categories = defaultChecklist.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              SEO Checklist
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Track your SEO progress
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {completedCount}/{totalCount}
            </div>
            <div className="text-sm text-gray-500">completed</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>0%</span>
            <span>{progress.toFixed(0)}% Complete</span>
            <span>100%</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                {category}
              </h4>
              <div className="space-y-2 ml-6">
                {items.map((item) => {
                  const isCompleted = completedTasks.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        isCompleted
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                      }`}
                      onClick={() => toggleTask(item.id)}
                    >
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${isCompleted ? "line-through text-gray-400" : "text-gray-900"}`}>
                          {item.task}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyColor(item.difficulty)}`}>
                            {item.difficulty}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${getImpactColor(item.impact)}`}>
                            {item.impact} impact
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
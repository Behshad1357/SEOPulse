// src/components/dashboard/seo-checklist.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, ChevronRight, ChevronDown, Trophy, ExternalLink } from "lucide-react";

interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  impact: "high" | "medium" | "low";
  howTo?: string;
  link?: string;
}

const getChecklist = (siteUrl: string): ChecklistItem[] => {
  const domain = siteUrl
    .replace('sc-domain:', '')
    .replace(/https?:\/\//, '')
    .replace(/\/$/, '');

  return [
    // Technical - Critical
    {
      id: "sitemap",
      category: "Technical (Do First)",
      task: "Submit sitemap to Google Search Console",
      description: "Helps Google discover all your pages faster",
      difficulty: "easy",
      impact: "high",
      howTo: `Go to GSC → Sitemaps → Enter "${domain}/sitemap.xml" → Submit. If you don't have a sitemap, add a sitemap.ts file to your Next.js app.`,
      link: "https://search.google.com/search-console",
    },
    {
      id: "robots",
      category: "Technical (Do First)",
      task: "Add robots.txt file",
      description: "Tells Google what to crawl and what to skip",
      difficulty: "easy",
      impact: "high",
      howTo: `Create src/app/robots.ts. Allow "/" and disallow "/dashboard/", "/api/", "/auth/". Include your sitemap URL.`,
    },
    {
      id: "indexing",
      category: "Technical (Do First)",
      task: "Request indexing for important pages",
      description: "Manually ask Google to crawl your key pages",
      difficulty: "easy",
      impact: "high",
      howTo: `In GSC → URL Inspection → paste each important URL → click "Request Indexing". Do this for homepage, blog posts, and pricing page.`,
      link: "https://search.google.com/search-console",
    },
    {
      id: "https",
      category: "Technical (Do First)",
      task: "Verify HTTPS is working",
      description: "Security is a confirmed ranking factor",
      difficulty: "easy",
      impact: "medium",
      howTo: `Visit https://${domain} — if the padlock icon shows, you're good. If not, enable HTTPS in your hosting provider settings.`,
    },
    {
      id: "mobile",
      category: "Technical (Do First)",
      task: "Test mobile-friendliness",
      description: "Google uses mobile-first indexing",
      difficulty: "easy",
      impact: "high",
      howTo: `Go to Google's Mobile-Friendly Test, enter ${domain}, and fix any issues it finds.`,
      link: "https://search.google.com/test/mobile-friendly",
    },
    {
      id: "speed",
      category: "Technical (Do First)",
      task: "Test and improve page speed",
      description: "Aim for under 3 seconds load time, LCP under 2.5s",
      difficulty: "hard",
      impact: "high",
      howTo: `Test at PageSpeed Insights. Focus on: optimize images (use WebP), enable caching, minimize JS. For Next.js: use next/image, dynamic imports.`,
      link: "https://pagespeed.web.dev/",
    },

    // On-Page
    {
      id: "titles",
      category: "On-Page SEO",
      task: `Optimize title tags for all pages on ${domain}`,
      description: "Include target keyword, keep under 60 characters",
      difficulty: "easy",
      impact: "high",
      howTo: `Format: "Primary Keyword — Secondary Benefit | Brand". Example: "What is Google Search Console? Complete Guide [2026] | SEOPulse"`,
    },
    {
      id: "meta-desc",
      category: "On-Page SEO",
      task: "Write unique meta descriptions for every page",
      description: "155 chars max, include keyword and clear CTA",
      difficulty: "easy",
      impact: "medium",
      howTo: `Start with an action verb: "Learn...", "Discover...", "Get...". Include your keyword naturally. End with a reason to click.`,
    },
    {
      id: "h1",
      category: "On-Page SEO",
      task: "Ensure each page has exactly one H1 tag",
      description: "H1 should include your primary keyword",
      difficulty: "easy",
      impact: "medium",
      howTo: `Every page needs one <h1> tag that clearly describes the page content and includes the main keyword. Don't use multiple H1s.`,
    },
    {
      id: "internal-links",
      category: "On-Page SEO",
      task: "Add internal links between all pages",
      description: "Every page should link to 2-3 other relevant pages",
      difficulty: "medium",
      impact: "high",
      howTo: `In each blog post, link to other blog posts using descriptive anchor text (not "click here"). Add a "Related Articles" section at the bottom of each post.`,
    },
    {
      id: "schema",
      category: "On-Page SEO",
      task: "Add structured data (Schema markup)",
      description: "Enables rich snippets in search results",
      difficulty: "medium",
      impact: "high",
      howTo: `Add JSON-LD schema to your pages. For articles: Article schema. For FAQs: FAQPage schema. For your app: SoftwareApplication schema. Test at Google's Rich Results Test.`,
      link: "https://search.google.com/test/rich-results",
    },
    {
      id: "alt-text",
      category: "On-Page SEO",
      task: "Add alt text to all images",
      description: "Describe images for accessibility and image search",
      difficulty: "easy",
      impact: "low",
      howTo: `Every <img> should have an alt attribute describing the image. Include keywords naturally but don't stuff them.`,
    },

    // Content
    {
      id: "content-depth",
      category: "Content",
      task: "Expand thin content to 1,500+ words",
      description: "Comprehensive content ranks better for competitive keywords",
      difficulty: "hard",
      impact: "high",
      howTo: `Check each blog post's word count. If under 1500 words, expand with: more subtopics, FAQ sections, examples, data, and related questions from "People Also Ask".`,
    },
    {
      id: "content-freshness",
      category: "Content",
      task: "Update all content with current year [2026]",
      description: "Fresh content signals relevance to Google",
      difficulty: "easy",
      impact: "medium",
      howTo: `Add "[2026]" or "[Updated 2026]" to titles. Update any outdated statistics or references. Change the publish date after significant updates.`,
    },
    {
      id: "new-content",
      category: "Content",
      task: "Create 2 new blog posts per month",
      description: "Consistent publishing builds topical authority",
      difficulty: "hard",
      impact: "high",
      howTo: `Target keywords your audience searches for. Use Google autocomplete and "People Also Ask" for ideas. Make each post the best resource on that specific topic.`,
    },
  ];
};

interface SEOChecklistProps {
  siteUrl: string;
}

export function SEOChecklist({ siteUrl }: SEOChecklistProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const storageKey = `seo-checklist-${siteUrl}`;

  const checklist = getChecklist(siteUrl);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setCompletedTasks(new Set(JSON.parse(saved)));
    }
  }, [storageKey]);

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

  const toggleExpanded = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const progress = (completedTasks.size / checklist.length) * 100;
  const completedCount = completedTasks.size;
  const totalCount = checklist.length;

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
  const categories = checklist.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  // Calculate per-category progress
  const getCategoryProgress = (items: ChecklistItem[]) => {
    const done = items.filter(i => completedTasks.has(i.id)).length;
    return { done, total: items.length };
  };

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
              Track your SEO progress — click items to expand how-to guides
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

        {/* Celebration */}
        {completedCount === totalCount && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-700 font-medium">🎉 All tasks completed! Your SEO foundation is solid.</p>
            <p className="text-green-600 text-sm mt-1">
              Now focus on creating content and building backlinks consistently.
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {Object.entries(categories).map(([category, items]) => {
            const catProgress = getCategoryProgress(items);
            const isCollapsed = collapsedCategories.has(category);

            return (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 mb-2 hover:text-gray-900 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    {category}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    catProgress.done === catProgress.total
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {catProgress.done}/{catProgress.total}
                  </span>
                </button>

                {!isCollapsed && (
                  <div className="space-y-2 ml-2">
                    {items.map((item) => {
                      const isCompleted = completedTasks.has(item.id);
                      const isExpanded = expandedTasks.has(item.id);

                      return (
                        <div
                          key={item.id}
                          className={`rounded-lg border transition-all ${
                            isCompleted
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <div
                            className="flex items-start gap-3 p-3 cursor-pointer"
                            onClick={() => toggleTask(item.id)}
                          >
                            <div className="mt-0.5 flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-300" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium text-sm ${
                                isCompleted ? "line-through text-gray-400" : "text-gray-900"
                              }`}>
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

                            {/* How-to toggle */}
                            {item.howTo && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpanded(item.id);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex-shrink-0 mt-1"
                              >
                                {isExpanded ? "Hide" : "How?"}
                              </button>
                            )}
                          </div>

                          {/* Expandable How-To */}
                          {isExpanded && item.howTo && (
                            <div className="px-3 pb-3 ml-8">
                              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <p className="text-sm text-blue-800">
                                  <strong>How to do this:</strong> {item.howTo}
                                </p>
                                {item.link && (
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Open tool
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
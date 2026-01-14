import { createClient } from "@/lib/supabase/server";
import { InsightsCard } from "@/components/dashboard/insights-card";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's websites
  const { data: websites } = await supabase
    .from("websites")
    .select("id")
    .eq("user_id", user?.id);

  const websiteIds = websites?.map((w) => w.id) || [];

  // Get insights for user's websites
  const { data: insights } = await supabase
    .from("ai_insights")
    .select("*")
    .in("website_id", websiteIds.length > 0 ? websiteIds : ["none"])
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
        <p className="text-gray-500 mt-1">
          AI-powered recommendations to improve your SEO
        </p>
      </div>

      {/* Insights */}
      {insights && insights.length > 0 ? (
        <div className="max-w-3xl">
          <InsightsCard insights={insights} />
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-3 bg-blue-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No insights yet</h3>
            <p className="text-gray-500 text-center max-w-sm">
              Connect your Google Search Console to get AI-powered insights about your SEO performance.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
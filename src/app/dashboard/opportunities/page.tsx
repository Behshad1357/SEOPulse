import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageOpportunities } from "@/components/dashboard/page-opportunities";

export default async function OpportunitiesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's websites
  const { data: websites } = await supabase
    .from("websites")
    .select("id, url, name")
    .eq("user_id", user.id);

  const firstWebsiteId = websites?.[0]?.id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Page Priority Scores</h1>
        <p className="text-gray-500 mt-1">
          AI-powered page-by-page analysis with specific fix recommendations
        </p>
      </div>
      <PageOpportunities websiteId={firstWebsiteId} />
    </div>
  );
}
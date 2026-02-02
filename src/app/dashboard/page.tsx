import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's profile to check Google connection
  const { data: profile } = await supabase
    .from("profiles")
    .select("google_access_token, google_refresh_token, plan")
    .eq("id", user?.id)
    .single();

  // Get user's websites
  const { data: websites } = await supabase
    .from("websites")
    .select("*")
    .eq("user_id", user?.id);

  const isGoogleConnected = !!profile?.google_refresh_token;
  const hasWebsites = !!(websites && websites.length > 0);
  const userPlan = profile?.plan || "free";
  const firstWebsiteId = websites?.[0]?.id;
  
  return (
    <DashboardContent 
      isGoogleConnected={isGoogleConnected}
      hasWebsites={hasWebsites}
      userPlan={userPlan}
      userId={user?.id || ""}
      websiteId={firstWebsiteId}
    />
  );
}
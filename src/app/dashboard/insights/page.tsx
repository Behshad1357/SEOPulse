import { createClient } from "@/lib/supabase/server";
import { InsightsPageContent } from "@/components/dashboard/insights-page-content";

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Check if Google is connected
  const { data: profile } = await supabase
    .from("profiles")
    .select("google_refresh_token")
    .eq("id", user?.id)
    .single();

  const isGoogleConnected = !!profile?.google_refresh_token;

  return (
    <InsightsPageContent 
      isGoogleConnected={isGoogleConnected}
      userId={user?.id || ""}
    />
  );
}
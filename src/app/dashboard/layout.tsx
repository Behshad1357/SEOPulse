import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { TrialBanner } from "@/components/dashboard/trial-banner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Check trial status for free users
  if (profile?.plan === "free" && profile?.trial_ends_at) {
    const trialEndDate = new Date(profile.trial_ends_at);
    const now = new Date();
    
    // If trial has expired, redirect to upgrade page
    if (now > trialEndDate) {
      redirect("/trial-expired");
    }
  }

  // Calculate days remaining in trial
  let daysRemaining = 0;
  let showTrialBanner = false;
  
  if (profile?.plan === "free" && profile?.trial_ends_at) {
    const trialEndDate = new Date(profile.trial_ends_at);
    const now = new Date();
    const diffTime = trialEndDate.getTime() - now.getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    showTrialBanner = daysRemaining <= 7 && daysRemaining > 0;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Trial Warning Banner */}
      {showTrialBanner && (
        <TrialBanner daysRemaining={daysRemaining} />
      )}
      
      {/* Top Navigation */}
      <DashboardNav user={user} profile={profile} />

      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className={`flex-1 p-6 lg:p-8 ml-0 lg:ml-64 ${showTrialBanner ? 'mt-28' : 'mt-16'}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
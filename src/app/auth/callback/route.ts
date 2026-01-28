import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user profile exists and set trial_ends_at if needed
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, trial_ends_at, created_at")
        .eq("id", data.user.id)
        .single();

      // If profile exists but trial_ends_at is not set, set it now
      if (profile && !profile.trial_ends_at) {
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 days from now

        await supabase
          .from("profiles")
          .update({ 
            trial_ends_at: trialEndDate.toISOString(),
            created_at: profile.created_at || new Date().toISOString()
          })
          .eq("id", data.user.id);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
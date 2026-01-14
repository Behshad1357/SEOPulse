import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTokensFromCode } from "@/lib/google";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/settings?error=no_code", request.url));
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const tokens = await getTokensFromCode(code);

    // Save tokens to profile
    await supabase
      .from("profiles")
      .update({
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token,
        google_token_expiry: tokens.expiry_date,
      })
      .eq("id", user.id);

    return NextResponse.redirect(new URL("/dashboard/settings?success=connected", request.url));
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(new URL("/dashboard/settings?error=oauth_failed", request.url));
  }
}
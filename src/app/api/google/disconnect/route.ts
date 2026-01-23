import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Clear Google tokens from profile
    const { error } = await supabase
      .from("profiles")
      .update({
        google_access_token: null,
        google_refresh_token: null,
        google_token_expiry: null,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Disconnect error:", error);
      return NextResponse.json(
        { error: "Failed to disconnect Google account" },
        { status: 500 }
      );
    }

    // Optionally: Revoke the token with Google (good practice)
    // This prevents the token from being used even if someone had access to it
    // Note: This is optional but recommended for security

    return NextResponse.json({
      success: true,
      message: "Google account disconnected successfully",
    });
  } catch (error) {
    console.error("Disconnect error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
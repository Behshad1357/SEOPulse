import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSearchConsoleProperties } from "@/lib/search-console";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("google_access_token, google_refresh_token")
      .eq("id", user.id)
      .single();

    if (!profile?.google_access_token || !profile?.google_refresh_token) {
      return NextResponse.json({ error: "Google not connected" }, { status: 400 });
    }

    const properties = await getSearchConsoleProperties(
      profile.google_access_token,
      profile.google_refresh_token
    );

    return NextResponse.json({ properties });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}
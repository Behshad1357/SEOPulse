import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEffectivePlan } from "@/lib/admin-users";

export async function POST(request: Request) {
  try {
    const { websiteId } = await request.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has pro plan (with admin bypass)
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const effectivePlan = getEffectivePlan(user?.email, profile?.plan);

    if (effectivePlan === "free") {
      return NextResponse.json(
        { error: "PDF reports require Pro plan" },
        { status: 403 }
      );
    }

    // Get website data
    const { data: website } = await supabase
      .from("websites")
      .select("*")
      .eq("id", websiteId)
      .eq("user_id", user.id)
      .single();

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    // For now, return a simple report structure
    const report = {
      generated_at: new Date().toISOString(),
      website: website.name,
      url: website.url,
      summary: "PDF report generation coming soon!",
    };

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { email, source = "blog" } = await request.json();

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Insert into database
    const { error } = await supabaseAdmin
      .from("subscribers")
      .upsert(
        { 
          email: normalizedEmail, 
          source,
          subscribed_at: new Date().toISOString(),
          status: "active"
        },
        { onConflict: "email" }
      );

    if (error) {
      console.error("Newsletter signup error:", error);
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
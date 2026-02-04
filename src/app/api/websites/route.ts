// src/app/api/websites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { siteUrl, name } = body;

    if (!siteUrl) {
      return NextResponse.json({ error: "Site URL required" }, { status: 400 });
    }

    const adminClient = getAdminClient();

    // Check if website already exists
    const { data: existingWebsite } = await adminClient
      .from('websites')
      .select('id, url, name, gsc_property_id')
      .eq('user_id', user.id)
      .eq('gsc_property_id', siteUrl)
      .maybeSingle();

    if (existingWebsite) {
      return NextResponse.json({ website: existingWebsite, existing: true });
    }

    // Create new website
    const websiteData = {
      user_id: user.id,
      url: siteUrl.replace('sc-domain:', 'https://').replace(/\/$/, ''),
      name: name || siteUrl.replace('sc-domain:', '').replace(/https?:\/\//, '').replace(/\/$/, ''),
      gsc_property_id: siteUrl,
      is_verified: true,
    };

    const { data: newWebsite, error: insertError } = await adminClient
      .from('websites')
      .insert(websiteData)
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ 
        error: "Failed to create website", 
        details: insertError.message 
      }, { status: 500 });
    }

    return NextResponse.json({ website: newWebsite, created: true });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = getAdminClient();

    const { data: websites, error } = await adminClient
      .from('websites')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch websites" }, { status: 500 });
    }

    return NextResponse.json({ websites: websites || [] });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
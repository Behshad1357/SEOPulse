// src/app/api/websites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getUserFromCookies(): Promise<{ userId: string } | null> {
  try {
    const cookieStore = await cookies();
    const possibleCookieNames = [
      'sb-egislyqtbkxqbbtjcktv-auth-token',
    ];
    
    for (const cookieName of possibleCookieNames) {
      const sessionCookie = cookieStore.get(cookieName)?.value;
      if (sessionCookie) {
        try {
          const session = JSON.parse(sessionCookie);
          const userId = session?.user?.id || session?.[0]?.user?.id;
          if (userId) return { userId };
        } catch (e) {
          continue;
        }
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const userInfo = await getUserFromCookies();
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { siteUrl, name } = await req.json();

    if (!siteUrl) {
      return NextResponse.json({ error: "Site URL required" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Check if website already exists for this user
    const { data: existingWebsite } = await adminClient
      .from('websites')
      .select('id')
      .eq('user_id', userInfo.userId)
      .eq('gsc_property_id', siteUrl)
      .single();

    if (existingWebsite) {
      return NextResponse.json({ website: existingWebsite });
    }

    // Create new website record
    const websiteData = {
      user_id: userInfo.userId,
      url: siteUrl.replace('sc-domain:', 'https://').replace(/\/$/, ''),
      name: name || siteUrl.replace('sc-domain:', '').replace(/https?:\/\//, ''),
      gsc_property_id: siteUrl,
      is_verified: true,
    };

    const { data: newWebsite, error } = await adminClient
      .from('websites')
      .insert(websiteData)
      .select()
      .single();

    if (error) {
      console.error('Error creating website:', error);
      return NextResponse.json({ error: "Failed to create website" }, { status: 500 });
    }

    return NextResponse.json({ website: newWebsite });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userInfo = await getUserFromCookies();
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = createAdminClient();

    const { data: websites, error } = await adminClient
      .from('websites')
      .select('*')
      .eq('user_id', userInfo.userId);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch websites" }, { status: 500 });
    }

    return NextResponse.json({ websites: websites || [] });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
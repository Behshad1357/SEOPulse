// src/app/api/websites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    console.error('Missing Supabase credentials:', { url: !!url, key: !!key });
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(url, key);
}

async function getUserFromCookies(): Promise<{ userId: string } | null> {
  try {
    const cookieStore = await cookies();
    
    // Get all cookies and find the Supabase auth cookie
    const allCookies = cookieStore.getAll();
    console.log('Available cookies:', allCookies.map(c => c.name));
    
    // Try to find Supabase auth cookie (it may have different names)
    const authCookie = allCookies.find(c => 
      c.name.includes('auth-token') || 
      c.name.includes('supabase') ||
      c.name.startsWith('sb-')
    );
    
    if (authCookie) {
      console.log('Found auth cookie:', authCookie.name);
      try {
        const session = JSON.parse(authCookie.value);
        const userId = session?.user?.id || session?.[0]?.user?.id;
        if (userId) {
          console.log('Found user ID:', userId);
          return { userId };
        }
      } catch (e) {
        console.error('Error parsing cookie:', e);
      }
    }
    
    // Fallback: try specific cookie names
    const specificNames = [
      'sb-egislyqtbkxqbbtjcktv-auth-token',
      'sb-auth-token',
      'supabase-auth-token'
    ];
    
    for (const name of specificNames) {
      const cookie = cookieStore.get(name);
      if (cookie?.value) {
        try {
          const session = JSON.parse(cookie.value);
          const userId = session?.user?.id || session?.[0]?.user?.id;
          if (userId) {
            console.log('Found user ID from specific cookie:', userId);
            return { userId };
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    console.log('No user found in cookies');
    return null;
  } catch (error) {
    console.error('Error reading cookies:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  console.log('POST /api/websites called');
  
  try {
    const userInfo = await getUserFromCookies();
    
    if (!userInfo) {
      console.error('No user info found');
      return NextResponse.json({ error: "Unauthorized - no user found" }, { status: 401 });
    }

    const body = await req.json();
    console.log('Request body:', body);
    
    const { siteUrl, name } = body;

    if (!siteUrl) {
      return NextResponse.json({ error: "Site URL required" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Check if website already exists for this user
    console.log('Checking for existing website:', { userId: userInfo.userId, siteUrl });
    
    const { data: existingWebsite, error: fetchError } = await adminClient
      .from('websites')
      .select('id, url, name, gsc_property_id')
      .eq('user_id', userInfo.userId)
      .eq('gsc_property_id', siteUrl)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching existing website:', fetchError);
    }

    if (existingWebsite) {
      console.log('Found existing website:', existingWebsite);
      return NextResponse.json({ website: existingWebsite, existing: true });
    }

    // Create new website record
    const cleanUrl = siteUrl
      .replace('sc-domain:', 'https://')
      .replace(/\/$/, '');
    
    const cleanName = name || siteUrl
      .replace('sc-domain:', '')
      .replace(/https?:\/\//, '')
      .replace(/\/$/, '');

    const websiteData = {
      user_id: userInfo.userId,
      url: cleanUrl,
      name: cleanName,
      gsc_property_id: siteUrl,
      is_verified: true,
    };

    console.log('Creating website with data:', websiteData);

    const { data: newWebsite, error: insertError } = await adminClient
      .from('websites')
      .insert(websiteData)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating website:', insertError);
      return NextResponse.json({ 
        error: "Failed to create website", 
        details: insertError.message,
        code: insertError.code 
      }, { status: 500 });
    }

    console.log('Created new website:', newWebsite);
    return NextResponse.json({ website: newWebsite, created: true });

  } catch (error: any) {
    console.error('Unexpected error in POST /api/websites:', error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { status: 500 });
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
      console.error('Error fetching websites:', error);
      return NextResponse.json({ error: "Failed to fetch websites" }, { status: 500 });
    }

    return NextResponse.json({ websites: websites || [] });

  } catch (error) {
    console.error('Error in GET /api/websites:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
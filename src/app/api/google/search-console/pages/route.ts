// src/app/api/google/search-console/pages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

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
      'supabase-auth-token',
    ];
    
    for (const cookieName of possibleCookieNames) {
      const sessionCookie = cookieStore.get(cookieName)?.value;
      if (sessionCookie) {
        try {
          const session = JSON.parse(sessionCookie);
          const userId = session?.user?.id || session?.[0]?.user?.id;
          if (userId) {
            return { userId };
          }
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

export async function GET(req: NextRequest) {
  try {
    const userInfo = await getUserFromCookies();
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const siteUrl = searchParams.get('siteUrl');

    if (!siteUrl) {
      return NextResponse.json({ error: "Site URL required" }, { status: 400 });
    }

    // Get user's Google tokens
    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from('profiles')
      .select('google_access_token, google_refresh_token')
      .eq('id', userInfo.userId)
      .single();

    if (!profile?.google_access_token) {
      return NextResponse.json({ error: "Google not connected" }, { status: 401 });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: profile.google_access_token,
      refresh_token: profile.google_refresh_token,
    });

    const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client });

    // Get date range (last 28 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 28);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    // Fetch pages data
    const response = await searchconsole.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ['page'],
        rowLimit: 100,
      },
    });

    const pages = (response.data.rows || []).map((row: any) => ({
      page: row.keys[0],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
    }));

    // Sort by impressions descending
    pages.sort((a: any, b: any) => b.impressions - a.impressions);

    return NextResponse.json({ pages });

  } catch (error: any) {
    console.error('Error fetching pages:', error);
    
    if (error.code === 401 || error.message?.includes('invalid_grant')) {
      return NextResponse.json({ error: "Token expired", code: "TOKEN_EXPIRED" }, { status: 401 });
    }
    
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}
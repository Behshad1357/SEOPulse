// Google Analytics 4 Event Tracking Utility

type GAEventParams = {
  [key: string]: string | number | boolean | undefined | object | object[];
};

// Check if gtag is available
const isGtagAvailable = (): boolean => {
  return typeof window !== "undefined" && typeof window.gtag === "function";
};

// Generic event tracking function
export const trackEvent = (
  eventName: string,
  params?: GAEventParams
): void => {
  if (!isGtagAvailable()) {
    if (typeof window !== "undefined") {
      console.log("[Analytics] gtag not available, event not tracked:", eventName);
    }
    return;
  }

  window.gtag("event", eventName, params);
  
  // Only log in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics] Event tracked:", eventName, params);
  }
};

// ============================================
// CONVERSION EVENTS
// ============================================

// User signed up successfully
export const trackSignup = (method: string = "email"): void => {
  trackEvent("sign_up", {
    method,
  });
};

// User logged in
export const trackLogin = (method: string = "email"): void => {
  trackEvent("login", {
    method,
  });
};

// User upgraded to paid plan
export const trackPlanUpgrade = (
  planName: string,
  planPrice: number,
  currency: string = "USD"
): void => {
  trackEvent("plan_upgrade", {
    plan_name: planName,
    value: planPrice,
    currency,
  });

  // Also track as a purchase for revenue tracking
  trackEvent("purchase", {
    transaction_id: `upgrade_${Date.now()}`,
    value: planPrice,
    currency,
    items: [
      {
        item_name: `${planName} Plan`,
        price: planPrice,
      },
    ],
  });
};

// User started checkout
export const trackBeginCheckout = (planName: string, planPrice: number): void => {
  trackEvent("begin_checkout", {
    currency: "USD",
    value: planPrice,
    items: [
      {
        item_name: `${planName} Plan`,
        price: planPrice,
      },
    ],
  });
};

// ============================================
// ENGAGEMENT EVENTS
// ============================================

// CTA button clicked
export const trackCTAClick = (
  ctaName: string,
  ctaLocation: string,
  ctaDestination?: string
): void => {
  trackEvent("cta_click", {
    cta_name: ctaName,
    cta_location: ctaLocation,
    cta_destination: ctaDestination,
  });
};

// User connected Google account
export const trackGoogleConnect = (success: boolean): void => {
  trackEvent("google_connect", {
    success,
  });
};

// User disconnected Google account
export const trackGoogleDisconnect = (): void => {
  trackEvent("google_disconnect");
};

// User viewed pricing page
export const trackViewPricing = (): void => {
  trackEvent("view_pricing");
};

// User viewed specific plan details
export const trackViewPlan = (planName: string, planPrice: number): void => {
  trackEvent("view_item", {
    currency: "USD",
    value: planPrice,
    items: [
      {
        item_name: `${planName} Plan`,
        price: planPrice,
      },
    ],
  });
};

// ============================================
// FEATURE USAGE EVENTS
// ============================================

// User generated AI insights
export const trackAIInsightsGenerated = (siteUrl: string, insightsCount: number): void => {
  trackEvent("ai_insights_generated", {
    site_url: siteUrl,
    insights_count: insightsCount,
  });
};

// User viewed dashboard
export const trackDashboardView = (siteUrl?: string): void => {
  trackEvent("dashboard_view", {
    site_url: siteUrl,
  });
};

// User added a website
export const trackWebsiteAdded = (websiteUrl: string): void => {
  trackEvent("website_added", {
    website_url: websiteUrl,
  });
};

// User used keyword research
export const trackKeywordResearch = (keyword: string): void => {
  trackEvent("keyword_research", {
    keyword,
  });
};

// User exported report
export const trackReportExport = (reportType: string, format: string): void => {
  trackEvent("report_export", {
    report_type: reportType,
    format,
  });
};

// ============================================
// NEWSLETTER & LEAD EVENTS
// ============================================

// User subscribed to newsletter
export const trackNewsletterSignup = (source: string): void => {
  trackEvent("newsletter_signup", {
    source,
  });

  // Also track as lead generation
  trackEvent("generate_lead", {
    currency: "USD",
    value: 1, // Assign a value to leads
    source,
  });
};

// User submitted contact form
export const trackContactSubmit = (subject?: string): void => {
  trackEvent("contact_submit", {
    subject,
  });
};

// ============================================
// AFFILIATE EVENTS
// ============================================

// User joined affiliate program
export const trackAffiliateJoin = (): void => {
  trackEvent("affiliate_join");
};

// Affiliate link clicked
export const trackAffiliateClick = (affiliateId: string): void => {
  trackEvent("affiliate_click", {
    affiliate_id: affiliateId,
  });
};

// ============================================
// ERROR EVENTS
// ============================================

// Track errors for debugging
export const trackError = (errorType: string, errorMessage: string): void => {
  trackEvent("error", {
    error_type: errorType,
    error_message: errorMessage.substring(0, 100), // Limit message length
  });
};

// ============================================
// PAGE VIEW (for SPA navigation)
// ============================================

export const trackPageView = (pagePath: string, pageTitle?: string): void => {
  if (!isGtagAvailable()) return;

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-W0SN7RG08N";
  
  window.gtag("config", measurementId, {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

// ============================================
// TYPE DECLARATIONS
// ============================================

declare global {
  interface Window {
    gtag: (
      command: "event" | "config" | "js" | "set",
      targetId: string,
      params?: GAEventParams | Date
    ) => void;
    dataLayer: unknown[];
  }
}

// Export empty object to make this a module
export {};
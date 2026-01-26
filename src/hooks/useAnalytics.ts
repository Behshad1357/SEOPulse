"use client";

import { useCallback } from "react";
import {
  trackEvent as analyticsTrackEvent,
  trackSignup as analyticsTrackSignup,
  trackLogin as analyticsTrackLogin,
  trackPlanUpgrade as analyticsTrackPlanUpgrade,
  trackBeginCheckout as analyticsTrackBeginCheckout,
  trackCTAClick as analyticsTrackCTAClick,
  trackGoogleConnect as analyticsTrackGoogleConnect,
  trackGoogleDisconnect as analyticsTrackGoogleDisconnect,
  trackViewPricing as analyticsTrackViewPricing,
  trackViewPlan as analyticsTrackViewPlan,
  trackAIInsightsGenerated as analyticsTrackAIInsightsGenerated,
  trackDashboardView as analyticsTrackDashboardView,
  trackWebsiteAdded as analyticsTrackWebsiteAdded,
  trackKeywordResearch as analyticsTrackKeywordResearch,
  trackReportExport as analyticsTrackReportExport,
  trackNewsletterSignup as analyticsTrackNewsletterSignup,
  trackContactSubmit as analyticsTrackContactSubmit,
  trackAffiliateJoin as analyticsTrackAffiliateJoin,
  trackAffiliateClick as analyticsTrackAffiliateClick,
  trackError as analyticsTrackError,
  trackPageView as analyticsTrackPageView,
} from "@/lib/analytics";

export function useAnalytics() {
  // Conversion events
  const trackSignup = useCallback((method?: string) => {
    analyticsTrackSignup(method);
  }, []);

  const trackLogin = useCallback((method?: string) => {
    analyticsTrackLogin(method);
  }, []);

  const trackPlanUpgrade = useCallback(
    (planName: string, planPrice: number, currency?: string) => {
      analyticsTrackPlanUpgrade(planName, planPrice, currency);
    },
    []
  );

  const trackBeginCheckout = useCallback(
    (planName: string, planPrice: number) => {
      analyticsTrackBeginCheckout(planName, planPrice);
    },
    []
  );

  // Engagement events
  const trackCTAClick = useCallback(
    (ctaName: string, ctaLocation: string, ctaDestination?: string) => {
      analyticsTrackCTAClick(ctaName, ctaLocation, ctaDestination);
    },
    []
  );

  const trackGoogleConnect = useCallback((success: boolean) => {
    analyticsTrackGoogleConnect(success);
  }, []);

  const trackGoogleDisconnect = useCallback(() => {
    analyticsTrackGoogleDisconnect();
  }, []);

  const trackViewPricing = useCallback(() => {
    analyticsTrackViewPricing();
  }, []);

  const trackViewPlan = useCallback((planName: string, planPrice: number) => {
    analyticsTrackViewPlan(planName, planPrice);
  }, []);

  // Feature usage
  const trackAIInsightsGenerated = useCallback(
    (siteUrl: string, insightsCount: number) => {
      analyticsTrackAIInsightsGenerated(siteUrl, insightsCount);
    },
    []
  );

  const trackDashboardView = useCallback((siteUrl?: string) => {
    analyticsTrackDashboardView(siteUrl);
  }, []);

  const trackWebsiteAdded = useCallback((websiteUrl: string) => {
    analyticsTrackWebsiteAdded(websiteUrl);
  }, []);

  const trackKeywordResearch = useCallback((keyword: string) => {
    analyticsTrackKeywordResearch(keyword);
  }, []);

  const trackReportExport = useCallback((reportType: string, format: string) => {
    analyticsTrackReportExport(reportType, format);
  }, []);

  // Newsletter & Lead events
  const trackNewsletterSignup = useCallback((source: string) => {
    analyticsTrackNewsletterSignup(source);
  }, []);

  const trackContactSubmit = useCallback((subject?: string) => {
    analyticsTrackContactSubmit(subject);
  }, []);

  // Affiliate events
  const trackAffiliateJoin = useCallback(() => {
    analyticsTrackAffiliateJoin();
  }, []);

  const trackAffiliateClick = useCallback((affiliateId: string) => {
    analyticsTrackAffiliateClick(affiliateId);
  }, []);

  // Error tracking
  const trackError = useCallback((errorType: string, errorMessage: string) => {
    analyticsTrackError(errorType, errorMessage);
  }, []);

  // Page view tracking
  const trackPageView = useCallback((pagePath: string, pageTitle?: string) => {
    analyticsTrackPageView(pagePath, pageTitle);
  }, []);

  // Generic event
  const trackEvent = useCallback(
    (eventName: string, params?: Record<string, unknown>) => {
      analyticsTrackEvent(eventName, params as Record<string, string | number | boolean | undefined>);
    },
    []
  );

  return {
    // Conversion events
    trackSignup,
    trackLogin,
    trackPlanUpgrade,
    trackBeginCheckout,
    // Engagement events
    trackCTAClick,
    trackGoogleConnect,
    trackGoogleDisconnect,
    trackViewPricing,
    trackViewPlan,
    // Feature usage
    trackAIInsightsGenerated,
    trackDashboardView,
    trackWebsiteAdded,
    trackKeywordResearch,
    trackReportExport,
    // Newsletter & Lead events
    trackNewsletterSignup,
    trackContactSubmit,
    // Affiliate events
    trackAffiliateJoin,
    trackAffiliateClick,
    // Error tracking
    trackError,
    // Page view
    trackPageView,
    // Generic event
    trackEvent,
  };
}
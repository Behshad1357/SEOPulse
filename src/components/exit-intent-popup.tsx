"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Don't show on dashboard pages
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard")) {
      return;
    }

    // Check if already shown in this session or dismissed before
    const hasSeenPopup = sessionStorage.getItem("exitPopupShown");
    const hasDismissed = localStorage.getItem("exitPopupDismissed");
    
    if (hasSeenPopup || hasDismissed) {
      return;
    }

    // Wait 30 seconds before enabling exit intent
    const enableTimer = setTimeout(() => {
      const handleMouseLeave = (e: MouseEvent) => {
        // Only trigger when mouse leaves from the top of the page
        if (e.clientY <= 5 && !hasShown) {
          setIsVisible(true);
          setHasShown(true);
          sessionStorage.setItem("exitPopupShown", "true");
          document.removeEventListener("mouseleave", handleMouseLeave);
        }
      };

      document.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        document.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, 30000); // 30 second delay

    return () => clearTimeout(enableTimer);
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDismissForever = () => {
    localStorage.setItem("exitPopupDismissed", "true");
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        localStorage.setItem("exitPopupDismissed", "true");
        setTimeout(() => setIsVisible(false), 3000);
      }
    } catch (error) {
      console.error("Newsletter signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Free SEO Resource
            </span>
          </div>
          <h2 className="text-2xl font-bold">
            Before You Go...
          </h2>
          <p className="text-blue-100 mt-1">
            Get our free SEO checklist used by 500+ websites
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isSubmitted ? (
            <>
              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">50-Point SEO Audit Checklist</p>
                    <p className="text-sm text-gray-500">The exact checklist we use for clients</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Weekly SEO Tips</p>
                    <p className="text-sm text-gray-500">Actionable advice, no spam (unsubscribe anytime)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Early Access to New Features</p>
                    <p className="text-sm text-gray-500">Be the first to try new AI tools</p>
                  </div>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Get Free Checklist
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Alternative Actions */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <Link 
                  href="/signup" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  onClick={handleClose}
                >
                  Or create a free account →
                </Link>
                <button
                  onClick={handleDismissForever}
                  className="text-gray-400 hover:text-gray-600"
                >
                  Don&apos;t show again
                </button>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                You&apos;re In! 🎉
              </h3>
              <p className="text-gray-600">
                Check your email for the SEO checklist. Welcome to SEOPulse!
              </p>
            </div>
          )}
        </div>

        {/* Trust Badge */}
        <div className="bg-gray-50 px-6 py-3 border-t">
          <p className="text-xs text-gray-500 text-center">
            🔒 We respect your privacy. Unsubscribe anytime with one click.
          </p>
        </div>
      </div>
    </div>
  );
}
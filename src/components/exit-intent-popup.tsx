"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Gift, Loader2, CheckCircle } from "lucide-react";

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    const shown = sessionStorage.getItem("exitPopupShown");
    if (shown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("exitPopupShown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-popup" }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {status === "success" ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You&apos;re In! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Check your inbox for your free GSC checklist.
            </p>
            <Button onClick={handleClose}>
              Continue Reading
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-blue-600 p-6 text-center">
              <Gift className="w-12 h-12 text-white mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white">
                Wait! Free Gift Inside 🎁
              </h2>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                Get Our Free GSC Quick Wins Checklist
              </h3>
              <p className="text-gray-600 text-center mb-6">
                10 things you can fix today to boost your organic traffic. Takes 5 minutes.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={status === "loading"}
                />
                <Button
                  type="submit"
                  className="w-full py-3"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Me the Checklist"
                  )}
                </Button>
              </form>

              {status === "error" && (
                <p className="text-red-600 text-sm text-center mt-2">
                  Something went wrong. Please try again.
                </p>
              )}

              <p className="text-xs text-gray-500 text-center mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
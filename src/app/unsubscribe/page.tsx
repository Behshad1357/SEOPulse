"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [inputEmail, setInputEmail] = useState(email);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (email) {
      setInputEmail(email);
    }
  }, [email]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputEmail || !inputEmail.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inputEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("You have been unsubscribed successfully.");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to unsubscribe. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {status === "success" ? (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Unsubscribed
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-6">
                We&apos;re sorry to see you go. You can always resubscribe on our blog.
              </p>
              <Link href="/">
                <Button>Go to Homepage</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Unsubscribe
                </h1>
                <p className="text-gray-600">
                  Enter your email to unsubscribe from our newsletter.
                </p>
              </div>

              <form onSubmit={handleUnsubscribe} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={status === "loading"}
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <XCircle className="w-4 h-4" />
                    {message}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Unsubscribe"
                  )}
                </Button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-6">
                Changed your mind?{" "}
                <Link href="/blog" className="text-blue-600 hover:underline">
                  Go back to blog
                </Link>
              </p>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to SEOPulse
          </Link>
        </div>
      </div>
    </div>
  );
}
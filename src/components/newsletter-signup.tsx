"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Mail } from "lucide-react";

interface NewsletterSignupProps {
  source?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
}

export function NewsletterSignup({
  source = "blog",
  title = "Get SEO Tips in Your Inbox",
  description = "Weekly tips to grow your organic traffic. No spam, unsubscribe anytime.",
  buttonText = "Subscribe",
  className = "",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("You're subscribed! Check your inbox.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to subscribe. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-xl p-6 text-center ${className}`}>
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">You&apos;re Subscribed!</h3>
        <p className="text-green-600 text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div className={`bg-blue-50 border border-blue-100 rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={status === "loading"}
        />
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subscribing...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </form>
      
      {status === "error" && (
        <p className="text-red-600 text-sm mt-2">{message}</p>
      )}
      
      <p className="text-xs text-gray-500 mt-3">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
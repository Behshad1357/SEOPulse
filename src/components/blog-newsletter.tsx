"use client";

import { useState } from "react";

interface BlogNewsletterProps {
  source?: string;
}

export function BlogNewsletter({ source = "blog" }: BlogNewsletterProps) {
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
        setMessage("You're subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to subscribe");
    }
  };

  if (status === "success") {
    return (
      <div className="mt-16 bg-green-500 rounded-2xl p-8 md:p-12 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-2">You&apos;re Subscribed!</h2>
        <p className="text-green-100">Check your inbox for SEO tips.</p>
      </div>
    );
  }

  return (
    <div className="mt-16 bg-blue-600 rounded-2xl p-8 md:p-12 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">
        Get SEO Tips in Your Inbox
      </h2>
      <p className="text-blue-100 mb-6 max-w-xl mx-auto">
        Subscribe to our newsletter for weekly SEO tips, strategies, and updates.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-200 text-sm mt-3">{message}</p>
      )}
      <p className="text-blue-200 text-xs mt-4">No spam. Unsubscribe anytime.</p>
    </div>
  );
}
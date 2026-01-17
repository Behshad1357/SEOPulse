"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CancelSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/cancel", {
        method: "POST",
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to cancel subscription");
      }
    } catch (error) {
      alert("Failed to cancel subscription");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-red-600 font-medium">Are you sure? This cannot be undone.</p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleCancel}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Canceling...
              </>
            ) : (
              "Yes, Cancel"
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirm(false)}
            disabled={loading}
          >
            No, Keep It
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
      onClick={() => setShowConfirm(true)}
    >
      Cancel Subscription
    </Button>
  );
}
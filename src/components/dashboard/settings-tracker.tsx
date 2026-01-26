"use client";

import { useEffect } from "react";
import { trackGoogleConnect } from "@/lib/analytics";

interface SettingsTrackerProps {
  googleConnected: boolean;
}

export function SettingsTracker({ googleConnected }: SettingsTrackerProps) {
  useEffect(() => {
    if (googleConnected) {
      trackGoogleConnect(true);
    }
  }, [googleConnected]);

  return null; // This component doesn't render anything
}
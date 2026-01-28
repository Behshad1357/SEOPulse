"use client";

import Link from "next/link";
import { Clock, X, ArrowRight } from "lucide-react";
import { useState } from "react";

interface TrialBannerProps {
  daysRemaining: number;
}

export function TrialBanner({ daysRemaining }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const isUrgent = daysRemaining <= 2;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${
      isUrgent 
        ? 'bg-gradient-to-r from-red-600 to-orange-600' 
        : 'bg-gradient-to-r from-blue-600 to-purple-600'
    } text-white py-3 px-4`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5" />
          <span className="font-medium">
            {isUrgent ? '⚠️ ' : ''}
            {daysRemaining === 1 
              ? 'Your free trial ends tomorrow!' 
              : `${daysRemaining} days left in your free trial`
            }
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/pricing" 
            className="bg-white text-blue-600 px-4 py-1.5 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors flex items-center gap-1"
          >
            Upgrade Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          {!isUrgent && (
            <button 
              onClick={() => setDismissed(true)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
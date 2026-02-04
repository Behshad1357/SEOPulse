"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Zap, TrendingUp, FileText, Bell, Crown } from "lucide-react";
import Link from "next/link";

interface UpgradePromptProps {
  feature: string;
  currentPlan?: string;
}

const featureMessages: Record<string, { title: string; description: string; icon: any }> = {
  'page_scores': {
    title: 'Unlock All Page Scores',
    description: 'Free plan analyzes 5 pages. Pro analyzes 50+ pages with detailed fix recommendations.',
    icon: TrendingUp
  },
  'pdf_reports': {
    title: 'Generate PDF Reports',
    description: 'Create beautiful PDF reports to share with clients or stakeholders.',
    icon: FileText
  },
  'email_alerts': {
    title: 'Get Traffic Drop Alerts',
    description: 'Never miss a traffic drop. Get instant email alerts when rankings change.',
    icon: Bell
  },
  'more_sites': {
    title: 'Track More Websites',
    description: 'Free plan tracks 1 site. Pro tracks up to 5 websites.',
    icon: Zap
  },
  'history': {
    title: 'Access 90-Day History',
    description: 'Free plan shows 7 days. Pro shows 90 days of historical data.',
    icon: TrendingUp
  }
};

export function UpgradePrompt({ feature, currentPlan = 'free' }: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || currentPlan !== 'free') return null;

  const message = featureMessages[feature] || featureMessages['page_scores'];
  const Icon = message.icon;

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10 animate-pulse" />
      
      <CardContent className="p-4 relative">
        <button 
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl text-white">
            <Icon className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              <h3 className="font-semibold text-gray-900">{message.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">{message.description}</p>
          </div>
          
          <Link href="/pricing">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Upgrade to Pro
              <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded">$19/mo</span>
            </Button>
          </Link>
        </div>
        
        {/* Limited time offer */}
        <div className="mt-3 flex items-center justify-center gap-2 text-sm">
          <span className="animate-pulse">🔥</span>
          <span className="text-purple-700 font-medium">
            Limited: First month 50% off with code LAUNCH50
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
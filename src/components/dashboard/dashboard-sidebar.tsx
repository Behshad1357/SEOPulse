"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Sparkles,
  Settings,
  TrendingUp,
  FileText,
  HelpCircle,
  Target, // Added for Opportunities
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/websites", label: "Websites", icon: Globe },
  { href: "/dashboard/insights", label: "AI Insights", icon: Sparkles, badge: "AI" },
  { href: "/dashboard/opportunities", label: "Page Scores", icon: Target, badge: "New" }, // Added
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const resourceItems = [
  { href: "/blog", label: "SEO Blog", icon: FileText },
  { href: "/contact", label: "Help & Support", icon: HelpCircle },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          {/* Main Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            <div className="mb-4">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Main Menu
              </p>
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`} />
                  {item.label}
                  {item.badge && (
                    <span className={`ml-auto text-xs px-1.5 py-0.5 rounded ${
                      isActive 
                        ? "bg-white/20 text-white" 
                        : item.badge === "New" 
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Resources Section */}
            <div className="mt-8 mb-4">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Resources
              </p>
            </div>
            {resourceItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                >
                  <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Upgrade Card */}
          <div className="px-3 mt-auto">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Upgrade to Pro</span>
              </div>
              <p className="text-sm text-blue-100 mb-3">
                Get unlimited sites, advanced AI insights, and priority support.
              </p>
              <Link
                href="/pricing"
                className="block w-full text-center bg-white text-blue-600 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

interface Site {
  siteUrl: string;
  permissionLevel: string;
}

interface SiteSelectorProps {
  sites: Site[];
  selectedSite: string | null;
  onSelect: (site: string) => void;
}

export function SiteSelector({ sites, selectedSite, onSelect }: SiteSelectorProps) {
  if (sites.length === 0) return null;

  // Format site URL for display
  const formatSiteUrl = (url: string) => {
    return url
      .replace("sc-domain:", "")
      .replace("https://", "")
      .replace("http://", "")
      .replace(/\/$/, "");
  };

  return (
    <Select value={selectedSite || undefined} onValueChange={onSelect}>
      <SelectTrigger className="w-[250px] bg-gray-900 text-white border-gray-700 hover:bg-gray-800">
        <Globe className="w-4 h-4 mr-2 text-gray-300" />
        <SelectValue placeholder="Select a website">
          {selectedSite ? formatSiteUrl(selectedSite) : "Select a website"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg">
        {sites.map((site) => (
          <SelectItem 
            key={site.siteUrl} 
            value={site.siteUrl}
            className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer py-2"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {formatSiteUrl(site.siteUrl)}
              </span>
              {site.siteUrl.startsWith("sc-domain:") && (
                <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium">
                  Domain
                </span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
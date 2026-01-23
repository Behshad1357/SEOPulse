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
      <SelectTrigger className="w-[250px]">
        <Globe className="w-4 h-4 mr-2 text-gray-500" />
        <SelectValue placeholder="Select a website">
          {selectedSite ? formatSiteUrl(selectedSite) : "Select a website"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {sites.map((site) => (
          <SelectItem key={site.siteUrl} value={site.siteUrl}>
            <div className="flex items-center">
              <span>{formatSiteUrl(site.siteUrl)}</span>
              {site.siteUrl.startsWith("sc-domain:") && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1 rounded">
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
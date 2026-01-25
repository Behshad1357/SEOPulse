"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGAData } from "@/hooks/useGAData";
import { GADashboardCard } from "@/components/dashboard/ga-dashboard-card";
import { 
  BarChart3, 
  RefreshCw, 
  Loader2, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Users,
  Eye,
  Clock,
  MousePointerClick
} from "lucide-react";

export function GASection() {
  const {
    data,
    properties,
    loading,
    error,
    selectedProperty,
    setSelectedProperty,
    refetch,
  } = useGAData();

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="border-orange-200 bg-gradient-to-r from-orange-50/50 to-yellow-50/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            Google Analytics
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
              GA4
            </span>
          </CardTitle>

          <div className="flex items-center gap-2">
            {/* Property Selector */}
            {properties.length > 0 && (
              <Select
                value={selectedProperty || undefined}
                onValueChange={setSelectedProperty}
              >
                <SelectTrigger className="w-[200px] h-8 text-sm">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((prop) => (
                    <SelectItem key={prop.propertyId} value={prop.propertyId}>
                      {prop.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Refresh Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              disabled={loading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>

            {/* Expand/Collapse */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              <span className="ml-2 text-gray-600">Loading analytics...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center gap-2 p-4 bg-red-50 rounded-lg text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Data Display */}
          {data && !loading && !error && (
            <GADashboardCard
              totals={data.totals}
              sources={data.sources}
              pages={data.pages}
            />
          )}

          {/* No Properties - Setup Required */}
          {!loading && !error && properties.length === 0 && (
            <div className="space-y-4">
              {/* Placeholder metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border bg-blue-50/50 text-blue-400 border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100/50">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">Users</p>
                      <p className="text-xl font-bold">--</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border bg-green-50/50 text-green-400 border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100/50">
                      <MousePointerClick className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">Sessions</p>
                      <p className="text-xl font-bold">--</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border bg-purple-50/50 text-purple-400 border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100/50">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">Page Views</p>
                      <p className="text-xl font-bold">--</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border bg-orange-50/50 text-orange-400 border-orange-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100/50">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">Avg. Duration</p>
                      <p className="text-xl font-bold">--</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Setup Instructions */}
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-orange-800">Set Up Google Analytics</p>
                    <p className="text-sm text-orange-600 mt-1">
                      To see your website traffic data here, you need to:
                    </p>
                    <ol className="text-sm text-orange-600 mt-2 space-y-1 list-decimal list-inside">
                      <li>Create a GA4 property in Google Analytics</li>
                      <li>Add the tracking code to your website</li>
                      <li>Use the same Google account you use for SEOPulse</li>
                    </ol>
                    <a
                      href="https://analytics.google.com/analytics/web/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-orange-700 hover:text-orange-800"
                    >
                      Go to Google Analytics
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Has Properties but No Data Selected */}
          {!data && !loading && !error && properties.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Select a property to view analytics data</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
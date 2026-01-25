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
  ChevronUp
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

  // If no properties available, don't show the section
  if (properties.length === 0 && !loading && !error) {
    return null;
  }

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

          {/* No Data State */}
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
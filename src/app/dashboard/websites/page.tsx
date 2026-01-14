import { createClient } from "@/lib/supabase/server";
import { AddWebsiteForm } from "@/components/dashboard/add-website-form";
import { WebsiteCard } from "@/components/dashboard/website-card";
import { Card, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";

export default async function WebsitesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: websites } = await supabase
    .from("websites")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Websites</h1>
          <p className="text-gray-500 mt-1">Manage your tracked websites</p>
        </div>
        <AddWebsiteForm />
      </div>

      {/* Websites List */}
      {websites && websites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {websites.map((website) => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-3 bg-gray-100 rounded-full mb-4">
              <Globe className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No websites yet</h3>
            <p className="text-gray-500 text-center max-w-sm">
              Add your first website to start tracking your SEO performance.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
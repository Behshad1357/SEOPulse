"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Trash2, ExternalLink, CheckCircle, XCircle } from "lucide-react";

interface Website {
  id: string;
  user_id: string;
  url: string;
  name: string;
  gsc_property_id: string | null;
  ga4_property_id: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface WebsiteCardProps {
  website: Website;
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this website? All data will be lost.")) {
      return;
    }

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("websites")
        .delete()
        .eq("id", website.id);

      if (!error) {
        router.refresh();
      }
    } catch (err) {
      console.error("Error deleting website:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{website.name}</h3>
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-blue-600 flex items-center mt-1"
              >
                {website.url}
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center text-sm">
                  {website.gsc_property_id ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">GSC Connected</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-gray-500">GSC Not Connected</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
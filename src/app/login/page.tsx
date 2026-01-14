import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
   // Debug: Check if env vars exist (remove this later!)
  console.log("URL exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">SEOPulse</h1>
          <p className="text-gray-500 mt-2">AI-Powered SEO Insights</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
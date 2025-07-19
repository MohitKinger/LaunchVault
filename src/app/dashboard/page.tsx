"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login"); // Redirect if no user
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f1c] text-white text-xl">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1c] text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.email}</h1>
      <h2 className="text-2xl mb-2">Your Saved Ideas 🚀</h2>
      <p className="text-gray-300">Coming soon... 👨‍🚀</p>
    </div>
  );
}

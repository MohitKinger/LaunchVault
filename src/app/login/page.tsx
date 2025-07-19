"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-200 flex flex-col items-center justify-center gap-6 text-[#0f0f1c]">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center">
        Launch<span className="text-purple-600">Vault 🚀</span>
      </h1>

      {!user ? (
        <Button
          onClick={handleLogin}
          className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-white text-lg rounded-xl shadow-md"
        >
          Sign in with Google
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-gray-900 font-semibold">👋 Hello, {user.email}</p>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 text-white text-lg rounded-xl"
          >
            Sign Out
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 text-white text-lg rounded-xl"
          >
            Go to Dashboard →
          </Button>
        </div>
      )}
    </div>
  );
}

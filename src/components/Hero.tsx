"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import rocketAnim from "@/assets/lottie/rocket.json";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Hero() {
  const [idea, setIdea] = useState("");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = () => {
    if (idea.trim()) {
      router.push(`/result?idea=${encodeURIComponent(idea)}`);
    }
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      await supabase.auth.signOut();
      localStorage.removeItem("toastShown");
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
      if (data?.user && !localStorage.getItem("toastShown")) {
        toast.success(`👋 Hello, ${data.user.email}`);
        localStorage.setItem("toastShown", "true");
      }
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user && !localStorage.getItem("toastShown")) {
        toast.success(`👋 Logged in as ${session.user.email}`);
        localStorage.setItem("toastShown", "true");
      } else if (!session?.user) {
        toast.success("✅ Signed out");
        localStorage.removeItem("toastShown");
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] text-white">
      
      {/* ✅ Login / Signout Button */}
      <Button
        onClick={user ? handleLogout : handleLogin}
        className={`absolute top-6 left-6 px-4 py-2 rounded-xl z-10 font-bold ${
          user ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {user ? "Sign Out" : "Login"}
      </Button>

      {/* ✅ Lottie Rocket Animation */}
      <Lottie
        animationData={rocketAnim}
        loop
        className="absolute opacity-70 w-full h-full z-0 pointer-events-none"
      />

      <div className="z-10 text-center px-4 max-w-2xl">
        <h1 className="text-5xl font-bold text-purple-600 mb-4">LaunchVault 🚀</h1>
        <p className="text-gray-800 mb-6 text-lg">
          Validate your startup idea in seconds using AI
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Input
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Enter your startup idea..."
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-[300px] sm:w-[400px] bg-[#1c1c28] border border-purple-600 text-white shadow-[0_0_16px_#7F56D9] rounded-xl"
          />
          <Button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 rounded-xl px-6 py-2 text-white"
          >
            Validate
          </Button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { LoaderCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toHandle } from "@/lib/utils";
import { motion } from "framer-motion";


interface GPTResponse {
  pros: string;
  cons: string;
  monetization: string;
  mvp: string;
  competitors: string;
}

export default function ResultPage() {
  const searchParams = useSearchParams();
  const ideaParam = searchParams.get("idea");
  const idea = ideaParam ? decodeURIComponent(ideaParam) : "";

  const [result, setResult] = useState<GPTResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle input
  const [customHandle, setCustomHandle] = useState("");
  const [availability, setAvailability] = useState({
    twitterTaken: false,
    domainTaken: false,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardWidth = 320;

  useEffect(() => {
    if (!idea) return;
    fetch("/api/validate", {
      method: "POST",
      body: JSON.stringify({ idea }),
    })
      .then((res) => res.json())
      .then((data) => setResult(data?.fallback || data))
      .catch(() =>
        setResult({
          pros: "Could not load pros.",
          cons: "Could not load cons.",
          monetization: "Error fetching monetization.",
          mvp: "Error fetching MVP.",
          competitors: "Could not load competitors.",
        })
      )
      .finally(() => setLoading(false));
  }, [idea]);

  const handleSave = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return alert("Please login!");
    const { error } = await supabase
      .from("ideas")
      .insert([{ user_id: session.user.id, idea, ...result }]);
    error ? alert("Error saving!") : alert("Saved 🎉");
  };

  const checkHandle = async () => {
    if (!customHandle) return alert("Enter a handle");
    const res = await fetch("/api/check", {
      method: "POST",
      body: JSON.stringify({ handle: customHandle }),
    });
    const data = await res.json();
    setAvailability(data);
  };

  // Scroll Snap Effect with center scaling
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, offsetWidth } = containerRef.current;
    const index = Math.round(scrollLeft / (cardWidth + 24));
    setActiveIndex(index);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1c] text-white px-4 md:px-10 py-10 space-y-8">
      {/* Classy Heading Section */}
<div className="relative flex flex-col items-center justify-center mb-12 py-16 overflow-hidden">
  {/* Glowing background */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-600 to-pink-600 opacity-30 blur-3xl rounded-full w-[60vw] h-[60vw] mx-auto -z-10 animate-pulse-slow"></div>

  {/* Heading */}
  <motion.h1
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-lg"
  >
    Validation Results for:
  </motion.h1>

  {/* Idea Text */}
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
    className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(164,84,255,0.7)] mt-6 animate-pulse"
  >
    {idea ? `"${idea}"` : "Unknown Idea"}
  </motion.p>
</div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoaderCircle className="animate-spin w-10 h-10 text-purple-500" />
        </div>
      ) : (
        <div
        ref={containerRef}
        className="flex overflow-x-auto gap-6 px-6 py-8 scroll-smooth no-scrollbar"
      >
        {[...Array(10)].flatMap(() =>
          Object.entries(result || {}).map(([key, value], index) => (
            <motion.div
              key={`${key}-${index}-${Math.random()}`}
              whileHover={{ scale: 1.05 }}
              className="shrink-0 w-[340px] h-[400px] rounded-3xl p-6 bg-[#1a1a24]/80 backdrop-blur-md text-white shadow-[0px_15px_25px_rgba(164,84,255,0.3)] transition-transform"
            >
              <h2 className="text-xl font-bold text-purple-400 text-center mb-4 uppercase">{key}</h2>
              <p className="text-sm text-gray-300 text-center whitespace-pre-line">{value}</p>
            </motion.div>
          ))
        )}
      </div>
      )}

      {!loading && result && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold shadow-lg"
          >
            💾 Save Idea
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white"
          >
            🔁 Try Another Idea
          </button>
        </div>
      )}

      {/* Branding Checker */}
      <div className="p-6 rounded-xl bg-[#1c1c28] border border-purple-600">
        <h3 className="text-xl font-semibold mb-4 text-purple-400">
          🔍 Check Branding Handle
        </h3>
        <div className="flex gap-4">
          <input
            className="flex-1 px-4 py-3 rounded-lg bg-[#0f0f1c] border border-purple-500 outline-none text-white"
            value={customHandle}
            onChange={(e) => setCustomHandle(e.target.value)}
            placeholder="Enter custom handle"
          />
          <button
            onClick={checkHandle}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg font-bold"
          >
            Check Availability
          </button>
        </div>

        {customHandle && (
          <div className="mt-4 space-y-2 text-sm text-gray-300">
            <p>
              Domain: <b>{customHandle}.com</b> —{" "}
              <span
                className={
                  availability.domainTaken ? "text-red-400" : "text-green-400"
                }
              >
                {availability.domainTaken ? "Taken ❌" : "Available ✅"}
              </span>
            </p>
            <p>
              Twitter: <b>@{customHandle}</b> —{" "}
              <span
                className={
                  availability.twitterTaken ? "text-red-400" : "text-green-400"
                }
              >
                {availability.twitterTaken ? "Taken ❌" : "Available ✅"}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import Image from "next/image";
import Lottie from "lottie-react";
import Hero from "@/components/Hero";
import rocket from "@/assets/lottie/rocket.json";

<Lottie animationData={rocket} className="w-32 h-32" />

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}

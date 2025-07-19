import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// ✅ Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Metadata
export const metadata: Metadata = {
  title: "LaunchVault 🚀",
  description: "Created By Mohit ❤️",
};

// ✅ Layout Component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #63e 100%)",
          minHeight: "100vh",
        }}
      >
        {children}

        {/* ✅ Sonner Toaster */}
        <Toaster
          position="top-right"
          theme="light"
          toastOptions={{
            style: {
              background: "#1c1c28",
              color: "white",
              border: "2px solid #7F56D9",
              boxShadow: "0 0 15px #7F56D9",
              fontSize: "16px",
              fontWeight: "600",
            },
            className: "rounded-xl",
          }}
        />
      </body>
    </html>
  );
}

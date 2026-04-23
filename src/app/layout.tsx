import type { Metadata } from "next";
import { Inter, Outfit, Syne } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import ChatWidget from "@/components/ChatWidget";
import Preloader from "@/components/Preloader";
import FaviconManager from "@/components/FaviconManager";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

export const metadata: Metadata = {
  title: "Elite Editor | Cinematic Video Portfolio",
  description: "Advanced cinematic storytelling and professional video editing portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${syne.variable}`} suppressHydrationWarning>
      <body>
        <FaviconManager />
        <Preloader />
        <div className="noise-overlay" />
        <CustomCursor />
        <ChatWidget />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

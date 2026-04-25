import type { Metadata } from "next";
import { Inter, Outfit, Syne } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import ChatWidget from "@/components/ChatWidget";
import Preloader from "@/components/Preloader";
import FaviconManager from "@/components/FaviconManager";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

export const metadata: Metadata = {
  title: {
    default: "Binaya Cinematics | Elite Video Editor & Storyteller",
    template: "%s | Binaya Cinematics"
  },
  description: "Elite cinematic video editing and storytelling portfolio. Transforming visions into high-end visual experiences.",
  keywords: ["Video Editor", "Cinematographer", "Director", "Colorist", "Cinematic Portfolio", "Binaya Adhikari", "Elite Editing"],
  authors: [{ name: "Binaya Adhikari" }],
  creator: "Binaya Adhikari",
  publisher: "Binaya Adhikari",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://binaya-cinematics.vercel.app", // Replace with your actual domain
    siteName: "Binaya Cinematics",
    title: "Binaya Cinematics | Elite Video Editor",
    description: "Experience elite cinematic storytelling. View my latest projects and professional video work.",
    images: [
      {
        url: "/og-image.jpg", // Make sure to add this image to your public folder
        width: 1200,
        height: 630,
        alt: "Binaya Cinematics Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Binaya Cinematics | Elite Video Editor",
    description: "Advanced cinematic storytelling and professional video editing portfolio.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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

import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import CustomCursor from "@/components/CustomCursor";
import AmbientBackground from "@/components/AmbientBackground"
import SiteTerminal from "@/components/SiteTerminal"
import Mascot from "@/components/Mascot"
import GlassPointer from "@/components/GlassPointer"

export const metadata: Metadata = {
  title: "Nahyun Kim | AI Security Researcher & Creative Developer",
  description:
    "Portfolio of Nahyun Kim, AI security researcher at ACE Lab, Hanyang University. Adversarial ML, audio security, creative development.",
  openGraph: {
    title: "Nahyun Kim | AI Security Researcher",
    description:
      "AI Security Research Portfolio. Adversarial ML, Audio Security, Creative Development.",
    url: "https://nahyun.vercel.app",
    siteName: "Nahyun Kim Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Nahyun Kim | AI Security Researcher",
    description:
      "AI Security Research Portfolio. Adversarial ML, Audio Security.",
    images: ["https://nahyun.vercel.app/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F2F8FC",
};

// Runs before first paint: a saved choice wins, otherwise the site opens in light.
const THEME_INIT = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="antialiased min-h-screen flex flex-col relative">
        <AmbientBackground />
        <CustomCursor />
        <GlassPointer />
        <NavBar />
        <SiteTerminal />
        <main className="flex-1 relative z-10">{children}</main>
        <Mascot />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import CustomCursor from "@/components/CustomCursor";
import AmbientBackground from "@/components/AmbientBackground";

export const metadata: Metadata = {
  title: "Nahyun Kim — AI Security Researcher & Creative Developer",
  description:
    "Portfolio of Nahyun Kim — AI security researcher at ACE Lab, Hanyang University. Adversarial ML, audio security, creative development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col relative">
        <AmbientBackground />
        <CustomCursor />
        <NavBar />
        <main className="flex-1 relative z-10">{children}</main>
      </body>
    </html>
  );
}

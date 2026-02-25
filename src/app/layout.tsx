import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Nahyun Kim — AI Security Researcher & Creative Developer",
  description:
    "Portfolio of Nahyun Kim — AI Security Researcher at ACE Lab, Hanyang University. Specializing in adversarial attacks, audio security, and creative web development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}

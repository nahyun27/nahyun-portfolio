import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Nahyun Kim — AI Security Researcher & Creative Developer",
  description:
    "Portfolio of Nahyun Kim — AI security researcher at ACE Lab, Hanyang University. Adversarial ML, audio security, creative development.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Removed if not using or installed. Default usually has it.
// Assuming we don't need fonts or file isn't present, let's keep it simple.
import "./globals.css";
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: "FYS Voting",
  description: "FYS Voting System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

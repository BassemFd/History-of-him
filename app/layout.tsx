import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/content";
import Gutter from "@/components/Gutter";
import ScrollSkew from "@/components/ScrollSkew";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.tagline}`,
  description: profile.summary,
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="font-sans antialiased pb-14 lg:pb-0">
        <div className="lg:flex lg:min-h-screen">
          <Gutter profile={profile} />
          <div className="lg:min-w-0 lg:flex-1">
            <ScrollSkew>{children}</ScrollSkew>
          </div>
        </div>
      </body>
    </html>
  );
}

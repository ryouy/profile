import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "../data/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: "ryouy / Playground",
  description:
    "Web apps, data visualizations, research tools, and interface experiments by Ryo / ryouy.",
  openGraph: {
    title: "ryouy / Playground",
    description: "Small web apps, data visualizations, and research tools by Ryo.",
    url: "/",
    siteName: "ryouy / Playground",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/mountain-hero.png", alt: "Mountain landscape behind Ryo's Playground" }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


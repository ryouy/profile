import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ryouy / Playground",
  description:
    "playground by ryouy",
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

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ryo / ryouy | Playground",
  description:
    "Engineering playground by ryouy",
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

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ryo / ryouy | Developer Portfolio",
  description:
    "Portfolio for Ryo / ryouy, a University of Aizu CS student exploring data science, computational social science, web apps, and art.",
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

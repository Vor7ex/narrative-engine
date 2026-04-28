import type { Metadata } from "next";
import { Cormorant_Garamond, Indie_Flower } from "next/font/google";
import "./globals.css";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const indieFlower = Indie_Flower({
  variable: "--font-indie",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Narrative Engine",
  description: "Visual novel engine powered by Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}

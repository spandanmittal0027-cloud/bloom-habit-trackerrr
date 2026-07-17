import type { Metadata } from "next";
import { Caveat, Quicksand, Nunito } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "bloom — a cozy habit journal",
  description:
    "A soft, Pinterest-inspired habit tracker and daily journal. Small rituals, kept gently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${caveat.variable} ${quicksand.variable} ${nunito.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

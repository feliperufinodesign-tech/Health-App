import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Lexend,
  DM_Sans,
  Hanken_Grotesk,
  Fraunces,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// UI Assistente-AI (Figma) type system.
// Lexend + DM Sans are the real families. Aeonik → Hanken Grotesk (a close
// geometric grotesque). Copernicus (serif) → Fraunces (warm modern serif).
const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const aeonik = Hanken_Grotesk({
  variable: "--font-aeonik",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const copernicus = Fraunces({
  variable: "--font-copernicus",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
});

export const metadata: Metadata = {
  title: "Rotina & Saúde",
  description: "Acompanhamento pessoal de rotina e saúde",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lexend.variable} ${dmSans.variable} ${aeonik.variable} ${copernicus.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

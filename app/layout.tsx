import type { Metadata } from "next";
import { Geist, Geist_Mono, Lexend, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Primary UI font (Figma UI Assistente-AI): Lexend.
const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Serif accent (Copernicus in Figma) → Fraunces as a close warm modern serif.
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
        className={`${geistSans.variable} ${geistMono.variable} ${lexend.variable} ${copernicus.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono, Nanum_Brush_Script, Cinzel } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brushDisplay = Nanum_Brush_Script({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const engravedSerif = Cinzel({
  variable: "--font-technical",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Metin2Krack — Calculadora de Daño",
  description: "Guía y calculadora de daño PvP/PvM para Metin2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${brushDisplay.variable} ${engravedSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

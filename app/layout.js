import { Geist_Mono } from "next/font/google";
import { Cairo } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Yafel - Premium Real Estate",
  description: "Inspired by the Red Sea - Connecting Egypt & KSA through premium real estate",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body
        className={`font-sans ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

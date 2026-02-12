import { Geist_Mono } from "next/font/google";
import { Hepta_Slab } from "next/font/google";
import { Tajawal } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const heptaSlab = Hepta_Slab({
  variable: "--font-hepta-slab",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Yafel - Premium Real Estate",
  description: "Inspired by the Red Sea - Connecting Egypt & KSA through premium real estate",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.className}>
      <body
        className={`${heptaSlab.variable}  ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

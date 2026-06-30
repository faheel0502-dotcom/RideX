import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "RideX | Premium Motorcycle Gears & Accessories",
  description: "Gear up with RideX. Discover premium helmets, riding jackets, gloves, boots, and touring accessories. Engineered for safety and performance.",
  keywords: ["motorcycle gear", "riding jackets", "helmets", "riding boots", "dainese", "alpinestars", "shoei"],
  authors: [{ name: "RideX Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-canvas text-text-primary">
        <AuthProvider>
          <SiteConfigProvider>
            <ThemeProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </ThemeProvider>
          </SiteConfigProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";
import PWAInitializer from "@/components/PWAInitializer";
import { CartProvider } from "@/components/CartContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Babli Bakery & Pizza Point | Good Food Good Mood",
    template: "%s | Babli Bakery",
  },
  description:
    "Babli Bakery and Pizza Point — Muzaffarnagar's favourite spot for hot & fresh pizza, loaded burgers, thick shakes, premium coffee and custom cakes. Baked with love ♥",
  keywords: ["Babli Bakery", "Pizza Point", "Muzaffarnagar", "Pizza", "Burger", "Shakes", "Coffee", "Bakery", "Village Sikhera"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Babli Bakery App",
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
  openGraph: {
    title: "Babli Bakery & Pizza Point",
    description: "Good Food Good Mood | Baked with Love ♥ | Muzaffarnagar",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body
        style={{
          fontFamily: "var(--font-jost), system-ui, sans-serif",
          background: "#FFF8F0",
        }}
      >
        <CartProvider>
          <PWAInitializer />
          <LoadingScreen />
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}


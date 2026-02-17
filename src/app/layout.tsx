import type { Metadata } from "next";
import { Geist, Archivo_Black, Inter_Tight } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

import LayoutShell from "@/components/ui/LayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-archivo-black",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SNEAKHUB | Zapatillas Urbanas Exclusivas",
    template: "%s | SNEAKHUB",
  },
  description: "Descubre las zapatillas más exclusivas de Chile. Nike, Jordan, Adidas y más. Envíos a todo el país. Compra segura y garantizada.",
  keywords: ["zapatillas", "sneakers", "chile", "nike", "jordan", "adidas", "yeezy", "moda urbana", "streetwear", "tienda de zapatillas"],
  authors: [{ name: "SNEAKHUB" }],
  creator: "SNEAKHUB",
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://sneakhub.cl",
    title: "SNEAKHUB | Zapatillas Urbanas Exclusivas",
    description: "Las mejores marcas y modelos exclusivos en un solo lugar.",
    siteName: "SNEAKHUB",
  },
  twitter: {
    card: "summary_large_image",
    title: "SNEAKHUB | Zapatillas Urbanas Exclusivas",
    description: "Las mejores marcas y modelos exclusivos en un solo lugar.",
    creator: "@sneakhub_cl",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${archivoBlack.variable} ${interTight.variable} antialiased bg-[#0a0a0a] text-white min-h-screen flex flex-col font-sans`}
      >


        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SNEAKHUB",
              url: "https://sneakhub.cl",
              logo: "https://sneakhub.cl/favicon.svg",
              sameAs: ["https://instagram.com/sneakhub_cl"],
            }),
          }}
        />
        <CartProvider>
          <LayoutShell>{children}</LayoutShell>
        </CartProvider>

      </body>
    </html>
  );
}


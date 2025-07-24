import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import Providers from "./provider";

export const metadata: Metadata = {
  title: "Loopin - Plataforma de Fidelización para Comercios | Sistema de Puntos",
  description: "Loopin conecta comercios con clientes recompensando cada compra. Sistema de fidelización simple y efectivo. Más ventas, clientes que vuelven. ¡Sumate ya!",
  keywords: [
    "fidelización de clientes",
    "sistema de puntos",
    "loyalty program",
    "comercios",
    "marketing",
    "recompensas",
    "canjes",
    "beneficios",
    "Córdoba",
    "Argentina",
    "ventas",
    "retención de clientes"
  ],
  authors: [{ name: "Loopin Team" }],
  creator: "Loopin",
  publisher: "Loopin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://loopin.com.ar"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Loopin - Tus compras valen más de lo que creés",
    description: "Canjeá. Disfrutá. Repetí. La forma más inteligente de fidelizar clientes en tu comercio.",
    url: "https://loopin.com.ar",
    siteName: "Loopin",
    images: [
      {
        url: "/logos/isologo.svg",
        width: 1200,
        height: 630,
        alt: "Loopin - Sistema de Fidelización",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loopin - Sistema de Fidelización para Comercios",
    description: "Conectamos comercios con clientes recompensando cada compra. ¡Sumate a la revolución del canje!",
    images: ["/imgs/twitter-image.png"],
    creator: "@loopin_ar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico"
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#7b61ff",
    "theme-color": "#7b61ff",
  },
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}
      >
        <Providers>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: { zIndex: 99999 }
              }}
            />
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}

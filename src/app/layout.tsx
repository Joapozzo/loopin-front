import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import Providers from "./provider";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

// Configuración del viewport para PWA
export const viewport: Viewport = {
  themeColor: "#7b61ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

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
  // PWA Configuration
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Loopin",
    startupImage: [
      {
        url: "/icons/icon-512x512.png",
        media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  other: {
    "msapplication-TileColor": "#7b61ff",
    "msapplication-config": "/browserconfig.xml",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Loopin",
    "application-name": "Loopin",
    "msapplication-tooltip": "Loopin - Sistema de Fidelización",
    "msapplication-starturl": "/",
    "msapplication-tap-highlight": "no",
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
    <html lang="es">
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        
        {/* Additional PWA meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="320" />
        
        {/* iOS specific meta tags */}
        <meta name="apple-touch-fullscreen" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        
        {/* Splash screens for iOS */}
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon-512x512.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        />
        
        {/* Windows specific */}
        <meta name="msapplication-navbutton-color" content="#7b61ff" />
        <meta name="msapplication-square70x70logo" content="/icons/icon-72x72.png" />
        <meta name="msapplication-square150x150logo" content="/icons/icon-152x152.png" />
        <meta name="msapplication-square310x310logo" content="/icons/icon-512x512.png" />
      </head>
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
            <PWAInstallPrompt/>
          </AuthProvider>
        </Providers>
        
        {/* Registro del Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('✅ PWA: Service Worker registrado exitosamente');
                    })
                    .catch(function(error) {
                      console.log('❌ PWA: Error al registrar Service Worker:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
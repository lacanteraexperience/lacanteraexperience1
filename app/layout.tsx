import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lacanteraexperience.com"),

  title: "La Cantera Experience",

  description:
    "Creamos experiencias deportivas que conectan personas, empresas y clubes a través del fútbol.",

  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },

  openGraph: {
    title: "La Cantera Experience",

    description:
      "Creamos experiencias deportivas que conectan personas, empresas y clubes a través del fútbol.",

    url: "https://lacanteraexperience.com",

    siteName: "La Cantera Experience",

    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 800,
        alt: "La Cantera Experience",
      },
    ],

    locale: "es_ES",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "La Cantera Experience",

    description:
      "Creamos experiencias deportivas que conectan personas, empresas y clubes a través del fútbol.",

    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
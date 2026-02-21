import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "primeicons/primeicons.css";
import "./globals.css";
import Providers from "./components/Providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "LUEURS - Essence of Elegance",
  description: "Discover a world of rare ingredients and master craftsmanship. Scents that linger like a memory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body
        className={`${lato.variable} ${playfair.variable} font-sans antialiased bg-gray-50 text-gray-900`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

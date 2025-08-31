import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const merriweather = Merriweather({ 
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather"
});

export const metadata: Metadata = {
  title: "Book Library - Discover Amazing Books",
  description: "Explore our collection of carefully curated books with beautiful covers and detailed information.",
  keywords: "books, library, reading, literature, book covers",
  openGraph: {
    title: "Book Library - Discover Amazing Books",
    description: "Explore our collection of carefully curated books with beautiful covers and detailed information.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Library - Discover Amazing Books",
    description: "Explore our collection of carefully curated books with beautiful covers and detailed information.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        <div className="bg-black-50">
          {children}
        </div>
      </body>
    </html>
  );
}

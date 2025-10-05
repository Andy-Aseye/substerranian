import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const merriweather = Merriweather({ 
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather"
});

const hauora = localFont({
  src: [
    {
      path: './fonts/hauora-master/Hauora-ExtraLight.otf',
      weight: '200'
    },
    {
      path: "./fonts/hauora-master/Hauora-Light.otf",
      weight: '300'
    },

    {
      path: './fonts/hauora-master/Hauora-Regular.otf',
      weight: '400'
    },
    {
      path: "./fonts/hauora-master/Hauora-Medium.otf",
      weight: '500'
    },
    {
      path: './fonts/hauora-master/Hauora-SemiBold.otf',
      weight: '600'
    },
    {
      path: './fonts/hauora-master/Hauora-Bold.otf',
      weight: '700'
    },
    {
      path: "./fonts/hauora-master/Hauora-ExtraBold.otf",
      weight: '800'
    },
  ],
  variable: '--font-hauora'
})

const kudoes = localFont({
  src: [
    {
      path: './fonts/kudoes/Kudoes Italic Typeface.otf',
      weight: '200',
      style: "italic"
    },
    {
      path: "./fonts/kudoes/Kudoes Typeface.otf",
      weight: '400'
    }
  ],
  variable: '--font-kudoes'
})


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
      <body className={`${inter.variable} ${merriweather.variable} ${hauora.className} ${kudoes.className} font-sans antialiased`} suppressHydrationWarning={true}>
        <div className="bg-black-50 font-[hauora]">
          {children}
        </div>
      </body>
    </html>
  );
}

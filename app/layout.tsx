import type { Metadata } from "next";
import { Inter, Nunito_Sans } from "next/font/google";
import "modern-normalize/modern-normalize.css";
import "./globals.css";
import Header from "@/components/Header/Header";
// import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Footer from "@/components/Footer/Footer";
// import AuthProvider from "@/components/AuthProvider/AuthProvider";

const inter = Inter({
  subsets: ["cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
const nunito = Nunito_Sans({
  subsets: ["cyrillic"],
  weight: ["400"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Welcome to Dream Cloth Market",
  description:
    " Dream is a simple and efficient application for buyimg your favourite clothes.",
  openGraph: {
    title: "Welcome to Dream Cloth Market",
    description:
      " Dream is a simple and efficient application for buyimg your favourite clothes.",
    images: [
      {
        url: "https://08-zustand-phi-bice.vercel.app/",
        width: 1200,
        height: 630,
        alt: "Welcome to Dream Cloth Market",
      },
    ],
    url: "https://08-zustand-phi-bice.vercel.app/",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* <body className={`${inter.variable} ${nunito.variable} `}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main>
              {children}
              {modal}
            </main>
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body> */}
      <body className={`${inter.variable} ${nunito.variable} `}>
        <Header />
        <main>
          {children}
          {modal}
        </main>
        <Footer />
      </body>
    </html>
  );
}

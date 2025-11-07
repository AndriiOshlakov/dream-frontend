import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Footer from "@/components/Footer/Footer";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Welcome to NoteHub",
  description:
    " NoteHub is a simple and efficient application designed for managing personal notes.",
  openGraph: {
    title: "Welcome to NoteHub",
    description:
      " NoteHub is a simple and efficient application designed for managing personal notes.",
    images: [
      {
        url: "https://08-zustand-phi-bice.vercel.app/",
        width: 1200,
        height: 630,
        alt: "Welcome to NoteHub",
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
      <body className={`${roboto.variable} `}>
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
      </body>
    </html>
  );
}

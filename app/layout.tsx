import type { Metadata } from 'next';
import { Inter, Nunito_Sans } from 'next/font/google';
import 'modern-normalize/modern-normalize.css';
import './globals.css';
import Header from '@/components/Header/Header';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import Footer from '@/components/Footer/Footer';
import Container from '@/components/Container/Container';

const inter = Inter({
  subsets: ['cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});
const nunito = Nunito_Sans({
  subsets: ['cyrillic'],
  weight: ['400'],
  variable: '--font-nunito-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Welcome to Dream Cloth Market',
  description: ' Dream is a simple and efficient application for buyimg your favourite clothes.',
  icons: { icon: '/Favicon.png' },
  openGraph: {
    title: 'Welcome to Dream Cloth Market',
    description: ' Dream is a simple and efficient application for buyimg your favourite clothes.',
    images: [
      {
        url: 'https://dream-frontend-navy.vercel.app/',
        width: 1200,
        height: 630,
        alt: 'Welcome to Dream Cloth Market',
      },
    ],
    url: 'https://dream-frontend-navy.vercel.app/',
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} ${nunito.variable} `}>
        <TanStackProvider>
          <Header />
          <Container>
            <main>
              {children}
              {modal}
            </main>
          </Container>
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/firebase/context';

export const metadata: Metadata = {
  title: 'Simple',
  description: 'Just doing things as simply as possible',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

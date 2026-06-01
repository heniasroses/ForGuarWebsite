import { Inter } from "next/font/google";

import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css'

import "../styles/bss-overrides.css";
import "../styles/styles.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Next Studio Manager", template: "%s | Next Studio Manager" },
  description: "Defining, connecting and managing you studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <nav className="flex justify-center space-x-4">
            <Link href="/">Home</Link>
            <Link href="devices">Devices</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}

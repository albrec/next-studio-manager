import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import ContextWrapper from "./contextWrappers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Next Studio Manager", template: "%s | Next Studio Manager" },
  description: "Defining, connecting and managing you studio",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <ContextWrapper>
        <body className={inter.className}>
          <header>
            <nav className="flex justify-center menu menu-horizontal">
              <li><Link href="/">Home</Link></li>
              <li><Link href="devices">Devices</Link></li>
              <li><Link href="connections">Connections</Link></li>
            </nav>
          </header>
          {children}
        </body>
      </ContextWrapper>
    </html>
  );
}

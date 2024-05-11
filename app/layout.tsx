import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import ContextWrapper from "./contextWrappers";
import classNames from "classnames";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Next Studio Manager", template: "%s | Next Studio Manager" },
  description: "Defining, connecting and managing you studio",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      </head>
      <ContextWrapper>
        <body className={ classNames(inter.className, 'px-12') }>
          <header className="flex flex-col items-center">
            <h1 className="text-4xl font-thin">Next Studio Manager</h1>
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

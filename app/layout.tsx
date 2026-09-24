import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Weather App",
  description: "Check the weather for cities around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-muted text-foreground`}
      >
        <div className="min-h-screen py-8 px-6">
          <main className="max-w-xl mx-auto">
            <h1 className="text-base font-semibold mb-6 text-muted-foreground hover:text-foreground">
              <Link href="/">Weather</Link>
            </h1>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

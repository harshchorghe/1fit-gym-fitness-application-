import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gym Fitness App",
  description: "Transform your body – join the best gym in Maharashtra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {/* Theme init script: sets .dark or .light on <html> before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{const t=localStorage.getItem('theme');const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;const theme = t || (prefersDark ? 'dark' : 'light');document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(theme);}catch(e){}})();` }} />
        {children}
      </body>
    </html>
  );
}
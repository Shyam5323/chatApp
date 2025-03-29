"use client";
import { useEffect, useState } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/provider/ConvexClientProvider";
import LoadingLogo from "@/components/shared/LoadingLogo";
import { Authenticated, AuthLoading } from "convex/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${
          mounted ? "" : "opacity-0"
        }`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <Authenticated>
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster richColors />
            </Authenticated>
            <AuthLoading>
              <LoadingLogo />
            </AuthLoading>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

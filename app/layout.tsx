import type { Metadata, Viewport } from "next";
import RootLayout from "./RootLayout"; // Import the client layout

export const viewport: Viewport = {
  themeColor: "DodgerBlue",
};

export const metadata: Metadata = {
  title: "Chat App",
  description: "Real-time chat app made with Next.js",
  generator: "Next.js",
  manifest: "/manifest.json",
  authors: [{ name: "Chandan" }],
  icons: [
    { rel: "apple-touch-icon", url: "icon512_rounded.png" },
    { rel: "icon", url: "icon512_rounded.png" },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout>{children}</RootLayout>;
}

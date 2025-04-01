import type { Metadata } from "next";
import RootLayout from "./RootLayout"; // Import the client layout

export const metadata: Metadata = {
  title: "Chat App",
  description: "Real-time chat app made with Next.js",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout>{children}</RootLayout>;
}

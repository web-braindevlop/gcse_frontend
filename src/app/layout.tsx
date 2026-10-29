import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion";
import { ToastProvider } from "@/components/feedback";
import { AgentationDevTools } from "@/components/dev/agentation-dev-tools";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Educate Cloud | GCSE learning",
  description: "A learning space for GCSE students.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MotionProvider>
          <ToastProvider>
            {children}
            <AgentationDevTools />
          </ToastProvider>
        </MotionProvider>
      </body>
    </html>
  );
}






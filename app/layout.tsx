import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineInsight — AI Movie Sentiment Analyzer",
  description: "Enter an IMDb movie ID to get AI-powered audience sentiment analysis, cast details, and deep movie insights.",
  keywords: ["movie", "IMDb", "AI", "sentiment", "film analysis"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}

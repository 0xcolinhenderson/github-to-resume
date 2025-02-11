import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: "200",
});

export const metadata = {
  title: "RepoToResume",
  description: "Created by Colin Henderson",
};

export default function RootLayout({ children }) {
  return (
    <Analytics>
      <SpeedInsights>
        <html lang="en">
          <body className={`${inter.variable} antialiased`}>
            {children}
          </body>
        </html>
      </SpeedInsights>
    </Analytics>
  );
}

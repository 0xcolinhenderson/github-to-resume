import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: "200",
});

export const metadata = {
  title: "RepoToResume",
  description: "RepoToResume v1.0 - Quickly create an automated project card based on a public GitHub repository!",
};

export default function RootLayout({ children }) {
  return (
        <html lang="en">
          <body className={`${inter.variable} antialiased`}>
            <link rel="icon" type="image/png" href="/favicon.png"/>
            {children}
          </body>
        </html>
  );
}

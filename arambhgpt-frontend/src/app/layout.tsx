import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { SkipLinks } from "@/components/accessibility";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ArambhGPT - AI Mental Health Companion",
  description: "Your compassionate AI mental health companion supporting you in English, Hindi, and Hinglish. Get personalized guidance and emotional support anytime.",
  keywords: ["mental health", "AI", "therapy", "counseling", "Hindi", "English", "Hinglish", "emotional support"],
  authors: [{ name: "ArambhGPT Team" }],
  creator: "ArambhGPT",
  publisher: "ArambhGPT",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://arambhgpt.com",
    title: "ArambhGPT - AI Mental Health Companion",
    description: "Your compassionate AI mental health companion supporting you in multiple languages.",
    siteName: "ArambhGPT",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArambhGPT - AI Mental Health Companion",
    description: "Your compassionate AI mental health companion supporting you in multiple languages.",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans antialiased h-full bg-white text-gray-900`}>
        <ErrorBoundary>
          <AuthProvider>
            <SkipLinks />
            <div className="min-h-full flex flex-col">
              <Navbar />
              <main id="main-content" className="flex-1" role="main">
                {children}
              </main>
              <footer className="bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-sm text-gray-600">
                      © 2024 ArambhGPT. All rights reserved.
                    </div>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                      <a href="/privacy" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">
                        Privacy Policy
                      </a>
                      <a href="/terms" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">
                        Terms of Service
                      </a>
                      <a href="/contact" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">
                        Contact
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

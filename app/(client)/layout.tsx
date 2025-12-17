import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "B7R Store - Best Clothes",
  description: "B7R Store is the best place to find the best clothes",
};
export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="p-4 sm:px-0 mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
        <Navbar />
        {children}
        <Footer />
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
}

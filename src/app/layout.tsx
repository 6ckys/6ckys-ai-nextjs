import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import React from "react";
import Script from 'next/script';
import {ToastProvider} from "@/app/hooks/useToast";
import {ChatProvider} from "@/app/contexts/ChatContext";
import {ToastContainer} from "@/app/components/ui/Toast";

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'AI Chat by 6ckys | Next.js 15',
    description: 'Enhanced AI Chat Interface with Next.js 15',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`${inter.className} font-dyslexic bg-black text-gray-200`}>
        <ToastProvider>
            <ChatProvider>
                {children}
                <ToastContainer/>
            </ChatProvider>
        </ToastProvider>
        <Script
            src="https://js.puter.com/v2/"
            strategy="afterInteractive"
        />
        </body>
        </html>
    );
}

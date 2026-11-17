import { Chatbot } from '@/components/chatbot/chatbot';
import { StudentChatbot } from '@/components/chatbot/student-chatbot';
import CopyRight from '@/components/layout/copy-right';
import Providers from '@/components/layout/providers';
import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';

const geistSans = localFont({
    src: '../public/fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900'
});

const geistMono = localFont({
    src: '../public/fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900'
});

export const metadata: Metadata = {
    manifest: '/manifest.json',
    title: 'VAPS',
    description: 'Thsi is a web application School Management with advanced features.',
    icons: '/icons/VAPS.png'
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
    const session = await auth();
    return (
        <html lang='en' suppressHydrationWarning>
            <body suppressHydrationWarning className={cn('min-h-screen min-w-[360px] bg-layout font-sans antialiased', geistSans.variable, geistMono.variable)}>
                <NextTopLoader color='#4F39F6' showSpinner={false} height={3} speed={300} />
                <Providers session={session}>
                    {children}
                    <Chatbot />
                    <StudentChatbot />
                    <CopyRight />
                    <Toaster position='bottom-right' closeButton={true} duration={3000} richColors className={`${geistSans.className}`} />
                </Providers>
            </body>
        </html>
    );
}

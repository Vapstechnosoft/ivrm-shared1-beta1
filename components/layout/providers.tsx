'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, type SessionProviderProps } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

interface ProvidersProps {
    children: React.ReactNode;
    session: SessionProviderProps['session'];
}

export default function Providers({ children, session }: ProvidersProps) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false, // Prevent automatic refetch on window focus
                staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
                gcTime: 10 * 60 * 1000, // 10 minutes - cache time (formerly cacheTime)
                retry: 2,
                refetchOnMount: false, // Don't refetch on component mount if data exists
                refetchOnReconnect: false // Don't refetch on reconnect
            }
        }
    });
    return (
        <NextThemesProvider attribute='class' defaultTheme='light' enableSystem={false} disableTransitionOnChange>
            <QueryClientProvider client={queryClient}>
                <SessionProvider
                    session={session}
                    // Reduce session polling - only refetch when tab is focused and 5 minutes have passed
                    refetchInterval={5 * 60} // 5 minutes in seconds
                    refetchOnWindowFocus={false} // Don't refetch session on every window focus
                >
                    <TooltipProvider delayDuration={0}>
                        <NuqsAdapter>{children}</NuqsAdapter>
                    </TooltipProvider>
                </SessionProvider>
            </QueryClientProvider>
        </NextThemesProvider>
    );
}

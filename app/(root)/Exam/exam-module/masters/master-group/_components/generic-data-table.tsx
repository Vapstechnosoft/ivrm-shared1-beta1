'use client';

import { Database, RefreshCw } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                           📦 Data State Handler                            */
/* -------------------------------------------------------------------------- */
interface DataStateHandlerProps {
    isLoading?: boolean;
    error?: Error | null;
    success?: boolean;
    dataLength?: number;
    errorMessage?: string;
    loadingMessage?: string;
    errorTitle?: string;
    noDataTitle?: string;
    noDataDescription?: string;
    requestFailedTitle?: string;
    LoadingIcon?: React.ComponentType<{ className?: string }>;
    ErrorIcon?: React.ComponentType<{ className?: string }>;
    NoDataIcon?: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
}

export function DataStateHandler({
    isLoading = false,
    error = null,
    success = true,
    dataLength = 0,
    errorMessage,
    loadingMessage = 'Loading data...',
    errorTitle = 'Error Loading Data',
    noDataTitle = 'No Data Found',
    noDataDescription = 'Get started by creating your first record',
    requestFailedTitle = 'Request Failed',
    LoadingIcon = RefreshCw,
    ErrorIcon = Database,
    NoDataIcon = Database,
    children
}: DataStateHandlerProps) {
    if (isLoading) {
        return (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                <LoadingIcon className='h-8 w-8 animate-spin text-secondary' />
                <p className='text-muted-foreground text-sm'>{loadingMessage}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                <div className='rounded-full bg-destructive/10 p-3'>
                    <ErrorIcon className='h-6 w-6 text-destructive' />
                </div>
                <div className='space-y-2 text-center'>
                    <h3 className='font-semibold text-destructive'>{errorTitle}</h3>
                    <p className='text-muted-foreground text-sm'>{error.message || errorMessage || 'Failed to load data'}</p>
                </div>
            </div>
        );
    }

    if (!success) {
        return (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                <div className='rounded-full bg-destructive/10 p-3'>
                    <ErrorIcon className='h-6 w-6 text-destructive' />
                </div>
                <div className='space-y-2 text-center'>
                    <h3 className='font-semibold text-destructive'>{requestFailedTitle}</h3>
                    <p className='text-muted-foreground text-sm'>{errorMessage || 'Failed to fetch data'}</p>
                </div>
            </div>
        );
    }

    if (dataLength === 0) {
        return (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                <div className='rounded-full bg-muted p-3'>
                    <NoDataIcon className='h-6 w-6 text-muted-foreground' />
                </div>
                <div className='space-y-2 text-center'>
                    <h3 className='font-semibold'>{noDataTitle}</h3>
                    <p className='text-muted-foreground text-sm'>{noDataDescription}</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

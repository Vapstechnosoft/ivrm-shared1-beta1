'use client';

import { Button } from '@/components/ui/button';
import { updateApplicationPaymentStatus } from '@/server/admission/preadmission/transactions/application_form';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
    const params = useParams();
    const [isProcessing, setIsProcessing] = useState(true);
    const [apiCallStatus, setApiCallStatus] = useState<'pending' | 'success' | 'error'>('pending');
    const [errorMessage, setErrorMessage] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !params?.id) {
            return;
        }

        // ✅ Check if payment was already processed by the API route
        const searchParams = new URLSearchParams(window.location.search);
        const wasProcessed = searchParams.get('processed') === 'true';

        console.log('🔵 CLIENT: Page loaded for transaction:', params.id);
        console.log('🔵 CLIENT: Already processed:', wasProcessed);

        if (wasProcessed) {
            // Payment was already processed by the callback route
            console.log('✅ CLIENT: Payment already processed, showing success');
            setApiCallStatus('success');
            setIsProcessing(false);
            toast.success('Payment completed successfully!');

            // Clean up URL
            window.history.replaceState({}, '', window.location.pathname);

            setTimeout(() => {
                if (typeof window !== 'undefined') {
                    window.location.href = '/admission/preadmission/transactions/application-form';
                }
            }, 3000);

            return;
        }

        // ✅ Fallback: Process payment if not already done
        let isCancelled = false;

        const processPayment = async () => {
            try {
                if (!params?.id) return;

                const transactionId = Array.isArray(params.id) ? params.id[0] : params.id;
                console.log('🔵 CLIENT: Processing payment for:', transactionId);

                const response = await updateApplicationPaymentStatus('success', transactionId);

                if (isCancelled) return;

                console.log('🔵 CLIENT: Payment response received:', response);

                if (!response) {
                    console.error('🔴 CLIENT: Response is undefined or null');
                    throw new Error('No response received from server');
                }

                if (response.success) {
                    console.log('✅ CLIENT: Payment successful!');
                    setApiCallStatus('success');
                    toast.success('Payment completed successfully!');

                    setTimeout(() => {
                        if (typeof window !== 'undefined') {
                            window.location.href = '/admission/preadmission/transactions/application-form';
                        }
                    }, 3000);
                } else {
                    console.error('🔴 CLIENT: Payment failed:', response.message);
                    throw new Error(response.message || 'Payment verification failed');
                }
            } catch (error: any) {
                if (isCancelled) return;

                console.error('🔴 CLIENT: Payment verification error:', error);
                setApiCallStatus('error');

                const errorMsg = error?.message || error?.toString() || 'An error occurred while processing your payment';
                setErrorMessage(errorMsg);
                toast.error('Payment verification failed: ' + errorMsg);
            } finally {
                if (!isCancelled) {
                    setIsProcessing(false);
                }
            }
        };

        processPayment();

        return () => {
            isCancelled = true;
        };
    }, [isClient, params?.id]);

    const handleRetry = () => {
        if (typeof window !== 'undefined') {
            window.location.href = '/admission/preadmission/transactions/application-form';
        }
    };

    if (!isClient) {
        return null;
    }

    if (!params?.id) {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <div className='text-center'>
                    <Loader2 className='mx-auto mb-4 h-8 w-8 animate-spin text-primary' />
                    <p className='text-muted-foreground'>Loading payment details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4 dark:from-gray-900 dark:to-gray-800'>
            <div className='w-full max-w-md'>
                <div className='rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800'>
                    {isProcessing ? (
                        <div className='flex flex-col items-center gap-6'>
                            <div className='relative'>
                                <div className='absolute inset-0 animate-ping rounded-full bg-green-500/20' />
                                <div className='relative rounded-full bg-green-100 p-6 dark:bg-green-900/30'>
                                    <Loader2 className='h-12 w-12 animate-spin text-green-600 dark:text-green-400' />
                                </div>
                            </div>
                            <div className='text-center'>
                                <h2 className='mb-2 font-bold text-2xl text-gray-900 dark:text-white'>Processing Payment</h2>
                                <p className='text-gray-600 dark:text-gray-400'>Please wait while we verify your payment...</p>
                            </div>
                            <div className='h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
                                <div className='h-full w-3/4 animate-pulse rounded-full bg-green-600' />
                            </div>
                        </div>
                    ) : apiCallStatus === 'success' ? (
                        <div className='flex flex-col items-center gap-6'>
                            <div className='relative'>
                                <div className='absolute inset-0 animate-pulse rounded-full bg-green-500/20' />
                                <div className='relative rounded-full bg-green-100 p-6 dark:bg-green-900/30'>
                                    <CheckCircle2 className='h-16 w-16 text-green-600 dark:text-green-400' />
                                </div>
                            </div>
                            <div className='text-center'>
                                <h2 className='mb-2 font-bold text-2xl text-gray-900 dark:text-white'>Payment Successful!</h2>
                                <p className='mb-4 text-gray-600 dark:text-gray-400'>Your payment has been processed successfully.</p>
                                <div className='inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700 text-sm dark:bg-green-900/30 dark:text-green-400'>
                                    <span className='relative flex h-2 w-2'>
                                        <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75' />
                                        <span className='relative inline-flex h-2 w-2 rounded-full bg-green-500' />
                                    </span>
                                    Redirecting you shortly...
                                </div>
                            </div>
                            <div className='w-full space-y-3 pt-4'>
                                <div className='flex items-center justify-between text-sm'>
                                    <span className='text-gray-600 dark:text-gray-400'>Transaction Status</span>
                                    <span className='font-medium text-green-600 dark:text-green-400'>Completed</span>
                                </div>
                                <div className='flex items-center justify-between text-sm'>
                                    <span className='text-gray-600 dark:text-gray-400'>Payment Verified</span>
                                    <span className='font-medium text-green-600 dark:text-green-400'>✓ Yes</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center gap-6'>
                            <div className='relative'>
                                <div className='absolute inset-0 animate-pulse rounded-full bg-red-500/20' />
                                <div className='relative rounded-full bg-red-100 p-6 dark:bg-red-900/30'>
                                    <XCircle className='h-16 w-16 text-red-600 dark:text-red-400' />
                                </div>
                            </div>
                            <div className='text-center'>
                                <h2 className='mb-2 font-bold text-2xl text-gray-900 dark:text-white'>Verification Failed</h2>
                                <p className='mb-4 text-gray-600 dark:text-gray-400'>{errorMessage}</p>
                            </div>
                            <Button
                                type='button'
                                onClick={handleRetry}
                                className='w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90'>
                                Go to Applications
                            </Button>
                        </div>
                    )}
                </div>

                {!isProcessing && (
                    <div className='mt-6 text-center'>
                        <p className='text-gray-600 text-sm dark:text-gray-400'>
                            Need help? Contact{' '}
                            <a href='mailto:support@example.com' className='text-primary hover:underline'>
                                support@example.com
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';
import { updateApplicationPaymentStatus } from '@/server/admission/preadmission/transactions/application_form';
import { AlertCircle, Loader2, XCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function PaymentFailurePage() {
    const params = useParams();
    const [isProcessing, setIsProcessing] = useState(true);
    const [apiCallStatus, setApiCallStatus] = useState<'pending' | 'success' | 'error'>('pending');
    const [failureReason, setFailureReason] = useState('');
    const [transactionId, setTransactionId] = useState('');
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

        console.log('🔵 CLIENT: Already processed:', wasProcessed);

        if (wasProcessed) {
            // Payment was already processed by the callback route
            console.log('✅ CLIENT: Payment failure already processed, showing result');
            setApiCallStatus('success');
            setIsProcessing(false);

            const txnId = Array.isArray(params.id) ? params.id[0] : params.id;
            setTransactionId(txnId);
            setFailureReason('Payment was not completed');

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

                const txnId = Array.isArray(params.id) ? params.id[0] : params.id;
                console.log('🔵 CLIENT: Processing failed payment for:', txnId);

                setTransactionId(txnId);
                setFailureReason('Payment was not completed');

                const response = await updateApplicationPaymentStatus('failed', txnId);

                if (isCancelled) return;

                console.log('🔵 CLIENT: Payment failure response received:', response);

                if (!response) {
                    console.error('🔴 CLIENT: Response is undefined or null');
                    throw new Error('No response received from server');
                }

                if (response.success) {
                    console.log('✅ CLIENT: Payment failure recorded!');
                    setApiCallStatus('success');

                    setTimeout(() => {
                        if (typeof window !== 'undefined') {
                            window.location.href = '/admission/preadmission/transactions/application-form';
                        }
                    }, 3000);
                } else {
                    console.error('🔴 CLIENT: Failed to record payment failure:', response.message);
                    throw new Error(response.message || 'Failed to record payment status');
                }
            } catch (error: any) {
                if (isCancelled) return;

                console.error('🔴 CLIENT: Payment failure logging error:', error);
                setApiCallStatus('error');
                toast.error('Failed to record payment status');
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

    const handleGoBack = () => {
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
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4 dark:from-gray-900 dark:to-gray-800'>
            <div className='w-full max-w-md'>
                <div className='rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800'>
                    {isProcessing ? (
                        <div className='flex flex-col items-center gap-6'>
                            <div className='relative'>
                                <div className='absolute inset-0 animate-ping rounded-full bg-orange-500/20' />
                                <div className='relative rounded-full bg-orange-100 p-6 dark:bg-orange-900/30'>
                                    <Loader2 className='h-12 w-12 animate-spin text-orange-600 dark:text-orange-400' />
                                </div>
                            </div>
                            <div className='text-center'>
                                <h2 className='mb-2 font-bold text-2xl text-gray-900 dark:text-white'>Processing Response</h2>
                                <p className='text-gray-600 dark:text-gray-400'>Please wait while we record your payment status...</p>
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
                                <h2 className='mb-2 font-bold text-2xl text-gray-900 dark:text-white'>Payment Failed</h2>
                                <p className='mb-4 text-gray-600 dark:text-gray-400'>Your payment could not be processed.</p>
                            </div>

                            <div className='w-full space-y-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/10'>
                                <div className='flex items-start gap-3'>
                                    <AlertCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400' />
                                    <div className='flex-1'>
                                        <h3 className='mb-1 font-medium text-red-900 text-sm dark:text-red-100'>Reason</h3>
                                        <p className='text-red-700 text-sm dark:text-red-300'>{failureReason}</p>
                                    </div>
                                </div>
                                {transactionId && (
                                    <div className='border-red-200 border-t pt-2 dark:border-red-900'>
                                        <div className='flex items-center justify-between text-sm'>
                                            <span className='text-red-700 dark:text-red-300'>Transaction ID</span>
                                            <span className='font-mono text-red-900 text-xs dark:text-red-100'>{transactionId}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='w-full rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50'>
                                <h3 className='mb-3 font-medium text-gray-900 text-sm dark:text-white'>
                                    Common reasons for payment failure:
                                </h3>
                                <ul className='space-y-2 text-gray-600 text-sm dark:text-gray-400'>
                                    <li className='flex items-start gap-2'>
                                        <span className='mt-1 text-gray-400'>•</span>
                                        <span>Insufficient funds in your account</span>
                                    </li>
                                    <li className='flex items-start gap-2'>
                                        <span className='mt-1 text-gray-400'>•</span>
                                        <span>Incorrect card details or OTP</span>
                                    </li>
                                    <li className='flex items-start gap-2'>
                                        <span className='mt-1 text-gray-400'>•</span>
                                        <span>Payment limit exceeded</span>
                                    </li>
                                    <li className='flex items-start gap-2'>
                                        <span className='mt-1 text-gray-400'>•</span>
                                        <span>Network or technical issues</span>
                                    </li>
                                </ul>
                            </div>
                            {/* 
                            <div className='flex w-full flex-col gap-3 pt-2 sm:flex-row'>
                                <Button
                                    type='button'
                                    onClick={handleGoBack}
                                    className='flex-1 rounded-lg border border-input px-6 py-3 font-medium transition-colors hover:bg-accent'>
                                    Go Back
                                </Button>
                                <Button
                                    type='button'
                                    onClick={handleRetry}
                                    className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90'>
                                    <RefreshCw className='h-4 w-4' />
                                    Try Again
                                </Button>
                            </div> */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog } from '@/components/ui/extension/adaptive-dialog';
import { useStudentApplicationList } from '@/hooks/admission/preadmission/useTransactions';
import { applicationFormInitiatePayment } from '@/server/admission/preadmission/transactions/application_form';
import type { IInitiatePaymentResponse, IPreadmissionStudentApplicationList } from '@/types/admission/preadmission/transactions';
import { ArrowUpRight, CreditCard, Hash, IndianRupee, Loader2, Mail, Phone, ReceiptIndianRupee, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function PaymentDialog({ cell }: { cell: any }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<IPreadmissionStudentApplicationList>();
    const { refetchAll } = useStudentApplicationList(selectedRow?.asmay_id ?? 0);
    const [paymentData, setPaymentData] = useState<IInitiatePaymentResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const formContainerRef = useRef<HTMLDivElement>(null);

    const handleEdit = (row: IPreadmissionStudentApplicationList) => {
        setSelectedRow(row);
        setIsDialogOpen(true);
    };

    useEffect(() => {
        if (isDialogOpen && selectedRow) {
            getPaymentHtml();
        }
    }, [isDialogOpen, selectedRow]);

    const getPaymentHtml = async () => {
        setIsLoading(true);
        try {
            const response = await applicationFormInitiatePayment(selectedRow?.pasr_id ?? 0);
            if (response.success && response.data != null && response.data?.html_form) {
                setPaymentData(response.data);
            } else {
                toast.error(response.message);
                setIsDialogOpen(false);
            }
        } catch (error: any) {
            toast.error(error.message);
            setIsDialogOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayNow = () => {
        if (!paymentData?.html_form || !formContainerRef.current) return;

        setIsProcessing(true);

        // Create a temporary container for the form
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = paymentData.html_form;
        const form = tempDiv.querySelector('form');

        if (form) {
            // Remove the auto-submit script
            const scripts = tempDiv.querySelectorAll('script');
            scripts.forEach((script) => script.remove());

            // Append form to our container (hidden)
            formContainerRef.current.appendChild(form);

            // Submit the form
            form.submit();

            // The form will redirect to payment gateway
            // Dialog will be closed when user returns via success/failure URL
        }
    };

    function closeDialog() {
        setIsDialogOpen(false);
        setPaymentData(null);
        setIsProcessing(false);
        refetchAll();
    }

    return (
        <>
            <div className='flex gap-2' onClick={() => handleEdit(cell.getValue())}>
                <Badge className='cursor-pointer bg-green-500 p-3 font-extrabold text-black hover:bg-green-600'>
                    <ReceiptIndianRupee className='h-4 w-4' /> Pay Now
                    <ArrowUpRight className='size-4 transition-all ease-linear group-hover:translate-x-2' />
                </Badge>
            </div>

            {selectedRow && (
                <AdaptiveDialog
                    title='Application Form Payment'
                    isOpen={isDialogOpen}
                    onClose={closeDialog}
                    size='xl'
                    interactOutside={false}>
                    <AdaptiveBody className='flex flex-col gap-6'>
                        {isLoading ? (
                            <div className='flex flex-col items-center justify-center gap-4 py-12'>
                                <Loader2 className='h-12 w-12 animate-spin text-primary' />
                                <p className='text-muted-foreground text-sm'>Initializing payment...</p>
                            </div>
                        ) : paymentData ? (
                            <>
                                {/* Payment Header */}
                                <div className='rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-6'>
                                    <div className='mb-4 flex items-center justify-between'>
                                        <div className='flex items-center gap-3'>
                                            <div className='rounded-full bg-primary/10 p-3'>
                                                <CreditCard className='h-6 w-6 text-primary' />
                                            </div>
                                            <div>
                                                <h3 className='font-semibold text-lg'>Payment Details</h3>
                                                <p className='text-muted-foreground text-sm'>Complete your application fee payment</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount Display */}
                                    <div className='mt-4 border-t pt-4'>
                                        <div className='flex items-baseline gap-2'>
                                            <span className='text-muted-foreground text-sm'>Amount to Pay:</span>
                                            <span className='font-bold text-3xl text-primary'>
                                                ₹{Number(paymentData.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Transaction Info */}
                                <div className='rounded-lg border bg-card p-6'>
                                    <h4 className='mb-4 font-semibold text-base'>Transaction Information</h4>
                                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                        <div className='flex items-start gap-3'>
                                            <div className='mt-0.5 rounded-md bg-muted p-2'>
                                                <Hash className='h-4 w-4 text-muted-foreground' />
                                            </div>
                                            <div className='min-w-0 flex-1'>
                                                <p className='mb-1 text-muted-foreground text-xs'>Transaction ID</p>
                                                <p className='break-all font-mono text-sm'>{paymentData.transaction_id}</p>
                                            </div>
                                        </div>

                                        <div className='flex items-start gap-3'>
                                            <div className='mt-0.5 rounded-md bg-muted p-2'>
                                                <User className='h-4 w-4 text-muted-foreground' />
                                            </div>
                                            <div className='min-w-0 flex-1'>
                                                <p className='mb-1 text-muted-foreground text-xs'>Name</p>
                                                <p className='break-words text-sm'>{paymentData.customer_name}</p>
                                            </div>
                                        </div>

                                        <div className='flex items-start gap-3'>
                                            <div className='mt-0.5 rounded-md bg-muted p-2'>
                                                <Mail className='h-4 w-4 text-muted-foreground' />
                                            </div>
                                            <div className='min-w-0 flex-1'>
                                                <p className='mb-1 text-muted-foreground text-xs'>Email</p>
                                                <p className='break-all text-sm'>{paymentData.customer_email}</p>
                                            </div>
                                        </div>

                                        <div className='flex items-start gap-3'>
                                            <div className='mt-0.5 rounded-md bg-muted p-2'>
                                                <Phone className='h-4 w-4 text-muted-foreground' />
                                            </div>
                                            <div className='min-w-0 flex-1'>
                                                <p className='mb-1 text-muted-foreground text-xs'>Phone</p>
                                                <p className='text-sm'>{paymentData.customer_phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Note */}
                                <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20'>
                                    <div className='flex gap-3'>
                                        <svg
                                            className='mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                                            />
                                        </svg>
                                        <div className='flex-1'>
                                            <h5 className='mb-1 font-medium text-blue-900 text-sm dark:text-blue-100'>Secure Payment</h5>
                                            <p className='text-blue-700 text-xs dark:text-blue-300'>
                                                You will be redirected to Easebuzz payment gateway to complete your transaction securely.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex flex-col justify-end gap-3 pt-2 sm:flex-row'>
                                    <Button
                                        type='button'
                                        onClick={closeDialog}
                                        disabled={isProcessing}
                                        className='w-fit rounded-md border border-input px-6 py-2.5 transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50'>
                                        Cancel
                                    </Button>
                                    <Button
                                        type='button'
                                        onClick={handlePayNow}
                                        disabled={isProcessing}
                                        className='flex w-fit items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'>
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className='h-4 w-4 animate-spin' />
                                                Redirecting to Payment Gateway...
                                            </>
                                        ) : (
                                            <>
                                                <IndianRupee className='h-4 w-4' />
                                                Proceed to Pay
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Hidden form container */}
                                <div ref={formContainerRef} className='hidden' />
                            </>
                        ) : (
                            <div className='flex flex-col items-center justify-center gap-4 py-12'>
                                <p className='text-muted-foreground'>Unable to load payment details</p>
                            </div>
                        )}
                    </AdaptiveBody>
                </AdaptiveDialog>
            )}
        </>
    );
}

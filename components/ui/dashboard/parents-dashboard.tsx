'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { ROUTES } from '@/constants/routes';
import { useParentDashboard } from '@/hooks/admission/preadmission/useReports';
import { useActivePreadmissionDetails, useDocumentDownload } from '@/hooks/admission/preadmission/useTransactions';
import type { IParentsDashboardStudentResponse } from '@/types/admission/preadmission/reports';
import { ArrowUpRight, CreditCard, Eye, Loader2, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ParentsDashboard() {
    const router = useRouter();
    const { data: activePreadmission, isLoading: activePreadmissionLoading } = useActivePreadmissionDetails();
    const { data: parentDashboard, isLoading: parentDashboardLoading } = useParentDashboard(activePreadmission?.data?.asmaY_Id ?? 0);

    const [appId, setAppId] = useState(0);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const { mutate: downloadDocument, isPending: isLoading } = useDocumentDownload();
    const [iframeLoading, setIframeLoading] = useState(false);
    const [pdfBase64, setPdfBase64] = useState<string | null>(null);

    useEffect(() => {
        if (showPdfModal && pdfBase64 && appId > 0) {
            setIframeLoading(true);
        }
        if (!showPdfModal) setIframeLoading(false);
    }, [showPdfModal, pdfBase64, appId]);

    useEffect(() => {
        // Trigger download when modal opens and user is authorized
        if (showPdfModal && !pdfBase64 && appId > 0) {
            downloadDocument(appId, {
                onSuccess: (data) => {
                    const base64 =
                        typeof data?.data === 'string'
                            ? data.data
                            : Array.isArray(data?.data)
                              ? ((data.data[0] as unknown as string) ?? null)
                              : null;
                    setPdfBase64(base64);
                },
                onError: (error) => {
                    console.error('Failed to load document:', error);
                    toast.error('Failed to load document');
                    setPdfBase64(null);
                }
            });
        }
    }, [showPdfModal, pdfBase64, appId]);

    const applications: IParentsDashboardStudentResponse[] = parentDashboard?.data || [];

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'ACCEPTED':
                return 'text-green-600 font-semibold';
            case 'CONFIRM':
                return 'text-green-600 font-semibold';
            case 'INPROGRESS':
                return 'text-yellow-600 font-semibold';
            case 'REJECTED':
                return 'text-red-600 font-semibold';
            default:
                return 'text-muted-foreground font-semibold';
        }
    };

    const handleViewAdmissionForm = (pasrId: number) => {
        setAppId(pasrId);
        setShowPdfModal(true);
    };

    const handlePayAdmissionFee = () => {
        router.push(
            `${ROUTES.ADMISSION.ADMISSION}${ROUTES.ADMISSION.ADMISSION_SUB_MENUS.PREADMISSION}${ROUTES.ADMISSION.ADMISSION_SUB_MENUS.PREADMISSION_SUB_MENUS.TRANSACTIONS}${ROUTES.ADMISSION.ADMISSION_SUB_MENUS.PREADMISSION_SUB_MENUS.TRANSACTIONS_SUB_MENUS.APPLICATION_FORM}`
        );
    };

    // Loading State
    if (activePreadmissionLoading || parentDashboardLoading) {
        return (
            <div className='container mx-auto p-6'>
                <div className='space-y-6'>
                    {[1].map((index) => (
                        <Card key={index} className='overflow-hidden border-border shadow-lg'>
                            <div className='p-6 md:p-8'>
                                <div className='grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_auto]'>
                                    <div className='space-y-4'>
                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                            <Skeleton className='h-6 w-full' />
                                            <Skeleton className='h-6 w-full' />
                                        </div>
                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                            <Skeleton className='h-6 w-full' />
                                            <Skeleton className='h-6 w-full' />
                                        </div>
                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                            <Skeleton className='h-6 w-full' />
                                            <Skeleton className='h-6 w-full' />
                                        </div>
                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                            <Skeleton className='h-6 w-3/4' />
                                            <Skeleton className='h-6 w-3/4' />
                                        </div>
                                        <div className='flex gap-3 pt-2'>
                                            <Skeleton className='h-10 w-48' />
                                            <Skeleton className='h-10 w-48' />
                                        </div>
                                    </div>
                                    <div className='flex justify-center md:justify-end'>
                                        <Skeleton className='h-32 w-32 rounded-lg md:h-40 md:w-40' />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                <div className='mt-8 flex items-center justify-center'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary' />
                    <span className='ml-3 text-muted-foreground'>Loading applications...</span>
                </div>
            </div>
        );
    }

    // Empty State
    if (!applications || applications.length === 0) {
        return (
            <div className='container mx-auto p-6'>
                <div className='py-12 text-center'>
                    <p className='text-lg text-muted-foreground'>No applications found</p>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto p-6'>
            <div className='space-y-6'>
                {applications.map((application) => (
                    <Card key={application.pasr_id} className='relative overflow-hidden border-border shadow-lg'>
                        {/* Background Image */}
                        <div className='absolute inset-0'>
                            <Image src='/assets/sophia_banner.jpg' alt='School Banner' fill className='object-cover' priority />
                        </div>

                        {/* Overlay for better text readability */}
                        <div className='relative bg-black/40 backdrop-blur-[1px]'>
                            <div className='p-6 md:p-8'>
                                <div className='grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_auto]'>
                                    {/* Left Section - Student Details */}
                                    <div className='space-y-4'>
                                        {/* Row 1 */}
                                        <div className='grid grid-cols-1 gap-4 text-white md:grid-cols-2'>
                                            <div className='flex items-start gap-2'>
                                                <span className='min-w-[140px] font-semibold'>Name</span>
                                                <span className='font-semibold'>:</span>
                                                <span className='font-bold uppercase'>{application.student_name}</span>
                                            </div>
                                            <div className='flex items-start gap-2'>
                                                <span className='min-w-[140px] font-semibold'>Applied For</span>
                                                <span className='font-semibold'>:</span>
                                                <span className='font-bold'>{application.applied_class_name}</span>
                                            </div>
                                        </div>

                                        {/* Row 2 */}
                                        <div className='grid grid-cols-1 gap-4 text-white md:grid-cols-2'>
                                            <div className='flex items-start gap-2'>
                                                <span className='min-w-[140px] font-semibold'>DOB</span>
                                                <span className='font-semibold'>:</span>
                                                <span className='font-bold'>{application.date_of_birth}</span>
                                            </div>
                                            <div className='flex items-start gap-2'>
                                                <span className='min-w-[140px] font-semibold'>Mobile No.</span>
                                                <span className='font-semibold'>:</span>
                                                <span className='font-bold'>{application.mobile_no}</span>
                                            </div>
                                        </div>

                                        {/* Row 3 */}
                                        <div className='grid grid-cols-1 gap-4 text-white md:grid-cols-2'>
                                            <div className='flex items-start gap-2'>
                                                <span className='min-w-[140px] font-semibold'>Application NO</span>
                                                <span className='font-semibold'>:</span>
                                                <span className='font-bold'>{application.registration_number}</span>
                                            </div>
                                            <div className='flex items-start gap-2'>
                                                <span className='min-w-[140px] font-semibold'>Email-ID</span>
                                                <span className='font-semibold'>:</span>
                                                <span className='break-all font-bold'>{application.email_id}</span>
                                            </div>
                                        </div>

                                        {/* Row 4 - Status */}
                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                            <div className='flex items-start gap-2'>
                                                <span className='min-w-[140px] font-semibold text-white'>Application status:</span>
                                                <span
                                                    className={`font-bold uppercase ${getStatusColor(application.application_status)} rounded bg-white px-2 py-0.5`}>
                                                    {application.application_status}
                                                </span>
                                            </div>
                                            <div className='flex items-start gap-2'>
                                                <span className='min-w-[140px] font-semibold text-white'>Admission Status</span>
                                                <span className='font-semibold text-white'>:</span>
                                                <span
                                                    className={`font-bold uppercase ${getStatusColor(application.admission_status)} rounded bg-white px-2 py-0.5`}>
                                                    {application.admission_status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className='flex flex-wrap gap-3 pt-2'>
                                            <Button
                                                onClick={() => handleViewAdmissionForm(application.pasr_id)}
                                                className='w-fit bg-primary font-semibold text-white hover:bg-primary/90'>
                                                <Eye className='h-4 w-4' />
                                                View Admission Form
                                            </Button>
                                            {application.is_fee_applicable === 1 && (
                                                <Button
                                                    onClick={handlePayAdmissionFee}
                                                    className='w-fit bg-green-600 font-semibold text-white hover:bg-green-700'
                                                    disabled={application.payment_status === 1}
                                                    suffix={
                                                        application.payment_status === 0 && (
                                                            <ArrowUpRight className='size-4 transition-all ease-linear group-hover:translate-x-2' />
                                                        )
                                                    }>
                                                    <CreditCard className='h-4 w-4' />
                                                    {application.payment_status === 0 ? 'Pay Admission Fee' : 'Paid'}
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Section - Student Photo */}
                                    <div className='flex justify-center md:justify-end'>
                                        <div className='relative h-32 w-32 overflow-hidden rounded-lg border-4 border-white bg-white shadow-xl md:h-40 md:w-40'>
                                            {application.student_photo ? (
                                                <Image
                                                    src={application.student_photo}
                                                    alt={application.student_name}
                                                    fill
                                                    className='object-cover'
                                                    onError={(e) => {
                                                        // Fallback to default avatar on error
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className='flex h-full w-full items-center justify-center bg-muted'>
                                                    <User className='h-20 w-20 text-muted-foreground' />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
                {showPdfModal && (
                    <Dialog
                        open={showPdfModal}
                        onOpenChange={(open) => {
                            setShowPdfModal(open);
                            if (!open) {
                                setPdfBase64(null); // Clear PDF when closing
                                setAppId(0);
                            }
                        }}>
                        <DialogContent
                            className='flex h-[90vh] max-w-5xl flex-col p-0'
                            onInteractOutside={(e) => {
                                e.preventDefault(); // Prevents closing when clicking outside
                            }}>
                            <DialogHeader className='p-0'>
                                <DialogTitle className='pt-3 text-center font-semibold text-lg'>Preadmission Application Form</DialogTitle>
                            </DialogHeader>
                            <div className='relative min-h-0 flex-1 overflow-hidden'>
                                {/* Spinner while loading PDF */}
                                {(isLoading || iframeLoading) && (
                                    <div className='absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm'>
                                        <div className=' transition-all'>
                                            <div className='flex flex-col items-center'>
                                                <Spinner size='lg' className='text-primary' />
                                                <p className='mt-3 font-medium text-gray-700 text-sm'>Loading document...</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* PDF Viewer replaces iframe, removes extra padding */}
                                <div className='relative h-full min-h-0 w-full'>
                                    {/* toolbar: download / open */}
                                    {pdfBase64 ? <div className='absolute top-3 right-3 z-30 flex gap-3' /> : null}

                                    {/* inline PDF viewer using iframe (falls back to message when no PDF) */}
                                    {typeof pdfBase64 === 'string' && pdfBase64 ? (
                                        <iframe
                                            src={
                                                pdfBase64.startsWith('data:') || pdfBase64.startsWith('http')
                                                    ? pdfBase64
                                                    : `data:application/pdf;base64,${pdfBase64}`
                                            }
                                            title='Pre Admission Application Form'
                                            className='h-full min-h-0 w-full border-0'
                                            style={{ display: iframeLoading ? 'none' : 'block' }}
                                            onLoad={() => setIframeLoading(false)}
                                        />
                                    ) : (
                                        <div className='flex h-full items-center justify-center'>
                                            <div className='text-gray-500 text-sm'>No document available</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}

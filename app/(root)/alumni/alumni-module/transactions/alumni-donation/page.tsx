'use client';

import DonationForm from '@/app/(root)/alumni/alumni-module/transactions/alumni-donation/_components/donation-form';
import { Card, CardContent } from '@/components/ui/card';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { getAlumniDonationData, getAlumniDonationLoadData, getPaymentDetails, saveDonationPayment } from '@/server/alumni/alumni-donation';
import type { IAlumniDonationDetails, IDonationCategory, IPaymentGateway } from '@/types/alumni/alumni-donation';
import { Calendar, Hash, Loader2, Mail, MapPin, Phone, User } from 'lucide-react';
import Script from 'next/script';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function AlumniDonationPage() {
    const [details, setDetails] = useState<IAlumniDonationDetails | null>(null);
    const [categories, setCategories] = useState<IDonationCategory[]>([]);
    const [gateways, setGateways] = useState<IPaymentGateway[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaying, setIsPaying] = useState(false);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            // We call both as requested, though they might return similar data
            const [loadRes, dataRes] = await Promise.all([getAlumniDonationLoadData(), getAlumniDonationData()]);

            console.info('Donation Load Res:', loadRes);
            console.info('Donation Data Res:', dataRes);

            let rawCategories: any[] = [];
            let rawGateways: any[] = [];
            let almdetails: IAlumniDonationDetails | null = null;

            // Process dataRes (getdata_donation)
            if (dataRes.success && dataRes.data) {
                const d = dataRes.data as any;
                if (Array.isArray(d)) {
                    rawCategories = [...rawCategories, ...d];
                } else {
                    if (d.fillalumnidonationdetails) rawCategories = [...rawCategories, ...d.fillalumnidonationdetails];
                    if (d.data && Array.isArray(d.data)) rawCategories = [...rawCategories, ...d.data];
                    if (d.fillpaymentgateway) rawGateways = [...rawGateways, ...d.fillpaymentgateway];
                    almdetails = d.almdetails?.[0] || null;
                }
            }

            // Process loadRes (page_load)
            if (loadRes.success && loadRes.data) {
                const l = loadRes.data as any;
                if (!almdetails) almdetails = l.almdetails?.[0] || null;
                if (l.fillalumnidonationdetails) rawCategories = [...rawCategories, ...l.fillalumnidonationdetails];
                if (l.fillpaymentgateway) rawGateways = [...rawGateways, ...l.fillpaymentgateway];
            }

            // De-duplicate categories by almdoN_Id
            const uniqueCategories = Array.from(new Map(rawCategories.filter((c) => c?.almdoN_Id).map((c) => [c.almdoN_Id, c])).values());

            // De-duplicate gateways by fpgD_Id
            const uniqueGateways = Array.from(new Map(rawGateways.filter((g) => g?.fpgD_Id).map((g) => [g.fpgD_Id, g])).values());

            setCategories(uniqueCategories);
            setGateways(uniqueGateways);
            setDetails(almdetails);
        } catch (error) {
            console.error('Failed to load donation data:', error);
            toast.error('Failed to load donation data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handlePayment = async (values: any) => {
        if (!details) return;
        setIsPaying(true);
        try {
            const payRes = await getPaymentDetails({
                mI_Id: 0,
                fpgD_PGName: values.paymentGateway,
                ALMDON_Amount: values.amount,
                ALMST_FirstName: details.almsT_FirstName,
                ALMST_Id: details.almsT_Id
            });

            if (payRes.success && payRes.data) {
                const pgData = payRes.data;
                const paymentInfo = pgData.paymentgateway?.[0];
                const instInfo = pgData.institution?.[0] || pgData;

                const options = {
                    key: paymentInfo?.fpgD_SaltKey || '',
                    amount: values.amount * 100,
                    currency: 'INR',
                    name: instInfo.mI_Name || 'VAPS Institution',
                    description: 'Alumni Donation',
                    image: instInfo.mI_Logo || '',
                    order_id: pgData.orderId,
                    handler: async (response: any) => {
                        try {
                            const saveRes = await saveDonationPayment({
                                ALMDON_Id: Number(values.donationId),
                                ALSREG_Id: details.alsreG_Id,
                                ALMST_Id: details.almsT_Id,
                                ALDON_DonorName: `${details.almsT_FirstName} ${details.almsT_LastName || ''}`.trim(),
                                ALDON_Amount: values.amount,
                                ALDON_Date: new Date().toISOString(),
                                ReceiptNo: response.razorpay_payment_id,
                                OrderId: pgData.orderId,
                                ALMST_StudentPANCard: values.panNumber || details.almsT_StudentPANCard,
                                ALDON_NRIFlg: values.nriStatus === '1',
                                ALMDON_RegistrationFeeFlag:
                                    categories.find((c) => c.almdoN_Id === Number(values.donationId))?.almdoN_RegistrationFeeFlag || false,
                                transnumbconfigurationsettingsss: {
                                    IMN_AutoManualFlag: 'Auto',
                                    IMN_Flag: 'AlumniDonation'
                                }
                            });

                            if (saveRes.success) {
                                toast.success('Payment completed successfully!');
                                loadData();
                            } else {
                                toast.error(saveRes.message || 'Payment failed to save');
                            }
                            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
                        } catch (error) {
                            toast.error('Error saving payment details');
                        }
                    },
                    prefill: {
                        name: `${details.almsT_FirstName} ${details.almsT_LastName || ''}`.trim(),
                        email: details.almsT_emailId,
                        contact: details.almsT_MobileNo
                    },
                    theme: {
                        color: '#F37254'
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                toast.error('Failed to initialize payment gateway');
            }
        } catch (error) {
            console.error('Payment initialization error:', error);
            toast.error('Payment initialization failed');
        } finally {
            setIsPaying(false);
        }
    };

    if (isLoading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
        );
    }

    return (
        <div className='container min-h-screen space-y-6 p-4'>
            <Script src='https://checkout.razorpay.com/v1/checkout.js' strategy='lazyOnload' />

            <div className='flex items-center justify-between'>
                <h2 className='font-bold text-2xl tracking-tight'>Alumni Donation</h2>
                <div className='text-muted-foreground text-sm'>
                    <span className='inline-flex items-center gap-1'>
                        <Calendar className='h-4 w-4' />
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                <div className='space-y-6 lg:col-span-1'>
                    <CollapsibleSection title='Alumni Information' defaultOpen={true} variant='default'>
                        {details && (
                            <Card className='border-none bg-muted/30 shadow-none'>
                                <CardContent className='space-y-4 p-4'>
                                    <div className='flex flex-col items-center gap-3 border-b pb-4'>
                                        <div className='flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-muted'>
                                            {details.almsT_StudentPhoto ? (
                                                <img
                                                    src={details.almsT_StudentPhoto}
                                                    alt={details.almsT_FirstName}
                                                    className='h-full w-full object-cover'
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        const parent = target.parentElement;
                                                        if (parent) {
                                                            const icon = document.createElement('div');
                                                            icon.innerHTML =
                                                                '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user text-muted-foreground/30"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                                                            parent.appendChild(icon.firstChild!);
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <User className='h-12 w-12 text-muted-foreground/30' />
                                            )}
                                        </div>
                                        <div className='text-center'>
                                            <h3 className='font-bold text-lg'>
                                                {details.almsT_FirstName} {details.almsT_LastName || ''}
                                            </h3>
                                            <p className='text-muted-foreground text-xs uppercase tracking-widest'>
                                                {details.leftyear} Batch
                                            </p>
                                            <p className='mt-1 text-muted-foreground text-sm'>{details.classleft}</p>
                                        </div>
                                    </div>

                                    <div className='space-y-3 pt-2'>
                                        <InfoItem icon={<Hash className='h-4 w-4' />} label='Reg No' value={details.almsT_RegistrationNo} />
                                        <InfoItem icon={<Hash className='h-4 w-4' />} label='Admission No' value={details.almsT_AdmNo} />
                                        <InfoItem icon={<Mail className='h-4 w-4' />} label='Email' value={details.almsT_emailId} />
                                        <InfoItem icon={<Phone className='h-4 w-4' />} label='Mobile' value={details.almsT_MobileNo} />
                                        <InfoItem
                                            icon={<MapPin className='h-4 w-4' />}
                                            label='Address'
                                            value={
                                                [details.almsT_ConStreet, details.almsT_ConCity, details.almsT_District]
                                                    .filter(Boolean)
                                                    .join(', ') + (details.almsT_ConPincode ? ` - ${details.almsT_ConPincode}` : '') ||
                                                'N/A'
                                            }
                                        />
                                        <InfoItem
                                            icon={<User className='h-4 w-4' />}
                                            label="Father's Name"
                                            value={details.almsT_FatherName}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </CollapsibleSection>
                </div>

                <div className='space-y-6 lg:col-span-2'>
                    <CollapsibleSection title='Contribute Now' defaultOpen={true} variant='outline'>
                        <DonationForm categories={categories} gateways={gateways} isPaying={isPaying} onSubmit={handlePayment} />
                    </CollapsibleSection>

                    <div className='rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6'>
                        <h3 className='mb-3 font-bold text-green-800 text-lg'>Why Donate?</h3>
                        <ul className='space-y-2 text-green-700 text-sm'>
                            <li className='flex items-start gap-2'>
                                <div className='mt-1.5 h-1.5 w-1.5 rounded-full bg-green-600' />
                                <span>Support infrastructure development for future students</span>
                            </li>
                            <li className='flex items-start gap-2'>
                                <div className='mt-1.5 h-1.5 w-1.5 rounded-full bg-green-600' />
                                <span>Contribute to scholarship programs for deserving students</span>
                            </li>
                            <li className='flex items-start gap-2'>
                                <div className='mt-1.5 h-1.5 w-1.5 rounded-full bg-green-600' />
                                <span>Help enhance library resources and digital access</span>
                            </li>
                            <li className='flex items-start gap-2'>
                                <div className='mt-1.5 h-1.5 w-1.5 rounded-full bg-green-600' />
                                <span>All donations are eligible for tax exemption under Section 80G</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number | null }) {
    return (
        <div className='flex items-start gap-3 text-sm'>
            <div className='mt-0.5 text-primary'>{icon}</div>
            <div className='flex-1'>
                <p className='mb-1 font-bold text-[10px] text-muted-foreground uppercase leading-none'>{label}</p>
                <div className='font-medium text-foreground'>{value?.toString() || 'N/A'}</div>
            </div>
        </div>
    );
}

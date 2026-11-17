'use client';

import { Card, CardContent } from '@/components/ui/card';
import { usePreadmissionStatusCountReport } from '@/hooks/admission/preadmission/useTransactions';
import { ArrowRightLeft, BadgeIndianRupee, FileCheck, FileX, Loader2, UserCheck } from 'lucide-react';

interface StatusCardProps {
    icon: React.ReactNode;
    count: number;
    label: string;
    iconColor: string;
    iconBgColor: string;
}

function StatusCard({ icon, count, label, iconColor, iconBgColor }: StatusCardProps) {
    return (
        <Card className='card-glow-orange shadow-none'>
            <CardContent className='p-6'>
                <div className='flex flex-col justify-center gap-2'>
                    {/* Icon Section */}
                    <div className='flex justify-between'>
                        <h3 className='mb-1 font-bold text-3xl text-foreground'>{count.toLocaleString()}</h3>
                        <div className={`flex-shrink-0 ${iconBgColor} rounded-lg p-2`}>
                            <div className={iconColor}>{icon}</div>
                        </div>
                    </div>

                    {/* Count and Label Section */}
                    <div className='flex-1 text-nowrap'>
                        <p className='font-medium text-muted-foreground text-sm'>{label}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function PreadmissionStatusCountReport() {
    const { data: response, isLoading: responseLoading } = usePreadmissionStatusCountReport();

    if (responseLoading) {
        return (
            <div className='flex items-center justify-center p-12'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
        );
    }

    const data = response?.data;

    const statusCards = [
        {
            icon: <UserCheck className='h-6 w-6' />,
            count: data?.registered_applications,
            label: 'Registered Applications',
            iconColor: 'text-emerald-600',
            iconBgColor: 'bg-emerald-50 dark:bg-emerald-950/30'
        },
        {
            icon: <FileX className='h-6 w-6' />,
            count: data?.application_not_filled,
            label: 'Form Not Filled',
            iconColor: 'text-red-600',
            iconBgColor: 'bg-red-50 dark:bg-red-950/30'
        },
        {
            icon: <FileCheck className='h-6 w-6' />,
            count: data?.application_filled,
            label: 'Form Filled',
            iconColor: 'text-amber-600',
            iconBgColor: 'bg-amber-50 dark:bg-amber-950/30'
        },
        {
            icon: <BadgeIndianRupee className='h-6 w-6' />,
            count: data?.payment_completed,
            label: 'Payment Done',
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-50 dark:bg-green-950/30'
        },
        {
            icon: (
                <div className='relative'>
                    <BadgeIndianRupee className='h-6 w-6' />
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='h-0.5 w-full origin-center rotate-45 bg-red-600' />
                    </div>
                </div>
            ),
            count: data?.payment_pending,
            label: 'Payment Not Done',
            iconColor: 'text-red-600',
            iconBgColor: 'bg-red-50 dark:bg-red-950/30'
        },
        {
            icon: <ArrowRightLeft className='h-6 w-6' />,
            count: data?.admission_transferred,
            label: 'Transferred',
            iconColor: 'text-primary',
            iconBgColor: 'bg-primary/10'
        }
    ];

    return (
        <div className='w-full'>
            {/* Cards Grid - Responsive Layout */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
                {statusCards.map((card, index) => (
                    <StatusCard
                        key={index}
                        icon={card.icon}
                        count={card.count || 0}
                        label={card.label}
                        iconColor={card.iconColor}
                        iconBgColor={card.iconBgColor}
                    />
                ))}
            </div>
        </div>
    );
}

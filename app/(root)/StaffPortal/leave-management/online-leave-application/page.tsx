
'use client';

import React from 'react';
import LeaveApplicationForm from './_components/leave-application-form';
import LeaveHistoryTable from './_components/leave-history-table';
import { useOnlineLeave } from '@/hooks/staff-portal/useOnlineLeave';
import { Skeleton } from '@/components/ui/skeleton';

export default function OnlineLeavePage() {
    const { initialData, historyData, isLoading } = useOnlineLeave();

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[400px] w-full" />
                <Skeleton className="h-[300px] w-full" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary tracking-tight">Online Leave Application</h1>
            </div>

            <LeaveApplicationForm initialData={initialData} />

            <LeaveHistoryTable historyData={historyData} />
        </div>
    );
}

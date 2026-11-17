'use client';

import { useEffect, useState } from 'react';
import { getAllotmentReportLoadData } from '@/server/hostel/hostel-management/reports/allotment-report';
import AllotmentReportClient from './_components/report-client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AllotmentReportPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<{ yearlist: any[]; hostellist: any[] }>({
        yearlist: [],
        hostellist: []
    });

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getAllotmentReportLoadData();
                setData(res);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load report master data');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <AllotmentReportClient dropdowns={data} />
        </div>
    );
}

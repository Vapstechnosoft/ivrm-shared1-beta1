'use client';

import { useEffect, useState } from 'react';
import { getGuestAllotmentLoadData } from '@/server/hostel/hostel-management/transactions/guest-allotment';
import GuestAllotmentForm from './_components/add-form';
import GuestAllotmentList from './_components/list';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function GuestAllotmentPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [dropdowns, setDropdowns] = useState<any>({
        hstllist: [],
        categorylist: [],
        roomlist: [],
        alldata1: []
    });

    const loadData = async () => {
        setIsLoading(true);
        try {
            const res = await getGuestAllotmentLoadData();
            if (res) {
                setDropdowns(res);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSuccess = () => {
        loadData();
    };

    const handleEdit = (row: any) => {
        toast.info('Edit functionality to be implemented');
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Guest Allotment</h2>

            <GuestAllotmentForm
                dropdowns={dropdowns}
                onSuccess={handleSuccess}
            />

            <GuestAllotmentList
                data={dropdowns.alldata1 || []}
                onEdit={handleEdit}
            />
        </div>
    );
}

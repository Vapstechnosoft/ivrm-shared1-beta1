'use client';

import { useEffect, useState } from 'react';
import { getStaffAllotmentLoadData } from '@/server/hostel/hostel-management/transactions/staff-allotment';
import StaffAllotmentForm from './_components/add-form';
import StaffAllotmentList from './_components/list';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function StaffAllotmentPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [dropdowns, setDropdowns] = useState<any>({
        yearlist: [],
        hostel_list: [],
        roomcatgry_list: [],
        deptlist: [],
        desglist: [],
        room_list: [],
        student_allotlist: [] // actually staff allotment list
    });

    const loadData = async () => {
        setIsLoading(true);
        try {
            const res = await getStaffAllotmentLoadData();
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

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Staff Allotment</h2>

            <StaffAllotmentForm
                dropdowns={dropdowns}
                onSuccess={handleSuccess}
            />

            <StaffAllotmentList
                data={dropdowns.student_allotlist || []}
                onEdit={() => { }}
            />
        </div>
    );
}

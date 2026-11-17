'use client';

import { useEffect, useState } from 'react';
import StudentAllotmentForm from './_components/add-form';
import StudentAllotmentList from './_components/list';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getStudentAllotmentLoadData, StudentAllotmentLoadData } from '@/server/hostel/hostel-management/transactions/student-allotment';

export default function StudentAllotmentPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>({
        yearlist: [],
        hostel_list: [],
        student_allotlist: [],
        classlist: [],
        sectionlist: [],
        roomcatgry_list: [],
        room_list: [],
        asmaY_Id: 0
    });

    const loadData = async () => {
        setIsLoading(true);
        try {
            const res = await getStudentAllotmentLoadData();
            setData(res.data || {});
        } catch (error) {
            console.error(error);
            toast.error('Failed to load initial data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSuccess = () => {
        loadData(); // Reload list after save
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
            <StudentAllotmentForm
                dropdowns={{
                    yearlist: data.yearlist,
                    hostel_list: data.hostel_list,
                    roomcatgry_list: data.roomcatgry_list,
                    room_list: data.room_list,
                    // Spread other lists if needed
                    //classlist: data.classlist,
                    //sectionlist: data.sectionlist
                }}
                onSuccess={handleSuccess}
            />
            <StudentAllotmentList data={data.student_allotlist || []} />
        </div>
    );
}

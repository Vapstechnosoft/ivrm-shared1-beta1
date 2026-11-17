'use client';

import { useEffect, useState } from 'react';
import StudentRequestForm from './_components/add-form';
import StudentRequestList from './_components/list';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getStudentRequestLoadData, toggleStudentRequestStatus } from '@/server/hostel/hostel-management/transactions/student-request-actions';
import { Heading } from '@/components/layout/heading';

export default function StudentRequestPage() {
    const [listData, setListData] = useState<any[]>([]);
    const [editData, setEditData] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const data = await getStudentRequestLoadData();
        if (data?.hostel_list) {
            setListData(data.hostel_list);
        }
    }

    const handleEdit = (data: any) => {
        setEditData(data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggle = async (data: any) => {
        const res = await toggleStudentRequestStatus(data);
        if (res?.ret) {
            toast.success("Status updated!");
            loadData();
        }
    };

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">

                <Separator />
                <StudentRequestForm
                    onSaveSuccess={() => { loadData(); setEditData(null); }}
                    editData={editData}
                />
                <Separator />
                <Heading title="Your Requests" description="" />
                <StudentRequestList
                    data={listData}
                    onEdit={handleEdit}
                    onToggle={handleToggle}
                />
            </div>
        </div>
    );
}

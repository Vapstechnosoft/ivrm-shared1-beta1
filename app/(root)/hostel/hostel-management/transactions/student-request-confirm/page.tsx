'use client';

import { useEffect, useState } from 'react';
import StudentConfirmForm from './_components/process-form';
import StudentRequestConfirmList from './_components/list';
import { Separator } from '@/components/ui/separator';
import { getStudentConfirmLoadData } from '@/server/hostel/hostel-management/transactions/student-request-actions';
import { Heading } from '@/components/layout/heading';

export default function StudentRequestConfirmPage() {
    const [pendingList, setPendingList] = useState<any[]>([]);
    const [approvedList, setApprovedList] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [processData, setProcessData] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const data = await getStudentConfirmLoadData();
        if (data) {
            setPendingList(data.student_RequestList || []);
            setApprovedList(data.student_RequestApp || []);
            setRooms(data.room_list || []);
            setProcessData(null);
        }
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading
                    title="Student Request/Confirm"
                    description="Approve or Reject student hostel applications."
                />
                <Separator />

                {processData && (
                    <>
                        <StudentConfirmForm
                            processData={processData}
                            rooms={rooms}
                            onSaveSuccess={loadData}
                        />
                        <Separator />
                    </>
                )}

                <Heading title="Pending Requests" description="" />
                <StudentRequestConfirmList
                    data={pendingList}
                    onProcess={(data) => {
                        setProcessData(data);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />

                <Separator />
                <Heading title="Processed Requests" description="" />
                <StudentRequestConfirmList
                    data={approvedList}
                    onProcess={() => { }}
                />
            </div>
        </div>
    );
}

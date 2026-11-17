'use client';

import { useEffect, useState } from 'react';
import VacateForm from './_components/vacate-form';
import VacateRoomList from './_components/list';
import { toast } from 'sonner';
import { getDetailsOnType, getVacateLoadData } from '@/server/hostel/hostel-management/transactions/vacate-room';

export default function VacateRoomPage() {
    const [type, setType] = useState<'student' | 'staff' | 'guest'>('student');
    const [data, setData] = useState<any>({
        studentdata: [],
        staffdata: [],
        guestdata: [],
        gridlistdata: []
    });

    const loadInitialData = async () => {
        try {
            const res = await getVacateLoadData('student');
            if (res) {
                setData(res);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load initial data');
        }
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    const handleTypeChange = async (newType: any) => {
        setType(newType);
        try {
            const res = await getDetailsOnType(newType);
            if (res) {
                setData((prev: any) => ({
                    ...prev,
                    gridlistdata: res.gridlistdata || []
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSuccess = async (currType: string) => {
        handleTypeChange(currType);
    };

    return (
        <div className="p-6 space-y-8">

            <VacateForm
                initialData={data}
                onTypeChange={handleTypeChange}
                onSuccess={handleSuccess}
            />

            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Vacate Details</h3>
                <VacateRoomList
                    data={data.gridlistdata || []}
                    type={type}
                />
            </div>
        </div>
    );
}

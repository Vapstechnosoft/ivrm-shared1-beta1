'use client';

import { useEffect, useState } from 'react';
import RoomTransferForm from './_components/transfer-form';
import RoomTransferList from './_components/list';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/layout/heading';
import { getRoomTransferLoadData } from '@/server/hostel/hostel-management/transactions/room-transfer';

export default function RoomTransferPage() {
    const [listData, setListData] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const data = await getRoomTransferLoadData('stud'); // Default to stud
        if (data && data.gridlistdata) {
            setListData(data.gridlistdata);
        }
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading
                    title="Room Transfer"
                    description="Transfer students, staff or guests to different rooms."
                />
                <Separator />
                <RoomTransferForm onSaveSuccess={loadData} />
                <Separator />
                <Heading title="Room Transfer History" description="" />
                <RoomTransferList data={listData} />
            </div>
        </div>
    );
}

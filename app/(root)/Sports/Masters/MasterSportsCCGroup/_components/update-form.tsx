'use client';

import { editMasterSportsCCGroup } from '@/server/sports/masters/sports-cc-group';
import type { IMasterSportsCCGroup } from '@/types/sports/masters/sports-cc-group';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AddMasterSportsCCGroupForm from './add-form';

export default function UpdateMasterSportsCCGroupForm({
    selectedRow,
    onSuccess
}: {
    selectedRow: IMasterSportsCCGroup;
    onSuccess: () => void;
}) {
    const [data, setData] = useState<IMasterSportsCCGroup | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await editMasterSportsCCGroup(selectedRow.spccmsccG_Id);
                if (response.success && response.data && response.data.length > 0) {
                    setData(response.data[0]);
                } else {
                    toast.error(response.message || 'Failed to fetch details');
                    setData(selectedRow); // Fallback to grid data
                }
            } catch (error) {
                console.error(error);
                toast.error('Error fetching details');
                setData(selectedRow);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedRow]);

    if (isLoading) {
        return <div className='p-4 text-center'>Loading details...</div>;
    }

    if (!data) return null;

    return <AddMasterSportsCCGroupForm selectedRow={data} onSuccess={onSuccess} />;
}

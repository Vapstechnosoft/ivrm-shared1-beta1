'use client';

import type { IMasterHouse } from '@/types/sports/masters/house';
import AddMasterHouseForm from './add-form';
import { useQuery } from '@tanstack/react-query';
import { getMasterHouseDetails } from '@/server/sports/masters/house';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function UpdateMasterHouseForm({
    selectedRow,
    onSuccess
}: {
    selectedRow: IMasterHouse;
    onSuccess: () => void;
}) {
    const { data: apiData, isLoading } = useQuery({
        queryKey: ['master-house-details', selectedRow.spccmH_Id],
        queryFn: () => getMasterHouseDetails(selectedRow.spccmH_Id),
        enabled: !!selectedRow.spccmH_Id,
    });

    const [formData, setFormData] = useState<IMasterHouse>(selectedRow);

    useEffect(() => {
        if (apiData?.editdetails && Array.isArray(apiData.editdetails) && apiData.editdetails.length > 0) {
            setFormData(apiData.editdetails[0] as IMasterHouse);
        } else if (apiData?.data && Array.isArray(apiData.data) && apiData.data.length > 0) {
            setFormData(apiData.data[0] as IMasterHouse);
        }
    }, [apiData]);

    if (isLoading) {
        return (
            <div className="flex h-40 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading details...</span>
            </div>
        );
    }

    const finalData = (apiData?.editdetails && Array.isArray(apiData.editdetails) && apiData.editdetails.length > 0)
        ? (apiData.editdetails[0] as IMasterHouse)
        : (apiData?.data && Array.isArray(apiData.data) && apiData.data.length > 0)
            ? (apiData.data[0] as IMasterHouse)
            : selectedRow;

    return <AddMasterHouseForm selectedRow={formData !== selectedRow ? formData : finalData} onSuccess={onSuccess} />;
}

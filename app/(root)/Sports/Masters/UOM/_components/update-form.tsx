'use client';

import type { IMasterUOM } from '@/types/sports/masters/uom';
import AddMasterUOMForm from './add-form';
import { useQuery } from '@tanstack/react-query';
import { getMasterUOMDetails } from '@/server/sports/masters/uom';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function UpdateMasterUOMForm({
    selectedRow,
    onSuccess
}: {
    selectedRow: IMasterUOM;
    onSuccess: () => void;
}) {
    const { data: apiData, isLoading } = useQuery({
        queryKey: ['master-uom-details', selectedRow.spccmuoM_Id],
        queryFn: () => getMasterUOMDetails(selectedRow.spccmuoM_Id),
        enabled: !!selectedRow.spccmuoM_Id,
    });

    const [formData, setFormData] = useState<IMasterUOM>(selectedRow);

    useEffect(() => {
        if (apiData?.data && Array.isArray(apiData.data) && apiData.data.length > 0) {
            setFormData(apiData.data[0] as IMasterUOM);
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

    const finalData = (apiData?.data && Array.isArray(apiData.data) && apiData.data.length > 0)
        ? (apiData.data[0] as IMasterUOM)
        : selectedRow;

    return <AddMasterUOMForm selectedRow={formData !== selectedRow ? formData : finalData} onSuccess={onSuccess} />;
}

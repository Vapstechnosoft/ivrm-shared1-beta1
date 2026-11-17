'use client';

import type { IMasterCompetitionLevel } from '@/types/sports/masters/competition-level';
import AddMasterCompetitionLevelForm from './add-form';
import { useQuery } from '@tanstack/react-query';
import { getMasterCompetitionLevelDetails } from '@/server/sports/masters/competition-level';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function UpdateMasterCompetitionLevelForm({
    selectedRow,
    onSuccess
}: {
    selectedRow: IMasterCompetitionLevel;
    onSuccess: () => void;
}) {
    // We want to fetch fresh details, but we can fall back to selectedRow if needed, 
    // or wait for the fetch. Since the user specifically asked for editDetails api integration,
    // we should prioritize the API data.

    // We can use a query to fetch the data.
    // The query key should include the ID.
    const { data: apiData, isLoading, error } = useQuery({
        queryKey: ['master-competition-level-details', selectedRow.spccmcL_Id],
        queryFn: () => getMasterCompetitionLevelDetails(selectedRow.spccmcL_Id),
        enabled: !!selectedRow.spccmcL_Id,
    });

    const [formData, setFormData] = useState<IMasterCompetitionLevel>(selectedRow);

    useEffect(() => {
        if (apiData && apiData.success && apiData.data) {
            // Use type assertion to unknown first if types don't perfectly overlap, or just trust the response data matches interface
            // The API response data is usually the object itself or wrapped. 
            // apiService.get returns ApiResponse<T>, so apiData is that response. 
            // apiData.data should be the object.
            // However, sometimes the API returns strict exact keys which might differ in case from interface if not handled.
            // But my server action returns `api.get<IMasterCompetitionLevel>`.
            setFormData(apiData.data as unknown as IMasterCompetitionLevel);
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

    // You might want to show error if fetch fails? 
    // For now we can fall back to selectedRow if no data, or just show format.
    const finalData = (apiData && apiData.success && apiData.data) ? (apiData.data as unknown as IMasterCompetitionLevel) : selectedRow;

    return <AddMasterCompetitionLevelForm selectedRow={finalData} onSuccess={onSuccess} />;
}

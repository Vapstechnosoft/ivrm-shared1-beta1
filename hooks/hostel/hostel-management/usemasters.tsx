import { HOSTEL_QUERY_KEYS } from '@/constants/query-keys';
import { useState, useEffect, useCallback } from 'react';
import { fetchMasterFacilityData } from '@/server/hostel/hostel-management/masters/facility';
import { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteBed, fetchBedData } from '@/server/hostel/hostel-management/masters/bed';
import { IBedDisplay, IHostel } from '@/types/hostel/hostel-management/masters';

export const useMasterFacility = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HOSTEL_QUERY_KEYS.HOSTEL_MASTER_FACILITY_GRID, searchParams ?? {}],
            queryFn: async () => fetchMasterFacilityData(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HOSTEL_QUERY_KEYS.HOSTEL_MASTER_FACILITY_GRID]
            });
        }
    };
};

export const useMasterBed = () => {
    const [bedList, setBedList] = useState<IBedDisplay[]>([]);
    const [hostels, setHostels] = useState<IHostel[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchBedData();
            if (response.success && response.data) {
                setBedList(response.data.bedList);
                //setHostels(response.data.hostels);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onDelete = async (id: number) => {
        try {
            const response = await deleteBed(id);
            if (response.success) {
                toast.success(response.message);
                loadData();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        }
    };

    return {
        bedList,
        hostels,
        loading,
        refetch: loadData,
        onDelete
    };
};

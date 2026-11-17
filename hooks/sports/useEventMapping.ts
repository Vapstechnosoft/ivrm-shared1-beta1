import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEventMappingDetails, saveEventMapping, editEventMapping, deactivateEventMapping, getModelData } from '@/server/sports/transactions/events-mapping';

export const useEventMapping = () => {
    const queryClient = useQueryClient();

    const loadGrid = useQuery({
        queryKey: ['events-mapping-details'],
        queryFn: () => getEventMappingDetails(),
    });

    const save = useMutation({
        mutationFn: (data: any) => saveEventMapping(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events-mapping-details'] });
        },
    });

    const edit = useMutation({
        mutationFn: (data: any) => editEventMapping(data),
    });

    const deactivate = useMutation({
        mutationFn: (data: any) => deactivateEventMapping(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events-mapping-details'] });
        },
    });

    const modelData = useMutation({
        mutationFn: (data: any) => getModelData(data),
    });

    return {
        loadGrid,
        save,
        edit,
        deactivate,
        modelData
    };
};

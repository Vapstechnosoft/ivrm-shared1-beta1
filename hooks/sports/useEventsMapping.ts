import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getEventsMappingDropdowns,
    getEventsMappingList,
    saveEventsMapping,
    deactivateEventsMapping
} from "@/server/sports/events-mapping";
import { EventsMappingFormSchema } from "@/types/sports/events-mapping";

export const useEventsMapping = () => {
    const queryClient = useQueryClient();

    const dropdowns = useQuery({
        queryKey: ['eventsMappingDropdowns'],
        queryFn: () => getEventsMappingDropdowns(),
    });

    const gridData = useQuery({
        queryKey: ['eventsMappingList'],
        queryFn: () => getEventsMappingList(),
    });

    const saveData = useMutation({
        mutationFn: (data: EventsMappingFormSchema) => saveEventsMapping(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['eventsMappingList'] });
        }
    });

    const deactivateData = useMutation({
        mutationFn: ({ id, activeFlag }: { id: number; activeFlag: boolean }) => deactivateEventsMapping(id, activeFlag),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['eventsMappingList'] });
        }
    });

    return {
        dropdowns,
        gridData,
        saveData,
        deactivateData,
    };
};

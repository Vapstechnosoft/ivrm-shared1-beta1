import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getEventsStudentMappingDropdowns,
    getEventsStudentMappingList,
    getStudentList,
    saveEventsStudentMapping,
    deactivateEventsStudentMapping
} from '@/server/sports/events-student-mapping';
import { IStudentFilterParams } from '@/types/sports/events-student-mapping';
import { toast } from 'sonner';

export const useEventsStudentMapping = () => {
    const queryClient = useQueryClient();

    const dropdowns = useQuery({
        queryKey: ['eventsStudentMappingDropdowns'],
        queryFn: () => getEventsStudentMappingDropdowns(),
    });

    const gridData = useQuery({
        queryKey: ['eventsStudentMappingList'],
        queryFn: () => getEventsStudentMappingList(),
    });

    // We don't use a simple useQuery for students because it depends on manual "Search" action
    // But we can expose a mutation-like helper or just useQuery with enabled:false
    // Ideally, for a search filter, a mutation is easier to control when to fire.
    // Or useQuery with a state dependency. Let's use mutation for explicit fetching.
    const fetchStudents = useMutation({
        mutationFn: (filter: IStudentFilterParams) => getStudentList(filter),
    });

    const saveData = useMutation({
        mutationFn: (data: any) => saveEventsStudentMapping(data),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({ queryKey: ['eventsStudentMappingList'] });
            } else {
                toast.error(response.message || 'Failed to save');
            }
        },
        onError: (error) => {
            toast.error('An error occurred while saving');
        }
    });

    const deactivateData = useMutation({
        mutationFn: ({ id, activeFlag }: { id: number; activeFlag: boolean }) => deactivateEventsStudentMapping(id, activeFlag),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({ queryKey: ['eventsStudentMappingList'] });
            } else {
                toast.error(response.message || 'Failed to update status');
            }
        },
        onError: () => {
            toast.error('An error occurred while updating status');
        }
    });

    return {
        dropdowns,
        gridData,
        fetchStudents,
        saveData,
        deactivateData,
    };
};

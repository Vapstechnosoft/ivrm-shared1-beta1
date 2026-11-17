import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getEventsSponsorMapping, saveEventsSponsorMapping, deactivateEventsSponsorMapping } from '@/server/sports/transactions/events-sponsor';
import { toast } from 'sonner';

export const useEventsSponsor = () => {
    const queryClient = useQueryClient();

    const details = useQuery({
        queryKey: ['events-sponsor-mapping-details'],
        queryFn: () => getEventsSponsorMapping(),
    });

    const saveMutation = useMutation({
        mutationFn: saveEventsSponsorMapping,
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message || 'Saved successfully');
                queryClient.invalidateQueries({ queryKey: ['events-sponsor-mapping-details'] });
            } else {
                toast.error(data.message || 'Failed to save');
            }
        },
        onError: (error: any) => {
            toast.error(error.message || 'An error occurred');
        }
    });

    const deactivateMutation = useMutation({
        mutationFn: deactivateEventsSponsorMapping,
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message || 'Status updated successfully');
                queryClient.invalidateQueries({ queryKey: ['events-sponsor-mapping-details'] });
            } else {
                toast.error(data.message || 'Failed to update status');
            }
        },
        onError: (error: any) => {
            toast.error(error.message || 'An error occurred');
        }
    });

    return {
        details,
        saveMutation,
        deactivateMutation,
        // For backward compatibility if needed, but we should refactor usages
        data: details.data,
        isLoading: details.isLoading,
        error: details.error,
        refetch: details.refetch
    };
};

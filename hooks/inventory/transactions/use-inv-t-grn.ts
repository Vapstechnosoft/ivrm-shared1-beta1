import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getInvTGRNLoadData,
    saveInvTGRNDetails,
    deleteInvTGRN,
    toggleInvTGRNActive
} from '@/server/inventory/transactions/inv-t-grn';
import type { ApiSearchparams } from '@/types';
import { toast } from 'sonner';

export const INV_T_GRN_QUERY_KEY = 'INV_T_GRN';

export function useInvTGRN(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [INV_T_GRN_QUERY_KEY, searchParams],
        queryFn: async () => {
            console.log('useInvTGRN: Fetching data with params:', searchParams);
            const data = await getInvTGRNLoadData(searchParams);
            return data;
        },
        staleTime: 0
    });

    const saveMutation = useMutation({
        mutationFn: saveInvTGRNDetails,
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message || 'Record saved successfully');
                queryClient.invalidateQueries({ queryKey: [INV_T_GRN_QUERY_KEY] });
            } else {
                toast.error(response.message || 'Failed to save record');
            }
        },
        onError: () => {
            toast.error('An error occurred while saving');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteInvTGRN,
        onSuccess: (response: any) => {
            if (response.success || response.message === 'Success') {
                toast.success('Record deleted successfully');
                queryClient.invalidateQueries({ queryKey: [INV_T_GRN_QUERY_KEY] });
            } else {
                toast.error(response.message || 'Failed to delete record');
            }
        },
    });

    const toggleActiveMutation = useMutation({
        mutationFn: toggleInvTGRNActive,
        onSuccess: (response: any) => {
            if (response.success || response.returnval === true || (response.data && response.data.length > 0)) {
                toast.success('Status updated successfully');
                queryClient.invalidateQueries({ queryKey: [INV_T_GRN_QUERY_KEY] });
            } else {
                toast.error(response.message || 'Failed to update status');
            }
        },
    });

    return {
        ...query,
        saveMutation,
        deleteMutation,
        toggleActiveMutation,
    };
}

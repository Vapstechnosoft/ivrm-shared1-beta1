import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getInvMasterCustomer,
    saveInvMasterCustomer,
    deactivateInvMasterCustomer
} from '@/server/inventory/masters/inv-master-customer';
import { toast } from 'sonner';
import type { ApiSearchparams } from '@/types';

export const INV_MASTER_CUSTOMER_QUERY_KEY = 'INV_MASTER_CUSTOMER';

export function useInvMasterCustomer(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [INV_MASTER_CUSTOMER_QUERY_KEY, searchParams],
        queryFn: () => getInvMasterCustomer(searchParams),
    });

    const saveMutation = useMutation({
        mutationFn: saveInvMasterCustomer,
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message || 'Record saved successfully');
                queryClient.invalidateQueries({ queryKey: [INV_MASTER_CUSTOMER_QUERY_KEY] });
            } else if (response.returnduplicatestatus === 'Duplicate') {
                toast.error('Record already exists');
            } else {
                toast.error(response.message || 'Failed to save record');
            }
        },
        onError: (error) => {
            toast.error('An error occurred while saving');
            console.error(error);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deactivateInvMasterCustomer,
        onSuccess: (response: any) => {
            if (response.success) {
                toast.success('Status updated successfully');
                queryClient.invalidateQueries({ queryKey: [INV_MASTER_CUSTOMER_QUERY_KEY] });
            } else {
                toast.error(response.message || 'Failed to update status');
            }
        },
        onError: (error) => {
            toast.error('An error occurred while updating status');
            console.error(error);
        },
    });

    return {
        ...query,
        saveMutation,
        deleteMutation,
    };
}

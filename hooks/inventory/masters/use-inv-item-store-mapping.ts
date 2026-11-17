import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getInvItemStoreMappingLoadData,
    saveInvItemStoreMapping,
    deactivateInvItemStoreMapping
} from '@/server/inventory/masters/inv-item-store-mapping';
import type { ApiSearchparams } from '@/types';
import { toast } from 'sonner';

export const INV_ITEM_STORE_MAPPING_QUERY_KEY = 'INV_ITEM_STORE_MAPPING';

export function useInvItemStoreMapping(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [INV_ITEM_STORE_MAPPING_QUERY_KEY, searchParams],
        queryFn: () => getInvItemStoreMappingLoadData(searchParams),
    });

    const saveMutation = useMutation({
        mutationFn: saveInvItemStoreMapping,
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message || 'Mapping saved successfully');
                queryClient.invalidateQueries({ queryKey: [INV_ITEM_STORE_MAPPING_QUERY_KEY] });
            } else {
                toast.error(response.message || 'Failed to save mapping');
            }
        },
        onError: () => {
            toast.error('An error occurred while saving');
        },
    });

    const toggleActiveMutation = useMutation({
        mutationFn: deactivateInvItemStoreMapping,
        onSuccess: (response: any) => {
            if (response.success) {
                toast.success('Status updated successfully');
                queryClient.invalidateQueries({ queryKey: [INV_ITEM_STORE_MAPPING_QUERY_KEY] });
            } else {
                toast.error(response.message || 'Failed to update status');
            }
        },
    });

    return {
        ...query,
        saveMutation,
        toggleActiveMutation,
    };
}

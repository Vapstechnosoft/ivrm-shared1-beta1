
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    getInvStockLoadData,
    saveInvStock,
    getInvStockEditData,
    getInvStockLoadStores,
    getInvStockItems
} from '@/server/inventory/transactions/inv-stock';

export const useInvStock = (searchParams?: any) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['inv-stock', searchParams],
        queryFn: () => getInvStockLoadData(searchParams),
        staleTime: 5 * 60 * 1000,
    });

    const saveMutation = useMutation({
        mutationFn: saveInvStock,
        onSuccess: (data) => {
            if (data.returnval || data.success) {
                toast.success(data.message || 'Stock records saved successfully');
                queryClient.invalidateQueries({ queryKey: ['inv-stock'] });
            } else {
                toast.error(data.message || 'Failed to save records');
            }
        },
        onError: (error: any) => {
            toast.error(error?.message || 'An error occurred while saving');
        }
    });

    const editMutation = useMutation({
        mutationFn: (id: number) => getInvStockEditData(id),
    });

    const getStoresQuery = useQuery({
        queryKey: ['inv-stock-stores'],
        queryFn: () => getInvStockLoadStores(),
        staleTime: Infinity,
    });

    const getItemsMutation = useMutation({
        mutationFn: (storeId: number) => getInvStockItems(storeId),
    });

    return {
        data: query.data,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
        saveMutation,
        editMutation,
        getStoresQuery,
        getItemsMutation
    };
};

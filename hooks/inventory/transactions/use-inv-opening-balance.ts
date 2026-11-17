
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    getInvOpeningBalanceLoadData,
    saveInvOpeningBalance,
    deactiveInvOpeningBalance,
    getSelectionItemDetails,
    getOpeningBalanceDetails,
    getInvOpeningBalanceStores,
    getInvOpeningBalanceItems
} from '@/server/inventory/transactions/inv-opening-balance';
import type { IInvOpeningBalance } from '@/types/inventory/transactions/inv-opening-balance';

export const useInvOpeningBalance = (searchParams?: any) => {
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['inv-opening-balance', searchParams],
        queryFn: () => getInvOpeningBalanceLoadData(searchParams),
    });

    const refetchAll = () => {
        queryClient.invalidateQueries({ queryKey: ['inv-opening-balance'] });
    };

    const saveMutation = useMutation({
        mutationFn: saveInvOpeningBalance,
        onSuccess: (result: any) => {
            if (result.returnval || result.success) {
                toast.success(result.message || 'Record saved successfully');
                refetchAll();
            } else {
                toast.error(result.message || 'Failed to save record');
            }
        },
        onError: (error: any) => {
            toast.error(error.message || 'An error occurred while saving');
        },
    });

    const toggleActiveMutation = useMutation({
        mutationFn: deactiveInvOpeningBalance,
        onSuccess: (result: any) => {
            if (result.returnval || result.success) {
                toast.success(result.message || 'Status updated successfully');
                refetchAll();
            } else {
                toast.error(result.message || 'Failed to update status');
            }
        },
        onError: (error: any) => {
            toast.error(error.message || 'An error occurred while updating status');
        },
    });

    const storesQuery = useQuery({
        queryKey: ['inv-opening-balance-stores'],
        queryFn: () => getInvOpeningBalanceStores(),
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });

    const getStoresMutation = useMutation({
        mutationFn: getInvOpeningBalanceStores
    });

    const getItemsMutation = useMutation({
        mutationFn: getInvOpeningBalanceItems
    });

    return {
        data,
        isLoading,
        error,
        refetch,
        refetchAll,
        saveMutation,
        toggleActiveMutation,
        getStoresMutation,
        getItemsMutation,
        storesQuery
    };
};


export const useInvOpeningBalanceItemDetails = () => {
    return useMutation({
        mutationFn: getSelectionItemDetails
    });
};

export const useInvOpeningBalanceDetails = () => {
    return useMutation({
        mutationFn: getOpeningBalanceDetails
    });
};

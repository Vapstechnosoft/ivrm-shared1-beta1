import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getInvTSalesLoadData,
    saveInvTSalesDetails,
    deleteInvTSales,
    toggleInvTSalesActive,
    getStudentClsSec,
    getStudentList,
    getSectionList,
    getItemOnStoreChange,
    getItemDetail,
    getInvTSalesEmployees,
    getInvTSalesCustomers,
    getInvTSalesStores,
    getInvTSalesItemDetails,
    getSaleItemDetails,
    getSaletypes
} from '@/server/inventory/transactions/inv-t-sales';
import type { ApiSearchparams } from '@/types';
import { toast } from 'sonner';

export const INV_T_SALES_QUERY_KEY = 'INV_T_SALES';

export function useInvTSales(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [INV_T_SALES_QUERY_KEY, searchParams],
        queryFn: () => getInvTSalesLoadData(searchParams),
    });

    const saveMutation = useMutation({
        mutationFn: saveInvTSalesDetails,
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message || 'Record saved successfully');
                queryClient.invalidateQueries({ queryKey: [INV_T_SALES_QUERY_KEY] });
            } else {
                toast.error(response.message || 'Failed to save record');
            }
        },
        onError: () => {
            toast.error('An error occurred while saving');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteInvTSales,
        onSuccess: (response: any) => {
            if (response.success || response.message === 'Success') {
                toast.success('Record deleted successfully');
                queryClient.invalidateQueries({ queryKey: [INV_T_SALES_QUERY_KEY] });
            } else {
                toast.error(response.message || 'Failed to delete record');
            }
        },
    });

    const toggleActiveMutation = useMutation({
        mutationFn: toggleInvTSalesActive,
        onSuccess: (response: any) => {
            if (response.success || (response.data && response.data.length > 0)) {
                toast.success('Status updated successfully');
                queryClient.invalidateQueries({ queryKey: [INV_T_SALES_QUERY_KEY] });
            } else {
                toast.error(response.message || 'Failed to update status');
            }
        },
    });

    const studentClsSecMutation = useMutation({
        mutationFn: getStudentClsSec
    });

    const studentListMutation = useMutation({
        mutationFn: getStudentList
    });

    const sectionListMutation = useMutation({
        mutationFn: getSectionList
    });

    const itemOnStoreChangeMutation = useMutation({
        mutationFn: getItemOnStoreChange
    });

    const itemDetailMutation = useMutation({
        mutationFn: getItemDetail
    });

    const getEmployeesMutation = useMutation({
        mutationFn: getInvTSalesEmployees
    });

    const getCustomersMutation = useMutation({
        mutationFn: getInvTSalesCustomers
    });

    const getStoresMutation = useMutation({
        mutationFn: getInvTSalesStores
    });

    const getSaleItemDetailsMutation = useMutation({
        mutationFn: (invmsL_Id: number) => getSaleItemDetails(invmsL_Id)
    });

    const getSaletypesMutation = useMutation({
        mutationFn: ({ invmsL_Id, saletype }: { invmsL_Id: number, saletype: string }) => getSaletypes(invmsL_Id, saletype)
    });

    return {
        ...query,
        saveMutation,
        deleteMutation,
        toggleActiveMutation,
        studentClsSecMutation,
        studentListMutation,
        sectionListMutation,
        itemOnStoreChangeMutation,
        itemDetailMutation,
        getEmployeesMutation,
        getCustomersMutation,
        getStoresMutation,
        getSaleItemDetailsMutation,
        getSaletypesMutation
    };
}

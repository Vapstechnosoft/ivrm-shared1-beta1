
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    deactiveInvTItemConsumption,
    getInvTItemConsumptionLoadData,
    getItemConsumptionDetails,
    getItemStockDetails,
    getItemsOnStoreChange,
    saveInvTItemConsumption,
    getInvTItemConsumptionStores,
    getInvTItemConsumptionDepartments,
    getInvTItemConsumptionProducts,
    getInvTItemConsumptionEmployees,
    getStudentClsSec,
    getStudentList,
    getSectionList,
    getICUserDetails,
    getICItemDetails
} from '@/server/inventory/transactions/inv-t-item-consumption';

export const useInvTItemConsumption = (searchParams?: any) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['inv-t-item-consumption', searchParams],
        queryFn: () => getInvTItemConsumptionLoadData(searchParams),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const saveMutation = useMutation({
        mutationFn: saveInvTItemConsumption,
        onSuccess: (data) => {
            if (data.success || data.returnval) {
                toast.success(data.message || 'Record saved successfully');
                queryClient.invalidateQueries({ queryKey: ['inv-t-item-consumption'] });
            } else {
                toast.error(data.message || 'Failed to save record');
            }
        },
        onError: (error: any) => {
            toast.error(error?.message || 'An error occurred while saving');
            console.error(error);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deactiveInvTItemConsumption,
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message || 'Record status updated successfully');
                queryClient.invalidateQueries({ queryKey: ['inv-t-item-consumption'] });
            } else {
                toast.error(data.message || 'Failed to update status');
            }
        },
        onError: (error: any) => {
            toast.error(error?.message || 'An error occurred');
        }
    });

    const itemsOnStoreChangeMutation = useMutation({
        mutationFn: (data: { INVMST_Id: number, INVC_LIFOFIFOFlg?: string, AMST_Id?: number }) => getItemsOnStoreChange(data),
    });

    const itemStockDetailMutation = useMutation({
        mutationFn: (data: any) => getItemStockDetails(data),
    });

    const getDetailsMutation = useMutation({
        mutationFn: (data: any) => getItemConsumptionDetails(data),
    });

    const getStoresMutation = useMutation({
        mutationFn: () => getInvTItemConsumptionStores()
    });

    const getDepartmentsMutation = useMutation({
        mutationFn: () => getInvTItemConsumptionDepartments()
    });

    const getProductsMutation = useMutation({
        mutationFn: () => getInvTItemConsumptionProducts()
    });

    const getEmployeesMutation = useMutation({
        mutationFn: () => getInvTItemConsumptionEmployees()
    });

    const studentClsSecMutation = useMutation({
        mutationFn: (type: string) => getStudentClsSec(type)
    });

    const studentListMutation = useMutation({
        mutationFn: (data: any) => getStudentList(data)
    });

    const sectionListMutation = useMutation({
        mutationFn: (data: any) => getSectionList(data)
    });

    const getICUserDetailsMutation = useMutation({
        mutationFn: (data: { INVMIC_Id: number, userflag: string }) => getICUserDetails(data.INVMIC_Id, data.userflag)
    });

    const getICItemDetailsMutation = useMutation({
        mutationFn: (INVMIC_Id: number) => getICItemDetails(INVMIC_Id)
    });


    return {
        data: query.data,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
        saveMutation,
        deleteMutation,
        itemsOnStoreChangeMutation,
        itemStockDetailMutation,
        getDetailsMutation,
        getStoresMutation,
        getDepartmentsMutation,
        getProductsMutation,
        getEmployeesMutation,
        studentClsSecMutation,
        studentListMutation,
        sectionListMutation,
        getICUserDetailsMutation,
        getICItemDetailsMutation
    };
};

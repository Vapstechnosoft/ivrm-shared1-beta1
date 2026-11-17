import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getInvVendorPaymentLoadData,
    getInvVendorPaymentGRNDetails,
    saveInvVendorPayment,
    deactivateInvVendorPayment,
    getInvVendorPaymentModelDetails,
    getInvGRNItemDetails,
    loadVendorPayments,
    getPaymentModes,
    getSuppliers,
    getGRNList,
    getGRNDetail
} from '@/server/inventory/transactions/inv-vendor-payment';
import { toast } from 'sonner';

export const useInvVendorPayment = (searchParams?: any) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['inv-vendor-payment', searchParams],
        queryFn: () => getInvVendorPaymentLoadData(searchParams),
    });

    const vendorPaymentsQuery = useQuery({
        queryKey: ['inv-vendor-payments-list', searchParams],
        queryFn: () => loadVendorPayments(searchParams),
    });

    const paymentModesQuery = useQuery({
        queryKey: ['inv-payment-modes'],
        queryFn: () => getPaymentModes(),
        staleTime: 5 * 60 * 1000, // cache for 5 mins
    });

    const suppliersQuery = useQuery({
        queryKey: ['inv-suppliers-list'],
        queryFn: () => getSuppliers(),
        staleTime: 5 * 60 * 1000,
    });

    const getGRNDetailsMutation = useMutation({
        mutationFn: ({ invmS_Id, invmgrN_Id }: { invmS_Id: number, invmgrN_Id?: number }) => getInvVendorPaymentGRNDetails(invmS_Id, invmgrN_Id)
    });

    const getGRNListMutation = useMutation({
        mutationFn: getGRNList
    });

    const getGRNDetailMutation = useMutation({
        mutationFn: ({ invmS_Id, invmgrN_Id }: { invmS_Id: number, invmgrN_Id: number }) => getGRNDetail(invmS_Id, invmgrN_Id)
    });

    const saveMutation = useMutation({
        mutationFn: saveInvVendorPayment,
        onSuccess: (res: any) => {
            if (res.success) {
                toast.success(res.message);
                queryClient.invalidateQueries({ queryKey: ['inv-vendor-payment'] });
                queryClient.invalidateQueries({ queryKey: ['inv-vendor-payments-list'] });
            } else {
                toast.error(res.message);
            }
        },
        onError: (err: any) => {
            toast.error(err.message || 'An error occurred');
        }
    });

    const deactivateMutation = useMutation({
        mutationFn: deactivateInvVendorPayment,
        onSuccess: (res: any) => {
            if (res.success) {
                toast.success(res.message);
                queryClient.invalidateQueries({ queryKey: ['inv-vendor-payment'] });
                queryClient.invalidateQueries({ queryKey: ['inv-vendor-payments-list'] });
            } else {
                toast.error(res.message);
            }
        }
    });

    const getModelDetailsMutation = useMutation({
        mutationFn: getInvVendorPaymentModelDetails
    });

    const getGRNItemDetailsMutation = useMutation({
        mutationFn: getInvGRNItemDetails
    });

    return {
        ...query,
        vendorPayments: vendorPaymentsQuery.data,
        isVendorPaymentsLoading: vendorPaymentsQuery.isLoading,
        paymentModes: paymentModesQuery.data?.data || [],
        suppliers: suppliersQuery.data?.data || [],
        isLoadDataLoading: paymentModesQuery.isLoading || suppliersQuery.isLoading,
        getGRNDetailsMutation,
        getGRNListMutation,
        saveMutation,
        deactivateMutation: deactivateMutation,
        getModelDetailsMutation,
        getGRNItemDetailsMutation,
        getGRNDetailMutation
    };
};

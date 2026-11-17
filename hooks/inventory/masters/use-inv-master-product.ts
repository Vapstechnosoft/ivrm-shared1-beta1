import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getInvMasterProductLoadData,
    saveInvMasterProduct,
    saveInvMasterProductQty,
    deactiveInvMasterProduct,
    deactiveInvMasterProductQty,
    getInvMasterProductTax,
    deactiveInvMasterProductTax,
    getInvMasterTaxList,
    getInvMasterProductList,
    getInvMasterItemList,
    getInvMasterProductItemList
} from '@/server/inventory/masters/inv-master-product';
import { toast } from 'sonner';

export const useInvMasterProduct = (searchParams?: any, itemSearchParams?: any) => {
    const { data: loadData, refetch: refetchLoadData, isLoading: isLoadDataLoading } = useQuery({
        queryKey: ['invMasterProductLoadData', searchParams],
        queryFn: () => getInvMasterProductLoadData(searchParams),
        enabled: !!searchParams
    });

    const { data: productItemData, refetch: refetchProductItemData, isLoading: isProductItemLoading } = useQuery({
        queryKey: ['invMasterProductItemData', itemSearchParams],
        queryFn: () => getInvMasterProductItemList(itemSearchParams),
        enabled: !!itemSearchParams
    });

    const { data: productList, refetch: refetchProductList } = useQuery({
        queryKey: ['invMasterProductDropdownList'],
        queryFn: () => getInvMasterProductList(),
        enabled: false
    });

    const { data: itemList, refetch: refetchItemList } = useQuery({
        queryKey: ['invMasterItemDropdownList'],
        queryFn: () => getInvMasterItemList(),
        enabled: false
    });

    const saveProductMutation = useMutation({
        mutationFn: saveInvMasterProduct,
        onSuccess: (res: any) => {
            if (res.success) {
                toast.success(res.message);
                refetchLoadData();
            } else {
                if (res.message?.toLowerCase().includes('duplicate')) {
                    toast.error('Record already exist');
                } else {
                    toast.error(res.message || 'Failed to save/update record');
                }
            }
        },
        onError: (error) => {
            console.error(error);
            toast.error('An error occurred');
        }
    });

    const saveProductQtyMutation = useMutation({
        mutationFn: saveInvMasterProductQty,
        onSuccess: (res: any) => {
            if (res.success) {
                toast.success(res.message);
                refetchLoadData();
            } else {
                if (res.message?.toLowerCase().includes('duplicate')) {
                    toast.error('Record already exist');
                } else {
                    toast.error(res.message || 'Failed to save/update record');
                }
            }
        },
        onError: (error) => {
            console.error(error);
            toast.error('An error occurred');
        }
    });

    const deactiveProductMutation = useMutation({
        mutationFn: deactiveInvMasterProduct,
        onSuccess: (res: any) => {
            if (res.returnval === true) {
                toast.success('Record Status Updated Successfully');
                refetchLoadData();
            } else {
                toast.error('Failed to update record status');
            }
        }
    });

    const deactiveProductQtyMutation = useMutation({
        mutationFn: deactiveInvMasterProductQty,
        onSuccess: (res: any) => {
            if (res.returnval === true) {
                toast.success('Record Status Updated Successfully');
                refetchLoadData();
            } else {
                toast.error('Failed to update record status');
            }
        }
    });

    // For fetching tax details of a product
    const getProductTaxMutation = useMutation({
        mutationFn: getInvMasterProductTax
    });

    const deactiveProductTaxMutation = useMutation({
        mutationFn: deactiveInvMasterProductTax,
        onSuccess: (res: any) => {
            if (res.returnval === true) {
                toast.success('Record Status Updated Successfully');
            } else {
                toast.error('Failed to update record status');
            }
        }
    });

    const getTaxListMutation = useMutation({
        mutationFn: getInvMasterTaxList
    });

    const getProductListMutation = useMutation({
        mutationFn: getInvMasterProductList
    });

    const getItemListMutation = useMutation({
        mutationFn: getInvMasterItemList
    });

    const getProductItemListMutation = useMutation({
        mutationFn: getInvMasterProductItemList
    });

    return {
        loadData,
        refetchLoadData,
        isLoadDataLoading,
        productItemData,
        refetchProductItemData,
        isProductItemLoading,
        productList,
        refetchProductList,
        itemList,
        refetchItemList,
        saveProductMutation,
        saveProductQtyMutation,
        deactiveProductMutation,
        deactiveProductQtyMutation,
        getProductTaxMutation,
        deactiveProductTaxMutation,
        getTaxListMutation,
        getProductListMutation,
        getItemListMutation,
        getProductItemListMutation
    };
};

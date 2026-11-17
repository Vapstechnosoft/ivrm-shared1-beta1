'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useInvMasterProduct } from '@/hooks/inventory/masters/use-inv-master-product';
import { getInvMasterProductList, getInvMasterItemList } from '@/server/inventory/masters/inv-master-product';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { parseAsInteger, useQueryState } from 'nuqs';
import { tableSearchVariables } from '@/lib/data-table.config';

const formSchema = z.object({
    invmpI_Id: z.number().optional(),
    invmP_Id: z.coerce.number().min(1, 'Product is required'),
    invmI_Id: z.coerce.number().min(1, 'Item is required'),
    invmpI_ItemQty: z.coerce.number().min(1, 'Quantity must be greater than 0'),
});

export default function ProductQtyTab() {
    console.log("ProductQtyTab - MOUNTED/RENDERED");
    // Pagination State
    const [currentPage] = useQueryState(
        tableSearchVariables.page,
        parseAsInteger.withOptions({ shallow: false }).withDefault(1)
    );
    const [pageSize] = useQueryState(
        tableSearchVariables.page_size,
        parseAsInteger.withOptions({ shallow: false }).withDefault(10)
    );

    const itemSearchParams = { page: currentPage, page_size: pageSize };

    const {
        productItemData,
        isProductItemLoading,
        saveProductQtyMutation,
        deactiveProductQtyMutation,
        refetchProductItemData
    } = useInvMasterProduct(undefined, itemSearchParams);

    const [products, setProducts] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const productRes = await getInvMasterProductList();
                const pRes = productRes as any;
                if (isMounted && pRes?.success && Array.isArray(pRes.data)) {
                    setProducts(pRes.data);
                }

                const itemRes = await getInvMasterItemList();
                const iRes = itemRes as any;
                if (isMounted && iRes?.success && Array.isArray(iRes.data)) {
                    setItems(iRes.data);
                }
            } catch (error) {
                console.error("ProductQtyTab: Failed to fetch dropdown data", error);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, [productItemData]);

    const data = (productItemData as any)?.get_product_item || (productItemData as any)?.data || [];
    const tableProps = useDataTableProps({ ...((productItemData || {}) as any), data });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            invmpI_Id: 0,
            invmP_Id: 0,
            invmI_Id: 0,
            invmpI_ItemQty: 0,
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const payload = {
            INVMPI_Id: values.invmpI_Id || 0,
            INVMP_Id: values.invmP_Id,
            INVMI_Id: values.invmI_Id,
            INVMPI_ItemQty: values.invmpI_ItemQty
        };
        saveProductQtyMutation.mutate(payload, {
            onSuccess: (res: any) => {
                if (res.success) {
                    onCancel();
                    refetchProductItemData();
                }
            }
        });
    };

    const onEdit = (item: any) => {
        form.setValue('invmpI_Id', item.invmpI_Id);
        form.setValue('invmP_Id', item.invmP_Id);
        form.setValue('invmI_Id', item.invmI_Id);
        form.setValue('invmpI_ItemQty', item.invmpI_ItemQty);
    };

    const onDeactive = (item: any) => {
        deactiveProductQtyMutation.mutate({
            INVMPI_Id: item.invmpI_Id,
            INVMPI_ActiveFlg: item.invmpI_ActiveFlg
        });
    };

    const onCancel = () => {
        form.reset({
            invmpI_Id: 0,
            invmP_Id: 0,
            invmI_Id: 0,
            invmpI_ItemQty: 0,
        });
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'index',
            header: 'SL NO',
            cell: ({ row, table }) => (table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + row.index + 1,
        },
        {
            accessorKey: 'invmP_ProductName',
            header: 'Product Name',
        },
        {
            accessorKey: 'invmI_ItemName',
            header: 'Item Name',
        },
        {
            accessorKey: 'invmpI_ItemQty',
            header: 'Quantity',
        },
        {
            id: 'actions',
            header: 'Action',
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)}>
                        <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeactive(row.original)}>
                        {row.original.invmpI_ActiveFlg ? (
                            <Trash2 className="h-4 w-4 text-red-500" />
                        ) : (
                            <Badge variant="outline" className="text-green-500 cursor-pointer">Activate</Badge>
                        )}
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField control={form.control} name="invmP_Id" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value?.toString() || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Product" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {products.map((item: any) => (
                                            <SelectItem key={item.invmP_Id} value={item.invmP_Id.toString()}>
                                                {item.invmP_ProductName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="invmI_Id" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Item</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value?.toString() || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Item" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {items.map((item: any) => (
                                            <SelectItem key={item.invmI_Id} value={item.invmI_Id.toString()}>
                                                {item.invmI_ItemName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="invmpI_ItemQty" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Item Quantity</FormLabel>
                                <FormControl><Input {...field} type="number" placeholder="Enter Quantity" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <div className="flex justify-center space-x-4">
                        <Button type="submit">Save</Button>
                        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    </div>
                </form>
            </Form>

            <div className="mt-8">
                <GenericDataTable
                    {...tableProps}
                    data={data}
                    columns={columns}
                    isLoading={isProductItemLoading}
                />
            </div>
        </div>
    );
}

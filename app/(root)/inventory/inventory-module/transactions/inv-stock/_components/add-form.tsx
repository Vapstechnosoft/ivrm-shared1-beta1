
'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, RotateCcw, Save, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { invStockSchema, type TInvStock } from '@/schemas/inventory/transactions/inv-stock';
import { useInvStock } from '@/hooks/inventory/transactions/use-inv-stock';
import { toast } from 'sonner';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';

interface AddStockFormProps {
    onSuccess: () => void;
    initialData?: any;
}

export default function AddStockForm({ onSuccess, initialData }: AddStockFormProps) {
    const { saveMutation, editMutation, getStoresQuery, getItemsMutation } = useInvStock();
    const fetchItems = getItemsMutation.mutate;
    const fetchEditData = editMutation.mutate;
    const isEdit = !!initialData;
    const [rowItems, setRowItems] = useState<Record<number, any[]>>({});

    const storeList = getStoresQuery.data?.data || [];

    const form = useForm<TInvStock>({
        resolver: zodResolver(invStockSchema),
        defaultValues: {
            stocklist: [
                {
                    invstO_Id: 0,
                    invmsT_Id: 0,
                    invmI_Id: 0,
                    invstO_BatchNo: '',
                    invstO_PurchaseDate: new Date(),
                    invstO_PurchaseRate: 0,
                    invstO_SalesRate: 0,
                    invstO_ItemConQty: 0,
                    invstO_PurOBQty: 0,
                    invstO_PurRetQty: 0,
                    invstO_SalesQty: 0,
                    invstO_SalesRetQty: 0,
                    invstO_MatIssPlusQty: 0,
                    invstO_MatIssMinusQty: 0,
                    invstO_PhyPlusQty: 0,
                    invstO_PhyMinQty: 0,
                    invstO_AvaiableStock: 0,
                }
            ]
        }
    });

    const { control, handleSubmit, register, reset, setValue } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'stocklist'
    });

    const handleStoreChange = (storeId: number, index: number) => {
        setValue(`stocklist.${index}.invmsT_Id`, storeId);
        // Reset item selection when store changes
        setValue(`stocklist.${index}.invmI_Id`, 0);
        setValue(`stocklist.${index}.invstO_BatchNo`, '');
        setValue(`stocklist.${index}.invstO_PurchaseDate`, new Date());
        setValue(`stocklist.${index}.invstO_PurchaseRate`, 0);
        setValue(`stocklist.${index}.invstO_SalesRate`, 0);
        setValue(`stocklist.${index}.invstO_AvaiableStock`, 0);

        if (!storeId) {
            setRowItems(prev => ({ ...prev, [index]: [] }));
            return;
        }

        fetchItems(storeId, {
            onSuccess: (res: any) => {
                // Use data if available, regardless of strict success flag if data is present
                // per user sample showing success:false but valid data
                const items = res.data || [];
                setRowItems(prev => ({ ...prev, [index]: items }));

                if (!items.length && !res.success) {
                    toast.error(res.message || 'Failed to fetch items');
                }
            },
            onError: () => {
                setRowItems(prev => ({ ...prev, [index]: [] }));
            }
        });
    };

    const handleItemChange = (itemId: number, index: number) => {
        setValue(`stocklist.${index}.invmI_Id`, itemId);
    };

    useEffect(() => {
        if (isEdit && initialData?.invstO_Id) {
            fetchEditData(initialData.invstO_Id, {
                onSuccess: (res: any) => {
                    if (res.data && res.data.length > 0) {
                        const editData = res.data[0];

                        // Load items for the store in edit mode
                        if (editData.invmsT_Id) {
                            fetchItems(editData.invmsT_Id, {
                                onSuccess: (itemRes: any) => {
                                    const items = itemRes.data || [];
                                    setRowItems(prev => ({ ...prev, 0: items }));
                                }
                            });
                        }

                        reset({
                            stocklist: [{
                                ...editData,
                                invstO_PurchaseDate: new Date(editData.invstO_PurchaseDate),
                            }]
                        });
                    }
                }
            });
        }
    }, [isEdit, initialData, reset, fetchEditData, fetchItems]);

    const onSubmit = (data: TInvStock) => {
        saveMutation.mutate(data, {
            onSuccess: (res: any) => {
                if (res.success || res.returnval) {
                    toast.success(res.message || 'Stock records updated successfully');
                    onSuccess();
                }
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CollapsibleSection
                title={
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <Package className="h-5 w-5 text-primary" />
                        <span>Stock Management</span>
                    </div>
                }
                defaultOpen={true}
                className="shadow-md border-primary/20"
            >
                <div className="overflow-x-auto p-4 bg-muted/30 rounded-lg border border-primary/5">
                    <Table className="border-collapse text-xs min-w-[2000px]">
                        <TableHeader>
                            <TableRow className="bg-primary/5 hover:bg-primary/5 uppercase tracking-wider font-bold">
                                <TableHead className="w-[50px] text-center border">#</TableHead>
                                <TableHead className="min-w-[200px] border">Store</TableHead>
                                <TableHead className="min-w-[250px] border">Item</TableHead>
                                <TableHead className="min-w-[120px] border">Batch No</TableHead>
                                <TableHead className="min-w-[150px] border">Purchase Date</TableHead>
                                <TableHead className="min-w-[100px] text-right border">Purchase Rate</TableHead>
                                <TableHead className="min-w-[100px] text-right border">Sale Rate</TableHead>
                                <TableHead className="min-w-[100px] text-right border">Item Qty</TableHead>
                                <TableHead className="min-w-[120px] text-right border">Purchase Qty</TableHead>
                                <TableHead className="min-w-[150px] text-right border">Purchase Ret Qty</TableHead>
                                <TableHead className="min-w-[100px] text-right border">Sale Qty</TableHead>
                                <TableHead className="min-w-[150px] text-right border">Sale Ret Qty</TableHead>
                                <TableHead className="min-w-[120px] text-right border">Material +</TableHead>
                                <TableHead className="min-w-[120px] text-right border">Material -</TableHead>
                                <TableHead className="min-w-[120px] text-right border">Physical +</TableHead>
                                <TableHead className="min-w-[120px] text-right border">Physical -</TableHead>
                                <TableHead className="min-w-[150px] text-right border">Avaiable Stock</TableHead>
                                <TableHead className="w-[80px] text-center border">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y">
                            {fields.map((field, index) => (
                                <TableRow key={field.id} className="hover:bg-primary/5 group transition-all duration-200">
                                    <TableCell className="text-center font-semibold border bg-muted/20">{index + 1}</TableCell>

                                    <TableCell className="border">
                                        <Controller
                                            name={`stocklist.${index}.invmsT_Id`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={(val) => handleStoreChange(Number(val), index)}
                                                    value={field.value?.toString()}
                                                >
                                                    <SelectTrigger className="h-9 border-primary/10 hover:border-primary/40 focus:ring-primary/20 bg-background">
                                                        <SelectValue placeholder="Select Store" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {storeList.map((store: any) => (
                                                            <SelectItem key={store.invmsT_Id} value={store.invmsT_Id.toString()}>
                                                                {store.invmS_StoreName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </TableCell>

                                    <TableCell className="border">
                                        <Controller
                                            name={`stocklist.${index}.invmI_Id`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={(val) => handleItemChange(Number(val), index)}
                                                    value={field.value?.toString()}
                                                    disabled={!rowItems[index]?.length}
                                                >
                                                    <SelectTrigger className="h-9 border-primary/10 hover:border-primary/40 focus:ring-primary/20 bg-background">
                                                        <SelectValue placeholder={rowItems[index]?.length ? "Select Item" : "Select Store First"} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {rowItems[index]?.map((item: any) => (
                                                            <SelectItem key={item.invmi_Id} value={item.invmi_Id.toString()}>
                                                                {item.invmi_ItemName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </TableCell>

                                    <TableCell className="border">
                                        <Input {...register(`stocklist.${index}.invstO_BatchNo`)} className="h-9 border-primary/10 focus:border-primary/40 bg-background" />
                                    </TableCell>

                                    <TableCell className="border">
                                        <Controller
                                            name={`stocklist.${index}.invstO_PurchaseDate`}
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type='date'
                                                    className='flex h-9 w-full rounded-md border border-primary/10 bg-background px-3 py-2 text-xs focus:border-primary/40 focus:ring-1 focus:ring-primary/20 hover:border-primary/30 transition-all'
                                                    value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                />
                                            )}
                                        />
                                    </TableCell>

                                    <TableCell className="border">
                                        <Input type="number" {...register(`stocklist.${index}.invstO_PurchaseRate`, { valueAsNumber: true })} className="h-9 text-right border-primary/10 focus:border-primary/40" />
                                    </TableCell>

                                    <TableCell className="border">
                                        <Input type="number" {...register(`stocklist.${index}.invstO_SalesRate`, { valueAsNumber: true })} className="h-9 text-right border-primary/10 focus:border-primary/40" />
                                    </TableCell>

                                    <TableCell className="border">
                                        <Input type="number" {...register(`stocklist.${index}.invstO_ItemConQty`, { valueAsNumber: true })} className="h-9 text-right border-primary/10 focus:border-primary/40" />
                                    </TableCell>

                                    <TableCell className="border">
                                        <Input type="number" {...register(`stocklist.${index}.invstO_PurOBQty`, { valueAsNumber: true })} className="h-9 text-right border-primary/10 focus:border-primary/40" />
                                    </TableCell>

                                    <TableCell className="border">
                                        <Input type="number" {...register(`stocklist.${index}.invstO_PurRetQty`, { valueAsNumber: true })} className="h-9 text-right border-primary/10 focus:border-primary/40" />
                                    </TableCell>

                                    <TableCell className="border">
                                        <Input type="number" {...register(`stocklist.${index}.invstO_SalesQty`, { valueAsNumber: true })} className="h-9 text-right border-primary/10 focus:border-primary/40" />
                                    </TableCell>

                                    <TableCell className="border">
                                        <Input type="number" {...register(`stocklist.${index}.invstO_SalesRetQty`, { valueAsNumber: true })} className="h-9 text-right border-primary/10 focus:border-primary/40" />
                                    </TableCell>

                                    <TableCell className="border">
                                        <Input type="number" {...register(`stocklist.${index}.invstO_MatIssPlusQty`, { valueAsNumber: true })} className="h-9 text-right border-primary/10 focus:border-primary/40" />
                                    </TableCell>

                                    <TableCell className="border">
                                        <Input type="number" {...register(`stocklist.${index}.invstO_MatIssMinusQty`, { valueAsNumber: true })} className="h-9 text-right border-primary/10 focus:border-primary/40" />
                                    </TableCell>

                                    <TableCell className="border">
                                        <Input type="number" {...register(`stocklist.${index}.invstO_PhyPlusQty`, { valueAsNumber: true })} className="h-9 text-right border-primary/10 focus:border-primary/40" />
                                    </TableCell>

                                    <TableCell className="border">
                                        <Input type="number" {...register(`stocklist.${index}.invstO_PhyMinQty`, { valueAsNumber: true })} className="h-9 text-right border-primary/10 focus:border-primary/40" />
                                    </TableCell>

                                    <TableCell className="border">
                                        <Input type="number" {...register(`stocklist.${index}.invstO_AvaiableStock`, { valueAsNumber: true })} className="h-9 text-right font-bold text-primary border-primary/20 focus:border-primary/40 bg-primary/5" />
                                    </TableCell>

                                    <TableCell className="text-center border bg-muted/20">
                                        {!isEdit && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => remove(index)}
                                                disabled={fields.length === 1}
                                                className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex justify-between items-center mt-6 p-4 border-t border-primary/10">
                    {!isEdit && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary font-semibold"
                            onClick={() => append({
                                invstO_Id: 0,
                                invmsT_Id: 0,
                                invmI_Id: 0,
                                invstO_BatchNo: '',
                                invstO_PurchaseDate: new Date(),
                                invstO_PurchaseRate: 0,
                                invstO_SalesRate: 0,
                                invstO_ItemConQty: 0,
                                invstO_PurOBQty: 0,
                                invstO_PurRetQty: 0,
                                invstO_SalesQty: 0,
                                invstO_SalesRetQty: 0,
                                invstO_MatIssPlusQty: 0,
                                invstO_MatIssMinusQty: 0,
                                invstO_PhyPlusQty: 0,
                                invstO_PhyMinQty: 0,
                                invstO_AvaiableStock: 0,
                            })}
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Row
                        </Button>
                    )}

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-destructive/80 border-destructive/20 hover:bg-destructive/10"
                            onClick={() => reset()}
                        >
                            <RotateCcw className="h-4 w-4 mr-2" /> Reset
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={saveMutation.isPending}
                            className="bg-primary hover:bg-primary/90 shadow-lg"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {saveMutation.isPending ? 'Saving...' : (isEdit ? 'Update Stock' : 'Save Stock')}
                        </Button>
                    </div>
                </div>
            </CollapsibleSection>
        </form>
    );
}

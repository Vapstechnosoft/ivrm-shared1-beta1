import { useEffect, useState, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Package, Plus, ReceiptText, RotateCcw, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/extension/field';
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
import { invOpeningBalanceSchema, type TInvOpeningBalance } from '@/schemas/inventory/transactions/inv-opening-balance';
import { useInvOpeningBalance, useInvOpeningBalanceItemDetails, useInvOpeningBalanceDetails } from '@/hooks/inventory/transactions/use-inv-opening-balance';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';

interface AddOBFormProps {
    onSuccess: () => void;
    storeList: any[];
    itemList: any[];
    initialData?: any;
    isEdit?: boolean;
}

export default function AddOBForm({ onSuccess, storeList: initialStoreList, itemList: initialItemList, initialData, isEdit }: AddOBFormProps) {
    const { saveMutation, getItemsMutation, getStoresMutation } = useInvOpeningBalance();
    const itemDetailMutation = useInvOpeningBalanceItemDetails();
    const obDetailsMutation = useInvOpeningBalanceDetails();

    const [stores, setStores] = useState<any[]>(initialStoreList || []);
    const [items, setItems] = useState<any[]>(initialItemList || []);

    const form = useForm<TInvOpeningBalance>({
        resolver: zodResolver(invOpeningBalanceSchema),
        defaultValues: {
            invmsT_Id: 0,
            transrows: [
                {
                    itrS_Id: 'trans1',
                    invmI_Id: 0,
                    invmuoM_Id: 0,
                    invmuoM_UOMName: '',
                    invoB_BatchNo: '',
                    invoB_PurchaseDate: new Date(),
                    invoB_Qty: 0,
                    invstO_PurchaseRate: 0,
                    invstO_SalesRate: 0,
                    invoB_Naration: '',
                    invoB_TotalAmount: 0
                }
            ]
        }
    });

    const { control, handleSubmit, register, setValue, watch, reset, formState: { errors } } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'transrows'
    });

    const watchedStoreId = watch('invmsT_Id');

    // Sync stores state with props
    useEffect(() => {
        if (initialStoreList && initialStoreList.length > 0) {
            setStores(initialStoreList);
        }
    }, [initialStoreList]);

    // Fetch Stores fallback
    useEffect(() => {
        if (!initialStoreList || initialStoreList.length === 0) {
            getStoresMutation.mutate(undefined, {
                onSuccess: (res) => {
                    if (res?.data) {
                        setStores(res.data);
                    }
                }
            });
        }
    }, [initialStoreList]);

    // Fetch Items when Store changes
    useEffect(() => {
        if (watchedStoreId && watchedStoreId !== 0) {
            getItemsMutation.mutate({ INVMST_Id: watchedStoreId, INVC_LIFOFIFOFlg: 'LIFO' }, {
                onSuccess: (res: any) => {
                    const extractedItems = res.data || [];
                    setItems(extractedItems);
                }
            });
        }
    }, [watchedStoreId]);

    // Populate data for Edit
    useEffect(() => {
        if (isEdit && initialData?.invoB_Id) {
            obDetailsMutation.mutate({ INVOB_Id: initialData.invoB_Id }, {
                onSuccess: (res: any) => {
                    if (res.get_obdetails && res.get_obdetails.length > 0) {
                        const detail = res.get_obdetails[0];
                        const rows = res.get_obdetails.map((obj: any, index: number) => ({
                            itrS_Id: `trans${index + 1}`,
                            invmI_Id: obj.invmI_Id,
                            invmI_ItemName: obj.invmI_ItemName,
                            invmuoM_Id: obj.invmuoM_Id,
                            invmuoM_UOMName: obj.invmuoM_UOMName,
                            invoB_BatchNo: obj.invoB_BatchNo,
                            invoB_PurchaseDate: new Date(obj.invoB_PurchaseDate),
                            invoB_Qty: obj.invoB_Qty,
                            invoB_MfgDate: obj.invoB_MfgDate ? new Date(obj.invoB_MfgDate) : null,
                            invoB_ExpDate: obj.invoB_ExpDate ? new Date(obj.invoB_ExpDate) : null,
                            invstO_PurchaseRate: obj.invoB_PurchaseRate,
                            invstO_SalesRate: obj.invoB_SaleRate,
                            invoB_Naration: obj.invoB_Naration,
                            invoB_TotalAmount: (obj.invoB_PurchaseRate || 0) * (obj.qty || obj.invoB_Qty || 0)
                        }));

                        reset({
                            invoB_Id: initialData.invoB_Id,
                            invmsT_Id: initialData.invmsT_Id || detail.invmsT_Id,
                            transrows: rows
                        });
                    }
                }
            });
        }
    }, [isEdit, initialData, reset]);

    const handleItemChange = (index: number, itemId: string) => {
        const id = Number(itemId);
        setValue(`transrows.${index}.invmI_Id`, id);

        if (id) {
            itemDetailMutation.mutate({ INVMI_Id: id }, {
                onSuccess: (res: any) => {
                    const rawDetails = res.data || [];
                    if (rawDetails.length > 0) {
                        const details = rawDetails[0];
                        setValue(`transrows.${index}.invmuoM_Id`, details.invmuoM_Id);
                        setValue(`transrows.${index}.invmuoM_UOMName`, details.invmuoM_UOMName);
                        // Reset other fields on item change
                        setValue(`transrows.${index}.invoB_BatchNo`, '');
                        setValue(`transrows.${index}.invoB_Qty`, 0);
                        setValue(`transrows.${index}.invstO_PurchaseRate`, 0);
                        setValue(`transrows.${index}.invstO_SalesRate`, 0);
                        setValue(`transrows.${index}.invoB_PurchaseDate`, new Date());
                    }
                }
            });
        }
    };

    // Auto-calculate Total Amount (Qty * Purchase Rate) for each row
    const watchedRows = watch('transrows');
    useEffect(() => {
        if (watchedRows) {
            watchedRows.forEach((row, index) => {
                const qty = Number(row.invoB_Qty) || 0;
                const rate = Number(row.invstO_PurchaseRate) || 0;
                const total = qty * rate;
                // Only update if value is different to avoid infinite loop
                const currentTotal = form.getValues(`transrows.${index}.invoB_TotalAmount`);
                if (currentTotal !== total) {
                    setValue(`transrows.${index}.invoB_TotalAmount`, total, { shouldDirty: true, shouldTouch: true });
                }
            });
        }
    }, [JSON.stringify(watchedRows?.map(r => ({ q: r.invoB_Qty, p: r.invstO_PurchaseRate })))]); // Efficient dependency tracking

    const totals = useMemo(() => {
        return (watchedRows || []).reduce((acc, row) => ({
            qty: acc.qty + (Number(row.invoB_Qty) || 0),
            amount: acc.amount + (Number(row.invoB_TotalAmount) || 0)
        }), { qty: 0, amount: 0 });
    }, [watchedRows]);

    const onSubmit = (data: TInvOpeningBalance) => {
        saveMutation.mutate(data, {
            onSuccess: (res: any) => {
                if (res.success || res.returnval) {
                    toast.success(res.message || 'Opening Balance saved successfully');
                    onSuccess();
                } else {
                    toast.error(res.message || 'Failed to save Opening Balance');
                }
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-[1400px] mx-auto">
            <CollapsibleSection
                title={
                    <div className="flex items-center gap-2">
                        <RotateCcw className="h-5 w-5 text-primary" />
                        <span>Store Inventory Details</span>
                    </div>
                }
                defaultOpen={true}
                className="shadow-sm border-primary/10"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-1">
                    <div className="md:col-span-1 space-y-4">
                        <div className="bg-muted/30 p-4 rounded-lg border border-primary/5">
                            <Label className="mb-2 block font-semibold text-primary/80">Select Store <span className="text-red-500">*</span></Label>
                            <Controller
                                name="invmsT_Id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value?.toString()}
                                        disabled={isEdit}
                                    >
                                        <SelectTrigger className={`bg-background shadow-sm h-11 ${errors.invmsT_Id ? "border-red-500 ring-red-500" : "border-primary/20 hover:border-primary/40"}`}>
                                            <SelectValue placeholder="-- Select Store --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stores.map((store: any, idx: number) => (
                                                <SelectItem key={`${store.invmsT_Id}-${idx}`} value={store.invmsT_Id.toString()}>
                                                    {store.invmS_StoreName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.invmsT_Id && <p className="text-red-500 text-xs mt-2 font-medium">{errors.invmsT_Id.message}</p>}
                        </div>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection
                title={
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <span>Opening Balance Items</span>
                    </div>
                }
                defaultOpen={true}
                className="shadow-sm border-primary/10"
            >
                <div className="overflow-x-auto -mx-1 p-1">
                    <Table className="border-collapse text-xs min-w-[1200px]">
                        <TableHeader>
                            <TableRow className="bg-muted/50 text-muted-foreground uppercase tracking-wider text-[10px]">
                                <TableHead className="w-[50px] text-center border">#</TableHead>
                                <TableHead className="min-w-[200px] border">Item Name</TableHead>
                                <TableHead className="min-w-[80px] border">UOM</TableHead>
                                <TableHead className="min-w-[100px] border">Batch No</TableHead>
                                <TableHead className="min-w-[140px] border">Purchase Date</TableHead>
                                <TableHead className="min-w-[140px] border">Mfg Date</TableHead>
                                <TableHead className="min-w-[140px] border">Exp Date</TableHead>
                                <TableHead className="min-w-[80px] text-right border">Qty</TableHead>
                                <TableHead className="min-w-[100px] text-right border">Purchase Rate</TableHead>
                                <TableHead className="min-w-[110px] text-right border">Total Amount</TableHead>
                                <TableHead className="min-w-[100px] text-right border">Sales Rate</TableHead>
                                <TableHead className="min-w-[150px] border">Narration</TableHead>
                                <TableHead className="w-[50px] text-center border"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y">
                            {fields.map((field, index) => (
                                <TableRow key={field.id} className="hover:bg-primary/5 transition-colors group">
                                    <TableCell className="text-center font-medium border">{index + 1}</TableCell>
                                    <TableCell className="border">
                                        {isEdit ? (
                                            <div className="py-2 px-1 font-semibold text-primary/80">{watch(`transrows.${index}.invmI_ItemName`)}</div>
                                        ) : (
                                            <Controller
                                                name={`transrows.${index}.invmI_Id`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        onValueChange={(val) => handleItemChange(index, val)}
                                                        value={field.value?.toString()}
                                                        disabled={!watchedStoreId}
                                                    >
                                                        <SelectTrigger className={`h-9 bg-background ${errors.transrows?.[index]?.invmI_Id ? "border-red-500" : "border-primary/10"}`}>
                                                            <SelectValue placeholder={watchedStoreId ? "Select Item" : "Select Store first"} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {items.map((item: any, idx: number) => (
                                                                <SelectItem key={`${item.invmI_Id || item.invmi_Id}-${idx}`} value={(item.invmI_Id || item.invmi_Id)?.toString()}>
                                                                    {item.invmI_ItemName || item.invmi_ItemName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        )}
                                        {errors.transrows?.[index]?.invmI_Id && <p className="text-red-500 text-[10px] mt-1 font-semibold">Required</p>}
                                    </TableCell>
                                    <TableCell className="border">
                                        <Input
                                            {...register(`transrows.${index}.invmuoM_UOMName`)}
                                            disabled
                                            className="bg-muted/50 h-9 border-none text-center font-medium"
                                        />
                                    </TableCell>
                                    <TableCell className="border">
                                        <Input
                                            {...register(`transrows.${index}.invoB_BatchNo`)}
                                            disabled={isEdit}
                                            className="h-9 border-primary/10 transition-all focus:border-primary/40"
                                        />
                                    </TableCell>
                                    <TableCell className="border">
                                        <Controller
                                            name={`transrows.${index}.invoB_PurchaseDate`}
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type='date'
                                                    className='flex h-9 w-full rounded-md border border-primary/10 bg-background px-3 py-2 text-xs transition-all focus:border-primary/40 focus:ring-1 focus:ring-primary/20 hover:border-primary/30'
                                                    value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell className="border">
                                        <Controller
                                            name={`transrows.${index}.invoB_MfgDate`}
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type='date'
                                                    className='flex h-9 w-full rounded-md border border-primary/10 bg-background px-3 py-2 text-xs transition-all focus:border-primary/40 focus:ring-1 focus:ring-primary/20 hover:border-primary/30'
                                                    value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                                                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell className="border">
                                        <Controller
                                            name={`transrows.${index}.invoB_ExpDate`}
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type='date'
                                                    className='flex h-9 w-full rounded-md border border-primary/10 bg-background px-3 py-2 text-xs transition-all focus:border-primary/40 focus:ring-1 focus:ring-primary/20 hover:border-primary/30'
                                                    value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                                                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell className="border">
                                        <Input
                                            type="number"
                                            {...register(`transrows.${index}.invoB_Qty`, { valueAsNumber: true })}
                                            className="h-9 text-right border-primary/10 focus:border-primary/40 font-medium"
                                        />
                                    </TableCell>
                                    <TableCell className="border">
                                        <Input
                                            type="number"
                                            {...register(`transrows.${index}.invstO_PurchaseRate`, { valueAsNumber: true })}
                                            className="h-9 text-right border-primary/10 focus:border-primary/40 font-medium"
                                        />
                                    </TableCell>
                                    <TableCell className="border">
                                        <div className="h-9 flex items-center justify-end px-3 bg-muted/20 rounded-md font-bold text-primary border border-dashed border-primary/10">
                                            {Number(watch(`transrows.${index}.invoB_TotalAmount`)).toFixed(2) || '0.00'}
                                        </div>
                                        <input type="hidden" {...register(`transrows.${index}.invoB_TotalAmount`)} />
                                    </TableCell>
                                    <TableCell className="border">
                                        <Input
                                            type="number"
                                            {...register(`transrows.${index}.invstO_SalesRate`, { valueAsNumber: true })}
                                            disabled={isEdit}
                                            className="h-9 text-right border-primary/10 focus:border-primary/40"
                                        />
                                    </TableCell>
                                    <TableCell className="border">
                                        <Input
                                            {...register(`transrows.${index}.invoB_Naration`)}
                                            disabled={isEdit}
                                            className="h-9 border-primary/10 focus:border-primary/40"
                                            placeholder="Enter Narration"
                                        />
                                    </TableCell>
                                    <TableCell className="text-center border">
                                        {!isEdit && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => remove(index)}
                                                disabled={fields.length === 1}
                                                className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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

                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 border-t pt-4">
                    {!isEdit && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="bg-primary/5 hover:bg-primary/10 border-primary/10 text-primary font-medium transition-all"
                            onClick={() => append({
                                itrS_Id: `trans${fields.length + 1}`,
                                invmI_Id: 0,
                                invmuoM_Id: 0,
                                invmuoM_UOMName: '',
                                invoB_BatchNo: '0',
                                invoB_PurchaseDate: new Date(),
                                invoB_Qty: 0,
                                invstO_PurchaseRate: 0,
                                invstO_SalesRate: 0,
                                invoB_Naration: '',
                                invoB_TotalAmount: 0
                            })}
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Item
                        </Button>
                    )}

                    <div className="flex gap-4 p-3 rounded-lg border border-primary/10 bg-muted/30 ml-auto">
                        <div className="flex flex-col items-center px-4 border-r border-primary/10">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Total Items</span>
                            <span className="text-md font-bold text-primary">{fields.length}</span>
                        </div>
                        <div className="flex flex-col items-center px-4 border-r border-primary/10">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Total Qty</span>
                            <span className="text-md font-bold text-primary">{totals.qty}</span>
                        </div>
                        <div className="flex flex-col items-center px-4">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Grand Total</span>
                            <span className="text-md font-bold text-primary">₹ {totals.amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </CollapsibleSection>

            <div className='flex justify-end gap-2 pt-4'>
                <Button
                    type='button'
                    variant='outline'
                    onClick={() => reset()}
                    className='text-destructive/80 hover:bg-destructive/10'
                >
                    <RotateCcw className='h-4 w-4 mr-2' />
                    Reset
                </Button>
                <Button
                    type='submit'
                    disabled={saveMutation.isPending}
                    className='min-w-[120px]'
                >
                    {saveMutation.isPending ? 'Saving...' : (isEdit ? 'Update' : 'Save')}
                </Button>
            </div>
        </form>
    );
}

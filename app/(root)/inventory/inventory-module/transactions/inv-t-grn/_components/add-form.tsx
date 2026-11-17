'use client';

import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label, FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    invTGRNSchema,
    type InvTGRNSchema
} from '@/schemas/inventory/transactions/inv-t-grn';
import { useInvTGRN } from '@/hooks/inventory/transactions/use-inv-t-grn';
import { Plus, Minus, Save, RotateCcw, Calculator, Package, ReceiptIndianRupee, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { getItemTaxDetail, getItemDetail } from '@/server/inventory/transactions/inv-t-grn';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Card } from '@/components/ui/card';

const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

interface AddGRNFormProps {
    onSuccess: () => void;
}

export default function AddGRNForm({ onSuccess }: AddGRNFormProps) {
    const { data: loadData, saveMutation } = useInvTGRN();
    const [discountType, setDiscountType] = useState<'A' | 'P'>('A');

    // Tax Modal State
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
    const [selectedTaxRowIndex, setSelectedTaxRowIndex] = useState<number | null>(null);

    const form = useForm<InvTGRNSchema>({
        resolver: zodResolver(invTGRNSchema),
        defaultValues: {
            invmgrN_Id: 0,
            invmgrN_PurchaseDate: new Date(),
            invmgrN_InvoiceNo: '',
            invmS_Id: undefined,
            invmsT_Id: undefined,
            invmgrN_POReference: '',
            invmgrN_EWayBillRef: '',
            invmgrN_TowardsProjects: '',
            invmgrN_Prepared: '',
            invmgrN_SignedBy: '',
            invmgrN_ChallanNo: '',
            invmgrN_KitNo: '',
            invmgrN_Remarks: '',
            invmgrN_TotalAmount: 0,
            invmgrN_TotDiscount: 0,
            invmgrN_TotTaxAmt: 0,
            invmgrN_PurchaseValue: 0,
            GRNItem: [
                {
                    invtgrN_Id: 0,
                    invmgrN_Id: 0,
                    invmI_Id: 0,
                    invmuoM_Id: 0,
                    invtgrN_BatchNo: '',
                    invtgrN_Qty: 0,
                    invtgrN_PurchaseRate: 0,
                    invtgrN_MRP: 0,
                    invtgrN_DiscountAmt: 0,
                    invtgrN_SalesPrice: 0,
                    invtgrN_Amount: 0,
                    invtgrN_TaxAmt: 0,
                    GRNItemTax: []
                }
            ]
        }
    });

    const { control, handleSubmit, register, setValue, watch, reset, getValues, formState: { errors } } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'GRNItem'
    });

    const watchedItems = watch('GRNItem') || [];

    const calculateTotals = () => {
        const items = getValues('GRNItem') || [];
        let totalBasic = 0;
        let totalDiscount = 0;
        let totalTax = 0;

        if (items && Array.isArray(items)) {
            items.forEach((item) => {
                if (!item) return;
                totalBasic += Number(item.invtgrN_Amount) || 0;
                totalDiscount += Number(item.invtgrN_DiscountAmt) || 0;
                totalTax += Number(item.invtgrN_TaxAmt) || 0;
            });
        }

        totalBasic = round(totalBasic);
        totalDiscount = round(totalDiscount);
        totalTax = round(totalTax);

        setValue('invmgrN_TotalAmount', totalBasic);
        setValue('invmgrN_TotDiscount', totalDiscount);
        setValue('invmgrN_TotTaxAmt', totalTax);
        setValue('invmgrN_PurchaseValue', round(totalBasic - totalDiscount + totalTax));
    };

    // Calculate totals whenever items change (sync with internal state changes that might trigger re-renders)
    useEffect(() => {
        calculateTotals();
    }, [watchedItems]);

    const handleItemChange = async (index: number, itemId: number) => {
        const item = loadData?.data?.get_item?.find((i: any) => i.invmI_Id === itemId);
        if (item) {
            try {
                // Call both APIs concurrently
                const [itemRes, taxRes] = await Promise.all([
                    getItemDetail(item.invmI_Id),
                    getItemTaxDetail(item.invmI_Id)
                ]);

                if (itemRes.success && itemRes.data) {
                    const detail = itemRes.data.get_itemDetail?.[0];
                    if (detail) {
                        if (detail.invmuoM_UOMName) {
                            setValue(`GRNItem.${index}.invmuoM_UOMName`, detail.invmuoM_UOMName);
                        }
                    }
                    setValue(`GRNItem.${index}.invmuoM_Id`, item.invmuoM_Id);
                }

                // Use taxRes for tax details
                const taxes = (taxRes.success && taxRes.data) ? taxRes.data : [];

                if (taxes.length > 0) {
                    const mappedTaxes = taxes.map((t: any) => ({
                        invmT_Id: t.invmT_Id,
                        invtgrnT_TaxPer: t.invmiT_TaxValue,
                        invtgrnT_TaxAmt: 0
                    }));
                    setValue(`GRNItem.${index}.GRNItemTax`, mappedTaxes);
                    calculateTax(index, mappedTaxes);
                } else {
                    setValue(`GRNItem.${index}.GRNItemTax`, []);
                    calculateTax(index, []);
                }

            } catch (error) {
                console.error('Error fetching item details:', error);
            }
        }
    };

    const calculateItemAmount = (index: number) => {
        const qty = watch(`GRNItem.${index}.invtgrN_Qty`) || 0;
        const rate = watch(`GRNItem.${index}.invtgrN_PurchaseRate`) || 0;
        const basicAmt = round(qty * rate);
        setValue(`GRNItem.${index}.invtgrN_Amount`, basicAmt);
        calculateDiscount(index);
    };

    const calculateDiscount = (index: number) => {
        const basicAmt = watch(`GRNItem.${index}.invtgrN_Amount`) || 0;
        let discountAmt = watch(`GRNItem.${index}.invtgrN_DiscountAmt`) || 0;

        if (discountType === 'P') {
            const perc = watch(`GRNItem.${index}.invtgrN_DiscountAmt`) || 0;
            discountAmt = (basicAmt * perc) / 100;
        }

        discountAmt = round(discountAmt);
        setValue(`GRNItem.${index}.invtgrN_DiscountAmt`, discountAmt);
        calculateTax(index);
    };

    const calculateTax = (index: number, currentItemTaxes?: any[]) => {
        const basicAmt = watch(`GRNItem.${index}.invtgrN_Amount`) || 0;
        const discountAmt = watch(`GRNItem.${index}.invtgrN_DiscountAmt`) || 0;
        const taxableAmt = basicAmt - discountAmt;

        const itemTaxes = currentItemTaxes || watch(`GRNItem.${index}.GRNItemTax`) || [];
        let totalItemTax = 0;

        itemTaxes.forEach((tax: any, taxIdx: number) => {
            if (!tax) return;
            const taxAmt = round((taxableAmt * (tax.invtgrnT_TaxPer || 0)) / 100);
            setValue(`GRNItem.${index}.GRNItemTax.${taxIdx}.invtgrnT_TaxAmt`, taxAmt);
            totalItemTax += taxAmt;
        });

        setValue(`GRNItem.${index}.invtgrN_TaxAmt`, round(totalItemTax));
        calculateTotals();
    };

    const onSubmit = (data: InvTGRNSchema) => {
        saveMutation.mutate(data, {
            onSuccess: (res) => {
                if (res.success) {
                    reset();
                    onSuccess();
                }
            }
        });
    };

    const openTaxModal = (index: number) => {
        setSelectedTaxRowIndex(index);
        setIsTaxModalOpen(true);
    };

    const getCurrentRowTaxDetails = () => {
        if (selectedTaxRowIndex === null) return [];
        const updateTaxes = watch(`GRNItem.${selectedTaxRowIndex}.GRNItemTax`) || [];
        const basicAmt = watch(`GRNItem.${selectedTaxRowIndex}.invtgrN_Amount`) || 0;
        const discountAmt = watch(`GRNItem.${selectedTaxRowIndex}.invtgrN_DiscountAmt`) || 0;
        const taxableAmt = basicAmt - discountAmt;

        return updateTaxes.map(tax => {
            const taxMaster = loadData?.data?.get_tax?.find((t: any) => t.invmT_Id === tax.invmT_Id);
            return {
                name: taxMaster?.invmT_TaxName || 'Unknown Tax',
                percent: tax.invtgrnT_TaxPer,
                amount: (taxableAmt * tax.invtgrnT_TaxPer) / 100
            };
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 max-w-[1400px] mx-auto'>
            {/* Header Details */}
            <CollapsibleSection
                title="GRN Header Information"
                // icon={<ReceiptIndianRupee className="h-5 w-5 text-primary" />}
                defaultOpen={true}
                className="shadow-sm border-primary/10"
            >
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 p-1'>
                    <div className='space-y-2'>
                        <Label >Purchase Date</Label>
                        <Controller
                            name='invmgrN_PurchaseDate'
                            control={control}
                            render={({ field }) => (
                                <input
                                    type='date'
                                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200'
                                    value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                />
                            )}
                        />
                        {errors.invmgrN_PurchaseDate && <FormError>{errors.invmgrN_PurchaseDate.message}</FormError>}
                    </div>

                    <div className='space-y-2'>
                        <Label >Supplier</Label>
                        <Controller
                            name='invmS_Id'
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger className="transition-all duration-200">
                                        <SelectValue placeholder='Select Supplier' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadData?.data?.get_supplier.map((s: any) => (
                                            <SelectItem key={s.invmS_Id} value={s.invmS_Id.toString()}>
                                                {s.invmS_SupplierName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.invmS_Id && <FormError>{errors.invmS_Id.message}</FormError>}
                    </div>

                    <div className='space-y-2'>
                        <Label >Store</Label>
                        <Controller
                            name='invmsT_Id'
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger className="transition-all duration-200">
                                        <SelectValue placeholder='Select Store' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadData?.data?.get_Store.map((s: any) => (
                                            <SelectItem key={s.invmsT_Id} value={s.invmsT_Id.toString()}>
                                                {s.invmS_StoreName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.invmsT_Id && <FormError>{errors.invmsT_Id.message}</FormError>}
                    </div>

                    <InputText label='Invoice No' {...register('invmgrN_InvoiceNo')} placeholder='Enter Invoice Number' />
                    <InputText label='Order No (PO Ref)' {...register('invmgrN_POReference')} placeholder='Enter PO Reference' />
                    <InputText label='Bill Reference' {...register('invmgrN_EWayBillRef')} placeholder='Enter Bill Ref' />

                    <InputText label='Towards Projects' {...register('invmgrN_TowardsProjects')} placeholder='Enter Project Name' />
                    <InputText label='Challan No' {...register('invmgrN_ChallanNo')} placeholder='Enter Challan No' />
                    <InputText label='Challan Verified By' {...register('invmgrN_Challanverfied')} placeholder='Verified By' />

                    <div className='space-y-2'>
                        <Label>PO Date</Label>
                        <Controller
                            name='invmgrN_PODate'
                            control={control}
                            render={({ field }) => (
                                <input
                                    type='date'
                                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200'
                                    value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                />
                            )}
                        />
                    </div>

                    <InputText label='Prepared By' {...register('invmgrN_Prepared')} placeholder='Prepared By' />
                    <InputText label='Signed By' {...register('invmgrN_SignedBy')} placeholder='Signed By' />

                    <div className='space-y-2'>
                        <Label>Challan Date</Label>
                        <Controller
                            name='invmgrN_Challandate'
                            control={control}
                            render={({ field }) => (
                                <input
                                    type='date'
                                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200'
                                    value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                />
                            )}
                        />
                    </div>
                </div>
            </CollapsibleSection>

            {/* Items Collection */}
            <CollapsibleSection
                title="GRN Items Collection"

                defaultOpen={true}
                className="shadow-sm border-primary/10"

            >
                <div className='overflow-x-auto -mx-1 p-1'>
                    <table className='w-full border-collapse text-xs min-w-[1300px]'>
                        <thead>
                            <tr className='bg-muted/50 text-muted-foreground uppercase tracking-wider text-[10px]'>
                                <th className='border p-3 w-[40px] text-center'>#</th>
                                <th className='border p-3 min-w-[220px] text-left'>Item Name</th>
                                <th className='border p-3 w-[80px] text-center'>UOM</th>
                                <th className='border p-3 w-[140px] text-left'>Batch No</th>
                                <th className='border p-3 w-[80px] text-right'>Qty</th>
                                <th className='border p-3 w-[110px] text-right'>Rate (₹)</th>
                                <th className='border p-3 w-[100px] text-right'>MRP (₹)</th>
                                <th className='border p-3 w-[100px] text-right'>Sales (₹)</th>
                                <th className='border p-3 w-[110px] text-right'>Disc {discountType === 'P' ? '(%)' : ''}</th>
                                <th className='border p-3 w-[120px] text-right'>Basic Amt (₹)</th>
                                <th className='border p-3 w-[120px] text-right'>Tax Amt (₹)</th>
                                <th className='border p-3 w-[50px] text-center'></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {fields.map((field, index) => (
                                <tr key={field.id} className='hover:bg-primary/5 transition-colors duration-150'>
                                    <td className='border p-2 text-center font-mono text-muted-foreground'>{index + 1}</td>
                                    <td className='border p-2'>
                                        <Controller
                                            name={`GRNItem.${index}.invmI_Id`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={(val) => {
                                                    const id = Number(val);
                                                    field.onChange(id);
                                                    handleItemChange(index, id);
                                                }} value={field.value?.toString()}>
                                                    <SelectTrigger className='h-8 text-xs border-primary/20 hover:border-primary/40 focus:ring-primary/20'>
                                                        <SelectValue placeholder='Select Item' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadData?.data?.get_item.map((i: any) => (
                                                            <SelectItem key={i.invmI_Id} value={i.invmI_Id.toString()}>
                                                                {i.invmI_ItemName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.GRNItem?.[index]?.invmI_Id && <FormError className="text-[10px] mt-1">{errors.GRNItem[index]?.invmI_Id?.message}</FormError>}
                                    </td>
                                    <td className='border p-2'>
                                        <div className='h-8 flex items-center justify-center bg-muted/30 rounded text-[11px] font-semibold text-muted-foreground border border-dashed'>
                                            {watch(`GRNItem.${index}.invmuoM_UOMName`) || loadData?.data?.get_item.find((i: any) => i.invmI_Id === watch(`GRNItem.${index}.invmI_Id`))?.invmuoM_UOMName || '-'}
                                        </div>
                                    </td>
                                    <td className='border p-2'>
                                        <InputText {...register(`GRNItem.${index}.invtgrN_BatchNo`)} className='h-8 text-xs' />
                                    </td>
                                    <td className='border p-2'>
                                        <InputText
                                            {...register(`GRNItem.${index}.invtgrN_Qty`, {
                                                valueAsNumber: true,
                                                onChange: (e) => {
                                                    calculateItemAmount(index);
                                                }
                                            })}
                                            className='h-8 text-xs text-right font-mono'
                                        />
                                    </td>
                                    <td className='border p-2'>
                                        <InputText
                                            {...register(`GRNItem.${index}.invtgrN_PurchaseRate`, {
                                                valueAsNumber: true,
                                                onChange: (e) => {
                                                    calculateItemAmount(index);
                                                }
                                            })}
                                            className='h-8 text-xs text-right font-mono'
                                        />
                                    </td>
                                    <td className='border p-2'>
                                        <InputText {...register(`GRNItem.${index}.invtgrN_MRP`, { valueAsNumber: true })} className='h-8 text-xs text-right font-mono' />
                                    </td>
                                    <td className='border p-2'>
                                        <InputText {...register(`GRNItem.${index}.invtgrN_SalesPrice`, { valueAsNumber: true })} className='h-8 text-xs text-right font-mono' />
                                    </td>
                                    <td className='border p-2'>
                                        <InputText
                                            {...register(`GRNItem.${index}.invtgrN_DiscountAmt`, {
                                                valueAsNumber: true,
                                                onChange: (e) => {
                                                    calculateDiscount(index);
                                                }
                                            })}
                                            className='h-8 text-xs text-right font-mono focus:bg-primary/5 transition-all'
                                        />
                                    </td>
                                    <td className='border p-2 text-right font-mono bg-muted/10 text-xs font-semibold'>
                                        {watch(`GRNItem.${index}.invtgrN_Amount`)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                    </td>
                                    <td className='border p-2 bg-green-50/20'>
                                        <div
                                            className='flex items-center gap-1 justify-end font-mono text-green-700 text-xs font-semibold cursor-pointer hover:bg-green-100/50 p-1 rounded transition-colors'
                                            onClick={() => openTaxModal(index)}
                                            title="Click to view Tax Details"
                                        >
                                            <span>{watch(`GRNItem.${index}.invtgrN_TaxAmt`)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
                                            <Calculator className='h-3 w-3 text-green-600' />
                                        </div>
                                    </td>
                                    <td className='border p-2 text-center'>
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='icon'
                                            className='h-7 w-7 text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors'
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1}
                                        >
                                            <Minus className='h-3.5 w-3.5' />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='mt-4 flex justify-start'>
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => append({
                                invtgrN_Id: 0,
                                invmgrN_Id: 0,
                                invmI_Id: 0,
                                invmuoM_Id: 0,
                                invtgrN_BatchNo: '',
                                invtgrN_Qty: 0,
                                invtgrN_PurchaseRate: 0,
                                invtgrN_MRP: 0,
                                invtgrN_DiscountAmt: 0,
                                invtgrN_SalesPrice: 0,
                                invtgrN_Amount: 0,
                                invtgrN_TaxAmt: 0,
                                GRNItemTax: []
                            })}
                            className='h-8 text-[11px] font-bold tracking-tight border-primary/20 text-primary hover:bg-primary/5 transition-all shadow-sm'
                        >
                            <Plus className='mr-2 h-3 w-3' /> ADD ROW
                        </Button>
                    </div>
                </div>
            </CollapsibleSection>

            {/* Tax Details Modal */}
            <Dialog open={isTaxModalOpen} onOpenChange={setIsTaxModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-primary">
                            <ReceiptIndianRupee className="h-5 w-5" />
                            Tax Breakdown
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        {selectedTaxRowIndex !== null && (
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-medium border-b pb-2">
                                    <span>Tax Name</span>
                                    <div className="flex gap-8">
                                        <span>Rate (%)</span>
                                        <span className="w-20 text-right">Amount</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {getCurrentRowTaxDetails().length > 0 ? (
                                        getCurrentRowTaxDetails().map((tax, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">{tax.name}</span>
                                                <div className="flex gap-8">
                                                    <span className="font-mono text-xs">{tax.percent}%</span>
                                                    <span className="w-20 text-right font-mono font-medium">₹{tax.amount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-muted-foreground text-sm py-2">No taxes active for this item</div>
                                    )}
                                </div>
                                <div className="flex justify-between text-sm font-bold border-t pt-3 mt-2">
                                    <span>Total Tax</span>
                                    <span className="font-mono text-green-600">
                                        ₹{getCurrentRowTaxDetails().reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Footer and Totals */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <div className='lg:col-span-2'>
                    <CollapsibleSection
                        title="Additional Information"

                        defaultOpen={true}
                        className="h-full shadow-sm border-primary/10"
                    >
                        <div className='p-1'>
                            <InputTextarea
                                label='Remarks / Narration'
                                {...register('invmgrN_Remarks')}
                                rows={6}
                                className='resize-none rounded-lg border-primary/10 focus:border-primary/30 transition-all text-xs'
                                placeholder='Enter any additional notes here...'
                            />
                        </div>
                    </CollapsibleSection>
                </div>

                <div className='lg:col-span-1'>
                    <Card className='p-6 shadow-md border-primary/20 bg-primary/5 space-y-4 relative overflow-hidden'>
                        <div className="absolute top-0 right-0 p-8 bg-primary/5 rounded-bl-full -mr-8 -mt-8 opacity-20 pointer-events-none" />

                        <h3 className='text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2'>
                            <ReceiptIndianRupee className="h-4 w-4" /> Final Summary
                        </h3>

                        <div className='space-y-3 pt-2 font-medium'>
                            <div className='flex justify-between items-center text-sm'>
                                <span className='text-muted-foreground'>Total Basic Amount:</span>
                                <span className='font-mono'>₹{watch('invmgrN_TotalAmount')?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className='flex justify-between items-center text-sm text-destructive'>
                                <span className='flex items-center gap-1.5'>
                                    Total Discount:
                                </span>
                                <span className='font-mono'>- ₹{watch('invmgrN_TotDiscount')?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className='flex justify-between items-center text-sm text-green-700'>
                                <span className='flex items-center gap-1.5'>
                                    Total Tax Amount:
                                </span>
                                <span className='font-mono'>+ ₹{watch('invmgrN_TotTaxAmt')?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>

                            <div className='pt-4 mt-2 border-t border-primary/20'>
                                <div className='flex justify-between items-end'>
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] font-bold uppercase tracking-widest text-primary/70'>Net Purchase Value</span>
                                        <span className='font-extrabold text-3xl tracking-tighter text-primary'>
                                            ₹{watch('invmgrN_PurchaseValue')?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className='flex flex-col sm:flex-row gap-3 mt-6'>
                        <Button type='submit' className='flex-1 py-6 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]' isLoading={saveMutation.isPending}>
                            <Save className='mr-2 h-5 w-5' /> Save GRN
                        </Button>
                        <Button type='button' variant='outline' className='px-6 py-6 border-primary/20 text-primary hover:bg-primary/5 transition-all duration-300' onClick={() => reset()}>
                            <RotateCcw className='h-5 w-5' />
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}

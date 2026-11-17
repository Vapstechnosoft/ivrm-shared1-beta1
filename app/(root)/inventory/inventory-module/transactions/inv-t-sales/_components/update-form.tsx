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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    invTSalesSchema,
    type InvTSalesSchema
} from '@/schemas/inventory/transactions/inv-t-sales';
import { useInvTSales } from '@/hooks/inventory/transactions/use-inv-t-sales';
import { Plus, Minus, Save, RotateCcw, Calculator, Package, ReceiptIndianRupee, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Card } from '@/components/ui/card';
// import { MultiSelect } from '@/components/ui/extension/multi-select';

import { IInvTSales } from '@/types/inventory/transactions/inv-t-sales';
import { getInvTSalesItemDetails } from '@/server/inventory/transactions/inv-t-sales';

interface UpdateSalesFormProps {
    onSuccess: () => void;
    selectedRow: IInvTSales;
}

export default function UpdateSalesForm({ onSuccess, selectedRow }: UpdateSalesFormProps) {
    const {
        data: loadData,
        saveMutation,
        studentClsSecMutation,
        studentListMutation,
        sectionListMutation,
        itemOnStoreChangeMutation,
        itemDetailMutation,
        getEmployeesMutation,
        getCustomersMutation,
        getStoresMutation
    } = useInvTSales();
    const [discountType, setDiscountType] = useState<'A' | 'P'>('A');

    // Tax Modal State
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
    const [selectedTaxRowIndex, setSelectedTaxRowIndex] = useState<number | null>(null);

    // Local state for dynamic lists
    const [studentClsSec, setStudentClsSec] = useState<any[]>([]);
    const [studentList, setStudentList] = useState<any[]>([]);
    const [sectionList, setSectionList] = useState<any[]>([]);
    const [itemsList, setItemsList] = useState<any[]>([]);
    const [employeeList, setEmployeeList] = useState<any[]>([]);
    const [customerList, setCustomerList] = useState<any[]>([]);
    const [storeList, setStoreList] = useState<any[]>([]);

    const form = useForm<InvTSalesSchema>({
        resolver: zodResolver(invTSalesSchema),
        defaultValues: {
            invmsL_SalesDate: new Date(),
            invmsL_StuOtherFlg: 'Student',
            stu_Flag: 'I',
            invmsL_Remarks: '',
            invmsL_TotalAmount: 0,
            invmsL_TotDiscount: 0,
            invmsL_TotTaxAmt: 0,
            invmsL_SalesValue: 0,
            SaleItem: [
                {
                    invmI_Id: 0,
                    invtsL_SalesQty: 0,
                    invtsL_SalesPrice: 0,
                    invtsL_DiscountAmt: 0,
                    invtsL_TaxAmt: 0,
                    invtsL_Amount: 0,
                }
            ]
        }
    });

    const { control, handleSubmit, register, setValue, watch, reset, formState: { errors } } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'SaleItem'
    });

    const watchedItems = watch('SaleItem');
    const watchedType = watch('invmsL_StuOtherFlg');
    const watchedStuFlag = watch('stu_Flag');
    const watchedClassId = watch('asmcL_Id');
    const watchedSectionId = watch('asmS_Id');
    const watchedStoreId = watch('invmsT_Id');
    const watchedStudentId = watch('amsT_Id');

    // Fetch Student Class/Section
    useEffect(() => {
        if (watchedType === 'Student' && watchedStuFlag && (watchedStuFlag === 'I' || watchedStuFlag === 'C' || watchedStuFlag === 'CS')) {
            studentClsSecMutation.mutate(watchedStuFlag, {
                onSuccess: (res) => {
                    const data = Array.isArray(res?.data) ? res.data : (res?.data?.get_Student_Cls_Sec || []);
                    setStudentClsSec(data);
                }
            });
        }
    }, [watchedStuFlag, watchedType]);

    // Fetch Student List on Class Change
    useEffect(() => {
        if (watchedType === 'Student' && watchedClassId) {
            const data = { ASMCL_Id: watchedClassId, type: watchedStuFlag };
            if (watchedStuFlag === 'C' || watchedStuFlag === 'CS') {
                if (watchedStuFlag === 'C') {
                    studentListMutation.mutate(data, {
                        onSuccess: (res) => {
                            const list = Array.isArray(res?.data) ? res.data : (res?.data?.get_Studentlist || res?.data?.studentList || []);
                            setStudentList(list);
                        }
                    });
                }
                if (watchedStuFlag === 'CS') {
                    sectionListMutation.mutate(data, {
                        onSuccess: (res) => {
                            const data = Array.isArray(res?.data) ? res.data : (res?.data?.get_sectionlist || []);
                            setSectionList(data);
                        }
                    });
                }
            }
        }
    }, [watchedType, watchedStuFlag, watchedClassId]);

    // Fetch Student List on Section Change
    useEffect(() => {
        if (watchedType === 'Student' && watchedStuFlag === 'CS' && watchedClassId && watchedSectionId) {
            const data = { ASMCL_Id: watchedClassId, ASMS_Id: watchedSectionId, type: watchedStuFlag };
            studentListMutation.mutate(data, {
                onSuccess: (res) => {
                    const list = Array.isArray(res?.data) ? res.data : (res?.data?.get_Studentlist || res?.data?.studentList || []);
                    setStudentList(list);
                }
            });
        }
    }, [watchedType, watchedStuFlag, watchedClassId, watchedSectionId]);



    // Fetch Stores on Mount
    // Load details on mount
    useEffect(() => {
        getStoresMutation.mutate(undefined, {
            onSuccess: (res) => {
                if (res?.data) {
                    setStoreList(res.data);

                    // If we have selectedRow, populate form
                    if (selectedRow?.invmsL_Id) {
                        const saleType = selectedRow.invmsL_StuOtherFlg === 'Student' ? 'Student' :
                            selectedRow.invmsL_StuOtherFlg === 'Staff' ? 'Staff' : 'Customer';

                        form.setValue('invmsL_Id', selectedRow.invmsL_Id);
                        form.setValue('invmsL_SalesNo', selectedRow.invmsL_SalesNo);
                        form.setValue('invmsL_SalesDate', selectedRow.invmsL_SalesDate ? new Date(selectedRow.invmsL_SalesDate) : new Date());
                        form.setValue('invmsL_StuOtherFlg', saleType as any);

                        // Note: We might need to manually trigger dropdown fetches if not purely reactive to setValue
                        // But useStates are separate. 
                        // For simplicity, we assume we fetch items after store is set.

                        form.setValue('invmsL_Remarks', selectedRow.invmsL_Remarks || '');
                        form.setValue('invmsT_Id', selectedRow.invmsT_Id);
                        form.setValue('invmsL_TotalAmount', selectedRow.invmsL_TotalAmount);
                        form.setValue('invmsL_TotDiscount', selectedRow.invmsL_TotDiscount);
                        form.setValue('invmsL_TotTaxAmt', selectedRow.invmsL_TotTaxAmt);
                        form.setValue('invmsL_SalesValue', selectedRow.invmsL_TotalAmount - selectedRow.invmsL_TotDiscount + selectedRow.invmsL_TotTaxAmt);

                        // Fetch items
                        getInvTSalesItemDetails(selectedRow.invmsL_Id, saleType).then(res => {
                            if (res?.data && Array.isArray(res.data)) {
                                // Map items to form
                                const mappedItems = res.data.map((item: any) => ({
                                    invtsL_Id: item.invtsL_Id,
                                    invmI_Id: item.invmI_Id,
                                    invmuoM_Id: item.invmuoM_Id,
                                    invstO_BatchNo: item.invstO_BatchNo,
                                    invstO_SalesRate: item.invstO_SalesRate,
                                    invtsL_SalesQty: item.invtsL_SalesQty,
                                    invtsL_Amount: item.invtsL_Amount,
                                    invtsL_DiscountAmt: item.invtsL_DiscountAmt,
                                    invtsL_TaxAmt: item.invtsL_TaxAmt,
                                    invtsL_SalesPrice: item.invtsL_SalesQty > 0 ? (item.invtsL_Amount / item.invtsL_SalesQty) : 0
                                }));
                                form.setValue('SaleItem', mappedItems);
                            }
                        });
                    }
                }
            }
        });
    }, [selectedRow]);

    // Fetch Items when Store changes
    useEffect(() => {
        if (watchedStoreId) {
            const payload = {
                INVMST_Id: watchedStoreId,
                AMST_Id: watchedStudentId || 0,
                INVC_LIFOFIFOFlg: 'LIFO'
            };
            itemOnStoreChangeMutation.mutate(payload, {
                onSuccess: (res) => {
                    const rawItems = Array.isArray(res.data) ? res.data : (res?.data?.get_item || []);
                    // Normalize keys
                    const normalizedItems = rawItems.map((item: any) => ({
                        invmI_Id: item.invmi_Id ?? item.invmI_Id,
                        invmI_ItemName: item.invmi_ItemName ?? item.invmI_ItemName,
                        invstO_SalesRate: item.invsto_SalesRate ?? item.invstO_SalesRate,
                        invstO_BatchNo: item.invsto_BatchNo ?? item.invstO_BatchNo,
                        invstO_AvaiableStock: item.invsto_AvaiableStock ?? item.invstO_AvaiableStock ?? 0
                    }));
                    setItemsList(normalizedItems);
                }
            });
        }
    }, [watchedStoreId]);

    // Fetch Employees when Type is Staff
    useEffect(() => {
        if (watchedType === 'Staff') {
            getEmployeesMutation.mutate(undefined, {
                onSuccess: (res) => {
                    // Response stricture: { success: true, message: ..., data: [...] }
                    if (res?.data) {
                        setEmployeeList(res.data);
                    }
                }
            });
        }
    }, [watchedType]);

    // Fetch Customers when Type is Customer
    useEffect(() => {
        if (watchedType === 'Customer') {
            getCustomersMutation.mutate(undefined, {
                onSuccess: (res) => {
                    if (res?.data) {
                        setCustomerList(res.data);
                    }
                }
            });
        }
    }, [watchedType]);

    // Fetch Student/Class/Sec when type or flag changes
    useEffect(() => {
        if (watchedType === 'Student' && watchedStuFlag) {
            studentClsSecMutation.mutate(watchedStuFlag, {
                onSuccess: (res) => {
                    // Check for flat data array or nested property
                    const data = Array.isArray(res?.data) ? res.data : (res?.data?.get_Student_Cls_Sec || []);
                    setStudentClsSec(data);
                }
            });
        }
    }, [watchedType, watchedStuFlag]);

    // Fetch Student List on Class Change (for I or C)
    useEffect(() => {
        if (watchedType === 'Student' && watchedClassId) {
            const data = {
                ASMCL_Id: watchedClassId,
                type: watchedStuFlag
            };
            // If C or CS logic differs, adjust here.
            // Angular: if C -> just ASMCL_Id. if CS -> ASMCL_Id and ASMS_Id
            if (watchedStuFlag === 'C' || watchedStuFlag === 'CS') {
                // If it's just 'C', maybe we fetch students directly? The original code did so.
                // But for 'CS', we definitely need sections first.
                // Re-using the logic: if we have Class, we can fetch sections (if needed) and students (if 'C').

                if (watchedStuFlag === 'C') {
                    studentListMutation.mutate(data, {
                        onSuccess: (res) => {
                            const list = Array.isArray(res?.data) ? res.data : (res?.data?.get_Studentlist || res?.data?.studentList || []);
                            setStudentList(list);
                        }
                    });
                }

                // Fetch sections for both C (if implied?) or definitely for CS
                if (watchedStuFlag === 'CS') {
                    sectionListMutation.mutate(data, {
                        onSuccess: (res) => {
                            // Check for flat data array or nested property
                            const data = Array.isArray(res?.data) ? res.data : (res?.data?.get_sectionlist || []);
                            setSectionList(data);
                        }
                    });
                }
            }
        }
    }, [watchedType, watchedStuFlag, watchedClassId]);

    // Fetch Student List on Section Change (for CS)
    useEffect(() => {
        if (watchedType === 'Student' && watchedStuFlag === 'CS' && watchedClassId && watchedSectionId) {
            const data = {
                ASMCL_Id: watchedClassId,
                ASMS_Id: watchedSectionId,
                type: watchedStuFlag
            };
            studentListMutation.mutate(data, {
                onSuccess: (res) => {
                    const list = Array.isArray(res?.data) ? res.data : (res?.data?.get_Studentlist || res?.data?.studentList || []);
                    setStudentList(list);
                }
            });
        }
    }, [watchedType, watchedStuFlag, watchedClassId, watchedSectionId]);


    // Calculate totals whenever items change
    useEffect(() => {
        calculateTotals();
    }, [watchedItems]);

    const calculateTotals = () => {
        let totalBasic = 0;
        let totalDiscount = 0;
        let totalTax = 0;

        const items = form.getValues('SaleItem') || [];
        items.forEach((item) => {
            totalBasic += Number(item.invtsL_Amount) || 0;
            totalDiscount += Number(item.invtsL_DiscountAmt) || 0;
            totalTax += Number(item.invtsL_TaxAmt) || 0;
        });

        setValue('invmsL_TotalAmount', totalBasic);
        setValue('invmsL_TotDiscount', totalDiscount);
        setValue('invmsL_TotTaxAmt', totalTax);
        setValue('invmsL_SalesValue', totalBasic - totalDiscount + totalTax);
    };

    const handleItemChange = async (index: number, itemId: number) => {
        const item = itemsList.find((i: any) => i.invmI_Id === itemId);
        if (item) {
            const storeId = watch('invmsT_Id');
            const payload = {
                INVMI_Id: item.invmI_Id,
                INVSTO_SalesRate: item.invstO_SalesRate,
                INVMST_Id: storeId,
                INVSTO_BatchNo: item.invstO_BatchNo
            };

            itemDetailMutation.mutate(payload, {
                onSuccess: (res) => {
                    if (res?.data) {
                        // Access nested DTO arrays
                        const detailList = res.data.get_itemDetail || res.data.get_ItemDetail || [];
                        const taxList = res.data.get_itemTax || res.data.get_ItemTax || res.data.get_item_tax || [];
                        const stockList = res.data.availablestock || res.data.availableStock || res.data.get_availablestock || [];

                        const detail = detailList[0];
                        const stockObj = stockList[0];
                        const availableStockVal = stockObj?.AvaiableStock ?? stockObj?.avaiableStock ?? stockObj?.AvailableStock ?? stockObj?.availableStock ?? stockObj?.INVSTO_AvaiableStock ?? stockObj?.invsto_AvaiableStock ?? 0;

                        if (detail) {
                            // Bind Item Details
                            setValue(`SaleItem.${index}.invmuoM_Id`, detail.INVMUOM_Id ?? detail.invmuoM_Id ?? detail.invmuom_Id);
                            setValue(`SaleItem.${index}.invtsL_BatchNo`, detail.INVSTO_BatchNo ?? detail.invstO_BatchNo ?? detail.invsto_BatchNo);
                            setValue(`SaleItem.${index}.invtsL_SalesPrice`, detail.INVSTO_SalesRate ?? detail.invstO_SalesRate ?? detail.invsto_SalesRate ?? 0);
                        }

                        // Bind Taxes
                        if (taxList.length > 0) {
                            const mappedTaxes = taxList.map((t: any) => ({
                                invmT_Id: t.INVMT_Id ?? t.invmT_Id ?? t.invmt_Id,
                                invmT_TaxName: t.INVMT_TaxName ?? t.invmT_TaxName ?? t.invmt_TaxName ?? '',
                                invtslT_TaxPer: t.INVMIT_TaxValue ?? t.invmiT_TaxValue ?? t.invmit_TaxValue ?? 0,
                                invtslT_TaxAmt: 0 // Will be calculated
                            }));
                            setValue(`SaleItem.${index}.SalesItemTax`, mappedTaxes);
                        } else {
                            setValue(`SaleItem.${index}.SalesItemTax`, []);
                        }

                        // Set Stock & Recalculate
                        setValue(`SaleItem.${index}.availableStock`, availableStockVal);

                        calculateItemAmount(index);
                    }
                }
            });
        }
    };

    const calculateItemAmount = (index: number) => {
        const qty = form.getValues(`SaleItem.${index}.invtsL_SalesQty`) || 0;
        const rate = form.getValues(`SaleItem.${index}.invtsL_SalesPrice`) || 0;
        const availableStock = form.getValues(`SaleItem.${index}.availableStock` as any) || 0;

        if (qty > availableStock) {
            form.setError(`SaleItem.${index}.invtsL_SalesQty`, { message: `Max stock: ${availableStock}` });
        } else {
            form.clearErrors(`SaleItem.${index}.invtsL_SalesQty`);
        }

        const basicAmt = qty * rate;
        setValue(`SaleItem.${index}.invtsL_Amount`, basicAmt);
        calculateDiscount(index);
    };

    const calculateDiscount = (index: number) => {
        const basicAmt = form.getValues(`SaleItem.${index}.invtsL_Amount`) || 0;
        let discountAmt = form.getValues(`SaleItem.${index}.invtsL_DiscountAmt`) || 0;

        if (discountType === 'P') {
            // If input is percentage
            // const perc = discountAmt;
        }

        if (discountAmt > basicAmt) {
            setValue(`SaleItem.${index}.invtsL_DiscountAmt`, 0);
            discountAmt = 0;
        }

        calculateTax(index);
    };

    const calculateTax = (index: number) => {
        const basicAmt = form.getValues(`SaleItem.${index}.invtsL_Amount`) || 0;
        const discountAmt = form.getValues(`SaleItem.${index}.invtsL_DiscountAmt`) || 0;
        const taxableAmt = basicAmt - discountAmt;

        const itemTaxes = form.getValues(`SaleItem.${index}.SalesItemTax`) || [];
        let totalItemTax = 0;

        if (itemTaxes.length > 0) {
            const updatedTaxes = itemTaxes.map((tax: any) => {
                const taxVal = (taxableAmt * (tax.invtslT_TaxPer || 0)) / 100;
                totalItemTax += taxVal;
                return { ...tax, invtslT_TaxAmt: taxVal };
            });
            setValue(`SaleItem.${index}.SalesItemTax`, updatedTaxes);
        }

        setValue(`SaleItem.${index}.invtsL_TaxAmt`, totalItemTax);
        calculateTotals();
    };

    const onSubmit = (data: InvTSalesSchema) => {
        saveMutation.mutate(data, {
            onSuccess: (res) => {
                if (res.success) {
                    reset();
                    onSuccess();
                }
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 max-w-[1400px] mx-auto'>
            {/* Header Details */}
            <CollapsibleSection
                title="Sales Header Information"

                defaultOpen={true}
                className="shadow-sm border-primary/10"
            >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-1'>
                    <div className='bg-muted/30 p-4 rounded-lg space-y-4'>
                        <label className="text-sm font-medium">Customer Type</label>
                        <Controller
                            name="invmsL_StuOtherFlg"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Student" id="r1" />
                                        <Label htmlFor="r1">Student</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Staff" id="r2" />
                                        <Label htmlFor="r2">Staff</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Customer" id="r3" />
                                        <Label htmlFor="r3">Customer</Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                    </div>

                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label >Sale Date</Label>
                            <Controller
                                name='invmsL_SalesDate'
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type='date'
                                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                                        value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                                        onChange={(e) => field.onChange(new Date(e.target.value))}
                                    />
                                )}
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label >Store</Label>
                            <Controller
                                name='invmsT_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                        <SelectTrigger><SelectValue placeholder='Select Store' /></SelectTrigger>
                                        <SelectContent>
                                            {storeList.map((s: any, index: number) => (
                                                <SelectItem key={`store-${s.invmsT_Id}-${index}`} value={s.invmsT_Id.toString()}>{s.invmS_StoreName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {watchedType === 'Student' && (
                    <div className='mt-4 p-4 border rounded-md bg-secondary/10'>
                        <Controller
                            name="stu_Flag"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 mb-4">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="I" id="s1" /><Label htmlFor="s1">Individual</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="C" id="s2" /><Label htmlFor="s2">Class</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="CS" id="s3" /><Label htmlFor="s3">Class & Section</Label></div>
                                </RadioGroup>
                            )}
                        />

                        {/* Individual Student Selection */}
                        {watchedStuFlag === 'I' && (
                            <div className='space-y-2'>
                                <Label >Student Name</Label>
                                {/* This should ideally be a combobox/autocomplete */}
                                {/* Mocking generic select for now */}
                                <Controller
                                    name='amsT_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={(val) => {
                                            field.onChange(Number(val));
                                            const selectedStudent = studentClsSec.find((s: any) => (s.amsT_Id || s.AMST_Id) == val);
                                            if (selectedStudent) {
                                                setValue('asmcL_Id', selectedStudent.asmcL_Id || selectedStudent.ASMCL_Id);
                                                setValue('asmS_Id', selectedStudent.asmS_Id || selectedStudent.ASMS_Id);
                                            }
                                        }} value={field.value?.toString()}>
                                            <SelectTrigger><SelectValue placeholder='Select Student' /></SelectTrigger>
                                            <SelectContent>
                                                {studentClsSec.map((s: any, index: number) => (
                                                    <SelectItem key={`stu-ind-${s.amsT_Id}-${index}`} value={s.amsT_Id.toString()}>{s.studentname}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        )}

                        {/* Class / Section Selection */}
                        {(watchedStuFlag === 'C' || watchedStuFlag === 'CS') && (
                            <div className='space-y-4'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-2'>
                                        <Label >Class</Label>
                                        <Controller
                                            name='asmcL_Id'
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                                    <SelectTrigger><SelectValue placeholder='Select Class' /></SelectTrigger>
                                                    <SelectContent>
                                                        {studentClsSec.map((s: any, index: number) => {
                                                            const id = s.asmcL_Id || s.ASMCL_Id;
                                                            const name = s.asmcL_ClassName || s.ASMCL_ClassName;
                                                            if (!id) return null;
                                                            return (
                                                                <SelectItem key={`cls-${id}-${index}`} value={id.toString()}>{name}</SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                    {watchedStuFlag === 'CS' && (
                                        <div className='space-y-2'>
                                            <Label >Section</Label>
                                            <Controller
                                                name='asmS_Id'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                                        <SelectTrigger><SelectValue placeholder='Select Section' /></SelectTrigger>
                                                        <SelectContent>
                                                            {sectionList.map((s: any, index: number) => (
                                                                <SelectItem key={`sec-${s.asmS_Id}-${index}`} value={s.asmS_Id.toString()}>{s.asmC_SectionName}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    )}
                                    {/* Ensure asmS_Id is registered/submitted for 'C' flag even if hidden */}
                                    {watchedStuFlag === 'C' && (
                                        <Controller
                                            name='asmS_Id'
                                            control={control}
                                            render={({ field }) => (
                                                <input type="hidden" {...field} value={field.value || ''} />
                                            )}
                                        />
                                    )}
                                </div>

                                {/* Student Dropdown for Class/Section selection */}
                                {((watchedStuFlag === 'C' && watchedClassId) || (watchedStuFlag === 'CS' && watchedSectionId)) && (
                                    <div className='space-y-2 animate-in fade-in slide-in-from-top-2 duration-300'>
                                        <Label>Student Name</Label>
                                        <Controller
                                            name='amsT_Id'
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={(val) => {
                                                    field.onChange(Number(val));
                                                    const selectedStudent = studentList.find((s: any) => (s.amst_id || s.amsT_Id || s.AMST_Id) == val);
                                                    if (selectedStudent) {
                                                        if (watchedStuFlag === 'C') {
                                                            const secId = selectedStudent.asmS_Id ?? selectedStudent.ASMS_Id ?? selectedStudent.asms_Id ?? selectedStudent.ASMCL_Id_Section ?? 0;
                                                            setValue('asmS_Id', secId);
                                                        }
                                                    }
                                                }} value={field.value?.toString()}>
                                                    <SelectTrigger><SelectValue placeholder='Select Student' /></SelectTrigger>
                                                    <SelectContent>
                                                        {studentList.map((s: any, index: number) => {
                                                            const id = s.amst_id || s.amsT_Id || s.AMST_Id;
                                                            const name = s.studentname || s.studentName || s.ameS_StudentName;
                                                            if (!id) return null;
                                                            return (
                                                                <SelectItem key={`stuname-${id}-${index}`} value={id.toString()}>{name}</SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {watchedType === 'Staff' && (
                    <div className='mt-4 p-4 border rounded-md'>
                        <Label >Staff</Label>
                        <Controller
                            name='hrmE_Id'
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger><SelectValue placeholder='Select Staff' /></SelectTrigger>
                                    <SelectContent>
                                        {employeeList.map((s: any, index: number) => (
                                            <SelectItem key={`${s.hrmE_Id}-${index}`} value={s.hrmE_Id.toString()}>{s.employeename}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                )}

                {watchedType === 'Customer' && (
                    <div className='mt-4 p-4 border rounded-md'>
                        <Label >Customer</Label>
                        <Controller
                            name='invmC_Id'
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger><SelectValue placeholder='Select Customer' /></SelectTrigger>
                                    <SelectContent>
                                        {customerList.map((s: any, index: number) => (
                                            <SelectItem key={`${s.invmC_Id}-${index}`} value={s.invmC_Id?.toString() || ''}>{s.invmC_CustomerName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                )}
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
                        {selectedTaxRowIndex !== null && (() => {
                            const currentTaxList = watch(`SaleItem.${selectedTaxRowIndex}.SalesItemTax`) || [];
                            const totalRowTax = watch(`SaleItem.${selectedTaxRowIndex}.invtsL_TaxAmt`) || 0;
                            return (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm font-medium border-b pb-2">
                                        <span>Tax Name</span>
                                        <div className="flex gap-8">
                                            <span>Rate (%)</span>
                                            <span className="w-20 text-right">Amount</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {currentTaxList.length > 0 ? (
                                            currentTaxList.map((tax: any, i: number) => {
                                                // We need to fetch tax name from loadData if possible, but tax list in loadData might not be available or comprehensive.
                                                // Actually get_itemDetail returns tax list with names usually. 
                                                // But here we stored only IDs. 
                                                // Ideally we should have stored tax Name too in `SalesItemTax`.
                                                // For now, we just display percentages.
                                                return (
                                                    <div key={i} className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">{tax.invmT_TaxName || tax.invmT_Id}</span>
                                                        <div className="flex gap-8">
                                                            <span className="font-mono text-xs">{tax.invtslT_TaxPer}%</span>
                                                            <span className="w-20 text-right font-mono font-medium">₹{tax.invtslT_TaxAmt?.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div className="text-center text-muted-foreground text-sm py-2">No taxes active for this item</div>
                                        )}
                                    </div>
                                    <div className="flex justify-between text-sm font-bold border-t pt-3 mt-2">
                                        <span>Total Tax</span>
                                        <span className="font-mono text-green-600">
                                            ₹{totalRowTax.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )
                        })()}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Items Collection */}
            <CollapsibleSection
                title="Sales Items"

                defaultOpen={true}
                className="shadow-sm border-primary/10"
            >
                <div className='overflow-x-auto -mx-1 p-1'>
                    <table className='w-full border-collapse text-xs min-w-[1000px]'>
                        <thead>
                            <tr className='bg-muted/50 text-muted-foreground uppercase tracking-wider text-[10px]'>
                                <th className='border p-3 w-[40px] text-center'>#</th>
                                <th className='border p-3 min-w-[200px] text-left'>Item Name</th>
                                <th className='border p-3 w-[100px] text-left'>Batch No</th>
                                <th className='border p-3 w-[80px] text-right'>Qty</th>
                                <th className='border p-3 w-[100px] text-right'>Rate</th>
                                <th className='border p-3 w-[100px] text-right'>Discount</th>
                                <th className='border p-3 w-[120px] text-right'>Amount</th>
                                <th className='border p-3 w-[50px] text-center'></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {fields.map((field, index) => (
                                <tr key={field.id} className='hover:bg-primary/5'>
                                    <td className='border p-2 text-center'>{index + 1}</td>
                                    <td className='border p-2'>
                                        <Controller
                                            name={`SaleItem.${index}.invmI_Id`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={(val) => {
                                                    const id = Number(val);
                                                    field.onChange(id);
                                                    handleItemChange(index, id);
                                                }} value={field.value?.toString()}>
                                                    <SelectTrigger><SelectValue placeholder='Select Item' /></SelectTrigger>
                                                    <SelectContent>
                                                        {itemsList.map((i: any, index: number) => (
                                                            <SelectItem key={`item-${i.invmI_Id}-${index}`} value={i.invmI_Id.toString()}>
                                                                {i.invmI_ItemName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </td>
                                    <td className='border p-2'>
                                        <InputText {...register(`SaleItem.${index}.invtsL_BatchNo`)} className='h-8 text-xs' disabled />
                                    </td>
                                    <td className='border p-2'>
                                        <InputText {...register(`SaleItem.${index}.invtsL_SalesQty`, { valueAsNumber: true })} className='h-8 text-xs text-right' onBlur={() => calculateItemAmount(index)} />
                                    </td>
                                    <td className='border p-2'>
                                        <InputText {...register(`SaleItem.${index}.invtsL_SalesPrice`, { valueAsNumber: true })} className='h-8 text-xs text-right' disabled />
                                    </td>
                                    <td className='border p-2'>
                                        <InputText {...register(`SaleItem.${index}.invtsL_DiscountAmt`, { valueAsNumber: true })} className='h-8 text-xs text-right' onBlur={() => calculateDiscount(index)} />
                                    </td>
                                    <td className='border p-2'>
                                        <InputText {...register(`SaleItem.${index}.invtsL_Amount`, { valueAsNumber: true })} className='h-8 text-xs text-right' onBlur={() => calculateDiscount(index)} />
                                    </td>
                                    <td className='border p-2 text-center'>
                                        <div
                                            className='flex items-center gap-1 justify-end font-mono text-green-700 text-xs font-semibold cursor-pointer hover:bg-green-100/50 p-1 rounded transition-colors'
                                            onClick={() => {
                                                setSelectedTaxRowIndex(index);
                                                setIsTaxModalOpen(true);
                                            }}
                                            title="Click to view Tax Details"
                                        >
                                            <span>{watch(`SaleItem.${index}.invtsL_TaxAmt`)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
                                            <Calculator className='h-3 w-3 text-green-600' />
                                        </div>
                                    </td>
                                    <td className='border p-2 text-center'>
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='icon'
                                            className='h-7 w-7 text-destructive/60 hover:text-destructive'
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
                                invmI_Id: 0,
                                invtsL_SalesQty: 0,
                                invtsL_SalesPrice: 0,
                                invtsL_DiscountAmt: 0,
                                invtsL_TaxAmt: 0,
                                invtsL_Amount: 0,
                            })}
                            className='h-8 text-[11px] font-bold'
                        >
                            <Plus className='mr-2 h-3 w-3' /> ADD ROW
                        </Button>
                    </div>
                </div>
            </CollapsibleSection>

            {/* Footer and Totals */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <div className='lg:col-span-2'>
                    <CollapsibleSection
                        title="Remarks"
                        defaultOpen={true}
                    >
                        <InputTextarea
                            label='Remarks / Narration'
                            {...register('invmsL_Remarks')}
                            rows={3}
                            className='resize-none rounded-lg'
                        />
                    </CollapsibleSection>
                </div>
                <div className='lg:col-span-1'>
                    <Card className='p-6 shadow-md border-primary/20 bg-primary/5 space-y-4'>
                        <div className='space-y-3 pt-2 font-medium'>
                            <div className='flex justify-between items-center text-sm'>
                                <span className='text-muted-foreground'>Total Basic Amount:</span>
                                <span className='font-mono'>₹{watch('invmsL_TotalAmount')?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className='flex justify-between items-center text-sm text-destructive'>
                                <span className='flex items-center gap-1.5'>
                                    Total Discount:
                                </span>
                                <span className='font-mono'>- ₹{watch('invmsL_TotDiscount')?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className='flex justify-between items-center text-sm text-green-700'>
                                <span className='flex items-center gap-1.5'>
                                    Total Tax Amount:
                                </span>
                                <span className='font-mono'>+ ₹{watch('invmsL_TotTaxAmt')?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>

                            <div className='pt-4 mt-2 border-t border-primary/20'>
                                <div className='flex justify-between items-end'>
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] font-bold uppercase tracking-widest text-primary/70'>Net Sales Value</span>
                                        <span className='font-extrabold text-3xl tracking-tighter text-primary'>
                                            ₹{watch('invmsL_SalesValue')?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row gap-3 mt-6'>
                            <Button type='submit' className='flex-1 py-6 shadow-lg' isLoading={saveMutation.isPending}>
                                <Save className='mr-2 h-5 w-5' /> Update Sale
                            </Button>
                            <Button type='button' variant='outline' className='px-6 py-6' onClick={() => reset()}>
                                <RotateCcw className='h-5 w-5' />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

        </form>
    );
}

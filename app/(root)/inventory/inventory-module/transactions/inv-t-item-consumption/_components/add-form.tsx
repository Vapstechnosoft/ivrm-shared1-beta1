
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useInvTItemConsumption } from '@/hooks/inventory/transactions/use-inv-t-item-consumption';
import {
    invTItemConsumptionSchema,
    type InvTItemConsumptionSchema,
} from '@/schemas/inventory/transactions/inv-t-item-consumption';
import type { InvTItemConsumption } from '@/types/inventory/transactions/inv-t-item-consumption';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Minus, Package, Plus, ReceiptText, RotateCcw, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AddItemConsumptionFormProps {
    initialData?: InvTItemConsumption;
    onSuccess: () => void;
}

export default function AddItemConsumptionForm({ initialData, onSuccess }: AddItemConsumptionFormProps) {
    const {
        data: loadData,
        saveMutation,
        itemsOnStoreChangeMutation,
        itemStockDetailMutation,
        getStoresMutation,
        getDepartmentsMutation,
        getProductsMutation,
        getEmployeesMutation,
        getDetailsMutation,
        getICItemDetailsMutation,
        getICUserDetailsMutation,
        studentClsSecMutation,
        studentListMutation,
        sectionListMutation
    } = useInvTItemConsumption();

    const [itemsList, setItemsList] = useState<any[]>([]);
    const [availableStock, setAvailableStock] = useState<number>(0);
    const [stores, setStores] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);

    const [studentClsSec, setStudentClsSec] = useState<any[]>([]);
    const [studentList, setStudentList] = useState<any[]>([]);
    const [sectionList, setSectionList] = useState<any[]>([]);

    useEffect(() => {
        getStoresMutation.mutate(undefined, {
            onSuccess: (res) => {
                const data = res.data || res;
                if (Array.isArray(data)) {
                    setStores(data);
                } else if (data?.data && Array.isArray(data.data)) {
                    setStores(data.data);
                }
            }
        });

        getProductsMutation.mutate(undefined, {
            onSuccess: (res) => {
                const data = res.data || res;
                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (data?.data && Array.isArray(data.data)) {
                    setProducts(data.data);
                }
            }
        });

        getEmployeesMutation.mutate(undefined, {
            onSuccess: (res) => {
                const data = res.data || res;
                if (Array.isArray(data)) {
                    setEmployees(data);
                } else if (data?.data && Array.isArray(data.data)) {
                    setEmployees(data.data);
                }
            }
        });

        // Edit Logic - Using separate Item and User APIs as per C# snippets
        if (initialData?.invmiC_Id) {
            const INVMIC_Id = initialData.invmiC_Id;
            const userflag = initialData.invmiC_StuOtherFlg;

            // Fetch Items and User details in parallel
            Promise.all([
                getICItemDetailsMutation.mutateAsync(INVMIC_Id),
                getICUserDetailsMutation.mutateAsync({ INVMIC_Id, userflag })
            ]).then(([itemRes, userRes]) => {
                const itemData = itemRes?.data || itemRes || [];
                const userData = userRes?.data || userRes || [];
                const firstUser = userData[0] || {};

                const formValues: any = {
                    invmiC_Id: INVMIC_Id,
                    invmsT_Id: initialData.invmsT_Id,
                    invmiC_ICNo: initialData.invmiC_ICNo,
                    invmiC_ICDate: new Date(initialData.invmiC_ICDate),
                    invmiC_StuOtherFlg: initialData.invmiC_StuOtherFlg,
                    invmiC_Remarks: initialData.invmiC_Remarks || '',
                    stu_Flag: 'CS',
                    staffIds: [],
                    arrayIC: (Array.isArray(itemData) ? itemData : []).map((objic: any) => ({
                        invtiC_Id: objic.invtiC_Id || objic.invtic_id || 0,
                        invmI_Id: objic.invmI_Id || objic.invmi_id,
                        invmuoM_Id: objic.invmuoM_Id || objic.invmuom_id,
                        invtiC_ICPrice: objic.invtiC_ICPrice || objic.invtic_icprice,
                        invmP_Id: objic.invmP_Id || objic.invmp_id || 0,
                        invtiC_BatchNo: objic.invtiC_BatchNo || objic.invtic_batchno,
                        invtiC_ICQty: objic.invtiC_ICQty || objic.invtic_icqty,
                        invtiC_Naration: objic.invtiC_Naration || objic.invtic_naration || ''
                    }))
                };

                if (initialData.invmiC_StuOtherFlg === 'Staff') {
                    formValues.staffIds = userData.map((u: any) => u.hrmE_Id || u.HRME_Id || u.hrme_id || u.user_id);
                } else if (initialData.invmiC_StuOtherFlg === 'Department') {
                    formValues.hrmD_Id = firstUser.hrmD_Id || firstUser.HRMD_Id || firstUser.hrmd_id;
                } else if (initialData.invmiC_StuOtherFlg === 'Student') {
                    formValues.amsT_Id = firstUser.amsT_Id || firstUser.AMST_Id || firstUser.amst_id || 0;
                    formValues.asmcL_Id = firstUser.asmcL_Id || firstUser.ASMCL_Id || firstUser.asmcl_id || 0;
                    formValues.asmS_Id = firstUser.asmS_Id || firstUser.ASMS_Id || firstUser.asms_id || 0;

                    // Fallback to initialData if available
                    if (!formValues.amsT_Id && (initialData as any).amsT_Id) formValues.amsT_Id = (initialData as any).amsT_Id;
                }

                reset(formValues);
            }).catch(err => {
                console.error("Error loading edit details:", err);
                toast.error("Failed to load consumption details for editing");
            });
        }
    }, [initialData?.invmiC_Id]);

    const form = useForm<InvTItemConsumptionSchema>({
        resolver: zodResolver(invTItemConsumptionSchema),
        defaultValues: {
            invmiC_Id: 0,
            invmiC_ICDate: new Date(),
            invmiC_StuOtherFlg: 'Staff',
            stu_Flag: 'CS',
            invmiC_Remarks: '',
            staffIds: [],
            arrayIC: [
                {
                    invtiC_Id: 0,
                    invmI_Id: 0,
                    invtiC_BatchNo: '',
                    invtiC_ICQty: 0,
                    invtiC_ICPrice: 0,
                    invmuoM_Id: 0,
                    invtiC_Naration: '',
                    invmP_Id: 0
                }
            ]
        },
    });

    const { control, handleSubmit, register, setValue, watch, reset, formState: { errors } } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'arrayIC',
    });

    const watchedStoreId = watch('invmsT_Id');
    const watchedType = watch('invmiC_StuOtherFlg');
    const watchedStuFlag = watch('stu_Flag');
    const watchedClassId = watch('asmcL_Id');
    const watchedSectionId = watch('asmS_Id');
    const watchedStudentId = watch('amsT_Id');

    // Fetch Departments when Type changes to Department
    useEffect(() => {
        if (watchedType === 'Department') {
            getDepartmentsMutation.mutate(undefined, {
                onSuccess: (res) => {
                    const data = res.data || res;
                    if (Array.isArray(data)) {
                        setDepartments(data);
                    } else if (data?.data && Array.isArray(data.data)) {
                        setDepartments(data.data);
                    }
                }
            });
        }
    }, [watchedType]);

    // Fetch Student/Class/Sec when type or flag changes
    useEffect(() => {
        if (watchedType === 'Student') {
            studentClsSecMutation.mutate('CS', {
                onSuccess: (res) => {
                    const data = Array.isArray(res?.data) ? res.data : (res?.data?.get_Student_Cls_Sec || []);
                    setStudentClsSec(data);
                }
            });
        }
    }, [watchedType]);

    // Fetch Student List on Class Change
    useEffect(() => {
        if (watchedType === 'Student' && watchedClassId) {
            const data = {
                ASMCL_Id: watchedClassId,
                type: 'CS'
            };
            sectionListMutation.mutate(data, {
                onSuccess: (res) => {
                    const data = Array.isArray(res?.data) ? res.data : (res?.data?.get_sectionlist || []);
                    setSectionList(data);
                }
            });
        }
    }, [watchedType, watchedClassId]);

    // Fetch Student List on Section Change
    useEffect(() => {
        if (watchedType === 'Student' && watchedClassId && watchedSectionId) {
            const data = {
                ASMCL_Id: watchedClassId,
                ASMS_Id: watchedSectionId,
                type: 'CS'
            };
            studentListMutation.mutate(data, {
                onSuccess: (res) => {
                    const list = Array.isArray(res?.data)
                        ? res.data
                        : (res?.data?.get_Studentlist || res?.data?.get_StudentList || res?.data?.studentList || res?.data?.student_list || []);
                    setStudentList(list);
                }
            });
        }
    }, [watchedType, watchedClassId, watchedSectionId]);

    // Fetch Items when Store changes
    useEffect(() => {
        if (watchedStoreId) {
            // @ts-ignore
            const fifoFlag = loadData?.data?.get_config?.[0]?.invC_LIFOFIFOFlg || 'LIFO';
            const payload = {
                INVMST_Id: watchedStoreId,
                INVC_LIFOFIFOFlg: fifoFlag,
                AMST_Id: watchedStudentId || 0
            };
            itemsOnStoreChangeMutation.mutate(payload, {
                onSuccess: (res) => {
                    const data = res.data || res;
                    if (Array.isArray(data)) {
                        setItemsList(data);
                    } else if (data?.data && Array.isArray(data.data)) {
                        setItemsList(data.data);
                    } else if (data?.get_item) {
                        setItemsList(data.get_item);
                    } else {
                        setItemsList([]);
                        toast.info('No items found for this store');
                    }
                },
            });
        }
    }, [watchedStoreId, loadData, watchedStudentId]);

    const handleItemChange = (index: number, itemId: number) => {
        const item = itemsList.find((i: any) => (i.invmi_Id || i.invmI_Id) === itemId);
        if (item) {
            const price = item.invsto_SalesRate || item.invstO_SalesRate || 0;
            const batchNo = item.invsto_BatchNo || item.invstO_BatchNo || '';

            // Initial binding from the list item
            setValue(`arrayIC.${index}.invtiC_ICPrice`, price);
            setValue(`arrayIC.${index}.invtiC_BatchNo`, batchNo);

            // Fetch Definitive Details from SalesFacade
            const data = {
                AMST_Id: watchedStudentId || 0,
                INVMI_Id: itemId,
                INVSTO_BatchNo: batchNo,
                INVSTO_SalesRate: price,
                INVMST_Id: watchedStoreId
            };

            itemStockDetailMutation.mutate(data, {
                onSuccess: (res) => {
                    const detail = res?.data?.get_itemDetail?.[0];
                    if (detail) {
                        setValue(`arrayIC.${index}.invmuoM_Id`, detail.invmuoM_Id);
                        setValue(`arrayIC.${index}.invtiC_BatchNo`, detail.invstO_BatchNo);
                        setValue(`arrayIC.${index}.invtiC_ICPrice`, detail.invstO_SalesRate);
                    }

                    if (res?.data?.availablestock) {
                        let stock = 0;
                        res.data.availablestock.forEach((s: any) => stock += (s.AvaiableStock || s.avaiableStock || 0));
                        setAvailableStock(stock);
                    }
                }
            });
        }
    };

    const onSubmit = (data: InvTItemConsumptionSchema) => {
        // @ts-ignore
        const activeYearId = loadData?.data?.get_Year?.[0]?.asmaY_Id || 0;

        // Transform data for server to match INV_ItemConsumptionDTO PascalCase structure
        const formattedData = {
            INVMIC_Id: data.invmiC_Id || 0,
            INVMST_Id: data.invmsT_Id,
            INVMIC_StuOtherFlg: data.invmiC_StuOtherFlg,
            INVMIC_ICNo: data.invmiC_ICNo || '',
            INVMIC_ICDate: format(data.invmiC_ICDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
            INVMIC_Remarks: data.invmiC_Remarks || '',
            ASMAY_Id: activeYearId,

            // Staff
            arrayStaff: data.invmiC_StuOtherFlg === 'Staff' && data.staffIds ? data.staffIds.map(id => ({ HRME_Id: id })) : [],

            // Department
            HRMD_Id: data.invmiC_StuOtherFlg === 'Department' ? data.hrmD_Id : 0,

            // Student
            FlagsC: data.invmiC_StuOtherFlg === 'Student' ? 'S' : '',
            arrayStudentname: data.invmiC_StuOtherFlg === 'Student' ? [{
                AMST_Id: data.amsT_Id,
                AMSE_Id: 0 // Default
            }] : [],

            // Details
            arrayIC: data.arrayIC.map(item => ({
                INVTIC_Id: item.invtiC_Id || 0,
                INVMI_Id: Number(item.invmI_Id),
                INVMUOM_Id: Number(item.invmuoM_Id),
                INVMP_Id: item.invmP_Id ? Number(item.invmP_Id) : 0,
                INVTIC_BatchNo: item.invtiC_BatchNo,
                INVTIC_ICQty: Number(item.invtiC_ICQty),
                INVTIC_ICPrice: Number(item.invtiC_ICPrice),
                INVTIC_Naration: item.invtiC_Naration || ''
            }))
        };

        saveMutation.mutate(formattedData, {
            onSuccess: (res) => {
                if (res.success || res.returnval) {
                    reset();
                    onSuccess();
                    toast.success(res.message || "Consumption saved successfully");
                } else {
                    toast.error(res.message || "Failed to save consumption");
                }
            },
        });
    };

    const staffOptions = employees.map((e: any) => ({
        label: `${e.employeename} (${e.hrmE_EmployeeCode})`,
        value: e.hrmE_Id.toString() // MultiSelect expects string values usually
    }));

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 max-w-[1400px] mx-auto'>
            <CollapsibleSection
                title="Consumption Header"

                defaultOpen={true}
                className="shadow-sm border-primary/10"
            >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-1'>
                    <div className='bg-muted/30 p-4 rounded-lg space-y-4'>
                        <Label>Type</Label>
                        <Controller
                            name="invmiC_StuOtherFlg"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex items-center space-x-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Staff" id="r1" />
                                        <Label htmlFor="r1">Staff</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Department" id="r2" />
                                        <Label htmlFor="r2">Department</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Student" id="r3" />
                                        <Label htmlFor="r3">Student</Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                    </div>

                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label >IC Date</Label>
                            <Controller
                                name='invmiC_ICDate'
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
                            {errors.invmiC_ICDate && <span className='text-destructive text-xs'>{errors.invmiC_ICDate.message}</span>}
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
                                            {stores.map((s: any, index: number) => (
                                                <SelectItem key={`${s.invmsT_Id}-${index}`} value={s.invmsT_Id.toString()}>{s.invmS_StoreName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.invmsT_Id && <span className='text-destructive text-xs'>{errors.invmsT_Id.message}</span>}
                        </div>

                        <div className='space-y-2'>
                            <div className='flex justify-between'>
                                <Label>IC No.</Label>
                            </div>
                            <InputText {...register('invmiC_ICNo')} placeholder='Auto Generated / Enter No.' />
                        </div>
                    </div>
                </div>

                {watchedType === 'Staff' && (
                    <div className='mt-4 p-4 border rounded-md'>
                        <Label >Select Staff</Label>
                        <Controller
                            name="staffIds"
                            control={control}
                            render={({ field }) => (
                                <MultiSelect
                                    options={staffOptions}
                                    onValueChange={(vals) => field.onChange(vals.map(v => Number(v)))}
                                    defaultValue={field.value?.map(String) || []}
                                    placeholder="Select Staff..."
                                    variant="inverted"
                                />
                            )}
                        />
                        {errors.staffIds && <span className='text-destructive text-xs'>{errors.staffIds.message}</span>}
                    </div>
                )}

                {watchedType === 'Department' && (
                    <div className='mt-4 p-4 border rounded-md'>
                        <Label >Department</Label>
                        <Controller
                            name='hrmD_Id'
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger><SelectValue placeholder='Select Department' /></SelectTrigger>
                                    <SelectContent>
                                        {departments.map((d: any, index: number) => (
                                            <SelectItem key={`${d.hrmD_Id}-${index}`} value={d.hrmD_Id.toString()}>{d.hrmD_DepartmentName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.hrmD_Id && <span className='text-destructive text-xs'>{errors.hrmD_Id.message}</span>}
                    </div>
                )}

                {watchedType === 'Student' && (
                    <div className='mt-4 p-4 border rounded-md bg-secondary/5 space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label>Class</Label>
                                <Controller
                                    name='asmcL_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                            <SelectTrigger><SelectValue placeholder='Select Class' /></SelectTrigger>
                                            <SelectContent>
                                                {studentClsSec.map((s: any, index: number) => {
                                                    const id = s.asmcL_Id || s.ASMCL_Id || s.asmcl_id;
                                                    const name = s.asmcL_ClassName || s.ASMCL_ClassName || s.asmcl_classname;
                                                    if (!id) return null;
                                                    return <SelectItem key={`cls-${id}-${index}`} value={id.toString()}>{name}</SelectItem>;
                                                })}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.asmcL_Id && <span className='text-destructive text-xs'>{errors.asmcL_Id.message}</span>}
                            </div>
                            <div className='space-y-2'>
                                <Label>Section</Label>
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
                                {errors.asmS_Id && <span className='text-destructive text-xs'>{errors.asmS_Id.message}</span>}
                            </div>
                        </div>

                        {/* Student Dropdown */}
                        {watchedClassId && watchedSectionId && (
                            <div className='space-y-2'>
                                <Label>Student Name</Label>
                                <Controller
                                    name='amsT_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                            <SelectTrigger><SelectValue placeholder='Select Student' /></SelectTrigger>
                                            <SelectContent>
                                                {studentList.map((s: any, index: number) => {
                                                    const id = s.amst_id || s.amsT_Id || s.AMST_Id || s.amst_Id;
                                                    const name = s.studentname || s.studentName || s.student_name || s.ameS_StudentName;
                                                    if (!id) return null;
                                                    return <SelectItem key={`stuname-${id}-${index}`} value={id.toString()}>{name}</SelectItem>;
                                                })}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.amsT_Id && <span className='text-destructive text-xs'>{errors.amsT_Id.message}</span>}
                            </div>
                        )}
                    </div>
                )}

            </CollapsibleSection>

            <CollapsibleSection
                title="Consumption Items"

                defaultOpen={true}
                className="shadow-sm border-primary/10"
            >
                <div className='overflow-x-auto -mx-1 p-1'>
                    <table className='w-full border-collapse text-xs min-w-[1000px]'>
                        <thead>
                            <tr className='bg-muted/50 text-muted-foreground uppercase tracking-wider text-[10px]'>
                                <th className='border p-3 w-[40px] text-center'>#</th>
                                <th className='border p-3 min-w-[200px] text-left'>Item Name</th>
                                <th className='border p-3 w-[150px] text-left'>Product</th>
                                <th className='border p-3 w-[100px] text-left'>Batch No</th>
                                <th className='border p-3 w-[80px] text-right'>Qty</th>
                                <th className='border p-3 min-w-[150px] text-left'>Narration</th>
                                <th className='border p-3 w-[50px] text-center'></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {fields.map((field, index) => (
                                <tr key={field.id} className='hover:bg-primary/5'>
                                    <td className='border p-2 text-center'>{index + 1}</td>
                                    <td className='border p-2'>
                                        <Controller
                                            name={`arrayIC.${index}.invmI_Id`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={(val) => {
                                                    const id = Number(val);
                                                    field.onChange(id);
                                                    handleItemChange(index, id);
                                                }} value={field.value?.toString()}>
                                                    <SelectTrigger><SelectValue placeholder='Select Item' /></SelectTrigger>
                                                    <SelectContent>
                                                        {itemsList.map((i: any, idx: number) => {
                                                            const id = i.invmi_Id || i.invmI_Id;
                                                            return (
                                                                <SelectItem key={`${id}-${idx}`} value={id.toString()}>
                                                                    {i.invmi_ItemName || i.invmI_ItemName}
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.arrayIC?.[index]?.invmI_Id && <span className='text-destructive text-[10px]'>Required</span>}
                                    </td>
                                    <td className='border p-2'>
                                        <Controller
                                            name={`arrayIC.${index}.invmP_Id`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString() || ''}>
                                                    <SelectTrigger><SelectValue placeholder='Select Product' /></SelectTrigger>
                                                    <SelectContent>
                                                        {products.map((p: any, idx: number) => (
                                                            <SelectItem key={`${p.invmP_Id}-${idx}`} value={p.invmP_Id.toString()}>{p.invmP_ProductName}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </td>
                                    <td className='border p-2'>
                                        <InputText {...register(`arrayIC.${index}.invtiC_BatchNo`)} className='h-8 text-xs' />
                                        {errors.arrayIC?.[index]?.invtiC_BatchNo && <span className='text-destructive text-[10px]'>Required</span>}
                                    </td>
                                    <td className='border p-2'>
                                        <InputText {...register(`arrayIC.${index}.invtiC_ICQty`, { valueAsNumber: true })} className='h-8 text-xs text-right' />
                                        {errors.arrayIC?.[index]?.invtiC_ICQty && <span className='text-destructive text-[10px]'>Invalid</span>}
                                    </td>
                                    <td className='border p-2'>
                                        <InputText {...register(`arrayIC.${index}.invtiC_Naration`)} className='h-8 text-xs' />
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
                    <div className='mt-4 flex justify-between items-center'>
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => append({
                                invtiC_Id: 0,
                                invmI_Id: 0,
                                invtiC_BatchNo: '',
                                invtiC_ICQty: 0,
                                invtiC_ICPrice: 0,
                                invmuoM_Id: 0,
                                invtiC_Naration: '',
                                invmP_Id: 0
                            })}
                            className='h-8 text-[11px] font-bold'
                        >
                            <Plus className='mr-2 h-3 w-3' /> ADD ROW
                        </Button>
                        <div className='text-sm font-medium'>
                            Total Available Stock: <span className='font-bold text-primary'>{availableStock}</span>
                        </div>
                    </div>
                </div>
            </CollapsibleSection>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <div className='lg:col-span-2'>
                    <CollapsibleSection
                        title="Remarks"
                        defaultOpen={true}
                    >
                        <InputTextarea
                            label='Remarks / Narration'
                            {...register('invmiC_Remarks')}
                            rows={3}
                            className='resize-none rounded-lg'
                        />
                    </CollapsibleSection>
                </div>
                <div className='lg:col-span-1'>
                    <div className='flex flex-col gap-3'>
                        <Button type='submit' className='py-6 shadow-lg' isLoading={saveMutation.isPending}>
                            <Save className='mr-2 h-5 w-5' /> {initialData ? 'Update Consumption' : 'Save Consumption'}
                        </Button>
                        <Button type='button' variant='outline' className='py-6' onClick={() => reset()}>
                            <RotateCcw className='h-5 w-5 mr-2' /> {initialData ? 'Undo Changes' : 'Reset'}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}

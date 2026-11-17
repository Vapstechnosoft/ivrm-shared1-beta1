'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    useFeeRefundableList,
    useopeningClassdropdowndatafee,
    useopeningSectiondropdowndatafee,
    useopeningacademicyerdropdowndatafee
} from '@/hooks/fees/useTrasactions';
import { cn } from '@/lib/utils';
import { feesRefundableSchema } from '@/schemas/fees/trasactions';
import {
    addOrUpdateFeeRefundableDetails,
    getFeeRefundableGroupDropdownDetails,
    getFeeRefundableHeadDetails,
    getFeeRefundableStudentDropdownDetails
} from '@/server/fees/trasactions/fee_refundable';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, Save, Square } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof feesRefundableSchema.addOrUpdate>;

interface StudentRow {
    amst_Id: number;
    fullName: string;
    fmoB_Student_Due: number;
    fmoB_Institution_Due: number;
    checked: boolean;
    Selected?: boolean;
    Selected1?: boolean;
    fmH_FeeName?: string;
    ftI_Name?: string;
    Amountall?: number;
    FR_RefundAmount?: number;
    balamt?: number;
}

interface FeeDetail {
    slno: number;
    date: string;
    receiptNo: string;
    totalPaidAmount: number;
}
export default function AddFeeRefundableForm({
    onSuccess,
    className = ''
}: {
    onSuccess?: () => void;
    className?: string;
}) {
    const [selectedAsmayId, setSelectedAsmayId] = useState<number | null>(null);
    //const { refetchAll } = useMasterFeeOpeningBalance();
    const { refetchAll } = useFeeRefundableList(Number(selectedAsmayId));
    const { data: yeardata, isLoading: loadingYears } = useopeningacademicyerdropdowndatafee();

    useEffect(() => {
        if (!loadingYears && academicYearData?.data?.length && selectedAsmayId === null) {
            setSelectedAsmayId(Number(academicYearData.data[0].asmaY_Id));
        }
    }, [loadingYears, yeardata, selectedAsmayId]);

    const {
        control,
        reset,
        setValue,
        watch,
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feesRefundableSchema.addOrUpdate),
        defaultValues: {
            academicYearId: undefined
            // classId: undefined,
            // sectionId: undefined,
            // headId: undefined,
            // groupId: undefined,
            // installmentId: undefined
        }
    });

    const [groupData, setGroupData] = useState<any[]>([]);

    const [headData, setheadData] = useState<any[]>([]);
    const [loadingGroups, setLoadingGroups] = useState(false); // <-- add this
    const [selectedGroupItems, setSelectedGroupItems] = useState<{ fmG_Id: string }[]>([]);
    const [groupSearch, setgroupSearch] = useState('');
    const academicYearId = useWatch({ control, name: 'academicYearId' });
    const classId = useWatch({ control, name: 'classId' });
    const sectionId = useWatch({ control, name: 'sectionId' });
    //const headId = useWatch({ control, name: 'headId' });

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectionType, setSelectionType] = useState<'T' | 'G' | 'C'>('T');
    const [refundableType, setRefundableType] = useState<'Refunable' | 'NonRefunable'>('Refunable');
    const [activeType, setActiveType] = useState<'Active' | 'Left'>('Active');
    const [activefee, setActivefee] = useState<'Fee' | 'PDA'>('Fee');
    const [nameType, setNameType] = useState<'NameRegNo' | 'RegNameNo'>('NameRegNo');
    const [studentWise, setStudentWise] = useState<string>('');

    const [students, setStudents] = useState<StudentRow[]>([]);
    const [showTable, setShowTable] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [saving, setSaving] = useState(false);
    const [studentDropdownList, setStudentDropdownList] = useState<{ value: string; label: string }[]>([]);
    const [loadingDropdown, setLoadingDropdown] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [formKey, setFormKey] = useState(0);

    const [selectedAll, setSelectedAll] = useState(false);
    const [paymentMode, setPaymentMode] = useState<'C' | 'B' | 'O' | ''>('');
    const [narration, setNarration] = useState('');
    const [search, setSearch] = useState('');

    const [headLoading, setHeadLoading] = useState(false);
    const [headError, setHeadError] = useState('');

    const today = new Date().toISOString().split('T')[0];
    const [chequeDate, setChequeDate] = useState(today);
    const [refunddate, setRefundDate] = useState(today);

    // Data Hooks
    const { data: academicYearData, isLoading: loadingAcademicYear } = useopeningacademicyerdropdowndatafee();
    const { data: classData, isLoading: loadingClasses } = useopeningClassdropdowndatafee();
    const { data: sectionData, isLoading: loadingSections } = useopeningSectiondropdowndatafee(
        academicYearId ? Number(academicYearId) : 0,
        classId ? Number(classId) : 0
    );

    console.log('sectionData', sectionData);

    // const toggleAll = () => {
    //     const newVal = !selectedAll;
    //     setSelectedAll(newVal);
    //     setStudents(
    //         students.map((s) => ({
    //             ...s,
    //             Selected: newVal
    //         }))
    //     );
    // };

    //     const toggleAll = () => {
    //     const newVal = !selectedAll;
    //     setSelectedAll(newVal);

    //     setheadData(
    //         headData.map((h) => ({
    //             ...h,
    //             Selected: newVal
    //         }))
    //     );
    // };

    const toggleAll = () => {
        const newVal = !selectedAll;
        setSelectedAll(newVal);

        setheadData(
            headData.map((h) => ({
                ...h,
                Selected: newVal
            }))
        );
    };

    const toggleHead = (row: any) => {
        const updated = headData.map((h) => (h === row ? { ...h, Selected: !h.Selected } : h));

        // Update selectedAll if needed
        const allSelected = updated.every((h) => h.Selected);
        setSelectedAll(allSelected);

        setheadData(updated);
    };

    const toggleAllHeads = () => {
        const newVal = !selectedAll;
        setSelectedAll(newVal);

        let totalRefundable = 0;

        const updated = headData.map((h) => {
            if (newVal) {
                const amt = Number(h.fsS_RunningExcessAmount) + Number(h.fsS_RefundableAmount);
                totalRefundable += amt;
            }

            return {
                ...h,
                Selected: newVal
            };
        });

        setheadData(updated);

        // 🔥 Update narration automatically
        if (newVal) {
            setNarration(`Total Amount: ${totalRefundable}`);
        } else {
            setNarration('');
        }
    };

    // const updateRefund = (row: any, val: number) => {
    //     let refund = Number(val ?? 0);
    //     if (refund > row.Amountall) refund = row.Amountall;
    //     const updated = students.map((s) =>
    //         s === row
    //             ? {
    //                   ...s,
    //                   FR_RefundAmount: refund,
    //                   balamt: row.Amountall - refund
    //               }
    //             : s
    //     );
    //     setStudents(updated);
    // };

    const updateRefund = (row: any, val: number) => {
        let refund = Number(val ?? 0);
        const maxAmount = Number(row.fsS_RunningExcessAmount) + Number(row.fsS_RefundableAmount);

        if (refund > maxAmount) {
            toast.error('Refund Amount Should not be greater than Excess Amount');
            refund = maxAmount;
        }

        setheadData(
            headData.map((h) =>
                h === row
                    ? {
                          ...h,
                          FR_RefundAmount: refund,
                          balamt: maxAmount - refund
                      }
                    : h
            )
        );
    };

    // Add modal control and data states
    const [feeDetails, setFeeDetails] = useState<FeeDetail[] | null>(null);
    const [showFeeDetailsModal, setShowFeeDetailsModal] = useState(false);

    // Simulate fetching fee details (replace with your real data fetch)
    const fetchFeeDetails = async () => {
        // Here call your API or get data from the state based on selected student etc.
        // For example:
        const data: FeeDetail[] = [{ slno: 1, date: '22-05-2025', receiptNo: 'SF/952/25-26', totalPaidAmount: 82690 }];
        setFeeDetails(data);
        setShowFeeDetailsModal(true);
    };

    const [showChargesModal, setShowChargesModal] = useState(false);
    const [instantRefundChecked, setInstantRefundChecked] = useState(false);

    // CRITICAL FIX: Clear dependent fields when refundableType or headId changes

    // useEffect(() => {
    //     setValue('groupId', undefined);

    // }, [headId, setValue]);

    // Convert Heads API to { label, id }
    const groupOptions =
        groupData?.map((h) => ({
            id: h.fmG_Id.toString(),
            label: h.fmG_GroupName
        })) ?? [];

    // Define form value for fmH_Ids
    //const fmG_Ids = watch('groups') || [];

    const fmG_Ids = (watch('groups') as string[] | undefined) || [];

    const selectAllGroup = () => {
        const all = groupOptions.map((h) => h.id);

        if (fmG_Ids.length === all.length) {
            // Option: clear selection → field becomes undefined
            setValue('groups', undefined as any);
            setSelectedGroupItems([]);
        } else {
            setValue('groups', all as [string, ...string[]], {
                shouldValidate: true
            });
            setSelectedGroupItems(all.map((x) => ({ fmG_Id: x })));
        }
    };

    // const toggleGroup = (id: string) => {
    //     let updated = [];

    //     if (fmG_Ids.includes(id)) {
    //         updated = fmG_Ids.filter((v: string) => v !== id);
    //     } else {
    //         updated = [...fmG_Ids, id];
    //     }

    //     // MUST be tuple: at least 1 element
    //     if (updated.length === 0) {
    //         setValue('groups', undefined as any);
    //     } else {
    //         setValue('groups', updated as [string, ...string[]], {
    //             shouldValidate: true
    //         });
    //     }

    //     setSelectedGroupItems(updated.map((x) => ({ fmG_Id: x })));
    // };

    const toggleGroup = (id: string) => {
        const updated = fmG_Ids.includes(id) ? fmG_Ids.filter((v) => v !== id) : [...fmG_Ids, id];

        setValue('groups', updated.length ? (updated as [string, ...string[]]) : (undefined as any), { shouldValidate: true });
        setSelectedGroupItems(updated.map((x) => ({ fmG_Id: x })));
    };

    const filteredGroups = groupData?.filter((h) => h.fmG_GroupName.toLowerCase().includes(searchValue.toLowerCase())) ?? [];

    const selectedStudentId = useWatch({ control, name: 'studentWise' });

    useEffect(() => {
        const fetchGroupsForStudent = async () => {
            if (!selectedStudentId || !academicYearId || !refundableType) {
                setValue('groups', undefined as any);
                setSelectedGroupItems([]);
                setGroupData([]);
                return;
            }

            console.log('selectedStudentId', selectedStudentId);

            try {
                setLoadingGroups(true); // start loading
                const refundableflag = refundableType === 'Refunable';
                const res = await getFeeRefundableGroupDropdownDetails(Number(academicYearId), Number(selectedStudentId), refundableflag);

                if (res?.success && Array.isArray(res.data)) {
                    setGroupData(res.data); // store groups
                } else {
                    setGroupData([]);
                }
            } catch (err) {
                console.error('Error fetching student groups:', err);
                setGroupData([]);
            } finally {
                setLoadingGroups(false); // stop loading
            }
        };

        fetchGroupsForStudent();
    }, [selectedStudentId, refundableType, academicYearId, setValue]);

    // Explicitly tell TS that 'groups' is a string array
    const groupsWatched =
        (useWatch({
            control,
            name: 'groups'
        }) as string[]) || [];

    useEffect(() => {
        const fetchHeadsForStudent = async () => {
            if (!selectedStudentId || !academicYearId || !refundableType || groupsWatched.length === 0) {
                setheadData([]);
                return;
            }

            const groupIds = groupsWatched.map((id) => Number(id));

            setHeadLoading(true);
            setHeadError('');
            setheadData([]); // clear old data while loading

            try {
                const refundableflag = refundableType === 'Refunable';
                const res = await getFeeRefundableHeadDetails(Number(academicYearId), Number(selectedStudentId), refundableflag, groupIds);

                // if (res?.success && Array.isArray(res.data)) {
                //     setheadData(res.data);
                // }
                if (res?.success && Array.isArray(res.data)) {
                    const processed = res.data.map((h) => {
                        const amountAll = Number(h.fsS_RunningExcessAmount) + Number(h.fsS_RefundableAmount);

                        return {
                            ...h,
                            Amountall: amountAll,
                            balamt: amountAll,
                            FR_RefundAmount: amountAll,
                            Selected: false,
                            Selected1: false
                        };
                    });

                    setheadData(processed); // set final data ONCE
                } else {
                    setheadData([]);
                    setHeadError('No head details found');
                }
            } catch (err) {
                console.error('Error fetching student heads:', err);
                setheadData([]);
            }
            setHeadLoading(false); // ✅ ALWAYS stop loader
        };

        fetchHeadsForStudent();
    }, [selectedStudentId, refundableType, academicYearId, groupsWatched.join(',')]);

    //     useEffect(() => {

    //     if (headData.length > 0) {
    //         const updatedHeadData = headData.map((h) => {
    //             const amountAll = Number(h.fsS_RunningExcessAmount) + Number(h.fsS_RefundableAmount);
    //             return {
    //                 ...h,
    //                 Amountall: amountAll,
    //                 balamt: amountAll,
    //                 FR_RefundAmount: amountAll,
    //                 Selected: false,
    //                 Selected1: false,
    //             };
    //         });

    //         setheadData(updatedHeadData);
    //     }
    // }, [headData]);

    // FULL RESET FUNCTION
    const resetAllFormState = useCallback(() => {
        reset({
            academicYearId: undefined
            // classId: undefined,
            // sectionId: undefined,
            // headId: undefined,
            // groupId: undefined,
            // installmentId: undefined
        });
        setSelectedDate(new Date());
        setRefundableType('Refunable');
        setActiveType('Active');
        setActivefee('Fee');
        setNameType('NameRegNo');
        setStudentWise('');

        setStudents([]);
        setShowTable(false);
        setStudentDropdownList([]);
        setSearchValue('');
        setFormKey((prev) => prev + 1);
    }, [reset]);

    useEffect(() => {
        resetAllFormState();
    }, [selectionType, resetAllFormState]);

    // 🔥 Load student list based on Academic Year, Class & Section
    useEffect(() => {
        const loadStudentsByClass = async () => {
            if (!academicYearId || !classId || !sectionId) {
                setStudentDropdownList([]);
                setStudentWise('');
                return;
            }

            setLoadingDropdown(true);

            try {
                const res = await getFeeRefundableStudentDropdownDetails(Number(academicYearId), Number(classId), Number(sectionId));

                console.log('res', res);

                if (res?.data && Array.isArray(res.data)) {
                    // const list = res.data.map((s: any) => ({
                    //     value: String(s.amst_Id || s.AMST_Id),
                    //     label: s.studentName
                    // }));

                    // const list = res.data.map((s: any) => ({
                    //     value:
                    //         s.amst_Id !== undefined && s.amst_Id !== null
                    //             ? String(s.amst_Id)
                    //             : s.AMST_Id !== undefined && s.AMST_Id !== null
                    //               ? String(s.AMST_Id)
                    //               : crypto.randomUUID(), // fallback to UNIQUE value
                    //     label: s.studentName || 'Unknown'
                    // }));

                    const list = res.data
                        .map((s: any) => {
                            const id = s.amsT_Id ?? s.amst_Id ?? s.AMST_Id;

                            if (!id) return null; // skip broken records

                            return {
                                value: String(id), // always string
                                label: s.studentName || 'Unknown' // always string
                            };
                        })
                        .filter(Boolean) as { value: string; label: string }[];

                    setStudentDropdownList(list);
                } else {
                    setStudentDropdownList([]);
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load students');
            } finally {
                setLoadingDropdown(false);
            }
        };

        loadStudentsByClass();
    }, [academicYearId, classId, sectionId, activeType, nameType]);

    //const onSubmit = async () => {

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        // const selected = students.filter((s) => s.checked);
        // if (selected.length === 0) return toast.error('Please select at least one student');

        if (!paymentMode) {
            toast.error('Please select a payment mode (Cash, Bank, or Online)');
            return;
        }

        if (paymentMode === 'B') {
            if (!data.fR_CheqNo) {
                toast.error('Please enter Cheque/DD No');
                return;
            }
        }

        // ---------------------------
        // 2) HEAD DATA EXISTS
        // ---------------------------
        if (!headData || headData.length === 0) {
            toast.error('No head details available to save.');
            return;
        }

        const refundItems = headData
            .filter((h) => h.Selected) // Only selected rows
            .map((h) => ({
                fsS_Id: h.fsS_Id,
                fR_RefundAmount: Number(h.FR_RefundAmount) || 0,
                setRefundOverFlag: data.refundableflag === '1'
            }));

        //setSaving(true);
        try {
            const payload = {
                asmaY_Id: Number(academicYearId),
                amsT_Id: Number(selectedStudentId),
                FmfR_Date: refunddate,
                fR_RefundNo: data.REF_REC_No,
                fR_RefundRemarks: narration,
                fR_BANK_CASH: paymentMode,
                fR_CheqDate: chequeDate,
                fR_BankName: data.fR_BankName,
                fR_CheqNo: data.fR_CheqNo,
                refundItems: refundItems
            };

            const jsondata = JSON.stringify(payload);
            console.log('payload in onSubmit', jsondata);
            const res = await addOrUpdateFeeRefundableDetails(payload);
            if (res.success || res.returnval) {
                toast.success(res.message);
                resetAllFormState();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(res.message);
            }
        } catch {
            // toast.error('Error saving data');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={`space-y-6 ${className}`} key={formKey}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Main Form Grid */}
                <div className='grid gap-8 lg:grid-cols-2'>
                    <div className='space-y-5'>
                        {/* Academic Year */}
                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                            <Label className='w-44 text-right sm:w-44'>
                                Academic Year <span className='text-red-500'>*</span>
                            </Label>
                            <div className='w-full sm:w-96'>
                                <Controller
                                    name='academicYearId'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
                                            value={field.value?.toString()}
                                            disabled={loadingAcademicYear}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={loadingAcademicYear ? 'Loading...' : 'Select Academic Year'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {academicYearData?.data?.map((item: any) => (
                                                    <SelectItem key={item.asmaY_Id} value={String(item.asmaY_Id)}>
                                                        {item.asmaY_Year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.academicYearId && <FormError>{errors.academicYearId.message}</FormError>}
                            </div>
                        </div>

                        <>
                            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                                <Label className='w-44 text-right'>
                                    Class <span className='text-red-500'>*</span>
                                </Label>
                                <div className='w-full sm:w-96'>
                                    <Controller
                                        name='classId'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
                                                value={field.value?.toString()}
                                                disabled={loadingClasses}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={loadingClasses ? 'Loading...' : 'Select Class'} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {classData?.data?.map((item: any) => (
                                                        <SelectItem key={item.asmcL_Id} value={String(item.asmcL_Id)}>
                                                            {item.asmcL_ClassName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.classId && <FormError>{errors.classId.message}</FormError>}
                                </div>
                            </div>

                            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                                <Label className='w-44 text-right'>
                                    Section <span className='text-red-500'>*</span>
                                </Label>
                                <div className='w-full sm:w-96'>
                                    <Controller
                                        name='sectionId'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                // disabled={!classId || loadingSections}
                                                onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
                                                value={field.value?.toString()}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={loadingSections ? 'Loading ...' : 'Select Section'} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {sectionData?.data?.map((item: any) => (
                                                        <SelectItem key={item.asmS_Id} value={String(item.asmS_Id)}>
                                                            {item.asmC_SectionName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.sectionId && <FormError>{errors.sectionId.message}</FormError>}
                                </div>
                            </div>
                        </>

                        {/* Refundable / Non-Refundable - FIXED */}

                        {/* Fee Head - FIXED with key */}
                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                            <Label className='w-44 text-right'>
                                Student Name <span className='text-red-500'>*</span>
                            </Label>
                            <div className='w-full sm:w-96'>
                                <Controller
                                    name='studentWise'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            //value={field.value?.toString()}
                                            value={field.value ?? ''}
                                            onValueChange={(v) => field.onChange(v)}
                                            //onValueChange={(v) => field.onChange(Number(v))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Student' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {studentDropdownList.map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.studentWise && <FormError>{errors.studentWise.message}</FormError>}
                            </div>
                        </div>
                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                            <Button onClick={fetchFeeDetails} className='w-96'>
                                View Fee Details
                            </Button>
                        </div>

                        {showFeeDetailsModal && feeDetails && (
                            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                                <div className='w-[40rem] rounded-lg bg-white p-6 shadow-lg'>
                                    <h2 className='mb-4 font-semibold text-lg'>Fee Details</h2>
                                    <table className='w-full border-collapse border border-gray-300 text-sm'>
                                        <thead>
                                            <tr>
                                                <th className='border border-gray-300 px-2 py-1'>SLNO</th>
                                                <th className='border border-gray-300 px-2 py-1'>Date</th>
                                                <th className='border border-gray-300 px-2 py-1'>Receipt No</th>
                                                <th className='border border-gray-300 px-2 py-1'>Total Paid Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {feeDetails.map((item) => (
                                                <tr key={item.slno}>
                                                    <td className='border border-gray-300 px-2 py-1 text-center'>{item.slno}</td>
                                                    <td className='border border-gray-300 px-2 py-1 text-center'>{item.date}</td>
                                                    <td className='border border-gray-300 px-2 py-1 text-center'>{item.receiptNo}</td>
                                                    <td className='border border-gray-300 px-2 py-1 text-right'>{item.totalPaidAmount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className='mt-4 text-right'>
                                        <Button variant='outline' onClick={() => setShowFeeDetailsModal(false)}>
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className='flex flex-wrap items-center gap-4 rounded border p-3'>
                            {/* <label className='flex items-center space-x-2'>
                                <input
                                    type='checkbox'
                                    checked={instantRefundChecked}
                                    onChange={() => setInstantRefundChecked(!instantRefundChecked)}
                                    className='h-5 w-5'
                                />
                                <span className='font-medium text-gray-700'>Instant Refund</span>
                            </label> */}

                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='refundableflag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='refundableflag'
                                            />
                                            <Label htmlFor='refundableflag'>Instant Refund</Label>
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Info Text */}
                            <span className='whitespace-nowrap text-gray-600'>For Instant refund Extra charges are applicable</span>

                            {/* View Charges Button */}
                            <Button onClick={() => setShowChargesModal(true)}>View Charges</Button>
                        </div>

                        {/* Modal */}
                        {showChargesModal && (
                            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
                                <div className='max-h-[80vh] w-full max-w-2xl overflow-auto rounded-lg bg-white shadow-lg'>
                                    <div className='flex items-center justify-between rounded-t-lg bg-blue-600 px-6 py-3'>
                                        <h4 className='font-semibold text-lg text-white'>PAYMENT GATE WAY REFUND CHARGES</h4>
                                        <Button variant='outline' onClick={() => setShowChargesModal(false)}>
                                            Close
                                        </Button>
                                    </div>

                                    <div className='p-6 text-gray-800'>
                                        <h4 className='mb-4 ml-14 font-semibold text-xl'>Online Payment Refund Charges as Follows</h4>

                                        <h3 className='mb-3 font-semibold'>1) RazorPay</h3>

                                        <p className='mb-4 pl-4 font-bold'>For less than 1000 Rs Refund charges is Rs 3.</p>
                                        <p className='mb-4 pl-4 font-bold'>For less than 1000 - 25000 Rs Refund charges is Rs 5.</p>
                                        <p className='mb-4 pl-4 font-bold'>For greater than 25000 Rs Refund charges is Rs 8.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - UNCHANGED */}
                    <div className='space-y-5'>
                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                            <Label className='w-40'>
                                Type <span className='text-red-500'>*</span>
                            </Label>
                            <div className='flex flex-wrap gap-6 rounded-lg border bg-white p-3'>
                                {(['Refunable', 'NonRefunable'] as const).map((val) => {
                                    const displayLabel = val === 'Refunable' ? 'Refundable' : 'Non-Refundable';
                                    return (
                                        <label key={val} className='flex cursor-pointer items-center gap-3'>
                                            <input
                                                type='radio'
                                                name='refundableType'
                                                value={val}
                                                checked={refundableType === val}
                                                onChange={(e) => {
                                                    const newType = e.target.value as 'Refunable' | 'NonRefunable';
                                                    setRefundableType(newType);

                                                    // Clear fee-related fields
                                                    // setValue('headId', undefined);
                                                    // setValue('groupId', undefined);
                                                    //  setValue('installmentId', undefined);
                                                }}
                                                className='h-5 w-5 text-blue-600'
                                            />
                                            <span className='font-medium text-sm'>{displayLabel}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div className='group flex items-start gap-3'>
                            {/* Label */}
                            <Label aria-label='groups' htmlFor='fmH_Id' className='mt-2 whitespace-nowrap font-medium'>
                                Fee Group <span className='ml-1 text-red-500'>*</span>
                            </Label>

                            {/* Selection & Search */}
                            <div className='flex-1 rounded-md border border-gray-300 bg-white p-3'>
                                <InputText
                                    placeholder='Search Fee Group...'
                                    value={groupSearch}
                                    onChange={(e) => setgroupSearch(e.target.value)}
                                    className='mb-3'
                                />

                                {/* Select All Users */}
                                {groupData && (
                                    <div
                                        onClick={selectAllGroup}
                                        className={cn(
                                            'mb-2 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm transition-all',
                                            fmG_Ids.length === groupOptions.length && groupOptions.length
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-300 hover:border-primary/40'
                                        )}>
                                        {fmG_Ids.length === groupOptions.length && groupOptions.length ? (
                                            <CheckSquare className='h-4 w-4 text-primary' />
                                        ) : (
                                            <Square className='h-4 w-4 text-gray-400' />
                                        )}
                                        <span>Select All</span>
                                    </div>
                                )}

                                <div className='max-h-40 overflow-y-auto rounded-md border border-gray-300 p-1'>
                                    {loadingGroups ? (
                                        <div className='py-4 text-center text-gray-500 text-sm'>Loading Groups...</div>
                                    ) : groupData.length === 0 ? (
                                        <div className='py-4 text-center text-gray-500 text-sm'>No groups found</div>
                                    ) : (
                                        filteredGroups.map((u) => {
                                            const id = u.fmG_Id.toString();
                                            const selected = fmG_Ids.includes(id);

                                            return (
                                                <div
                                                    key={u.fmG_Id}
                                                    onClick={() => toggleGroup(id)}
                                                    className={cn(
                                                        'mb-1 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-all',
                                                        selected
                                                            ? 'border-primary bg-primary/5 text-primary'
                                                            : 'border-gray-300 hover:border-primary/40'
                                                    )}>
                                                    {selected ? (
                                                        <CheckSquare className='h-4 w-4 text-primary' />
                                                    ) : (
                                                        <Square className='h-4 w-4 text-gray-400' />
                                                    )}
                                                    <span>{u.fmG_GroupName}</span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                            {errors.groups && <FormError>{errors.groups.message}</FormError>}
                        </div>

                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                            <Label className='w-40'>
                                Voucher No <span className='text-red-500'>*</span>
                            </Label>
                            <InputText {...register('REF_REC_No')} error={errors.REF_REC_No?.message} />
                            {/* <InputText
                                                        {...register('chequeNo', {
                                                            onChange: (e) => {
                                                                const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                                                                e.target.value = onlyNumbers; // force update input
                                                            }
                                                        })}
                                                        placeholder='Enter Card Number'
                                                        error={errors.chequeNo?.message}
                                                    /> */}
                        </div>

                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                            {/* <Label className='w-40'>
                                Refund Date <span className='text-red-500'>*</span>
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant='outline' className='w-full justify-start text-left font-normal sm:w-96'>
                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                        {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0'>
                                    <Calendar mode='single' selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} />
                                </PopoverContent>
                            </Popover> */}
                            <Label className='w-40'>Refund Date:</Label>
                            <Input className='flex-1' type='date' value={chequeDate} onChange={(e) => setRefundDate(e.target.value)} />
                        </div>
                    </div>
                </div>
                {/* <div className='mt-6 space-y-5 rounded border bg-white p-5 shadow'>
              
                <div className='flex items-center justify-between border-b pb-3'>
                    <h3 className='font-semibold text-xl'>Fee Head List</h3>

                  
                    <div className='w-64'>
                        <Input placeholder='Search here...' value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

              
                <div className='overflow-auto'>
                    <table className='w-full border text-sm'>
                        <thead>
                            <tr className='bg-gray-100 text-center'>
                                <th className='border p-2'>SLNO</th>

                                <th className='border p-2'>
                                    <input type='checkbox' className='h-4 w-4' checked={selectedAll} onChange={toggleAll} />
                                </th>

                                <th className='border p-2'>Fee Head</th>
                                <th className='border p-2'>Installment</th>
                                <th className='border p-2'>Excess Amount</th>
                                <th className='border p-2'>Refund Amount</th>
                                <th className='border p-2'>Balance Amount</th>
                                <th className='border p-2'>Refund Over</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students
                                .filter((x) => JSON.stringify(x).toLowerCase().includes(search.toLowerCase()))
                                .map((row, i) => (
                                    <tr key={i} className='text-center odd:bg-gray-50'>
                                        <td className='border p-2'>{i + 1}</td>

                                        <td className='border p-2'>
                                            <input
                                                type='checkbox'
                                                className='h-4 w-4'
                                                checked={row.Selected}
                                                onChange={(e) => {
                                                    row.Selected = e.target.checked;
                                                    setStudents([...students]);
                                                }}
                                            />
                                        </td>

                                        <td className='border p-2'>{row.fmH_FeeName}</td>

                                        <td className='border p-2'>{row.ftI_Name}</td>

                                        <td className='border p-2'>{row.Amountall}</td>

                                        <td className='w-40 border p-2'>
                                            <Input
                                                type='number'
                                                min={0}
                                                max={row.Amountall}
                                                value={row.FR_RefundAmount || ''}
                                                onChange={(e) => updateRefund(row, Number(e.target.value))}
                                            />
                                            {(row.FR_RefundAmount ?? 0) > (row.Amountall ?? 0) && (
                                                <p className='text-red-600 text-xs'>Refund cannot exceed Excess</p>
                                            )}
                                        </td>

                                        <td className='border p-2'>{row.balamt ?? 0}</td>

                                        <td className='border p-2'>
                                            <input
                                                type='checkbox'
                                                className='h-4 w-4'
                                                checked={row.Selected1}
                                                onChange={(e) => {
                                                    row.Selected1 = e.target.checked;
                                                    setStudents([...students]);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

               
                <div className='mt-6 flex justify-center'>
                    <div className='flex w-full max-w-xl items-start gap-4'>
                       
                        <Label className='mt-1 whitespace-nowrap font-medium'>Narration:</Label>

                       
                        <Textarea
                            className='min-h-[50px] w-full resize rounded border p-3'
                            value={narration}
                            onChange={(e) => setNarration(e.target.value)}
                            placeholder='Enter your narration here...'
                        />
                    </div>
                </div>

               
                <div className='mt-6 flex justify-center'>
                    <div className='w-full max-w-xl rounded border bg-gray-50 p-6 text-center'>
                        
                        <div className='mb-4 flex justify-center gap-10'>
                            <Label className='flex items-center gap-2'>
                                <input
                                    type='radio'
                                    value='C'
                                    checked={paymentMode === 'C'}
                                    onChange={() => setPaymentMode('C')}
                                    className='h-4 w-4'
                                />
                                Cash
                            </Label>

                            <Label className='flex items-center gap-2'>
                                <input
                                    type='radio'
                                    value='B'
                                    checked={paymentMode === 'B'}
                                    onChange={() => setPaymentMode('B')}
                                    className='h-4 w-4'
                                />
                                Bank
                            </Label>

                            <Label className='flex items-center gap-2'>
                                <input
                                    type='radio'
                                    value='O'
                                    checked={paymentMode === 'O'}
                                    onChange={() => setPaymentMode('O')}
                                    className='h-4 w-4'
                                />
                                Online
                            </Label>
                        </div>

                      
                        {paymentMode === 'B' && (
                            <div className='mt-5 space-y-4'>
                               
                                <div className='flex items-center gap-4'>
                                    <Label className='w-40 text-right font-medium'>Bank Name:</Label>
                                    <Input className='flex-1' placeholder='Enter bank name' />
                                </div>

                               
                                <div className='flex items-center gap-4'>
                                    <Label className='w-40 text-right font-medium'>Cheque/DD No:</Label>
                                    <Input className='flex-1' placeholder='Enter cheque number' />
                                </div>

                                
                                <div className='flex items-center gap-4'>
                                    <Label className='w-40 text-right font-medium'>Cheque/DD Date:</Label>
                                    <Input className='flex-1' type='date' />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div> */}

                {headLoading && <div className='mt-6 text-center font-semibold text-blue-600'>Loading head details...</div>}

                {!headLoading && headError && <div className='mt-6 text-center font-semibold text-red-600'>{headError}</div>}
                {!headLoading && headData.length === 0 && (
                    <div className='mt-6 text-center font-semibold text-blue-600'> head details not found...</div>
                )}
                {!headLoading && headData.length > 0 && (
                    <div className='mt-6 space-y-5 rounded border bg-white p-5 shadow'>
                        {/* HEADER */}
                        <div className='flex items-center justify-between border-b pb-3'>
                            <h3 className='font-semibold text-xl'>Fee Head List</h3>

                            {/* Search */}
                            {/* <div className='w-64'>
                            <Input placeholder='Search here...' value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div> */}
                        </div>

                        {/* TABLE */}
                        <div className='overflow-auto'>
                            <table className='w-full border text-sm'>
                                <thead>
                                    <tr className='bg-gray-100 text-center'>
                                        <th className='border p-2'>SLNO</th>
                                        <th className='border p-2'>
                                            <input type='checkbox' className='h-4 w-4' checked={selectedAll} onChange={toggleAllHeads} />
                                        </th>
                                        <th className='border p-2'>Fee Head</th>
                                        <th className='border p-2'>Installment</th>
                                        <th className='border p-2'>Excess Amount</th>
                                        <th className='border p-2'>Refund Amount</th>
                                        <th className='border p-2'>Balance Amount</th>
                                        <th className='border p-2'>Refund Over</th>
                                    </tr>
                                </thead>

                                {/* <tbody>
                                {headData
                                    .filter((x) => x.fmH_FeeName.toLowerCase().includes(search.toLowerCase()))
                                    .map((row, i) => (
                                        <tr key={row.fsS_Id} className='text-center odd:bg-gray-50'>
                                            <td className='border p-2'>{i + 1}</td>

                                            <td className='border p-2'>
                                                <input
                                                    type='checkbox'
                                                    className='h-4 w-4'
                                                    checked={row.Selected || false}
                                                    onChange={(e) => {
                                                        row.Selected = e.target.checked;
                                                        setheadData([...headData]);
                                                    }}
                                                />
                                            </td>

                                            <td className='border p-2'>{row.fmH_FeeName}</td>
                                            <td className='border p-2'>{row.ftI_Name}</td>
                                            <td className='border p-2'>{row.fsS_RunningExcessAmount}</td>

                                            <td className='w-40 border p-2'>
                                                <Input
                                                    type='number'
                                                    min={0}
                                                    max={row.fsS_RunningExcessAmount}
                                                    value={row.fsS_RefundAmount || ''}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        row.fsS_RefundAmount = Math.min(val, row.fsS_RunningExcessAmount);
                                                        row.balamt = row.fsS_RunningExcessAmount - row.fsS_RefundAmount;
                                                        setheadData([...headData]);
                                                    }}
                                                />
                                                {(row.fsS_RefundAmount ?? 0) > row.fsS_RunningExcessAmount && (
                                                    <p className='text-red-600 text-xs'>Refund cannot exceed Excess</p>
                                                )}
                                            </td>

                                            <td className='border p-2'>{row.balamt ?? row.fsS_RunningExcessAmount}</td>

                                            <td className='border p-2'>
                                                <input
                                                    type='checkbox'
                                                    className='h-4 w-4'
                                                    checked={row.Selected1 || false}
                                                    onChange={(e) => {
                                                        row.Selected1 = e.target.checked;
                                                        setheadData([...headData]);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody> */}
                                <tbody>
                                    {headData.map((row, i) => (
                                        <tr key={i} className='text-center odd:bg-gray-50'>
                                            <td>{i + 1}</td>

                                            {/* SELECT ROW */}
                                            <td>
                                                <input
                                                    type='checkbox'
                                                    checked={row.Selected}
                                                    onChange={() => toggleHead(row)}
                                                    className='h-4 w-4'
                                                />
                                            </td>

                                            <td>{row.fmH_FeeName}</td>
                                            <td>{row.ftI_Name}</td>
                                            <td>{row.Amountall}</td>

                                            {/* REFUND AMOUNT */}
                                            <td className='w-40'>
                                                <Input
                                                    type='number'
                                                    min={0}
                                                    max={row.Amountall}
                                                    value={row.FR_RefundAmount ?? ''} // <-- FIX #1
                                                    onChange={(e) => updateRefund(row, Number(e.target.value))}
                                                />
                                                {row.FR_RefundAmount > row.Amountall && (
                                                    <p className='text-red-600 text-xs'>Refund cannot exceed Excess</p>
                                                )}
                                            </td>

                                            <td>{row.balamt}</td>

                                            {/* SELECTED1 */}
                                            <td>
                                                <input
                                                    type='checkbox'
                                                    checked={row.Selected1}
                                                    onChange={(e) => {
                                                        const updated = headData.map((h) =>
                                                            h === row ? { ...h, Selected1: e.target.checked } : h
                                                        ); // <-- FIX #2
                                                        setheadData(updated);
                                                    }}
                                                    className='h-4 w-4'
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* NARRATION */}
                        <div className='mt-6 flex justify-center'>
                            <div className='flex w-full max-w-xl items-start gap-4'>
                                <Label className='mt-1 whitespace-nowrap font-medium'>Narration:</Label>
                                <Textarea
                                    className='min-h-[50px] w-full resize rounded border p-3'
                                    value={narration}
                                    onChange={(e) => setNarration(e.target.value)}
                                    placeholder='Enter your narration here...'
                                />
                            </div>
                        </div>

                        {/* PAYMENT MODE */}
                        <div className='mt-6 flex justify-center'>
                            <div className='w-full max-w-xl rounded border bg-gray-50 p-6 text-center'>
                                <div className='mb-4 flex justify-center gap-10'>
                                    <Label className='flex items-center gap-2'>
                                        <input
                                            type='radio'
                                            value='C'
                                            checked={paymentMode === 'C'}
                                            onChange={() => setPaymentMode('C')}
                                            className='h-4 w-4'
                                        />
                                        Cash
                                    </Label>

                                    <Label className='flex items-center gap-2'>
                                        <input
                                            type='radio'
                                            value='B'
                                            checked={paymentMode === 'B'}
                                            onChange={() => setPaymentMode('B')}
                                            className='h-4 w-4'
                                        />
                                        Bank
                                    </Label>

                                    <Label className='flex items-center gap-2'>
                                        <input
                                            type='radio'
                                            value='O'
                                            checked={paymentMode === 'O'}
                                            onChange={() => setPaymentMode('O')}
                                            className='h-4 w-4'
                                        />
                                        Online
                                    </Label>
                                </div>

                                {/* BANK FIELDS */}
                                {paymentMode === 'B' && (
                                    <div className='mt-5 space-y-4'>
                                        {/* <div className='flex items-center gap-4'>
                                            <InputText
                                                label='Fee Bank Name'
                                                id='fR_BankName'
                                                {...register('fR_BankName')}
                                                error={errors.fR_BankName?.message}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                        </div> */}
                                        <div className='flex items-center gap-4'>
                                            <label htmlFor='fR_BankName' className='w-40 font-medium text-sm'>
                                                Fee Bank Name
                                            </label>

                                            <InputText
                                                id='fR_BankName'
                                                {...register('fR_BankName')}
                                                error={errors.fR_BankName?.message}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                        </div>

                                        <div className='flex items-center gap-4'>
                                            <Label className='w-40 text-right '>Cheque/DD Date:</Label>
                                            <Input
                                                className='flex-1'
                                                type='date'
                                                value={chequeDate}
                                                onChange={(e) => setChequeDate(e.target.value)}
                                            />
                                        </div>

                                        {/* <div className='flex items-center gap-4'>
                                            <Label className='w-40 text-right font-medium'>
                                                Cheque/DD No:<span className='text-red-500'>*</span>
                                            </Label>
                                            <Input className='flex-1' placeholder='Enter cheque number' />
                                            <InputText
                                                label='Cheque/DD No'
                                                required
                                                id='fR_CheqNo'
                                                {...register('fR_CheqNo')}
                                                error={errors.fR_CheqNo?.message}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                        </div> */}

                                        <div className='flex items-center gap-4'>
                                            <label htmlFor='fR_CheqNo' className='w-40 text-right'>
                                                Cheque/DD No:<span className='text-red-500'>*</span>
                                            </label>

                                            <div className='flex-1'>
                                                <InputText
                                                    id='fR_CheqNo'
                                                    {...register('fR_CheqNo')}
                                                    error={errors.fR_CheqNo?.message}
                                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    {/* <Button
                        type='button'
                        variant='outline'
                        size='lg'
                        onClick={resetAllFormState}
                        className='w-full transition-all duration-200 hover:scale-105 sm:w-auto'>
                        Reset
                    </Button>
                    <Button
                        type='button'
                        size='lg'
                        onClick={onSubmit}
                        isLoading={saving}
                        className='w-full transition-all duration-200 hover:scale-105 sm:w-auto'>
                        <Save className='mr-2 h-5 w-5' />
                        Save
                    </Button> */}
                    <Button
                        type='button'
                        variant='outline'
                        size='lg'
                        onClick={resetAllFormState}
                        className='w-full transition-all duration-200 hover:scale-105 sm:w-auto'>
                        Reset
                    </Button>

                    {/* <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save
                        </div>
                    </Button> */}
                    <Button
                        type='submit'
                        disabled={isSubmitting || headData.length === 0 || headData.every((h) => !h.Selected) || !paymentMode}
                        className='w-full transition-all duration-200 hover:scale-105 sm:w-auto'>
                        {isSubmitting ? 'Saving...' : 'Save Master Fee Refundable'}
                        <Save className='mr-2 h-5 w-5' />
                        {/* Save */}
                    </Button>
                </div>
            </form>
        </div>
    );
}

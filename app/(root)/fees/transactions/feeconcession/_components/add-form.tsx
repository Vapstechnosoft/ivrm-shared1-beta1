// file: _components/add-form.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { useFormContext as useGlobalFormContext } from '@/components/ui/form/form-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useFeeConcessionAdmissionNo,
    useFeeConcessionCategoryDropdowndata,
    useFeeConcessionCategoryFeeConcessionDropdowndata,
    useFeeConcessionClassDropdowndata,
    useFeeConcessionConfigSet,
    useFeeConcessionEdit,
    useFeeConcessionStudentData,
    useFeeConcessionStudentList,
    useFeeConcessionTermDropdowndata,
    useconcessionacademicyerdropdowndatafee
} from '@/hooks/fees/useTrasactions';
import { getconcessionheadgriddatadetails, saveFeeHead } from '@/server/fees/trasactions/FeeConcession';
import type { ColumnDef } from '@tanstack/react-table';
import { Save, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const MI_ID = 0;

interface StudentRow {
    amst_Id: number;
    amsT_FirstName: string;
    amsT_MiddleName: string;
    amsT_LastName: string;
    registrationNo: string;
    admNo: string;
    rollNo: number;
    checked: boolean;
}

interface HeadRow {
    slno: number;
    fmH_Id: number;
    fmG_Id?: number;
    ftI_Id?: number;
    fmH_FeeName: string;
    ftI_Name: string;
    fmA_Amount: number;
    type: 'Amount' | 'Percentage' | '';
    concessionValue: number;
    remarks: string;
    checked: boolean;
    fsciId?: number; // Add this for edit mode
    fscId?: number; // Add this for edit mode
}

type AddFeeConcessionFormProps = {
    onSuccess?: () => void;
    pageAcademicYear?: number | null;
};

export default function AddFeeConcessionForm({ onSuccess, pageAcademicYear }: AddFeeConcessionFormProps) {
    const { control, watch, reset, setValue } = useForm();
    const { isEditFormOpen, selectedRow } = useGlobalFormContext<any>();

    const [selectionType, setSelectionType] = useState<
        'classwise' | 'categorywise' | 'leftstudent' | 'feecategorywise' | 'Admissionnosearch' | 'Staff' | 'Others'
    >('classwise');
    const [loadingheads, setLoadingHeads] = useState(false);
    const [studentSearch, setStudentSearch] = useState('');
    const [headSearch, setHeadSearch] = useState('');
    const [students, setStudents] = useState<StudentRow[]>([]);
    const [heads, setHeads] = useState<HeadRow[]>([]);
    const [saving, setSaving] = useState(false);
    const [selectedStudentAmstId, setSelectedStudentAmstId] = useState<number>(0);
    const [loadingTermDetails, setLoadingTermDetails] = useState(false);

    const searchParams = useSearchParams();
    const academicYearId = watch('academicYearId');
    const classId = watch('classId');
    const categoryId = watch('categoryId');
    const feeCategoryId = watch('feeCategoryId');
    const termIds: string[] = watch('termIds') || [];
    const admissionNo = watch('admissionNo');

    const { data: configSetData } = useFeeConcessionConfigSet(Number(academicYearId || 0));
    const configSettings = configSetData?.data?.[0];
    const groupOrTermFlg = configSettings?.fmC_GroupOrTermFlg;
    const enableStaffTrans = configSettings?.fmC_EableStaffTrans === 1;
    const enableOtherStudentTrans = configSettings?.fmC_EableOtherStudentTrans === 1;

    const { data: academicYears, isLoading: loadingAY } = useconcessionacademicyerdropdowndatafee(MI_ID);
    const { data: terms, isLoading: loadingTerms } = useFeeConcessionTermDropdowndata(String(groupOrTermFlg), Number(academicYearId || 0));
    const { data: classes, isLoading: loadingClasses } = useFeeConcessionClassDropdowndata(MI_ID);
    const { data: categories, isLoading: loadingCategories } = useFeeConcessionCategoryDropdowndata(MI_ID);
    const { data: feeConcessionCategories, isLoading: loadingfeeConcessionCategories } =
        useFeeConcessionCategoryFeeConcessionDropdowndata();

    const selectedAmstIdFromAdm = selectedStudentAmstId;
    const apiSearchParams = searchParams ? Object.fromEntries(searchParams.entries()) : {};

    const hasFilterId =
        selectionType === 'classwise' || selectionType === 'leftstudent'
            ? !!classId
            : selectionType === 'categorywise'
              ? !!categoryId
              : selectionType === 'feecategorywise'
                ? !!feeCategoryId
                : selectionType === 'Admissionnosearch'
                  ? !!admissionNo
                  : false;

    const shouldFetchStudentsNormally = !!academicYearId && hasFilterId && selectionType !== 'Admissionnosearch';

    const studentQuery = useFeeConcessionStudentList(
        String(selectionType || ''),
        Number(academicYearId || 0),
        Number(classId || 0),
        Number(categoryId || 0),
        Number(feeCategoryId || 0),
        apiSearchParams as any
    );

    const normalizeArray = (resp: any): any[] => {
        if (!resp) return [];
        if (Array.isArray(resp)) return resp;
        if (resp.data && Array.isArray(resp.data)) return resp.data;
        if (resp.result && Array.isArray(resp.result)) return resp.result;
        if (typeof resp === 'object') {
            for (const v of Object.values(resp)) {
                if (Array.isArray(v)) return v;
            }
        }
        return [];
    };

    useEffect(() => {
        if (pageAcademicYear && !watch('academicYearId')) {
            setValue('academicYearId', Number(pageAcademicYear));
        }
    }, [pageAcademicYear, setValue, watch]);

    // Normal student fetch (non-Admissionnosearch modes)
    useEffect(() => {
        if (isEditFormOpen || selectionType === 'Admissionnosearch') return;

        const rows = normalizeArray(studentQuery.data);
        if (rows.length > 0 && shouldFetchStudentsNormally) {
            const mapped = rows.map((s: any) => ({
                amst_Id: s.amsT_Id ?? s.AMST_Id ?? 0,
                amsT_FirstName: s.amsT_FirstName ?? '',
                amsT_MiddleName: s.amsT_MiddleName ?? '',
                amsT_LastName: s.amsT_LastName ?? '',
                registrationNo: s.amsT_RegistrationNo ?? '—',
                admNo: s.amsT_AdmNo ?? '—',
                rollNo: s.amaY_RollNo ?? 0,
                checked: false
            }));
            setStudents(mapped);
            setStudentSearch('');
        } else {
            setStudents([]);
        }
    }, [studentQuery.data, shouldFetchStudentsNormally, isEditFormOpen, selectionType]);

    // Fetch full student data when admissionNo is selected
    const { data: singleStudentData } = useFeeConcessionStudentData(
        Number(academicYearId || 0),
        selectedAmstIdFromAdm,
        apiSearchParams as any
    );

    useEffect(() => {
        // Only check if terms are selected (since data loads after term selection)
        if (termIds.length === 0) return;

        // Skip during edit mode
        if (isEditFormOpen) return;

        // For normal search modes
        if (selectionType !== 'Admissionnosearch') {
            const rows = normalizeArray(studentQuery.data);
            if (!studentQuery.isLoading && rows.length === 0) {
                toast.info('No Student Details Found For Selected Criteria');
            }
            // else{
            //     toast.success("Students Data Loaded Successfully");
            // }
        }

        // For admission number search
        if (selectionType === 'Admissionnosearch' && admissionNo) {
            const rows = normalizeArray(singleStudentData);
            if (!studentQuery.isLoading && rows.length === 0) {
                toast.info('No Student Details Found For Selected Admission Number');
            }
            // else{
            //     toast.success("Students Data Loaded Successfully");
            // }
        }
    }, [termIds, studentQuery.data, singleStudentData, studentQuery.isLoading, selectionType, admissionNo, isEditFormOpen]);

    // Admissionnosearch mode: load single student
    useEffect(() => {
        if (selectionType !== 'Admissionnosearch' || !singleStudentData || isEditFormOpen) return;

        const rows = normalizeArray(singleStudentData);
        if (rows.length > 0) {
            const s = rows[0];
            const studentRow: StudentRow = {
                amst_Id: s.amsT_Id ?? 0,
                amsT_FirstName: s.amsT_FirstName ?? '',
                amsT_MiddleName: s.amsT_MiddleName ?? '',
                amsT_LastName: s.amsT_LastName ?? '',
                registrationNo: s.amsT_RegistrationNo ?? '—',
                admNo: s.amsT_AdmNo ?? '—',
                rollNo: s.amaY_RollNo ?? 0,
                checked: true
            };
            setStudents([studentRow]);
        } else {
            setStudents([]);
        }
    }, [singleStudentData, selectionType, isEditFormOpen]);

    const selectedStudent = students.find((s) => s.checked);
    const selectedAmsT_Id = selectedStudent?.amst_Id || 0;

    const shouldShowHeads = students.length > 0 && (termIds.length > 0 || isEditFormOpen);

    const selectedTermIds = useMemo(() => {
        return (termIds || []).map(Number).filter(Boolean);
    }, [termIds]);

    // Head loading useEffect - SKIP DURING EDIT MODE
    useEffect(() => {
        // CRITICAL: Skip if in edit mode - heads are already loaded from editResponse
        if (isEditFormOpen) {
            console.log('Skipping head loading - edit mode active');
            return;
        }

        if (!selectedAmsT_Id || selectedTermIds.length === 0) return;

        setLoadingHeads(true);

        getconcessionheadgriddatadetails({
            asmayId: Number(academicYearId),
            amstId: selectedAmsT_Id,
            configSet: String(groupOrTermFlg),
            fmgIds: selectedTermIds
        })
            .then((res) => {
                const rows = normalizeArray(res);
                setHeads(
                    rows.map((h: any, i: number) => ({
                        slno: i + 1,
                        fmH_Id: h.fmH_Id,
                        fmG_Id: h.fmG_Id,
                        ftI_Id: h.ftI_Id,
                        fmH_FeeName: h.fmH_FeeName,
                        ftI_Name: h.ftI_Name ?? 'Yearly',
                        fmA_Amount: h.fmA_Amount ?? 0,
                        type: '',
                        concessionValue: 0,
                        remarks: '',
                        checked: false
                    }))
                );
            })
            .finally(() => setLoadingHeads(false));
    }, [selectedAmsT_Id, selectedTermIds, academicYearId, groupOrTermFlg, isEditFormOpen]);

    // Clear form when selection type changes - BUT NOT IN EDIT MODE
    useEffect(() => {
        // Don't clear data during edit mode
        if (isEditFormOpen) return;

        setStudents([]);
        setHeads([]);
        setStudentSearch('');
        setHeadSearch('');
        setValue('classId', undefined);
        setValue('categoryId', undefined);
        setValue('feeCategoryId', undefined);
        setValue('admissionNo', undefined);
        setValue('termIds', []);
        setSelectedStudentAmstId(0);
    }, [selectionType, setValue, isEditFormOpen]);

    const filteredStudents = useMemo(
        () =>
            students.filter((s) => {
                const fullName = `${s.amsT_FirstName} ${s.amsT_MiddleName} ${s.amsT_LastName}`.trim().toLowerCase();
                const search = studentSearch.toLowerCase();
                return fullName.includes(search) || s.admNo.toLowerCase().includes(search);
            }),
        [students, studentSearch]
    );

    const filteredHeads = useMemo(
        () =>
            heads.filter((h) => {
                const search = headSearch.toLowerCase();
                return h.fmH_FeeName.toLowerCase().includes(search) || (h.ftI_Name || '').toLowerCase().includes(search);
            }),
        [heads, headSearch]
    );

    const toggleStudent = (amst_Id: number) => {
        setStudents((prev) => prev.map((s) => ({ ...s, checked: s.amst_Id === amst_Id })));
    };

    // Memoized update functions to prevent unnecessary re-renders
    const updateHeadType = useCallback((index: number, type: 'Amount' | 'Percentage') => {
        setHeads((prev) => prev.map((item, idx) => (idx === index ? { ...item, type, concessionValue: 0 } : item)));
    }, []);

    const updateHeadConcession = useCallback((index: number, value: number) => {
        setHeads((prev) => prev.map((item, idx) => (idx === index ? { ...item, concessionValue: value } : item)));
    }, []);

    const updateHeadRemarks = useCallback((index: number, remarks: string) => {
        setHeads((prev) => prev.map((item, idx) => (idx === index ? { ...item, remarks } : item)));
    }, []);

    const toggleHeadChecked = useCallback((index: number, checked: boolean) => {
        setHeads((prev) => prev.map((item, idx) => (idx === index ? { ...item, checked } : item)));
    }, []);

    const studentColumns: ColumnDef<StudentRow>[] = [
        {
            id: 'select',
            header: () => <div className='w-10' />,
            cell: ({ row }) => <Checkbox checked={row.original.checked} onCheckedChange={() => toggleStudent(row.original.amst_Id)} />,
            size: 50
        },
        {
            accessorKey: 'slno',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
            cell: ({ row, table }) => {
                const index = table.getSortedRowModel().rows.findIndex((r) => r.id === row.id);
                return <div className='pl-6'>{index + 1}</div>;
            }
        },
        { accessorKey: 'admNo', header: 'Adm No', size: 140 },
        { accessorKey: 'registrationNo', header: 'Reg No', size: 140 },
        {
            accessorFn: (row) => `${row.amsT_FirstName} ${row.amsT_MiddleName} ${row.amsT_LastName}`.trim(),
            id: 'fullName',
            header: 'Student Name'
        },
        {
            accessorKey: 'rollNo',
            header: 'Roll No',
            size: 80,
            cell: ({ row }) => <div className='text-center'>{row.original.rollNo || '-'}</div>
        }
    ];

    const headColumns: ColumnDef<HeadRow>[] = [
        {
            accessorKey: 'slno',
            header: 'S.No',
            size: 70,
            cell: ({ row }) => <div className='text-center'>{row.original.slno}</div>
        },
        {
            id: 'select',
            header: () => <></>,
            cell: ({ row }) => (
                <Checkbox checked={row.original.checked} onCheckedChange={(checked) => toggleHeadChecked(row.index, !!checked)} />
            ),
            size: 60
        },
        {
            accessorKey: 'fmH_FeeName',
            header: 'Fee Head',
            size: 300,
            cell: ({ row }) => <div>{row.original.fmH_FeeName}</div>
        },
        {
            accessorKey: 'ftI_Name',
            header: 'Installment',
            size: 160,
            cell: ({ row }) => <div>{row.original.ftI_Name}</div>
        },
        {
            id: 'type',
            header: 'Type',
            size: 160,
            cell: ({ row }) => (
                <Select
                    value={row.original.type || ''}
                    onValueChange={(value) => updateHeadType(row.index, value as 'Amount' | 'Percentage')}>
                    <SelectTrigger className='h-9'>
                        <SelectValue placeholder='Select' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='Amount'>Amount</SelectItem>
                        <SelectItem value='Percentage'>Percentage</SelectItem>
                    </SelectContent>
                </Select>
            )
        },
        {
            accessorKey: 'fmA_Amount',
            header: 'Amount',
            size: 140,
            cell: ({ row }) => <div className='pr-3 text-right font-medium'>{row.original.fmA_Amount?.toLocaleString() || '0'}</div>
        },
        // {
        //     id: 'concession',
        //     header: 'Concession',
        //     size: 200,
        //     cell: ({ row }) => {
        //         const isPercentage = row.original.type === 'Percentage';

        //         return (
        //             <Input
        //                 type='number'
        //                 min='0'
        //                 max={isPercentage ? 100 : undefined}
        //                 placeholder={isPercentage ? '0-100' : '0'}
        //                 className='text-right'
        //                 value={row.original.concessionValue || ''}
        //                 onChange={(e) => {
        //                     const raw = e.target.value;
        //                     const val = raw === '' ? 0 : Number(raw);
        //                     updateHeadConcession(row.index, val);
        //                 }}
        //             />
        //         );
        //     }
        // },
        {
            id: 'concession',
            header: 'Concession',
            size: 200,
            cell: ({ row }) => {
                const isPercentage = row.original.type === 'Percentage';

                return (
                    <Input
                        type='number'
                        min='0'
                        max={isPercentage ? 100 : undefined}
                        placeholder={isPercentage ? '0-100' : '0'}
                        className='text-right'
                        defaultValue={row.original.concessionValue ?? ''}
                        onBlur={(e) => {
                            const raw = e.target.value;
                            const val = raw === '' ? 0 : Number(raw);

                            setHeads((prev) => prev.map((item, idx) => (idx === row.index ? { ...item, concessionValue: val } : item)));
                        }}
                    />
                );
            }
        },
        // {
        //     id: 'remarks',
        //     header: 'Remarks',
        //     size: 280,
        //     cell: ({ row }) => (
        //         <Input
        //             placeholder='Optional'
        //             value={row.original.remarks || ''}
        //             onChange={(e) => updateHeadRemarks(row.index, e.target.value)}
        //         />
        //     )
        // }

        {
            id: 'remarks',
            header: 'Remarks',
            size: 280,
            cell: ({ row }) => {
                const [localValue, setLocalValue] = useState(row.original.remarks || '');

                return (
                    <Input
                        placeholder='Optional'
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onBlur={(e) => {
                            setHeads((prev) => prev.map((item, idx) => (idx === row.index ? { ...item, remarks: e.target.value } : item)));
                        }}
                    />
                );
            }
        }
    ];

    const editAsmaY = Number(selectedRow?.asmaY_Id ?? selectedRow?.asmaYId ?? selectedRow?.ASMAY_Id ?? pageAcademicYear ?? 0);
    const editFsciId = Number(selectedRow?.fscI_ID ?? selectedRow?.fscIId ?? selectedRow?.fsciId ?? selectedRow?.fsC_Id ?? 0);
    const { data: editResponse } = useFeeConcessionEdit(editAsmaY, editFsciId, apiSearchParams as any);

    // EDIT MODE: Load and bind all data
    useEffect(() => {
        if (!isEditFormOpen || !editResponse) return;

        console.log('editResponse', editResponse);

        const rows = normalizeArray(editResponse);

        console.log('rows', rows);
        if (rows.length === 0) return;

        const firstRow = rows[0];

        // Set Academic Year
        const ayId = Number(firstRow.asmaY_Id ?? firstRow.ASMAY_Id ?? editAsmaY ?? 0);
        if (ayId > 0) setValue('academicYearId', ayId);

        // Determine selection type based on data
        let newSelectionType: typeof selectionType = 'Admissionnosearch';

        if (firstRow.asmcL_ID || firstRow.asmcL_Id || firstRow.classname) {
            newSelectionType = 'classwise';
            setValue('classId', Number(firstRow.asmcL_ID ?? firstRow.asmcL_Id ?? 0));
        } else if (firstRow.fmcC_Id || firstRow.fmcCId) {
            newSelectionType = 'feecategorywise';
            setValue('feeCategoryId', String(firstRow.fmcC_Id ?? firstRow.fmcCId ?? ''));
        } else if (firstRow.amsT_AdmNo) {
            newSelectionType = 'Admissionnosearch';
            setValue('admissionNo', String(firstRow.amsT_AdmNo));
        }

        setSelectionType(newSelectionType);

        // Set Term IDs from the data
        const termIdsFromData = Array.from(new Set(rows.map((r: any) => r.fmT_Id ?? r.fmG_Id ?? r.ftI_Id).filter(Boolean))).map(String);

        if (termIdsFromData.length > 0) {
            setValue('termIds', termIdsFromData);
        }

        // Set Student data
        const studentEntry: StudentRow = {
            amst_Id: Number(firstRow.amst_Id ?? firstRow.AMST_Id ?? 0),
            amsT_FirstName: firstRow.amsT_FirstName ?? '',
            amsT_MiddleName: firstRow.amsT_MiddleName ?? '',
            amsT_LastName: firstRow.amsT_LastName ?? '',
            registrationNo: firstRow.amsT_RegistrationNo ?? '—',
            admNo: firstRow.amsT_AdmNo ?? '—',
            rollNo: firstRow.amaY_RollNo ?? 0,
            checked: true
        };
        setStudents([studentEntry]);

        // IMPORTANT: Set selectedStudentAmstId for any dependent effects
        setSelectedStudentAmstId(studentEntry.amst_Id);

        // Map Head data with all values properly bound
        const mappedHeads: HeadRow[] = rows.map((r: any, i: number) => {
            // Determine concession type (case insensitive)
            const concessionType = r.fsC_ConcessionType || r.fscI_ConcessionType || '';
            const type = concessionType.toLowerCase() === 'percentage' ? 'Percentage' : 'Amount';

            // Get concession value from various possible field names
            const concessionValue = Number(r.fscI_ConcessionAmount ?? r.fsC_ConcessionAmount ?? r.concessionValue ?? 0);

            // Get remarks from various possible field names
            const remarks = r.fsC_ConcessionReason ?? r.remarks ?? r.fscI_Remarks ?? '';

            return {
                slno: i + 1,
                fmH_Id: Number(r.fmH_Id ?? r.FMH_Id ?? 0),
                fmG_Id: Number(r.fmG_Id ?? r.FMG_Id ?? 0),
                ftI_Id: Number(r.ftI_Id ?? r.FTI_Id ?? 0),
                fmH_FeeName: r.fmH_FeeName ?? r.FMH_FeeName ?? '',
                ftI_Name: r.ftI_Name ?? r.FTI_Name ?? 'Yearly',
                fmA_Amount: Number(r.fmA_Amount ?? r.FMA_Amount ?? 0),
                type: type,
                concessionValue: concessionValue,
                remarks: remarks,
                checked: true
            };
        });

        console.log('Mapped heads for edit:', mappedHeads);
        setHeads(mappedHeads);
    }, [isEditFormOpen, editResponse, setValue, editAsmaY]);

    const onSubmit = async () => {
        const selectedStudent = students.find((s) => s.checked);
        if (!selectedStudent) return toast.error('Please select a student');

        if (!termIds.length && !isEditFormOpen) return toast.error('Select Term');

        if (heads.length === 0) return toast.error('No fee heads loaded');

        const selectedHeads = heads.filter((h) => h.checked && h.concessionValue > 0);
        if (selectedHeads.length === 0) return toast.error('Please apply concession on at least one head');

        try {
            setSaving(true);

            const SaveTempData = [{ AMST_Id: selectedStudent.amst_Id }];

            const SaveTempData1 = selectedHeads.map((h) => ({
                FMG_Id: h.fmG_Id || 0,
                FMH_Id: h.fmH_Id,
                FTI_Id: h.ftI_Id || 0,
                FSC_ConcessionReason: h.remarks || '',
                FSCI_ConcessionAmount: h.concessionValue,
                FSC_ConcessionType: h.type || 'Amount'
            }));

            const payload: any = {
                ASMAY_Id: Number(academicYearId),
                SaveTempData,
                SaveTempData1,
                RadioBtnValue: selectionType
            };

            if (isEditFormOpen && selectedRow) {
                payload.FSC_Id = Number(selectedRow?.FSC_Id ?? selectedRow?.fsc_Id ?? selectedRow?.fsC_Id ?? 0);
                payload.FSCI_ID = Number(selectedRow?.FSCI_ID ?? selectedRow?.fsci_Id ?? selectedRow?.fscI_ID ?? selectedRow?.fscIId ?? 0);
            }

            console.log('consession payload:', JSON.stringify(payload));

            const response = await saveFeeHead(payload);

            const message =
                response?.data?.message ||
                response?.message ||
                (isEditFormOpen ? 'Fee Concession Updated Successfully!' : 'Fee Concession Saved Successfully!');

            toast.success(message);

            reset();
            setStudents([]);
            setHeads([]);
            setStudentSearch('');
            setHeadSearch('');
            onSuccess?.();
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to save concession';
            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const showTermField = selectionType === 'Admissionnosearch' ? !!academicYearId && !!admissionNo : !!academicYearId && hasFilterId;
    const showStudentTable = students.length > 0 && (termIds.length > 0 || isEditFormOpen);

    const radioOptions = [
        { value: 'classwise', label: 'Class Wise' },
        { value: 'categorywise', label: 'Adm Category Wise' },
        { value: 'leftstudent', label: 'Left Student' },
        { value: 'feecategorywise', label: 'Fee Concession Category' },
        { value: 'Admissionnosearch', label: 'Admission No Search' },
        ...(enableStaffTrans ? [{ value: 'Staff', label: 'Staff' }] : []),
        ...(enableOtherStudentTrans ? [{ value: 'Others', label: 'Others' }] : [])
    ];

    return (
        <div className='mx-auto max-w-7xl space-y-8 p-4 md:p-6'>
            <Card className='overflow-hidden border-2 border-blue-100 pb-9 shadow-xl'>
                <CardContent className='p-4'>
                    <div className='flex justify-center'>
                        <RadioGroup
                            value={selectionType}
                            onValueChange={(v) => setSelectionType(v as any)}
                            className='flex flex-wrap justify-center gap-4 rounded-2xl p-4'>
                            {radioOptions.map((item) => (
                                <div key={item.value} className='flex items-center space-x-4'>
                                    <RadioGroupItem value={item.value} id={item.value} className='h-6 w-6 border-2' />
                                    <Label
                                        htmlFor={item.value}
                                        className='cursor-pointer font-semibold text-gray-800 text-sm transition-all'>
                                        {item.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </CardContent>
                <CardContent className='space-y-6 pt-6'>
                    <div className='grid gap-6 md:grid-cols-2'>
                        <div className='flex flex-col gap-2'>
                            <Label className='font-medium'>
                                Academic Year <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='academicYearId'
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                        <SelectTrigger className='h-12'>
                                            <SelectValue placeholder={loadingAY ? 'Loading...' : 'Select Academic Year'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {academicYears?.data?.map((ay: any) => (
                                                <SelectItem key={ay.asmaY_Id} value={String(ay.asmaY_Id)}>
                                                    {ay.asmaY_Year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        {(selectionType === 'classwise' || selectionType === 'leftstudent') && (
                            <div className='flex flex-col gap-2'>
                                <Label className='font-medium'>
                                    Class <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='classId'
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                            <SelectTrigger className='h-12'>
                                                <SelectValue placeholder={loadingClasses ? 'Loading...' : 'Select Class'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {classes?.data?.map((cls: any) => (
                                                    <SelectItem key={cls.asmcL_Id} value={String(cls.asmcL_Id)}>
                                                        {cls.asmcL_ClassName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        )}

                        {selectionType === 'categorywise' && (
                            <div className='flex flex-col gap-2'>
                                <Label className='font-medium'>
                                    Category <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='categoryId'
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                            <SelectTrigger className='h-12'>
                                                <SelectValue placeholder={loadingCategories ? 'Loading...' : 'Select Category'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories?.data?.map((cat: any) => (
                                                    <SelectItem key={cat.fmcC_Id} value={String(cat.fmcC_Id)}>
                                                        {cat.fmcC_ConcessionName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        )}

                        {selectionType === 'feecategorywise' && (
                            <div className='flex flex-col gap-2'>
                                <Label className='font-medium'>
                                    Fee Concession Category <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='feeCategoryId'
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                            <SelectTrigger className='h-12'>
                                                <SelectValue
                                                    placeholder={loadingfeeConcessionCategories ? 'Loading...' : 'Select Category'}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {feeConcessionCategories?.data?.map((cat: any) => (
                                                    <SelectItem key={cat.fmcC_Id} value={String(cat.fmcC_Id)}>
                                                        {cat.fmcC_ConcessionName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        )}

                        {selectionType === 'Admissionnosearch' && (
                            <div className='flex flex-col gap-2'>
                                <Label className='font-medium'>
                                    Admission No <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='admissionNo'
                                    render={({ field }) => {
                                        const [searchQuery, setSearchQuery] = useState('');
                                        const [open, setOpen] = useState(false);

                                        const { data: admissionNoData, isLoading: loadingAdmNo } = useFeeConcessionAdmissionNo(
                                            Number(academicYearId || 0),
                                            searchQuery,
                                            apiSearchParams as any
                                        );

                                        const admissionOptions = useMemo(() => {
                                            let items: any[] = [];
                                            const raw = admissionNoData?.data || admissionNoData;

                                            if (Array.isArray(raw)) {
                                                items = raw;
                                            } else if (raw && typeof raw === 'object' && 'amsT_AdmNo' in raw) {
                                                items = [raw];
                                            }

                                            return items.map((item: any) => ({
                                                value: String(item.amsT_AdmNo ?? ''),
                                                label: String(item.amsT_AdmNo ?? ''),
                                                amst_Id: Number(item.amst_Id ?? 0)
                                            }));
                                        }, [admissionNoData]);

                                        return (
                                            <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant='outline'
                                                        aria-expanded={open}
                                                        className='h-12 w-full justify-between text-left font-normal'>
                                                        {field.value
                                                            ? field.value
                                                            : loadingAdmNo
                                                              ? 'Searching...'
                                                              : 'Search Admission No...'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-full p-0' align='start'>
                                                    <Command>
                                                        <CommandInput
                                                            placeholder='Type to search admission no...'
                                                            value={searchQuery}
                                                            onValueChange={(value) => {
                                                                setSearchQuery(value);
                                                                if (value.length > 0) setOpen(true);
                                                            }}
                                                            autoFocus
                                                        />
                                                        <CommandEmpty>
                                                            {searchQuery ? 'No results found' : 'Start typing to search'}
                                                        </CommandEmpty>
                                                        <CommandGroup className='max-h-48 overflow-auto'>
                                                            {admissionOptions.map((opt) => (
                                                                <CommandItem
                                                                    key={opt.value}
                                                                    onSelect={() => {
                                                                        field.onChange(opt.value);
                                                                        setSelectedStudentAmstId(opt.amst_Id);
                                                                        setOpen(false);
                                                                        setSearchQuery(opt.label);
                                                                    }}>
                                                                    {opt.label}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        );
                                    }}
                                />
                            </div>
                        )}

                        {showTermField && (
                            <div className='flex flex-col gap-2'>
                                <Label className='font-medium'>
                                    Term Name <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='termIds'
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={
                                                terms?.data?.map((t: any) => ({ label: t.fmG_GroupName, value: String(t.fmG_Id) })) || []
                                            }
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || []}
                                            placeholder={loadingTerms ? 'Loading...' : 'Select Terms'}
                                            className='h-12'
                                        />
                                    )}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {showStudentTable && (
                <Card className='shadow-xl'>
                    <CardHeader className='text-black'>
                        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                            <CardTitle className='text-2xl'>Student List ({selectedStudent ? 1 : 0} selected)</CardTitle>
                            <Input
                                placeholder='Search by name or admission no...'
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                                className='h-10 w-full sm:max-w-sm'
                            />
                        </div>
                    </CardHeader>
                    <CardContent className='p-6'>
                        <div className='overflow-hidden rounded-lg border bg-white'>
                            <GenericDataTable
                                columns={studentColumns}
                                data={filteredStudents}
                                isLoading={studentQuery.isLoading || (selectionType === 'Admissionnosearch' && !singleStudentData)}
                                totalItems={filteredStudents.length}
                                isPaginationRequired={false}
                                isSearchRequired={false}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {(loadingheads || heads.length > 0) && (
                <Card className='shadow-xl'>
                    <CardHeader className='text-black'>
                        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                            <CardTitle className='text-2xl'>Fee Head List</CardTitle>
                            <Input
                                placeholder='Search fee head or installment...'
                                value={headSearch}
                                onChange={(e) => setHeadSearch(e.target.value)}
                                className='h-10 w-full sm:max-w-sm'
                            />
                        </div>
                    </CardHeader>
                    <CardContent className='p-6'>
                        <div className='overflow-hidden rounded-lg border bg-white'>
                            <GenericDataTable
                                columns={headColumns}
                                data={filteredHeads}
                                isLoading={loadingheads}
                                totalItems={filteredHeads.length}
                                isPaginationRequired={false}
                                isSearchRequired={false}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className='flex flex-col-reverse gap-4 border-t pt-6 sm:flex-row sm:justify-start'>
                <Button
                    size='lg'
                    variant='outline'
                    onClick={() => {
                        reset();
                        setStudents([]);
                        setHeads([]);
                        setStudentSearch('');
                        setHeadSearch('');
                    }}
                    className='w-full transition-all duration-200 hover:scale-105 sm:w-auto'>
                    <X className='mr-2 h-5 w-5' /> Cancel
                </Button>
                <Button
                    size='lg'
                    onClick={onSubmit}
                    disabled={saving || !selectedStudent}
                    isLoading={saving}
                    className='w-full transition-all duration-200 hover:scale-105 sm:w-auto'>
                    <Save className='mr-2 h-5 w-5' />
                    Save Concession
                </Button>
            </div>
        </div>
    );
}

// app/(root)/fees/feereports/feedefaulterreport/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { feeSpecialHeadDROPDOWN, useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { useFeeClassListDefaulterreport, useFeeSectionListDefaulterreport } from '@/hooks/fees/useReports';
import { cn } from '@/lib/utils';
import { feeDefaulterreportStthomas } from '@/schemas/fees/reports';
import { getFeesSectionListByClassId } from '@/server/fees/reports/fee_DefaulterReport';
import type { IspecialFeeHeadDropdownList } from '@/types/fees/masters';
import type { IFeeClassDropdownList, IFeeSectionDropdownList } from '@/types/fees/reports/reports';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import { CheckSquare, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from 'react-aria-components';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import DataTablePrint from './_components/datatable_print';
import { exportToExcel, printTabl } from './_components/export_and_excel';

type FormFields = z.infer<typeof feeDefaulterreportStthomas>;

interface IAcademicYear {
    asmaY_Id: string | number;
    asmaY_Year: string;
    asmaY_Order?: number;
}

export default function FeeDefaulterReportstthomas() {
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        reportType: 'All',
        academicYearId: '',
        classId: '',
        sectionId: '',
        feeTerm: '',
        studentId: '',
        filterdata: 'NameRegNo'
    });

    const {
        control,
        setValue,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feeDefaulterreportStthomas),
        defaultValues: {
            academicYearId: '',
            reportType: 'All',
            classId: '',
            sectionId: '',
            feeTerm: '',
            studentId: ''
        }
    });

    const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
    const [reportLoading, setReportLoading] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [reportData, setReportData] = useState<FeeDefaulterRow[]>([]);

    const [classes, setClasses] = useState<IFeeClassDropdownList[]>([]);
    const [sections, setSections] = useState<IFeeSectionDropdownList[]>([]);
    const [SectionLoading, setSectionLoading] = useState(false);

    const [termSearch, setTermSearch] = useState('');
    const [selectedHeadsItems, setSelectedHeadsItems] = useState<{ fmH_Id: string }[]>([]);
    const [showPrint, setShowPrint] = useState(false);

    type FeeDefaulterRow = {
        id: number;
        studentName: string;
        regNo: string;
        class: string;
        section: string;
        feeTerm: string;
        totalAmount: number;
        paidAmount: number;
        balanceAmount: number;
        dueDate: string;
        status: string;
    };

    // Hooks
    const { data: academicData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();
    const { data: masterTerms, isLoading: masterTermsLoading, refetchAll: refetchmasterTerms } = feeSpecialHeadDROPDOWN();
    useEffect(() => {
        if (academicError) {
            toast.error(academicError?.message || 'Failed to load academic years');
            setAcademicYears([]);
            return;
        }
        if (academicData?.data && Array.isArray(academicData.data)) {
            const formatted: IAcademicYear[] = academicData.data.map((item: any) => ({
                asmaY_Id: item.asmaY_Id ?? '',
                asmaY_Year: item.asmaY_Year ?? 'Unknown Year',
                asmaY_Order: item.asmaY_Order ?? 0
            }));
            //formatted.sort((a, b) => (b.asmaY_Order || 0) - (a.asmaY_Order || 0));
            setAcademicYears(formatted);
        }
    }, [academicData, academicError]);

    const { data: classListResponse, isLoading: loadingClasses, error: classListError } = useFeeClassListDefaulterreport();
    const {
        data: sectionListResponse,
        isLoading: loadingSections,
        error: sectionListError,
        refetch: refetchSections
    } = useFeeSectionListDefaulterreport();

    useEffect(() => {
        if (classListError) {
            toast.error(classListError?.message || 'Failed to load classes');
            setClasses([]);
            return;
        }
        if (classListResponse?.data && Array.isArray(classListResponse.data)) {
            setClasses(classListResponse.data);
        }
    }, [classListResponse, classListError]);

    // useEffect(() => {
    //     if (filters.classId > 0) refetchSections();
    //     else {
    //         setSections([]);
    //         setFilters((prev) => ({ ...prev, sectionId: 0 }));
    //     }
    // }, [filters.classId, refetchSections]);

    const classId = watch('classId') ?? 0;
    const academicYearId = watch('academicYearId');

    useEffect(() => {
        const fetchSections = async () => {
            if (!academicYearId || Number(classId) === 0) {
                setSections([]);
                //setValue('sectionId', '0');
                return;
            }
            const classIdNum = Number(classId);

            // Check if academicYearId exists AND classId is a valid positive number
            if (!academicYearId || !classId || Number.isNaN(classIdNum) || classIdNum <= 0) {
                setSections([]);
                // setValue('sectionId', '0');
                return;
            }
            setSectionLoading(true);

            try {
                const result = await getFeesSectionListByClassId(Number(academicYearId), Number(classId ?? 0));

                console.log('sectionsdata', result);

                const data = Array.isArray(result?.data) ? result.data : [];
                setSections(data);

                if (data.length === 0) {
                    toast.info('No sections found for this class');
                }
            } catch (error: any) {
                toast.error(error.message || 'Failed to load sections');
                setSections([]);
            } finally {
                setSectionLoading(false);
            }
        };

        fetchSections();
    }, [academicYearId, classId, setValue]);

    useEffect(() => {
        if (Number(classId) > 0) refetchSections();
        else {
            setSections([]);
        }
    }, [filters.classId, refetchSections]);

    const fmH_Ids = watch('terms') || [];
    const toggleHead = (id: string) => {
        let updated = [];

        if (fmH_Ids.includes(id)) {
            updated = fmH_Ids.filter((v: string) => v !== id);
        } else {
            updated = [...fmH_Ids, id];
        }

        // MUST be tuple: at least 1 element
        if (updated.length === 0) {
            setValue('terms', undefined as any);
        } else {
            setValue('terms', updated as [string, ...string[]], {
                shouldValidate: true
            });
        }

        setSelectedHeadsItems(updated.map((x) => ({ fmH_Id: x })));
    };

    // const filteredHeads = masterTerms?.data?.filter((h) => h.fmH_FeeName.toLowerCase().includes(termSearch.toLowerCase())) ?? [];

    const filteredHeads: IspecialFeeHeadDropdownList[] = [
        {
            fmH_Id: 11,
            fmH_FeeName: 'April',
            amount: 2500
        },
        {
            fmH_Id: 12,
            fmH_FeeName: 'May',
            amount: 2800
        },
        {
            fmH_Id: 13,
            fmH_FeeName: 'June',
            amount: 3200
        },
        {
            fmH_Id: 14,
            fmH_FeeName: 'July',
            amount: 2700
        },
        {
            fmH_Id: 15,
            fmH_FeeName: 'August',
            amount: 3500
        },
        {
            fmH_Id: 16,
            fmH_FeeName: 'September',
            amount: 3000
        },
        {
            fmH_Id: 17,
            fmH_FeeName: 'Opening Balance',
            amount: 12500
        },
        {
            fmH_Id: 18,
            fmH_FeeName: 'New Admission Fees',
            amount: 5000
        },
        {
            fmH_Id: 189,
            fmH_FeeName: 'Counselling Fees',
            amount: 2000
        },
        {
            fmH_Id: 19,
            fmH_FeeName: 'Outstanding Fee 2024-25',
            amount: 8500
        }
    ];

    const toggleRow = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const toggleAll = () => {
        if (selectedIds.length === reportData.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(reportData.map((r) => r.id));
        }
    };

    const selectedRows = reportData.filter((r) => selectedIds.includes(r.id));

    const handleExport = () => {
        if (!selectedRows.length) {
            toast.error('Please select at least one record');
            return;
        }
        exportToExcel(selectedRows, filteredHeads, 'Fee-Defaulter-Report');
    };

    const handlePrint = () => {
        if (!selectedRows.length) {
            toast.error('Please select at least one record');
            return;
        }

        const feeTermColumns = filteredHeads.map((head) => head.fmH_FeeName);

        const columns = ['Sl No', 'Student Name', 'Adm.No', 'Class', 'Section', ...feeTermColumns, 'Total Amount'];

        const printableRows = selectedRows.map((row, index) => {
            const feeTermData: Record<string, number> = {};
            filteredHeads.forEach((term) => {
                feeTermData[term.fmH_FeeName] = term.amount;
            });

            return {
                'Sl No': index + 1,
                'Student Name': row.studentName,
                'Adm.No': row.regNo,
                Class: row.class,
                Section: row.section,
                ...feeTermData,
                'Total Amount': row.totalAmount
            };
        });

        printTabl(columns, printableRows);
    };

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        // Set loading state
        setReportLoading(true);

        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            // Mock data for demonstration
            const mockData: FeeDefaulterRow[] = [
                {
                    id: 1,
                    studentName: 'John Doe',
                    regNo: 'REG001',
                    class: 'LOWER NURSERY',
                    section: 'A',
                    feeTerm: 'April',
                    totalAmount: 5000,
                    paidAmount: 3000,
                    balanceAmount: 2000,
                    dueDate: '2024-04-15',
                    status: 'Pending'
                },
                {
                    id: 2,
                    studentName: 'Jane Smith',
                    regNo: 'REG002',
                    class: 'LOWER NURSERY',
                    section: 'A',
                    feeTerm: 'April',
                    totalAmount: 5000,
                    paidAmount: 0,
                    balanceAmount: 5000,
                    dueDate: '2024-04-15',
                    status: 'Overdue'
                },
                {
                    id: 3,
                    studentName: 'Robert Johnson',
                    regNo: 'REG003',
                    class: 'LOWER NURSERY',
                    section: 'A',
                    feeTerm: 'April',
                    totalAmount: 5000,
                    paidAmount: 5000,
                    balanceAmount: 0,
                    dueDate: '2024-04-15',
                    status: 'Paid'
                },
                {
                    id: 4,
                    studentName: 'Emily Brown',
                    regNo: 'REG004',
                    class: 'LOWER NURSERY',
                    section: 'A',
                    feeTerm: 'April',
                    totalAmount: 5000,
                    paidAmount: 2500,
                    balanceAmount: 2500,
                    dueDate: '2024-04-15',
                    status: 'Pending'
                },
                {
                    id: 5,
                    studentName: 'Michael Wilson',
                    regNo: 'REG005',
                    class: 'LOWER NURSERY',
                    section: 'A',
                    feeTerm: 'April',
                    totalAmount: 5000,
                    paidAmount: 4500,
                    balanceAmount: 500,
                    dueDate: '2024-04-15',
                    status: 'Pending'
                },
                {
                    id: 6,
                    studentName: 'Sarah Davis',
                    regNo: 'REG006',
                    class: 'LOWER NURSERY',
                    section: 'A',
                    feeTerm: 'April',
                    totalAmount: 5000,
                    paidAmount: 0,
                    balanceAmount: 5000,
                    dueDate: '2024-04-15',
                    status: 'Overdue'
                },
                {
                    id: 7,
                    studentName: 'David Miller',
                    regNo: 'REG007',
                    class: 'LOWER NURSERY',
                    section: 'A',
                    feeTerm: 'April',
                    totalAmount: 5000,
                    paidAmount: 3500,
                    balanceAmount: 1500,
                    dueDate: '2024-04-15',
                    status: 'Pending'
                },
                {
                    id: 8,
                    studentName: 'Lisa Anderson',
                    regNo: 'REG008',
                    class: 'LOWER NURSERY',
                    section: 'A',
                    feeTerm: 'April',
                    totalAmount: 5000,
                    paidAmount: 5000,
                    balanceAmount: 0,
                    dueDate: '2024-04-15',
                    status: 'Paid'
                },
                {
                    id: 9,
                    studentName: 'James Taylor',
                    regNo: 'REG009',
                    class: 'LOWER NURSERY',
                    section: 'A',
                    feeTerm: 'April',
                    totalAmount: 5000,
                    paidAmount: 1000,
                    balanceAmount: 4000,
                    dueDate: '2024-04-15',
                    status: 'Overdue'
                },
                {
                    id: 10,
                    studentName: 'Olivia Thomas',
                    regNo: 'REG010',
                    class: 'LOWER NURSERY',
                    section: 'A',
                    feeTerm: 'April',
                    totalAmount: 5000,
                    paidAmount: 4800,
                    balanceAmount: 200,
                    dueDate: '2024-04-15',
                    status: 'Pending'
                },
                {
                    id: 11,
                    studentName: 'William Jackson',
                    regNo: 'REG011',
                    class: 'LOWER NURSERY',
                    section: 'A',
                    feeTerm: 'April',
                    totalAmount: 5000,
                    paidAmount: 0,
                    balanceAmount: 5000,
                    dueDate: '2024-04-15',
                    status: 'Overdue'
                },
                {
                    id: 12,
                    studentName: 'Sophia White',
                    regNo: 'REG012',
                    class: 'LOWER NURSERY',
                    section: 'A',
                    feeTerm: 'April',
                    totalAmount: 5000,
                    paidAmount: 5000,
                    balanceAmount: 0,
                    dueDate: '2024-04-15',
                    status: 'Paid'
                },
                {
                    id: 13,
                    studentName: 'Benjamin Harris',
                    regNo: 'REG013',
                    class: 'LOWER NURSERY',
                    section: 'A',
                    feeTerm: 'April',
                    totalAmount: 5000,
                    paidAmount: 2000,
                    balanceAmount: 3000,
                    dueDate: '2024-04-15',
                    status: 'Pending'
                },
                {
                    id: 14,
                    studentName: 'Ava Martin',
                    regNo: 'REG014',
                    class: 'LOWER NURSERY',
                    section: 'A',
                    feeTerm: 'April',
                    totalAmount: 5000,
                    paidAmount: 0,
                    balanceAmount: 5000,
                    dueDate: '2024-04-15',
                    status: 'Overdue'
                },
                {
                    id: 15,
                    studentName: 'Daniel Thompson',
                    regNo: 'REG015',
                    class: 'LOWER NURSERY',
                    section: 'A',
                    feeTerm: 'April',
                    totalAmount: 5000,
                    paidAmount: 4200,
                    balanceAmount: 800,
                    dueDate: '2024-04-15',
                    status: 'Pending'
                }
            ];

            setReportData(mockData);
            setSelectedIds([]);
            setShowReport(true);
            setReportLoading(false);
            toast.success('Fee Defaulter Report generated successfully!');

            setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, 100);
        }, 1000);
    };

    const feeTerms = ['April', 'May', 'June', 'July', 'August', 'September'];

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='mx-auto max-w-7xl'>
                    <Card className='border-0 shadow-xl'>
                        <div className='p-8'>
                            {/* First Row: All/Individual Radio Buttons */}
                            <div className='mb-8'>
                                <div className='flex items-center justify-center'>
                                    <Card className='min-w-[400px] border bg-gray-50 p-5 shadow-sm'>
                                        <div className='flex justify-center gap-6'>
                                            {['All', 'Individual'].map((option) => (
                                                <Label key={option} className='flex cursor-pointer items-center gap-3'>
                                                    <Input
                                                        type='radio'
                                                        name='reportType'
                                                        checked={filters.reportType === option}
                                                        onChange={() => {
                                                            setFilters((prev) => ({ ...prev, reportType: option }));
                                                            setValue('reportType', option as 'All' | 'Individual');
                                                            setShowReport(false);
                                                            setReportData([]);
                                                            setSelectedIds([]);
                                                        }}
                                                        className='h-5 w-5 text-primary'
                                                    />
                                                    <span className='font-medium'>{option}</span>
                                                </Label>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            {/* Form Fields in Two Columns */}
                            <div className='space-y-8'>
                                <div className='grid grid-cols-2 gap-8'>
                                    {/* Left Column */}
                                    <div className='space-y-8'>
                                        {/* Academic Year */}
                                        <div className='flex items-center gap-4'>
                                            <Label className='w-48 text-right font-medium'>
                                                Academic Year: <span className='text-red-500'>*</span>
                                            </Label>
                                            <div className='flex-1'>
                                                <Controller
                                                    name='academicYearId'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            onValueChange={(value) => {
                                                                field.onChange(value);
                                                                setFilters((prev) => ({ ...prev, academicYearId: value }));
                                                            }}
                                                            value={field.value?.toString() || ''}
                                                            // disabled={loadingAcademic}
                                                        >
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue
                                                                    placeholder={loadingAcademic ? 'Loading...' : 'Select Academic Year'}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='all'>All</SelectItem>
                                                                {academicYears.map((item) => (
                                                                    <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
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

                                        {/* Class */}
                                        <div className='flex items-center gap-4'>
                                            <Label className='w-48 text-right font-medium'>
                                                Class: <span className='text-red-500'>*</span>
                                            </Label>
                                            <div className='flex-1'>
                                                <Controller
                                                    name='classId'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value?.toString() || ''}>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder='Select Class' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='all'>All</SelectItem>
                                                                {classes.map((item) => (
                                                                    <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
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

                                        {/* Section */}
                                        <div className='flex items-center gap-4'>
                                            <Label className='w-48 text-right font-medium'>
                                                Section: <span className='text-red-500'>*</span>
                                            </Label>
                                            <div className='flex-1'>
                                                <Controller
                                                    name='sectionId'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value?.toString() || ''}>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder='Select Section' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='all'>All</SelectItem>
                                                                {sections.map((item) => (
                                                                    <SelectItem key={item.asmS_Id} value={item.asmS_Id.toString()}>
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
                                    </div>

                                    {/* Right Column */}
                                    <div className='space-y-8'>
                                        {/* Conditional: Name/RegNo options when Individual is selected */}
                                        {filters.reportType === 'Individual' && (
                                            <>
                                                {/*                                                 
                                                <div className='flex items-center gap-4'>
                                                    <Card className='w-full border bg-gray-50 p-5 shadow-sm'>
                                                        <div className='flex justify-center gap-6'>
                                                            {['NameRegNo', 'RegNoName'].map((option) => (
                                                                <Label key={option} className='flex cursor-pointer items-center gap-3'>
                                                                    <Input
                                                                        type='radio'
                                                                        name='filterdata'
                                                                        checked={filters.filterdata === option}
                                                                        onChange={() => {
                                                                            setFilters((prev) => ({ ...prev, filterdata: option }));
                                                                            setValue('filterdata', option as 'NameRegNo' | 'RegNoName');
                                                                            setShowReport(false);
                                                                            setReportData([]);
                                                                            setSelectedIds([]);
                                                                        }}
                                                                        className='h-5 w-5 text-primary'
                                                                    />
                                                                    <span className='font-medium'>{option}</span>
                                                                </Label>
                                                            ))}
                                                        </div>
                                                    </Card>
                                                </div>

                                                
                                                <div className='flex items-center gap-4'>
                                                    <Label className='w-48 text-right font-medium'>
                                                        Student Name: <span className='text-red-500'>*</span>
                                                    </Label>
                                                    <div className='flex-1'>
                                                        <Controller
                                                            name='studentId'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value?.toString() || ''}>
                                                                    <SelectTrigger className='w-full'>
                                                                        <SelectValue placeholder='Select Student' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value='0'>Please Select Student</SelectItem>
                                                                        <SelectItem value='1'>John Doe (REG001)</SelectItem>
                                                                        <SelectItem value='2'>Jane Smith (REG002)</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.studentId && <FormError>{errors.studentId.message}</FormError>}
                                                    </div>
                                                </div> */}

                                                <>
                                                    {/* Name/RegNo Radio Buttons */}
                                                    <div className='flex items-center gap-4'>
                                                        <Card className='w-full border bg-gray-50 p-5 shadow-sm'>
                                                            <div className='flex justify-center gap-6'>
                                                                {[
                                                                    { value: 'NameRegNo', label: 'Name:Reg.No' },
                                                                    { value: 'RegNoName', label: 'Reg.No:Name' }
                                                                ].map((option) => (
                                                                    <Label
                                                                        key={option.value}
                                                                        className='flex cursor-pointer items-center gap-3'>
                                                                        <Input
                                                                            type='radio'
                                                                            name='filterdata'
                                                                            checked={filters.filterdata === option.value}
                                                                            onChange={() => {
                                                                                setFilters((prev) => ({
                                                                                    ...prev,
                                                                                    filterdata: option.value
                                                                                }));
                                                                                setValue(
                                                                                    'filterdata',
                                                                                    option.value as 'NameRegNo' | 'RegNoName'
                                                                                );
                                                                                setShowReport(false);
                                                                                setReportData([]);
                                                                                setSelectedIds([]);
                                                                            }}
                                                                            className='h-5 w-5 text-primary'
                                                                        />
                                                                        <span className='font-medium'>{option.label}</span>
                                                                    </Label>
                                                                ))}
                                                            </div>
                                                        </Card>
                                                    </div>

                                                    {/* Student Name */}
                                                    <div className='flex items-center gap-4'>
                                                        <Label className='w-48 text-right font-medium'>
                                                            Student Name: <span className='text-red-500'>*</span>
                                                        </Label>
                                                        <div className='flex-1'>
                                                            <Controller
                                                                name='studentId'
                                                                control={control}
                                                                render={({ field }) => {
                                                                    // Mock student data - replace with your actual data
                                                                    const students = [
                                                                        { id: '1', name: 'John Doe', regNo: 'REG001' },
                                                                        { id: '2', name: 'Jane Smith', regNo: 'REG002' },
                                                                        { id: '3', name: 'Bob Johnson', regNo: 'REG003' }
                                                                    ];

                                                                    return (
                                                                        <Select
                                                                            onValueChange={field.onChange}
                                                                            value={field.value?.toString() || ''}>
                                                                            <SelectTrigger className='w-full'>
                                                                                <SelectValue placeholder='Select Student' />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value='0'>Please Select Student</SelectItem>
                                                                                {students.map((student) => {
                                                                                    // Determine display format based on selected radio button
                                                                                    const displayText =
                                                                                        filters.filterdata === 'NameRegNo'
                                                                                            ? `${student.name} (${student.regNo})`
                                                                                            : `${student.regNo} - ${student.name}`;

                                                                                    return (
                                                                                        <SelectItem key={student.id} value={student.id}>
                                                                                            {displayText}
                                                                                        </SelectItem>
                                                                                    );
                                                                                })}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    );
                                                                }}
                                                            />
                                                            {errors.studentId && <FormError>{errors.studentId.message}</FormError>}
                                                        </div>
                                                    </div>
                                                </>
                                            </>
                                        )}

                                        {/* Fee Term - Always shown */}
                                        <div className='flex items-center gap-4'>
                                            <Label className='w-48 text-right font-medium'>
                                                Fee Term: <span className='text-red-500'>*</span>
                                            </Label>

                                            <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                                                <InputText
                                                    placeholder='Search Term...'
                                                    value={termSearch}
                                                    onChange={(e) => setTermSearch(e.target.value)}
                                                    className='mb-3'
                                                />

                                                {/* Select All Users */}
                                                {/* {masterTerms?.data && (
                                                    <div
                                                        onClick={selectAllHeads}
                                                        className={cn(
                                                            'mb-2 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm transition-all',
                                                            fmH_Ids.length === headOptions.length && headOptions.length
                                                                ? 'border-primary bg-primary/5 text-primary'
                                                                : 'border-gray-300 hover:border-primary/40'
                                                        )}>
                                                        {fmH_Ids.length === headOptions.length && headOptions.length ? (
                                                            <CheckSquare className='h-4 w-4 text-primary' />
                                                        ) : (
                                                            <Square className='h-4 w-4 text-gray-400' />
                                                        )}
                                                        <span>Select All</span>
                                                    </div>
                                                )} */}

                                                <div className='max-h-40 overflow-y-auto rounded-md border border-gray-300 p-1'>
                                                    {masterTermsLoading ? (
                                                        <div className='py-4 text-center text-gray-500 text-sm'>Loading Terms...</div>
                                                    ) : masterTerms?.data?.length === 0 ? (
                                                        <div className='py-4 text-center text-gray-500 text-sm'>No terms found</div>
                                                    ) : (
                                                        filteredHeads.map((u) => {
                                                            const id = u.fmH_Id.toString();
                                                            const selected = fmH_Ids.includes(id);

                                                            return (
                                                                <div
                                                                    key={u.fmH_Id}
                                                                    onClick={() => toggleHead(id)}
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
                                                                    <span>{u.fmH_FeeName}</span>
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </div>
                                            {errors.terms && <FormError>{errors.terms.message}</FormError>}
                                            {/* <div className='flex-1'>
                                                <Controller
                                                    name='feeTerm'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value?.toString() || ''}
                                                        >
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder="Select Fee Term" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='all'>All</SelectItem>
                                                                {feeTerms.map((term) => (
                                                                    <SelectItem key={term} value={term.toLowerCase()}>
                                                                        {term}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.feeTerm && <FormError>{errors.feeTerm.message}</FormError>}
                                            </div> */}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex justify-end gap-4 border-t pt-8'>
                                    <Button
                                        size='lg'
                                        variant='outline'
                                        className='px-8'
                                        onClick={() => window.location.reload()}
                                        type='button'>
                                        Cancel
                                    </Button>
                                    <Button type='submit' disabled={isSubmitting || reportLoading} className='px-12'>
                                        {isSubmitting || reportLoading ? 'Generating...' : 'Generate Report'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Report Section */}
                    {showReport && (
                        <CollapsibleSection defaultOpen={true}>
                            <div className='mt-8 rounded-lg border bg-white shadow-xl'>
                                {/* Header */}
                                <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-6'>
                                    <div className='text-center'>
                                        <h2 className='font-bold text-2xl text-primary'>Fee Defaulter Report</h2>
                                    </div>
                                    <div className='flex gap-3'>
                                        <Button
                                            size='sm'
                                            className='h-8 w-auto px-3 text-xs'
                                            onClick={handleExport}
                                            disabled={!selectedRows.length}>
                                            Export Excel
                                        </Button>
                                        <Button
                                            size='sm'
                                            variant='outline'
                                            className='h-8 w-auto px-3 text-xs'
                                            onClick={handlePrint}
                                            disabled={!selectedRows.length}>
                                            Print
                                        </Button>
                                    </div>
                                </div>

                                {/* TABLE */}
                                <div className='overflow-x-auto'>
                                    <table className='w-full border-collapse text-sm'>
                                        <thead className='bg-primary text-white'>
                                            <tr>
                                                <th className='border px-4 py-3 text-center'>
                                                    <input
                                                        type='checkbox'
                                                        checked={selectedIds.length === reportData.length && reportData.length > 0}
                                                        onChange={toggleAll}
                                                    />
                                                </th>
                                                <th className='border px-4 py-3'>Sl No</th>
                                                <th className='border px-4 py-3'>Student Name</th>
                                                <th className='border px-4 py-3'>Adm.No</th>
                                                <th className='border px-4 py-3'>Class</th>
                                                <th className='border px-4 py-3'>Section</th>
                                                {filteredHeads.map((f) => {
                                                    return (
                                                        <th key={f.fmH_Id} className='border px-4 py-3'>
                                                            {f.fmH_FeeName}
                                                        </th>
                                                    );
                                                })}

                                                <th className='border px-4 py-3 text-right'>Total Amount</th>
                                                <th className='border px-4 py-3 text-right'> </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {reportData.map((row, index) => (
                                                <tr
                                                    key={row.id}
                                                    className={
                                                        selectedIds.includes(row.id)
                                                            ? 'bg-blue-100'
                                                            : index % 2 === 0
                                                              ? 'bg-white'
                                                              : 'bg-gray-50'
                                                    }>
                                                    <td className='border px-4 py-2 text-center'>
                                                        <input
                                                            type='checkbox'
                                                            checked={selectedIds.includes(row.id)}
                                                            onChange={() => toggleRow(row.id)}
                                                        />
                                                    </td>
                                                    <td className='border px-4 py-2 text-center'>{index + 1}</td>
                                                    <td className='border px-4 py-2 font-semibold'>{row.studentName}</td>
                                                    <td className='border px-4 py-2 text-center'>{row.regNo}</td>
                                                    <td className='border px-4 py-2 text-center'>{row.class}</td>
                                                    <td className='border px-4 py-2 text-center'>{row.section}</td>
                                                    {filteredHeads.map((f) => {
                                                        return (
                                                            <th key={f.fmH_Id} className='border px-4 py-3'>
                                                                {f.amount}
                                                            </th>
                                                        );
                                                    })}
                                                    <td className='border px-4 py-2 text-right font-semibold'>
                                                        ₹{row.totalAmount.toLocaleString()}
                                                    </td>
                                                    <td className='border px-4 py-2 text-right font-semibold'>
                                                        <Button type='button' className='px-4' onClick={() => setShowPrint(true)}>
                                                            Print
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {showPrint && <DataTablePrint onClose={() => setShowPrint(false)} />}
                                </div>
                            </div>
                        </CollapsibleSection>
                    )}
                </div>
            </form>
        </div>
    );
}

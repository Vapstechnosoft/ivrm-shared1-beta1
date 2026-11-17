// app/(root)/fees/feereports/feedefaulterreport/page.tsx
'use client';

import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { useFeeClassListDefaulterreport, useFeeSectionListDefaulterreport } from '@/hooks/fees/useReports';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox as BaseCheckbox } from '@/components/ui/checkbox';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { FormError } from '@/components/ui/extension/field';
import { feeConsolidatedReportsSchema } from '@/schemas/fees/reports';
import { getFeeConsolidatedReportData, getInstallmentDropdownData } from '@/server/fees/reports/feeConsolidatedReport';
import { getFeesSectionListByClassId } from '@/server/fees/reports/fee_DefaulterReport';
import type {
    ConsolidatedReportInstallemntDropdownList,
    IFeeClassDropdownList,
    IFeeSectionDropdownList
} from '@/types/fees/reports/reports';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { exportToExcel, exportToExcelAll, printTable, printTableAll } from './exporttoexcel_print';

type FormFields = z.infer<typeof feeConsolidatedReportsSchema>;

// Checkbox with full indeterminate support
const Checkbox = ({ checked, indeterminate, onCheckedChange, ...props }: any) => {
    const ref = useRef<HTMLButtonElement>(null);

    //   useEffect(() => {
    //     if (ref.current) {
    //       ref.current.indeterminate = !!indeterminate;
    //     }
    //   }, [indeterminate]);

    return <BaseCheckbox ref={ref} checked={checked} onCheckedChange={onCheckedChange} {...props} />;
};

interface IAcademicYear {
    asmaY_Id: string | number;
    asmaY_Year: string;
    asmaY_Order?: number;
}

export default function FeeConsolidatedReport() {
    type UserType = 'All' | 'indi';
    const userTypeOptions: { label: string; value: UserType }[] = [
        { label: 'All', value: 'All' },
        { label: 'Individual', value: 'indi' }
    ];

    const {
        handleSubmit,
        setValue,
        control,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feeConsolidatedReportsSchema),
        defaultValues: {
            userType: 'All',

            academicYearId: undefined,

            classId: 0,
            sectionId: 0
        }
    });

    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        userType: 'All' as 'All' | 'indi',

        academicYearId: '',
        classId: 0,
        sectionId: 0
    });

    const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
    const [classes, setClasses] = useState<IFeeClassDropdownList[]>([]);
    const [sections, setSections] = useState<IFeeSectionDropdownList[]>([]);

    const [reportData, setReportData] = useState<any[]>([]);
    const [reportLoading, setReportLoading] = useState(false); // ← ADD THIS LINE
    const [showReport, setShowReport] = useState(false);

    const [installments, setInstallments] = useState<ConsolidatedReportInstallemntDropdownList[]>([]);

    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<'feeGroup' | 'totalDue' | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [sectionLoading, setSectionLoading] = useState(false);

    // Hooks
    const { data: academicData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();
    const { data: classListResponse, isLoading: loadingClasses, error: classListError } = useFeeClassListDefaulterreport();
    const {
        data: sectionListResponse,
        isLoading: loadingSections,
        error: sectionListError,
        refetch: refetchSections
    } = useFeeSectionListDefaulterreport();

    // Load data effects (unchanged)
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
            //  formatted.sort((a, b) => (b.asmaY_Order || 0) - (a.asmaY_Order || 0));
            setAcademicYears(formatted);
        }
    }, [academicData, academicError]);

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

    useEffect(() => {
        if (filters.classId > 0) refetchSections();
        else {
            setSections([]);
            setFilters((prev) => ({ ...prev, sectionId: 0 }));
        }
    }, [filters.classId, refetchSections]);

    const classId = watch('classId') ?? 0;
    const academicYearId = watch('academicYearId');
    //const includeClassSection = watch('includeClassSection');

    useEffect(() => {
        const fetchSections = async () => {
            if (!academicYearId || classId <= 0) {
                setSections([]);
                setValue('sectionId', 0);
                return;
            }

            setSectionLoading(true);

            try {
                const result = await getFeesSectionListByClassId(Number(academicYearId), classId);

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

    //getInstallmentDropdownData

    useEffect(() => {
        const fetchSections = async () => {
            if (!academicYearId) {
                setInstallments([]);

                return;
            }

            setSectionLoading(true);

            try {
                const result = await getInstallmentDropdownData(Number(academicYearId));

                console.log('installments', JSON.stringify(result));
                const data = Array.isArray(result?.data) ? result.data : [];

                setInstallments(data);
                if (data.length === 0) {
                    //  toast.info('No sections found for this class');
                }
            } catch (error: any) {
                // toast.error(error.message);
                setInstallments([]);
            }
        };

        fetchSections();
    }, [academicYearId, setValue]);

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

    function transformReportData(apiData: any[]) {
        const studentMap = new Map<string, any>();

        apiData.forEach((item) => {
            const key = `${item.amaY_RollNo}-${item.studentName}`;

            if (!studentMap.has(key)) {
                studentMap.set(key, {
                    rollNo: item.amaY_RollNo,
                    studentName: item.studentName?.trim(),
                    className: item.className,
                    sectionName: item.sectionName,
                    installments: {}
                });
            }

            studentMap.get(key).installments[String(item.ftI_Id)] = {
                receiptNo: item.receiptNo,
                date: item.date,
                chequeNo: item.chequeNo,
                amount: item.paid
            };
        });

        return Array.from(studentMap.values());
    }

    // const handleExportAlltype = () => {
    //     if (!reportData.length) {
    //         toast.error('No data to export');
    //         return;
    //     }

    //     const groupedRows = transformReportData(reportData);

    //     exportToExcelAll(groupedRows, installments, 'Fee Consolidated Report');
    // };

    const handleExportAlltype = () => {
        if (!reportData.length) {
            toast.error('No data to export');
            return;
        }

        // Remove this line: const groupedRows = transformReportData(reportData);
        // reportData is already pivoted/grouped for 'All' mode

        exportToExcelAll(reportData, installments, 'Fee Consolidated Report');
    };

    const handlePrintAlltype = () => {
        if (!reportData.length) {
            toast.error('No data to print');
            return;
        }

        printTableAll(reportData, installments);
    };

    const handleExport = () => {
        if (!selectedRows.length) {
            toast.error('Please select at least one record');
            return;
        }
        exportToExcel(selectedRows, 'Fee Consolidated-Report');
    };

    const handlePrint = () => {
        if (!selectedRows.length) {
            toast.error('Please select at least one record');
            return;
        }

        const columns = [
            'Sl No',
            'Student Name',
            'Adm.No',
            'Class & Section',
            'Paid Amount',
            'Receipt No',
            'Bank Name',
            'Date',
            'Cheque No',
            'Cheque Date'
        ];

        const rowsToPrint = selectedRows.map((row, index) => ({
            'Sl No': index + 1,
            'Student Name': row.studentName,
            'Adm.No': row.admNo,
            'Class & Section': row.classSection,
            'Paid Amount': row.paidAmount,
            'Receipt No': row.receiptNo,
            'Bank Name': row.bankName,
            Date: row.chequeDate,
            'Cheque No': row.chequeNo,
            'Cheque Date': row.chequeDate
        }));

        // ✅ TOTAL ROW
        const totalAmount = selectedRows.reduce((sum, row) => sum + (row.tuitionFee || 0), 0);

        const totalRow = {
            // 'Sl No': '',
            // 'Student Name': 'TOTAL',
            // 'Mobile No': '',
            // 'Class/Section Name': '',
            // 'Receipt Date': '',
            // 'Receipt No': '',
            // 'Payment Mode': '',
            // 'DD/Cheque No': '',
            // 'Tuition Fee': totalAmount.toLocaleString()
        };

        printTable(columns, rowsToPrint, totalRow);
    };

    const pivotReportData = (data: any[]) => {
        const grouped: Record<number, any> = {};

        data.forEach((item) => {
            const studentId = item.amsT_Id;

            if (!grouped[studentId]) {
                grouped[studentId] = {
                    id: studentId,
                    rollNo: item.amaY_RollNo,
                    studentName: item.studentName?.trim(),
                    className: item.className,
                    sectionName: item.sectionName,
                    installments: {}
                };
            }

            grouped[studentId].installments[item.ftI_Id] = {
                receiptNo: item.receiptNo,
                date: item.date,
                chequeNo: item.chequeNo,
                amount: item.paid
            };
        });

        return Object.values(grouped);
    };

    // const handleSubmit = async () => {
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setReportLoading(true);
        setShowReport(false);

        await new Promise((resolve) => setTimeout(resolve, 1200));

        const response = await getFeeConsolidatedReportData(Number(data.academicYearId), data.classId, data.sectionId, filters.userType);

        console.log('responsedata', JSON.stringify(response));

        const mapIndiResponseToTable = (data: any[]) => {
            return data.map((item, index) => ({
                id: index + 1,
                studentName: item.studentName?.trim(),
                admNo: item.amaY_RollNo,
                classSection: `${item.className} ${item.sectionName}`,
                paidAmount: item.paid,
                receiptNo: item.receiptNo,
                bankName: item.fyP_Bank_Name || '',
                date: item.date,
                chequeNo: item.chequeNo || '',
                chequeDate: item.fyP_DD_Cheque_Date || ''
            }));
        };

        if (filters.userType === 'indi') {
            const mappedData = mapIndiResponseToTable(response?.data || []);
            setReportData(mappedData);
        } else {
            const pivoted = pivotReportData(response?.data || []);
            setReportData(pivoted);
        }
        setShowReport(true);
        setReportLoading(false);
        setLoading(false);
        setShowReport(true);
        setReportLoading(false);
        setLoading(false);

        toast.success('Report generated successfully');

        // Auto scroll to report
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    };

    // const isAcademicYearSelected = !!filters.academicYearId;
    const isAcademicYearSelected = watch('academicYearId');

    const showBalancecheckbox = filters.userType === 'All';

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <div className='mx-auto max-w-7xl'>
                    <Card className='border-0 shadow-xl'>
                        <div className='p-8'>
                            <div className='space-y-8'>
                                {/* User Type Card */}
                                <Card className='border bg-gray-50 p-5 shadow-sm'>
                                    <div className='flex flex-wrap items-center justify-center gap-10'>
                                        {userTypeOptions.map(({ label, value }) => (
                                            <label key={value} className='flex cursor-pointer items-center gap-3'>
                                                <input
                                                    type='radio'
                                                    name='userType'
                                                    checked={filters.userType === value}
                                                    onChange={() =>
                                                        setFilters((prev) => ({
                                                            ...prev,
                                                            userType: value // ✅ value is 'All' | 'Indi'
                                                        }))
                                                    }
                                                    className='h-5 w-5 text-primary'
                                                />
                                                <span className='font-medium text-base'>{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </Card>

                                <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                                    {/* Academic Year */}
                                    <div className='space-y-2'>
                                        <Label className='font-semibold text-lg'>
                                            Academic Year <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='academicYearId'
                                            control={control}
                                            render={({ field }) => (
                                                <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(Number(v))}>
                                                    <SelectTrigger className='w-full text-center'>
                                                        <SelectValue placeholder='--Select Academic Year--' />
                                                    </SelectTrigger>
                                                    <SelectContent>
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

                                    {/* Class */}
                                    <div className='space-y-2'>
                                        <Label className='font-semibold text-lg'>
                                            Class <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='classId'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    value={
                                                        field.value === undefined || field.value === 0 ? undefined : field.value.toString()
                                                    }
                                                    onValueChange={(v) => {
                                                        const num = v ? Number(v) : undefined;
                                                        field.onChange(num); // send number or undefined
                                                        setValue('sectionId', 0); // reset section
                                                    }}>
                                                    <SelectTrigger className='w-full text-center'>
                                                        <SelectValue placeholder='--Select Class--' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {classes.map((cls) => (
                                                            <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>
                                                                {cls.asmcL_ClassName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />

                                        {errors.classId && <FormError>{errors.classId.message}</FormError>}
                                    </div>

                                    {/* Section */}
                                    <div className='space-y-2'>
                                        <Label className='font-semibold text-lg'>
                                            Section <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='sectionId'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value ? field.value.toString() : ''}
                                                    onValueChange={(v) => field.onChange(Number(v))}>
                                                    <SelectTrigger className='w-full text-center'>
                                                        <SelectValue placeholder='--Select Section--' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {sections.map((sec) => (
                                                            <SelectItem key={sec.asmS_Id} value={sec.asmS_Id.toString()}>
                                                                {sec.asmC_SectionName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.sectionId && <FormError>{errors.sectionId.message}</FormError>}
                                    </div>
                                </div>

                                <div>
                                    <div className='flex justify-end gap-4 border-t pt-8'>
                                        <Button size='lg' variant='outline' className='px-8' onClick={() => window.location.reload()}>
                                            Cancel
                                        </Button>
                                        <Button type='submit' disabled={isSubmitting} className='px-12'>
                                            {isSubmitting ? 'Generating...' : 'Report'}
                                        </Button>
                                    </div>

                                    {showReport && (
                                        <CollapsibleSection defaultOpen={true}>
                                            <div className='mt-10 rounded-lg border bg-white shadow-xl'>
                                                {/* Header */}
                                                <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-6'>
                                                    {/* <h2 className='font-bold text-blue-700 text-xl'>Fee Audit Report</h2> */}
                                                    <div className='mb-6 text-center'>
                                                        <h2 className='font-bold text-2xl text-primary'>Fee Consolidated Report</h2>
                                                        {/* <div className="mt-1 text-sm text-gray-600">
                                                    From {formatDate(fromDate)} To {formatDate(toDate)}
                                                </div> */}
                                                    </div>
                                                    {filters.userType === 'indi' && (
                                                        <div className='flex gap-3'>
                                                            <div className='mb-4 flex justify-end gap-2'>
                                                                <Button
                                                                    size='sm'
                                                                    className='h-8 w-auto px-3 text-xs'
                                                                    onClick={handleExport}>
                                                                    Export Excel
                                                                </Button>

                                                                <Button
                                                                    size='sm'
                                                                    variant='outline'
                                                                    className='h-8 w-auto px-3 text-xs'
                                                                    onClick={handlePrint}>
                                                                    Print
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {filters.userType === 'All' && (
                                                        <div className='flex gap-3'>
                                                            <div className='mb-4 flex justify-end gap-2'>
                                                                <Button
                                                                    size='sm'
                                                                    className='h-8 w-auto px-3 text-xs'
                                                                    onClick={handleExportAlltype}>
                                                                    Export Excel
                                                                </Button>

                                                                <Button
                                                                    size='sm'
                                                                    variant='outline'
                                                                    className='h-8 w-auto px-3 text-xs'
                                                                    onClick={handlePrintAlltype}>
                                                                    Print
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* ================= INDIVIDUAL TABLE ================= */}
                                                {filters.userType === 'indi' && (
                                                    <div className='overflow-x-auto'>
                                                        <table className='w-full border-collapse text-sm'>
                                                            <thead className='bg-primary text-white'>
                                                                <tr>
                                                                    <th className='border px-2 py-2 text-center'>
                                                                        <input
                                                                            type='checkbox'
                                                                            checked={
                                                                                selectedIds.length === reportData.length &&
                                                                                reportData.length > 0
                                                                            }
                                                                            onChange={toggleAll}
                                                                        />
                                                                    </th>
                                                                    <th className='border px-2 py-2'>Sl No</th>
                                                                    <th className='border px-2 py-2'>Student Name</th>
                                                                    <th className='border px-2 py-2'>Adm.No</th>
                                                                    <th className='border px-2 py-2'>Class & Section</th>
                                                                    <th className='border px-2 py-2'>Paid Amount</th>
                                                                    <th className='border px-2 py-2'>Receipt No</th>
                                                                    <th className='border px-2 py-2'>Bank Name</th>
                                                                    <th className='border px-2 py-2'>Date</th>
                                                                    <th className='border px-2 py-2'>Cheque No</th>
                                                                    <th className='border px-2 py-2'>Cheque Date</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {reportData.map((row, index) => (
                                                                    <tr
                                                                        key={row.id ?? index}
                                                                        className={
                                                                            selectedIds.includes(row.id)
                                                                                ? 'bg-blue-100'
                                                                                : index % 2 === 0
                                                                                  ? 'bg-white'
                                                                                  : 'bg-gray-50'
                                                                        }>
                                                                        <td className='border px-2 py-2 text-center'>
                                                                            <input
                                                                                type='checkbox'
                                                                                checked={selectedIds.includes(row.id)}
                                                                                onChange={() => toggleRow(row.id)}
                                                                            />
                                                                        </td>
                                                                        <td className='border px-2 py-2 text-center'>{index + 1}</td>
                                                                        <td className='border px-2 py-2'>{row.studentName}</td>
                                                                        <td className='border px-2 py-2 text-center'>{row.admNo}</td>
                                                                        <td className='border px-2 py-2 text-center'>{row.classSection}</td>
                                                                        <td className='border px-2 py-2 text-right'>
                                                                            {row.paidAmount?.toLocaleString()}
                                                                        </td>
                                                                        <td className='border px-2 py-2'>{row.receiptNo}</td>
                                                                        <td className='border px-2 py-2'>{row.bankName}</td>
                                                                        <td className='border px-2 py-2'>{row.date}</td>
                                                                        <td className='border px-2 py-2'>{row.chequeNo}</td>
                                                                        <td className='border px-2 py-2'>{row.chequeDate}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                                {filters.userType === 'All' && (
                                                    <div className='overflow-x-auto'>
                                                        <table className='w-full border-collapse text-sm'>
                                                            {/* ================= HEADER ================= */}
                                                            <thead className='bg-primary text-white'>
                                                                {/* ROW 1 – INSTALLMENT NAMES */}
                                                                <tr>
                                                                    <th rowSpan={2} className='border px-2 py-2 text-center'>
                                                                        SLNO
                                                                    </th>
                                                                    <th rowSpan={2} className='border px-2 py-2 text-center'>
                                                                        Roll No
                                                                    </th>
                                                                    <th rowSpan={2} className='border px-2 py-2'>
                                                                        Student Name
                                                                    </th>
                                                                    <th rowSpan={2} className='border px-2 py-2 text-center'>
                                                                        Class
                                                                    </th>
                                                                    <th rowSpan={2} className='border px-2 py-2 text-center'>
                                                                        Section
                                                                    </th>

                                                                    {installments.map((inst) => (
                                                                        <th
                                                                            key={inst.ftI_Id}
                                                                            colSpan={4}
                                                                            className='border px-2 py-2 text-center font-semibold'>
                                                                            {inst.ftI_Name}
                                                                        </th>
                                                                    ))}
                                                                </tr>

                                                                {/* ROW 2 – SUB COLUMNS */}
                                                                <tr>
                                                                    {installments.map((inst) => (
                                                                        <React.Fragment key={`${inst.ftI_Id}-sub`}>
                                                                            <th className='border px-2 py-2'>Receipt No</th>
                                                                            <th className='border px-2 py-2'>Date</th>
                                                                            <th className='border px-2 py-2'>Cheque No</th>
                                                                            <th className='border px-2 py-2 text-right'>Amount</th>
                                                                        </React.Fragment>
                                                                    ))}
                                                                </tr>
                                                            </thead>

                                                            {/* ================= BODY ================= */}
                                                            <tbody>
                                                                {reportData.map((row, index) => (
                                                                    <tr
                                                                        key={row.id}
                                                                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                        <td className='border px-2 py-2 text-center'>{index + 1}</td>
                                                                        <td className='border px-2 py-2 text-center'>{row.rollNo}</td>
                                                                        <td className='border px-2 py-2'>{row.studentName}</td>
                                                                        <td className='border px-2 py-2 text-center'>{row.className}</td>
                                                                        <td className='border px-2 py-2 text-center'>{row.sectionName}</td>

                                                                        {installments.map((inst) => {
                                                                            const instData = row.installments?.[inst.ftI_Id];

                                                                            return (
                                                                                <React.Fragment key={`${row.id}-${inst.ftI_Id}`}>
                                                                                    <td className='border px-2 py-2'>
                                                                                        {instData?.receiptNo || '-'}
                                                                                    </td>
                                                                                    <td className='border px-2 py-2'>
                                                                                        {instData?.date || '-'}
                                                                                    </td>
                                                                                    <td className='border px-2 py-2'>
                                                                                        {instData?.chequeNo || '-'}
                                                                                    </td>
                                                                                    <td className='border px-2 py-2 text-right'>
                                                                                        {instData?.amount
                                                                                            ? instData.amount.toLocaleString()
                                                                                            : '-'}
                                                                                    </td>
                                                                                </React.Fragment>
                                                                            );
                                                                        })}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        </CollapsibleSection>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </form>
        </div>
    );
}

// app/(root)/fees/feereports/feedefaulterreport/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { useFeeCustomGroupDefaulterreport } from '@/hooks/fees/useReports';
import { feeAuditSchema } from '@/schemas/fees/reports';
import { getAuditReport } from '@/server/fees/reports/auditreport';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import { useEffect, useState } from 'react';
import { Input } from 'react-aria-components';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { exportToExcel, printTable } from './_components/columns';

type FormFields = z.infer<typeof feeAuditSchema>;

interface IAcademicYear {
    asmaY_Id: string | number;
    asmaY_Year: string;
    asmaY_Order?: number;
}

export default function FeeAuditReport() {
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        fromDate: new Date(),
        toDate: new Date(),
        breakdown: 'ALL',
        academicYearId: ''
    });

    const {
        control,
        setValue,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feeAuditSchema),
        defaultValues: {
            academicYearId: '',

            breakdown: 'ALL',
            fromDate: new Date(), // Initialize with today's date
            toDate: new Date() // Initialize with today's date
        }
    });

    const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);

    //const [reportData, setReportData] = useState<IFeeAuditReport[]>([]);
    //const [reportData, setReportData] = useState<any>([]);

    const [reportLoading, setReportLoading] = useState(false); // ← ADD THIS LINE
    const [showReport, setShowReport] = useState(false);

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [reportData, setReportData] = useState<auditreportow[]>([]);

    const [fromDate, setFromDate] = useState<Date>(new Date());

    const [toDate, setToDate] = useState<Date>(new Date());

    type auditreportow = {
        id: number;
        studentName: string;
        mobileNo: string;
        classSection: string;
        receiptDate: string;
        receiptNo: string;
        paymentMode: string;
        chequeNo: string;
        tuitionFee: number;
    };

    // Hooks
    const { data: academicData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();

    const { data: customGroupResponse, isLoading: loadingCustomGroup, error: customGroupError } = useFeeCustomGroupDefaulterreport();

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
        exportToExcel(selectedRows, 'Audit-Report');
    };

    const handlePrint = () => {
        if (!selectedRows.length) {
            toast.error('Please select at least one record');
            return;
        }

        const columns = [
            'Sl No',
            'Student Name',
            'Mobile No',
            'Class/Section Name',
            'Receipt Date',
            'Receipt No',
            'Payment Mode',
            'DD/Cheque No',
            'Tuition Fee'
        ];

        const rowsToPrint = selectedRows.map((row, index) => ({
            'Sl No': index + 1,
            'Student Name': row.studentName,
            'Mobile No': row.mobileNo,
            'Class/Section Name': row.classSection,
            'Receipt Date': row.receiptDate,
            'Receipt No': row.receiptNo,
            'Payment Mode': row.paymentMode,
            'DD/Cheque No': row.chequeNo || '-',
            'Tuition Fee': row.tuitionFee
        }));

        // ✅ TOTAL ROW
        const totalAmount = selectedRows.reduce((sum, row) => sum + (row.tuitionFee || 0), 0);

        const totalRow = {
            'Sl No': '',
            'Student Name': 'TOTAL',
            'Mobile No': '',
            'Class/Section Name': '',
            'Receipt Date': '',
            'Receipt No': '',
            'Payment Mode': '',
            'DD/Cheque No': '',
            'Tuition Fee': totalAmount.toLocaleString()
        };

        printTable(columns, rowsToPrint, totalRow);
    };

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        const payload = {
            //academicYearId: data.academicYearId
            asmayId: data.academicYearId,
            fromDate: filters.fromDate.toISOString().split('T')[0],
            toDate: filters.toDate.toISOString().split('T')[0],
            // fromDate: data.fromDate ? format(data.fromDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            // toDate: data.toDate ? format(data.toDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            flag: filters.breakdown
        };

        console.log('payload', payload);
        const response = await getAuditReport(payload);

        if (!response?.success || !Array.isArray(response.data)) {
            toast.error('Failed to fetch data');
            setReportData([]);
            setShowReport(false);
            return;
        }

        // success = true but no records
        if (response.data.length === 0) {
            setReportData([]);
            setSelectedIds([]);
            setShowReport(false);
            toast.info('No records found for selected criteria');
            return;
        }

        const mapApiToReportRows = (apiData: any[]): auditreportow[] => {
            return apiData.map((item, index) => ({
                id: index + 1,
                studentName: item.name?.trim() || '-',
                mobileNo: item.mobileNo || '-',
                classSection: `${item.asmcL_ClassName || ''} ${item.asmC_SectionName || ''}`.trim(),
                receiptDate: item.date || '-',
                receiptNo: item.fyP_Receipt_No || '-',
                paymentMode: item.fyP_Bank_Or_Cash || '-',
                chequeNo: item.fyP_DD_Cheque_No || '',
                tuitionFee: Number(item.tutionfees) || 0
            }));
        };

        const mappedRows = mapApiToReportRows(response.data);

        setReportData(mappedRows);
        setSelectedIds([]);
        setShowReport(true);
        setReportLoading(false);
        // Found ${mappedRows.length} records
        toast.success('Report generated successfully! ');

        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    };

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='mx-auto max-w-7xl'>
                    <Card className='border-0 shadow-xl'>
                        <div className='p-8'>
                            {/* <h1 className='mb-8 font-bold text-3xl text-gray-900'>Yearly Fee Collection Report</h1> */}

                            <div className='space-y-8'>
                                {/* View Mode + Academic Year */}
                                {/* View Mode + Academic Year + Full Breakdown Radio Group */}
                                <div className='flex flex-wrap gap-8'>
                                    {/* Academic Year */}
                                    <div className='flex min-w-[500px] items-center gap-3'>
                                        <Label className='font-semibold text-lg'>
                                            Academic Year :<span className='text-red-500'>*</span>
                                        </Label>

                                        <Controller
                                            name='academicYearId'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    key={field.value || 'empty'}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        setFilters((prev) => ({ ...prev, academicYearId: value }));
                                                    }}
                                                    value={field.value?.toString() || undefined}
                                                    disabled={loadingAcademic}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue
                                                            placeholder={loadingAcademic ? 'Loading...' : 'Select Academic Year'}
                                                        />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        <SelectItem value='all'>All</SelectItem>
                                                        {loadingAcademic ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : academicError ? (
                                                            <SelectItem value='error' disabled>
                                                                Failed to load years
                                                            </SelectItem>
                                                        ) : (
                                                            academicYears.map((item) => (
                                                                <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                                    {item.asmaY_Year}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />

                                        {/* Zod Error */}
                                        {errors.academicYearId && <FormError>{errors.academicYearId.message}</FormError>}
                                    </div>

                                    <Card className='min-w-[400px] flex-1 border bg-gray-50 p-5 shadow-sm'>
                                        <div className='flex flex-wrap gap-4'>
                                            {[
                                                { label: 'All', value: 'ALL' },
                                                { label: 'Cash', value: 'C' },
                                                { label: 'Cheque/DD', value: 'B' },
                                                { label: 'Online Paid', value: 'O' },
                                                { label: 'ECS', value: 'E' },
                                                { label: 'Card', value: 'S' },
                                                { label: 'RTGS', value: 'R' },
                                                { label: 'Trans&Bank', value: 'BT' }
                                            ].map((option) => (
                                                <Label
                                                    key={option.value}
                                                    className='flex cursor-pointer items-center gap-3 whitespace-nowrap'>
                                                    <Input
                                                        type='radio'
                                                        checked={filters.breakdown === option.value}
                                                        onChange={() => {
                                                            setFilters((prev) => ({ ...prev, breakdown: option.value }));
                                                            setShowReport(false);
                                                            setReportData([]);
                                                            setSelectedIds([]);
                                                        }}
                                                        className='h-5 w-5 text-primary'
                                                    />
                                                    <span className='font-medium text-sm'>{option.label}</span>
                                                </Label>
                                            ))}
                                        </div>
                                    </Card>
                                </div>

                                <div className='mt-4 flex items-center justify-center rounded border bg-gray-50 p-4 shadow-sm'>
                                    <div className='flex items-center gap-6'>
                                        <div className='flex items-center gap-2'>
                                            <Label htmlFor='fromDate' className='font-medium'>
                                                From Date: <span className='text-red-500'>*</span>
                                            </Label>
                                            <Input
                                                id='fromDate'
                                                type='date'
                                                value={filters.fromDate.toISOString().split('T')[0]}
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        fromDate: new Date(e.target.value)
                                                    }))
                                                }
                                                className='rounded border px-3 py-1'
                                            />
                                        </div>

                                        <div className='flex items-center gap-2'>
                                            <Label htmlFor='toDate' className='font-medium'>
                                                To Date: <span className='text-red-500'>*</span>
                                            </Label>
                                            <Input
                                                id='toDate'
                                                type='date'
                                                value={filters.toDate.toISOString().split('T')[0]}
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        toDate: new Date(e.target.value)
                                                    }))
                                                }
                                                className='rounded border px-3 py-1'
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="flex items-center gap-2">
                                        <Label className="font-medium">
                                            From Date: <span className="text-red-500">*</span>
                                        </Label>

                                        <Controller
                                            name="fromDate"
                                            control={control}
                                            render={({ field }) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="w-[180px] justify-start text-left font-normal"
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value
                                                                ? format(field.value, 'dd/MM/yyyy')
                                                                : 'From date'}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <CalendarYear
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={(date: Date | undefined) => {
                                                                if (date) {
                                                                    field.onChange(date);
                                                                    setFilters(prev => ({ ...prev, fromDate: date }));
                                                                }
                                                            }}
                                                            captionLayout="dropdown"
                                                            fromYear={2000}
                                                            toYear={2050}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Label className="font-medium">
                                            To Date: <span className="text-red-500">*</span>
                                        </Label>

                                        <Controller
                                            name="toDate"
                                            control={control}
                                            render={({ field }) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="w-[180px] justify-start text-left font-normal"
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value
                                                                ? format(field.value, 'dd/MM/yyyy')
                                                                : 'To date'}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <CalendarYear
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={(date: Date | undefined) => {
                                                                if (date) {
                                                                    field.onChange(date);
                                                                    setFilters(prev => ({ ...prev, toDate: date }));
                                                                }
                                                            }}
                                                            captionLayout="dropdown"
                                                            fromYear={2000}
                                                            toYear={2050}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                    </div> */}
                                </div>

                                <div>
                                    {/* ==================== ACTION BUTTONS ==================== */}
                                    <div className='flex justify-end gap-4 border-t pt-8'>
                                        <Button size='lg' variant='outline' className='px-8' onClick={() => window.location.reload()}>
                                            Cancel
                                        </Button>
                                        <Button type='submit' disabled={isSubmitting} className='px-12'>
                                            {isSubmitting ? 'Generating...' : 'Report'}
                                        </Button>

                                        {/* <Button
                                            size='lg'
                                            className='px-12'
                                            type='submit'
                                        onClick={handleSubmit}
                                        disabled={
                                            reportLoading ||
                                            !filters.academicYearId ||
                                            filters.feeGroupIds.length === 0 ||
                                            filters.termIds.length === 0
                                        }
                                        >
                                            Generate Report
                                        </Button> */}
                                    </div>

                                    {/* ==================== REPORT SECTION ==================== */}

                                    {showReport && (
                                        <CollapsibleSection defaultOpen={true}>
                                            <div className='mt-10 rounded-lg border bg-white shadow-xl'>
                                                {/* Header */}
                                                <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-6'>
                                                    {/* <h2 className='font-bold text-blue-700 text-xl'>Fee Audit Report</h2> */}
                                                    <div className='mb-6 text-center'>
                                                        <h2 className='font-bold text-2xl text-primary'>Fee Audit Report</h2>
                                                        {/* <div className="mt-1 text-sm text-gray-600">
                From {formatDate(fromDate)} To {formatDate(toDate)}
            </div> */}
                                                    </div>
                                                    <div className='flex gap-3'>
                                                        <div className='mb-4 flex justify-end gap-2'>
                                                            <Button size='sm' className='h-8 w-auto px-3 text-xs' onClick={handleExport}>
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
                                                </div>

                                                {/* TABLE */}
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
                                                                <th className='border px-2 py-2'>Mobile No</th>
                                                                <th className='border px-2 py-2'>Class/Section Name</th>
                                                                <th className='border px-2 py-2'>Receipt Date</th>
                                                                <th className='border px-2 py-2'>Receipt No</th>
                                                                <th className='border px-2 py-2'>Payment Mode</th>
                                                                <th className='border px-2 py-2'>DD/Cheque No</th>
                                                                <th className='border px-2 py-2 text-right'>Tuition Fee</th>
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
                                                                    <td className='border px-2 py-2 text-center'>
                                                                        <input
                                                                            type='checkbox'
                                                                            checked={selectedIds.includes(row.id)}
                                                                            onChange={() => toggleRow(row.id)}
                                                                        />
                                                                    </td>
                                                                    <td className='border px-2 py-2 text-center'>{index + 1}</td>
                                                                    <td className='border px-2 py-2 font-semibold'>{row.studentName}</td>
                                                                    <td className='border px-2 py-2 text-center'>{row.mobileNo}</td>
                                                                    <td className='border px-2 py-2 text-center'>{row.classSection}</td>
                                                                    <td className='border px-2 py-2 text-center'>{row.receiptDate}</td>
                                                                    <td className='border px-2 py-2 text-center'>{row.receiptNo}</td>
                                                                    <td className='border px-2 py-2 text-center'>{row.paymentMode}</td>
                                                                    <td className='border px-2 py-2 text-center'>{row.chequeNo || '-'}</td>
                                                                    <td className='border px-2 py-2 text-right font-semibold'>
                                                                        {row.tuitionFee.toLocaleString()}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
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

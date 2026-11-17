'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { headWiseReportSchema } from '@/schemas/fees/reports';
import { feeHeadwiseReportClassCategoryGropDown } from '@/server/fees/reports/headwiseReport';
import type { ApiSearchparams } from '@/types';
import type { HeadwiseClassCategoryDropDown } from '@/types/fees/reports/reports';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { getDueDateReportData } from '@/server/fees/reports/fee_duedate_report';
import { exportToExcel, printTable } from './exporttoexcel_print';

type FormFields = z.infer<typeof headWiseReportSchema>;

interface DailyFeeProps {
    onSuccess?: (payload: any, apiSearchParams?: ApiSearchparams) => void;
    apiSearchParams: ApiSearchparams;
}
const today = new Date().toISOString().split('T')[0];

export default function FeeDueDateReportForm() {
    // ---------------------------- FORM ----------------------------
    const {
        control,
        handleSubmit,
        reset,
        register,
        setValue,

        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(headWiseReportSchema),
        mode: 'onChange',
        defaultValues: {
            asmaY_Id: undefined,
            classcategoryid: undefined
        }
    });

    const [submitClicked, setSubmitClicked] = useState(false);

    // ---------------------------- WATCH ----------------------------

    const [refreshAY, setRefreshAY] = useState(0);
    const [tableSumRow, setTableSumRow] = useState<any>(null);

    // ---------------------------- DROPDOWNS ----------------------------
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [classcategory, setClassCategory] = useState<HeadwiseClassCategoryDropDown[]>([]);
    const [classCategoryLoading, setClassCategoryLoading] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);

    const [formKey, setFormKey] = useState(0);

    const {
        data: academicData,
        error: academicError,
        isLoading: loadingAcademic,
        refetch: refetchAcademicYears
    } = useAcademicYearDropdown();

    useEffect(() => {
        if (academicError) toast.error('Failed to load academic years');

        if (academicData?.data) {
            const years = academicData.data.map((i: any) => ({
                asmaY_Id: i.asmaY_Id,
                asmaY_Year: i.asmaY_Year
            }));

            setAcademicYears(years);
        }
    }, [academicData, academicError, refreshAY]);

    const onYearChange = async (yearId: number) => {
        try {
            setClassCategoryLoading(true);
            const res = await feeHeadwiseReportClassCategoryGropDown(yearId);
            setClassCategory(res.data ?? []);
        } catch {
            toast.error('Failed to load Class Category Data');
        } finally {
            setClassCategoryLoading(false);
        }
    };

    const [loading, setLoading] = useState(false);
    const [tableColumns, setTableColumns] = useState<string[]>([]);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [showTable, setShowTable] = useState(false);

    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const ITEMS_PER_PAGE = 10;

    // const filteredRows =
    //     searchTerm.trim() === ''
    //         ? tableRows
    //         : tableRows.filter(
    //             (row) =>
    //                 row.feeGroup
    //                     .toLowerCase()
    //                     .includes(searchTerm.toLowerCase()) ||
    //                 row.feeHead
    //                     .toLowerCase()
    //                     .includes(searchTerm.toLowerCase())
    //         );

    // const totalPages = Math.ceil(filteredRows.length / ITEMS_PER_PAGE);

    const filteredRows = tableRows.filter((row) =>
        Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalEntries = filteredRows.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const paginatedRows = filteredRows.slice(startIndex, endIndex);

    // const paginatedRows = filteredRows.slice(
    //     (currentPage - 1) * ITEMS_PER_PAGE,
    //     currentPage * ITEMS_PER_PAGE
    // );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-GB');

    const flattenData = (data: any[]) => {
        return data.map((item) => ({
            Date: formatDate(item.date),
            ...item.feeHeadAmounts,
            TotalPaidAmount: item.totalPaidAmount
        }));
    };

    const handlePrint = () => {
        if (selectedRows.length === 0) {
            toast.error('Please select at least one row Data to print');
            return;
        }

        const columnHeaders = [
            'slno',
            'feeGroup',
            'feeHead',
            'Installment Name',
            'Sub-Installment Name',
            'Due Date',
            'Fine Slab',
            'Fine Type',
            'Fine Amount'
        ];

        const printableRows = selectedRows.map((row, index) => ({
            slno: index + 1,
            feeGroup: row.feeGroup,
            feeHead: row.feeHead,
            'Installment Name': `${row.active ? 'true' : 'false'}`,
            'Sub-Installment Name': `${(row.fine || 0).toLocaleString('en-IN')}`,
            'Due Date': `₹${(row.installment || 0).toLocaleString('en-IN')}`,
            'Fine Slab': `₹${(row.amount || 0).toLocaleString('en-IN')}`,
            'Fine Type': `₹${(row.amount || 0).toLocaleString('en-IN')}`,
            'Fine Amount': `₹${(row.amount || 0).toLocaleString('en-IN')}`
        }));

        // Calculate totals for each column
        const sumRow = {
            slno: '',
            feeGroup: 'TOTAL',
            feeHead: '',
            'Installment Name': '',
            'Sub-Installment Name': `${selectedRows.reduce((sum, r) => sum + (r.fine || 0), 0).toLocaleString('en-IN')}`,
            'Due Date': '',
            'Fine Slab': `₹${selectedRows.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString('en-IN')}`,
            'Fine Type': `₹${selectedRows.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString('en-IN')}`,
            'Fine Amount': `₹${selectedRows.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString('en-IN')}`
        };
        printTable(columnHeaders, printableRows, sumRow);
    };

    const handleExportExcel = () => {
        if (selectedRows.length === 0) {
            toast.error('Please select at least one row Data to export');
            return;
        }

        exportToExcel(selectedRows, 'DueDate_Report');
    };

    const toggleRowSelection = (row: any) => {
        setSelectedRows((prev) => {
            const exists = prev.some((r) => r.slno === row.slno);

            if (exists) {
                return prev.filter((r) => r.slno !== row.slno);
            }

            // ✅ Add row
            return [...prev, row];
        });
    };

    useEffect(() => {
        if (showTable) {
            setTableColumns([
                'slno',
                'feeGroup',
                'feeHead',
                'Installment Name',
                'Sub-Installment Name',
                'Due Date',
                'Fine Slab',
                'Fine Type',
                'Fine Amount'
            ]);
        }
    }, [showTable]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setSubmitClicked(true);
        try {
            setLoading(true);

            const { asmaY_Id, classcategoryid } = data;

            const response = await getDueDateReportData(Number(asmaY_Id), Number(classcategoryid));

            //const response = await getHeadWiseReportData(231, 170);

            console.log('response', response);
            const rawData = (response as any)?.data ?? [];

            if (!Array.isArray(rawData) || rawData.length === 0) {
                toast.error('No data found');
                setShowTable(false);
                return;
            }
            const mappedRows = rawData.map((item: any, index: number) => ({
                slno: index + 1,
                feeGroup: item.fmG_GroupName,
                feeHead: item.fmH_FeeName,
                active: item.fmG_ActiceFlag,
                fine: item.fyg_FineApplicableFlag || '--',
                installment: item.ftI_Name,
                amount: item.amount
            }));

            setTableRows(mappedRows);

            // const rawData: any = MOCK_HEADWISE_REPORT;

            // if (!Array.isArray(rawData?.list) || rawData.list.length === 0) {
            //     toast.error('No data found');
            //     setShowTable(false);
            //     return;
            // }

            toast.success('Report Data Fetched Successfully');

            // setTableRows(mappedRows);
            setShowTable(true);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch report');
            setTableColumns([]);
            setTableRows([]);
            setShowTable(true);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        // 🔹 Reset RHF internal state
        reset();

        // 🔹 Force re-mount of Selects
        setFormKey((k) => k + 1);

        setSubmitClicked(false);

        // 🔹 Clear table & selection
        setTableColumns([]);
        setTableRows([]);
        setSelectedRows([]);
        setShowTable(false);

        // 🔹 Clear search & pagination
        setSearchTerm('');
        setCurrentPage(1);

        setClassCategory([]);
        // refetchAcademicYears();
        // setRefreshAY((n) => n + 1);
    };

    return (
        <div className='rounded-lg border bg-card p-6 text-card-foreground shadow-sm'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <div className='flex justify-center'>
                    <div className='w-full max-w-4xl space-y-6'>
                        <div key={formKey} className='space-y-6'>
                            {/* Academic Year */}
                            <div className='grid grid-cols-[200px_1fr] gap-4'>
                                {/* Label */}
                                <Label className='pt-2 text-right font-medium'>
                                    Academic Year <span className='text-red-500'>*</span>
                                </Label>

                                {/* Field + Error */}
                                <div>
                                    <Controller
                                        name='asmaY_Id'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value?.toString()}
                                                onValueChange={(v) => {
                                                    const num = Number(v);
                                                    field.onChange(num);
                                                    onYearChange(num);
                                                }}>
                                                <SelectTrigger className='w-full' disabled={loadingAcademic}>
                                                    <SelectValue
                                                        placeholder={
                                                            loadingAcademic ? 'Loading academic years...' : '--Select Academic Year--'
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {loadingAcademic ? (
                                                        <SelectItem value='loading' disabled>
                                                            Loading...
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

                                    {/* ✅ Error BELOW field */}
                                    {errors.asmaY_Id && <FormError className='mt-1'>{errors.asmaY_Id.message}</FormError>}
                                </div>
                            </div>

                            <div className='grid grid-cols-[200px_1fr] gap-4'>
                                {/* Label */}
                                <Label className='pt-2 text-right font-medium'>
                                    Class Category <span className='text-red-500'>*</span>
                                </Label>

                                {/* Field + Error */}
                                <div>
                                    <Controller
                                        name='classcategoryid'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value?.toString()}
                                                onValueChange={(v) => {
                                                    const num = Number(v);
                                                    field.onChange(num);
                                                }}>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue
                                                        placeholder={
                                                            classCategoryLoading
                                                                ? 'Loading class categories...'
                                                                : '--Select Class Category--'
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {classcategory.map((item) => (
                                                        <SelectItem key={item.fmcC_Id} value={item.fmcC_Id.toString()}>
                                                            {item.fhwR_ClassCategoryName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />

                                    {/* ✅ Error BELOW field */}
                                    {errors.classcategoryid && <FormError className='mt-1'>{errors.classcategoryid.message}</FormError>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center gap-4 border-t pt-6'>
                    <Button type='submit' disabled={isSubmitting} className='min-w-32'>
                        {isSubmitting ? 'Generating...' : 'Report'}
                    </Button>

                    <Button type='button' variant='outline' key={formKey} onClick={handleReset}>
                        Cancel
                    </Button>
                </div>
            </form>
            {/* <div className='my-6 border-gray-300 border-t' /> */}

            <div className='mt-10'>
                <div className='my-6 border-gray-300 border-t' />

                <CollapsibleSection defaultOpen={true}>
                    {showTable && (
                        <div className='mb-6 text-center'>
                            <h2 className='font-bold text-2xl text-primary'>Fee Due Date Report</h2>
                            <div className='mb-4 flex justify-end gap-2'>
                                <Button size='sm' className='h-8 w-auto px-3 text-xs' onClick={handleExportExcel}>
                                    Export Excel
                                </Button>

                                <Button size='sm' variant='outline' className='h-8 w-auto px-3 text-xs' onClick={handlePrint}>
                                    Print
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* <div className='my-6 border-gray-300 border-t' /> */}

                    {/* {showTable && (
                    <div className='mb-4 flex justify-end gap-2'>
                        <Button size='sm' className='h-8 w-auto px-3 text-xs' onClick={handleExportExcel}>
                            Export Excel
                        </Button>

                        <Button size='sm' variant='outline' className='h-8 w-auto px-3 text-xs' onClick={handlePrint}>
                            Print
                        </Button>
                    </div>
                )} */}

                    {showTable && (
                        <div className='mt-8 rounded-md border'>
                            <div className='px-4 pt-4 pb-3'>
                                <Input
                                    type='text'
                                    placeholder='Search...'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='w-64 rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-1'
                                />

                                {/* <span className='text-gray-500 text-sm'>
                                Showing {filteredRows.length} records
                            </span> */}
                            </div>

                            <table className='w-full border-collapse text-sm'>
                                {/* HEADER */}
                                <thead className='bg-primary text-white'>
                                    <tr>
                                        <th className='w-10 border px-2 py-2 text-center'>
                                            <Checkbox
                                                checked={selectedRows.length === tableRows.length && tableRows.length > 0}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedRows(tableRows);
                                                    } else {
                                                        setSelectedRows([]);
                                                    }
                                                }}
                                            />
                                        </th>
                                        <th className='border px-3 py-2 text-center'>Sl NO.</th>
                                        <th className='border px-3 py-2 text-left'>Fee Group</th>
                                        <th className='border px-3 py-2 text-left'>Fee Head</th>
                                        <th className='border px-3 py-2 text-center'>Installment Name</th>
                                        <th className='border px-3 py-2 text-center'>Sub-Installment Name</th>
                                        <th className='border px-3 py-2 text-center'>Due Date</th>
                                        <th className='border px-3 py-2 text-right'>Fine Slab</th>
                                        <th className='border px-3 py-2 text-right'>Fine Type</th>
                                        <th className='border px-3 py-2 text-right'>Fine Amount</th>
                                    </tr>
                                </thead>

                                {/* BODY */}
                                <tbody>
                                    {paginatedRows.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className='border px-4 py-6 text-center text-gray-500'>
                                                No records found
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedRows.map((row: any, index: number) => (
                                            <tr key={index} className='hover:bg-blue-50'>
                                                <td className='border px-2 py-2 text-center'>
                                                    <Checkbox
                                                        checked={selectedRows.some((r) => r.slno === row.slno)}
                                                        onCheckedChange={() => toggleRowSelection(row)}
                                                    />
                                                </td>
                                                <td className='border px-3 py-2 text-center'>{row.slno}</td>
                                                <td className='border px-3 py-2'>{row.feeGroup}</td>
                                                <td className='border px-3 py-2'>{row.feeHead}</td>
                                                <td className='border px-3 py-2 text-center'>{row.active ? 'true' : 'false'}</td>
                                                <td className='border px-3 py-2 text-center'>{row.fine}</td>
                                                <td className='border px-3 py-2 text-center'>{row.installment}</td>
                                                <td className='border px-3 py-2 text-right'>{row.amount}</td>
                                                <td className='border px-3 py-2 text-right'>{row.amount}</td>
                                                <td className='border px-3 py-2 text-right'>{row.amount}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            {showTable && (
                                <div className='mt-4 flex items-center justify-between text-muted-foreground text-sm'>
                                    {/* LEFT TEXT */}
                                    <div>
                                        Showing {startIndex + 1} to {Math.min(endIndex, totalEntries)} of {totalEntries} entries
                                    </div>

                                    {/* RIGHT CONTROLS */}
                                    <div className='flex items-center gap-3'>
                                        {/* Rows per page */}
                                        <div className='flex items-center gap-2'>
                                            <span>Rows per page</span>
                                            <select
                                                value={rowsPerPage}
                                                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                                className='h-8 rounded border px-2'>
                                                {[10, 20, 50].map((size) => (
                                                    <option key={size} value={size}>
                                                        {size}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Pagination buttons */}
                                        <div className='flex items-center gap-1'>
                                            <Button
                                                size='icon'
                                                variant='outline'
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(1)}>
                                                ⏮
                                            </Button>

                                            <Button
                                                size='icon'
                                                variant='outline'
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage((p) => p - 1)}>
                                                ◀
                                            </Button>

                                            <Button
                                                size='icon'
                                                variant='outline'
                                                disabled={currentPage === totalPages || totalPages === 0}
                                                onClick={() => setCurrentPage((p) => p + 1)}>
                                                ▶
                                            </Button>

                                            <Button
                                                size='icon'
                                                variant='outline'
                                                disabled={currentPage === totalPages || totalPages === 0}
                                                onClick={() => setCurrentPage(totalPages)}>
                                                ⏭
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CollapsibleSection>
            </div>
        </div>
    );
}

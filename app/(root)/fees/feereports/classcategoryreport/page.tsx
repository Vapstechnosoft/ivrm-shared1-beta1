'use client';
import { getStatusBadge } from '@/components/extras/helpers/helper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeeDefaulterReport } from '@/hooks/fees/useReports';
import { feesClassCategoryReportSchema } from '@/schemas/fees/reports';
import { getFeeClassCategory } from '@/server/fees/reports/fee_class_category_reports';
import type { FeeClassCategoryReportList } from '@/types/fees/reports/reports';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import {
    exportToExcelforAmountEntry,
    exportToExcelforClassCategory,
    exportToExcelforCustomGroup,
    exportToExcelforFeeGroup,
    exportToExcelforFineSlab,
    exportToExcelforInstallment,
    exportToExcelforPrivileges,
    exportToExcelforTerms,
    exportToExcelforYearlyHead,
    exportToExcelforfeeHead,
    printTable
} from './_components/export_toexcel';

type FormFields = z.infer<typeof feesClassCategoryReportSchema.addOrUpdate>;

export default function ClassCategoryReport() {
    const { control } = useForm<FormFields>({
        resolver: zodResolver(feesClassCategoryReportSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            asmaY_Id: undefined
        }
    });

    const [selectedOption, setSelectedOption] = useState<string>('');
    const [reportData, setReportData] = useState<FeeClassCategoryReportList[]>([]);
    const [showReport, setShowReport] = useState(false);
    const [reportLoading, setReportLoading] = useState(false);
    const [selectedAsmayId, setSelectedAsmayId] = useState<number>();

    const { data: academicYearData, isLoading: loadingYears } = useFeeDefaulterReport();

    const fetchclassCategory = async () => {
        setReportLoading(true);
        try {
            const reportArray = await getFeeClassCategory(
                Number(selectedAsmayId ?? 0),
                selectedOption === 'feeGroup'
                    ? 1
                    : selectedOption === 'feeHead'
                      ? 2
                      : selectedOption === 'yearlyGroupHead'
                        ? 3
                        : selectedOption === 'installment'
                          ? 4
                          : selectedOption === 'fineslab'
                            ? 5
                            : selectedOption === 'classCategory'
                              ? 6
                              : selectedOption === 'privileges'
                                ? 7
                                : selectedOption === 'terms'
                                  ? 8
                                  : selectedOption === 'amountEntry'
                                    ? 9
                                    : 10
            );
            // console.log("reportArray.data", reportArray.data);
            setReportData(reportArray.data || []);
            setShowReport(true);
            if (reportArray.data?.length === 0) {
                toast.info('No Data Available!!');
            }
        } catch (error) {
            console.error('Failed to fetch students:', error);
            setReportData([]);
        } finally {
            setReportLoading(false);
        }
    };

    const onSubmit = async () => {
        if (
            (selectedOption === 'feeGroup' ||
                selectedOption === 'yearlyGroupHead' ||
                selectedOption === 'installment' ||
                selectedOption === 'classCategory' ||
                selectedOption === 'privileges' ||
                selectedOption === 'amountEntry') &&
            !selectedAsmayId?.toString()
        ) {
            toast.error('Select an Academic Year');
            return;
        }
        fetchclassCategory();
    };

    useEffect(() => {
        setReportData([]);
    }, [selectedOption, selectedAsmayId]);

    function formatDateToYMD(date: any) {
        if (!date) return null;
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    const handleExport = () => {
        if (reportData.length === 0) {
            toast.error('Currently Data is not Available');
            return;
        }
        selectedOption === 'feeGroup'
            ? exportToExcelforFeeGroup(reportData, 'Class Category Report')
            : selectedOption === 'feeHead'
              ? exportToExcelforfeeHead(reportData, 'Class Category Report')
              : selectedOption === 'yearlyGroupHead'
                ? exportToExcelforYearlyHead(reportData, 'Class Category Report')
                : selectedOption === 'installment'
                  ? exportToExcelforInstallment(reportData, 'Class Category Report')
                  : selectedOption === 'fineslab'
                    ? exportToExcelforFineSlab(reportData, 'Class Category Report')
                    : selectedOption === 'classCategory'
                      ? exportToExcelforClassCategory(reportData, 'Class Category Report')
                      : selectedOption === 'privileges'
                        ? exportToExcelforPrivileges(reportData, 'Class Category Report')
                        : selectedOption === 'terms'
                          ? exportToExcelforTerms(reportData, 'Class Category Report')
                          : selectedOption === 'amountEntry'
                            ? exportToExcelforAmountEntry(reportData, 'Class Category Report')
                            : exportToExcelforCustomGroup(reportData, 'Class Category Report');
    };

    const handlePrintforFeeGroup = () => {
        const columns = ['Sl No', 'Fee Group Name'];

        const rowsToPrint = reportData.map((row, index) => ({
            'Sl No': index + 1,
            'Fee Group Name': row.fmG_GroupName
        }));
        printTable(columns, rowsToPrint);
    };
    const handlePrintforfeeHead = () => {
        const columns = ['Sl No', 'Fee Head Name', 'Fee Refund Flag', 'Fee PDA Flag', 'Fee Special Flag'];

        const rowsToPrint = reportData.map((row, index) => ({
            'Sl No': index + 1,
            'Fee Head Name': row.fmH_FeeName,
            'Fee Refund Flag': row.fmH_RefundFlag,
            'Fee PDA Flag': row.fmH_PDAFlag,
            'Fee Special Flag': row.fmH_SpecialFeeFlag
        }));
        printTable(columns, rowsToPrint);
    };
    const handlePrintforYearlyHead = () => {
        const columns = ['Sl No', 'Fee Group Name', 'Fee Head Name', 'Fee Installment Name', 'Fine Applicable', 'Common Amount'];

        const rowsToPrint = reportData.map((row, index) => ({
            'Sl No': index + 1,
            'Fee Group Name': row.fmG_GroupName,
            'Fee Head Name': row.fmH_FeeName,
            'Fee Installment Name': row.ftI_Name,
            'Fine Applicable': row.fyghM_FineApplicableFlag,
            'Common Amount': row.fyghM_Common_AmountFlag
        }));
        printTable(columns, rowsToPrint);
    };
    const handlePrintforInstallment = () => {
        const columns = ['Sl No', 'Fee Installment Type', 'Fee Installment', 'From Date', 'To Date', 'Applicable Date', 'Due Date'];

        const rowsToPrint = reportData.map((row, index) => ({
            'Sl No': index + 1,
            'Fee Installment Type': row.fmI_Name,
            'Fee Installment': row.ftI_Name,
            'From Date': formatDateToYMD(row.ftidD_FromDate),
            'To Date': formatDateToYMD(row.ftidD_ToDate),
            'Applicable Date': formatDateToYMD(row.ftidD_ApplicableDate),
            'Due Date': formatDateToYMD(row.ftidD_DueDate)
        }));
        printTable(columns, rowsToPrint);
    };

    const handlePrintforFineSlab = () => {
        const columns = ['Sl No', 'Fine Type', 'From Day', 'To Day', 'ECS Flag'];

        const rowsToPrint = reportData.map((row, index) => ({
            'Sl No': index + 1,
            'Fine Type': row.fmfS_FineType,
            'From Day': row.fmfS_FromDay,
            'To Day': row.fmfS_ToDay,
            'ECS Flag': row.fmfS_ECSFlag
        }));
        printTable(columns, rowsToPrint);
    };

    const handlePrintforClassCategory = () => {
        const columns = ['Sl No', 'Fee Class Category', 'Class Name', 'Section Name'];

        const rowsToPrint = reportData.map((row, index) => ({
            'Sl No': index + 1,
            'Fee Class Category': row.fmcC_ClassCategoryName,
            'Class Name': row.asmcL_ClassName,
            'Section Name': row.asmC_SectionName
        }));
        printTable(columns, rowsToPrint);
    };

    const handlePrintforPrivileges = () => {
        const columns = ['Sl No', 'User Name-User Role', 'Fee Group Name', 'Fee Head Name'];

        const rowsToPrint = reportData.map((row, index) => ({
            'Sl No': index + 1,
            'User Name-User Role': `${row.normalizedUserName}-${row.ivrmrT_Role}`,
            'Fee Group Name': row.fmG_GroupName,
            'Fee Head Name': row.fmH_FeeName
        }));
        printTable(columns, rowsToPrint);
    };
    const handlePrintforTerms = () => {
        const columns = ['Sl No', 'Fee Term Name', 'Fee Head Name', 'Fee Installment Name'];

        const rowsToPrint = reportData.map((row, index) => ({
            'Sl No': index + 1,
            'Fee Term Name': row.fmT_Name,
            'Fee Head Name': row.fmH_FeeName,
            'Fee Installment Name': row.ftI_Name
        }));
        printTable(columns, rowsToPrint);
    };

    const handlePrintforAmountEntry = () => {
        const columns = ['Sl No', 'Fee Group Name', 'Fee Category Name', 'Fee Head', 'Installment Name', 'Amount', 'Due Month', 'Fine'];

        const rowsToPrint = reportData.map((row, index) => ({
            'Sl No': index + 1,
            'Fee Group Name': row.fmG_GroupName,
            'Fee Category Name': row.fmcC_ClassCategoryName,
            'Fee Head': row.fmH_FeeName,
            'Installment Name': row.ftI_Name,
            Amount: row.fmA_Amount,
            'Due Month': row.ftddE_Month,
            Fine: ''
        }));
        printTable(columns, rowsToPrint);
    };

    const handlePrintforCustomGroup = () => {
        const columns = ['Sl No', 'Fee Head', 'Fee Group Name'];

        const rowsToPrint = reportData.map((row, index) => ({
            'Sl No': index + 1,
            'Fee Head': row.fmG_GroupName,
            'Fee Group Name': row.fmgG_GroupName
        }));
        printTable(columns, rowsToPrint);
    };

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <div className='mx-auto max-w-7xl'>
                <Card className='border-0 shadow-xl'>
                    {/* Radio Group for all options */}
                    <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className='pt-8 pr-8 pl-8'>
                        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
                            <div className='flex items-center space-x-3 p-3'>
                                <RadioGroupItem value='feeGroup' id='feeGroup' />
                                <Label htmlFor='feeGroup' className='cursor-pointer font-medium text-gray-700'>
                                    FeeGroup
                                </Label>
                            </div>

                            <div className='flex items-center space-x-3 p-3'>
                                <RadioGroupItem value='feeHead' id='feeHead' />
                                <Label htmlFor='feeHead' className='cursor-pointer font-medium text-gray-700'>
                                    FeeHead
                                </Label>
                            </div>

                            <div className='flex items-center space-x-3 p-3'>
                                <RadioGroupItem value='yearlyGroupHead' id='yearlyGroupHead' />
                                <Label htmlFor='yearlyGroupHead' className='cursor-pointer font-medium text-gray-700'>
                                    Yearly Group Head
                                </Label>
                            </div>

                            <div className='flex items-center space-x-3 p-3'>
                                <RadioGroupItem value='installment' id='installment' />
                                <Label htmlFor='installment' className='cursor-pointer font-medium text-gray-700'>
                                    Installment
                                </Label>
                            </div>
                            <div className='flex items-center space-x-3 p-3'>
                                <RadioGroupItem value='fineslab' id='fineslab' />
                                <Label htmlFor='fineslab' className='cursor-pointer font-medium text-gray-700'>
                                    Fineslab
                                </Label>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
                            <div className='flex items-center space-x-3 p-3'>
                                <RadioGroupItem value='classCategory' id='classCategory' />
                                <Label htmlFor='classCategory' className='cursor-pointer font-medium text-gray-700'>
                                    Class Category
                                </Label>
                            </div>

                            <div className='flex items-center space-x-3 p-3'>
                                <RadioGroupItem value='privileges' id='privileges' />
                                <Label htmlFor='privileges' className='cursor-pointer font-medium text-gray-700'>
                                    Privileges
                                </Label>
                            </div>

                            <div className='flex items-center space-x-3 p-3'>
                                <RadioGroupItem value='terms' id='terms' />
                                <Label htmlFor='terms' className='cursor-pointer font-medium text-gray-700'>
                                    Terms
                                </Label>
                            </div>
                            <div className='flex items-center space-x-3 p-3'>
                                <RadioGroupItem value='amountEntry' id='amountEntry' />
                                <Label htmlFor='amountEntry' className='cursor-pointer font-medium text-gray-700'>
                                    Amount Entry
                                </Label>
                            </div>
                            <div className='flex items-center space-x-3 p-3'>
                                <RadioGroupItem value='customGroup' id='customGroup' />
                                <Label htmlFor='customGroup' className='cursor-pointer font-medium text-gray-700'>
                                    Custom Group
                                </Label>
                            </div>
                        </div>
                    </RadioGroup>

                    {/* Academic Year - Centered */}
                    {(selectedOption === 'feeGroup' ||
                        selectedOption === 'yearlyGroupHead' ||
                        selectedOption === 'installment' ||
                        selectedOption === 'classCategory' ||
                        selectedOption === 'privileges' ||
                        selectedOption === 'amountEntry') && (
                        <div className='flex justify-center pt-2'>
                            <div className='w-full max-w-md'>
                                <div className='flex w-full items-center justify-between gap-4'>
                                    <Label htmlFor='asmaY_Id' className='whitespace-nowrap font-semibold'>
                                        Academic Year <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        name='asmaY_Id'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                key={field.value || 'empty'}
                                                onValueChange={(val) => {
                                                    const id = Number(val);
                                                    field.onChange(id);
                                                    setSelectedAsmayId(id);
                                                }}
                                                value={selectedAsmayId?.toString()}
                                                // disabled={loadingYears}
                                            >
                                                <SelectTrigger className='w-64'>
                                                    <SelectValue placeholder='--Select Academic Year--' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {loadingYears ? (
                                                        <SelectItem value='loading' disabled>
                                                            Loading...
                                                        </SelectItem>
                                                    ) : (
                                                        academicYearData?.data?.map((item: any) => (
                                                            <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                                {item.asmaY_Year}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className='p-8'>
                        <div className='space-y-8'>
                            <div>
                                <div className='flex justify-end gap-4 border-t pt-8'>
                                    <Button size='lg' variant='outline' className='px-8' onClick={() => window.location.reload()}>
                                        Cancel
                                    </Button>

                                    <Button size='lg' className='px-12' onClick={onSubmit} disabled={!selectedOption}>
                                        {reportLoading ? (
                                            <>
                                                <div className='mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
                                                Generating Report...
                                            </>
                                        ) : (
                                            'Generate Report'
                                        )}
                                    </Button>
                                </div>
                                {showReport && selectedOption === 'feeGroup' && reportData.length > 0 && (
                                    <div className='mt-10'>
                                        <CollapsibleSection defaultOpen={true}>
                                            <div className='mt-5 rounded-lg border bg-white shadow-xl'>
                                                <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-3'>
                                                    <div className='mb-6 text-center'>
                                                        <h2 className='font-bold text-primary text-xl'>Fee Class Category Report</h2>
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
                                                                onClick={handlePrintforFeeGroup}>
                                                                Print
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='overflow-x-auto'>
                                                    <table className='w-full border-collapse text-sm'>
                                                        <thead className='bg-primary text-white'>
                                                            <tr>
                                                                <th className='w-20 border px-4 py-2 text-center'>Sl No</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Group Name</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {reportData.map((row, index) => (
                                                                <tr key={index} className='odd:bg-gray-50 hover:bg-gray-100'>
                                                                    <td className='border px-4 py-2 text-center'>{index + 1}</td>
                                                                    <td className='border px-4 py-2 text-center font-medium'>
                                                                        {row.fmG_GroupName}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </CollapsibleSection>
                                    </div>
                                )}

                                {showReport && selectedOption === 'feeHead' && reportData.length > 0 && (
                                    <div className='mt-10'>
                                        <CollapsibleSection defaultOpen={true}>
                                            <div className='mt-5 rounded-lg border bg-white shadow-xl'>
                                                <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-3'>
                                                    <div className='mb-6 text-center'>
                                                        <h2 className='font-bold text-primary text-xl'>Fee Class Category Report</h2>
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
                                                                onClick={handlePrintforfeeHead}>
                                                                Print
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='overflow-x-auto'>
                                                    <table className='w-full border-collapse'>
                                                        <thead className='bg-primary text-white'>
                                                            <tr>
                                                                <th className='w-20 border px-4 py-2 text-center'>Sl No</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Head Name</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Refund Flag</th>
                                                                <th className='border px-4 py-2 text-center'>Fee PDA Flag</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Special Flag</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {reportData.map((row, index) => (
                                                                <tr key={row.fmH_Id} className='odd:bg-gray-50 hover:bg-gray-100'>
                                                                    <td className='border px-4 py-2 text-center'>{index + 1}</td>
                                                                    <td className='border px-4 py-2 text-center font-medium'>
                                                                        {row.fmH_FeeName}
                                                                    </td>
                                                                    <td className='border px-4 py-2 text-center font-medium'>
                                                                        {getStatusBadge(
                                                                            (row.fmH_RefundFlag as boolean) === true ? 'yes' : 'no'
                                                                        )}
                                                                    </td>
                                                                    <td className='border px-4 py-2 text-center font-medium'>
                                                                        {getStatusBadge(
                                                                            (row.fmH_PDAFlag as boolean) === true ? 'yes' : 'no'
                                                                        )}
                                                                    </td>
                                                                    <td className='border px-4 py-2 text-center font-medium'>
                                                                        {getStatusBadge(
                                                                            (row.fmH_SpecialFeeFlag as boolean) === true ? 'yes' : 'no'
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </CollapsibleSection>
                                    </div>
                                )}

                                {showReport && selectedOption === 'yearlyGroupHead' && reportData.length > 0 && (
                                    <div className='mt-10'>
                                        <CollapsibleSection defaultOpen={true}>
                                            <div className='mt-5 rounded-lg border bg-white shadow-xl'>
                                                <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-3'>
                                                    <div className='mb-6 text-center'>
                                                        <h2 className='font-bold text-primary text-xl'>Fee Class Category Report</h2>
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
                                                                onClick={handlePrintforYearlyHead}>
                                                                Print
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='overflow-x-auto'>
                                                    <table className='w-full border-collapse'>
                                                        <thead className='bg-primary text-white'>
                                                            <tr>
                                                                <th className='w-20 border px-4 py-2 text-center'>Sl No</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Group Name</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Head Name</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Installment Name</th>
                                                                <th className='border px-4 py-2 text-center'>Fine Applicable</th>
                                                                <th className='border px-4 py-2 text-center'>Common Amount</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {(() => {
                                                                const groups: { [key: number]: any[] } = {};

                                                                reportData.forEach((row) => {
                                                                    const groupKey = row.fmG_Id;
                                                                    if (!groups[groupKey]) {
                                                                        groups[groupKey] = [];
                                                                    }
                                                                    groups[groupKey].push(row);
                                                                });

                                                                const rows: JSX.Element[] = [];
                                                                let groupCounter = 1;

                                                                Object.entries(groups).forEach(([groupId, groupRows]) => {
                                                                    groupRows.forEach((row, index) => {
                                                                        const isFirstRow = index === 0;

                                                                        rows.push(
                                                                            <tr
                                                                                key={`${row.ftI_Id}_${groupId}_${index}`}
                                                                                className='odd:bg-gray-50 hover:bg-gray-100'>
                                                                                {isFirstRow && (
                                                                                    <td
                                                                                        rowSpan={groupRows.length}
                                                                                        className='border px-4 py-2 text-center align-middle'>
                                                                                        {groupCounter}
                                                                                    </td>
                                                                                )}
                                                                                {isFirstRow && (
                                                                                    <td
                                                                                        rowSpan={groupRows.length}
                                                                                        className='border px-4 py-2 text-center align-middle font-medium'>
                                                                                        {row.fmG_GroupName}
                                                                                    </td>
                                                                                )}
                                                                                <td className='border px-4 py-2 text-center'>
                                                                                    {row.fmH_FeeName}
                                                                                </td>
                                                                                <td className='border px-4 py-2 text-center'>
                                                                                    {row.ftI_Name}
                                                                                </td>
                                                                                <td className='border px-4 py-2 text-center font-medium'>
                                                                                    {row.fyghM_FineApplicableFlag == null
                                                                                        ? null
                                                                                        : getStatusBadge(
                                                                                              row.fyghM_FineApplicableFlag === 'Y'
                                                                                                  ? 'yes'
                                                                                                  : 'no'
                                                                                          )}
                                                                                </td>
                                                                                <td className='border px-4 py-2 text-center font-medium'>
                                                                                    {row.fyghM_Common_AmountFlag == null
                                                                                        ? null
                                                                                        : getStatusBadge(
                                                                                              row.fyghM_Common_AmountFlag === 'Y'
                                                                                                  ? 'yes'
                                                                                                  : 'no'
                                                                                          )}
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    });

                                                                    groupCounter++;
                                                                });

                                                                return rows;
                                                            })()}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </CollapsibleSection>
                                    </div>
                                )}

                                {showReport && selectedOption === 'installment' && reportData.length > 0 && (
                                    <div className='mt-10'>
                                        <CollapsibleSection defaultOpen={true}>
                                            <div className='mt-5 rounded-lg border bg-white shadow-xl'>
                                                <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-3'>
                                                    <div className='mb-6 text-center'>
                                                        <h2 className='font-bold text-primary text-xl'>Fee Class Category Report</h2>
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
                                                                onClick={handlePrintforInstallment}>
                                                                Print
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='overflow-x-auto'>
                                                    <table className='w-full border-collapse'>
                                                        <thead className='bg-primary text-white'>
                                                            <tr>
                                                                <th className='w-20 border px-4 py-2 text-center'>Sl No</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Installment Type</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Installment</th>
                                                                <th className='border px-4 py-2 text-center'>From Date</th>
                                                                <th className='border px-4 py-2 text-center'>To Date</th>
                                                                <th className='border px-4 py-2 text-center'>Applicable Date</th>
                                                                <th className='border px-4 py-2 text-center'>Due Date</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {(() => {
                                                                const groups: { [key: number]: any[] } = {};

                                                                reportData.forEach((row) => {
                                                                    const groupKey = row.fmI_Id;
                                                                    if (!groups[groupKey]) {
                                                                        groups[groupKey] = [];
                                                                    }
                                                                    groups[groupKey].push(row);
                                                                });

                                                                const rows: JSX.Element[] = [];
                                                                let groupCounter = 1;

                                                                Object.entries(groups).forEach(([installmentTypeId, groupRows]) => {
                                                                    const typeIdNum = Number.parseInt(installmentTypeId);
                                                                    groupRows.forEach((row, index) => {
                                                                        const isFirstRow = index === 0;

                                                                        rows.push(
                                                                            <tr
                                                                                key={`${row.ftI_Id}_${typeIdNum}_${index}`}
                                                                                className='odd:bg-gray-50 hover:bg-gray-100'>
                                                                                {isFirstRow && (
                                                                                    <td
                                                                                        rowSpan={groupRows.length}
                                                                                        className='border px-4 py-2 text-center align-middle'>
                                                                                        {groupCounter}
                                                                                    </td>
                                                                                )}

                                                                                {isFirstRow && (
                                                                                    <td
                                                                                        rowSpan={groupRows.length}
                                                                                        className='border px-4 py-2 text-center align-middle font-medium'>
                                                                                        {row.fmI_Name}
                                                                                    </td>
                                                                                )}
                                                                                <td className='border px-4 py-2 text-center'>
                                                                                    {row.ftI_Name}
                                                                                </td>
                                                                                <td className='border px-4 py-2 text-center'>
                                                                                    {formatDateToYMD(row.ftidD_FromDate)}
                                                                                </td>
                                                                                <td className='border px-4 py-2 text-center'>
                                                                                    {formatDateToYMD(row.ftidD_ToDate)}
                                                                                </td>
                                                                                <td className='border px-4 py-2 text-center'>
                                                                                    {formatDateToYMD(row.ftidD_ApplicableDate)}
                                                                                </td>
                                                                                <td className='border px-4 py-2 text-center'>
                                                                                    {formatDateToYMD(row.ftidD_DueDate)}
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    });

                                                                    groupCounter++;
                                                                });

                                                                return rows;
                                                            })()}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </CollapsibleSection>
                                    </div>
                                )}

                                {showReport && selectedOption === 'fineslab' && reportData.length > 0 && (
                                    <div className='mt-10'>
                                        <CollapsibleSection defaultOpen={true}>
                                            <div className='mt-5 rounded-lg border bg-white shadow-xl'>
                                                <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-3'>
                                                    <div className='mb-6 text-center'>
                                                        <h2 className='font-bold text-primary text-xl'>Fee Class Category Report</h2>
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
                                                                onClick={handlePrintforFineSlab}>
                                                                Print
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='overflow-x-auto'>
                                                    <table className='w-full border-collapse'>
                                                        <thead className='bg-primary text-white'>
                                                            <tr>
                                                                <th className='w-20 border px-4 py-2 text-center'>Sl No</th>
                                                                <th className='border px-4 py-2 text-center'>Fine Type</th>
                                                                <th className=' border px-4 py-2 text-center'>From Day</th>
                                                                <th className='border px-4 py-2 text-center'>To Day</th>
                                                                <th className='border px-4 py-2 text-center'>ECS Flag</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {reportData.map((row, index) => (
                                                                <tr key={row.fmfS_Id} className='odd:bg-gray-50 hover:bg-gray-100'>
                                                                    <td className='border px-4 py-2 text-center'>{index + 1}</td>
                                                                    <td className='border px-4 py-2 text-center font-medium'>
                                                                        {row.fmfS_FineType}
                                                                    </td>
                                                                    <td className='border px-4 py-2 text-center'>{row.fmfS_FromDay}</td>
                                                                    <td className='border px-4 py-2 text-center'>{row.fmfS_ToDay}</td>
                                                                    <td className='border px-4 py-2 text-center'>{row.fmfS_ECSFlag}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </CollapsibleSection>
                                    </div>
                                )}

                                {showReport && selectedOption === 'classCategory' && reportData.length > 0 && (
                                    <div className='mt-10'>
                                        <CollapsibleSection defaultOpen={true}>
                                            <div className='mt-5 rounded-lg border bg-white shadow-xl'>
                                                <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-3'>
                                                    <div className='mb-6 text-center'>
                                                        <h2 className='font-bold text-primary text-xl'>Fee Class Category Report</h2>
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
                                                                onClick={handlePrintforClassCategory}>
                                                                Print
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='overflow-x-auto'>
                                                    <table className='w-full border-collapse'>
                                                        <thead className='bg-primary text-white'>
                                                            <tr>
                                                                <th className='w-20 border px-4 py-2 text-center'>Sl No</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Class Category</th>
                                                                <th className=' border px-4 py-2 text-center'>Class Name</th>
                                                                <th className='border px-4 py-2 text-center'>Section Name</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {(() => {
                                                                const classGroups: {
                                                                    [key: number]: { [key: number]: any[] };
                                                                } = {};

                                                                reportData.forEach((row) => {
                                                                    const classId = row.asmcL_Id;
                                                                    const sectionId = row.asmS_Id;

                                                                    if (!classGroups[classId]) {
                                                                        classGroups[classId] = {};
                                                                    }
                                                                    if (!classGroups[classId][sectionId]) {
                                                                        classGroups[classId][sectionId] = [];
                                                                    }
                                                                    classGroups[classId][sectionId].push(row);
                                                                });

                                                                const rows: JSX.Element[] = [];
                                                                let overallCounter = 1;

                                                                Object.entries(classGroups).forEach(([classId, sectionGroups]) => {
                                                                    let totalRowsInClass = 0;
                                                                    Object.values(sectionGroups).forEach((sectionRows) => {
                                                                        totalRowsInClass += sectionRows.length;
                                                                    });

                                                                    let rowsProcessed = 0;

                                                                    Object.entries(sectionGroups).forEach(([sectionId, sectionRows]) => {
                                                                        sectionRows.forEach((row, rowIndex) => {
                                                                            const isFirstInClass = rowsProcessed === 0;
                                                                            const isFirstInSection = rowIndex === 0;

                                                                            rows.push(
                                                                                <tr
                                                                                    key={`${row.fmcC_Id}_${classId}_${sectionId}_${rowIndex}`}
                                                                                    className='odd:bg-gray-50 hover:bg-gray-100'>
                                                                                    {isFirstInClass && (
                                                                                        <td
                                                                                            rowSpan={totalRowsInClass}
                                                                                            className='border px-4 py-2 text-center align-middle'>
                                                                                            {overallCounter}
                                                                                        </td>
                                                                                    )}
                                                                                    {isFirstInClass && (
                                                                                        <td
                                                                                            rowSpan={totalRowsInClass}
                                                                                            className='border px-4 py-2 text-center align-middle font-medium'>
                                                                                            {row.fmcC_ClassCategoryName}
                                                                                        </td>
                                                                                    )}
                                                                                    {isFirstInClass && (
                                                                                        <td
                                                                                            rowSpan={totalRowsInClass}
                                                                                            className='border px-4 py-2 text-center align-middle'>
                                                                                            {row.asmcL_ClassName}
                                                                                        </td>
                                                                                    )}
                                                                                    {isFirstInSection && (
                                                                                        <td
                                                                                            rowSpan={sectionRows.length}
                                                                                            className='border px-4 py-2 text-center align-middle'>
                                                                                            {row.asmC_SectionName}
                                                                                        </td>
                                                                                    )}
                                                                                </tr>
                                                                            );

                                                                            rowsProcessed++;
                                                                        });
                                                                    });

                                                                    overallCounter++;
                                                                });

                                                                return rows;
                                                            })()}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </CollapsibleSection>
                                    </div>
                                )}

                                {showReport && selectedOption === 'privileges' && reportData.length > 0 && (
                                    <div className='mt-10'>
                                        <CollapsibleSection defaultOpen={true}>
                                            <div className='mt-5 rounded-lg border bg-white shadow-xl'>
                                                <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-3'>
                                                    <div className='mb-6 text-center'>
                                                        <h2 className='font-bold text-primary text-xl'>Fee Class Category Report</h2>
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
                                                                onClick={handlePrintforPrivileges}>
                                                                Print
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='overflow-x-auto'>
                                                    <table className='w-full border-collapse'>
                                                        <thead className='bg-primary text-white'>
                                                            <tr>
                                                                <th className='w-20 border px-4 py-2 text-center'>Sl No</th>
                                                                <th className='border px-4 py-2 text-center'>User Name-User Role</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Group Name</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Head Name</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {(() => {
                                                                const groups: { [key: number]: any[] } = {};

                                                                reportData.forEach((row) => {
                                                                    const groupKey = row.user_Id;
                                                                    if (!groups[groupKey]) {
                                                                        groups[groupKey] = [];
                                                                    }
                                                                    groups[groupKey].push(row);
                                                                });

                                                                const rows: JSX.Element[] = [];
                                                                let groupCounter = 1;

                                                                Object.entries(groups).forEach(([userId, groupRows]) => {
                                                                    groupRows.forEach((row, index) => {
                                                                        const isFirstRow = index === 0;

                                                                        rows.push(
                                                                            <tr
                                                                                key={`${userId}_${index}`}
                                                                                className='odd:bg-gray-50 hover:bg-gray-100'>
                                                                                {isFirstRow && (
                                                                                    <td
                                                                                        rowSpan={groupRows.length}
                                                                                        className='border px-4 py-2 text-center align-middle'>
                                                                                        {groupCounter}
                                                                                    </td>
                                                                                )}
                                                                                {isFirstRow && (
                                                                                    <td
                                                                                        rowSpan={groupRows.length}
                                                                                        className='border px-4 py-2 text-center align-middle font-medium'>
                                                                                        {row.normalizedUserName}-{row.ivrmrT_Role}
                                                                                    </td>
                                                                                )}
                                                                                <td className='border px-4 py-2 text-center'>
                                                                                    {row.fmG_GroupName}
                                                                                </td>
                                                                                <td className='border px-4 py-2 text-center'>
                                                                                    {row.fmH_FeeName}
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    });

                                                                    groupCounter++;
                                                                });

                                                                return rows;
                                                            })()}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </CollapsibleSection>
                                    </div>
                                )}

                                {showReport && selectedOption === 'terms' && reportData.length > 0 && (
                                    <div className='mt-10'>
                                        <CollapsibleSection defaultOpen={true}>
                                            <div className='mt-5 rounded-lg border bg-white shadow-xl'>
                                                <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-3'>
                                                    <div className='mb-6 text-center'>
                                                        <h2 className='font-bold text-primary text-xl'>Fee Class Category Report</h2>
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
                                                                onClick={handlePrintforTerms}>
                                                                Print
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='overflow-x-auto'>
                                                    <table className='w-full border-collapse'>
                                                        <thead className='bg-primary text-white'>
                                                            <tr>
                                                                <th className='w-20 border px-4 py-2 text-center'>Sl No</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Term Name</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Head Name</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Installment Name</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {(() => {
                                                                // First group by fmT_Id (Term)
                                                                const termGroups: { [key: number]: any[] } = {};

                                                                reportData.forEach((row) => {
                                                                    const termKey = row.fmT_Id;
                                                                    if (!termGroups[termKey]) {
                                                                        termGroups[termKey] = [];
                                                                    }
                                                                    termGroups[termKey].push(row);
                                                                });

                                                                // Generate rows
                                                                const rows: JSX.Element[] = [];
                                                                let overallCounter = 1;

                                                                Object.entries(termGroups).forEach(([termId, termRows]) => {
                                                                    const feeHeadGroups: {
                                                                        [key: number]: any[];
                                                                    } = {};

                                                                    termRows.forEach((row) => {
                                                                        const feeHeadKey = row.fmH_Id;
                                                                        if (!feeHeadGroups[feeHeadKey]) {
                                                                            feeHeadGroups[feeHeadKey] = [];
                                                                        }
                                                                        feeHeadGroups[feeHeadKey].push(row);
                                                                    });
                                                                    Object.entries(feeHeadGroups).forEach(
                                                                        ([feeHeadId, feeHeadRows], feeHeadIndex) => {
                                                                            feeHeadRows.forEach((row, rowIndex) => {
                                                                                const isFirstRowInTerm =
                                                                                    feeHeadIndex === 0 && rowIndex === 0;
                                                                                const isFirstRowInFeeHead = rowIndex === 0;

                                                                                rows.push(
                                                                                    <tr
                                                                                        key={`${row.ftI_Id}_${termId}_${feeHeadId}_${rowIndex}`}
                                                                                        className='odd:bg-gray-50 hover:bg-gray-100'>
                                                                                        {/* Sl.No - only in first row of term with rowspan */}
                                                                                        {isFirstRowInTerm && (
                                                                                            <td
                                                                                                rowSpan={termRows.length}
                                                                                                className='border px-4 py-2 text-center align-middle'>
                                                                                                {overallCounter}
                                                                                            </td>
                                                                                        )}

                                                                                        {/* Fee Term Name - only in first row of term with rowspan */}
                                                                                        {isFirstRowInTerm && (
                                                                                            <td
                                                                                                rowSpan={termRows.length}
                                                                                                className='border px-4 py-2 text-center align-middle font-medium'>
                                                                                                {row.fmT_Name}
                                                                                            </td>
                                                                                        )}

                                                                                        {/* Fee Head Name - only in first row of fee head group with rowspan */}
                                                                                        {isFirstRowInFeeHead && (
                                                                                            <td
                                                                                                rowSpan={feeHeadRows.length}
                                                                                                className='border px-4 py-2 text-center align-middle'>
                                                                                                {row.fmH_FeeName}
                                                                                            </td>
                                                                                        )}

                                                                                        {/* Fee Installment Name - show in every row */}
                                                                                        <td className='border px-4 py-2 text-center font-medium'>
                                                                                            {row.ftI_Name}
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            });
                                                                        }
                                                                    );

                                                                    overallCounter++;
                                                                });

                                                                return rows;
                                                            })()}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </CollapsibleSection>
                                    </div>
                                )}

                                {showReport && selectedOption === 'amountEntry' && reportData.length > 0 && (
                                    <div className='mt-10'>
                                        <CollapsibleSection defaultOpen={true}>
                                            <div className='mt-5 rounded-lg border bg-white shadow-xl'>
                                                <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-3'>
                                                    <div className='mb-6 text-center'>
                                                        <h2 className='font-bold text-primary text-xl'>Fee Class Category Report</h2>
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
                                                                onClick={handlePrintforAmountEntry}>
                                                                Print
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='overflow-x-auto'>
                                                    <table className='w-full border-collapse'>
                                                        <thead className='bg-primary text-white'>
                                                            <tr>
                                                                <th className='w-20 border px-4 py-2 text-center'>Sl No</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Group Name</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Category Name</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Head</th>
                                                                <th className='border px-4 py-2 text-center'>Installment Name</th>
                                                                <th className='border px-4 py-2 text-center'>Amount</th>
                                                                <th className='border px-4 py-2 text-center'>Due Month</th>
                                                                <th className='border px-4 py-2 text-center'>Fine</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {(() => {
                                                                const groups: { [key: number]: any[] } = {};

                                                                reportData.forEach((row) => {
                                                                    const groupKey = row.fmG_Id;
                                                                    if (!groups[groupKey]) {
                                                                        groups[groupKey] = [];
                                                                    }
                                                                    groups[groupKey].push(row);
                                                                });

                                                                const rows: JSX.Element[] = [];
                                                                let groupCounter = 1;

                                                                Object.entries(groups).forEach(([groupId, groupRows]) => {
                                                                    groupRows.forEach((row, index) => {
                                                                        const isFirstRow = index === 0;

                                                                        rows.push(
                                                                            <tr
                                                                                key={`${row.fmA_Id}_${groupId}_${index}`}
                                                                                className='odd:bg-gray-50 hover:bg-gray-100'>
                                                                                {isFirstRow && (
                                                                                    <td
                                                                                        rowSpan={groupRows.length}
                                                                                        className='border px-4 py-2 text-center align-middle'>
                                                                                        {groupCounter}
                                                                                    </td>
                                                                                )}
                                                                                {isFirstRow && (
                                                                                    <td
                                                                                        rowSpan={groupRows.length}
                                                                                        className='border px-4 py-2 text-center align-middle font-medium'>
                                                                                        {row.fmG_GroupName}
                                                                                    </td>
                                                                                )}
                                                                                <td className='border px-4 py-2 text-center align-middle'>
                                                                                    {row.fmcC_ClassCategoryName}
                                                                                </td>
                                                                                <td className='border px-4 py-2 text-center align-middle'>
                                                                                    {row.fmH_FeeName}
                                                                                </td>
                                                                                <td className='border px-4 py-2 text-center'>
                                                                                    {row.ftI_Name}
                                                                                </td>
                                                                                <td className='border px-4 py-2 text-center'>
                                                                                    {row.fmA_Amount}
                                                                                </td>
                                                                                <td className='border px-4 py-2 text-center'>
                                                                                    {row.ftddE_Month}
                                                                                </td>
                                                                                <td className='border px-4 py-2 text-center'>{}</td>
                                                                            </tr>
                                                                        );
                                                                    });

                                                                    groupCounter++;
                                                                });

                                                                return rows;
                                                            })()}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </CollapsibleSection>
                                    </div>
                                )}

                                {showReport && selectedOption === 'customGroup' && reportData.length > 0 && (
                                    <div className='mt-10'>
                                        <CollapsibleSection defaultOpen={true}>
                                            <div className='mt-5 rounded-lg border bg-white shadow-xl'>
                                                <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-3'>
                                                    <div className='mb-6 text-center'>
                                                        <h2 className='font-bold text-primary text-xl'>Fee Class Category Report</h2>
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
                                                                onClick={handlePrintforCustomGroup}>
                                                                Print
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='overflow-x-auto'>
                                                    <table className='w-full border-collapse'>
                                                        <thead className='bg-primary text-white'>
                                                            <tr>
                                                                <th className='w-20 border px-4 py-2 text-center'>Sl No</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Head</th>
                                                                <th className='border px-4 py-2 text-center'>Fee Group Name</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {(() => {
                                                                const groups: { [key: number]: any[] } = {};

                                                                reportData.forEach((row) => {
                                                                    const groupKey = row.fmG_Id;
                                                                    if (!groups[groupKey]) {
                                                                        groups[groupKey] = [];
                                                                    }
                                                                    groups[groupKey].push(row);
                                                                });

                                                                // Generate rows
                                                                const rows: JSX.Element[] = [];
                                                                let groupCounter = 1;

                                                                Object.entries(groups).forEach(([groupId, groupRows]) => {
                                                                    const feeHeadName = groupRows[0]?.fmG_GroupName;
                                                                    const firstRow = groupRows[0];

                                                                    rows.push(
                                                                        <tr key={`${groupId}_${groupCounter}`} className='hover:bg-gray-50'>
                                                                            <td
                                                                                rowSpan={groupRows.length}
                                                                                className='border px-4 py-2 text-center align-middle'>
                                                                                {groupCounter}
                                                                            </td>
                                                                            <td
                                                                                rowSpan={groupRows.length}
                                                                                className='border px-4 py-2 text-center align-middle font-medium'>
                                                                                {feeHeadName}
                                                                            </td>
                                                                            <td className='border px-4 py-2 text-center'>
                                                                                {firstRow.fmgG_GroupName}
                                                                            </td>
                                                                        </tr>
                                                                    );

                                                                    for (let i = 1; i < groupRows.length; i++) {
                                                                        const row = groupRows[i];
                                                                        rows.push(
                                                                            <tr
                                                                                key={`${row.fmgG_Id}_${groupId}_${i}`}
                                                                                className='hover:bg-gray-50'>
                                                                                <td className='border px-4 py-2 text-center'>
                                                                                    {row.fmgG_GroupName}
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    }
                                                                    groupCounter++;
                                                                });
                                                                return rows;
                                                            })()}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </CollapsibleSection>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

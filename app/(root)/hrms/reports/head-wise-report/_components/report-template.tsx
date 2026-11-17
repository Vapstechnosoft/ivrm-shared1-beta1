'use client';
import { Button } from '@/components/ui/button';
import { Download, Printer, X } from 'lucide-react';
interface HeadWiseRecord {
    id?: string;
    employeeName: string;
    designation: string;
    totalEarning: number;
    totalDeduction: number;
    netSalary: number;
}
interface ReportTemplateProps {
    schoolName?: string;
    schoolAddress?: string;
    month?: string;
    year?: string;
    reportData: HeadWiseRecord[];
    isLoading?: boolean;
    onPrint: () => void;
    onExport: () => void;
    onCancel: () => void;
}
export function HeadWiseReportTemplate({
    schoolName = '',
    schoolAddress = '',
    month = '',
    year = '',
    reportData,
    isLoading = false,
    onPrint,
    onExport,
    onCancel
}: ReportTemplateProps) {
    // Format currency
    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    // Calculate totals
    const totals = {
        totalEarning: reportData.reduce((sum, record) => sum + (record.totalEarning || 0), 0),
        totalDeduction: reportData.reduce((sum, record) => sum + (record.totalDeduction || 0), 0),
        netSalary: reportData.reduce((sum, record) => sum + (record.netSalary || 0), 0)
    };
    return (
        <div className='mx-auto w-full max-w-[1600px] bg-white p-6 print:p-4'>
            {/* Report Header */}
            <div className='mb-6 text-center'>
                <h1 className='mb-2 font-bold text-2xl text-gray-900 uppercase'>HEADER WISE REPORT</h1>
                {schoolName && <div className='mb-1 font-semibold text-gray-800 text-lg'>{schoolName}</div>}
                {schoolAddress && <div className='text-gray-600 text-sm'>{schoolAddress}</div>}
            </div>
            {/* Report Table */}
            <div className='mb-6 overflow-x-auto'>
                <table className='w-full border-collapse border border-gray-300 text-sm'>
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='whitespace-nowrap border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                SL.No
                            </th>
                            <th className='whitespace-nowrap border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                Employee Name
                            </th>
                            <th className='whitespace-nowrap border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                Designation
                            </th>
                            <th className='whitespace-nowrap border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                Total Earning
                            </th>
                            <th className='whitespace-nowrap border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                Total Deduction
                            </th>
                            <th className='whitespace-nowrap border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                Net Salary
                            </th>
                            <th className='whitespace-nowrap border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                Signature
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className='border border-gray-300 px-4 py-8 text-center text-gray-500'>
                                    Loading header wise report...
                                </td>
                            </tr>
                        ) : reportData.length === 0 ? (
                            <tr>
                                <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                                <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                                <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                                <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                                <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                                <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                                <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                            </tr>
                        ) : (
                            reportData.map((record, index) => (
                                <tr key={record.id || index} className='hover:bg-gray-50'>
                                    <td className='border border-gray-300 px-2 py-2 text-center'>{index + 1}</td>
                                    <td className='border border-gray-300 px-2 py-2 text-left'>{record.employeeName || '-'}</td>
                                    <td className='border border-gray-300 px-2 py-2 text-left'>{record.designation || '-'}</td>
                                    <td className='border border-gray-300 px-2 py-2 text-right'>
                                        {formatCurrency(record.totalEarning || 0)}
                                    </td>
                                    <td className='border border-gray-300 px-2 py-2 text-right'>
                                        {formatCurrency(record.totalDeduction || 0)}
                                    </td>
                                    <td className='border border-gray-300 px-2 py-2 text-right'>{formatCurrency(record.netSalary || 0)}</td>
                                    <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    {/* Totals Row */}
                    <tfoot>
                        <tr className='bg-gray-100 font-semibold'>
                            <td colSpan={3} className='border border-gray-300 px-2 py-2 text-right'>
                                Total:
                            </td>
                            <td className='border border-gray-300 px-2 py-2 text-right'>{formatCurrency(totals.totalEarning)}</td>
                            <td className='border border-gray-300 px-2 py-2 text-right'>{formatCurrency(totals.totalDeduction)}</td>
                            <td className='border border-gray-300 px-2 py-2 text-right'>{formatCurrency(totals.netSalary)}</td>
                            <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            {/* Action Buttons */}
            <div className='flex justify-end gap-3 print:hidden'>
                <Button variant='outline' onClick={onCancel} prefix={<X className='size-4' />}>
                    CANCEL
                </Button>
                <Button variant='outline' onClick={onExport} prefix={<Download className='size-4' />}>
                    EXPORT TO EXCEL
                </Button>
                <Button variant='outline' onClick={onPrint} prefix={<Printer className='size-4' />}>
                    PRINT
                </Button>
            </div>
        </div>
    );
}

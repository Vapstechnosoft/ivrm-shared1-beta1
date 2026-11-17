'use client';
import { Button } from '@/components/ui/button';
import { Download, Printer, X } from 'lucide-react';
interface BankCashRecord {
    id?: string;
    employeeName: string;
    netSalary: number;
    accountNumber?: string;
    ifscCode?: string;
    branch?: string;
}
interface ReportTemplateProps {
    schoolName?: string;
    schoolAddress?: string;
    month?: string;
    year?: string;
    paymentMode?: 'Bank' | 'Cash';
    reportData: BankCashRecord[];
    isLoading?: boolean;
    onPrint: () => void;
    onExport: () => void;
    onCancel: () => void;
}
export function BankCashReportTemplate({
    schoolName = '',
    schoolAddress = '',
    month = '',
    year = '',
    paymentMode = 'Bank',
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
        totalNetSalary: reportData.reduce((sum, record) => sum + (record.netSalary || 0), 0)
    };
    // Format month name to uppercase
    const monthName = month ? month.toUpperCase() : '';
    const yearValue = year || '';
    return (
        <div className='mx-auto w-full max-w-[1600px] bg-white p-6 print:p-4'>
            {/* Report Header */}
            <div className='mb-6 text-center'>
                <h1 className='mb-2 font-bold text-2xl text-gray-900 uppercase'>BANK / CASH REPORT</h1>
                {schoolName && <div className='mb-1 font-semibold text-gray-800 text-lg'>{schoolName}</div>}
                {schoolAddress && <div className='text-gray-600 text-sm'>{schoolAddress}</div>}
                {(monthName || yearValue) && (
                    <p className='mt-2 text-gray-700 text-md'>
                        BANK / CASH REPORT : {monthName} {yearValue}
                    </p>
                )}
            </div>
            {/* Report Table */}
            <div className='mb-6 overflow-x-auto'>
                <table className='w-full border-collapse border border-gray-300 text-sm'>
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='whitespace-nowrap border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                Sl.No
                            </th>
                            <th className='whitespace-nowrap border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                Employee Name
                            </th>
                            {paymentMode === 'Bank' && (
                                <>
                                    <th className='whitespace-nowrap border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                        Bank A/C Number
                                    </th>
                                    <th className='whitespace-nowrap border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                        IFSC
                                    </th>
                                    <th className='whitespace-nowrap border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                        Branch
                                    </th>
                                </>
                            )}
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
                                <td
                                    colSpan={paymentMode === 'Bank' ? 7 : 4}
                                    className='border border-gray-300 px-4 py-8 text-center text-gray-500'>
                                    Loading bank/cash report...
                                </td>
                            </tr>
                        ) : reportData.length === 0 ? (
                            <tr>
                                <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                                <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                                {paymentMode === 'Bank' && (
                                    <>
                                        <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                                        <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                                        <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                                    </>
                                )}
                                <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                                <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                            </tr>
                        ) : (
                            reportData.map((record, index) => (
                                <tr key={record.id || index} className='hover:bg-gray-50'>
                                    <td className='border border-gray-300 px-2 py-2 text-center'>{index + 1}</td>
                                    <td className='border border-gray-300 px-2 py-2 text-left'>{record.employeeName || '-'}</td>
                                    {paymentMode === 'Bank' && (
                                        <>
                                            <td className='border border-gray-300 px-2 py-2 text-center'>{record.accountNumber || '-'}</td>
                                            <td className='border border-gray-300 px-2 py-2 text-center'>{record.ifscCode || '-'}</td>
                                            <td className='border border-gray-300 px-2 py-2 text-center'>{record.branch || '-'}</td>
                                        </>
                                    )}
                                    <td className='border border-gray-300 px-2 py-2 text-right'>{formatCurrency(record.netSalary || 0)}</td>
                                    <td className='border border-gray-300 px-2 py-2 text-center'>-</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    {/* Totals Row */}
                    <tfoot>
                        <tr className='bg-gray-100 font-semibold'>
                            <td colSpan={paymentMode === 'Bank' ? 5 : 2} className='border border-gray-300 px-2 py-2 text-right'>
                                Total:
                            </td>
                            <td className='border border-gray-300 px-2 py-2 text-right'>{formatCurrency(totals.totalNetSalary)}</td>
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

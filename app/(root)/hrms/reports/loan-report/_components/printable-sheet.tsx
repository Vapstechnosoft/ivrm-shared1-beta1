'use client';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import type { EmployeeLoanRecord } from './columns';
interface PrintableSheetProps {
    records: EmployeeLoanRecord[];
    institutionName?: string;
    institutionAddress?: string;
    month?: string;
    year?: string;
    employeeName?: string;
    reportScope: 'all' | 'individual';
    onPrint: () => void;
    onExport: () => void;
}
export function PrintableLoanSheet({
    records,
    institutionName,
    institutionAddress,
    month,
    year,
    employeeName,
    reportScope,
    onPrint,
    onExport
}: PrintableSheetProps) {
    // Calculate totals
    const totals = records.reduce(
        (acc, record) => ({
            loanAmount: acc.loanAmount + record.loanAmount,
            approvedAmount: acc.approvedAmount + record.approvedAmount,
            totalInterest: acc.totalInterest + record.totalInterest,
            totalPayableAmount: acc.totalPayableAmount + record.totalPayableAmount,
            paidAmount: acc.paidAmount + record.paidAmount,
            remainingAmount: acc.remainingAmount + record.remainingAmount
        }),
        {
            loanAmount: 0,
            approvedAmount: 0,
            totalInterest: 0,
            totalPayableAmount: 0,
            paidAmount: 0,
            remainingAmount: 0
        }
    );
    const reportPeriod =
        reportScope === 'all' && month && year
            ? `FOR THE MONTH OF ${month.toUpperCase()} - ${year}`
            : reportScope === 'individual' && employeeName
              ? `FOR EMPLOYEE: ${employeeName.toUpperCase()}`
              : '';
    return (
        <div className='print:bg-white print:p-8'>
            {/* Action Buttons - Hidden in print */}
            <div className='no-print mb-4 flex justify-end gap-2'>
                <Button variant='outline' onClick={onPrint} prefix={<Printer className='size-4' />}>
                    PRINT
                </Button>
                <Button variant='outline' onClick={onExport} prefix={<Download className='size-4' />}>
                    EXPORT TO EXCEL
                </Button>
            </div>
            {/* Report Sheet */}
            <div className='print-sheet rounded-lg border bg-white p-6 shadow-sm'>
                {/* Institution Header */}
                <div className='mb-4 text-center'>
                    <h1 className='font-bold text-2xl uppercase'>{institutionName || 'INSTITUTION NAME'}</h1>
                    {institutionAddress && <p className='mt-2 text-sm'>{institutionAddress}</p>}
                </div>
                {/* Report Title */}
                <div className='mb-4 text-center'>
                    <h2 className='font-bold text-xl uppercase'>EMPLOYEE LOAN REPORT</h2>
                    {reportPeriod && <p className='mt-2 font-semibold text-sm'>{reportPeriod}</p>}
                </div>
                {/* Loan Details Table */}
                <div className='overflow-x-auto'>
                    <table className='print-table w-full border-collapse border border-gray-300 text-sm'>
                        <thead>
                            <tr className='bg-gray-100'>
                                <th className='border border-gray-300 px-3 py-2 text-left'>Sl.No</th>
                                <th className='border border-gray-300 px-3 py-2 text-left'>Employee Code</th>
                                <th className='border border-gray-300 px-3 py-2 text-left'>Employee Name</th>
                                <th className='border border-gray-300 px-3 py-2 text-left'>Department</th>
                                <th className='border border-gray-300 px-3 py-2 text-left'>Designation</th>
                                <th className='border border-gray-300 px-3 py-2 text-left'>Loan Type</th>
                                <th className='border border-gray-300 px-3 py-2 text-right'>Loan Amount</th>
                                <th className='border border-gray-300 px-3 py-2 text-right'>Approved Amount</th>
                                <th className='border border-gray-300 px-3 py-2 text-right'>Interest Rate (%)</th>
                                <th className='border border-gray-300 px-3 py-2 text-right'>EMI Amount</th>
                                <th className='border border-gray-300 px-3 py-2 text-right'>Paid Amount</th>
                                <th className='border border-gray-300 px-3 py-2 text-right'>Remaining Amount</th>
                                <th className='border border-gray-300 px-3 py-2 text-left'>Status</th>
                                <th className='border border-gray-300 px-3 py-2 text-left'>Signature</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length > 0 ? (
                                records.map((record, index) => (
                                    <tr key={record.id || index} className='hover:bg-gray-50'>
                                        <td className='border border-gray-300 px-3 py-2 text-center'>{index + 1}</td>
                                        <td className='border border-gray-300 px-3 py-2'>{record.employeeCode}</td>
                                        <td className='border border-gray-300 px-3 py-2'>{record.employeeName}</td>
                                        <td className='border border-gray-300 px-3 py-2'>{record.department}</td>
                                        <td className='border border-gray-300 px-3 py-2'>{record.designation}</td>
                                        <td className='border border-gray-300 px-3 py-2'>{record.loanType}</td>
                                        <td className='border border-gray-300 px-3 py-2 text-right'>
                                            ₹{record.loanAmount.toLocaleString()}
                                        </td>
                                        <td className='border border-gray-300 px-3 py-2 text-right'>
                                            ₹{record.approvedAmount.toLocaleString()}
                                        </td>
                                        <td className='border border-gray-300 px-3 py-2 text-right'>{record.interestRate}%</td>
                                        <td className='border border-gray-300 px-3 py-2 text-right'>
                                            ₹{record.emiAmount.toLocaleString()}
                                        </td>
                                        <td className='border border-gray-300 px-3 py-2 text-right'>
                                            ₹{record.paidAmount.toLocaleString()}
                                        </td>
                                        <td className='border border-gray-300 px-3 py-2 text-right'>
                                            ₹{record.remainingAmount.toLocaleString()}
                                        </td>
                                        <td className='border border-gray-300 px-3 py-2'>{record.status}</td>
                                        <td className='border border-gray-300 px-3 py-2 text-center'>-</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={14} className='border border-gray-300 px-3 py-8 text-center text-muted-foreground'>
                                        No loan data found for the selected criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {/* Totals Row */}
                        {records.length > 0 && (
                            <tfoot>
                                <tr className='bg-gray-100 font-semibold'>
                                    <td colSpan={6} className='border border-gray-300 px-3 py-2 text-right'>
                                        Total:
                                    </td>
                                    <td className='border border-gray-300 px-3 py-2 text-right'>₹{totals.loanAmount.toLocaleString()}</td>
                                    <td className='border border-gray-300 px-3 py-2 text-right'>
                                        ₹{totals.approvedAmount.toLocaleString()}
                                    </td>
                                    <td className='border border-gray-300 px-3 py-2 text-right'>-</td>
                                    <td className='border border-gray-300 px-3 py-2 text-right'>-</td>
                                    <td className='border border-gray-300 px-3 py-2 text-right'>₹{totals.paidAmount.toLocaleString()}</td>
                                    <td className='border border-gray-300 px-3 py-2 text-right'>
                                        ₹{totals.remainingAmount.toLocaleString()}
                                    </td>
                                    <td className='border border-gray-300 px-3 py-2'>-</td>
                                    <td className='border border-gray-300 px-3 py-2'>-</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
                {/* Summary Section */}
                {records.length > 0 && (
                    <div className='mt-6 grid grid-cols-2 gap-4 border-t pt-4'>
                        <div>
                            <h3 className='mb-2 font-semibold'>Summary</h3>
                            <div className='space-y-1 text-sm'>
                                <div className='flex justify-between'>
                                    <span>Total Loans:</span>
                                    <span className='font-semibold'>{records.length}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Total Loan Amount:</span>
                                    <span className='font-semibold'>₹{totals.loanAmount.toLocaleString()}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Total Approved Amount:</span>
                                    <span className='font-semibold text-green-600'>₹{totals.approvedAmount.toLocaleString()}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Total Paid Amount:</span>
                                    <span className='font-semibold text-blue-600'>₹{totals.paidAmount.toLocaleString()}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Total Remaining Amount:</span>
                                    <span className='font-semibold text-orange-600'>₹{totals.remainingAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className='mb-2 font-semibold'>Status Breakdown</h3>
                            <div className='space-y-1 text-sm'>
                                <div className='flex justify-between'>
                                    <span>Active Loans:</span>
                                    <span className='font-semibold text-blue-600'>
                                        {records.filter((r) => r.status === 'Active').length}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Completed Loans:</span>
                                    <span className='font-semibold text-green-600'>
                                        {records.filter((r) => r.status === 'Completed').length}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Pending Requests:</span>
                                    <span className='font-semibold text-yellow-600'>
                                        {records.filter((r) => r.status === 'Pending').length}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Approved Requests:</span>
                                    <span className='font-semibold text-green-600'>
                                        {records.filter((r) => r.status === 'Approved').length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Printer, X } from 'lucide-react';
interface EarningsItem {
    name: string;
    amount: number;
}
interface DeductionsItem {
    name: string;
    amount: number;
}
interface LeaveDetail {
    serialNo: number;
    leaveName: string;
    totalLeaves: number;
    availedLeaves: number;
    balanceLeaves: number;
}
interface SalarySlipData {
    // Employee Information
    employeeName: string;
    employeeCode: string;
    designation: string;
    panNo?: string;
    payLevel?: string;
    bankName?: string;
    bankAccountNo?: string;
    pfNo?: string;
    esiNo?: string;
    lopDays: number;
    // Financial Details
    earnings: EarningsItem[];
    deductions: DeductionsItem[];
    grossPay: number;
    totalDeduction: number;
    netPayable: number;
    amountInWords: string;
    // Leave Details
    leaveDetails: LeaveDetail[];
}
interface SalarySlipTemplateProps {
    schoolName?: string;
    schoolAddress?: string;
    schoolLogo?: string;
    month: string;
    year: string;
    salarySlipData: SalarySlipData | null;
    showLopDays: boolean;
    showLeaveDetails: boolean;
    showPanCardNo: boolean;
    showBankDetails?: boolean;
    isLoading?: boolean;
    showActions?: boolean;
    onPrint: () => void;
    onSendMail: () => void;
    onSendSMS: () => void;
    onCancel: () => void;
}
export function SalarySlipTemplate({
    schoolName = '',
    schoolAddress = '',
    schoolLogo,
    month,
    year,
    salarySlipData,
    showLopDays = false,
    showLeaveDetails = false,
    showPanCardNo = false,
    showBankDetails = false,
    isLoading = false,
    showActions = true,
    onPrint,
    onSendMail,
    onSendSMS,
    onCancel
}: SalarySlipTemplateProps) {
    // Format currency
    const formatCurrency = (value: number | null | undefined) => {
        if (value === null || value === undefined) return '0.00';
        return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    // Get month name
    const MONTHS = [
        { id: 1, name: 'January' }, { id: 2, name: 'February' }, { id: 3, name: 'March' },
        { id: 4, name: 'April' }, { id: 5, name: 'May' }, { id: 6, name: 'June' },
        { id: 7, name: 'July' }, { id: 8, name: 'August' }, { id: 9, name: 'September' },
        { id: 10, name: 'October' }, { id: 11, name: 'November' }, { id: 12, name: 'December' }
    ];
    const monthRecord = MONTHS.find(m => m.id.toString() === month.toString());
    const displayMonthName = monthRecord ? monthRecord.name.toUpperCase() : month.toUpperCase();
    const yearValue = year || '';
    return (
        <div className='mx-auto w-full max-w-[900px] bg-white p-6 print:p-4'>
            {/* School Header with Logo */}
            <div className='mb-8 space-y-3 border-gray-300 border-b pb-6 text-center'>

                {schoolLogo && (
                    <div className='w-full overflow-hidden rounded-lg mb-4'>
                        <img src={schoolLogo} alt={schoolName} className='w-full h-auto max-h-[150px] object-cover' />
                    </div>
                )}
                <div className='space-y-1'>
                    <h2 className='text-xl font-bold uppercase tracking-[0.2em] text-gray-800'>
                        Salary Slip
                    </h2>
                    <p className='font-medium text-gray-600 text-sm'>
                        FOR THE MONTH OF {displayMonthName} {yearValue}
                    </p>
                </div>
            </div>
            {/* Employee Information */}
            {isLoading ? (
                <div className='py-12 text-center text-gray-500'>Loading salary slip...</div>
            ) : salarySlipData ? (
                <>
                    <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                        {/* Left Column */}
                        <div className='space-y-3 text-sm'>
                            <div>
                                <span className='font-medium text-gray-700'>Name:</span>
                                <span className='ml-2 text-gray-900'>{salarySlipData.employeeName || '-'}</span>
                            </div>
                            <div>
                                <span className='font-medium text-gray-700'>Employee Code:</span>
                                <span className='ml-2 text-gray-900'>{salarySlipData.employeeCode || '-'}</span>
                            </div>
                            <div>
                                <span className='font-medium text-gray-700'>Designation:</span>
                                <span className='ml-2 text-gray-900'>{salarySlipData.designation || '-'}</span>
                            </div>
                            {showBankDetails && (
                                <>
                                    <div>
                                        <span className='font-medium text-gray-700'>Pay Level:</span>
                                        <span className='ml-2 text-gray-900'>{salarySlipData.payLevel || '-'}</span>
                                    </div>
                                    <div>
                                        <span className='font-medium text-gray-700'>Bank Name:</span>
                                        <span className='ml-2 text-gray-900'>{salarySlipData.bankName || '-'}</span>
                                    </div>
                                    <div>
                                        <span className='font-medium text-gray-700'>Bank Acc No:</span>
                                        <span className='ml-2 text-gray-900'>{salarySlipData.bankAccountNo || '-'}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* Right Column */}
                        <div className='space-y-3 text-sm'>
                            {salarySlipData.pfNo && (
                                <div>
                                    <span className='font-medium text-gray-700'>PF No:</span>
                                    <span className='ml-2 text-gray-900'>{salarySlipData.pfNo}</span>
                                </div>
                            )}
                            {showPanCardNo && salarySlipData.panNo && (
                                <div>
                                    <span className='font-medium text-gray-700'>PAN No:</span>
                                    <span className='ml-2 text-gray-900'>{salarySlipData.panNo}</span>
                                </div>
                            )}
                            {salarySlipData.esiNo && (
                                <div>
                                    <span className='font-medium text-gray-700'>ESI No:</span>
                                    <span className='ml-2 text-gray-900'>{salarySlipData.esiNo}</span>
                                </div>
                            )}
                            {showLopDays && (
                                <div>
                                    <span className='font-medium text-gray-700'>LOP Days:</span>
                                    <span className='ml-2 text-gray-900'>{salarySlipData.lopDays || 0}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Financial Details Table */}
                    <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                        {/* Pay and Allowance */}
                        <div>
                            <h3 className='mb-3 border-gray-300 border-b pb-2 font-semibold text-gray-900'>Pay and Allowance</h3>
                            <div className='space-y-2'>
                                {salarySlipData.earnings && salarySlipData.earnings.length > 0 ? (
                                    salarySlipData.earnings.map((earning, index) => (
                                        <div key={index} className='flex justify-between text-sm'>
                                            <span className='text-gray-700'>{earning.name}:</span>
                                            <span className='font-medium text-gray-900'>{formatCurrency(earning.amount)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className='text-gray-500 text-sm'>-</div>
                                )}
                                <div className='mt-3 flex justify-between border-gray-300 border-t pt-2 font-semibold text-gray-900'>
                                    <span>Gross Pay:</span>
                                    <span>{formatCurrency(salarySlipData.grossPay)}</span>
                                </div>
                            </div>
                        </div>
                        {/* Deductions */}
                        <div>
                            <h3 className='mb-3 border-gray-300 border-b pb-2 font-semibold text-gray-900'>Deductions</h3>
                            <div className='space-y-2'>
                                {salarySlipData.deductions && salarySlipData.deductions.length > 0 ? (
                                    salarySlipData.deductions.map((deduction, index) => (
                                        <div key={index} className='flex justify-between text-sm'>
                                            <span className='text-gray-700'>{deduction.name}:</span>
                                            <span className='font-medium text-gray-900'>{formatCurrency(deduction.amount)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className='text-gray-500 text-sm'>-</div>
                                )}
                                <div className='mt-3 flex justify-between border-gray-300 border-t pt-2 font-semibold text-gray-900'>
                                    <span>Total Deduction:</span>
                                    <span>{formatCurrency(salarySlipData.totalDeduction)}</span>
                                </div>
                                <div className='mt-2 flex justify-between border-gray-400 border-t-2 pt-2 font-bold text-green-600'>
                                    <span>Net Payable:</span>
                                    <span>{formatCurrency(salarySlipData.netPayable)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Amount in Words */}
                    {salarySlipData.amountInWords && (
                        <div className='mb-6 text-center'>
                            <p className='text-gray-700 text-sm italic'>({salarySlipData.amountInWords})</p>
                        </div>
                    )}
                    {/* Disclaimer */}
                    <div className='mb-6 text-center'>
                        <p className='text-gray-500 text-xs'>*This is a Computer generated payslip, does not require any signature.</p>
                    </div>
                    {/* Leave Details */}
                    {showLeaveDetails && (
                        <div className='mb-6'>
                            <h3 className='mb-3 border-gray-300 border-b pb-2 font-semibold text-gray-900'>Leave Details</h3>
                            <div className='overflow-x-auto'>
                                <table className='w-full border-collapse border border-gray-300 text-sm'>
                                    <thead>
                                        <tr className='bg-gray-100'>
                                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold'>Serial No.</th>
                                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold'>Leave Name</th>
                                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold'>Total Leaves</th>
                                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold'>Availed Leaves</th>
                                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold'>Balance Leaves</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salarySlipData.leaveDetails && salarySlipData.leaveDetails.length > 0 ? (
                                            salarySlipData.leaveDetails.map((leave, index) => (
                                                <tr key={index}>
                                                    <td className='border border-gray-300 px-2 py-2 text-center'>{leave.serialNo}</td>
                                                    <td className='border border-gray-300 px-2 py-2 text-center'>
                                                        {leave.leaveName || '-'}
                                                    </td>
                                                    <td className='border border-gray-300 px-2 py-2 text-center'>
                                                        {leave.totalLeaves || 0}
                                                    </td>
                                                    <td className='border border-gray-300 px-2 py-2 text-center'>
                                                        {leave.availedLeaves || 0}
                                                    </td>
                                                    <td className='border border-gray-300 px-2 py-2 text-center'>
                                                        {leave.balanceLeaves || 0}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className='border border-gray-300 px-2 py-2 text-center text-gray-500'>
                                                    -
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                // Empty state - show template structure even without data
                <>
                    <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                        {/* Left Column */}
                        <div className='space-y-3 text-sm'>
                            <div>
                                <span className='font-medium text-gray-700'>Name:</span>
                                <span className='ml-2 text-gray-900'>-</span>
                            </div>
                            <div>
                                <span className='font-medium text-gray-700'>Designation:</span>
                                <span className='ml-2 text-gray-900'>-</span>
                            </div>
                            {showBankDetails && (
                                <>
                                    <div>
                                        <span className='font-medium text-gray-700'>Pay Level:</span>
                                        <span className='ml-2 text-gray-900'>-</span>
                                    </div>
                                    <div>
                                        <span className='font-medium text-gray-700'>Bank Name:</span>
                                        <span className='ml-2 text-gray-900'>-</span>
                                    </div>
                                    <div>
                                        <span className='font-medium text-gray-700'>Bank Acc No:</span>
                                        <span className='ml-2 text-gray-900'>-</span>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* Right Column */}
                        <div className='space-y-3 text-sm'>
                            <div>
                                <span className='font-medium text-gray-700'>PF No:</span>
                                <span className='ml-2 text-gray-900'>-</span>
                            </div>
                            <div>
                                <span className='font-medium text-gray-700'>ESI No:</span>
                                <span className='ml-2 text-gray-900'>-</span>
                            </div>
                            {showLopDays && (
                                <div>
                                    <span className='font-medium text-gray-700'>LOP Days:</span>
                                    <span className='ml-2 text-gray-900'>-</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Financial Details Table - Empty */}
                    <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                        {/* Pay and Allowance */}
                        <div>
                            <h3 className='mb-3 border-gray-300 border-b pb-2 font-semibold text-gray-900'>Pay and Allowance</h3>
                            <div className='space-y-2 text-gray-500 text-sm'>-</div>
                            <div className='mt-3 flex justify-between border-gray-300 border-t pt-2 font-semibold text-gray-900'>
                                <span>Gross Pay:</span>
                                <span>0.00</span>
                            </div>
                        </div>
                        {/* Deductions */}
                        <div>
                            <h3 className='mb-3 border-gray-300 border-b pb-2 font-semibold text-gray-900'>Deductions</h3>
                            <div className='space-y-2 text-gray-500 text-sm'>-</div>
                            <div className='mt-3 flex justify-between border-gray-300 border-t pt-2 font-semibold text-gray-900'>
                                <span>Total Deduction:</span>
                                <span>0.00</span>
                            </div>
                            <div className='mt-2 flex justify-between border-gray-400 border-t-2 pt-2 font-bold text-green-600'>
                                <span>Net Payable:</span>
                                <span>0.00</span>
                            </div>
                        </div>
                    </div>
                    {/* Leave Details - Empty */}
                    {showLeaveDetails && (
                        <div className='mb-6'>
                            <h3 className='mb-3 border-gray-300 border-b pb-2 font-semibold text-gray-900'>Leave Details</h3>
                            <div className='overflow-x-auto'>
                                <table className='w-full border-collapse border border-gray-300 text-sm'>
                                    <thead>
                                        <tr className='bg-gray-100'>
                                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold'>Serial No.</th>
                                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold'>Leave Name</th>
                                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold'>Total Leaves</th>
                                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold'>Availed Leaves</th>
                                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold'>Balance Leaves</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan={5} className='border border-gray-300 px-2 py-2 text-center text-gray-500'>
                                                -
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
            {/* Action Buttons */}
            {showActions && (
                <div className='flex flex-wrap justify-end gap-3 border-gray-300 border-t pt-4 print:hidden'>
                    <Button variant='outline' onClick={onCancel} prefix={<X className='size-4' />}>
                        CANCEL
                    </Button>

                    <Button variant='outline' onClick={onPrint} prefix={<Printer className='size-4' />}>
                        PRINT
                    </Button>
                </div>
            )}
        </div>
    );
}

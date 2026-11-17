'use client';

import { Button } from '@/components/ui/button';
import { Printer, X } from 'lucide-react';

interface Contribution {
    month: string;
    amount: number;
    epf: number;
    epfDifference: number;
    pensionContribution: number;
    total: number;
    refund: number;
    periodFrom: string;
    periodTo: string;
    remarks: string;
}

interface PfForm3AProps {
    contributions?: Contribution[];
    accountNo?: string;
    employeeName?: string;
    fatherName?: string;
    establishmentName?: string;
    establishmentAddress?: string;
    contributionRate?: number;
    vpfContribution?: number;
    year?: string;
    onCancel?: () => void;
    onPrint?: () => void;
    isLoading?: boolean;
}

// Default sample data (remove when using real data)
const defaultContributions: Contribution[] = [
    {
        month: 'April - 2025',
        amount: 0,
        epf: 0,
        epfDifference: 0,
        pensionContribution: 0,
        total: 0,
        refund: 0,
        periodFrom: '',
        periodTo: '',
        remarks: ''
    },
    {
        month: 'May - 2025',
        amount: 0,
        epf: 0,
        epfDifference: 0,
        pensionContribution: 0,
        total: 0,
        refund: 0,
        periodFrom: '',
        periodTo: '',
        remarks: ''
    },
    {
        month: 'June - 2025',
        amount: 0,
        epf: 0,
        epfDifference: 0,
        pensionContribution: 0,
        total: 0,
        refund: 0,
        periodFrom: '',
        periodTo: '',
        remarks: ''
    },
    {
        month: 'July - 2025',
        amount: 1379389,
        epf: 14974,
        epfDifference: 2578,
        pensionContribution: 22494,
        total: 4820,
        refund: 0,
        periodFrom: '',
        periodTo: '',
        remarks: ''
    },
    {
        month: 'August - 2025',
        amount: 0,
        epf: 0,
        epfDifference: 0,
        pensionContribution: 0,
        total: 0,
        refund: 0,
        periodFrom: '',
        periodTo: '',
        remarks: ''
    },
    {
        month: 'September - 2025',
        amount: 0,
        epf: 0,
        epfDifference: 0,
        pensionContribution: 0,
        total: 0,
        refund: 0,
        periodFrom: '',
        periodTo: '',
        remarks: ''
    },
    {
        month: 'October - 2025',
        amount: 77524261,
        epf: 0,
        epfDifference: 0,
        pensionContribution: 0,
        total: 0,
        refund: 0,
        periodFrom: '',
        periodTo: '',
        remarks: ''
    },
    {
        month: 'November - 2025',
        amount: 0,
        epf: 0,
        epfDifference: 0,
        pensionContribution: 0,
        total: 0,
        refund: 0,
        periodFrom: '',
        periodTo: '',
        remarks: ''
    },
    {
        month: 'December - 2025',
        amount: 159000,
        epf: 0,
        epfDifference: 64076,
        pensionContribution: 55922,
        total: 120000,
        refund: 0,
        periodFrom: '',
        periodTo: '',
        remarks: ''
    },
    {
        month: 'January - 2026',
        amount: 0,
        epf: 0,
        epfDifference: 0,
        pensionContribution: 0,
        total: 0,
        refund: 0,
        periodFrom: '',
        periodTo: '',
        remarks: ''
    },
    {
        month: 'February - 2026',
        amount: 0,
        epf: 0,
        epfDifference: 0,
        pensionContribution: 0,
        total: 0,
        refund: 0,
        periodFrom: '',
        periodTo: '',
        remarks: ''
    },
    {
        month: 'March - 2026',
        amount: 0,
        epf: 0,
        epfDifference: 0,
        pensionContribution: 0,
        total: 0,
        refund: 0,
        periodFrom: '',
        periodTo: '',
        remarks: ''
    }
];

export default function PfForm3A({
    contributions = defaultContributions,
    accountNo = 'WB/HOW/20401/11',
    employeeName = 'MR SUDIPTA RANJAN BHADURI',
    fatherName = '',
    establishmentName = 'VAPS SCHOOL',
    establishmentAddress = 'J, Church Road, West Bengal, India, Howrah - 711102',
    contributionRate = 15.0,
    vpfContribution = 0,
    year = '2025',
    onCancel = () => window.close(),
    onPrint = () => window.print(),
    isLoading = false
}: PfForm3AProps) {
    const totalAmount = contributions.reduce((sum, c) => sum + c.amount, 0);
    const totalEpf = contributions.reduce((sum, c) => sum + c.epf, 0);
    const totalEpfDifference = contributions.reduce((sum, c) => sum + c.epfDifference, 0);
    const totalPension = contributions.reduce((sum, c) => sum + c.pensionContribution, 0);
    const totalTotal = contributions.reduce((sum, c) => sum + c.total, 0);
    const totalRefund = contributions.reduce((sum, c) => sum + c.refund, 0);

    return (
        <>
            <div className='mx-auto w-full max-w-[1200px] bg-white p-6 print:bg-transparent print:p-0'>
                {/* Header */}

                <div className='space-y-1 text-center text-sm'>
                    <h3 className='font-bold text-gray-800'>Employees' Provident Fund Scheme, 1952</h3>
                    <p className='text-gray-700'>(Paragraph 35 & 42)</p>
                    <h3 className='font-bold text-gray-800'>Employees' Pension Scheme, 1995</h3>
                    <p className='text-gray-700'>(Paragraph 19)</p>
                </div>

                <div className='my-6 border-gray-900 border-t-2 border-b-2 py-1'>
                    <p className='text-center font-medium text-sm'>
                        Contribution card for currency period from <span className='font-bold'>1st April, {year}</span> to{' '}
                        <span className='font-bold'>31st March, {Number.parseInt(year) + 1}</span>
                    </p>
                </div>

                {/* Employee & Establishment Details */}
                <div className='mb-6 space-y-2 text-sm'>
                    <div className='flex gap-3'>
                        <span className='font-bold'>1. Account No.:</span> <span className='font-bold'>{accountNo}</span>
                    </div>
                    <div className='flex gap-3'>
                        <span className='font-bold'>2. Name / Surname:</span> <span className='font-bold uppercase'>{employeeName}</span>
                    </div>
                    <div className='flex gap-3'>
                        <span className='font-bold'>3. Father's/Husband's Name:</span>{' '}
                        <span className='font-bold'>{fatherName || '-'}</span>
                    </div>
                    <div className='flex gap-3'>
                        <span className='font-bold'>4. Name & Address of the Factory/Establishment:</span>{' '}
                        <span className='font-bold'>
                            {establishmentName}, {establishmentAddress}
                        </span>
                    </div>
                    <div className='flex gap-3'>
                        <span className='font-bold'>5. Statutory rate of contribution:</span>{' '}
                        <span className='font-bold'>{contributionRate}%</span>
                    </div>
                    <div className='flex gap-3'>
                        <span className='font-bold'>6. Voluntary higher rate of employee's contribution (if any):</span>{' '}
                        <span className='font-bold'>{vpfContribution}%</span>
                    </div>
                </div>

                {/* Contributions Table */}
                <div className='overflow-x-auto'>
                    <table className='w-full border-collapse border border-gray-400 text-xs'>
                        <thead>
                            <tr>
                                <th colSpan={9} className='border border-gray-400 px-2 py-2 align-middle'>
                                    CONTRIBUTIONS
                                </th>
                            </tr>
                        </thead>
                        <thead>
                            {/* Top Level - Main Groups */}
                            <tr className='bg-gray-100'>
                                <th rowSpan={3} className='border border-gray-400 px-2 py-2 align-middle'>
                                    Month
                                </th>

                                <th colSpan={2} className='border border-gray-400 px-2 py-2 text-center align-middle'>
                                    Employee's Share
                                </th>

                                <th colSpan={3} className='border border-gray-400 px-2 py-2 text-center align-middle'>
                                    Employer's Share
                                </th>

                                <th rowSpan={0} className='border border-gray-400 px-2 py-2 align-middle'>
                                    Refund of
                                    <br />
                                    Wages
                                </th>

                                <th colSpan={2} className='border border-gray-400 px-2 py-2 text-center align-middle'>
                                    Period of non contributing
                                </th>
                            </tr>

                            {/* Second Level */}
                            <tr className='bg-gray-100'>
                                <th rowSpan={2} className='border border-gray-400 px-2 py-2 align-middle'>
                                    Amount of Wages
                                </th>
                                <th rowSpan={2} className='border border-gray-400 px-2 py-2 align-middle'>
                                    EPF
                                </th>
                                <th rowSpan={2} className='border border-gray-400 px-2 py-2 align-middle'>
                                    EPF Difference B/W 12%
                                    <br />
                                    and 10% (if any)
                                </th>
                                <th rowSpan={2} className='border border-gray-400 px-2 py-2 align-middle'>
                                    Pension Fund (EPS)
                                    <br />
                                    Contribution 8-1/3%
                                </th>

                                {/* Employer's Share sub-columns */}
                                <th rowSpan={2} className='border border-gray-400 px-2 py-2 align-middle'>
                                    Total
                                </th>

                                {/* From / To under Period */}
                                <th className='border border-gray-400 px-2 py-1 align-middle'>From</th>
                                <th className='border border-gray-400 px-2 py-1 align-middle'>To</th>
                            </tr>

                            {/* Column Numbers 1 to 7 */}
                        </thead>
                        <thead>
                            <tr className='bg-gray-100 text-center'>
                                <th className='border border-gray-400 py-1'>1</th>
                                <th className='border border-gray-400 py-1'>2</th>
                                <th className='border border-gray-400 py-1'>3</th>
                                <th className='border border-gray-400 py-1'>4a</th>
                                <th className='border border-gray-400 py-1'>4b</th>
                                <th className='border border-gray-400 py-1'>4c</th>
                                <th className='border border-gray-400 py-1'>5</th>
                                <th className='border border-gray-400 py-1'>6a</th>
                                <th className='border border-gray-400 py-1'>6b</th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={11} className='border border-gray-400 py-10 text-center text-gray-500'>
                                        Loading Form 3A data...
                                    </td>
                                </tr>
                            ) : contributions.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className='border border-gray-400 py-10 text-center text-gray-500'>
                                        No contribution data available
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {contributions.map((c, i) => (
                                        <tr key={i} className='hover:bg-gray-50'>
                                            <td className='border border-gray-400 px-2 py-1 text-center font-medium'>{c.month}</td>
                                            <td className='border border-gray-400 px-2 py-1 text-right'>
                                                ₹{c.amount.toLocaleString('en-IN')}
                                            </td>
                                            <td className='border border-gray-400 px-2 py-1 text-right'>
                                                ₹{c.epf.toLocaleString('en-IN')}
                                            </td>
                                            <td className='border border-gray-400 px-2 py-1 text-right'>
                                                ₹{c.epfDifference.toLocaleString('en-IN')}
                                            </td>
                                            <td className='border border-gray-400 px-2 py-1 text-right'>
                                                ₹{c.pensionContribution.toLocaleString('en-IN')}
                                            </td>
                                            <td className='border border-gray-400 px-2 py-1 text-right font-medium'>
                                                ₹{c.total.toLocaleString('en-IN')}
                                            </td>
                                            <td className='border border-gray-400 px-2 py-1 text-right'>
                                                ₹{c.refund.toLocaleString('en-IN')}
                                            </td>
                                            <td className='border border-gray-400 px-2 py-1 text-center'>{c.periodFrom || '-'}</td>
                                        </tr>
                                    ))}

                                    {/* Total Row */}
                                    <tr className='bg-gray-50 font-bold text-sm'>
                                        <td className='border border-gray-400 px-2 py-2 text-center'>Total</td>
                                        <td className='border border-gray-400 px-2 py-2 text-right'>
                                            ₹{totalAmount.toLocaleString('en-IN')}
                                        </td>
                                        <td className='border border-gray-400 px-2 py-2 text-right'>₹{totalEpf.toLocaleString('en-IN')}</td>
                                        <td className='border border-gray-400 px-2 py-2 text-right'>
                                            ₹{totalEpfDifference.toLocaleString('en-IN')}
                                        </td>
                                        <td className='border border-gray-400 px-2 py-2 text-right'>
                                            ₹{totalPension.toLocaleString('en-IN')}
                                        </td>
                                        <td className='border border-gray-400 px-2 py-2 text-right'>
                                            ₹{totalTotal.toLocaleString('en-IN')}
                                        </td>
                                        <td className='border border-gray-400 px-2 py-2 text-right'>
                                            ₹{totalRefund.toLocaleString('en-IN')}
                                        </td>
                                        <td colSpan={4} className='border border-gray-400' />
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Certification Notes */}
                <div className='mt-8 space-y-4 text-xs'>
                    <div className='mt-12 text-sm'>
                        <p className='mb-2'>
                            Certified that the total difference between the total of the contribution shown under col.3 and (4) of the table
                            of reverse and that arrived at on the total wages shown in col.2 at the prescribed rate is solely due to the
                            rounding off contribution to the nearest rupee under the rules.
                        </p>
                        <p>
                            <span className='mb-2'>Date of Leaving Service:</span> 01-05-2025
                        </p>
                        <p>
                            <span className='mb-2'>Reason of Leaving Service:</span> 01-05-2025
                        </p>
                        <p className='mb-2'>
                            Certified that the total amount of contribution (both share) indicated in this card has already been remitted in
                            full in EPF A/c No. 1 and Pension Fund A/c No. 10.
                        </p>
                        <p className='mb-3'>
                            Certified that the difference between the total of the contribution shown under cols. 3, 4a and 4b of above
                            table and that arrived at on the total wages shown in col. 2 at the prescribed rate is solely due to rounding
                            off of contribution to the nearest rupee under the rules.
                        </p>
                    </div>

                    <div className='mt-10 flex justify-end'>
                        <div className='mt-3 flex gap-5 text-right'>
                            <p className='font-medium'>
                                <span className='mb-1 inline-block flex w-100 justify-between border-gray-600 border-b-2' />
                                Signature of the Employer or other authorised officer and stamp of the Factory/Establishment
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons - Hidden on Print */}
                <div className='flex justify-end gap-3 print:hidden'>
                    <Button variant='outline' onClick={onCancel}>
                        <X className='mr-2 h-4 w-4' />
                        CANCEL
                    </Button>
                    <Button variant='outline' onClick={onPrint}>
                        <Printer className='mr-2 h-4 w-4' />
                        PRINT
                    </Button>
                </div>
            </div>
        </>
    );
}

'use client';

import { Button } from '@/components/ui/button';
import { Printer, X } from 'lucide-react';

interface ContributionRecord {
    serialNo: number;
    accountNo: string;
    memberName: string;
    wagesDAFoodConcession: number;
    workerContribution: number;
    epfDiff: number;
    pensionFund8_33: number;
    refundAdvance: number;
    higherVoluntaryContribution: number;
    remarks: string;
}

interface PfForm6AProps {
    records: ContributionRecord[];
    establishmentName: string;
    establishmentAddress: string;
    establishmentCode: string;
    financialYear: string; // e.g., "2025-2026"
    periodFrom: string; // "01 April, 2025"
    periodTo: string; // "31 March, 2026"
    onCancel: () => void;
    onPrint: () => void;
    isLoading?: boolean;
}

export default function PfForm6A({
    records,
    establishmentName,
    establishmentAddress,
    establishmentCode,
    periodFrom,
    periodTo,
    onCancel,
    onPrint,
    isLoading = false
}: PfForm6AProps) {
    const totals = records.reduce(
        (acc, r) => ({
            wages: acc.wages + r.wagesDAFoodConcession,
            workerContrib: acc.workerContrib + r.workerContribution,
            epfDiff: acc.epfDiff + r.epfDiff,
            pensionFund: acc.pensionFund + r.pensionFund8_33,
            refund: acc.refund + r.refundAdvance,
            higherContrib: acc.higherContrib + r.higherVoluntaryContribution
        }),
        {
            wages: 0,
            workerContrib: 0,
            epfDiff: 0,
            pensionFund: 0,
            refund: 0,
            higherContrib: 0
        }
    );

    return (
        <div className='mx-auto max-w-7xl bg-white p-6 print:p-0 print:shadow-none'>
            {/* Header */}
            <div className='mb-6 border-gray-900 border-b-2 pb-4 text-center'>
                <h1 className='font-black text-2xl uppercase tracking-wider'>THE EMPLOYEES' PROVIDENT FUND SCHEME, 1952 (PARAGRAPH 43)</h1>
                <p className='mt-2 font-semibold text-lg'>AND</p>
                <h1 className='font-black text-2xl uppercase tracking-wider'>THE EMPLOYEE'S PENSION SCHEME, 1995 (PARAGRAPH 20 (4))</h1>

                <p className='mt-1 font-medium text-lg'>
                    ANNUAL STATEMENT OF CONTRIBUTION FOR THE CURRENCY PERIOD FROM <span className='font-bold'>{periodFrom}</span> TO{' '}
                    <span className='font-bold'>{periodTo}</span>
                </p>
            </div>

            {/* Establishment Details */}
            <div className='mb-6 grid grid-cols-2 gap-8 text-sm'>
                <div>
                    <div className='flex gap-3'>
                        <span className='font-bold'>Name of Establishment :</span>
                        <span className='font-extrabold'>{establishmentName}</span>
                    </div>
                    <div className='mt-2 flex gap-3'>
                        <span className='font-bold'>Address of the Factory/ Establishment :</span>
                        <span className='font-extrabold'>{establishmentAddress}</span>
                    </div>
                    <div className='mt-2 flex gap-3'>
                        <span className='font-bold'>Code No. of Factory/ Establishment :</span>
                        <span className='font-extrabold'>{establishmentCode || 'PF'}</span>
                    </div>
                </div>
                <div className='text-right'>
                    <div>
                        <span className='font-bold'>Stat. Rate of Contribution :</span>
                        <span className='ml-3 font-extrabold underline'>25.25</span>
                    </div>
                    <div className='mt-2'>
                        <span className='font-bold'>No. of member voluntarily Contribution at a higher rate :</span>
                        <span className='ml-3 font-extrabold'>_________</span>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <table className='w-full border-collapse border-2 border-black text-xs'>
                <thead>
                    <tr className='bg-gray-100'>
                        <th rowSpan={2} className='w-8 border border-black px-2 py-2'>
                            S. No
                        </th>
                        <th rowSpan={2} className='w-20 border border-black px-2 py-2'>
                            Account No.
                        </th>
                        <th rowSpan={2} className='w-44 border border-black px-4 py-2'>
                            Name of the Member
                            <br />
                            (in BLOCK letters)
                        </th>
                        <th rowSpan={2} className='w-32 border border-black px-4 py-2'>
                            Wages, returning allowance(if any) & DA
                            <br />
                            Including cash value of food concession paid during
                        </th>
                        <th rowSpan={2} className='w-32 border border-black px-4 py-2'>
                            Amount of Worker's Contributions deducted from the wages on 10%/12%(EPF)
                        </th>
                        <th rowSpan={2} className='w-28 border border-black px-4 py-2'>
                            EPF Diff.Between 10%,12% & 8.33%
                        </th>
                        <th rowSpan={2} className='w-28 border border-black px-4 py-2'>
                            8.33% Pension Fund 8(1/3)%
                        </th>
                        <th rowSpan={2} className='w-24 border border-black px-4 py-2'>
                            Refund of Advance
                        </th>
                        <th rowSpan={2} className='w-32 border border-black px-4 py-2'>
                            Rate of Higher Voluntary Contribution(if any)
                        </th>
                        <th rowSpan={2} className='w-24 border border-black px-4 py-2'>
                            Remarks
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={10} className='border border-black py-12 text-center text-gray-500'>
                                Loading Form 6A data...
                            </td>
                        </tr>
                    ) : records.length === 0 ? (
                        <tr>
                            <td colSpan={10} className='border border-black py-12 text-center text-gray-500'>
                                No contribution records found for this period.
                            </td>
                        </tr>
                    ) : (
                        <>
                            {records.map((r) => (
                                <tr key={r.serialNo}>
                                    <td className='border border-black py-1 text-center'>1</td>
                                    <td className='border border-black py-1 text-center font-mono'>2</td>
                                    <td className='border border-black px-2 py-1 uppercase'>3</td>
                                    <td className='border border-black px-2 py-1 text-right'>4</td>
                                    <td className='border border-black px-2 py-1 text-right'>5</td>
                                    <td className='border border-black px-2 py-1 text-right'>6</td>
                                    <td className='border border-black px-2 py-1 text-right'>7</td>
                                    <td className='border border-black px-2 py-1 text-right'>8</td>
                                    <td className='border border-black px-2 py-1 text-center'>9</td>
                                    <td className='border border-black px-2 py-1 text-center'>10</td>
                                </tr>
                            ))}
                            {/* Total Row */}
                            <tr className='bg-gray-100 font-bold'>
                                <td colSpan={3} className='border border-black py-2 text-center'>
                                    Total
                                </td>
                                <td className='border border-black px-3 text-right'>₹{totals.wages.toLocaleString('en-IN')}</td>
                                <td className='border border-black px-3 text-right'>₹{totals.workerContrib.toLocaleString('en-IN')}</td>
                                <td className='border border-black px-3 text-right'>₹{totals.epfDiff.toLocaleString('en-IN')}</td>
                                <td className='border border-black px-3 text-right'>₹{totals.pensionFund.toLocaleString('en-IN')}</td>
                                <td className='border border-black px-3 text-right' />

                                <td className='border border-black' />
                            </tr>
                        </>
                    )}
                </tbody>
            </table>

            {/* Certification */}
            <div className='mt-8 space-y-4 text-xs'>
                <p>
                    <strong>Reconciliation of Remittance</strong>
                </p>
                <ol className='list-inside list-decimal space-y-2'>
                    <li>
                        Certified that the difference between the figures of total contribution and Administration charges remitted during
                        the currency period and those shown under columns (5) to (7) above is shown due to the rounding of the amounts to
                        the nearest rupee under the rates.
                    </li>
                    <li>
                        Certified the the Form 3-A duly completed of all the members listed in this statement are enclosed except those
                        already sent during the course of currency period for the final settlement of the concerned members account vide
                        Remarks furnished against the names of respective members above.
                    </li>
                </ol>
            </div>

            {/* Signature */}
            <div className='mt-12 flex justify-end'>
                <div className='text-right'>
                    <div className='mb-2 h-16 w-64 border-black border-b-2' />
                    <p className='font-medium'>Signature of the employer with Official Seal</p>
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
    );
}

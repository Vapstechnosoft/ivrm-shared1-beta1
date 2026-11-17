'use client';

import { Button } from '@/components/ui/button';
import { Printer, X } from 'lucide-react';

interface Member {
    serialNo: number;
    accountNo: string;
    memberName: string;
    fatherOrHusbandName: string;
    dateOfLeaving: string;
    reasonForLeaving: string;
    remarks: string;
}

interface PfForm5ColumnsProps {
    membersLeavingService: Member[];
    establishmentName: string;
    establishmentCode: string;
    establishmentAddress: string;
    month: string;
    year: string;
    onCancel: () => void;
    onPrint: () => void;
    isLoading: boolean;
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

export default function PfForm5Columns({
    membersLeavingService,
    establishmentName,
    establishmentCode,
    establishmentAddress,
    month,
    year,
    onCancel,
    onPrint,
    isLoading
}: PfForm5ColumnsProps) {
    return (
        <div className='mx-auto w-full max-w-[1200px] bg-white p-6 print:p-4'>
            {/* Main Title */}
            <div className='mb-6 text-center'>
                <h1 className=' font-bold text-2xl text-gray-900 uppercase'>PF FORM 5</h1>
            </div>

            {/* Scheme Information */}
            <div className=' space-y-2 text-center text-sm'>
                <h3 className='font-semibold text-gray-800'>The Employees' Provident Fund Scheme, 1952</h3>
                <p className='text-gray-800'>Paragraph 36 (2) (a) and (b)</p>
                <h3 className='font-semibold text-gray-800'>Employees' Pension Scheme, 1995</h3>
                <p className='text-gray-800'>Paragraph 20 (4)</p>
            </div>

            {/* Return Title */}
            <div className='mb-6'>
                <div className='mt-4 mb-2 border-gray-900 border-t-2 border-b-2 ' />
                <p className='text-gray-800 text-sm'>
                    Return of Members Leaving Service during the month of{' '}
                    <span className='font-bold text-black'>
                        {month} - {year}
                    </span>
                </p>
            </div>

            {/* Establishment Details */}
            <div className='mb-6 space-y-3 text-sm'>
                <div>
                    <span className='font-bold text-gray-700'>Name of Establishment: </span>
                    <span className='font-extrabold text-gray-900'>{establishmentName || '-'}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='font-bold text-gray-700'>Code No. of Factory/ Establishment: </span>
                    <span className='font-extrabold text-gray-900'>{establishmentCode || 'PF'}</span>
                    <div className='h-6 w-32 border-gray-300 border-b-2 bg-white' />
                </div>
                <div>
                    <span className='font-bold text-gray-700'>Address of the Factory/ Establishment: </span>
                    <span className='font-extrabold text-gray-900'>{establishmentAddress || '-'}</span>
                </div>
            </div>

            {/* Members Leaving Service Table */}
            <div className='mb-6 overflow-x-auto'>
                <table className='w-full border-collapse border border-gray-300 text-xs'>
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>S. No</th>
                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>Account No.</th>
                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                Name of the Member (in BLOCK letters)
                            </th>
                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                Father's Name or Husband's Name in case of married women
                            </th>
                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                Date of Leaving Service
                            </th>
                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>
                                Reason for Leaving Service
                            </th>
                            <th className='border border-gray-300 px-2 py-2 text-center font-semibold text-gray-900'>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className='border border-gray-300 px-4 py-8 text-center text-gray-500'>
                                    Loading PF Form 10 data...
                                </td>
                            </tr>
                        ) : (
                            membersLeavingService.map((member, index) => (
                                <tr key={index}>
                                    <td className='border border-gray-300 px-2 py-2 text-center'>{member.serialNo}</td>
                                    <td className='border border-gray-300 px-2 py-2 text-center'>{member.accountNo || '-'}</td>
                                    <td className='border border-gray-300 px-2 py-2 text-left uppercase'>{member.memberName || '-'}</td>
                                    <td className='border border-gray-300 px-2 py-2 text-left'>{member.fatherOrHusbandName || '-'}</td>
                                    <td className='border border-gray-300 px-2 py-2 text-center'>
                                        {formatDate(member.dateOfLeaving) || '-'}
                                    </td>
                                    <td className='border border-gray-300 px-2 py-2 text-center'>{member.reasonForLeaving || '-'}</td>
                                    <td className='border border-gray-300 px-2 py-2 text-center'>{member.remarks || '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Instructions and Certifications Section */}
            <div className='mb-6 space-y-4 text-xs'>
                <div>
                    <span className='font-medium text-gray-700'>Date: </span>
                    <div className='mt-1 inline-block h-6 w-32 border border-gray-300 bg-white' />
                </div>

                <div className='space-y-3 text-justify text-gray-800 leading-relaxed'>
                    <p>
                        The reasons for leaving service may be stated as under: (i) Retiring, (ii) Leaving India, (iii) Retrenched, (iv)
                        Dismissed, (v) Discharged, (vi) Resigning, (vii) Taking up employment elsewhere, (viii) Dead.
                    </p>

                    <div className='space-y-2'>
                        <p>
                            (1) In case of deduction from the accounts of members dismissed for misconduct, the following certificate should
                            be filled in:
                        </p>
                        <div className='ml-4 space-y-1'>
                            <p>
                                Sr. No. <span className='font-semibold'>_________________________</span> Shri.{' '}
                                <span className='font-semibold'>_________________________</span> employer's contribution amounting to Rs.{' '}
                                <span className='font-semibold'>_________________________</span> has been forfeited in accordance with the
                                provisions of paragraph 72 of the Employees' Provident Fund Scheme, 1952. A copy of the order of dismissal
                                is enclosed.
                            </p>
                        </div>

                        <p>
                            (2) In case of discharge from service, the following certificate should be filled . Certified that the member
                            mentioned in
                        </p>
                        <div className='ml-4 space-y-1'>
                            <p>
                                Sr. No. <span className='font-semibold'>_________________________</span> Shri.{' '}
                                <span className='font-semibold'>_________________________</span> has been paid compensation amounting to Rs.{' '}
                                <span className='font-semibold'>_________________________</span> in accordance with the provisions of the
                                Industrial Disputes Act, 1947.
                            </p>
                        </div>
                    </div>

                    <p>
                        Certified that the difference between the total of the contribution shown under cols. 3, 4a and 4b of the above
                        table and that arrived at on the total wages shown in col. 2 at the prescribed rate is solely due to rounding off of
                        contribution to the nearest rupee under the rules.
                    </p>
                </div>

                {/* Signature Section */}
                <div className='mt-4 '>
                    <div className=' flex justify-end'>
                        <div className=' flex justify-end'>
                            <div className=' border-gray-300 border-b-2 bg-white' />
                        </div>
                        <p className='mt-16 mb-3 font-medium text-gray-700'>Signature of the employer with Official Seal</p>
                    </div>
                </div>

                {/* Note */}
                <div className='mt-4 rounded-md border border-gray-300 bg-gray-50 p-3'>
                    <p className='font-semibold text-gray-900'>Note:</p>
                    <p className='mt-1 text-gray-800'>
                        If the employee was a member of Employees' Provident Fund and Employees' Family Pension scheme before joining this
                        factory, details of membership should be given in the remarks column.
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
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

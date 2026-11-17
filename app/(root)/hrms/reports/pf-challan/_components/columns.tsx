'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useRef } from 'react';
// import { useReactToPrint } from 'react-to-print';

interface ChallanData {
    businessNo: string;
    month: string;
    year: string;
    vdrNo?: string;
    employeeShareAc1: number;
    employerShareAc1: number;
    totalAc1: number;
    ac2: number;
    ac10: number;
    ac21: number;
    ac22: number;
    establishmentName: string;
    establishmentAddress: string;
    pincode: string;
    modeOfPayment: 'Cheque' | 'Cash' | 'DD' | 'Transfer' | '';
    chequeNo?: string;
    chequeDate?: string;
    amountReceived?: number;
}

export default function EpfCombinedChallan({
    data,
    onClose
}: {
    data: ChallanData;
    onClose: () => void;
}) {
    const componentRef = useRef<HTMLDivElement>(null);

    // const handlePrint = useReactToPrint({
    //     contentRef: componentRef,
    //     documentTitle: `EPF_Challan_${data.month}_${data.year}`,
    //     pageStyle: `
    //   @page { size: A4; margin: 0.5cm; }
    //   @media print { body { -webkit-print-color-adjust: exact; } }
    // `
    // });

    const total = data.totalAc1 + data.ac2 + data.ac10 + data.ac21 + data.ac22;

    // Helper to render tick box
    const TickBox = ({ checked, label }: { checked: boolean; label: string }) => (
        <div className='flex items-center gap-3 font-medium'>
            <span className='inline-block h-5 w-5 border-2 border-black text-center text-lg leading-none'>{checked ? '✓' : ' '}</span>
            <span>{label}</span>
        </div>
    );

    const BoxField = ({
        value = '',
        length
    }: {
        value?: string;
        length: number;
    }) => {
        const chars = value.padEnd(length, ' ').split('');

        return (
            <div className='flex gap-1'>
                {chars.map((char, i) => (
                    <span key={i} className='flex h-6 w-6 items-center justify-center border border-black font-bold text-[11px]'>
                        {char !== ' ' ? char : ''}
                    </span>
                ))}
            </div>
        );
    };

    const monthNumber = new Date(`${data.month} 1, ${data.year}`).getMonth() + 1;
    const formattedMonth = String(monthNumber).padStart(2, '0');

    const DateBoxes = ({ value = '' }: { value?: string }) => {
        const clean = value.replaceAll('-', '');

        return (
            <div className='flex gap-4'>
                <BoxField value={clean.slice(6, 8)} length={2} />
                <BoxField value={clean.slice(4, 6)} length={2} />
                <BoxField value={clean.slice(0, 4)} length={4} />
            </div>
        );
    };

    return (
        <>
            <div ref={componentRef} className='mx-auto max-w-5xl bg-white p-8 font-sans text-xs leading-relaxed'>
                {/* Header */}
                <div className='mb-6 text-center'>
                    <h1 className='font-bold text-2xl uppercase'>Employee's Provident Fund Organisation</h1>
                    <p className='mt-1 font-medium text-sm'>(COMBINED CHALLAN FOR A/C NO. 1, 2, 10, 21 & 22)</p>
                </div>

                {/* Top Fields */}
                <div className='mb-5 flex justify-between text-xs'>
                    <div className='flex items-center'>
                        <span className='font-bold'>Business No:</span>
                        <BoxField value={data.businessNo} length={10} />
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='font-bold'>For the Month of:</span>
                        <BoxField value={formattedMonth} length={2} />
                        <BoxField value={data.year} length={4} />
                    </div>
                    <div>
                        <span className='font-bold'>VDR NO.:</span>
                        <span className='ml-4 inline-block w-40 border-black border-b-2' />
                    </div>
                </div>

                <div className='mb-4 text-center'>
                    <p className='font-bold'>(AMOUNT IN RS.)</p>
                </div>

                {/* Main Table */}
                <table className='mb-6 w-full border-black text-xs'>
                    <thead>
                        <tr className='bg-gray-200'>
                            <th rowSpan={2} className='border border-black px-2 py-1 text-center'>
                                SL.NO
                            </th>
                            <th rowSpan={2} className='border border-black px-2 py-1'>
                                Particulars
                            </th>
                            <th colSpan={3} className='border border-black px-2 py-1 text-center'>
                                A/C NO.1
                            </th>
                            <th rowSpan={2} className='border border-black px-2 py-1 text-center'>
                                A/C NO.2
                            </th>
                            <th rowSpan={2} className='border border-black px-2 py-1 text-center'>
                                A/C NO.10
                            </th>
                            <th rowSpan={2} className='border border-black px-2 py-1 text-center'>
                                A/C NO.21
                            </th>
                            <th rowSpan={2} className='border border-black px-2 py-1 text-center'>
                                A/C NO.22
                            </th>
                            <th rowSpan={2} className='border border-black px-2 py-1 text-center'>
                                Total
                            </th>
                        </tr>
                        <tr className='bg-gray-200'>
                            <th className='border border-black px-2 py-1 text-center'>Employees' Share</th>
                            <th className='border border-black px-2 py-1 text-center'>Employer's Share</th>
                            <th className='border border-black px-2 py-1 text-center'>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='border border-black px-2 py-1 text-center'>1</td>
                            <td className='border border-black px-2 py-1 pl-3'>Contribution, Administrative / Inspection Charges</td>
                            <td className='border border-black px-2 py-1 text-right'>{data.employeeShareAc1.toLocaleString('en-IN')}</td>
                            <td className='border border-black px-2 py-1 text-right'>{data.employerShareAc1.toLocaleString('en-IN')}</td>
                            <td className='border border-black px-2 py-1 text-right font-bold'>{data.totalAc1.toLocaleString('en-IN')}</td>
                            <td className='border border-black px-2 py-1 text-right'>{data.ac2.toFixed(2)}</td>
                            <td className='border border-black px-2 py-1 text-right'>{data.ac10.toFixed(2)}</td>
                            <td className='border border-black px-2 py-1 text-right'>{data.ac21.toFixed(2)}</td>
                            <td className='border border-black px-2 py-1 text-right'>{data.ac22.toFixed(2)}</td>
                            <td className='border border-black px-2 py-1 text-right font-bold'>{total.toLocaleString('en-IN')}</td>
                        </tr>
                        {['2(a)', '2(b)', '3'].map((sl, i) => (
                            <tr key={i}>
                                <td className='border border-black px-2 py-1 text-center'>{sl}</td>
                                <td className='border border-black px-2 py-1 pl-3'>
                                    {sl === '2(a)' && 'Interest Under Section 7Q'}
                                    {sl === '2(b)' && 'Damages Under Section 14B'}
                                    {sl === '3' && 'Miscellaneous payments'}
                                </td>
                                {Array(8)
                                    .fill(null)
                                    .map((_, j) => (
                                        <td key={j} className='border border-black px-2 py-1 text-right' />
                                    ))}
                            </tr>
                        ))}
                        <tr className='bg-gray-200 font-bold'>
                            <td colSpan={2} className='border border-black px-2 py-2 text-center'>
                                Total
                            </td>
                            <td className='border border-black px-2 py-1 text-right'>{data.employeeShareAc1.toLocaleString('en-IN')}</td>
                            <td className='border border-black px-2 py-1 text-right'>{data.employerShareAc1.toLocaleString('en-IN')}</td>
                            <td className='border border-black px-2 py-1 text-right'>{data.totalAc1.toLocaleString('en-IN')}</td>
                            <td className='border border-black px-2 py-1 text-right'>{data.ac2.toFixed(2)}</td>
                            <td className='border border-black px-2 py-1 text-right'>{data.ac10.toFixed(2)}</td>
                            <td className='border border-black px-2 py-1 text-right'>{data.ac21.toFixed(2)}</td>
                            <td className='border border-black px-2 py-1 text-right'>{data.ac22.toFixed(2)}</td>
                            <td className='border border-black px-2 py-1 text-right'>{total.toLocaleString('en-IN')}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Mode of Payment - With Proper Checkboxes */}
                {/* MODE OF PAYMENT SECTION */}
                <div className='mb-8 grid grid-cols-2 gap-10 text-xs'>
                    {/* LEFT COLUMN */}
                    <div>
                        <p className='mb-4 text-center font-bold'>MODE OF PAYMENT (TICK)</p>

                        <div className='mb-6 flex justify-between'>
                            <TickBox checked={data.modeOfPayment === 'Cheque'} label='Cheque' />
                            <TickBox checked={data.modeOfPayment === 'Cash'} label='Cash' />
                            <TickBox checked={data.modeOfPayment === 'DD'} label='DD' />
                            <TickBox checked={data.modeOfPayment === 'Transfer'} label='Transfer' />
                        </div>

                        <div className='space-y-5'>
                            <div className='flex'>
                                <span className='w-52 font-bold'>Name of the Establishment</span>
                                <span className='flex-1 border-black border-b'>{data.establishmentName}</span>
                            </div>

                            <div className='flex'>
                                <span className='w-52 font-bold'>Address</span>
                                <span className='flex-1 border-black border-b'>{data.establishmentAddress}</span>
                            </div>

                            <div className='flex items-center gap-3'>
                                <span className='font-bold'>Pincode</span>
                                <BoxField value={data.pincode} length={6} />
                            </div>

                            <div className='flex'>
                                <span className='w-52 font-bold'>Name of the Depositor</span>
                                <span className='flex-1 border-black border-b' />
                            </div>

                            <div className='flex'>
                                <span className='w-52 font-bold'>Signature of the Depositor</span>
                                <span className='flex-1 border-black border-b' />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className='space-y-5'>
                        <div className='flex items-center gap-3'>
                            <span className='w-52 font-bold'>Date of the Deposit</span>
                            <DateBoxes value={data.chequeDate} />
                        </div>

                        <div className='flex items-center gap-3'>
                            <span className='w-52 font-bold'>Cheque/DD No.</span>
                            <BoxField value={data.chequeNo} length={13} />
                        </div>

                        <div className='flex items-center gap-3'>
                            <span className='w-52 font-bold'>Cheque/DD Date</span>
                            <DateBoxes value={data.chequeDate} />
                        </div>

                        <div className='flex items-center gap-3'>
                            <span className='w-52 font-bold'>Amount Received (Rs.)</span>
                            <span className='h-6 w-80 border border-black px-2'>
                                {data.amountReceived ? data.amountReceived.toLocaleString('en-IN') : ''}
                            </span>
                        </div>

                        <div className='flex items-center gap-3'>
                            <span className='w-52 font-bold'>Deposit Bank Code :</span>
                            <span className='h-6 w-80 border border-black' />
                        </div>

                        <div className='flex'>
                            <span className='w-52 font-bold'>Deposit Branch Name :</span>
                            <span className='h-10 w-80 border border-black' />
                        </div>

                        <div className='flex'>
                            <span className='w-52 font-bold'>Bank Name (on which Cheque/DD drawn):</span>
                            <textarea className='h-14 w-80 resize-none border border-black' />
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className='mt-10 border-black border-t-2 pt-4 text-xs'>
                    <p className='font-bold text-sm'>INSTRUCTIONS TO THE EMPLOYER</p>
                    <ul className='mt-2 list-disc space-y-1 pl-6'>
                        <li>Use separate challan for each month.</li>
                        <li>Write legibly without any overwriting / correction / erasures.</li>
                        <li>Include Interest U/S 7Q for all belated remittances.</li>
                        <li>Pay the dues through local cheque only.</li>
                    </ul>
                </div>

                {/* Bank Section */}
                <div className='mt-10 border-2 border-black p-5 text-xs'>
                    <p className='mb-4 text-center font-bold'>(TO BE FILLED BY THE BANK)</p>
                    <div>
                        <p className='font-bold'>Challan Reference No.</p>
                        <BoxField length={12} />
                    </div>
                    <div className='grid grid-cols-3 gap-6'>
                        <div>
                            <p className='font-bold'>Date of Presentation</p>
                            <DateBoxes />
                        </div>
                        <div>
                            <p className='font-bold'>Date of Realisation</p>
                            <DateBoxes />
                        </div>
                        <div>
                            <p className='font-bold'>Date of Credit</p>
                            <DateBoxes />
                        </div>
                    </div>
                </div>
                <div className='mt-4 flex justify-end gap-3 print:hidden'>
                    <Button variant='outline' onClick={onClose}>
                        <X className='mr-2 h-4 w-4' />
                        CANCEL
                    </Button>
                    {/*<Button variant='outline' onClick={handlePrint}>
                        <Printer className='mr-2 h-4 w-4' />
                        PRINT
                    </Button>*/}
                </div>
            </div>
        </>
    );
}

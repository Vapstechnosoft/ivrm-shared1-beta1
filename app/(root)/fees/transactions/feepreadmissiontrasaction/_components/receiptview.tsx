'use client';

import { Button } from '@/components/ui/button';
import { getPrintdetails } from '@/server/fees/trasactions/feepreadmissiontrasaction';
import type { IFeePreAdmissionTransactionDetails } from '@/types/fees/transactions/transactions';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Portal from '../../feetransaction/_components/portal';

interface IInstituteDetails {
    institute_logo?: string;
}

interface ReceiptViewPageProps {
    rowData: IFeePreAdmissionTransactionDetails;
    onClose: () => void;
    asmayId?: number;
}

export default function ReceiptViewPage({ rowData, onClose, asmayId }: ReceiptViewPageProps) {
    const receiptRef = useRef<HTMLDivElement>(null);
    const [institute, setInstitute] = useState<IInstituteDetails>({});
    const [loading, setLoading] = useState(true);

    const receipt_no = rowData.receiptNo || 'N/A';
    const transaction_date = rowData.paidDate || '';
    const student_name = rowData.studentName || 'N/A';
    const reg_no = rowData.studentRegNo || 'N/A';
    const paid_amount = rowData.paidAmount || 0;
    const mode_of_payment = rowData.modeOfPayment || 'Cash';
    const bank_name = mode_of_payment === 'Cash' ? '' : (rowData as any).bankName || '';
    const cheque_no = mode_of_payment === 'Cash' ? '' : (rowData as any).chequeNo || '';
    const class_name = (rowData as any).className || 'XI';
    const academic_year = (rowData as any).academicYear || '2025-2026';
    const fee_head_name = (rowData as any).feeHead || 'Registration Fee';

    useEffect(() => {
        const fetchInstituteDetails = async () => {
            try {
                const preadmissionorprospectus = 'Preadmission';
                const rawResponse = await getPrintdetails(rowData.fyP_Id, Number(asmayId), preadmissionorprospectus, rowData.pasR_Id);
                const response = typeof rawResponse === 'string' ? JSON.parse(rawResponse) : rawResponse;
                const logoUrl = response?.data?.institute_logo || response?.institute_logo || '';
                setInstitute({
                    institute_logo: logoUrl ? `${logoUrl}?t=${Date.now()}` : ''
                });
            } catch (err) {
                console.error('Failed to load institute logo', err);
                setInstitute({ institute_logo: '' });
            } finally {
                setLoading(false);
            }
        };

        fetchInstituteDetails();
    }, []);

    const handlePrint = () => {
        if (!receiptRef.current) return;

        const printWindow = window.open('', '_blank', 'width=1200,height=900');

        if (printWindow) {
            // Get the full HTML including all Tailwind classes
            const content = receiptRef.current.outerHTML;

            // Include Tailwind CSS + your custom print styles
            printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Receipt - ${receipt_no}</title>

        <!-- Tailwind CSS CDN (includes all your classes) -->
        <script src="https://cdn.tailwindcss.com"></script>

        <style>
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
             th {
            color: #000 !important;
            font-weight: 700 !important;
          }
          body {
            font-family: system-ui, sans-serif;
            padding: 10px;
            background: white;
          }
          /* Force print layout same as screen */
          .grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
          @media print {
            body { padding: 0; margin: 0; }
            .print\\:hidden { display: none !important; }
            /* Ensure logo loads */
            img { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `);

            printWindow.document.close();
            printWindow.focus();

            // Wait for images (especially logo) to load before printing
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 800);
            };
        }
    };

    const convertNumberToWords = (num: number): string => {
        if (num === 0) return 'Zero';
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const convertLessThanThousand = (n: number): string => {
            if (n === 0) return '';
            if (n < 10) return ones[n];
            if (n < 20) return teens[n - 10];
            if (n < 100) return `${tens[Math.floor(n / 10)]}${n % 10 !== 0 ? ` ${ones[n % 10]}` : ''}`;
            return `${ones[Math.floor(n / 100)]} Hundred${n % 100 !== 0 ? ` ${convertLessThanThousand(n % 100)}` : ''}`;
        };

        if (num < 1000) return convertLessThanThousand(num);
        if (num < 100000)
            return `${convertLessThanThousand(Math.floor(num / 1000))} Thousand${num % 1000 !== 0 ? ` ${convertLessThanThousand(num % 1000)}` : ''}`;
        if (num < 10000000)
            return `${convertLessThanThousand(Math.floor(num / 100000))} Lakh${num % 100000 !== 0 ? ` ${convertNumberToWords(num % 100000)}` : ''}`;
        return `${convertLessThanThousand(Math.floor(num / 10000000))} Crore${num % 10000000 !== 0 ? ` ${convertNumberToWords(num % 10000000)}` : ''}`;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const feeAmount = paid_amount;
    const discountAmount = 0;
    const paidAmount = paid_amount;

    // Dynamic Logo Only Header (Used in Both Copies)
    const InstituteHeader = () => (
        <div className='mb-6 border-b-2 pb-4 text-center'>
            <div className='flex justify-center py-4'>
                {institute.institute_logo ? (
                    <Image src={institute.institute_logo} alt='Institute Logo' width={1000} height={90} className='logo' />
                ) : (
                    <div className='h-24 w-24 rounded-full border-4 border-gray-400 border-dashed bg-gray-200' />
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
                <div className='rounded-lg bg-white p-8'>Loading receipt...</div>
            </div>
        );
    }

    return (
        <Portal>
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
                <div className='relative max-h-[90vh] w-full max-w-6xl overflow-auto rounded-lg bg-white shadow-2xl'>
                    <div ref={receiptRef} className='p-8'>
                        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
                            {/* School Copy */}
                            <div className='border-2 border-gray-300 p-6'>
                                <div className='mb-4 text-right'>
                                    <span className='font-bold text-violet-700'>SCHOOL COPY</span>
                                </div>
                                <InstituteHeader />

                                <div className='mb-4 space-y-1 text-sm'>
                                    <div className='flex justify-between'>
                                        <span>
                                            <strong>Receipt No:</strong> {receipt_no}
                                        </span>
                                        <span>
                                            <strong>Date:</strong> {formatDate(transaction_date)}
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>
                                            <strong>Student Name:</strong> {student_name}
                                        </span>
                                        <span>
                                            <strong>Class:</strong> {class_name}
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>
                                            <strong>Academic Year:</strong> {academic_year}
                                        </span>
                                        <span>
                                            <strong>Reg No:</strong> {reg_no}
                                        </span>
                                    </div>
                                </div>

                                <table className='mb-4 w-full border-collapse text-sm'>
                                    <thead>
                                        <tr className='bg-violet-700 text-white'>
                                            <th className='border border-gray-400 p-2'>SL.NO</th>
                                            <th className='border border-gray-400 p-2'>Head Name</th>
                                            <th className='border border-gray-400 p-2'>Fee Amount</th>
                                            <th className='border border-gray-400 p-2'>Discount Amount</th>
                                            <th className='border border-gray-400 p-2'>Paid Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='border border-gray-400 p-2 text-center'>1</td>
                                            <td className='border border-gray-400 p-2'>{fee_head_name}</td>
                                            <td className='border border-gray-400 p-2 text-right'>{feeAmount}</td>
                                            <td className='border border-gray-400 p-2 text-right'>{discountAmount}</td>
                                            <td className='border border-gray-400 p-2 text-right'>{paidAmount}</td>
                                        </tr>
                                        <tr className='font-bold'>
                                            <td colSpan={2} className='border border-gray-400 p-2 text-right'>
                                                Total
                                            </td>
                                            <td className='border border-gray-400 p-2 text-right'>{feeAmount}</td>
                                            <td className='border border-gray-400 p-2 text-right'>{discountAmount}</td>
                                            <td className='border border-gray-400 p-2 text-right'>{paidAmount}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className='mb-4'>
                                    <h3 className='mb-2 font-bold'>Current Payment Detail</h3>
                                    <table className='w-full border-collapse text-sm'>
                                        <thead>
                                            <tr className='bg-violet-700 text-white'>
                                                <th className='border border-gray-400 p-2'>SL.NO</th>
                                                <th className='border border-gray-400 p-2'>Amount</th>
                                                <th className='border border-gray-400 p-2'>Bank</th>
                                                <th className='border border-gray-400 p-2'>DD.No</th>
                                                <th className='border border-gray-400 p-2'>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className='border border-gray-400 p-2 text-center'>1</td>
                                                <td className='border border-gray-400 p-2 text-right'>{paidAmount}</td>
                                                <td className='border border-gray-400 p-2'>{bank_name}</td>
                                                <td className='border border-gray-400 p-2'>{cheque_no}</td>
                                                <td className='border border-gray-400 p-2'>{formatDate(transaction_date)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className='mb-4 text-sm'>
                                    <strong>Amount Received (in Words):</strong> {convertNumberToWords(paidAmount)} Rupees Only/-
                                </div>

                                <div className='mb-4 text-xs'>
                                    <strong>Note:</strong> This receipt is valid subject to realisation of Cheque
                                </div>

                                <div className='mt-8 text-right'>
                                    <p className='font-bold'>AUTHORISED SIGNATORY</p>
                                </div>
                            </div>

                            {/* Parent Copy - Now Uses Dynamic Logo Only */}
                            <div className='border-2 border-gray-300 p-6'>
                                <div className='mb-4 text-right'>
                                    <span className='font-bold text-violet-700'>PARENT COPY</span>
                                </div>
                                <InstituteHeader />

                                <div className='mb-4 space-y-1 text-sm'>
                                    <div className='flex justify-between'>
                                        <span>
                                            <strong>Receipt No:</strong> {receipt_no}
                                        </span>
                                        <span>
                                            <strong>Date:</strong> {formatDate(transaction_date)}
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>
                                            <strong>Student Name:</strong> {student_name}
                                        </span>
                                        <span>
                                            <strong>Class:</strong> {class_name}
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>
                                            <strong>Academic Year:</strong> {academic_year}
                                        </span>
                                        <span>
                                            <strong>Reg No:</strong> {reg_no}
                                        </span>
                                    </div>
                                </div>

                                <table className='mb-4 w-full border-collapse text-sm'>
                                    <thead>
                                        <tr className='bg-violet-700 text-white'>
                                            <th className='border border-gray-400 p-2'>SL.NO</th>
                                            <th className='border border-gray-400 p-2'>Head Name</th>
                                            <th className='border border-gray-400 p-2'>Fee Amount</th>
                                            <th className='border border-gray-400 p-2'>Discount Amount</th>
                                            <th className='border border-gray-400 p-2'>Paid Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='border border-gray-400 p-2 text-center'>1</td>
                                            <td className='border border-gray-400 p-2'>{fee_head_name}</td>
                                            <td className='border border-gray-400 p-2 text-right'>{feeAmount}</td>
                                            <td className='border border-gray-400 p-2 text-right'>{discountAmount}</td>
                                            <td className='border border-gray-400 p-2 text-right'>{paidAmount}</td>
                                        </tr>
                                        <tr className='font-bold'>
                                            <td colSpan={2} className='border border-gray-400 p-2 text-right'>
                                                Total
                                            </td>
                                            <td className='border border-gray-400 p-2 text-right'>{feeAmount}</td>
                                            <td className='border border-gray-400 p-2 text-right'>{discountAmount}</td>
                                            <td className='border border-gray-400 p-2 text-right'>{paidAmount}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className='mb-4'>
                                    <h3 className='mb-2 font-bold'>Current Payment Detail</h3>
                                    <table className='w-full border-collapse text-sm'>
                                        <thead>
                                            <tr className='bg-violet-700 text-white'>
                                                <th className='border border-gray-400 p-2'>SL.NO</th>
                                                <th className='border border-gray-400 p-2'>Amount</th>
                                                <th className='border border-gray-400 p-2'>Bank</th>
                                                <th className='border border-gray-400 p-2'>DD.No</th>
                                                <th className='border border-gray-400 p-2'>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className='border border-gray-400 p-2 text-center'>1</td>
                                                <td className='border border-gray-400 p-2 text-right'>{paidAmount}</td>
                                                <td className='border border-gray-400 p-2'>{bank_name}</td>
                                                <td className='border border-gray-400 p-2'>{cheque_no}</td>
                                                <td className='border border-gray-400 p-2'>{formatDate(transaction_date)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className='mb-4 text-sm'>
                                    <strong>Amount Received (in Words):</strong> {convertNumberToWords(paidAmount)} Rupees Only/-
                                </div>

                                <div className='mb-4 text-xs'>
                                    <strong>Note:</strong> This receipt is valid subject to realisation of Cheque
                                </div>

                                <div className='mt-8 text-right'>
                                    <p className='font-bold'>AUTHORISED SIGNATORY</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='sticky bottom-0 z-10 flex justify-end gap-2 border-t bg-white p-4 print:hidden'>
                        <Button onClick={handlePrint} variant='default'>
                            Print
                        </Button>
                        <Button onClick={onClose} variant='outline'>
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </Portal>
    );
}

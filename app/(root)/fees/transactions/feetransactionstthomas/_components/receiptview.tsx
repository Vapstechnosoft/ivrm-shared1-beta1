'use client';

import { Button } from '@/components/ui/button';
import { getStudentPrintDetails } from '@/server/fees/trasactions/fee_student_transaction';
import { getPrintdetails } from '@/server/fees/trasactions/feepreadmissiontrasaction';
import type { CurrentPaymentDetails, Ifeetransaction, StudentPrintDetails } from '@/types/fees/transactions/transactions';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Portal from './portal';

interface IInstituteDetails {
    institute_logo?: string;
}

interface ReceiptViewPageProps {
    rowData: Ifeetransaction;
    onClose: () => void;
    asmayId: number;
    asmayYear: string;
}

export default function ReceiptViewPageStThomas({ rowData, onClose, asmayId, asmayYear }: ReceiptViewPageProps) {
    const receiptRef = useRef<HTMLDivElement>(null);
    const [institute, setInstitute] = useState<IInstituteDetails>({});
    const [loading, setLoading] = useState(true);
    const [studentDetails, setStudentDetails] = useState<StudentPrintDetails[]>([]);
    const [currentPaymentDetails, setCurrentPaymentDetails] = useState<CurrentPaymentDetails[]>([]);

    useEffect(() => {
        const fetchStudentPrintDetails = async () => {
            try {
                const response = await getStudentPrintDetails({
                    amst_Id: rowData.amst_Id,
                    fyP_Id: rowData.fyP_Id,
                    asmaY_Id: asmayId,
                    minstall: '0'
                });
                const studentDetails = JSON.parse(JSON.stringify((response as any)?.printtermDTOs?.fee_termwise_fee_receipt_details || []));
                const currentPaymentDetails = JSON.parse(JSON.stringify((response as any)?.printtermDTOs?.currpaymentdetails || []));
                // console.log("currentPaymentDetails",currentPaymentDetails)
                setStudentDetails(studentDetails);
                setCurrentPaymentDetails(currentPaymentDetails);
            } catch (err) {
                console.error('Failed to load institute logo', err);
            } finally {
                setLoading(false);
            }
        };
        const fetchInstituteDetails = async () => {
            try {
                const preadmissionorprospectus = 'Preadmission';
                const res = await getPrintdetails(rowData.fyP_Id, asmayId, preadmissionorprospectus, 0);
                const response = typeof res === 'string' ? JSON.parse(res) : res;
                const logoUrl = response?.data?.institute_logo || response?.institute_logo || '';
                setInstitute({
                    institute_logo: logoUrl ? `${logoUrl}?t=${Date.now()}` : ''
                });
            } catch (err) {
                console.error('Failed to load institute logo', err);
                setInstitute({ institute_logo: '' });
            } finally {
                // setLoading(false);
            }
        };

        fetchInstituteDetails();

        fetchStudentPrintDetails();
    }, [rowData]);

    const receipt_no = rowData.fyP_Receipt_No || 'N/A';
    const transaction_date = rowData.fyP_Date || '';
    const student_name =
        `${rowData?.amsT_FirstName || ''} ${rowData?.amsT_MiddleName || ''} ${rowData?.amsT_LastName || ''}`.trim() || 'N/A';
    const reg_no = rowData.amsT_AdmNo || 'N/A';
    // const mode_of_payment = currentPaymentDetails[0]?.ivrmmoD_Flag;
    // const bank_name = currentPaymentDetails[0]?.fyP_Bank_Name;
    // const cheque_no = currentPaymentDetails[0]?.fyP_DD_Cheque_No;
    const class_name = rowData.classname;
    const academic_year = asmayYear || '';
    // const last = studentDetails[studentDetails.length - 1];
    // const fee_head_name = last?.fmh_feename;
    // const feeAmount = last?.feeAmount;
    // const discountAmount = last?.concession_amount;
    // const paidAmount = last?.paid_amount;
    const currentPaidAmount = currentPaymentDetails.reduce((sum, p) => {
        return sum + p.fyppM_TotalPaidAmount;
    }, 0);

    const handlePrint = () => {
        if (!receiptRef.current) return;
        const printWindow = window.open('', '_blank', 'width=1200,height=900');
        if (printWindow) {
            const content = receiptRef.current.outerHTML;
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
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 800);
            };
        }
    };

    const convertNumberToWords = (num: number | undefined | null): string => {
        if (num === undefined || num === null || Number.isNaN(num)) {
            return 'Zero';
        }
        const numberValue = typeof num === 'string' ? Number.parseFloat(num) : num;
        if (Number.isNaN(numberValue)) {
            return 'Zero';
        }
        if (numberValue === 0) return 'Zero';
        if (numberValue < 0) {
            return `Negative ${convertNumberToWords(Math.abs(numberValue))}`;
        }

        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const convertLessThanThousand = (n: number): string => {
            if (n === 0) return '';
            let result = '';
            let temp = n;
            if (temp >= 100) {
                const hundreds = Math.floor(temp / 100);
                result += `${ones[hundreds]} Hundred`;
                temp %= 100;
                if (temp > 0) result += ' ';
            }

            if (temp >= 20) {
                const tenDigit = Math.floor(temp / 10);
                result += tens[tenDigit];
                temp %= 10;
                if (temp > 0) result += ` ${ones[temp]}`;
            } else if (temp >= 10) {
                result += teens[temp - 10];
            } else if (temp > 0) {
                result += ones[temp];
            }
            return result;
        };

        const convertLessThanLakh = (n: number): string => {
            if (n < 1000) {
                return convertLessThanThousand(n);
            }
            const thousands = Math.floor(n / 1000);
            const remainder = n % 1000;

            const thousandPart = `${convertLessThanThousand(thousands)} Thousand`;
            if (remainder === 0) return thousandPart;
            return `${thousandPart} ${convertLessThanThousand(remainder)}`;
        };

        if (numberValue < 100000) {
            return convertLessThanLakh(numberValue);
        }
        if (numberValue < 10000000) {
            const lakhs = Math.floor(numberValue / 100000);
            const remainder = numberValue % 100000;
            const lakhPart = `${convertLessThanThousand(lakhs)} Lakh`;
            if (remainder === 0) return lakhPart;
            return `${lakhPart} ${convertLessThanLakh(remainder)}`;
        }
        const crores = Math.floor(numberValue / 10000000);
        const remainder = numberValue % 10000000;

        let crorePart = '';
        if (crores < 1000) {
            crorePart = `${convertLessThanThousand(crores)} Crore`;
        } else if (crores < 100000) {
            crorePart = `${convertLessThanLakh(crores)} Crore`;
        } else if (crores < 10000000) {
            const croreLakhs = Math.floor(crores / 100000);
            const croreRemainder = crores % 100000;
            crorePart = `${convertLessThanThousand(croreLakhs)} Lakh`;
            if (croreRemainder > 0) {
                crorePart += ` ${convertLessThanLakh(croreRemainder)}`;
            }
            crorePart += ' Crore';
        } else {
            return numberValue.toLocaleString('en-IN');
        }
        if (remainder === 0) return crorePart;

        let remainderPart = '';
        if (remainder < 100000) {
            remainderPart = convertLessThanLakh(remainder);
        } else if (remainder < 10000000) {
            const remLakhs = Math.floor(remainder / 100000);
            const remRemainder = remainder % 100000;
            remainderPart = `${convertLessThanThousand(remLakhs)} Lakh`;
            if (remRemainder > 0) {
                remainderPart += ` ${convertLessThanLakh(remRemainder)}`;
            }
        } else {
            remainderPart = remainder.toLocaleString('en-IN');
        }

        return `${crorePart} ${remainderPart}`.trim();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

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
            <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4'>
                <div className='relative max-h-[90vh] w-full max-w-6xl overflow-auto rounded-lg bg-white shadow-2xl'>
                    <div ref={receiptRef} className='p-8'>
                        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
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
                                        {studentDetails.map((detail, index) => (
                                            <tr key={index}>
                                                <td className='border border-gray-400 p-2 text-center'>{index + 1}</td>
                                                <td className='border border-gray-400 p-2'>{detail.fmh_feename}</td>
                                                <td className='border border-gray-400 p-2 text-right'>{detail.feeAmount ?? 0}</td>
                                                <td className='border border-gray-400 p-2 text-right'>{detail.concession_amount ?? 0}</td>
                                                <td className='border border-gray-400 p-2 text-right'>{detail.paid_amount ?? 0}</td>
                                            </tr>
                                        ))}
                                        {studentDetails.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className='border border-gray-400 p-4 text-center'>
                                                    No data available
                                                </td>
                                            </tr>
                                        )}
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
                                        {currentPaymentDetails.map((p, index) => (
                                            <tbody key={index + 1}>
                                                <tr>
                                                    <td className='border border-gray-400 p-2 text-center'>{index + 1}</td>
                                                    <td className='border border-gray-400 p-2 text-right'>{p.fyppM_TotalPaidAmount}</td>
                                                    <td className='border border-gray-400 p-2'>{p.fyppM_BankName}</td>
                                                    <td className='border border-gray-400 p-2'>{p.fyppM_DDChequeNo}</td>
                                                    <td className='border border-gray-400 p-2'>{formatDate(p.fyppM_DDChequeDate)}</td>
                                                </tr>
                                            </tbody>
                                        ))}
                                    </table>
                                </div>

                                <div className='mb-4 text-sm'>
                                    <strong>Amount Received (in Words):</strong> {convertNumberToWords(currentPaidAmount)} Rupees Only/-
                                </div>

                                <div className='mb-4 text-xs'>
                                    <strong>Note:</strong> This receipt is valid subject to realisation of Cheque
                                </div>

                                <div className='mt-8 text-right'>
                                    <p className='font-bold'>AUTHORISED SIGNATORY</p>
                                </div>
                            </div>

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
                                        {studentDetails.map((detail, index) => (
                                            <tr key={index}>
                                                <td className='border border-gray-400 p-2 text-center'>{index + 1}</td>
                                                <td className='border border-gray-400 p-2'>{detail.fmh_feename}</td>
                                                <td className='border border-gray-400 p-2 text-right'>{detail.feeAmount ?? 0}</td>
                                                <td className='border border-gray-400 p-2 text-right'>{detail.concession_amount ?? 0}</td>
                                                <td className='border border-gray-400 p-2 text-right'>{detail.paid_amount ?? 0}</td>
                                            </tr>
                                        ))}
                                        {studentDetails.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className='border border-gray-400 p-4 text-center'>
                                                    No data available
                                                </td>
                                            </tr>
                                        )}
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
                                        {currentPaymentDetails.map((p, index) => (
                                            <tbody key={index + 1}>
                                                <tr>
                                                    <td className='border border-gray-400 p-2 text-center'>{index + 1}</td>
                                                    <td className='border border-gray-400 p-2 text-right'>{p.fyppM_TotalPaidAmount}</td>
                                                    <td className='border border-gray-400 p-2'>{p.fyppM_BankName}</td>
                                                    <td className='border border-gray-400 p-2'>{p.fyppM_DDChequeNo}</td>
                                                    <td className='border border-gray-400 p-2'>{formatDate(p.fyppM_DDChequeDate)}</td>
                                                </tr>
                                            </tbody>
                                        ))}
                                    </table>
                                </div>

                                <div className='mb-4 text-sm'>
                                    <strong>Amount Received (in Words):</strong> {convertNumberToWords(currentPaidAmount)} Rupees Only/-
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

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
//import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
//import { useReactToPrint } from 'react-to-print';
import { getReceiptDetails, getReceipts } from '../actions';
import type { AcademicYear, FeeReceipt, ReceiptDetailsResponse } from '../types';

interface PortalFeeReceiptClientProps {
    initialYears: AcademicYear[];
}

export default function PortalFeeReceiptClient({ initialYears }: PortalFeeReceiptClientProps) {
    const [years] = useState<AcademicYear[]>(initialYears);
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [receipts, setReceipts] = useState<FeeReceipt[]>([]);
    const [selectedReceipt, setSelectedReceipt] = useState<string>('');
    const [receiptData, setReceiptData] = useState<ReceiptDetailsResponse | null>(null);
    const componentRef = useRef<HTMLDivElement>(null);

    const handleYearChange = async (yearId: string) => {
        setSelectedYear(yearId);
        setReceipts([]);
        setSelectedReceipt('');
        setReceiptData(null);
        if (yearId) {
            const response = await getReceipts(Number(yearId));
            if (response?.recnolist) {
                setReceipts(response.recnolist);
            }
        }
    };

    const handleReceiptChange = async (receiptId: string) => {
        setSelectedReceipt(receiptId);
        setReceiptData(null);
        // Automatically fetch details when receipt is selected, mimicking 'onreceiptchange'
        if (receiptId && selectedYear) {
            const data = {
                configset: '0', // Defaulting based on assumed config
                FYP_Id: Number(receiptId),
                minstall: '0', // Defaulting
                ASMAY_ID: Number(selectedYear)
            };
            const response = await getReceiptDetails(data);
            if (response) {
                setReceiptData(response);
            }
        }
    };

    // const handlePrint = useReactToPrint({
    //     contentRef: componentRef,
    //     documentTitle: 'Fee Receipt'
    // });

    // const handleDownload = () => {
    //     if (componentRef.current) {
    //         html2canvas(componentRef.current).then((canvas) => {
    //             const imgData = canvas.toDataURL('image/png');
    //             const pdf = new jsPDF('p', 'mm', 'a4');
    //             const pdfWidth = pdf.internal.pageSize.getWidth();
    //             const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    //             pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    //             pdf.save('FeeReceipt.pdf');
    //         });
    //     }
    // };

    const handleClear = () => {
        setSelectedYear('');
        setReceipts([]);
        setSelectedReceipt('');
        setReceiptData(null);
    };

    // Helper to format currency or numbers
    const _formatCurrency = (amount: number) => {
        return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    };

    // Number to words converter (simplified for this example, or use a library)
    // You can copy the 'amountinwords' function from the legacy code if strict parity is needed.
    const amountInWords = (num: number): string => {
        const words: string[] = [];
        words[0] = '';
        words[1] = 'One';
        words[2] = 'Two';
        words[3] = 'Three';
        words[4] = 'Four';
        words[5] = 'Five';
        words[6] = 'Six';
        words[7] = 'Seven';
        words[8] = 'Eight';
        words[9] = 'Nine';
        words[10] = 'Ten';
        words[11] = 'Eleven';
        words[12] = 'Twelve';
        words[13] = 'Thirteen';
        words[14] = 'Fourteen';
        words[15] = 'Fifteen';
        words[16] = 'Sixteen';
        words[17] = 'Seventeen';
        words[18] = 'Eighteen';
        words[19] = 'Nineteen';
        words[20] = 'Twenty';
        words[30] = 'Thirty';
        words[40] = 'Forty';
        words[50] = 'Fifty';
        words[60] = 'Sixty';
        words[70] = 'Seventy';
        words[80] = 'Eighty';
        words[90] = 'Ninety';

        const atotalcStr = num.toString();
        const atemp = atotalcStr.split(".");
        const number = atemp[0].split(",").join("");
        const n_length = number.length;
        let words_string = "";

        if (n_length <= 9) {
            const n_array: number[] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
            const received_n_array: string[] = [];
            for (let i = 0; i < n_length; i++) {
                received_n_array[i] = number.substr(i, 1);
            }
            for (let i = 9 - n_length, j = 0; i < 9; i++, j++) {
                n_array[i] = parseInt(received_n_array[j]);
            }
            for (let i = 0, j = 1; i < 9; i++, j++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    if (n_array[i] == 1) {
                        n_array[j] = 10 + n_array[j];
                        n_array[i] = 0;
                    }
                }
            }
            let value = 0;
            for (let i = 0; i < 9; i++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    value = n_array[i] * 10;
                } else {
                    value = n_array[i];
                }
                if (value != 0) {
                    words_string += words[value] + " ";
                }
                if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Crores ";
                }
                if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Lakhs ";
                }
                if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Thousand ";
                }
                if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                    words_string += "Hundred and ";
                } else if (i == 6 && value != 0) {
                    words_string += "Hundred ";
                }
            }
            words_string = words_string.split("  ").join(" ");
        }
        return words_string;
    };

    return (
        <div className='space-y-6 p-4'>
            <Card>
                <CardHeader className='bg-primary text-primary-foreground'>
                    <CardTitle>Student Fee Receipt</CardTitle>
                </CardHeader>
                <CardContent className='pt-6'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                        <div className='space-y-2'>
                            <div className='font-semibold text-sm'>
                                Academic Year <span className='text-red-500'>*</span>
                            </div>
                            <Select value={selectedYear} onValueChange={handleYearChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year.asmaY_Id} value={String(year.asmaY_Id)}>
                                            {year.asmaY_Year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2'>
                            <div className='font-semibold text-sm'>
                                Receipt No <span className='text-red-500'>*</span>
                            </div>
                            <Select value={selectedReceipt} onValueChange={handleReceiptChange} disabled={!selectedYear}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Receipt No.' />
                                </SelectTrigger>
                                <SelectContent>
                                    {receipts.map((rec) => (
                                        <SelectItem key={rec.fyP_Id} value={String(rec.fyP_Id)}>
                                            {rec.fyP_Receipt_No}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='flex items-end space-x-2'>
                            {/* <Button onClick={handlePrint} disabled={!receiptData}>
                                Print
                            </Button> */}
                            {/* <Button onClick={handleDownload} disabled={!receiptData}>
                                Download
                            </Button> */}
                            <Button variant='outline' onClick={handleClear}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {receiptData && (
                <div className='mx-auto max-w-4xl border bg-white p-8 shadow-lg' ref={componentRef}>
                    <div className='mb-6 text-center'>
                        {/* Replace with actual logo logic */}
                        {/* <img src={receiptData.imgname} alt="Logo" className="h-20 mx-auto" /> */}
                        <h2 className='mt-2 font-bold text-xl'>FEE RECEIPT</h2>
                        <hr className='my-2' />
                    </div>

                    <div className='mb-6 grid grid-cols-2 gap-x-8 gap-y-2 text-sm'>
                        <div className='grid grid-cols-3'>
                            <span className='font-semibold'>Receipt No</span>
                            <span className='col-span-2'>: {receiptData.fillstudentviewdetails[0]?.fyP_Receipt_No}</span>
                        </div>
                        <div className='grid grid-cols-3'>
                            <span className='font-semibold'>Date</span>
                            <span className='col-span-2'>: {receiptData.fillstudentviewdetails[0]?.fyP_Date}</span>
                        </div>
                        <div className='grid grid-cols-3'>
                            <span className='font-semibold'>Adm No</span>
                            <span className='col-span-2'>: {receiptData.fillstudentviewdetails[0]?.admno}</span>
                        </div>
                        <div className='grid grid-cols-3'>
                            <span className='font-semibold'>Aca Year</span>
                            <span className='col-span-2'>: {receiptData.year}</span>
                        </div>
                        <div className='grid grid-cols-3'>
                            <span className='font-semibold'>Name</span>
                            <span className='col-span-2'>: {receiptData.fillstudentviewdetails[0]?.amsT_FirstName}</span>
                        </div>
                        <div className='grid grid-cols-3'>
                            <span className='font-semibold'>Class</span>
                            <span className='col-span-2'>
                                : {receiptData.fillstudentviewdetails[0]?.classname} {receiptData.fillstudentviewdetails[0]?.sectionname}
                            </span>
                        </div>
                        <div className='grid grid-cols-3'>
                            <span className='font-semibold'>Father</span>
                            <span className='col-span-2'>: {receiptData.fillstudentviewdetails[0]?.fathername}</span>
                        </div>
                        <div className='grid grid-cols-3'>
                            <span className='font-semibold'>Type</span>
                            <span className='col-span-2'>: {receiptData.fillstudentviewdetails[0]?.fmcC_ConcessionName}</span>
                        </div>
                        <div className='grid grid-cols-3'>
                            <span className='font-semibold'>Mother</span>
                            <span className='col-span-2'>: {receiptData.fillstudentviewdetails[0]?.mothername}</span>
                        </div>
                        <div className='grid grid-cols-3'>
                            <span className='font-semibold'>Period</span>
                            <span className='col-span-2'>: {receiptData.duration}</span>
                        </div>
                    </div>

                    <table className='mb-6 w-full border-collapse border text-sm'>
                        <thead>
                            <tr className='bg-gray-100'>
                                <th className='border p-2'>SLNO</th>
                                <th className='border p-2'>Head Name</th>
                                <th className='border p-2 text-right'>Fee Amount</th>
                                <th className='border p-2 text-right'>Paid Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receiptData.filltotaldetails?.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td className='border p-2 text-center'>{index + 1}</td>
                                    <td className='border p-2'>{item.fmH_FeeName}</td>
                                    <td className='border p-2 text-right'>{item.totalcharges}</td>
                                    <td className='border p-2 text-right'>{item.ftP_Paid_Amt}</td>
                                </tr>
                            ))}
                            {/* Total Row */}
                            <tr className='font-bold'>
                                <td className='border p-2' />
                                <td className='border p-2'>Total</td>
                                <td className='border p-2 text-right'>
                                    {receiptData.filltotaldetails?.reduce((sum: number, item: any) => sum + item.totalcharges, 0)}
                                </td>
                                <td className='border p-2 text-right'>{receiptData.currpaymentdetails?.[0]?.ftP_Paid_Amt}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3 className='mb-2 font-bold text-sm'>Current Payment Detail</h3>
                    <table className='mb-6 w-full border-collapse border text-sm'>
                        <thead>
                            <tr className='bg-gray-100'>
                                <th className='border p-2'>SLNO</th>
                                <th className='border p-2'>Amount</th>
                                <th className='border p-2'>Bank</th>
                                <th className='border p-2'>DD.No</th>
                                <th className='border p-2'>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receiptData.currpaymentdetails?.map((payment, index) => (
                                <tr key={index}>
                                    <td className='border p-2 text-center'>{index + 1}</td>
                                    <td className='border p-2'>{payment.ftP_Paid_Amt}</td>
                                    <td className='border p-2'>{payment.fyP_Bank_Name || '--'}</td>
                                    <td className='border p-2'>{payment.fyP_DD_Cheque_No || '--'}</td>
                                    <td className='border p-2'>{payment.FYP_Date || '--'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className='mb-6 grid grid-cols-3 gap-4 text-sm'>
                        <div className='font-bold'>Amount Received (in Words):</div>
                        <div className='col-span-2 italic'>
                            {/* Call generic helper or placeholder */}
                            {amountInWords(receiptData.currpaymentdetails?.[0]?.ftP_Paid_Amt || 0)} Only/-
                        </div>
                    </div>
                    <div className='mb-6 grid grid-cols-3 gap-4 text-sm'>
                        <div className='font-bold'>Note :</div>
                        <div className='col-span-2'>This receipt is valid subject to realisation of Cheque</div>
                    </div>

                    <div className='mt-12 text-right'>
                        <h5 className='font-bold'>Authorised Signatory</h5>
                    </div>
                </div>
            )}
        </div>
    );
}

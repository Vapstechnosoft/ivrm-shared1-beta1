'use client';

import { Button } from '@/components/ui/button';
import { FormProvider } from '@/components/ui/form/form-provider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { feeDefaulterreportStthomas } from '@/schemas/fees/reports';
import type { IspecialFeeHeadDropdownList } from '@/types/fees/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

interface DataTablePrintProps {
    onClose: () => void;
}
type FormFields = z.infer<typeof feeDefaulterreportStthomas>;

export default function DataTablePrint({ onClose }: DataTablePrintProps) {
    const printRef = useRef<HTMLDivElement>(null);
    const { control } = useForm<FormFields>({
        resolver: zodResolver(feeDefaulterreportStthomas),
        defaultValues: {
            academicYearId: '',
            reportType: 'All',
            classId: '',
            sectionId: '',
            feeTerm: '',
            studentId: ''
        }
    });

    const filteredHeads: IspecialFeeHeadDropdownList[] = [
        {
            fmH_Id: 11,
            fmH_FeeName: 'FEE DEFAULT REPORT',
            amount: 2500
        },
        {
            fmH_Id: 12,
            fmH_FeeName: 'FEE DEFAULT REPORT 1',
            amount: 2800
        },
        {
            fmH_Id: 13,
            fmH_FeeName: 'FEE DEFAULT REPORT 2',
            amount: 3200
        },
        {
            fmH_Id: 14,
            fmH_FeeName: 'FEE DEFAULT REPORT 3',
            amount: 2700
        },
        {
            fmH_Id: 15,
            fmH_FeeName: 'FEE DEFAULT REPORT 4',
            amount: 3500
        }
    ];
    const handlePrint = () => {
        if (printRef.current) {
            // Create a new window for printing
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert('Please allow popups to print');
                return;
            }

            // Get the content to print
            const contentToPrint = printRef.current.innerHTML;

            // Write the print content to the new window
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
           
            <style>
              @media print {
                body {
                  font-family: 'Times New Roman', Times, serif;
                  margin: 0;
                  padding: 20px;
                }
                .print-header {
                  text-align: center;
                  margin-bottom: 30px;
                  border-bottom: 2px solid #000;
                  padding-bottom: 20px;
                }
                .print-header h1 {
                  font-size: 24px;
                  margin: 0 0 10px 0;
                }
                .print-section {
                  margin-bottom: 20px;
                  page-break-inside: avoid;
                }
                .print-label {
                  font-weight: bold;
                  margin-right: 10px;
                  min-width: 120px;
                  display: inline-block;
                }
                .print-details {
                  margin: 15px 0;
                }
                .print-content {
                  line-height: 1.6;
                  text-align: justify;
                }
                .print-footer {
                  margin-top: 40px;
                  padding-top: 20px;
                  border-top: 1px solid #ccc;
                }
                .amount-highlight {
                  font-weight: bold;
                  text-decoration: underline;
                }
                .signature-section {
                  margin-top: 60px;
                }
                .signature-line {
                  width: 200px;
                  border-top: 1px solid #000;
                  margin-top: 40px;
                }
                @page {
                  margin: 20mm;
                }
              }
              
              /* For screen preview */
              body {
                font-family: Arial, sans-serif;
                margin: 40px;
              }
              .print-header {
                text-align: center;
                margin-bottom: 30px;
              }
              .print-section {
                margin-bottom: 20px;
              }
              .print-label {
                font-weight: bold;
                min-width: 120px;
              }
              .amount-highlight {
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              
              <p><strong>FEE DEFAULT REPORT</strong></p>
              <p>Email Template: FEDEFAULTREPORT</p>
            </div>
            
            <div class="print-section">
              <h2>To</h2>
              <div class="print-details">
                <div><span class="print-label">M/M/s:</span> ANYTAR ALI</div>
                <div><span class="print-label">Address:</span> 5, NIL KAMAL KUNDU LANE HOVRAH</div>
                <div><span class="print-label">Contact No:</span> 0</div>
              </div>
            </div>
            
            <div class="print-section">
              <div class="print-details">
                <div><span class="print-label">Re ID:</span> 19565-NORAZ ANYTAR</div>
                <p>Dear M/M/s / ANYTAR ALI</p>
              </div>
            </div>
            
            <div class="print-section">
              <div class="print-content">
                <p>
                  This is to bring to your kind notice that the School Fees of your ward 
                  <strong>ID No: 19565 - NORAZ ANYTAR III</strong> remains unpaid from 
                  <strong>April, May, June, July, August, September, January to March. Opening Balance: New Admission Fees. Counseling Fees. Outstanding Fee 2024-25</strong>, 
                  which amounts to <span class="amount-highlight">Rs 29560</span> 
                  (Rupees Twenty Eight Thousand Nine Hundred Fifty) including Late readmission fees.
                </p>
                
                <p>
                  You are requested to kindly pay the above school fees within 7 days failing which action will be taken as per the School Rules.
                </p>
              </div>
            </div>
            
            <div class="print-footer">
              <p>Thanking You,</p>
              <p>Yours Sincerely,</p>
              
              
              
              <p style="margin-top: 30px; font-size: 12px; color: #666;">
                This is an auto-generated document. Please do not reply.
              </p>
            </div>
          </body>
        </html>
      `);

            printWindow.document.close();

            // Trigger print after content is loaded
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
                printWindow.onafterprint = () => {
                    printWindow.close();
                };
            };
        }
    };

    return (
        <FormProvider>
            <div className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 pt-[10vh]'>
                <div className='relative mx-auto my-8 w-[75%] max-w-4xl rounded-2xl bg-white p-6 shadow-xl'>
                    {/* Header Section */}
                    <div className='mb-6 flex items-center justify-between'>
                        <Button
                            variant='outline'
                            onClick={handlePrint}
                            className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                            Print
                        </Button>
                        <Button
                            variant='secondary'
                            onClick={onClose}
                            className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                            Close
                        </Button>
                    </div>

                    {/* Email Template Selector */}
                    <div className='mb-8'>
                        <div className='flex items-center justify-center gap-4'>
                            <Label className='w-48 text-right font-medium'>
                                Email Template: <span className='text-red-500'>*</span>
                            </Label>
                            <div className='w-48 flex-1'>
                                <Controller
                                    name='academicYearId'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                            value={field.value?.toString() || ''}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder={'Select Email Template'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='all'>All Templates</SelectItem>
                                                {filteredHeads.map((item) => (
                                                    <SelectItem key={item.fmH_Id} value={item.fmH_Id.toString()}>
                                                        {item.fmH_FeeName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email Template Content */}
                    <div className='rounded-lg border border-gray-200 bg-gray-50 p-8'>
                        {/* School Header */}

                        {/* Recipient Details */}
                        <div ref={printRef} className='mb-8 bg-white p-6'>
                            <h2 className='mb-4 font-semibold text-gray-700 text-lg'>To</h2>
                            <div className='space-y-3'>
                                <div className='flex'>
                                    <span className='w-32 font-medium text-gray-600'>M/M/s :</span>
                                    <span className='text-gray-800'>ANYTAR ALI</span>
                                </div>
                                <div className='flex'>
                                    <span className='w-32 font-medium text-gray-600'>Address:</span>
                                    <span className='text-gray-800'>5, NIL KAMAL KUNDU LANE HOVRAH</span>
                                </div>
                                <div className='flex'>
                                    <span className='w-32 font-medium text-gray-600'>Contact No:</span>
                                    <span className='text-gray-800'>0</span>
                                </div>
                            </div>
                        </div>

                        {/* Student Details */}
                        <div className='mb-8 bg-white p-6'>
                            <div className='mb-4 flex items-center gap-2'>
                                <span className='font-semibold text-gray-700'>Re ID:</span>
                                <span className='font-medium text-gray-700'>19565-NORAZ ANYTAR</span>
                            </div>
                            <p className='mb-4 text-gray-700'>
                                Dear <span className='font-semibold'>M/M/s / ANYTAR ALI</span>
                            </p>
                        </div>

                        {/* Main Content */}
                        <div className='mb-8 bg-white p-6'>
                            <p className='mb-4 text-gray-700 leading-relaxed'>
                                This is to bring to your kind notice that the School Fees of your ward
                                <span className='font-semibold text-gray-700'> ID No: 19565 - NORAZ ANYTAR III </span>
                                remains unpaid from
                                <span className='font-semibold'>
                                    {' '}
                                    April, May, June, July, August, September, January to March. Opening Balance: New Admission Fees.
                                    Counseling Fees. Outstanding Fee 2024-25
                                </span>
                                , which amounts to
                                <span className='font-bold text-gray-700'> Rs 29560 </span>
                                (Rupees Twenty Eight Thousand Nine Hundred Fifty) including Late readmission fees.
                            </p>

                            <p className='mb-4 font-medium text-gray-700 leading-relaxed'>
                                You are requested to kindly pay the above school fees within 7 days failing which action will be taken as
                                per the School Rules.
                            </p>
                        </div>

                        {/* Closing Section */}
                        <div className='mt-10 p-6'>
                            <p className=' text-gray-600 '>Thanking You,</p>
                            <p className=' text-gray-600 '>Yours Sincerely,</p>
                        </div>
                    </div>
                </div>
            </div>
        </FormProvider>
    );
}

'use client';

import { Button } from '@/components/ui/button';
import type {
    ITransactionReportDetail,
    ITransactionReportEmployee
} from '@/types/lesson-planner/reports/school-staff-period-transaction-report';
import { format } from 'date-fns';
import { Eye, Printer } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface ReportDisplayProps {
    reportData: ITransactionReportDetail[];
    employeeData: ITransactionReportEmployee[];
    filterDetails: {
        year: string;
        class: string;
        section: string;
    };
}

export default function ReportDisplay({ reportData, employeeData, filterDetails }: ReportDisplayProps) {
    const componentRef = useRef<HTMLDivElement>(null);

    // Construct full URL for file attachments
    const getFileUrl = (filepath: string | undefined): string => {
        if (!filepath) return '';

        // If it's already a full URL, return as is
        if (filepath.startsWith('http://') || filepath.startsWith('https://')) {
            return filepath;
        }

        // Get the API base URL from environment
        const apiBaseUrl = process.env.NEXT_PUBLIC_LESSONPLANNER_API_BASE_URL || '';

        // Remove /api suffix if present to avoid double /api
        const baseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

        // Remove leading slash from filepath if present
        const cleanPath = filepath.startsWith('/') ? filepath.substring(1) : filepath;

        return `${baseUrl}/${cleanPath}`;
    };

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: 'Subject Staff Period Mapping Report',
        pageStyle: `
          @page {
            margin: 20mm;
          }
          @media print {
            body { 
              -webkit-print-color-adjust: exact !important; 
              print-color-adjust: exact !important;
            }
            * { 
              visibility: visible !important; 
            }
            table { 
              border-collapse: collapse !important;
            }
            th, td {
              border: 1px solid #ccc !important;
              padding: 4px !important;
            }
          }
        `
    });

    // Grouping logic: Match employees with their report details
    // If employeeData is empty, create a single group from reportData
    const groupedReports = useMemo(() => {
        if (employeeData.length > 0) {
            return employeeData.map((emp) => {
                const details = reportData.filter((d) => d.isms_id === emp.isms_id);
                return {
                    ...emp,
                    details
                };
            });
        } else {
            // Fallback for flat data structure - group by isms_id from reportData
            const groupedMap = new Map<
                number,
                { isms_id: number; staffname: string; subjectname: string; details: ITransactionReportDetail[] }
            >();
            reportData.forEach((item) => {
                if (!groupedMap.has(item.isms_id)) {
                    groupedMap.set(item.isms_id, {
                        isms_id: item.isms_id,
                        staffname: item.staffname,
                        subjectname: (item as any).subjectname || '',
                        details: []
                    });
                }
                groupedMap.get(item.isms_id)!.details.push(item);
            });
            return Array.from(groupedMap.values());
        }
    }, [reportData, employeeData]);

    if (!groupedReports.length && !reportData.length) return null;

    // Debug logs
    console.log('Transaction Report - groupedReports count:', groupedReports.length);
    console.log('Transaction Report - reportData count:', reportData.length);

    return (
        <div className='space-y-4'>
            <div className='flex justify-end'>
                <Button onClick={handlePrint} variant='outline' className='gap-2'>
                    <Printer className='h-4 w-4' /> Print
                </Button>
            </div>

            <div ref={componentRef} className='bg-white p-8 text-black print:p-0'>
                {groupedReports.map((report) => (
                    <div key={report.isms_id} className='mb-8 break-inside-avoid'>
                        <div className='mb-6 text-center'>
                            <h2 className='mb-2 font-bold text-xl uppercase'>Subject Staff Period Mapping Report</h2>
                            <h3 className='font-semibold text-lg'>Subject Staff Mapping Report For Subject - {report.subjectname}</h3>
                        </div>

                        <div className='mb-4 grid grid-cols-2 gap-4 text-sm'>
                            <div>
                                <strong>Year:</strong> {filterDetails.year}
                            </div>
                            <div>
                                <strong>Class:</strong> {filterDetails.class}
                            </div>
                            <div>
                                <strong>Section:</strong> {filterDetails.section}
                            </div>
                            <div>
                                <strong>Staff Name:</strong> {report.staffname}
                            </div>
                        </div>

                        <table className='w-full border-collapse border border-gray-300 text-sm'>
                            <thead>
                                <tr className='bg-gray-100'>
                                    <th className='w-16 border border-gray-300 p-2 text-center'>SL.NO.</th>
                                    <th className='border border-gray-300 p-2 text-left'>Topic Name</th>
                                    <th className='w-32 border border-gray-300 p-2 text-center'>Date</th>
                                    <th className='w-32 border border-gray-300 p-2 text-center'>Attachment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.details.length > 0 ? (
                                    report.details.map((row, idx) => (
                                        <tr
                                            key={`${row.isms_id}-${row.topicname}-${row.allocateddate || idx}`}
                                            className='hover:bg-gray-50'>
                                            <td className='border border-gray-300 p-2 text-center'>{idx + 1}</td>
                                            <td className='border border-gray-300 p-2'>{row.topicname}</td>
                                            <td className='border border-gray-300 p-2 text-center'>
                                                {row.allocateddate ? format(new Date(row.allocateddate), 'dd/MM/yyyy') : '-'}
                                            </td>
                                            <td className='border border-gray-300 p-2 text-center'>
                                                {row.filepath || row.lplcD_FilePath ? (
                                                    <Link
                                                        href={getFileUrl(row.filepath || row.lplcD_FilePath)}
                                                        target='_blank'
                                                        className='inline-flex items-center gap-1 font-bold text-red-500 hover:underline'>
                                                        <Eye className='h-3 w-3' /> View
                                                    </Link>
                                                ) : (
                                                    <span className='text-gray-400'>-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className='border border-gray-300 p-4 text-center text-gray-500'>
                                            No records found for this subject.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
}

'use client';

import { Button } from '@/components/ui/button';
import type {
    IDeviationReportDetail,
    IDeviationReportEmployee
} from '@/types/lesson-planner/reports/school-staff-period-transaction-deviation-report';
import { format } from 'date-fns';
import { Printer } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface ReportDisplayProps {
    reportData: IDeviationReportDetail[];
    employeeData: IDeviationReportEmployee[];
    institutionHeaderData?: {
        // Placeholder for header data potentially passed down
        logo?: string;
        name?: string;
    };
    filterDetails: {
        year: string;
        class: string;
        section: string;
    };
}

export default function ReportDisplay({ reportData, employeeData, filterDetails }: ReportDisplayProps) {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: 'Staff Deviation Report',
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
            .print-content {
              display: block !important;
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
    // If employeeData is empty, create groups directly from reportData
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
                { isms_id: number; staffname: string; subjectname: string; details: IDeviationReportDetail[] }
            >();
            reportData.forEach((item) => {
                if (!groupedMap.has(item.isms_id)) {
                    groupedMap.set(item.isms_id, {
                        isms_id: item.isms_id,
                        staffname: item.staffname,
                        subjectname: item.subjectname || '',
                        details: []
                    });
                }
                groupedMap.get(item.isms_id)!.details.push(item);
            });
            return Array.from(groupedMap.values());
        }
    }, [reportData, employeeData]);

    if (!groupedReports.length && !reportData.length) return null;

    // Debug: log grouped reports
    console.log('Deviation Report - groupedReports count:', groupedReports.length);
    console.log('Deviation Report - reportData count:', reportData.length);
    console.log('Deviation Report - employeeData count:', employeeData.length);

    return (
        <div className='space-y-4'>
            <div className='flex justify-end'>
                <Button onClick={handlePrint} variant='outline' className='gap-2'>
                    <Printer className='h-4 w-4' /> Print
                </Button>
            </div>

            <div ref={componentRef} className='print-content bg-white p-8 text-black print:p-0' style={{ minHeight: '100px' }}>
                {groupedReports.map((report, index) => (
                    <div key={index} className='mb-8 break-inside-avoid'>
                        {/* Header Section per report group (replicating legacy behavior) */}
                        <div className='mb-6 text-center'>
                            {/* Logo and Institution Name would typically go here */}
                            <h2 className='mb-2 font-bold text-xl uppercase'>Subject Staff Period Deviation Report</h2>
                            <h3 className='font-semibold text-lg'>Staff Deviation For Subject - {report.subjectname}</h3>
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
                                    <th className='w-32 border border-gray-300 p-2 text-center'>Allocated Date</th>
                                    <th className='w-32 border border-gray-300 p-2 text-center'>Taken Date</th>
                                    <th className='w-32 border border-gray-300 p-2 text-center'>Deviation Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.details.length > 0 ? (
                                    report.details.map((row, idx) => (
                                        <tr key={idx} className='hover:bg-gray-50'>
                                            <td className='border border-gray-300 p-2 text-center'>{idx + 1}</td>
                                            <td className='border border-gray-300 p-2'>{row.topicname}</td>
                                            <td className='border border-gray-300 p-2 text-center'>
                                                {row.allocateddate ? format(new Date(row.allocateddate), 'dd/MM/yyyy') : '-'}
                                            </td>
                                            <td className='border border-gray-300 p-2 text-center'>
                                                {row.takendate ? format(new Date(row.takendate), 'dd/MM/yyyy') : '-'}
                                            </td>
                                            <td className='border border-gray-300 p-2 text-center'>{row.datediffcount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className='border border-gray-300 p-4 text-center text-gray-500'>
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

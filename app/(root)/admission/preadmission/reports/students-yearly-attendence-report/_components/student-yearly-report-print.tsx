import { type IStudentYearlyAttendenceReportList } from '@/types/admission/preadmission/reports';
import { format } from 'date-fns';
import React from 'react';

interface StudentYearlyReportPrintProps {
    data: IStudentYearlyAttendenceReportList[];
    monthList: any[];
}

export const StudentYearlyReportPrint = React.forwardRef<HTMLDivElement, StudentYearlyReportPrintProps>(
    ({ data, monthList }, ref) => {
        const currentDate = format(new Date(), 'dd/MM/yyyy');

        if (!data || data.length === 0) {
            return (
                <div ref={ref} className='p-5 text-center bg-white text-black'>
                    No data selected for printing.
                </div>
            );
        }

        return (
            <div ref={ref} className='print-preview-container p-5 bg-white text-black min-h-full w-full'>
                <style>
                    {`
                        @media print {
                            @page {
                                margin: 10mm;
                                size: A4 landscape;
                            }
                            body {
                                visibility: hidden;
                                background: white;
                            }
                            .print-preview-container {
                                visibility: visible !important;
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                background: white;
                                z-index: 9999;
                                color: black;
                            }
                            .print-preview-container * {
                                visibility: visible !important;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                border: 1px solid #000;
                            }
                            th, td {
                                border: 1px solid #000;
                                padding: 4px;
                                text-align: center;
                                font-size: 10px;
                            }
                            th {
                                background-color: #f3f4f6;
                                font-weight: bold;
                                -webkit-print-color-adjust: exact;
                            }
                            .text-left {
                                text-align: left !important;
                            }
                            .header-section {
                                text-align: center;
                                margin-bottom: 20px;
                            }
                            .footer-section {
                                margin-top: 20px;
                                display: flex;
                                justify-content: space-between;
                                padding: 10px 0;
                                border-top: 1px solid #ccc;
                                page-break-after: always;
                            }
                        }
                    `}
                </style>

                {/* Header */}
                <div className='header-section mb-6 text-center'>
                    <h2 className='text-lg font-bold uppercase'>Student Yearly Attendance Report</h2>
                    <p className='text-sm text-gray-600'>Date: {currentDate}</p>
                </div>

                {/* Table */}
                <table className='w-full'>
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='w-12'>Sl.No</th>
                            <th className='text-left'>Student Name</th>
                            <th>Adm. No</th>
                            <th>Roll No</th>
                            {monthList.map((month: any, index: number) => (
                                <th key={index}>{month.monthnamee}</th>
                            ))}
                            <th>Total Present</th>
                            <th>Total Working Days</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((student, index) => {
                            const totalWorkingDays = monthList.reduce((sum: any, month: any) => sum + month.total, 0);
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td className='text-left'>{student.name}</td>
                                    <td>{student.AMST_AdmNo}</td>
                                    <td>{student.AMAY_RollNo}</td>
                                    {monthList.map((month: any, idx: number) => (
                                        <td key={idx}>
                                            {student.monthlyAttendance[`${month.yearidname}-${month.monthidname}`] || 0} / {month.total}
                                        </td>
                                    ))}
                                    <td>{student.totalPresent}</td>
                                    <td>{totalWorkingDays}</td>
                                    <td>{student.percentage}%</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Footer */}
                <div className='footer-section'>
                    <div>Printed Date: {currentDate}</div>
                    <div>Signature</div>
                </div>
            </div>
        );
    }
);

StudentYearlyReportPrint.displayName = 'StudentYearlyReportPrint';

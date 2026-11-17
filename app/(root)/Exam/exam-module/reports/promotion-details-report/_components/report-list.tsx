'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRef } from 'react';
import * as XLSX from 'xlsx';

interface ReportListProps {
    data: any;
    isSuperAverage: boolean;
}

export const ReportList = ({ data, isSuperAverage }: ReportListProps) => {
    const tableRef = useRef<HTMLTableElement>(null);

    if (!data || !data.getstudentmarksdetails_temp || data.getstudentmarksdetails_temp.length === 0) {
        return null;
    }

    const { YearName, stream, section, empG_GroupName } = data;

    const handlePrint = () => {
        const printContent = tableRef.current?.outerHTML;
        if (printContent) {
            const printWindow = window.open('', '', 'height=600,width=800');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Promotion Report</title>');
                printWindow.document.write(
                    '<style>table { width: 100%; border-collapse: collapse; text-align: center; } th, td { border: 1px solid black; padding: 8px; } th { background-color: #f2f2f2; } .rotate-header { writing-mode: vertical-rl; transform: rotate(180deg); }</style>'
                );
                printWindow.document.write('</head><body>');
                printWindow.document.write('<div style="text-align: center; margin-bottom: 20px;">');
                printWindow.document.write("<h3>St. Thomas' Church School</h3>");
                printWindow.document.write(`<h5>${isSuperAverage ? 'CLASS WISE AVERAGE REPORT' : 'CLASS WISE TERM REPORT'}</h5>`);
                printWindow.document.write(
                    `<h4>${isSuperAverage ? 'SUPER AVERAGE SHEET' : 'TABULATION SHEET'} : ${YearName} Class : ${stream}: Section : ${section} ${!isSuperAverage ? '- EXAM : ' + empG_GroupName : ''}</h4>`
                );
                printWindow.document.write('</div>');
                printWindow.document.write(printContent);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.print();
            }
        }
    };

    const handleExport = () => {
        if (tableRef.current) {
            const wb = XLSX.utils.table_to_book(tableRef.current);
            XLSX.writeFile(wb, 'Promotion_Report.xlsx');
        }
    };

    const RenderSuperAverageTable = () => {
        return (
            <Table ref={tableRef} className='text-xs'>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-[50px]'>S. NO</TableHead>
                        <TableHead className='w-[100px]'>STUDENT'S-ID</TableHead>
                        <TableHead>STUDENT'S NAME</TableHead>
                        {data.getstudentwisesubjectlist.map((sub: any, idx: number) => (
                            <TableHead key={idx}>{sub.ISMS_SubjectName}</TableHead>
                        ))}
                        <TableHead>TOTAL</TableHead>
                        <TableHead>PERCENTAGE</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.getstudentmarksdetails_temp.map((student: any, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{student.AMST_AdmNo}</TableCell>
                            <TableCell className='text-left font-medium'>{student.studentname}</TableCell>
                            {data.getstudentwisesubjectlist.map((sub: any, idx: number) => (
                                <TableCell key={idx}>{student[sub.ISMS_SubjectName] || '-'}</TableCell>
                            ))}
                            <TableCell>
                                {data.St_ThomosTotal.find((t: any) => t.AMST_Id === student.AMST_Id)?.ESTMPPSG_GroupObtMarks}
                            </TableCell>
                            <TableCell>{data.St_ThomosTotal.find((t: any) => t.AMST_Id === student.AMST_Id)?.TotalPercentage}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    const RenderNormalTable = () => {
        // Logic for vertical headers is handled via CSS in real implementation, simplified here
        return (
            <Table ref={tableRef} className='text-xs'>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-[50px]'>S. NO</TableHead>
                        <TableHead className='w-[100px]'>STUDENT'S-ID</TableHead>
                        <TableHead>STUDENT'S NAME</TableHead>
                        {data.piotsubjets.map((sub: any, idx: number) => (
                            <TableHead key={idx} className='whitespace-nowrap'>
                                {sub.ISMS_SubjectName}
                            </TableHead>
                        ))}
                        {data.getskill?.map((skill: any, idx: number) => (
                            <TableHead key={`skill-${idx}`}>{skill.ECACT_SkillName}</TableHead>
                        ))}
                        <TableHead>TOTAL</TableHead>
                        <TableHead>PERCENTAGE</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.getstudentmarksdetails_temp.map((student: any, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{student.AMST_AdmNo}</TableCell>
                            <TableCell className='text-left font-medium'>{student.studentname}</TableCell>
                            {data.piotsubjets.map((sub: any, idx: number) => (
                                <TableCell key={idx}>{student[sub.SubjectName] || '-'}</TableCell>
                            ))}
                            {data.getskill?.map((skill: any, idx: number) => (
                                <TableCell key={`skill-${idx}`}>
                                    {/* Mock logic for finding grade */}
                                    {data.getallgrade.find(
                                        (g: any) => g.AMST_Id === student.AMST_Id && g.ECACT_SkillName === skill.ECACT_SkillName
                                    )?.EMGD_Name || '-'}
                                </TableCell>
                            ))}
                            <TableCell>{student.TotalMarks}</TableCell>
                            <TableCell>{student.TotalPercentage}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
        <div className='space-y-4'>
            <div className='space-y-2 border-b pb-4 text-center'>
                <h3 className='font-bold text-xl'>St. Thomas' Church School</h3>
                <h5 className='font-semibold'>{isSuperAverage ? 'CLASS WISE AVERAGE REPORT' : 'CLASS WISE TERM REPORT'}</h5>
                <h4 className='font-semibold'>
                    {isSuperAverage ? 'SUPER AVERAGE SHEET' : 'TABULATION SHEET'} : {YearName} Class : {stream}: Section : {section}{' '}
                    {!isSuperAverage && `- EXAM : ${empG_GroupName}`}
                </h4>
            </div>

            <div className='flex justify-end space-x-2'>
                <Button onClick={handlePrint} variant='outline'>
                    <i className='fa fa-print mr-2' /> Print
                </Button>
                <Button onClick={handleExport} variant='outline'>
                    <i className='fa fa-file-excel-o mr-2' /> Export to Excel
                </Button>
            </div>

            <div className='overflow-x-auto rounded-md border'>{isSuperAverage ? RenderSuperAverageTable() : RenderNormalTable()}</div>
        </div>
    );
};

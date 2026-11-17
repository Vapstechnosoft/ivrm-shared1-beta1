'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function TBSReportSchoolExcel({ reportData }: { reportData: any }) {
    const exportToExcel = () => {
        if (!reportData || !reportData.getstudentdetails) return;

        const { getstudentdetails, getstudentmarksdetails, getgroupexamdetails, getstudentwisetermwisedetails } = reportData;

        // Create headers
        const headers = ['Sl No', 'Student Name', 'Class', 'Section', 'Adm No'];

        // Add exam marks columns
        getgroupexamdetails.forEach((exam: any) => {
            headers.push(`${exam.emE_ExamName} - Marks`);
            headers.push(`${exam.emE_ExamName} - Grade`);
        });

        headers.push('Total Marks', 'Max Marks', 'Percentage');

        // Create data rows
        const rows = getstudentdetails.map((student: any, idx: number) => {
            const row = [idx + 1, student.studentname, student.classname, student.sectionname, student.admno];

            getgroupexamdetails.forEach((exam: any) => {
                const mark = getstudentmarksdetails.find((m: any) => m.AMST_Id === student.AMST_Id && m.EME_Id === exam.emE_Id);
                row.push(mark?.ObtainedMarks ?? '-');
                row.push(mark?.grade ?? '-');
            });

            const term = getstudentwisetermwisedetails.find((t: any) => t.AMST_Id === student.AMST_Id);
            row.push(term?.ESTMPP_TotalObtMarks ?? '-');
            row.push(term?.ESTMPP_TotalMaxMarks ?? '-');
            row.push(term?.ESTMPP_Percentage ? `${term.ESTMPP_Percentage}%` : '-');

            return row;
        });

        const worksheetData = [['TUNBRIDGE HIGH SCHOOL'], ['1 TO 8 REPORT CARD'], [], headers, ...rows];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(worksheetData);

        // Basic styling
        XLSX.utils.book_append_sheet(wb, ws, 'Report Card');
        XLSX.writeFile(wb, `TBS_Report_Card_${Date.now()}.xlsx`);
    };

    return (
        <Button onClick={exportToExcel} size='sm' variant='outline' className='gap-2'>
            <Download className='h-4 w-4' />
            Export Excel
        </Button>
    );
}

// app/exam/electives-report/_components/elective-report-excel.tsx
'use client';

import { Button } from '@/components/ui/button';
import type { ElectiveGroup, StudentRow } from '@/types/exam/exam-module/report';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Props {
    students: StudentRow[];
    groupList: ElectiveGroup[];
    instituteLogo?: string;
    showMobile: boolean;
    showEmail: boolean;
}

export default function ElectiveReportExcel({ students, groupList, showMobile, showEmail }: Props) {
    const exportToExcel = () => {
        if (students.length === 0) return;

        const headers = [
            'SL.No',
            'Student Name',
            ...(showMobile ? ['Mobile No'] : []),
            ...(showEmail ? ['Email-Id'] : []),
            'Class',
            'Section',
            ...groupList.map((g) => g.emG_GroupName)
        ];

        const rows = students.map((stud, idx) => {
            const row: any[] = [
                idx + 1,
                stud.amsT_FirstName || '',
                ...(showMobile ? [stud.amsT_MobileNo || 0] : []),
                ...(showEmail ? [stud.amsT_emailId || ''] : []),
                stud.asmcL_ClassName || '',
                stud.asmC_SectionName || ''
            ];

            groupList.forEach((group) => {
                const subjects =
                    stud.sub_list
                        .filter((s) => s.emG_GroupName === group.emG_GroupName)
                        .map((s) => s.ismS_SubjectName)
                        .join(', ') || '';
                row.push(subjects);
            });

            return row;
        });

        const titleRows = [['Student Elective Subject Report'], [], headers];

        const ws = XLSX.utils.aoa_to_sheet([...titleRows, ...rows]);
        ws['!cols'] = headers.map((_, i) => ({ wch: i === 1 ? 30 : 20 }));
        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } }
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Elective Report');
        XLSX.writeFile(wb, `Elective_Subjects_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    return (
        <Button onClick={exportToExcel} size='sm' variant='outline' className='border-green-600 text-green-700 hover:bg-green-50'>
            <Download className='mr-2 h-4 w-4' /> Export Excel
        </Button>
    );
}

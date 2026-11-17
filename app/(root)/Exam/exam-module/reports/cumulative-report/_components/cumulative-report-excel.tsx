// app/exam/cumulative-report/_components/cumulative-report-excel.tsx
'use client';

import { Button } from '@/components/ui/button';
import type { ICumulativeReport, IReportHeader, ISubject } from '@/types/exam/exam-module/report';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface CumulativeReportExcelProps {
    reportData: ICumulativeReport[];
    subjects: ISubject[];
    headerInfo: Partial<IReportHeader>;
    columnFlags: {
        admno: boolean;
        regno: boolean;
        rollno: boolean;
        classrank: boolean;
        sectionrank: boolean;
        attendancedispaly: boolean;
    };
}

export default function CumulativeReportExcel({ reportData, subjects, headerInfo, columnFlags }: CumulativeReportExcelProps) {
    const exportToExcel = () => {
        if (!reportData.length) return;

        const applicableSubjects = subjects.filter((s) => s.eyceS_AplResultFlg);
        const nonApplicableSubjects = subjects.filter((s) => !s.eyceS_AplResultFlg);

        // Title rows
        const titleRows = [
            [headerInfo.mI_name || 'VIDYA VIKASA VIDYA SAMSTHE (R)'],
            ['CLASS WISE CUMULATIVE REPORT'],
            [`Academic Year: ${headerInfo.yr || ''}`],
            [`Class & Section: ${headerInfo.cla || ''} - ${headerInfo.sec || ''}`],
            [`Exam: ${headerInfo.exmmid || ''}`],
            []
        ];

        // Base columns before subjects
        const baseColumnsCount =
            2 + // Sl No + Student Name
            (columnFlags.admno ? 1 : 0) +
            (columnFlags.regno ? 1 : 0) +
            (columnFlags.rollno ? 1 : 0);

        // Build header rows
        const mainHeaderRow: any[] = ['Sl No', 'Student Name'];
        const subHeaderRow: any[] = ['', ''];

        if (columnFlags.admno) {
            mainHeaderRow.push('Adm No');
            subHeaderRow.push('');
        }
        if (columnFlags.regno) {
            mainHeaderRow.push('Reg No');
            subHeaderRow.push('');
        }
        if (columnFlags.rollno) {
            mainHeaderRow.push('Roll No');
            subHeaderRow.push('');
        }

        // Add subjects to headers
        applicableSubjects.forEach((subj) => {
            const isEVS = subj.ismS_SubjectName?.toUpperCase().includes('EVS');
            if (isEVS) {
                mainHeaderRow.push(subj.ismS_SubjectName || '');
                subHeaderRow.push('Marks & Grade');
            } else {
                mainHeaderRow.push(subj.ismS_SubjectName || '');
                mainHeaderRow.push('');
                subHeaderRow.push('Marks');
                subHeaderRow.push('Grade');
            }
        });

        // Total columns
        mainHeaderRow.push('Total', 'Obtained', '%', 'Grade');
        subHeaderRow.push('Max', 'Marks', '', '');

        // Non-applicable subjects
        nonApplicableSubjects.forEach((subj) => {
            const isEVS = subj.ismS_SubjectName?.toUpperCase().includes('EVS');
            if (isEVS) {
                mainHeaderRow.push(subj.ismS_SubjectName || '');
                subHeaderRow.push('Marks & Grade');
            } else {
                mainHeaderRow.push(subj.ismS_SubjectName || '');
                mainHeaderRow.push('');
                subHeaderRow.push('Marks');
                subHeaderRow.push('Grade');
            }
        });

        // Data rows
        const dataRows = reportData.map((student, idx) => {
            const isAbsent = student.estmP_Result === 'AB';
            const row: any[] = [idx + 1, student.amsT_FirstName || 'Unknown'];

            if (columnFlags.admno) row.push(student.amsT_AdmNo ?? '-');
            if (columnFlags.regno) row.push(student.amsT_RegistrationNo ?? '-');
            if (columnFlags.rollno) row.push(student.amaY_RollNo ?? '-');

            // Process applicable subjects
            applicableSubjects.forEach((subj) => {
                const sub = student.sub_list?.find((m) => m.ismS_Id === subj.ismS_Id);
                const marks = sub?.estmpS_ObtainedMarks;
                const grade = sub?.estmpS_ObtainedGrade;
                const isAB = sub?.estmpS_PassFailFlg === 'AB';
                const isEVS = subj.ismS_SubjectName?.toUpperCase().includes('EVS');

                if (isAB) {
                    isEVS ? row.push('AB') : row.push('AB', 'AB');
                } else if (isEVS && marks != null && grade != null) {
                    row.push(`${marks} | ${grade}`);
                } else if (isEVS) {
                    row.push(marks ?? grade ?? '');
                } else {
                    row.push(marks ?? '');
                    row.push(grade ?? '');
                }
            });

            // Total Marks
            row.push(
                isAbsent ? '' : (student.estmP_TotalMaxMarks ?? ''),
                isAbsent ? '' : (student.estmP_TotalObtMarks ?? ''),
                isAbsent || student.estmP_Percentage == null ? '' : `${Number(student.estmP_Percentage).toFixed(2)}%`,
                isAbsent ? '' : (student.estmP_TotalGrade ?? '')
            );

            // Non-applicable subjects
            nonApplicableSubjects.forEach((subj) => {
                const sub = student.sub_list?.find((m) => m.ismS_Id === subj.ismS_Id);
                const marks = sub?.estmpS_ObtainedMarks;
                const grade = sub?.estmpS_ObtainedGrade;
                const isAB = sub?.estmpS_PassFailFlg === 'AB';
                const isEVS = subj.ismS_SubjectName?.toUpperCase().includes('EVS');

                if (isAB) {
                    isEVS ? row.push('AB') : row.push('AB', 'AB');
                } else if (isEVS && marks != null && grade != null) {
                    row.push(`${marks} | ${grade}`);
                } else if (isEVS) {
                    row.push(marks ?? grade ?? '');
                } else {
                    row.push(marks ?? '');
                    row.push(grade ?? '');
                }
            });

            return row;
        });

        // Full worksheet data
        const worksheetData = [...titleRows, mainHeaderRow, subHeaderRow, ...dataRows];

        // Create workbook and sheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(worksheetData);

        // Set column widths
        ws['!cols'] = mainHeaderRow.map((_, i) => ({
            wch: i === 1 ? 30 : 14 // Student name wider
        }));

        // Define merges
        ws['!merges'] = [];
        const totalCols = mainHeaderRow.length;

        // Merge title rows across all columns
        for (let i = 0; i < titleRows.length - 1; i++) {
            ws['!merges']!.push({
                s: { r: i, c: 0 },
                e: { r: i, c: totalCols - 1 }
            });
        }

        // Merge subject names (non-EVS) over Marks/Grade columns
        let currentCol = baseColumnsCount;

        [...applicableSubjects, ...nonApplicableSubjects].forEach((subj) => {
            const isEVS = subj.ismS_SubjectName?.toUpperCase().includes('EVS');
            if (!isEVS) {
                ws['!merges']!.push({
                    s: { r: titleRows.length, c: currentCol },
                    e: { r: titleRows.length, c: currentCol + 1 }
                });
                currentCol += 2;
            } else {
                currentCol += 1;
            }
        });

        // Apply styling: Everything centered except Student Name (left) and titles (center)
        const range = XLSX.utils.decode_range(ws['!ref']!);

        for (let R = 0; R <= range.e.r; R++) {
            for (let C = 0; C <= range.e.c; C++) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellAddress]) ws[cellAddress] = { v: '' };

                const isTitleRow = R < titleRows.length - 1;
                const isMainHeader = R === titleRows.length;
                const isSubHeader = R === titleRows.length + 1;

                const isStudentNameCol = C === 1;

                ws[cellAddress].s = {
                    font: {
                        name: 'Calibri',
                        sz: isTitleRow ? 16 : 11,
                        bold: isTitleRow || isMainHeader || isSubHeader
                    },
                    alignment: {
                        horizontal: isTitleRow || isStudentNameCol ? (isTitleRow ? 'center' : 'left') : 'center',
                        vertical: 'center',
                        wrapText: true
                    },
                    border: {
                        top: { style: 'thin', color: { rgb: 'FF000000' } },
                        bottom: { style: 'thin', color: { rgb: 'FF000000' } },
                        left: { style: 'thin', color: { rgb: 'FF000000' } },
                        right: { style: 'thin', color: { rgb: 'FF000000' } }
                    }
                };

                // Make headers bold and background light gray
                if (isMainHeader || isSubHeader) {
                    ws[cellAddress].s.fill = {
                        patternType: 'solid',
                        fgColor: { rgb: 'FFD9EAD3' } // Light green
                    };
                }
            }
        }

        // Append sheet
        XLSX.utils.book_append_sheet(wb, ws, 'Cumulative Report');

        // Generate filename
        const fileName = `Cumulative_Report_${(headerInfo.cla || 'Class').replace(/[\/\\?%*:|"<>]/g, '_')}_${(headerInfo.sec || '').replace(
            /[\/\\?%*:|"<>]/g,
            '_'
        )}_${(headerInfo.exmmid || 'Exam').replace(/[\/\\?%*:|"<>]/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;

        XLSX.writeFile(wb, fileName);
    };

    return (
        <Button onClick={exportToExcel} size='sm' variant='outline' className='gap-2'>
            <Download className='h-4 w-4' />
            Export Excel
        </Button>
    );
}

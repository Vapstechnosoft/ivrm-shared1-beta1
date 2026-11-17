'use client';

import { Button } from '@/components/ui/button';
import type { ICumulativeReport, IReportHeader, ISubject } from '@/types/exam/exam-module/report';
import { Download, Printer } from 'lucide-react';
import { useState } from 'react';
import * as XLSX from 'xlsx';

interface CumulativeReportGridViewProps {
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
    onPrint: () => void;
    initialSize?: string;
}

export default function CumulativeReportGridView({
    reportData,
    subjects,
    headerInfo,
    columnFlags,
    onPrint,
    initialSize = '10'
}: CumulativeReportGridViewProps) {
    const [size, setSize] = useState(initialSize);

    const fontSizeClass =
        {
            '8': 'text-xs',
            '9': 'text-xs',
            '10': 'text-sm',
            '11': 'text-base',
            '12': 'text-base',
            '14': 'text-lg',
            '16': 'text-xl',
            '18': 'text-2xl',
            '20': 'text-3xl'
        }[size] || 'text-sm';

    // ====================== EXCEL EXPORT FUNCTION ======================
    const exportToExcel = () => {
        if (!reportData.length) {
            alert('No data to export!');
            return;
        }

        const applicableSubjects = subjects.filter((s) => s.eyceS_AplResultFlg);
        const nonApplicableSubjects = subjects.filter((s) => !s.eyceS_AplResultFlg);

        // Title rows
        const titleRows = [
            [headerInfo.mI_Name || 'VIDYA VIKASA VIDYA SAMSTHE (R)'],
            ['CLASS WISE CUMULATIVE REPORT'],
            [`Academic Year: ${headerInfo.yr || ''}`],
            [`Class & Section: ${headerInfo.cla || ''} - ${headerInfo.sec || ''}`],
            [`Exam: ${headerInfo.exmmid || ''}`],
            []
        ];

        // Base columns count
        const baseColumnsCount = 2 + (columnFlags.admno ? 1 : 0) + (columnFlags.regno ? 1 : 0) + (columnFlags.rollno ? 1 : 0);

        // Header rows
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

        // Applicable subjects
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

            // Applicable subjects
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

            // Total
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

        // Create worksheet
        const worksheetData = [...titleRows, mainHeaderRow, subHeaderRow, ...dataRows];
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(worksheetData);

        // Column widths
        ws['!cols'] = mainHeaderRow.map((_, i) => ({ wch: i === 1 ? 30 : 14 }));

        // Merges
        ws['!merges'] = [];
        const totalCols = mainHeaderRow.length;

        // Merge title rows
        for (let i = 0; i < titleRows.length - 1; i++) {
            ws['!merges']!.push({ s: { r: i, c: 0 }, e: { r: i, c: totalCols - 1 } });
        }

        // Merge subject names (non-EVS)
        let currentCol = baseColumnsCount;
        [...applicableSubjects, ...nonApplicableSubjects].forEach((subj) => {
            if (!subj.ismS_SubjectName?.toUpperCase().includes('EVS')) {
                ws['!merges']!.push({
                    s: { r: titleRows.length, c: currentCol },
                    e: { r: titleRows.length, c: currentCol + 1 }
                });
                currentCol += 2;
            } else {
                currentCol += 1;
            }
        });

        // Styling
        const range = XLSX.utils.decode_range(ws['!ref']!);
        for (let R = 0; R <= range.e.r; ++R) {
            for (let C = 0; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellAddress]) ws[cellAddress] = { v: '' };

                const isTitleRow = R < titleRows.length - 1;
                const isHeaderRow = R === titleRows.length || R === titleRows.length + 1;

                ws[cellAddress].s = {
                    font: { name: 'Calibri', sz: isTitleRow ? 16 : 11, bold: isTitleRow || isHeaderRow },
                    alignment: {
                        horizontal: isTitleRow || C === 1 ? (isTitleRow ? 'center' : 'left') : 'center',
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

                if (isHeaderRow) {
                    ws[cellAddress].s.fill = {
                        patternType: 'solid',
                        fgColor: { rgb: 'FFD9EAD3' }
                    };
                }
            }
        }

        XLSX.utils.book_append_sheet(wb, ws, 'Cumulative Report');

        const fileName = `Cumulative_Report_${(headerInfo.cla || 'Class').replace(/[\/\\?%*:|"<>]/g, '_')}_${(headerInfo.sec || '').replace(
            /[\/\\?%*:|"<>]/g,
            '_'
        )}_${(headerInfo.exmmid || 'Exam').replace(/[\/\\?%*:|"<>]/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;

        XLSX.writeFile(wb, fileName);
    };

    return (
        <div className={`screen-only ${fontSizeClass}`}>
            {/* Font Size Selector */}
            <div className='form-group no-print mb-4 flex items-center gap-3'>
                <span className='control-label font-medium'>Font Size :</span>
                <select className='form-control rounded border px-3 py-1 text-sm' value={size} onChange={(e) => setSize(e.target.value)}>
                    <option value=''>Select Font Size</option>
                    {[8, 9, 10, 11, 12, 14, 16, 18, 20].map((v) => (
                        <option key={v} value={v}>
                            {v}px
                        </option>
                    ))}
                </select>
            </div>

            {/* Header Bar - Print + Excel Buttons */}
            <div className='no-print flex items-center justify-between border-orange-400 border-b-2 bg-orange-100 px-4 py-2 text-sm'>
                <span style={{ fontSize: '25px', fontWeight: '600' }}>GRID VIEW</span>
                <div className='flex items-center gap-3'>
                    <Button onClick={onPrint} size='sm' className='bg-blue-600 hover:bg-blue-700'>
                        <Printer className='mr-2 h-4 w-4' /> Print
                    </Button>

                    <Button
                        onClick={exportToExcel}
                        size='sm'
                        variant='outline'
                        className='gap-2 border-green-600 text-green-700 hover:bg-green-50'>
                        <Download className='h-4 w-4' />
                        Export Excel
                    </Button>
                </div>
            </div>

            {/* Report Header */}
            <div className='mt-6'>
                <div className='mb-4 text-center'>
                    <h3 className='text-blue-900 text-xl'>{headerInfo.mI_Name || 'VIDYA VIKASA VIDYA SAMSTHE (R)'}</h3>
                    <h5 className='mt-1 text-blue-800 text-lg'>CLASS WISE CUMULATIVE REPORT</h5>
                    <div className='mt-2'>
                        <strong>Academic Year :</strong> {headerInfo.yr}
                    </div>
                    <div className='-ml-12 md:-ml-16'>
                        <strong>Class & Sec :</strong> {headerInfo.cla} - {headerInfo.sec}
                    </div>
                    <div className='ml-20 md:ml-24'>
                        <strong>Exam :</strong> {headerInfo.exmmid}
                    </div>
                </div>

                {/* Table */}
                <div className='overflow-x-auto border-2 border-blue-800'>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-blue-800 text-white'>
                                <th className='border border-blue-900 px-2 py-3'>Sl No</th>
                                <th className='border border-blue-900 px-4 py-3 text-left'>Student Name</th>
                                {columnFlags.rollno && <th className='border border-blue-900 px-3 py-3'>Roll No</th>}
                                {subjects
                                    .filter((s) => s.eyceS_AplResultFlg)
                                    .map((subj) => (
                                        <th key={subj.ismS_Id} className='border border-blue-900 px-3 py-3'>
                                            {subj.ismS_SubjectName}
                                        </th>
                                    ))}
                                <th className='border border-blue-900 px-3 py-3'>Total</th>
                                <th className='border border-blue-900 px-3 py-3'>Obtained</th>
                                <th className='border border-blue-900 px-3 py-3'>%</th>
                                <th className='border border-blue-900 px-3 py-3'>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((student, idx) => {
                                const isAbsent = student.estmP_Result === 'AB';

                                return (
                                    <tr key={idx} className='hover:bg-gray-50'>
                                        <td className='border border-gray-400 px-2 py-2 text-center'>{idx + 1}</td>
                                        <td className='border border-gray-400 px-4 py-2 text-left'>{student.amsT_FirstName}</td>

                                        {columnFlags.rollno && (
                                            <td className='border border-gray-400 px-3 py-2 text-center'>{student.amaY_RollNo ?? '-'}</td>
                                        )}

                                        {subjects
                                            .filter((s) => s.eyceS_AplResultFlg)
                                            .map((subj) => {
                                                const mark = student.sub_list?.find((m) => m.ismS_Id === subj.ismS_Id);

                                                if (!mark || mark.estmpS_PassFailFlg === 'AB') {
                                                    return (
                                                        <td
                                                            key={subj.ismS_Id}
                                                            className='border border-gray-400 py-2 text-center text-red-600'>
                                                            AB
                                                        </td>
                                                    );
                                                }

                                                const isEVS = subj.ismS_SubjectName?.toUpperCase().includes('EVS');
                                                if (isEVS && mark.estmpS_ObtainedMarks != null && mark.estmpS_ObtainedGrade) {
                                                    return (
                                                        <td key={subj.ismS_Id} className='border border-gray-400 py-2 text-center'>
                                                            <div className='flex items-center justify-center gap-5'>
                                                                <span>{mark.estmpS_ObtainedMarks}</span>
                                                                <span>{mark.estmpS_ObtainedGrade}</span>
                                                            </div>
                                                        </td>
                                                    );
                                                }

                                                return (
                                                    <td key={subj.ismS_Id} className='border border-gray-400 py-2 text-center'>
                                                        {mark.estmpS_ObtainedMarks != null
                                                            ? mark.estmpS_ObtainedMarks
                                                            : (mark.estmpS_ObtainedGrade ?? '-')}
                                                    </td>
                                                );
                                            })}

                                        <td className='border border-gray-400 py-2 text-center'>
                                            {isAbsent ? '' : (student.estmP_TotalMaxMarks ?? '-')}
                                        </td>
                                        <td className='border border-gray-400 py-2 text-center'>
                                            {isAbsent ? '' : (student.estmP_TotalObtMarks ?? '-')}
                                        </td>
                                        <td className='border border-gray-400 py-2 text-center'>
                                            {isAbsent
                                                ? '-'
                                                : student.estmP_Percentage
                                                    ? Number(student.estmP_Percentage).toFixed(1) + '%'
                                                    : '-'}
                                        </td>
                                        <td className='border border-gray-400 py-2 text-center'>
                                            {isAbsent ? '' : (student.estmP_TotalGrade ?? '-')}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Printer } from 'lucide-react';
import type { IReportResponse } from '@/types/staff-portal/cumulative-report';
import { cn } from '@/lib/utils';
import { exportToExcel } from '@/lib/export-to-file';

interface CumulativeReportGridProps {
    data: IReportResponse;
    searchParams: any; // Contains the display flags from filter
    institutionName?: string;
}

export default function CumulativeReportGrid({
    data,
    searchParams
}: CumulativeReportGridProps) {
    const { studentslt, studentslt1, masterinst, examsubjectwise_details, nonstudentslt, electivesub } = {
        studentslt: data.savelist || [],
        studentslt1: data.subjlist || [],
        masterinst: data.configuration || [],
        examsubjectwise_details: data.examsubjectwise_details || [],
        nonstudentslt: data.savenonsubjlist || [],
        electivesub: data.nonsubjlist || []
    };

    const config = masterinst[0] || {};
    const showAdmNo = config.exmConfig_AdmnoColumnDisplay;
    const showRegNo = config.exmConfig_RegnoColumnDisplay;
    const showRollNo = config.exmConfig_RollnoColumnDisplay;

    // Filter Params (passed from parent page state ideally, but accessible via whatever state management)
    // For now assuming these are passed via props or available in a context, but simpler to just pass from page
    // Using default true/false matching the filter defaults if not strictly passed
    const showGrade = searchParams?.displayGrade ?? true;
    const showMarks = searchParams?.displayMarks ?? true;
    const showPercentage = searchParams?.displayPercentage ?? false;
    const showOverallGrade = searchParams?.displayOverallGrade ?? false;
    const showClassRank = searchParams?.displayClassRank ?? false;
    const showSectionRank = searchParams?.displaySectionRank ?? true;
    const hideAttendance = searchParams?.notDisplayAttendance ?? false;
    const showApplicable = searchParams?.displayApplicable ?? true;
    const showNonApplicable = searchParams?.displayNonApplicable ?? false;


    const handleExportExcel = () => {
        const columns = [
            { label: 'Sl No', value: 'slno' },
            { label: 'Student Name', value: 'studentName' },
            ...(showAdmNo ? [{ label: 'Adm No', value: 'admNo' }] : []),
            ...(showRegNo ? [{ label: 'Reg No', value: 'regNo' }] : []),
            ...(showRollNo ? [{ label: 'Roll No', value: 'rollNo' }] : []),
            ...(showApplicable ? studentslt1.map(col => ({ label: `${col.ismS_SubjectName} ${showMarks && showGrade ? "(M|G)" : showMarks ? "(M)" : showGrade ? "(G)" : ""}`, value: `sub_${col.ismS_Id}` })) : []),
            { label: 'Total Obtained', value: 'totalObt' },
            { label: 'Total Max', value: 'totalMax' },
            ...(showPercentage ? [{ label: 'Percentage', value: 'percentage' }] : []),
            ...(showOverallGrade ? [{ label: 'Grade', value: 'grade' }] : []),
            ...(showSectionRank ? [{ label: 'Section Rank', value: 'sectionRank' }] : []),
            ...(showClassRank ? [{ label: 'Class Rank', value: 'classRank' }] : []),
            ...(!hideAttendance ? [{ label: 'Attendance', value: 'attendance' }] : []),
            ...(showNonApplicable ? electivesub.map(col => ({ label: `${col.ismS_SubjectName} (M|G)`, value: `ele_${col.ismS_Id}` })) : [])
        ];

        const content = studentslt.map((student, index) => {
            const row: any = {
                slno: index + 1,
                studentName: student.amsT_FirstName,
                admNo: student.amsT_AdmNo,
                regNo: student.amsT_RegistrationNo,
                rollNo: student.amaY_RollNo,
                totalObt: student.estmP_TotalObtMarks,
                totalMax: student.estmP_TotalMaxMarks,
                percentage: student.estmP_Percentage,
                grade: student.estmP_TotalGrade,
                sectionRank: student.estmP_SectionRank || '-',
                classRank: student.estmP_ClassRank || '-',
                attendance: `${student.classatt} / ${student.classheld}`
            };

            // Main Subjects
            if (showApplicable) {
                studentslt1.forEach(col => {
                    const sub = student.sub_list?.find((s: any) => s.ismS_Id === col.ismS_Id);
                    if (sub) {
                        if (sub.estmpS_PassFailFlg === 'AB') {
                            row[`sub_${col.ismS_Id}`] = 'AB';
                        } else {
                            const marks = sub.estmpS_ObtainedMarks !== 1000 ? sub.estmpS_ObtainedMarks : '';
                            const grade = sub.estmpS_ObtainedGrade;
                            if (showMarks && showGrade && marks && grade) {
                                row[`sub_${col.ismS_Id}`] = `${marks} | ${grade}`;
                            } else if (showMarks && marks) {
                                row[`sub_${col.ismS_Id}`] = marks;
                            } else if (showGrade && grade) {
                                row[`sub_${col.ismS_Id}`] = grade;
                            } else {
                                row[`sub_${col.ismS_Id}`] = '';
                            }
                        }
                    } else {
                        row[`sub_${col.ismS_Id}`] = '-';
                    }
                });
            }

            // Electives
            if (showNonApplicable) {
                electivesub.forEach(col => {
                    const nsStudent = nonstudentslt.find(s => s.amsT_Id === student.amsT_Id);
                    const sub = nsStudent?.sub_list_e?.find((s: any) => s.ismS_Id === col.ismS_Id);
                    if (sub) {
                        if (sub.estmpS_PassFailFlg === 'AB') {
                            row[`ele_${col.ismS_Id}`] = 'AB';
                        } else {
                            const marks = sub.estmpS_ObtainedMarks !== 1000 ? sub.estmpS_ObtainedMarks : '';
                            const grade = sub.estmpS_ObtainedGrade;
                            if (showMarks && showGrade && marks && grade) {
                                row[`ele_${col.ismS_Id}`] = `${marks} | ${grade}`;
                            } else if (showMarks && marks) {
                                row[`ele_${col.ismS_Id}`] = marks;
                            } else if (showGrade && grade) {
                                row[`ele_${col.ismS_Id}`] = grade;
                            } else {
                                row[`ele_${col.ismS_Id}`] = '';
                            }
                        }
                    } else {
                        row[`ele_${col.ismS_Id}`] = '-';
                    }
                });
            }

            return row;
        });

        exportToExcel('Cumulative Report', JSON.stringify(columns), JSON.stringify(content));
    };

    const handlePrint = () => {
        window.print();
    };

    // Helper to get formatted marks/grade
    const getSubjectDisplay = (student: any, subjectId: number) => {
        const sub = student.sub_list?.find((s: any) => s.ismS_Id === subjectId);
        if (!sub) return "-";

        // Check for AB (Absent)
        if (sub.estmpS_PassFailFlg === 'AB') return 'AB';

        let display = '';

        // Formatting Style
        const isFail = sub.estmpS_PassFailFlg === 'Fail';
        const style: React.CSSProperties = {};
        if (isFail) {
            if (config.exmConfig_FailBoldFlg) style.fontWeight = 'bold';
            if (config.exmConfig_FailItalicFlg) style.fontStyle = 'italic';
            if (config.exmConfig_FailUnderscoreFlg) style.textDecoration = 'underline';
            if (config.exmConfig_FailColorFlg) style.color = config.exmConfig_FailColorFlg;
        }

        const marks = sub.estmpS_ObtainedMarks !== 1000 ? sub.estmpS_ObtainedMarks : '';
        const grade = sub.estmpS_ObtainedGrade;

        // Subject specific flags
        if (showMarks && showGrade && marks && grade) {
            display = `${marks} | ${grade}`;
        } else if (showMarks && marks) {
            display = `${marks}`;
        } else if (showGrade && grade) {
            display = `${grade}`;
        } else {
            display = '';
        }

        return <span style={style}>{display}</span>;
    };

    const getElectiveDisplay = (student: any, subjectId: number) => {
        const sub = student.sub_list_e?.find((s: any) => s.ismS_Id === subjectId);
        if (!sub) return "-";

        if (sub.estmpS_PassFailFlg === 'AB') return 'AB';

        let display = '';
        const marks = sub.estmpS_ObtainedMarks !== 1000 ? sub.estmpS_ObtainedMarks : '';
        const grade = sub.estmpS_ObtainedGrade;

        if (showMarks && showGrade && marks && grade) {
            display = `${marks} | ${grade}`;
        } else if (showMarks && marks) {
            display = `${marks}`;
        } else if (showGrade && grade) {
            display = `${grade}`;
        }

        return <span>{display}</span>;

    };

    return (
        <Card className="mt-6 border-none shadow-none print:shadow-none">
            <CardHeader className="flex flex-row items-center justify-between print:hidden">
                <CardTitle>Report View</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportExcel}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Excel
                    </Button>
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-auto border rounded-lg">
                    <Table id="report-table" className="text-sm">
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[50px] text-center font-bold">Sl.No.</TableHead>
                                <TableHead className="min-w-[200px] font-bold sticky left-0 bg-muted/50 z-10">Student Name</TableHead>
                                {showAdmNo && <TableHead className="font-bold">Adm.No.</TableHead>}
                                {showRegNo && <TableHead className="font-bold">Reg.No.</TableHead>}
                                {showRollNo && <TableHead className="font-bold">Roll No.</TableHead>}

                                {showApplicable && studentslt1.map((col) => (
                                    <TableHead key={col.ismS_Id} className="text-center font-bold min-w-[100px]">
                                        {col.ismS_SubjectName} <br />
                                        <span className="text-[10px] font-normal">
                                            {showMarks && showGrade ? "(M|G)" : showMarks ? "(M)" : showGrade ? "(G)" : ""}
                                        </span>
                                    </TableHead>
                                ))}

                                <TableHead className="text-center font-bold">Total</TableHead>
                                {showPercentage && <TableHead className="text-center font-bold">Percentage</TableHead>}
                                {showOverallGrade && <TableHead className="text-center font-bold">Grade</TableHead>}
                                {showSectionRank && <TableHead className="text-center font-bold">Sec Rank</TableHead>}
                                {showClassRank && <TableHead className="text-center font-bold">Class Rank</TableHead>}
                                {!hideAttendance && <TableHead className="text-center font-bold">Attendance</TableHead>}

                                {showNonApplicable && electivesub.map(col => (
                                    <TableHead key={col.ismS_Id} className="text-center font-bold min-w-[100px]">
                                        {col.ismS_SubjectName} (M|G)
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentslt.map((student, index) => (
                                <TableRow key={student.amsT_Id} className="hover:bg-muted/10">
                                    <TableCell className="text-center">{index + 1}</TableCell>
                                    <TableCell className="sticky left-0 bg-background z-10 font-medium">
                                        {student.amsT_FirstName}
                                    </TableCell>
                                    {showAdmNo && <TableCell>{student.amsT_AdmNo}</TableCell>}
                                    {showRegNo && <TableCell>{student.amsT_RegistrationNo}</TableCell>}
                                    {showRollNo && <TableCell>{student.amaY_RollNo}</TableCell>}

                                    {showApplicable && studentslt1.map((col) => (
                                        <TableCell key={col.ismS_Id} className="text-center">
                                            {getSubjectDisplay(student, col.ismS_Id)}
                                        </TableCell>
                                    ))}

                                    <TableCell className="text-center font-bold">
                                        {student.estmP_TotalObtMarks} / {student.estmP_TotalMaxMarks}
                                    </TableCell>
                                    {showPercentage && <TableCell className="text-center">{student.estmP_Percentage}</TableCell>}
                                    {showOverallGrade && <TableCell className="text-center">{student.estmP_TotalGrade}</TableCell>}
                                    {showSectionRank && <TableCell className="text-center">{student.estmP_SectionRank || '-'}</TableCell>}
                                    {showClassRank && <TableCell className="text-center">{student.estmP_ClassRank || '-'}</TableCell>}
                                    {!hideAttendance && (
                                        <TableCell className="text-center">
                                            {student.classatt} / {student.classheld}
                                        </TableCell>
                                    )}

                                    {showNonApplicable && electivesub.map(col => (
                                        <TableCell key={col.ismS_Id} className="text-center">
                                            {/* Logic for elective marks which might come from a separate list or joined */}
                                            {/* Assuming nonstudentslt matches index or ID, normally joined in backend or processing */}
                                            {/* For minimal implementation, we check if student exists in non-subject list */}
                                            {(() => {
                                                // Find corresponding non-subject student record
                                                const nsStudent = nonstudentslt.find(s => s.amsT_Id === student.amsT_Id);
                                                return nsStudent ? getElectiveDisplay(nsStudent, col.ismS_Id) : '-';
                                            })()}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                            {studentslt.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={20} className="text-center py-8 text-muted-foreground">
                                        No marks data available for the selected criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

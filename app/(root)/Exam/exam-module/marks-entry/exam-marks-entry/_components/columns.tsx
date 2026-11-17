'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import type React from 'react';
import { useEffect, useState } from 'react';

/* ============================================
   Types
   ============================================ */
type SubSub = { subsubId: number; subsubName: string; maxMarks: number; minMarks?: number };
type SubExam = { subexamId: number; subexamName: string; maxMarks: number; minMarks?: number };

export type ISubjectMeta = {
    subjectId: number;
    subjectName: string;
    subsubFlag: boolean;
    subexamFlag: boolean;
    maxMarks: number;
    minMarks?: number;
    subsubData: SubSub[]; // for Option A: these will be the Sub 1/Sub 2/Sub 3 columns
    subexamData: SubExam[]; // kept for completeness (not used in Option A layout)
};

export type IStudentMarksRow = {
    studentID: number;
    studentName: string;
    RegNo: string;
    AdmissionNo: string;
    RollNo: number;
    // simple subject marks
    marks?: number | '' | string;
    // array of marks per sub-subject
    subSubMarks?: { subsubId: number; marks: number | '' | string }[];
    // array of marks per sub-exam (not used in Option A)
    subExamMarks?: { subexamId: number; marks: number | '' | string }[];
};

async function fetchSubjectAndStudentsMock(
    academicYearId: number | string,
    classId: number | string,
    sectionId: number | string,
    examId?: number | string,
    subjectId?: number | string
) {
    // small delay
    await new Promise((r) => setTimeout(r, 250));

    const sid = Number(subjectId ?? 1);

    // Option A scenario: subject with subsubFlag true (ACTIVITY/TEST grouping)
    if (sid === 12) {
        return {
            subjectData: {
                subjectId: 12,
                subjectName: 'FL KANNADA',
                subsubFlag: true,
                subexamFlag: false,
                maxMarks: 45, // subject total
                minMarks: 20,
                subsubData: [
                    { subsubId: 101, subsubName: 'Sub 1', maxMarks: 15, minMarks: 5 },
                    { subsubId: 102, subsubName: 'Sub 2', maxMarks: 10, minMarks: 5 },
                    { subsubId: 103, subsubName: 'Sub 3', maxMarks: 10, minMarks: 5 }
                ],
                subexamData: []
            },
            studentData: [
                {
                    studentID: 1,
                    studentName: 'STUDENT 1',
                    RegNo: 'REG/1000',
                    AdmissionNo: 'ADM/1000',
                    RollNo: 10,
                    subSubMarks: [
                        { subsubId: 101, marks: 20 }, // intentionally > maxSub to show validation
                        { subsubId: 102, marks: 6 },
                        { subsubId: 103, marks: 15 }
                    ]
                },
                {
                    studentID: 2,
                    studentName: 'STUDENT 2',
                    RegNo: 'REG/1001',
                    AdmissionNo: 'ADM/1001',
                    RollNo: 11,
                    subSubMarks: [
                        { subsubId: 101, marks: 20 },
                        { subsubId: 102, marks: 17 },
                        { subsubId: 103, marks: 15 }
                    ]
                },
                {
                    studentID: 3,
                    studentName: 'STUDENT 3',
                    RegNo: 'REG/1002',
                    AdmissionNo: 'ADM/1002',
                    RollNo: 12,
                    subSubMarks: [
                        { subsubId: 101, marks: 20 },
                        { subsubId: 102, marks: '' },
                        { subsubId: 103, marks: '' }
                    ]
                },
                // more rows to reach many entries visually
                ...Array.from({ length: 8 }, (_, i) => ({
                    studentID: 10 + i,
                    studentName: `STUDENT ${4 + i}`,
                    RegNo: `REG/${1003 + i}`,
                    AdmissionNo: `ADM/${1003 + i}`,
                    RollNo: 13 + i,
                    subSubMarks: [
                        { subsubId: 101, marks: '' },
                        { subsubId: 102, marks: '' },
                        { subsubId: 103, marks: '' }
                    ]
                }))
            ]
        };
    }

    // Option with subexamFlag (not used for Option A but included)
    if (sid === 44) {
        return {
            subjectData: {
                subjectId: 44,
                subjectName: 'MATHEMATICS',
                subsubFlag: false,
                subexamFlag: true,
                maxMarks: 80,
                minMarks: 30,
                subsubData: [],
                subexamData: [
                    { subexamId: 201, subexamName: 'ACTIVITY', maxMarks: 20, minMarks: 5 },
                    { subexamId: 202, subexamName: 'TEST', maxMarks: 60, minMarks: 20 }
                ]
            },
            studentData: [
                {
                    studentID: 200,
                    studentName: 'MATH STUDENT',
                    RegNo: 'REG/5001',
                    AdmissionNo: 'ADM/5001',
                    RollNo: 1,
                    subExamMarks: [
                        { subexamId: 201, marks: 15 },
                        { subexamId: 202, marks: 40 }
                    ]
                }
            ]
        };
    }

    // default simple subject (no sub flags)
    const students = Array.from({ length: 15 }, (_, i) => ({
        studentID: 300 + i,
        studentName: `Student ${i + 1}`,
        RegNo: `REG/${1000 + i}`,
        AdmissionNo: `ADM/${1000 + i}`,
        RollNo: 21 + i,
        marks: i === 2 ? 21 : ''
    }));

    return {
        subjectData: {
            subjectId: 1,
            subjectName: 'FL KANNADA (M-25)',
            subsubFlag: false,
            subexamFlag: false,
            maxMarks: 25,
            minMarks: 10,
            subsubData: [],
            subexamData: []
        },
        studentData: students
    };
}

/* ============================================
   MarksInputCell
   - numbers only
   - shows 11px red error text under input
   ============================================ */
function MarksInputCell({
    value,
    max,
    min,
    onChange,
    placeholder
}: {
    value: number | '' | string | undefined;
    max: number;
    min?: number;
    onChange: (v: number | '') => void;
    placeholder?: string;
}) {
    const [local, setLocal] = useState<string>(value === '' || value === undefined ? '' : String(value));
    const [error, setError] = useState<string>('');

    useEffect(() => {
        setLocal(value === '' || value === undefined ? '' : String(value));
        setError('');
    }, [value]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value;

        // allow empty
        if (raw.trim() === '') {
            setLocal('');
            setError('');
            onChange('');
            return;
        }

        // integers only
        if (!/^\d+$/.test(raw.trim())) {
            setLocal(raw);
            setError('Only numbers allowed');
            return;
        }

        const num = Number(raw.trim());

        if (min !== undefined && num < min) {
            setError(`Minimum ${min}`);
        } else if (num > max) {
            setError(`Maximum ${max}`);
        } else {
            setError('');
        }

        setLocal(String(num));
        onChange(num);
    }

    return (
        <div className='flex flex-col items-start'>
            <input
                className='w-[120px] rounded border border-gray-300 bg-white px-2 py-1 text-sm'
                placeholder={placeholder ?? 'Enter Marks...'}
                value={local}
                onChange={handleChange}
            />
            {error ? <div className='mt-[2px] text-[11px] text-red-600 leading-none'>{error}</div> : null}
        </div>
    );
}

/* ============================================
   buildMarksEntryColumns for Option A (collapsed headers)
   returns ColumnDef<IStudentMarksRow>[]
   ============================================ */
export function buildMarksEntryColumns(
    subjectMeta: ISubjectMeta | null,
    onUpdateSimpleMark: (studentID: number, newMark: number | '') => void,
    onUpdateSubSubMark: (studentID: number, subsubId: number, newMark: number | '') => void,
    onUpdateSubExamMark: (studentID: number, subexamId: number, newMark: number | '') => void
): ColumnDef<IStudentMarksRow>[] {
    const base: ColumnDef<IStudentMarksRow>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <div className='flex items-center justify-center'>
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                    />
                </div>
            ),
            cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} />,
            enableSorting: false,
            size: 36
        },
        {
            accessorKey: 'slNo',
            header: ({ column }) => <DataTableColumnHeader column={column} title='SL NO' />,
            cell: ({ row, table }) => {
                const page = table.getState().pagination.pageIndex;
                const size = table.getState().pagination.pageSize;
                return <span>{page * size + row.index + 1}</span>;
            },
            enableSorting: false
        },
        {
            accessorKey: 'studentName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
            cell: ({ row }) => <span className='font-semibold uppercase'>{row.original.studentName}</span>
        },
        {
            accessorKey: 'RegNo',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Reg No' />,
            cell: ({ row }) => <span>{row.original.RegNo}</span>
        },
        {
            accessorKey: 'AdmissionNo',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Admission No' />,
            cell: ({ row }) => <span>{row.original.AdmissionNo}</span>
        },
        {
            accessorKey: 'RollNo',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Roll No' />,
            cell: ({ row }) => <span>{row.original.RollNo}</span>
        }
    ];

    // If no meta -> placeholder
    if (!subjectMeta) {
        base.push({
            id: 'marksGroup',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Marks Entry' />,
            cell: ({ row }) => <span>--</span>,
            enableSorting: false
        });
        return base;
    }

    // If no flags -> simple single column with subject header
    if (!subjectMeta.subsubFlag && !subjectMeta.subexamFlag) {
        base.push({
            id: `subject_${subjectMeta.subjectId}`,
            header: () => (
                <div className='bg-blue-600 text-center text-white'>
                    <div className='px-2 py-1 font-semibold text-sm'>{subjectMeta.subjectName}</div>
                    <div className='px-2 pb-1 text-xs'>{`(M-${subjectMeta.maxMarks}) (ME-${subjectMeta.minMarks ?? 0})`}</div>
                </div>
            ),
            cell: ({ row }) => {
                const st = row.original;
                const cur = st.marks === '' || st.marks === undefined ? '' : (st.marks as number);
                return (
                    <div className='px-2'>
                        <MarksInputCell
                            value={cur}
                            max={subjectMeta.maxMarks}
                            min={subjectMeta.minMarks}
                            onChange={(v) => onUpdateSimpleMark(st.studentID, v)}
                        />
                    </div>
                );
            },
            enableSorting: false
        });
        return base;
    }

    // Option A: subsubFlag true -> create grouped header:
    // Top row: subject
    // Middle row: ACTIVITY / TEST (single label spanning children)
    // Bottom row: Sub 1 | Sub 2 | Sub 3 | TOTAL
    const subjectGroup: ColumnDef<IStudentMarksRow> = {
        id: `subject_group_${subjectMeta.subjectId}`,
        header: () => (
            <div className='bg-blue-600 text-center text-white'>
                <div className='px-2 py-1 font-semibold text-sm'>{`${subjectMeta.subjectName} (M-${subjectMeta.maxMarks})`}</div>
                <div className='px-2 pb-1 text-xs'>{`(ME-${subjectMeta.minMarks ?? 0})`}</div>
            </div>
        ),
        columns: []
    };

    const subSubGroup: ColumnDef<IStudentMarksRow> = {
        id: `subsub_group_${subjectMeta.subjectId}`,
        header: () => (
            <div className='bg-blue-600 text-center text-white'>
                <div className='px-2 py-1 font-semibold text-xs'>ACTIVITY / TEST</div>
            </div>
        ),
        columns: []
    };

    // push each sub-subject as a column (bottom row)
    for (const ss of subjectMeta.subsubData) {
        subSubGroup.columns!.push({
            id: `subsub_${ss.subsubId}`,
            header: () => (
                <div className='bg-blue-600 text-center text-white' style={{ borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                    <div className='px-2 py-1 font-semibold text-xs'>{ss.subsubName}</div>
                    <div className='px-2 text-[11px]'>{`(M-${ss.maxMarks}) (ME-${ss.minMarks ?? 0})`}</div>
                </div>
            ),
            cell: ({ row }) => {
                const st = row.original;
                const found = Array.isArray(st.subSubMarks)
                    ? st.subSubMarks.find((m) => Number(m.subsubId) === Number(ss.subsubId))
                    : undefined;
                const cur = found?.marks === '' || found?.marks === undefined ? '' : found?.marks;
                return (
                    <div className='px-2'>
                        <MarksInputCell
                            value={cur}
                            max={ss.maxMarks}
                            min={ss.minMarks}
                            onChange={(v) => onUpdateSubSubMark(st.studentID, ss.subsubId, v)}
                        />
                    </div>
                );
            },
            enableSorting: false
        });
    }

    // TOTAL bottom column for subsubject group (shows sum and error)
    subSubGroup.columns!.push({
        id: `subsub_total_${subjectMeta.subjectId}`,
        header: () => (
            <div className='bg-blue-600 text-center text-white'>
                <div className='px-2 py-1 font-semibold text-xs'>TOTAL</div>
                <div className='px-2 text-[11px]'>{`(M-${subjectMeta.maxMarks})`}</div>
            </div>
        ),
        cell: ({ row }) => {
            const st = row.original;
            const sum = (st.subSubMarks ?? []).reduce((acc, x) => acc + (x.marks === '' ? 0 : Number(x.marks)), 0);
            const over = sum > subjectMeta.maxMarks;
            return (
                <div className='flex flex-col items-start px-2'>
                    <div className={`px-2 py-1 text-sm ${over ? 'font-semibold text-red-600' : ''}`}>{sum}</div>
                    {over ? <div className='text-[11px] text-red-600'>Sum exceeds subject max</div> : null}
                </div>
            );
        },
        enableSorting: false
    });

    // Push the middle group into subject group
    subjectGroup.columns!.push(subSubGroup);

    // Note: subjectMeta.subexamFlag not used in Option A layout, but keep support if both flags present
    if (subjectMeta.subexamFlag && subjectMeta.subexamData.length > 0) {
        // create an adjacent exam group if required (kept minimal)
        const examGroup: ColumnDef<IStudentMarksRow> = {
            id: `exam_group_${subjectMeta.subjectId}`,
            header: () => (
                <div className='bg-blue-600 text-center text-white'>
                    <div className='px-2 py-1 font-semibold text-xs'>EXAM</div>
                </div>
            ),
            columns: subjectMeta.subexamData.map((se) => ({
                id: `subexam_${se.subexamId}`,
                header: () => (
                    <div className='bg-blue-600 text-center text-white'>
                        <div className='px-2 py-1 font-semibold text-xs'>{se.subexamName}</div>
                        <div className='px-2 text-[11px]'>{`(M-${se.maxMarks}) (ME-${se.minMarks ?? 0})`}</div>
                    </div>
                ),
                cell: ({ row }) => {
                    const st = row.original;
                    const found = Array.isArray(st.subExamMarks)
                        ? st.subExamMarks.find((m) => Number(m.subexamId) === Number(se.subexamId))
                        : undefined;
                    const cur = found?.marks === '' || found?.marks === undefined ? '' : found?.marks;
                    return (
                        <div className='px-2'>
                            <MarksInputCell
                                value={cur}
                                max={se.maxMarks}
                                min={se.minMarks}
                                onChange={(v) => onUpdateSubExamMark(st.studentID, se.subexamId, v)}
                            />
                        </div>
                    );
                },
                enableSorting: false
            }))
        };

        // add total for exam group
        (examGroup.columns as ColumnDef<IStudentMarksRow>[]).push({
            id: `subexam_total_${subjectMeta.subjectId}`,
            header: () => (
                <div className='bg-blue-600 text-center text-white'>
                    <div className='px-2 py-1 font-semibold text-xs'>EXAM TOTAL</div>
                    <div className='px-2 text-[11px]'>{`(M-${subjectMeta.maxMarks})`}</div>
                </div>
            ),
            cell: ({ row }) => {
                const st = row.original;
                const sum = (st.subExamMarks ?? []).reduce((acc, x) => acc + (x.marks === '' ? 0 : Number(x.marks)), 0);
                const over = sum > subjectMeta.maxMarks;
                return (
                    <div className='flex flex-col items-start px-2'>
                        <div className={`px-2 py-1 text-sm ${over ? 'font-semibold text-red-600' : ''}`}>{sum}</div>
                        {over ? <div className='text-[11px] text-red-600'>Sum exceeds subject max</div> : null}
                    </div>
                );
            },
            enableSorting: false
        });

        subjectGroup.columns!.push(examGroup);
    }

    base.push(subjectGroup);
    return base;
}

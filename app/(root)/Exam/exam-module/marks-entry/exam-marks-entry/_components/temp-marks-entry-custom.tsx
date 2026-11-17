'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React, { useEffect, useMemo, useState, useRef, forwardRef } from 'react';

/* -------------------------
   Table Cells
   ------------------------- */
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children?: React.ReactNode;
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(({ className, children, ...props }, ref) => {
    // Case-1: if child is a checkbox input element
    const isCheckbox =
        (React.isValidElement(children) && (children.type as any)?.displayName === 'Checkbox') ||
        (children as any)?.props?.type === 'checkbox';

    return (
        <td
            ref={ref}
            className={cn(
                'whitespace-nowrap p-2 align-middle text-[#0C0A09] text-[14px]',
                isCheckbox && 'pr-0', // adjust spacing only when checkbox
                className
            )}
            {...props}>
            {isCheckbox ? (
                <Checkbox {...(children as any).props} /> // <-- replace checkbox with custom component
            ) : (
                children
            )}
        </td>
    );
});
TableCell.displayName = 'TableCell';

const TableHeaderCell = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            'whitespace-nowrap bg-[hsl(277_90%_52%)] p-2 text-center align-middle text-white [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
            className
        )}
        {...props}
    />
));
TableHeaderCell.displayName = 'TableHeaderCell';

/* -------------------------
   Types
   ------------------------- */
type SubSub = { subsubId: number; subsubName: string; maxMarks: number; minMarks?: number };
type SubExam = { subexamId: number; subexamName: string; maxMarks: number; minMarks?: number };

export type ISubjectMeta = {
    subjectId: number;
    subjectName: string;
    subsubFlag: boolean;
    subexamFlag: boolean;
    maxMarks: number;
    minMarks?: number;
    subsubData: SubSub[];
    subexamData: SubExam[];
};

export type IStudentMarksRow = {
    studentID: number;
    studentName: string;
    RegNo: string;
    AdmissionNo: string;
    RollNo: number;
    marks?: number | '' | string;
    subSubMarks?: { subsubId: number; marks: number | '' | string }[];
    subExamMarks?: { subexamId: number; marks: number | '' | string }[];
};

/* -------------------------
   MarksInputCell with ref + arrow navigation
   ------------------------- */
export const MarksInputCell = forwardRef<
    HTMLInputElement,
    {
        value: number | '' | string | undefined;
        max: number;
        onChange: (v: number | '') => void;
        placeholder?: string;
        sizeClass?: string;
        onArrow?: (direction: 'left' | 'right' | 'up' | 'down') => void;
    }
>(({ value, max, onChange, placeholder, sizeClass = 'w-[110px]', onArrow }, ref) => {
    const [local, setLocal] = useState<string>(value === '' || value === undefined ? '' : String(value));
    const [error, setError] = useState<string>('');

    useEffect(() => {
        setLocal(value === '' || value === undefined ? '' : String(value));
        setError('');
    }, [value]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value.trim();
        if (raw === '') {
            setLocal('');
            setError('');
            onChange('');
            return;
        }
        if (!/^\d+$/.test(raw)) {
            setLocal(raw);
            setError('Only numbers allowed');
            return;
        }

        const num = Number(raw);
        if (num > max) {
            setError(`Maximum ${max}`);
            setLocal(raw);
        } else {
            setError('');
            setLocal(raw);
            onChange(num);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!onArrow) return;
        switch (e.key) {
            case 'ArrowRight':
                onArrow('right');
                e.preventDefault();
                break;
            case 'ArrowLeft':
                onArrow('left');
                e.preventDefault();
                break;
            case 'ArrowDown':
                onArrow('down');
                e.preventDefault();
                break;
            case 'ArrowUp':
                onArrow('up');
                e.preventDefault();
                break;
        }
    }

    return (
        <div className='flex flex-col items-start'>
            <Input
                ref={ref}
                className={`rounded border border-gray-300 bg-white px-2 py-1 text-sm ${sizeClass}`}
                placeholder={placeholder ?? 'Enter Marks...'}
                value={local}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            {error && <div className='mt-[2px] text-[11px] text-red-600 leading-none'>{error}</div>}
        </div>
    );
});
MarksInputCell.displayName = 'MarksInputCell';

/* -------------------------
   Main Table
   ------------------------- */
export default function MarksCustomTable({
    subjectMeta,
    students,
    onUpdateSimpleMark,
    onUpdateSubSubMark,
    onUpdateSubExamMark,
    onSave
}: {
    subjectMeta: ISubjectMeta | null;
    students: IStudentMarksRow[];
    onUpdateSimpleMark: (studentID: number, newMark: number | '') => void;
    onUpdateSubSubMark: (studentID: number, subsubId: number, newMark: number | '') => void;
    onUpdateSubExamMark: (studentID: number, subexamId: number, newMark: number | '') => void;
    onSave?: (payload: { subjectId: number | null; studentData: IStudentMarksRow[] }) => void;
}) {
    const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});
    const allSelected = useMemo(() => {
        if (students.length === 0) return false;
        return students.every((s) => selectedIds[s.studentID] === true);
    }, [students, selectedIds]);

    // reset selection on student change
    useEffect(() => setSelectedIds({}), [students]);

    function toggleSelectAll(v: boolean) {
        const next: Record<number, boolean> = {};
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        if (v) students.forEach((s) => (next[s.studentID] = true));
        setSelectedIds(next);
    }

    function toggleSelectOne(id: number, v?: boolean) {
        setSelectedIds((prev) => ({ ...prev, [id]: v === undefined ? !prev[id] : v }));
    }

    /* -------------------------
       Sum computation
       ------------------------- */
    function computeSubSubSum(row: IStudentMarksRow) {
        return (row.subSubMarks ?? []).reduce((acc, x) => acc + (x.marks === '' ? 0 : Number(x.marks)), 0);
    }

    function computeSubExamSum(row: IStudentMarksRow) {
        return (row.subExamMarks ?? []).reduce((acc, x) => acc + (x.marks === '' ? 0 : Number(x.marks)), 0);
    }

    function handleSaveClick() {
        if (onSave) onSave({ subjectId: subjectMeta?.subjectId ?? null, studentData: students });
    }

    /* -------------------------
       Input refs for arrow navigation
       ------------------------- */
    const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

    function handleArrowNavigation(rowIndex: number, colIndex: number, dir: 'left' | 'right' | 'up' | 'down') {
        // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
        let nextR = rowIndex,
            nextC = colIndex;

        if (!inputRefs.current[rowIndex]) return;

        if (dir === 'right') nextC = Math.min(inputRefs.current[rowIndex].length - 1, colIndex + 1);
        if (dir === 'left') nextC = Math.max(0, colIndex - 1);
        if (dir === 'down') nextR = Math.min(inputRefs.current.length - 1, rowIndex + 1);
        if (dir === 'up') nextR = Math.max(0, rowIndex - 1);

        inputRefs.current[nextR][nextC]?.focus();
    }

    /* -------------------------
       Render Table
       ------------------------- */
    return (
        <div className='overflow-x-auto rounded border bg-white shadow-sm'>
            <table className='min-w-full table-fixed border-collapse border border-gray-300 [&_td]:border [&_td]:border-gray-300 [&_th]:border'>
                <thead>
                    <tr>
                        <TableHeaderCell rowSpan={3}>
                            <div className='flex items-center justify-center gap-2'>
                                <input
                                    type='checkbox'
                                    checked={allSelected}
                                    onChange={(e) => toggleSelectAll(e.target.checked)}
                                    className='rounded accent-white'
                                />
                            </div>
                        </TableHeaderCell>
                        <TableHeaderCell rowSpan={3}>SL NO</TableHeaderCell>
                        <TableHeaderCell rowSpan={3} className='text-left'>
                            Student Name
                        </TableHeaderCell>
                        <TableHeaderCell rowSpan={3}>Reg No</TableHeaderCell>
                        <TableHeaderCell rowSpan={3}>Admission No</TableHeaderCell>
                        <TableHeaderCell rowSpan={3}>Roll No</TableHeaderCell>
                        {subjectMeta ? (
                            <TableHeaderCell
                                colSpan={
                                    subjectMeta.subsubFlag
                                        ? subjectMeta.subsubData.length + 1
                                        : subjectMeta.subexamFlag
                                          ? subjectMeta.subexamData.length + 1
                                          : 1
                                }>
                                <div className='font-semibold'>{`${subjectMeta.subjectName} (M-${subjectMeta.maxMarks})`}</div>
                                <div className='text-[12px]'>{`(ME-${subjectMeta.minMarks ?? 0})`}</div>
                            </TableHeaderCell>
                        ) : (
                            <TableHeaderCell rowSpan={3}>Marks Entry</TableHeaderCell>
                        )}
                    </tr>

                    <tr>
                        {subjectMeta ? (
                            subjectMeta.subsubFlag ? (
                                <>
                                    {subjectMeta.subsubData.map((ss) => (
                                        <TableHeaderCell key={ss.subsubId}>
                                            <div className='font-semibold text-sm'>{ss.subsubName}</div>
                                            <div className='text-[11px]'>{`(M-${ss.maxMarks}) (ME-${ss.minMarks ?? 0})`}</div>
                                        </TableHeaderCell>
                                    ))}
                                    <TableHeaderCell>
                                        <div className='font-semibold text-sm'>TOTAL</div>
                                        <div className='text-[11px]'>{`(M-${subjectMeta.maxMarks})`}</div>
                                    </TableHeaderCell>
                                </>
                            ) : subjectMeta.subexamFlag ? (
                                <>
                                    {subjectMeta.subexamData.map((se) => (
                                        <TableHeaderCell key={se.subexamId}>
                                            <div className='font-semibold text-sm'>{se.subexamName}</div>
                                            <div className='text-[11px]'>{`(M-${se.maxMarks}) (ME-${se.minMarks ?? 0})`}</div>
                                        </TableHeaderCell>
                                    ))}
                                    <TableHeaderCell>
                                        <div className='font-semibold text-sm'>EXAM TOTAL</div>
                                        <div className='text-[11px]'>{`(M-${subjectMeta.maxMarks})`}</div>
                                    </TableHeaderCell>
                                </>
                            ) : (
                                <TableHeaderCell>
                                    <div className='font-semibold text-sm'>{subjectMeta.subjectName}</div>
                                    <div className='text-[11px]'>{`(M-${subjectMeta.maxMarks}) (ME-${subjectMeta.minMarks ?? 0})`}</div>
                                </TableHeaderCell>
                            )
                        ) : (
                            <TableHeaderCell>--</TableHeaderCell>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {students.length === 0 ? (
                        <tr>
                            <TableCell colSpan={10} className='py-8 text-center text-gray-500 text-sm'>
                                No Records Found
                            </TableCell>
                        </tr>
                    ) : (
                        students.map((st, rowIndex) => {
                            const subsum = computeSubSubSum(st);
                            const examsum = computeSubExamSum(st);
                            const subOver = subjectMeta?.subsubFlag ? subsum > (subjectMeta.maxMarks ?? 0) : false;
                            const examOver = subjectMeta?.subexamFlag ? examsum > (subjectMeta.maxMarks ?? 0) : false;

                            return (
                                <tr key={st.studentID} className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <TableCell className='text-center'>
                                        <input
                                            type='checkbox'
                                            checked={!!selectedIds[st.studentID]}
                                            onChange={(e) => toggleSelectOne(st.studentID, e.target.checked)}
                                        />
                                    </TableCell>
                                    <TableCell className='text-center'>{rowIndex + 1}</TableCell>
                                    <TableCell className='font-center'>{st.studentName}</TableCell>
                                    <TableCell className='text-center'>{st.RegNo}</TableCell>
                                    <TableCell className='text-center'>{st.AdmissionNo}</TableCell>
                                    <TableCell className='text-center'>{st.RollNo}</TableCell>

                                    {subjectMeta ? (
                                        subjectMeta.subsubFlag ? (
                                            <>
                                                {subjectMeta.subsubData.map((ss, colIndex) => {
                                                    const found = st.subSubMarks?.find((m) => Number(m.subsubId) === Number(ss.subsubId));
                                                    const cur = found?.marks ?? '';
                                                    return (
                                                        <TableCell key={ss.subsubId} className='text-center'>
                                                            <div className='flex justify-center'>
                                                                <MarksInputCell
                                                                    value={cur}
                                                                    max={ss.maxMarks}
                                                                    onChange={(v) => onUpdateSubSubMark(st.studentID, ss.subsubId, v)}
                                                                    sizeClass='w-[120px]'
                                                                    onArrow={(dir) => handleArrowNavigation(rowIndex, colIndex, dir)}
                                                                    ref={(el) => {
                                                                        if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                                                                        inputRefs.current[rowIndex][colIndex] = el;
                                                                    }}
                                                                />
                                                            </div>
                                                        </TableCell>
                                                    );
                                                })}
                                                <TableCell className='align-top'>
                                                    <div className='flex flex-col items-start'>
                                                        <div className={`px-3 py-1 text-sm ${subOver ? 'font-semibold text-red-600' : ''}`}>
                                                            {subsum}
                                                        </div>
                                                        {subOver && <div className='text-[11px] text-red-600'>Sum exceeds subject max</div>}
                                                    </div>
                                                </TableCell>
                                            </>
                                        ) : subjectMeta.subexamFlag ? (
                                            <>
                                                {subjectMeta.subexamData.map((se, colIndex) => {
                                                    const found = st.subExamMarks?.find(
                                                        (m) => Number(m.subexamId) === Number(se.subexamId)
                                                    );
                                                    const cur = found?.marks ?? '';
                                                    return (
                                                        <TableCell key={se.subexamId} className='text-center'>
                                                            <MarksInputCell
                                                                value={cur}
                                                                max={se.maxMarks}
                                                                onChange={(v) => onUpdateSubExamMark(st.studentID, se.subexamId, v)}
                                                                sizeClass='w-[120px]'
                                                                onArrow={(dir) => handleArrowNavigation(rowIndex, colIndex, dir)}
                                                                ref={(el) => {
                                                                    if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                                                                    inputRefs.current[rowIndex][colIndex] = el;
                                                                }}
                                                            />
                                                        </TableCell>
                                                    );
                                                })}
                                                <TableCell className='align-top'>
                                                    <div className='flex flex-col items-start'>
                                                        <div
                                                            className={`px-3 py-1 text-sm ${examOver ? 'font-semibold text-red-600' : ''}`}>
                                                            {examsum}
                                                        </div>
                                                        {examOver && (
                                                            <div className='text-[11px] text-red-600'>Sum exceeds subject max</div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <TableCell className='text-center'>
                                                <div className='flex justify-center'>
                                                    <MarksInputCell
                                                        value={st.marks ?? ''}
                                                        max={subjectMeta.maxMarks}
                                                        onChange={(v) => onUpdateSimpleMark(st.studentID, v)}
                                                        sizeClass='w-[120px]'
                                                        onArrow={(dir) => handleArrowNavigation(rowIndex, 0, dir)}
                                                        ref={(el) => {
                                                            if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                                                            inputRefs.current[rowIndex][0] = el;
                                                        }}
                                                    />
                                                </div>
                                            </TableCell>
                                        )
                                    ) : (
                                        <TableCell>--</TableCell>
                                    )}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

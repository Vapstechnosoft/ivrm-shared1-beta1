// app/exam/student-transaction/_components/columns.tsx
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import type { IStudentTransaction } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';

interface StudentTransactionColumnsProps {
    onScoreChange: (studentId: number, score: string) => void;
    onCheckboxChange: (studentId: number, isChecked: boolean) => void;
    onToggleAll: () => void;
    hideSaveButton: boolean;
    isSelectAll: boolean;
    selectedStudentIds: number[];
}

export const StudentTransactionColumns = ({
    onScoreChange,
    onCheckboxChange,
    onToggleAll,
    hideSaveButton,
    isSelectAll,
    selectedStudentIds
}: StudentTransactionColumnsProps): ColumnDef<IStudentTransaction>[] => [
    {
        id: 'select',
        header: () => (
            <div className='flex justify-center'>
                <Checkbox checked={isSelectAll} onCheckedChange={onToggleAll} aria-label='Select all' disabled={hideSaveButton} />
            </div>
        ),
        cell: ({ row }) => {
            const student = row.original;
            const isChecked = selectedStudentIds.includes(student.amsT_Id);

            return (
                <div className='flex justify-center'>
                    <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                            onCheckboxChange(student.amsT_Id, !!checked);
                        }}
                        aria-label='Select row'
                        disabled={hideSaveButton}
                    />
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
        size: 50
    },
    {
        accessorKey: 'slNo',
        header: () => <div className='text-center'>SL.NO.</div>,
        cell: ({ row }) => <div className='text-center'>{row.index + 1}</div>,
        size: 70
    },
    {
        accessorKey: 'studentName',
        header: 'Student Name',
        cell: ({ row }) => <div className='text-left'>{row.original.studentName}</div>,
        size: 200
    },
    {
        accessorKey: 'regNumber',
        header: 'Reg.No.',
        cell: ({ row }) => <div className='text-left'>{row.original.regNumber}</div>,
        size: 120
    },
    {
        accessorKey: 'rollNumber',
        header: () => <div className='text-center'>Roll No.</div>,
        cell: ({ row }) => <div className='text-center'>{row.original.rollNumber}</div>,
        size: 100
    },
    {
        accessorKey: 'score',
        header: () => <div className='text-center'>Score</div>,
        cell: ({ row }) => {
            const student = row.original;
            const isChecked = selectedStudentIds.includes(student.amsT_Id);

            return (
                <div className='mx-auto w-32'>
                    <Input
                        type='text'
                        value={student.ecsactT_Score || ''}
                        onChange={(e) => onScoreChange(student.amsT_Id, e.target.value)}
                        disabled={!isChecked || hideSaveButton}
                        placeholder='Enter score'
                        className='w-full text-center'
                    />
                </div>
            );
        },
        size: 120
    }
];

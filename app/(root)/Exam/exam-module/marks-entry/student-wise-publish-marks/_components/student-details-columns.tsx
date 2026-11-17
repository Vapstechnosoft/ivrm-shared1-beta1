// app/exam/exam-module/student-marks-publish/_components/table-columns.tsx
'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import type { ColumnDef } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';
import type { IStudentDetails } from '@/types/exam/exam-module/marks-entry';

export const StudentMarksPublishColumns: ColumnDef<IStudentDetails>[] = [
    // SL No
    {
        id: 'slNo',

        header: ({ column }) => (
            <div className="flex justify-center w-full">
                <DataTableColumnHeader column={column} title="Sl. No" />
            </div>
        ),
        cell: ({ row, table }) => {
            const { pageIndex, pageSize } = table.getState().pagination;
            return (
                <div className="flex justify-center w-full">
                    {pageIndex * pageSize + row.index + 1}
                </div>
            );
        },
        enableSorting: false,
        size: 40,
        minSize: 40,
        maxSize: 50,
    },

    // Selection Checkbox
    {
        id: 'select',
        header: ({ table }) => (
            <div className="flex justify-center items-center w-full">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex justify-center items-center w-full">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: true,
        size: 60,
        minSize: 60,
        maxSize: 70,
    },

    // Student Name
    {
        accessorKey: 'amsT_FirstName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Student Name" />
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue('amsT_FirstName')}</div>,
        enableSorting: false,
    },

    // Admission No
    {
        accessorKey: 'amsT_AdmNo',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Adm No" />
        ),
        cell: ({ row }) => <div>{row.getValue('amsT_AdmNo')}</div>,
        enableSorting: false,
    },

    // Roll No
    {
        accessorKey: 'amaY_Rollno',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Roll No" />
        ),
        cell: ({ row }) => <div >{row.getValue('amaY_Rollno')}</div>,
        enableSorting: false,
    },

    // Marks Details
    {
        id: 'marks',
        header: 'Marks',
        cell: ({ row }) => {
            const student = row.original;
            return (
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span className="font-medium">Obtained Marks:</span>
                        <span>{student.obtainedmarks}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Max Marks:</span>
                        <span>{student.totalmaxmarks}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Percentage:</span>
                        <span>{student.percentage}%</span>
                    </div>
                </div>
            );
        },
        enableSorting: false,
        size: 150,
    },

    // Publish Status
    {
        accessorKey: 'estmP_PublishToStudentFlg',
        header: ({ column }) => (
            <div className="flex justify-center w-full">
                <DataTableColumnHeader column={column} title="Publish Status" />
            </div>
        ),
        cell: ({ row }) => {
            const published = row.getValue('estmP_PublishToStudentFlg');
            return (
                <div className="flex justify-center">
                    {published ? (
                        <Check className="h-5 w-5 text-green-600" />
                    ) : (
                        <X className="h-5 w-5 text-red-600" />
                    )}
                </div>
            );
        },
        enableSorting: false,
    },
];
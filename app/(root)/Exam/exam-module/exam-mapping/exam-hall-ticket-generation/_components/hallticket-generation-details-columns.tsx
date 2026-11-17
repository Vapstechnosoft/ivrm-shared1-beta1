'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';
import { IHallTicketStudentItem } from '@/types/exam/exam-module/exam-mapping';
import { Checkbox } from '@/components/ui/checkbox';

export const HallTicketGeneratedDetailsPageColumns: ColumnDef<IHallTicketStudentItem>[] = [
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
        size: 40,              // 🔥 decrease width for Sl.No
        minSize: 40,
        maxSize: 50,
    },

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
        size: 60,             // 🔥 increase width for checkbox
        minSize: 60,
        maxSize: 70,
    }
    ,

    // Student Name
    {
        accessorKey: 'amsT_FirstName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Student Name" />
        ),
        cell: ({ row }) => <div>{row.getValue('amsT_FirstName')}</div>,
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
        cell: ({ row }) => <div>{row.getValue('amaY_Rollno')}</div>,
        enableSorting: false,
    },

    // Hall Ticket No
    {
        accessorKey: 'ehT_HallTicketNo',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Hall Ticket No" />
        ),
        cell: ({ row }) => <div>{row.getValue('ehT_HallTicketNo')}</div>,
        enableSorting: false,
    },

    {
        accessorKey: 'ehT_PublishFlg',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Publish Status" />
        ),
        cell: ({ row }) => {
            const published = row.getValue('ehT_PublishFlg');

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

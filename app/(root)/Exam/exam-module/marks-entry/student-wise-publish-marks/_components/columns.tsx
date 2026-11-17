'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { IHallTicketGeneratedItem } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useCallback } from 'react';
import { ActionButtons } from '@/components/ui/form/action-buttons';

export const HallTicketGeneratedColumns: ColumnDef<IHallTicketGeneratedItem>[] = [
    // SL No
    {
        id: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false
    },

    // Academic Year
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>
    },

    // Class
    {
        accessorKey: 'asmcL_ClassName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_ClassName')}</div>
    },

    // Section
    {
        accessorKey: 'asmC_SectionName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Section' />,
        cell: ({ row }) => <div>{row.getValue('asmC_SectionName')}</div>
    },

    // Exam
    {
        accessorKey: 'emE_ExamName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Exam' />,
        cell: ({ row }) => <div>{row.getValue('emE_ExamName')}</div>
    },

    {
        id: 'studentList',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student List' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IHallTicketGeneratedItem }) {
    const { openDetailsView } = useFormContext<IHallTicketGeneratedItem>();
    const handleView = useCallback(() => openDetailsView(rowData), [openDetailsView, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            <button type='button' onClick={handleView} className='rounded-md p-2 transition hover:bg-muted' title='View Mapping Details'>
                <Eye className='h-4 w-4 text-blue-600' />
            </button>
            <ActionButtons rowData={rowData} buttons={{ edit: false, delete: false, toggle: false }} />
        </div>
    );
}

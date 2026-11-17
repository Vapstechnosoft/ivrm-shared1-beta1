'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';

export interface TCCancelDetail {
    slNo: number;
    studentDetails: string; // Name : AdmNo
    tcNo: string;
    tcDate: string;
    reason: string;
    deletedDate: string;
}

export const tcCancelDetailsColumns: ColumnDef<TCCancelDetail>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No.' className='w-[60px] text-center' />,
        cell: ({ row }) => <div className='text-center'>{row.getValue('slNo')}</div>
    },
    {
        accessorKey: 'studentDetails',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Details' />,
        cell: ({ row }) => <div className='font-bold'>{row.getValue('studentDetails')}</div>
    },
    {
        accessorKey: 'tcNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='TC.No.' />,
        cell: ({ row }) => <div>{row.getValue('tcNo')}</div>
    },
    {
        accessorKey: 'tcDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='TC Date' />,
        cell: ({ row }) => <div>{row.getValue('tcDate')}</div>
    },
    {
        accessorKey: 'reason',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Reason For Deletion' />,
        cell: ({ row }) => <div>{row.getValue('reason')}</div>
    },
    {
        accessorKey: 'deletedDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Deleted Date' />,
        cell: ({ row }) => <div>{row.getValue('deletedDate')}</div>
    }
];

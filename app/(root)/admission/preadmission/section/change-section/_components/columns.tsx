'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';

export interface Student {
    student_id: number;
    roll_no: number;
    student_name: string;
    class_name: string;
    section_name: string;
    admission_no: string;
}

export const masterChangeSectionColumns: ColumnDef<Student>[] = [
    {
        accessorKey: 'student_id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='w-full pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'student_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,

        cell: ({ row }) => <div className='font-medium'>{row.getValue('student_name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'class_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class Name' />,
        cell: ({ row }) => <div>{row.getValue('class_name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'section_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Section Name' />,
        cell: ({ row }) => <div>{row.getValue('section_name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'admission_no',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Adm. No' />,
        cell: ({ row }) => <div>{row.getValue('admission_no')}</div>,
        enableSorting: true,
        enableHiding: true
    }
];

'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IMasterSubjectGroupDetails } from '@/types/exam/exam-module/masters';
import type { ColumnDef } from '@tanstack/react-table';

export const MasterSubjectGroupDetailsColumns: ColumnDef<IMasterSubjectGroupDetails>[] = [
    {
        accessorKey: 'ex_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='max-w-20' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: true,
        size: 20, // <-- Set fixed width
        minSize: 50,
        maxSize: 50
    },
    {
        id: 'select',
        header: ({ table }) => (
            <div className='flex w-8 justify-center'>
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label='Select all'
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className='flex w-8 justify-center'>
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 35,
        minSize: 35,
        maxSize: 35
    },

    {
        accessorKey: 'ismS_SubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Name' />,
        cell: ({ row }) => <div>{row.getValue('ismS_SubjectName')}</div>,
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'ismS_SubjectCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Code' />,
        cell: ({ row }) => <div>{row.getValue('ismS_SubjectCode')}</div>,
        enableSorting: false,
        enableHiding: true
    }
];

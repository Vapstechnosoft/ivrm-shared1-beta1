'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import type { IAttendanceEntryTypeList } from '@/types/admission/preadmission/attendance_entry';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';
import { useEditContext } from '../entry-type-context';

export const entryTypeColumns: ColumnDef<IAttendanceEntryTypeList>[] = [
    {
        accessorKey: 'asaeT_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.NO' className='w-full pl-6' />,
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
        accessorKey: 'mI_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Institute Name' />,
        cell: ({ row }) => <div>{row.getValue('mI_Name') || '(-)'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmcL_ClassName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class Name' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_ClassName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asaeT_Att_Type',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Attendance Entry Type' />,
        cell: ({ row }) => <div>{row.getValue('asaeT_Att_Type')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Action' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IAttendanceEntryTypeList }) {
    const { setEditingRecord } = useEditContext();

    const handleEdit = useCallback(
        (data: IAttendanceEntryTypeList) => {
            setEditingRecord(data);
            // Scroll to top to show form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        [setEditingRecord]
    );

    return <ActionButtons rowData={rowData} buttons={{ edit: true, toggle: false, delete: false }} onEdit={handleEdit} />;
}

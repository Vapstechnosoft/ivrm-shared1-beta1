'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterAcademicYearMasterList } from '@/types/admission/preadmission/configaration';
import { format } from 'date-fns';

const formatDate = (date: unknown): string => {
    if (typeof date !== 'string') return 'N/A';
    if (!date) return 'N/A';
    return format(new Date(date), 'dd-MM-yyyy');
};
import { getStatusBadge } from '@/components/extras/helpers/helper';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const masterAcademicYearColumns: ColumnDef<IMasterAcademicYearMasterList>[] = [
    {
        accessorKey: 'asmaY_Id',
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
        accessorKey: 'institution_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Institute Name' />,
        cell: ({ row }) => <div>{row.getValue('institution_name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmaY_From_Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From Date' />,
        cell: ({ row }) => {
            const date = row.getValue('asmaY_From_Date');
            return <div>{formatDate(date)}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmaY_To_Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To Date' />,
        cell: ({ row }) => {
            const date = row.getValue('asmaY_To_Date');
            return <div>{formatDate(date)}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmaY_Cut_Of_Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='CutOff Date' />,
        cell: ({ row }) => {
            const date = row.getValue('asmaY_Cut_Of_Date');
            return <div>{formatDate(date)}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmaY_Order',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Year order' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Order')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmaY_Pre_ActiveFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Pre-Admission Flag' className='text-nowrap' />,
        cell: ({ row }) => (
            <div className='text-center'>{getStatusBadge((row.getValue('asmaY_Pre_ActiveFlag') as number) === 1 ? 'yes' : 'no')}</div>
        ),
        enableSorting: false,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({
    rowData
}: {
    rowData: IMasterAcademicYearMasterList;
}) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterAcademicYearMasterList>();

    const handleEdit = useCallback(
        (data: IMasterAcademicYearMasterList) => {
            openEditForm(data);
        },
        [openEditForm]
    );
    const handleToggle = useCallback(
        (data: IMasterAcademicYearMasterList) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            toggleConditionKey='is_Active'
        />
    );
}

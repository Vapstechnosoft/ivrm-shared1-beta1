'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterCourseList } from '@/types/hrms/hrms-config/master';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const columns: ColumnDef<IMasterCourseList>[] = [
    {
        id: 'slNo',
        header: () => <div className='text-center font-medium'>Sl No</div>,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='text-center'>{continuousIndex}</div>;
        },
        enableSorting: false,
        size: 60
    },
    {
        accessorKey: 'hrmC_QulaificationName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Qualification Name' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmC_QualificationDesc',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Description' className='whitespace-nowrap' />
    },
    {
        accessorKey: 'hrmC_Order',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Order' className='whitespace-nowrap' />,
        cell: ({ row }) => {
            const orderValue = row.original.hrmC_Order;
            return <div>{orderValue ?? '-'}</div>;
        }
    },
    {
        accessorKey: 'hrmC_DefaultQualFag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Default' className='whitespace-nowrap' />,
        cell: ({ row }) => (row.original.hrmC_DefaultQualFag ? 'Yes' : 'No')
    },
    {
        accessorKey: 'hrmC_SpecialisationFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Has Specialization' className='whitespace-nowrap' />,
        cell: ({ row }) => (row.original.hrmC_SpecialisationFlag ? 'Yes' : 'No')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='whitespace-nowrap text-start' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterCourseList }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterCourseList>();

    const handleEdit = useCallback(
        (data: IMasterCourseList) => {
            openEditForm(data as any);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterCourseList) => {
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
            toggleConditionKey='hrmC_ActiveFlag'
        />
    );
}

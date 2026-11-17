'use client';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterSchoolTopic } from '@/types/lesson-planner/master/school-topic';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';
import { useCallback } from 'react';

export const MasterSchoolTopicColumns: ColumnDef<IMasterSchoolTopic>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'asmcL_ClassName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_ClassName')}</div>
    },
    {
        accessorKey: 'ismS_SubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Name' />,
        cell: ({ row }) => <div>{row.getValue('ismS_SubjectName')}</div>
    },
    {
        accessorKey: 'lpmU_UnitName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Unit Name' />,
        cell: ({ row }) => <div>{row.getValue('lpmU_UnitName')}</div>
    },
    {
        accessorKey: 'lpmmT_TopicName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Topic Name' />,
        cell: ({ row }) => <div>{row.getValue('lpmmT_TopicName')}</div>
    },
    {
        accessorKey: 'lpmmT_TopicDescription',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Topic Description' />,
        cell: ({ row }) => <div>{row.getValue('lpmmT_TopicDescription')}</div>
    },
    {
        accessorKey: 'lpmmT_TotalPeriods',
        header: ({ column }) => <DataTableColumnHeader column={column} title='No of Periods' />,
        cell: ({ row }) => <div>{row.getValue('lpmmT_TotalPeriods') || '-'}</div>
    },
    {
        accessorKey: 'lpmmT_TotalHrs',
        header: ({ column }) => <DataTableColumnHeader column={column} title='No of Hours' />,
        cell: ({ row }) => <div>{row.getValue('lpmmT_TotalHrs') || '-'}</div>
    },
    {
        accessorKey: 'lpmmT_Order',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Order' />,
        cell: ({ row }) => <div>{row.getValue('lpmmT_Order') || '-'}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterSchoolTopic }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterSchoolTopic>();

    const handleEdit = useCallback(
        (data: IMasterSchoolTopic) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterSchoolTopic) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <div className='flex items-center justify-center gap-2'>
            <Button variant='ghost' size='icon' onClick={() => handleEdit(rowData)} title='Edit'>
                <Pencil className='h-4 w-4 text-primary' />
            </Button>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: false, toggle: true, delete: false }}
                onToggle={handleToggle}
                toggleConditionKey='lpmmT_ActiveFlag'
            />
        </div>
    );
}

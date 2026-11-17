'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterSubjectGroup } from '@/types/exam/exam-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

export const MasterSubjectGroupColumns: ColumnDef<IMasterSubjectGroup>[] = [
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
        accessorKey: 'emG_GroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Name' />,
        cell: ({ row }) => <div>{row.getValue('emG_GroupName')}</div>
    },
    {
        accessorKey: 'emG_TotSubjects',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Subjects' />,
        cell: ({ row }) => <div>{row.getValue('emG_TotSubjects')}</div>
    },
    {
        accessorKey: 'emG_MinAplSubjects',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Min Applicable Subjects' />,
        cell: ({ row }) => <div>{row.getValue('emG_MinAplSubjects')}</div>
    },
    {
        accessorKey: 'emG_MaxAplSubjects',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Max Applicable Subjects' />,
        cell: ({ row }) => <div>{row.getValue('emG_MaxAplSubjects')}</div>
    },
    {
        accessorKey: 'emG_BestOff',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Best Of Subjects' />,
        cell: ({ row }) => <div>{row.getValue('emG_BestOff')}</div>
    },
    {
        accessorKey: 'emG_ElectiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Elective Subjects' />,
        cell: ({ row }) => getStatusBadge(row.getValue('emG_ElectiveFlg') ? 'yes' : 'no')
    },
    {
        accessorKey: 'emG_ActiveFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Active Status' />,
        cell: ({ row }) => <div>{row.getValue('emG_ActiveFlag') ? 'Active' : 'Inactive'}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterSubjectGroup }) {
    const { openToggleForm, openEditForm, openDetailsView } = useFormContext<IMasterSubjectGroup>();

    const handleView = useCallback(() => {
        openDetailsView(rowData);
    }, [openDetailsView, rowData]);

    const handleEdit = useCallback(() => {
        openEditForm(rowData);
    }, [openEditForm, rowData]);

    const handleToggle = useCallback(() => {
        openToggleForm(rowData);
    }, [openToggleForm, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            {/* 👁️ Eye icon for viewing group details */}
            <button type='button' onClick={handleView} className='rounded-md p-2 transition hover:bg-muted' title='View Group Details'>
                <Eye className='h-4 w-4 text-blue-600' />
            </button>

            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, toggle: true, delete: false }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                toggleConditionKey='emG_ActiveFlag'
            />
        </div>
    );
}

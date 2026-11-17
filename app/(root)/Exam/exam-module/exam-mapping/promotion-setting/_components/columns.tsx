'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IPromotionSetting } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

export const PromotionSettingColumns: ColumnDef<IPromotionSetting>[] = [
    {
        accessorKey: 'slno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
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
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />
    },

    // Category
    {
        accessorKey: 'emcA_CategoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />
    },

    // Grade Name
    {
        accessorKey: 'emgR_GradeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Grade Name' />
    },

    // Promotion Type
    {
        accessorKey: 'emP_MarksPerFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Promotion Type' />,
        cell: ({ row }) => getStatusBadge((row.getValue('emP_MarksPerFlg') as string) === 'M' ? 'Marks' : 'Percentage')
    },

    // Pass To Individual
    {
        accessorKey: 'emP_PassToIndSubjectFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Pass To Individual' />,
        cell: ({ row }) => getStatusBadge((row.getValue('emP_PassToIndSubjectFlg') as boolean) === true ? 'yes' : 'no')
    },

    // Pass To Overall
    {
        accessorKey: 'emP_PassToOverallFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Pass To Overall' />,
        cell: ({ row }) => getStatusBadge((row.getValue('emP_PassToOverallFlag') as boolean) === true ? 'yes' : 'no')
    },

    // Best Applicable
    {
        accessorKey: 'best_applicable',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Best Applicable' />,
        cell: ({ row }) => getStatusBadge((row.getValue('best_applicable') as boolean) === true ? 'yes' : 'no')
    },

    // Best Off
    {
        accessorKey: 'best_off',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Best Off' />
    },

    // SUBJECT ORDER (Eye)
    {
        accessorKey: 'subject_order',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Order' />,
        cell: ({ row }) => {
            const { openOrderDetails } = useFormContext<IPromotionSetting>();
            const rowData = row.original;

            const handleOpenOrder = () => openOrderDetails(rowData);

            return (
                <button
                    type='button'
                    onClick={handleOpenOrder}
                    className='rounded-md p-2 transition hover:bg-muted'
                    title='View Subject Order'>
                    <Eye className='h-4 w-4 text-blue-600' />
                </button>
            );
        }
    },

    // ACTIONS (eye, edit, toggle)
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

// -------------------------
// ACTION BUTTONS CELL
// -------------------------
function ActionButtonsCell({ rowData }: { rowData: IPromotionSetting }) {
    const { openEditForm, openToggleForm, openDetailsView } = useFormContext<IPromotionSetting>();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);
    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);
    const handleView = useCallback(() => openDetailsView(rowData), [openDetailsView, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            <button type='button' onClick={handleView} className='rounded-md p-2 transition hover:bg-muted' title='View Details'>
                <Eye className='h-4 w-4 text-blue-600' />
            </button>

            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, delete: false, toggle: true }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                toggleConditionKey='emP_ActiveFlag' // or another boolean status
            />
        </div>
    );
}

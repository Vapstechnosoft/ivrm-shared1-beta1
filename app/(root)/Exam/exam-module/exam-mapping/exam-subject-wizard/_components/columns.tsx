'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IExamSubjectWizard } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

// -------------------------
// TABLE COLUMNS
// -------------------------
export const ExamSubjectWizardColumns: ColumnDef<IExamSubjectWizard>[] = [
    {
        accessorKey: 'slno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableHiding: true,
        enableSorting: false
    },

    { accessorKey: 'asmaY_Year', header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' /> },
    { accessorKey: 'emcA_CategoryName', header: ({ column }) => <DataTableColumnHeader column={column} title='Category' /> },
    { accessorKey: 'emE_ExamName', header: ({ column }) => <DataTableColumnHeader column={column} title='Exam Name' /> },
    { accessorKey: 'emE_ExamCode', header: ({ column }) => <DataTableColumnHeader column={column} title='Exam Code' /> },
    { accessorKey: 'emgR_GradeName', header: ({ column }) => <DataTableColumnHeader column={column} title='Grade' /> },
    {
        accessorKey: 'eycE_BestOfApplicableFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Best Off Applicable' />,
        cell: ({ row }) => getStatusBadge((row.getValue('eycE_BestOfApplicableFlg') as boolean) === true ? 'yes' : 'no')
    },
    { accessorKey: 'eycE_BestOf', header: ({ column }) => <DataTableColumnHeader column={column} title='Best Off' /> },
    {
        accessorKey: 'eycE_AttendanceFromDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Attendance From' />,
        cell: ({ row }) => <div>{row.getValue('eycE_AttendanceFromDate') || '-'}</div>
    },

    {
        accessorKey: 'eycE_AttendanceToDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Attendance To' />,
        cell: ({ row }) => <div>{row.getValue('eycE_AttendanceToDate') || '-'}</div>
    },

    {
        accessorKey: 'eycE_SubExamFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sub Exam Applicable' />,
        cell: ({ row }) => getStatusBadge((row.getValue('eycE_SubExamFlg') as boolean) === true ? 'yes' : 'no')
    },

    {
        accessorKey: 'eycE_SubSubjectFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sub Subject Applicable' />,
        cell: ({ row }) => getStatusBadge((row.getValue('eycE_SubSubjectFlg') as boolean) === true ? 'yes' : 'no')
    },

    {
        accessorKey: 'eycE_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Active Status' />,
        cell: ({ row }) => (row.getValue('eycE_ActiveFlg') ? 'Active' : 'Inactive')
    },
    {
        accessorKey: 'subject_order',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Order' />,
        cell: ({ row }) => {
            const { openOrderDetails } = useFormContext<IExamSubjectWizard>();
            const rowData = row.original; // full data of the clicked row

            const handleOpenOrderMenu = () => {
                openOrderDetails(rowData); // 👈 pass rowData to modal handler
            };

            return (
                <button
                    type='button'
                    onClick={handleOpenOrderMenu}
                    className='rounded-md p-2 transition hover:bg-muted'
                    title='Set Subject Order'>
                    <Eye className='h-4 w-4 text-blue-600' />
                </button>
            );
        }
    },

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
function ActionButtonsCell({ rowData }: { rowData: IExamSubjectWizard }) {
    const { openEditForm, openDeleteForm, openToggleForm, openDetailsView } = useFormContext<IExamSubjectWizard>();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);
    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);
    const handleView = useCallback(() => openDetailsView(rowData), [openDetailsView, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            <button type='button' onClick={handleView} className='rounded-md p-2 transition hover:bg-muted' title='View Wizard Details'>
                <Eye className='h-4 w-4 text-blue-600' />
            </button>

            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, delete: false, toggle: true }}
                onEdit={handleEdit}
                onToggle={handleToggle}
                toggleConditionKey='eycE_ActiveFlg'
            />
        </div>
    );
}

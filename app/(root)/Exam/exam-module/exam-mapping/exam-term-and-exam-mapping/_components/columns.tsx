'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IExamTermAndExamMapping } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

// -------------------------
// TABLE COLUMNS
// -------------------------
export const ExamTermAndExamMappingColumns: ColumnDef<IExamTermAndExamMapping>[] = [
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

    // Academic Year
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>
    },

    // Category
    {
        accessorKey: 'emcA_CategoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
        cell: ({ row }) => <div>{row.getValue('emcA_CategoryName')}</div>
    },

    // Term Name
    {
        accessorKey: 'ecT_TermName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Term Name' />,
        cell: ({ row }) => <div>{row.getValue('ecT_TermName')}</div>
    },

    // Term Start Date
    {
        accessorKey: 'ecT_TermStartDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Start Date' />,
        cell: ({ row }) => {
            const value = row.getValue('ecT_TermStartDate') as string | undefined;
            return <div>{value?.split('T')[0] || '-'}</div>;
        }
    },

    // Term End Date
    {
        accessorKey: 'ecT_TermEndDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='End Date' />,
        cell: ({ row }) => {
            const value = row.getValue('ecT_TermEndDate') as string | undefined;
            return <div>{value?.split('T')[0] || '-'}</div>;
        }
    },

    // Total Marks
    {
        accessorKey: 'ecT_Marks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Total Marks' />,
        cell: ({ row }) => <div>{row.getValue('ecT_Marks')}</div>
    },

    // Actions (Edit + Delete)
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
function ActionButtonsCell({ rowData }: { rowData: IExamTermAndExamMapping }) {
    const { openEditForm, openDeleteForm, openToggleForm, openDetailsView } = useFormContext<IExamTermAndExamMapping>();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);
    const handleDelete = useCallback(() => openDeleteForm(rowData), [openDeleteForm, rowData]);
    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);
    const handleView = useCallback(() => openDetailsView(rowData), [openDetailsView, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            {/*  View button */}
            <button type='button' onClick={handleView} className='rounded-md p-2 transition hover:bg-muted' title='View Mapping Details'>
                <Eye className='h-4 w-4 text-blue-600' />
            </button>

            {/*  Edit,  Toggle,  Delete buttons */}
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, delete: false, toggle: true }}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
                toggleConditionKey='ecT_ActiveFlag'
            />
        </div>
    );
}

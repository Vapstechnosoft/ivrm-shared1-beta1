'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IYearlyCategoryDatesMapping } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const YearlyCategoryDatesMappingColumns: ColumnDef<IYearlyCategoryDatesMapping>[] = [
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
    {
        accessorKey: 'eyC_ExamStartDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Start Date' />,
        cell: ({ row }) => {
            const value = row.getValue('eyC_ExamStartDate') as string | undefined;
            return <div>{value?.split('T')[0]}</div>;
        }
    },

    // End Date
    {
        accessorKey: 'eyC_ExamEndDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='End Date' />,
        cell: ({ row }) => {
            const value = row.getValue('eyC_ExamEndDate') as string | undefined;
            return <div>{value?.split('T')[0]}</div>;
        }
    },

    // Marks Entry Last Date
    {
        accessorKey: 'eyC_MarksEntryLastDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Marks Entry Last Date' />,
        cell: ({ row }) => {
            const value = row.getValue('eyC_MarksEntryLastDate') as string | undefined;
            return <div>{value?.split('T')[0]}</div>;
        }
    },

    // Marks Process Last Date
    {
        accessorKey: 'eyC_MarksProcessLastDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Marks Process Last Date' />,
        cell: ({ row }) => {
            const value = row.getValue('eyC_MarksProcessLastDate') as string | undefined;
            return <div>{value?.split('T')[0]}</div>;
        }
    },

    // Marks Publish Date
    {
        accessorKey: 'eyC_MarksPublishDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Marks Publish Date' />,
        cell: ({ row }) => {
            const value = row.getValue('eyC_MarksPublishDate') as string | undefined;
            return <div>{value?.split('T')[0]}</div>;
        }
    },
    // Actions - Only Edit
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IYearlyCategoryDatesMapping }) {
    const { openEditForm } = useFormContext<IYearlyCategoryDatesMapping>();
    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, delete: false, toggle: false }}
                onEdit={handleEdit}
                onDelete={() => {}}
            />
        </div>
    );
}

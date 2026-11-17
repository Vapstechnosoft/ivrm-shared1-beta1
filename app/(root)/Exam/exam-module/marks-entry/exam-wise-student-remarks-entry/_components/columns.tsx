'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IExamWiseRemarksGrid } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const ExamWiseStudentRemarksColumns: ColumnDef<IExamWiseRemarksGrid>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableSorting: false
    },
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>
    },

    // -----------------------------------------
    // Class
    // -----------------------------------------
    {
        accessorKey: 'asmcL_ClassName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_ClassName')}</div>
    },

    // -----------------------------------------
    // Section
    // -----------------------------------------
    {
        accessorKey: 'asmS_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Section' />,
        cell: ({ row }) => <div>{row.original.asmC_SectionName}</div> // coming from API object
    },

    // -----------------------------------------
    // Exam
    // -----------------------------------------
    {
        accessorKey: 'emE_ExamName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Exam' />,
        cell: ({ row }) => <div>{row.getValue('emE_ExamName')}</div>
    },

    // -----------------------------------------
    // ACTIONS (Only EDIT)
    // -----------------------------------------
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

// ------------------------------------------------------
// ACTION BUTTONS CELL (ONLY EDIT BUTTON)
// ------------------------------------------------------
function ActionButtonsCell({ rowData }: { rowData: IExamWiseRemarksGrid }) {
    const { openEditForm } = useFormContext<IExamWiseRemarksGrid>();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            {/*  Edit,  Toggle,  Delete buttons */}
            <ActionButtons rowData={rowData} buttons={{ edit: true, delete: false, toggle: false }} onEdit={handleEdit} />
        </div>
    );
}

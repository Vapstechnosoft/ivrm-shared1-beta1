'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IPromotionalGroupMappedExamDetails } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const PromotionalGroupMappedExamColumns: ColumnDef<IPromotionalGroupMappedExamDetails>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader title='SLNO' column={column} />,
        cell: ({ row }) => row.index + 1,
        enableSorting: false
    },
    {
        accessorKey: 'emE_ExamName',
        header: ({ column }) => <DataTableColumnHeader title='Exam Name' column={column} />,
        enableSorting: false
    },
    {
        accessorKey: 'emE_ExamCode',
        header: ({ column }) => <DataTableColumnHeader title='Exam Code' column={column} />,
        enableSorting: false
    },
    {
        accessorKey: 'empsgE_ForMaxMarkrs',
        header: ({ column }) => <DataTableColumnHeader title='Marks / Percentage' column={column} />,
        enableSorting: false
    },
    {
        accessorKey: 'conversionRequired',
        header: ({ column }) => <DataTableColumnHeader title='Conversion Req Or Not' column={column} />,
        cell: ({ row }) => getStatusBadge(row.original.empsgE_ConvertionReqOrNot ? 'yes' : 'no'),
        enableSorting: false
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Action' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ToggleActionCell rowData={row.original} />
    }
];

/* -------------------------
   TOGGLE ACTION CELL
------------------------- */
function ToggleActionCell({
    rowData
}: {
    rowData: IPromotionalGroupMappedExamDetails;
}) {
    const { openToggleForm } = useFormContext<IPromotionalGroupMappedExamDetails>();

    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);

    return (
        <div className='flex justify-center'>
            <ActionButtons rowData={rowData} buttons={{ toggle: true }} onToggle={handleToggle} toggleConditionKey='empsgE_ActiveFlg' />
        </div>
    );
}

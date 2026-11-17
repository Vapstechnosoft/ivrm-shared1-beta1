'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IExamTermAndExamMappingDetails } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const ExamTermAndExamMappingDetailsColumns: ColumnDef<IExamTermAndExamMappingDetails>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'emE_ExamName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Exam Name' />,
        cell: ({ row }) => <div>{row.getValue('emE_ExamName')}</div>,
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'ecteX_MarksPerFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Marks / Percentage' />,
        cell: ({ row }) => <div>{row.getValue('ecteX_MarksPerFlag')}</div>,
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'ecteX_MarksPercentValue',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Marks / Percentage Value' />,
        cell: ({ row }) => <div>{row.getValue('ecteX_MarksPercentValue')}</div>,
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'ecteX_RoundOffReqFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Round Off Required' />,
        cell: ({ row }) => <div>{row.getValue('ecteX_RoundOffReqFlg') ? 'Yes' : 'No'}</div>,
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'ecteX_ConversionReqFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Conversion Required' />,
        cell: ({ row }) => <div>{row.getValue('ecteX_ConversionReqFlg') ? 'Yes' : 'No'}</div>
    },
    {
        accessorKey: 'ecteX_NotApplToTotalFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Not Applicable To Total' />,
        cell: ({ row }) => <div>{row.getValue('ecteX_NotApplToTotalFlg') ? 'Yes' : 'No'}</div>,
        enableSorting: false,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Action' className='text-center' />,
        accessorFn: (row) => row,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false,
        enableHiding: true
    }
];

function ActionButtonsCell({ rowData }: { rowData: IExamTermAndExamMappingDetails }) {
    const { openToggleForm } = useFormContext<IExamTermAndExamMappingDetails>();
    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);

    return (
        <div className='flex justify-center'>
            <ActionButtons rowData={rowData} buttons={{ toggle: true }} onToggle={handleToggle} toggleConditionKey='ecteX_ActiveFlag' />
        </div>
    );
}

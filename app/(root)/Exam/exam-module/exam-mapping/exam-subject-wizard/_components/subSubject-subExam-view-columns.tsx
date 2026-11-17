'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ISubSubjectSubExamMapped } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

// -----------------------
// MAIN COLUMNS
// -----------------------
export const SubSubjectModelColumns = (showSubExam: boolean, showSubSubject: boolean): ColumnDef<ISubSubjectSubExamMapped>[] => {
    return [
        {
            accessorKey: 'slNo',
            header: ({ column }) => <DataTableColumnHeader column={column} title='SL No' />,
            cell: ({ row }) => <div>{row.index + 1}</div>,
            enableSorting: false,
            enableHiding: true,
            size: 24
        },

        ...(showSubSubject
            ? [
                  {
                      accessorKey: 'emsS_SubSubjectName',
                      header: ({ column }) => <DataTableColumnHeader column={column} title='Sub-Subject Name' />,
                      cell: ({ row }) => <div>{row.getValue('emsS_SubSubjectName')}</div>,
                      enableSorting: false,
                      enableHiding: true
                  } satisfies ColumnDef<ISubSubjectSubExamMapped>
              ]
            : []),

        ...(showSubExam
            ? [
                  {
                      accessorKey: 'emsE_SubExamName',
                      header: ({ column }) => <DataTableColumnHeader column={column} title='Sub-Exam Name' />,
                      cell: ({ row }) => <div>{row.getValue('emsE_SubExamName')}</div>,
                      enableSorting: false,
                      enableHiding: true
                  } satisfies ColumnDef<ISubSubjectSubExamMapped>
              ]
            : []),
        {
            accessorKey: 'emgR_GradeName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Grade Name' />,
            cell: ({ row }) => <div>{row.getValue('emgR_GradeName')}</div>,
            enableSorting: false,
            enableHiding: true
        },

        {
            accessorKey: 'eycessS_MaxMarks',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Max. Marks' />,
            cell: ({ row }) => <div>{row.getValue('eycessS_MaxMarks')}</div>,
            enableSorting: false,
            enableHiding: true
        },

        {
            accessorKey: 'eycessS_MinMarks',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Min. Marks' />,
            cell: ({ row }) => <div>{row.getValue('eycessS_MinMarks')}</div>,
            enableSorting: false,
            enableHiding: true
        },

        {
            accessorKey: 'eycessS_MarksEntryMax',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Marks Entry Max' />,
            cell: ({ row }) => <div>{row.getValue('eycessS_MarksEntryMax')}</div>,
            enableSorting: false,
            enableHiding: true
        },

        {
            accessorKey: 'eycessS_ExemptedFlg',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Exemption' />,
            cell: ({ row }) => getStatusBadge((row.getValue('eycessS_ExemptedFlg') as boolean) ? 'yes' : 'no'),
            enableSorting: false,
            enableHiding: true
        },

        {
            accessorKey: 'eycessS_ExemptedPer',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Exemption (%)' />,
            cell: ({ row }) => <div>{row.getValue('eycessS_ExemptedPer')}</div>,
            enableSorting: false,
            enableHiding: true
        },

        {
            accessorKey: 'eycessS_MarksFlg',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Marks Display' />,
            cell: ({ row }) => getStatusBadge((row.getValue('eycessS_MarksFlg') as boolean) ? 'yes' : 'no'),
            enableSorting: false,
            enableHiding: true
        },

        {
            accessorKey: 'eycessS_GradesFlg',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Grade Display' />,
            cell: ({ row }) => getStatusBadge((row.getValue('eycessS_GradesFlg') as boolean) ? 'yes' : 'no'),
            enableSorting: false,
            enableHiding: true
        },

        {
            accessorKey: 'eycessS_AplResultFlg',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Apl. Result' />,
            cell: ({ row }) => getStatusBadge((row.getValue('eycessS_AplResultFlg') as boolean) ? 'yes' : 'no'),
            enableSorting: false,
            enableHiding: true
        },

        {
            accessorKey: 'eycessS_SubSubjectOrder',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Order' />,
            cell: ({ row }) => <div>{row.getValue('eycessS_SubSubjectOrder')}</div>,
            enableSorting: false,
            enableHiding: true
        },

        // ACTION COLUMN
        {
            id: 'actions',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Action' className='text-center' />,
            accessorFn: (row) => row,
            enableSorting: false,
            cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
        }
    ];
};

// -----------------------
// ACTION CELL
// -----------------------
function ActionButtonsCell({ rowData }: { rowData: ISubSubjectSubExamMapped }) {
    const { openToggleForm } = useFormContext<ISubSubjectSubExamMapped>();

    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);

    return (
        <div className='flex justify-center'>
            <ActionButtons rowData={rowData} buttons={{ toggle: true }} onToggle={handleToggle} toggleConditionKey='eycessS_ActiveFlg' />
        </div>
    );
}

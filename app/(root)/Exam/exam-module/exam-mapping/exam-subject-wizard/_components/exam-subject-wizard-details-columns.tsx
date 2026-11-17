'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IExamSubjectWizardDetails } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

// -------------------------
// TABLE COLUMNS
// -------------------------
export const ExamSubjectWizardDetailsColumns: ColumnDef<IExamSubjectWizardDetails>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL No' />,
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: true,
        size: 24
    },

    {
        accessorKey: 'ismS_SubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Name' />,
        cell: ({ row }) => <div>{row.getValue('ismS_SubjectName')}</div>,
        enableHiding: true,
        enableSorting: false
    },

    {
        accessorKey: 'emgR_GradeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Grade Name' />,
        cell: ({ row }) => <div>{row.getValue('emgR_GradeName')}</div>,
        enableHiding: true,
        enableSorting: false
    },

    {
        accessorKey: 'eyceS_MaxMarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Max. Marks' />,
        cell: ({ row }) => <div>{row.getValue('eyceS_MaxMarks')}</div>,
        enableHiding: true,
        enableSorting: false
    },

    {
        accessorKey: 'eyceS_MinMarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Min. Marks' />,
        cell: ({ row }) => <div>{row.getValue('eyceS_MinMarks')}</div>,
        enableHiding: true,
        enableSorting: false
    },

    {
        accessorKey: 'eyceS_MarksEntryMax',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Entry Max. Marks' />,
        cell: ({ row }) => <div>{row.getValue('eyceS_MarksEntryMax')}</div>,
        enableHiding: true,
        enableSorting: false
    },

    {
        accessorKey: 'eyceS_SubExamFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sub-Exams' />,
        cell: ({ row }) => getStatusBadge(row.getValue('eyceS_SubExamFlg') === true ? 'yes' : 'no'),
        enableHiding: true,
        enableSorting: false
    },

    {
        accessorKey: 'eyceS_SubSubjectFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sub-Subjects' />,
        cell: ({ row }) => getStatusBadge((row.getValue('eyceS_SubSubjectFlg') as boolean) === true ? 'yes' : 'no'),
        enableHiding: true,
        enableSorting: false
    },

    {
        accessorKey: 'eyceS_MarksGradeEntryFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Marks/Grade' />,
        cell: ({ row }) => <div>{row.getValue('eyceS_MarksGradeEntryFlg')}</div>,
        enableHiding: true,
        enableSorting: false
    },

    {
        accessorKey: 'eyceS_MarksDisplayFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Marks Display' />,
        cell: ({ row }) => getStatusBadge((row.getValue('eyceS_MarksDisplayFlg') as boolean) === true ? 'yes' : 'no'),
        enableHiding: true,
        enableSorting: false
    },

    {
        accessorKey: 'eyceS_GradeDisplayFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Grade Display' />,
        cell: ({ row }) => getStatusBadge((row.getValue('eyceS_GradeDisplayFlg') as boolean) === true ? 'yes' : 'no'),
        enableHiding: true,
        enableSorting: false
    },

    {
        accessorKey: 'eyceS_AplResultFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Apl. Result' />,
        cell: ({ row }) => getStatusBadge((row.getValue('eyceS_AplResultFlg') as boolean) === true ? 'yes' : 'no'),
        enableHiding: true,
        enableSorting: false
    },

    {
        accessorKey: 'eyceS_SubjectOrder',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subjects Order' />,
        cell: ({ row }) => <div>{row.getValue('eyceS_SubjectOrder')}</div>,
        enableHiding: true,
        enableSorting: false
    },

    {
        id: 'mapping',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Mapping' />,
        cell: ({ row }) => <MappingCell rowData={row.original} />,
        enableHiding: true,
        enableSorting: false
    },

    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Action' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

// -------------------------
// MAPPING CELL
// -------------------------
function MappingCell({ rowData }: { rowData: IExamSubjectWizardDetails }) {
    const showEye = rowData.eyceS_SubExamFlg || rowData.eyceS_SubSubjectFlg;
    const { openMappedview } = useFormContext<IExamSubjectWizardDetails>();
    const handleOpenView = useCallback(() => openMappedview(rowData), [openMappedview, rowData]);
    if (!showEye) return <div>-</div>;

    return (
        <button onClick={handleOpenView} type='button' className='rounded-md p-2 transition hover:bg-muted' title='View Mapping Details'>
            <Eye className='h-4 w-4 text-blue-600' />
        </button>
    );
}

// -------------------------
// ACTION BUTTONS CELL
// -------------------------
function ActionButtonsCell({ rowData }: { rowData: IExamSubjectWizardDetails }) {
    const { openToggleForm } = useFormContext<IExamSubjectWizardDetails>();
    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);

    return (
        <div className='flex justify-center'>
            <ActionButtons rowData={rowData} buttons={{ toggle: true }} onToggle={handleToggle} toggleConditionKey='eyceS_ActiveFlg' />
        </div>
    );
}

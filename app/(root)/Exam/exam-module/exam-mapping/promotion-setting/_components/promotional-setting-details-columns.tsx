'use client';

import { getStatusBadge } from '@/components/extras/helpers/helper';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IPromotionalSubjectDetails } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

export const PromotionalSettingDetailsColumns: ColumnDef<IPromotionalSubjectDetails>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader title='SLNO' column={column} />,
        cell: ({ row }) => row.index + 1,
        enableSorting: false
    },
    {
        accessorKey: 'ismS_SubjectName',
        header: ({ column }) => <DataTableColumnHeader title='Subject Name' column={column} />,
        enableSorting: false,
        cell: ({ row }) => row.getValue('ismS_SubjectName')
    },
    {
        accessorKey: 'emgR_GradeName',
        header: ({ column }) => <DataTableColumnHeader title='Grade Name' column={column} />,
        enableSorting: false,
        cell: ({ row }) => row.getValue('emgR_GradeName')
    },
    {
        accessorKey: 'empS_MaxMarks',
        header: ({ column }) => <DataTableColumnHeader title='Max. Marks' column={column} />,
        enableSorting: false,
        cell: ({ row }) => row.getValue('empS_MaxMarks')
    },
    {
        accessorKey: 'empS_MinMarks',
        header: ({ column }) => <DataTableColumnHeader title='Min. Marks' column={column} />,
        enableSorting: false,
        cell: ({ row }) => row.getValue('empS_MinMarks')
    },
    {
        accessorKey: 'empS_ConvertForMarks',
        header: ({ column }) => <DataTableColumnHeader title='Converted Marks For' column={column} />,
        enableSorting: false,
        cell: ({ row }) => row.getValue('empS_ConvertForMarks')
    },
    {
        accessorKey: 'empS_AppToResultFlg',
        header: ({ column }) => <DataTableColumnHeader title='Apl. Result' column={column} />,
        cell: ({ row }) => getStatusBadge((row.getValue('empS_AppToResultFlg') as boolean) === true ? 'yes' : 'no'),
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
function MappingCell({ rowData }: { rowData: IPromotionalSubjectDetails }) {
    const showEye = rowData.empS_AppToResultFlg || rowData.empS_ConvertForMarks;
    const { openMappedview } = useFormContext<IPromotionalSubjectDetails>();
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
function ActionButtonsCell({ rowData }: { rowData: IPromotionalSubjectDetails }) {
    const { openToggleForm } = useFormContext<IPromotionalSubjectDetails>();
    const handleToggle = useCallback(() => openToggleForm(rowData), [openToggleForm, rowData]);

    return (
        <div className='flex justify-center'>
            <MappingCell rowData={rowData} />
            <ActionButtons rowData={rowData} buttons={{ toggle: true }} onToggle={handleToggle} toggleConditionKey='empS_ActiveFlag' />
        </div>
    );
}

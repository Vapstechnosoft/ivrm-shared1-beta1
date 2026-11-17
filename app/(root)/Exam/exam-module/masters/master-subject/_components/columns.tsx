'use client';
import { getStatusBadge } from '@/components/extras/helpers/helper';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterSubject } from '@/types/exam/exam-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';


export const examSubjectColumns: ColumnDef<IMasterSubject>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'ismS_SubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Name' />,
        cell: ({ row }) => <div>{row.getValue('ismS_SubjectName')}</div>
    },
    {
        accessorKey: 'ismS_IVRSSubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='IVRS Subject Name' />,
        cell: ({ row }) => <div>{row.getValue('ismS_IVRSSubjectName')}</div>
    },
    {
        accessorKey: 'ismS_SubjectCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Code' />,
        cell: ({ row }) => <div>{row.getValue('ismS_SubjectCode')}</div>
    },
    {
        accessorKey: 'ismS_SubjectNameNew',
        header: ({ column }) => <DataTableColumnHeader column={column} title='New Subject Name' />,
        cell: ({ row }) => <div>{row.getValue('ismS_SubjectNameNew')}</div>
    },
    {
        accessorKey: 'ismS_PreadmFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Pre-Admission Flag' />,
        cell: ({ row }) => getStatusBadge((row.getValue('ismS_PreadmFlag') as number) === 1 ? 'yes' : 'no')
    },
    {
        accessorKey: 'ismS_AttendanceFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Attendance Flag' />,
        cell: ({ row }) => getStatusBadge(row.getValue('ismS_AttendanceFlag') ? 'yes' : 'no')
    },
    {
        accessorKey: 'ismS_BatchAppl',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Batch Applicable' />,
        cell: ({ row }) => getStatusBadge((row.getValue('ismS_BatchAppl') as number) === 1 ? 'yes' : 'no')
    },
    {
        accessorKey: 'ismS_ExamFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Exam Flag' />,
        cell: ({ row }) => getStatusBadge((row.getValue('ismS_ExamFlag') as number) === 1 ? 'yes' : 'no')
    },
    {
        accessorKey: 'ismS_LanguageFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Language Flag' />,
        cell: ({ row }) => getStatusBadge((row.getValue('ismS_LanguageFlg') as number) === 1 ? 'yes' : 'no')
    },
    {
        accessorKey: 'ismS_AtExtraFeeFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Extra Fee Flag' />,
        cell: ({ row }) => getStatusBadge((row.getValue('ismS_AtExtraFeeFlg') as number) === 1 ? 'yes' : 'no')
    },
    {
        accessorKey: 'ismS_TTFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Time Table Flag' />,
        cell: ({ row }) => getStatusBadge(row.getValue('ismS_TTFlag') ? 'yes' : 'no')
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterSubject }) {
    const { openEditForm, openToggleForm } = useFormContext<IMasterSubject>();

    const handleEdit = useCallback(
        (data: IMasterSubject) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IMasterSubject) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={handleEdit}
            onToggle={handleToggle}
            toggleConditionKey='ismS_ActiveFlag'
        />
    );
}

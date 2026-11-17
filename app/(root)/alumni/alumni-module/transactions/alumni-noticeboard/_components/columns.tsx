'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IAlumniNoticeBoard } from '@/types/alumni/alumni-notice-board';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

export const AlumniNoticeBoardColumns: ColumnDef<IAlumniNoticeBoard>[] = [
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div>{continuousIndex}</div>;
        },
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'alntB_Title',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Notice Title' />,
        cell: ({ row }) => <div>{row.getValue('alntB_Title')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'alntB_Description',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
        cell: ({ row }) => <div>{row.getValue('alntB_Description')}</div>
    },
    {
        accessorKey: 'alntB_StartDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Start Date' />,
        cell: ({ row }) => {
            const date = row.getValue('alntB_StartDate') as string | Date;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : ''}</div>;
        }
    },
    {
        accessorKey: 'alntB_EndDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='End Date' />,
        cell: ({ row }) => {
            const date = row.getValue('alntB_EndDate') as string | Date;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : ''}</div>;
        }
    },
    {
        id: 'view',
        header: 'View Attachment',
        cell: ({ row }) => <ViewAttachmentButton row={row.original} />
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ViewAttachmentButton({ row }: { row: IAlumniNoticeBoard }) {
    const { openDetailsView } = useFormContext<IAlumniNoticeBoard>();

    return (
        <Button variant='ghost' size='icon' onClick={() => openDetailsView(row)}>
            <Eye className='h-4 w-4' />
        </Button>
    );
}

function ActionButtonsCell({ rowData }: { rowData: IAlumniNoticeBoard }) {
    const { openEditForm, openToggleForm } = useFormContext<IAlumniNoticeBoard>();

    const handleEdit = useCallback(
        (data: IAlumniNoticeBoard) => {
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IAlumniNoticeBoard) => {
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
            toggleConditionKey='alntB_ActiveFlag'
        />
    );
}

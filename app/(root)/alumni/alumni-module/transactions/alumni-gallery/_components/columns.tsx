'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IAlumniGallery } from '@/types/alumni/alumni-gallery';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

export const AlumniGalleryColumns: ColumnDef<IAlumniGallery>[] = [
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
        accessorKey: 'algA_GalleryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Gallery Name' />,
        cell: ({ row }) => <div>{row.getValue('algA_GalleryName')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'algA_Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
        cell: ({ row }) => {
            const date = row.getValue('algA_Date');
            return <div>{date ? format(new Date(date as string), 'dd/MM/yyyy') : ''}</div>;
        }
    },
    {
        accessorKey: 'algA_Time',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Time' />,
        cell: ({ row }) => <div>{row.getValue('algA_Time')}</div>
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IAlumniGallery }) {
    const { openEditForm, openToggleForm } = useFormContext<IAlumniGallery>();

    // Note: Legacy used getmodeldetails to view images/videos in a modal.
    // We'll use openEditForm or a custom view implementation.
    const handleView = useCallback(
        (data: IAlumniGallery) => {
            // Re-using edit form as view/edit modal
            openEditForm(data);
        },
        [openEditForm]
    );

    const handleToggle = useCallback(
        (data: IAlumniGallery) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <div className='flex items-center justify-center gap-2'>
            <Button variant='ghost' size='icon' onClick={() => handleView(rowData)} title='View Detail'>
                <Eye className='h-4 w-4 text-primary' />
            </Button>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: false, toggle: true, delete: false }}
                onToggle={handleToggle}
                toggleConditionKey='algA_ActiveFlag'
            />
        </div>
    );
}

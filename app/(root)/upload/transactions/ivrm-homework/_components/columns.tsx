'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IHomeWorkDetails } from '@/types/upload/reports/homework-upload-report';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback } from 'react';

export const homeWorkColumns: ColumnDef<IHomeWorkDetails>[] = [
    {
        accessorKey: 'ihW_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div className='w-full pl-6'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'ismS_SubjectName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Subject Name' />,
        cell: ({ row }) => <div>{row.getValue('ismS_SubjectName')}</div>
    },
    {
        accessorKey: 'ihW_Topic',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Topic' />,
        cell: ({ row }) => <div>{row.getValue('ihW_Topic')}</div>
    },
    {
        accessorKey: 'ihW_Assignment',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Assignment' />,
        cell: ({ row }) => <div>{row.getValue('ihW_Assignment')}</div>
    },

    {
        accessorKey: 'asmcL_ClassName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_ClassName')}</div>
    },
    {
        accessorKey: 'asmC_SectionName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Section' />,
        cell: ({ row }) => <div style={{ textAlign: 'center' }}>{row.getValue('asmC_SectionName')}</div>
    },
    {
        accessorKey: 'ihW_Date',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Home Work Date' />,
        cell: ({ row }) => (
            <div>
                {new Date(row.getValue('ihW_Date')).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
            </div>
        )
    },

    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IHomeWorkDetails }) {
    const { openEditForm, openDeleteForm, openDetailsView, openToggleForm } = useFormContext<IHomeWorkDetails>();

    const handleEdit = useCallback((data: IHomeWorkDetails) => openEditForm(data), [openEditForm]);

    const handleToggle = useCallback((data: IHomeWorkDetails) => openToggleForm(data), [openToggleForm]);

    const handleDelete = useCallback((data: IHomeWorkDetails) => openDeleteForm(data), [openDeleteForm]);

    const handleView = useCallback(() => {
        openDetailsView(rowData);
    }, [openDetailsView, rowData]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button type='button' onClick={handleView} className='rounded-md p-2 transition hover:bg-muted' title='View  Details'>
                <Eye className='h-4 w-4 text-blue-600' />
            </button>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: true, toggle: true, delete: false }}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
                toggleConditionKey='ihW_ActiveFlag'
            />
        </div>
    );
}

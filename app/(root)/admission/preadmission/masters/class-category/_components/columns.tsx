'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterClassCategoryList } from '@/types/admission/preadmission/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback, useState } from 'react';
import ViewDetailModal from './section-columns';

export const masterClassCategoryColumns: ColumnDef<IMasterClassCategoryList>[] = [
    {
        accessorKey: 'asmcC_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='w-full pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'amC_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
        cell: ({ row }) => <div>{row.getValue('amC_Name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmcL_ClassName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_ClassName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
        accessorFn: (row: any) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMasterClassCategoryList }) {
    const { openToggleForm } = useFormContext<IMasterClassCategoryList>();
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const handleToggle = useCallback(
        (data: IMasterClassCategoryList) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return (
        <>
            <div className='flex items-center gap-2'>
                <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => setIsViewModalOpen(true)}
                    title='View Details'
                    className='flex justify-start'>
                    <Eye className='h-4 w-4' />
                </Button>
                <ActionButtons
                    rowData={rowData}
                    buttons={{ edit: false, toggle: true, delete: false }}
                    onToggle={handleToggle}
                    toggleConditionKey='is_Active'
                />
            </div>
            {isViewModalOpen && <ViewDetailModal rowData={rowData} isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} />}
        </>
    );
}

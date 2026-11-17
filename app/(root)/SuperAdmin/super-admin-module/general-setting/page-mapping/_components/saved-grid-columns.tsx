'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { ISavedMapping } from '@/types/super-admin/super-admin-module/general-setting/page-mapping';

export const savedGridColumns: ColumnDef<ISavedMapping>[] = [
    {
        accessorKey: 'slno',
        header: 'SL.NO',
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return pageIndex * pageSize + row.index + 1;
        },
    },


    {
        accessorKey: 'ivrmM_ModuleName',
        header: 'Module Name',
        enableSorting: true,
    },
    {
        accessorKey: 'ivrmmP_PageName',
        header: 'Page Name',
        enableSorting: true,
    },
    {
        id: 'actions',
        header: 'Delete',
        cell: ({ row, table }) => {
            // We can pass a meta function for delete
            const meta = table.options.meta as any;
            return (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => meta?.handleDelete?.(row.original.ivrmmP_Id)}
                    className="h-8 w-8 text-red-500 hover:bg-red-50"
                    title="Delete"
                >
                    <Trash2 size={16} />
                </Button>
            );
        },
    },
];

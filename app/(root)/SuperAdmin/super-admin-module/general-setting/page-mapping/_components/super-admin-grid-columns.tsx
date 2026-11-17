'use client';

import { IPageMappingData, ISavedMapping } from '@/types/super-admin/super-admin-module/general-setting/page-mapping';
import { Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const superAdminGridColumns: ColumnDef<IPageMappingData>[] = [
    {
        accessorKey: 'slno',
        header: 'SL.NO',
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return pageIndex * pageSize + row.index + 1;
        },
    },
    // Only Page Name as requested in snippet
    {
        accessorKey: 'ivrmP_PageName',
        header: 'Page Name',
        enableSorting: true,
    },
    {
        id: 'remove',
        header: 'Remove',
        cell: ({ row, table }) => {
            const meta = table.options.meta as any;
            return (
                <div className="flex justify-center">
                    <button
                        onClick={() => meta?.handleRemove?.(row.original)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            );
        },
    },
];

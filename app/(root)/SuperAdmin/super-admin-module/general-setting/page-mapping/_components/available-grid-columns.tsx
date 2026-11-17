'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IPageMappingData } from '@/types/super-admin/super-admin-module/general-setting/page-mapping';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

// We need a way to handle selection. Since GenericDataTable might not expose row selection 
// to the parent easily via props like 'onSelectionChange' for custom logic (add to cart),
// we might need to pass the handler in meta or use the table's internal selection model.
// However, the requirement is "Select" column with checkbox.

export const availableGridColumns: ColumnDef<IPageMappingData>[] = [
    {
        accessorKey: 'serialNumber',
        header: 'SL.NO',
        cell: ({ row, table }) => {
            // Calculate serial number based on pagination
            // We need page index and page size from table state if accessible, 
            // or compute manually if passed in data. 
            // Usually GenericDataTable passes global index? No.
            // Let's assume (pageIndex * pageSize) + index + 1
            const { pagination } = table.getState();
            return (pagination.pageIndex * pagination.pageSize) + row.index + 1;
        },
        enableSorting: false,
    },
    {
        accessorKey: 'ivrmP_PageName',
        header: 'Page Name',
    },
    {
        id: 'actions',
        header: 'Select',
        cell: ({ row, table }) => {
            // We use table meta to pass the toggle handler
            const meta = table.options.meta as any;
            const isChecked = meta?.isChecked?.(row.original.ivrmP_Id);

            return (
                <div className="flex justify-center">
                    <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => meta?.handleToggle?.(row.original)}
                        aria-label="Select row"
                    />
                </div>
            );
        },
        enableSorting: false,
    }
];

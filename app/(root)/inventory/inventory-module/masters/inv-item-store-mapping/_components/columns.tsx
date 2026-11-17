'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useInvItemStoreMapping } from '@/hooks/inventory/masters/use-inv-item-store-mapping';
import type { IInvItemStoreMapping } from '@/types/inventory/masters/inv-item-store-mapping';

export const invItemStoreMappingColumns: ColumnDef<IInvItemStoreMapping>[] = [
    {
        accessorKey: 'sno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No.' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
    },
    {
        accessorKey: 'invmsT_StoreName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Store Name' />,
    },
    {
        accessorKey: 'invmI_ItemName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Item Name' />,
    },
    {
        accessorKey: 'invmG_GroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group' />,
    },
    {
        accessorKey: 'invmisM_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => <StatusToggle rowData={row.original} />,
    },
];

function StatusToggle({ rowData }: { rowData: IInvItemStoreMapping }) {
    const { toggleActiveMutation } = useInvItemStoreMapping();

    const handleToggle = (checked: boolean) => {
        toggleActiveMutation.mutate({
            invmisM_Id: rowData.invmisM_Id,
            invmisM_ActiveFlg: checked
        });
    };

    return (
        <div className='flex items-center gap-2'>
            <Switch
                checked={rowData.invmisM_ActiveFlg}
                onCheckedChange={handleToggle}
                disabled={toggleActiveMutation.isPending}
            />
            <Badge variant={rowData.invmisM_ActiveFlg ? 'default' : 'destructive'}>
                {rowData.invmisM_ActiveFlg ? 'Active' : 'Inactive'}
            </Badge>
        </div>
    );
}

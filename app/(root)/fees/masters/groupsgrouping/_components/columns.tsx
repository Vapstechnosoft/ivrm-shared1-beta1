// _components/columns.tsx
'use client';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterGroupsGrouping } from '@/types/fees/masters/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useCallback, useState } from 'react';

export const feegroupgroupingColoumn: ColumnDef<IMasterGroupsGrouping>[] = [
    {
        accessorKey: 'fmgG_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'fmgG_GroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Name' className='' />,
        cell: ({ row }) => {
            const value = row.getValue('fmgG_GroupName') as string;
            return <div className='font-medium'>{value || '—'}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fmgG_GroupCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group Code' />,
        cell: ({ row }) => {
            const raw = row.getValue('fmgG_GroupCode');
            const value = raw === undefined || raw === null ? '—' : String(raw);
            return <div>{value}</div>;
        },
        enableSorting: true,
        enableHiding: true
    },
    // {
    //     accessorKey: 'selectedFeeGroups',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Group Names' />,
    //     cell: ({ row }) => {
    //         const selectedFeeGroups =
    //             (row.getValue('selectedFeeGroups') as Array<{
    //                 fmG_Id: number;
    //                 fmG_GroupName: string;
    //             }>) || [];

    //         const fmG_GroupName = selectedFeeGroups.map((group) => group.fmG_GroupName);
    //         const count = fmG_GroupName.length;

    //         return <SelectedFeeGroupsCell fmG_GroupName={fmG_GroupName} count={count} />;
    //     },
    //     enableSorting: false,
    //     enableHiding: true
    // },
    {
        accessorKey: 'selectedFeeGroups',
        size: 150,
        minSize: 120,

        header: () => (
            <div className='flex h-8 w-full items-center justify-start'>
                <span className='font-medium text-xs'>Fee Group Names</span>
            </div>
        ),

        // 🔥 This aligns the CELL (not just the header)
        meta: {
            className: 'text-left justify-start'
        },

        cell: ({ row }) => {
            const selectedFeeGroups = (row.getValue('selectedFeeGroups') as Array<{ fmG_Id: number; fmG_GroupName: string }>) || [];

            const fmG_GroupName = selectedFeeGroups.map((g) => g.fmG_GroupName);
            const count = fmG_GroupName.length;

            return (
                <div className='flex w-full justify-start'>
                    <SelectedFeeGroupsCell fmG_GroupName={fmG_GroupName} count={count} />
                </div>
            );
        },

        enableSorting: false,
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

// Selected Fee Groups View Modal
function SelectedFeeGroupsCell({
    fmG_GroupName,
    count
}: {
    fmG_GroupName: string[];
    count: number;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className='flex items-center gap-2'>
                <Button variant='ghost' size='sm' onClick={() => setOpen(true)} className='h-7 px-2 text-xs' disabled={count === 0}>
                    <Eye className='mr-1 h-3 w-3' />
                    View ({count})
                </Button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Selected Fee Groups ({count})</DialogTitle>
                    </DialogHeader>
                    <div className='max-h-96 space-y-2 overflow-y-auto'>
                        {fmG_GroupName && fmG_GroupName.length > 0 ? (
                            <ul className='list-inside list-disc space-y-1 text-sm'>
                                {fmG_GroupName.map((name, index) => (
                                    <li key={`${name}-${index}`} className='text-foreground'>
                                        <span className='font-mono font-semibold'>{name}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className='text-muted-foreground text-sm'>No fee groups selected.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Action Buttons (Edit, Toggle, Delete)
function ActionButtonsCell({ rowData }: { rowData: IMasterGroupsGrouping }) {
    const { openEditForm, openDeleteForm } = useFormContext<IMasterGroupsGrouping>();

    const handleEdit = useCallback((data: IMasterGroupsGrouping) => openEditForm(data), [openEditForm]);

    const handleDelete = useCallback((data: IMasterGroupsGrouping) => openDeleteForm(data), [openDeleteForm]);

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: false, delete: true }}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
}

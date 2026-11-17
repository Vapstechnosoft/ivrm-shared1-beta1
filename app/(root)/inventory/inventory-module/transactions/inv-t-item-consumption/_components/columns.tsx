'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useInvTItemConsumption } from '@/hooks/inventory/transactions/use-inv-t-item-consumption';
import type { InvTItemConsumption } from '@/types/inventory/transactions/inv-t-item-consumption';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { List, Users } from 'lucide-react';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const invTItemConsumptionColumns: ColumnDef<InvTItemConsumption>[] = [
    {
        accessorKey: 'sno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No.' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false
    },
    {
        accessorKey: 'invmS_StoreName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Store Name' />,
        cell: ({ row }) => <div>{row.getValue('invmS_StoreName')}</div>
    },
    {
        accessorKey: 'invmiC_StuOtherFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
        cell: ({ row }) => <div>{row.getValue('invmiC_StuOtherFlg')}</div>
    },
    {
        accessorKey: 'invmiC_ICNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='IC No.' />,
        cell: ({ row }) => <div>{row.getValue('invmiC_ICNo')}</div>
    },
    {
        accessorKey: 'invmiC_ICDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='IC Date' />,
        cell: ({ row }) => {
            const date = row.getValue('invmiC_ICDate') as string;
            return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : '-'}</div>;
        }
    },
    {
        accessorKey: 'invmiC_Remarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remarks' />,
        cell: ({ row }) => <div>{row.getValue('invmiC_Remarks')}</div>
    },
    {
        accessorKey: 'invmiC_ActiveFlg',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const status = row.original.invmiC_ActiveFlg;
            return (
                <Badge className={status ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'}>
                    {status ? 'Active' : 'Inactive'}
                </Badge>
            );
        }
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-center' />,
        accessorFn: (row) => row,
        enableSorting: false,
        cell: ({ row }) => <ActionButtonsClient rowData={row.original} />
    }
];

function ActionButtonsClient({ rowData }: { rowData: InvTItemConsumption }) {
    const { openEditForm, openDetailsView, openToggleForm } = useFormContext<InvTItemConsumption>();
    const { deleteMutation } = useInvTItemConsumption();

    const handleEdit = useCallback(() => openEditForm(rowData), [openEditForm, rowData]);

    const handleToggle = useCallback(() => {
        openToggleForm(rowData);
    }, [openToggleForm, rowData]);

    const handleViewItems = useCallback(() => {
        if (openDetailsView) {
            // We use 'invmiC_Remarks' or a similar dummy field to distinguish view types if needed, 
            // but for now we'll rely on the modal management in page.tsx
            openDetailsView({ ...rowData, invmiC_Remarks: 'VIEW_ITEMS' });
        }
    }, [openDetailsView, rowData]);

    const handleViewStaff = useCallback(() => {
        if (openDetailsView) {
            openDetailsView({ ...rowData, invmiC_Remarks: 'VIEW_STAFF' });
        }
    }, [openDetailsView, rowData]);

    return (
        <div className='flex justify-center gap-2'>
            <TooltipProvider>
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleViewItems}
                                className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>View Items</p></TooltipContent>
                    </Tooltip>

                    {rowData.invmiC_StuOtherFlg === 'Staff' && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleViewStaff}
                                    className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                                >
                                    <Users className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>View Staff</p></TooltipContent>
                        </Tooltip>
                    )}

                    <ActionButtons
                        rowData={rowData}
                        buttons={{ edit: true, delete: false, toggle: true }}
                        onEdit={handleEdit}
                        onToggle={handleToggle}
                        toggleConditionKey='invmiC_ActiveFlg'
                    />
                </div>
            </TooltipProvider>
        </div>
    );
}

// _components/columns.tsx
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { feeTransactionWaivedOffHead } from '@/types/fees/transactions/transactions';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

export const FeeTransactionHeadList: ColumnDef<feeTransactionWaivedOffHead>[] = [
    {
        id: 'fmgM_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex || 0;
            const pageSize = table.getState().pagination.pageSize || 10;
            return <div className='pl-6'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'check',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />
        ),
        enableSorting: false,
        enableHiding: false
    },

    {
        accessorKey: 'fmH_FeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Name' />,
        cell: ({ row }) => <div>{row.getValue('fmH_FeeName')}</div>,
        enableSorting: false,
        enableHiding: false
    },

    {
        accessorKey: 'ftI_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Installment' />,
        cell: ({ row }) => <div>{row.getValue('ftI_Name')}</div>,
        enableSorting: false,
        enableHiding: false
    },

    {
        accessorKey: 'tobepaid',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Balance' />,
        cell: ({ row }) => <div>{row.getValue('tobepaid')}</div>,
        enableSorting: false,
        enableHiding: false
    },

    {
        accessorKey: 'totalTobepaid',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Paid Amount' />,
        cell: ({ row }) => <div>{row.getValue('totalTobepaid')}</div>,
        enableSorting: false,
        enableHiding: false
    },

    {
        accessorKey: 'waivedOff',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Waived Off Amount' />,
        cell: ({ row }) => {
            const rawValue = row.getValue('waivedOff') as unknown;
            const initialValue = rawValue !== null && rawValue !== undefined && rawValue !== '' ? String(rawValue) : '0';
            const [value, setValue] = useState(initialValue);

            const handleBlur = () => {
                const num = Number(value);
                const finalValue = Number.isNaN(num) ? 0 : num;
                row.original.waivedOff = finalValue;
                setValue(finalValue.toString());
            };
            return (
                <input
                    type='number'
                    value={value}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (v === '') {
                            setValue('');
                            return;
                        }
                        if (/^\d*\.?\d*$/.test(v)) {
                            setValue(v);
                        }
                    }}
                    onBlur={handleBlur}
                    className='w-full rounded border px-2 py-1 text-sm'
                />
            );
        },
        enableSorting: false,
        enableHiding: false
    }
];

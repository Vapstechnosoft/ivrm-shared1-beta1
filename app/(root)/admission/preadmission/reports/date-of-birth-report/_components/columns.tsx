'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';

export const birthCertificateColumns: ColumnDef<any>[] = [
    {
        id: 'select',
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
        enableHiding: false,
        size: 24
    },
    {
        accessorKey: 'stufn',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
        cell: ({ row }) => <div>{row.getValue('stufn') ?? row.original.studentName ?? 'N/A'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'amst_admno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Admission No.' />,
        cell: ({ row }) => <div>{row.getValue('amst_admno') ?? row.original.admNo ?? 'N/A'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'class',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
        cell: ({ row }) => <div>{row.getValue('class') ?? row.original.className ?? 'N/A'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'dob',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date of Birth' />,
        cell: ({ row }) => {
            const dob = row.getValue('dob') ?? row.original.dob;
            if (!dob) return <div>N/A</div>;
            try {
                return <div>{new Date(dob as string).toLocaleDateString()}</div>;
            } catch {
                return <div>{String(dob)}</div>;
            }
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'dobword',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date of Birth (Words)' />,
        cell: ({ row }) => <div>{row.getValue('dobword') ?? 'N/A'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'fathername',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Father Name' />,
        cell: ({ row }) => <div>{row.getValue('fathername') ?? row.original.fatherName ?? 'N/A'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'stumn',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Mother Name' />,
        cell: ({ row }) => <div>{row.getValue('stumn') ?? row.original.motherName ?? 'N/A'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'acadamicyear',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('acadamicyear') ?? 'N/A'}</div>,
        enableSorting: true,
        enableHiding: true
    }
];

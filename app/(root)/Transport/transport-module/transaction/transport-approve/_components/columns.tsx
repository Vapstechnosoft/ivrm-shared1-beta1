'use client';

import { Checkbox } from '@/components/ui/checkbox';
import type { IStudentData } from '@/types/transport/transport-module/transaction/transport-approve';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

export const studentListColumns: ColumnDef<IStudentData>[] = [
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
        enableHiding: false
    },
    {
        id: 'sms',
        header: 'SMS',
        cell: ({ row }) => null // Placeholder for interaction handled in list
    },
    {
        id: 'email',
        header: 'Email',
        cell: ({ row }) => null // Placeholder for interaction handled in list
    },
    {
        header: 'SL.No',
        cell: ({ row }) => row.index + 1
    },
    {
        accessorKey: 'amsT_Photoname',
        header: 'Photo',
        cell: ({ row }) =>
            row.original.amsT_Photoname ? (
                <img src={row.original.amsT_Photoname} alt='Student' className='h-8 w-8 rounded-full object-cover' />
            ) : null
    },
    {
        accessorKey: 'studentname',
        header: 'Student Name'
    },
    {
        accessorKey: 'applicationno',
        header: 'App No'
    },
    {
        accessorKey: 'amsT_AdmNo',
        header: 'Adm No'
    },
    {
        accessorKey: 'asmcL_ClassName',
        header: 'Class'
    },
    // Conditional: Pickup Route (Only if Route is 'All' aka 0)
    {
        accessorKey: 'pickuproute',
        header: 'Pickup Route'
    },
    {
        accessorKey: 'pickuplocation',
        header: 'Pickup Location'
    },
    {
        id: 'PickUp_Session', // Managed by custom cell in StudentList
        header: 'Pickup Session'
    },
    // Conditional: Drop Route (Only if Route is 'All' aka 0)
    {
        accessorKey: 'drouproute',
        header: 'Drop Route'
    },
    {
        accessorKey: 'drouplocation',
        header: 'Drop Location'
    },
    {
        id: 'Drop_Session', // Managed by custom cell in StudentList
        header: 'Drop Session'
    },
    {
        accessorKey: 'neworreguular',
        header: 'New/Regular'
    },
    {
        id: 'view',
        header: 'View',
        cell: ({ row }) => (
            <div className='flex cursor-pointer items-center justify-center text-primary'>
                <Eye className='mr-1 h-4 w-4' />
                <span className='text-xs'>View App</span>
            </div>
        )
    },
    {
        id: 'remarks1', // Managed by custom cell in StudentList
        header: 'Remarks SMS'
    },
    {
        id: 'studentremarkemail1', // Managed by custom cell in StudentList
        header: 'Remarks Email'
    }
];

export const approvedListColumns: ColumnDef<any>[] = [
    {
        header: 'SL.No',
        cell: ({ row }) => row.index + 1
    },
    {
        accessorKey: 'studentname',
        header: 'Student Name'
    },
    {
        accessorKey: 'applicationno',
        header: 'App No'
    },
    {
        accessorKey: 'astA_ApplStatus',
        header: 'App Status'
    },
    {
        accessorKey: 'areaname',
        header: 'Area'
    },
    {
        id: 'view',
        header: 'View',
        cell: ({ row }) => (
            <div className='flex cursor-pointer items-center justify-center text-primary'>
                <Eye className='mr-1 h-4 w-4' />
                <span className='text-xs'>View App</span>
            </div>
        )
    }
];

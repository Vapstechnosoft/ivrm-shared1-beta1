'use client';

import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

// STUDENT COLUMNS
export const studentColumns: ColumnDef<any>[] = [
    {
        accessorKey: 'sn',
        header: ({ column }) => <ColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'studentname',
        header: ({ column }) => <ColumnHeader column={column} title='Student Name' />
    },
    {
        accessorKey: 'ASMCL_ClassName',
        header: ({ column }) => <ColumnHeader column={column} title='Class' />
    },
    {
        accessorKey: 'ASMC_SectionName',
        header: ({ column }) => <ColumnHeader column={column} title='Section' />
    },
    {
        accessorKey: 'HLMH_Name',
        header: ({ column }) => <ColumnHeader column={column} title='Hostel' />
    },
    {
        accessorKey: 'HRMRM_RoomNo',
        header: ({ column }) => <ColumnHeader column={column} title='Room No' />
    },
    {
        accessorKey: 'HLHSALT_VacatedDate',
        header: ({ column }) => <ColumnHeader column={column} title='Vacate Date' />,
        cell: ({ row }) => row.original.HLHSALT_VacatedDate ? format(new Date(row.original.HLHSALT_VacatedDate), 'dd/MM/yyyy') : '-'
    },
    {
        accessorKey: 'HLHSALT_VacateRemarks',
        header: ({ column }) => <ColumnHeader column={column} title='Remarks' />
    }
];

// STAFF COLUMNS
export const staffColumns: ColumnDef<any>[] = [
    {
        accessorKey: 'sn',
        header: ({ column }) => <ColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'staffname',
        header: ({ column }) => <ColumnHeader column={column} title='Staff Name' />
    },
    {
        accessorKey: 'HRMD_DepartmentName',
        header: ({ column }) => <ColumnHeader column={column} title='Department' />
    },
    {
        accessorKey: 'HRMDES_DesignationName',
        header: ({ column }) => <ColumnHeader column={column} title='Designation' />
    },
    {
        accessorKey: 'HLMH_Name',
        header: ({ column }) => <ColumnHeader column={column} title='Hostel' />
    },
    {
        accessorKey: 'HRMRM_RoomNo',
        header: ({ column }) => <ColumnHeader column={column} title='Room' />
    },
    {
        accessorKey: 'HLHSTALT_VacatedDate',
        header: ({ column }) => <ColumnHeader column={column} title='Vacate Date' />,
        cell: ({ row }) => row.original.HLHSTALT_VacatedDate ? format(new Date(row.original.HLHSTALT_VacatedDate), 'dd/MM/yyyy') : '-'
    },
    {
        accessorKey: 'HLHSTALT_VacateRemarks',
        header: ({ column }) => <ColumnHeader column={column} title='Remarks' />
    }
];

// GUEST COLUMNS
export const guestColumns: ColumnDef<any>[] = [
    {
        accessorKey: 'sn',
        header: ({ column }) => <ColumnHeader column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'HLHGSTALT_GuestName',
        header: ({ column }) => <ColumnHeader column={column} title='Guest Name' />
    },
    {
        accessorKey: 'HLMH_Name',
        header: ({ column }) => <ColumnHeader column={column} title='Hostel' />
    },
    {
        accessorKey: 'HRMRM_RoomNo',
        header: ({ column }) => <ColumnHeader column={column} title='Room' />
    },
    {
        accessorKey: 'HLHGSTALT_VacatedDate',
        header: ({ column }) => <ColumnHeader column={column} title='Vacate Date' />,
        cell: ({ row }) => row.original.HLHGSTALT_VacatedDate ? format(new Date(row.original.HLHGSTALT_VacatedDate), 'dd/MM/yyyy') : '-'
    },
    {
        accessorKey: 'HLHGSTALT_VacateRemarks',
        header: ({ column }) => <ColumnHeader column={column} title='Remarks' />
    }
];

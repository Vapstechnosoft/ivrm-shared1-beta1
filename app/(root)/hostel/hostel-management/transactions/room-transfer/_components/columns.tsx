'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';

export interface RoomTransferColumn {
    studentname?: string;
    staffname?: string;
    HLHGSTALT_GuestName?: string;
    AMCO_CourseName?: string;
    HRMD_DepartmentName?: string;
    HLMH_Name: string;
    HRMRM_RoomNo: string;
    HLHSALTC_VacatedDate?: string;
    HLHSTALT_VacatedDate?: string;
    HLHGSTALT_VacatedDate?: string;
    HLHSALTC_VacateRemarks?: string;
    HLHSTALT_VacateRemarks?: string;
    HLHGSTALT_VacateRemarks?: string;
}

export const roomTransferColumns: ColumnDef<RoomTransferColumn, any>[] = [
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
        header: ({ column }) => <ColumnHeader column={column} title='Name' />,
        cell: ({ row }) => {
            const data = row.original;
            return data.studentname || data.staffname || data.HLHGSTALT_GuestName;
        }
    },
    {
        accessorKey: 'AMCO_CourseName',
        header: ({ column }) => <ColumnHeader column={column} title='Course/Dept' />,
        cell: ({ row }) => {
            const data = row.original;
            return data.AMCO_CourseName || data.HRMD_DepartmentName || 'N/A';
        }
    },
    {
        accessorKey: 'HLMH_Name',
        header: ({ column }) => <ColumnHeader column={column} title='Hostel' />,
    },
    {
        accessorKey: 'HRMRM_RoomNo',
        header: ({ column }) => <ColumnHeader column={column} title='Room' />,
    },
    {
        accessorKey: 'HLHSALTC_VacatedDate',
        header: ({ column }) => <ColumnHeader column={column} title='Vacate Date' />,
        cell: ({ row }) => {
            const date = row.original.HLHSALTC_VacatedDate || row.original.HLHSTALT_VacatedDate || row.original.HLHGSTALT_VacatedDate;
            return date ? format(new Date(date), 'dd/MM/yyyy') : 'N/A';
        }
    },
    {
        accessorKey: 'HLHSALTC_VacateRemarks',
        header: ({ column }) => <ColumnHeader column={column} title='Remarks' />,
        cell: ({ row }) => {
            const remarks = row.original.HLHSALTC_VacateRemarks || row.original.HLHSTALT_VacateRemarks || row.original.HLHGSTALT_VacateRemarks;
            return remarks || 'N/A';
        }
    }
];

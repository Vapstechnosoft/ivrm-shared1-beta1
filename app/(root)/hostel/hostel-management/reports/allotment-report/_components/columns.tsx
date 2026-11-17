'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';

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
    { accessorKey: 'ASMAY_Year', header: ({ column }) => <ColumnHeader column={column} title='Year' /> },
    { accessorKey: 'StudentName', header: ({ column }) => <ColumnHeader column={column} title='Student Name' /> },
    { accessorKey: 'AMST_AdmNo', header: ({ column }) => <ColumnHeader column={column} title='Adm No' /> },
    { accessorKey: 'ASMCL_ClassName', header: ({ column }) => <ColumnHeader column={column} title='Class' /> },
    { accessorKey: 'ASMC_SectionName', header: ({ column }) => <ColumnHeader column={column} title='Section' /> },
    { accessorKey: 'HLMRCA_RoomCategory', header: ({ column }) => <ColumnHeader column={column} title='Category' /> },
    { accessorKey: 'HLMH_Name', header: ({ column }) => <ColumnHeader column={column} title='Hostel' /> },
    { accessorKey: 'HRMRM_RoomNo', header: ({ column }) => <ColumnHeader column={column} title='Room No' /> },
    { accessorKey: 'HLHSALT_AllotRemarks', header: ({ column }) => <ColumnHeader column={column} title='Remarks' /> },
    {
        accessorKey: 'HLHSALT_AllotmentDate',
        header: ({ column }) => <ColumnHeader column={column} title='Date' />,
        cell: ({ row }) => row.original.HLHSALT_AllotmentDate ? new Date(row.original.HLHSALT_AllotmentDate).toLocaleDateString('en-GB') : ''
    },
];

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
    { accessorKey: 'StaffName', header: ({ column }) => <ColumnHeader column={column} title='Staff Name' /> },
    { accessorKey: 'HRMD_DepartmentName', header: ({ column }) => <ColumnHeader column={column} title='Dept' /> },
    { accessorKey: 'HRMDES_DesignationName', header: ({ column }) => <ColumnHeader column={column} title='Designation' /> },
    { accessorKey: 'HRME_EmployeeCode', header: ({ column }) => <ColumnHeader column={column} title='Code' /> },
    {
        accessorKey: 'HLHSTALT_AllotmentDate',
        header: ({ column }) => <ColumnHeader column={column} title='Date' />,
        cell: ({ row }) => row.original.HLHSTALT_AllotmentDate ? new Date(row.original.HLHSTALT_AllotmentDate).toLocaleDateString('en-GB') : ''
    },
    { accessorKey: 'HLMH_Name', header: ({ column }) => <ColumnHeader column={column} title='Hostel' /> },
    { accessorKey: 'HLMRCA_RoomCategory', header: ({ column }) => <ColumnHeader column={column} title='Category' /> },
    { accessorKey: 'HRMRM_RoomNo', header: ({ column }) => <ColumnHeader column={column} title='Room No' /> },
    { accessorKey: 'HLHSTALT_AllotRemarks', header: ({ column }) => <ColumnHeader column={column} title='Remarks' /> },
];

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
    { accessorKey: 'HLHGSTALT_GuestName', header: ({ column }) => <ColumnHeader column={column} title='Guest Name' /> },
    {
        accessorKey: 'HLHGSTALT_AllotmentDate',
        header: ({ column }) => <ColumnHeader column={column} title='Date' />,
        cell: ({ row }) => row.original.HLHGSTALT_AllotmentDate ? new Date(row.original.HLHGSTALT_AllotmentDate).toLocaleDateString('en-GB') : ''
    },
    { accessorKey: 'HLMH_Name', header: ({ column }) => <ColumnHeader column={column} title='Hostel' /> },
    { accessorKey: 'HLMRCA_RoomCategory', header: ({ column }) => <ColumnHeader column={column} title='Category' /> },
    { accessorKey: 'HRMRM_RoomNo', header: ({ column }) => <ColumnHeader column={column} title='Room No' /> },
    { accessorKey: 'HLHGSTALT_GuestPhoneNo', header: ({ column }) => <ColumnHeader column={column} title='Phone' /> },
    { accessorKey: 'HLHGSTALT_GuestEmailId', header: ({ column }) => <ColumnHeader column={column} title='Email' /> },
    { accessorKey: 'HLHGSTALT_GuestAddress', header: ({ column }) => <ColumnHeader column={column} title='Address' /> },
    { accessorKey: 'HLHGSTALT_AllotRemarks', header: ({ column }) => <ColumnHeader column={column} title='Remarks' /> },
];

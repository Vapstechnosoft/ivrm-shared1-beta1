'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { BaseEntity } from '@/lib/localdb';
import type { ColumnDef } from '@tanstack/react-table';
export interface GPSAttendance extends BaseEntity {
    employeeName: string;
    designation?: string;
    date: string;
    clientName: string;
    salesLead: string;
    remarks?: string;
    punchFlag: boolean;
    location: string; // address string
}
export const gpsAttendanceColumns: ColumnDef<GPSAttendance>[] = [
    {
        id: 'sl',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.NO' />,
        cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
        enableSorting: false
    },
    { accessorKey: 'employeeName', header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' /> },
    { accessorKey: 'date', header: ({ column }) => <DataTableColumnHeader column={column} title='Date' /> },
    { accessorKey: 'clientName', header: ({ column }) => <DataTableColumnHeader column={column} title='Client Name' /> },
    { accessorKey: 'location', header: ({ column }) => <DataTableColumnHeader column={column} title='Location' /> },
    { accessorKey: 'salesLead', header: ({ column }) => <DataTableColumnHeader column={column} title='Sales Lead' /> },
    { accessorKey: 'remarks', header: ({ column }) => <DataTableColumnHeader column={column} title='Remarks' /> },
    {
        accessorKey: 'punchFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Punch Flag' />,
        cell: ({ row }) => <div>{row.getValue('punchFlag') ? 'Yes' : 'No'}</div>
    }
];

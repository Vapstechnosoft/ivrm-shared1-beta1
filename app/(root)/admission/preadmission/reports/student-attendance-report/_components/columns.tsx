'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IStudentAttendanceReportList } from '@/types/admission/preadmission/reports';
import type { ColumnDef } from '@tanstack/react-table';

export const attendanceColumns: ColumnDef<IStudentAttendanceReportList>[] = [
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
        accessorKey: 'RowNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='w-full pl-6' />,
        cell: ({ row }) => <div className='w-full pl-6'>{row.getValue('RowNo')}</div>,
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'AMST_AdmNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Admission No' />,
        cell: ({ row }) => <div>{row.getValue('AMST_AdmNo')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'AMAY_RollNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Roll No' />,
        cell: ({ row }) => <div>{row.getValue('AMAY_RollNo')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'ASA_ClassHeld',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class Held' />,
        cell: ({ row }) => <div>{row.getValue('ASA_ClassHeld')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'ASA_Class_Attended',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class Attended' />,
        cell: ({ row }) => <div>{row.getValue('ASA_Class_Attended')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'Percentage',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Percentage' />,
        cell: ({ row }) => {
            const percentage = Number(row.getValue('Percentage'));
            return <div>{percentage.toFixed(2)}%</div>;
        },
        enableSorting: true,
        enableHiding: true
    }
];

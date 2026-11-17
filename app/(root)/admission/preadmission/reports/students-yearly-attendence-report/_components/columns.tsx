'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IStudentYearlyAttendenceReportList } from '@/types/admission/preadmission/reports';
import type { ColumnDef } from '@tanstack/react-table';

interface MonthInfo {
    monthnamee: string;
    yearidname: string;
    monthidname: number;
    MONTH_NAME: string;
    total: number;
}

export const createStudentsYearlyAttendenceReportColumns = (monthList: MonthInfo[]): ColumnDef<IStudentYearlyAttendenceReportList>[] => {
    const baseColumns: ColumnDef<IStudentYearlyAttendenceReportList>[] = [
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
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
            cell: ({ row, table }) => {
                const pageIndex = table.getState().pagination.pageIndex;
                const pageSize = table.getState().pagination.pageSize;
                const continuousIndex = pageIndex * pageSize + row.index + 1;
                return <div>{continuousIndex}</div>;
            },
            enableSorting: true,
            enableHiding: false
        },
        {
            accessorKey: 'AMST_RegistrationNo',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Registration No' />,
            cell: ({ row }) => <div>{row.getValue('AMST_RegistrationNo') ?? 'N.A'}</div>,
            enableSorting: true,
            enableHiding: true
        },
        {
            accessorKey: 'AMST_AdmNo',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Admission No' />,
            cell: ({ row }) => <div>{row.getValue('AMST_AdmNo') ?? 'N.A'}</div>,
            enableSorting: true,
            enableHiding: true
        },
        {
            accessorKey: 'name',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
            cell: ({ row }) => <div>{row.getValue('name')}</div>,
            enableSorting: true,
            enableHiding: true
        },
        {
            accessorKey: 'AMAY_RollNo',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Roll No' />,
            cell: ({ row }) => <div>{row.getValue('AMAY_RollNo') ?? 'N.A'}</div>,
            enableSorting: true,
            enableHiding: true
        }
    ];

    // Generate dynamic month columns
    const monthColumns: ColumnDef<IStudentYearlyAttendenceReportList>[] = monthList.map((month: MonthInfo) => {
        const monthKey = `${month.yearidname}-${month.monthidname}`;
        const monthName = month.monthnamee.trim();

        return {
            accessorKey: `monthlyAttendance.${monthKey}`,
            id: monthKey,
            header: ({ column }) => <DataTableColumnHeader column={column} title={`${monthName} (${month.total})`} />,
            cell: ({ row }) => {
                const attendance = row.original.monthlyAttendance?.[monthKey];
                return <div className='text-center'>{attendance ?? '-'}</div>;
            },
            enableSorting: true,
            enableHiding: true
        };
    });

    // Summary columns (Total and Percentage)
    const summaryColumns: ColumnDef<IStudentYearlyAttendenceReportList>[] = [
        {
            accessorKey: 'totalPresent',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Total' />,
            cell: ({ row }) => <div className='text-center font-semibold'>{row.getValue('totalPresent')}</div>,
            enableSorting: true,
            enableHiding: true
        },
        {
            accessorKey: 'percentage',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Percentage' />,
            cell: ({ row }) => <div className='text-center font-semibold'>{row.getValue('percentage')}%</div>,
            enableSorting: true,
            enableHiding: true
        }
    ];

    return [...baseColumns, ...monthColumns, ...summaryColumns];
};

'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
export interface UnauthorizedLeaveCountRow {
    slNo: number;
    companyOrDept?: string;
    employeeName?: string;
    absentDate?: string;
    unauthorizedLeaveCount?: number;
}
export interface UnauthorizedLeaveCountColumnsProps {
    mode: 'Company Wise' | 'Department Wise';
    detailLevel: 'Only Count' | 'Overall Details';
}
export const getUnauthorizedLeaveCountColumns = ({
    mode,
    detailLevel
}: UnauthorizedLeaveCountColumnsProps): ColumnDef<UnauthorizedLeaveCountRow>[] => {
    if (detailLevel === 'Overall Details') {
        return [
            {
                accessorKey: 'slNo',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
                cell: ({ row }) => <div className='text-center'>{row.getValue('slNo')}</div>
            },
            {
                accessorKey: 'employeeName',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
                cell: ({ row }) => <div className='font-medium'>{row.getValue('employeeName')}</div>
            },
            {
                accessorKey: 'absentDate',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Absent Date' />,
                cell: ({ row }) => {
                    const date = row.getValue('absentDate') as string;
                    return <div>{date ? new Date(date).toLocaleDateString() : ''}</div>;
                }
            }
        ];
    }
    return [
        {
            accessorKey: 'slNo',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
            cell: ({ row }) => <div className='text-center'>{row.getValue('slNo')}</div>
        },
        {
            accessorKey: 'companyOrDept',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={mode === 'Company Wise' ? 'Company Name' : 'Department Name'} />
            ),
            cell: ({ row }) => <div className='font-medium'>{row.getValue('companyOrDept')}</div>
        },
        {
            accessorKey: 'unauthorizedLeaveCount',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Unauthorized Leave Count' />,
            cell: ({ row }) => <div className='text-center font-semibold'>{row.getValue('unauthorizedLeaveCount')}</div>
        }
    ];
};

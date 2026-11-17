'use client';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { EmployeeDetail } from '@/types/hrms/salary-approval';
import type { ColumnDef } from '@tanstack/react-table';
interface SalaryApprovalColumnsProps {
    employees: EmployeeDetail[];
    selectedEmployees: number[];
    onEmployeeSelect: (employeeId: number, selected: boolean) => void;
    onSelectAll: (selected: boolean) => void;
}
export function getSalaryApprovalColumns({
    employees,
    selectedEmployees,
    onEmployeeSelect,
    onSelectAll
}: SalaryApprovalColumnsProps): ColumnDef<EmployeeDetail>[] {
    return [
        {
            id: 'select',
            header: () => (
                <Checkbox
                    checked={employees.length > 0 && selectedEmployees.length === employees.length}
                    onCheckedChange={(value) => onSelectAll(!!value)}
                    aria-label='Select all'
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedEmployees.includes(row.original.HRME_Id)}
                    onCheckedChange={(value) => onEmployeeSelect(row.original.HRME_Id, !!value)}
                    aria-label='Select row'
                />
            ),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'slNo',
            header: ({ column }) => <DataTableColumnHeader column={column} title='SL. No' />,
            cell: ({ row, table }) => {
                const index = table.getSortedRowModel().rows.findIndex((r) => r.id === row.id);
                return <div>{index + 1}</div>;
            },
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'HRME_EmployeeCode',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Code' />,
            cell: ({ row }) => <div>{row.getValue('HRME_EmployeeCode')}</div>,
            enableSorting: true,
            enableHiding: true
        },
        {
            accessorKey: 'HRME_EmployeeFirstName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
            cell: ({ row }) => {
                const employee = row.original;
                const fullName =
                    `${employee.HRME_EmployeeFirstName} ${employee.HRME_EmployeeMiddleName || ''} ${employee.HRME_EmployeeLastName || ''}`.trim();
                return <div>{fullName}</div>;
            },
            enableSorting: true,
            enableHiding: true
        },
        {
            accessorKey: 'HRES_WorkingDays',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Working Days' />,
            cell: ({ row }) => <div className='text-right'>{row.getValue('HRES_WorkingDays') || 0}</div>,
            enableSorting: true,
            enableHiding: true
        },
        {
            accessorKey: 'TotalEarning',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Total Earning' />,
            cell: ({ row }) => {
                const value = row.getValue('TotalEarning') as number;
                return <div className='text-right font-semibold'>₹{Number(value || 0).toFixed(2)}</div>;
            },
            enableSorting: true,
            enableHiding: true
        },
        {
            accessorKey: 'TotalDeduction',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Total Deduction' />,
            cell: ({ row }) => {
                const value = row.getValue('TotalDeduction') as number;
                return <div className='text-right font-semibold'>₹{Number(value || 0).toFixed(2)}</div>;
            },
            enableSorting: true,
            enableHiding: true
        },
        {
            accessorKey: 'NetSalary',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Net Salary' />,
            cell: ({ row }) => {
                const value = row.getValue('NetSalary') as number;
                return (
                    <div className='text-right'>
                        <Badge variant='default' className='font-semibold'>
                            ₹{Number(value || 0).toFixed(2)}
                        </Badge>
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true
        }
    ];
}

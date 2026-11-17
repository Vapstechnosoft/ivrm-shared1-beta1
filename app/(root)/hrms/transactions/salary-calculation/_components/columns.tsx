'use client';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { EmployeeDropdown } from '@/types/hrms/reports/employee-profile-report';
import type { ColumnDef } from '@tanstack/react-table';
export interface Employee extends Omit<Partial<EmployeeDropdown>, 'HRME_EmployeeLastName'> {
    HRME_Id: number;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeLastName: string | null;
    HRMGT_Id: number;
    HRMD_Id: number;
    HRMDES_Id: number;
    calculationStatus: 'Not Calculated' | 'Calculated' | 'Recalculated';
    calculatedDate?: string;
    basicSalary?: number;
    allowances?: number;
    deductions?: number;
    netSalary?: number;
}
interface SalaryCalculationColumnsProps {
    employees: Employee[];
    selectedEmployees: number[];
    onEmployeeSelect: (employeeId: number, selected: boolean) => void;
    onSelectAll: (selected: boolean) => void;
}
export function getSalaryCalculationColumns({
    employees,
    selectedEmployees,
    onEmployeeSelect,
    onSelectAll
}: SalaryCalculationColumnsProps): ColumnDef<Employee>[] {
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
        }
    ];
}

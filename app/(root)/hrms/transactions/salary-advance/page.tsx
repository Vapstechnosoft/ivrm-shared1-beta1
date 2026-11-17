'use client';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { DataTable } from '@/components/ui/data-table/data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useLeaveYearDropdown, useMonthDropdown } from '@/hooks/hrms/useMasters';
import {
    useSalaryAdvanceGrid,
    useSalaryAdvanceEmployeeDropdown
} from '@/hooks/hrms/useTransactions';
import { cn } from '@/lib/utils';
import type {
    SalaryAdvanceGridItem,
    SalaryAdvanceEmployeeDropdownItem
} from '@/types/hrms/salary-advance';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ActionsCell } from './_components/actions-cell';
import FormSections from './_components/form-sections';

export default function SalaryAdvancePage() {
    const { data: advanceData, isLoading: isGridLoading, refetch } = useSalaryAdvanceGrid();
    const { data: employeeDropdown, isLoading: isDropdownLoading } = useSalaryAdvanceEmployeeDropdown();

    // Pre-fetch master dropdowns to have them ready for add/edit forms
    const { isLoading: isYearLoading } = useLeaveYearDropdown();
    const { isLoading: isMonthLoading } = useMonthDropdown();

    const isPageLoading = isGridLoading || isDropdownLoading || isYearLoading || isMonthLoading;

    return (
        <FormProvider<SalaryAdvanceGridItem>>
            <SalaryAdvancePageContent
                advanceData={advanceData}
                employeeDropdown={employeeDropdown}
                isLoading={isPageLoading}
                refetch={refetch}
            />
        </FormProvider>
    );
}

function SalaryAdvancePageContent({
    advanceData,
    employeeDropdown,
    isLoading,
    refetch
}: {
    advanceData: SalaryAdvanceGridItem[] | undefined;
    employeeDropdown: SalaryAdvanceEmployeeDropdownItem[] | undefined;
    isLoading: boolean;
    refetch: () => void;
}) {
    const { openAddForm } = useFormContext<SalaryAdvanceGridItem>();

    const filteredAdvances = advanceData || [];
    const employees = employeeDropdown || [];

    const getEmployeeNameById = (employeeId: number) => {
        const employee = employees.find((emp) => emp.hrmE_Id === employeeId);
        return employee?.employeeName || 'N/A';
    };

    const SalaryAdvanceTable = ({
        advances,
        isLoading,
        getEmployeeNameById
    }: {
        advances: SalaryAdvanceGridItem[];
        isLoading: boolean;
        getEmployeeNameById: (employeeId: number) => string;
    }) => {
        const columns: ColumnDef<SalaryAdvanceGridItem>[] = [
            {
                accessorKey: 'hresA_Id',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Sl. No.' />,
                cell: ({ row, table }) => {
                    const index = table.getSortedRowModel().rows.findIndex((r) => r.id === row.id);
                    return <div>{index + 1}</div>;
                },
                enableSorting: false,
                enableHiding: false
            },
            {
                accessorKey: 'hrmE_Id',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Employee ID' />,
                cell: ({ row }) => <div>{row.getValue('hrmE_Id')}</div>,
                enableSorting: true,
                enableHiding: true
            },
            {
                accessorKey: 'hrmE_Id',
                id: 'employeeName',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
                cell: ({ row }) => {
                    const employeeId = row.original.hrmE_Id;
                    return <div>{getEmployeeNameById(employeeId)}</div>;
                },
                enableSorting: true,
                enableHiding: true
            },
            {
                accessorKey: 'hresA_AdvYear',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Advance Year' />,
                cell: ({ row }) => <div>{row.getValue('hresA_AdvYear')}</div>,
                enableSorting: true,
                enableHiding: true
            },
            {
                accessorKey: 'hresA_AdvMonth',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Advance Month' />,
                cell: ({ row }) => <div>{row.getValue('hresA_AdvMonth')}</div>,
                enableSorting: true,
                enableHiding: true
            },
            {
                accessorKey: 'hresA_AppliedAmount',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Applied Amount' />,
                cell: ({ row }) => <div>₹{row.getValue('hresA_AppliedAmount')?.toLocaleString()}</div>,
                enableSorting: true,
                enableHiding: true
            },
            {
                accessorKey: 'hresA_AdvStatus',
                header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
                cell: ({ row }) => {
                    const status = row.getValue('hresA_AdvStatus') as string;
                    return (
                        <span
                            className={cn(
                                'rounded-full px-2 py-1 font-medium text-xs',
                                status === 'Approved'
                                    ? 'bg-green-100 text-green-800'
                                    : status === 'Rejected'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                            )}>
                            {status}
                        </span>
                    );
                },
                enableSorting: true,
                enableHiding: true
            },
            {
                id: 'actions',
                header: 'Actions',
                enableSorting: false,
                cell: ({ row }) => {
                    const advance = row.original;
                    return <ActionsCell rowData={advance} />;
                }
            }
        ];
        return (
            <div className='overflow-hidden rounded-lg bg-card'>
                <DataTable<SalaryAdvanceGridItem, any> columns={columns} data={advances} totalItems={advances.length} isLoading={isLoading} />
            </div>
        );
    };

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex justify-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        size='lg'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Salary Advance
                    </Button>
                </div>
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <div className='space-y-4'>
                        <SalaryAdvanceTable
                            advances={filteredAdvances}
                            isLoading={isLoading}
                            getEmployeeNameById={getEmployeeNameById}
                        />
                    </div>
                </CollapsibleSection>
                {/* Forms Section - Moved after table */}
                <FormSections
                    employeeDropdown={employees}
                    onSuccess={refetch}
                />
            </div>
        </div>
    );
}


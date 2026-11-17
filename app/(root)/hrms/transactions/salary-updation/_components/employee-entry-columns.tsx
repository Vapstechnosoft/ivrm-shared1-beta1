'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { EmployeeDropdown } from '@/types/hrms/salary-updation';
import type { ColumnDef } from '@tanstack/react-table';
import type React from 'react';
import { useEffect, useState } from 'react';

/* ============================================
   Types
   ============================================ */
export type SalaryHeadMeta = {
    headId: number;
    headName: string;
    isEarning: boolean; // true = Earning, false = Deduction
};

/* ============================================
   AmountInputCell
   - numbers/decimals only
   - wired for onChange
   ============================================ */
function AmountInputCell({
    value,
    onChange,
    placeholder,
    disabled
}: {
    value: number | '' | string | undefined;
    onChange: (v: number | '') => void;
    placeholder?: string;
    disabled?: boolean;
}) {
    const [local, setLocal] = useState<string>(value === '' || value === undefined ? '' : String(value));

    useEffect(() => {
        setLocal(value === '' || value === undefined ? '' : String(value));
    }, [value]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value;

        // allow empty
        if (raw.trim() === '') {
            setLocal('');
            onChange('');
            return;
        }

        // Allow decimals
        if (!/^\d*\.?\d*$/.test(raw.trim())) {
            // If invalid char, just ignore (or could show error)
            return;
        }

        setLocal(raw);
        onChange(Number(raw));
    }

    return (
        <input
            className={`w-[100px] rounded border border-gray-300 px-2 py-1 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'}`}
            placeholder={placeholder ?? '0.00'}
            value={local}
            onChange={handleChange}
            disabled={disabled}
        />
    );
}

/* ============================================
   buildSalaryEntryColumns
   returns ColumnDef<EmployeeDropdown>[]
   ============================================ */
export function buildSalaryEntryColumns(
    earningHeads: SalaryHeadMeta[],
    deductionHeads: SalaryHeadMeta[],
    onUpdateAmount: (employeeId: number, headId: number, isEarning: boolean, newAmount: number | '') => void,
    selectedIds: number[],
    onSelectionChange: (ids: number[]) => void,
    allIds: number[] // for select all
): ColumnDef<EmployeeDropdown>[] {
    const isAllSelected = allIds.length > 0 && selectedIds.length === allIds.length;
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < allIds.length;

    const base: ColumnDef<EmployeeDropdown>[] = [
        {
            id: 'select',
            header: () => (
                <div className='flex items-center justify-center'>
                    <Checkbox
                        checked={isAllSelected || (isIndeterminate && 'indeterminate')}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                onSelectionChange(allIds);
                            } else {
                                onSelectionChange([]);
                            }
                        }}
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className='flex items-center justify-center'>
                    <Checkbox
                        checked={selectedIds.includes(row.original.HRME_Id)}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                onSelectionChange([...selectedIds, row.original.HRME_Id]);
                            } else {
                                onSelectionChange(selectedIds.filter(id => id !== row.original.HRME_Id));
                            }
                        }}
                    />
                </div>
            ),
            enableSorting: false,
            size: 40
        },
        {
            id: 'slNo',
            header: ({ column }) => <DataTableColumnHeader column={column} title='SL NO' />,
            cell: ({ row, table }) => {
                const page = table.getState().pagination.pageIndex;
                const size = table.getState().pagination.pageSize;
                return <span className='pl-2'>{page * size + row.index + 1}</span>;
            },
            enableSorting: false,
            size: 60
        },
        {
            accessorKey: 'HRME_EmployeeCode',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Code' />,
            cell: ({ row }) => <span className='font-medium'>{row.original.HRME_EmployeeCode}</span>,
            size: 100
        },
        {
            accessorKey: 'employeeName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
            cell: ({ row }) => {
                const fullName = [
                    row.original.HRME_EmployeeFirstName,
                    row.original.HRME_EmployeeMiddleName,
                    row.original.HRME_EmployeeLastName
                ]
                    .filter(Boolean)
                    .join(' ');
                return <span className='font-semibold uppercase'>{fullName}</span>;
            },
            size: 200
        }
    ];

    // --- EARNINGS GROUP ---
    if (earningHeads.length > 0) {
        const earningGroup: ColumnDef<EmployeeDropdown> = {
            id: 'earnings_group',
            header: () => (
                <div className='bg-green-600 text-center text-white'>
                    <div className='px-2 py-1 font-semibold text-xs'>EARNINGS</div>
                </div>
            ),
            columns: earningHeads.map((head) => ({
                id: `earning_${head.headId}`,
                header: () => (
                    <div
                        className='bg-green-600 text-center text-white'
                        style={{ borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                        <div className='px-2 py-1 font-semibold text-xs'>{head.headName}</div>
                    </div>
                ),
                cell: ({ row }) => {
                    const emp = row.original;
                    // Find existing amount for this head
                    const found = emp.earningResult?.find((e) => e.HRMED_Id === head.headId);
                    const val = found ? found.HREED_Amount : '';
                    const isSelected = selectedIds.includes(emp.HRME_Id);

                    return (
                        <div className='flex justify-center px-1 py-1'>
                            <AmountInputCell
                                value={val}
                                onChange={(newVal) => onUpdateAmount(emp.HRME_Id, head.headId, true, newVal)}
                                disabled={!isSelected}
                            />
                        </div>
                    );
                },
                enableSorting: false,
                size: 120
            }))
        };
        base.push(earningGroup);
    }

    // --- DEDUCTIONS GROUP ---
    if (deductionHeads.length > 0) {
        const deductionGroup: ColumnDef<EmployeeDropdown> = {
            id: 'deductions_group',
            header: () => (
                <div className='bg-red-600 text-center text-white'>
                    <div className='px-2 py-1 font-semibold text-xs'>DEDUCTIONS</div>
                </div>
            ),
            columns: deductionHeads.map((head) => ({
                id: `deduction_${head.headId}`,
                header: () => (
                    <div
                        className='bg-red-600 text-center text-white'
                        style={{ borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                        <div className='px-2 py-1 font-semibold text-xs'>{head.headName}</div>
                    </div>
                ),
                cell: ({ row }) => {
                    const emp = row.original;
                    // Find existing amount for this head
                    const found = emp.deductionResult?.find((d) => d.HRMED_Id === head.headId);
                    const val = found ? found.HREED_Amount : '';
                    const isSelected = selectedIds.includes(emp.HRME_Id);

                    return (
                        <div className='flex justify-center px-1 py-1'>
                            <AmountInputCell
                                value={val}
                                onChange={(newVal) => onUpdateAmount(emp.HRME_Id, head.headId, false, newVal)}
                                disabled={!isSelected}
                            />
                        </div>
                    );
                },
                enableSorting: false,
                size: 120
            }))
        };
        base.push(deductionGroup);
    }

    return base;
}

import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { IPromotionRemarksGrid } from '@/types/exam/exam-module/exam-mapping';
import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

export const PromotionRemarksColumns = (
    updateStudent: (id: number, remarks: string) => void,
    validationErrors: Record<number, string>
): ColumnDef<IPromotionRemarksGrid>[] => [
    // SELECT
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
        enableSorting: false,
        size: 24
    },

    // SL.NO
    {
        accessorKey: 'slNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SLNO' />,
        cell: ({ row, table }) => {
            const page = table.getState().pagination.pageIndex;
            const size = table.getState().pagination.pageSize;
            return <span>{page * size + row.index + 1}</span>;
        },
        enableSorting: false
    },

    // ADM.NO
    {
        accessorKey: 'admNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Admission No' />,
        cell: ({ row }) => <span>{row.original.admNo}</span>
    },

    // STUDENT NAME
    {
        accessorKey: 'studentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
        cell: ({ row }) => <span className='font-semibold uppercase'>{row.original.studentName}</span>,
        enableSorting: false
    },
    {
        accessorKey: 'remarks',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Remarks' />,
        cell: ({ row }) => {
            const { studentId, remarks } = row.original;
            const isSelected = row.getIsSelected();

            // Local state inside the cell
            const [localValue, setLocalValue] = useState(remarks ?? '');

            // Sync when table reloads / pagination changes
            useEffect(() => {
                setLocalValue(remarks ?? '');
            }, [remarks]);

            const OPTIONS = ['Good', 'Very Good', 'Excellent', 'Outstanding'];

            // Handler for when the select value changes
            const handleChange = (value: string) => {
                setLocalValue(value);
                updateStudent(studentId, value); // call update immediately on change
            };

            const errorMessage = validationErrors[studentId];

            return (
                <div className='space-y-1'>
                    <Select
                        value={localValue}
                        onValueChange={handleChange} // no onBlur needed
                    >
                        <SelectTrigger
                            className={`w-[250px] border bg-white ${errorMessage ? 'border-red-500 hover:border-red-600' : 'border-blue-400 focus-visible:ring-blue-500'}`}>
                            <SelectValue placeholder='--Select--' />
                        </SelectTrigger>

                        <SelectContent>
                            {OPTIONS.map((o) => (
                                <SelectItem key={o} value={o}>
                                    {o}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errorMessage && (
                        <p className='fade-in slide-in-from-top-1 animate-in font-medium text-[10px] text-red-500'>{errorMessage}</p>
                    )}
                </div>
            );
        },
        enableSorting: false
    }
];

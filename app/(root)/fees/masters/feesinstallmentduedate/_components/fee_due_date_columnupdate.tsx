'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IMasterFeesInstallmentDueDateList } from '@/types/fees/masters';
import type { ColumnDef } from '@tanstack/react-table';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

function CalendarCell({
    row,
    field,
    minDate, // Add this prop
    maxDate
}: {
    row: any;
    field: keyof IMasterFeesInstallmentDueDateList;
    minDate?: Date | null; // Add this
    maxDate?: Date | null;
}) {
    const fdateRaw = row.original.fdate;
    const tdateRaw = row.original.tdate;

    const fromDate = fdateRaw && fdateRaw !== '0001-01-01T00:00:00' ? new Date(fdateRaw) : undefined;
    const toDate = tdateRaw && tdateRaw !== '0001-01-01T00:00:00' ? new Date(tdateRaw) : undefined;

    const rawValue = row.original[field];
    const initialValue = rawValue && rawValue !== '0001-01-01T00:00:00' ? new Date(rawValue) : undefined;

    const [date, setDate] = useState<Date | undefined>(initialValue);

    useEffect(() => {
        let newDate = initialValue;

        if (field === 'tdate' && fromDate) {
            if (!newDate || newDate <= fromDate) {
                newDate = new Date(fromDate);
                newDate.setDate(newDate.getDate() + 1);
            }
        }

        if (field === 'ddate' && fromDate) {
            if (!newDate || newDate <= fromDate) {
                newDate = new Date(fromDate);
                newDate.setDate(newDate.getDate() + 1);
            }
        }

        if (field === 'aplc' && fromDate) {
            const maxDate = toDate || new Date();
            if (!newDate || newDate < fromDate) newDate = fromDate;
            if (newDate > maxDate) newDate = maxDate;
        }

        if (minDate && newDate && newDate < minDate) {
            newDate = minDate;
        }
        if (maxDate && newDate && newDate > maxDate) {
            newDate = maxDate;
        }

        // Only update if different from current state
        if ((newDate && !date) || (!newDate && date) || (newDate && date && newDate.getTime() !== date.getTime())) {
            setDate(newDate);
        }
    }, [initialValue, fromDate, toDate, field, date, minDate, maxDate]);

    // Calendar boundaries
    let fromDateProp: Date | undefined;
    let toDateProp: Date | undefined;

    if (field === 'tdate' && fromDate) {
        const d = new Date(fromDate);
        d.setDate(d.getDate() + 1);
        fromDateProp = d;
    }

    if (field === 'aplc' && fromDate) {
        fromDateProp = fromDate;
        toDateProp = toDate || new Date();
    }

    if (field === 'ddate' && fromDate) {
        const d = new Date(fromDate);
        d.setDate(d.getDate() + 1);
        fromDateProp = d;
    }

    const applyGlobalBoundaries = (dateProp: Date | undefined, isFromDate: boolean): Date | undefined => {
        // If no global boundaries, return original
        if (!minDate && !maxDate) return dateProp;

        // Handle "from date" case
        if (isFromDate) {
            if (dateProp && minDate) {
                return dateProp > minDate ? dateProp : minDate;
            }
            return dateProp || minDate || undefined;
        }

        // Handle "to date" case
        if (dateProp && maxDate) {
            return dateProp < maxDate ? dateProp : maxDate;
        }
        return dateProp || maxDate || undefined;
    };

    // ▼▼▼ APPLY THE BOUNDARIES ▼▼▼
    fromDateProp = applyGlobalBoundaries(fromDateProp, true);
    toDateProp = applyGlobalBoundaries(toDateProp, false);

    const handleSelect = (selected: Date | undefined) => {
        if (!selected) {
            setDate(undefined);
            row.original[field] = null;
            return;
        }

        // Validation
        if (field === 'tdate' && fromDate && selected <= fromDate) return;
        if (field === 'ddate' && fromDate && selected <= fromDate) return;
        if (field === 'aplc' && fromDate) {
            const maxDate = toDate || new Date();
            if (selected < fromDate || selected > maxDate) return;
        }

        //selected.setHours(0, 0, 0, 0);
        // row.original[field] = selected.toISOString();
        // setDate(selected);

        selected.setHours(0, 0, 0, 0);

        const yyyy = selected.getFullYear();
        const mm = String(selected.getMonth() + 1).padStart(2, '0');
        const dd = String(selected.getDate()).padStart(2, '0');

        // Save as local date (no timezone shift)
        const localDate = `${yyyy}-${mm}-${dd}`;

        row.original[field] = localDate;
        setDate(selected);
    };
    const formatDDMMYYYY = (date: Date) => {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className='flex cursor-pointer items-center gap-2 rounded-md border bg-white px-2 py-1'>
                    <CalendarIcon className='h-4 w-4 text-gray-500' />
                    {/* <span>{date ? date.toLocaleDateString() : '-'}</span> */}
                    <span>{date ? formatDDMMYYYY(date) : '-'}</span>
                </div>
            </PopoverTrigger>
            <PopoverContent className='p-0'>
                <Calendar mode='single' selected={date} onSelect={handleSelect} fromDate={fromDateProp} toDate={toDateProp} />
            </PopoverContent>
        </Popover>
    );
}

//export const masterFeeInstallmentDueDateUpdateColumn : ColumnDef<IMasterFeesInstallmentDueDateList>[] = [
export const masterFeeInstallmentDueDateUpdateColumn = (
    minDate?: Date | null,
    maxDate?: Date | null
): ColumnDef<IMasterFeesInstallmentDueDateList>[] => [
    {
        accessorKey: 'ftidD_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL NO' />,
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'ftI_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Installment Name' />,
        cell: ({ row }) => <div>{row.getValue('ftI_Name')}</div>
    },
    {
        accessorKey: 'fdate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Installment From Date' />,
        cell: ({ row }) => <CalendarCell row={row} field='fdate' minDate={minDate} maxDate={maxDate} />
    },
    {
        accessorKey: 'tdate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Installment To Date' />,
        cell: ({ row }) => <CalendarCell row={row} field='tdate' minDate={minDate} maxDate={maxDate} />
    },
    {
        accessorKey: 'aplc',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Installment Applicable' />,
        cell: ({ row }) => <CalendarCell row={row} field='aplc' minDate={minDate} maxDate={maxDate} />
    },
    {
        accessorKey: 'ddate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Installment Due Date' />,
        cell: ({ row }) => <CalendarCell row={row} field='ddate' minDate={minDate} maxDate={maxDate} />
    }
];

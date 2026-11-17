'use client';

import { Calendar } from '@/components/ui/calendar';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { IMasterFeesInstallmentDueDateList } from '@/types/fees/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

// function CalendarCell({
//     row,
//     field
// }: {
//     row: any;
//     field: keyof IMasterFeesInstallmentDueDateList;
// }) {
//     const rawValue = row.getValue(field);
//     const currentDate = rawValue && rawValue !== '0001-01-01T00:00:00' ? new Date(rawValue as string) : undefined;

//     const [date, setDate] = useState<Date | undefined>(currentDate);

//     useEffect(() => {
//         setDate(currentDate);
//     }, [currentDate, row.original.fdate, row.original.tdate]);

//     const getDate = (key: keyof IMasterFeesInstallmentDueDateList): Date | null => {
//         const val = row.original[key];
//         if (!val || val === '0001-01-01T00:00:00') return null;
//         const d = new Date(val as string);
//         return Number.isNaN(d.getTime()) ? null : d;
//     };

//     const fromDate = getDate('fdate');
//     const toDate = getDate('tdate');

//     let fromDateProp: Date | undefined;
//     let toDateProp: Date | undefined;
//     let defaultMonth: Date = date ?? new Date();

//     if (field === 'tdate' && fromDate) {
//         fromDateProp = new Date(fromDate);
//         fromDateProp.setDate(fromDate.getDate() + 1);
//         defaultMonth = fromDateProp;
//     }

//     if (field === 'aplc' && fromDate) {
//         fromDateProp = fromDate;
//         toDateProp = toDate ?? new Date();
//         defaultMonth = fromDate;
//     }

//     if (field === 'ddate' && fromDate) {

//         fromDateProp = new Date(fromDate);
//         fromDateProp.setDate(fromDate.getDate() + 1);
//         defaultMonth = fromDateProp;
//     }

//     const handleSelect = (selected: Date | undefined) => {
//         if (!selected) {
//             setDate(undefined);
//             row.original[field] = null;
//             return;
//         }

//         if (field === 'tdate' && fromDate && selected <= fromDate) return;
//         if (field === 'ddate' && fromDate && selected <= fromDate) return;
//         if (field === 'aplc' && fromDate) {
//             const maxDate = toDate ?? new Date();
//             if (selected < fromDate || selected > maxDate) return;
//         }

//         selected.setHours(0, 0, 0, 0);
//         setDate(selected);
//         row.original[field] = selected.toISOString();
//     };

//     return (
//         <Popover>
//             <PopoverTrigger asChild>
//                 <Button variant='ghost' className={cn('h-9 w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}>
//                     <CalendarIcon className='mr-2 h-4 w-4' />
//                     {date ? format(date, 'dd/MM/yyyy') : <span>Pick date</span>}
//                 </Button>
//             </PopoverTrigger>

//             <PopoverContent className='w-auto p-0' align='start'>
//                 <Calendar
//                     mode='single'
//                     selected={date}
//                     onSelect={handleSelect}
//                     fromDate={fromDateProp}
//                     toDate={toDateProp}
//                     defaultMonth={defaultMonth}
//                     initialFocus
//                 />
//             </PopoverContent>
//         </Popover>
//     );
// }

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
    console.log('minDate', minDate, 'maxDate', maxDate);
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

    // Applies global boundaries without breaking field logic
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

        // selected.setHours(0, 0, 0, 0);
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

// --- Column definitions ---
export const masterFeeInstallmentDueDateColumn = (
    minDate?: Date | null,
    maxDate?: Date | null
): ColumnDef<IMasterFeesInstallmentDueDateList>[] => [
    {
        accessorKey: 'ftidD_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL NO' />,
        cell: ({ row }) => <div className='text-center font-medium'>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'ftI_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Installment Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('ftI_Name')}</div>
    },
    {
        accessorKey: 'fdate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='From Date' />,
        cell: ({ row }) => <CalendarCell row={row} field='fdate' minDate={minDate} maxDate={maxDate} />
    },
    {
        accessorKey: 'tdate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='To Date' />,
        cell: ({ row }) => <CalendarCell row={row} field='tdate' minDate={minDate} maxDate={maxDate} />
    },
    {
        accessorKey: 'aplc',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Applicable Date' />,
        cell: ({ row }) => <CalendarCell row={row} field='aplc' minDate={minDate} maxDate={maxDate} />
    },
    {
        accessorKey: 'ddate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Due Date' />,
        cell: ({ row }) => <CalendarCell row={row} field='ddate' minDate={minDate} maxDate={maxDate} />
    }
];

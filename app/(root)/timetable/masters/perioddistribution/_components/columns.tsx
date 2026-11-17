'use client';
import type { PeriodDistributionColumn } from '@/types/timetable/masters/masters';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';

import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const createPeriodDistributionColumns: ColumnDef<PeriodDistributionColumn>[] = [
    {
        accessorKey: 'ttfpD_Id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Academic Year' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'staffName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Staff Name' />,
        cell: ({ row }) => <div>{row.getValue('staffName')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'ttfpD_TotWeekPeriods',
        header: ({ column }) => <DataTableColumnHeader column={column} title='No Of Periods' />,
        cell: ({ row }) => <div>{row.getValue('ttfpD_TotWeekPeriods')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />
    }
];

function ActionButtonsCell({ rowData }: { rowData: PeriodDistributionColumn }) {
    const { openToggleForm } = useFormContext<PeriodDistributionColumn>();

    const handleToggle = useCallback(
        (data: PeriodDistributionColumn) => {
            openToggleForm(data);
        },
        [openToggleForm]
    );

    return <ActionButtons rowData={rowData} buttons={{ toggle: true }} onToggle={handleToggle} toggleConditionKey='ttfpD_ActiveFlag' />;
}

// 'use client';
// import { Button } from '@/components/ui/button';
// import { Switch } from '@/components/ui/switch';
// import type { PeriodDistributionColumn } from '@/types/timetable/masters/masters';
// import type { ColumnDef } from '@tanstack/react-table';
// import { ArrowUpDown, Eye, Pencil } from 'lucide-react';

// interface PeriodDistributionColumnsProps {
//     onEdit: (data: PeriodDistributionColumn) => void;
//     onDelete: (data: PeriodDistributionColumn) => void;
//     onToggleActive: (data: PeriodDistributionColumn) => void;
//     onView?: (data: PeriodDistributionColumn) => void;
// }

// export const createPeriodDistributionColumns = ({
//     onEdit,
//     onDelete,
//     onToggleActive,
//     onView
// }: PeriodDistributionColumnsProps): ColumnDef<PeriodDistributionColumn>[] => [
//     {
//         id: 'index',
//         header: 'SL NO',
//         cell: ({ row }) => <div>{row.index + 1}</div>,
//         size: 80
//     },
//     {
//         accessorKey: 'asmaY_Year',
//         header: ({ column }) => {
//             return (
//                 <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                     Academic Year
//                     <ArrowUpDown className='ml-2 h-4 w-4' />
//                 </Button>
//             );
//         }
//     },
//     {
//         accessorKey: 'staffName',
//         header: ({ column }) => {
//             return (
//                 <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                     Staff Name
//                     <ArrowUpDown className='ml-2 h-4 w-4' />
//                 </Button>
//             );
//         }
//     },
//     {
//         accessorKey: 'ttfpD_TotWeekPeriods',
//         header: ({ column }) => {
//             return (
//                 <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                     No Of Periods
//                     <ArrowUpDown className='ml-2 h-4 w-4' />
//                 </Button>
//             );
//         }
//     },
//     {
//         id: 'actions',
//         header: 'Actions',
//         cell: ({ row }) => {
//             return (
//                 <div className='flex items-center gap-2'>
//                     <Button variant='ghost' size='icon' onClick={() => onView?.(row.original)} title='View Details'>
//                         <Eye className='h-4 w-4 text-purple-600' />
//                     </Button>
//                     <Button variant='ghost' size='icon' onClick={() => onEdit(row.original)} title='Edit'>
//                         <Pencil className='h-4 w-4 text-primary' />
//                     </Button>
//                     <div className='flex items-center space-x-2'>
//                         <Switch
//                             checked={row.original.ttfpD_ActiveFlag}
//                             onCheckedChange={() => onToggleActive(row.original)}
//                             className={
//                                 row.original.ttfpD_ActiveFlag ? 'data-[state=checked]:bg-green-500' : 'data-[state=unchecked]:bg-red-500'
//                             }
//                         />
//                     </div>
//                 </div>
//             );
//         }
//     }
// ];

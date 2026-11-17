// _components/columns.tsx
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IFeeAnalysisData } from '@/types/student-portal/masters/cumulative-fee-analysis';
import type { ColumnDef } from '@tanstack/react-table';

export const feeCumulativeColumns: ColumnDef<IFeeAnalysisData>[] = [
    {
        accessorKey: 'asmaY_Year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='ACADEMIC YEAR' />,
        cell: ({ row }) => <div>{row.getValue('asmaY_Year')}</div>
    },
    {
        accessorKey: 'receivable',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SCHOOL RECEIVABLE' />,
        cell: ({ row }) => <div>{row.getValue('receivable')}</div>
    },
    {
        accessorKey: 'concession',
        header: ({ column }) => <DataTableColumnHeader column={column} title='CONCESSION' />,
        cell: ({ row }) => <div>{row.getValue('concession')}</div>
    },
    {
        accessorKey: 'collection',
        header: ({ column }) => <DataTableColumnHeader column={column} title='COLLECTION' />,
        cell: ({ row }) => <div>{row.getValue('collection')}</div>
    },
    {
        accessorKey: 'adjusted',
        header: ({ column }) => <DataTableColumnHeader column={column} title='ADJUSTMENT' />,
        cell: ({ row }) => <div>{row.getValue('adjusted')}</div>
    },
    {
        accessorKey: 'balance',
        header: ({ column }) => <DataTableColumnHeader column={column} title='BALANCE' />,
        cell: ({ row }) => <div>{row.getValue('balance')}</div>
    }
];

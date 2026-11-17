// _components/columns.tsx
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IFeeDetailsData } from '@/types/student-portal/masters/cumulative-fee-analysis';
import type { ColumnDef } from '@tanstack/react-table';

export const concessionColumns: ColumnDef<IFeeDetailsData>[] = [
    {
        accessorKey: 'fmH_FeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='FEE HEAD' />,
        cell: ({ row }) => <div>{row.getValue('fmH_FeeName')}</div>
    },
    {
        accessorKey: 'ftI_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='TERM' />,
        cell: ({ row }) => <div>{row.getValue('ftI_Name')}</div>
    },
    {
        accessorKey: 'fsS_CurrentYrCharges',
        header: ({ column }) => <DataTableColumnHeader column={column} title='NET AMOUNT' />,
        cell: ({ row }) => <div>{row.getValue('fsS_CurrentYrCharges')}</div>
    },
    {
        accessorKey: 'fsS_ConcessionAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='CONCESSION' />,
        cell: ({ row }) => <div>{row.getValue('fsS_ConcessionAmount')}</div>
    },
    {
        accessorKey: 'fsS_PaidAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='PAID' />,
        cell: ({ row }) => <div>{row.getValue('fsS_PaidAmount')}</div>
    },
    {
        accessorKey: 'fsS_ToBePaid',
        header: ({ column }) => <DataTableColumnHeader column={column} title='BALANCE' />,
        cell: ({ row }) => <div>{row.getValue('fsS_ToBePaid')}</div>
    }
];

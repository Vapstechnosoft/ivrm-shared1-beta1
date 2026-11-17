import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { OpeningBalanceRow } from '@/types/fees/transactions/transactions';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

export const openingBalanceColumns: ColumnDef<OpeningBalanceRow>[] = [
    // {
    //     accessorKey: 'asmay_id',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
    //     cell: ({ row, table }) => {
    //         const pageIndex = table.getState().pagination.pageIndex;
    //         const pageSize = table.getState().pagination.pageSize;
    //         return <div className='text-center font-medium'>{pageIndex * pageSize + row.index + 1}</div>;
    //     },
    //     enableSorting: false,
    //     enableHiding: false
    // },
    {
        accessorKey: 'fmoB_Id',
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
    // {
    //     accessorKey: 'fullName',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
    //     cell: ({ row }) => {
    //         const { amsT_FirstName = '', amsT_MiddleName = '', amsT_LastName = '' } = row.original;
    //         const fullName = [amsT_FirstName, amsT_MiddleName, amsT_LastName].filter(Boolean).join(' ');
    //         return <div className='font-medium'>{fullName || '—'}</div>;
    //     }
    // },
    // {
    //     accessorFn: (row) => [row.amsT_FirstName, row.amsT_MiddleName, row.amsT_LastName].filter(Boolean).join(' '),
    //     id: 'studentName',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
    //     cell: ({ row }) => row.getValue('studentName')
    // },
    {
        accessorKey: 'studentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
        cell: ({ row }) => <div>{row.getValue('studentName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    // {
    //     accessorKey: 'asmcL_ClassName',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title='Class - Section' />,
    //     cell: ({ row }) => {
    //         const { asmcL_ClassName = '', asmC_SectionName = '' } = row.original;
    //         return (
    //             <div>
    //                 {asmcL_ClassName} {asmC_SectionName && `- ${asmC_SectionName}`}
    //             </div>
    //         );
    //     }
    // },
    // {
    //     accessorFn: (row) => `${row.asmcL_ClassName ?? ''}${row.asmC_SectionName ? ' - ' + row.asmC_SectionName : ''}`,
    //     id: 'classSection',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title='Class - Section' />,
    //     cell: ({ row }) => row.getValue('classSection')
    // },
    {
        accessorKey: 'asmcL_ClassName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class Name' />,
        cell: ({ row }) => <div>{row.getValue('asmcL_ClassName')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'asmC_SectionName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Section Name' />,
        cell: ({ row }) => <div>{row.getValue('asmC_SectionName')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'fmoB_Student_Due',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Due' />,
        cell: ({ row }) => {
            const value = row.original.fmoB_Student_Due ?? 0;
            return <div>₹{value.toLocaleString()}</div>;
        }
    },
    {
        accessorKey: 'fmoB_Institution_Due',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Institution Due' />,
        cell: ({ row }) => {
            const value = row.original.fmoB_Institution_Due ?? 0;
            return <div>₹{value.toLocaleString()}</div>;
        }
    },
    {
        id: 'actions',
        header: () => <div className='text-center'>Actions</div>,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false
    }
];

function ActionButtonsCell({ rowData }: { rowData: OpeningBalanceRow }) {
    const { openToggleForm, openDeleteForm } = useFormContext<OpeningBalanceRow>();

    const handleToggle = useCallback(() => openToggleForm(rowData), [rowData, openToggleForm]);
    const handleDelete = useCallback(() => openDeleteForm(rowData), [rowData, openDeleteForm]);

    const hasRecord = !!(rowData.fmC_Id || rowData.fmoB_Id);

    return (
        <div className='flex justify-center gap-2'>
            <ActionButtons
                rowData={rowData}
                buttons={{
                    edit: false,
                    toggle: !hasRecord,
                    delete: hasRecord
                }}
                onToggle={handleToggle}
                onDelete={handleDelete}
            />
        </div>
    );
}

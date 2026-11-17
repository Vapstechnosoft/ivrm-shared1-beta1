// _components/columns.tsx
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IFeeConcessionStudentConcessionGrid } from '@/types/fees/transactions/transactions';
import type { ColumnDef } from '@tanstack/react-table';

export const concessionColumns: ColumnDef<IFeeConcessionStudentConcessionGrid>[] = [
    {
        accessorKey: 'slno',
        header: ({ column }) => <DataTableColumnHeader column={column} title='S.No' />,
        cell: ({ row }) => <div className='text-center font-medium'>{row.original.slno}</div>,
        size: 80,
        enableSorting: false
    },
    {
        accessorKey: 'studentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.original.studentName || '—'}</div>,
        size: 250
    },
    {
        accessorKey: 'amsT_AdmNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Adm No' />,
        cell: ({ row }) => <div className='text-center'>{row.original.amsT_AdmNo || '—'}</div>,
        size: 120
    },
    {
        accessorKey: 'asmcL_ClassName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
        cell: ({ row }) => <div>{row.original.asmcL_ClassName || '—'}</div>,
        size: 140
    },
    {
        accessorKey: 'fmG_GroupName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Group/Term' />,
        cell: ({ row }) => <div>{row.original.fmG_GroupName || '—'}</div>,
        size: 160
    },
    {
        accessorKey: 'fmH_FeeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Head' />,
        cell: ({ row }) => <div>{row.original.fmH_FeeName || '—'}</div>,
        size: 180
    },
    {
        accessorKey: 'ftI_Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Installment' />,
        cell: ({ row }) => <div>{row.original.ftI_Name || '—'}</div>,
        size: 140
    },
    {
        accessorKey: 'fmcC_ConcessionName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Concession' />,
        cell: ({ row }) => <div>{row.original.fmcC_ConcessionName || '—'}</div>,
        size: 200
    },
    {
        accessorKey: 'fsC_ConcessionAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Amount' />,
        cell: ({ row }) => {
            const amount = row.original.fsC_ConcessionAmount || 0;
            return <div>₹{amount.toLocaleString('en-IN')}</div>;
        },
        size: 140
    },
    {
        id: 'actions',
        header: () => <div className='text-center'>Actions</div>,
        cell: ({ row }) => <ActionButtonsCell rowData={row.original} />,
        enableSorting: false,
        size: 100,
        meta: { align: 'center' }
    }
];

// _components/columns.tsx

const ActionButtonsCell = ({ rowData }: { rowData: IFeeConcessionStudentConcessionGrid }) => {
    const { openEditForm, openDeleteForm } = useFormContext<IFeeConcessionStudentConcessionGrid>();

    const handleEdit = () => openEditForm(rowData);
    const handleDelete = () => openDeleteForm(rowData);

    return (
        <div className='flex justify-center gap-1'>
            <ActionButtons rowData={rowData} buttons={{ edit: true, delete: true }} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
};

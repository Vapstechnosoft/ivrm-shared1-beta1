import { Checkbox } from '@/components/ui/checkbox';
import type { IStudent } from '@/types/alumni/user-password-creation';
import type { ColumnDef } from '@tanstack/react-table';

export const userPasswordCreationColumns: ColumnDef<IStudent>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'sno',
        header: 'SNO',
        cell: ({ row }) => row.index + 1
    },
    {
        accessorKey: 'studentname',
        header: 'NAME',
        cell: ({ row }) => <span className='uppercase'>{row.original.studentname}</span>
    },
    {
        accessorKey: 'amst_admno',
        header: 'ADMISSION NUMBER'
    },
    {
        accessorKey: 'asmcl_classname',
        header: 'CLASS'
    },
    {
        accessorKey: 'asmc_sectionname',
        header: 'SECTION'
    }
];

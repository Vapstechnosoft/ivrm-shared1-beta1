'use client';

import { Checkbox } from '@/components/ui/checkbox';
import type { ICredentialStudent } from '@/types/alumni/student-password-creation';
import type { ColumnDef } from '@tanstack/react-table';

export const getStudentPasswordCreationColumns = (
    onResetPassword: (student: ICredentialStudent) => void
): ColumnDef<ICredentialStudent>[] => [
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
        accessorKey: 'studentname',
        header: 'NAME'
    },
    {
        accessorKey: 'amsT_AdmNo',
        header: 'ADMISSION NUMBER'
    },
    {
        accessorKey: 'username',
        header: 'USER NAME'
    },
    {
        accessorKey: 'password',
        header: 'PASSWORD'
    },
    {
        accessorKey: 'asmcL_ClassName',
        header: 'CLASS'
    },
    {
        accessorKey: 'asmC_SectionName',
        header: 'SECTION'
    },
    {
        accessorKey: 'amsT_MobileNo',
        header: 'MOBILE NO'
    },
    {
        accessorKey: 'amsT_emailId',
        header: 'EMAIL ID'
    }
    // ,
    // {
    //     id: 'actions',
    //     header: 'RESET',
    //     cell: ({ row }) => {
    //         const student = row.original;
    //         return (
    //             <Button
    //                 variant="outline"
    //                 size="icon"
    //                 className="h-8 w-8 rounded-full"
    //                 onClick={() => onResetPassword(student)}
    //                 disabled={!row.getIsSelected()}
    //             >
    //                 <RefreshCw className="h-4 w-4" />
    //             </Button>
    //         );
    //     },
    // },
];

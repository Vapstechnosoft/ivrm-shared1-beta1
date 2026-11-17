'use client';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';

interface ParticipantTableProps {
    data: any[];
    type: string;
    selectedRows: any[];
    onRowSelectionChange: (rows: any[]) => void;
    isLoading: boolean;
}

export default function ParticipantTable({ data, type, selectedRows, onRowSelectionChange, isLoading }: ParticipantTableProps) {
    const columns = [
        {
            id: 'select',
            header: ({ table }: { table: any }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label='Select all'
                />
            ),
            cell: ({ row }: { row: any }) => (
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />
            ),
            enableSorting: false,
            enableHiding: false
        },
        {
            header: 'Name',
            accessorKey: type === 'Staff' ? 'employeeName' : 'studentName',
            cell: ({ row }: { row: any }) => (
                <div className='font-medium'>{type === 'Staff' ? row.original.employeeName : row.original.studentName}</div>
            )
        },
        {
            header: type === 'Staff' ? 'Department' : 'Class',
            accessorKey: type === 'Staff' ? 'hrmD_DepartmentName' : 'asmcL_ClassName',
            cell: ({ row }: { row: any }) => (
                <Badge variant='outline'>{type === 'Staff' ? row.original.hrmD_DepartmentName : row.original.asmcL_ClassName}</Badge>
            )
        },
        {
            header: 'Mobile No',
            accessorKey: type === 'Staff' ? 'hrmE_MobileNo' : 'amsT_MobileNo'
        },
        {
            header: 'Email ID',
            accessorKey: type === 'Staff' ? 'hrmE_EmailId' : 'amsT_emailId'
        },
        {
            header: 'Date of Birth',
            accessorKey: type === 'Staff' ? 'hrmE_DOB' : 'amst_dob',
            cell: ({ row }: { row: any }) => {
                const date = type === 'Staff' ? row.original.hrmE_DOB : row.original.amst_dob;
                return date ? new Date(date).toLocaleDateString('en-GB') : '-';
            }
        }
    ];

    return (
        <GenericDataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            onRowSelectionChange={onRowSelectionChange}
            maxSelectableRows={0} // No limit
        />
    );
}

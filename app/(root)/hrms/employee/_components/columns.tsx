'use client';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { IEmployeeList } from '@/types/hrms/hrms-config/employee';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { ActionsCell } from './actions-cell';
export const employeeColumns: ColumnDef<IEmployeeList>[] = [
    {
        id: 'slNo',
        header: 'Sl No',
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div className='w-[50px] text-center'>{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'hrmE_EmployeeFirstName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='First Name' />,
        cell: ({ row }) => {
            const firstName = row.getValue('hrmE_EmployeeFirstName') as string;
            return <div>{firstName || '-'}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'hrmE_EmployeeMiddleName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Middle Name' />,
        cell: ({ row }) => {
            const middleName = row.getValue('hrmE_EmployeeMiddleName') as string | null;
            return <div>{middleName || '-'}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'hrmE_EmployeeLastName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Last Name' />,
        cell: ({ row }) => {
            const lastName = row.getValue('hrmE_EmployeeLastName') as string;
            return <div>{lastName || '-'}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'hrmE_EmployeeCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Code' />,
        cell: ({ row }) => {
            const code = row.getValue('hrmE_EmployeeCode') as string;
            return <div className='font-medium'>{code || '-'}</div>;
        },
        enableSorting: true
    },
    {
        id: 'employeePhoto',
        header: 'Employee Photo',
        cell: ({ row }) => {
            const photoUrl = row.original.hrmE_Photo;
            const firstName = row.original.hrmE_EmployeeFirstName;
            const lastName = row.original.hrmE_EmployeeLastName;
            const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
            return (
                <div className='flex items-center gap-2'>
                    <div className='relative h-10 w-10'>
                        {photoUrl ? (
                            <>
                                <img
                                    src={photoUrl}
                                    alt={`${firstName} ${lastName}`}
                                    className='h-10 w-10 rounded-full object-cover'
                                    onError={(e) => {
                                        // Show initials fallback on error
                                        const target = e.target as HTMLImageElement;
                                        const parent = target.parentElement;
                                        if (parent) {
                                            const fallback = parent.querySelector('.initials-fallback') as HTMLDivElement;
                                            if (fallback) {
                                                target.style.display = 'none';
                                                fallback.style.display = 'flex';
                                            }
                                        }
                                    }}
                                />
                                <div className='initials-fallback absolute inset-0 hidden h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-sm'>
                                    {initials || '?'}
                                </div>
                            </>
                        ) : (
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-sm'>
                                {initials || '?'}
                            </div>
                        )}
                    </div>
                    <button
                        type='button'
                        className='text-primary text-xs hover:underline'
                        onClick={() => {
                            if (photoUrl) {
                                window.open(photoUrl, '_blank');
                            }
                        }}
                        disabled={!photoUrl}>
                        Download
                    </button>
                </div>
            );
        },
        enableSorting: false
    },
    {
        accessorKey: 'hrmE_EmployeeOrder',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Order' />,
        cell: ({ row }) => {
            const order = row.original.hrmE_EmployeeOrder || 0;
            return <div className='text-center'>{order || '-'}</div>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'hrmE_ActiveFlag',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const isActive = row.getValue('hrmE_ActiveFlag') as boolean;
            return (
                <div className='flex justify-center'>
                    <Badge variant={isActive ? 'success' : 'destructive'}>
                        {isActive ? 'Active' : 'Deactive'}
                    </Badge>
                </div>
            );
        },
        enableSorting: true
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ActionsCell row={row} />
    }
];

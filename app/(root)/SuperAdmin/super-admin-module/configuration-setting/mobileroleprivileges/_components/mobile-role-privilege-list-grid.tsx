'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table/data-table';
import type { IMobilePrivilegeRecord } from '@/types/super-admin/configuration-setting/mobileroleprivileges';
import type { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { useMemo } from 'react';

interface MobileRolePrivilegeListGridProps {
    data: IMobilePrivilegeRecord[];
    totalCount: number;
    onDelete: (item: IMobilePrivilegeRecord) => void;
    isLoading?: boolean;
}

export function MobileRolePrivilegeListGrid({ data, totalCount, onDelete, isLoading }: MobileRolePrivilegeListGridProps) {
    const columns: ColumnDef<IMobilePrivilegeRecord>[] = useMemo(
        () => [
            {
                id: 'sno',
                header: 'SL.NO',
                cell: ({ row }) => row.index + 1 // DataTable handles pagination context or we can add it if needed
            },
            {
                accessorKey: 'institutename',
                header: 'Institution'
            },
            {
                accessorKey: 'ivrmrT_Role',
                header: 'Role Name'
            },
            {
                accessorKey: 'ivrmmaP_AppPageName',
                header: 'Page Name'
            },
            {
                id: 'actions',
                header: 'Action',
                cell: ({ row }) => (
                    <div className='flex justify-center'>
                        <Button
                            variant='ghost'
                            size='sm'
                            className='text-red-500 transition-colors hover:bg-red-50 hover:text-red-700'
                            onClick={() => onDelete(row.original)}>
                            <Trash2 className='h-4 w-4' />
                        </Button>
                    </div>
                )
            }
        ],
        [onDelete]
    );

    return (
        <Card className='w-full border-[#7C3AED] border-t-4 shadow-xl transition-all duration-300 hover:shadow-2xl'>
            <CardHeader className='bg-slate-50/50 pb-4'>
                <CardTitle className='flex items-center font-bold text-slate-800 text-xl'>
                    <div className='mr-3 h-8 w-2 rounded-full bg-[#7C3AED]' />
                    Mobile APP Rolewise Module Page list
                </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
                <DataTable
                    columns={columns}
                    data={data}
                    totalItems={totalCount}
                    isLoading={isLoading}
                    isSearchRequired={true}
                    isPaginationRequired={true}
                />
            </CardContent>
        </Card>
    );
}

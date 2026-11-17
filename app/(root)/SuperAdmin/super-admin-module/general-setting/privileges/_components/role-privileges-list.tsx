'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { IRolePrivilegeMapping } from '@/types/super-admin/super-admin-module/general-setting/privileges';
import { Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { InputText } from '@/components/ui/extension/input-text';
import React from 'react';

interface RolePrivilegesListProps {
    data: IRolePrivilegeMapping[];
    onDelete?: (item: IRolePrivilegeMapping) => void;
    isLoading?: boolean;
    totalItems?: number;
    pagination?: {
        pageIndex: number;
        pageSize: number;
        onPageChange: (page: number) => void;
        onPageSizeChange: (size: number) => void;
    };
    onSearch?: (value: string) => void;
}

export function RolePrivilegesList({ data, onDelete, isLoading = true, totalItems, pagination = { pageIndex: 1, pageSize: 10, onPageChange: () => { }, onPageSizeChange: () => { } }, onSearch }: RolePrivilegesListProps) {
    const [searchTerm, setSearchTerm] = React.useState('');

    const columns: ColumnDef<IRolePrivilegeMapping>[] = [
        {
            id: 'serialNumber',
            header: 'SL.NO',
            cell: ({ row }) => {
                const pageIndex = pagination?.pageIndex || 1;
                const pageSize = pagination?.pageSize || 10;
                return <div>{(pageIndex - 1) * pageSize + row.index + 1}</div>;
            },
        },
        {
            accessorKey: 'ivrmrT_Role',
            header: 'Role Name',
        },
        {
            accessorKey: 'ivrmM_ModuleName',
            header: 'Module Page',
        },
        {
            accessorKey: 'ivrmmP_PageName',
            header: 'Page Name',
        },
        {
            id: 'actions',
            header: 'Delete',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDelete?.(item)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                );
            },
        },
    ];

    if (!data && !isLoading) return null;

    return (
        <div className="border rounded-md shadow-sm bg-white mb-4">
            <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold">Rolewise Module Page list</h3>
                <div className="w-64">
                    <InputText
                        placeholder="Search here..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            onSearch?.(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="p-4">
                <GenericDataTable
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                    totalItems={totalItems}
                    isPaginationRequired={true}
                />
            </div>
        </div>
    );
}

'use client';

import { InputText } from '@/components/ui/extension/input-text';
import { Checkbox } from '@/components/ui/checkbox';
import { IPrivilegePage } from '@/types/super-admin/super-admin-module/general-setting/privileges';
import { useState } from 'react';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { ColumnDef } from '@tanstack/react-table';

interface MasterPagesGridProps {
    data: IPrivilegePage[];
    onSelect: (item: IPrivilegePage, isChecked: boolean) => void;
}

export function MasterPagesGrid({ data, onSelect }: MasterPagesGridProps) {
    if (!data || data.length === 0) return null;

    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 10,
    });

    const filteredData = data.filter(item =>
        item.ivrmmP_PageName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedData = filteredData.slice(
        (pagination.pageIndex - 1) * pagination.pageSize,
        pagination.pageIndex * pagination.pageSize
    );

    const columns: ColumnDef<IPrivilegePage>[] = [
        {
            id: 'serialNumber',
            header: 'SL.NO',
            cell: ({ row }) => {
                return (
                    <div>
                        {(pagination.pageIndex - 1) * pagination.pageSize + row.index + 1}
                    </div>
                );
            },
        },
        {
            accessorKey: 'ivrmmP_PageName',
            header: 'Page Name',
        },
        {
            id: 'actions',
            header: 'Action',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex justify-center">
                        <label title="Add Cart" className="cursor-pointer">
                            <Checkbox
                                checked={item.checked || false}
                                onCheckedChange={(c) => onSelect(item, c as boolean)}
                            />
                        </label>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="border rounded-md shadow-sm bg-white mb-4">
            <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold">Master Pages</h3>
                <div className="w-64">
                    <InputText
                        placeholder="Search here..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPagination(prev => ({ ...prev, pageIndex: 1 }));
                        }}
                    />
                </div>
            </div>
           
        </div>
    );
}

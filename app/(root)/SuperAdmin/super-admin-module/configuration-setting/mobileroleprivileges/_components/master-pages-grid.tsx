'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { InputText } from '@/components/ui/extension/input-text';
import type { IMobileRolePrivilege } from '@/types/super-admin/configuration-setting/mobileroleprivileges';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

interface MasterPagesGridProps {
    data: IMobileRolePrivilege[];
    onSelect: (item: IMobileRolePrivilege, isChecked: boolean) => void;
}

export function MasterPagesGrid({ data, onSelect }: MasterPagesGridProps) {
    if (!data || data.length === 0) return null;

    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 10
    });

    const filteredData = data.filter((item) => item.ivrmmaP_AppPageName.toLowerCase().includes(searchTerm.toLowerCase()));

    const columns: ColumnDef<IMobileRolePrivilege>[] = [
        {
            id: 'serialNumber',
            header: 'SL.NO',
            cell: ({ row }) => {
                return <div>{(pagination.pageIndex - 1) * pagination.pageSize + row.index + 1}</div>;
            }
        },
        {
            accessorKey: 'ivrmmaP_AppPageName',
            header: 'Page Name'
        },
        {
            id: 'actions',
            header: 'Select',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className='flex justify-center'>
                        <Checkbox checked={item.checked || false} onCheckedChange={(c) => onSelect(item, c as boolean)} />
                    </div>
                );
            }
        }
    ];

    return (
        <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md'>
            <div className='flex items-center justify-between border-b bg-gradient-to-r bg-slate-50/50 from-slate-50 to-white p-4'>
                <h3 className='flex items-center gap-2 font-bold text-slate-800'>
                    <span className='h-6 w-2 rounded-full bg-[#7C3AED]'></span>
                    Available Master Pages
                </h3>
                <div className='w-72'>
                    <InputText
                        placeholder='Search pages...'
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPagination((prev) => ({ ...prev, pageIndex: 1 }));
                        }}
                        className='border-slate-200 bg-white'
                    />
                </div>
            </div>
            <div className='p-4'>
                <GenericDataTable
                    columns={columns}
                    data={filteredData}
                    isLoading={false}
                    isPaginationRequired={true}
                    totalItems={filteredData.length}
                />
            </div>
        </div>
    );
}

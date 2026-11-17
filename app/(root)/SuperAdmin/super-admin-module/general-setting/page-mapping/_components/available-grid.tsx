'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePageMapping } from './mapping-context';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { getAvailablePages } from '@/server/super-admin/super-admin-module/general-setting/page-mapping';
import { useQueryState, parseAsInteger } from 'nuqs';
import { tableSearchVariables } from '@/lib/data-table.config';
import { IPageMappingData } from '@/types/super-admin/super-admin-module/general-setting/page-mapping';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

export default function AvailableGrid() {
    const { selectedModuleId, addToCart, cartPages, saveCart } = usePageMapping();
    const [data, setData] = useState<IPageMappingData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    const [page] = useQueryState(tableSearchVariables.page, parseAsInteger.withOptions({ shallow: false }).withDefault(1));
    const [pageSize] = useQueryState(tableSearchVariables.page_size, parseAsInteger.withOptions({ shallow: false }).withDefault(10));

    const fetchData = useCallback(async () => {
        if (!selectedModuleId) {
            setData([]);
            setTotalItems(0);
            return;
        }
        setIsLoading(true);
        const searchParams = { page, page_size: pageSize, ivrmM_Id: selectedModuleId };
        try {
            const res = await getAvailablePages(searchParams);
            if (res.success) {
                setData(res.data || []);
                setTotalItems(res.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch master pages', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize, selectedModuleId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleToggle = (page: IPageMappingData) => {
        addToCart([page]);
    };

    const isChecked = (id: number) => {
        return cartPages.some(p => p.ivrmP_Id === id);
    };

    const columns = useMemo<ColumnDef<IPageMappingData>[]>(
        () => [
            {
                accessorKey: 'serialNumber',
                header: 'SL.NO',
                cell: ({ row, table }) => {
                    const { pagination } = table.getState();
                    return pagination.pageIndex * pagination.pageSize + row.index + 1;
                },
                enableSorting: false,
            },
            {
                accessorKey: 'ivrmP_PageName',
                header: 'Page Name',
            },
            {
                id: 'actions',
                header: 'Select',
                cell: ({ row }) => {
                    const checked = isChecked(row.original.ivrmP_Id);
                    return (
                        <div className="flex justify-center">
                            <Checkbox
                                checked={checked}
                                onCheckedChange={() => handleToggle(row.original)}
                                aria-label="Select row"
                            />
                        </div>
                    );
                },
                enableSorting: false,
            }
        ],
        [cartPages]
    );

    if (!selectedModuleId) return null;

    return (
        <div className="border rounded-md shadow-sm bg-white h-full flex flex-col">
            <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-lg">Master Pages</h3>
            </div>

            <div className="flex-1 overflow-auto p-2">
                <GenericDataTable
                    data={data}
                    columns={columns}
                    isLoading={isLoading}
                    isPaginationRequired={true}
                    totalItems={totalItems}
                />
            </div>
        </div>
    );
}

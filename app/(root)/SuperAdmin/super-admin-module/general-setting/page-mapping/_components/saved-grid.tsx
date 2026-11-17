'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { getSavedMappings, deletePageMapping } from '@/server/super-admin/super-admin-module/general-setting/page-mapping';
import { useQueryState, parseAsInteger } from 'nuqs';
import { tableSearchVariables } from '@/lib/data-table.config';
import { ISavedMapping } from '@/types/super-admin/super-admin-module/general-setting/page-mapping';
import Swal from 'sweetalert2';
import { usePageMapping } from './mapping-context';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

export default function SavedGrid() {
    const { selectedModuleId } = usePageMapping();
    const [data, setData] = useState<ISavedMapping[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    const [page] = useQueryState(tableSearchVariables.page, parseAsInteger.withOptions({ shallow: false }).withDefault(1));
    const [pageSize] = useQueryState(tableSearchVariables.page_size, parseAsInteger.withOptions({ shallow: false }).withDefault(10));

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const searchParams = { page, page_size: pageSize, ivrmM_Id: selectedModuleId || 0 };
        try {
            const res = await getSavedMappings(searchParams);
            if (res.success) {
                setData(res.data || []);
                setTotalItems(res.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch saved mappings', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize, selectedModuleId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const res = await deletePageMapping(id);
                if (res.success) {
                    Swal.fire({ title: 'Deleted!', text: res.message || 'Mapping has been deleted.', icon: 'success' });
                    fetchData();
                } else {
                    Swal.fire({ title: 'Failed!', text: res.message || 'Failed to delete mapping.', icon: 'error' });
                }
            } catch (error) {
                Swal.fire({ title: 'Error!', text: 'An unexpected error occurred.', icon: 'error' });
            }
        }
    };

    const columns = useMemo<ColumnDef<ISavedMapping>[]>(
        () => [
            {
                accessorKey: 'slno',
                header: 'SL.NO',
                cell: ({ row, table }) => {
                    const { pagination } = table.getState();
                    return pagination.pageIndex * pagination.pageSize + row.index + 1;
                },
            },
            {
                accessorKey: 'ivrmM_ModuleName',
                header: 'Module Name',
                enableSorting: true,
            },
            {
                accessorKey: 'ivrmmP_PageName',
                header: 'Page Name',
                enableSorting: true,
            },
            {
                id: 'actions',
                header: 'Delete',
                cell: ({ row }) => (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(row.original.ivrmmP_Id)}
                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </Button>
                ),
            },
        ],
        []
    );

    return (
        <div className="border rounded-md shadow-sm bg-white h-full flex flex-col">
            <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-lg">Saved Records of Module - Page Mapping</h3>
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

'use client';

import React, { useState } from 'react';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { usePageMapping } from './mapping-context';
import { Button } from '@/components/ui/button';
import { SaveIcon, XIcon, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { IPageMappingData } from '@/types/super-admin/super-admin-module/general-setting/page-mapping';
import { ColumnDef } from '@tanstack/react-table';

export default function SuperAdminGrid() {
    const { selectedModuleId, cartPages, removeFromCart, saveCart, clearCart } = usePageMapping();

    // Using local state for pagination of client-side data
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const totalItems = cartPages.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedData = cartPages.slice(startIndex, startIndex + pageSize);

    const handleRemove = (record: any) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete record????",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel!!!!!!",
        }).then((result) => {
            if (result.isConfirmed) {
                removeFromCart([record.ivrmP_Id]);
                Swal.fire("Row as been removed from list Successfully");
            } else {
                Swal.fire("Record Deletion Cancelled");
            }
        });
    };

    // Define columns locally to access handleRemove
    const columns: ColumnDef<IPageMappingData>[] = [
        {
            accessorKey: 'slno',
            header: 'SL.NO',
            cell: ({ row, table }) => {
                const pageIndex = table.getState().pagination.pageIndex;
                const pageSize = table.getState().pagination.pageSize;
                return pageIndex * pageSize + row.index + 1;
            },
        },
        {
            accessorKey: 'ivrmP_PageName',
            header: 'Page Name',
            enableSorting: true,
        },
        {
            id: 'remove',
            header: 'Remove',
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <button
                            onClick={() => handleRemove(row.original)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                );
            },
        },
    ];

    if (!selectedModuleId) return null;

    return (
        <div className="border rounded-md shadow-sm bg-white h-full flex flex-col">
            <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-lg">Saved Master Page Mapping List</h3>
            </div>

            <div className="flex-1 overflow-auto p-2">
                <GenericDataTable
                    data={paginatedData}
                    columns={columns}
                    isLoading={false}
                    isPaginationRequired={false} // Client side pagination visual only if needed, here passing paginated data
                    totalItems={totalItems}
                />
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-center gap-4">
                <Button
                    onClick={saveCart}
                    disabled={cartPages.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Save
                </Button>
                <Button
                    variant="destructive"
                    onClick={clearCart}
                    disabled={cartPages.length === 0}
                >
                    <XIcon className="mr-2 h-4 w-4" />
                    Cancel
                </Button>
            </div>
        </div>
    );
}

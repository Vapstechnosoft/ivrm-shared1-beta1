'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/data-table.config';
import type { ApiSearchparams } from '@/types';
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import {
    type ColumnDef,
    type ColumnPinningState,
    type PaginationState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';
import { DataTableSkeleton } from './view-data-table-skeleton';
import { DataTableToolbar } from './view-data-table-toolbar';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    totalItems: number;
    pageSizeOptions?: number[];
    isLoading?: boolean;
    showExportOptions?: boolean;
    showViewOptions?: boolean;
    showPagination?: boolean;
    showSearch?: boolean;
    showSorting?: boolean;
    columnPinning?: ColumnPinningState | undefined;
    onSearchQueryChange?: (value: ApiSearchparams) => void;
    maxSelectableRows?: number;
    defaultSelectedRowIds?: string[];
    onRowSelectionChange?: (selectedRows: TData[]) => void;
    currentApiParams?: ApiSearchparams;
}

export interface DataTableRef {
    resetSelection: () => void;
}

export const DataTable = forwardRef<DataTableRef, DataTableProps<any, any>>(function DataTable(props, ref) {
    const {
        columns,
        data,
        totalItems,
        pageSizeOptions = [10, 20, 30, 40, 50, 60],
        isLoading,
        showExportOptions = false,
        showViewOptions = true,
        showPagination = false,
        showSearch,
        showSorting = false,
        columnPinning,
        maxSelectableRows = 0,
        defaultSelectedRowIds,
        onRowSelectionChange,
        onSearchQueryChange,
        currentApiParams
    } = props;

    const { page = 1, page_size = 10, search_query = '', sort_column = '', sort_direction = 'desc' } = currentApiParams || {};

    // Initialize states
    const [currentPage, setCurrentPage] = useState<number>(page);
    const [pageSize, setPageSize] = useState<number>(page_size);
    const [localSearchQuery, setLocalSearchQuery] = useState<string>(search_query);
    const [sortBy, setSortBy] = useState<string>(sort_column);
    const [order, setOrder] = useState<'asc' | 'desc'>(sort_direction as 'asc' | 'desc');

    const [searchQuery, setSearchQuery] = useState('');

    // ---------------------------
    // 🔄 Row Selection
    // ---------------------------
    const rowSelectionRef = useRef<Record<string, boolean>>({});
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(() => rowSelectionRef.current);
    useEffect(() => {
        if (!Array.isArray(defaultSelectedRowIds)) return;

        setRowSelection((prev) => {
            const updated = { ...prev };

            // Update OR add
            defaultSelectedRowIds.forEach((id) => {
                updated[id] = true;
            });

            rowSelectionRef.current = updated;

            if (onRowSelectionChange) {
                const selectedRows = table
                    .getFilteredRowModel()
                    .rows.filter((r) => updated[r.id])
                    .map((r) => r.original);

                onRowSelectionChange(selectedRows);
            }

            return updated;
        });
    }, [defaultSelectedRowIds]);
    useEffect(() => {
        rowSelectionRef.current = rowSelection;
    }, [rowSelection]);

    const paginationState = { pageIndex: currentPage - 1, pageSize };
    const pageCount = Math.ceil(totalItems / pageSize);

    const handlePaginationChange = (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
        const pagination = typeof updaterOrValue === 'function' ? updaterOrValue(paginationState) : updaterOrValue;
        setCurrentPage(pagination.pageIndex + 1);
        setPageSize(pagination.pageSize);
    };

    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            pagination: paginationState,
            sorting: sortBy ? [{ id: sortBy, desc: order === 'desc' }] : [],
            globalFilter: searchQuery,
            rowSelection
        },
        onPaginationChange: handlePaginationChange,

        onRowSelectionChange: (newSelection) => {
            const selectionObj = typeof newSelection === 'function' ? newSelection(rowSelection) : newSelection;

            const selectedCount = Object.keys(selectionObj).length;

            if (maxSelectableRows && selectedCount > maxSelectableRows) {
                toast.error(`You can select up to ${maxSelectableRows} rows only.`);
                return;
            }

            setRowSelection(selectionObj);
            rowSelectionRef.current = selectionObj;

            const selectedRows = table
                .getFilteredRowModel()
                .rows.filter((r) => selectionObj[r.id])
                .map((r) => r.original);

            onRowSelectionChange?.(selectedRows);
        },

        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,

        initialState: {
            columnPinning: columnPinning || { right: ['actions'] }
        }
    });

    // Expose resetSelection()
    useImperativeHandle(ref, () => ({
        resetSelection: () => {
            setRowSelection({});
            rowSelectionRef.current = {};
            onRowSelectionChange?.([]);
        }
    }));

    const isFirstRender = useRef(true);

    useEffect(() => {
        // Skip calling API on first mount
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const params: ApiSearchparams = {
            page: currentPage,
            page_size: pageSize,
            search_query: localSearchQuery,
            sort_column: sortBy || '',
            sort_direction: order || '',
            search_columns: ''
        };

        onSearchQueryChange?.(params);
    }, [currentPage, pageSize, sortBy, order, localSearchQuery]);

    return (
        <div className='w-full space-y-2.5'>
            {/* Toolbar */}
            <DataTableToolbar
                table={table}
                data={data}
                showExportOptions={showExportOptions}
                showViewOptions={showViewOptions}
                showSearch={showSearch}
                showSorting={showSorting}
                currentSearchQuery={localSearchQuery}
                onSearchQueryChange={(value) => {
                    setLocalSearchQuery(value);
                    setSearchQuery(value);
                }}
            />

            {/* Table Content */}
            {isLoading ? (
                <DataTableSkeleton columnCount={5} rowCount={5} showPagination showViewOptions={false} />
            ) : (
                <>
                    {/* ---------- FIXED TABLE STRUCTURE ---------- */}
                    <div className='overflow-hidden rounded-md border'>
                        <div className="relative max-h-[520px] overflow-auto">   {/* SINGLE SCROLL CONTAINER */}
                            <Table className="min-w-full table-fixed border-separate border-spacing-0">

                                {/* column widths stay the same for both header & body */}
                                <colgroup>
                                    {table.getAllLeafColumns().map(col => (
                                        <col key={col.id} style={{ width: col.getSize() }} />
                                    ))}
                                </colgroup>

                                <TableHeader className="bg-card">
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map(header => (
                                                <TableHead
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                    className="sticky top-0 z-20 bg-card border-b whitespace-nowrap"
                                                    style={getCommonPinningStyles({ column: header.column })}  // 👈 pinning works here
                                                >
                                                    {header.isPlaceholder ? null :
                                                        flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>

                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map(row => (
                                            <TableRow key={row.id} className="border-b">
                                                {row.getVisibleCells().map(cell => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="whitespace-nowrap border-b"
                                                        style={getCommonPinningStyles({ column: cell.column })}  // 👈 NOW body pinning works
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={table.getAllColumns().length}
                                                className="h-24 text-center"
                                            >
                                                No results found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>


                    </div>

                    {/* ---------- PAGINATION ---------- */}
                    {showPagination && (
                        <div className='flex flex-col gap-2.5'>
                            <div className='flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8'>
                                {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                                    <div className='flex-1 whitespace-nowrap text-muted-foreground text-sm'>
                                        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}{' '}
                                        row(s) selected.
                                    </div>
                                ) : (
                                    <div className='flex-1 whitespace-nowrap text-muted-foreground text-sm'>
                                        {totalItems > 0
                                            ? `Showing ${paginationState.pageIndex * paginationState.pageSize + 1} to ${Math.min(
                                                (paginationState.pageIndex + 1) * paginationState.pageSize,
                                                totalItems
                                            )} of ${totalItems} entries`
                                            : 'No entries found'}
                                    </div>
                                )}

                                {/* Rows per page */}
                                {/* <div className='flex items-center space-x-2'>
                                    <p className='whitespace-nowrap font-medium text-sm'>Rows per page</p>
                                    <Select
                                        value={`${paginationState.pageSize}`}
                                        onValueChange={(v) => table.setPageSize(Number(v))}
                                        searchable={false}>
                                        <SelectTrigger className='h-8 w-[70px]'>
                                            <SelectValue placeholder={paginationState.pageSize} />
                                        </SelectTrigger>
                                        <SelectContent side='top'>
                                            {pageSizeOptions.map((size) => (
                                                <SelectItem key={size} value={`${size}`}>
                                                    {size}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div> */}

                                {/* Controls */}
                                <div className='flex items-center space-x-2'>
                                    <Button
                                        aria-label='First page'
                                        variant='outline'
                                        className='hidden h-8 w-8 p-0 lg:flex'
                                        onClick={() => table.setPageIndex(0)}
                                        disabled={!table.getCanPreviousPage()}>
                                        <DoubleArrowLeftIcon className='h-4 w-4' />
                                    </Button>
                                    <Button
                                        aria-label='Previous page'
                                        variant='outline'
                                        className='h-8 w-8 p-0'
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}>
                                        <ChevronLeftIcon className='h-4 w-4' />
                                    </Button>
                                    <Button
                                        aria-label='Next page'
                                        variant='outline'
                                        className='h-8 w-8 p-0'
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}>
                                        <ChevronRightIcon className='h-4 w-4' />
                                    </Button>
                                    <Button
                                        aria-label='Last page'
                                        variant='outline'
                                        className='hidden h-8 w-8 p-0 lg:flex'
                                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                        disabled={!table.getCanNextPage()}>
                                        <DoubleArrowRightIcon className='h-4 w-4' />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}) as <TData, TValue>(props: DataTableProps<TData, TValue> & { ref?: React.Ref<DataTableRef> }) => React.ReactElement;

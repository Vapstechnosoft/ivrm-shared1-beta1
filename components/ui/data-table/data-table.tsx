'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCommonPinningStyles, tableSearchVariables } from '@/lib/data-table.config';
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
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
import { useEffect, useRef, useState } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { toast } from 'sonner';
import { DataTableSkeleton } from './data-table-skeleton';
import { DataTableToolbar } from './data-table-toolbar';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    totalItems: number;
    pageSizeOptions?: number[];
    isLoading?: boolean;
    showExportOptions?: boolean;
    showViewOptions?: boolean;
    columnPinning?: ColumnPinningState | undefined;
    isSearchRequired?: boolean;
    isPaginationRequired?: boolean;
    // ✅ updated
    maxSelectableRows?: number;
    onRowSelectionChange?: (selectedRows: TData[]) => void;
    showSearchColumns?: boolean;
    manualPagination?: boolean;
    scrollable?: boolean;
    maxHeight?: string;
}

export interface DataTableRef {
    resetSelection: () => void;
}

function DataTableInner<TData, TValue>(
    {
        columns,
        data,
        totalItems,
        pageSizeOptions = [10, 20, 30, 40, 50],
        isLoading,
        showExportOptions = false,
        showViewOptions = true,
        columnPinning,
        isSearchRequired = true,
        isPaginationRequired = true,
        maxSelectableRows = 0,
        onRowSelectionChange,
        showSearchColumns = false,
        manualPagination = true,
        scrollable = false,
        maxHeight = '600px'
    }: DataTableProps<TData, TValue>,
    ref: React.Ref<DataTableRef>
) {
    // Pagination state
    const [currentPage, setCurrentPage] = useQueryState(
        tableSearchVariables.page,
        parseAsInteger.withOptions({ shallow: false }).withDefault(1)
    );
    const [pageSize, setPageSize] = useQueryState(
        tableSearchVariables.page_size,
        parseAsInteger.withOptions({ shallow: false, history: 'push' }).withDefault(10)
    );

    // Sorting and filtering
    const [sortBy] = useQueryState(tableSearchVariables.sort_column, parseAsString.withOptions({ shallow: false }).withDefault(''));
    const [order] = useQueryState(
        tableSearchVariables.sort_direction,
        parseAsStringLiteral(['asc', 'desc'] as const)
            .withOptions({ shallow: false })
            .withDefault('asc')
    );
    const [searchQuery] = useQueryState(tableSearchVariables.search, parseAsString.withOptions({ shallow: false }).withDefault(''));

    // Generate a unique key for this table instance based on current page/filters
    const tableStateKey = `table_selection_${currentPage}_${pageSize}_${sortBy}_${order}_${searchQuery}`;

    // Initialize from ref to preserve across re-renders
    const rowSelectionRef = useRef<Record<string, boolean>>({});
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(() => rowSelectionRef.current);

    // Update ref whenever selection changes
    useEffect(() => {
        rowSelectionRef.current = rowSelection;
    }, [rowSelection]);

    const paginationState = { pageIndex: currentPage - 1, pageSize };
    const pageCount = Math.ceil(totalItems / pageSize);

    const handlePaginationChange = (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
        const pagination = typeof updaterOrValue === 'function' ? updaterOrValue(paginationState) : updaterOrValue;
        setCurrentPage(pagination.pageIndex + 1);
        setPageSize(pagination.pageSize);

        setRowSelection({});
        rowSelectionRef.current = {};
        if (typeof onRowSelectionChange === 'function') {
            onRowSelectionChange([]);
        }
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

        // ✅ UPDATE THIS HANDLER
        onRowSelectionChange: (newSelection) => {
            const selectionObj = typeof newSelection === 'function' ? newSelection(rowSelection) : newSelection;
            const selectedCount = Object.keys(selectionObj).length;

            if (maxSelectableRows && selectedCount > maxSelectableRows) {
                toast.error(`You can select up to ${maxSelectableRows} rows only.`);
                return;
            }

            // Update both state and ref
            setRowSelection(selectionObj);
            rowSelectionRef.current = selectionObj;

            const selectedRows = table
                .getFilteredRowModel()
                .rows.filter((r) => selectionObj[r.id])
                .map((r) => r.original);

            if (typeof onRowSelectionChange === 'function') {
                onRowSelectionChange(selectedRows);
            }
        },

        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: manualPagination,
        manualSorting: true,
        manualFiltering: true,
        initialState: {
            columnPinning: columnPinning || { right: ['actions'] }
        }
    });

    // Add this right after useReactTable:
    useImperativeHandle(ref, () => ({
        resetSelection: () => {
            setRowSelection({});
            // ✅ ADD THIS LINE
            rowSelectionRef.current = {};
            if (typeof onRowSelectionChange === 'function') {
                onRowSelectionChange([]);
            }
        }
    }));

    return (
        <div className='w-full space-y-2.5 overflow-auto'>
            {/* Toolbar */}
            {isSearchRequired && (
                <DataTableToolbar
                    table={table}
                    data={data}
                    showExportOptions={showExportOptions}
                    showViewOptions={showViewOptions}
                    columns={columns}
                    showSearchColumns={showSearchColumns}
                />
            )}

            {/* Table Content */}
            {isLoading ? (
                <DataTableSkeleton columnCount={5} rowCount={5} showPagination showViewOptions={false} />
            ) : (
                <>
                    <div
                        className='overflow-hidden rounded-md border'
                        style={
                            scrollable
                                ? {
                                    maxHeight: maxHeight,
                                    overflowY: 'auto',
                                    position: 'relative'
                                }
                                : undefined
                        }>
                        <Table>
                            <TableHeader className={scrollable ? 'sticky top-0 bg-background z-10' : undefined}>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                className='w-fit'
                                                style={{ ...getCommonPinningStyles({ column: header.column }) }}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>

                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected()}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell
                                                    key={cell.id}
                                                    className='whitespace-nowrap'
                                                    style={{ ...getCommonPinningStyles({ column: cell.column }) }}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={table.getAllColumns().length} className='h-24 text-center'>
                                            <div className='flex flex-col items-center justify-center space-y-2'>
                                                <p className='font-medium text-muted-foreground'>
                                                    {searchQuery ? `No results found for "${searchQuery}"` : 'No results.'}
                                                </p>
                                                {searchQuery && (
                                                    <p className='text-muted-foreground text-sm'>Try adjusting your search or filters</p>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {isPaginationRequired && (
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
                                <div className='flex items-center space-x-2'>
                                    <p className='whitespace-nowrap font-medium text-sm'>Rows per page</p>
                                    <Select
                                        value={`${paginationState.pageSize}`}
                                        onValueChange={(value) => {
                                            table.setPageSize(Number(value));
                                        }}
                                        searchable={false}>
                                        <SelectTrigger className='h-8 w-[70px]'>
                                            <SelectValue placeholder={paginationState.pageSize} />
                                        </SelectTrigger>
                                        <SelectContent side='top'>
                                            {pageSizeOptions.map((pageSize) => (
                                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                                    {pageSize}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Pagination Controls */}
                                <div className='flex items-center space-x-2'>
                                    <Button
                                        aria-label='Go to first page'
                                        variant='outline'
                                        className='hidden h-8 w-8 p-0 lg:flex'
                                        onClick={() => table.setPageIndex(0)}
                                        disabled={!table.getCanPreviousPage()}>
                                        <DoubleArrowLeftIcon className='h-4 w-4' />
                                    </Button>
                                    <Button
                                        aria-label='Go to previous page'
                                        variant='outline'
                                        className='h-8 w-8 p-0'
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}>
                                        <ChevronLeftIcon className='h-4 w-4' />
                                    </Button>
                                    <Button
                                        aria-label='Go to next page'
                                        variant='outline'
                                        className='h-8 w-8 p-0'
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}>
                                        <ChevronRightIcon className='h-4 w-4' />
                                    </Button>
                                    <Button
                                        aria-label='Go to last page'
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
}
export const DataTable = forwardRef(DataTableInner) as <TData, TValue>(props: DataTableProps<TData, TValue> & { ref?: React.Ref<DataTableRef> }) => React.ReactElement;

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/utils/use-debounce';
import { tableSearchVariables } from '@/lib/data-table.config';
import { exportToExcel } from '@/lib/utils';
import type { Table } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DownloadIcon, FileSpreadsheet, FileText, Settings2, X } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useRef, useState } from 'react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../dropdown-menu';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    data: TData[];
    showExportOptions?: boolean;
    showViewOptions?: boolean;
    showSearchColumns?: boolean;
    showSearch?: boolean;
    showSorting?: boolean;
    onSearchQueryChange?: (value: string) => void;
    currentSearchQuery?: string;
}

export function DataTableToolbar<TData>({
    table,
    data,
    showExportOptions = true,
    showViewOptions = true,
    showSearchColumns = false,
    showSearch,
    showSorting = false,
    onSearchQueryChange,
    currentSearchQuery
}: DataTableToolbarProps<TData>) {
    const [searchQuery, setSearchQuery] = useState(currentSearchQuery ? currentSearchQuery : '');

    // Add local state for immediate input feedback
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || ''); // Initialize with searchQuery

    // Debounce the local search query with 1 seconds delay
    const debouncedSearchQuery = useDebounce(localSearchQuery, 1000);

    // Only sync from URL to local state on mount or when URL changes externally
    // Use a ref to track if this is user input or external change
    const isUserInputRef = useRef(false);

    useEffect(() => {
        if (!isUserInputRef.current) {
            // Only update if it's not from user input (e.g., browser back/forward, initial load)
            setLocalSearchQuery(searchQuery || '');
        }
        isUserInputRef.current = false;
    }, [searchQuery]);

    // Update URL when debounced value changes
    useEffect(() => {
        if (debouncedSearchQuery !== searchQuery) {
            isUserInputRef.current = true;
            setSearchQuery(debouncedSearchQuery); // Use null to clear the param
            table.setPageIndex(0);
            onSearchQueryChange?.(debouncedSearchQuery);
        }
    }, [debouncedSearchQuery]);

    const handleSearch = (term: string) => {
        isUserInputRef.current = true;
        setLocalSearchQuery(term);
    };

    const handleReset = () => {
        isUserInputRef.current = true;
        setLocalSearchQuery('');
        onSearchQueryChange?.('');
        setSearchQuery(''); // Clear the URL param completely
        table.resetColumnFilters();
        table.resetColumnVisibility();
        table.resetSorting();
        setSearchColumns(tableSearchVariables.search_columns, parseAsString.withOptions({ shallow: false }).withDefault(allCols));
    };

    //find if any column is hiding
    const anyColumnHiding = table.getAllColumns().filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide());
    const allCols = anyColumnHiding.map((c) => c.id).join(',');
    const [searchColumns, setSearchColumns] = useQueryState(
        tableSearchVariables.search_columns,
        parseAsString.withOptions({ shallow: false }).withDefault(allCols)
    );
    const handleExportToExcel = () => {
        exportToExcel(data);
    };

    const handleExportToPDF = () => {
        const doc = new jsPDF();

        // Get visible columns
        const visibleColumns = table
            .getAllColumns()
            .filter((col) => col.getIsVisible())
            .map((col) => ({
                header: col.id.charAt(0).toUpperCase() + col.id.slice(1),
                dataKey: col.id
            }));

        // Prepare the data for PDF
        const tableData = data.map((item) => {
            const row: Record<string, any> = {};
            visibleColumns.forEach((col) => {
                row[col.dataKey] = (item as any)[col.dataKey]?.toString() || '';
            });
            return row;
        });

        // Generate PDF
        autoTable(doc, {
            columns: visibleColumns,
            body: tableData,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            margin: { top: 20 }
        });

        doc.save('data.pdf');
    };

    const selectedRows = table.getSelectedRowModel().rows;

    function handleUnselectAll() {
        table.toggleAllPageRowsSelected(false);
    }
    const allSearchableColumns = anyColumnHiding.map((c) => c.id);
    const selectedSearchColumns = searchColumns ? searchColumns.split(',') : [];

    const toggleSearchColumn = (colId: string, checked: boolean) => {
        let updated: string[];
        if (checked) {
            updated = [...new Set([...selectedSearchColumns, colId])];
        } else {
            updated = selectedSearchColumns.filter((id) => id !== colId);
        }
        setSearchColumns(updated.join(','));
    };

    const toggleSelectAllSearchColumns = () => {
        if (selectedSearchColumns.length === allSearchableColumns.length) {
            setSearchColumns('');
        } else {
            setSearchColumns(allSearchableColumns.join(','));
        }
    };
    const [isSearchColumnModalOpen, setIsSearchColumnModalOpen] = useState(showSearchColumns);

    return (
        <div className='flex w-full items-center justify-between gap-2 overflow-auto p-0.5'>
            {showSearch && (
                <div className='flex items-center gap-2'>
                    <Input
                        id='table-search-input'
                        onChange={(event) => handleSearch(event.target.value)}
                        className='h-8 w-40 lg:w-64'
                        placeholder='Search...'
                        value={localSearchQuery || ''}
                    />
                    {localSearchQuery && (
                        <Button onClick={handleReset} variant='ghost' suffix={<X className='h-4 w-4' />} className='h-8 w-fit'>
                            Reset
                        </Button>
                    )}
                </div>
            )}

            <div className='flex items-center gap-2'>
                {selectedRows.length > 0 && (
                    <div className='flex-center gap-2'>
                        <Button onClick={handleUnselectAll} variant='ghost' suffix={<X className='h-4 w-4' />} className='h-8 w-fit'>
                            Reset
                        </Button>
                    </div>
                )}

                {showExportOptions && table.getFilteredRowModel().rows.length > 0 && (
                    <div className='flex items-center gap-2'>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant='outline' size='sm' prefix={<DownloadIcon className='h-4 w-4' />} className='h-8 w-fit'>
                                    Export
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-[200px] p-2' align='end'>
                                <div className='flex flex-col gap-2'>
                                    <Button variant='ghost' className='w-full justify-start' onClick={handleExportToExcel}>
                                        <FileSpreadsheet className='mr-2 h-4 w-4 text-green-500' />
                                        Export as Excel
                                    </Button>
                                    <Button variant='ghost' className='w-full justify-start' onClick={handleExportToPDF}>
                                        <FileText className='mr-2 h-4 w-4 text-orange-500' />
                                        Export as PDF
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}

                {/* Search Columns */}
                {isSearchColumnModalOpen && anyColumnHiding.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='outline'
                                size='sm'
                                prefix={<Settings2 className='h-4 w-4' />}
                                className='hidden h-8 w-fit sm:flex'>
                                Search Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-[180px]'>
                            <DropdownMenuItem onClick={toggleSelectAllSearchColumns}>
                                {selectedSearchColumns.length === allSearchableColumns.length ? 'Deselect All' : 'Select All'}
                            </DropdownMenuItem>
                            <div className='my-1 border-t' />
                            {table
                                .getAllColumns()
                                .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                                .map((column) => {
                                    const displayName =
                                        (column.columnDef.meta as any)?.title ||
                                        column.id
                                            .split('_')
                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ');

                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            checked={selectedSearchColumns.includes(column.id)}
                                            onCheckedChange={(value) => toggleSearchColumn(column.id, !!value)}>
                                            {displayName}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {showViewOptions && anyColumnHiding.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='outline'
                                size='sm'
                                prefix={<Settings2 className='h-4 w-4' />}
                                className='hidden h-8 w-fit sm:flex'>
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-[150px]'>
                            {table
                                .getAllColumns()
                                .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                                .map((column) => {
                                    // Get display name from meta or format the column id
                                    const displayName =
                                        (column.columnDef.meta as any)?.title ||
                                        column.id
                                            .split('_')
                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ');

                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                                            {displayName}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}

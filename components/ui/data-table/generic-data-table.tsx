'use client';
import { DataTable } from '@/components/ui/data-table/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Database, RefreshCw } from 'lucide-react';
import { forwardRef } from 'react';
import type { DataTableRef } from './data-table';

interface GenericDataTableProps<T> {
    // Data props
    data?: T[];
    total?: number;
    columns: ColumnDef<T>[];
    totalItems?: number;

    // State props
    isLoading: boolean;
    error?: Error | null;
    success?: boolean;
    errorMessage?: string;
    // Table configuration
    showViewOptions?: boolean;
    columnPinning?: { left?: string[]; right?: string[] };

    isSearchRequired?: boolean;
    isPaginationRequired?: boolean;
    showExportOptions?: boolean;

    // Row selection
    maxSelectableRows?: number;
    onRowSelectionChange?: (selectedRows: T[]) => void;
    showSearchColumns?: boolean;
    // Custom messages
    loadingMessage?: string;
    errorTitle?: string;
    noDataTitle?: string;
    noDataDescription?: string;
    requestFailedTitle?: string;

    // Custom icons
    LoadingIcon?: React.ComponentType<{ className?: string }>;
    ErrorIcon?: React.ComponentType<{ className?: string }>;
    NoDataIcon?: React.ComponentType<{ className?: string }>;

    // Custom loading/error components
    LoadingComponent?: React.ComponentType;
    ErrorComponent?: React.ComponentType<{ error: Error; message: string }>;
    NoDataComponent?: React.ComponentType;
    searchQuery?: string;

    defaultVisibility?: { [key: string]: boolean };
    scrollable?: boolean;
    maxHeight?: string;
    //manualPagination?: boolean;
}

export const GenericDataTable = forwardRef<DataTableRef, GenericDataTableProps<any>>(function GenericDataTable<T>(
    {
        data = [],
        columns,
        totalItems = 0,
        isLoading,
        error,
        success = true,
        errorMessage,
        showViewOptions = false,
        columnPinning,
        isSearchRequired = true,
        isPaginationRequired = true,
        maxSelectableRows = 0,
        onRowSelectionChange,
        loadingMessage = 'Loading data...',
        errorTitle = 'Error Loading Data',
        requestFailedTitle = 'Request Failed',
        LoadingIcon = RefreshCw,
        ErrorIcon = Database,
        LoadingComponent,
        ErrorComponent,
        showSearchColumns = false,
        showExportOptions = false,
        // manualPagination = true
        scrollable = false,
        maxHeight = '600px'
        //manualPagination = false
    }: GenericDataTableProps<T>,
    ref: React.Ref<DataTableRef>
) {
    // Loading state
    if (isLoading) {
        if (LoadingComponent) return <LoadingComponent />;
        return (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                <LoadingIcon className='h-8 w-8 animate-spin text-secondary' />
                <p className='text-muted-foreground text-sm'>{loadingMessage}</p>
            </div>
        );
    }

    // Error state
    if (error) {
        if (ErrorComponent) return <ErrorComponent error={error} message={error.message} />;
        return (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                <div className='rounded-full bg-destructive/10 p-3'>
                    <ErrorIcon className='h-6 w-6 text-destructive' />
                </div>
                <div className='space-y-2 text-center'>
                    <h3 className='font-semibold text-destructive'>{errorTitle}</h3>
                    <p className='text-muted-foreground text-sm'>{error.message || errorMessage || 'Failed to load data'}</p>
                </div>
            </div>
        );
    }

    // Request failed state
    if (!success) {
        return (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                <div className='rounded-full bg-destructive/10 p-3'>
                    <ErrorIcon className='h-6 w-6 text-destructive' />
                </div>
                <div className='space-y-2 text-center'>
                    <h3 className='font-semibold text-destructive'>{requestFailedTitle}</h3>
                    <p className='text-muted-foreground text-sm'>{errorMessage || 'Failed to fetch data'}</p>
                </div>
            </div>
        );
    }

    // No data state - but still render DataTable to show toolbar
    if (data.length === 0) {
        return (
            <div className='overflow-hidden rounded-lg bg-card'>
                <DataTable
                    ref={ref}
                    isLoading={isLoading}
                    columns={columns}
                    data={[]} // Empty array
                    totalItems={0}
                    showViewOptions={showViewOptions}
                    isSearchRequired={isSearchRequired}
                    isPaginationRequired={isPaginationRequired}
                    columnPinning={columnPinning}
                    showSearchColumns={showSearchColumns}
                    showExportOptions={showExportOptions}
                    maxSelectableRows={maxSelectableRows}
                    //manualPagination={manualPagination}
                    onRowSelectionChange={(selectedRows) => {
                        if (onRowSelectionChange) {
                            onRowSelectionChange(selectedRows);
                        }
                    }}
                />
            </div>
        );
    }

    return (
        <div className='overflow-hidden rounded-lg bg-card'>
            <DataTable
                ref={ref}
                isLoading={isLoading}
                columns={columns}
                data={data}
                totalItems={totalItems}
                showViewOptions={showViewOptions}
                isSearchRequired={isSearchRequired}
                isPaginationRequired={isPaginationRequired}
                columnPinning={columnPinning}
                maxSelectableRows={maxSelectableRows}
                showSearchColumns={showSearchColumns}
                //manualPagination={manualPagination}
                scrollable={scrollable}
                maxHeight={maxHeight}
                onRowSelectionChange={(selectedRows) => {
                    if (onRowSelectionChange) {
                        onRowSelectionChange(selectedRows);
                    }
                }}
            />
        </div>
    );
}) as <T>(props: GenericDataTableProps<T> & { ref?: React.Ref<DataTableRef> }) => React.ReactElement;

// Hook for common API response pattern
export function useDataTableProps(
    response: any,
    options?: {
        dataKey?: string;
        totalKey?: string;
        successKey?: string;
        messageKey?: string;
    }
) {
    const { dataKey = 'data', totalKey = 'total', successKey = 'success', messageKey = 'message' } = options || {};

    return {
        data: response?.[dataKey] || [],
        totalItems: response?.[totalKey] || 0,
        success: response?.[successKey],
        errorMessage: response?.[messageKey]
    };
}

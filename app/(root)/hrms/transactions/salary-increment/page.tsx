'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useDeleteSalaryIncrement, useSalaryIncrementOnload } from '@/hooks/hrms/useTransactions';
import type { SalaryIncrementGridItem } from '@/types/hrms/salary-increment';
import { TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { salaryIncrementColumns } from './_components/columns';
import FormSections from './_components/form-sections';
export default function SalaryIncrementProcessPage() {
    const { data: onloadData, isLoading } = useSalaryIncrementOnload({
        page: 1,
        page_size: 25,
        search_query: undefined,
        search_column: undefined,
        sort_column: undefined,
        sort_direction: undefined,
        is_export: false,
        MIID: 30, // Kept hardcoded as requested
        roleId: 0 // Using roleId for hook compatibility
    });
    return (
        <FormProvider<SalaryIncrementGridItem>>
            <SalaryIncrementProcessPageContent onloadData={onloadData} isLoading={isLoading} />
        </FormProvider>
    );
}
function SalaryIncrementProcessPageContent({
    onloadData,
    isLoading
}: {
    onloadData: any;
    isLoading: boolean;
}) {
    const { openAddForm } = useFormContext<SalaryIncrementGridItem>();
    const deleteMutation = useDeleteSalaryIncrement();
    // Memoize grid data
    const gridData = useMemo(() => onloadData?.griddata || [], [onloadData?.griddata]);
    // Prepare table data - convert gridData to table format
    const tableData = useMemo(() => {
        if (!gridData || gridData.length === 0) return [];
        return gridData.map((item: SalaryIncrementGridItem) => ({
            ...item,
            id: item.HREIC_Id || 0
        }));
    }, [gridData]);
    // Prepare response format for useDataTableProps
    const tableResponse = useMemo(() => {
        return {
            success: true,
            data: tableData,
            total: tableData.length,
            page: 1,
            page_size: tableData.length
        };
    }, [tableData]);
    const tableProps = useDataTableProps(tableResponse);
    const handleRefetch = () => {
        // Refetch logic if needed
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex justify-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <TrendingUp className='h-4 w-4' />
                        Add Increment
                    </Button>
                </div>
                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<SalaryIncrementGridItem>
                        {...tableProps}
                        columns={salaryIncrementColumns}
                        isLoading={isLoading || deleteMutation.isPending}
                        error={null}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading salary increments...'
                        noDataTitle='No Salary Increments Found'
                        noDataDescription='Get started by creating your first salary increment'
                        errorTitle='Error Loading Salary Increments'
                    />
                </CollapsibleSection>
                {/* Forms */}
                <FormSections onloadData={onloadData} onSuccess={handleRefetch} />
            </div>
        </div>
    );
}

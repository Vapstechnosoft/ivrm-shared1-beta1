'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterEarningsDeductions } from '@/hooks/hrms/useMasters';
import type { IMasterEarningsDeductionsList } from '@/types/hrms/hrms-config/master';
import { Plus, X } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';
import AddEarningsDeductionsForm from './_components/add-form';
import { columns } from './_components/columns';
import ReorderEarningsDeductionsForm from './_components/reorder-form';
import ToggleMasterEarningsDeductionsForm from './_components/toggle-form';
import UpdateEarningsDeductionsForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterEarningsDeductionsPage(props: { searchParams: SearchParams }) {
    const [initialSearchParams, setInitialSearchParams] = useState<any>({});
    const [filterCategory, setFilterCategory] = useQueryState('category', parseAsString.withDefault('all'));

    useEffect(() => {
        const fetchParams = async () => {
            const params = await props.searchParams;
            setInitialSearchParams(params);
        };
        fetchParams();
    }, [props.searchParams]);

    const searchParams = useMemo(() => {
        if (filterCategory !== 'all') {
            // biome-ignore lint/nursery/noUnusedVariables: <explanation>
            const { category, ...rest } = initialSearchParams;
            return {
                ...rest,
                search_query: filterCategory,
                search_column: 'hrmeD_EarnDedFlag'
            };
        }

        return initialSearchParams;
    }, [initialSearchParams, filterCategory]);

    const { data: response, isLoading, error } = useMasterEarningsDeductions(searchParams);

    return (
        <FormProvider<IMasterEarningsDeductionsList>>
            <MasterEarningsDeductionsPageContent
                response={response}
                isLoading={isLoading}
                error={error}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
            />
        </FormProvider>
    );
}

function MasterEarningsDeductionsPageContent({
    response,
    isLoading,
    error,
    filterCategory,
    setFilterCategory
}: {
    response: any;
    isLoading: boolean;
    error: any;
    filterCategory: string;
    setFilterCategory: (value: string) => void;
}) {
    const { openAddForm } = useFormContext<IMasterEarningsDeductionsList>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex justify-between gap-2'>
                    {/* Filter Dropdown */}
                    <div className='flex items-center gap-2'>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className='flex h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all duration-200 hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'>
                            <option value='all'>All Items</option>
                            <option value='Earning'>Earnings</option>
                            <option value='Deduction'>Deductions</option>
                            <option value='Arrear'>Arrears</option>
                            <option value='Gross'>Gross</option>
                        </select>
                    </div>
                    {/* Action Buttons */}
                    <div className='flex gap-2'>
                        <Button
                            type='button'
                            onClick={openAddForm}
                            className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                            <Plus className='h-4 w-4' />
                            Add Earning/Deduction
                        </Button>
                    </div>
                </div>
                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <div className='flex justify-end'>
                        <ReorderEarningsDeductionsForm />
                    </div>
                    <GenericDataTable<IMasterEarningsDeductionsList>
                        {...tableProps}
                        columns={columns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading earnings/deductions...'
                        noDataTitle='No Earnings/Deductions Found'
                        noDataDescription='Get started by creating your first earning/deduction'
                        errorTitle='Error Loading Earnings/Deductions'
                    />
                </CollapsibleSection>
                {/* Forms */}
                <FormSections />
            </div>
        </div>
    );
}
function FormSections() {
    const {
        isAddFormOpen,
        isEditFormOpen,
        isToggleFormOpen,
        selectedRow,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        addFormRef,
        editFormRef
    } = useFormContext<IMasterEarningsDeductionsList>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Earning/Deduction'
                        description='Fill in the details below to create a new earning/deduction'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeAddForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <AddEarningsDeductionsForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Earning/Deduction'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in border-primary/20 shadow-lg duration-300'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeEditForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <UpdateEarningsDeductionsForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleMasterEarningsDeductionsForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}

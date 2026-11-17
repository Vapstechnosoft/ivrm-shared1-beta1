'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useBMICalculation } from '@/hooks/sports/useBMICalculation';
import type { IBMICalculation } from '@/types/sports/transactions/bmi-calculation';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import BMICalculationForm from './_components/add-form';
import { bmiCalculationColumns } from './_components/columns';
import UpdateBMICalculationForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function BMICalculationPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useBMICalculation(searchParams);

    return (
        <FormProvider<IBMICalculation>>
            <BMICalculationPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}

function BMICalculationPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm, isAddFormOpen, isEditFormOpen, selectedRow, closeAddForm, closeEditForm, addFormRef, editFormRef } =
        useFormContext<IBMICalculation>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-6 p-4'>
                {/* Header/Add Button */}
                <div className='flex items-center justify-between'>
                    <h2 className='font-bold text-2xl tracking-tight'>BMI Calculation</h2>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='mr-1 h-4 w-4' />
                        New Calculation
                    </Button>
                </div>

                {/* Entry Form Section */}
                {(isAddFormOpen || isEditFormOpen) && (
                    <div ref={isAddFormOpen ? addFormRef : editFormRef}>
                        <CollapsibleSection
                            title={isEditFormOpen ? 'Edit BMI Calculation' : 'BMI Calculation Entry'}
                            defaultOpen={true}
                            variant='default'
                            className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                            <div className='relative'>
                                <Button
                                    type='button'
                                    onClick={isEditFormOpen ? closeEditForm : closeAddForm}
                                    variant='ghost'
                                    size='sm'
                                    className='-top-[3.5rem] absolute right-4 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                    <X className='mr-1 h-4 w-4 text-destructive' /> Close
                                </Button>
                                {isEditFormOpen && selectedRow ? (
                                    <UpdateBMICalculationForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                                ) : (
                                    <BMICalculationForm onSuccess={closeAddForm} />
                                )}
                            </div>
                        </CollapsibleSection>
                    </div>
                )}

                {/* Data Table Section */}
                <CollapsibleSection
                    title='BMI CALCULATION LIST'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IBMICalculation>
                        {...tableProps}
                        columns={bmiCalculationColumns}
                        isLoading={isLoading}
                        error={error}
                        //manualPagination={false}
                        showViewOptions={true}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading BMI data...'
                        noDataTitle='No Records Found'
                        noDataDescription='Start by calculating BMI for students'
                        errorTitle='Error Loading Data'
                    />
                </CollapsibleSection>
            </div>
        </div>
    );
}

'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import type { IInstitutionSubscription } from '@/types/super-admin/super-admin-module/institution/institution-subscription';
import { Plus, X } from 'lucide-react';
import AddInstitutionSubscriptionForm from './_components/add-form';
import { InstitutionSubscriptionColumns } from './_components/columns';

import { useInstitutionSubscriptionData } from '@/hooks/super-admin/super-admin-module/use-institution-subscription';
import { use } from 'react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function InstitutionSubscriptionPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useInstitutionSubscriptionData(searchParams);

    return (
        <FormProvider<IInstitutionSubscription>>
            <InstitutionSubscriptionPageContent
                response={response}
                isLoading={isLoading}
                error={error}
                refetchAll={refetchAll}
            />
        </FormProvider>
    );
}

function InstitutionSubscriptionPageContent({
    response,
    isLoading,
    error,
    refetchAll
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: any;
}) {
    const { openAddForm } = useFormContext<IInstitutionSubscription>();

    const tableProps = {
        data: response?.data || [],
        totalItems: response?.total || 0,
        success: response?.success,
        errorMessage: response?.message
    };

    return (
        <div>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Subscription
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    title='List of Subscriptions'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                >
                    <GenericDataTable<IInstitutionSubscription>
                        {...tableProps}
                        columns={InstitutionSubscriptionColumns}
                        isLoading={isLoading}
                        error={error}
                        total={tableProps.totalItems}
                        loadingMessage='Loading subscription details...'
                        noDataTitle='No Subscription Details Found'
                        noDataDescription='No subscription details available currently.'
                        isSearchRequired={true}
                        isPaginationRequired={true}
                        columnPinning={{ right: ['actions'] }}
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections refetchAll={refetchAll} />
            </div>
        </div>
    );
}

function FormSections({ refetchAll }: { refetchAll: () => void }) {
    const {
        isAddFormOpen,
        closeAddForm,
        addFormRef
    } = useFormContext<IInstitutionSubscription>();

    const handleSuccess = () => {
        closeAddForm();
        refetchAll();
    };

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Subscription'
                        description='Fill in the details below to create a new subscription'
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
                            <AddInstitutionSubscriptionForm onSuccess={handleSuccess} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </>
    );
}

'use client';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { usePeriodDistributionDetails } from '@/hooks/timetable/useMasters';
import type { PeriodDistributionColumn } from '@/types/timetable/masters/masters';
import { use } from 'react';
import { createPeriodDistributionColumns } from './_components/columns';

import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

import PeriodDistributionForm from './_components/period-distribution-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterPeriodPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = usePeriodDistributionDetails(searchParams);
    console.log('response', response);
    return (
        <FormProvider<PeriodDistributionColumn>>
            <MasterPeriodPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterPeriodPageContent({
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
    // The API returns periodlist in the response object
    const tableProps = useDataTableProps(response);
    const { openAddForm } = useFormContext<PeriodDistributionColumn>();

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <div className='space-y-1'>{/* <Heading title='Mode Of Payment' description='' /> */}</div>

                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Period Distribution
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<PeriodDistributionColumn>
                        {...tableProps}
                        columns={createPeriodDistributionColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Period Distribution Details...'
                        noDataTitle='No Periods Found'
                        noDataDescription='Create a period distribution to get started'
                        errorTitle='Error Loading Data'
                    />
                </CollapsibleSection>

                {/* <CollapsibleSection
                    title='Master Period Allocation'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg'
                >
                    <MasterPeriodForm onSuccess={refetchAll} />
                </CollapsibleSection> */}

                <FormSections onSuccess={refetchAll} />
            </div>
        </div>
    );
}

function FormSections({ onSuccess }: { onSuccess: () => void }) {
    const { isToggleFormOpen, selectedRow, isAddFormOpen, closeToggleForm, closeAddForm, addFormRef } =
        useFormContext<PeriodDistributionColumn>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master Period'
                        description='Fill in the details below to create a new Master Period'
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
                            <PeriodDistributionForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* {isToggleFormOpen && selectedRow && (
                <ToggleMasterPerioPeriodDistributionFormdForm
                    rowData={selectedRow}
                    onClose={() => {
                        closeToggleForm();
                        onSuccess();
                    }}
                />
            )} */}
        </>
    );
}

// 'use client';

// import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
// import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
// import { usePeriodDistributionDetails } from '@/hooks/timetable/useMasters';
// import { deactivatePeriodDistribution, savePeriodDistribution } from '@/server/timetable/masters/perioddistribution';
// import type { PeriodDistributionColumn } from '@/types/timetable/masters/masters';
// import { useEffect, useState } from 'react';
// import { toast } from 'sonner';
// import { createPeriodDistributionColumns } from './_components/columns';
// import PeriodDistributionForm from './_components/period-distribution-form';

// type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// export default function PeriodDistributionPage() {
//     const { data: response, isLoading, error, refetch } = usePeriodDistributionDetails();
//     const [data, setData] = useState<PeriodDistributionColumn[]>([]);

//     // The API returns all_period_distri_list for grid in the response object
//     const tableProps = useDataTableProps(
//         response && (response as any).all_period_distri_list ? { ...response, data: (response as any).all_period_distri_list } : response
//     );

//     useEffect(() => {
//         if (response && (response as any).all_period_distri_list) {
//             setData((response as any).all_period_distri_list);
//         }
//     }, [response]);

//     const handleSave = async (payload: any) => {
//         try {
//             const res = await savePeriodDistribution(payload);
//             if (res.returnval) {
//                 toast.success('Data successfully Saved');
//                 refetch();
//             } else if (res.returnduplicatestatus === 'Duplicate') {
//                 toast.error('Records Already Exist!');
//             } else {
//                 toast.error('Data Not Saved!');
//             }
//         } catch (error: any) {
//             toast.error(error.message || 'An error occurred');
//         }
//     };

//     const handleEdit = (row: PeriodDistributionColumn) => {
//         // Implement edit logic if needed - typically this would fetch details and populate the form
//         toast.info('Edit functionality requires fetching details.');
//     };

//     const handleDelete = (row: PeriodDistributionColumn) => {
//         // Implement delete if supported API exists
//     };

//     const handleToggleActive = async (row: PeriodDistributionColumn) => {
//         const payload = {
//             ttfpD_Id: row.ttfpD_Id,
//             ttfpD_ActiveFlag: row.ttfpD_ActiveFlag
//         };
//         try {
//             const res = await deactivatePeriodDistribution(payload);
//             if (res.returnval) {
//                 toast.success(row.ttfpD_ActiveFlag ? 'Deactivated successfully' : 'Activated successfully');
//                 refetch();
//             } else {
//                 toast.error('Operation failed');
//             }
//         } catch (error: any) {
//             console.error(error);
//             toast.error('An error occurred');
//         }
//     };

//     // const columns = createPeriodDistributionColumns({
//     //     onEdit: handleEdit,
//     //     onDelete: handleDelete,
//     //     onToggleActive: handleToggleActive
//     // });

//     return (
//         <div className='space-y-4 p-1'>
//             <CollapsibleSection
//                 title='Grid View'
//                 defaultOpen={true}
//                 variant='default'
//                 size='lg'
//                 className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
//                 <GenericDataTable<PeriodDistributionColumn>
//                     {...tableProps}
//                     //data={data}
//                     columns={createPeriodDistributionColumns}
//                     isLoading={isLoading}
//                     error={error}
//                     columnPinning={{ right: ['actions'] }}
//                     loadingMessage='Loading period distribution data...'
//                     noDataTitle='No Data Found'
//                     noDataDescription='No period distribution records found'
//                     errorTitle='Error Loading Data'
//                 />
//             </CollapsibleSection>

//             <CollapsibleSection title='Period Distribution' defaultOpen={true} variant='default' size='lg' className='shadow-lg'>
//                 <PeriodDistributionForm onSuccess={handleSave} />
//             </CollapsibleSection>
//         </div>
//     );
// }

'use client';
import { useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterEventCoe } from '@/hooks/coe/usemMaster';
import type { MasterEventCoe } from '@/types/coe/masterevent';
import { use } from 'react';
import AddMasterBirthdayForm from './_components/add-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterBirthday(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetch } = useMasterEventCoe(searchParams);

    return (
        <FormProvider<MasterEventCoe>>
            <MasterBirthdaypage response={response} isLoading={isLoading} error={error} refetch={refetch} />
        </FormProvider>
    );
}

function MasterBirthdaypage({
    response,
    isLoading,
    error,
    refetch
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetch?: () => void;
}) {
    const { openAddForm } = useFormContext<MasterEventCoe>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                {/* <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                     <div className='space-y-1'></div>
                     <Button
                         type='button'
                         onClick={openAddForm}
                         className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                         <Plus className='h-4 w-4' />
                         Add Master Event
                     </Button>
                 </div> */}

                {/* Data Table Section */}
                {/* <CollapsibleSection
                     defaultOpen={true}
                     variant='default'
                     size='lg'
                     className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                     <GenericDataTable<MasterEventCoe>
                         {...tableProps}
                         columns={masterMasterBirthdayColumn}
                         isLoading={isLoading}
                         error={error}
                         columnPinning={{ right: ['actions'] }}
                         loadingMessage='Loading master event...'
                         noDataTitle='No Master Event Found'
                         noDataDescription='Get started by creating your first Master Event'
                         errorTitle='Error Loading Master Event'
                     />
                 </CollapsibleSection> */}

                {/* Forms */}
                <FormSections refetch={refetch} />
            </div>
        </div>
    );
}

function FormSections({ refetch }: { refetch?: () => void }) {
    const {
        isAddFormOpen,
        isEditFormOpen,
        isToggleFormOpen,
        selectedRow,
        isDeleteFormOpen,
        closeDeleteForm,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        addFormRef,
        editFormRef
    } = useFormContext<MasterEventCoe>();

    return (
        <>
            {/* Add Form */}
            {/* {isAddFormOpen && (
                 <div ref={addFormRef}>
                     <CollapsibleSection
                         title='Add New Master Event'
                         description='Fill in the details below to create a New Master Event'
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
                             <AddMasterBirthdayForm
                                 onSuccess={() => {
                                     refetch?.();
                                     closeAddForm();
                                 }}
                             />
                         </div>
                     </CollapsibleSection>
                 </div>
             )} */}

            <div ref={addFormRef}>
                <CollapsibleSection
                    title='Add New Master Birthday'
                    description='Fill in the details below to create a New Master Birthday'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                    <div className='relative'>
                        <AddMasterBirthdayForm
                        //  onSuccess={() => {
                        //      refetch?.();
                        //      closeAddForm();
                        //  }}
                        />
                    </div>
                </CollapsibleSection>
            </div>
        </>
    );
}

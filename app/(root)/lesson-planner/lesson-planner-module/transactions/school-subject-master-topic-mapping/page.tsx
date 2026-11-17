'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import {
    getSchoolSubjectTopicMappingData,
    viewUploadFiles
} from '@/server/lesson-planner/transactions/school-subject-master-topic-mapping';
import type { ISchoolSubjectTopicMapping } from '@/types/lesson-planner/transactions/school-subject-master-topic-mapping';
import { ArrowUpDown, Plus, X } from 'lucide-react';
import { use, useCallback, useEffect, useState } from 'react';
import AddSchoolSubjectTopicMappingForm from './_components/add-form';
import { SchoolSubjectTopicMappingColumns } from './_components/columns';
import OrderSchoolSubjectTopicMappingForm from './_components/order-form';
import ToggleSchoolTopicForm from './_components/toggle-form';
import UpdateSchoolSubjectTopicMappingForm from './_components/update-form';
import ViewFilesModal from './_components/view-files-modal';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function SchoolSubjectTopicMappingPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const refetchAll = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getSchoolSubjectTopicMappingData(searchParams as any);
            console.info('School Subject Topic Mapping Response:', res);
            console.info('Response Keys:', Object.keys(res || {}));
            if (res?.data) console.info('Nested Data Keys:', Object.keys(res.data));

            if (res.success || res.data) {
                // Handle case where success might be inside data or implicit
                setData(res);
            } else {
                setData(null);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        refetchAll();
    }, [refetchAll]);

    return (
        <FormProvider<ISchoolSubjectTopicMapping>>
            <PageContent response={data} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function PageContent({
    response,
    isLoading,
    error,
    refetchAll
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: () => void;
}) {
    const { openAddForm } = useFormContext<ISchoolSubjectTopicMapping>();
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
    const [viewFileState, setViewFileState] = useState<{ isOpen: boolean; data: any[]; type: string }>({
        isOpen: false,
        data: [],
        type: ''
    });

    const tableProps = {
        data: response?.getdetails || response?.data?.getdetails || [],
        totalItems: response?.total || response?.data?.total || response?.getdetails?.length || response?.data?.getdetails?.length || 0,
        success: response?.success,
        errorMessage: response?.message
    };

    const getList = (key: string, alternatives: string[]) => {
        const dataObj = response || {};
        const innerData = response?.data || {};

        if (Array.isArray(dataObj[key])) return dataObj[key];
        if (Array.isArray(innerData)) return innerData;
        if (Array.isArray(innerData[key])) return innerData[key];

        for (const alt of alternatives) {
            if (Array.isArray(dataObj[alt])) return dataObj[alt];
            if (Array.isArray(innerData[alt])) return innerData[alt];
        }
        return [];
    };

    const masterYear = getList('getyear', ['getyearlist']);
    // Note: Other master lists (Class, Subject, Unit, Topic) are fetched dynamically or cascadingly in the Add/Edit forms
    // but we can pass initial data if available or if needed for global context.
    // For this page, we primarily need masterYear for order/filtering if we add page-level filters.

    useEffect(() => {
        const handleViewFiles = async (event: Event) => {
            const customEvent = event as CustomEvent;
            const { row, type } = customEvent.detail;
            try {
                const res: any = await viewUploadFiles(row.lpmT_Id, row.ismS_Id, row.lpmU_Id, type);
                if (res.uploadfiles) {
                    setViewFileState({ isOpen: true, data: res.uploadfiles, type });
                } else {
                    // Optionally show detailed error or 'no files' toast
                    alert('No files found');
                }
            } catch (e) {
                console.error(e);
            }
        };

        document.addEventListener('view-files', handleViewFiles);
        return () => {
            document.removeEventListener('view-files', handleViewFiles);
        };
    }, []);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Mapping
                    </Button>
                    <Button
                        type='button'
                        onClick={() => setIsOrderFormOpen(true)}
                        variant='outline'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <ArrowUpDown className='h-4 w-4' />
                        Set Order
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<ISchoolSubjectTopicMapping>
                        {...tableProps}
                        columns={SchoolSubjectTopicMappingColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading mappings...'
                        noDataTitle='No Mappings Found'
                        noDataDescription='Create a new mapping to get started'
                        errorTitle='Error Loading Mappings'
                    />
                </CollapsibleSection>

                <OrderSchoolSubjectTopicMappingForm
                    isOpen={isOrderFormOpen}
                    onClose={() => setIsOrderFormOpen(false)}
                    masterYear={masterYear}
                    onSuccess={refetchAll}
                />

                <FormSections onSuccess={refetchAll} masterYear={masterYear} />

                <ViewFilesModal
                    isOpen={viewFileState.isOpen}
                    onClose={() => setViewFileState({ ...viewFileState, isOpen: false })}
                    files={viewFileState.data}
                    type={viewFileState.type}
                />
            </div>
        </div>
    );
}

function FormSections({
    onSuccess,
    masterYear
}: {
    onSuccess: () => void;
    masterYear: any[];
}) {
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
    } = useFormContext<ISchoolSubjectTopicMapping>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Mapping'
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
                            <AddSchoolSubjectTopicMappingForm
                                masterYear={masterYear}
                                onSuccess={() => {
                                    onSuccess();
                                    closeAddForm();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Update Mapping'
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
                            <UpdateSchoolSubjectTopicMappingForm
                                selectedRow={selectedRow}
                                masterYear={masterYear}
                                onSuccess={() => {
                                    onSuccess();
                                    closeEditForm();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && (
                <ToggleSchoolTopicForm rowData={selectedRow} onClose={closeToggleForm} onSuccess={onSuccess} />
            )}
        </>
    );
}

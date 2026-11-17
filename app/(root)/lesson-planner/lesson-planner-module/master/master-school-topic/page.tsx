'use client';

import AddMasterSchoolTopicForm from '@/app/(root)/lesson-planner/lesson-planner-module/master/master-school-topic/_components/add-form';
import { MasterSchoolTopicColumns } from '@/app/(root)/lesson-planner/lesson-planner-module/master/master-school-topic/_components/columns';
import OrderMasterSchoolTopicForm from '@/app/(root)/lesson-planner/lesson-planner-module/master/master-school-topic/_components/order-form';
import ToggleMasterSchoolTopicForm from '@/app/(root)/lesson-planner/lesson-planner-module/master/master-school-topic/_components/toggle-form';
import UpdateMasterSchoolTopicForm from '@/app/(root)/lesson-planner/lesson-planner-module/master/master-school-topic/_components/update-form';
import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { getSchoolTopicData } from '@/server/lesson-planner/master/school-topic';
import type { IMasterSchoolTopic } from '@/types/lesson-planner/master/school-topic';
import { ArrowUpDown, Plus, X } from 'lucide-react';
import { use, useCallback, useEffect, useState } from 'react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterSchoolTopicPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [mI_Id, setMI_Id] = useState<number>(0);
    const [userId, setUserId] = useState<number>(0);

    const refetchAll = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getSchoolTopicData(searchParams as any);
            console.info('School Topic Response:', res);
            if (res.success) {
                setData(res);
                setMI_Id((res as any).mI_Id || 0);
                setUserId((res as any).userId || 0);
            } else {
                setData(null);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching school topic data:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        refetchAll();
    }, [refetchAll]);

    return (
        <FormProvider<IMasterSchoolTopic>>
            <PageContent response={data} isLoading={isLoading} error={error} refetchAll={refetchAll} mI_Id={mI_Id} userId={userId} />
        </FormProvider>
    );
}

function PageContent({
    response,
    isLoading,
    error,
    refetchAll,
    mI_Id,
    userId
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: () => void;
    mI_Id: number;
    userId: number;
}) {
    const { openAddForm } = useFormContext<IMasterSchoolTopic>();
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

    // Explicit mapping to ensure server-side pagination works correctly
    const tableProps = {
        data: Array.isArray(response?.data) ? response.data : response?.data?.getdetails || [],
        totalItems: response?.total || response?.data?.total || 0,
        success: response?.success,
        errorMessage: response?.message
    };

    const getList = (key: string, alternatives: string[]) => {
        const dataObj = response?.data || {};
        if (Array.isArray(dataObj[key])) return dataObj[key];
        for (const alt of alternatives) {
            if (Array.isArray(dataObj[alt])) return dataObj[alt];
        }
        return [];
    };

    const masterYear = getList('getyear', ['getyearlist', 'getyearDetails', 'yearlist', 'getAcademicYear']);
    const masterUnit = getList('getunitlist', ['getunitlist', 'unitlist', 'getunitlisting']);
    const masterClasses = getList('getclass', ['getclasslist', 'classList', 'getMasterClass']);
    const masterSubjects = getList('getsubject', ['getsubjectlist', 'subjectlist', 'getSubjects', 'getMastersubject']);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Topic
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
                    <GenericDataTable<IMasterSchoolTopic>
                        {...tableProps}
                        columns={MasterSchoolTopicColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading topics...'
                        noDataTitle='No Topics Found'
                        noDataDescription='Create a new topic to get started'
                        errorTitle='Error Loading Topics'
                    />
                </CollapsibleSection>

                <OrderMasterSchoolTopicForm
                    isOpen={isOrderFormOpen}
                    onClose={() => setIsOrderFormOpen(false)}
                    masterYear={masterYear}
                    onSuccess={refetchAll}
                />

                <FormSections
                    onSuccess={refetchAll}
                    masterYear={masterYear}
                    masterUnit={masterUnit}
                    masterClasses={masterClasses}
                    masterSubjects={masterSubjects}
                    mI_Id={mI_Id}
                    userId={userId}
                />
            </div>
        </div>
    );
}

function FormSections({
    onSuccess,
    masterYear,
    masterUnit,
    masterClasses,
    masterSubjects,
    mI_Id,
    userId
}: {
    onSuccess: () => void;
    masterYear: any[];
    masterUnit: any[];
    masterClasses: any[];
    masterSubjects: any[];
    mI_Id: number;
    userId: number;
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
    } = useFormContext<IMasterSchoolTopic>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Topic'
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
                            <AddMasterSchoolTopicForm
                                masterYear={masterYear}
                                masterUnit={masterUnit}
                                initialClasses={masterClasses}
                                initialSubjects={masterSubjects}
                                onSuccess={() => {
                                    onSuccess();
                                    closeAddForm();
                                }}
                                mI_Id={mI_Id}
                                userId={userId}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Update Topic'
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
                            <UpdateMasterSchoolTopicForm
                                selectedRow={selectedRow}
                                onSuccess={() => {
                                    onSuccess();
                                    closeEditForm();
                                }}
                                masterYear={masterYear}
                                masterUnit={masterUnit}
                                masterClasses={masterClasses}
                                masterSubjects={masterSubjects}
                                mI_Id={mI_Id}
                                userId={userId}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && (
                <ToggleMasterSchoolTopicForm rowData={selectedRow} onClose={closeToggleForm} onSuccess={onSuccess} />
            )}
        </>
    );
}

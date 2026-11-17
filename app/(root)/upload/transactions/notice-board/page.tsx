'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useNoticeBoard } from '@/hooks/upload/transactions/use-notice-board';
import type { INoticeBoard } from '@/schemas/upload/transactions/notice-board.schema';
import { Loader2, Plus, X } from 'lucide-react';
import { Suspense } from 'react';
import AddNoticeBoardForm from './_components/add-form';
import { noticeBoardColumns } from './_components/columns';

import { toast } from 'sonner';

export default function NoticeBoardPage() {
    return (
        <Suspense fallback={<div className='flex h-full items-center justify-center'><Loader2 className='h-8 w-8 animate-spin' /></div>}>
            <NoticeBoardContent />
        </Suspense>
    );
}

function NoticeBoardContent() {
    const { data, isLoading, error, refetchAll } = useNoticeBoard();

    return (
        <FormProvider<INoticeBoard>>
            <NoticeBoardManager
                data={data}
                isLoading={isLoading}
                error={error}
                refetchAll={refetchAll}
            />
        </FormProvider>
    );
}

function NoticeBoardManager({
    data,
    isLoading,
    error,
    refetchAll
}: {
    data: any;
    isLoading: boolean;
    error: any;
    refetchAll: () => void;
}) {
    const { openAddForm, isAddFormOpen, isEditFormOpen, selectedRow, closeAddForm, closeEditForm, addFormRef, editFormRef } = useFormContext<INoticeBoard>();

    const tableProps = {
        data: data?.noticeList || [],
        isLoading,
        error
    };

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Notice
                    </Button>
                </div>

                <CollapsibleSection
                    title='Notice Board List'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg'>
                    <GenericDataTable<INoticeBoard>
                        {...tableProps}
                        columns={noticeBoardColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading notices...'
                        noDataTitle='No Notices Found'
                        noDataDescription='Get started by creating your first notice'
                        errorTitle='Error Loading Notices'
                    />
                </CollapsibleSection>

                {isAddFormOpen && (
                    <div ref={addFormRef}>
                        <CollapsibleSection
                            title='Add New Notice'
                            defaultOpen={true}
                            variant='outline'
                            className='slide-in-from-top-4 animate-in shadow-lg'>
                            <div className='relative'>
                                <Button
                                    type='button'
                                    onClick={closeAddForm}
                                    variant='ghost'
                                    size='sm'
                                    className='absolute -top-12 right-0 border p-2 shadow-md hover:bg-destructive/10'>
                                    <X className='h-4 w-4 text-destructive' /> Close
                                </Button>
                                <AddNoticeBoardForm
                                    onSuccess={() => { closeAddForm(); refetchAll(); }}
                                    yearList={data?.yearlist || []}
                                    classList={data?.classlist || []}
                                    sectionList={data?.sectionlist || []}
                                    departmentList={data?.departmentList || []}
                                    designationList={data?.designationList || []}
                                    staffList={data?.staffList || []}
                                    studentList={data?.studentList || []}
                                    routeList={data?.routes || []}
                                    feeGroupList={data?.feeGroups || []}
                                    subjectList={data?.subjectList || []}
                                />
                            </div>
                        </CollapsibleSection>
                    </div>
                )}
            </div>
        </div>
    );
}

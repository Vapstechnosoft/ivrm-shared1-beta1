'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { getAlumniNoticeBoardData } from '@/server/alumni/alumni-notice-board';
import type { IAlumniNoticeBoard } from '@/types/alumni/alumni-notice-board';
import { Plus, X } from 'lucide-react';
import { use, useCallback, useEffect, useState } from 'react';
import AddAlumniNoticeBoardForm from './_components/add-form';
import { AlumniNoticeBoardColumns } from './_components/columns';
import UpdateAlumniNoticeBoardForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function AlumniNoticeBoardPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [mI_Id, setMI_Id] = useState<number>(0);
    const [asmaY_Id, setAsmaY_Id] = useState<number>(0);

    const refetchAll = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getAlumniNoticeBoardData(searchParams as any);
            console.info('Notice Board RAW Response:', res);
            if (res.success && res.data) {
                // Shape the data for the GenericDataTable
                const dataList = (Array.isArray(res.data) ? res.data : res.alumninoticeboardlist || []) as IAlumniNoticeBoard[];

                const shapedResponse = {
                    ...res,
                    data: dataList,
                    total: res.total || dataList.length
                };

                console.info('Notice Board Data Array:', shapedResponse.data);
                setData(shapedResponse);
                // Handle metadata if it exists
                setMI_Id(Number(res.mI_Id || 0));
                setAsmaY_Id(Number(res.asmaY_Id || 0));
            } else {
                console.warn('Notice Board fetch failed:', res.message);
                setData(null);
            }
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        refetchAll();
    }, [refetchAll]);

    return (
        <FormProvider<IAlumniNoticeBoard>>
            <PageContent response={data} isLoading={isLoading} error={error} refetchAll={refetchAll} mI_Id={mI_Id} asmaY_Id={asmaY_Id} />
        </FormProvider>
    );
}

interface PageContentProps {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: () => void;
    mI_Id: number;
    asmaY_Id: number;
}

function PageContent({ response, isLoading, error, refetchAll, mI_Id, asmaY_Id }: PageContentProps) {
    const { openAddForm } = useFormContext<IAlumniNoticeBoard>();

    // DEBUG: Logging response to inspect structure
    console.info('PageContent response:', response);

    // Mapping response explicitly to ensure data binding
    const tableProps = {
        data: response?.data || [],
        totalItems: response?.total || 0,
        success: response?.success,
        errorMessage: response?.message
    };

    console.info('PageContent tableProps:', tableProps);
    // DEBUG: Logging data prop passed to GenericDataTable
    console.info('GenericDataTable data prop:', tableProps.data);
    console.info('GenericDataTable totalItems prop:', tableProps.totalItems);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Notice
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IAlumniNoticeBoard>
                        {...tableProps}
                        columns={AlumniNoticeBoardColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading notices...'
                        noDataTitle='No Notices Found'
                        noDataDescription='Create a new notice to get started'
                        errorTitle='Error Loading Notices'
                    />
                </CollapsibleSection>

                <FormSections onSuccess={refetchAll} mI_Id={mI_Id} asmaY_Id={asmaY_Id} />
            </div>
        </div>
    );
}

import ToggleNoticeForm from './_components/toggle-form';
import ViewAttachmentDialog from './_components/view-dialog';

function FormSections({
    onSuccess,
    mI_Id,
    asmaY_Id
}: {
    onSuccess: () => void;
    mI_Id: number;
    asmaY_Id: number;
}) {
    const {
        isAddFormOpen,
        isEditFormOpen,
        isToggleFormOpen,
        isDetailsViewOpen,
        selectedRow,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        closeDetailsView,
        addFormRef,
        editFormRef
    } = useFormContext<IAlumniNoticeBoard>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Notice'
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
                            <AddAlumniNoticeBoardForm
                                onSuccess={() => {
                                    onSuccess();
                                    closeAddForm();
                                }}
                                mI_Id={mI_Id}
                                asmaY_Id={asmaY_Id}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Notice'
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
                            <UpdateAlumniNoticeBoardForm
                                selectedRow={selectedRow}
                                onSuccess={() => {
                                    onSuccess();
                                    closeEditForm();
                                }}
                                mI_Id={mI_Id}
                                asmaY_Id={asmaY_Id}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && <ToggleNoticeForm rowData={selectedRow} onClose={closeToggleForm} onSuccess={onSuccess} />}

            {isDetailsViewOpen && selectedRow && <ViewAttachmentDialog rowData={selectedRow} onClose={closeDetailsView} />}
        </>
    );
}

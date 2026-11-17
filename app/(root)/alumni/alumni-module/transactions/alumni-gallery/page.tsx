'use client';

import AddAlumniGalleryForm from '@/app/(root)/alumni/alumni-module/transactions/alumni-gallery/_components/add-form';
import { AlumniGalleryColumns } from '@/app/(root)/alumni/alumni-module/transactions/alumni-gallery/_components/columns';
import ToggleAlumniGalleryForm from '@/app/(root)/alumni/alumni-module/transactions/alumni-gallery/_components/toggle-form';
import UpdateAlumniGalleryForm from '@/app/(root)/alumni/alumni-module/transactions/alumni-gallery/_components/update-form';
import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { getAlumniGalleryData } from '@/server/alumni/alumni-gallery';
import type { IAlumniGallery } from '@/types/alumni/alumni-gallery';
import { Plus, X } from 'lucide-react';
import { use, useCallback, useEffect, useState } from 'react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function AlumniGalleryPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [mI_Id, setMI_Id] = useState<number>(0);
    const [asmaY_Id, setAsmaY_Id] = useState<number>(0);

    const refetchAll = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getAlumniGalleryData(searchParams as any);
            console.info('Gallery Response:', res);
            if (res.success) {
                setData(res);
                setMI_Id((res as any).mI_Id || 0);
                setAsmaY_Id((res as any).asmaY_Id || 0);
            } else {
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
        <FormProvider<IAlumniGallery>>
            <PageContent response={data} isLoading={isLoading} error={error} refetchAll={refetchAll} mI_Id={mI_Id} asmaY_Id={asmaY_Id} />
        </FormProvider>
    );
}

function PageContent({
    response,
    isLoading,
    error,
    refetchAll,
    mI_Id,
    asmaY_Id
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: () => void;
    mI_Id: number;
    asmaY_Id: number;
}) {
    const { openAddForm } = useFormContext<IAlumniGallery>();

    // Explicit mapping to ensure server-side pagination works correctly
    const tableProps = {
        data: Array.isArray(response?.data) ? response.data : response?.data?.get_galleryimg || response?.get_galleryimg || [],
        totalItems: response?.total || response?.data?.total || 0,
        success: response?.success,
        errorMessage: response?.message
    };

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Gallery Entry
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IAlumniGallery>
                        {...tableProps}
                        columns={AlumniGalleryColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading gallery...'
                        noDataTitle='No Gallery Entries Found'
                        noDataDescription='Create a new gallery entry to get started'
                        errorTitle='Error Loading Gallery'
                    />
                </CollapsibleSection>

                <FormSections onSuccess={refetchAll} mI_Id={mI_Id} asmaY_Id={asmaY_Id} />
            </div>
        </div>
    );
}

function FormSections({ onSuccess, mI_Id, asmaY_Id }: { onSuccess: () => void; mI_Id: number; asmaY_Id: number }) {
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
    } = useFormContext<IAlumniGallery>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Gallery Entry'
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
                            <AddAlumniGalleryForm
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
                        title='View Gallery Details'
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
                            <UpdateAlumniGalleryForm
                                selectedRow={selectedRow}
                                onSuccess={() => {
                                    onSuccess();
                                    closeEditForm();
                                }}
                                mI_Id={mI_Id}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && (
                <ToggleAlumniGalleryForm rowData={selectedRow} onClose={closeToggleForm} onSuccess={onSuccess} />
            )}
        </>
    );
}

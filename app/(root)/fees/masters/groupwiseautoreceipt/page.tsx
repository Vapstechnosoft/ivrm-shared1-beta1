'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown, useFeeMasterGroupwiseAutoReceipt } from '@/hooks/fees/useMasters';
import { tableSearchVariables } from '@/lib/data-table.config';
import type { IMasterGroupWiseAutoReciptList } from '@/types/fees/masters/masters';
import { Plus, X } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { use, useEffect, useState } from 'react';
import AddMasterClassForm from './_components/add-form';
import { masterGroupWiseAutoReciptColumns } from './_components/columns';
import DeleteMasterAutoReceiptForm from './_components/delete-form';
import UpdateMasterClassForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterClassPage(props: {
    searchParams: SearchParams;
}) {
    const _searchParams = use(props.searchParams);

    const [academicYearId, setAcademicYearId] = useState<number | null>(null);
    const [searchQuery] = useQueryState(tableSearchVariables.search, parseAsString.withOptions({ shallow: false }).withDefault(''));

    const { data: response, isLoading, error, refetch } = useFeeMasterGroupwiseAutoReceipt(academicYearId || 0, _searchParams);

    // Refetch whenever academicYearId or searchQuery changes
    useEffect(() => {
        refetch();
    }, [academicYearId, searchQuery, refetch]);

    const { data: academicYearOptions, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();

    useEffect(() => {
        if (!academicYearLoading && academicYearOptions?.data?.length && academicYearId === null) {
            setAcademicYearId(Number(academicYearOptions.data[0].asmaY_Id));
        }
    }, [academicYearLoading, academicYearOptions, academicYearId]);

    return (
        <FormProvider<IMasterGroupWiseAutoReciptList>>
            <MasterClassPageContent
                response={response}
                isLoading={isLoading}
                error={error}
                refetch={refetch}
                academicYearId={academicYearId}
                setAcademicYearId={setAcademicYearId}
                searchQuery={searchQuery}
                academicYearLoading={academicYearLoading}
                academicYearError={academicYearError}
                academicYearOptions={academicYearOptions}
            />
        </FormProvider>
    );
}
function MasterClassPageContent({
    response,
    isLoading,
    error,
    refetch,
    academicYearId,
    setAcademicYearId,
    searchQuery,
    academicYearLoading,
    academicYearError,
    academicYearOptions
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetch: () => void;
    academicYearId: number | null;
    setAcademicYearId: (id: number | null) => void;
    searchQuery: string;
    academicYearLoading: boolean;
    academicYearError: any;
    academicYearOptions: any;
}) {
    const { openAddForm } = useFormContext<IMasterGroupWiseAutoReciptList>();
    const tableProps = useDataTableProps(response);

    // Fetch academic year dropdown data

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Top row: filter on the left, heading + action on the right */}
                <div className='flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-center gap-4 rounded-xl border p-4 shadow-xl'>
                        {/* Academic Year Filter */}
                        <div className='flex w-full flex-col gap-2 sm:w-56'>
                            <Label htmlFor='academic-year' className='mb-1 font-semibold'>
                                Academic Year
                            </Label>
                            <Select
                                value={academicYearId !== null ? String(academicYearId) : ''}
                                onValueChange={(value) => {
                                    setAcademicYearId(Number(value));
                                }}>
                                <SelectTrigger id='academic-year'>
                                    <SelectValue placeholder='Select Academic Year' />
                                </SelectTrigger>

                                <SelectContent>
                                    {academicYearLoading ? (
                                        <SelectItem value='loading' disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : academicYearError ? (
                                        <SelectItem value='error' disabled>
                                            Error loading
                                        </SelectItem>
                                    ) : (
                                        academicYearOptions?.data?.map((item: any) => (
                                            <SelectItem key={item.asmaY_Id} value={String(item.asmaY_Id)}>
                                                {item.asmaY_Year}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='flex items-center justify-end gap-4'>
                        <div className='hidden space-y-1 sm:block'>
                            <Heading title='' description='' />
                        </div>
                        <Button
                            type='button'
                            onClick={openAddForm}
                            className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                            <Plus className='h-4 w-4' />
                            Add Group Receipt
                        </Button>
                    </div>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterGroupWiseAutoReciptList>
                        {...tableProps}
                        columns={masterGroupWiseAutoReciptColumns}
                        isLoading={isLoading}
                        error={error}
                        searchQuery={searchQuery}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading group receipt settings...'
                        noDataTitle='No Records Found'
                        noDataDescription='Start by adding a new group receipt configuration'
                        errorTitle='Error Loading Data'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections refetch={refetch} />
            </div>
        </div>
    );
}

function FormSections({ refetch }: { refetch: () => void }) {
    const {
        isAddFormOpen,
        isEditFormOpen,
        isDeleteFormOpen,
        selectedRow,
        closeAddForm,
        closeEditForm,
        closeDeleteForm,
        addFormRef,
        editFormRef
    } = useFormContext<IMasterGroupWiseAutoReciptList>();

    useEffect(() => {
        if (isEditFormOpen && !selectedRow) {
            console.error('FormSections: Edit form open but selectedRow is undefined');
        }
    }, [isEditFormOpen, selectedRow]);

    const handleSuccess = () => {
        refetch();
    };

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Group Receipt Configuration'
                        description='Fill in the details below to create a new group receipt setting'
                        defaultOpen
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
                            <AddMasterClassForm
                                onSuccess={() => {
                                    handleSuccess();
                                    closeAddForm();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow ? (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Group Receipt Configuration'
                        // description={`Editing: ${selectedRow.fmcC_ClassCategoryName} (${selectedRow.asmaY_Year})`}
                        defaultOpen
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
                            <UpdateMasterClassForm
                                selectedRow={selectedRow}
                                onSuccess={() => {
                                    handleSuccess();
                                    closeEditForm();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            ) : isEditFormOpen ? (
                <div className='rounded-md border border-red-200 bg-red-50 p-4'>
                    <p className='font-medium text-red-600'>Error: Invalid or no group selected for editing.</p>
                </div>
            ) : null}

            {/* Delete Form */}
            {isDeleteFormOpen && selectedRow && (
                <DeleteMasterAutoReceiptForm
                    rowData={selectedRow}
                    onClose={closeDeleteForm}
                    onSuccess={() => {
                        handleSuccess();
                        closeDeleteForm();
                    }}
                />
            )}
        </>
    );
}

'use client';

import { Button } from '@/components/ui/button';
import type { DataTableRef } from '@/components/ui/data-table/data-table';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useFormContext } from '@/components/ui/form/form-provider';
import { FormProvider } from '@/components/ui/form/form-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown, useMasterAllFeeHead } from '@/hooks/fees/useMasters';
import { tableSearchVariables } from '@/lib/data-table.config';
import type { IFeeGroupMapping } from '@/types/fees/masters/masters';
import { Plus, X } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { use, useRef, useState } from 'react';
import YearlyFeeGroupMapping from './_components/add-form';
import { yearlyGroupMappingColumns } from './_components/columns';
import DeleteMasterYearlyGroupForm from './_components/delete-form';

type SearchParams = { [key: string]: string | string[] | undefined };

interface AcademicYearOption {
    asmaY_Id: number;
    asmaY_Year: string;
}

function FeeGroupMappingContent({
    searchParams: _searchParams
}: {
    searchParams: Promise<SearchParams>;
}) {
    const { openAddForm } = useFormContext<IFeeGroupMapping>();
    const tableRef = useRef<DataTableRef>(null);

    const searchParams = use(_searchParams);

    const [searchQuery] = useQueryState(tableSearchVariables.search, parseAsString.withOptions({ shallow: false }).withDefault(''));
    const [academicYearIdNew, setacademicYearIdNew] = useState<number>(0);

    const { data: academicYearData, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();

    // ⬇️ INCLUDE refetch here
    const {
        data: feeHeadResponse,
        isLoading: feeHeadLoading,
        error: feeHeadError,
        isFetching,
        refetch // ⬅️ IMPORTANT
    } = useMasterAllFeeHead(academicYearIdNew > 0 ? academicYearIdNew : 0, searchParams);

    const feeGroupData = academicYearIdNew > 0 && Array.isArray(feeHeadResponse?.data) ? feeHeadResponse.data : [];

    const tableProps = useDataTableProps({
        ...feeHeadResponse,
        data: feeGroupData
    });

    return (
        <div className='min-h-screen space-y-6'>
            {/* Top Bar */}
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                <div className='w-full rounded-lg border bg-card p-6 shadow-sm sm:w-auto'>
                    <div className='flex flex-col gap-2 sm:w-64'>
                        <Label htmlFor='academic-year' className='font-semibold text-sm'>
                            Academic Year
                        </Label>
                        <Select
                            value={String(academicYearIdNew)}
                            onValueChange={(val) => setacademicYearIdNew(Number(val) || 0)}
                            disabled={academicYearLoading}>
                            <SelectTrigger id='academic-year' className='w-full'>
                                <SelectValue placeholder='Select Academic Year' />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYearLoading ? (
                                    <SelectItem value='loading' disabled>
                                        Loading...
                                    </SelectItem>
                                ) : academicYearError ? (
                                    <SelectItem value='error' disabled>
                                        Error loading years
                                    </SelectItem>
                                ) : !academicYearData?.data?.length ? (
                                    <SelectItem value='no-data' disabled>
                                        No academic years
                                    </SelectItem>
                                ) : (
                                    <>
                                        <SelectItem value='0' disabled>
                                            Select Academic Year
                                        </SelectItem>
                                        {academicYearData.data.map((item: AcademicYearOption) => (
                                            <SelectItem key={item.asmaY_Id} value={String(item.asmaY_Id)}>
                                                {item.asmaY_Year}
                                            </SelectItem>
                                        ))}
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Add Button */}
                <Button
                    onClick={openAddForm}
                    className='mt-8 h-10 w-full rounded-lg bg-orange-500 px-4 font-medium text-white shadow-md transition-all duration-200 hover:bg-orange-600 hover:shadow-lg sm:w-auto'>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Yearly Group Mapping
                </Button>
            </div>

            {/* Data Table */}
            <div className='space-y-4'>
                <CollapsibleSection defaultOpen variant='default' size='lg' className='shadow-sm'>
                    <GenericDataTable<IFeeGroupMapping>
                        {...tableProps}
                        ref={tableRef}
                        columns={yearlyGroupMappingColumns}
                        data={feeGroupData}
                        isLoading={feeHeadLoading || isFetching}
                        error={feeHeadError}
                        showViewOptions={false}
                        searchQuery={searchQuery}
                        loadingMessage='Loading fee group mappings...'
                        noDataTitle='No Records Found'
                        noDataDescription={
                            academicYearIdNew === 0
                                ? 'Please select an Academic Year to view fee group mappings.'
                                : 'No records found for the selected academic year.'
                        }
                    />
                </CollapsibleSection>
            </div>

            {/* Pass refetch to form section */}
            <FormSections refetchTable={refetch} />
        </div>
    );
}

// Main Page Component
export default function FeeGroupMappingView({
    searchParams: _searchParams
}: {
    searchParams: Promise<SearchParams>;
}) {
    return (
        <FormProvider<IFeeGroupMapping>>
            <FeeGroupMappingContent searchParams={_searchParams} />
        </FormProvider>
    );
}

/* ----------------- FORM SECTIONS ---------------- */

function FormSections({ refetchTable }: { refetchTable: () => void }) {
    const { isAddFormOpen, closeAddForm, addFormRef, isDeleteFormOpen, closeDeleteForm, selectedRow } = useFormContext<IFeeGroupMapping>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Fee Group Mapping'
                        description='Add a new yearly fee group mapping'
                        defaultOpen
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in border-primary/20 shadow-lg duration-300'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeAddForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>

                            {/* SUCCESS → close form + refetch table */}
                            <YearlyFeeGroupMapping
                                onSuccess={() => {
                                    closeAddForm();
                                    refetchTable(); // 🔥 IMPORTANT: refresh table
                                }}
                                //onSuccess={closeAddForm}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isDeleteFormOpen && selectedRow && (
                <DeleteMasterYearlyGroupForm rowData={selectedRow} fyghM_Id={selectedRow.fyghM_Id} onClose={closeDeleteForm} />
            )}
        </>
    );
}

'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { useMasterCategoryMappedSections } from '@/hooks/exam/exammodule/usemasters';
import type { ICategoryClassMappingDetails, ICategoryMapping } from '@/types/exam/exam-module/masters';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { CategoryClassMappingDetalisColumns } from './subject-group-details-columns';
import ToggleCategoryClassMappingForm from './toggle-form';

interface CategoryClassMappingDetailsPageProps {
    rowData: ICategoryMapping;
    onClose: () => void;
}

export default function CategoryClassMappingDetailsPage({ rowData, onClose }: CategoryClassMappingDetailsPageProps) {
    // ✅ Use your custom hook instead of manual fetch
    const {
        data: apiResponse,
        isLoading,
        refetchAll
    } = useMasterCategoryMappedSections(rowData.asmaY_Id, rowData.emcA_Id, rowData.asmcL_Id);

    useEffect(() => {
        refetchAll();
    }, [rowData.asmaY_Id, rowData.emcA_Id, rowData.asmcL_Id]);
    const sections = Array.isArray(apiResponse?.data) ? apiResponse.data : [];

    const mappedData: ICategoryClassMappingDetails[] = sections.map((section: any, index: number) => ({
        mI_Id: rowData.mI_Id,
        ecaC_Id: section.ecaC_Id,
        asmS_Id: section.asmS_Id,
        asmcL_ClassName: rowData.asmcL_ClassName,
        asmC_SectionCode: section.asmC_SectionCode!,
        asmC_SectionName: section.asmC_SectionName,
        asmC_MaxCapacity: 40,
        asmC_Order: index + 1,
        ecaC_ActiveFlag: section.ecaC_ActiveFlag
    }));

    const tableProps = useDataTableProps({
        data: mappedData,
        total: mappedData.length,
        pageIndex: 0,
        pageSize: 5
    });

    return (
        <FormProvider<ICategoryClassMappingDetails>>
            <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-[10vh]'>
                <div className='relative mx-auto w-[70%] rounded-2xl bg-white p-6 shadow-xl'>
                    {/* Header Section */}
                    <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='space-y-1'>
                            <Heading
                                title={`Category-Class Mapping Details ${rowData.emcA_CategoryName ? ` - ${rowData.emcA_CategoryName}` : ''}`}
                                description={`View mapped sections for class "${rowData.asmcL_ClassName}" (${rowData.asmaY_Year})`}
                            />
                        </div>

                        <div className='flex gap-2'>
                            <Button
                                type='button'
                                onClick={onClose}
                                variant='ghost'
                                size='sm'
                                className='right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <GenericDataTable<ICategoryClassMappingDetails>
                        {...tableProps}
                        columns={CategoryClassMappingDetalisColumns}
                        isLoading={isLoading}
                        errorTitle='Error Loading Mappings'
                        noDataTitle='No Mappings Found'
                        noDataDescription='No class-section mappings available for this category.'
                        columnPinning={{ right: ['actions'] }}
                        showViewOptions={false}
                    />

                    {/* Toggle Modal */}
                    <FormSections refetchAll={refetchAll} rowData={rowData} />
                </div>
            </div>
        </FormProvider>
    );
}

function FormSections({ refetchAll, rowData }: { refetchAll: () => void; rowData: ICategoryMapping }) {
    const { isToggleFormOpen, selectedRow, closeToggleForm } = useFormContext<ICategoryClassMappingDetails>();

    return (
        <>
            {isToggleFormOpen && selectedRow && (
                <ToggleCategoryClassMappingForm
                    rowData={selectedRow}
                    parentRowData={rowData}
                    onClose={closeToggleForm}
                    refetchAll={refetchAll}
                />
            )}
        </>
    );
}

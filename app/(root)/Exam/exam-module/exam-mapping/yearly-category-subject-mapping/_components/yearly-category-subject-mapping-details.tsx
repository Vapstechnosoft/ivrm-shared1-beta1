'use client';

import ToggleMasterCategoryForm from '@/app/(root)/admission/preadmission/masters/category/_components/toggle-form';
import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { getYearlyCategorySubjectMappingDetails } from '@/server/exam/exam-module/exam-mapping/yearly-category-subject-mapping';
import type { IMasterCategoryList } from '@/types/admission/preadmission/masters';
import type { IYearlyCategorySubjectMapping, IYearlyCategorySubjectMappingViewDetails } from '@/types/exam/exam-module/exam-mapping';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { YearlyCategorySubjectMappingViewDetailsColumns } from './yearly-category-subject-mapping-columns';

interface YearlyCategorySubjectMappingDetailsPageProps {
    rowData: IYearlyCategorySubjectMapping;
    onClose: () => void;
}

export default function YearlyCategorySubjectMappingDetailsPage({ rowData, onClose }: YearlyCategorySubjectMappingDetailsPageProps) {
    const [mappings, setMappings] = useState<IYearlyCategorySubjectMappingViewDetails[]>([]);
    const [loading, setLoading] = useState(false);

    // -------------------------
    // Fetch yearly category subject mappings
    // -------------------------
    useEffect(() => {
        async function fetchMappings() {
            if (!rowData.eyC_Id) return;
            setLoading(true);

            try {
                const response = await getYearlyCategorySubjectMappingDetails(rowData.eyC_Id, rowData.eycG_Id, rowData.asmaY_Id);

                const apiResponse = response as unknown as {
                    success: boolean;
                    message: string;
                    data: IYearlyCategorySubjectMappingViewDetails[];
                };

                const data = apiResponse?.data || [];
                setMappings(data);
            } catch (error: any) {
                toast.error(error.message || 'Failed to fetch yearly category subject mappings');
            } finally {
                setLoading(false);
            }
        }

        fetchMappings();
    }, [rowData]);

    // -------------------------
    // Data table props
    // -------------------------
    const tableProps = useDataTableProps({
        data: mappings,
        total: mappings.length,
        pageIndex: 0,
        pageSize: 5
    });

    // -------------------------
    // Render
    // -------------------------
    return (
        <FormProvider<IYearlyCategorySubjectMappingViewDetails>>
            <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-[10vh]'>
                <div className='relative mx-auto w-[70%] rounded-2xl bg-white p-6 shadow-xl'>
                    {/* Header Section */}
                    <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='space-y-1'>
                            <Heading
                                title={`Yearly Category Subject Mapping ${
                                    rowData.emcA_CategoryName ? `- ${rowData.emcA_CategoryName}` : ''
                                }`}
                                description={`View mapped subjects for category "${rowData.emcA_CategoryName}" (${rowData.asmaY_Year})`}
                            />
                        </div>
                        <div className='flex gap-2'>
                            <Button
                                variant='secondary'
                                onClick={onClose}
                                className='shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                                Close
                            </Button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <GenericDataTable<IYearlyCategorySubjectMappingViewDetails>
                        {...tableProps}
                        columns={YearlyCategorySubjectMappingViewDetailsColumns}
                        isLoading={loading}
                        noDataTitle='No Mappings Found'
                        noDataDescription='No subject mappings available for this category.'
                        errorTitle='Error Loading Mappings'
                        showViewOptions={false}
                    />

                    <FormSections />
                </div>
            </div>
        </FormProvider>
    );
}

// -------------------------
// Form Sections for Toggle Form
// -------------------------
function FormSections() {
    const { isToggleFormOpen, selectedRow, closeToggleForm } = useFormContext<IMasterCategoryList>();

    return <>{isToggleFormOpen && selectedRow && <ToggleMasterCategoryForm rowData={selectedRow} onClose={closeToggleForm} />}</>;
}

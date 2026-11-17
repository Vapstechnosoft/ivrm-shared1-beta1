'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { usePromotionalSettingDetails } from '@/hooks/exam/exammodule/exam-mapping';
import type { IPromotionSetting, IPromotionalSubjectDetails } from '@/types/exam/exam-module/exam-mapping';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import PromotionalGroupMappingsDetailsPage from './promotional-group-mapping-view';
import { PromotionalSettingDetailsColumns } from './promotional-setting-details-columns';
import PromotionalSettingDetailsToggleForm from './promotional-setting-details-toggle';

/*------------------------------------
    MAIN ENTRY PAGE WRAPPER
-------------------------------------*/
export default function PromotionalSettingDetailsPage({
    rowData,
    onClose
}: {
    rowData: IPromotionSetting;
    onClose: () => void;
}) {
    return (
        <FormProvider<IPromotionalSubjectDetails>>
            <PromotionalSettingDetailsPageContent rowData={rowData} onClose={onClose} />
        </FormProvider>
    );
}

/*------------------------------------
        PAGE CONTENT
-------------------------------------*/
function PromotionalSettingDetailsPageContent({
    rowData,
    onClose
}: {
    rowData: IPromotionSetting;
    onClose: () => void;
}) {
    const { data: response, isLoading, refetchAll } = usePromotionalSettingDetails(rowData.emP_Id);

    useEffect(() => {
        refetchAll(); // refresh API when modal re-opens
    }, [rowData]);

    const tableProps = useDataTableProps(response);

    return (
        <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-[10vh]'>
            <div className='w-[80%] rounded-2xl bg-white p-6 shadow-xl'>
                {/* ——————— HEADER ——————— */}
                <div className='mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
                    <Heading
                        title={`Promotional Setting Details ${rowData.emgR_GradeName ? ' - ' + rowData.emcA_CategoryName : ''}`}
                        description={`Subjects mapped to ${rowData?.emcA_CategoryName}`}
                    />
                    <Button
                        type='button'
                        onClick={onClose}
                        variant='ghost'
                        size='sm'
                        className='right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                        <X className='h-4 w-4 text-destructive' /> Close
                    </Button>
                </div>

                {/* ——————— TABLE ——————— */}
                <GenericDataTable
                    isLoading={isLoading}
                    {...tableProps}
                    columns={PromotionalSettingDetailsColumns}
                    noDataTitle='No Subjects Found'
                    noDataDescription='No subject mapping exists for this exam.'
                    showViewOptions={false}
                    columnPinning={{ right: ['mapping', 'actions'] }}
                />

                <FormSections />
            </div>
        </div>
    );
}

/*------------------------------------
      POPUP FORM HANDLERS
-------------------------------------*/
function FormSections() {
    const { isToggleFormOpen, isMappedviewOpen, selectedRow, closeToggleForm, closeMappedview } =
        useFormContext<IPromotionalSubjectDetails>();

    return (
        <>
            {isToggleFormOpen && selectedRow && <PromotionalSettingDetailsToggleForm rowData={selectedRow} onClose={closeToggleForm} />}

            {isMappedviewOpen && selectedRow && <PromotionalGroupMappingsDetailsPage rowData={selectedRow} onClose={closeMappedview} />}
        </>
    );
}

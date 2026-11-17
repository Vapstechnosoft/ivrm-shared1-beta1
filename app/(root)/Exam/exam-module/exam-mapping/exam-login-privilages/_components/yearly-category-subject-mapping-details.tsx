'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';

import { useExamLoginPrivilegesDetails } from '@/hooks/exam/exammodule/exam-mapping';

import type { IExamLoginPrivileges, ILoginPrivilegeDetails } from '@/types/exam/exam-module/exam-mapping';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import ToggleLoginPrivilegeForm from './toggle-form';
import { LoginPrivilegesDetailsColumns } from './yearly-category-subject-mapping-columns';

interface LoginPrivilegesDetailsPageProps {
    rowData: IExamLoginPrivileges;
    onClose: () => void;
}

export default function LoginPrivilegesDetailsPage({ rowData, onClose }: LoginPrivilegesDetailsPageProps) {
    // -------------------------
    // Fetch data via hook
    // -------------------------
    const elpId = rowData?.elP_Id;
    const asmclId = rowData?.asmcL_Id;
    const asmsId = rowData?.asmS_Id;

    const { data: apiResponse, isLoading, error, refetchAll: refetch } = useExamLoginPrivilegesDetails(elpId, asmclId, asmsId);

    useEffect(() => {
        refetch();
    }, [rowData.elP_Id, rowData.asmcL_Id, rowData.asmS_Id, refetch]);

    if (error) {
        toast.error('Failed to fetch login privileges');
    }

    // -------------------------
    // Data table props
    // -------------------------
    const tableProps = useDataTableProps(apiResponse, {});

    // -------------------------
    // Render
    // -------------------------
    return (
        <FormProvider<ILoginPrivilegeDetails>>
            <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-[10vh]'>
                <div className='relative mx-auto w-[70%] rounded-2xl bg-white p-6 shadow-xl'>
                    {/* Header Section */}
                    <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='space-y-1'>
                            <Heading
                                title={`Login Privileges - ${rowData.hrmE_EmployeeName || ''}`}
                                description={`Viewing privilege details for user "${rowData.hrmE_EmployeeName}"`}
                            />
                        </div>

                        <Button
                            type='button'
                            onClick={onClose}
                            variant='ghost'
                            size='sm'
                            className='right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                            <X className='h-4 w-4 text-destructive' /> Close
                        </Button>
                    </div>

                    {/* Data Table */}
                    <GenericDataTable<ILoginPrivilegeDetails>
                        {...tableProps}
                        columns={LoginPrivilegesDetailsColumns}
                        isLoading={isLoading}
                        noDataTitle='No Privileges Found'
                        noDataDescription='No privilege mapping available for this user.'
                        errorTitle='Error Loading Privileges'
                        showViewOptions={false}
                    />

                    <FormSections elpId={rowData.elP_Id} asmclId={rowData.asmcL_Id} asmsId={rowData.asmS_Id} />
                </div>
            </div>
        </FormProvider>
    );
}

function FormSections({ elpId, asmclId, asmsId }: { elpId: number; asmclId: number; asmsId: number }) {
    const { isToggleFormOpen, selectedRow, closeToggleForm } = useFormContext<ILoginPrivilegeDetails>();

    return (
        <>
            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && (
                <ToggleLoginPrivilegeForm rowData={selectedRow} onClose={closeToggleForm} elpId={elpId} asmclId={asmclId} asmsId={asmsId} />
            )}
        </>
    );
}

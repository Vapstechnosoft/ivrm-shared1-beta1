'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useEmployeeLeaveDetails, useEmployeeLeaveStatusDetails, useDeleteEmployeeLeaveById } from '@/hooks/hrms/leave-management/useOnlineLeaveApplication';
import { Plus, X } from 'lucide-react';
import { useMemo } from 'react';
import AddApplyLeaveForm from './_components/add-form';
import { type LeaveHistoryRow, createLeaveHistoryColumns, leaveBalanceColumns } from './_components/columns';

export default function ApplyLeavePage() {
    const { data: statusData, isLoading: isStatusLoading, error: statusError, refetchAll } = useEmployeeLeaveStatusDetails();
    const { data: employeeData, isLoading: isEmployeeLoading } = useEmployeeLeaveDetails();

    const response = useMemo(() => {
        if (!statusData) return null;
        return {
            success: true,
            data: statusData.leaveApplications,
            total: statusData.leaveApplications.length
        };
    }, [statusData]);

    const isLoading = isStatusLoading || isEmployeeLoading;
    const error = statusError;

    const employeeDetails = useMemo(() => {
        if (!employeeData?.employeeDetails) {
            return {
                id: 0,
                name: '',
                designation: '',
                doj: '',
                email: '',
                phone: ''
            };
        }
        const emp = employeeData.employeeDetails;
        return {
            id: emp.hrmE_Id,
            name: emp.hrmE_EmployeeName,
            designation: emp.hrmdeS_DesignationName,
            doj: emp.hrmE_DOJ,
            email: emp.hrmE_EmailId,
            phone: String(emp.hrmE_MobileNo)
        };
    }, [employeeData]);

    const leaveBalancesData = useMemo(() => {
        if (!employeeData?.leaveBalances) return null;
        return {
            success: true,
            data: employeeData.leaveBalances,
            total: employeeData.leaveBalances.length
        };
    }, [employeeData]);

    return (
        <FormProvider<LeaveHistoryRow>>
            <ApplyLeavePageContent
                response={response}
                isLoading={isLoading}
                error={error}
                refetchAll={refetchAll}
                defaultEmployee={employeeDetails}
                leaveBalancesData={leaveBalancesData}
            />
        </FormProvider>
    );
}

function ApplyLeavePageContent({
    response,
    isLoading,
    error,
    refetchAll,
    defaultEmployee,
    leaveBalancesData
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: () => void;
    defaultEmployee: any;
    leaveBalancesData: any;
}) {
    const { closeAddForm, openAddForm } = useFormContext<LeaveHistoryRow>();
    const tableProps = useDataTableProps(response);

    const { mutate: deleteLeave } = useDeleteEmployeeLeaveById();

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this leave application?')) {
            deleteLeave(id, {
                onSuccess: () => {
                    refetchAll();
                }
            });
        }
    };

    const columns = createLeaveHistoryColumns(handleDelete);

    return (
        <div className='min-h-screen bg-muted/20 pb-8'>
            <div className='container space-y-6 py-6'>
                {/* Header with Title and Action */}
                <div className='flex items-center justify-between'>

                    <div className="flex justify-end w-full">
                        <Button
                            type='button'
                            onClick={openAddForm}
                            className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'
                        >
                            <Plus className='mr-2 h-4 w-4' />
                            Apply Leave
                        </Button>
                    </div>
                </div>

                {/* Box 1: Leave History */}
                <CollapsibleSection
                    title='Employee Leave History'
                    defaultOpen={true}
                    variant='default'
                    className='bg-white shadow-lg'>
                    <GenericDataTable<LeaveHistoryRow>
                        {...tableProps}
                        columns={columns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading leave history...'
                        noDataTitle='No Leave History'
                        noDataDescription='Your applied leaves will appear here.'
                    />
                </CollapsibleSection>

                {/* Box 2: Form Sections (Appears on click) */}
                <FormSections
                    refetchAll={refetchAll}
                    defaultEmployee={defaultEmployee}
                />
            </div>
        </div>
    );
}

interface FormSectionsProps {
    refetchAll: () => void;
    defaultEmployee: any;
}

function FormSections({ refetchAll, defaultEmployee }: FormSectionsProps) {
    const {
        isAddFormOpen,
        closeAddForm,
        addFormRef,
    } = useFormContext<LeaveHistoryRow>();

    if (!isAddFormOpen) return null;

    return (
        <div ref={addFormRef} className='space-y-6 animate-in slide-in-from-top-4 duration-300'>
            {/* Add Application Form */}
            <CollapsibleSection
                title='New Leave Application'
                description='Fill in the details below to apply for leave'
                defaultOpen={true}
                variant='outline'
                size='md'
                className='shadow-lg'>
                <div className='relative'>
                    <Button
                        type='button'
                        onClick={closeAddForm}
                        variant='ghost'
                        size='sm'
                        className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                        <X className='h-4 w-4 text-destructive' /> Close
                    </Button>
                    <AddApplyLeaveForm
                        defaultEmployee={defaultEmployee}
                        onSuccess={() => {
                            refetchAll();
                            closeAddForm();
                        }}
                    />
                </div>
            </CollapsibleSection>

            {/* Box 1: Employee Information */}
            <CollapsibleSection
                title='Employee Information'
                defaultOpen={true}
                variant='outline'
                className='bg-white shadow-sm'>
                <div className='grid grid-cols-1 gap-6 p-2 md:grid-cols-2'>
                    <div className='space-y-4'>
                        <div className='flex items-center gap-3 border-b pb-2'>
                            <span className='font-semibold text-muted-foreground min-w-[120px]'>Employee Name</span>
                            <span className='text-foreground'>: {defaultEmployee.name || '-'}</span>
                        </div>
                        <div className='flex items-center gap-3 border-b pb-2'>
                            <span className='font-semibold text-muted-foreground min-w-[120px]'>DOJ</span>
                            <span className='text-foreground'>: {defaultEmployee.doj ? new Date(defaultEmployee.doj).toLocaleDateString('en-GB') : '-'}</span>
                        </div>
                    </div>
                    <div className='space-y-4'>
                        <div className='flex items-center gap-3 border-b pb-2'>
                            <span className='font-semibold text-muted-foreground min-w-[120px]'>Designation</span>
                            <span className='text-foreground'>: {defaultEmployee.designation || '-'}</span>
                        </div>
                        <div className='flex items-center gap-3 border-b pb-2'>
                            <span className='font-semibold text-muted-foreground min-w-[120px]'>Email</span>
                            <span className='text-foreground'>: {defaultEmployee.email || '-'}</span>
                        </div>
                        <div className='flex items-center gap-3 border-b pb-2'>
                            <span className='font-semibold text-muted-foreground min-w-[120px]'>Phone</span>
                            <span className='text-foreground'>: {defaultEmployee.phone || '-'}</span>
                        </div>
                    </div>
                </div>
            </CollapsibleSection>
        </div>
    );
}

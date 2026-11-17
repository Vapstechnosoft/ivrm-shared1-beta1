'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import {
    useDeleteLeaveCreditDetails,
    useLeaveCreditDetails,
    useSaveLeaveCreditDetails,
    useLeaveNameDropdown,
    useCreditMonthDropdown
} from '@/hooks/hrms/leave-management/useTransactions';
import { useLeaveAuthorizationDropdowns } from '@/hooks/hrms/leave-management/useMasters';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { Plus, X } from 'lucide-react';
import { use, useState } from 'react';
import { toast } from 'sonner';
import { type LeaveCreditDetail, getLeaveCreditDetailColumns } from './_components/columns';
import { LeaveCreditDetailsForm } from './_components/leave-credit-details-form';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default function LeaveCreditDetailsPage(props: { searchParams: SearchParams }) {
    const _searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useLeaveCreditDetails();
    return (
        <FormProvider<LeaveCreditDetail>>
            <LeaveCreditDetailsPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}
function LeaveCreditDetailsPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<LeaveCreditDetail>();
    const { openEditForm, openDeleteForm } = useFormContext<LeaveCreditDetail>();
    const tableProps = useDataTableProps(response);
    const columns = getLeaveCreditDetailColumns({
        onEdit: openEditForm,
        onDelete: (id: number) => {
            const row = response?.data?.find((r: LeaveCreditDetail) => r.id === id);
            if (row) {
                openDeleteForm(row);
            }
        }
    });
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex justify-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Leave Credit Details
                    </Button>
                </div>
                {/* Data Table Section */}
                <CollapsibleSection
                    title='LEAVE TRANSFER REPORT'
                    description=''
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<LeaveCreditDetail>
                        {...tableProps}
                        columns={columns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading leave credit details...'
                        noDataTitle='No Leave Credit Details Found'
                        noDataDescription='Get started by creating your first leave credit detail'
                        errorTitle='Error Loading Leave Credit Details'
                    />
                </CollapsibleSection>
                {/* Forms */}
                <FormSections />
            </div>
        </div>
    );
}
function FormSections() {
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
    } = useFormContext<LeaveCreditDetail>();
    const { refetchAll } = useLeaveCreditDetails();
    const { mutate: saveCreditDetails } = useSaveLeaveCreditDetails();
    const { mutate: deleteCreditDetails } = useDeleteLeaveCreditDetails();

    // Fetch dropdown data
    const { data: leaveNamesData } = useLeaveNameDropdown();
    const { data: monthsData } = useCreditMonthDropdown();
    const { data: masterDropdowns } = useLeaveAuthorizationDropdowns();

    // Map master dropdowns to expected format for the form
    const typeOptions = (masterDropdowns?.data?.groupTypes || []).map((t: any) => ({
        id: Number(t.value),
        name: t.label
    }));
    const deptOptions = (masterDropdowns?.data?.departments || []).map((d: any) => ({
        id: Number(d.value),
        name: d.label
    }));
    const desgOptions = (masterDropdowns?.data?.designations || []).map((d: any) => ({
        id: Number(d.value),
        name: d.label
    }));
    const gradeOptions = (masterDropdowns?.data?.grades || []).map((g: any) => ({
        id: Number(g.value),
        name: g.label
    }));
    const leaveNameOptions = (leaveNamesData?.data || []).map((l: any) => ({
        id: l.id,
        name: l.name
    }));

    const [activeTab, _setActiveTab] = useState('Leave Credit');
    const handleFormSubmit = (formData: LeaveCreditDetail) => {
        // Map LeaveCreditDetail to the expected API format
        const apiData: any = {
            MI_Id: HRMS_MI_ID,
            HRMLD_Id: formData.id || 0,
            HRML_Id: formData.leaveId || 0,
            HRMLD_NoOfDays: String(formData.noOfDays || '0'),
            HRMLD_MaxLeaveApplicable: Number(formData.maxLeaveApplicable || 0),
            LoginId: 0,
            Emp_types: (formData.type || []).map(id => ({ HRMGT_Id: id })),
            dept_types: (formData.department || []).map(id => ({ HRMD_Id: id })),
            desig_types: (formData.designation || []).map(id => ({ HRMDES_Id: id })),
            grade_types: (formData.grade || []).map(id => ({ HRMG_Id: id })),
            HRMLD_CarryForFlg: !!formData.leaveCarryForward,
            HRMLD_EncashFlg: !!formData.leaveEncashment,
            selectedMonthList: (formData.creditMonths || []).map(m => Number(m)),
            selectedcarryMonthList: []
        };

        saveCreditDetails(apiData, {
            onSuccess: () => {
                toast.success(isEditFormOpen ? 'Leave credit details updated successfully' : 'Leave credit details saved successfully');
                refetchAll();
                closeAddForm();
                closeEditForm();
            },
            onError: () => {
                toast.error('Failed to save leave credit details');
            }
        });
    };
    const handleDelete = () => {
        if (selectedRow) {
            deleteCreditDetails(selectedRow.id, {
                onSuccess: () => {
                    toast.success('Leave credit detail deleted successfully');
                    refetchAll();
                    closeDeleteForm();
                },
                onError: () => {
                    toast.error('Failed to delete leave credit detail');
                }
            });
        }
    };
    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='LEAVE DETAILS'
                        description='Fill in the details to configure leave credit'
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
                            <LeaveCreditDetailsForm
                                activeTab={activeTab}
                                onSubmit={handleFormSubmit}
                                onCancel={closeAddForm}
                                types={typeOptions}
                                departments={deptOptions}
                                designations={desgOptions}
                                grades={gradeOptions}
                                leaveNames={leaveNameOptions}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='LEAVE DETAILS'
                        description='Update leave credit details information'
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
                            <LeaveCreditDetailsForm
                                activeTab={activeTab}
                                onSubmit={handleFormSubmit}
                                onCancel={closeEditForm}
                                types={typeOptions}
                                departments={deptOptions}
                                designations={desgOptions}
                                grades={gradeOptions}
                                leaveNames={leaveNameOptions}
                                defaultValues={{
                                    id: selectedRow.id,
                                    leaveId: selectedRow.leaveId,
                                    type: selectedRow.type,
                                    department: selectedRow.department,
                                    designation: selectedRow.designation,
                                    grade: selectedRow.grade,
                                    leaveName: selectedRow.leaveName,
                                    leaveCode: selectedRow.leaveCode,
                                    noOfDays: selectedRow.noOfDays,
                                    maxLeaveApplicable: selectedRow.maxLeaveApplicable,
                                    leaveCarryForward: selectedRow.leaveCarryForward,
                                    leaveEncashment: selectedRow.leaveEncashment,
                                    leaveCreditMonthWise: selectedRow.leaveCreditMonthWise,
                                    creditMonths: selectedRow.creditMonths,
                                    months: selectedRow.months
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* Delete Form */}
            {isDeleteFormOpen && selectedRow && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
                    <div className='mx-4 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg'>
                        <h2 className='mb-4 font-semibold text-lg'>Delete Leave Credit Detail</h2>
                        <p className='mb-6'>Are you sure you want to delete this leave credit detail? This action cannot be undone.</p>
                        <div className='flex justify-end gap-2'>
                            <Button type='button' variant='outline' onClick={closeDeleteForm}>
                                Cancel
                            </Button>
                            <Button type='button' variant='destructive' onClick={handleDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

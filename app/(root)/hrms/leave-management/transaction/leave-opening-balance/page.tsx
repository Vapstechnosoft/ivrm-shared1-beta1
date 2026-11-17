'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Plus, X } from 'lucide-react';
import { use, useState } from 'react';
import { toast } from 'sonner';
import { type LeaveOpeningBalance, getLeaveOpeningBalanceColumns } from './_components/columns';
import { LeaveOpeningBalanceForm, type LeaveOpeningBalanceFormData } from './_components/leave-opening-balance-form';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
// TODO: Replace with actual API hooks
// Example structure:
// const { data: typesData, isLoading: isLoadingTypes } = useLeaveOpeningBalanceTypes();
// const { data: departmentsData, isLoading: isLoadingDepartments } = useLeaveOpeningBalanceDepartments();
// const { data: designationsData, isLoading: isLoadingDesignations } = useLeaveOpeningBalanceDesignations();
// const { data: employeesData, isLoading: isLoadingEmployees } = useLeaveOpeningBalanceEmployees({
//     types: filters.selectedTypes,
//     departments: filters.selectedDepartments,
//     designations: filters.selectedDesignations
// });
// const { data: leaveTypesData } = useLeaveTypes();
// const { data: reportData, isLoading: isLoadingReport } = useLeaveOpeningBalanceReport();
export default function LeaveOpeningBalancePage(props: { searchParams: SearchParams }) {
    const _searchParams = use(props.searchParams);
    const [rows, setRows] = useState<LeaveOpeningBalance[]>([]);
    return (
        <FormProvider<LeaveOpeningBalance>>
            <LeaveOpeningBalancePageContent rows={rows} setRows={setRows} />
        </FormProvider>
    );
}
function LeaveOpeningBalancePageContent({
    rows,
    setRows
}: {
    rows: LeaveOpeningBalance[];
    setRows: (rows: LeaveOpeningBalance[]) => void;
}) {
    const { openAddForm } = useFormContext<LeaveOpeningBalance>();
    const { openEditForm } = useFormContext<LeaveOpeningBalance>();
    // TODO: Replace with actual API calls
    // These will be populated from API responses
    const types: Array<{ id: number; name: string }> = [];
    const departments: Array<{ id: number; name: string }> = [];
    const designations: Array<{ id: number; name: string }> = [];
    const employees: Array<{ id: number; employeeCode: string; employeeName: string }> = [];
    const leaveTypes: Array<{ id: number; name: string }> = [];
    const isLoadingTypes = false;
    const isLoadingDepartments = false;
    const isLoadingDesignations = false;
    const isLoadingEmployees = false;
    const columns = getLeaveOpeningBalanceColumns({
        onEdit: openEditForm
    });
    const tableProps = useDataTableProps({
        data: rows,
        columns: columns,
        totalItems: rows.length,
        searchParams: {},
        onSearchParamsChange: () => {
            // Search params change handler - no action needed
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
                        Add Leave Opening Balance
                    </Button>
                </div>
                {/* Data Table Section */}
                <CollapsibleSection
                    title='LEAVE OPENING BALANCE REPORT'
                    description=''
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    {rows.length === 0 ? (
                        <div className='py-10 text-center text-muted-foreground text-sm'>No data available</div>
                    ) : (
                        <GenericDataTable<LeaveOpeningBalance>
                            {...tableProps}
                            columns={columns}
                            isLoading={false}
                            showViewOptions={false}
                            columnPinning={{ right: ['actions'] }}
                            loadingMessage='Loading leave opening balance...'
                            noDataTitle='No Leave Opening Balance Found'
                            noDataDescription='Get started by creating your first leave opening balance'
                            errorTitle='Error Loading Leave Opening Balance'
                        />
                    )}
                </CollapsibleSection>
                {/* Forms */}
                <FormSections
                    types={types}
                    departments={departments}
                    designations={designations}
                    employees={employees}
                    leaveTypes={leaveTypes}
                    isLoadingTypes={isLoadingTypes}
                    isLoadingDepartments={isLoadingDepartments}
                    isLoadingDesignations={isLoadingDesignations}
                    isLoadingEmployees={isLoadingEmployees}
                    setRows={setRows}
                />
            </div>
        </div>
    );
}
function FormSections({
    types,
    departments,
    designations,
    employees,
    leaveTypes,
    isLoadingTypes,
    isLoadingDepartments,
    isLoadingDesignations,
    isLoadingEmployees,
    setRows: _setRows
}: {
    types: Array<{ id: number; name: string }>;
    departments: Array<{ id: number; name: string }>;
    designations: Array<{ id: number; name: string }>;
    employees: Array<{ id: number; employeeCode: string; employeeName: string }>;
    leaveTypes: Array<{ id: number; name: string }>;
    isLoadingTypes: boolean;
    isLoadingDepartments: boolean;
    isLoadingDesignations: boolean;
    isLoadingEmployees: boolean;
    setRows: (rows: LeaveOpeningBalance[]) => void;
    // setRows is intentionally unused in this component
}) {
    const { isAddFormOpen, isEditFormOpen, selectedRow, closeAddForm, closeEditForm, addFormRef, editFormRef } =
        useFormContext<LeaveOpeningBalance>();
    const handleFormSubmit = (_formData: LeaveOpeningBalanceFormData) => {
        // TODO: Replace with actual API call
        // saveLeaveOpeningBalance(formData, {
        //     onSuccess: () => {
        //         toast.success('Leave opening balance saved successfully');
        //         refetchReport();
        //         closeEditForm();
        //         closeAddForm();
        //     },
        //     onError: () => {
        //         toast.error('Failed to save leave opening balance');
        //     }
        // });
        // Mock implementation
        toast.success('Leave opening balance saved successfully');
        closeEditForm();
        closeAddForm();
    };
    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='LEAVE OPENING BALANCE'
                        description='Fill in the details to set leave opening balance'
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
                            <LeaveOpeningBalanceForm
                                types={types}
                                departments={departments}
                                designations={designations}
                                employees={employees}
                                leaveTypes={leaveTypes}
                                onSubmit={handleFormSubmit}
                                onCancel={closeAddForm}
                                isLoadingTypes={isLoadingTypes}
                                isLoadingDepartments={isLoadingDepartments}
                                isLoadingDesignations={isLoadingDesignations}
                                isLoadingEmployees={isLoadingEmployees}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='LEAVE OPENING BALANCE'
                        description='Update leave opening balance information'
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
                            <LeaveOpeningBalanceForm
                                types={types}
                                departments={departments}
                                designations={designations}
                                employees={employees}
                                leaveTypes={leaveTypes}
                                onSubmit={handleFormSubmit}
                                onCancel={closeEditForm}
                                defaultValues={{
                                    selectedEmployeeId: selectedRow.id, // This should be the employee ID
                                    leaveBalances: {
                                        [selectedRow.leaveName]: selectedRow.leaveBalance
                                    }
                                }}
                                isLoadingTypes={isLoadingTypes}
                                isLoadingDepartments={isLoadingDepartments}
                                isLoadingDesignations={isLoadingDesignations}
                                isLoadingEmployees={isLoadingEmployees}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </>
    );
}

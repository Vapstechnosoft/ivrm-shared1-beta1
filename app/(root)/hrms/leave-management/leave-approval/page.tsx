'use client';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { AdaptiveDialog } from '@/components/ui/extension/adaptive-dialog';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useLeaveAppliedOrApprovalGrid, useApproveOrRejectLeaveStatus, useViewLeaveBalanceHistory } from '@/hooks/hrms/leave-management/useLeaveApproval';
import { use, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { type LeaveApprovalRow, getLeaveApprovalColumns } from './_components/columns';
import { LeaveApprovalForm, type LeaveApprovalFormData } from './_components/leave-approval-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default function LeaveApprovalPage(props: { searchParams: SearchParams }) {
    const _searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useLeaveAppliedOrApprovalGrid();

    // Map LeaveApprovalGridItem to LeaveApprovalRow shape
    const mappedData: LeaveApprovalRow[] = (response?.data || []).map((item: any) => ({
        id: item.hrelaP_Id,
        hrmE_Id: item.hrmE_Id,
        hrelaP_Id: item.hrelaP_Id,
        employeeCode: item.hrmE_EmployeeCode,
        employeeName: item.hrmE_FullName,
        leaveName: item.hrmL_LeaveName,
        fromDate: item.hrelaP_FromDate,
        toDate: item.hrelaP_ToDate,
        totalDays: item.hrelapD_TotalDays,
        leaveStatus: item.hrelT_Status,
        remark: item.hrelapA_Remarks || ''
    }));

    // Create response for useDataTableProps
    const mockResponse = {
        data: mappedData,
        total: response?.total || mappedData.length,
        page: 1,
        pageSize: 10
    };
    return (
        <FormProvider<LeaveApprovalRow>>
            <LeaveApprovalPageContent response={mockResponse} isLoading={isLoading} error={error} mockResponse={mockResponse} />
        </FormProvider>
    );
}
function LeaveApprovalPageContent({
    response,
    isLoading,
    error,
    mockResponse
}: {
    response: any;
    isLoading: boolean;
    error: any;
    mockResponse: any;
}) {
    const { openEditForm } = useFormContext<LeaveApprovalRow>();
    const tableProps = useDataTableProps(mockResponse);
    const { refetchAll } = useLeaveAppliedOrApprovalGrid();
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [isBalanceHistoryOpen, setIsBalanceHistoryOpen] = useState(false);

    const handleApprove = (row: LeaveApprovalRow) => {
        openEditForm({ ...row, remark: '' });
    };

    const handleReject = (row: LeaveApprovalRow) => {
        openEditForm({ ...row, remark: '' });
    };

    const handleViewBalance = (row: LeaveApprovalRow) => {
        setSelectedEmployeeId(row.hrmE_Id);
        setIsBalanceHistoryOpen(true);
    };

    const columns = useMemo(
        () =>
            getLeaveApprovalColumns({
                onApprove: handleApprove,
                onReject: handleReject,
                onViewBalance: handleViewBalance
            }),
        []
    );

    // Filter pending leaves
    const pendingLeaves = (response?.data || []).filter(
        (item: LeaveApprovalRow) => item.leaveStatus === 'Applied' || item.leaveStatus === 'Pending'
    );

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* LEAVE APPROVAL STATUS Section */}
                <CollapsibleSection
                    title='LEAVE APPROVAL STATUS'
                    description=''
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    {pendingLeaves.length === 0 ? (
                        <div className='py-10 text-center'>
                            <p className='font-semibold text-lg text-red-600'>NO leaves pending for approval!!</p>
                        </div>
                    ) : (
                        <div className='py-4 text-center'>
                            <p className='font-semibold text-blue-600 text-lg'>
                                {pendingLeaves.length} leave{pendingLeaves.length > 1 ? 's' : ''} pending for approval
                            </p>
                        </div>
                    )}
                </CollapsibleSection>
                {/* LEAVE APPROVAL DETAILS Section */}
                <CollapsibleSection
                    title='LEAVE APPROVAL DETAILS'
                    description='View and manage leave approval requests'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<LeaveApprovalRow>
                        {...tableProps}
                        columns={columns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading leave approvals...'
                        noDataTitle='No Leave Approvals Found'
                        noDataDescription='No leave requests available for approval'
                        errorTitle='Error Loading Leave Approvals'
                    />
                </CollapsibleSection>
                {/* Forms */}
                <FormSections refetch={refetchAll} />

                {/* Balance History Dialog */}
                <AdaptiveDialog
                    title='Leave Balance History'
                    isOpen={isBalanceHistoryOpen}
                    onClose={() => setIsBalanceHistoryOpen(false)}
                    size='xl'>
                    <BalanceHistoryContent hrmeId={selectedEmployeeId} />
                </AdaptiveDialog>
            </div>
        </div>
    );
}

function BalanceHistoryContent({ hrmeId }: { hrmeId: number | null }) {
    const { data: response, isLoading, error } = useViewLeaveBalanceHistory(hrmeId);

    if (isLoading) {
        return (
            <div className='flex items-center justify-center p-8'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
        );
    }

    if (error) {
        return <div className='p-8 text-center text-red-500 font-medium'>Error loading balance history</div>;
    }

    const historyData = response?.data || [];

    return (
        <div className='p-4'>
            {historyData.length === 0 ? (
                <div className='p-8 text-center text-muted-foreground'>No balance history found for this employee.</div>
            ) : (
                <div className='overflow-hidden rounded-md border'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Leave Type</TableHead>
                                <TableHead className='text-center'>Entitled</TableHead>
                                <TableHead className='text-center'>Used</TableHead>
                                <TableHead className='text-center'>Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {historyData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className='font-medium'>{item.empLeaveType}</TableCell>
                                    <TableCell className='text-center'>{item.empCreatedLeaves}</TableCell>
                                    <TableCell className='text-center'>{item.empUsedLeaves}</TableCell>
                                    <TableCell className='text-center font-semibold text-primary'>{item.empBalanceLeaves}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
function FormSections({ refetch }: { refetch: () => void | Promise<any> }) {
    const { isEditFormOpen, selectedRow, closeEditForm } = useFormContext<LeaveApprovalRow>();
    const { mutateAsync: approveOrReject } = useApproveOrRejectLeaveStatus();

    const handleFormSubmit = async (formData: LeaveApprovalFormData) => {
        if (!selectedRow) return;

        const payload = {
            approveRejectType: formData.action === 'approve' ? 'Approve' : 'Reject',
            hrmE_Id: selectedRow.hrmE_Id,
            hreltD_FromDate: selectedRow.fromDate,
            hreltD_ToDate: selectedRow.toDate,
            get_leave_status: [
                {
                    hrelaP_Id: selectedRow.hrelaP_Id,
                    hrelT_Status: formData.action === 'approve' ? 'Approved' : 'Rejected',
                    hrelapA_Remarks: formData.remark || (formData.action === 'approve' ? 'Approved' : 'Rejected')
                }
            ]
        };

        try {
            await approveOrReject(payload);
            refetch();
            closeEditForm();
        } catch (error) {
            // Error is already toasted by hook
        }
    };
    return (
        <>
            {/* Approval/Rejection Dialog */}
            {isEditFormOpen && selectedRow && (
                <AdaptiveDialog
                    title={`Leave Approval - ${selectedRow.employeeName}`}
                    isOpen={isEditFormOpen}
                    onClose={closeEditForm}
                    size='lg'>
                    <LeaveApprovalForm leaveRequest={selectedRow} onSubmit={handleFormSubmit} onCancel={closeEditForm} />
                </AdaptiveDialog>
            )}
        </>
    );
}

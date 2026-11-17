'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { useCancelCompOffRequest, useCompOffRequest, useSubmitCompOffRequest } from '@/hooks/hrms/leave-management/useTransactions';
import { Check, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    type CompOffRequestItem,
    type EmployeeLeaveDetail,
    compOffRequestColumns,
    employeeLeaveDetailColumns
} from './_components/columns';
export default function CompOffRequestPage() {
    const { data: response, isLoading, error, refetchAll } = useCompOffRequest();
    const { mutate: submitRequest, isPending: isSubmitting } = useSubmitCompOffRequest();
    const { mutate: cancelRequest, isPending: isCancelling } = useCancelCompOffRequest();
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [leaveSearchQuery, setLeaveSearchQuery] = useState('');
    const employeeDetails = response?.data?.employeeDetails;
    const compOffRequests = response?.data?.compOffRequests || [];
    const leaveDetails = response?.data?.leaveDetails || [];
    // Filter leave details based on search query
    const filteredLeaveDetails = useMemo(() => {
        if (!leaveSearchQuery.trim()) return leaveDetails;
        const query = leaveSearchQuery.toLowerCase();
        return leaveDetails.filter(
            (leave) =>
                leave.leaveName.toLowerCase().includes(query) ||
                leave.leaveReason.toLowerCase().includes(query) ||
                leave.status.toLowerCase().includes(query)
        );
    }, [leaveDetails, leaveSearchQuery]);
    const handleSelectRow = (id: number, checked: boolean) => {
        const newSelected = new Set(selectedRows);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedRows(newSelected);
    };
    const handleRequest = () => {
        if (selectedRows.size === 0) {
            return;
        }
        submitRequest(Array.from(selectedRows), {
            onSuccess: () => {
                setSelectedRows(new Set());
                refetchAll();
            }
        });
    };
    const handleCancel = () => {
        if (selectedRows.size === 0) {
            return;
        }
        cancelRequest(Array.from(selectedRows), {
            onSuccess: () => {
                setSelectedRows(new Set());
                refetchAll();
            }
        });
    };
    const compOffRequestTableProps = useDataTableProps({
        data: compOffRequests,
        totalItems: compOffRequests.length
    });
    const leaveDetailsTableProps = useDataTableProps({
        data: filteredLeaveDetails,
        totalItems: filteredLeaveDetails.length
    });
    const compOffColumns = useMemo(
        () => compOffRequestColumns(selectedRows, handleSelectRow, compOffRequests),
        [selectedRows, compOffRequests]
    );
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex justify-end'>{/* Header buttons can be added here if needed */}</div>
                {/* Employee Details Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5'>
                        <div className='space-y-2'>
                            <Label>Employee Name</Label>
                            <div className='rounded-md border bg-muted/50 p-2 font-medium'>{employeeDetails?.employeeName || '-'}</div>
                        </div>
                        <div className='space-y-2'>
                            <Label>DOJ</Label>
                            <div className='rounded-md border bg-muted/50 p-2 font-medium'>{employeeDetails?.doj || '-'}</div>
                        </div>
                        <div className='space-y-2'>
                            <Label>Designation</Label>
                            <div className='rounded-md border bg-muted/50 p-2 font-medium'>{employeeDetails?.designation || '-'}</div>
                        </div>
                        <div className='space-y-2'>
                            <Label>Email</Label>
                            <div className='rounded-md border bg-muted/50 p-2 font-medium'>{employeeDetails?.email || '-'}</div>
                        </div>
                        <div className='space-y-2'>
                            <Label>Phone</Label>
                            <div className='rounded-md border bg-muted/50 p-2 font-medium'>{employeeDetails?.phone || '-'}</div>
                        </div>
                    </div>
                </CollapsibleSection>
                {/* Request - On Duty / Comp Off Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <div className='space-y-4'>
                        <GenericDataTable<CompOffRequestItem>
                            {...compOffRequestTableProps}
                            columns={compOffColumns}
                            isLoading={isLoading}
                            error={error}
                            showViewOptions={false}
                            loadingMessage='Loading comp off requests...'
                            noDataTitle='No Comp Off Requests Found'
                            noDataDescription='No comp off requests available'
                            errorTitle='Error Loading Comp Off Requests'
                        />
                        <div className='flex justify-end gap-2'>
                            <Button
                                type='button'
                                onClick={handleCancel}
                                disabled={selectedRows.size === 0 || isCancelling}
                                variant='outline'>
                                <X className='mr-2 h-4 w-4' />
                                CANCEL
                            </Button>
                            <Button
                                type='button'
                                onClick={handleRequest}
                                disabled={selectedRows.size === 0 || isSubmitting}
                                variant='default'>
                                <Check className='mr-2 h-4 w-4' />
                                REQUEST
                            </Button>
                        </div>
                    </div>
                </CollapsibleSection>
                {/* Employee Leave Details Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <div className='space-y-4'>
                        <div className='flex justify-end'>
                            <div className='relative w-full max-w-sm'>
                                <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
                                <Input
                                    placeholder='search here...'
                                    value={leaveSearchQuery}
                                    onChange={(e) => setLeaveSearchQuery(e.target.value)}
                                    className='pl-9'
                                />
                            </div>
                        </div>
                        <GenericDataTable<EmployeeLeaveDetail>
                            {...leaveDetailsTableProps}
                            columns={employeeLeaveDetailColumns}
                            isLoading={isLoading}
                            error={error}
                            showViewOptions={false}
                            loadingMessage='Loading leave details...'
                            noDataTitle='No Leave Details Found'
                            noDataDescription='No leave history available'
                            errorTitle='Error Loading Leave Details'
                        />
                    </div>
                </CollapsibleSection>
            </div>
        </div>
    );
}

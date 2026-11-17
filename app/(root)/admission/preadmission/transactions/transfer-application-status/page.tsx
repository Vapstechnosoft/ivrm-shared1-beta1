'use client';

import { Button } from '@/components/ui/button';
import type { DataTableRef } from '@/components/ui/data-table/data-table';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useActivePreadmissionDetails,
    useApplicationStatusDropdown,
    useApplicationStudentList,
    usePreadmissionClassDropdown
} from '@/hooks/admission/preadmission/useTransactions';
import { tableSearchVariables } from '@/lib/data-table.config';
import { updateStudentApplicationStatus } from '@/server/admission/preadmission/transactions/transfer_application_status';
import type { IPreadmissionApplicationList } from '@/types/admission/preadmission/transactions';
import { CheckSquare } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { parseAsString, useQueryState } from 'nuqs';
import { use, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ApplicationStatusUpdateDialog } from './_components/application-status-update-form';
import { transferApplicationColumns } from './_components/columns';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function TransferApplicationStatusPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const router = useRouter();
    const pathname = usePathname();

    const tableRef = useRef<DataTableRef>(null);

    const [searchQuery] = useQueryState(tableSearchVariables.search, parseAsString.withOptions({ shallow: false }).withDefault(''));

    const handleResetSelection = () => {
        tableRef.current?.resetSelection();
    };

    const handleFilterChange = (filterType: 'class' | 'status', value: number) => {
        if (filterType === 'class') {
            setClassId(value);
        } else {
            setStatusId(value);
        }

        // Reset to page 1 when filter changes
        const params = new URLSearchParams(searchParams as any);
        params.set('page', '1');
        router.replace(`${pathname}?${params.toString()}`);
    };

    const { data: activePreadmission, isLoading: activePreadmissionDeLoading } = useActivePreadmissionDetails();
    const {
        data: preadmissionClass,
        isLoading: preadmissionClassLoading,
        isError: preadmissionClassError
    } = usePreadmissionClassDropdown();

    const {
        data: applicationStatus,
        isLoading: applicationStatusLoading,
        isError: applicationStatusError
    } = useApplicationStatusDropdown();

    const [classId, setClassId] = useState<number>(0);
    const [statusId, setStatusId] = useState<number>(0);

    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<IPreadmissionApplicationList[]>([]);

    const {
        data: response,
        isLoading,
        error,
        refetch: refetchApplicationStudents
    } = useApplicationStudentList(activePreadmission?.data?.asmaY_Id ?? 0, classId, statusId, searchParams);
    const tableProps = useDataTableProps(response);

    const onUpdateApplicationStatusClose = () => {
        refetchApplicationStudents();
        setIsStatusDialogOpen(false);
        setSelectedStudents([]);
        handleResetSelection();
    };

    const handleApplicationStatusUpdate = async (updates: Array<{ pasr_id: number; status_id: number; remarks: string }>) => {
        try {
            const response = await updateStudentApplicationStatus(updates);
            if (response.success === true) {
                toast.success(response.message);
                onUpdateApplicationStatusClose();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(`Error updating status ${error}`);
        }
    };

    const handleSelectStudent = (selectedRows: IPreadmissionApplicationList[]) => {
        setSelectedStudents(selectedRows);
    };

    const handleDeselectStudent = (pasrId: number) => {
        setSelectedStudents((prev) => prev.filter((student) => student.pasr_id !== pasrId));
    };

    return (
        <div className='min-h-screen'>
            {/* Header */}
            <div className='mb-3 flex w-fit flex-col gap-4 rounded-xl border p-4 shadow-xl'>
                {/* Header Section */}
                <div className='mt-3 flex items-center justify-between gap-4'>
                    <h1 className='font-bold text-2xl tracking-tight'>Academic Year</h1>
                    {activePreadmission?.data?.asmaY_Year && (
                        <p className='rounded-xl border bg-secondary px-2 py-1 font-bold'>{activePreadmission?.data?.asmaY_Year}</p>
                    )}
                </div>

                {/* Filter Options */}
                <div className='flex flex-wrap justify-start gap-6'>
                    {/* Class Filter */}
                    <div className='flex w-full flex-col gap-2 sm:w-56'>
                        <Label htmlFor='class' className='mb-1 font-semibold'>
                            Class
                        </Label>
                        <Select
                            onValueChange={(value) => handleFilterChange('class', Number(value))}
                            value={classId?.toString() || undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Class' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem key={0} value={'0'}>
                                    All
                                </SelectItem>
                                {preadmissionClassLoading ? (
                                    <SelectItem value='loading' disabled>
                                        Loading...
                                    </SelectItem>
                                ) : preadmissionClassError ? (
                                    <SelectItem value='error' disabled>
                                        Error loading
                                    </SelectItem>
                                ) : (
                                    preadmissionClass?.data?.map((item) => (
                                        <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                            {item.asmcL_ClassName}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Application Status Filter */}
                    <div className='flex w-full flex-col gap-2 sm:w-56'>
                        <Label htmlFor='application-status' className='mb-1 font-semibold'>
                            Application Status
                        </Label>
                        <Select
                            onValueChange={(value) => handleFilterChange('status', Number(value))}
                            value={statusId !== 0 ? statusId?.toString() || undefined : undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Application Status' />
                            </SelectTrigger>
                            <SelectContent>
                                {applicationStatusLoading ? (
                                    <SelectItem value='loading' disabled>
                                        Loading...
                                    </SelectItem>
                                ) : applicationStatusError ? (
                                    <SelectItem value='error' disabled>
                                        Error loading
                                    </SelectItem>
                                ) : (
                                    applicationStatus?.data?.map((item) => (
                                        <SelectItem key={item.id} value={item.id.toString()}>
                                            {item.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className='container space-y-4 p-1'>
                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    {selectedStudents.length > 0 && (
                        <div className='flex w-full justify-end'>
                            <Button onClick={() => setIsStatusDialogOpen(true)} variant='default' className='h-8 w-fit gap-2'>
                                <CheckSquare className='h-4 w-4' />
                                Update Status ({selectedStudents.length})
                            </Button>
                        </div>
                    )}
                    <GenericDataTable<IPreadmissionApplicationList>
                        {...tableProps}
                        ref={tableRef}
                        columns={transferApplicationColumns}
                        isLoading={activePreadmissionDeLoading || isLoading}
                        error={error}
                        showViewOptions={false}
                        searchQuery={searchQuery}
                        loadingMessage='Loading preadmission applications...'
                        noDataTitle='No Data Found'
                        noDataDescription='No preadmission applications found.'
                        errorTitle='Error Loading Preadmission Applications'
                        onRowSelectionChange={handleSelectStudent}
                    />
                </CollapsibleSection>
            </div>
            <ApplicationStatusUpdateDialog
                isOpen={isStatusDialogOpen}
                onClose={onUpdateApplicationStatusClose}
                selectedStudents={selectedStudents}
                applicationStatuses={applicationStatus?.data || []}
                onSubmit={handleApplicationStatusUpdate}
                onDeselectStudent={handleDeselectStudent}
            />
        </div>
    );
}

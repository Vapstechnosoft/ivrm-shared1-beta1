'use client';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useState } from 'react';
import { type LeaveReportRow, leaveReportColumns } from './_components/columns';
import { type LeaveReportFilters as FiltersType, LeaveReportFilters } from './_components/filters';
// TODO: Replace with actual API hooks
// Example structure:
// const { data: typesData, isLoading: isLoadingTypes } = useLeaveReportTypes();
// const { data: departmentsData, isLoading: isLoadingDepartments } = useLeaveReportDepartments();
// const { data: designationsData, isLoading: isLoadingDesignations } = useLeaveReportDesignations();
// const { data: employeesData, isLoading: isLoadingEmployees } = useLeaveReportEmployees({
//     types: filters.selectedTypes,
//     departments: filters.selectedDepartments,
//     designations: filters.selectedDesignations
// });
export default function LeaveReportPage() {
    const [rows, setRows] = useState<LeaveReportRow[]>([]);
    const [filters, setFilters] = useState<FiltersType>({
        selectedTypes: [],
        selectedDepartments: [],
        selectedDesignations: [],
        isIndividual: false,
        selectedEmployeeId: null,
        leave: 'All',
        fromDate: '',
        toDate: '',
        showEmployeeLeaveBalance: false
    });
    // TODO: Replace with actual API calls
    // These will be populated from API responses
    const types: Array<{ id: number; name: string }> = [];
    const departments: Array<{ id: number; name: string }> = [];
    const designations: Array<{ id: number; name: string }> = [];
    const employees: Array<{ id: number; employeeCode: string; employeeName: string; designation?: string; department?: string }> = [];
    const isLoadingTypes = false;
    const isLoadingDepartments = false;
    const isLoadingDesignations = false;
    const isLoadingEmployees = false;
    const handleFilterChange = (key: keyof FiltersType, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };
    const handleReport = () => {
        setRows(
            Array.from({ length: 12 }).map((_, i) => ({
                slNo: i + 1,
                employeeCode: '69',
                employeeName: 'R Siddesh Kumar',
                leaveName: 'Casual Leave',
                fromDate: '2025-01-01',
                toDate: '2025-01-02',
                appliedDays: 8,
                leaveStatus: 'Approved' as const,
                leaveBalance: 8
            }))
        );
    };
    const handleClear = () => {
        setFilters({
            selectedTypes: [],
            selectedDepartments: [],
            selectedDesignations: [],
            isIndividual: false,
            selectedEmployeeId: null,
            leave: 'All',
            fromDate: '',
            toDate: '',
            showEmployeeLeaveBalance: false
        });
        setRows([]);
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <LeaveReportFilters
                    filters={filters}
                    types={types}
                    departments={departments}
                    designations={designations}
                    employees={employees}
                    isLoadingTypes={isLoadingTypes}
                    isLoadingDepartments={isLoadingDepartments}
                    isLoadingDesignations={isLoadingDesignations}
                    isLoadingEmployees={isLoadingEmployees}
                    onFilterChange={handleFilterChange}
                    onReport={handleReport}
                    onCancel={handleClear}
                />
                <CollapsibleSection
                    title='Leave Report'
                    description=''
                    defaultOpen={rows.length > 0}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable data={rows} columns={leaveReportColumns} totalItems={rows.length} isLoading={false} />
                </CollapsibleSection>
            </div>
        </div>
    );
}

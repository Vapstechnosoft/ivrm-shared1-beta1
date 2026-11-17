'use client';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useMemo, useState } from 'react';
import { type UnauthorizedLeaveCountRow, getUnauthorizedLeaveCountColumns } from './_components/columns';
import { type UnauthorizedLeaveCountFilters as FiltersType, UnauthorizedLeaveCountFilters } from './_components/filters';
export default function UnauthorizedLeaveCountReportPage() {
    const [rows, setRows] = useState<UnauthorizedLeaveCountRow[]>([]);
    const [filters, setFilters] = useState<FiltersType>({
        mode: 'Company Wise',
        detailLevel: 'Only Count',
        rangeMode: 'Month Wise',
        companyQuery: '',
        selectedCompanies: [],
        selectedCompany: '',
        selectedDepartments: [],
        department: '',
        year: '2025',
        month: 'January',
        fromDate: '',
        toDate: ''
    });
    const handleFilterChange = (key: keyof FiltersType, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };
    const columns = useMemo(
        () => getUnauthorizedLeaveCountColumns({ mode: filters.mode, detailLevel: filters.detailLevel }),
        [filters.mode, filters.detailLevel]
    );
    const handleReport = () => {
        if (filters.detailLevel === 'Only Count') {
            setRows([
                {
                    slNo: 1,
                    companyOrDept: filters.mode === 'Company Wise' ? 'VKS' : 'Hardware and Network',
                    unauthorizedLeaveCount: 100
                }
            ]);
        } else {
            setRows([
                { slNo: 1, employeeName: 'Sarath Kumar A J', absentDate: '2025-01-05' },
                { slNo: 2, employeeName: 'Priyanka Ashok Shilke', absentDate: '2025-01-12' }
            ]);
        }
    };
    const handleClear = () => {
        setFilters({
            mode: 'Company Wise',
            detailLevel: 'Only Count',
            rangeMode: 'Month Wise',
            companyQuery: '',
            selectedCompanies: [],
            selectedCompany: '',
            selectedDepartments: [],
            department: '',
            year: '2025',
            month: 'January',
            fromDate: '',
            toDate: ''
        });
        setRows([]);
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <UnauthorizedLeaveCountFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReport={handleReport}
                    onCancel={handleClear}
                />
                <CollapsibleSection
                    title='Unauthorized Leave Report List'
                    description=''
                    defaultOpen={rows.length > 0}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable data={rows} columns={columns} totalItems={rows.length} isLoading={false} />
                </CollapsibleSection>
            </div>
        </div>
    );
}

'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
export interface UnauthorizedLeaveCountFilters {
    mode: 'Company Wise' | 'Department Wise';
    detailLevel: 'Only Count' | 'Overall Details';
    rangeMode: 'Month Wise' | 'Date Wise';
    companyQuery: string;
    selectedCompanies: string[];
    selectedCompany: string; // Single company for Department Wise mode
    selectedDepartments: string[]; // Multi-select departments for Department Wise mode
    department: string; // Keep for backward compatibility if needed
    year: string;
    month: string;
    fromDate: string;
    toDate: string;
}
interface UnauthorizedLeaveCountFiltersProps {
    filters: UnauthorizedLeaveCountFilters;
    onFilterChange: (key: keyof UnauthorizedLeaveCountFilters, value: any) => void;
    onReport: () => void;
    onCancel: () => void;
}
const availableCompanies = ['All', 'Vaps Knowledge Services Pvt Ltd', 'Vaps Infotech Pvt Ltd', 'Unnathi Marketing'];
const availableCompaniesWithoutAll = ['Vaps Knowledge Services Pvt Ltd', 'Vaps Infotech Pvt Ltd', 'Unnathi Marketing'];
const availableDepartments = [
    'Hardware and Network',
    'Human Resource',
    'IT',
    'Finance',
    'Marketing',
    'Sales',
    'Operations',
    'Administration'
];
export function UnauthorizedLeaveCountFilters({ filters, onFilterChange, onReport, onCancel }: UnauthorizedLeaveCountFiltersProps) {
    return (
        <CollapsibleSection
            title='UNAUTHORIZED LEAVE COUNT REPORT'
            description='Configure filters to generate unauthorized leave count analysis'
            defaultOpen={true}
            variant='default'
            size='lg'
            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
            <div className='grid grid-cols-1 gap-4'>
                {/* Mode Selection */}
                <div className='flex flex-wrap items-center gap-6'>
                    <label className='flex items-center gap-2 text-sm'>
                        <input
                            type='radio'
                            checked={filters.mode === 'Company Wise'}
                            onChange={() => onFilterChange('mode', 'Company Wise')}
                        />
                        Company Wise
                    </label>
                    <label className='flex items-center gap-2 text-sm'>
                        <input
                            type='radio'
                            checked={filters.mode === 'Department Wise'}
                            onChange={() => onFilterChange('mode', 'Department Wise')}
                        />
                        Department Wise
                    </label>
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* Company/Department Selection */}
                    {filters.mode === 'Company Wise' ? (
                        <div>
                            <label htmlFor='company-name-input' className='font-medium text-sm'>
                                Company Name
                            </label>
                            <div className='rounded-md border p-2'>
                                <InputText
                                    id='company-name-input'
                                    placeholder='search here...'
                                    value={filters.companyQuery}
                                    onChange={(e) => onFilterChange('companyQuery', e.target.value)}
                                />
                                <div className='mt-2 max-h-40 space-y-1 overflow-y-auto'>
                                    {availableCompanies
                                        .filter((c) => c.toLowerCase().includes(filters.companyQuery.toLowerCase()))
                                        .map((c) => {
                                            const checkboxId = `company-${c}`;
                                            return (
                                                <label key={c} htmlFor={checkboxId} className='flex items-center gap-2 text-sm'>
                                                    <Checkbox
                                                        id={checkboxId}
                                                        checked={filters.selectedCompanies.includes(c)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                onFilterChange('selectedCompanies', [...filters.selectedCompanies, c]);
                                                            } else {
                                                                onFilterChange(
                                                                    'selectedCompanies',
                                                                    filters.selectedCompanies.filter((x) => x !== c)
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <span>{c}</span>
                                                </label>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Company Name - Single Select (No "All" option) */}
                            <div>
                                <label htmlFor='company-select' className='font-medium text-sm'>
                                    Company Name
                                </label>
                                <Select value={filters.selectedCompany} onValueChange={(value) => onFilterChange('selectedCompany', value)}>
                                    <SelectTrigger id='company-select'>
                                        <SelectValue placeholder='Select Company' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCompaniesWithoutAll.map((company) => (
                                            <SelectItem key={company} value={company}>
                                                {company}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Department - Multi-Select */}
                            <div>
                                <label htmlFor='department-multiselect' className='font-medium text-sm'>
                                    Department Name
                                </label>
                                <MultiSelect
                                    options={availableDepartments.map((dept) => ({
                                        label: dept,
                                        value: dept
                                    }))}
                                    onValueChange={(values) => onFilterChange('selectedDepartments', values)}
                                    defaultValue={filters.selectedDepartments}
                                    placeholder='Select Departments'
                                    className='w-full'
                                    maxHeight={240}
                                />
                            </div>
                        </>
                    )}
                    {/* Detail Level Selection */}
                    <div className='flex items-center gap-6'>
                        <label className='flex items-center gap-2 text-sm'>
                            <input
                                type='radio'
                                checked={filters.detailLevel === 'Only Count'}
                                onChange={() => onFilterChange('detailLevel', 'Only Count')}
                            />
                            Only Count
                        </label>
                        <label className='flex items-center gap-2 text-sm'>
                            <input
                                type='radio'
                                checked={filters.detailLevel === 'Overall Details'}
                                onChange={() => onFilterChange('detailLevel', 'Overall Details')}
                            />
                            Overall Details
                        </label>
                    </div>
                </div>
                {/* Range Mode Selection */}
                <div className='flex items-center gap-6'>
                    <label className='flex items-center gap-2 text-sm'>
                        <input
                            type='radio'
                            checked={filters.rangeMode === 'Month Wise'}
                            onChange={() => onFilterChange('rangeMode', 'Month Wise')}
                        />
                        Month Wise
                    </label>
                    <label className='flex items-center gap-2 text-sm'>
                        <input
                            type='radio'
                            checked={filters.rangeMode === 'Date Wise'}
                            onChange={() => onFilterChange('rangeMode', 'Date Wise')}
                        />
                        Date Wise
                    </label>
                </div>
                {/* Date/Year Selection */}
                <div className='grid grid-cols-1 items-end gap-4 md:grid-cols-3'>
                    <div>
                        <label htmlFor='year-select' className='font-medium text-sm'>
                            Year
                        </label>
                        <Select value={filters.year} onValueChange={(value) => onFilterChange('year', value)}>
                            <SelectTrigger id='year-select'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {['2023', '2024', '2025'].map((y) => (
                                    <SelectItem key={y} value={y}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {filters.rangeMode === 'Month Wise' ? (
                        <div>
                            <label htmlFor='month-select' className='font-medium text-sm'>
                                Month
                            </label>
                            <Select value={filters.month} onValueChange={(value) => onFilterChange('month', value)}>
                                <SelectTrigger id='month-select'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        'January',
                                        'February',
                                        'March',
                                        'April',
                                        'May',
                                        'June',
                                        'July',
                                        'August',
                                        'September',
                                        'October',
                                        'November',
                                        'December'
                                    ].map((m) => (
                                        <SelectItem key={m} value={m}>
                                            {m}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className='grid grid-cols-2 gap-2'>
                            <div>
                                <label htmlFor='from-date-input' className='font-medium text-sm'>
                                    From Date
                                </label>
                                <InputText
                                    id='from-date-input'
                                    type='date'
                                    value={filters.fromDate}
                                    onChange={(e) => onFilterChange('fromDate', e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor='to-date-input' className='font-medium text-sm'>
                                    To Date
                                </label>
                                <InputText
                                    id='to-date-input'
                                    type='date'
                                    value={filters.toDate}
                                    onChange={(e) => onFilterChange('toDate', e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    {/* Action Buttons */}
                    <div className='flex gap-2 md:col-span-3'>
                        <Button onClick={onReport} variant='default'>
                            Report
                        </Button>
                        <Button variant='outline' onClick={onCancel}>
                            <X className='mr-2 h-4 w-4' />
                            Cancel
                        </Button>
                        <Button variant='outline' disabled>
                            Print
                        </Button>
                        <Button variant='outline' disabled>
                            Excel
                        </Button>
                    </div>
                </div>
            </div>
        </CollapsibleSection>
    );
}

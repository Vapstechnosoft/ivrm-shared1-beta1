'use client';
import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
export interface HeadWiseReportFilters {
    selectedGroupTypes: string[];
    month: string;
    year: string;
}
interface HeadWiseReportFiltersProps {
    filters: HeadWiseReportFilters;
    groupTypes: Array<{ id: number; groupType: string }>;
    months: any[];
    years: any[];
    onFilterChange: (filters: HeadWiseReportFilters) => void;
    onSearch: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}
export function HeadWiseReportFilters({
    filters,
    groupTypes,
    months,
    years,
    onFilterChange,
    onSearch,
    onCancel,
    isLoading = false
}: HeadWiseReportFiltersProps) {
    return (
        <CollapsibleSection
            defaultOpen={true}
            variant='default'
            size='lg'
            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
            <div className='space-y-6'>
                {/* Filter Section - Row 1: Group Type and Date Selection */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    {/* Group Type Filter */}
                    <div className='space-y-2'>
                        <Label htmlFor='groupType' className='font-medium text-foreground text-sm'>
                            Group Type: <span className='text-red-500'>*</span>
                        </Label>
                        {isLoading ? (
                            <div className='h-10 w-full animate-pulse rounded-md bg-muted' />
                        ) : groupTypes.length === 0 ? (
                            <div className='text-muted-foreground text-sm'>No group types available</div>
                        ) : (
                            <MultiSelect
                                options={groupTypes
                                    .filter((group) => group.id != null && group.groupType)
                                    .map((group) => ({
                                        label: group.groupType,
                                        value: group.id.toString()
                                    }))}
                                defaultValue={filters.selectedGroupTypes}
                                onValueChange={(values) =>
                                    onFilterChange({
                                        ...filters,
                                        selectedGroupTypes: values
                                    })
                                }
                                placeholder='Select Group Types'
                                className='w-full'
                                maxHeight={240}
                            />
                        )}
                    </div>
                    {/* Month Filter */}
                    <div className='space-y-2'>
                        <Label htmlFor='month' className='font-medium text-foreground text-sm'>
                            Month: <span className='text-red-500'>*</span>
                        </Label>
                        {isLoading ? (
                            <div className='h-10 w-full animate-pulse rounded-md bg-muted' />
                        ) : months.length === 0 ? (
                            <div className='text-muted-foreground text-sm'>No months available</div>
                        ) : (
                            <Select value={filters.month} onValueChange={(value) => onFilterChange({ ...filters, month: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Month' />
                                </SelectTrigger>
                                <SelectContent>
                                    {months
                                        .filter((month) => month.IVRM_Month_Id != null && month.IVRM_Month_Name)
                                        .map((month) => (
                                            <SelectItem key={month.IVRM_Month_Id} value={month.IVRM_Month_Name.trim()}>
                                                {month.IVRM_Month_Name.trim()}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    {/* Year Filter */}
                    <div className='space-y-2'>
                        <Label htmlFor='year' className='font-medium text-foreground text-sm'>
                            Year: <span className='text-red-500'>*</span>
                        </Label>
                        {isLoading ? (
                            <div className='h-10 w-full animate-pulse rounded-md bg-muted' />
                        ) : years.length === 0 ? (
                            <div className='text-muted-foreground text-sm'>No years available</div>
                        ) : (
                            <Select value={filters.year} onValueChange={(value) => onFilterChange({ ...filters, year: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {years
                                        .filter((year) => year.HRMLY_Id != null && year.HRMLY_LeaveYear)
                                        .map((year) => (
                                            <SelectItem key={year.HRMLY_Id} value={year.HRMLY_LeaveYear}>
                                                {year.HRMLY_LeaveYear}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>
                {/* Selected Group Types Display */}
                {filters.selectedGroupTypes.length > 0 && (
                    <div className='space-y-2'>
                        <span className='font-medium text-foreground text-sm'>Selected Group Types:</span>
                        <div className='text-muted-foreground text-sm'>{filters.selectedGroupTypes.length} group type(s) selected</div>
                    </div>
                )}
            </div>
            {/* Action Buttons */}
            <div className='flex gap-2 pt-4'>
                <Button onClick={onSearch}>
                    <Search className='mr-2 h-4 w-4' />
                    SEARCH
                </Button>
                <Button variant='outline' onClick={onCancel}>
                    <X className='mr-2 h-4 w-4' />
                    CANCEL
                </Button>
            </div>
        </CollapsibleSection>
    );
}

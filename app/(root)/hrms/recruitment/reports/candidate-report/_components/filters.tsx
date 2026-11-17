'use client';
import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, RefreshCw } from 'lucide-react';
export interface CandidateReportFilters {
    institution: string;
    candidateId: string;
}
interface CandidateReportFiltersProps {
    filters: CandidateReportFilters;
    institutions: string[];
    candidates: Array<{ id: number | string; firstName: string; middleName?: string; lastName: string }>;
    onFilterChange: (filters: CandidateReportFilters) => void;
    onReport: () => void;
    onPrint: () => void;
}
export function CandidateReportFilters({
    filters,
    institutions,
    candidates,
    onFilterChange,
    onReport,
    onPrint
}: CandidateReportFiltersProps) {
    return (
        <CollapsibleSection
            title='Candidate Report Generation'
            description='Select institution and candidate to generate report'
            defaultOpen={true}
            variant='default'
            size='lg'
            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='space-y-2'>
                    <span className='font-medium text-sm'>
                        Institution <span className='text-red-500'>*</span>
                    </span>
                    <Select value={filters.institution} onValueChange={(value) => onFilterChange({ ...filters, institution: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder='--Select--' />
                        </SelectTrigger>
                        <SelectContent>
                            {institutions.map((i) => (
                                <SelectItem key={i} value={i}>
                                    {i}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='space-y-2 md:col-span-2'>
                    <span className='font-medium text-sm'>
                        Candidate Name <span className='text-red-500'>*</span>
                    </span>
                    <Select value={filters.candidateId} onValueChange={(value) => onFilterChange({ ...filters, candidateId: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder='Select Candidate' />
                        </SelectTrigger>
                        <SelectContent>
                            {candidates.map((c) => (
                                <SelectItem key={c.id} value={c.id.toString()}>
                                    {`${c.firstName} ${c.middleName || ''} ${c.lastName}`.trim()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='mt-4 flex gap-3'>
                <Button type='button' onClick={onReport}>
                    <RefreshCw className='mr-2 h-4 w-4' />
                    Report
                </Button>
                <Button type='button' variant='outline' onClick={onPrint}>
                    <Printer className='mr-2 h-4 w-4' />
                    Print
                </Button>
            </div>
        </CollapsibleSection>
    );
}

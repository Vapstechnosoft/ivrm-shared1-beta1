'use client';

import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useBookCirculationReportSearch } from '@/hooks/library/reports/useBookCirculationReport';
import type { IBookCirculationReportGridData, IBookCirculationReportRequest } from '@/types/library/reports/book-circulation-report';
import { useState } from 'react';
import { getColumns } from './_components/columns';
import { ReportForm } from './_components/report-form';

export default function BookCirculationReportPage() {
    const [view, setView] = useState<'form' | 'grid'>('form');
    const [reportData, setReportData] = useState<IBookCirculationReportGridData[]>([]);
    const [memberType, setMemberType] = useState<string>('Student');

    const searchMutation = useBookCirculationReportSearch();

    const handleSearch = (data: IBookCirculationReportRequest) => {
        setMemberType(data.AGType); // Store member type to select columns
        searchMutation.mutate(data, {
            onSuccess: (response) => {
                // setReportData(response.reportlist || []);
                // if (response.reportlist?.length > 0) {
                //     setView('grid');
                // }
            }
        });
    };

    return (
        <div className='space-y-4'>
            <CollapsibleSection
                title='Book Circulation Report: Form'
                isOpen={view === 'form'}
                onToggle={() => setView(view === 'form' ? 'grid' : 'form')}
                defaultOpen={true}>
                <ReportForm onSearch={handleSearch} isLoading={searchMutation.isPending} />
            </CollapsibleSection>

            {reportData.length > 0 && (
                <CollapsibleSection
                    title='Book Circulation Report Grid'
                    isOpen={view === 'grid'}
                    onToggle={() => setView(view === 'grid' ? 'form' : 'grid')}>
                    <GenericDataTable columns={getColumns(memberType)} data={reportData} isLoading={false} />
                </CollapsibleSection>
            )}
        </div>
    );
}

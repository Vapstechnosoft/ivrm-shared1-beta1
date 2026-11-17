'use client';

import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useLibLostBookReportSearch } from '@/hooks/library/reports/useLibLostBookReport';
import type { ILibLostBookReportGridData, ILibLostBookReportRequest } from '@/types/library/reports/lib-lost-book-report';
import { useState } from 'react';
import { LibLostBookReportColumns } from './_components/columns';
import { ReportForm } from './_components/report-form';

export default function LibLostBookReportPage() {
    const [reportData, setReportData] = useState<ILibLostBookReportGridData[]>([]);

    const searchMutation = useLibLostBookReportSearch();

    const handleSearch = (data: ILibLostBookReportRequest) => {
        searchMutation.mutate(data, {
            onSuccess: (response) => {
                const data = (response.reportlist || []) as ILibLostBookReportGridData[];
                setReportData(data);
            }
        });
    };

    return (
        <div className='space-y-4'>
            <CollapsibleSection title='Lost Book Report' defaultOpen={true}>
                <ReportForm onSearch={handleSearch} isLoading={searchMutation.isPending} />
            </CollapsibleSection>

            {reportData.length > 0 && (
                <CollapsibleSection title='Report Grid' defaultOpen={true}>
                    <GenericDataTable columns={LibLostBookReportColumns} data={reportData} isLoading={false} />
                </CollapsibleSection>
            )}
        </div>
    );
}

'use client';

import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useBookRegisterReportSearch } from '@/hooks/library/reports/useBookRegisterReport';
import type { IBookRegisterReportGridData, IBookRegisterReportRequest } from '@/types/library/reports/book-register-report';
import { useState } from 'react';
import { BookRegisterReportColumns } from './_components/columns';
import { ReportForm } from './_components/report-form';

export default function BookRegisterReportPage() {
    const [reportData, setReportData] = useState<IBookRegisterReportGridData[]>([]);

    const searchMutation = useBookRegisterReportSearch();

    const handleSearch = (data: IBookRegisterReportRequest) => {
        searchMutation.mutate(data, {
            onSuccess: (response) => {
                const data = (response.reportlist || []) as IBookRegisterReportGridData[];
                setReportData(data);
            }
        });
    };

    return (
        <div className='space-y-4'>
            <CollapsibleSection title='Book Register Report' defaultOpen={true}>
                <ReportForm onSearch={handleSearch} isLoading={searchMutation.isPending} />
            </CollapsibleSection>

            {reportData.length > 0 && (
                <CollapsibleSection title='Book Register Report List' defaultOpen={true}>
                    <GenericDataTable columns={BookRegisterReportColumns} data={reportData} isLoading={false} />
                </CollapsibleSection>
            )}
        </div>
    );
}

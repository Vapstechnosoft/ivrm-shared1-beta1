'use client';

import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useRackReportSearch } from '@/hooks/library/reports/useRackReport';
import type { IRackReportGridData, IRackReportRequest } from '@/types/library/reports/rack-report';
import { useState } from 'react';
import { RackReportColumns } from './_components/columns';
import { ReportForm } from './_components/report-form';

export default function RackReportPage() {
    const [view, setView] = useState<'form' | 'grid'>('form');
    const [reportData, setReportData] = useState<IRackReportGridData[]>([]);

    const searchMutation = useRackReportSearch();

    const handleSearch = (data: IRackReportRequest) => {
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
                title='Rack Report: Form'
                isOpen={view === 'form'}
                onToggle={() => setView(view === 'form' ? 'grid' : 'form')}
                defaultOpen={true}>
                <ReportForm onSearch={handleSearch} isLoading={searchMutation.isPending} />
            </CollapsibleSection>

            {reportData.length > 0 && (
                <CollapsibleSection
                    title='Rack Report Grid'
                    isOpen={view === 'grid'}
                    onToggle={() => setView(view === 'grid' ? 'form' : 'grid')}>
                    <GenericDataTable
                        columns={RackReportColumns}
                        data={reportData}
                        isLoading={false}
                        defaultVisibility={{
                            slNo: true,
                            lmbano_AccessionNo: true,
                            lmb_BookTitle: true,
                            rack_Name: true,
                            lmra_FloorName: true,
                            lmb_BookType: true,
                            rack_Location: true,
                            lmbano_AvialableStatus: true
                        }}
                    />
                </CollapsibleSection>
            )}
        </div>
    );
}

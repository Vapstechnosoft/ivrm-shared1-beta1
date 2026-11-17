'use client';

import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useBookArrivalReportSearch } from '@/hooks/library/reports/useBookArrivalReport';
import type { IBookArrivalReportGridData, IBookArrivalReportRequest } from '@/types/library/reports/book-arrival-report';
import { useState } from 'react';
import { BookArrivalReportColumns } from './_components/columns';
import { ReportForm } from './_components/report-form';

export default function BookArrivalReportPage() {
    const [view, setView] = useState<'form' | 'grid'>('form');
    const [reportData, setReportData] = useState<IBookArrivalReportGridData[]>([]);

    const searchMutation = useBookArrivalReportSearch();

    const handleSearch = (data: IBookArrivalReportRequest) => {
        searchMutation.mutate(data, {
            onSuccess: (response) => {
                // setReportData(Array.isArray(response.reportlist) ? response.reportlist : []);
                // if (response.reportlist?.length > 0) {
                //     setView('grid');
                // }
            }
        });
    };

    return (
        <div className='space-y-4'>
            <CollapsibleSection
                title='Book Arrival Report: Form'
                isOpen={view === 'form'}
                onToggle={() => setView(view === 'form' ? 'grid' : 'form')}
                defaultOpen={true}>
                <ReportForm onSearch={handleSearch} isLoading={searchMutation.isPending} />
            </CollapsibleSection>

            {reportData.length > 0 && (
                <CollapsibleSection
                    title='Book Arrival Report Grid'
                    isOpen={view === 'grid'}
                    onToggle={() => setView(view === 'grid' ? 'form' : 'grid')}>
                    <GenericDataTable
                        columns={BookArrivalReportColumns}
                        data={reportData}
                        isLoading={false}
                        defaultVisibility={{
                            slNo: true,
                            lmbano_AccessionNo: true,
                            lmb_BookTitle: true,
                            lmd_DepartmentName: true,
                            authorName: true,
                            lmb_BookType: true,
                            lmb_CallNo: true,
                            lmb_PurchaseDate: true,
                            lmb_EntryDate: true,
                            lml_LanguageName: true
                        }}
                    />
                </CollapsibleSection>
            )}
        </div>
    );
}

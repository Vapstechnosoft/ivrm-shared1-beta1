'use client';

import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useAvailableBooksReportSearch } from '@/hooks/library/reports/useAvailableBooksReport';
import type { IAvailableBooksReportGridData, IAvailableBooksReportRequest } from '@/types/library/reports/available-books-report';
import { useState } from 'react';
import { AvailableBooksReportColumns } from './_components/columns';
import { ReportForm } from './_components/report-form';

export default function AvailableBooksReportPage() {
    const [view, setView] = useState<'form' | 'grid'>('form');
    const [reportData, setReportData] = useState<IAvailableBooksReportGridData[]>([]);

    const searchMutation = useAvailableBooksReportSearch();

    const handleSearch = (data: IAvailableBooksReportRequest) => {
        searchMutation.mutate(data, {
            onSuccess: (response) => {
                setReportData((response.griddata as IAvailableBooksReportGridData[]) || []);

                //  if (response.griddata?.length > 0) {
                //      setView('grid');
                // }
            }
        });
    };

    return (
        <div className='space-y-4'>
            <CollapsibleSection
                title='Available Books Report'
                isOpen={view === 'form'}
                // onToggle={() => setView(view === 'form' ? 'grid' : 'form')}
                defaultOpen={true}
            >
                <ReportForm onSearch={handleSearch} isLoading={searchMutation.isPending} />
            </CollapsibleSection>

            {reportData.length > 0 && (
                <CollapsibleSection
                    title='Available Book Report Grid'
                    isOpen={view === 'grid'}

                    // onToggle={() => setView(view === 'grid' ? 'form' : 'grid')}
                >
                    <GenericDataTable
                        columns={AvailableBooksReportColumns}
                        data={reportData}
                        isLoading={false}
                        // defaultVisibility={{
                        //     slNo: true,
                        //     lmb_EntryDate: true,
                        //     lmbano_AccessionNo: true,
                        //     lmb_BookTitle: true,
                        //     lmb_BookType: true,
                        //     lmd_DepartmentName: true,
                        //     authorName: true,
                        //     lmp_PublisherName: true,
                        //     lml_LanguageName: true,
                        //     lms_SubjectName: true,
                        //     lmb_PurOrDonated: true
                        // }}
                    />
                </CollapsibleSection>
            )}
        </div>
    );
}

'use client';

import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { usePurchaseDonateReportSearch } from '@/hooks/library/reports/usePurchaseDonateReport';
import type { IPurchaseDonateReportGridData, IPurchaseDonateReportRequest } from '@/types/library/reports/purchase-donate-report';
import { useState } from 'react';
import { columns } from './_components/columns';
import { ReportForm } from './_components/report-form';

export default function PurchaseDonateReportPage() {
    const [reportData, setReportData] = useState<IPurchaseDonateReportGridData[]>([]);

    const searchMutation = usePurchaseDonateReportSearch();

    const handleSearch = (data: IPurchaseDonateReportRequest) => {
        searchMutation.mutate(data, {
            onSuccess: (response) => {
                const data = (response.alldata || []) as IPurchaseDonateReportGridData[];
                setReportData(data);
            }
        });
    };

    return (
        <div className='space-y-4'>
            <CollapsibleSection title='Purchase Donate Report: Form' defaultOpen={true}>
                <ReportForm onSearch={handleSearch} isLoading={searchMutation.isPending} />
            </CollapsibleSection>

            {reportData.length > 0 && (
                <CollapsibleSection title='Purchase Donate Report Grid' defaultOpen={true}>
                    <GenericDataTable columns={columns} data={reportData} isLoading={false} />
                </CollapsibleSection>
            )}
        </div>
    );
}

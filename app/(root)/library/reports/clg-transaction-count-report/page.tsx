'use client';

import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useCLGTransactionCountReportSearch } from '@/hooks/library/reports/useCLGTransactionCountReport';
import type {
    ICLGTransactionCountReportGridData,
    ICLGTransactionCountReportRequest
} from '@/types/library/reports/clg-transaction-count-report';
import { useState } from 'react';
import { CLGTransactionCountColumns, CLGTransactionStatusColumns } from './_components/columns';
import { ReportForm } from './_components/report-form';

export default function CLGTransactionCountReportPage() {
    const [reportData, setReportData] = useState<ICLGTransactionCountReportGridData[]>([]);
    const [isStatusCount, setIsStatusCount] = useState(false);

    const searchMutation = useCLGTransactionCountReportSearch();

    const handleSearch = (data: ICLGTransactionCountReportRequest) => {
        setIsStatusCount(data.statuscount);
        searchMutation.mutate(data, {
            onSuccess: (response) => {
                const data = (response.alldata || []) as ICLGTransactionCountReportGridData[];
                setReportData(data);
            }
        });
    };

    return (
        <div className='space-y-4'>
            <CollapsibleSection title='STUDENT BOOK Transaction Count Report' defaultOpen={true}>
                <ReportForm onSearch={handleSearch} isLoading={searchMutation.isPending} />
            </CollapsibleSection>

            {reportData.length > 0 && (
                <CollapsibleSection title='Report Grid' defaultOpen={true}>
                    <GenericDataTable
                        columns={isStatusCount ? CLGTransactionStatusColumns : CLGTransactionCountColumns}
                        data={reportData}
                        isLoading={false}
                    />
                </CollapsibleSection>
            )}
        </div>
    );
}

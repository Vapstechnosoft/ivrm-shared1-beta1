'use client';

import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useLibTransactionReportSearch } from '@/hooks/library/reports/useLibTransactionReport';
import type { ILibTransactionReportGridData, ILibTransactionReportRequest } from '@/types/library/reports/lib-transaction-report';
import { useState } from 'react';
import { LibTransactionClassColumns, LibTransactionStatusColumns } from './_components/columns';
import { ReportForm } from './_components/report-form';

export default function LibTransactionReportPage() {
    const [reportData, setReportData] = useState<ILibTransactionReportGridData[]>([]);
    const [isStatusCount, setIsStatusCount] = useState(false);

    const searchMutation = useLibTransactionReportSearch();

    const handleSearch = (data: ILibTransactionReportRequest) => {
        setIsStatusCount(data.statuscount);
        searchMutation.mutate(data, {
            onSuccess: (response) => {
                const data = (response.alldata || []) as ILibTransactionReportGridData[];
                setReportData(data);
            }
        });
    };

    return (
        <div className='space-y-4'>
            <CollapsibleSection title='Student Book Transaction Count Report' defaultOpen={true}>
                <ReportForm onSearch={handleSearch} isLoading={searchMutation.isPending} />
            </CollapsibleSection>

            {reportData.length > 0 && (
                <CollapsibleSection title='Report Grid' defaultOpen={true}>
                    <GenericDataTable
                        columns={isStatusCount ? LibTransactionStatusColumns : LibTransactionClassColumns}
                        data={reportData}
                        isLoading={false}
                    />
                </CollapsibleSection>
            )}
        </div>
    );
}

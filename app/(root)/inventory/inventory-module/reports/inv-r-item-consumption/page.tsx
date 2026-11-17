
'use client';

import { useState, use } from 'react';
import { Heading } from '@/components/layout/heading';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import ReportForm from './_components/report-form';
import { getColumns } from './_components/columns';
import { IInvRItemConsumptionPayload } from '@/types/inventory/reports/inv-r-item-consumption';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { tableSearchVariables } from '@/lib/data-table.config';
import { useInvRItemConsumptionReportQuery } from '@/hooks/inventory/reports/use-inv-r-item-consumption';

export default function InvRItemConsumptionPage(props: { searchParams: Promise<any> }) {
    const searchParams = use(props.searchParams);
    const [currentPayload, setCurrentPayload] = useState<IInvRItemConsumptionPayload | null>(null);

    // Pagination & Search State synced with URL
    const [currentPage, setCurrentPage] = useQueryState(
        tableSearchVariables.page,
        parseAsInteger.withOptions({ shallow: false }).withDefault(1)
    );
    const [pageSize, setPageSize] = useQueryState(
        tableSearchVariables.page_size,
        parseAsInteger.withOptions({ shallow: false }).withDefault(10)
    );
    const [searchQuery, setSearchQuery] = useQueryState(
        tableSearchVariables.search,
        parseAsString.withOptions({ shallow: false }).withDefault('')
    );

    // Prepare payload for hook (convert Dates to strings to avoid serialization issues/hook unnecessary updates)
    const payloadForHook = currentPayload ? {
        ...currentPayload,
        startdate: currentPayload.startdate ? new Date(currentPayload.startdate).toISOString() : undefined,
        enddate: currentPayload.enddate ? new Date(currentPayload.enddate).toISOString() : undefined,
    } : null;

    const { data: reportResult, isFetching } = useInvRItemConsumptionReportQuery(payloadForHook as any, {
        ...searchParams,
        page: currentPage,
        page_size: pageSize,
        search_query: searchQuery
    });

    const reportData = reportResult?.data?.get_ICReport || [];
    const totalRecords = reportResult?.total || 0;

    const handleReportGenerated = (payload: any) => {
        if (payload) {
            setCurrentPayload(payload);
            setCurrentPage(1);
            setSearchQuery(null);
        } else {
            setCurrentPayload(null);
            setCurrentPage(1);
            setSearchQuery(null);
        }
    };

    const columns = getColumns(currentPayload?.typeflag || 'All', currentPayload?.optionflag);

    const tableProps = useDataTableProps({
        enablePagination: true,
        enableSorting: true,
        enableSearching: true,
        isSearchRequired: true,
    });

    return (
        <div className="space-y-6">
            <Heading
                title="Item Consumption Report"
                description="Generate Item Consumption Reports"
            />

            <ReportForm onReportGenerated={handleReportGenerated} isLoading={isFetching} />

            {reportData.length > 0 && (
                <CollapsibleSection title="Report Result" defaultOpen={true}>
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center bg-muted/20 p-2 rounded border">
                            <div className="flex gap-2 items-center">
                                <span className="font-semibold text-sm">Total Records:</span>
                                <Badge variant="secondary">{totalRecords}</Badge>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => window.print()}>
                                <Printer className="mr-2 h-4 w-4" /> Print
                            </Button>
                        </div>

                        <GenericDataTable
                            {...tableProps}
                            data={reportData}
                            columns={columns}
                            isLoading={isFetching}
                            totalItems={totalRecords}
                        />
                    </div>
                </CollapsibleSection>
            )}
        </div>
    );
}

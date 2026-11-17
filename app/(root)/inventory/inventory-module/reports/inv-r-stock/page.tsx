

'use client';
import { useState, use } from 'react';
import { Heading } from '@/components/layout/heading';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import ReportForm from './_components/report-form';
import { getColumns } from './_components/columns';
import { IInvRStockReportData, IInvRStockPayload } from '@/types/inventory/reports/inv-r-stock';
import { Badge } from '@/components/ui/badge';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { tableSearchVariables } from '@/lib/data-table.config';
import { useInvRStockReportQuery } from '@/hooks/inventory/reports/use-inv-r-stock';
import { useQueryClient } from '@tanstack/react-query';

// Helper function to calculate closing stock
const calculateClosingStock = (data: IInvRStockReportData[]) => {
    return data.reduce((acc, curr) => acc + (curr.invstO_AvaiableStock || 0), 0);
};

export default function InvRStockPage(props: { searchParams: Promise<any> }) {
    const searchParams = use(props.searchParams);
    const [currentPayload, setCurrentPayload] = useState<IInvRStockPayload | null>(null);
    const queryClient = useQueryClient();

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

    const { data: reportResult, isFetching } = useInvRStockReportQuery(currentPayload, {
        ...searchParams,
        page: currentPage,
        page_size: pageSize,
        search_query: searchQuery
    });

    const reportData = reportResult?.data?.get_StockReport || [];
    const totalRecords = reportResult?.total || 0;

    const handleReportGenerated = (data: IInvRStockReportData[], payload: any, total: number) => {
        // Seed the query cache to avoid immediate refetch
        queryClient.setQueryData(['invRStockReport', payload, { ...searchParams, page: 1, page_size: pageSize, search_query: '' }], {
            success: true,
            data: { get_StockReport: data },
            total: total,
            page: 1,
            page_size: pageSize,
            message: 'Report generated successfully'
        });

        setCurrentPayload(payload);
        setCurrentPage(1);
        setSearchQuery(null);
    };

    const columns = getColumns(currentPayload?.optionflag || 'All', currentPayload?.overallflag || false);

    // Calculate Closing Stock Totals
    const closingStockTotal = calculateClosingStock(reportData);

    return (
        <div className="space-y-6">
            <Heading
                title="Stock Report"
                description="Generate Inventory Stock Reports"
            />

            <ReportForm onReportGenerated={handleReportGenerated} />

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

                        <div className="relative">
                            <GenericDataTable
                                data={reportData}
                                columns={columns}
                                isLoading={isFetching}
                                totalItems={totalRecords}
                                isSearchRequired={true}
                            // enableSorting={true} // Usually handled by columns
                            />
                        </div>

                        {/* Total Closing Stock (Only if OptionFlag is Item) */}
                        {currentPayload?.optionflag === 'Item' && (
                            <div className="flex justify-end mt-4">
                                <Card className="w-full md:w-[300px] bg-muted/10">
                                    <CardContent className="p-4 flex justify-between items-center">
                                        <span className="font-bold">Closing Stock:</span>
                                        <span className="font-mono text-lg font-bold">{closingStockTotal.toFixed(2)}</span>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                    </div>
                </CollapsibleSection>
            )}
        </div>
    );
}

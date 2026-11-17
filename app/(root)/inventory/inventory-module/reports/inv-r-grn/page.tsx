'use client';

import { useState, use } from 'react';
import { Heading } from '@/components/layout/heading';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import ReportForm from './_components/report-form';
import { getColumns } from './_components/columns';
import { IInvRGRNPayload, IInvRGRNReportData } from '@/types/inventory/reports/inv-r-grn';
import { Badge } from '@/components/ui/badge';
import { getInvRGRNReport } from '@/server/inventory/reports/inv-r-grn';
import { toast } from 'sonner';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { tableSearchVariables } from '@/lib/data-table.config';
import { useInvRGRNReportQuery } from '@/hooks/inventory/reports/use-inv-r-grn';
import { useQueryClient } from '@tanstack/react-query';

interface ReportTotals {
    basic: number;
    tax: number;
    discount: number;
    final: number;
}

const calculateReportTotals = (data: any[]): ReportTotals => {
    return data.reduce((acc: ReportTotals, curr: any) => {
        // Handle casing and report type variations
        const qty = curr.invtgrn_qty ?? curr.invtgrN_Qty ?? curr.grnQuantity ?? curr.grnquantity ?? 0;
        const rate = curr.invtgrn_purchaserate ?? curr.invtgrN_PurchaseRate ?? curr.grnRate ?? curr.grnrate ?? 0;
        const tax = curr.invtgrn_taxamt ?? curr.invtgrN_TaxAmt ?? curr.grnTax ?? curr.grntax ?? 0;
        const discount = curr.invtgrn_discountamt ?? curr.invtgrN_DiscountAmt ?? curr.grnDiscount ?? curr.grndiscount ?? 0;
        const amount = curr.invtgrn_amount ?? curr.invtgrN_Amount ?? curr.grnAmount ?? curr.grnamount ?? 0;

        const basic = Number(qty) * Number(rate);

        return {
            basic: acc.basic + basic,
            tax: acc.tax + Number(tax),
            discount: acc.discount + Number(discount),
            final: acc.final + Number(amount)
        };
    }, { basic: 0, tax: 0, discount: 0, final: 0 } as ReportTotals);
};

export default function InvRGRNPage(props: { searchParams: Promise<any> }) {
    const searchParams = use(props.searchParams);
    const [currentPayload, setCurrentPayload] = useState<IInvRGRNPayload | null>(null);
    const queryClient = useQueryClient();

    // Pagination State synced with URL (same as DataTable)
    const [currentPage, setCurrentPage] = useQueryState(
        tableSearchVariables.page,
        parseAsInteger.withOptions({ shallow: false }).withDefault(1)
    );
    const [pageSize] = useQueryState(
        tableSearchVariables.page_size,
        parseAsInteger.withOptions({ shallow: false }).withDefault(10)
    );
    const [searchQuery, setSearchQuery] = useQueryState(
        tableSearchVariables.search,
        parseAsString.withOptions({ shallow: false }).withDefault('')
    );

    const { data: reportResult, isFetching } = useInvRGRNReportQuery(currentPayload, { ...searchParams, page: currentPage, page_size: pageSize, search_query: searchQuery });

    const reportData = reportResult?.data?.get_grnreport || [];
    const totalRecords = reportResult?.total || 0;

    // Handle initial report generation (Page 1)
    const handleReportGenerated = (data: IInvRGRNReportData[], payload: IInvRGRNPayload, total: number) => {
        // Seed the query cache with the data we just got from the form submit
        // This prevents the hook from needing to immediately re-fetch
        queryClient.setQueryData(['invRGRNReport', payload, { ...searchParams, page: 1, page_size: pageSize, search_query: '' }], {
            success: true,
            data: { get_grnreport: data, get_grn_item_supplier: [] },
            total: total,
            page: 1,
            page_size: pageSize
        });

        setCurrentPayload(payload);

        // Reset to page 1
        setCurrentPage(1);
        setSearchQuery(null);
    };

    const columns = getColumns(currentPayload?.typeflag || 'All', (currentPayload as any)?.optionflag, currentPage, pageSize);

    // Calculate Totals (Client side sum of CURRENT PAGE)
    const totals = calculateReportTotals(reportData);

    // Validate if Final approx Basic + Tax - Discount. Use API 'amount' as truth, or calculated if 0.
    const displayFinal = totals.final > 0 ? totals.final : (totals.basic + totals.tax - totals.discount);

    return (
        <div className="space-y-6">
            <Heading
                title="GRN Report"
                description="Generate Goods Receipt Note Reports"
            />


            <ReportForm
                onReportGenerated={handleReportGenerated}
            />

            {totalRecords > 0 && (
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
                            data={reportData}
                            columns={columns}
                            isLoading={isFetching} // Use isFetching to show loading on page changes/search

                            totalItems={totalRecords}
                            isSearchRequired={true}
                        // enableSorting={true} - Handled by columns definitions usually
                        />

                        {/* Summary Card */}
                        {reportData.length > 0 && (
                            <div className="flex justify-end">
                                <Card className="w-full md:w-[400px] bg-muted/10">
                                    <CardHeader className="py-3">
                                        <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">Summary (Current Page)</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm pt-0">
                                        <div className="flex justify-between">
                                            <span>Total Amount (Basic):</span>
                                            <span className="font-mono">{totals.basic.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-green-600">
                                            <span>Total Tax (+):</span>
                                            <span className="font-mono">{totals.tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-destructive">
                                            <span>Total Discount (-):</span>
                                            <span className="font-mono">{totals.discount.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                                            <span>Final Amount:</span>
                                            <span className="font-mono">{displayFinal.toFixed(2)}</span>
                                        </div>
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

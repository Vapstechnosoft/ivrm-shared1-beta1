'use client';

import { use, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Heading } from '@/components/layout/heading';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import ReportForm from './_components/report-form';
import { getColumns } from './_components/columns';
import { Badge } from '@/components/ui/badge';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { InvRSalesSchema } from '@/schemas/inventory/reports/inv-r-sales';
import { tableSearchVariables } from '@/lib/data-table.config';
import { useInvRSalesReportQuery } from '@/hooks/inventory/reports/use-inv-r-sales';

interface ReportTotals {
    amount: number;
    tax: number;
    discount: number;
}

const calculateReportTotals = (data: any[]): ReportTotals => {
    return data.reduce((acc: ReportTotals, curr: any) => {
        const amount = curr.total_Amount ?? curr.invtsL_Amount ?? curr.saleAmount ?? curr.invtsl_Amount ?? 0;
        const tax = curr.tax_Amt ?? curr.invtsL_TaxAmt ?? curr.saleTax ?? curr.invtsl_TaxAmt ?? 0;
        const discount = curr.discount_Amt ?? curr.invtsL_DiscountAmt ?? curr.saleDiscount ?? curr.invtsl_DiscountAmt ?? 0;

        return {
            amount: acc.amount + Number(amount),
            tax: acc.tax + Number(tax),
            discount: acc.discount + Number(discount)
        };
    }, { amount: 0, tax: 0, discount: 0 } as ReportTotals);
};

export default function InvRSalesPage(props: { searchParams: Promise<any> }) {
    const searchParams = use(props.searchParams);
    const [currentPage, setPage] = useQueryState(
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

    const [currentPayload, setCurrentPayload] = useState<InvRSalesSchema | null>(null);

    const payloadForHook = currentPayload ? {
        ...currentPayload,
        startdate: currentPayload.startdate instanceof Date ? currentPayload.startdate.toISOString() : currentPayload.startdate,
        enddate: currentPayload.enddate instanceof Date ? currentPayload.enddate.toISOString() : currentPayload.enddate,
    } : null;

    const { data: reportResult, isFetching } = useInvRSalesReportQuery(payloadForHook as any, {
        ...searchParams,
        page: currentPage,
        page_size: pageSize,
        search_query: searchQuery
    });

    const reportData = reportResult?.data?.get_SalesReport || [];
    const totalRecords = reportResult?.total || 0;

    const handleReportSubmit = (payload: InvRSalesSchema | null) => {
        // Handle reset or empty
        if (!payload || Object.keys(payload).length === 0) {
            setCurrentPayload(null);
            setPage(1);
            setSearchQuery(null);
            return;
        }

        setCurrentPayload(payload);
        setPage(1);
        setSearchQuery(null);
    };

    const columns = getColumns(
        currentPayload?.typeflag || 'All',
        currentPayload?.optionflag,
        currentPayload?.showTax || false,
        currentPayload?.showDiscount || false,
        currentPage,
        pageSize
    );

    const totals = calculateReportTotals(reportData);

    const componentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Sales Report - ${new Date().toISOString().split('T')[0]}`,
        pageStyle: `
            @page { size: auto; margin: 10mm; }
            @media print {
                body { -webkit-print-color-adjust: exact; }
                .overflow-hidden { overflow: visible !important; }
                .overflow-auto { overflow: visible !important; }
                .h-full { height: auto !important; }
            }
        `
    } as any);

    const tableProps = useDataTableProps({
        enablePagination: true,
        enableSorting: false,
        enableSearching: true, // Grid Search enabled
        isSearchRequired: true,
    });

    return (
        <div className="space-y-6">
            <Heading
                title="Sales Report"
                description="Generate Sales Reports"
            />

            <ReportForm onSubmit={handleReportSubmit} isLoading={isFetching} />

            {reportData.length > 0 && (
                <CollapsibleSection title="Report Result" defaultOpen={true}>
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center bg-muted/20 p-2 rounded border">
                            <div className="flex gap-2 items-center">
                                <span className="font-semibold text-sm">Total Records:</span>
                                <Badge variant="secondary">{totalRecords}</Badge>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handlePrint()}>
                                <Printer className="mr-2 h-4 w-4" /> Print
                            </Button>
                        </div>

                        <div ref={componentRef} className="print:p-4">
                            {/* Print Header */}
                            <div className="hidden print:block text-center mb-6">
                                <h1 className="text-2xl font-bold">Sales Report</h1>
                                <p className="text-sm text-gray-500">Generated on: {new Date().toLocaleDateString()}</p>
                            </div>

                            <GenericDataTable
                                {...tableProps}
                                data={reportData}
                                columns={columns}
                                totalItems={totalRecords}
                                isLoading={isFetching}
                                isSearchRequired={true}
                            />

                            {reportData.length > 0 && (
                                <div className="flex justify-end mt-4">
                                    <Card className="w-full md:w-[400px] bg-muted/10 print:bg-transparent print:border-none print:shadow-none">
                                        <CardHeader className="py-3">
                                            <CardTitle className="text-sm font-semibold uppercase text-muted-foreground print:text-black">Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm pt-0">
                                            {(currentPayload?.showDiscount) && (
                                                <div className="flex justify-between text-destructive print:text-black">
                                                    <span>Total Discount (-):</span>
                                                    <span className="font-mono">{totals.discount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            {(currentPayload?.showTax) && (
                                                <div className="flex justify-between text-green-600 print:text-black">
                                                    <span>Total Tax (+):</span>
                                                    <span className="font-mono">{totals.tax.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                                                <span>Total Amount:</span>
                                                <span className="font-mono">{totals.amount.toFixed(2)}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>
                </CollapsibleSection>
            )}
        </div>
    );
}

'use client';

import { useState, useCallback, useMemo, use } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';

import { Heading } from "@/components/layout/heading";
import { GenericDataTable, useDataTableProps } from "@/components/ui/data-table/generic-data-table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    IInvVendorPaymentDetails,
    IInvVendorPaymentOverallReport,
    IInvVendorPaymentReportPayload,
    IInvVendorPaymentVendorReport,
} from "@/types/inventory/reports/inv-r-vendor-payment";
import { tableSearchVariables } from '@/lib/data-table.config';

import { overallColumns, vendorDetailsColumns, vendorPaymentColumns } from "./_components/columns";
import VendorPaymentReportForm from "./_components/vendor-payment-report-form";
import { CollapsibleSection } from "@/components/ui/form/collapsible-section";
import { Badge } from "@/components/ui/badge";
import { Printer } from "lucide-react";
import { useInvVendorDetails, useInvVendorPaymentReportQuery } from "@/hooks/inventory/reports/use-inv-r-vendor-payment";

export default function VendorPaymentReportPage(props: { searchParams: Promise<any> }) {
    const searchParams = use(props.searchParams);
    const [currentPayload, setCurrentPayload] = useState<IInvVendorPaymentReportPayload | null>(null);
    const [reportType, setReportType] = useState<"Overall" | "Vendor">("Overall");

    // Details State
    const [detailsData, setDetailsData] = useState<IInvVendorPaymentDetails[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVendorName, setSelectedVendorName] = useState("");

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

    const { data: reportResult, isFetching } = useInvVendorPaymentReportQuery(currentPayload, {
        ...searchParams,
        page: currentPage,
        page_size: pageSize,
        search_query: searchQuery
    });

    const reportData = reportResult?.data || [];
    const totalRecords = reportResult?.total || 0;

    const { mutate: fetchDetails, isPending: isDetailsLoading } = useInvVendorDetails();

    const handleReportGenerated = (payload: IInvVendorPaymentReportPayload | null) => {
        if (payload) {
            setCurrentPayload(payload);
            setReportType(payload.reporttype);
            setCurrentPage(1);
            setSearchQuery(null);
        } else {
            setCurrentPayload(null);
            setCurrentPage(1);
            setSearchQuery(null);
        }
    };

    const handleVendorClick = useCallback((vendor: IInvVendorPaymentVendorReport) => {
        if (!currentPayload) return;

        setSelectedVendorName(vendor.vendorName);

        const payload = {
            INVMS_Id: vendor.invmS_Id,
            Fromdate: currentPayload.Fromdate,
            Todate: currentPayload.Todate,
        };

        fetchDetails(payload, {
            onSuccess: (response: any) => {
                if (response.success) {
                    // Handle various data structures as seen in original code
                    const data = Array.isArray(response.data.getvendordetails)
                        ? response.data.getvendordetails
                        : response.data.getvendordetails?.$values || [];
                    setDetailsData(data);
                    setIsModalOpen(true);
                } else {
                    setDetailsData([]);
                    // Toast handled by hook or here? Hook handles onError, but we check success flag here.
                    // The hook has onSuccess but we are overriding it here to handle specific data structure?
                    // Wait, useMutation options override definition? No, they chain/merge usually.
                    // Let's rely on manual check here.
                    if (response.message) toast.error(response.message);
                }
            }
        });
    }, [currentPayload, fetchDetails]);

    const columns = useMemo(() => {
        return reportType === "Overall"
            ? overallColumns
            : vendorPaymentColumns(handleVendorClick);
    }, [reportType, handleVendorClick]);

    // Calculate Totals for Main Table
    const totals = useMemo(() => {
        return reportData.reduce((acc: any, curr: any) => {
            if (reportType === "Overall") {
                const item = curr as IInvVendorPaymentOverallReport;
                return {
                    amount: acc.amount + Number(item.invmgrN_TotalPaid || 0),
                    paid: 0,
                    balance: 0
                };
            } else {
                const item = curr as IInvVendorPaymentVendorReport;
                return {
                    amount: acc.amount + Number(item.totalAmount || 0),
                    paid: acc.paid + Number(item.totalPaidAmount || 0),
                    balance: acc.balance + Number(item.balanceAmount || 0),
                };
            }
        }, { amount: 0, paid: 0, balance: 0 });
    }, [reportData, reportType]);

    // Calculate Totals for Details Modal
    const detailsTotals = useMemo(() => {
        return detailsData.reduce((acc, curr) => {
            return {
                amount: acc.amount + Number(curr.totalAmount || 0),
                paid: acc.paid + Number(curr.totalPaidAmount || 0),
                balance: acc.balance + Number(curr.balanceAmount || 0),
            };
        }, { amount: 0, paid: 0, balance: 0 });
    }, [detailsData]);

    const tableProps = useDataTableProps({
        enablePagination: true,
        enableSorting: true,
        enableSearching: true,
        isSearchRequired: true,
    });

    return (
        <div className="space-y-6">
            <Heading
                title="Vendor Payment Report"
                description="View overall and vendor-wise payment reports."
            />

            <VendorPaymentReportForm
                onReportGenerated={handleReportGenerated}
                isLoading={isFetching}
            />

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
                                {...tableProps}
                                data={reportData}
                                columns={columns as any}
                                isLoading={isFetching}
                                totalItems={totalRecords}
                                isSearchRequired={true}
                            />
                        </div>

                        {/* Summary Footer */}
                        <div className="flex justify-end">
                            <Card className="w-full md:w-1/3 bg-muted/10">
                                <CardHeader className="py-2">
                                    <CardTitle className="text-sm">Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="py-2 text-sm">
                                    <div className="flex justify-between py-1 border-b">
                                        <span className="font-semibold">Total Amount:</span>
                                        <span>{totals.amount.toFixed(2)}</span>
                                    </div>
                                    {reportType === "Vendor" && (
                                        <>
                                            <div className="flex justify-between py-1 border-b">
                                                <span className="font-semibold">Total Paid:</span>
                                                <span>{totals.paid.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                                <span className="font-semibold">Total Balance:</span>
                                                <span>{totals.balance.toFixed(2)}</span>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </CollapsibleSection>
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Vendor Payment Details - {selectedVendorName}</DialogTitle>
                        <div className="text-sm text-muted-foreground">
                            {currentPayload && (
                                <span>
                                    {format(new Date(currentPayload.Fromdate), "dd-MM-yyyy")} TO {format(new Date(currentPayload.Todate), "dd-MM-yyyy")}
                                </span>
                            )}
                        </div>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Button variant="outline" size="sm" onClick={() => window.print()}>
                                Print Details
                            </Button>
                        </div>
                        <GenericDataTable
                            data={detailsData}
                            columns={vendorDetailsColumns}
                            isLoading={isDetailsLoading}
                            totalItems={detailsData.length}
                            isSearchRequired={false}
                        />

                        {/* Details Summary */}
                        {detailsData.length > 0 && (
                            <div className="flex justify-end">
                                <Card className="w-full md:w-1/2 bg-muted/20">
                                    <CardContent className="py-2 text-sm">
                                        <div className="grid grid-cols-3 gap-4 font-semibold text-center">
                                            <div>
                                                <div className="text-xs text-muted-foreground">Total Amount</div>
                                                <div>{detailsTotals.amount.toFixed(2)}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">Total Paid</div>
                                                <div>{detailsTotals.paid.toFixed(2)}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">Total Balance</div>
                                                <div>{detailsTotals.balance.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

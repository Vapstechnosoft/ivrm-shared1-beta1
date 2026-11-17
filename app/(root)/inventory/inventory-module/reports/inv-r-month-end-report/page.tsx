'use client';

import { useState } from 'react';
import { Heading } from '@/components/layout/heading';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Button } from '@/components/ui/button';
import { Printer, FileSpreadsheet } from 'lucide-react';
import ReportForm from './_components/report-form';
import { IInvRMonthEndReportData, IInvRMonthEndReportPayload, IInvRMonthEndReportTableRow } from '@/types/inventory/reports/inv-r-month-end-report';
import { getInvRMonthEndReport } from '@/server/inventory/reports/inv-r-month-end-report';
import { toast } from 'sonner';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { columns } from './_components/columns';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function InvRMonthEndReportPage() {
    const [reportData, setReportData] = useState<IInvRMonthEndReportData | null>(null);
    const [currentPayload, setCurrentPayload] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showReport, setShowReport] = useState(false);

    const handleReportGenerated = async (data: IInvRMonthEndReportPayload, extraPayload: any) => {
        setIsLoading(true);
        const result = await getInvRMonthEndReport(data);
        if (result.success && result.data) {
            setReportData(result.data);
            setCurrentPayload({ ...data, ...extraPayload }); // Merge with extra info like Year/Month names
            setShowReport(true);
        } else {
            setReportData(null);
            setShowReport(false);
            toast.error(result.message || "No records found");
        }
        setIsLoading(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const getTableData = (): IInvRMonthEndReportTableRow[] => {
        if (!reportData) return [];
        return [
            {
                id: 1,
                inventory: 'GRN',
                count: reportData.grnCount,
                sms: reportData.sms,
                email: reportData.email
            },
            {
                id: 2,
                inventory: 'SALES',
                count: reportData.salesCount,
                sms: reportData.sms,
                email: reportData.email
            },
            {
                id: 3,
                inventory: 'ITEM CONSUMPTION',
                count: reportData.itemCount,
                sms: reportData.sms,
                email: reportData.email
            }
        ];
    };

    const tableData = getTableData();

    const handleExport = () => {
        if (!reportData) return;
        const dataToExport = tableData.map(row => ({
            "SL.NO": row.id,
            "INVENTORY": row.inventory,
            "COUNT": row.count,
            "SMS": row.sms,
            "EMAIL": row.email
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Month End Report");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
        saveAs(data, "Inventory_Month_End_Report.xlsx");
    };

    const chartData = reportData ? [
        { name: 'GRN COUNT', count: reportData.grnCount },
        { name: 'SALES COUNT', count: reportData.salesCount },
        { name: 'ITEM CONS.', count: reportData.itemCount },
        { name: 'SMS COUNT', count: reportData.sms },
        { name: 'EMAIL COUNT', count: reportData.email },
    ] : [];

    return (
        <div className="space-y-6">
            <div className="print:hidden">
                <Heading
                    title="Inventory Month End Report"
                    description="Generate Inventory Month End Report"
                />
            </div>

            <div className="print:hidden">
                <ReportForm onReportGenerated={handleReportGenerated} isLoading={isLoading} />
            </div>

            {showReport && reportData && currentPayload && (
                <CollapsibleSection title="Report Result" defaultOpen={true}>
                    <div className="p-6 space-y-8 bg-white text-slate-900 rounded-lg shadow-sm border border-slate-200" id="printable-area">
                        {/* Header Section */}
                        <div className="flex flex-col items-center justify-center space-y-3 mb-8 border-b border-slate-200 pb-6">
                            <h3 className="text-3xl font-bold uppercase tracking-tight text-slate-800 text-center">
                                Inventory Month End Report
                            </h3>
                            <div className="w-24 h-1 bg-primary rounded-full"></div>
                            <p className="text-lg font-medium text-slate-600 uppercase tracking-wide">
                                {currentPayload.Month_Name} - {currentPayload.ASMAY_Year}
                            </p>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h4 className="flex items-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                                    User Details
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Name</span>
                                        <span className="font-medium text-slate-900">{currentPayload.IE_Name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Designation</span>
                                        <span className="font-medium text-slate-900">Implementation Engineer</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Module</span>
                                        <span className="font-medium text-slate-900">Inventory</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h4 className="flex items-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                                    Report Details
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Academic Year</span>
                                        <span className="font-medium text-slate-900">{currentPayload.ASMAY_Year}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Report Month</span>
                                        <span className="font-medium text-slate-900">{currentPayload.Month_Name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Generated Date</span>
                                        <span className="font-medium text-slate-900">{format(new Date(), 'dd/MM/yyyy')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                                <h4 className="font-semibold text-slate-800">Detailed Statistics</h4>
                            </div>
                            <div className="p-0">
                                <GenericDataTable
                                    data={tableData}
                                    columns={columns}
                                    isLoading={isLoading}
                                    totalItems={tableData.length}
                                    isSearchRequired={false}
                                    isPaginationRequired={false}
                                />
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm print:hidden">
                            <h4 className="font-semibold text-slate-800 mb-6 px-2">Graphical Representation</h4>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ fill: '#f1f5f9' }}
                                        />
                                        <Bar
                                            dataKey="count"
                                            fill="#3b82f6"
                                            name="Count"
                                            radius={[4, 4, 0, 0]}
                                            barSize={60}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Signature Section */}
                        <div className="grid grid-cols-2 gap-20 mt-20 pt-8 px-8 break-inside-avoid">
                            <div className="space-y-12 text-center">
                                <div className="h-16"></div> {/* Space for signature */}
                                <div className="border-t-2 border-slate-300 pt-2 font-semibold text-slate-700">Implementation Engineer</div>
                            </div>
                            <div className="space-y-12 text-center">
                                <div className="h-16"></div> {/* Space for signature */}
                                <div className="border-t-2 border-slate-300 pt-2 font-semibold text-slate-700">Nodal Officer & Seal</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4 mt-8 print:hidden pt-8 border-t border-slate-100">
                            <Button onClick={handlePrint} className="bg-slate-800 hover:bg-slate-900 text-white min-w-[120px]">
                                <Printer className="mr-2 h-4 w-4" /> Print
                            </Button>
                            <Button onClick={handleExport} variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 min-w-[120px]">
                                <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
                            </Button>
                        </div>
                    </div>
                </CollapsibleSection>
            )}
        </div>
    );
}

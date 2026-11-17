'use client';
import { Printer, FileSpreadsheet, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

import { ITopperListReportData } from '../types';
import { DataTable } from '@/components/ui/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';

interface ReportGridProps {
    data: ITopperListReportData[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const columns: ColumnDef<ITopperListReportData>[] = [
    {
        accessorKey: 'index',
        header: 'SL.No.',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'SPCCMH_HouseName',
        header: 'House Name',
        cell: ({ row }) => row.original.SPCCMH_HouseName || '-'
    },
    {
        accessorKey: 'SPCCESTR_Points',
        header: 'Points',
        cell: ({ row }) => row.original.SPCCESTR_Points ?? '-'
    },
    {
        accessorKey: 'SPCCESTR_Rank',
        header: 'Place',
        cell: ({ row }) => row.original.SPCCESTR_Rank ?? '-'
    },
    {
        accessorKey: 'AMST_Name',
        header: 'Student Name',
        cell: ({ row }) => row.original.AMST_Name || '-'
    },
    {
        accessorKey: 'AMST_AdmNo',
        header: 'Adm. No.',
        cell: ({ row }) => row.original.AMST_AdmNo || '-'
    },
    {
        accessorKey: 'ASMCL_ClassName',
        header: 'Class',
        cell: ({ row }) => row.original.ASMCL_ClassName || '-'
    },
    {
        accessorKey: 'ASMC_SectionName',
        header: 'Section',
        cell: ({ row }) => row.original.ASMC_SectionName || '-'
    },
    {
        accessorKey: 'SPCCME_EventName',
        header: 'Event',
        cell: ({ row }) => row.original.SPCCME_EventName || '-'
    },
    {
        accessorKey: 'SPCCMEV_EventVenue',
        header: 'Venue',
        cell: ({ row }) => row.original.SPCCMEV_EventVenue || '-'
    },
    {
        accessorKey: 'SPCCMSCC_SportsCCName',
        header: 'Sports',
        cell: ({ row }) => row.original.SPCCMSCC_SportsCCName || '-'
    },
    {
        accessorKey: 'SPCCE_StartDate',
        header: 'Event Date',
        cell: ({ row }) => {
            const date = new Date(row.original.SPCCE_StartDate);
            return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
    },
];

export default function ReportGrid({ data, searchQuery, onSearchChange }: ReportGridProps) {
    const filteredData = data.filter(item => {
        const query = searchQuery.toLowerCase();
        return (
            (item.SPCCMH_HouseName && item.SPCCMH_HouseName.toLowerCase().includes(query)) ||
            (item.AMST_Name && item.AMST_Name.toLowerCase().includes(query)) ||
            (item.AMST_AdmNo && item.AMST_AdmNo.toLowerCase().includes(query)) ||
            (item.ASMCL_ClassName && item.ASMCL_ClassName.toLowerCase().includes(query)) ||
            (item.SPCCME_EventName && item.SPCCME_EventName.toLowerCase().includes(query)) ||
            (item.SPCCMSCC_SportsCCName && item.SPCCMSCC_SportsCCName.toLowerCase().includes(query))
        );
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-muted-foreground mr-4">
                        Total Records: <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">{data.length}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.print()} className="hover:bg-primary/5 border-2">
                            <Printer className="h-4 w-4 mr-2 text-primary" />
                            Print
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                            const worksheet = XLSX.utils.json_to_sheet(data);
                            const workbook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
                            XLSX.writeFile(workbook, "SportTopperListReport.xlsx");
                        }} className="hover:bg-primary/5 border-2">
                            <FileSpreadsheet className="h-4 w-4 mr-2 text-success" />
                            Excel
                        </Button>
                    </div>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        className="pl-10 h-10 border-2"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border min-h-[400px]">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold uppercase underline text-primary">Sport Topper List Report</h1>
                </div>
                {filteredData.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        totalItems={filteredData.length}
                    />
                ) : (
                    <div className="py-20 text-center border-2 border-dashed rounded-xl bg-muted/30">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No records found</h3>
                        <p className="text-muted-foreground">Try adjusting your filters or search query to find what you're looking for.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

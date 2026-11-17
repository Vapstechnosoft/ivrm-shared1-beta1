'use client';
import { Printer, FileSpreadsheet, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

import { ISportHouseReportData } from '../types';
import { DataTable } from '@/components/ui/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';

interface ReportGridProps {
    data: ISportHouseReportData[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    manualPagination?: boolean;
}

const columns: ColumnDef<ISportHouseReportData>[] = [
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
        accessorKey: 'AMST_MobileNo',
        header: 'Contact No.',
        cell: ({ row }) => row.original.AMST_MobileNo || '-'
    },
    {
        accessorKey: 'AMST_emailId',
        header: 'Email',
        cell: ({ row }) => row.original.AMST_emailId || '-'
    },
];

export default function ReportGrid({ data, searchQuery, onSearchChange, manualPagination = true }: ReportGridProps) {
    const filteredData = data.filter(item => {
        const query = searchQuery.toLowerCase();
        return (
            (item.SPCCMH_HouseName && item.SPCCMH_HouseName.toLowerCase().includes(query)) ||
            (item.AMST_Name && item.AMST_Name.toLowerCase().includes(query)) ||
            (item.AMST_AdmNo && item.AMST_AdmNo.toLowerCase().includes(query)) ||
            (item.ASMCL_ClassName && item.ASMCL_ClassName.toLowerCase().includes(query)) ||
            (item.ASMC_SectionName && item.ASMC_SectionName.toLowerCase().includes(query))
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
                            XLSX.writeFile(workbook, "SportHouseReport.xlsx");
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
                    <h1 className="text-2xl font-bold uppercase underline text-primary">Sport House Report</h1>
                </div>
                {filteredData.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        totalItems={filteredData.length}
                        manualPagination={manualPagination}
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

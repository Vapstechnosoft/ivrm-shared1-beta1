'use client';
import { Printer, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

import { IStudentAgeReport } from '@/types/sports/reports/student-age-calculation';
import { DataTable } from '@/components/ui/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ReportGridProps {
    data: IStudentAgeReport[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    manualPagination?: boolean;
}

const columns: ColumnDef<IStudentAgeReport>[] = [
    {
        accessorKey: 'index',
        header: 'SL.No.',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'AMST_AdmNo',
        header: 'Adm. No.',
    },
    {
        header: 'Student Name',
        accessorKey: 'AMST_Name',
        cell: ({ row }) => row.original.AMST_Name || '-'
    },
    {
        accessorKey: 'ASMCL_ClassName',
        header: 'Class',
    },
    {
        accessorKey: 'ASMC_SectionName',
        header: 'Section',
    },
    {
        accessorKey: 'SPCCMH_HouseName',
        header: 'House Name',
        cell: ({ row }) => row.original.SPCCMH_HouseName || '-'
    },
    {
        accessorKey: 'AMST_DOB',
        header: 'DOB',
        cell: ({ row }) => {
            const date = new Date(row.original.AMST_DOB);
            return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
    },
    {
        accessorKey: 'Months',
        header: 'Age Months',
    },
    {
        accessorKey: 'Years',
        header: 'Years',
    },
    {
        accessorKey: 'Monthsd',
        header: 'Months',
    },
    {
        accessorKey: 'SPCCMCL_CompitionLevel',
        header: 'Competition Category',
        cell: ({ row }) => row.original.SPCCMCL_CompitionLevel || '-'
    },
];

export default function ReportGrid({ data, searchQuery, onSearchChange, manualPagination = true }: ReportGridProps) {
    const filteredData = data.filter(item => {
        const fullName = `${item.AMST_FirstName} ${item.AMST_MiddleName} ${item.AMST_LastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase()) ||
            item.AMST_AdmNo.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center gap-4">
                    <div className="text-sm font-medium">
                        Total Grid Records: <span className="bg-primary/10 text-primary px-2 py-1 rounded">{data.length}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.print()}>
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                            const worksheet = XLSX.utils.json_to_sheet(data);
                            const workbook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
                            XLSX.writeFile(workbook, "StudentAgeCalculationReport.xlsx");
                        }}>
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Excel
                        </Button>
                    </div>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search here..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="mb-4 text-center">
                    <h1 className="text-xl font-bold uppercase underline">Student Age Calculation Report</h1>
                </div>
                {filteredData.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        totalItems={filteredData.length}
                        manualPagination={manualPagination}
                    />
                ) : (
                    <div className="py-10 text-center border rounded-md bg-muted/20">
                        <p className="text-lg font-semibold text-muted-foreground">No records found</p>
                    </div>
                )}
            </div>
        </div>
    );
}

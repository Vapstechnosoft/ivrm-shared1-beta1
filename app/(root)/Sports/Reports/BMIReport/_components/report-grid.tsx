'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IBMIReport } from '@/types/sports/reports/bmi-report';
import { DataTable } from '@/components/ui/data-table/data-table';
import { Input } from '@/components/ui/input';

interface ReportGridProps {
    data: IBMIReport[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    manualPagination?: boolean;
}

export default function ReportGrid({ data, searchQuery, setSearchQuery, manualPagination = true }: ReportGridProps) {

    const columns: ColumnDef<IBMIReport>[] = [
        {
            header: 'SL. No.',
            cell: ({ row }) => row.index + 1,
        },
        // {
        //     accessorKey: 'spccmH_HouseName', // Not in current API interface provided in task description, check if needed
        //     header: 'House Name',
        // },
        {
            accessorKey: 'amsT_Name',
            header: 'Student Name',
        },
        {
            accessorKey: 'amsT_AdmNo',
            header: 'Adm. No.',
        },
        {
            accessorKey: 'asmcL_ClassName',
            header: 'Class',
        },
        {
            accessorKey: 'asmC_SectionName',
            header: 'Section',
        },
        {
            accessorKey: 'spccshW_HeighT',
            header: 'Height',
        },
        {
            accessorKey: 'spccshW_WeighT',
            header: 'Weight',
        },
        {
            accessorKey: 'spccshW_BMi',
            header: 'BMI',
        },
        {
            accessorKey: 'spccshW_BMiRemark',
            header: 'Remark',
        },
    ];

    const filteredData = data.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
            item.amsT_Name.toLowerCase().includes(query) ||
            item.amsT_AdmNo.toLowerCase().includes(query) ||
            item.asmcL_ClassName.toLowerCase().includes(query)
            // item.spccmH_HouseName.toLowerCase().includes(query)
        );
    });

    return (
        <div className="rounded-md border bg-card p-4 shadow-sm">
            <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex gap-4">
                    <div className="text-sm font-medium">
                        Total Grid Records: <span className="rounded bg-primary/10 px-2 py-1">{data.length}</span>
                    </div>
                    <div className="text-sm font-medium">
                        Filtered Records: <span className="rounded bg-primary/10 px-2 py-1">{filteredData.length}</span>
                    </div>
                </div>
                <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-xs"
                />
            </div>

            <div className="relative">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    totalItems={filteredData.length}
                    manualPagination={manualPagination}
                />
            </div>
        </div>
    );
}

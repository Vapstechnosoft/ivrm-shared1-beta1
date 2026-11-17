'use client';

import { IYearEndReport } from '@/types/sports/reports/year-end-report';
import { DataTable } from '@/components/ui/data-table/data-table';
import { Input } from '@/components/ui/input';
import { columns } from './columns';

interface ReportGridProps {
    data: IYearEndReport[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    manualPagination?: boolean;
}

export default function ReportGrid({ data, searchQuery, setSearchQuery, manualPagination = true }: ReportGridProps) {

    const filteredData = data.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
            item.studentName.toLowerCase().includes(query) ||
            item.admNo.toLowerCase().includes(query) ||
            item.className.toLowerCase().includes(query) ||
            item.houseName.toLowerCase().includes(query) ||
            item.spccmE_EventName.toLowerCase().includes(query)
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
                <div className="w-full sm:w-auto">
                    <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-xs"
                    />
                </div>
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

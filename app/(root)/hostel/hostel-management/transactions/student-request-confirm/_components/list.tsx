'use client';

import { DataTable } from '@/components/ui/data-table';
import { studentRequestConfirmColumns } from './columns';
import { GenericDataTable } from '@/components/ui/view-data-table/view-generic-data-table';

interface StudentRequestConfirmListProps {
    data: any[];
    onProcess: (data: any) => void;
}

export default function StudentRequestConfirmList({ data, onProcess }: StudentRequestConfirmListProps) {
    return (
        <GenericDataTable
            columns={studentRequestConfirmColumns(onProcess)}
            data={data}
            //searchKey="studentName"
            isLoading={false}
        />
    );
}

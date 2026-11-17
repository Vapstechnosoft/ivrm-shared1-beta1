'use client';

import { GenericDataTable } from '@/components/ui/view-data-table/view-generic-data-table';
import { staffApprovalListColumns } from './columns';

interface StaffApprovalListProps {
    data: any[];
    onProcess: (data: any) => void;
}

export default function StaffApprovalList({ data, onProcess }: StaffApprovalListProps) {
    return (
        <GenericDataTable
            columns={staffApprovalListColumns(onProcess)}
            data={data} isLoading={false}           // searchKey="empName"
        />
    );
}

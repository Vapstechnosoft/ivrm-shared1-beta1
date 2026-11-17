'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import { type IBifurcationConstraintList, columns } from './columns';

interface BifurcationConstraintsListProps {
    data: IBifurcationConstraintList[];
}

export const BifurcationConstraintsList = ({ data }: BifurcationConstraintsListProps) => {
    return <DataTable columns={columns} data={data} totalItems={data.length} />;
};

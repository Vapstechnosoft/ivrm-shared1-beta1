'use client';

import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useFormContext } from '@/components/ui/form/form-provider';
import { type IDayStaffList, columns } from './day-staff-columns';

interface DayStaffListProps {
    data: IDayStaffList[];
}

export default function DayStaffList({ data }: DayStaffListProps) {
    const { isDetailsViewOpen } = useFormContext();
    const tableProps = useDataTableProps({ data, columns });

    if (isDetailsViewOpen) return null;

    return (
        <CollapsibleSection
            defaultOpen={true}
            variant='default'
            size='lg'
            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
            title='Day Staff Constraints List'>
            <GenericDataTable<IDayStaffList>
                {...tableProps}
                columns={columns}
                isLoading={false}
                error={null}
                columnPinning={{ right: ['actions'] }}
                loadingMessage='Loading day staff constraints...'
                noDataTitle='No Day Staff Constraints Found'
                noDataDescription='Add a new day staff constraint to get started'
                errorTitle='Error Loading Day Staff Constraints'
            />
        </CollapsibleSection>
    );
}

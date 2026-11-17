'use client';

import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useFormContext } from '@/components/ui/form/form-provider';
import { type IPeriodStaffList, columns } from './period-staff-columns';

interface PeriodStaffListProps {
    data: IPeriodStaffList[];
}

export default function PeriodStaffList({ data }: PeriodStaffListProps) {
    const { isDetailsViewOpen } = useFormContext();
    const tableProps = useDataTableProps({ data, columns });

    if (isDetailsViewOpen) return null;

    return (
        <CollapsibleSection
            defaultOpen={true}
            variant='default'
            size='lg'
            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
            title='Period Staff Constraints List'>
            <GenericDataTable<IPeriodStaffList>
                {...tableProps}
                columns={columns}
                isLoading={false}
                error={null}
                columnPinning={{ right: ['actions'] }}
                loadingMessage='Loading period staff constraints...'
                noDataTitle='No Period Staff Constraints Found'
                noDataDescription='Add a new period staff constraint to get started'
                errorTitle='Error Loading Period Staff Constraints'
            />
        </CollapsibleSection>
    );
}

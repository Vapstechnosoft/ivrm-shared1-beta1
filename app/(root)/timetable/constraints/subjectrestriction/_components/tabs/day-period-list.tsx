'use client';

import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useFormContext } from '@/components/ui/form/form-provider';
import { type IDayPeriodList, columns } from './day-period-columns';

interface DayPeriodListProps {
    data: IDayPeriodList[];
}

export default function DayPeriodList({ data }: DayPeriodListProps) {
    const { isDetailsViewOpen } = useFormContext();
    const tableProps = useDataTableProps({ data, columns });

    if (isDetailsViewOpen) return null;

    return (
        <CollapsibleSection
            defaultOpen={true}
            variant='default'
            size='lg'
            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
            title='Day Period Constraints List'>
            <GenericDataTable<IDayPeriodList>
                {...tableProps}
                columns={columns}
                isLoading={false}
                error={null}
                columnPinning={{ right: ['actions'] }}
                loadingMessage='Loading day period constraints...'
                noDataTitle='No Day Period Constraints Found'
                noDataDescription='Add a new day period constraint to get started'
                errorTitle='Error Loading Day Period Constraints'
            />
        </CollapsibleSection>
    );
}

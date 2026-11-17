'use client';

import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useFormContext } from '@/components/ui/form/form-provider';
import { type IDaySubjectList, columns } from './day-subject-columns';

interface DaySubjectListProps {
    data: IDaySubjectList[];
}

export default function DaySubjectList({ data }: DaySubjectListProps) {
    const { isDetailsViewOpen } = useFormContext();
    const tableProps = useDataTableProps({ data, columns });

    if (isDetailsViewOpen) return null;

    return (
        <CollapsibleSection
            defaultOpen={true}
            variant='default'
            size='lg'
            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
            title='Day Subject Constraints List'>
            <GenericDataTable<IDaySubjectList>
                {...tableProps}
                columns={columns}
                isLoading={false}
                error={null}
                columnPinning={{ right: ['actions'] }}
                loadingMessage='Loading day subject constraints...'
                noDataTitle='No Day Subject Constraints Found'
                noDataDescription='Add a new day subject constraint to get started'
                errorTitle='Error Loading Day Subject Constraints'
            />
        </CollapsibleSection>
    );
}

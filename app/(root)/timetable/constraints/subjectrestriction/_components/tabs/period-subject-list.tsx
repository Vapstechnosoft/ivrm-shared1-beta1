'use client';

import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useFormContext } from '@/components/ui/form/form-provider';
import { type IPeriodSubjectList, columns } from './period-subject-columns';

interface PeriodSubjectListProps {
    data: IPeriodSubjectList[];
}

export default function PeriodSubjectList({ data }: PeriodSubjectListProps) {
    const { isDetailsViewOpen } = useFormContext();
    const tableProps = useDataTableProps({ data, columns });

    if (isDetailsViewOpen) return null;

    return (
        <CollapsibleSection
            defaultOpen={true}
            variant='default'
            size='lg'
            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
            title='Period Subject Constraints List'>
            <GenericDataTable<IPeriodSubjectList>
                {...tableProps}
                columns={columns}
                isLoading={false}
                error={null}
                columnPinning={{ right: ['actions'] }}
                loadingMessage='Loading period subject constraints...'
                noDataTitle='No Period Subject Constraints Found'
                noDataDescription='Add a new period subject constraint to get started'
                errorTitle='Error Loading Period Subject Constraints'
            />
        </CollapsibleSection>
    );
}

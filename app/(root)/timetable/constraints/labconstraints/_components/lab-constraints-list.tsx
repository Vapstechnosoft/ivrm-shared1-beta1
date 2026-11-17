'use client';

import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useFormContext } from '@/components/ui/form/form-provider';
import { type ILabConstraintList, columns } from './columns';

interface LabConstraintsListProps {
    data: ILabConstraintList[];
}

export default function LabConstraintsList({ data }: LabConstraintsListProps) {
    const { isDetailsViewOpen } = useFormContext();
    const tableProps = useDataTableProps({ data, columns });

    if (isDetailsViewOpen) return null;

    return (
        <CollapsibleSection
            defaultOpen={true}
            variant='default'
            size='lg'
            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
            title='Lab Constraints List' // Added title prop if supported, or wrapped in content? CollapsibleSection usually wraps content.
        >
            <GenericDataTable<ILabConstraintList>
                {...tableProps}
                columns={columns}
                isLoading={false} // Assuming data is passed in and loaded
                error={null}
                columnPinning={{ right: ['actions'] }}
                loadingMessage='Loading lab constraints...'
                noDataTitle='No Lab Constraints Found'
                noDataDescription='Add a new lab constraint to get started'
                errorTitle='Error Loading Lab Constraints'
            />
        </CollapsibleSection>
    );
}

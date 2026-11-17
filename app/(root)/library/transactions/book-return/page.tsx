'use client';

import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useBookReturnInitialData } from '@/hooks/library/useBookReturn';
import type { IBookReturnList } from '@/types/library/transactions/book-return';
import { BookReturnColumns } from './_components/columns';
//import { useState } from 'react';

export default function BookReturnTransactionPage() {
    // Initial load with defaults
    const { data, isLoading } = useBookReturnInitialData({
        booktype: 'issue',
        issuertype: 'std',
        bookcat_type: 'book'
    });

    return (
        <div className='space-y-4'>
            {/* <CollapsibleSection
                title='Book Return Transaction: Entry'
                defaultOpen={true}>
                <ReturnForm onSuccess={() => {
                    // List refreshes automatically via React Query
                }} />
            </CollapsibleSection> */}

            <CollapsibleSection title='Book Return Transaction: List' defaultOpen={true}>
                <GenericDataTable columns={BookReturnColumns} data={(data?.alldata || []) as IBookReturnList[]} isLoading={isLoading} />
            </CollapsibleSection>
        </div>
    );
}

'use client';

import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useBookIssueInitialData } from '@/hooks/library/useBookIssue';
import type { IBookReturnList } from '@/types/library/transactions/book-return';
import { useState } from 'react';
import { BookIssueColumns } from './_components/columns';

export default function LibBookTransactionPage() {
    const [view, setView] = useState<'entry' | 'list'>('entry');

    // Initial load with default params
    const { data, isLoading } = useBookIssueInitialData({
        booktype: 'issue',
        issuertype: 'std',
        bookcat_type: 'book'
    });

    return (
        <div className='space-y-4'>
            {/* <CollapsibleSection
                title='Lib Book Transaction: Entry'
                isOpen={view === 'entry'}
                onToggle={() => setView(view === 'entry' ? 'list' : 'entry')}
                defaultOpen={true}
            >
                <IssueForm onSuccess={() => setView('list')} />
            </CollapsibleSection> */}

            <CollapsibleSection
                title='Lib Book Transaction: List'
                isOpen={view === 'list'}
                onToggle={() => setView(view === 'list' ? 'entry' : 'list')}>
                <GenericDataTable
                    columns={BookIssueColumns}
                    data={(data?.alldata as IBookReturnList[]) || []}
                    isLoading={isLoading}
                    defaultVisibility={{
                        slNo: true,
                        memberName: true,
                        lmbanO_AccessionNo: true,
                        lmB_BookTitle: true,
                        issue_Date: true,
                        due_Date: true,
                        book_Trans_Status: true,
                        actions: true
                    }}
                />
            </CollapsibleSection>
        </div>
    );
}

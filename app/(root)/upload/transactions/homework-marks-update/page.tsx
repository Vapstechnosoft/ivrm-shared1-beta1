'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useHomeWork } from '@/hooks/upload/transactions/useHomeWork';
import type { IHomeWork } from '@/schemas/upload/transactions/ivrm-homework.schema';
import MarksEntryForm from './_components/marks-entry-form';
import SearchForm from './_components/search-form';

export default function HomeWorkMarksUpdatePage() {
    return (
        <Suspense fallback={<div className='flex h-full items-center justify-center'><Loader2 className='h-8 w-8 animate-spin' /></div>}>
            <FormProvider<IHomeWork>>
                <HomeWorkMarksUpdateContent />
            </FormProvider>
        </Suspense>
    );
}

function HomeWorkMarksUpdateContent() {
    const { data, isLoading, error } = useHomeWork();
    const { isDetailsViewOpen } = useFormContext<IHomeWork>();

    return (
        <div className='container min-h-screen space-y-4 p-1'>
            <CollapsibleSection
                title='HOMEWORK MARKS UPDATE'
                defaultOpen={true}
                variant='default'
                className='shadow-lg'>
                <SearchForm
                    yearList={data?.yearlist || []}
                    classList={data?.classlist || []}
                />
            </CollapsibleSection>

            {isDetailsViewOpen && (
                <CollapsibleSection
                    title='Marks Entry / Verification'
                    defaultOpen={true}
                    variant='outline'
                    className='slide-in-from-top-4 animate-in shadow-lg'>
                    <MarksEntryForm />
                </CollapsibleSection>
            )}
        </div>
    );
}

'use client';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import type { IClassWork } from '@/schemas/upload/transactions/ivrm-classwork.schema';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import MarksEntryForm from './_components/marks-entry-form';
import SearchForm from './_components/search-form';

export default function VerifyClassWorkPage() {
    return (
        <Suspense
            fallback={
                <div className='flex h-full items-center justify-center'>
                    <Loader2 className='h-8 w-8 animate-spin' />
                </div>
            }>
            <FormProvider<IClassWork>>
                <VerifyClassWorkContent />
            </FormProvider>
        </Suspense>
    );
}

function VerifyClassWorkContent() {
    // Reusing the same data fetching hook since it displays the same list of classworks
    // logic might diverge later, but for now this is a safe starting point
    const searchParams = useSearchParams();
    const params = {
        year: searchParams.get('year') || undefined,
        class: searchParams.get('class') || undefined,
        section: searchParams.get('section') || undefined,
        subject: searchParams.get('subject') || undefined
    };

    // const { data, isLoading, error, refetchAll } = useClassWork(params);
    const { openDetailsView, closeDetailsView } = useFormContext<IClassWork>();

    const hasSearchFilters = params.year && params.class && params.section && params.subject;

    useEffect(() => {
        // if (hasSearchFilters && data?.classwork && data.classwork.length > 0) {
        //     openDetailsView(data.classwork[0]);
        // } else {
        //     closeDetailsView();
        // }
    }, [hasSearchFilters, openDetailsView, closeDetailsView]);

    return (
        <div className='container min-h-screen space-y-4 p-1'>
            <CollapsibleSection title='CLASSWORK MARKS UPDATE' defaultOpen={true} variant='default' size='lg' className='shadow-lg'>
                <div className='space-y-4'>
                    <SearchForm yearList={[]} classList={[]} />
                </div>
            </CollapsibleSection>

            <VerifyDetailsSection />
        </div>
    );
}

function VerifyDetailsSection() {
    const { isDetailsViewOpen } = useFormContext();

    if (!isDetailsViewOpen) return null;

    return (
        <CollapsibleSection
            title='Marks Entry / Verification'
            defaultOpen={true}
            variant='outline'
            size='md'
            className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
            <MarksEntryForm />
        </CollapsibleSection>
    );
}

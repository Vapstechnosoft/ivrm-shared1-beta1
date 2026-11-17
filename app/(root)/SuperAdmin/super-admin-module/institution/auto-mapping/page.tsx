'use client';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import AddAutoMappingForm from './_components/add-form';

export default function AutoMappingPage() {
    return (
        <FormProvider>
            <AutoMappingPageContent />
        </FormProvider>
    );
}

function AutoMappingPageContent() {
    return (
        <div className='container space-y-4 p-1'>
            {/* Add Mapping Form Section (Primary Focus) */}
            <CollapsibleSection
                title='Auto Mapping'
                defaultOpen={true}
                variant='default'
                size='lg'
                className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
            >
                <AddAutoMappingForm />
            </CollapsibleSection>
        </div>
    );
}

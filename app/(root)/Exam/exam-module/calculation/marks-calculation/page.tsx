'use client';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import ExamMarksCalculationForm from './_components/add-form';

export default function ExamMarksCalculationPage() {
    return (
        <div className='container mx-auto p-6'>
            <CollapsibleSection title='Exam Marks Calculation' defaultOpen>
                <ExamMarksCalculationForm />
            </CollapsibleSection>
        </div>
    );
}

'use client';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import ExpirySettingsForm from './_components/expiry-settings-form';

export default function ExpirySettingsPage() {
    return (
        <CollapsibleSection
            title='Transport Expiry Settings'
            defaultOpen={true}
        >
            <ExpirySettingsForm />
        </CollapsibleSection>
    );
}

'use client';

import { GenericForm } from '@/components/ui/form/generic-form';
import { GenericInputField, GenericTextAreaField } from '@/components/ui/form/input-fields';
import { useMasterVenues } from '@/hooks/sports/useMasterVenues';
import { masterVenueSchema } from '@/schemas/sports/masters/venue';
import { saveMasterVenue } from '@/server/sports/masters/venue';
import type { IMasterEventVenue } from '@/types/sports/masters/venue';

interface UpdateMasterVenueFormProps {
    selectedRow: IMasterEventVenue;
    onSuccess?: () => void;
}

export default function UpdateMasterVenueForm({ selectedRow, onSuccess }: UpdateMasterVenueFormProps) {
    const { refetchAll } = useMasterVenues();
    return (
        <GenericForm<IMasterEventVenue, (typeof masterVenueSchema)['addOrUpdate']>
            schema={masterVenueSchema.addOrUpdate}
            initialValues={selectedRow}
            onSubmit={async (values) => {
                const response = await saveMasterVenue(values);
                if (response?.success || response?.returnval == true || response?.message === 'updated') {
                    refetchAll();
                } else {
                    throw new Error(response?.message || 'Failed to update Master Venue');
                }
            }}
            mode='edit'
            successMessage='Master Venue updated successfully'
            errorMessage='Failed to update Master Venue'
            onSuccess={onSuccess}
            className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <GenericInputField name='spccmeV_EventVenue' label='Event Venue' placeholder='Enter Event Venue' required />
                <GenericTextAreaField
                    name='spccmeV_EventVenueDesc'
                    label='Event Venue Description'
                    placeholder='Enter Event Venue Description'
                    required
                />
            </div>
        </GenericForm>
    );
}

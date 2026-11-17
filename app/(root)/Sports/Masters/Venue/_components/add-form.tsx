'use client';

import { GenericForm } from '@/components/ui/form/generic-form';
import { GenericInputField, GenericTextAreaField } from '@/components/ui/form/input-fields';
import { useMasterVenues } from '@/hooks/sports/useMasterVenues';
import { masterVenueSchema } from '@/schemas/sports/masters/venue';
import { saveMasterVenue } from '@/server/sports/masters/venue';
import type { IMasterEventVenue } from '@/types/sports/masters/venue';
import { toast } from 'sonner';

interface AddMasterVenueFormProps {
    onSuccess?: () => void;
}

export default function AddMasterVenueForm({ onSuccess }: AddMasterVenueFormProps) {
    const { refetchAll } = useMasterVenues();

    return (
        <GenericForm<IMasterEventVenue, (typeof masterVenueSchema)['addOrUpdate']>
            schema={masterVenueSchema.addOrUpdate}
            initialValues={{
                spccmeV_Id: 0,
                mI_Id: 2, // Assuming Institute ID
                spccmeV_EventVenue: '',
                spccmeV_EventVenueDesc: '',
                spccmeV_ActiveFlag: true
            }}
            onSubmit={async (values) => {
                const response = await saveMasterVenue(values);
                if (response?.success || response?.returnval == true || response?.message === 'saved') {
                    refetchAll();
                } else {
                    throw new Error(response?.message || 'Failed to save Master Venue');
                }
            }}
            mode='create'
            successMessage='Master Venue saved successfully'
            errorMessage='Failed to save Master Venue'
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

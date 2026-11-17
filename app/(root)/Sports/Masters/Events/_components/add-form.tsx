'use client';

import { GenericForm } from '@/components/ui/form/generic-form';
import { GenericInputField, GenericTextAreaField } from '@/components/ui/form/input-fields';
import { masterEventSchema } from '@/schemas/sports/masters/events';
import { saveMasterEvent } from '@/server/sports/masters/events';
import type { IMasterEvent } from '@/types/sports/masters/events';

interface AddMasterEventFormProps {
    onSuccess?: () => void;
}

export default function AddMasterEventForm({ onSuccess }: AddMasterEventFormProps) {
    return (
        <GenericForm<IMasterEvent, (typeof masterEventSchema)['addOrUpdate']>
            schema={masterEventSchema.addOrUpdate}
            initialValues={{
                spccmE_Id: 0,
                mI_Id: 2, // Assuming Institute ID
                spccmE_EventName: '',
                spccmE_EventNameDesc: '',
                spccmE_ActiveFlag: true
            }}
            onSubmit={async (values) => {
                await saveMasterEvent(values);
            }}
            mode='create'
            successMessage='Master Event added successfully'
            errorMessage='Failed to add Master Event'
            onSuccess={onSuccess}
            className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <GenericInputField name='spccmE_EventName' label='Event Name' placeholder='Enter Event Name' required />
                <GenericTextAreaField
                    name='spccmE_EventNameDesc'
                    label='Event Description'
                    placeholder='Enter Event Description'
                    required
                />
            </div>
        </GenericForm>
    );
}

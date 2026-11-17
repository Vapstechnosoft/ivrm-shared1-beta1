'use client';

import { GenericForm } from '@/components/ui/form/generic-form';
import { GenericInputField, GenericTextAreaField } from '@/components/ui/form/input-fields';
import { masterEventSchema } from '@/schemas/sports/masters/events';
import { saveMasterEvent } from '@/server/sports/masters/events';
import type { IMasterEvent } from '@/types/sports/masters/events';

interface UpdateMasterEventFormProps {
    selectedRow: IMasterEvent;
    onSuccess?: () => void;
}

export default function UpdateMasterEventForm({ selectedRow, onSuccess }: UpdateMasterEventFormProps) {
    return (
        <GenericForm<IMasterEvent, (typeof masterEventSchema)['addOrUpdate']>
            schema={masterEventSchema.addOrUpdate}
            initialValues={selectedRow}
            onSubmit={async (values) => {
                await saveMasterEvent(values);
            }}
            mode='edit'
            successMessage='Master Event updated successfully'
            errorMessage='Failed to update Master Event'
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

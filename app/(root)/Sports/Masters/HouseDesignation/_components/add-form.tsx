'use client';

import { GenericForm } from '@/components/ui/form/generic-form';
import { GenericInputField, GenericTextAreaField } from '@/components/ui/form/input-fields';
import { masterHouseDesignationSchema } from '@/schemas/sports/masters/house-designation';
import { saveMasterHouseDesignation } from '@/server/sports/masters/house-designation';
import type { IMasterHouseDesignation } from '@/types/sports/masters/house-designation';

interface AddMasterHouseDesignationFormProps {
    onSuccess?: () => void;
}

export default function AddMasterHouseDesignationForm({ onSuccess }: AddMasterHouseDesignationFormProps) {
    return (
        <GenericForm<IMasterHouseDesignation, (typeof masterHouseDesignationSchema)['addOrUpdate']>
            schema={masterHouseDesignationSchema.addOrUpdate}
            initialValues={{
                spccmhD_Id: 0,
                mI_Id: 0,
                spccmhD_DesignationName: '',
                spccmhD_DesignationDescription: '',
                spccmhD_ActiveFlag: true
            }}
            onSubmit={async (values) => {
                await saveMasterHouseDesignation(values);
            }}
            mode='create'
            successMessage='Record Saved Successfully'
            errorMessage='Failed to Save'
            onSuccess={onSuccess}
            className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <GenericInputField name='spccmhD_DesignationName' label='Designation Name' placeholder='Enter Designation Name' required />
                <GenericTextAreaField
                    name='spccmhD_DesignationDescription'
                    label='Designation Description'
                    placeholder='Enter Designation Description'
                    required
                />
            </div>
        </GenericForm>
    );
}

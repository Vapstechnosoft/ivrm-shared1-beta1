'use client';

import { GenericForm } from '@/components/ui/form/generic-form';
import { GenericInputField, GenericTextAreaField } from '@/components/ui/form/input-fields';
import { masterHouseDesignationSchema } from '@/schemas/sports/masters/house-designation';
import { saveMasterHouseDesignation } from '@/server/sports/masters/house-designation';
import type { IMasterHouseDesignation } from '@/types/sports/masters/house-designation';

interface UpdateMasterHouseDesignationFormProps {
    selectedRow: IMasterHouseDesignation;
    onSuccess?: () => void;
}

export default function UpdateMasterHouseDesignationForm({ selectedRow, onSuccess }: UpdateMasterHouseDesignationFormProps) {
    return (
        <GenericForm<IMasterHouseDesignation, (typeof masterHouseDesignationSchema)['addOrUpdate']>
            schema={masterHouseDesignationSchema.addOrUpdate}
            initialValues={selectedRow}
            onSubmit={async (values) => {
                const payload = {
                    ...values,
                    spccmhD_Id: selectedRow.spccmhD_Id,
                    mI_Id: selectedRow.mI_Id
                };
                await saveMasterHouseDesignation(payload);
            }}
            mode='edit'
            successMessage='Record Updated Successfully'
            errorMessage='Failed to Update'
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

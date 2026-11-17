'use client';

import { GenericForm } from '@/components/ui/form/generic-form';
import { GenericInputField, GenericTextAreaField } from '@/components/ui/form/input-fields';
import { useMasterPrograms } from '@/hooks/sports/useMasterPrograms';
import { masterProgramSchema } from '@/schemas/sports/masters/program';
import { saveMasterProgram } from '@/server/sports/masters/program';
import type { IMasterProgram } from '@/types/sports/masters/program';
import { toast } from 'sonner';

interface UpdateMasterProgramFormProps {
    selectedRow: IMasterProgram;
    onSuccess?: () => void;
}

export default function UpdateMasterProgramForm({ selectedRow, onSuccess }: UpdateMasterProgramFormProps) {
    const { refetchAll } = useMasterPrograms();

    return (
        <GenericForm<IMasterProgram, (typeof masterProgramSchema)['addOrUpdate']>
            schema={masterProgramSchema.addOrUpdate}
            initialValues={selectedRow}
            onSubmit={async (values) => {
                try {
                    const response = await saveMasterProgram(values);
                    if (response?.success || response?.returnval == true) {
                        toast.success(response.message || 'Program updated successfully');
                        refetchAll();
                        onSuccess?.();
                    } else {
                        toast.error(response?.message || 'Failed to update program');
                    }
                } catch (error: any) {
                    toast.error(error.message || 'Something went wrong');
                }
            }}
            mode='edit'
            successMessage='Record Updated Successfully'
            errorMessage='Failed to update record'
            onSuccess={() => {
                refetchAll();
                onSuccess?.();
            }}
            className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <GenericInputField name='spccpM_Name' label='Program Name' placeholder='Enter Program Name' required />
                <GenericTextAreaField
                    name='spccpM_Description'
                    label='Program Description'
                    placeholder='Enter Program Description'
                    required
                />
            </div>
        </GenericForm>
    );
}

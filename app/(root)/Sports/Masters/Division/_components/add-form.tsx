'use client';

import { GenericForm } from '@/components/ui/form/generic-form';
import { GenericInputField, GenericTextAreaField } from '@/components/ui/form/input-fields';
import { masterDivisionSchema } from '@/schemas/sports/masters/division';
import { saveMasterDivision } from '@/server/sports/masters/division';
import { useMasterDivisions } from '@/hooks/sports/useMasterDivisions';
import type { IMasterDivision } from '@/types/sports/masters/division';
import { toast } from 'sonner';

interface AddMasterDivisionFormProps {
    selectedRow?: IMasterDivision;
    onSuccess?: () => void;
}

export default function AddMasterDivisionForm({
    selectedRow,
    onSuccess
}: AddMasterDivisionFormProps) {
    const { refetchAll } = useMasterDivisions();

    return (
        <GenericForm<IMasterDivision, (typeof masterDivisionSchema)['addOrUpdate']>
            schema={masterDivisionSchema.addOrUpdate}
            initialValues={{
                spccmD_Id: selectedRow?.spccmD_Id ?? 0,
                spccmD_DivisionName: selectedRow?.spccmD_DivisionName ?? '',
                spccmD_DivisionDescription: selectedRow?.spccmD_DivisionDescription ?? '',
                spccmD_ActiveFlag: selectedRow?.spccmD_ActiveFlag ?? true
            }}
            onSubmit={async (values) => {
                try {
                    const response = await saveMasterDivision(values);

                    if (response?.success || response?.returnval == true) {
                        toast.success(response.message || 'Division saved successfully');
                        refetchAll();
                        onSuccess?.();
                    } else {
                        toast.error(response?.message || 'Failed to save division');
                    }
                } catch (error: any) {
                    toast.error(error.message || 'Something went wrong');
                }
            }}
            mode={selectedRow ? 'edit' : 'create'}
            successMessage={`Division ${selectedRow ? 'updated' : 'added'} successfully`}
            errorMessage={`Failed to ${selectedRow ? 'update' : 'add'} division`}
            onSuccess={() => {
                refetchAll();
                onSuccess?.();
            }}
            className='space-y-4'
        >
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <GenericInputField
                    name='spccmD_DivisionName'
                    label='Division Name'
                    placeholder='Enter Division Name'
                    required
                />

                <GenericTextAreaField
                    name='spccmD_DivisionDescription'
                    label='Division Description'
                    placeholder='Enter Division Description'
                    required
                />
            </div>
        </GenericForm>
    );
}

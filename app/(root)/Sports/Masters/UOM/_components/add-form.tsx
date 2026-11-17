'use client';

import { GenericForm } from '@/components/ui/form/generic-form';
import { GenericInputField } from '@/components/ui/form/input-fields';
import { masterUOMSchema } from '@/schemas/sports/masters/uom';
import { saveMasterUOM } from '@/server/sports/masters/uom';
import { useMasterUOMs } from '@/hooks/sports/useMasterUOMs';
import type { IMasterUOM } from '@/types/sports/masters/uom';
import { toast } from 'sonner';

interface AddMasterUOMFormProps {
    selectedRow?: IMasterUOM;
    onSuccess?: () => void;
}

import { useFormContext } from 'react-hook-form';

function HiddenField({ name }: { name: string }) {
    const { register, watch } = useFormContext();
    const value = watch(name);
    return <input type="hidden" value={value || ''} {...register(name, { valueAsNumber: true })} />;
}

export default function AddMasterUOMForm({
    selectedRow,
    onSuccess
}: AddMasterUOMFormProps) {
    const { refetchAll } = useMasterUOMs();

    return (
        <GenericForm<IMasterUOM, (typeof masterUOMSchema)['addOrUpdate']>
            schema={masterUOMSchema.addOrUpdate}
            initialValues={{
                spccmuoM_Id: selectedRow?.spccmuoM_Id ?? (selectedRow as any)?.SPCCMUOM_Id ?? (selectedRow as any)?.spccmuom_Id ?? 0,
                spccmuoM_UOMName: selectedRow?.spccmuoM_UOMName ?? (selectedRow as any)?.SPCCMUOM_UOMName ?? (selectedRow as any)?.spccmuom_UOMName ?? '',
                spccmuoM_ActiveFlag: selectedRow?.spccmuoM_ActiveFlag ?? (selectedRow as any)?.SPCCMUOM_ActiveFlag ?? (selectedRow as any)?.spccmuom_ActiveFlag ?? true
            }}
            onSubmit={async (values) => {
                console.log('Form Submitted Values:', JSON.stringify(values, null, 2));
                try {
                    const response = await saveMasterUOM(values);

                    if (response?.success || response?.returnVal == true || response?.returnVal_update == true) {
                        toast.success((response.msg as string) || (response.message as string) || 'UOM saved successfully');
                        refetchAll();
                        onSuccess?.();
                    } else if (response?.duplicate_UOM_name_bool || response?.message === 'duplicate') {
                        toast.error('UOM Name Already Exists');
                    } else {
                        toast.error((response?.msg as string) || (response?.message as string) || 'Failed to save UOM');
                    }
                } catch (error: any) {
                    toast.error(error.message || 'Something went wrong');
                }
            }}
            mode={selectedRow ? 'edit' : 'create'}
            successMessage={`UOM ${selectedRow ? 'updated' : 'added'} successfully`}
            errorMessage={`Failed to ${selectedRow ? 'update' : 'add'} UOM`}
            onSuccess={() => {
                refetchAll();
                onSuccess?.();
            }}
            className='space-y-4'
        >
            <HiddenField name="spccmuoM_Id" />
            <div className='grid grid-cols-1 gap-4'>
                <GenericInputField
                    name='spccmuoM_UOMName'
                    label='UOM Name'
                    placeholder='Enter Unit of Measurement(UOM) Name...'
                    required
                />
            </div>
        </GenericForm>
    );
}

'use client';

import { GenericForm } from '@/components/ui/form/generic-form';
import { GenericInputField, GenericTextAreaField } from '@/components/ui/form/input-fields';
import { masterSponsorSchema } from '@/schemas/sports/masters/sponsors';
import { saveMasterSponsor } from '@/server/sports/masters/sponsors';
import { useMasterSponsors } from '@/hooks/sports/useMasterSponsors';
import type { IMasterSponsor } from '@/types/sports/masters/sponsors';
import { toast } from 'sonner';

interface AddMasterSponsorFormProps {
    selectedRow?: IMasterSponsor;
    onSuccess?: () => void;
}

export default function AddMasterSponsorForm({
    selectedRow,
    onSuccess
}: AddMasterSponsorFormProps) {
    const { refetchAll } = useMasterSponsors();

    return (
        <GenericForm<IMasterSponsor, (typeof masterSponsorSchema)['addOrUpdate']>
            schema={masterSponsorSchema.addOrUpdate}
            initialValues={{
                spccmsP_Id: selectedRow?.spccmsP_Id ?? 0,
                spccmsP_SponsorName: selectedRow?.spccmsP_SponsorName ?? '',
                spccmsP_ContactPerson: selectedRow?.spccmsP_ContactPerson ?? '',
                spccmsP_ContactNo: selectedRow?.spccmsP_ContactNo ?? '',
                spccmsP_SponsorDetails: selectedRow?.spccmsP_SponsorDetails ?? '',
                spccmsP_ActiveFlag: selectedRow?.spccmsP_ActiveFlag ?? true
            }}
            onSubmit={async (values) => {
                try {
                    const response = await saveMasterSponsor(values);

                    if (response?.success || response?.returnval == true) {
                        toast.success(response.message || 'Sponsor saved successfully');
                        refetchAll();
                        onSuccess?.();
                    } else {
                        toast.error(response?.message || 'Failed to save sponsor');
                    }
                } catch (error: any) {
                    toast.error(error.message || 'Something went wrong');
                }
            }}
            mode={selectedRow ? 'edit' : 'create'}
            successMessage={`Sponsor ${selectedRow ? 'updated' : 'added'} successfully`}
            errorMessage={`Failed to ${selectedRow ? 'update' : 'add'} sponsor`}
            onSuccess={() => {
                refetchAll();
                onSuccess?.();
            }}
            className='space-y-4'
        >
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <GenericInputField
                    name='spccmsP_SponsorName'
                    label='Sponsor Name'
                    placeholder='Enter Sponsor Name'
                    required
                />

                <GenericInputField
                    name='spccmsP_ContactPerson'
                    label='Contact Person'
                    placeholder='Enter Contact Person'
                    required
                />

                <GenericInputField
                    name='spccmsP_ContactNo'
                    label='Contact No.'
                    placeholder='Enter Contact No'
                    required

                />

                <GenericTextAreaField
                    name='spccmsP_SponsorDetails'
                    label='Sponsor Details'
                    placeholder='Enter Sponsor Details'
                    required
                />
            </div>
        </GenericForm>
    );
}

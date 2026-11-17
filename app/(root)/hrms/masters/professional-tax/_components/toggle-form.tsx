'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterProfessionalTax } from '@/hooks/hrms/useMasters';
import { toggleMasterProfessionalTax } from '@/server/hrms/hrmsConfig/master/professional-tax';
import type { IMasterProfessionalTaxList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const toggleSchema = z.object({
    hrmpT_Id: z.number()
});

type FormFields = z.infer<typeof toggleSchema>;

interface ToggleMasterProfessionalTaxFormProps {
    rowData: IMasterProfessionalTaxList;
    onClose: () => void;
}

export default function ToggleMasterProfessionalTaxForm({ rowData, onClose }: ToggleMasterProfessionalTaxFormProps) {
    const { refetchAll } = useMasterProfessionalTax();
    const isActive = rowData.hrmpT_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(toggleSchema),
        mode: 'onChange',
        defaultValues: {
            hrmpT_Id: rowData.hrmpT_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            const response = await toggleMasterProfessionalTax(Number(rowData.hrmpT_Id));

            if (response?.success) {
                toast.success(response?.message || `Professional Tax ${isActive ? 'deactivated' : 'activated'} successfully`);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} professional tax`);
            }
        } catch (error: any) {
            toast.error(error?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} professional tax`);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Professional Tax Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('hrmpT_Id', { valueAsNumber: true })} defaultValue={rowData.hrmpT_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} Professional Tax Slab (₹{rowData.hrmpT_SalaryFrom} -
                        ₹{rowData.hrmpT_SalaryTo})?
                    </p>
                    <FormError>{errors.hrmpT_Id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant={isActive ? 'destructive' : 'default'}>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}

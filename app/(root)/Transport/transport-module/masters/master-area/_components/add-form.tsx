'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterArea } from '@/hooks/transport/transportmodule/usemasters';
import { masterAreaSchema } from '@/schemas/transport/masters';
import { saveMasterArea } from '@/server/transport/transport-module/masters/area';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterAreaSchema.addOrUpdate>;

interface AddMasterAreaFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterAreaForm({ onSuccess, className = '' }: AddMasterAreaFormProps) {
    const { refetchAll } = useMasterArea();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterAreaSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            trmA_AreaName: '',
            trmA_AliasName: ''
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await saveMasterArea(data);

            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => reset();

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Zone / Area Name'
                            required
                            id='trmA_AreaName'
                            {...register('trmA_AreaName')}
                            error={errors.trmA_AreaName?.message}
                        />
                        <InputText
                            label='Alias Name'
                            required
                            id='trmA_AliasName'
                            {...register('trmA_AliasName')}
                            error={errors.trmA_AliasName?.message}
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-3 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}

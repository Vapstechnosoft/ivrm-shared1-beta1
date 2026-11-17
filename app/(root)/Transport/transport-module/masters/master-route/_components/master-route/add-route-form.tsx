'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterRoute } from '@/hooks/transport/transportmodule/usemasters';
import { masterRouteSchema } from '@/schemas/transport/masters';
import { saveMasterRoute } from '@/server/transport/transport-module/masters/route';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterRouteSchema.addOrUpdate>;

interface AddRouteFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddRouteForm({ onSuccess, className = '' }: AddRouteFormProps) {
    const { refetchAll } = useMasterRoute();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterRouteSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            trmR_RouteName: '',
            trmR_RouteDesc: '',
            trmR_RouteNo: '',
            trmR_order: '' as any
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {




        try {
            const response = await saveMasterRoute(data);

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
                            label='Route Name'
                            required
                            id='trmR_RouteName'
                            {...register('trmR_RouteName')}
                            error={errors.trmR_RouteName?.message}
                        />
                        <InputText
                            label='Route Description'
                            required
                            id='trmR_RouteDesc'
                            {...register('trmR_RouteDesc')}
                            error={errors.trmR_RouteDesc?.message}
                        />
                        <InputText
                            label='Route No'
                            required
                            id='trmR_RouteNo'
                            {...register('trmR_RouteNo')}
                            error={errors.trmR_RouteNo?.message}
                        />
                        <InputText
                            label='Route Order'
                            required
                            type='number'
                            id='trmR_order'
                            {...register('trmR_order')}
                            error={errors.trmR_order?.message}
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

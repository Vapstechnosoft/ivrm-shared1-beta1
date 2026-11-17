'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterRoute } from '@/hooks/transport/transportmodule/usemasters';
import { masterRouteSchema } from '@/schemas/transport/masters';
import { saveMasterRoute } from '@/server/transport/transport-module/masters/route';
import type { IMasterRoute } from '@/types/transport/transport-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterRouteSchema.addOrUpdate>;

interface UpdateRouteFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterRoute;
}

export default function UpdateRouteForm({ onSuccess, className = '', selectedRow: row }: UpdateRouteFormProps) {
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
            trmR_Id: 0,
            trmR_RouteName: '',
            trmR_RouteDesc: '',
            trmR_RouteNo: '',
            trmR_order: 0
        }
    });

    // ✅ Prefill data when editing
    useEffect(() => {
        if (row) {
            reset({
                trmR_Id: row.trmR_Id,
                trmR_RouteName: row.trmR_RouteName,
                trmR_RouteDesc: row.trmR_RouteDesc,
                trmR_RouteNo: row.trmR_RouteNo,
                trmR_order: row.trmR_order
            });
        }
    }, [row, reset]);

    // ✅ Submit handler
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await saveMasterRoute(data);

            if (response.success) {
                toast.success(response.message);
                reset(data);
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    // ✅ Reset form to selected row values
    const handleReset = () => {
        if (row) {
            reset({
                trmR_Id: row.trmR_Id,
                trmR_RouteName: row.trmR_RouteName,
                trmR_RouteDesc: row.trmR_RouteDesc,
                trmR_RouteNo: row.trmR_RouteNo,
                trmR_order: row.trmR_order
            });
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
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

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Updating...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Update
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}

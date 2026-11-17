'use client';

import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form/form-input';
import { IMasterMessCategoryForm, masterMessCategorySchema } from '@/schemas/hostel/master-mess-category.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useMasterMessCategory } from '@/hooks/hostel/useMasterMessCategory';
import { saveMessCategory } from '@/server/hostel/hostel-management/masters/mess-category';

interface AddMasterMessCategoryFormProps {
    onSuccess: () => void;
    initialData?: any;
}

export default function AddMasterMessCategoryForm({
    onSuccess,
    initialData
}: AddMasterMessCategoryFormProps) {
    const { refetch } = useMasterMessCategory();

    const methods = useForm<IMasterMessCategoryForm>({
        resolver: zodResolver(masterMessCategorySchema),
        defaultValues: {
            hlmmC_Name: '',
            ...initialData
        },
        mode: 'onChange'
    });

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { isSubmitting }
    } = methods;

    useEffect(() => {
        if (initialData) {
            setValue('hlmmC_Name', initialData.hlmmC_Name);
            if (initialData.hlmmC_Id) {
                setValue('hlmmC_Id', initialData.hlmmC_Id);
            }
        }
    }, [initialData, setValue]);

    const onSubmit = async (data: IMasterMessCategoryForm) => {
        try {
            const payload = {
                ...data,
                hlmmC_Id: initialData?.hlmmC_Id || 0
            };
            const result = await saveMessCategory(payload);
            if (result.success) {
                toast.success(result.message);
                refetch();
                onSuccess();
                if (!initialData) reset();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to save mess category');
        }
    };

    return (
        <div className='flex w-full flex-col gap-6'>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md' noValidate>
                    <div className='flex flex-col gap-4'>
                        <FormInput control={control} name="hlmmC_Name" label="Mess Category Name" required placeholder='Enter Category Name' />
                    </div>

                    <div className='flex justify-center gap-2'>
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? (initialData ? 'Updating...' : 'Saving...') : (initialData ? 'Update' : 'Save')}
                        </Button>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => {
                                reset();
                                onSuccess();
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}

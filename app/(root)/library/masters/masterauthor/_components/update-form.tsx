'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterLibrary } from '@/hooks/library/useMasters';
import { masterAuthorSchema } from '@/schemas/library/masters';
import { addOrUpdateMasterAuthor } from '@/server/library/masters/master_author';
import type { IMasterAuthorList } from '@/types/library/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterAuthorSchema.addOrUpdate>;

interface UpdateMasterAuthorFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterAuthorList;
}

export default function UpdateMasterAuthorForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterAuthorFormProps) {
    const { refetchAll } = useMasterLibrary();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterAuthorSchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                lmaU_Id: row.lmaU_Id,
                lmaU_AuthorFirstName: row.lmaU_AuthorFirstName,
                lmaU_AuthorMiddleName: row.lmaU_AuthorMiddleName,
                lmaU_AuthorLastName: row.lmaU_AuthorLastName,
                lmaU_MobileNo: row.lmaU_MobileNo,
                lmaU_Address: row.lmaU_Address,
                lmaU_EmailId: row.lmaU_EmailId,
                lmaU_PhoneNo: row.lmaU_PhoneNo,
                lmaU_ActiveFlg: row.lmaU_ActiveFlg
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const {
                lmaU_AuthorFirstName,
                lmaU_AuthorMiddleName,
                lmaU_AuthorLastName,
                lmaU_MobileNo,
                lmaU_Address,
                lmaU_EmailId,
                lmaU_PhoneNo,
                lmaU_ActiveFlg
            } = data;

            const payload = {
                mI_Id: 30,
                lmaU_Id: row.lmaU_Id,
                lmaU_AuthorFirstName,
                lmaU_AuthorMiddleName,
                lmaU_AuthorLastName,
                lmaU_MobileNo,
                lmaU_Address,
                lmaU_EmailId,
                lmaU_PhoneNo,
                lmaU_ActiveFlg
            };

            const response = await addOrUpdateMasterAuthor(payload);

            if (response.success) {
                toast.success(response.message || 'Master Author updated successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to update Master Author');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Something went wrong');
        }
    };

    const handleReset = () => reset();

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='FirstName'
                            {...register('lmaU_AuthorFirstName', {})}
                            error={errors.lmaU_AuthorFirstName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>

                    {/* Root Error */}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Action Buttons */}
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
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Update Master Author
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}

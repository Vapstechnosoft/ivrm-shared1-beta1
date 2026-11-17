'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { type MobileMasterPageFormData, mobileMasterPageSchema } from '@/schemas/super-admin/configuration-setting/mobilemasterpage';
import { saveMobileMasterPage } from '@/server/super-admin/configuration-setting/mobilemasterpage';
import type { IMobileMasterPage } from '@/types/super-admin/configuration-setting/mobilemasterpage';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface MobileMasterPageFormProps {
    selectedRow?: IMobileMasterPage | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export function MobileMasterPageForm({ selectedRow, onSuccess, onCancel }: MobileMasterPageFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<MobileMasterPageFormData>({
        resolver: zodResolver(mobileMasterPageSchema),
        defaultValues: {
            ivrmmaP_AppPageName: '',
            ivrmmaP_Displayname: '',
            ivrmmaP_AppPageDesc: '',
            ivrmmaP_AppPageURL: ''
        }
    });

    useEffect(() => {
        if (selectedRow) {
            reset({
                ivrmmaP_AppPageName: selectedRow.ivrmmaP_AppPageName,
                ivrmmaP_Displayname: selectedRow.ivrmmaP_Displayname,
                ivrmmaP_AppPageDesc: selectedRow.ivrmmaP_AppPageDesc || '',
                ivrmmaP_AppPageURL: selectedRow.ivrmmaP_AppPageURL || ''
            });
        } else {
            reset({
                ivrmmaP_AppPageName: '',
                ivrmmaP_Displayname: '',
                ivrmmaP_AppPageDesc: '',
                ivrmmaP_AppPageURL: ''
            });
        }
    }, [selectedRow, reset]);

    async function onSubmit(data: MobileMasterPageFormData) {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                ivrmmaP_Id: selectedRow?.ivrmmaP_Id || 0
            };

            const result = await saveMobileMasterPage(payload);

            if (result.success) {
                toast.success(result.message);
                reset();
                onSuccess();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('An error occurred while saving.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle className='font-bold text-[#7C3AED] text-xl'>
                    {selectedRow ? 'Edit Mobile App Master Page' : 'Add Mobile App Master Page'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label className='font-semibold text-sm'>
                                Page Name <span className='text-red-500'>*</span>
                            </Label>
                            <Input {...register('ivrmmaP_AppPageName')} placeholder='Enter page name' />
                            {errors.ivrmmaP_AppPageName?.message && <FormError>{errors.ivrmmaP_AppPageName.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <Label className='font-semibold text-sm'>
                                Page Displayname <span className='text-red-500'>*</span>
                            </Label>
                            <Input {...register('ivrmmaP_Displayname')} placeholder='Enter display name' />
                            {errors.ivrmmaP_Displayname?.message && <FormError>{errors.ivrmmaP_Displayname.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <Label className='font-semibold text-sm'>
                                Page Icon/Description <span className='text-red-500'>*</span>
                            </Label>
                            <Input {...register('ivrmmaP_AppPageDesc')} placeholder='Enter page icon path/description' />
                            {errors.ivrmmaP_AppPageDesc?.message && <FormError>{errors.ivrmmaP_AppPageDesc.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <Label className='font-semibold text-sm'>
                                Page Keyword/URL <span className='text-red-500'>*</span>
                            </Label>
                            <Input {...register('ivrmmaP_AppPageURL')} placeholder='Enter page keyword/URL' />
                            {errors.ivrmmaP_AppPageURL?.message && <FormError>{errors.ivrmmaP_AppPageURL.message}</FormError>}
                        </div>
                    </div>

                    <div className='flex justify-end gap-3 border-t pt-4'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={onCancel}
                            className='border-[#7C3AED] px-6 text-[#7C3AED] hover:bg-[#F3E8FF]'>
                            <X className='mr-2 h-4 w-4' />
                            Cancel
                        </Button>
                        <Button type='submit' disabled={isSubmitting} className='bg-[#7C3AED] px-6 text-white hover:bg-[#6D28D9]'>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className='mr-2 h-4 w-4' />
                                    {selectedRow ? 'Update' : 'Save'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

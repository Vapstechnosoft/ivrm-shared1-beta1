'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterCategory } from '@/hooks/admission/preadmission/useMasters';
import { cn } from '@/lib/utils';
import { masterCategorySchema } from '@/schemas/admission/preadmission/masters';
import { addOrUpdateMasterCategory } from '@/server/admission/preadmission/masters/category';
import { deleteDocument, uploadDocument } from '@/server/document_upload';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Eye, Save, Trash } from 'lucide-react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterCategorySchema.addOrUpdate>;

interface AddMasterCategoryFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterCategoryForm({ onSuccess, className = '' }: AddMasterCategoryFormProps) {
    const { refetchAll } = useMasterCategory();
    // Add these state declarations after the useForm hook
    const [uploadedLogo, setUploadedLogo] = useState<{
        document_Path: string;
        documentName: string;
        isUploading: boolean;
    } | null>(null);
    const [logoError, setLogoError] = useState<string>('');

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterCategorySchema.addOrUpdate),
        mode: 'onChange'
    });

    const handleLogoUpload = async (file: File) => {
        try {
            // Allowed file types
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                toast.error(' Only PNG, JPG, and JPEG formats are allowed');
                return;
            }

            // Restrict file size to 2MB
            if (file.size > 2 * 1024 * 1024) {
                toast.error('File size should not exceed 2MB');
                return;
            }

            setUploadedLogo({
                document_Path: '',
                documentName: file.name,
                isUploading: true
            });
            setLogoError('');

            const formData = new FormData();
            formData.append('file', file);
            formData.append('SubContainerName', 'logo_category');

            const response = await uploadDocument(formData);

            if (response.success && response.data) {
                setUploadedLogo({
                    document_Path: response.data as string,
                    documentName: file.name,
                    isUploading: false
                });
                toast.success('Logo uploaded successfully');
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Upload failed';
            setLogoError(errorMessage);
            setUploadedLogo(null);
            toast.error(`Failed to upload logo: ${errorMessage}`);
        }
    };

    const handleLogoDelete = async () => {
        if (!uploadedLogo) return;

        try {
            const response = await deleteDocument(uploadedLogo.document_Path);

            if (response.success) {
                setUploadedLogo(null);
                toast.success('Logo deleted successfully');
            } else {
                throw new Error(response.message || 'Delete failed');
            }
        } catch (_error: any) {
            toast.error('Failed to delete logo');
        }
    };

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { amC_Name, amC_Address, amC_Type } = data;
            const payload = {
                amC_Id: 0,
                amC_Name: amC_Name,
                amC_Address: amC_Address,
                amC_Type: amC_Type,
                amC_RegNoPrefix: '',
                amC_Logo: uploadedLogo?.documentName || '',
                amC_FilePath: uploadedLogo?.document_Path || '',
                amC_ActiveFlag: 1
            };

            const response = await addOrUpdateMasterCategory(payload);

            if (response.success) {
                toast.success(response.message);
                handleReset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        reset();
        setUploadedLogo(null);
        setLogoError('');
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-1'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Category Type' htmlFor='amC_Type'>
                                Category Type <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='amC_Type'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                        }}
                                        value={field.value?.toString() || ''}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select a Category' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem key={'School'} value={'School'}>
                                                School
                                            </SelectItem>
                                            <SelectItem key={'College'} value={'College'}>
                                                College
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.amC_Type && <FormError>{errors.amC_Type.message}</FormError>}
                        </div>
                        <InputText
                            label='Category Name'
                            required
                            id='amC_Name'
                            {...register('amC_Name')}
                            error={errors.amC_Name?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <InputTextarea
                            label='Category Address'
                            id='amC_Address'
                            {...register('amC_Address')}
                            error={errors.amC_Address?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                            minHeight={20}
                        />
                    </div>

                    {/* Logo Upload Section */}
                    <div className='w-fit'>
                        <Label htmlFor='category-logo'>Category Logo</Label>

                        {!uploadedLogo || uploadedLogo.isUploading ? (
                            <label
                                htmlFor='category-logo'
                                className={cn(
                                    'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition-all hover:border-primary hover:bg-gray-50',
                                    uploadedLogo?.isUploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-white'
                                )}>
                                {uploadedLogo?.isUploading ? (
                                    <div className='flex flex-col items-center gap-2'>
                                        <svg
                                            className='h-8 w-8 animate-spin text-blue-600'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'>
                                            <circle className='opacity-25' cx='12' cy='12' r='10' strokeWidth='4' stroke='currentColor' />
                                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z' />
                                        </svg>
                                        <span className='font-medium text-blue-600 text-sm'>Uploading...</span>
                                    </div>
                                ) : (
                                    <>
                                        <svg className='mb-2 h-8 w-8 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                                            />
                                        </svg>
                                        <span className='text-gray-600 text-sm'>Click to upload logo</span>
                                        <span className='text-gray-500 text-xs'>PNG, JPG (max 2MB)</span>
                                    </>
                                )}
                                <input
                                    id='category-logo'
                                    type='file'
                                    className='hidden'
                                    accept='.jpg,.jpeg,.png'
                                    disabled={uploadedLogo?.isUploading || isSubmitting}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleLogoUpload(file);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </label>
                        ) : (
                            <div className='flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4'>
                                <div className='flex items-center gap-3'>
                                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                                        <Check className='h-5 w-5 text-green-600' />
                                    </div>
                                    <div>
                                        <p className='font-medium text-green-900 text-sm'>{uploadedLogo.documentName}</p>
                                        <p className='text-green-700 text-xs'>Logo uploaded successfully</p>
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <Button
                                        type='button'
                                        size='sm'
                                        variant='outline'
                                        onClick={() => window.open(uploadedLogo.document_Path, '_blank')}>
                                        <Eye className='h-4 w-4' />
                                    </Button>
                                    <Button
                                        type='button'
                                        size='sm'
                                        variant='destructive'
                                        disabled={isSubmitting}
                                        onClick={handleLogoDelete}>
                                        <Trash className='h-4 w-4' />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {logoError && (
                            <p className='flex items-center gap-1 font-medium text-red-600 text-xs'>
                                <span>⚠</span> {logoError}
                            </p>
                        )}
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
                            Save Master Category
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}

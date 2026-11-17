'use client';

import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/dateField';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { saveAlumniGallery } from '@/server/alumni/alumni-gallery';
import { uploadDocument } from '@/server/document_upload';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Eye, Plus, Save, Trash2 } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type AlumniGallerySchema, alumniGallerySchema } from './schema';

interface AddAlumniGalleryFormProps {
    onSuccess?: () => void;
    mI_Id: number;
    asmaY_Id: number;
    className?: string;
}

export default function AddAlumniGalleryForm({ onSuccess, className = '' }: AddAlumniGalleryFormProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<AlumniGallerySchema>({
        resolver: zodResolver(alumniGallerySchema),
        mode: 'onChange',
        defaultValues: {
            ALGA_GalleryName: '',
            ALGA_Date: new Date(),
            mediatype: 'I',
            images_list: []
        }
    });

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'images_list'
    });

    const mediatype = watch('mediatype');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploading(true);
            const file = e.target.files[0];

            // Validation for size as per legacy (30MB for video)
            if (mediatype === 'V' && file.size > 31457280) {
                toast.error('Video size should be less than 30MB');
                setUploading(false);
                return;
            }

            const formData = new FormData();
            formData.append('File', file);
            formData.append('folder', 'Alumni_Gallery');

            try {
                const response = await uploadDocument(formData);
                const res: any = response;
                let path = '';

                if (Array.isArray(res) && res.length > 0) {
                    path = res[0].path || res[0];
                } else if (typeof res === 'string') {
                    path = res;
                } else if (res?.path) {
                    path = res.path;
                } else if (res?.data) {
                    // Check for nested data structure from ApiResponse
                    if (Array.isArray(res.data) && res.data.length > 0) {
                        path = res.data[0].path || res.data[0];
                    } else if (typeof res.data === 'string') {
                        path = res.data;
                    } else if (res.data?.path) {
                        path = res.data.path;
                    }
                }

                if (path) {
                    append({
                        filePath: path,
                        fileName: file.name
                    });
                    toast.success('File uploaded successfully');
                } else {
                    toast.error('File upload failed');
                }
            } catch (err: any) {
                // biome-ignore lint/style/useTemplate: <explanation>
                toast.error('File upload error: ' + err.message);
            } finally {
                setUploading(false);
                e.target.value = '';
            }
        }
    };

    const onSubmit = async (data: AlumniGallerySchema) => {
        try {
            const payload = {
                algA_Id: data.algA_Id,
                algA_GalleryName: data.ALGA_GalleryName,
                algA_Time: format(new Date(), 'HH:mm:ss'),
                algA_Date: data.ALGA_Date.toISOString(),
                algA_ActiveFlag: true,
                mediatype: data.mediatype,
                images_list: data.images_list.map((f) => ({
                    filePath: f.filePath,
                    fileName: f.fileName
                }))
            };

            const res = await saveAlumniGallery(payload);
            if (res) {
                toast.success('Gallery record saved successfully');
                reset();
                onSuccess?.();
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to save');
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <InputText label='Gallery Name' required {...register('ALGA_GalleryName')} error={errors.ALGA_GalleryName?.message} />

                    <Controller
                        control={control}
                        name='ALGA_Date'
                        render={({ field, fieldState }) => (
                            <DateField field={field} fieldState={fieldState} label='Date' placeholder='Select Date' />
                        )}
                    />

                    <div className='flex flex-col gap-2'>
                        <Label>
                            Media Type <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            name='mediatype'
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                    value={field.value}
                                    onValueChange={(val) => {
                                        field.onChange(val);
                                    }}
                                    className='flex gap-4'>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='I' id='media-i' />
                                        <Label htmlFor='media-i'>Images</Label>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='V' id='media-v' />
                                        <Label htmlFor='media-v'>Videos</Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                    </div>
                </div>

                <div className='rounded-lg border bg-muted/30 p-4'>
                    <div className='mb-4 flex items-center justify-between'>
                        <Label className='font-semibold text-base'>Uploaded Files</Label>
                        <div className='relative'>
                            <input
                                type='file'
                                className='hidden'
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept={mediatype === 'I' ? 'image/*' : 'video/mp4,video/x-ms-wmv'}
                            />
                            <Button type='button' variant='outline' disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                                <Plus className='mr-2 h-4 w-4' /> {uploading ? 'Uploading...' : 'Select File'}
                            </Button>
                        </div>
                    </div>

                    <div className='overflow-x-auto'>
                        <table className='w-full border-collapse text-sm'>
                            <thead>
                                <tr className='border-b bg-muted/50'>
                                    <th className='w-12 p-2 text-left font-medium text-muted-foreground'>SL NO</th>
                                    <th className='p-2 text-left font-medium text-muted-foreground'>File Name</th>
                                    <th className='w-24 p-2 text-center font-medium text-muted-foreground'>View</th>
                                    <th className='w-24 p-2 text-center font-medium text-muted-foreground'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className='p-4 text-center text-muted-foreground'>
                                            No files uploaded
                                        </td>
                                    </tr>
                                ) : (
                                    fields.map((field, index) => (
                                        <tr key={field.id} className='border-b transition-colors hover:bg-muted/30'>
                                            <td className='p-2 text-left'>{index + 1}</td>
                                            <td className='p-2 text-left font-medium'>{field.fileName}</td>
                                            <td className='p-2 text-center'>
                                                <a
                                                    href={field.filePath}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='inline-flex items-center justify-center rounded-full p-2 text-blue-500 transition-colors hover:bg-blue-50'>
                                                    <Eye className='h-4 w-4' />
                                                </a>
                                            </td>
                                            <td className='p-2 text-center'>
                                                <Button
                                                    type='button'
                                                    variant='ghost'
                                                    size='icon'
                                                    onClick={() => remove(index)}
                                                    className='text-destructive hover:bg-destructive/10'>
                                                    <Trash2 className='h-4 w-4' />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {errors.images_list && <FormError className='mt-2'>{errors.images_list.message}</FormError>}
                </div>

                <div className='flex justify-end gap-3'>
                    <Button type='button' variant='outline' onClick={() => reset()} disabled={isSubmitting}>
                        Clear
                    </Button>
                    <Button type='submit' disabled={isSubmitting || uploading} isLoading={isSubmitting}>
                        <Save className='mr-2 h-4 w-4' /> Upload
                    </Button>
                </div>
            </form>
        </div>
    );
}

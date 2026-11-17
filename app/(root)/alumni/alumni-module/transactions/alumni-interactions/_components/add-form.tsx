'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveAlumniInteraction, searchAlumniForInteraction } from '@/server/alumni/alumni-interactions';
import { uploadDocument } from '@/server/document_upload';
import type { IAlumniInteractionAlumni } from '@/types/alumni/alumni-interactions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, FileText, Loader2, Plus, Send, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type AlumniInteractionSchema, alumniInteractionSchema } from './schema';

interface AddInteractionFormProps {
    interactionType: 'Group' | 'Individual';
    roleFlg: string;
    onSuccess?: () => void;
    className?: string;
}

export default function AddInteractionForm({ interactionType, roleFlg, onSuccess, className = '' }: AddInteractionFormProps) {
    const [uploading, setUploading] = useState(false);
    const [loadingAlumni, setLoadingAlumni] = useState(false);
    const [alumniList, setAlumniList] = useState<IAlumniInteractionAlumni[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<AlumniInteractionSchema>({
        resolver: zodResolver(alumniInteractionSchema),
        mode: 'onChange',
        defaultValues: {
            alsminT_Subject: '',
            alsminT_Interaction: '',
            userflag: 'SameBatch',
            ALMST_Id1: '',
            alumni_list: [],
            images_paths: []
        }
    });

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = form;
    const userflag = watch('userflag');
    const images_paths = watch('images_paths') || [];

    useEffect(() => {
        const fetchAlumni = async () => {
            setLoadingAlumni(true);
            try {
                const res = await searchAlumniForInteraction({ userflag });
                if (res.success && res.data) {
                    setAlumniList(res.data.getdetails || []);
                }
            } catch (error) {
                toast.error('Failed to load alumni list');
            } finally {
                setLoadingAlumni(false);
            }
        };
        fetchAlumni();
    }, [userflag]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploading(true);
            const file = e.target.files[0];

            const formData = new FormData();
            formData.append('File', file);
            formData.append('folder', 'Alumni_Interaction');

            try {
                const res = await uploadDocument(formData);
                let path = '';

                if (res?.success && res.data) {
                    path = res.data;
                }

                if (path) {
                    const currentFiles = form.getValues('images_paths') || [];
                    setValue('images_paths', [...currentFiles, { path, name: file.name }]);
                    toast.success('File uploaded');
                }
            } catch (err: any) {
                toast.error('Upload failed: ' + err.message);
            } finally {
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }
    };

    const onSubmit = async (data: AlumniInteractionSchema) => {
        try {
            const payload: any = {
                alsminT_Id: 0,
                mI_Id: 0,
                ivrmrT_Id: 0,
                asmaY_Id: 0,
                roleflg: roleFlg,
                userflag: data.userflag,
                alsminT_ComposedByFlg: roleFlg,
                alsminT_GroupOrIndFlg: interactionType,
                alsminT_Subject: data.alsminT_Subject,
                alsminT_Interaction: data.alsminT_Interaction,
                images_paths: data.images_paths?.map((f) => f.path) || [],
                alsminT_DateTime: new Date().toISOString(),
                alsminT_ActiveFlag: true
            };

            if (interactionType === 'Group') {
                payload.arrayalumni = data.alumni_list?.map((id) => ({ almsT_Id: id })) || [];
                if (payload.arrayalumni.length === 0) {
                    toast.error('Select at least one alumnus');
                    return;
                }
            } else {
                payload.alstinT_ToId = Number(data.ALMST_Id1);
                if (!payload.alstinT_ToId) {
                    toast.error('Select an alumnus');
                    return;
                }
            }

            const res = await saveAlumniInteraction(payload);
            if (res.success) {
                toast.success('Message sent successfully');
                reset();
                onSuccess?.();
            } else {
                toast.error(res.message || 'Failed to send');
            }
        } catch (err: any) {
            toast.error(err.message || 'An error occurred while sending');
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-6'>
                    <div className='rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 p-4'>
                        <h3 className='mb-3 font-bold text-blue-800 text-lg'>Recipient Filter</h3>
                        <Controller
                            name='userflag'
                            control={control}
                            render={({ field }) => (
                                <RadioGroup value={field.value} onValueChange={field.onChange} className='flex flex-col gap-4 sm:flex-row'>
                                    <div className='flex items-center space-x-2 rounded-lg border bg-white p-3'>
                                        <RadioGroupItem value='SameBatch' id='same' />
                                        <Label htmlFor='same' className='cursor-pointer font-medium'>
                                            Same Batch Alumni
                                        </Label>
                                    </div>
                                    <div className='flex items-center space-x-2 rounded-lg border bg-white p-3'>
                                        <RadioGroupItem value='AllBatch' id='all' />
                                        <Label htmlFor='all' className='cursor-pointer font-medium'>
                                            All Batch Alumni
                                        </Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                    </div>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        {interactionType === 'Group' ? (
                            <div className='flex flex-col gap-2'>
                                <Label className='font-bold'>
                                    Select Alumni <span className='text-red-500'>*</span>
                                </Label>
                                <p className='mb-2 text-muted-foreground text-xs'>Select multiple alumni for group message</p>
                                <Controller
                                    name='alumni_list'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={alumniList.map((a) => ({ label: a.alumniname, value: String(a.ALMST_Id) }))}
                                            onValueChange={(vals) => field.onChange(vals.map((v) => Number(v)))}
                                            placeholder={loadingAlumni ? 'Loading alumni list...' : 'Search and select alumni'}
                                            maxCount={10}
                                            className='w-full'
                                        />
                                    )}
                                />
                                {errors.alumni_list && <FormError>{errors.alumni_list.message}</FormError>}
                            </div>
                        ) : (
                            <div className='flex flex-col gap-2'>
                                <Label className='font-bold'>
                                    Select Alumnus <span className='text-red-500'>*</span>
                                </Label>
                                <p className='mb-2 text-muted-foreground text-xs'>Select one alumnus for individual message</p>
                                <Controller
                                    name='ALMST_Id1'
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className='h-12'>
                                                <SelectValue placeholder={loadingAlumni ? 'Loading...' : 'Select Alumnus'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {alumniList.map((a) => (
                                                    <SelectItem key={a.ALMST_Id} value={String(a.ALMST_Id)}>
                                                        <div className='flex items-center gap-2'>
                                                            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-primary/10'>
                                                                <span className='font-bold text-primary text-xs'>
                                                                    {a.alumniname.charAt(0)}
                                                                </span>
                                                            </div>
                                                            {a.alumniname}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.ALMST_Id1 && <FormError>{errors.ALMST_Id1.message}</FormError>}
                            </div>
                        )}

                        <div className='flex flex-col gap-2'>
                            <Label className='font-bold'>
                                Subject <span className='text-red-500'>*</span>
                            </Label>
                            <p className='mb-2 text-muted-foreground text-xs'>Brief summary of your message</p>
                            <InputText
                                placeholder='Enter message subject'
                                required
                                {...register('alsminT_Subject')}
                                error={errors.alsminT_Subject?.message}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <Label className='font-bold'>
                            Message Content <span className='text-red-500'>*</span>
                        </Label>
                        <p className='mb-2 text-muted-foreground text-xs'>Write your detailed message here</p>
                        <textarea
                            placeholder='Type your message here... You can include links, dates, or any important information.'
                            className='flex min-h-[200px] w-full rounded-lg border border-input bg-transparent px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                            {...register('alsminT_Interaction')}
                        />
                        {errors.alsminT_Interaction && <FormError>{errors.alsminT_Interaction.message}</FormError>}
                    </div>

                    <div className='rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6'>
                        <div className='mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
                            <div>
                                <Label className='font-bold text-base text-green-800'>Attachments</Label>
                                <p className='mt-1 text-green-700 text-sm'>Add images, PDFs, or documents (optional)</p>
                            </div>
                            <input
                                type='file'
                                className='hidden'
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept='image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                            />
                            <Button
                                type='button'
                                variant='outline'
                                disabled={uploading}
                                size='lg'
                                onClick={() => fileInputRef.current?.click()}
                                className='border-green-300 bg-white text-green-700 hover:bg-green-50'>
                                {uploading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Plus className='mr-2 h-4 w-4' />}
                                Upload File
                            </Button>
                        </div>

                        {images_paths.length > 0 && (
                            <div className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6'>
                                {images_paths.map((file, index) => (
                                    <div
                                        key={index}
                                        className='group relative rounded-lg border border-green-200 bg-white p-3 shadow-sm transition-all hover:shadow-md'>
                                        <div className='mb-2 flex items-center justify-between'>
                                            <span className='max-w-[80%] truncate font-medium text-green-800 text-xs' title={file.name}>
                                                {file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name}
                                            </span>
                                            <button
                                                type='button'
                                                onClick={() => {
                                                    const updated = [...images_paths];
                                                    updated.splice(index, 1);
                                                    setValue('images_paths', updated);
                                                }}
                                                className='text-red-500 transition-transform hover:scale-110 hover:text-red-700'
                                                title='Remove file'>
                                                <X className='h-3 w-3' />
                                            </button>
                                        </div>
                                        <a href={file.path} target='_blank' rel='noopener noreferrer' className='block'>
                                            {file.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                <div className='h-24 w-full overflow-hidden rounded-md border'>
                                                    <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-green-100 to-blue-100'>
                                                        <Eye className='h-6 w-6 text-green-600' />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='flex h-24 w-full flex-col items-center justify-center rounded-md border border-green-300 border-dashed bg-gradient-to-br from-blue-50 to-purple-50'>
                                                    {file.name.endsWith('.pdf') ? (
                                                        <FileText className='h-8 w-8 text-red-500' />
                                                    ) : (
                                                        <FileText className='h-8 w-8 text-blue-500' />
                                                    )}
                                                    <span className='mt-2 font-medium text-[10px] text-green-700 uppercase'>
                                                        {file.name.split('.').pop()}
                                                    </span>
                                                </div>
                                            )}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                        {uploading && (
                            <div className='mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3'>
                                <p className='flex items-center gap-2 text-blue-700 text-sm'>
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                    Uploading document...
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex justify-end gap-3 border-t pt-6'>
                    <Button type='button' variant='outline' onClick={() => reset()} disabled={isSubmitting} size='lg'>
                        Clear Form
                    </Button>
                    <Button
                        type='submit'
                        size='lg'
                        disabled={isSubmitting || uploading}
                        isLoading={isSubmitting}
                        className='bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:from-blue-700 hover:to-purple-700'>
                        <Send className='mr-2 h-5 w-5' /> Send {interactionType} Message
                    </Button>
                </div>
            </form>
        </div>
    );
}

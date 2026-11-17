'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DateField } from '@/components/ui/dateField';
import { Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { saveAlumniNoticeBoard } from '@/server/alumni/alumni-notice-board';
import { uploadDocument } from '@/server/document_upload';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type AlumniNoticeBoardSchema, alumniNoticeBoardSchema } from './schema';

interface AddAlumniNoticeBoardFormProps {
    onSuccess?: () => void;
    mI_Id: number;
    asmaY_Id: number;
    className?: string;
}

export default function AddAlumniNoticeBoardForm({ onSuccess, mI_Id, className = '' }: AddAlumniNoticeBoardFormProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<AlumniNoticeBoardSchema>({
        resolver: zodResolver(alumniNoticeBoardSchema),
        mode: 'onChange',
        defaultValues: {
            alntB_Title: '',
            alntB_Description: '',
            intB_DispalyDisableFlg: false,
            attachment_Array: []
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
        name: 'attachment_Array'
    });

    const displayDateEnabled = watch('intB_DispalyDisableFlg');
    const startDate = watch('alntB_StartDate');
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const endDate = watch('alntB_EndDate');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploading(true);
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('File', file);
            formData.append('folder', 'Alumni_Notice'); // As per legacy

            try {
                const response = await uploadDocument(formData);
                const res: any = response;
                let path = '';

                console.info('Upload response:', res); // Debug log

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
                        alntbfL_FilePath: path,
                        alntbfL_FileName: file.name
                    });
                    toast.success('File uploaded successfully');
                } else {
                    console.error('File upload failed, response structure unknown:', res);
                    toast.error('File upload failed (no path returned)');
                }
            } catch (err: any) {
                // biome-ignore lint/style/useTemplate: <explanation>
                toast.error('File upload error: ' + err.message);
            } finally {
                setUploading(false);
                // Clear input
                e.target.value = '';
            }
        }
    };

    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const handleRemoveFile = async (index: number, filePath: string) => {
        remove(index);
    };

    const onSubmit = async (data: AlumniNoticeBoardSchema) => {
        console.info('Form submitting...', data); // Debug log
        try {
            const firstAttachment = data.attachment_Array && data.attachment_Array.length > 0 ? data.attachment_Array[0] : null;

            const payload: any = {
                alntB_Id: data.alntB_Id || 0,
                mI_Id: mI_Id,
                alntB_Title: data.alntB_Title,
                alntB_Description: data.alntB_Description || '',
                alntB_FilePath: firstAttachment?.alntbfL_FilePath || '',
                alntB_Attachment: firstAttachment?.alntbfL_FileName || '',
                alntB_DisplayDate: data.alntB_DisplayDate ? new Date(data.alntB_DisplayDate).toISOString() : new Date().toISOString(),
                alntB_StartDate: data.alntB_StartDate ? new Date(data.alntB_StartDate).toISOString() : new Date().toISOString(),
                alntB_EndDate: data.alntB_EndDate ? new Date(data.alntB_EndDate).toISOString() : new Date().toISOString(),
                alntB_ActiveFlag: true,
                alntB_CreatedDate: new Date().toISOString(),
                alntB_UpdatedDate: new Date().toISOString(),
                attachment_Array:
                    data.attachment_Array?.map((file) => ({
                        alntbfL_FileName: file.alntbfL_FileName,
                        alntbfL_FilePath: file.alntbfL_FilePath
                    })) || []
            };
            console.info('Payload:', payload); // Debug log

            const res = await saveAlumniNoticeBoard(payload);
            console.info('Save response:', res); // Debug log

            if (res) {
                toast.success('Notice saved successfully');
                reset();
                onSuccess?.();
            }
        } catch (err: any) {
            console.error('Submit error:', err); // Debug log
            toast.error(err.message || 'Failed to save');
        }
    };

    const onError = (errors: any) => {
        console.error('Form validation errors:', errors); // Debug log
        toast.error('Please check the form for errors');
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit, onError)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <InputText label='Notice Title' required {...register('alntB_Title')} error={errors.alntB_Title?.message} />

                    <div className='md:col-span-2'>
                        <InputTextarea label='Description' {...register('alntB_Description')} error={errors.alntB_Description?.message} />
                    </div>

                    <Controller
                        control={control}
                        name='alntB_StartDate'
                        render={({ field, fieldState }) => (
                            <DateField field={field} fieldState={fieldState} label='Start Date' placeholder='Select Start Date' />
                        )}
                    />

                    <Controller
                        control={control}
                        name='alntB_EndDate'
                        render={({ field, fieldState }) => (
                            <DateField
                                field={field}
                                fieldState={fieldState}
                                label='End Date'
                                placeholder='Select End Date'
                                fromDate={startDate}
                            />
                        )}
                    />

                    <div className='mt-8 flex items-center space-x-2'>
                        <Controller
                            control={control}
                            name='intB_DispalyDisableFlg'
                            render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} id='dispDate' />}
                        />
                        <Label htmlFor='dispDate'>Display Date</Label>
                    </div>

                    {displayDateEnabled && (
                        <Controller
                            control={control}
                            name='alntB_DisplayDate'
                            render={({ field, fieldState }) => (
                                <DateField field={field} fieldState={fieldState} label='Display Date' placeholder='Select Display Date' />
                            )}
                        />
                    )}
                </div>

                <div className='border-t pt-4'>
                    <Label className='mb-2 block'>Attachments</Label>
                    <div className='mb-4 flex items-center gap-4'>
                        <div className='relative'>
                            <input
                                type='file'
                                className='hidden'
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept='image/*,application/pdf,application/msword,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,video/*'
                            />
                            <Button
                                type='button'
                                variant='outline'
                                disabled={uploading}
                                onClick={() => {
                                    fileInputRef.current?.click();
                                }}>
                                <Plus className='mr-2 h-4 w-4' />
                                Upload File
                            </Button>
                        </div>
                        <span className='text-muted-foreground text-xs'>Accepts: jpg, png, doc, pdf, mp4...</span>
                    </div>

                    {fields.length > 0 && (
                        <div className='space-y-2 rounded-md border p-2'>
                            {fields.map((field, index) => (
                                <div key={field.id} className='flex items-center justify-between rounded bg-secondary/20 p-2'>
                                    <span className='max-w-[200px] truncate text-sm'>{field.alntbfL_FileName}</span>
                                    <div className='flex gap-2'>
                                        {/* View Link - simplistic */}
                                        <a
                                            href={field.alntbfL_FilePath}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-blue-500 hover:underline'>
                                            View
                                        </a>
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='icon'
                                            onClick={() => handleRemoveFile(index, field.alntbfL_FilePath)}>
                                            <Trash2 className='h-4 w-4 text-destructive' />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='flex gap-3'>
                    <Button type='submit' disabled={isSubmitting || uploading} isLoading={isSubmitting}>
                        <Save className='mr-2 h-4 w-4' /> Save
                    </Button>
                </div>
            </form>
        </div>
    );
}

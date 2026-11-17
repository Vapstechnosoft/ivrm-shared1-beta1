'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterFacility } from '@/hooks/hostel/useMasterFacility';
import { IMasterFacility, masterFacilitySchema } from '@/schemas/hostel/masters';
import { addOrUpdateMasterFacility } from '@/server/hostel/hostel-management/masters/facility';
import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCw, Save, X } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface UpdateMasterFacilityFormProps {
    selectedRow: IMasterFacility;
    onSuccess?: () => void;
    className?: string;
}

export default function UpdateMasterFacilityForm({ selectedRow, onSuccess, className = '' }: UpdateMasterFacilityFormProps) {
    const { refetchAll } = useMasterFacility();

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<IMasterFacility>({
        resolver: zodResolver(masterFacilitySchema),
        mode: 'onChange',
        defaultValues: selectedRow
    });

    // Watch the file name field
    const fileName = watch('hlmftY_FacilityFileName');

    useEffect(() => {
        if (selectedRow) {
            reset(selectedRow);
        }
    }, [selectedRow, reset]);

    const onSubmit: SubmitHandler<IMasterFacility> = async (data) => {
        try {
            const response = await addOrUpdateMasterFacility(data);

            if (response.success) {
                toast.success(response.message);
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    const handleReset = () => {
        reset(selectedRow);
        toast.info('Form reset to original values');
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setValue('hlmftY_FacilityFileName', file.name);
            // Create a mock URL for the file preview
            const fileUrl = URL.createObjectURL(file);
            setValue('hlmftY_FacilityFilePath', fileUrl);
            toast.success('File uploaded successfully');
        }
    };

    const handleClearFile = () => {
        setValue('hlmftY_FacilityFileName', null);
        setValue('hlmftY_FacilityFilePath', null);
        toast.info('File cleared');
    };

    return (
        <div className={`${className} items-center justify-center`}>
            <form onSubmit={handleSubmit(onSubmit)} className='items-center justify-center space-y-6'>
                <div className='space-y-4'>
                    {/* Facility Name */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Facility Name'
                            required
                            id='hlmftY_FacilityName'
                            {...register('hlmftY_FacilityName')}
                            error={errors.hlmftY_FacilityName?.message}
                            placeholder='Enter Facility Name'
                        />
                    </div>

                    {/* Facility Description */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='group flex flex-col gap-2'>
                            <Label htmlFor='hlmftY_FacilityDesc'>
                                Description <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <textarea
                                id='hlmftY_FacilityDesc'
                                {...register('hlmftY_FacilityDesc')}
                                className='min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                                placeholder='Enter Facility Description'
                            />
                            {errors.hlmftY_FacilityDesc && <FormError>{errors.hlmftY_FacilityDesc.message}</FormError>}
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='group flex flex-col gap-2'>
                            <Label htmlFor='file-upload'>Upload File</Label>
                            <div className='flex items-center gap-2'>
                                <input
                                    type='file'
                                    id='file-upload'
                                    onChange={handleFileUpload}
                                    className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                                />
                                {(fileName || selectedRow.hlmftY_FacilityFileName) && (
                                    <Button
                                        type='button'
                                        variant='ghost'
                                        size='icon'
                                        onClick={handleClearFile}
                                        className='text-destructive hover:text-destructive/90'>
                                        <X className='h-4 w-4' />
                                    </Button>
                                )}
                            </div>

                            {/* Show current or selected file */}
                            {(fileName || selectedRow.hlmftY_FacilityFileName) && (
                                <p className='text-xs text-muted-foreground mt-1'>
                                    {fileName ? `Selected: ${fileName}` : `Current file: ${selectedRow.hlmftY_FacilityFileName}`}
                                </p>
                            )}

                            {errors.hlmftY_FacilityFileName && <FormError>{errors.hlmftY_FacilityFileName.message}</FormError>}
                        </div>
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        <RefreshCw className='mr-2 h-4 w-4' />
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
                            Update Facility
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
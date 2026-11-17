'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSSubjectAbbreviation, useSubjectDropDown } from '@/hooks/timetable/useMasters';
import { subjectabbreviationsSchema } from '@/schemas/timetable/masters';
import { addOrUpdateSubjectAbbreviation } from '@/server/timetable/masters/subjectabbreviation';
import type { ISubjectAbbreviationList } from '@/types/timetable/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof subjectabbreviationsSchema.addOrUpdate>;

interface UpdateSubjectAbbreviationFormProps {
    onSuccess?: () => void;
    masterday?: string;
    selectedRow: ISubjectAbbreviationList;
}

export default function UpdateSubjectAbbreviationForm({ onSuccess, masterday = '', selectedRow: row }: UpdateSubjectAbbreviationFormProps) {
    const { refetchAll } = useSSubjectAbbreviation();
    const [isLoading, setIsLoading] = useState(true);

    const { data: subjectdata, isLoading: subjectisLoading, error: subjecterror, refetchAll: subjectrefetchAll } = useSubjectDropDown();

    const {
        setValue,
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(subjectabbreviationsSchema.addOrUpdate),
        mode: 'onChange'
    });

    // Set loading state based on subject data loading
    useEffect(() => {
        if (!subjectisLoading && subjectdata) {
            setIsLoading(false);
        }
    }, [subjectisLoading, subjectdata]);

    useEffect(() => {
        if (row && !subjectisLoading && subjectdata) {
            // Ensure the selected subject exists in the dropdown data
            const selectedSubject = subjectdata.data?.find((item) => item.ismS_Id === row.ismS_Id);

            if (selectedSubject) {
                reset({
                    ismS_Id: row.ismS_Id,
                    ttmsuaB_Abbreviation: row.ttmsuaB_Abbreviation
                });
            } else {
                // If subject not found in dropdown, show error
                toast.error('Selected subject not found in the list');
            }
        }
    }, [row, reset, setValue, subjectisLoading, subjectdata]);

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            const { ismS_Id, ttmsuaB_Abbreviation } = data;

            const payload = {
                ismS_Id: ismS_Id,
                ttmsuaB_Abbreviation: ttmsuaB_Abbreviation,
                ttmsuaB_Id: row.ttmsuaB_Id
            };

            const response = await addOrUpdateSubjectAbbreviation(payload);
            if (response.success) {
                toast.success(response.message);
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        }
    };

    const handleReset = () => {
        if (!subjectisLoading && subjectdata) {
            reset({
                ismS_Id: row.ismS_Id,
                ttmsuaB_Abbreviation: row.ttmsuaB_Abbreviation
            });
        }
    };

    // Show loading state while data is being fetched
    if (isLoading) {
        return (
            <div className={`${masterday} flex min-h-[200px] items-center justify-center`}>
                <div className='flex flex-col items-center gap-4'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary' />
                    <p className='text-muted-foreground'>Loading Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${masterday}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='space-y-4'>
                        {/* Row 1 */}
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <div className='w-full'>
                                <div className='group flex flex-col gap-1.5'>
                                    <Label aria-label='ismS_Id' htmlFor='ismS_Id'>
                                        Subject Name <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        name='ismS_Id'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                key={field.value || 'empty'}
                                                onValueChange={(value) => {
                                                    field.onChange(Number(value) || '');
                                                }}
                                                value={field.value?.toString() || undefined}
                                                disabled={subjectisLoading}>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue
                                                        placeholder={subjectisLoading ? 'Loading subjects...' : 'Select Subject'}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subjectisLoading ? (
                                                        <SelectItem value='loading' disabled>
                                                            <div className='flex items-center gap-2'>
                                                                <Loader2 className='h-4 w-4 animate-spin' />
                                                                Loading Subjects...
                                                            </div>
                                                        </SelectItem>
                                                    ) : subjecterror ? (
                                                        <SelectItem value='error' disabled>
                                                            Error loading Subjects
                                                        </SelectItem>
                                                    ) : (
                                                        subjectdata?.data?.map((item) => (
                                                            <SelectItem key={item.ismS_Id} value={item.ismS_Id.toString()}>
                                                                {item.ismS_SubjectName}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.ismS_Id && <FormError>{errors.ismS_Id.message}</FormError>}
                                </div>
                            </div>
                            <div className='w-full'>
                                <InputText
                                    label='Subject Abbreviation'
                                    required
                                    id='ttmsuaB_Abbreviation'
                                    {...register('ttmsuaB_Abbreviation')}
                                    error={errors.ttmsuaB_Abbreviation?.message}
                                    className='w-full transition-colors focus:ring-2 focus:ring-primary/20'
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {errors.root && <FormError className='text-center'>{errors.root.message}</FormError>}
                    </div>
                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting || isLoading}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting || isLoading}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
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

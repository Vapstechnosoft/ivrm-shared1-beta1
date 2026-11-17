'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSSubjectAbbreviation, useSubjectDropDown } from '@/hooks/timetable/useMasters';
import { subjectabbreviationsSchema } from '@/schemas/timetable/masters';
import { addOrUpdateSubjectAbbreviation } from '@/server/timetable/masters/subjectabbreviation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof subjectabbreviationsSchema.addOrUpdate>;

interface AddSubjectAbbreviationProps {
    onSuccess?: () => void;
    buildingname?: string;
}

export default function AddSubjectAbbreviationForm({ onSuccess, buildingname = '' }: AddSubjectAbbreviationProps) {
    const { refetchAll } = useSSubjectAbbreviation();

    const { data: subjectdata, isLoading: subjectisLoading, error: subjecterror, refetchAll: subjectrefetchAll } = useSubjectDropDown();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(subjectabbreviationsSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {}
    });

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { ismS_Id, ttmsuaB_Abbreviation } = data;
            const payload = {
                ismS_Id: ismS_Id,
                ttmsuaB_Abbreviation: ttmsuaB_Abbreviation
            };
            console.log(JSON.stringify(payload));
            const response = await addOrUpdateSubjectAbbreviation(payload);
            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                subjectrefetchAll();
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
    };

    return (
        <div className={`${buildingname}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='space-y-4'>
                        {/* Row 1 */}
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <div className='w-full'>
                                <div className='group flex flex-col gap-1.5'>
                                    <Label aria-label='Term' htmlFor='fmT_Id'>
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
                                                value={field.value?.toString() || undefined}>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select Subject' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subjectisLoading ? (
                                                        <SelectItem value='loading' disabled>
                                                            Loading Subjects...
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
                            Save Subject Abbreviation
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}

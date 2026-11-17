'use client';

import {
    type AlumniLettersSchema,
    alumniLettersSchema
} from '@/app/(root)/alumni/alumni-module/transactions/alumni-letters/_components/schema';
import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { IAcademicYear, IClassDetails } from '@/types/alumni/alumni-letters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Printer, X } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface FilterFormProps {
    years: IAcademicYear[];
    classes: IClassDetails[];
    onShowReport: (values: AlumniLettersSchema) => void;
    onClear: () => void;
    onPrint: (values: AlumniLettersSchema) => void;
    canPrint: boolean;
}

export default function FilterForm({ years, classes, onShowReport, onClear, onPrint, canPrint }: FilterFormProps) {
    const form = useForm<AlumniLettersSchema>({
        resolver: zodResolver(alumniLettersSchema),
        defaultValues: {
            reporttype: 'Alumni',
            letter_list: '',
            display_DateandTime: '',
            asmaY_Id: '',
            asmcL_Id: ''
        }
    });

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        trigger,
        getValues,
        formState: { errors }
    } = form;

    const asmcL_Id = watch('asmcL_Id');
    const asmaY_Id = watch('asmaY_Id');
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const reporttype = watch('reporttype');

    // Automatically trigger search when class changes
    useEffect(() => {
        if (asmcL_Id && asmaY_Id) {
            onShowReport(form.getValues());
        }
    }, [asmcL_Id, onShowReport]); // Trigger ONLY on class change

    const handleClear = () => {
        reset();
        onClear();
    };

    const handlePrintClick = async () => {
        const isValid = await trigger();
        if (isValid) {
            onPrint(getValues());
        }
    };

    return (
        <form onSubmit={handleSubmit(onShowReport)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='flex flex-col gap-4 rounded-xl border bg-muted/20 p-4'>
                    <Label className='font-bold'>
                        Select Type <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='reporttype'
                        control={control}
                        render={({ field }) => (
                            <RadioGroup value={field.value} onValueChange={field.onChange} className='flex gap-4'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Alumni' id='type-alumni' />
                                    <Label htmlFor='type-alumni' className='cursor-pointer'>
                                        Alumni Students
                                    </Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Regular' id='type-regular' />
                                    <Label htmlFor='type-regular' className='cursor-pointer'>
                                        Regular Students
                                    </Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <Label>
                        Academic Year <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='asmaY_Id'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder='--Select--' />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((y) => (
                                        <SelectItem key={y.asmaY_Id} value={String(y.asmaY_Id)}>
                                            {y.asmaY_Year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                </div>

                <div className='flex flex-col gap-2'>
                    <Label>
                        Class <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='asmcL_Id'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder='--Select--' />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((c) => (
                                        <SelectItem key={c.asmcL_Id} value={String(c.asmcL_Id)}>
                                            {c.asmcL_ClassName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.asmcL_Id && <FormError>{errors.asmcL_Id.message}</FormError>}
                </div>
                <div className='flex flex-col gap-2'>
                    <Label>
                        Letter Type <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='letter_list'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder='--Select--' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='OBA'>OBA Games Meet</SelectItem>
                                    <SelectItem value='ENR'>Enrolling As Member-10th</SelectItem>
                                    <SelectItem value='ENR3'>Enrolling As Member-PUC II</SelectItem>
                                    <SelectItem value='ADR'>Change of Address</SelectItem>
                                    <SelectItem value='PTRN'>Enrolling as Patron</SelectItem>
                                    <SelectItem value='LFMB'>Enrolling as Life Member</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.letter_list && <FormError>{errors.letter_list.message}</FormError>}
                </div>

                <div className='flex flex-col gap-2'>
                    <Label>Date and Time</Label>
                    <InputText placeholder='Enter Date and Time' {...register('display_DateandTime')} />
                </div>
            </div>

            <div className='flex flex-wrap items-center justify-center gap-4 border-t pt-4'>
                <Button type='button' variant='outline' onClick={handlePrintClick} disabled={!canPrint} className='min-w-[120px]'>
                    <Printer className='mr-2 h-4 w-4' /> Print Letters
                </Button>
                <Button type='button' variant='destructive' onClick={handleClear} className='min-w-[120px]'>
                    <X className='mr-2 h-4 w-4' /> Cancel
                </Button>
            </div>
        </form>
    );
}

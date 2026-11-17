'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { type AlumniSearchSchema, alumniSearchSchema } from './schema';

interface SearchFormProps {
    onSearch: (values: AlumniSearchSchema) => void;
    onClear: () => void;
    isLoading: boolean;
}

export default function SearchForm({ onSearch, onClear, isLoading }: SearchFormProps) {
    const form = useForm<AlumniSearchSchema>({
        resolver: zodResolver(alumniSearchSchema),
        defaultValues: {
            field: 'StudentName',
            operator: 'like',
            value: ''
        }
    });

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = form;

    const onSubmit = (data: AlumniSearchSchema) => {
        onSearch(data);
    };

    const handleClear = () => {
        reset();
        onClear();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='flex flex-col gap-2'>
                    <Label>
                        Field <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='field'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Field' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='StudentName'>Alumni Name</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.field && <FormError>{errors.field.message}</FormError>}
                </div>

                <div className='flex flex-col gap-2'>
                    <Label>
                        Operator <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='operator'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Operator' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='='>Equal to</SelectItem>
                                    <SelectItem value='!='>Not Equal to</SelectItem>
                                    <SelectItem value='like'>Like</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.operator && <FormError>{errors.operator.message}</FormError>}
                </div>

                <InputText label='Value' required placeholder='Enter value' {...register('value')} error={errors.value?.message} />
            </div>

            <div className='flex justify-center gap-3 border-t pt-4'>
                <Button type='submit' size='lg' disabled={isLoading} className='min-w-[150px]'>
                    {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Search className='mr-2 h-4 w-4' />}
                    Search
                </Button>
                <Button type='button' variant='outline' size='lg' onClick={handleClear} disabled={isLoading}>
                    <X className='mr-2 h-4 w-4' /> Clear
                </Button>
            </div>
        </form>
    );
}

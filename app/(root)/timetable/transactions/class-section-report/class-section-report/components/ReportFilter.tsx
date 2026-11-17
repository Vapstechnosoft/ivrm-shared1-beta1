'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RotateCcw, Search } from 'lucide-react';

import { Label } from '@/components/ui/extension/field';
import { useTimeTableAcademicYear, useTimeTableCategoryDropDownData, useTimeTableClassDropdownData } from '@/hooks/timetable/useMasters';

/* -------------------- SCHEMA -------------------- */
const schema = z.object({
    asmay_id: z.string().min(1, 'Academic Year is required'),
    ttmC_Id: z.string().min(1, 'Category is required'),
    asmcL_Id: z.string().min(1, 'Class is required')
});

type FormValues = z.infer<typeof schema>;

interface ReportFilterProps {
    onFetch: (data: FormValues | null) => void;
}

/* -------------------- COMPONENT -------------------- */
export default function ReportFilter({ onFetch }: ReportFilterProps) {
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            asmay_id: '',
            ttmC_Id: '',
            asmcL_Id: ''
        }
    });

    /* -------------------- MASTER DATA -------------------- */
    const { data: ayData, isLoading: ayLoading } = useTimeTableAcademicYear();
    const { data: catData, isLoading: catLoading } = useTimeTableCategoryDropDownData();
    const { data: classData, isLoading: classLoading } = useTimeTableClassDropdownData();

    const mastersLoading = ayLoading || catLoading || classLoading;

    /* -------------------- WATCH -------------------- */
    const isFormComplete = !!watch('asmay_id') && !!watch('ttmC_Id') && !!watch('asmcL_Id');

    /* -------------------- HANDLERS -------------------- */
    const onSubmit = (data: FormValues) => {
        onFetch(data); // send data to parent
    };

    const handleReset = () => {
        reset();
        onFetch(null); // 🔥 clears grid in parent
    };

    /* -------------------- UI -------------------- */
    return (
        <div className='mx-auto max-w-7xl space-y-4'>
            <CollapsibleSection title='Staff Replacement For Class And Section' defaultOpen>
                <div className='rounded-xl border border-purple-100 bg-white p-6 shadow-md'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
                            {/* Academic Year */}
                            <div className='space-y-1'>
                                <Label className='font-bold text-purple-900 text-xs uppercase'>
                                    Academic Year <span className='text-orange-500'>*</span>
                                </Label>
                                <Controller
                                    name='asmay_id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value || 'empty'}
                                            onValueChange={(value) => {
                                                field.onChange(value || '');
                                            }}
                                            value={field.value?.toString() || undefined}>
                                            <SelectTrigger className={`h-9 text-sm ${errors.asmay_id ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder={ayLoading ? 'Loading...' : 'Select Year'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ayData?.data?.map((y: any) => (
                                                    <SelectItem key={y.asmaY_Id} value={String(y.asmaY_Id)}>
                                                        {y.asmaY_Year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.asmay_id && <p className='font-medium text-[10px] text-red-500'>{errors.asmay_id.message}</p>}
                            </div>

                            {/* Category */}
                            <div className='space-y-1'>
                                <Label className='font-bold text-purple-900 text-xs uppercase'>
                                    Category <span className='text-orange-500'>*</span>
                                </Label>
                                <Controller
                                    name='ttmC_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value || 'empty'}
                                            onValueChange={(value) => {
                                                field.onChange(value || '');
                                            }}
                                            value={field.value?.toString() || undefined}>
                                            <SelectTrigger className={`h-9 text-sm ${errors.ttmC_Id ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder={catLoading ? 'Loading...' : 'Select Category'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {catData?.data?.map((c: any) => (
                                                    <SelectItem key={c.ttmC_Id} value={String(c.ttmC_Id)}>
                                                        {c.ttmC_CategoryName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.ttmC_Id && <p className='font-medium text-[10px] text-red-500'>{errors.ttmC_Id.message}</p>}
                            </div>

                            {/* Class */}
                            <div className='space-y-1'>
                                <Label className='font-bold text-purple-900 text-xs uppercase'>
                                    Class <span className='text-orange-500'>*</span>
                                </Label>
                                <Controller
                                    name='asmcL_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value || 'empty'}
                                            onValueChange={(value) => {
                                                field.onChange(value || '');
                                            }}
                                            value={field.value?.toString() || undefined}>
                                            <SelectTrigger className={`h-9 text-sm ${errors.asmcL_Id ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder={classLoading ? 'Loading...' : 'Select Class'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {classData?.data?.map((cls: any) => (
                                                    <SelectItem key={cls.asmcL_Id} value={String(cls.asmcL_Id)}>
                                                        {cls.asmcL_ClassName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.asmcL_Id && <p className='font-medium text-[10px] text-red-500'>{errors.asmcL_Id.message}</p>}
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className='mt-5 flex items-center gap-3 border-t pt-4'>
                            <Button
                                type='submit'
                                size='sm'
                                disabled={mastersLoading}
                                className='h-8 bg-orange-500 px-4 font-semibold text-xs hover:bg-orange-600'>
                                <Search className='mr-1.5 h-3.5 w-3.5' />
                                Report
                            </Button>

                            <Button type='button' variant='outline' size='sm' onClick={handleReset} disabled={mastersLoading}>
                                <RotateCcw className='mr-1.5 h-4 w-4' />
                                Reset
                            </Button>

                            {mastersLoading && <Loader2 className='h-4 w-4 animate-spin text-purple-500' />}
                        </div>
                    </form>
                </div>
            </CollapsibleSection>
        </div>
    );
}

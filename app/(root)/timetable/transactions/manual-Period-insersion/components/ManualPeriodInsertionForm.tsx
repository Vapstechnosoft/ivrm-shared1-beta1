'use client';
import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useManualPeriodMasters, useSectionsByClass } from '@/hooks/timetable/transaction/useManualPeriodInsertion';
import { ManualPeriodInsertionSchema, type ManualPeriodInsertionValues } from '@/schemas/timetable/transactions/manualPeriodInsertion';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, RotateCcw, Search } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

interface ManualPeriodInsertionFormProps {
    onFetch: (data: any) => void;
}

export default function ManualPeriodInsertionForm({ onFetch }: ManualPeriodInsertionFormProps) {
    const { data: masters, isLoading: mastersLoading } = useManualPeriodMasters();

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm<ManualPeriodInsertionValues>({
        resolver: zodResolver(ManualPeriodInsertionSchema),
        defaultValues: {
            asmaY_Id: '',
            ttmC_Id: '',
            asmcL_Id: '',
            asms_Id: ''
        }
    });

    const watchClass = watch('asmcL_Id');
    const { data: sections, isLoading: sectionsLoading } = useSectionsByClass(Number(watchClass));

    const onSubmit = (values: ManualPeriodInsertionValues) => {
        console.log('Fetching Report:', values);
        onFetch(values);
    };

    const handleReset = () => {
        reset();
        onFetch(null);
    };

    return (
        <CollapsibleSection
            title='Manual Period Insertion Selection'
            defaultOpen
            className='overflow-hidden rounded-2xl border-none shadow-xl'>
            <div className='bg-white p-8'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                        {/* Academic Year */}
                        <div className='space-y-2'>
                            <Label className='flex items-center gap-2 font-bold text-purple-900'>Academic Year</Label>
                            <Controller
                                control={control}
                                name='asmaY_Id'
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
                                        <SelectTrigger className='h-11 border-purple-100 transition-all hover:border-purple-200 focus:ring-purple-500'>
                                            <SelectValue placeholder='-- Select Year --' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masters?.years?.map((year) => (
                                                <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                                    {year.asmaY_Year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.asmaY_Id && <p className='text-red-500 text-xs'>{errors.asmaY_Id.message}</p>}
                        </div>

                        {/* Category */}
                        <div className='space-y-2'>
                            <Label className='flex items-center gap-2 font-bold text-purple-900'>Category</Label>
                            <Controller
                                control={control}
                                name='ttmC_Id'
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
                                        <SelectTrigger className='h-11 border-purple-100 transition-all hover:border-purple-200 focus:ring-purple-500'>
                                            <SelectValue placeholder='-- Select Category --' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masters?.categories?.map((cat) => (
                                                <SelectItem key={cat.ttmC_Id} value={cat.ttmC_Id.toString()}>
                                                    {cat.ttmC_CategoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.ttmC_Id && <p className='text-red-500 text-xs'>{errors.ttmC_Id.message}</p>}
                        </div>

                        {/* Class */}
                        <div className='space-y-2'>
                            <Label className='flex items-center gap-2 font-bold text-purple-900'>Class</Label>
                            <Controller
                                control={control}
                                name='asmcL_Id'
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
                                        <SelectTrigger className='h-11 border-purple-100 transition-all hover:border-purple-200 focus:ring-purple-500'>
                                            <SelectValue placeholder='-- Select Class --' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masters?.classes?.map((cls) => (
                                                <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>
                                                    {cls.asmcL_ClassName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.asmcL_Id && <p className='text-red-500 text-xs'>{errors.asmcL_Id.message}</p>}
                        </div>

                        {/* Section */}
                        <div className='space-y-2'>
                            <Label className='flex items-center gap-2 font-bold text-purple-900'>Section</Label>
                            <Controller
                                control={control}
                                name='asms_Id'
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
                                        <SelectTrigger className='h-11 border-purple-100 transition-all hover:border-purple-200 focus:ring-purple-500'>
                                            <SelectValue placeholder={sectionsLoading ? 'Loading...' : '-- Select Section --'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sections?.map((sec) => (
                                                <SelectItem key={sec.asms_Id} value={sec.asms_Id.toString()}>
                                                    {sec.asms_SectionName}
                                                </SelectItem>
                                            ))}
                                            {(!sections || sections.length === 0) && !sectionsLoading && (
                                                <SelectItem key='none' value='0' disabled>
                                                    No sections found
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    <div className='mt-5 flex gap-2 border-t pt-4'>
                        <Button
                            type='submit'
                            className='h-8 bg-orange-500 px-4 font-semibold text-xs hover:bg-orange-600 disabled:opacity-50'
                            disabled={mastersLoading}>
                            {mastersLoading ? <Loader2 className='mr-2 h-5 w-5 animate-spin' /> : <Search className='mr-2 h-5 w-5' />}
                            Report
                        </Button>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={handleReset}
                            className='h-8 border-purple-200 px-6 font-semibold text-purple-700 transition-all hover:bg-purple-50 hover:shadow-md active:scale-95'>
                            <RotateCcw className='mr-2 h-4 w-4' />
                            Reset
                        </Button>
                    </div>
                </form>
            </div>
        </CollapsibleSection>
    );
}

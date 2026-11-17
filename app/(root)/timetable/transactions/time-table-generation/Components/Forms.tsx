'use client';
import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTimeTableAcademicYear, useTimeTableCategoryDropDownData } from '@/hooks/timetable/useMasters';
import { type TimeTableGenerationValues, timeTableGenerationSchema } from '@/schemas/timetable/transactions/time-table-generation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileSpreadsheet, Play, RotateCcw } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

interface FormsProps {
    onGenerate: (data: TimeTableGenerationValues) => void;
    onReset: () => void;
}

export default function Forms({ onGenerate, onReset }: FormsProps) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<TimeTableGenerationValues>({
        resolver: zodResolver(timeTableGenerationSchema),
        defaultValues: {
            asmaY_Id: '',
            ttmC_Id: ''
        }
    });

    const { data: yearsData, isLoading: yearsLoading } = useTimeTableAcademicYear();
    const { data: categoriesData, isLoading: categoriesLoading } = useTimeTableCategoryDropDownData();

    const onSubmit = (data: TimeTableGenerationValues) => {
        onGenerate(data);
    };

    const handleReset = () => {
        reset();
        onReset();
    };

    return (
        <CollapsibleSection
            title='Time Table Generation'
            className='mx-auto max-w-7xl overflow-hidden rounded-xl border border-purple-100 bg-white shadow-md'
            defaultOpen>
            <div className='max-w mx-auto overflow-hidden rounded-xl border border-purple-100 bg-white shadow-md'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                        {/* Academic Year */}
                        <div className='space-y-2'>
                            <Label className='font-bold text-purple-900 text-xs uppercase'>
                                Academic Year <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='asmaY_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
                                        <SelectTrigger className={errors.asmaY_Id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder={yearsLoading ? 'Loading...' : '--Select--'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {yearsData?.data?.map((item: any) => (
                                                <SelectItem key={item.asmaY_Id} value={String(item.asmaY_Id)}>
                                                    {item.asmaY_Year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.asmaY_Id && <p className='font-medium text-[10px] text-red-500'>{errors.asmaY_Id.message}</p>}
                        </div>

                        {/* Category Name */}
                        <div className='space-y-2'>
                            <Label className='font-bold text-purple-900 text-xs uppercase'>
                                Category Name <span className='text-red-500'>*</span>
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
                                        <SelectTrigger className={errors.ttmC_Id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder={categoriesLoading ? 'Loading...' : '--Select--'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoriesData?.data?.map((item: any) => (
                                                <SelectItem key={item.ttmC_Id} value={String(item.ttmC_Id)}>
                                                    {item.ttmC_CategoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.ttmC_Id && <p className='font-medium text-[10px] text-red-500'>{errors.ttmC_Id.message}</p>}
                        </div>

                        {/* Read-only Statistics Fields - Row 1 */}
                        <div className='space-y-2'>
                            <Label className='font-bold text-purple-900 text-xs uppercase'>
                                Total No of periods <span className='text-red-500'>*</span>
                            </Label>
                            <Input value='0' readOnly className='bg-gray-50 font-semibold text-gray-500' />
                        </div>

                        <div className='space-y-2'>
                            <Label className='font-bold text-purple-900 text-xs uppercase'>
                                Total No of period allotted <span className='text-red-500'>*</span>
                            </Label>
                            <Input value='0' readOnly className='bg-gray-50 font-semibold text-gray-500' />
                        </div>

                        {/* Read-only Statistics Fields - Row 2 */}
                        <div className='space-y-2'>
                            <Label className='font-bold text-purple-900 text-xs uppercase'>
                                No of period not allotted <span className='text-red-500'>*</span>
                            </Label>
                            <Input value='0' readOnly className='bg-gray-50 font-semibold text-gray-500' />
                        </div>

                        <div className='space-y-2'>
                            <Label className='font-bold text-purple-900 text-xs uppercase'>
                                Not Confirmed Periods <span className='text-red-500'>*</span>
                            </Label>
                            <Input value='0' readOnly className='bg-gray-50 font-semibold text-gray-500' />
                        </div>

                        {/* Check Workload Button */}
                        <div className='flex items-end pb-1'>
                            <Button
                                type='button'
                                variant='outline'
                                className='w-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800'>
                                <FileSpreadsheet className='mr-2 h-4 w-4' />
                                Check Workload
                            </Button>
                        </div>
                    </div>

                    <div className='flex justify-center gap-4 border-purple-100 border-t pt-4'>
                        <Button type='button' variant='outline' onClick={handleReset} className='w-32'>
                            <RotateCcw className='mr-2 h-4 w-4' />
                            Cancel TT
                        </Button>
                        <Button type='submit' className='w-32 bg-orange-500 font-bold text-white hover:bg-orange-600'>
                            <Play className='mr-2 h-4 w-4' />
                            Generate TT
                        </Button>
                    </div>
                </form>
            </div>
        </CollapsibleSection>
    );
}

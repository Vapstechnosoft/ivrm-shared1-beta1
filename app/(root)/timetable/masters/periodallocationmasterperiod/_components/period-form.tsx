'use client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/extension/field';
import { InputNumber } from '@/components/ui/extension/input-number';
import { cn } from '@/lib/utils';
import { periodAllocationmasterPeriod } from '@/schemas/timetable/masters';
import { savePeriod } from '@/server/timetable/masters/periodallocation';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, Save, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof periodAllocationmasterPeriod.save>;

interface MasterPeriodFormProps {
    onSuccess?: () => void;
}

export default function MasterPeriodForm({ onSuccess }: MasterPeriodFormProps) {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(periodAllocationmasterPeriod.save),
        defaultValues: {
            noOfPeriods: 1
        }
    });

    const watchedNoOfPeriods = watch('noOfPeriods');

    interface PeriodItem {
        key: number;
        label: string;
    }

    const [periods, setPeriods] = useState<PeriodItem[]>([]);
    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);

    useEffect(() => {
        const count = Number(watchedNoOfPeriods);
        if (!Number.isNaN(count) && count > 0 && count <= 20) {
            const arr: PeriodItem[] = [];
            for (let i = 1; i <= count; i++) {
                arr.push({ key: i, label: `Period ${i}` });
            }
            setPeriods(arr);
            // Auto-select all periods
            const allKeys = arr.map((p) => p.key);
            setSelectedPeriods(allKeys);
        } else {
            setPeriods([]);
            setSelectedPeriods([]);
        }
    }, [watchedNoOfPeriods]);

    const handleReset = () => {
        reset();
    };

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const payload = {
                tempperiods: periods.map((p) => ({
                    // key: p.key,
                    TTMP_PeriodName: p.label
                }))
            };

            console.log('Payload to be sent:', JSON.stringify(payload));
            const response = await savePeriod(payload);
            if (response.success) {
                toast.success(response.message);
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        }
    };

    // Function to handle keyboard input prevention
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow only arrow keys, tab, and delete/backspace for clearing
        if (
            e.key !== 'ArrowUp' &&
            e.key !== 'ArrowDown' &&
            e.key !== 'Tab' &&
            e.key !== 'Delete' &&
            e.key !== 'Backspace' &&
            e.key !== 'Enter'
        ) {
            e.preventDefault();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 p-4'>
            {/* No of Period Section - Number Input (disabled typing) */}
            <div className='space-y-2'>
                <Label>
                    No of Period <span className='text-red-500'>*</span>
                </Label>
                <Controller
                    name='noOfPeriods'
                    control={control}
                    render={({ field }) => (
                        <InputNumber
                            {...field}
                            // Prevent manual typing
                            onKeyDown={handleKeyDown}
                            // Prevent paste
                            onPaste={(e) => e.preventDefault()}
                            onChange={(e) => {
                                const value = Number(e);
                                field.onChange(value);
                                if (value > 20) {
                                    toast.error('No of Period cannot exceed 20');
                                    setValue('noOfPeriods', 20);
                                } else if (value < 1) {
                                    setValue('noOfPeriods', 1);
                                }
                            }}
                            error={errors.noOfPeriods?.message}
                            className='w-full select-none'
                            // Optional: Add title/tooltip to indicate usage
                        />
                    )}
                />
            </div>

            {/* Period Section - Multi-select checkbox display (disabled) */}
            <div className='space-y-2'>
                <Label>Period :</Label>

                <div className='rounded-md border border-gray-300 bg-white p-3'>
                    {/* Select All (disabled) */}
                    {/* {periods.length > 0 && (
                        <div
                            className={cn(
                                'mb-2 flex cursor-not-allowed items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm opacity-50',
                                'border-gray-300 bg-gray-50'
                            )}>
                            <CheckSquare className='h-4 w-4 text-gray-400' />
                            <span>Select All</span>
                        </div>
                    )} */}

                    <div className='max-h-60 overflow-y-auto rounded-md border border-gray-300 p-1'>
                        {periods.length === 0 ? (
                            <div className='py-4 text-center text-gray-500 text-sm'>Enter No of Period to see periods</div>
                        ) : (
                            periods.map((p) => {
                                const selected = selectedPeriods.includes(p.key);

                                return (
                                    <div
                                        key={p.key}
                                        className={cn(
                                            'mb-1 flex cursor-not-allowed items-center gap-2 rounded-md border px-2 py-1.5 text-sm opacity-50',
                                            selected ? 'border-gray-400 bg-gray-100' : 'border-gray-300 bg-gray-50'
                                        )}>
                                        {selected ? (
                                            <CheckSquare className='h-4 w-4 text-gray-400' />
                                        ) : (
                                            <Square className='h-4 w-4 text-gray-400' />
                                        )}
                                        <span>{p.label}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Button */}
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
                        Save Master Period
                    </div>
                </Button>
            </div>
        </form>
    );
}

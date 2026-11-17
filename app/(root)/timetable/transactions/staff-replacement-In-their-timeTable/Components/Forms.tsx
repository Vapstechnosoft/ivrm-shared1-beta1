'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import type * as z from 'zod';

import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RotateCcw, Search } from 'lucide-react';

import { Label } from '@/components/ui/extension/field';
// Assuming you have a hook that fetches staff members
import { useStaffDropDown } from '@/hooks/timetable/useMasters';
import { staffReplacementInTheirTimeTableSchema } from '@/schemas/timetable/transactions/staff-replacement-In-their-timeTable';

type FormValues = z.infer<typeof staffReplacementInTheirTimeTableSchema>;

interface StaffReplacementGridProps {
    onFetch: (data: FormValues | null) => void;
}

/* -------------------- COMPONENT -------------------- */
export default function StaffReplacementGrid({ onFetch }: StaffReplacementGridProps) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(staffReplacementInTheirTimeTableSchema),
        defaultValues: {
            hrmE_Id: ''
        }
    });

    /* -------------------- MASTER DATA -------------------- */
    // Using the hook for staff data
    const { data: staffData, isLoading: staffLoading } = useStaffDropDown();

    /* -------------------- HANDLERS -------------------- */
    const onSubmit = (data: FormValues) => {
        onFetch(data);
    };

    const handleReset = () => {
        reset();
        // onFetch(null);
    };

    return (
        <div className='mx-auto max-w-7xl space-y-4'>
            <CollapsibleSection title='Staff Replacement In Their Time Table' defaultOpen>
                <div className='rounded-xl border border-purple-100 bg-white p-6 shadow-md'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
                            {/* Staff Dropdown */}
                            <div className='space-y-1'>
                                <Label className='font-bold text-purple-900 text-xs uppercase'>
                                    Select Staff <span className='text-orange-500'>*</span>
                                </Label>
                                <Controller
                                    name='hrmE_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            // onValueChange={field.onChange}
                                            //  value={field.value}
                                            key={field.value || 'empty'}
                                            onValueChange={(value) => {
                                                field.onChange(value || '');
                                            }}
                                            value={field.value?.toString() || undefined}>
                                            <SelectTrigger className={errors.hrmE_Id ? 'h-9 border-red-500' : 'h-9'}>
                                                <SelectValue placeholder={staffLoading ? 'Loading staff...' : '--Select--'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {staffData?.data?.map((staff: any) => (
                                                    <SelectItem key={staff.hrmE_Id} value={String(staff.hrmE_Id)}>
                                                        {staff.staffName || staff.hrmE_EmployeeFirstName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.hrmE_Id && <p className='font-medium text-[10px] text-red-500'>{errors.hrmE_Id.message}</p>}
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className='mt-5 flex items-center gap-3 border-t pt-4'>
                            <Button
                                type='submit'
                                size='sm'
                                disabled={staffLoading}
                                className='h-8 bg-orange-500 px-4 font-semibold text-xs hover:bg-orange-600'>
                                <Search className='mr-1.5 h-3.5 w-3.5' />
                                Report
                            </Button>

                            <Button type='button' variant='outline' size='sm' onClick={handleReset} disabled={staffLoading}>
                                <RotateCcw className='mr-1.5 h-4 w-4' />
                                Reset
                            </Button>

                            {staffLoading && <Loader2 className='h-4 w-4 animate-spin text-purple-500' />}
                        </div>
                    </form>
                </div>
            </CollapsibleSection>
        </div>
    );
}

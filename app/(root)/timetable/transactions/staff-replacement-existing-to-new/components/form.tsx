'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
    StaffRepacementExistingToNewSchema,
    type StaffReplacementExistingToNewValues
} from '@/schemas/timetable/transactions/staff-replacement-existing-to-new';

import {
    useSectionsByClass,
    useStaffReplacementExistingToNewMasters
} from '@/hooks/timetable/transaction/useStaff-replacement-existing-to-new';
import { getStaffReplacementExistingToNewMasters } from '@/server/timetable/transactions/staff-replacement-existing-to-new';

interface StaffReplacementFormProps {
    onFetch: (data: StaffReplacementExistingToNewValues | null) => void;
}

export default function StaffReplacementExistingToNewForm({ onFetch }: StaffReplacementFormProps) {
    const { data: masters } = useStaffReplacementExistingToNewMasters();
    const [saving, setSaving] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm<StaffReplacementExistingToNewValues>({
        resolver: zodResolver(StaffRepacementExistingToNewSchema),
        defaultValues: {
            ttmC_Id: undefined,
            asmcL_Id: undefined,
            asms_Id: undefined,
            hrmE_Id_From: undefined,
            hrmE_Id_To: undefined,
            ismS_Id: undefined
        }
    });

    const watchClass = watch('asmcL_Id');
    const { data: sections, isLoading: sectionsLoading } = useSectionsByClass(Number(watchClass || 0));

    const onSubmit = async (data: StaffReplacementExistingToNewValues) => {
        if (saving) return;
        setSaving(true);
        try {
            await getStaffReplacementExistingToNewMasters();
            toast.success('Details loaded');
            onFetch(data);
        } catch {
            toast.error('Unable to load details');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        reset();
    };

    const FormSelect = ({ label, name, control, options, valueKey, labelKey, placeholder, error, isLoading }: any) => (
        <div className='space-y-1.5'>
            <Label className='font-semibold text-purple-900 text-xs'>{label}</Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select key={field.value || 'empty'} value={field.value || undefined} onValueChange={(v) => field.onChange(v || '')}>
                        <SelectTrigger className='h-9 border-purple-100 text-sm'>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {isLoading ? (
                                <SelectItem value='loading' disabled>
                                    Loading...
                                </SelectItem>
                            ) : (
                                options?.map((o: any) => (
                                    <SelectItem key={o[valueKey]} value={o[valueKey].toString()}>
                                        {o[labelKey]}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                )}
            />
            {error && <p className='text-red-500 text-xs'>{error}</p>}
        </div>
    );

    return (
        <CollapsibleSection title='Staff Replacement Existing To New' defaultOpen className='font-bold text-purple-900 text-xl'>
            <div className='bg-white p-6'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Form Grid - 3 columns */}
                    <div className='grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3'>
                        <FormSelect
                            label='Category Name *'
                            name='ttmC_Id'
                            placeholder='-- Select Category --'
                            control={control}
                            options={masters?.categories}
                            valueKey='ttmC_Id'
                            labelKey='ttmC_CategoryName'
                            error={errors.ttmC_Id?.message}
                        />

                        <FormSelect
                            label='Subject'
                            name='ismS_Id'
                            placeholder='-- Select Subject --'
                            control={control}
                            options={masters?.subjects}
                            valueKey='ismS_Id'
                            labelKey='ismS_SubjectName'
                            error={errors.ismS_Id?.message}
                        />

                        <FormSelect
                            label='Class'
                            name='asmcL_Id'
                            placeholder='-- Select Class --'
                            control={control}
                            options={masters?.classes}
                            valueKey='asmcL_Id'
                            labelKey='asmcL_ClassName'
                            error={errors.asmcL_Id?.message}
                        />

                        <FormSelect
                            label='Section'
                            name='asmcL_Id'
                            placeholder='-- Select Section --'
                            control={control}
                            options={masters?.classes}
                            valueKey='asmcL_Id'
                            labelKey='asmcL_ClassName'
                            error={errors.asmcL_Id?.message}
                        />

                        <FormSelect
                            label='Replace Staff From *'
                            name='hrmE_Id_From'
                            placeholder='-- Replace Staff From --'
                            control={control}
                            options={masters?.staff}
                            valueKey='hrmE_Id'
                            labelKey='staffName'
                            error={errors.hrmE_Id_From?.message}
                        />

                        <FormSelect
                            label='Replace Staff To *'
                            name='hrmE_Id_To'
                            placeholder='-- Replace Staff To --'
                            control={control}
                            options={masters?.staff}
                            valueKey='hrmE_Id'
                            labelKey='staffName'
                            error={errors.hrmE_Id_To?.message}
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className='flex gap-3 border-t pt-4'>
                        <Button type='submit' className='h-9 bg-orange-500 px-6 font-semibold text-xs hover:bg-orange-600'>
                            <Search className='mr-2 h-4 w-4' />
                            Report
                        </Button>

                        <Button type='button' variant='outline' onClick={handleReset} className='h-9'>
                            <RotateCcw className='mr-2 h-4 w-4' />
                            Reset
                        </Button>
                    </div>
                </form>
            </div>
        </CollapsibleSection>
    );
}

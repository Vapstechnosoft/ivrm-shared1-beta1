'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { Form } from '@/components/ui/form';
import { saveSchoolMasterUnit } from '@/server/lesson-planner/master/school-master-unit';
import type { IMasterSchoolUnit } from '@/types/lesson-planner/master/school-master-unit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type ISchoolMasterUnitFormValues, SchoolMasterUnitSchema } from './schema';

interface AddMasterSchoolUnitFormProps {
    initialData?: IMasterSchoolUnit;
    onSuccess?: () => void;
    mI_Id?: number;
    userId?: number;
    className?: string;
}

export default function AddMasterSchoolUnitForm({ initialData, onSuccess, mI_Id, userId, className = '' }: AddMasterSchoolUnitFormProps) {
    const findValue = (obj: any, keys: string[]) => {
        if (!obj) return null;
        for (const key of keys) {
            if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
        }
        return null;
    };

    const form = useForm<ISchoolMasterUnitFormValues>({
        resolver: zodResolver(SchoolMasterUnitSchema),
        mode: 'onChange',
        defaultValues: {
            lpmU_Id: findValue(initialData, ['lpmU_Id', 'LPMU_Id', 'lpmU_ID', 'LPMU_ID']) || 0,
            lpmU_UnitName: findValue(initialData, ['lpmU_UnitName', 'LPMU_UnitName', 'lpmU_Unitname']) || '',
            lpmU_UnitDescription: findValue(initialData, ['lpmU_UnitDescription', 'LPMU_UnitDescription', 'lpmU_Unitdescription']) || '',
            lpmU_TotalHrs: findValue(initialData, ['lpmU_TotalHrs', 'LPMU_TotalHrs', 'lpmU_Totalhrs']) || null,
            lpmU_TotalPeriods: findValue(initialData, ['lpmU_TotalPeriods', 'LPMU_TotalPeriods', 'lpmU_Totalperiods']) || null
        }
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = form;

    const onSubmit = async (data: ISchoolMasterUnitFormValues) => {
        try {
            const payload = {
                lpmU_Id: data.lpmU_Id || 0,
                lpmU_UnitName: data.lpmU_UnitName,
                lpmU_UnitDescription: data.lpmU_UnitDescription,
                lpmU_TotalHrs:
                    data.lpmU_TotalHrs === undefined || data.lpmU_TotalHrs === null || data.lpmU_TotalHrs === ''
                        ? 0
                        : Number(data.lpmU_TotalHrs),
                lpmU_TotalPeriods:
                    data.lpmU_TotalPeriods === undefined || data.lpmU_TotalPeriods === null ? 0 : Number(data.lpmU_TotalPeriods)
            };

            const res: any = await saveSchoolMasterUnit(payload);
            const message = res?.message || res?.data?.message;
            const returnval = res?.returnval ?? res?.data?.returnval;
            const success = res?.success ?? res?.data?.success;

            if (message === 'Add' || message === 'Record Saved successfully') {
                toast.success('Record saved successfully');
                reset();
                onSuccess?.();
            } else if (message === 'Update') {
                toast.success('Record updated successfully');
                onSuccess?.();
            } else if (message === 'Duplicate') {
                toast.warning('Record already exists');
            } else if (success || returnval) {
                toast.success(initialData ? 'Record updated successfully' : 'Record saved successfully');
                if (!initialData) reset();
                onSuccess?.();
            } else {
                toast.error(message || 'Failed to save/update record');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to save');
        }
    };

    return (
        <div className={className}>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {/* Unit Name */}
                        <InputText label='Unit Name' required {...register('lpmU_UnitName')} error={errors.lpmU_UnitName?.message} />

                        {/* Unit Description */}
                        <InputText
                            label='Unit Description'
                            {...register('lpmU_UnitDescription')}
                            error={errors.lpmU_UnitDescription?.message}
                        />

                        {/* Total Periods */}
                        <InputText
                            label='Total No. Of Periods'
                            type='number'
                            {...register('lpmU_TotalPeriods')}
                            error={errors.lpmU_TotalPeriods?.message}
                        />

                        {/* Total Hours */}
                        <InputText
                            label='Total No. Of Hours'
                            {...register('lpmU_TotalHrs')}
                            placeholder='e.g. 10.50'
                            error={errors.lpmU_TotalHrs?.message}
                        />
                    </div>

                    <div className='flex justify-end gap-3'>
                        <Button type='button' variant='outline' onClick={() => reset()} disabled={isSubmitting}>
                            Clear
                        </Button>
                        <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting}>
                            <Save className='mr-2 h-4 w-4' /> Save
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

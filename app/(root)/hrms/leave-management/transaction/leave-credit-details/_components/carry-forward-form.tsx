'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Save, X } from 'lucide-react';
import { type Control, Controller, type FieldErrors, type UseFormHandleSubmit, type UseFormWatch } from 'react-hook-form';
interface CarryForwardFormProps {
    control: Control<any>;
    errors: FieldErrors<any>;
    handleSubmit: UseFormHandleSubmit<any>;
    watch: UseFormWatch<any>;
    types: Array<{ id: number; name: string }>;
    departments: Array<{ id: number; name: string }>;
    designations: Array<{ id: number; name: string }>;
    grades: Array<{ id: number; name: string }>;
    leaveNames: Array<{ id: number; name: string }>;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    onPrevious?: () => void;
    onNext?: () => void;
}
export function CarryForwardForm({
    control,
    errors,
    handleSubmit,
    watch,
    types,
    departments,
    designations,
    grades,
    leaveNames,
    onSubmit,
    onCancel,
    onPrevious,
    onNext
}: CarryForwardFormProps) {
    const maxLeaveApplicableEnabled = watch('maxLeaveApplicableEnabled') ?? false;
    const onSubmitForm = handleSubmit((data) => {
        onSubmit(data);
    });
    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-6'>
            {/* Filters Section - Type, Department, Designation, Grade */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                {/* Type */}
                <div className='space-y-2'>
                    <Label className='font-medium text-sm'>
                        Type <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='type'
                        control={control}
                        rules={{ required: 'Type is required' }}
                        render={({ field }) => (
                            <MultiSelect
                                options={types.map((t) => ({ label: t.name, value: t.id.toString() }))}
                                onValueChange={(values) => field.onChange(values.map((v: string) => Number.parseInt(v)))}
                                defaultValue={field.value?.map((v: number) => v.toString()) || []}
                                placeholder='Select Types'
                                maxHeight={200}
                            />
                        )}
                    />
                    {errors.type && <FormError>{String(errors.type.message)}</FormError>}
                </div>
                {/* Department */}
                <div className='space-y-2'>
                    <Label className='font-medium text-sm'>
                        Department <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='department'
                        control={control}
                        rules={{ required: 'Department is required' }}
                        render={({ field }) => (
                            <MultiSelect
                                options={departments.map((d) => ({ label: d.name, value: d.id.toString() }))}
                                onValueChange={(values) => field.onChange(values.map((v: string) => Number.parseInt(v)))}
                                defaultValue={field.value?.map((v: number) => v.toString()) || []}
                                placeholder='Select Departments'
                                maxHeight={200}
                            />
                        )}
                    />
                    {errors.department && <FormError>{String(errors.department.message)}</FormError>}
                </div>
                {/* Designation */}
                <div className='space-y-2'>
                    <Label className='font-medium text-sm'>
                        Designation <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='designation'
                        control={control}
                        rules={{ required: 'Designation is required' }}
                        render={({ field }) => (
                            <MultiSelect
                                options={designations.map((d) => ({ label: d.name, value: d.id.toString() }))}
                                onValueChange={(values) => field.onChange(values.map((v: string) => Number.parseInt(v)))}
                                defaultValue={field.value?.map((v: number) => v.toString()) || []}
                                placeholder='Select Designations'
                                maxHeight={200}
                            />
                        )}
                    />
                    {errors.designation && <FormError>{String(errors.designation.message)}</FormError>}
                </div>
                {/* Grade */}
                <div className='space-y-2'>
                    <Label className='font-medium text-sm'>Grade</Label>
                    <Controller
                        name='grade'
                        control={control}
                        render={({ field }) => (
                            <MultiSelect
                                options={grades.map((g) => ({ label: g.name, value: g.id.toString() }))}
                                onValueChange={(values) => field.onChange(values.map((v: string) => Number.parseInt(v)))}
                                defaultValue={field.value?.map((v: number) => v.toString()) || []}
                                placeholder='Select Grades'
                                maxHeight={200}
                            />
                        )}
                    />
                </div>
            </div>
            {/* Leave Name and Number of Days */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                    <Label htmlFor='leave-name-select' className='font-medium text-sm'>
                        Leave Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='leaveName'
                        control={control}
                        rules={{ required: 'Leave Name is required' }}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger id='leave-name-select' className={errors.leaveName ? 'border-red-500' : ''}>
                                    <SelectValue placeholder='--Select--' />
                                </SelectTrigger>
                                <SelectContent>
                                    {leaveNames.map((leave) => (
                                        <SelectItem key={leave.id} value={leave.name}>
                                            {leave.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.leaveName && <FormError>{String(errors.leaveName.message)}</FormError>}
                </div>
                <div>
                    <Label htmlFor='no-of-days-input' className='font-medium text-sm'>
                        Number of Days <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='noOfDays'
                        control={control}
                        rules={{ required: 'Number of Days is required', min: { value: 0, message: 'Must be 0 or greater' } }}
                        render={({ field }) => (
                            <InputText
                                id='no-of-days-input'
                                type='number'
                                step='0.5'
                                value={field.value || 0}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className={errors.noOfDays ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.noOfDays && <FormError>{String(errors.noOfDays.message)}</FormError>}
                </div>
            </div>
            {/* Max Leave Applicable */}
            <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                    <Controller
                        name='maxLeaveApplicableEnabled'
                        control={control}
                        render={({ field }) => (
                            <Checkbox id='max-leave-applicable-checkbox' checked={field.value || false} onCheckedChange={field.onChange} />
                        )}
                    />
                    <Label htmlFor='max-leave-applicable-checkbox' className='cursor-pointer font-medium text-sm'>
                        Max Leave Applicable
                    </Label>
                </div>
                {maxLeaveApplicableEnabled && (
                    <div>
                        <Controller
                            name='maxLeaveApplicable'
                            control={control}
                            rules={{ min: { value: 0, message: 'Must be 0 or greater' } }}
                            render={({ field }) => (
                                <InputText
                                    id='max-leave-applicable-input'
                                    type='number'
                                    step='0.5'
                                    value={field.value || 0}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    className={errors.maxLeaveApplicable ? 'border-red-500' : ''}
                                />
                            )}
                        />
                        {errors.maxLeaveApplicable && <FormError>{String(errors.maxLeaveApplicable.message)}</FormError>}
                    </div>
                )}
            </div>
            {/* Action Buttons */}
            <div className='flex justify-center gap-2 border-t pt-4'>
                {onPrevious && (
                    <Button type='button' variant='outline' onClick={onPrevious} className='min-w-[120px]'>
                        <ChevronLeft className='mr-2 h-4 w-4' />
                        PREVIOUS
                    </Button>
                )}
                <Button type='submit' variant='default' className='min-w-[120px]'>
                    <Save className='mr-2 h-4 w-4' />
                    SAVE
                </Button>
                {onNext && (
                    <Button type='button' variant='default' onClick={onNext} className='min-w-[120px]'>
                        NEXT
                        <ChevronRight className='ml-2 h-4 w-4' />
                    </Button>
                )}
                <Button type='button' variant='outline' onClick={onCancel} className='min-w-[120px]'>
                    <X className='mr-2 h-4 w-4' />
                    CANCEL
                </Button>
            </div>
        </form>
    );
}

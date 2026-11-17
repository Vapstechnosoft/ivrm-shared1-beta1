'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Save, X } from 'lucide-react';
import {
    type Control,
    Controller,
    type FieldErrors,
    type UseFormHandleSubmit,
    type UseFormSetValue,
    type UseFormWatch
} from 'react-hook-form';
interface EncashmentFormProps {
    control: Control<any>;
    errors: FieldErrors<any>;
    handleSubmit: UseFormHandleSubmit<any>;
    watch: UseFormWatch<any>;
    setValue: UseFormSetValue<any>;
    types: Array<{ id: number; name: string }>;
    departments: Array<{ id: number; name: string }>;
    designations: Array<{ id: number; name: string }>;
    grades: Array<{ id: number; name: string }>;
    leaveNames: Array<{ id: number; name: string }>;
    encashmentScheduleOptions: Array<{ id: number; name: string }>;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    onPrevious?: () => void;
}
export function EncashmentForm({
    control,
    errors,
    handleSubmit,
    watch,
    setValue,
    types,
    departments,
    designations,
    grades,
    leaveNames,
    encashmentScheduleOptions,
    onSubmit,
    onCancel,
    onPrevious
}: EncashmentFormProps) {
    const minServiceApplicableEnabled = watch('minServiceApplicableEnabled') ?? false;
    const maxLeaveApplicableEnabled = watch('maxLeaveApplicableEnabled') ?? false;
    const minLeaveApplicableEnabled = watch('minLeaveApplicableEnabled') ?? false;
    const encashmentScheduleEnabled = watch('encashmentScheduleEnabled') ?? false;
    const _encashmentScheduleType = watch('encashmentScheduleType') ?? 'Year';
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
            {/* Min Service Applicable */}
            <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                    <Controller
                        name='minServiceApplicableEnabled'
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                id='min-service-applicable-checkbox'
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                    <Label htmlFor='min-service-applicable-checkbox' className='cursor-pointer font-medium text-sm'>
                        Min Service Applicable
                    </Label>
                </div>
                {minServiceApplicableEnabled && (
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <div>
                            <Label htmlFor='min-service-year-input' className='font-medium text-sm'>
                                Year
                            </Label>
                            <Controller
                                name='minServiceYear'
                                control={control}
                                render={({ field }) => (
                                    <InputText
                                        id='min-service-year-input'
                                        type='number'
                                        value={field.value || 0}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Label htmlFor='min-service-month-input' className='font-medium text-sm'>
                                Month
                            </Label>
                            <Controller
                                name='minServiceMonth'
                                control={control}
                                render={({ field }) => (
                                    <InputText
                                        id='min-service-month-input'
                                        type='number'
                                        min={0}
                                        max={11}
                                        value={field.value || 0}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Label htmlFor='min-service-days-input' className='font-medium text-sm'>
                                Days
                            </Label>
                            <Controller
                                name='minServiceDays'
                                control={control}
                                render={({ field }) => (
                                    <InputText
                                        id='min-service-days-input'
                                        type='number'
                                        min={0}
                                        max={30}
                                        value={field.value || 0}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                )}
                            />
                        </div>
                    </div>
                )}
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
            {/* Min Leave Applicable */}
            <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                    <Controller
                        name='minLeaveApplicableEnabled'
                        control={control}
                        render={({ field }) => (
                            <Checkbox id='min-leave-applicable-checkbox' checked={field.value || false} onCheckedChange={field.onChange} />
                        )}
                    />
                    <Label htmlFor='min-leave-applicable-checkbox' className='cursor-pointer font-medium text-sm'>
                        Min Leave Applicable
                    </Label>
                </div>
                {minLeaveApplicableEnabled && (
                    <div>
                        <Controller
                            name='minLeaveApplicable'
                            control={control}
                            rules={{ min: { value: 0, message: 'Must be 0 or greater' } }}
                            render={({ field }) => (
                                <InputText
                                    id='min-leave-applicable-input'
                                    type='number'
                                    step='0.5'
                                    value={field.value || 0}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    className={errors.minLeaveApplicable ? 'border-red-500' : ''}
                                />
                            )}
                        />
                        {errors.minLeaveApplicable && <FormError>{String(errors.minLeaveApplicable.message)}</FormError>}
                    </div>
                )}
            </div>
            {/* Variable / Fixed */}
            <div className='space-y-2'>
                <Label className='font-medium text-sm'>Variable / Fixed</Label>
                <Controller
                    name='encashmentType'
                    control={control}
                    render={({ field }) => (
                        <RadioGroup value={field.value} onValueChange={field.onChange} className='flex flex-row gap-6'>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='Variable' id='variable' />
                                <Label htmlFor='variable' className='cursor-pointer'>
                                    Variable
                                </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='Fixed' id='fixed' />
                                <Label htmlFor='fixed' className='cursor-pointer'>
                                    Fixed
                                </Label>
                            </div>
                        </RadioGroup>
                    )}
                />
            </div>
            {/* Encashment Schedule */}
            <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                    <Controller
                        name='encashmentScheduleEnabled'
                        control={control}
                        render={({ field }) => (
                            <Checkbox id='encashment-schedule-checkbox' checked={field.value || false} onCheckedChange={field.onChange} />
                        )}
                    />
                    <Label htmlFor='encashment-schedule-checkbox' className='cursor-pointer font-medium text-sm'>
                        Encashment Schedule
                    </Label>
                </div>
                {encashmentScheduleEnabled && (
                    <div className='space-y-4'>
                        <Controller
                            name='encashmentScheduleType'
                            control={control}
                            render={({ field }) => (
                                <RadioGroup value={field.value} onValueChange={field.onChange} className='flex flex-row gap-6'>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='Year' id='schedule-year' />
                                        <Label htmlFor='schedule-year' className='cursor-pointer'>
                                            Year
                                        </Label>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='Month' id='schedule-month' />
                                        <Label htmlFor='schedule-month' className='cursor-pointer'>
                                            Month
                                        </Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                        <div className='space-y-2'>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder='--Select--' />
                                </SelectTrigger>
                                <SelectContent>
                                    {encashmentScheduleOptions.map((opt) => (
                                        <SelectItem key={opt.id} value={opt.id.toString()}>
                                            {opt.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className='max-h-[200px] space-y-2 overflow-y-auto rounded-md border p-3'>
                                {encashmentScheduleOptions.map((opt) => {
                                    const selectedSchedule = watch('selectedEncashmentSchedule') || [];
                                    const isChecked = selectedSchedule.includes(opt.id);
                                    return (
                                        <div key={opt.id} className='flex items-center space-x-2'>
                                            <Checkbox
                                                id={`schedule-${opt.id}`}
                                                checked={isChecked}
                                                onCheckedChange={(checked) => {
                                                    const current = watch('selectedEncashmentSchedule') || [];
                                                    if (checked) {
                                                        setValue('selectedEncashmentSchedule', [...current, opt.id]);
                                                    } else {
                                                        setValue(
                                                            'selectedEncashmentSchedule',
                                                            current.filter((id: number) => id !== opt.id)
                                                        );
                                                    }
                                                }}
                                            />
                                            <Label htmlFor={`schedule-${opt.id}`} className='cursor-pointer font-normal text-sm'>
                                                {opt.name}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
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
                <Button type='button' variant='outline' onClick={onCancel} className='min-w-[120px]'>
                    <X className='mr-2 h-4 w-4' />
                    CANCEL
                </Button>
            </div>
        </form>
    );
}

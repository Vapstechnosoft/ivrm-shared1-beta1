'use client';
import { Button } from '@/components/ui/button';
import { DatePickerWithYear } from '@/components/ui/date-picker-year';
import { FormError } from '@/components/ui/extension/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { employeeMissingLogsSchema } from '@/schemas/hrms/attendance-management-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Eye, Plus, RefreshCw, Save, Trash2, Upload, X } from 'lucide-react';
import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { TimePicker12Hour } from '../../master-shift/_components/time-picker-12hour';
import type { MissingLog } from './columns';
export type MissingLogFormData = z.infer<typeof employeeMissingLogsSchema.addOrUpdate>;
interface MissingLogFormProps {
    editingMissingLog: MissingLog | null;
    onSubmit: (data: MissingLogFormData) => void;
    onCancel: () => void;
}
export function MissingLogForm({ editingMissingLog, onSubmit, onCancel }: MissingLogFormProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<MissingLogFormData>({
        resolver: zodResolver(employeeMissingLogsSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: editingMissingLog
            ? {
                  employeeName: editingMissingLog.employeeName,
                  date: editingMissingLog.date,
                  entries: [
                      {
                          time: editingMissingLog.time,
                          inOut: editingMissingLog.inOut,
                          remarks: editingMissingLog.remarks,
                          file: editingMissingLog.file
                      }
                  ]
              }
            : {
                  employeeName: '',
                  date: '',
                  entries: [
                      {
                          time: '00:00',
                          inOut: 'IN',
                          remarks: '',
                          file: undefined
                      }
                  ]
              }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'entries'
    });
    const handleAddRow = () => {
        append({
            time: '00:00',
            inOut: 'IN',
            remarks: '',
            file: undefined
        });
    };
    const handleRemoveRow = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };
    const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (file.size > maxSize) {
                alert('File must not exceed 5MB');
                return;
            }
            if (!allowedTypes.includes(file.type)) {
                alert('File must be jpg, png, or pdf');
                return;
            }
            setValue(`entries.${index}.uploadFile`, file);
            setValue(`entries.${index}.file`, file.name);
        }
    };
    const handleFormSubmit: SubmitHandler<MissingLogFormData> = async (data) => {
        onSubmit(data);
    };
    // Mock employee list - replace with actual data source
    const employees = ['RAMESH G', 'Govindalah M', 'Siddesh Kumar R', 'John Doe', 'Jane Smith'];
    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
            {/* Employee Name and Date */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                    <label className='font-medium text-sm' htmlFor='employeeName'>
                        Employee Name <span className='text-red-500'>*</span>
                    </label>
                    <Select value={watch('employeeName')} onValueChange={(value) => setValue('employeeName', value)}>
                        <SelectTrigger id='employeeName' className={errors.employeeName ? 'border-red-500' : ''}>
                            <SelectValue placeholder='--Select--' />
                        </SelectTrigger>
                        <SelectContent>
                            {employees.map((emp) => (
                                <SelectItem key={emp} value={emp}>
                                    {emp}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.employeeName && <FormError>{errors.employeeName.message}</FormError>}
                </div>
                <div className='space-y-2'>
                    <label className='font-medium text-sm' htmlFor='date'>
                        Date <span className='text-red-500'>*</span>
                    </label>
                    <Controller
                        name='date'
                        control={control}
                        render={({ field }) => {
                            const selectedDate = field.value ? new Date(field.value) : undefined;
                            const maxDate = new Date();
                            maxDate.setHours(23, 59, 59, 999);
                            return (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant='outline'
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !selectedDate && 'text-muted-foreground',
                                                errors.date && 'border-red-500'
                                            )}
                                            type='button'>
                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                            {selectedDate ? format(selectedDate, 'dd-MM-yyyy') : 'Pick a date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0' align='start'>
                                        <DatePickerWithYear
                                            mode='single'
                                            selected={selectedDate}
                                            onDayClick={(day) => {
                                                if (day) {
                                                    const dateStr = format(day, 'yyyy-MM-dd');
                                                    field.onChange(dateStr);
                                                }
                                            }}
                                            toDate={maxDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            );
                        }}
                    />
                    {errors.date && <FormError>{errors.date.message}</FormError>}
                </div>
            </div>
            {/* Missing Time Entry Grid */}
            <div className='space-y-4'>
                <div className='border-primary border-b-2 pb-2'>
                    <h3 className='font-semibold text-base'>Missing Time Entry</h3>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-primary/10'>
                                <th className='border border-input px-3 py-2 text-left font-semibold text-sm'>Sl. No.</th>
                                <th className='border border-input px-3 py-2 text-left font-semibold text-sm'>Times</th>
                                <th className='border border-input px-3 py-2 text-left font-semibold text-sm'>IN/OUT</th>
                                <th className='border border-input px-3 py-2 text-left font-semibold text-sm'>Enter Missing Time</th>
                                <th className='border border-input px-3 py-2 text-left font-semibold text-sm'>Upload</th>
                                <th className='border border-input px-3 py-2 text-left font-semibold text-sm'>View</th>
                                <th className='border border-input px-3 py-2 text-left font-semibold text-sm'>Remarks</th>
                                <th className='border border-input px-3 py-2 text-center font-semibold text-sm'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => (
                                <tr key={field.id}>
                                    <td className='border border-input px-3 py-2 text-center text-sm'>{index + 1}</td>
                                    <td className='border border-input px-3 py-2 text-sm'>{watch(`entries.${index}.time`) || '-'}</td>
                                    <td className='border border-input px-3 py-2 text-sm'>{watch(`entries.${index}.inOut`) || '-'}</td>
                                    <td className='border border-input px-3 py-2'>
                                        <div className='space-y-2'>
                                            <Controller
                                                name={`entries.${index}.time`}
                                                control={control}
                                                render={({ field }) => (
                                                    <TimePicker12Hour
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        name={`entries.${index}.time`}
                                                        required
                                                    />
                                                )}
                                            />
                                            {errors.entries?.[index]?.time && <FormError>{errors.entries[index]?.time?.message}</FormError>}
                                            <div>
                                                <label htmlFor={`inOut-${index}`} className='mb-1 block font-medium text-xs'>
                                                    Input/Output
                                                </label>
                                                <Select
                                                    value={watch(`entries.${index}.inOut`)}
                                                    onValueChange={(value) => setValue(`entries.${index}.inOut`, value as 'IN' | 'OUT')}>
                                                    <SelectTrigger id={`inOut-${index}`} className='w-full'>
                                                        <SelectValue placeholder='Select' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value='IN'>In</SelectItem>
                                                        <SelectItem value='OUT'>Out</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.entries?.[index]?.inOut && (
                                                    <FormError>{errors.entries[index]?.inOut?.message}</FormError>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className='border border-input px-3 py-2'>
                                        <div className='flex flex-col gap-2'>
                                            <input
                                                type='file'
                                                id={`upload-${index}`}
                                                className='hidden'
                                                onChange={(e) => handleFileChange(index, e)}
                                                accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
                                            />
                                            <Button
                                                type='button'
                                                variant='warning'
                                                size='sm'
                                                onClick={() => document.getElementById(`upload-${index}`)?.click()}>
                                                <Upload className='mr-2 h-4 w-4' /> Choose File
                                            </Button>
                                            {watch(`entries.${index}.file`) && (
                                                <span className='text-muted-foreground text-xs' title={watch(`entries.${index}.file`)}>
                                                    {(watch(`entries.${index}.file`) || '').length > 20
                                                        ? `${(watch(`entries.${index}.file`) || '').substring(0, 20)}...`
                                                        : watch(`entries.${index}.file`) || ''}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className='border border-input px-3 py-2 text-center'>
                                        {watch(`entries.${index}.file`) ? (
                                            <Button type='button' variant='ghost' size='sm' className='text-primary hover:text-primary/80'>
                                                <Eye className='h-4 w-4' />
                                            </Button>
                                        ) : (
                                            <span className='text-muted-foreground text-sm'>-</span>
                                        )}
                                    </td>
                                    <td className='border border-input px-3 py-2'>
                                        <Textarea
                                            placeholder='Remarks...'
                                            {...register(`entries.${index}.remarks`)}
                                            className='min-h-[60px] resize-none'
                                            maxLength={250}
                                        />
                                        {errors.entries?.[index]?.remarks && (
                                            <FormError>{errors.entries[index]?.remarks?.message}</FormError>
                                        )}
                                    </td>
                                    <td className='border border-input px-3 py-2 text-center'>
                                        {fields.length > 1 ? (
                                            <Button
                                                type='button'
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => handleRemoveRow(index)}
                                                className='text-destructive hover:text-destructive/80'>
                                                <Trash2 className='h-4 w-4' />
                                            </Button>
                                        ) : (
                                            <Button
                                                type='button'
                                                variant='ghost'
                                                size='sm'
                                                onClick={handleAddRow}
                                                className='text-primary hover:text-primary/80'>
                                                <Plus className='h-4 w-4' />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Add Row Button */}
                <div className='flex justify-end'>
                    <Button type='button' variant='outline' onClick={handleAddRow} size='sm'>
                        <Plus className='mr-2 h-4 w-4' /> Add Row
                    </Button>
                </div>
                {errors.entries && typeof errors.entries === 'object' && 'message' in errors.entries && (
                    <FormError>{errors.entries.message as string}</FormError>
                )}
            </div>
            {/* Action Buttons */}
            <div className='flex justify-end gap-4 border-t pt-6'>
                <Button type='button' variant='outline' onClick={onCancel}>
                    <X className='mr-2 h-4 w-4' /> CANCEL
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <RefreshCw className='mr-2 h-4 w-4 animate-spin' /> Saving...
                        </>
                    ) : (
                        <>
                            <Save className='mr-2 h-4 w-4' /> SAVE
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

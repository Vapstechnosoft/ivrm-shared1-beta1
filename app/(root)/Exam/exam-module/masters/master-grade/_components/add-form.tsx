'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { masterGradeSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateMasterGrade } from '@/server/exam/exam-module/masters/grade';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterGradeSchema.addOrUpdate>;

export default function AddMasterGradeForm({ onSuccess, className = '' }: { onSuccess?: () => void; className?: string }) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterGradeSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            emgR_Id: 0,
            emgR_GradeName: '',
            emgR_MarksPerFlag: 'm',
            emgR_ActiveFlag: true,
            grade_list: [
                {
                    emgD_Id: 0,
                    emgR_Id: 0,
                    emgD_Name: '',
                    emgD_From: null,
                    emgD_To: null,
                    emgD_GradePoints: null,
                    emgD_Remarks: '',
                    emgD_ActiveFlag: true
                }
            ]
        }
    });

    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const [isOrderSaving, setIsOrderSaving] = useState(false);
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'grade_list'
    });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    const gradeName = watch('emgR_GradeName');

    useEffect(() => {
        setIsDetailsOpen(!!gradeName?.trim());
    }, [gradeName]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        // Validation: Check for duplicates and overlapping ranges
        const names = new Set<string>();
        const ranges: { from: number; to: number; name: string }[] = [];

        for (const row of data.grade_list) {
            // Check duplicate Name
            const normalizedName = row.emgD_Name.trim().toLowerCase();
            if (names.has(normalizedName)) {
                toast.error(`Duplicate grade name found: ${row.emgD_Name}`);
                return;
            }
            names.add(normalizedName);

            // Validate Range
            const from = Number(row.emgD_From);
            const to = Number(row.emgD_To);

            if (from >= to) {
                toast.error(`Invalid range for ${row.emgD_Name}: 'From' (${from}) must be less than 'To' (${to})`);
                return;
            }

            // Check overlap with existing ranges
            for (const range of ranges) {
                // Check for overlap: (StartA < EndB) and (EndA > StartB)
                // Also check for boundary collisions if necessary, but strictly overlapping ranges are the main issue.
                // Overlap: A.Start < B.End && A.End > B.Start
                if (from < range.to && to > range.from) {
                    toast.error(`Range for ${row.emgD_Name} (${from}-${to}) overlaps with ${range.name} (${range.from}-${range.to})`);
                    return;
                }

                // Optional: Check for exact boundary matches that might be ambiguous (e.g. 90-100 and 90-95)
                if (from === range.from || to === range.to) {
                    toast.error(`Duplicate range boundaries found between ${row.emgD_Name} and ${range.name}`);
                    return;
                }
            }
            ranges.push({ from, to, name: row.emgD_Name });
        }

        try {
            const payload = {
                emgR_Id: 0,
                emgR_GradeName: data.emgR_GradeName,
                emgR_MarksPerFlag: data.emgR_MarksPerFlag,
                grade_list: data.grade_list.map(({ emgD_Id, ...row }) => ({
                    emgD_Name: row.emgD_Name,
                    emgD_From: row.emgD_From === null ? null : Number(row.emgD_From),
                    emgD_To: row.emgD_To === null ? null : Number(row.emgD_To),
                    emgD_GradePoints: row.emgD_GradePoints === null ? null : Number(row.emgD_GradePoints),
                    emgD_Remarks: row.emgD_Remarks,
                    emgD_ActiveFlag: row.emgD_ActiveFlag
                }))
            };
            const response = await addOrUpdateMasterGrade(payload);
            if (response.success) {
                toast.success(response.message);
                reset();
                setIsDetailsOpen(false);
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to save');
        }
    };
    const tableRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (fields.length > 0 || isDetailsOpen) {
            tableRef.current?.scrollIntoView({ behavior: 'smooth' });
            setTimeout(scrollToBottom, 50);
        }
    }, [fields.length, isDetailsOpen]);
    const scrollToBottom = () => {
        if (tableRef.current) {
            tableRef.current.scrollTop = tableRef.current.scrollHeight;
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
            {/* Grade Name + Type */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <InputText label='Grade Name' required {...register('emgR_GradeName')} error={errors.emgR_GradeName?.message} />
                <div>
                    <Label>
                        Marks/Percentage <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='emgR_MarksPerFlag'
                        control={control}
                        render={({ field }) => (
                            <RadioGroup value={field.value} onValueChange={field.onChange} className='flex gap-4'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='m' id='marks' />
                                    <Label htmlFor='marks'>Marks</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='p' id='percentage' />
                                    <Label htmlFor='percentage'>Percentage</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                    {errors.emgR_MarksPerFlag && <FormError>{errors.emgR_MarksPerFlag.message}</FormError>}
                </div>
            </div>

            {/* Grade Details */}
            {isDetailsOpen && (
                <CollapsibleSection title='Grade Details' defaultOpen>
                    <div className='overflow-x-auto' ref={tableRef}>
                        <table className='w-full border border-gray-200'>
                            <thead className='bg-gray-100'>
                                <tr>
                                    <th className='border px-2 py-1'>Sl.No</th>
                                    <th className='border px-2 py-1'>Grade Name</th>
                                    <th className='border px-2 py-1'>From</th>
                                    <th className='border px-2 py-1'>To</th>
                                    <th className='border px-2 py-1'>Grade Points</th>
                                    <th className='border px-2 py-1'>Remarks</th>
                                    <th className='border px-2 py-1'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className='border text-center'>{index + 1}</td>

                                        {/* Grade Name */}
                                        <td className='border'>
                                            <InputText
                                                {...register(`grade_list.${index}.emgD_Name` as const)}
                                                placeholder='Enter grade name'
                                                error={errors.grade_list?.[index]?.emgD_Name?.message}
                                            />
                                        </td>

                                        {/* From Marks */}
                                        <td className='border'>
                                            <InputText
                                                type='number'
                                                step='any'
                                                min='0'
                                                max='100'
                                                {...register(`grade_list.${index}.emgD_From`, {
                                                    setValueAs: (v) => {
                                                        if (v === '' || v === null) return null;
                                                        const num = Number(v);
                                                        return Number.isNaN(num) ? null : num;
                                                    },
                                                    onChange: (e) => {
                                                        // Allow only numbers and decimal point
                                                        const value = e.target.value;
                                                        if (value && !/^\d*\.?\d*$/.test(value)) {
                                                            e.target.value = value.replace(/[^\d.]/g, '');
                                                        }
                                                    }
                                                })}
                                                placeholder='0-100'
                                                error={errors.grade_list?.[index]?.emgD_From?.message}
                                                onKeyPress={(e) => {
                                                    // Prevent non-numeric characters except decimal point
                                                    const char = String.fromCharCode(e.which);
                                                    if (!/[\d.]/.test(char)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onPaste={(e) => {
                                                    // Prevent paste of non-numeric content
                                                    const pasteData = e.clipboardData.getData('text');
                                                    if (!/^[\d.]*$/.test(pasteData)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </td>

                                        {/* To Marks */}
                                        <td className='border'>
                                            <InputText
                                                type='number'
                                                step='any'
                                                min='0'
                                                max='100'
                                                {...register(`grade_list.${index}.emgD_To`, {
                                                    setValueAs: (v) => {
                                                        if (v === '' || v === null) return null;
                                                        const num = Number(v);
                                                        return Number.isNaN(num) ? null : num;
                                                    },
                                                    onChange: (e) => {
                                                        // Allow only numbers and decimal point
                                                        const value = e.target.value;
                                                        if (value && !/^\d*\.?\d*$/.test(value)) {
                                                            e.target.value = value.replace(/[^\d.]/g, '');
                                                        }
                                                    }
                                                })}
                                                placeholder='0-100'
                                                error={errors.grade_list?.[index]?.emgD_To?.message}
                                                onKeyPress={(e) => {
                                                    // Prevent non-numeric characters except decimal point
                                                    const char = String.fromCharCode(e.which);
                                                    if (!/[\d.]/.test(char)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onPaste={(e) => {
                                                    // Prevent paste of non-numeric content
                                                    const pasteData = e.clipboardData.getData('text');
                                                    if (!/^[\d.]*$/.test(pasteData)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </td>

                                        {/* Grade Points */}
                                        <td className='border'>
                                            <InputText
                                                type='number'
                                                step='any'
                                                min='0'
                                                max='10'
                                                {...register(`grade_list.${index}.emgD_GradePoints`, {
                                                    setValueAs: (v) => {
                                                        if (v === '' || v === null) return null;
                                                        const num = Number(v);
                                                        return Number.isNaN(num) ? null : num;
                                                    },
                                                    onChange: (e) => {
                                                        // Allow only numbers and decimal point
                                                        const value = e.target.value;
                                                        if (value && !/^\d*\.?\d*$/.test(value)) {
                                                            e.target.value = value.replace(/[^\d.]/g, '');
                                                        }
                                                    }
                                                })}
                                                placeholder='0-10'
                                                error={errors.grade_list?.[index]?.emgD_GradePoints?.message}
                                                onKeyPress={(e) => {
                                                    // Prevent non-numeric characters except decimal point
                                                    const char = String.fromCharCode(e.which);
                                                    if (!/[\d.]/.test(char)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onPaste={(e) => {
                                                    // Prevent paste of non-numeric content
                                                    const pasteData = e.clipboardData.getData('text');
                                                    if (!/^[\d.]*$/.test(pasteData)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </td>

                                        {/* Remarks */}
                                        <td className='border'>
                                            <InputText
                                                {...register(`grade_list.${index}.emgD_Remarks` as const)}
                                                placeholder='Remarks'
                                                error={errors.grade_list?.[index]?.emgD_Remarks?.message}
                                            />
                                        </td>
                                        <td className='flex justify-center gap-2 border px-2 py-1'>
                                            <Button
                                                type='button'
                                                size='sm'
                                                onClick={() => {
                                                    const last = watch('grade_list')[index];
                                                    console.info('last', last);
                                                    if (
                                                        last.emgD_Name.trim() === '' ||
                                                        last.emgD_From === null ||
                                                        last.emgD_To === null ||
                                                        last.emgD_GradePoints === null
                                                    ) {
                                                        toast.error('Please fill the current row before adding a new one.');
                                                        return;
                                                    }

                                                    append({
                                                        emgD_Id: 0,
                                                        emgR_Id: 0,
                                                        emgD_Name: '',
                                                        emgD_From: null,
                                                        emgD_To: null,
                                                        emgD_GradePoints: null,
                                                        emgD_Remarks: '',
                                                        emgD_ActiveFlag: true
                                                    });
                                                }}>
                                                <Plus className='h-3 w-3' />
                                            </Button>

                                            {/* Remove row */}
                                            {fields.length > 1 && (
                                                <Button
                                                    type='button'
                                                    size='sm'
                                                    variant='destructive'
                                                    onClick={() => {
                                                        setDeleteIndex(index);
                                                        setConfirmOpen(true);
                                                    }}>
                                                    <Trash className='h-3 w-3' />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='flex w-fit gap-3 border-t pt-4'>
                        <Button type='button' variant='outline' onClick={() => reset()} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting}>
                            <Save className='mr-2 h-4 w-4' /> Save
                        </Button>
                    </div>
                </CollapsibleSection>
            )}
            {confirmOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
                    <div className='w-[350px] rounded-md bg-white p-6 text-center shadow-xl'>
                        <h2 className='mb-3 font-semibold text-lg'>Confirm Delete</h2>
                        <p className='mb-6 text-gray-700'>Are you sure you want to delete this row?</p>

                        <div className='flex justify-center gap-4'>
                            <Button
                                variant='outline'
                                onClick={() => {
                                    setConfirmOpen(false);
                                    setDeleteIndex(null);
                                }}>
                                Cancel
                            </Button>

                            <Button
                                variant='destructive'
                                onClick={() => {
                                    if (deleteIndex !== null) {
                                        remove(deleteIndex);
                                    }
                                    setConfirmOpen(false);
                                    setDeleteIndex(null);
                                }}>
                                Yes, Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}

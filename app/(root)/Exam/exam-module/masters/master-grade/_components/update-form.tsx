'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMasterGrade } from '@/hooks/exam/exammodule/usemasters';
import { masterGradeSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateMasterGrade, getGradeDetailsById } from '@/server/exam/exam-module/masters/grade';
import type { IMasterGrade } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

interface UpdateMasterGradeFormProps {
    gradeData: IMasterGrade;
    onSuccess?: () => void;
    className?: string;
}

export default function UpdateMasterGradeForm({ gradeData, onSuccess, className = '' }: UpdateMasterGradeFormProps) {
    const [isLoading, setIsLoading] = useState(true);
    const { refetchAll } = useMasterGrade();

    const {
        control,
        register,
        handleSubmit,
        reset,
        trigger,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<z.infer<typeof masterGradeSchema.addOrUpdate>>({
        resolver: zodResolver(masterGradeSchema.addOrUpdate),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            emgR_Id: gradeData.emgR_Id,
            mI_Id: gradeData.mI_Id ?? 0,
            emgR_GradeName: gradeData.emgR_GradeName ?? '',
            emgR_MarksPerFlag: (gradeData.emgR_MarksPerFlag as 'm' | 'p') ?? 'm',
            emgR_ActiveFlag: gradeData.emgR_ActiveFlag ?? true,
            grade_list: []
        }
    });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'grade_list'
    });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    //  Fetch and populate grade details
    useEffect(() => {
        async function fetchGradeDetails() {
            setIsLoading(true);
            try {
                const result = await getGradeDetailsById(gradeData.emgR_Id);
                if (result?.data) {
                    const data = Array.isArray(result.data)
                        ? result.data.map((g: any) => ({
                              emgD_Id: Number(g.emgD_Id ?? 0),
                              emgR_Id: Number(g.emgR_Id ?? 0),
                              emgD_Name: g.emgD_Name || '',
                              emgD_From: Number(g.emgD_From ?? null),
                              emgD_To: Number(g.emgD_To ?? null),
                              emgD_GradePoints: Number(g.emgD_GradePoints ?? null),
                              emgD_Remarks: g.emgD_Remarks || '',
                              emgD_ActiveFlag: g.emgD_ActiveFlag ?? true
                          }))
                        : [];

                    reset(
                        {
                            emgR_Id: gradeData.emgR_Id,
                            mI_Id: gradeData.mI_Id ?? 0,
                            emgR_GradeName: gradeData.emgR_GradeName ?? '',
                            emgR_MarksPerFlag: (gradeData.emgR_MarksPerFlag as 'm' | 'p') ?? 'm',
                            emgR_ActiveFlag: gradeData.emgR_ActiveFlag ?? true,
                            grade_list: data
                        },
                        {
                            keepErrors: true,
                            keepDirty: true,
                            keepIsSubmitted: false,
                            keepTouched: true
                        }
                    );

                    //  Replace field array to keep reactivity
                    replace(data);
                    scrollToBottom();
                    await trigger();

                    // Trigger validation after loading
                    setTimeout(() => trigger(), 0);
                } else {
                    toast.error('Failed to fetch grade details');
                }
            } catch (err: any) {
                toast.error(err.message || 'Error fetching grade details');
            } finally {
                setIsLoading(false);
            }
        }

        fetchGradeDetails();
    }, [gradeData.emgR_Id, reset, replace, trigger, gradeData]);

    // ✅ Submit handler
    const onSubmit: SubmitHandler<z.infer<typeof masterGradeSchema.addOrUpdate>> = async (data) => {
        // Validation: Check for duplicates and overlapping ranges
        const names = new Set<string>();
        const ranges: { from: number; to: number; name: string }[] = [];

        for (const row of data.grade_list) {
            // Check duplicate Name
            const normalizedName = row.emgD_Name.trim().toLowerCase();
            if (names.has(normalizedName)) {
                toast.error(`Duplicate grade name found in details: ${row.emgD_Name}`);
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
                if (from < range.to && to > range.from) {
                    toast.error(`Range for ${row.emgD_Name} (${from}-${to}) overlaps with ${range.name} (${range.from}-${range.to})`);
                    return;
                }

                if (from === range.from || to === range.to) {
                    toast.error(`Duplicate range boundaries found between ${row.emgD_Name} and ${range.name}`);
                    return;
                }
            }
            ranges.push({ from, to, name: row.emgD_Name });
        }

        try {
            const payload = {
                ...data,
                grade_list: data.grade_list.map((row) => ({
                    ...row,
                    emgD_Id: Number(row.emgD_Id ?? 0),
                    emgD_From: Number(row.emgD_From),
                    emgD_To: Number(row.emgD_To),
                    emgD_GradePoints: Number(row.emgD_GradePoints)
                }))
            };

            const response = await addOrUpdateMasterGrade(payload);

            if (response?.success) {
                toast.success(response.message);
                onSuccess?.();
                refetchAll();
            } else {
                toast.error(response?.message || 'Failed to save');
            }
        } catch (err: any) {
            toast.error(err.message || 'Error saving data');
        }
    };

    const tableRef = useRef<HTMLDivElement | null>(null);
    // ⬇️ Reset Form To Original Data (Fetched Grade + Grade_List Rows)
    const handleReset = async () => {
        try {
            setIsLoading(true);
            const result = await getGradeDetailsById(gradeData.emgR_Id);
            if (result?.data) {
                const restoredRows = Array.isArray(result.data)
                    ? result.data.map((g: any) => ({
                          emgD_Id: Number(g.emgD_Id ?? 0),
                          emgR_Id: Number(g.emgR_Id ?? 0),
                          emgD_Name: g.emgD_Name || '',
                          emgD_From: Number(g.emgD_From ?? null),
                          emgD_To: Number(g.emgD_To ?? null),
                          emgD_GradePoints: Number(g.emgD_GradePoints ?? null),
                          emgD_Remarks: g.emgD_Remarks || '',
                          emgD_ActiveFlag: g.emgD_ActiveFlag ?? true
                      }))
                    : [];

                // ⬅ Reset form with original values
                reset({
                    emgR_Id: gradeData.emgR_Id,
                    mI_Id: gradeData.mI_Id ?? 0,
                    emgR_GradeName: gradeData.emgR_GradeName ?? '',
                    emgR_MarksPerFlag: (gradeData.emgR_MarksPerFlag as 'm' | 'p') ?? 'm',
                    emgR_ActiveFlag: gradeData.emgR_ActiveFlag ?? true,
                    grade_list: restoredRows
                });

                replace(restoredRows); // restore array rows
                await trigger(); // re-validate after reset
                toast.info('Form reset to original data.');
            } else {
                toast.error('No data found to reset.');
            }
        } catch (error: any) {
            toast.error(error.message || 'Reset failed.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (fields.length > 0) {
            tableRef.current?.scrollIntoView({ behavior: 'smooth' });
            setTimeout(scrollToBottom, 50);
        }
    }, [fields.length]);

    const scrollToBottom = () => {
        if (tableRef.current) {
            tableRef.current.scrollTop = tableRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500)
        return () => clearTimeout(timer);
    }, [gradeData])

    if (isLoading) {
        return (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                <RefreshCw className='h-8 w-8 animate-spin text-secondary' />
                <p className='text-muted-foreground text-sm'>Loading data...</p>
            </div>
        );
    }



    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`} noValidate>
            {/* Grade Info */}
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

            {/* Grade List */}
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
                                                console.info(last);
                                                if (
                                                    last.emgD_Name.trim() === '' ||
                                                    last.emgD_From === null ||
                                                    last.emgD_To === null ||
                                                    last.emgD_GradePoints === null ||
                                                    last.emgD_Remarks?.trim() === ''
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
                    <Button type='button' variant='outline' onClick={handleReset} disabled={isSubmitting}>
                        Reset
                    </Button>
                    <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting}>
                        <Save className='mr-2 h-4 w-4' /> Update
                    </Button>
                </div>
            </CollapsibleSection>
            {confirmOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
                    <div className='w-[350px] rounded-md bg-white p-6 text-center shadow-xl'>
                        <h2 className='mb-3 font-semibold text-lg'>Delete Row?</h2>
                        <p className='mb-6 text-gray-700'>Are you sure you want to remove this grade row?</p>

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
                                    if (deleteIndex !== null) remove(deleteIndex);
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

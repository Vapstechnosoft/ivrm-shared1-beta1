'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { IClass, IYear } from '@/types/alumni/alumni-membership';
import { History, Info, Plus, X } from 'lucide-react';
import { useEffect } from 'react';
import { type UseFormReturn, useFieldArray } from 'react-hook-form';
import type { IAlumnusMembershipFormValues } from './schema';

interface ReadmittedSectionProps {
    form: UseFormReturn<IAlumnusMembershipFormValues>;
    years: IYear[];
    classes: IClass[];
}

export default function ReadmittedSection({ form, years, classes }: ReadmittedSectionProps) {
    const { fields, append, remove, replace } = useFieldArray({
        name: 'ReadmittedStudentDTO',
        control: form.control
    });

    const isReadmitted = form.watch('Readmitted_student');

    // Automatically add an empty row if readmitted is checked and list is empty
    useEffect(() => {
        if (isReadmitted && fields.length === 0) {
            append({
                ALMSTRADM_YearJoined: 0,
                ALMSTRADM_YearLeft: 0,
                ALMSTRADM_ClassJoined: 0,
                ALMSTRADM_ClassLeft: 0
            });
        } else if (!isReadmitted && fields.length > 0) {
            // Optional: clear fields if status is off
            // replace([]);
        }
    }, [isReadmitted, fields.length, append]);

    return (
        <CollapsibleSection
            title='Readmission History'
            defaultOpen={isReadmitted}
            icon={<History className='h-5 w-5' />}
            className='border-primary/20'>
            <div className='space-y-6'>
                <div className='flex flex-col justify-between gap-4 rounded-lg border border-primary/10 bg-primary/5 p-4 md:flex-row md:items-center'>
                    <FormField
                        control={form.control}
                        name='Readmitted_student'
                        render={({ field }) => (
                            <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                            if (!checked) {
                                                // We keep the data for now but it won't be visible
                                                // If we want to clear it on uncheck:
                                                // replace([]);
                                            }
                                        }}
                                        className='h-5 w-5'
                                    />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel className='cursor-pointer font-semibold text-base text-primary'>
                                        Readmitted Student?
                                    </FormLabel>
                                    <p className='text-muted-foreground text-xs'>Check if the student has multiple enrollment periods.</p>
                                </div>
                            </FormItem>
                        )}
                    />
                    {isReadmitted && (
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            className='border-primary text-primary hover:bg-primary/5'
                            onClick={() =>
                                append({
                                    ALMSTRADM_YearJoined: 0,
                                    ALMSTRADM_YearLeft: 0,
                                    ALMSTRADM_ClassJoined: 0,
                                    ALMSTRADM_ClassLeft: 0
                                })
                            }>
                            <Plus className='mr-2 h-4 w-4' /> Add Academic Period
                        </Button>
                    )}
                </div>

                {!isReadmitted && (
                    <div className='flex gap-3 rounded-lg border border-dashed bg-muted/50 p-4'>
                        <Info className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground' />
                        <p className='text-muted-foreground text-xs'>
                            Enable readmission history if this student has previously left and returned to the institution.
                        </p>
                    </div>
                )}

                {isReadmitted && (
                    <div className='space-y-4'>
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className='group relative rounded-lg border bg-card p-6 shadow-sm transition-colors hover:border-primary/30'>
                                <div className='-top-3 absolute left-4 rounded border bg-background px-2 font-bold text-[10px] text-primary uppercase'>
                                    Period #{index + 1}
                                </div>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='absolute top-2 right-2 text-destructive opacity-0 transition-opacity hover:bg-destructive/10 group-hover:opacity-100'
                                    onClick={() => remove(index)}>
                                    <X className='h-4 w-4' />
                                </Button>
                                <div className='grid grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-4'>
                                    <FormField
                                        control={form.control}
                                        name={`ReadmittedStudentDTO.${index}.ALMSTRADM_YearJoined`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='font-bold text-[11px] text-muted-foreground uppercase'>
                                                    Year Joined <span className='text-destructive'>*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(val) => field.onChange(Number.parseInt(val))}
                                                    value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger className='h-9'>
                                                            <SelectValue placeholder='Select Year' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className='max-h-[200px]'>
                                                        {years.map((y) => (
                                                            <SelectItem key={y.asmaY_Id} value={y.asmaY_Id.toString()}>
                                                                {y.asmaY_Year}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`ReadmittedStudentDTO.${index}.ALMSTRADM_YearLeft`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='font-bold text-[11px] text-muted-foreground uppercase'>
                                                    Year Left <span className='text-destructive'>*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(val) => field.onChange(Number.parseInt(val))}
                                                    value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger className='h-9'>
                                                            <SelectValue placeholder='Select Year' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className='max-h-[200px]'>
                                                        {years.map((y) => (
                                                            <SelectItem key={y.asmaY_Id} value={y.asmaY_Id.toString()}>
                                                                {y.asmaY_Year}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`ReadmittedStudentDTO.${index}.ALMSTRADM_ClassJoined`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='font-bold text-[11px] text-muted-foreground uppercase'>
                                                    Class Joined <span className='text-destructive'>*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(val) => field.onChange(Number.parseInt(val))}
                                                    value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger className='h-9'>
                                                            <SelectValue placeholder='Select Class' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className='max-h-[200px]'>
                                                        {classes.map((c) => (
                                                            <SelectItem key={c.asmcL_Id} value={c.asmcL_Id.toString()}>
                                                                {c.asmcL_ClassName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`ReadmittedStudentDTO.${index}.ALMSTRADM_ClassLeft`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='font-bold text-[11px] text-muted-foreground uppercase'>
                                                    Class Left <span className='text-destructive'>*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(val) => field.onChange(Number.parseInt(val))}
                                                    value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger className='h-9'>
                                                            <SelectValue placeholder='Select Class' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className='max-h-[200px]'>
                                                        {classes.map((c) => (
                                                            <SelectItem key={c.asmcL_Id} value={c.asmcL_Id.toString()}>
                                                                {c.asmcL_ClassName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        ))}

                        {fields.length === 0 && (
                            <div className='rounded-lg border-2 border-dashed bg-muted/20 py-8 text-center'>
                                <p className='mb-4 text-muted-foreground text-sm'>No academic periods added.</p>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() =>
                                        append({
                                            ALMSTRADM_YearJoined: 0,
                                            ALMSTRADM_YearLeft: 0,
                                            ALMSTRADM_ClassJoined: 0,
                                            ALMSTRADM_ClassLeft: 0
                                        })
                                    }>
                                    <Plus className='mr-2 h-4 w-4' /> Add First Period
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </CollapsibleSection>
    );
}

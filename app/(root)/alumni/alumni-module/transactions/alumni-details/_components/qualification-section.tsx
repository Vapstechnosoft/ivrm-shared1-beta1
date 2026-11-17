'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { IState } from '@/types/alumni/alumni-membership';
import { GraduationCap, Plus } from 'lucide-react';
import { type UseFormReturn, useFieldArray } from 'react-hook-form';
import type { IAlumnusMembershipFormValues } from './schema';

interface QualificationSectionProps {
    form: UseFormReturn<IAlumnusMembershipFormValues>;
    states: IState[];
}

export default function QualificationSection({ form, states }: QualificationSectionProps) {
    const { fields, append, remove } = useFieldArray({
        name: 'qualification_array',
        control: form.control
    });

    return (
        <CollapsibleSection title='Qualifications' defaultOpen={true} icon={<GraduationCap className='h-5 w-5' />}>
            <div className='space-y-6'>
                {fields.map((field, index) => (
                    <div key={field.id} className='relative rounded-lg border bg-card p-6 shadow-sm'>
                        <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='absolute top-2 right-2 text-destructive hover:bg-destructive/10'
                            onClick={() => remove(index)}>
                            <X className='h-4 w-4' />
                        </Button>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name={`qualification_array.${index}.Qualification`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Qualification <span className='text-destructive'>*</span>
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select Qualification' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='PUC'>PUC</SelectItem>
                                                <SelectItem value='UG'>UG</SelectItem>
                                                <SelectItem value='PG'>PG</SelectItem>
                                                <SelectItem value='Other'>Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`qualification_array.${index}.ALMST_PUC_INS_NAME`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Institution <span className='text-destructive'>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='Institution name' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`qualification_array.${index}.ALMST_PUC_PASSED_OUT`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Passed Out Year <span className='text-destructive'>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='YYYY' maxLength={4} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`qualification_array.${index}.ALSQU_Percentage`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Percentage/CGPA <span className='text-destructive'>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='e.g., 85% or 8.5' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`qualification_array.${index}.ALMST_PLACE`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Place</FormLabel>
                                        <FormControl>
                                            <Input placeholder='City/Town' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`qualification_array.${index}.ALMST_PerState`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <Select
                                            onValueChange={(val) => field.onChange(Number.parseInt(val))}
                                            value={field.value?.toString()}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select State' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {states.map((s) => (
                                                    <SelectItem key={s.ivrmmS_Id} value={s.ivrmmS_Id.toString()}>
                                                        {s.ivrmmS_Name}
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

                <Button
                    type='button'
                    variant='outline'
                    className='w-full border-dashed'
                    onClick={() =>
                        append({
                            Qualification: '',
                            ALMST_PUC_INS_NAME: '',
                            ALMST_PUC_PASSED_OUT: '',
                            ALSQU_Percentage: '',
                            ALMST_PLACE: ''
                        })
                    }>
                    <Plus className='mr-2 h-4 w-4' /> Add Qualification
                </Button>
            </div>
        </CollapsibleSection>
    );
}

import { X } from 'lucide-react';

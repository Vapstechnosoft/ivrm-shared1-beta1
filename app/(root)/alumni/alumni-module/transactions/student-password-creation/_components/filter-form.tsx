'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { IClass, ISection, IYear } from '@/types/alumni/student-password-creation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    filterdata: z.string(),
    asmaY_Id: z.string().min(1, 'Please select a year'),
    asmcL_Id: z.string().min(1, 'Please select a class'),
    asmS_Id: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface FilterFormProps {
    years: IYear[];
    classes: IClass[];
    sections: ISection[];
    onSubmit: (values: any) => void;
    onCancel: () => void;
}

export default function FilterForm({ years, classes, sections, onSubmit, onCancel }: FilterFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            filterdata: 'stureg',
            asmaY_Id: '',
            asmcL_Id: '',
            asmS_Id: ''
        }
    });

    const filterdata = form.watch('filterdata');
    const isSectionHidden = filterdata === 'Alumni' || filterdata === 'stunew';

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                    control={form.control}
                    name='filterdata'
                    render={({ field }) => (
                        <FormItem className='space-y-3'>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className='flex flex-wrap items-center justify-center gap-6 rounded-lg border bg-muted/20 p-4'>
                                    {[
                                        { value: 'stureg', label: 'Regular' },
                                        { value: 'stutra', label: 'Transport' },
                                        { value: 'Alumni', label: 'Alumni' },
                                        { value: 'stunew', label: 'New' }
                                    ].map((option) => (
                                        <div key={option.value} className='flex items-center space-x-2'>
                                            <RadioGroupItem value={option.value} id={option.value} />
                                            <Label htmlFor={option.value} className='cursor-pointer font-medium uppercase tracking-wide'>
                                                {option.label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    <FormField
                        control={form.control}
                        name='asmaY_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Academic Year <span className='text-destructive'>*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Year' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                                {year.asmaY_Year}
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
                        name='asmcL_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Class <span className='text-destructive'>*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Class' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='0'>ALL</SelectItem>
                                        {classes.map((cls) => (
                                            <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>
                                                {cls.asmcL_ClassName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {!isSectionHidden && (
                        <FormField
                            control={form.control}
                            name='asmS_Id'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Section <span className='text-destructive'>*</span>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Section' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value='0'>ALL</SelectItem>
                                            {sections.map((sec) => (
                                                <SelectItem key={sec.asmS_Id} value={sec.asmS_Id.toString()}>
                                                    {sec.asmC_SectionName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                <div className='flex justify-center space-x-4 pt-4'>
                    <Button type='submit' className='w-32 bg-primary'>
                        <Eye className='mr-2 h-4 w-4' /> SHOW
                    </Button>
                    <Button type='button' variant='destructive' onClick={onCancel} className='w-32'>
                        <X className='mr-2 h-4 w-4' /> CANCEL
                    </Button>
                </div>
            </form>
        </Form>
    );
}

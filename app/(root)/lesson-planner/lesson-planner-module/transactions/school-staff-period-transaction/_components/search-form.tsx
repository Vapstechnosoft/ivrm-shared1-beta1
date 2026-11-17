'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    getTransactionEmployeeClasses,
    getTransactionEmployeeSections,
    getTransactionEmployeeSubjects
} from '@/server/lesson-planner/transactions/school-staff-period-transaction';
import { useEffect, useState, useTransition } from 'react';
import { useFormContext } from 'react-hook-form';

export default function SearchForm({
    masterYear,
    employees,
    onSearch
}: {
    masterYear: any[];
    employees: any[];
    onSearch: (data: any) => void;
}) {
    const { control, watch, setValue, getValues, handleSubmit } = useFormContext();
    const [isPending, startTransition] = useTransition();

    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    const selectedYear = watch('ASMAY_Id');
    const selectedEmployee = watch('HRME_Id');
    const selectedClass = watch('ASMCL_Id');
    const selectedSection = watch('ASMS_Id');

    // Fetch classes when year or employee change
    useEffect(() => {
        if (selectedYear && selectedEmployee) {
            startTransition(async () => {
                const res = await getTransactionEmployeeClasses(selectedYear, selectedEmployee);
                const data = res.data || res.masterclass || [];
                setClasses(data);
                // Clear dependent fields
                setSections([]);
                setSubjects([]);
                setValue('ASMCL_Id', undefined);
                setValue('ASMS_Id', undefined);
                setValue('ISMS_Id', undefined);
            });
        }
    }, [selectedYear, selectedEmployee, setValue]);

    // Fetch sections when class changes
    useEffect(() => {
        if (selectedYear && selectedEmployee && selectedClass) {
            startTransition(async () => {
                const res = await getTransactionEmployeeSections(selectedYear, selectedEmployee, selectedClass);
                const data = res.data || res.mastersection || [];
                setSections(data);
                // Clear dependent fields
                setSubjects([]);
                setValue('ASMS_Id', undefined);
                setValue('ISMS_Id', undefined);
            });
        }
    }, [selectedYear, selectedEmployee, selectedClass, setValue]);

    // Fetch subjects when section changes
    useEffect(() => {
        if (selectedYear && selectedEmployee && selectedClass && selectedSection) {
            startTransition(async () => {
                const res = await getTransactionEmployeeSubjects(selectedYear, selectedEmployee, selectedClass, selectedSection);
                const data = res.data || res.mastersubjects || [];
                setSubjects(data);
                setValue('ISMS_Id', undefined);
            });
        }
    }, [selectedYear, selectedEmployee, selectedClass, selectedSection, setValue]);

    return (
        <div className='space-y-4 rounded-md border bg-card p-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <FormField
                    control={control}
                    name='ASMAY_Id'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Academic Year <span className='text-red-500'>*</span>
                            </FormLabel>
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString() || ''}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Year' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {masterYear?.map((y: any) => (
                                        <SelectItem key={y.asmaY_Id} value={y.asmaY_Id?.toString() || ''}>
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
                    control={control}
                    name='HRME_Id'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Employee <span className='text-red-500'>*</span>
                            </FormLabel>
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString() || ''}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Employee' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {employees?.map((e: any) => (
                                        <SelectItem key={e.hrmE_Id} value={e.hrmE_Id?.toString() || ''}>
                                            {e.employeename || e.username || `Employee ID: ${e.hrmE_Id}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name='ASMCL_Id'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Class <span className='text-red-500'>*</span>
                            </FormLabel>
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString() || ''}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Class' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {classes?.map((c: any) => (
                                        <SelectItem key={c.asmcL_Id} value={c.asmcL_Id?.toString() || ''}>
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
                    control={control}
                    name='ASMS_Id'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Section <span className='text-red-500'>*</span>
                            </FormLabel>
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString() || ''}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Section' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {sections?.map((s: any) => (
                                        <SelectItem key={s.asmS_Id} value={s.asmS_Id?.toString() || ''}>
                                            {s.asmC_SectionName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name='ISMS_Id'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Subject <span className='text-red-500'>*</span>
                            </FormLabel>
                            <Select onValueChange={(val) => setValue('ISMS_Id', Number(val))} value={field.value?.toString() || ''}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Subject' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {subjects?.map((s: any) => (
                                        <SelectItem key={s.ismS_Id} value={s.ismS_Id?.toString() || ''}>
                                            {s.ismS_SubjectName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className='flex justify-center'>
                <Button type='button' onClick={handleSubmit(onSearch)} disabled={isPending}>
                    {isPending ? 'Loading...' : 'Get Details'}
                </Button>
            </div>
        </div>
    );
}

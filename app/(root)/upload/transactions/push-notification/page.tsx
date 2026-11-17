// app/(root)/notifications/pushnotification/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Save, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

/* ------------------ Mock Data ------------------ */
const studentList = [
    { id: 1, name: 'Ravi Kumar' },
    { id: 2, name: 'Anita Sharma' },
    { id: 3, name: 'John Alex' }
];

const staffList = [
    { id: 1, name: 'Mr. Suresh' },
    { id: 2, name: 'Ms. Kavitha' }
];

/* ------------------ Schema ------------------ */
const pushNotificationSchema = z.object({
    fromDate: z.date({
        required_error: 'Please select date'
    }),
    message: z.string().min(1, 'Please enter message'),
    students: z.array(z.number()).min(1, 'Select at least one student'),
    staffId: z.string().min(1, 'Select employee name')
});

type FormFields = z.infer<typeof pushNotificationSchema>;

/* ------------------ Component ------------------ */
export default function PushNotificationPage() {
    const [search, setSearch] = useState('');

    const {
        handleSubmit,
        control,
        register,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(pushNotificationSchema),
        mode: 'onChange',
        defaultValues: {
            fromDate: new Date(),
            message: '',
            students: [],
            staffId: ''
        }
    });

    const selectedStudents = watch('students');
    const fromDate = watch('fromDate');

    /* ------------------ Student Logic ------------------ */
    const toggleStudent = (id: number) => {
        const updated = selectedStudents.includes(id) ? selectedStudents.filter((x) => x !== id) : [...selectedStudents, id];

        setValue('students', updated, { shouldValidate: true });
    };

    const selectAllStudents = (checked: boolean) => {
        const allIds = checked ? studentList.map((s) => s.id) : [];
        setValue('students', allIds, { shouldValidate: true });
    };

    /* ------------------ Submit ------------------ */
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        const payload = {
            ...data,
            fromDate: format(data.fromDate, 'dd-MM-yyyy')
        };

        console.log('Final Payload:', payload);
        toast.success('Push Notification Saved');

        reset();
    };

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <div className='mx-auto max-w-4xl'>
                    <Card className='border-0 shadow-xl'>
                        <div className='flex flex-col space-y-6 p-6'>
                            {/* ---------------- DATE ---------------- */}
                            <div className='flex w-full max-w-md items-center justify-between gap-4'>
                                <Label className='whitespace-nowrap font-semibold'>
                                    From Date <span className='text-red-500'>*</span>
                                </Label>

                                <Controller
                                    name='fromDate'
                                    control={control}
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant='outline' className='w-64 justify-start text-left font-normal'>
                                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                                    {field.value ? format(field.value, 'dd-MM-yyyy') : 'Select date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className='w-auto p-0' align='start'>
                                                <Calendar
                                                    mode='single'
                                                    selected={field.value}
                                                    onSelect={(date) => date && field.onChange(date)}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                            </div>
                            {errors.fromDate && (
                                <div className='flex w-full max-w-md justify-end'>
                                    <FormError>{errors.fromDate.message}</FormError>
                                </div>
                            )}

                            {/* ---------------- MESSAGE ---------------- */}
                            <div className='flex w-full max-w-md items-start justify-between gap-4'>
                                <Label className='whitespace-nowrap pt-2 font-semibold'>
                                    Message <span className='text-red-500'>*</span>
                                </Label>

                                <Textarea {...register('message')} className='min-h-[100px] w-64' placeholder='Message description' />
                            </div>
                            {errors.message && (
                                <div className='flex w-full max-w-md justify-end'>
                                    <FormError>{errors.message.message}</FormError>
                                </div>
                            )}

                            {/* ---------------- STUDENTS ---------------- */}
                            <div className='flex w-full max-w-md items-start justify-between gap-4'>
                                <Label className='whitespace-nowrap pt-2 font-semibold'>
                                    Student Name <span className='text-red-500'>*</span>
                                </Label>

                                <div className='w-64 space-y-2'>
                                    <InputText placeholder='Search student...' value={search} onChange={(e) => setSearch(e.target.value)} />

                                    <label className='flex items-center gap-2'>
                                        <input
                                            type='checkbox'
                                            checked={selectedStudents.length === studentList.length}
                                            onChange={(e) => selectAllStudents(e.target.checked)}
                                        />
                                        <span>All</span>
                                    </label>

                                    {studentList
                                        .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
                                        .map((stu) => (
                                            <label key={stu.id} className='flex items-center gap-2'>
                                                <input
                                                    type='checkbox'
                                                    checked={selectedStudents.includes(stu.id)}
                                                    onChange={() => toggleStudent(stu.id)}
                                                />
                                                <span>{stu.name}</span>
                                            </label>
                                        ))}
                                </div>
                            </div>
                            {errors.students && (
                                <div className='flex w-full max-w-md justify-end'>
                                    <FormError>{errors.students.message}</FormError>
                                </div>
                            )}

                            {/* ---------------- STAFF ---------------- */}
                            <div className='flex w-full max-w-md items-center justify-between gap-4'>
                                <Label className='whitespace-nowrap font-semibold'>
                                    Staff Name <span className='text-red-500'>*</span>
                                </Label>

                                <Controller
                                    name='staffId'
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className='w-64'>
                                                <SelectValue placeholder='--Select Staff--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {staffList.map((st) => (
                                                    <SelectItem key={st.id} value={String(st.id)}>
                                                        {st.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            {errors.staffId && (
                                <div className='flex w-full max-w-md justify-end'>
                                    <FormError>{errors.staffId.message}</FormError>
                                </div>
                            )}

                            {/* ---------------- ACTIONS ---------------- */}
                            <div className='flex w-full max-w-md justify-center gap-4 pt-4'>
                                <Button type='submit' disabled={isSubmitting}>
                                    <Save className='mr-2 h-4 w-4' />
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </Button>

                                <Button type='button' variant='outline' onClick={() => reset()}>
                                    <X className='mr-2 h-4 w-4' />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </form>
        </div>
    );
}

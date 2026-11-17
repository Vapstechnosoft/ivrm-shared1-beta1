'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormError, Label } from '@/components/ui/extension/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';

import { cn } from '@/lib/utils';
import { type IVerifyClassWorkSearch, verifyClassWorkSearchSchema } from '@/schemas/upload/transactions/ivrm-classwork.schema';
import {
    getClassDropDownByAcademicYearlist,
    getSectionsDropDownByAcademicYearandClasslist
} from '@/server/exam/exam-module/reports/cumulative-report';
import { SubjectsDropDownByAcademicYearandClassandSection } from '@/server/upload/transactions/ivrm-classwork/server-action';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface SearchFormProps {
    yearList: any[];
    classList: any[];
}

export default function SearchForm({ yearList, classList }: SearchFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const defaultValues: Partial<IVerifyClassWorkSearch> = {
        asmaY_Id: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
        asmcL_Id: searchParams.get('class') ? Number(searchParams.get('class')) : undefined,
        asmS_Id: searchParams.get('section') ? Number(searchParams.get('section')) : undefined,
        ismS_Id: searchParams.get('subject') ? Number(searchParams.get('subject')) : undefined,
        from_date: searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined,
        to_date: searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined
    };

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<IVerifyClassWorkSearch>({
        resolver: zodResolver(verifyClassWorkSearchSchema),
        defaultValues
    });

    const { data: academicyearResponse } = useAcademicYearDropdown();
    //const academicyearResponse  = getAcademicYeardropdown();

    const selectedacademicYear = useWatch({ control, name: 'asmaY_Id' });
    const selectedClassId = useWatch({ control, name: 'asmcL_Id' });
    const [classelist, setClasses] = useState<any[]>([]);
    const [isclassesLoading, setIsClassesLoading] = useState(false);
    const [issectionsLoading, setIsSectionsLoading] = useState(false);
    const selectedSectionid = useWatch({ control, name: 'asmS_Id' });
    const [sectionslist, setSections] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    useEffect(() => {
        if (!selectedacademicYear || selectedacademicYear === 0) {
            setClasses([]);
            setSections([]);
            return;
        }
        setIsClassesLoading(true);
        (async () => {
            try {
                const { data } = await getClassDropDownByAcademicYearlist(selectedacademicYear);

                setClasses(Array.isArray(data) ? data : []);
            } catch {
                toast.error('Failed to load classes');
                setClasses([]);
            }
        })();
        setIsClassesLoading(false);
    }, [selectedacademicYear, setValue]);

    useEffect(() => {
        if (!selectedacademicYear || !selectedClassId || selectedClassId === 0) {
            setSections([]);
            return;
        }
        (async () => {
            try {
                const { data } = await getSectionsDropDownByAcademicYearandClasslist(selectedacademicYear, selectedClassId);
                setSections(Array.isArray(data) ? data : []);
            } catch {
                toast.error('Failed to load sections');
                setSections([]);
            }
        })();
    }, [selectedacademicYear, selectedClassId, setValue]);

    useEffect(() => {
        if (!selectedacademicYear || !selectedClassId || !selectedSectionid) return;
        let mounted = true;
        (async () => {
            try {
                const payload = {
                    asmaY_Id: selectedacademicYear,
                    asmcL_Id: selectedClassId,
                    asmS_Id: selectedSectionid
                };
                console.log('payforsub', payload);
                const { data } = await SubjectsDropDownByAcademicYearandClassandSection(payload);
                if (!mounted) return;
                setSubjects(Array.isArray(data) ? data : []);
                setValue('ismS_Id', 0);
            } catch (error) {
                console.error('Error fetching subjects:', error);
                toast.error('Failed to load subjects');
            }
        })();
        return () => {
            mounted = false;
        };
    }, [selectedacademicYear, selectedClassId, selectedSectionid, setValue]);

    const onSubmit = (data: IVerifyClassWorkSearch) => {
        const params = new URLSearchParams();
        params.set('year', data.asmaY_Id.toString());
        params.set('class', data.asmcL_Id.toString());
        params.set('section', data.asmS_Id.toString());
        params.set('subject', data.ismS_Id.toString());
        params.set('from', data.from_date.toISOString());
        params.set('to', data.to_date.toISOString());
        router.push(`?${params.toString()}`);
    };

    const handleCancel = () => {
        router.push('?');

        setValue('asmaY_Id', undefined as any);
        setValue('asmcL_Id', undefined as any);
        setValue('asmS_Id', undefined as any);
        setValue('ismS_Id', undefined as any);
        setValue('from_date', undefined as any);
        setValue('to_date', undefined as any);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6 rounded-lg border bg-white p-6 shadow-sm'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
                {/* Academic Year */}
                <div className='space-y-1'>
                    <Label className='font-semibold text-sm'>
                        Academic Year :<span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='asmaY_Id'
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='--Select Year--' />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicyearResponse?.data?.map((year: any) => (
                                        <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                            {year.asmaY_Year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                </div>

                {/* Class */}
                <div className='space-y-1'>
                    <Label className='font-semibold text-sm'>
                        Class :<span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='asmcL_Id'
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Class' />
                                </SelectTrigger>
                                <SelectContent>
                                    {isclassesLoading ? (
                                        <SelectItem value='loading' disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : (
                                        classelist?.map((cls: any) => (
                                            <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>
                                                {cls.asmcL_ClassName}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.asmcL_Id && <FormError>{errors.asmcL_Id.message}</FormError>}
                </div>

                {/* Section */}
                <div className='space-y-1'>
                    <Label className='font-semibold text-sm'>
                        Section :<span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='asmS_Id'
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Secction' />
                                </SelectTrigger>
                                <SelectContent>
                                    {issectionsLoading ? (
                                        <SelectItem value='loading' disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : (
                                        sectionslist?.map((cls: any) => (
                                            <SelectItem key={cls.asmS_Id} value={cls.asmS_Id.toString()}>
                                                {cls.asmC_SectionName}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.asmS_Id && <FormError>{errors.asmS_Id.message}</FormError>}
                </div>

                {/* Subject */}
                <div className='space-y-1'>
                    <Label className='font-semibold text-sm'>
                        Subject :<span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='ismS_Id'
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='--Select Subject--' />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((sub: any) => (
                                        <SelectItem key={sub.ismS_Id} value={sub.ismS_Id.toString()}>
                                            {sub.ismS_SubjectName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.ismS_Id && <FormError>{errors.ismS_Id.message}</FormError>}
                </div>

                {/* From Date */}
                <div className='flex flex-col space-y-1'>
                    <Label className='font-semibold text-sm'>
                        From Date <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='from_date'
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                        {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Start Date</span>}
                                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0' align='start'>
                                    <Calendar
                                        mode='single'
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date('1900-01-01')}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.from_date && <FormError>{errors.from_date.message}</FormError>}
                </div>

                {/* To Date */}
                <div className='flex flex-col space-y-1'>
                    <Label className='font-semibold text-sm'>
                        To Date <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='to_date'
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                        {field.value ? format(field.value, 'dd/MM/yyyy') : <span>End Date</span>}
                                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0' align='start'>
                                    <Calendar
                                        mode='single'
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date('1900-01-01')}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.to_date && <FormError>{errors.to_date.message}</FormError>}
                </div>
            </div>

            <div className='flex items-center justify-center gap-4'>
                <Button type='submit' className='bg-blue-700/90 text-white hover:bg-blue-800'>
                    GET LIST
                </Button>
                <Button
                    type='button'
                    variant='destructive'
                    onClick={handleCancel}
                    className='bg-orange-600/90 text-white hover:bg-orange-700'>
                    <X className='mr-1 h-4 w-4' /> CANCEL
                </Button>
            </div>
        </form>
    );
}

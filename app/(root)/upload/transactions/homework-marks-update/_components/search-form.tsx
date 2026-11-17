'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormError, Label } from '@/components/ui/extension/field';
import { useFormContext } from '@/components/ui/form/form-provider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { cn } from '@/lib/utils';
import { type IHomeWork, type IHomeWorkMarksSearch, homeWorkMarksSearchSchema } from '@/schemas/upload/transactions/ivrm-homework.schema';
import {
    getClassDropDownByAcademicYearlist,
    getSectionsDropDownByAcademicYearandClasslist
} from '@/server/exam/exam-module/reports/cumulative-report';
import { SubjectsDropDownByAcademicYearandClassandSection } from '@/server/upload/transactions/ivrm-classwork/server-action';
import { fetchHomeWorkMarksList } from '@/server/upload/transactions/ivrm-homework/server-action';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface SearchFormProps {
    yearList: any[];
    classList: any[];
}

export default function SearchForm({ yearList, classList }: SearchFormProps) {
    const { openDetailsView, closeDetailsView } = useFormContext<IHomeWork>();

    const methods = useForm<IHomeWorkMarksSearch>({
        resolver: zodResolver(homeWorkMarksSearchSchema),
        defaultValues: {
            asmaY_Id: undefined,
            asmcL_Id: undefined,
            asmS_Id: undefined,
            ismS_Id: undefined,
            from_date: undefined,
            to_date: undefined
        }
    });

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
        setValue
    } = methods;

    const { data: academicyearResponse } = useAcademicYearDropdown();

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

    const onSubmit = async (data: IHomeWorkMarksSearch) => {
        try {
            const result = await fetchHomeWorkMarksList(data);
            if (result.gethomework_list && result.gethomework_list.length > 0) {
                // For Marks entry, we typically might need to select a specific homework from a list first
                // if the search returns multiple homeworks.
                // In this simplified mock, we'll just open the view with the first homework found or a placeholder
                openDetailsView({
                    ihW_Id: 1, // Mock ID
                    asmaY_Id: data.asmaY_Id,
                    asmcL_Id: data.asmcL_Id,
                    ismS_Id: data.ismS_Id || 0
                } as any);
            } else {
                toast.info('No homework found for selected criteria');
                closeDetailsView();
            }
        } catch (error) {
            toast.error('Search failed');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <Controller
                control={control}
                name='asmaY_Id'
                render={({ field, fieldState }) => (
                    <div className='grow space-y-2'>
                        <Label>
                            Academic Year <span className='text-red-500'>*</span>
                        </Label>
                        <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Year' />
                            </SelectTrigger>
                            <SelectContent>
                                {academicyearResponse?.data?.map((year: any) => (
                                    <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                        {year.asmaY_Year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                    </div>
                )}
            />

            <Controller
                control={control}
                name='asmcL_Id'
                render={({ field, fieldState }) => (
                    <div className='grow space-y-2'>
                        <Label>
                            Class <span className='text-red-500'>*</span>
                        </Label>
                        <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Class' />
                            </SelectTrigger>
                            <SelectContent>
                                {classelist.map((cls: any) => (
                                    <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>
                                        {cls.asmcL_ClassName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                    </div>
                )}
            />

            <Controller
                control={control}
                name='asmS_Id'
                render={({ field, fieldState }) => (
                    <div className='grow space-y-2'>
                        <Label>
                            Section <span className='text-red-500'>*</span>
                        </Label>
                        <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Section' />
                            </SelectTrigger>
                            <SelectContent>
                                {sectionslist.map((sec: any) => (
                                    <SelectItem key={sec.asmS_Id} value={sec.asmS_Id.toString()}>
                                        {sec.asmC_SectionName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                    </div>
                )}
            />

            <Controller
                control={control}
                name='ismS_Id'
                render={({ field }) => (
                    <div className='grow space-y-2'>
                        <Label>
                            Subject <span className='text-red-500'>*</span>
                        </Label>
                        <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Subject' />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map((sub: any) => (
                                    <SelectItem key={sub.ismS_Id} value={sub.ismS_Id.toString()}>
                                        {sub.ismS_SubjectName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            />

            <Controller
                control={control}
                name='from_date'
                render={({ field }) => (
                    <div className='flex flex-col space-y-2'>
                        <Label>
                            From Date <span className='text-red-500'>*</span>
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant='outline'
                                    className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0'>
                                <Calendar mode='single' selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            />

            <Controller
                control={control}
                name='to_date'
                render={({ field }) => (
                    <div className='flex flex-col space-y-2'>
                        <Label>
                            To Date <span className='text-red-500'>*</span>
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant='outline'
                                    className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0'>
                                <Calendar mode='single' selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            />

            <div className='flex items-end lg:col-span-3'>
                <Button type='submit' className='w-full sm:w-auto' disabled={isSubmitting}>
                    <Search className='mr-2 h-4 w-4' />
                    {isSubmitting ? 'Searching...' : 'Search'}
                </Button>
            </div>
        </form>
    );
}

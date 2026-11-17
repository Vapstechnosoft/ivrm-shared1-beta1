'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBookCirculationReportInitialData } from '@/hooks/library/reports/useBookCirculationReport';
import { cn } from '@/lib/utils';
import type { IBookCirculationReportRequest } from '@/types/library/reports/book-circulation-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Loader2, Search, X } from 'lucide-react';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const reportFormSchema = z
    .object({
        LMAL_Id: z.coerce.number().min(1, 'Library is required'),
        AGType: z.enum(['Student', 'Staff', 'Guest', 'Department', 'all']),
        Type: z.string(),
        TrnType: z.string(),
        Issuecount: z.boolean().optional(),
        IssueFromDate: z.date().optional(),
        IssueToDate: z.date().optional(),
        Duecount: z.boolean().optional(),
        DueFromdate: z.date().optional(),
        DueTodate: z.date().optional(),
        selectedClasslist: z.array(z.object({ asmcL_Id: z.number() })).optional(),
        selectedSectionlist: z.array(z.object({ asmS_Id: z.number() })).optional()
    })
    .refine(
        (data) => {
            if (data.Issuecount) {
                return !!data.IssueFromDate && !!data.IssueToDate;
            }
            return true;
        },
        {
            message: 'Issue dates are required when Issue Date filter is enabled',
            path: ['IssueFromDate']
        }
    )
    .refine(
        (data) => {
            if (data.Duecount) {
                return !!data.DueFromdate && !!data.DueTodate;
            }
            return true;
        },
        {
            message: 'Due dates are required when Due Date filter is enabled',
            path: ['DueFromdate']
        }
    )
    .refine(
        (data) => {
            if (data.AGType === 'Student') {
                const hasClasses = data.selectedClasslist && data.selectedClasslist.length > 0;
                const hasSections = data.selectedSectionlist && data.selectedSectionlist.length > 0;
                return hasClasses && hasSections;
            }
            return true;
        },
        {
            message: 'Class and Section are required for Student',
            path: ['selectedClasslist'] // Highlight class list error, but applies to both
        }
    );

type ReportFormValues = z.infer<typeof reportFormSchema>;

interface ReportFormProps {
    onSearch: (data: IBookCirculationReportRequest) => void;
    isLoading: boolean;
}

export const ReportForm = ({ onSearch, isLoading }: ReportFormProps) => {
    const { data: initialData } = useBookCirculationReportInitialData();

    // Local state for multi-select
    const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
    const [selectedSections, setSelectedSections] = useState<number[]>([]);

    const {
        handleSubmit,
        setValue,
        control,
        reset,
        watch,
        formState: { errors }
    } = useForm<ReportFormValues>({
        resolver: zodResolver(reportFormSchema),
        defaultValues: {
            AGType: 'Student',
            Type: 'all',
            TrnType: 'all',
            Issuecount: false,
            Duecount: false,
            selectedClasslist: [],
            selectedSectionlist: []
        }
    });

    const agType = useWatch({ control, name: 'AGType' });
    const issueCount = useWatch({ control, name: 'Issuecount' });
    const dueCount = useWatch({ control, name: 'Duecount' });
    const issueFromDate = useWatch({ control, name: 'IssueFromDate' });
    const dueFromDate = useWatch({ control, name: 'DueFromdate' });

    // Initialize/Update checkboxes when initial data loads
    useEffect(() => {
        if (initialData?.classList) {
            const allClassIds = Array.isArray(initialData.classList) ? initialData.classList.map((c) => c.asmcL_Id) : [];
            setSelectedClasses(allClassIds);
            setValue('selectedClasslist', Array.isArray(allClassIds) ? allClassIds.map((id) => ({ asmcL_Id: id })) : []);
        }
        if (initialData?.sectionList) {
            const allSectionIds = Array.isArray(initialData.sectionList) ? initialData.sectionList.map((s) => s.asmS_Id) : [];
            setSelectedSections(allSectionIds);
            setValue(
                'selectedSectionlist',
                allSectionIds.map((id) => ({ asmS_Id: id }))
            );
        }
    }, [initialData, setValue]);

    const handleClassToggle = (id: number) => {
        let newSelected = [...selectedClasses];
        if (newSelected.includes(id)) {
            newSelected = newSelected.filter((i) => i !== id);
        } else {
            newSelected.push(id);
        }
        setSelectedClasses(newSelected);
        setValue(
            'selectedClasslist',
            newSelected.map((i) => ({ asmcL_Id: i }))
        );
    };

    const handleAllClassesToggle = (checked: boolean) => {
        if (checked && initialData?.classList) {
            const allIds = Array.isArray(initialData.classList) ? initialData.classList.map((c) => c.asmcL_Id) : [];
            setSelectedClasses(allIds);
            setValue(
                'selectedClasslist',
                allIds.map((i) => ({ asmcL_Id: i }))
            );
        } else {
            setSelectedClasses([]);
            setValue('selectedClasslist', []);
        }
    };

    const handleSectionToggle = (id: number) => {
        let newSelected = [...selectedSections];
        if (newSelected.includes(id)) {
            newSelected = newSelected.filter((i) => i !== id);
        } else {
            newSelected.push(id);
        }
        setSelectedSections(newSelected);
        setValue(
            'selectedSectionlist',
            newSelected.map((i) => ({ asmS_Id: i }))
        );
    };

    const handleAllSectionsToggle = (checked: boolean) => {
        if (checked && initialData?.sectionList) {
            const allIds = Array.isArray(initialData.sectionList) ? initialData.sectionList.map((s) => s.asmS_Id) : [];
            setSelectedSections(allIds);
            setValue(
                'selectedSectionlist',
                allIds.map((i) => ({ asmS_Id: i }))
            );
        } else {
            setSelectedSections([]);
            setValue('selectedSectionlist', []);
        }
    };

    const onSubmit = (data: ReportFormValues) => {
        // Transform dates to string if needed by backend, or types handle it
        // The interface expects strings, but hook form has dates.
        // We'll cast/transform in the submit handler prop or just pass simplified obj
        const requestData: IBookCirculationReportRequest = {
            ...data,
            IssueFromDate: data.IssueFromDate ? format(data.IssueFromDate, 'yyyy-MM-dd') : undefined,
            IssueToDate: data.IssueToDate ? format(data.IssueToDate, 'yyyy-MM-dd') : undefined,
            DueFromdate: data.DueFromdate ? format(data.DueFromdate, 'yyyy-MM-dd') : undefined,
            DueTodate: data.DueTodate ? format(data.DueTodate, 'yyyy-MM-dd') : undefined
        };
        onSearch(requestData);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg'>Filters</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        {/* Library */}
                        <div>
                            <Label>
                                Library Name <span className='text-red-500'>*</span>
                            </Label>
                            <Select onValueChange={(v) => setValue('LMAL_Id', Number(v))}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Library' />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.isArray(initialData?.lib_list) &&
                                        initialData?.lib_list?.map((lib) => (
                                            <SelectItem key={lib.lmaL_Id} value={lib.lmaL_Id.toString()}>
                                                {lib.lmaL_LibraryName}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            {errors.LMAL_Id && <p className='text-red-500 text-sm'>{errors.LMAL_Id.message}</p>}
                        </div>

                        {/* Member Type */}
                        <div>
                            <Label className='mb-2 block'>Member Type</Label>
                            <RadioGroup
                                defaultValue='Student'
                                onValueChange={(v) => setValue('AGType', v as any)}
                                className='flex flex-wrap gap-4 rounded-md border p-4'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Student' id='r-student' />
                                    <Label htmlFor='r-student'>Student</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Staff' id='r-staff' />
                                    <Label htmlFor='r-staff'>Staff</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Guest' id='r-guest' />
                                    <Label htmlFor='r-guest'>Guest</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Department' id='r-dept' />
                                    <Label htmlFor='r-dept'>Department</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Book Type */}
                        <div>
                            <Label className='mb-2 block'>Book Type</Label>
                            <RadioGroup
                                defaultValue='all'
                                onValueChange={(v) => setValue('Type', v)}
                                className='grid grid-cols-2 gap-2 rounded-md border p-4 md:grid-cols-3'>
                                {['all', 'Issue', 'Reference', 'Issuable', 'ReferenceonlyIssuable', 'ReferenceonlyNon-Issuable'].map(
                                    (type) => (
                                        <div key={type} className='flex items-center space-x-2'>
                                            <RadioGroupItem value={type} id={`bt-${type}`} />
                                            <Label htmlFor={`bt-${type}`}>{type === 'all' ? 'ALL' : type}</Label>
                                        </div>
                                    )
                                )}
                            </RadioGroup>
                        </div>

                        {/* Transaction Status */}
                        <div>
                            <Label className='mb-2 block'>Transaction Status</Label>
                            <RadioGroup
                                defaultValue='all'
                                onValueChange={(v) => setValue('TrnType', v)}
                                className='flex gap-4 rounded-md border p-4'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='all' id='t-all' />
                                    <Label htmlFor='t-all'>ALL</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Issue' id='t-issue' />
                                    <Label htmlFor='t-issue'>Issue</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Return' id='t-return' />
                                    <Label htmlFor='t-return'>Return</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>

                <div className='space-y-6'>
                    {/* Student Filters */}
                    {agType === 'Student' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className='text-lg'>Student Filters</CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                {/* Class Selection */}
                                <div>
                                    <Label>
                                        Class Name <span className='text-red-500'>*</span>
                                    </Label>
                                    <div className='h-40 space-y-2 overflow-y-auto rounded-md border p-2'>
                                        <div className='flex items-center space-x-2 border-b pb-2'>
                                            <Checkbox
                                                id='cls-all'
                                                checked={
                                                    Array.isArray(initialData?.classList) &&
                                                    initialData?.classList?.length === selectedClasses.length
                                                }
                                                onCheckedChange={(checked) => handleAllClassesToggle(checked as boolean)}
                                            />
                                            <Label htmlFor='cls-all' className='font-bold'>
                                                All
                                            </Label>
                                        </div>
                                        {Array.isArray(initialData?.classList) &&
                                            initialData?.classList?.map((cls) => (
                                                <div key={cls.asmcL_Id} className='flex items-center space-x-2'>
                                                    <Checkbox
                                                        id={`cls-${cls.asmcL_Id}`}
                                                        checked={selectedClasses.includes(cls.asmcL_Id)}
                                                        onCheckedChange={() => handleClassToggle(cls.asmcL_Id)}
                                                    />
                                                    <Label htmlFor={`cls-${cls.asmcL_Id}`}>{cls.asmcL_ClassName}</Label>
                                                </div>
                                            ))}
                                    </div>
                                    {errors.selectedClasslist && <p className='text-red-500 text-sm'>{errors.selectedClasslist.message}</p>}
                                </div>

                                {/* Section Selection */}
                                <div>
                                    <Label>
                                        Section Name <span className='text-red-500'>*</span>
                                    </Label>
                                    <div className='h-40 space-y-2 overflow-y-auto rounded-md border p-2'>
                                        <div className='flex items-center space-x-2 border-b pb-2'>
                                            <Checkbox
                                                id='sec-all'
                                                checked={
                                                    Array.isArray(initialData?.sectionList) &&
                                                    initialData?.sectionList?.length === selectedSections.length
                                                }
                                                onCheckedChange={(checked) => handleAllSectionsToggle(checked as boolean)}
                                            />
                                            <Label htmlFor='sec-all' className='font-bold'>
                                                All
                                            </Label>
                                        </div>
                                        {Array.isArray(initialData?.sectionList) &&
                                            initialData?.sectionList?.map((sec) => (
                                                <div key={sec.asmS_Id} className='flex items-center space-x-2'>
                                                    <Checkbox
                                                        id={`sec-${sec.asmS_Id}`}
                                                        checked={selectedSections.includes(sec.asmS_Id)}
                                                        onCheckedChange={() => handleSectionToggle(sec.asmS_Id)}
                                                    />
                                                    <Label htmlFor={`sec-${sec.asmS_Id}`}>{sec.asmC_SectionName}</Label>
                                                </div>
                                            ))}
                                    </div>
                                    {errors.selectedSectionlist && (
                                        <p className='text-red-500 text-sm'>{errors.selectedSectionlist.message}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Date Filters */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg'>Date Filters</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            {/* Issue Date */}
                            <div className='space-y-2'>
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        id='issue-count'
                                        checked={issueCount}
                                        onCheckedChange={(c) => setValue('Issuecount', c as boolean)}
                                    />
                                    <Label htmlFor='issue-count'>Issue Date</Label>
                                </div>
                                {issueCount && (
                                    <div className='flex gap-2'>
                                        <div className='flex-1'>
                                            <CalendarDatePicker
                                                date={issueFromDate}
                                                setDate={(d) => setValue('IssueFromDate', d)}
                                                placeholder='From Date'
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <CalendarDatePicker
                                                date={watch('IssueToDate')}
                                                setDate={(d) => setValue('IssueToDate', d)}
                                                placeholder='To Date'
                                                minDate={issueFromDate}
                                            />
                                        </div>
                                    </div>
                                )}
                                {errors.IssueFromDate && <p className='text-red-500 text-sm'>{errors.IssueFromDate.message}</p>}
                            </div>

                            {/* Due Date */}
                            <div className='space-y-2'>
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        id='due-count'
                                        checked={dueCount}
                                        onCheckedChange={(c) => setValue('Duecount', c as boolean)}
                                    />
                                    <Label htmlFor='due-count'>Due Date</Label>
                                </div>
                                {dueCount && (
                                    <div className='flex gap-2'>
                                        <div className='flex-1'>
                                            <CalendarDatePicker
                                                date={dueFromDate}
                                                setDate={(d) => setValue('DueFromdate', d)}
                                                placeholder='From Date'
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <CalendarDatePicker
                                                date={watch('DueTodate')}
                                                setDate={(d) => setValue('DueTodate', d)}
                                                placeholder='To Date'
                                                minDate={dueFromDate}
                                            />
                                        </div>
                                    </div>
                                )}
                                {errors.DueFromdate && <p className='text-red-500 text-sm'>{errors.DueFromdate.message}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className='flex justify-center gap-4'>
                <Button type='submit' disabled={isLoading}>
                    {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Search className='mr-2 h-4 w-4' />}
                    Report
                </Button>
                <Button type='button' variant='destructive' onClick={() => reset()}>
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                </Button>
            </div>
        </form>
    );
};

function CalendarDatePicker({
    date,
    setDate,
    placeholder,
    minDate
}: { date?: Date; setDate: (d?: Date) => void; placeholder: string; minDate?: Date }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? format(date, 'PPP') : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
                <Calendar
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => (minDate ? date < minDate : false)}
                />
            </PopoverContent>
        </Popover>
    );
}

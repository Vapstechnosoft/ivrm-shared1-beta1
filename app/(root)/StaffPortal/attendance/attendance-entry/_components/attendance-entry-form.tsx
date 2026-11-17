'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAttendanceEntry } from '@/hooks/staff-portal/useAttendanceEntry';
import { cn } from '@/lib/utils';
import type { IAttendanceConfig, IAttendanceEntryInitialData, IStandardConfig } from '@/types/staff-portal/attendance-entry';
import { type AttendanceEntryValues, attendanceEntrySchema } from '@/types/staff-portal/attendance-entry-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Eye, RefreshCcw, Save, Trash, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AttendanceGrid from './attendance-grid';
import ViewHistoryModal from './view-history-modal';

const AttendanceEntryForm = () => {
    const [selectedYearId, setSelectedYearId] = useState<number>(0);

    const form = useForm<AttendanceEntryValues>({
        resolver: zodResolver(attendanceEntrySchema),
        defaultValues: {
            asmaY_Id: 0,
            asmcL_Id: 0,
            entry: '',
            asmC_Id: 0,
            ASA_Entry_DateTime: new Date(),
            ASA_Regular_Extra: 'Regular'
        }
    });

    const { watch, setValue } = form;
    const currentEntry = watch('entry');
    const currentYear = watch('asmaY_Id');
    const currentClass = watch('asmcL_Id');
    const currentSection = watch('asmC_Id');
    const currentDate = watch('ASA_Entry_DateTime');
    const currentMonth = watch('ivrM_Month_Id');
    const currentSubject = watch('ismS_Id');
    const currentBatch = watch('asasB_Id');
    const currentPeriod = watch('ttmP_Id');

    const {
        initialData: rawInitialData,
        isLoadingInitial,
        getStudentData,
        getMonthClassHeld,
        getDateWiseAttendance,
        getBatchList,
        getStdListPeriod,
        saveAttendance,
        deleteAttendance,
        viewHistory
    } = useAttendanceEntry(Number(currentYear));

    const initialData = rawInitialData as IAttendanceEntryInitialData | undefined;

    const [studentList, setStudentList] = useState<any[]>([]);
    const [entryFlag, setEntryFlag] = useState(false);
    const [studentGrid, setStudentGrid] = useState(false);
    const [countClass, setCountClass] = useState<number | string>(0);
    const [config, setConfig] = useState<IAttendanceConfig | null>(null);
    const [stdConfig, setStdConfig] = useState<IStandardConfig | null>(null);
    const [attEntryTypeFlag, setAttEntryTypeFlag] = useState('');
    const [updateId, setUpdateId] = useState(0);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Initial Year Load
    useEffect(() => {
        if (initialData?.academicYearList?.length && !currentYear) {
            form.setValue('asmaY_Id', initialData.academicYearList[0].asmaY_Id);
        }
    }, [initialData, form, currentYear]);

    // Handle Class Change -> Get Settings and Entry Type
    useEffect(() => {
        if (Number(currentYear) > 0 && Number(currentClass) > 0) {
            const data = {
                ASMAY_Id: Number(currentYear),
                ASMCL_Id: Number(currentClass),
                classsecflag: '1'
            };

            getStudentData.mutate(data, {
                onSuccess: (res: any) => {
                    if (res) {
                        setAttEntryTypeFlag(res.attendanceentryflag);
                        setConfig(res.admissionstandarad?.[0]);
                        setStdConfig(res.getstandarad?.[0]);

                        if (res.asA_Att_EntryType) {
                            const type =
                                res.asA_Att_EntryType === 'D'
                                    ? 'Dailyonce'
                                    : res.asA_Att_EntryType === 'H'
                                      ? 'Dailytwice'
                                      : res.asA_Att_EntryType === 'M'
                                        ? 'monthly'
                                        : 'period';
                            setValue('entry', type);
                            setEntryFlag(true);
                        } else {
                            setEntryFlag(false);
                            toast.error('Attendance settings not found for this class');
                        }
                    }
                }
            });
        }
    }, [currentYear, currentClass]);

    // Load Student List for Daily Once/Twice
    useEffect(() => {
        if (
            Number(currentYear) > 0 &&
            Number(currentClass) > 0 &&
            Number(currentSection) > 0 &&
            currentDate &&
            (currentEntry === 'Dailyonce' || currentEntry === 'Dailytwice')
        ) {
            const entry = currentEntry === 'Dailyonce' ? 'D' : 'H';
            const data = {
                ASMAY_Id: Number(currentYear),
                ASMCL_Id: Number(currentClass),
                ASMS_Id: Number(currentSection),
                monthflag1: currentEntry,
                ASA_FromDate: format(new Date(currentDate), 'yyyy-MM-dd'),
                monthflag: entry,
                checksubject: '1'
            };
            getStudentData.mutate(data, {
                onSuccess: (res: any) => {
                    if (res.studentList?.length) {
                        processStudentList(res);
                    } else {
                        setStudentGrid(false);
                        setStudentList([]);
                        toast.error('No students found for selected section');
                    }
                }
            });
        }
    }, [currentSection, currentDate]);

    // Load Student List for Monthly
    useEffect(() => {
        if (
            Number(currentYear) > 0 &&
            Number(currentClass) > 0 &&
            Number(currentSection) > 0 &&
            Number(currentMonth) > 0 &&
            currentEntry === 'monthly'
        ) {
            const data = {
                ASMAY_Id: Number(currentYear),
                ASMCL_Id: Number(currentClass),
                ASMS_Id: Number(currentSection),
                monthid: Number(currentMonth),
                monthflag: 'M',
                monthflag1: 'monthly',
                ASA_FromDate: format(new Date(), 'yyyy-MM-dd')
            };
            getMonthClassHeld.mutate(data, {
                onSuccess: (res: any) => {
                    if (res) {
                        setCountClass(res.countclass || 0);
                        processStudentList(res);
                        if (res.startdate) setValue('ASA_FromDate', new Date(res.startdate));
                        if (res.enddate) setValue('ASA_ToDate', new Date(res.enddate));
                    }
                }
            });
        }
    }, [currentSection, currentMonth]);

    // Load Student List for Period Wise
    useEffect(() => {
        if (
            Number(currentYear) > 0 &&
            Number(currentClass) > 0 &&
            Number(currentSection) > 0 &&
            currentEntry === 'period' &&
            Number(currentPeriod) > 0 &&
            currentDate
        ) {
            const data = {
                ASMAY_Id: Number(currentYear),
                ASMCL_Id: Number(currentClass),
                ASMS_Id: Number(currentSection),
                ismS_Id: Number(currentSubject),
                TTMP_Id: Number(currentPeriod),
                monthflag: 'P',
                monthflag1: 'period',
                ASA_FromDate: format(new Date(currentDate), 'yyyy-MM-dd'),
                asasB_Id: Number(currentBatch) || 0
            };
            getStdListPeriod.mutate(data, {
                onSuccess: (res: any) => {
                    if (res.studentList?.length) {
                        processStudentList(res);
                    } else {
                        setStudentGrid(false);
                        setStudentList([]);
                    }
                }
            });
        }
    }, [currentSection, currentPeriod, currentDate, currentBatch]);

    const processStudentList = (res: any) => {
        setStudentGrid(true);
        setUpdateId(res.countclass1 || 0);

        let finalStudents = [...res.studentList];

        // Apply initial state based on entry flags (A or P)
        if (res.asA_Att_EntryType === 'D') {
            finalStudents = finalStudents.map((s) => ({
                ...s,
                selected: res.attendanceentryflag === 'A' ? s.pdays === 0 : s.pdays > 0
            }));
        } else if (res.asA_Att_EntryType === 'H') {
            finalStudents = finalStudents.map((s) => {
                let f = false;
                let sc = false;
                if (res.attendanceentryflag === 'A') {
                    if (s.pdays === 0.5) {
                        if (s.asA_Dailytwice_Flag === 'firsthalf') sc = true;
                        else f = true;
                    } else if (s.pdays === 0) {
                        f = true;
                        sc = true;
                    }
                } else {
                    // P
                    if (s.pdays === 0.5) {
                        if (s.asA_Dailytwice_Flag === 'firsthalf') f = true;
                        else sc = true;
                    } else if (s.pdays === 1) {
                        f = true;
                        sc = true;
                    }
                }
                return { ...s, FirstHalfflag: f, SecondHalfflag: sc };
            });
        } else if (res.asA_Att_EntryType === 'P') {
            finalStudents = finalStudents.map((s) => ({
                ...s,
                selected: res.attendanceentryflag === 'A' ? s.pdays === 0 : s.pdays > 0
            }));
        }

        setStudentList(finalStudents);
    };

    const onSave = (values: AttendanceEntryValues) => {
        console.log('Save Clicked');
        let ASA_ClassHeld = '1.00';
        let fromDateStr = currentDate ? format(new Date(currentDate), 'yyyy-MM-dd') : '';
        let toDateStr = currentDate ? format(new Date(currentDate), 'yyyy-MM-dd') : '';

        if (currentEntry === 'monthly') {
            ASA_ClassHeld = String(countClass);
            fromDateStr = watch('ASA_FromDate') ? format(new Date(watch('ASA_FromDate')!), 'yyyy-MM-dd') : '';
            toDateStr = watch('ASA_ToDate') ? format(new Date(watch('ASA_ToDate')!), 'yyyy-MM-dd') : '';
        }

        const updatedStdList = studentList.map((student) => ({
            ...student,
            asA_Dailytwice_Flag: student.asA_Dailytwice_Flag ?? ' '
        }));

        const payload = {
            ASA_Id: updateId,
            ismS_Id: Number(currentSubject) || 0,
            ASMAY_Id: Number(currentYear),
            ASA_Att_Type: currentEntry || '',
            ASMCL_Id: Number(currentClass),
            ASMS_Id: Number(currentSection) || 0,
            TTMP_Id: Number(currentPeriod) || 0,
            ASA_Entry_DateTime: new Date().toISOString(),
            ASA_FromDate: fromDateStr,
            ASA_ToDate: toDateStr,
            ASA_ClassHeld: ASA_ClassHeld,
            ASA_Regular_Extra: watch('ASA_Regular_Extra') || 'Regular',
            asasB_Id: Number(currentBatch) || 0,
            //stdList: studentList,
            stdList: updatedStdList
        };

        console.log('Save payload', payload);

        console.log(JSON.stringify(payload));
        saveAttendance.mutate(payload, {
            onSuccess: (res) => {
                if (res.returnval) {
                    window.location.reload();
                }
            }
        });
    };

    const onDelete = () => {
        const payload = {
            ASA_Id: updateId,
            ismS_Id: Number(currentSubject) || 0,
            ASMAY_Id: Number(currentYear),
            ASA_Att_Type: currentEntry || '',
            ASMCL_Id: Number(currentClass),
            ASMS_Id: Number(currentSection) || 0,
            TTMP_Id: Number(currentPeriod) || 0,
            ASA_Entry_DateTime: format(new Date(), 'yyyy-MM-dd'),
            ASA_FromDate: currentDate ? format(new Date(currentDate), 'yyyy-MM-dd') : '',
            ASA_ToDate: currentDate ? format(new Date(currentDate), 'yyyy-MM-dd') : '',
            ASA_ClassHeld: currentEntry === 'monthly' ? String(countClass) : '1.00',
            ASA_Regular_Extra: watch('ASA_Regular_Extra'),
            asasB_Id: Number(currentBatch) || 0,
            stdList: studentList
        };
        deleteAttendance.mutate(payload, {
            onSuccess: (res) => {
                if (res.returnval) window.location.reload();
            }
        });
    };

    return (
        <div className='space-y-6'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSave)} className='space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg'>Filter Selection</CardTitle>
                        </CardHeader>
                        <CardContent className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name='asmaY_Id'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Academic Year <span className='text-destructive'>*</span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={(val) => {
                                                field.onChange(Number(val));
                                                setEntryFlag(false);
                                                setStudentGrid(false);
                                            }}
                                            value={field.value?.toString() || ''}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select Academic Year' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {((initialData as any)?.academicYearList || []).map((year: any) => (
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
                                        <Select
                                            onValueChange={(val) => {
                                                field.onChange(Number(val));
                                                setStudentGrid(false);
                                            }}
                                            value={field.value?.toString() || ''}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select Class' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {((initialData as any)?.classList || []).map((cls: any) => (
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
                        </CardContent>
                    </Card>

                    {entryFlag && (
                        <Card className='fade-in slide-in-from-top-4 animate-in'>
                            <CardHeader className='flex flex-row items-center justify-between'>
                                <CardTitle className='text-lg'>Attendance Entry Inputs</CardTitle>
                                {Number(currentSection) > 0 && (
                                    <Button type='button' variant='outline' size='sm' onClick={() => setIsHistoryOpen(true)}>
                                        <Eye className='mr-2 h-4 w-4' /> View Period Wise Attendance
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className='space-y-6'>
                                <div className='flex justify-center gap-8 rounded-lg bg-muted p-4'>
                                    {['Dailyonce', 'Dailytwice', 'monthly', 'period'].map((type) => (
                                        <div key={type} className='flex items-center space-x-2'>
                                            <RadioGroup disabled value={currentEntry || ''}>
                                                <RadioGroupItem value={type} id={type} />
                                            </RadioGroup>
                                            <Label htmlFor={type} className='capitalize'>
                                                {type.replace('once', ' Once').replace('twice', ' Twice').replace('period', 'Period Wise')}
                                            </Label>
                                        </div>
                                    ))}
                                </div>

                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                    <FormField
                                        control={form.control}
                                        name='asmC_Id'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Section <span className='text-destructive'>*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(val) => field.onChange(Number(val))}
                                                    value={field.value?.toString() || ''}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select Section' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {((initialData as any)?.sectionList || []).map((sec: any) => (
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

                                    {currentEntry !== 'monthly' && (
                                        <FormField
                                            control={form.control}
                                            name='ASA_Entry_DateTime'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        DOE <span className='text-destructive'>*</span>
                                                    </FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={'outline'}
                                                                    className={cn(
                                                                        'w-full pl-3 text-left font-normal',
                                                                        !field.value && 'text-muted-foreground'
                                                                    )}>
                                                                    {field.value ? (
                                                                        format(new Date(field.value), 'PPP')
                                                                    ) : (
                                                                        <span>Pick a date</span>
                                                                    )}
                                                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className='w-auto p-0' align='start'>
                                                            <Calendar
                                                                mode='single'
                                                                selected={field.value ? new Date(field.value) : undefined}
                                                                onSelect={field.onChange}
                                                                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {currentEntry === 'monthly' && (
                                        <>
                                            <FormField
                                                control={form.control}
                                                name='ivrM_Month_Id'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Month <span className='text-destructive'>*</span>
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={(val) => field.onChange(Number(val))}
                                                            value={field.value?.toString() || ''}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder='Select Month' />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {((initialData as any)?.monthList || []).map((m: any) => (
                                                                    <SelectItem key={m.ivrM_Month_Id} value={m.ivrM_Month_Id.toString()}>
                                                                        {m.ivrM_Month_Name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className='flex items-center font-semibold text-primary text-sm'>
                                                Total Class Helds: {countClass}
                                            </div>
                                        </>
                                    )}

                                    {currentEntry === 'period' && (
                                        <>
                                            <FormField
                                                control={form.control}
                                                name='ismS_Id'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Subject <span className='text-destructive'>*</span>
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={(val) => field.onChange(Number(val))}
                                                            value={field.value?.toString() || ''}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder='Select Subject' />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {((initialData as any)?.subjectList || []).map((s: any) => (
                                                                    <SelectItem key={s.ismS_Id} value={s.ismS_Id.toString()}>
                                                                        {s.ismS_SubjectName}
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
                                                name='ttmP_Id'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Period <span className='text-destructive'>*</span>
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={(val) => field.onChange(Number(val))}
                                                            value={field.value?.toString() || ''}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder='Select Period' />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {((initialData as any)?.periodlist || []).map((p: any) => (
                                                                    <SelectItem key={p.ttmP_Id} value={p.ttmP_Id.toString()}>
                                                                        {p.ttmP_PeriodName}
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
                                                name='asasB_Id'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Batch</FormLabel>
                                                        <Select
                                                            onValueChange={(val) => field.onChange(Number(val))}
                                                            value={field.value?.toString() || ''}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder='Select Batch' />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {((initialData as any)?.batchList || []).map((b: any) => (
                                                                    <SelectItem key={b.asasB_Id} value={b.asasB_Id.toString()}>
                                                                        {b.asasB_BatchName}
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
                                                name='ASA_Regular_Extra'
                                                render={({ field }) => (
                                                    <FormItem className='space-y-3'>
                                                        <FormLabel>
                                                            Entry Type <span className='text-destructive'>*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <RadioGroup
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                                className='flex flex-row space-x-4'>
                                                                <FormItem className='flex items-center space-x-2 space-y-0'>
                                                                    <FormControl>
                                                                        <RadioGroupItem value='Regular' />
                                                                    </FormControl>
                                                                    <FormLabel className='font-normal'>Regular</FormLabel>
                                                                </FormItem>
                                                                <FormItem className='flex items-center space-x-2 space-y-0'>
                                                                    <FormControl>
                                                                        <RadioGroupItem value='Extra Period' />
                                                                    </FormControl>
                                                                    <FormLabel className='font-normal'>Extra Period</FormLabel>
                                                                </FormItem>
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {studentGrid && (
                        <Card className='fade-in slide-in-from-top-4 animate-in'>
                            <CardHeader>
                                <CardTitle className='text-lg'>Student Details</CardTitle>
                                <div className='font-medium text-blue-600 text-sm'>
                                    {attEntryTypeFlag === 'A' ? 'Attendance Entry Type Is Absent' : 'Attendance Entry Type Is Present'}
                                </div>
                            </CardHeader>
                            <CardContent className='space-y-6'>
                                <AttendanceGrid
                                    students={studentList}
                                    setStudents={setStudentList}
                                    entryType={currentEntry}
                                    config={config}
                                    stdConfig={stdConfig}
                                    countClass={Number(countClass)}
                                />

                                <div className='mt-6 flex justify-center gap-4'>
                                    <Button type='submit' className='bg-primary hover:bg-primary/90' disabled={saveAttendance.isPending}>
                                        {updateId > 0 ? <RefreshCcw className='mr-2 h-4 w-4' /> : <Save className='mr-2 h-4 w-4' />}
                                        {updateId > 0 ? 'Update' : 'Save'}
                                    </Button>

                                    {updateId > 0 && (
                                        <Button
                                            type='button'
                                            variant='destructive'
                                            onClick={onDelete}
                                            disabled={deleteAttendance.isPending}>
                                            <Trash className='mr-2 h-4 w-4' /> Delete
                                        </Button>
                                    )}

                                    <Button type='button' variant='outline' onClick={() => window.location.reload()}>
                                        <X className='mr-2 h-4 w-4' /> Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </form>
            </Form>

            <ViewHistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                yearId={Number(currentYear)}
                classId={Number(currentClass)}
                sectionId={Number(currentSection)}
                entryType={currentEntry}
                viewHistoryMutation={viewHistory}
            />
        </div>
    );
};

export default AttendanceEntryForm;

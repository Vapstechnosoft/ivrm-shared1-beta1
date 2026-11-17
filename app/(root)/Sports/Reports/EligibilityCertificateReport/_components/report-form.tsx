'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eligibilityCertificateReportSchema, type IEligibilityCertificateReport } from '@/types/sports/reports/eligibility-certificate-report';
import { useEligibilityCertificateReport } from '@/hooks/sports/useEligibilityCertificateReport';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'sonner';
import { FileText, X, Printer, FileSpreadsheet, Loader2 } from 'lucide-react';

interface ReportFormProps {
    onReport: (data: any) => void;
    onReset: () => void;
    onPrint: () => void;
    onExcel: () => void;
    hasData: boolean;
}

export default function ReportForm({ onReport, onReset, onPrint, onExcel, hasData }: ReportFormProps) {
    const { data: loadGridData, getStudents, getAge, generateReport } = useEligibilityCertificateReport();
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const { control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<IEligibilityCertificateReport>({
        resolver: zodResolver(eligibilityCertificateReportSchema),
        defaultValues: {
            optionflag: 'SCHOOL',
            asmaY_Id: 0,
            asmcL_Id: 0, // This is for student selection filter if needed, but here it seems read-only from student
            asmS_Id: 0,
            spccmE_Id: 0,
            amsT_Date: new Date(),
            spccsH_Age: '',
            studentList: []
        }
    });

    const watchedAsmaY_Id = watch('asmaY_Id');
    const watchedAmsT_Date = watch('amsT_Date');

    // Load Students when Year changes
    useEffect(() => {
        if (watchedAsmaY_Id) {
            getStudents.mutateAsync({ ASMAY_Id: watchedAsmaY_Id });
        }
    }, [watchedAsmaY_Id]);

    // Handle Student Selection
    const handleStudentChange = (amsT_Id: number) => {
        const student = getStudents.data?.studentList?.find((s: any) => s.amsT_Id === amsT_Id);
        if (student) {
            setSelectedStudent(student);
            setValue('asmcL_Id', student.asmcL_Id || 1); // Mock IDs
            setValue('asmS_Id', student.asmS_Id || 1);
            // In the JS, they fetch age when student is selected
            fetchAge(amsT_Id, watchedAmsT_Date);
        }
    };

    const fetchAge = async (amsT_Id: number, date: Date) => {
        if (amsT_Id && date) {
            const res = await getAge.mutateAsync({
                AMST_Id: amsT_Id,
                AMST_Date: date.toDateString()
            });
            if (res.age_tilldate?.[0]) {
                setValue('spccsH_Age', res.age_tilldate[0].spccsH_Age);
            }
        }
    };

    // Refetch age if date changes
    useEffect(() => {
        if (selectedStudent && watchedAmsT_Date) {
            fetchAge(selectedStudent.amsT_Id, watchedAmsT_Date);
        }
    }, [watchedAmsT_Date]);

    const onSubmit = async (values: IEligibilityCertificateReport) => {
        if (!selectedStudent) {
            toast.error('Please select a student');
            return;
        }

        const res = await generateReport.mutateAsync({
            ...values,
            studentList: [{ ...selectedStudent, Selected: true }]
        });

        if (res.success) {
            onReport(res);
        } else {
            toast.error(res.message || 'No records found');
        }
    };

    const handleCancel = () => {
        reset();
        setSelectedStudent(null);
        onReset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* School / College Option */}
            <div className='flex justify-center'>
                <Controller
                    name='optionflag'
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className='flex gap-8 border p-4 rounded-md bg-muted/30'
                        >
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='SCHOOL' id='school' />
                                <Label htmlFor='school' className='cursor-pointer font-bold'>SCHOOL</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='COLLEGE' id='college' />
                                <Label htmlFor='college' className='cursor-pointer font-bold'>COLLEGE</Label>
                            </div>
                        </RadioGroup>
                    )}
                />
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Left Column */}
                <div className='space-y-4'>
                    {/* Academic Year */}
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right'>Academic Year <span className='text-destructive'>*</span></Label>
                        <div className='col-span-3'>
                            <Controller
                                name='asmaY_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Academic Year' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {loadGridData?.yearlist?.map((y: any) => (
                                                <SelectItem key={y.asmaY_Id} value={y.asmaY_Id.toString()}>{y.asmaY_Year}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.asmaY_Id && <span className='text-xs text-destructive'>{errors.asmaY_Id.message}</span>}
                        </div>
                    </div>

                    {/* Class (Read-only) */}
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right'>Class <span className='text-destructive'>*</span></Label>
                        <div className='col-span-3'>
                            <Input
                                value={selectedStudent?.classname || ''}
                                placeholder='Class Name'
                                disabled
                                className='bg-muted'
                            />
                        </div>
                    </div>

                    {/* Event Name */}
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right'>Event Name <span className='text-destructive'>*</span></Label>
                        <div className='col-span-3'>
                            <Controller
                                name='spccmE_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Event Name' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {loadGridData?.eventList?.map((e: any) => (
                                                <SelectItem key={e.spccmE_Id} value={e.spccmE_Id.toString()}>{e.spccmE_EventName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.spccmE_Id && <span className='text-xs text-destructive'>{errors.spccmE_Id.message}</span>}
                        </div>
                    </div>

                    {/* Date */}
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right'>Date <span className='text-destructive'>*</span></Label>
                        <div className='col-span-3'>
                            <Controller
                                name='amsT_Date'
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                    />
                                )}
                            />
                            {errors.amsT_Date && <span className='text-xs text-destructive'>{errors.amsT_Date.message}</span>}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className='space-y-4'>
                    {/* Student Name */}
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right'>Student Name <span className='text-destructive'>*</span></Label>
                        <div className='col-span-3'>
                            <Select onValueChange={(val) => handleStudentChange(Number(val))} value={selectedStudent?.amsT_Id?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Student' />
                                </SelectTrigger>
                                <SelectContent>
                                    {getStudents.data?.studentList?.map((s: any) => (
                                        <SelectItem key={s.amsT_Id} value={s.amsT_Id.toString()}>
                                            {s.studentname} ({s.adm_no})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Section (Read-only) */}
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right'>Section <span className='text-destructive'>*</span></Label>
                        <div className='col-span-3'>
                            <Input
                                value={selectedStudent?.sectionname || ''}
                                placeholder='Section Name'
                                disabled
                                className='bg-muted'
                            />
                        </div>
                    </div>

                    {/* Age Till Date */}
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right'>Age Till Date</Label>
                        <div className='col-span-3'>
                            <Controller
                                name='spccsH_Age'
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder='Age'
                                        disabled
                                        className='bg-muted'
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex justify-center gap-4 pt-4 border-t'>
                <Button type='submit' className='bg-primary' disabled={generateReport.isPending}>
                    {generateReport.isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <FileText className='mr-2 h-4 w-4' />}
                    Report
                </Button>
                <Button type='button' variant='outline' onClick={handleCancel}>
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                </Button>
                <Button type='button' className='bg-blue-600 hover:bg-blue-700' onClick={onPrint} disabled={!hasData}>
                    <Printer className='mr-2 h-4 w-4' />
                    Print
                </Button>
                <Button type='button' className='bg-green-600 hover:bg-green-700' onClick={onExcel} disabled={!hasData}>
                    <FileSpreadsheet className='mr-2 h-4 w-4' />
                    Excel
                </Button>
            </div>
        </form>
    );
}

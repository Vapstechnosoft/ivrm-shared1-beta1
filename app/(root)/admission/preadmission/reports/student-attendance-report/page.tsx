'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePickerWithYear } from '@/components/ui/date-picker-year';
import { FormError, Label } from '@/components/ui/extension/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { DataTableRef } from '@/components/ui/data-table/data-table';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useAcademicYearDropdown, useMasterClassDropdown, useMasterSectionDropdown } from '@/hooks/admission/preadmission/useMasters';
import { useStudentAttendanceReport, useadmissionStudentsDropdown } from '@/hooks/admission/preadmission/useReports';
import { getExcelStudentAttendanceReport } from '@/server/admission/preadmission/reports/month_end_report';
import type { IStudentAttendanceReportList } from '@/types/admission/preadmission/reports';
import { attendanceColumns } from './_components/columns';

/* ---------------- Schema ---------------- */

const schema = z.object({
    academicYearId: z.number().min(1),
    classId: z.number().min(1),
    sectionId: z.number().min(1),
    studentId: z.number().optional(),

    selectionMode: z.number().min(1),
    studentStatus: z.number().min(1),
    certificateType: z.enum(['admNo', 'name']),

    month: z.number().optional(),
    monthDateWise: z.number().optional(),
    dailyDate: z.date().nullable().optional(),
    fromDate: z.date().nullable().optional(),
    toDate: z.date().nullable().optional()
});

type FormFields = z.infer<typeof schema>;

/* ---------------- Component ---------------- */

export default function StudyCertificateReportPage() {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        defaultValues: {
            selectionMode: 1, // all
            studentStatus: 1, // Monthly
            certificateType: 'admNo',
            monthDateWise: 0,
            studentId: 0
        }
    });
    const tableRef = useRef<DataTableRef>(null);

    const studentStatus = useWatch({ control, name: 'studentStatus' });
    const academicYearId = useWatch({ control, name: 'academicYearId' });
    const classId = useWatch({ control, name: 'classId' });
    const sectionId = useWatch({ control, name: 'sectionId' });
    const studentId = useWatch({ control, name: 'studentId' });
    const month = useWatch({ control, name: 'month' });
    const monthDateWise = useWatch({ control, name: 'monthDateWise' });
    const fromDate = useWatch({ control, name: 'fromDate' });
    const toDate = useWatch({ control, name: 'toDate' });
    const dailyDate = useWatch({ control, name: 'dailyDate' });
    const selectionMode = useWatch({ control, name: 'selectionMode' });

    const { data: academicYears } = useAcademicYearDropdown();
    const { data: classes } = useMasterClassDropdown();
    const { data: sections } = useMasterSectionDropdown();

    const { data: students, isLoading: studentsLoading } = useadmissionStudentsDropdown(academicYearId, classId, sectionId);

    const {
        data: studentsAttendance,
        isLoading,
        error,
        refetch
    } = useStudentAttendanceReport(
        academicYearId,
        classId,
        sectionId,
        selectionMode === 2 ? studentId : 0, // Conditional studentId handling
        month,
        monthDateWise,
        fromDate,
        toDate,
        dailyDate,
        selectionMode,
        studentStatus
    );
    const tableProps = useDataTableProps({
        data: (studentsAttendance as any)?.data?.studentAttendanceList ?? []
    });

    /* ---------------- Effects ---------------- */

    useEffect(() => {
        reset((prev) => ({
            ...prev,
            month: undefined,
            monthDateWise: 0,
            dailyDate: null,
            fromDate: null,
            toDate: null
        }));
    }, [studentStatus, reset]);
    useEffect(() => {
        if (selectionMode === 1) {
            reset((prev) => ({
                ...prev,
                studentId: 0,
                certificateType: 'admNo'
            }));
        }
    }, [selectionMode, reset]);

    const monthList = [
        { id: 1, name: 'January' },
        { id: 2, name: 'February' },
        { id: 3, name: 'March' },
        { id: 4, name: 'April' },
        { id: 5, name: 'May' },
        { id: 6, name: 'June' },
        { id: 7, name: 'July' },
        { id: 8, name: 'August' },
        { id: 9, name: 'September' },
        { id: 10, name: 'October' },
        { id: 11, name: 'November' },
        { id: 12, name: 'December' }
    ];

    /* ---------------- Submit ---------------- */

    const onSubmit = async (data: FormFields) => {
        try {
            const res = await refetch();
            if (res.data?.message) {
                toast.success(res.data.message);
            } else {
                toast.success('Report failed to generate');
            }
        } catch (error) {
            toast.error('No data found');
        }
    };

    const downloadExcel = async () => {
        try {
            if (!academicYearId || !classId || !sectionId) {
                toast.error('Please fill all required fields!');
                return;
            }

            const response = await getExcelStudentAttendanceReport(
                academicYearId,
                classId,
                sectionId,
                selectionMode === 2 ? studentId : 0, // Conditional studentId handling
                month,
                monthDateWise,
                fromDate,
                toDate,
                dailyDate,
                selectionMode,
                studentStatus
            );

            // Ensure we have a Blob
            const blob =
                response instanceof Blob
                    ? response
                    : new Blob([new Uint8Array(response)], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    });

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'StudentAttendanceReport.xlsx';
            document.body.appendChild(link);
            link.click();

            // Cleanup
            setTimeout(() => {
                link.remove();
                window.URL.revokeObjectURL(url);
            }, 100);

            toast.success('Excel downloaded successfully');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download Excel');
        }
    };

    /* ---------------- UI ---------------- */

    return (
        <div className='min-h-screen'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='space-y-6 rounded-xl border bg-card p-6 shadow-xl'>
                    {/* -------- Radio Groups -------- */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <RadioField
                            name='selectionMode'
                            control={control}
                            options={[
                                { label: 'all', value: 1 },
                                { label: 'individual', value: 2 }
                            ]}
                        />

                        <RadioField
                            name='certificateType'
                            control={control}
                            options={[
                                { label: 'admNo', value: 'admNo' },
                                { label: 'name', value: 'name' }
                            ]}
                            disabled={selectionMode !== 2}
                        />

                        <RadioField
                            name='studentStatus'
                            control={control}
                            options={[
                                { label: 'Monthly', value: 1 },
                                { label: 'Between Date', value: 2 },
                                { label: 'Daily', value: 3 }
                            ]}
                        />
                    </div>

                    {/* -------- Filters -------- */}
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        <SelectField
                            label='Academic Year'
                            name='academicYearId'
                            control={control}
                            options={academicYears?.data}
                            labelKey='asmaY_Year'
                            valueKey='asmaY_Id'
                            error={errors.academicYearId}
                        />

                        <SelectField
                            label='Class'
                            name='classId'
                            control={control}
                            options={classes?.data}
                            labelKey='asmcL_ClassName'
                            valueKey='asmcL_Id'
                            error={errors.classId}
                        />

                        <SelectField
                            label='Section'
                            name='sectionId'
                            control={control}
                            options={sections?.data}
                            labelKey='asmC_SectionName'
                            valueKey='asmS_Id'
                            error={errors.sectionId}
                            disabled={!classId}
                        />

                        <SelectField
                            label='Student'
                            name='studentId'
                            control={control}
                            options={students?.data}
                            labelKey='studentName'
                            valueKey='amsT_Id'
                            disabled={selectionMode !== 2 || !sectionId || studentsLoading}
                        />

                        {/* -------- Month -------- */}
                        {studentStatus === 1 && (
                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                {/* Month */}
                                <Controller
                                    name='month'
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Label>Month</Label>
                                            <Select
                                                value={field.value ? String(field.value) : undefined}
                                                onValueChange={(v) => field.onChange(Number(v))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select Month' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {monthList.map((m) => (
                                                        <SelectItem key={m.id} value={String(m.id)}>
                                                            {m.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                />
                                <Controller
                                    name='monthDateWise'
                                    control={control}
                                    render={({ field }) => (
                                        <div className='flex items-center gap-2'>
                                            <Label className='font-normal'>Month Date Wise</Label>
                                            <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(v ? 1 : 0)} />
                                        </div>
                                    )}
                                />
                            </div>
                        )}

                        {/* -------- Month Date Wise -------- */}
                    </div>

                    {/* -------- Between Dates -------- */}
                    {studentStatus === 2 && (
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                            <DateField name='fromDate' label='From Date' control={control} />
                            <DateField name='toDate' label='To Date' control={control} />
                        </div>
                    )}
                    {studentStatus === 3 && (
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                            <DateField name='dailyDate' label='Daily Date' control={control} />
                        </div>
                    )}

                    {/* -------- Actions -------- */}
                    <div className='flex gap-3 border-t pt-4'>
                        <Button type='button' variant='outline' onClick={() => reset()} className='w-fit'>
                            Reset
                        </Button>
                        <Button type='submit' isLoading={isSubmitting} className='w-fit'>
                            <Save className='mr-2 h-4 w-4' />
                            Report
                        </Button>
                        <Button onClick={downloadExcel} className='w-fit'>
                            Export to Excel
                        </Button>
                    </div>
                </div>
            </form>

            <div className='container space-y-4 p-1'>
                <CollapsibleSection
                    title='Student Attendance Report'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                    {/* Institution Header */}
                    {(studentsAttendance as any)?.data?.institutionDetails?.[0] && (
                        <div className='mb-6 border-b pb-6 text-center'>
                            <div className='flex flex-col items-center gap-4'>
                                {(studentsAttendance as any).data.institutionDetails[0].mI_Logo && (
                                    <img
                                        src={(studentsAttendance as any).data.institutionDetails[0].mI_Logo}
                                        alt='Logo'
                                        className='h-24 w-auto object-contain'
                                    />
                                )}
                                <div>
                                    <h1 className='text-2xl font-bold uppercase'>
                                        {(studentsAttendance as any).data.institutionDetails[0].mI_Name}
                                    </h1>
                                    <p className='text-sm text-muted-foreground'>
                                        {(studentsAttendance as any).data.institutionDetails[0].mI_Address1}
                                        {(studentsAttendance as any).data.institutionDetails[0].mI_Address2 &&
                                            `, ${(studentsAttendance as any).data.institutionDetails[0].mI_Address2}`}
                                        {(studentsAttendance as any).data.institutionDetails[0].mI_Address3 &&
                                            `, ${(studentsAttendance as any).data.institutionDetails[0].mI_Address3}`}
                                    </p>
                                    <h2 className='mt-2 text-lg font-bold tracking-wide'>STUDENT ATTENDANCE REPORT</h2>
                                    <div className='mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold'>
                                        {academicYearId && (
                                            <span>
                                                Academic Year: {academicYears?.data?.find((y: any) => y.asmaY_Id === academicYearId)?.asmaY_Year}
                                            </span>
                                        )}
                                        {classId && (
                                            <span>
                                                Class: {classes?.data?.find((c: any) => c.asmcL_Id === classId)?.asmcL_ClassName}
                                            </span>
                                        )}
                                        {sectionId && (
                                            <span>
                                                Section: {sections?.data?.find((s: any) => s.asmS_Id === sectionId)?.asmC_SectionName}
                                            </span>
                                        )}
                                        {month && <span>Month: {monthList.find((m) => m.id === month)?.name}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <GenericDataTable<IStudentAttendanceReportList>
                        {...tableProps}
                        ref={tableRef}
                        columns={attendanceColumns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        loadingMessage='Loading Student Attendance Reports...'
                        noDataTitle='No Data Found'
                        noDataDescription='No Student Attendance Reports found.'
                        errorTitle='Error Loading Student Attendance Reports'
                    />
                </CollapsibleSection>
            </div>
        </div>
    );
}

/* ---------------- Reusable Fields ---------------- */

function RadioField({ name, control, options, disabled }: any) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <RadioGroup
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                    disabled={disabled}
                    className={`flex justify-center gap-4 rounded border p-3 ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
                    {options.map((opt: any) => (
                        <div key={opt.value} className='flex items-center gap-2'>
                            <RadioGroupItem value={String(opt.value)} />
                            <Label className='font-normal'>{opt.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            )}
        />
    );
}

function SelectField({ label, name, control, options, labelKey, valueKey, error, disabled }: any) {
    return (
        <div>
            <Label>{label}</Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select
                        disabled={disabled}
                        value={field.value ? String(field.value) : undefined}
                        onValueChange={(v) => field.onChange(Number(v))}>
                        <SelectTrigger>
                            <SelectValue placeholder={`Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {options?.map((o: any) => (
                                <SelectItem key={o[valueKey]} value={String(o[valueKey])}>
                                    {o[labelKey]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {error && <FormError>{error.message}</FormError>}
        </div>
    );
}

function DateField({ name, label, control }: any) {
    const [open, setOpen] = useState(false);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div>
                    <Label>{label}</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button variant='outline' className='w-full justify-start'>
                                <CalendarIcon className='mr-2 h-4 w-4' />
                                {field.value ? format(field.value, 'yyyy-MM-dd') : `Select ${label}`}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='p-0'>
                            <DatePickerWithYear
                                mode='single'
                                selected={field.value ?? undefined}
                                onDayClick={(d) => {
                                    field.onChange(d);
                                    setOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        />
    );
}

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type ToppersListSchema, toppersListReportSchema } from '@/schemas/exam/exam-module/reports';
import { getToppersReportDetails } from '@/server/exam/exam-module/reports/toppers-list-report';
import {
    getClassDropDownByAcademicYearlist,
    getSectionsDropDownByAcademicYearandClasslist,
    getExamsDropDownByAcademicYearandClassandSectionlist
} from '@/server/exam/exam-module/reports/cumulative-report';
import { getMasterInstitution } from '@/server/exam/exam-module/reports/vvehpc_exam-report-card';
import { getAcademicYearDropdown } from '@/server/fees/masters/class_yearly_category';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface ReportFormProps {
    onReportGenerated: (data: any, institution: any, params: any) => void;
    onReset: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ onReportGenerated, onReset }) => {
    const [loading, setLoading] = useState(false);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    const [loadingYears, setLoadingYears] = useState(true);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingExams, setLoadingExams] = useState(false);

    const methods = useForm<ToppersListSchema>({
        resolver: zodResolver(toppersListReportSchema),
        mode: 'onChange',
        defaultValues: {
            type: '1',
            topper: '10',
            subjectwise: false,
            exm_check_type: '0',
            sub_check_type: '0',
            ASMAY_Id: '',
            EMCA_Id: '0',
            ASMCL_Id: '',
            ASMS_Id: '0',
            EME_Id: '',
            ISMS_Id: ''
        }
    });

    const { control, handleSubmit, setValue, reset, formState, trigger } = methods;
    const { isSubmitting, errors } = formState;

    // Watchers
    const watchType = useWatch({ control, name: 'type' });
    const watchYear = useWatch({ control, name: 'ASMAY_Id' });
    const watchClass = useWatch({ control, name: 'ASMCL_Id' });
    const watchSection = useWatch({ control, name: 'ASMS_Id' });
    const watchExam = useWatch({ control, name: 'EME_Id' });
    const watchSubjectwise = useWatch({ control, name: 'subjectwise' });
    const watchSubject = useWatch({ control, name: 'ISMS_Id' });
    const watchTopper = useWatch({ control, name: 'topper' });

    // Initial Data - Academic Years
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoadingYears(true);
                const response = await getAcademicYearDropdown();
                if (response.success) {
                    setAcademicYears(response.data || []);
                    if (!response.data || response.data.length === 0) {
                        toast.info('No Academic Years found');
                    }
                } else {
                    toast.error('Failed to load academic years');
                }
            } catch (error) {
                console.error('Error fetching academic years:', error);
                toast.error('Error loading academic years');
            } finally {
                setLoadingYears(false);
            }
        };
        fetchInitialData();
    }, []);

    // Load Classes when Year changes
    useEffect(() => {
        if (watchYear) {
            const fetchClasses = async () => {
                try {
                    setLoadingClasses(true);
                    const yearId = Number.parseInt(watchYear, 10);
                    const response = await getClassDropDownByAcademicYearlist(yearId);
                    if (response.success && response.data) {
                        setClasses(response.data || []);
                    } else {
                        setClasses([]);
                    }

                    // Reset dependent fields
                    setValue('ASMCL_Id', '');
                    setValue('ASMS_Id', '0');
                    setValue('EME_Id', '');
                    setSections([]);
                    setExams([]);
                    setSubjects([]);
                } catch (error) {
                    console.error('Error fetching classes:', error);
                    toast.error('Failed to load classes');
                    setClasses([]);
                } finally {
                    setLoadingClasses(false);
                }
            };
            fetchClasses();
        } else {
            setClasses([]);
            setSections([]);
            setExams([]);
            setSubjects([]);
            setValue('ASMCL_Id', '');
            setValue('ASMS_Id', '0');
            setValue('EME_Id', '');
            setValue('ISMS_Id', '');
        }
    }, [watchYear, setValue]);

    // Load Sections when Class changes
    useEffect(() => {
        if (watchYear && watchClass) {
            const fetchSections = async () => {
                try {
                    setLoadingSections(true);
                    const yearId = Number.parseInt(watchYear, 10);
                    const classId = Number.parseInt(watchClass, 10);

                    const response = await getSectionsDropDownByAcademicYearandClasslist(yearId, classId);
                    if (response.success && response.data) {
                        setSections(response.data || []);
                    } else {
                        setSections([]);
                    }

                    // Reset dependent fields
                    setValue('ASMS_Id', '0');
                    setValue('EME_Id', '');
                    setExams([]);
                    setSubjects([]);
                } catch (error) {
                    console.error('Error fetching sections:', error);
                    toast.error('Failed to load sections');
                    setSections([]);
                } finally {
                    setLoadingSections(false);
                }
            };
            fetchSections();
        } else {
            setSections([]);
            setValue('ASMS_Id', '0');
            setValue('EME_Id', '');
        }
    }, [watchYear, watchClass, setValue]);

    // Load Exams when Section changes
    useEffect(() => {
        if (watchYear && watchClass && watchSection) {
            const fetchExams = async () => {
                try {
                    setLoadingExams(true);
                    const yearId = Number.parseInt(watchYear, 10);
                    const classId = Number.parseInt(watchClass, 10);
                    const sectionId = Number.parseInt(watchSection, 10);

                    const response = await getExamsDropDownByAcademicYearandClassandSectionlist(yearId, classId, sectionId);
                    if (response.success && response.data) {
                        setExams(response.data || []);
                    } else {
                        setExams([]);
                    }

                    setValue('EME_Id', '');
                    setSubjects([]);
                } catch (error) {
                    console.error('Error fetching exams:', error);
                    toast.error('Failed to load exams');
                    setExams([]);
                } finally {
                    setLoadingExams(false);
                }
            };
            fetchExams();
        } else {
            setExams([]);
            setValue('EME_Id', '');
        }
    }, [watchYear, watchClass, watchSection, setValue]);

    // Update check types when form values change
    useEffect(() => {
        // Set exam check type based on exam selection
        if (watchExam) {
            setValue('exm_check_type', '1'); // Examwise
        } else {
            setValue('exm_check_type', '0'); // All
        }

        // Set subject check type based on subjectwise checkbox
        if (watchSubjectwise && watchSubject) {
            setValue('sub_check_type', '1'); // Subjectwise
        } else {
            setValue('sub_check_type', '0'); // All
        }
    }, [watchExam, watchSubjectwise, watchSubject, setValue]);

    // Trigger validation when fields change for conditional validation
    useEffect(() => {
        if (watchType === '2' && watchSection) {
            trigger('ASMS_Id');
        }
        if (watchSubjectwise && watchSubject) {
            trigger('ISMS_Id');
        }
    }, [watchType, watchSection, watchSubjectwise, watchSubject, trigger]);

    const onSubmit = async (formValues: ToppersListSchema) => {
        console.log('Form Values:', formValues);
        setLoading(true);

        try {
            // Prepare payload according to the required structure
            const payload = {
                ASMAY_Id: Number.parseInt(formValues.ASMAY_Id) || 0,
                ASMCL_Id:
                    formValues.type === '1'
                        ? 0
                        : Number.parseInt(formValues.ASMCL_Id || '') || 0,
                ASMS_Id:
                    formValues.type === '1'
                        ? 0
                        : Number.parseInt(formValues.ASMS_Id || '') || 0,
                EME_Id: Number.parseInt(formValues.EME_Id) || 0,
                ISMS_Id:
                    formValues.subjectwise
                        ? Number.parseInt(formValues.ISMS_Id || '') || 0
                        : 0,
                report_type: formValues.type || '0',

                sub_check_type: formValues.subjectwise ? '1' : '0',

                exm_check_type:
                    Number.parseInt(formValues.EME_Id) > 0 ? '1' : '0',

                topper: Number.parseInt(formValues.topper) || 0
            };

            console.log('Toppers List Report payload:', payload);

            const [result, institutionRes] = await Promise.all([
                getToppersReportDetails(payload),
                getMasterInstitution()
            ]);
            console.log('toppers list response', result);
            if (result.success) {
                onReportGenerated(result.data, institutionRes?.success ? institutionRes.data : null, payload);
            } else {
                toast.error(result.message || 'Failed to generate report');
            }
        } catch (error: any) {
            console.error('Error generating report:', error);
            toast.error(error?.message || 'An error occurred while generating the report');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        reset({
            type: '1',
            topper: '10',
            subjectwise: false,
            exm_check_type: '0',
            sub_check_type: '0',
            ASMAY_Id: '',
            EMCA_Id: '0',
            ASMCL_Id: '',
            ASMS_Id: '0',
            EME_Id: '',
            ISMS_Id: ''
        });
        onReset();
    };

    return (
        <Card className='mb-6'>
            <CardContent>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                        <div className='mt-6 mb-6 flex justify-center'>
                            <Controller
                                control={control}
                                name='type'
                                render={({ field }) => (
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className='flex space-x-4'>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='1' id='r1' />
                                            <Label htmlFor='r1'>All</Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='2' id='r2' />
                                            <Label htmlFor='r2'>Individual</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>

                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            {/* Academic Year */}
                            <div className='space-y-2'>
                                <Label>
                                    Academic Year <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='ASMAY_Id'
                                    render={({ field }) => (
                                        <Select
                                            key={field.value}
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                // Trigger validation when changed
                                                trigger('ASMAY_Id');
                                            }}
                                            value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Academic Year' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {loadingYears ? (
                                                    <SelectItem value='0' disabled>
                                                        Academic Years are loading...
                                                    </SelectItem>
                                                ) : academicYears.length === 0 ? (
                                                    <SelectItem value='0' disabled>
                                                        No Academic Years found
                                                    </SelectItem>
                                                ) : (
                                                    academicYears.map((item) => (
                                                        <SelectItem key={item.asmaY_Id} value={String(item.asmaY_Id)}>
                                                            {item.asmaY_Year}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.ASMAY_Id && <FormError>{errors.ASMAY_Id.message}</FormError>}
                            </div>


                            {/* Class (Only for Individual type) */}
                            <div className='space-y-2'>
                                <Label>
                                    Class <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='ASMCL_Id'
                                    render={({ field }) => (
                                        <Select
                                            key={field.value}
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                // Trigger validation when changed
                                                trigger('ASMCL_Id');
                                            }}
                                            value={field.value}
                                            disabled={watchType === '1' || !watchYear}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Class' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {loadingClasses ? (
                                                    <SelectItem value='0' disabled>
                                                        Classes are loading...
                                                    </SelectItem>
                                                ) : classes.length === 0 ? (
                                                    <SelectItem value='0' disabled>
                                                        No Classes found
                                                    </SelectItem>
                                                ) : (
                                                    classes.map((item) => (
                                                        <SelectItem key={item.asmcL_Id} value={String(item.asmcL_Id)}>
                                                            {item.asmcL_ClassName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.ASMCL_Id && watchType === '2' && <FormError>{errors.ASMCL_Id.message}</FormError>}
                            </div>

                            {/* Section (Only for Individual type) */}
                            <div className='space-y-2'>
                                <Label>
                                    Section <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='ASMS_Id'
                                    render={({ field }) => (
                                        <Select
                                            key={field.value}
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                // Trigger validation when changed
                                                trigger('ASMS_Id');
                                            }}
                                            value={field.value || ''}
                                            disabled={watchType === '1' || !watchClass}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Section' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='0'>All</SelectItem>
                                                {sections.map((item) => (
                                                    <SelectItem key={item.asmS_Id} value={String(item.asmS_Id)}>
                                                        {item.asmC_SectionName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.ASMS_Id && watchType === '2' && <FormError>{errors.ASMS_Id.message}</FormError>}
                            </div>

                            {/* Exam */}
                            <div className='space-y-2'>
                                <Label>
                                    Exam <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='EME_Id'
                                    render={({ field }) => (
                                        <Select
                                            key={field.value}
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                // Trigger validation when changed
                                                trigger('EME_Id');
                                            }}
                                            value={field.value}
                                            disabled={!watchSection}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Exam' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {loadingExams ? (
                                                    <SelectItem value='0' disabled>
                                                        Exams are loading...
                                                    </SelectItem>
                                                ) : exams.length === 0 ? (
                                                    <SelectItem value='0' disabled>
                                                        No Exams found
                                                    </SelectItem>
                                                ) : (
                                                    exams.map((item) => (
                                                        <SelectItem key={item.emE_Id} value={String(item.emE_Id)}>
                                                            {item.emE_ExamName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.EME_Id && <FormError>{errors.EME_Id.message}</FormError>}
                            </div>

                            {/* Top */}
                            <div className='space-y-2'>
                                <Label>
                                    Top <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='topper'
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder='Enter Top Count'
                                            type='number'
                                            min='1'
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Only allow positive numbers
                                                if (value === '' || Number(value) > 0) {
                                                    field.onChange(value);
                                                }
                                            }}
                                        />
                                    )}
                                />
                                {errors.topper && <FormError>{errors.topper.message}</FormError>}
                            </div>

                            {/* Subjectwise Checkbox & Dropdown */}
                            <div className='col-span-1 flex items-center gap-2 md:col-span-2'>
                                {/* Checkbox part */}
                                <div className='flex items-center justify-end gap-2'>
                                    <Controller
                                        control={control}
                                        name='subjectwise'
                                        render={({ field }) => (
                                            <>
                                                <Checkbox
                                                    id='subCheck'
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(checked);
                                                        // Clear subject when unchecked
                                                        if (!checked) {
                                                            setValue('ISMS_Id', '');
                                                        }
                                                        trigger('ISMS_Id');
                                                    }}
                                                />
                                                <Label htmlFor='subCheck' className='cursor-pointer'>
                                                    Subjectwise
                                                </Label>
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Dropdown part */}
                                <div className='flex-1'>
                                    <Controller
                                        control={control}
                                        name='ISMS_Id'
                                        render={({ field }) => (
                                            <Select
                                                key={field.value}
                                                onValueChange={(val) => {
                                                    field.onChange(val);
                                                    // Trigger validation when changed
                                                    trigger('ISMS_Id');
                                                }}
                                                value={field.value || ''}
                                                disabled={!watchSubjectwise || !watchExam}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select Subject' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subjects.map((item) => (
                                                        <SelectItem key={item.ismS_Id} value={String(item.ismS_Id)}>
                                                            {item.ismS_SubjectName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.ISMS_Id && <FormError>{errors.ISMS_Id.message}</FormError>}
                                </div>
                            </div>
                        </div>

                        {/* Hidden fields for check types */}
                        <Controller control={control} name='exm_check_type' render={({ field }) => <input type='hidden' {...field} />} />
                        <Controller control={control} name='sub_check_type' render={({ field }) => <input type='hidden' {...field} />} />

                        <div className='flex justify-center space-x-4 pt-4'>
                            <Button type='submit' disabled={loading || isSubmitting}>
                                {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                Generate Report
                            </Button>
                            <Button type='button' variant='outline' onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
};

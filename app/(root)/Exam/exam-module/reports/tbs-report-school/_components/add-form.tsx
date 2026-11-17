'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterGradeDropdownList } from '@/hooks/exam/exammodule/usemasters';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { tbs_reportschoolSchema } from '@/schemas/exam/exam-module/reports';
import {
    getClassDropDownByAcademicYearlist,
    getExamsDropDownByAcademicYearandClassandSectionlist,
    getSectionsDropDownByAcademicYearandClasslist,
    getStudentsDropDownByAcademicYearandClassandSectionlist
} from '@/server/exam/exam-module/reports/tbs-report-school';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof tbs_reportschoolSchema.addOrUpdate>;

export default function TBSReportSchoolForm({
    onSuccess,
    onCancel
}: {
    onSuccess: (payload: any) => void;
    onCancel: () => void;
}) {
    const methods = useForm<FormFields>({
        resolver: zodResolver(tbs_reportschoolSchema.addOrUpdate),
        defaultValues: {
            asmaY_Id: 0,
            asmcL_Id: 0,
            asmS_Id: 0,
            emE_Id: [],
            emgR_Id: 0,
            studentList: []
        }
    });

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { isSubmitting, errors }
    } = methods;

    const [classes, setClasses] = useState<any[]>([]);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [sections, setSections] = useState<any[]>([]);
    const [loadingSections, setLoadingSections] = useState(false);
    const [exams, setExams] = useState<any[]>([]);
    const [loadingExams, setLoadingExams] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [gradeList, setGradeList] = useState<any[]>([]);

    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();
    const { data: gradeData, isLoading: gradeLoading, error: gradeError } = useMasterGradeDropdownList();

    const selectedYear = useWatch({ control, name: 'asmaY_Id' });
    const selectedClass = useWatch({ control, name: 'asmcL_Id' });
    const selectedSection = useWatch({ control, name: 'asmS_Id' });

    useEffect(() => {
        if (gradeError) {
            toast.error(gradeError.message || 'Error fetching grades');
            setGradeList([]);
        } else if (gradeData?.data) {
            const list = Array.isArray(gradeData.data) ? gradeData.data : (gradeData.data as any).$values || [];
            setGradeList(list);
            if (list.length === 0) {
                toast.info('No Grades found');
            }
        } else {
            setGradeList([]);
        }
    }, [gradeData, gradeError]);

    useEffect(() => {
        if (!selectedYear || selectedYear === 0) return;
        (async () => {
            setLoadingClasses(true);
            try {
                const res = await getClassDropDownByAcademicYearlist(selectedYear);
                if (res.data && res.data.length > 0) {
                    setClasses(res.data);
                } else {
                    setClasses([]);
                    toast.info('No classes found for the selected Academic Year');
                }
                setValue('asmcL_Id', 0);
            } catch {
                toast.error('Failed to load classes');
            } finally {
                setLoadingClasses(false);
            }
        })();
    }, [selectedYear, setValue]);

    useEffect(() => {
        if (!selectedYear || !selectedClass || selectedClass === 0) return;
        (async () => {
            setLoadingSections(true);
            try {
                const res = await getSectionsDropDownByAcademicYearandClasslist(selectedYear, selectedClass);
                if (res.data && res.data.length > 0) {
                    setSections(res.data);
                } else {
                    setSections([]);
                    toast.info('No sections found for the selected Class');
                }
                setValue('asmS_Id', 0);
            } catch {
                toast.error('Failed to load sections');
            } finally {
                setLoadingSections(false);
            }
        })();
    }, [selectedYear, selectedClass, setValue]);

    useEffect(() => {
        if (!selectedYear || !selectedClass || !selectedSection || selectedSection === 0) return;
        (async () => {
            setLoadingExams(true);
            setLoadingStudents(true);
            try {
                const resE = await getExamsDropDownByAcademicYearandClassandSectionlist(selectedYear, selectedClass, selectedSection);
                if (resE.data && resE.data.length > 0) {
                    setExams(resE.data);
                } else {
                    setExams([]);
                    toast.info('No exams found');
                }
                setValue('emE_Id', []);

                const resS = await getStudentsDropDownByAcademicYearandClassandSectionlist(selectedYear, selectedClass, selectedSection);
                if (resS.data && resS.data.length > 0) {
                    setStudents(resS.data);
                } else {
                    setStudents([]);
                    toast.info('No students found');
                }
                setValue('studentList', []);
            } catch {
                toast.error('Failed to load exams or students');
            } finally {
                setLoadingExams(false);
                setLoadingStudents(false);
            }
        })();
    }, [selectedYear, selectedClass, selectedSection, setValue]);

    const onSubmit = (data: FormFields) => {
        onSuccess(data);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <Card>
                    <CardContent className='pt-6'>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <div className='space-y-4'>
                                {/* Academic Year */}
                                <Controller
                                    control={control}
                                    name='asmaY_Id'
                                    render={({ field, fieldState }) => (
                                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                                            <Label className='sm:w-32'>
                                                Academic Year <span className='text-destructive'>*</span>
                                            </Label>
                                            <div className='flex-1'>
                                                <Select
                                                    key={field.value}
                                                    value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                                    onValueChange={(val) => field.onChange(Number(val))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Academic Year' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {academicYearLoading ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : academicYear?.data?.length === 0 ? (
                                                            <SelectItem value='empty' disabled>
                                                                No Academic Years found
                                                            </SelectItem>
                                                        ) : academicYearError ? (
                                                            <SelectItem value='error' disabled>
                                                                Error loading Academic Year
                                                            </SelectItem>
                                                        ) : (
                                                            academicYear?.data?.map((item) => (
                                                                <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                                    {item.asmaY_Year}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        </div>
                                    )}
                                />

                                {/* Class */}
                                <Controller
                                    control={control}
                                    name='asmcL_Id'
                                    render={({ field }) => (
                                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                                            <Label className='sm:w-32'>
                                                Class <span className='text-destructive'>*</span>
                                            </Label>
                                            <div className='flex-1'>
                                                <Select
                                                    key={field.value}
                                                    onValueChange={(v) => field.onChange(Number(v))}
                                                    value={field.value ? String(field.value) : ''}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Class' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingClasses ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : classes.length === 0 ? (
                                                            <SelectItem value='empty' disabled>
                                                                No Classes found
                                                            </SelectItem>
                                                        ) : (
                                                            classes.map((c) => (
                                                                <SelectItem key={c.asmcL_Id} value={String(c.asmcL_Id)}>
                                                                    {c.asmcL_ClassName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.asmcL_Id && <FormError>{errors.asmcL_Id.message}</FormError>}
                                            </div>
                                        </div>
                                    )}
                                />

                                {/* Section */}
                                <Controller
                                    control={control}
                                    name='asmS_Id'
                                    render={({ field }) => (
                                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                                            <Label className='sm:w-32'>
                                                Section <span className='text-destructive'>*</span>
                                            </Label>
                                            <div className='flex-1'>
                                                <Select
                                                    key={field.value}
                                                    onValueChange={(v) => field.onChange(Number(v))}
                                                    value={field.value ? String(field.value) : ''}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Section' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingSections ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : sections.length === 0 ? (
                                                            <SelectItem value='empty' disabled>
                                                                No Sections found
                                                            </SelectItem>
                                                        ) : (
                                                            sections.map((s) => (
                                                                <SelectItem key={s.asmS_Id} value={String(s.asmS_Id)}>
                                                                    {s.asmC_SectionName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.asmS_Id && <FormError>{errors.asmS_Id.message}</FormError>}
                                            </div>
                                        </div>
                                    )}
                                />

                                {/* Grade */}
                                <Controller
                                    control={control}
                                    name='emgR_Id'
                                    render={({ field, fieldState }) => (
                                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                                            <Label className='sm:w-32'>
                                                Grade <span className='text-destructive'>*</span>
                                            </Label>
                                            <div className='flex-1'>
                                                <Select
                                                    key={field.value}
                                                    onValueChange={(v) => field.onChange(Number(v))}
                                                    value={field.value && field.value !== 0 ? String(field.value) : undefined}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Grade' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {gradeLoading ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : gradeError ? (
                                                            <SelectItem value='error' disabled>
                                                                Error loading grades
                                                            </SelectItem>
                                                        ) : gradeList.length === 0 ? (
                                                            <SelectItem value='empty' disabled>
                                                                No Grades found
                                                            </SelectItem>
                                                        ) : (
                                                            gradeList.map((g: any) => (
                                                                <SelectItem key={g.emgR_Id} value={String(g.emgR_Id)}>
                                                                    {g.emgR_GradeName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>

                            <div className='space-y-4'>
                                {/* Exams Multi-select */}
                                <Controller
                                    control={control}
                                    name='emE_Id'
                                    render={({ field }) => (
                                        <div className='flex flex-col gap-2 sm:flex-row sm:items-start'>
                                            <Label className='pt-2 sm:w-32'>
                                                Exams <span className='text-destructive'>*</span>
                                            </Label>
                                            <div className='flex-1'>
                                                <CustomMultiSelectBox
                                                    options={exams.map((e) => ({ label: e.emE_ExamName, value: e.emE_Id.toString() }))}
                                                    onChange={(vals) => field.onChange(vals.map((v) => ({ emE_Id: Number(v) })))}
                                                    value={field.value.map((v) => v.emE_Id.toString())}
                                                    placeholder='Select Exams'
                                                    height='120px'
                                                />
                                                {errors.emE_Id && <FormError>{errors.emE_Id.message}</FormError>}
                                            </div>
                                        </div>
                                    )}
                                />

                                {/* Students Multi-select */}
                                <Controller
                                    control={control}
                                    name='studentList'
                                    render={({ field }) => (
                                        <div className='flex flex-col gap-2 sm:flex-row sm:items-start'>
                                            <Label className='pt-2 sm:w-32'>
                                                Students <span className='text-destructive'>*</span>
                                            </Label>
                                            <div className='flex-1'>
                                                <CustomMultiSelectBox
                                                    options={students.map((s) => ({
                                                        label: `${s.studentName || 'Unknown'} - ${s.amsT_AdmNo || ''}`,
                                                        value: s.amsT_Id.toString()
                                                    }))}
                                                    onChange={(vals) => field.onChange(vals.map((v) => ({ amsT_Id: Number(v) })))}
                                                    value={field.value.map((v) => v.amsT_Id.toString())}
                                                    placeholder='Select Students'
                                                    height='200px'
                                                    isSearchRequired
                                                />
                                                {errors.studentList && <FormError>{errors.studentList.message}</FormError>}
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='mt-6 flex justify-center gap-4 border-t pt-8'>
                            <Button type='submit' disabled={isSubmitting} className='min-w-[120px]'>
                                {isSubmitting ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Check className='mr-2 h-4 w-4' />}
                                Report
                            </Button>
                            <Button
                                type='button'
                                variant='destructive'
                                onClick={() => {
                                    reset();
                                    onCancel();
                                }}
                                className='min-w-[120px]'>
                                <X className='mr-2 h-4 w-4' />
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </FormProvider>
    );
}

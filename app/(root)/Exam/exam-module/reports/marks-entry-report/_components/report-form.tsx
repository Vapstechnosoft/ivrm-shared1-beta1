'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { type MarksEntryReportSchema, marksEntryReportSchema } from '@/schemas/exam/exam-module/reports';
import {
    getClassDropDownByAcademicYearlist,
    getExamsDropDownByAcademicYearandClassandSectionlist,
    getSectionsDropDownByAcademicYearandClasslist
} from '@/server/exam/exam-module/reports/cumulative-report';
import { getReportDetails } from '@/server/exam/exam-module/reports/marks-entry-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

const Marks_reportData = {
    "success": true,
    "message": "Marks entry report generated successfully.",
    "data": [
        {
            "mI_Id": "30",
            "asmcL_Id": "409",
            "asmS_Id": "162",
            "asmcL_ClassName": "Nursery",
            "asmC_SectionName": "Section A",
            "ismS_Id": 1069,
            "ismS_SubjectName": "COLOURING  SCENIC PICTURE",
            "subjectOrder": 1,
            "employename": "",
            "sourceMarksEntryFlag": 1,
            "sourceMarksColorFlag": "Green",
            "sourceMarksEntry": "Full Entered"
        },
        {
            "mI_Id": "30",
            "asmcL_Id": "409",
            "asmS_Id": "162",
            "asmcL_ClassName": "Nursery",
            "asmC_SectionName": "Section A",
            "ismS_Id": 970,
            "ismS_SubjectName": "SENSORIAL",
            "subjectOrder": 2,
            "employename": "",
            "sourceMarksEntryFlag": 0,
            "sourceMarksColorFlag": "Red",
            "sourceMarksEntry": "Not Entered"
        },
        {
            "mI_Id": "30",
            "asmcL_Id": "409",
            "asmS_Id": "162",
            "asmcL_ClassName": "Nursery",
            "asmC_SectionName": "Section A",
            "ismS_Id": 762,
            "ismS_SubjectName": "@#$%^&",
            "subjectOrder": 3,
            "employename": "",
            "sourceMarksEntryFlag": 0,
            "sourceMarksColorFlag": "Red",
            "sourceMarksEntry": "Not Entered"
        },
        {
            "mI_Id": "30",
            "asmcL_Id": "409",
            "asmS_Id": "162",
            "asmcL_ClassName": "Nursery",
            "asmC_SectionName": "Section A",
            "ismS_Id": 779,
            "ismS_SubjectName": "EVS",
            "subjectOrder": 4,
            "employename": "",
            "sourceMarksEntryFlag": 0,
            "sourceMarksColorFlag": "Red",
            "sourceMarksEntry": "Not Entered"
        },
        {
            "mI_Id": "30",
            "asmcL_Id": "409",
            "asmS_Id": "162",
            "asmcL_ClassName": "Nursery",
            "asmC_SectionName": "Section A",
            "ismS_Id": 775,
            "ismS_SubjectName": "KANNADA",
            "subjectOrder": 5,
            "employename": "",
            "sourceMarksEntryFlag": 1,
            "sourceMarksColorFlag": "Green",
            "sourceMarksEntry": "Full Entered"
        },
        {
            "mI_Id": "30",
            "asmcL_Id": "409",
            "asmS_Id": "162",
            "asmcL_ClassName": "Nursery",
            "asmC_SectionName": "Section A",
            "ismS_Id": 767,
            "ismS_SubjectName": "ENGLISH",
            "subjectOrder": 6,
            "employename": "",
            "sourceMarksEntryFlag": 1,
            "sourceMarksColorFlag": "Green",
            "sourceMarksEntry": "Full Entered"
        }
    ],
    "total": 6,
    "page": null,
    "page_size": null
}

interface ReportFormProps {
    onReportGenerated: (data: any) => void;
    onReset: () => void;
}

export const ReportForm = ({ onReportGenerated, onReset }: ReportFormProps) => {
    const [years, setYears] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingExams, setLoadingExams] = useState(false);

    const methods = useForm<MarksEntryReportSchema>({
        resolver: zodResolver(marksEntryReportSchema),
        defaultValues: {}
    });

    const { control, handleSubmit, setValue, reset, formState } = methods;
    const { isSubmitting } = formState;

    const { data: academicData, error: academicError } = useAcademicYearDropdown();

    const watchYear = useWatch({ control, name: 'ASMAY_Id' });
    const watchClass = useWatch({ control, name: 'ASMCL_Id' });
    const watchSection = useWatch({ control, name: 'ASMS_Id' });

    // Initial Data (Academic Years)
    useEffect(() => {
        if (academicError) {
            toast.error('Failed to load Academic Years');
            setYears([]);
            setLoading(false);
        } else if (academicData?.data) {
            const formatted = Array.isArray(academicData.data)
                ? academicData.data.map((i: any) => ({
                    asmaY_Id: i.asmaY_Id ?? 0,
                    asmaY_Year: i.asmaY_Year ?? ''
                }))
                : [];
            setYears(formatted);
            if (!formatted || formatted.length === 0) {
                toast.info('No Academic Years found');
            }
            setLoading(false);
        }
    }, [academicData, academicError]);

    // Load Classes on Year Change
    useEffect(() => {
        if (watchYear) {
            (async () => {
                try {
                    setLoadingClasses(true);
                    const response = await getClassDropDownByAcademicYearlist(Number(watchYear));
                    const data = response.data as any;
                    setClasses(Array.isArray(data) ? data : []);
                    if (!data || (Array.isArray(data) && data.length === 0)) {
                        toast.info('No Classes found');
                    }
                } catch (err) {
                    console.error(err);
                    toast.error('Failed to load classes');
                } finally {
                    setLoadingClasses(false);
                }
            })();
            setValue('ASMCL_Id', '');
            setValue('ASMS_Id', '');
            setValue('EME_Id', '');
        } else {
            setClasses([]);
        }
    }, [watchYear, setValue]);

    // Load Sections on Class Change
    useEffect(() => {
        if (watchYear && watchClass) {
            (async () => {
                try {
                    setLoadingSections(true);
                    const response = await getSectionsDropDownByAcademicYearandClasslist(Number(watchYear), Number(watchClass));
                    const data = response.data as any;
                    setSections(Array.isArray(data) ? data : []);
                    if (!data || (Array.isArray(data) && data.length === 0)) {
                        toast.info('No Sections found');
                    }
                } catch (err) {
                    console.error(err);
                    toast.error('Failed to load sections');
                } finally {
                    setLoadingSections(false);
                }
            })();
            setValue('ASMS_Id', '');
            setValue('EME_Id', '');
        } else {
            setSections([]);
        }
    }, [watchYear, watchClass, setValue]);

    // Load Exams on Section Change
    useEffect(() => {
        if (watchYear && watchClass && watchSection) {
            (async () => {
                try {
                    setLoadingExams(true);
                    const response = await getExamsDropDownByAcademicYearandClassandSectionlist(
                        Number(watchYear),
                        Number(watchClass),
                        Number(watchSection)
                    );
                    const data = response.data as any;
                    setExams(Array.isArray(data) ? data : []);
                    if (!data || (Array.isArray(data) && data.length === 0)) {
                        toast.info('No Exams found');
                    }
                } catch (err) {
                    console.error(err);
                    toast.error('Failed to load exams');
                } finally {
                    setLoadingExams(false);
                }
            })();
            setValue('EME_Id', '');
        } else {
            setExams([]);
        }
    }, [watchYear, watchClass, watchSection, setValue]);

    const onSubmit = async (data: MarksEntryReportSchema) => {
        try {
            const payload = {
                ASMAY_Id: Number(data.ASMAY_Id),
                ASMCL_Id: Number(data.ASMCL_Id),
                ASMS_Id: Number(data.ASMS_Id),
                EME_Id: Number(data.EME_Id)
            };

            console.log('marks entry report payload', payload);

            const result = await getReportDetails(payload);

            console.log('marks entry report data', result.data);

            const resultData = Array.isArray(result.data) ? result.data[0] : [];

            // TODO: Use dummy data if result is empty - REMOVE IN PRODUCTION
            if (!resultData || (Array.isArray(resultData) && resultData.length === 0) || !result.data || result.data.length === 0) {
                onReportGenerated(Marks_reportData.data);
            } else {
                onReportGenerated(resultData);
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handleClear = () => {
        reset();
        onReset();
    };

    if (loading)
        return (
            <div className='flex justify-center p-4'>
                <Loader2 className='animate-spin' />
            </div>
        );

    return (
        <div className='mx-auto w-full rounded-lg border border-gray-200 bg-white p-4 shadow-md'>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='rounded-lg border p-4 shadow-sm'>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            {/* Academic Year */}
                            <div className='space-y-2'>
                                <Label>
                                    Academic Year <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='ASMAY_Id'
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select key={field.value} onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select Academic Year' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {years.length === 0 ? (
                                                        <SelectItem value='0' disabled>
                                                            No Academic Years found
                                                        </SelectItem>
                                                    ) : (
                                                        years.map((year) => (
                                                            <SelectItem key={year.asmaY_Id} value={String(year.asmaY_Id)}>
                                                                {year.asmaY_Year}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Class */}
                            <div className='space-y-2'>
                                <Label>
                                    Class <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='ASMCL_Id'
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select
                                                key={field.value}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={!watchYear}>
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
                                                        classes.map((cls) => (
                                                            <SelectItem key={cls.asmcL_Id} value={String(cls.asmcL_Id)}>
                                                                {cls.asmcL_ClassName}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Section */}
                            <div className='space-y-2'>
                                <Label>
                                    Section <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='ASMS_Id'
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select
                                                key={field.value}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={!watchClass}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select Section' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {loadingSections ? (
                                                        <SelectItem value='0' disabled>
                                                            Sections are loading...
                                                        </SelectItem>
                                                    ) : sections.length === 0 ? (
                                                        <SelectItem value='0' disabled>
                                                            No Sections found
                                                        </SelectItem>
                                                    ) : (
                                                        sections.map((sec) => (
                                                            <SelectItem key={sec.asmS_Id} value={String(sec.asmS_Id)}>
                                                                {sec.asmC_SectionName}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Exam */}
                            <div className='space-y-2'>
                                <Label>
                                    Exam Name <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='EME_Id'
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select
                                                key={field.value}
                                                onValueChange={field.onChange}
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
                                                        exams.map((ex) => (
                                                            <SelectItem key={ex.emE_Id} value={String(ex.emE_Id)}>
                                                                {ex.emE_ExamName}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='mt-8 flex justify-center gap-4'>
                            <Button type='submit' disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null} Report
                            </Button>
                            <Button type='button' variant='outline' onClick={handleClear} disabled={isSubmitting}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

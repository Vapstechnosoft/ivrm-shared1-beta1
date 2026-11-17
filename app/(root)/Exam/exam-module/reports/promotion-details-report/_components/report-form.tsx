'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { type PromotionDetailsReportSchema, promotionDetailsReportSchema } from '@/schemas/exam/exam-module/reports';
import { getClassDropDownByAcademicYearlist, getSectionsDropDownByAcademicYearandClasslist, getStudentsDropDownByAcademicYearandClassandSectionlist } from '@/server/exam/exam-module/reports/cumulative-report';
import { getClasses, getReportDetails, getSections, getTermsAndStudents } from '@/server/exam/exam-module/reports/promotion-details-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface ReportFormProps {
    onReportGenerated: (data: any, isSuperAverage: boolean) => void;
    onReset: () => void;
}

export const ReportForm = ({ onReportGenerated, onReset }: ReportFormProps) => {
    const { data: academicData, isLoading: academicYearLoading } = useAcademicYearDropdown();
    const academicYears = academicData?.data || [];
    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [terms, setTerms] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [studentSearch, setStudentSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingTerms, setLoadingTerms] = useState(false);

    const methods = useForm<PromotionDetailsReportSchema>({
        resolver: zodResolver(promotionDetailsReportSchema),
        defaultValues: {
            superAverage: false,
            selectedStudents: []
        }
    });

    const { control, handleSubmit, setValue, reset, formState } = methods;
    const { isSubmitting } = formState;

    const watchYear = useWatch({ control, name: 'ASMAY_Id' });
    const watchClass = useWatch({ control, name: 'ASMCL_Id' });
    const watchSection = useWatch({ control, name: 'ASMS_Id' });
    const watchSuperAverage = useWatch({ control, name: 'superAverage' });
    const watchSelectedStudents = useWatch({ control, name: 'selectedStudents' });

    // Filter students
    useEffect(() => {
        if (studentSearch.trim() === '') {
            setFilteredStudents(students);
        } else {
            setFilteredStudents(students.filter((s) => s.studentName.toLowerCase().includes(studentSearch.toLowerCase())));
        }
    }, [studentSearch, students]);

    // Initial Data
    useEffect(() => {
        setLoading(false);
    }, []);
    // Load Classes
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

        } else {
            setClasses([]);
        }
    }, [watchYear, setValue]);

    // Load Sections
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

        } else {
            setSections([]);
        }
    }, [watchYear, watchClass, setValue]);

    // Load Terms 
    useEffect(() => {
        if (watchSection) {
            (async () => {
                try {
                    setLoadingTerms(true);
                    const res = await getTermsAndStudents(watchSection);
                    if (res?.termlist && Array.isArray(res.termlist) && res.termlist.length > 0) {
                        setTerms(res.termlist);
                    } else {
                        setTerms([]);
                        toast.info('No terms found');
                    }
                    // if (res?.studentlist && Array.isArray(res.studentlist) && res.studentlist.length > 0) {
                    //     setStudents(res.studentlist);
                    // } else {
                    //     setStudents([]);
                    //     toast.info('No students found');
                    // }
                } catch (err) {
                    console.error(err);
                    toast.error('Failed to load terms and students');
                } finally {
                    setLoadingTerms(false);
                }
            })();
            setValue('selectedStudents', []);
        } else {
            setTerms([]);
        }
    }, [watchSection, setValue]);

    // Load Students
    useEffect(() => {
        if (!watchYear || !watchClass || !watchSection) return;
        (async () => {
            try {

                const { data } = await getStudentsDropDownByAcademicYearandClassandSectionlist(
                    Number(watchYear),
                    Number(watchClass),
                    Number(watchSection)
                );
                const valid = Array.isArray(data)
                    ? (data as any[]).filter((s): s is { amsT_AdmNo: number; amsT_Id: number; studentName?: string, amsT_FirstName?: string, amsT_MiddleName?: string, amsT_LastName?: string } => !!s?.amsT_Id)
                    : [];

                // Map to consistent format if needed, but the cumulative report logic returns objects with amsT_Id and studentName/amsT_FirstName
                // We'll map them to a structure suitable for the display
                const mappedStudents = valid.map(s => ({
                    amsT_Id: s.amsT_Id,
                    amsT_AdmNo: s.amsT_AdmNo,
                    studentName: s.studentName || `${s.amsT_FirstName || ''} ${s.amsT_MiddleName || ''} ${s.amsT_LastName || ''}`.trim()
                }));

                setStudents(mappedStudents);
                console.log('Students:', mappedStudents);
                setValue('selectedStudents', []);

            } catch {
                toast.error('Failed to load students');
            } finally {
            }
        })();
    }, [watchYear, watchClass, watchSection, setValue]);

    // Super Average Logic
    useEffect(() => {
        if (watchSuperAverage) {
            setValue('EMPG_GroupName', undefined); // Clear term selection
        }
    }, [watchSuperAverage, setValue]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setValue(
                'selectedStudents',
                filteredStudents.map((s) => String(s.amsT_Id))
            );
        } else {
            setValue('selectedStudents', []);
        }
    };

    const onSubmit = async (data: PromotionDetailsReportSchema) => {
        try {
            const result = await getReportDetails(data);
            onReportGenerated(result, data.superAverage);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleClear = () => {
        reset({
            superAverage: false,
            selectedStudents: []
        });
        onReset();
        setStudents([]);
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
                            {/* Left Column */}
                            <div className='space-y-4'>
                                <div className='space-y-2'>
                                    <Controller
                                        control={control}
                                        name='ASMAY_Id'
                                        render={({ field, fieldState }) => (
                                            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                                                <Label className='font-medium text-sm sm:w-32'>
                                                    Academic Year <span className='text-red-500'>*</span>
                                                </Label>
                                                <div className='flex-1'>
                                                    <Select
                                                        key={field.value}
                                                        onValueChange={field.onChange}
                                                        value={field.value ? String(field.value) : ''}>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder='Select Academic Year' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {academicYearLoading ? (
                                                                <SelectItem value='0' disabled>
                                                                    Academic Years are loading...
                                                                </SelectItem>
                                                            ) : academicYears.length === 0 ? (
                                                                <SelectItem value='0' disabled>
                                                                    No Academic Years found
                                                                </SelectItem>
                                                            ) : (
                                                                academicYears.map((y: any) => (
                                                                    <SelectItem key={y.asmaY_Id} value={String(y.asmaY_Id)}>
                                                                        {y.asmaY_Year}
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
                                                <Select key={field.value} onValueChange={field.onChange} value={field.value}>
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
                                                <Select key={field.value} onValueChange={field.onChange} value={field.value}>
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

                                {/* Term */}
                                <div className='space-y-2'>
                                    <Label>
                                        Term <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name='EMPG_GroupName'
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Select
                                                    key={field.value}
                                                    onValueChange={field.onChange}
                                                    value={field.value || ''}
                                                    disabled={watchSuperAverage}>
                                                    <SelectTrigger className={watchSuperAverage ? 'bg-gray-100' : ''}>
                                                        <SelectValue placeholder='Select Term' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingTerms ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : terms.length === 0 ? (
                                                            <SelectItem value='empty' disabled>
                                                                No Terms found
                                                            </SelectItem>
                                                        ) : (
                                                            terms.map((term, idx) => (
                                                                <SelectItem key={idx} value={term.empG_GroupName}>
                                                                    {term.empG_GroupName}
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

                                {/* Super Average */}
                                <div className='flex items-center space-x-2 pt-4'>
                                    <Controller
                                        control={control}
                                        name='superAverage'
                                        render={({ field }) => (
                                            <Checkbox id='superAvg' checked={field.value} onCheckedChange={field.onChange} />
                                        )}
                                    />
                                    <Label htmlFor='superAvg'>Super Average</Label>
                                </div>
                            </div>

                            {/* Right Column: Student Multi-select */}
                            <div className='space-y-4'>
                                <Label>
                                    Student <span className='text-red-500'>*</span>
                                </Label>
                                <div className='rounded-md border p-4'>
                                    <div className='mb-4 flex items-center space-x-2'>
                                        <Checkbox
                                            id='selectAll'
                                            checked={
                                                filteredStudents.length > 0 && watchSelectedStudents?.length === filteredStudents.length
                                            }
                                            onCheckedChange={handleSelectAll}
                                        />
                                        <Label htmlFor='selectAll' className='font-bold'>
                                            Select All
                                        </Label>
                                        <Input
                                            placeholder='Search...'
                                            value={studentSearch}
                                            onChange={(e) => setStudentSearch(e.target.value)}
                                            className='ml-auto w-1/2'
                                        />
                                    </div>
                                    <ScrollArea className='h-[250px]'>
                                        {filteredStudents.map((student) => (
                                            <div
                                                key={student.amsT_Id}
                                                className='flex flex-row items-center space-x-3 space-y-0 rounded p-2 hover:bg-gray-50'>
                                                <Controller
                                                    control={control}
                                                    name='selectedStudents'
                                                    render={({ field }) => (
                                                        <Checkbox
                                                            checked={field.value?.includes(String(student.amsT_Id))}
                                                            onCheckedChange={(checked) => {
                                                                const id = String(student.amsT_Id);
                                                                const current = field.value || [];
                                                                return checked
                                                                    ? field.onChange([...current, id])
                                                                    : field.onChange(current.filter((val) => val !== id));
                                                            }}
                                                        />
                                                    )}
                                                />
                                                <Label className='w-full cursor-pointer font-normal text-sm'>{student.studentName}</Label>
                                            </div>
                                        ))}
                                        {filteredStudents.length === 0 && (
                                            <p className='py-4 text-center text-gray-500'>No students found</p>
                                        )}
                                    </ScrollArea>
                                    {methods.formState.errors.selectedStudents && (
                                        <FormError>{methods.formState.errors.selectedStudents.message}</FormError>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='mt-8 flex justify-center gap-4'>
                            <Button type='submit' disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null} Report
                            </Button>
                            <Button type='button' variant='destructive' onClick={handleClear} disabled={isSubmitting}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeeGroupDefaulterreport, useFeeTermDefaulterreport } from '@/hooks/fees/useReports';
import { studentMarksPublishSchema } from '@/schemas/exam/exam-module/marks-entry';
import { getStudentWisePublishMarksData } from '@/server/exam/exam-module/marks-entry/student-wise-publish-marks';
import {
    getClassDropDownByAcademicYearlist,
    getExamsDropDownByAcademicYearandClassandSectionlist,
    getSectionsDropDownByAcademicYearandClasslist
} from '@/server/exam/exam-module/reports/tbs-report-school';
import { getAcademicYearDropdown } from '@/server/fees/masters/class_yearly_category';
import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof studentMarksPublishSchema.search>;

interface Props {
    onSuccess?: (params: any, data: any[]) => void;
    onRefresh?: (params: any, data: any[]) => void;
    onPayloadChange?: (payload: any) => void;
}

export default function SearchForm({ onSuccess, onRefresh, onPayloadChange }: Props) {
    const [loading, setLoading] = useState(false);

    // Dropdown Data
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);

    // Loading States
    const [loadingYears, setLoadingYears] = useState(true);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingExams, setLoadingExams] = useState(false);

    const methods = useForm<FormFields>({
        resolver: zodResolver(studentMarksPublishSchema.search),
        defaultValues: {
            radiotype: 'Exam',
            asmaY_Id: 0,
            asmcL_Id: 0,
            asmS_Id: 0,
            emE_Id: 0,
            feeinstallmentcheckbox: false,
            SMSFLAG: false,
            EMAILFLAG: false,
            NOTIFYFLAG: false,
            feeGroupIds: [],
            FMT_Id: 0
        }
    });

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isValid }
    } = methods;

    const watchType = useWatch({ control, name: 'radiotype' });
    const watchYear = useWatch({ control, name: 'asmaY_Id' });
    const watchClass = useWatch({ control, name: 'asmcL_Id' });
    const watchSection = useWatch({ control, name: 'asmS_Id' });
    const watchFeeCheckbox = useWatch({ control, name: 'feeinstallmentcheckbox' });
    const watchExam = useWatch({ control, name: 'emE_Id' });

    // Fee-related hooks
    const { data: feeGroupsData, isLoading: loadingFeeGroup } = useFeeGroupDefaulterreport();
    const { data: feeTermsData, isLoading: loadingFeeTerm } = useFeeTermDefaulterreport();
    const feeGroups = feeGroupsData?.data || [];
    const feeTerms = feeTermsData?.data || [];

    // 1. Fetch Academic Years on Mount
    useEffect(() => {
        const fetchYears = async () => {
            try {
                setLoadingYears(true);
                const response = await getAcademicYearDropdown();
                if (response.success) {
                    setAcademicYears(response.data || []);
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to load academic years');
            } finally {
                setLoadingYears(false);
            }
        };
        fetchYears();
    }, []);

    // 2. Fetch Classes when Year Changes
    useEffect(() => {
        if (watchYear) {
            const fetchClasses = async () => {
                try {
                    setLoadingClasses(true);
                    // Clear dependents
                    setClasses([]);
                    setSections([]);
                    setExams([]);
                    setValue('asmcL_Id', 0);
                    setValue('asmS_Id', 0);
                    setValue('emE_Id', 0);

                    const res = await getClassDropDownByAcademicYearlist(watchYear);
                    const data = res.data || [];
                    setClasses(data);

                    if (data.length === 0) toast.info('No classes found for selected academic year');
                } catch (error) {
                    console.error(error);
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
            setValue('asmcL_Id', 0);
            setValue('asmS_Id', 0);
            setValue('emE_Id', 0);
        }
    }, [watchYear, setValue]);

    // 3. Fetch Sections when Class Changes
    useEffect(() => {
        if (watchYear && watchClass) {
            const fetchSections = async () => {
                try {
                    setLoadingSections(true);
                    // Clear dependents
                    setSections([]);
                    setExams([]);
                    setValue('asmS_Id', 0);
                    setValue('emE_Id', 0);

                    const res = await getSectionsDropDownByAcademicYearandClasslist(watchYear, watchClass);
                    const data = res.data || [];
                    setSections(data);

                    if (data.length === 0) toast.info('No sections found for selected class');
                } catch (error) {
                    console.error(error);
                    toast.error('Failed to load sections');
                    setSections([]);
                } finally {
                    setLoadingSections(false);
                }
            };
            fetchSections();
        } else {
            setSections([]);
            setExams([]);
            setValue('asmS_Id', 0);
            setValue('emE_Id', 0);
        }
    }, [watchYear, watchClass, setValue]);

    // 4. Fetch Exams when Section Changes
    useEffect(() => {
        if (watchYear && watchClass && watchSection) {
            const fetchExams = async () => {
                try {
                    setLoadingExams(true);
                    setValue('emE_Id', 0);
                    setExams([]);

                    if (watchType === 'Exam') {
                        const res = await getExamsDropDownByAcademicYearandClassandSectionlist(watchYear, watchClass, watchSection);
                        const data = res.data || [];
                        setExams(data);
                        if (data.length === 0) toast.info('No exams found for selected section');
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('Failed to load exams');
                    setExams([]);
                } finally {
                    setLoadingExams(false);
                }
            };
            fetchExams();
        } else {
            setExams([]);
            setValue('emE_Id', 0);
        }
    }, [watchYear, watchClass, watchSection, watchType, setValue]);

    const handleSearch = async (formData: FormFields) => {
        setLoading(true);
        try {
            const payload = {
                // mI_Id: 30, // or from context/store if dynamic
                asmaY_Id: formData.asmaY_Id,
                asmcL_Id: formData.asmcL_Id,
                asmS_Id: formData.asmS_Id,
                emE_Id: formData.emE_Id,
                radiotype: formData.radiotype,
                feeinstallmentcheckbox: formData.feeinstallmentcheckbox,
                fmT_Id: formData.feeinstallmentcheckbox ? formData.FMT_Id : 0,
                ismS_Id: 0,
                tempGroupList: formData.feeGroupIds?.length ? formData.feeGroupIds : [0]
            };
            console.log('Payload:', payload);
            const { data: response } = await getStudentWisePublishMarksData(payload);
            const apiStudents = Array.isArray(response) ? response : [];

            // Always trigger onSuccess to ensure UI updates (opens details)
            if (onSuccess) {
                onSuccess(formData, apiStudents);
            }
            if (onPayloadChange) {
                onPayloadChange(payload);
            }

            toast.success(`${apiStudents.length} students found`);
        } catch (error: any) {
            console.error('Search error:', error);
            toast.error(error.message || 'Failed to search students');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        reset({
            radiotype: 'Exam',
            asmaY_Id: 0,
            asmcL_Id: 0,
            asmS_Id: 0,
            emE_Id: 0,
            feeinstallmentcheckbox: false,
            SMSFLAG: false,
            EMAILFLAG: false,
            NOTIFYFLAG: false,
            feeGroupIds: [],
            FMT_Id: 0
        });

        setClasses([]);
        setSections([]);
        setExams([]);

        // Notify parent to close details
        if (onRefresh) {
            onRefresh({}, []);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleSearch)} className='space-y-6'>
            {/* Radio Buttons */}
            <div className='flex justify-center'>
                <div className='inline-flex rounded-lg border p-1'>
                    <Controller
                        control={control}
                        name='radiotype'
                        render={({ field }) => (
                            <>
                                <button
                                    type='button'
                                    className={`rounded-md px-6 py-2 font-medium text-sm transition-colors ${
                                        field.value === 'Exam'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-transparent text-gray-600 hover:bg-gray-100'
                                    }`}
                                    onClick={() => field.onChange('Exam')}>
                                    Exam Wise
                                </button>
                                <button
                                    type='button'
                                    className={`rounded-md px-6 py-2 font-medium text-sm transition-colors ${
                                        field.value === 'Promotion'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-transparent text-gray-600 hover:bg-gray-100'
                                    }`}
                                    onClick={() => {
                                        field.onChange('Promotion');
                                        setValue('emE_Id', 0);
                                    }}>
                                    Promotion
                                </button>
                            </>
                        )}
                    />
                </div>
            </div>

            {/* Form Grid */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Left Column */}
                <div className='space-y-4'>
                    {/* Academic Year */}
                    <div>
                        <Label>Academic Year *</Label>
                        <Controller
                            control={control}
                            name='asmaY_Id'
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        key={field.value} // Force re-render on reset
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={String(field.value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingYears ? 'Loading Academic Year...' : 'Select Academic Year'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {loadingYears ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading Academic Year...
                                                </SelectItem>
                                            ) : academicYears.length === 0 ? (
                                                <SelectItem value='none' disabled>
                                                    No academic years available
                                                </SelectItem>
                                            ) : (
                                                academicYears.map((year: any) => (
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

                    {/* Exclude Fee Defaulters Checkbox */}
                    <div className='space-y-2'>
                        <Controller
                            control={control}
                            name='feeinstallmentcheckbox'
                            render={({ field }) => (
                                <div className='flex items-center space-x-2'>
                                    <Checkbox id='feeinstallmentcheckbox' checked={field.value} onCheckedChange={field.onChange} />
                                    <Label htmlFor='feeinstallmentcheckbox' className='font-medium'>
                                        Exclude Fee Defaulters: *
                                    </Label>
                                </div>
                            )}
                        />
                    </div>

                    {/* Fee Term (only when Exclude Fee Defaulters is checked) */}
                    <div>
                        <Label>Fee Term *</Label>
                        <Controller
                            control={control}
                            name='FMT_Id'
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        key={field.value}
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={String(field.value)}
                                        disabled={!watchFeeCheckbox}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingFeeTerm ? 'Loading fee terms...' : 'Select Fee Term'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='0'>Select Fee Term</SelectItem>
                                            {loadingFeeTerm ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading fee terms...
                                                </SelectItem>
                                            ) : feeTerms.length === 0 ? (
                                                <SelectItem value='none' disabled>
                                                    No fee terms available
                                                </SelectItem>
                                            ) : (
                                                feeTerms.map((term: any) => (
                                                    <SelectItem key={term.fmT_Id} value={String(term.fmT_Id)}>
                                                        {term.fmT_Name}
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

                    {/* Fee Group Multi-select */}
                    <div>
                        <div className='mb-2'>
                            <Label className='font-medium'>Fee Group: *</Label>
                        </div>
                        <Controller
                            control={control}
                            name='feeGroupIds'
                            render={({ field, fieldState }) => (
                                <>
                                    <CustomMultiSelectBox
                                        options={feeGroups.map((group: any) => ({
                                            label: group.fmG_GroupName,
                                            value: group.fmG_Id.toString()
                                        }))}
                                        onChange={(vals) => field.onChange(vals.map((v: string) => Number(v)))}
                                        value={field.value ? field.value.map((v) => v.toString()) : []}
                                        placeholder={loadingFeeGroup ? 'Loading fee groups...' : 'Select Fee Group'}
                                        height='150px'
                                        isSearchRequired={true}
                                        disabled={!watchFeeCheckbox}
                                    />
                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                </>
                            )}
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className='space-y-4'>
                    {/* Class */}
                    <div>
                        <Label>Class *</Label>
                        <Controller
                            control={control}
                            name='asmcL_Id'
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        key={field.value} // Force re-render on reset
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={String(field.value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingClasses ? 'Loading classes...' : 'Select Class'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {loadingClasses ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading classes...
                                                </SelectItem>
                                            ) : classes.length === 0 ? (
                                                <SelectItem value='none' disabled>
                                                    No classes available
                                                </SelectItem>
                                            ) : (
                                                classes.map((cls: any) => (
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
                    <div>
                        <Label>Section *</Label>
                        <Controller
                            control={control}
                            name='asmS_Id'
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        key={field.value} // Force re-render on reset
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={String(field.value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingSections ? 'Loading sections...' : 'Select Section'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {loadingSections ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading sections...
                                                </SelectItem>
                                            ) : sections.length === 0 ? (
                                                <SelectItem value='none' disabled>
                                                    No sections available
                                                </SelectItem>
                                            ) : (
                                                sections.map((sec: any) => (
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

                    {/* Exam Name (only for Exam Wise) */}
                    <div>
                        <Label>Exam Name {watchType === 'Exam' && '*'}</Label>
                        <Controller
                            control={control}
                            name='emE_Id'
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        key={field.value} // Force re-render on reset
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={String(field.value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingExams ? 'Loading exams...' : 'Select Exam Name'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {loadingExams ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading exams...
                                                </SelectItem>
                                            ) : exams.length === 0 ? (
                                                <SelectItem value='none' disabled>
                                                    No exams available
                                                </SelectItem>
                                            ) : (
                                                exams.map((exam: any) => (
                                                    <SelectItem key={exam.emE_Id} value={String(exam.emE_Id)}>
                                                        {exam.emE_ExamName}
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
            </div>

            {/* Buttons */}
            <div className='flex justify-center gap-4 pt-4'>
                <Button
                    type='submit'
                    disabled={loading || !isValid || !watchYear || !watchClass || !watchSection || (watchType === 'Exam' && !watchExam)}
                    className='min-w-[120px]'>
                    {loading ? (
                        <span className='flex items-center gap-2'>
                            <Search className='h-4 w-4' />
                            Searching...
                        </span>
                    ) : (
                        <span className='flex items-center gap-2'>
                            <Search className='h-4 w-4' />
                            Search
                        </span>
                    )}
                </Button>

                <Button type='button' variant='outline' onClick={handleReset} disabled={loading}>
                    <RotateCcw className='mr-2 h-4 w-4' />
                    Reset
                </Button>
            </div>
        </form>
    );
}

'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { StudentTransactionSchema } from '@/schemas/exam/exam-module/exam-mapping';
import {
    getStudentList,
    getTermOrExams,
    onchangeActivities,
    onchangeSkills,
    saveCCEStudentMarks
} from '@/server/exam/exam-module/exam-mapping/student-transaction-cce';
import { getCoScholasticActivityDropdownList } from '@/server/exam/exam-module/masters/co-scholastic-activity';
import { getMasterLifeSkillDrpdownList } from '@/server/exam/exam-module/masters/life-skills';
import {
    getClassDropDownByAcademicYearlist,
    getSectionsDropDownByAcademicYearandClasslist
} from '@/server/exam/exam-module/reports/cumulative-report';
import type {
    IActivityArea,
    IActivityName,
    IClass,
    IExamMaster,
    ISavedScore,
    ISection,
    ISkillArea,
    ISkillName,
    IStudentTransaction,
    ITerm
} from '@/types/exam/exam-module/exam-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcw, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { StudentTransactionColumns } from './_components/columns';

type FormFields = z.infer<typeof StudentTransactionSchema.search>;

export default function StudentTransactionPage() {
    return <StudentTransactionContent />;
}

function StudentTransactionContent() {
    // Form setup with schema validation
    const methods = useForm<FormFields>({
        resolver: zodResolver(StudentTransactionSchema.search),
        mode: 'onChange',
        defaultValues: {
            academicYearId: 0,
            classId: 0,
            sectionId: 0,
            examTermId: 0,
            emE_Id: 0,
            skillActivityType: undefined,
            nameId: 0,
            areaId: 0,
            exam_termwise_flag: 'TermWise'
        }
    });

    const { control, handleSubmit, watch, setValue, formState, trigger, reset: formReset } = methods;
    const { errors, isSubmitting, isValid } = formState;

    // Watch form values
    const watchAcademicYear = watch('academicYearId');
    const watchClass = watch('classId');
    const watchSection = watch('sectionId');
    const watchExamTerm = watch('examTermId');
    const watchEmEId = watch('emE_Id');
    const watchSkillActivity = watch('skillActivityType');
    const watchName = watch('nameId');
    const watchArea = watch('areaId');
    const watchExamType = watch('exam_termwise_flag');

    // Dropdown data states
    const { data: academicYearsData, isLoading: loadingAcademicYears } = useAcademicYearDropdown();
    const [academicYears, setAcademicYears] = useState<{ asmaY_Id: number; asmaY_Year: string }[]>([]);
    const [classes, setClasses] = useState<IClass[]>([]);
    const [sections, setSections] = useState<ISection[]>([]);
    const [examTerms, setExamTerms] = useState<ITerm[]>([]);
    const [exams, setExams] = useState<IExamMaster[]>([]);
    const [skillNames, setSkillNames] = useState<ISkillName[]>([]);
    const [activityNames, setActivityNames] = useState<IActivityName[]>([]);
    const [skillAreas, setSkillAreas] = useState<ISkillArea[]>([]);
    const [activityAreas, setActivityAreas] = useState<IActivityArea[]>([]);
    const [students, setStudents] = useState<IStudentTransaction[]>([]);
    const [originalStudents, setOriginalStudents] = useState<IStudentTransaction[]>([]);
    const [savedScores, setSavedScores] = useState<ISavedScore[]>([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [hideSaveButton, setHideSaveButton] = useState(false);
    const [isSelectAll, setIsSelectAll] = useState(false);

    // Loading states
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingExamData, setLoadingExamData] = useState(false);
    const [loadingNames, setLoadingNames] = useState(false);
    const [loadingAreas, setLoadingAreas] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Initialize academic years
    useEffect(() => {
        if (academicYearsData?.data) {
            const years = academicYearsData.data.map((y: any) => ({
                asmaY_Id: y.asmaY_Id,
                asmaY_Year: y.asmaY_Year,
                Selected: y.Selected || false
            }));
            setAcademicYears(years);
        }
    }, [academicYearsData]);

    // Clear all dependent fields
    const clearDependentFields = () => {
        setValue('sectionId', 0);
        setValue('examTermId', 0);
        setValue('emE_Id', 0);
        setValue('skillActivityType', undefined);
        setValue('nameId', 0);
        setValue('areaId', 0);

        setSections([]);
        setExamTerms([]);
        setExams([]);
        setSkillNames([]);
        setActivityNames([]);
        setSkillAreas([]);
        setActivityAreas([]);
        setStudents([]);
        setOriginalStudents([]);
        setSavedScores([]);
        setShowTable(false);
        setSelectedStudentIds([]);
        setHideSaveButton(false);
        setIsSelectAll(false);
    };

    const tableProps = useDataTableProps({
        data: students,
        total: students.length,
        pageIndex: 0,
        pageSize: 10
    });

    // Load classes when academic year changes
    useEffect(() => {
        if (!watchAcademicYear || watchAcademicYear === 0) {
            clearDependentFields();
            setClasses([]);
            return;
        }

        const fetchClasses = async () => {
            setLoadingClasses(true);
            try {
                const { data } = await getClassDropDownByAcademicYearlist(watchAcademicYear);
                setClasses(Array.isArray(data) ? data : []);
                console.log('classes', data);
                clearDependentFields();
            } catch (err) {
                console.error('Error loading classes:', err);
                toast.error('Failed to load classes');
                setClasses([]);
            } finally {
                setLoadingClasses(false);
            }
        };

        fetchClasses();
    }, [watchAcademicYear, watchExamType]);

    // Load sections when class changes
    useEffect(() => {
        if (!watchAcademicYear || !watchClass || watchClass === 0) {
            clearDependentFields();
            setSections([]);
            return;
        }

        const fetchSections = async () => {
            setLoadingSections(true);
            try {
                const response = await getSectionsDropDownByAcademicYearandClasslist(watchAcademicYear, watchClass);

                if (response.data) {
                    const sectionList = Array.isArray(response.data) ? response.data : [];
                    setSections(sectionList);
                    console.log('sections', sectionList);
                } else {
                    setSections([]);
                }

                // Clear further dependent fields
                setValue('sectionId', 0);
                setValue('examTermId', 0);
                setValue('emE_Id', 0);
                setValue('skillActivityType', undefined);
                setValue('nameId', 0);
                setValue('areaId', 0);

                setExamTerms([]);
                setExams([]);
                setSkillNames([]);
                setActivityNames([]);
                setSkillAreas([]);
                setActivityAreas([]);
                setStudents([]);
                setShowTable(false);
            } catch (err) {
                console.error('Error loading sections:', err);
                toast.error('Failed to load sections');
                setSections([]);
            } finally {
                setLoadingSections(false);
            }
        };

        fetchSections();
    }, [watchAcademicYear, watchClass, watchExamType]);

    // Load exam terms/exams when section changes
    useEffect(() => {
        if (!watchAcademicYear || !watchClass || !watchSection || watchSection === 0) {
            setExamTerms([]);
            setExams([]);
            setValue('examTermId', 0);
            setValue('emE_Id', 0);
            return;
        }

        const fetchExamData = async () => {
            setLoadingExamData(true);
            try {
                const response = await getTermOrExams({
                    ASMAY_Id: watchAcademicYear,
                    ASMCL_Id: watchClass,
                    ASMS_Id: watchSection,
                    EXAM_TERMWISE_FLAG: watchExamType
                });

                if (response.data) {
                    if (watchExamType === 'TermWise') {
                        const termData = Array.isArray(response.data) ? response.data : [];
                        console.log('termData', termData);
                        setExamTerms(termData);
                        setExams([]);
                    } else {
                        const examData = Array.isArray(response.data) ? response.data : [];
                        console.log('examData', examData);
                        setExams(examData);
                        setExamTerms([]);
                    }
                }
            } catch (err) {
                console.error('Error loading exam data:', err);
                toast.error('Failed to load exam data');
                setExamTerms([]);
                setExams([]);
            } finally {
                setLoadingExamData(false);
            }
        };

        fetchExamData();
    }, [watchAcademicYear, watchClass, watchSection, watchExamType]);

    // Load Skills/Activities names when type is selected
    useEffect(() => {
        if (!watchSkillActivity || !watchAcademicYear || !watchClass || !watchSection) {
            setSkillNames([]);
            setActivityNames([]);
            setValue('nameId', 0);
            setValue('areaId', 0);
            setSkillAreas([]);
            setActivityAreas([]);
            setShowTable(false);
            return;
        }

        const fetchNames = async () => {
            setLoadingNames(true);
            try {
                if (watchSkillActivity === 'Skills') {
                    const response = await getMasterLifeSkillDrpdownList();
                    const skillsList = Array.isArray(response.data) ? response.data : [];
                    setSkillNames(skillsList);
                    console.log('skillsList', skillsList);
                    setActivityNames([]);
                    setSkillAreas([]);
                    setActivityAreas([]);
                } else {
                    const CcActivities_response = await getCoScholasticActivityDropdownList();
                    const activitiesList = Array.isArray(CcActivities_response.data) ? CcActivities_response.data : [];
                    setActivityNames(activitiesList);
                    console.log('activitiesList', activitiesList);
                    setSkillNames([]);
                    setSkillAreas([]);
                    setActivityAreas([]);
                }
            } catch (err) {
                console.error(`Error loading ${watchSkillActivity} names:`, err);
                toast.error(`Failed to load ${watchSkillActivity} names`);
                setSkillNames([]);
                setActivityNames([]);
            } finally {
                setLoadingNames(false);
            }
        };

        fetchNames();
    }, [watchSkillActivity, watchAcademicYear, watchClass, watchSection, watchExamType, watchEmEId, watchExamTerm]);

    // Load areas when name is selected
    useEffect(() => {
        if (!watchName || watchName === 0 || !watchSkillActivity || !watchAcademicYear || !watchClass || !watchSection) {
            setSkillAreas([]);
            setActivityAreas([]);
            setValue('areaId', 0);
            setShowTable(false);
            return;
        }

        const fetchAreas = async () => {
            setLoadingAreas(true);
            try {
                const params: any = {
                    ASMAY_Id: watchAcademicYear,
                    ECS_Id: 0,
                    ECACT_Id: 0
                };

                // Add exam id based on type
                if (watchExamType === 'ExamWise' && watchEmEId) {
                    params.EME_Id = watchEmEId;
                } else if (watchExamType === 'TermWise' && watchExamTerm) {
                    params.ECT_Id = watchExamTerm;
                }

                type ApiResponse<T> = {
                    data?: T;
                };

                let response: ApiResponse<any[]> | null = null;

                if (watchSkillActivity === 'Skills') {
                    params.ECS_Id = watchName;
                    response = await onchangeSkills(params);
                } else {
                    params.ECACT_Id = watchName;
                    response = await onchangeActivities(params);
                }

                const areasList = Array.isArray(response?.data) ? response.data : [];
                console.log('areasList', areasList);

                if (watchSkillActivity === 'Skills') {
                    setSkillAreas(areasList);
                    setActivityAreas([]);
                } else {
                    setActivityAreas(areasList);
                    setSkillAreas([]);
                }
            } catch (err) {
                console.error(`Error loading ${watchSkillActivity} areas:`, err);
                toast.error(`Failed to load ${watchSkillActivity} areas`);
                setSkillAreas([]);
                setActivityAreas([]);
            } finally {
                setLoadingAreas(false);
            }
        };

        fetchAreas();
    }, [watchName, watchSkillActivity, watchAcademicYear, watchClass, watchSection, watchExamType, watchEmEId, watchExamTerm]);

    // Handle score change
    const handleScoreChange = useCallback((studentId: number, score: string) => {
        setStudents((prev) => {
            return prev.map((s) => (s.amsT_Id === studentId ? { ...s, ecsactT_Score: score } : s));
        });
    }, []);

    // Handle checkbox change for individual student
    const handleCheckboxChange = useCallback((studentId: number, isChecked: boolean) => {
        setSelectedStudentIds((prev) => {
            if (isChecked) {
                return [...prev, studentId];
            } else {
                return prev.filter((id) => id !== studentId);
            }
        });
    }, []);

    // Handle toggle all checkboxes
    const handleToggleAll = useCallback(() => {
        if (isSelectAll) {
            setSelectedStudentIds([]);
        } else {
            const allIds = students.map((s) => s.amsT_Id);
            setSelectedStudentIds(allIds);
        }
        setIsSelectAll(!isSelectAll);
    }, [isSelectAll, students]);

    // Update isSelectAll when selectedStudentIds changes
    useEffect(() => {
        setIsSelectAll(selectedStudentIds.length === students.length && students.length > 0);
    }, [selectedStudentIds, students]);

    // Handle search
    const handleSearch = async (data: FormFields) => {
        setSubmitted(true);

        if (!isValid) {
            await trigger();
            toast.error('Please fix validation errors');
            return;
        }

        // Required field validation
        if (!data.skillActivityType) {
            methods.setError('skillActivityType', {
                message: 'Select Skill/Activities type'
            });
            toast.error('Select Skill/Activities type');
            return;
        }

        setIsLoading(true);
        setShowTable(false);

        try {
            const params: any = {
                asmaY_Id: data.academicYearId,
                asmcL_Id: data.classId,
                asmS_Id: data.sectionId,
                skills: data.skillActivityType,
                exam_termwise_flag: data.exam_termwise_flag,
                ecacT_Id: data.skillActivityType === 'Activities' ? data.nameId : 0,
                ecactA_Id: data.skillActivityType === 'Activities' ? data.areaId : 0,
                ecS_Id: data.skillActivityType === 'Skills' ? data.nameId : 0,
                ecsA_Id: data.skillActivityType === 'Skills' ? data.areaId : 0
            };

            // Add exam id based on type
            if (data.exam_termwise_flag === 'ExamWise' && data.emE_Id) {
                params.emE_Id = data.emE_Id;
                params.ecT_Id = 0;
            } else if (data.exam_termwise_flag === 'TermWise' && data.examTermId) {
                params.ecT_Id = data.examTermId;
                params.emE_Id = 0;
            }
            console.log('params', params);
            const response = await getStudentList(params);

            if (response.data) {
                const students = Array.isArray(response.data.students) ? response.data.students : [];
                const savedData = Array.isArray(response.data.savedData) ? response.data.savedData : [];

                const studentsWithScores = students.map((student: any) => {
                    const savedScore = savedData.find((s: any) => s.amsT_Id === student.amsT_Id);
                    return {
                        ...student,
                        ecsactT_Score: savedScore?.ecsT_Score || savedScore?.ecsactT_Score || '',
                        ecsT_Id: savedScore?.ecsT_Id || 0,
                        ecsactT_Id: savedScore?.ecsactT_Id || 0,
                        isChecked: !!savedScore // Check if student has saved data
                    };
                });

                setStudents(studentsWithScores);
                setOriginalStudents(studentsWithScores);
                setSavedScores(savedData);

                // Automatically select students who already have saved scores
                const savedStudentIds = savedData.map((s: any) => s.amsT_Id);
                setSelectedStudentIds(savedStudentIds);
                setIsSelectAll(savedStudentIds.length === studentsWithScores.length && studentsWithScores.length > 0);
                setShowTable(true);

                toast.success(`${studentsWithScores.length} students found`);
            } else {
                toast.error('No students found');
            }
        } catch (err: any) {
            console.error('Search error:', err);
            toast.error(err?.message || 'Failed to load student data');
            setStudents([]);
            setShowTable(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle reset
    const handleReset = () => {
        methods.reset({
            academicYearId: 0,
            classId: 0,
            sectionId: 0,
            examTermId: 0,
            emE_Id: 0,
            skillActivityType: undefined,
            nameId: 0,
            areaId: 0,
            exam_termwise_flag: 'TermWise'
        });

        // Reset all states
        setClasses([]);
        setSections([]);
        setExamTerms([]);
        setExams([]);
        setSkillNames([]);
        setActivityNames([]);
        setSkillAreas([]);
        setActivityAreas([]);
        setStudents([]);
        setOriginalStudents([]);
        setSavedScores([]);
        setShowTable(false);
        setSelectedStudentIds([]);
        setHideSaveButton(false);
        setIsSelectAll(false);
        setSubmitted(false);

        // Reload academic years (in case they were affected, though unlikely in this component)
        if (academicYearsData?.data) {
            const years = academicYearsData.data.map((y: any) => ({
                asmaY_Id: y.asmaY_Id,
                asmaY_Year: y.asmaY_Year,
                Selected: y.Selected || false
            }));
            setAcademicYears(years);
        }

        toast.info('Form reset successfully');
    };

    // Handle grid reset (only resets grid changes)
    const handleGridReset = () => {
        setStudents(originalStudents);
        const savedStudentIds = savedScores.map((s: any) => s.amsT_Id);
        setSelectedStudentIds(savedStudentIds);
        setIsSelectAll(savedStudentIds.length === originalStudents.length && originalStudents.length > 0);
        toast.info('Grid changes reset');
    };

    // Handle save scores
    const handleSaveScores = async (verifyFlag = false) => {
        if (selectedStudentIds.length === 0) {
            toast.error('Please select at least one student to save');
            return;
        }

        // Get selected students with their scores
        const selectedStudents = students.filter((student) => selectedStudentIds.includes(student.amsT_Id));

        // Validate that all selected students have scores
        const studentsWithoutScores = selectedStudents.filter((student) => !student.ecsactT_Score || student.ecsactT_Score.trim() === '');

        if (studentsWithoutScores.length > 0) {
            toast.error('Please enter scores for all selected students');
            return;
        }

        if (verifyFlag) {
            const confirmVerify = window.confirm(
                'Once verified, the marks will be frozen and cannot be updated. Do you want to proceed with verification?'
            );
            if (!confirmVerify) return;
        }

        setIsSaving(true);
        try {
            const selectedStudentScore = selectedStudents.map((student) => {
                const baseFields = {
                    amsT_Id: student.amsT_Id,
                    ecsactT_Score: student.ecsactT_Score || '',
                    areaName: String(watchArea),
                    emgR_Id: student.emgR_Id || 0
                };

                if (watchSkillActivity === 'Skills') {
                    return {
                        ...baseFields,
                        ecsT_Id: student.ecsT_Id || 0,
                        ecsactT_Id: 0
                    };
                }
                return {
                    ...baseFields,
                    ecsT_Id: 0,
                    ecsactT_Id: student.ecsactT_Id || 0
                };
            });

            const payload = {
                skills: watchSkillActivity,
                selectedStudentScore,
                asmcL_Id: watchClass,
                asmS_Id: watchSection,
                ecS_Id: watchSkillActivity === 'Skills' ? watchName : 0,
                ecsA_Id: watchSkillActivity === 'Skills' ? watchArea : 0,
                exam_termwise_flag: watchExamType,
                emE_Id: watchExamType === 'ExamWise' ? watchEmEId : 0,
                ecT_Id: watchExamType === 'TermWise' ? watchExamTerm : 0,
                asmaY_Id: watchAcademicYear,
                ecacT_Id: watchSkillActivity === 'Activities' ? watchName : 0,
                ecactA_Id: watchSkillActivity === 'Activities' ? watchArea : 0,
                admno: verifyFlag ? 'V' : 'S'
            };

            console.log('Save payload:', payload);

            const result = await saveCCEStudentMarks(payload);
            console.log('Save result:', result);

            if (result.success || result.returnVal === 'saved') {
                toast.success(verifyFlag ? 'Record verified successfully' : 'Record saved successfully');
                // Refresh the data
                handleSearch(methods.getValues());
            } else if (result.returnVal === 'savingFailed') {
                toast.error('Failed to save record');
            } else {
                toast.error('Sorry...something went wrong');
            }
        } catch (err) {
            console.error('Save error:', err);
            toast.error('Failed to save scores');
        } finally {
            setIsSaving(false);
        }
    };

    // Handle row selection change (for table component if it supports it)
    const handleRowSelectionChange = useCallback(
        (selectedRows: any[]) => {
            const selectedIds = selectedRows.map((row) => row.amsT_Id);
            setSelectedStudentIds(selectedIds);
            setIsSelectAll(selectedIds.length === students.length && students.length > 0);
        },
        [students]
    );

    // Update columns with proper callbacks
    const columns = useMemo(
        () =>
            StudentTransactionColumns({
                onScoreChange: handleScoreChange,
                onCheckboxChange: handleCheckboxChange,
                onToggleAll: handleToggleAll,
                hideSaveButton,
                isSelectAll,
                selectedStudentIds
            }),
        [handleScoreChange, handleCheckboxChange, handleToggleAll, hideSaveButton, isSelectAll, selectedStudentIds]
    );

    // Check if all required fields are filled for search
    const allFieldsFilled =
        watchAcademicYear &&
        watchAcademicYear !== 0 &&
        watchClass &&
        watchClass !== 0 &&
        watchSection &&
        watchSection !== 0 &&
        ((watchExamType === 'TermWise' && watchExamTerm && watchExamTerm !== 0) ||
            (watchExamType === 'ExamWise' && watchEmEId && watchEmEId !== 0)) &&
        watchSkillActivity &&
        watchName &&
        watchName !== 0 &&
        watchArea &&
        watchArea !== 0;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSearch)} className='min-h-screen bg-gray-50 p-6'>
                <div className='container mx-auto space-y-6'>
                    {/* Filters Section */}
                    <div className='rounded-lg border bg-white p-6 shadow-sm'>
                        {/* Radio Buttons */}
                        <div className='mb-6 flex justify-center'>
                            <div className='inline-flex rounded-lg border p-1'>
                                <Controller
                                    control={control}
                                    name='exam_termwise_flag'
                                    render={({ field }) => (
                                        <>
                                            <button
                                                type='button'
                                                className={`rounded-md px-6 py-2 font-medium text-sm transition-colors ${
                                                    field.value === 'TermWise'
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-transparent text-gray-600 hover:bg-gray-100'
                                                }`}
                                                onClick={() => {
                                                    field.onChange('TermWise');
                                                    setValue('emE_Id', 0);
                                                    setValue('examTermId', 0);
                                                    setShowTable(false);
                                                }}>
                                                Term Wise
                                            </button>
                                            <button
                                                type='button'
                                                className={`rounded-md px-6 py-2 font-medium text-sm transition-colors ${
                                                    field.value === 'ExamWise'
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-transparent text-gray-600 hover:bg-gray-100'
                                                }`}
                                                onClick={() => {
                                                    field.onChange('ExamWise');
                                                    setValue('examTermId', 0);
                                                    setValue('emE_Id', 0);
                                                    setShowTable(false);
                                                }}>
                                                Exam Wise
                                            </button>
                                        </>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
                            {/* Academic Year */}
                            <div>
                                <Label htmlFor='academic-year'>
                                    Year: <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='academicYearId'
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select
                                                key={field.value}
                                                value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                                onValueChange={(v) => {
                                                    field.onChange(v ? Number(v) : 0);
                                                    trigger('academicYearId');
                                                    clearDependentFields();
                                                    setClasses([]);
                                                    setValue('classId', 0);
                                                }}>
                                                <SelectTrigger id='academic-year'>
                                                    <SelectValue
                                                        placeholder={loadingAcademicYears ? 'loading.....' : 'Select Academic Year'}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {loadingAcademicYears ? (
                                                        <SelectItem value='loading' disabled>
                                                            loading.....
                                                        </SelectItem>
                                                    ) : academicYears.length === 0 ? (
                                                        <SelectItem value='placeholder' disabled>
                                                            No academic years available
                                                        </SelectItem>
                                                    ) : (
                                                        academicYears.map((year) => (
                                                            <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                                                {year.asmaY_Year}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {submitted && fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Class */}
                            <div>
                                <Label htmlFor='class'>
                                    Class: <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='classId'
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select
                                                key={field.value}
                                                value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                                onValueChange={(v) => {
                                                    const numValue = Number(v);
                                                    field.onChange(numValue !== 0 ? numValue : 0);
                                                    trigger('classId');
                                                    setValue('sectionId', 0);
                                                    setValue('examTermId', 0);
                                                    setValue('emE_Id', 0);
                                                    setValue('skillActivityType', undefined);
                                                    setValue('nameId', 0);
                                                    setValue('areaId', 0);
                                                    setSections([]);
                                                    setStudents([]);
                                                    setShowTable(false);
                                                }}>
                                                <SelectTrigger id='class'>
                                                    <SelectValue placeholder={loadingClasses ? 'loading.....' : 'Select Class'} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {loadingClasses ? (
                                                        <SelectItem value='loading' disabled>
                                                            loading.....
                                                        </SelectItem>
                                                    ) : classes.length === 0 ? (
                                                        <SelectItem value='placeholder' disabled>
                                                            No classes available
                                                        </SelectItem>
                                                    ) : (
                                                        classes.map((cls) => (
                                                            <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>
                                                                {cls.asmcL_ClassName}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {submitted && fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Section */}
                            <div>
                                <Label htmlFor='section'>
                                    Section: <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='sectionId'
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select
                                                key={field.value}
                                                value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                                onValueChange={(v) => {
                                                    field.onChange(v ? Number(v) : 0);
                                                    trigger('sectionId');
                                                    setValue('examTermId', 0);
                                                    setValue('emE_Id', 0);
                                                    setValue('skillActivityType', undefined);
                                                    setValue('nameId', 0);
                                                    setValue('areaId', 0);
                                                    setStudents([]);
                                                    setShowTable(false);
                                                }}>
                                                <SelectTrigger id='section'>
                                                    <SelectValue placeholder={loadingSections ? 'loading.....' : 'Select Section'} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {loadingSections ? (
                                                        <SelectItem value='loading' disabled>
                                                            loading.....
                                                        </SelectItem>
                                                    ) : sections.length === 0 ? (
                                                        <SelectItem value='placeholder' disabled>
                                                            No sections available
                                                        </SelectItem>
                                                    ) : (
                                                        sections.map((section) => (
                                                            <SelectItem key={section.asmS_Id} value={section.asmS_Id.toString()}>
                                                                {section.asmC_SectionName}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {submitted && fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Exam Term (only for Term Wise) */}
                            {watchExamType === 'TermWise' && (
                                <div>
                                    <Label htmlFor='exam-term'>
                                        Exam Term: <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name='examTermId'
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Select
                                                    key={field.value}
                                                    value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                                    onValueChange={(v) => {
                                                        const numValue = Number(v);
                                                        field.onChange(numValue !== 0 ? numValue : 0);
                                                        setValue('skillActivityType', undefined);
                                                        setValue('nameId', 0);
                                                        setValue('areaId', 0);
                                                        setStudents([]);
                                                        setShowTable(false);
                                                    }}>
                                                    <SelectTrigger id='exam-term'>
                                                        <SelectValue placeholder={loadingExamData ? 'loading.....' : 'Select Exam Term'} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingExamData ? (
                                                            <SelectItem value='loading' disabled>
                                                                loading.....
                                                            </SelectItem>
                                                        ) : examTerms.length === 0 ? (
                                                            <SelectItem value='placeholder' disabled>
                                                                No exam terms available
                                                            </SelectItem>
                                                        ) : (
                                                            examTerms.map((term) => (
                                                                <SelectItem key={term.ecT_Id} value={term.ecT_Id.toString()}>
                                                                    {term.ecT_TermName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {submitted && fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </>
                                        )}
                                    />
                                </div>
                            )}

                            {/* Exam (only for Exam Wise) */}
                            {watchExamType === 'ExamWise' && (
                                <div>
                                    <Label htmlFor='exam'>
                                        Exam: <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name='emE_Id'
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Select
                                                    key={field.value}
                                                    value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                                    onValueChange={(v) => {
                                                        const numValue = Number(v);
                                                        field.onChange(numValue !== 0 ? numValue : 0);
                                                        setValue('skillActivityType', undefined);
                                                        setValue('nameId', 0);
                                                        setValue('areaId', 0);
                                                        setStudents([]);
                                                        setShowTable(false);
                                                    }}>
                                                    <SelectTrigger id='exam'>
                                                        <SelectValue placeholder={loadingExamData ? 'loading.....' : 'Select Exam'} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingExamData ? (
                                                            <SelectItem value='loading' disabled>
                                                                loading.....
                                                            </SelectItem>
                                                        ) : watchExamType === 'ExamWise' ? (
                                                            exams.length === 0 ? (
                                                                <SelectItem value='placeholder' disabled>
                                                                    No exams available
                                                                </SelectItem>
                                                            ) : (
                                                                exams.map((exam) => (
                                                                    <SelectItem key={exam.emE_Id} value={exam.emE_Id.toString()}>
                                                                        {exam.emE_ExamName}
                                                                    </SelectItem>
                                                                ))
                                                            )
                                                        ) : watchExamType === 'TermWise' ? (
                                                            examTerms.length === 0 ? (
                                                                <SelectItem value='placeholder' disabled>
                                                                    No exams available
                                                                </SelectItem>
                                                            ) : (
                                                                examTerms.map((exam) => (
                                                                    <SelectItem key={exam.ecT_Id} value={exam.ecT_Id.toString()}>
                                                                        {exam.ecT_TermName}
                                                                    </SelectItem>
                                                                ))
                                                            )
                                                        ) : null}
                                                    </SelectContent>
                                                </Select>
                                                {submitted && fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </>
                                        )}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Skill/Activities Section */}
                        <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-3'>
                            {/* Skill/Activities Type */}
                            <div>
                                <Label htmlFor='Skills-Activities-type'>
                                    Skill/Activities: <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='skillActivityType'
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select
                                                key={field.value}
                                                value={field.value || ''}
                                                onValueChange={(v: 'Skills' | 'Activities') => {
                                                    field.onChange(v);
                                                    setValue('nameId', 0);
                                                    setValue('areaId', 0);
                                                    setStudents([]);
                                                    setShowTable(false);
                                                }}
                                                disabled={
                                                    !watchExamType ||
                                                    (watchExamType === 'TermWise' && (!watchExamTerm || watchExamTerm === 0)) ||
                                                    (watchExamType === 'ExamWise' && (!watchEmEId || watchEmEId === 0))
                                                }>
                                                <SelectTrigger id='Skills-Activities-type'>
                                                    <SelectValue placeholder='Select Type' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='Skills'>Skills</SelectItem>
                                                    <SelectItem value='Activities'>Activities</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {submitted && fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Skill Name - Only shows when "Skills" is selected */}
                            {watchSkillActivity === 'Skills' && (
                                <div>
                                    <Label htmlFor='Skills-name'>
                                        Skills Name: <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name='nameId'
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Select
                                                    key={field.value}
                                                    value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                                    onValueChange={(v) => {
                                                        const numValue = Number(v);
                                                        field.onChange(numValue !== 0 ? numValue : 0);
                                                        setValue('areaId', 0);
                                                        setStudents([]);
                                                        setShowTable(false);
                                                    }}>
                                                    <SelectTrigger id='Skills-name'>
                                                        <SelectValue placeholder={loadingNames ? 'loading.....' : 'Select Skills Name'} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingNames ? (
                                                            <SelectItem value='loading' disabled>
                                                                loading.....
                                                            </SelectItem>
                                                        ) : skillNames.length === 0 ? (
                                                            <SelectItem value='placeholder' disabled>
                                                                No skills available
                                                            </SelectItem>
                                                        ) : (
                                                            skillNames.map((item) => (
                                                                <SelectItem key={item.ecS_Id} value={item.ecS_Id.toString()}>
                                                                    {item.ecS_SkillName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {submitted && fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </>
                                        )}
                                    />
                                </div>
                            )}

                            {/* Activity Name - Only shows when "Activities" is selected */}
                            {watchSkillActivity === 'Activities' && (
                                <div>
                                    <Label htmlFor='Activities-name'>
                                        Activities Name: <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name='nameId'
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Select
                                                    key={field.value}
                                                    value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                                    onValueChange={(v) => {
                                                        const numValue = Number(v);
                                                        field.onChange(numValue !== 0 ? numValue : 0);
                                                        setValue('areaId', 0);
                                                        setStudents([]);
                                                        setShowTable(false);
                                                    }}>
                                                    <SelectTrigger id='Activities-name'>
                                                        <SelectValue
                                                            placeholder={loadingNames ? 'loading.....' : 'Select Activities Name'}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingNames ? (
                                                            <SelectItem value='loading' disabled>
                                                                loading.....
                                                            </SelectItem>
                                                        ) : activityNames.length === 0 ? (
                                                            <SelectItem value='placeholder' disabled>
                                                                No activities available
                                                            </SelectItem>
                                                        ) : (
                                                            activityNames.map((item) => (
                                                                <SelectItem key={item.ecacT_Id} value={item.ecacT_Id.toString()}>
                                                                    {item.ecacT_SkillName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {submitted && fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </>
                                        )}
                                    />
                                </div>
                            )}

                            {/* Skill Area - Only shows when "Skills" is selected AND Skills name is chosen */}
                            {watchSkillActivity === 'Skills' && watchName && watchName !== 0 && (
                                <div>
                                    <Label htmlFor='Skills-area'>
                                        Skill Area: <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name='areaId'
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Select
                                                    key={field.value}
                                                    value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                                    onValueChange={(v) => {
                                                        const numValue = Number(v);
                                                        field.onChange(numValue !== 0 ? numValue : 0);
                                                        setStudents([]);
                                                        setShowTable(false);
                                                    }}>
                                                    <SelectTrigger id='Skills-area'>
                                                        <SelectValue placeholder={loadingAreas ? 'loading.....' : 'Select Skill Area'} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingAreas ? (
                                                            <SelectItem value='loading' disabled>
                                                                loading.....
                                                            </SelectItem>
                                                        ) : skillAreas.length === 0 ? (
                                                            <SelectItem value='placeholder' disabled>
                                                                No skill areas available
                                                            </SelectItem>
                                                        ) : (
                                                            skillAreas.map((area) => (
                                                                <SelectItem key={area.ecsA_Id} value={area.ecsA_Id.toString()}>
                                                                    {area.areaName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {submitted && fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </>
                                        )}
                                    />
                                </div>
                            )}

                            {/* Activity Area - Only shows when "Activities" is selected AND Activities name is chosen */}
                            {watchSkillActivity === 'Activities' && watchName && watchName !== 0 && (
                                <div>
                                    <Label htmlFor='Activities-area'>
                                        Activities Area: <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name='areaId'
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Select
                                                    key={field.value}
                                                    value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                                    onValueChange={(v) => {
                                                        const numValue = Number(v);
                                                        field.onChange(numValue !== 0 ? numValue : 0);
                                                        setStudents([]);
                                                        setShowTable(false);
                                                    }}>
                                                    <SelectTrigger id='Activities-area'>
                                                        <SelectValue
                                                            placeholder={loadingAreas ? 'loading.....' : 'Select Activities Area'}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingAreas ? (
                                                            <SelectItem value='loading' disabled>
                                                                loading.....
                                                            </SelectItem>
                                                        ) : activityAreas.length === 0 ? (
                                                            <SelectItem value='placeholder' disabled>
                                                                No activity areas available
                                                            </SelectItem>
                                                        ) : (
                                                            activityAreas.map((area) => (
                                                                <SelectItem key={area.ecactA_Id} value={String(area.ecactA_Id)}>
                                                                    {area.ecactA_SkillArea}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {submitted && fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </>
                                        )}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Search Button */}
                        <div className='mx-auto mt-8 flex w-fit justify-center gap-4'>
                            <Button type='submit' className='px-8 py-2 font-medium text-white shadow'>
                                {isLoading ? (
                                    <span className='flex items-center gap-2'>
                                        <Search className='h-4 w-4' />
                                        SEARCHING...
                                    </span>
                                ) : (
                                    <span className='flex items-center gap-2'>
                                        <Search className='h-4 w-4' />
                                        STUDENT LIST
                                    </span>
                                )}
                            </Button>

                            <Button type='button' variant='outline' onClick={handleReset} disabled={isLoading}>
                                <RotateCcw className='mr-2 h-4 w-4' />
                                CANCEL
                            </Button>
                        </div>
                    </div>

                    {/* Student Table (only shows when data is loaded) */}
                    {showTable && tableProps && (
                        <div className='mt-4'>
                            <CollapsibleSection defaultOpen variant='default' size='lg' className='shadow-lg'>
                                <div className='mb-4 flex items-center justify-between'>
                                    <div>
                                        <h3 className='font-semibold text-lg'>STUDENT LIST</h3>
                                        <p className='text-gray-600 text-sm'>
                                            Total Grid Records: <span className='badge'>{students.length}</span>
                                        </p>
                                        <p className='text-gray-600 text-sm'>
                                            Selected Students: <span className='badge'>{selectedStudentIds.length}</span>
                                        </p>
                                    </div>
                                </div>

                                <GenericDataTable
                                    {...tableProps}
                                    columns={columns}
                                    isLoading={isLoading}
                                    columnPinning={{ right: [] }}
                                    loadingMessage='Loading student data...'
                                    noDataTitle='No Students Found'
                                    noDataDescription='Click STUDENT LIST to view students'
                                    errorTitle='Error Loading Students'
                                    onRowSelectionChange={handleRowSelectionChange}
                                />

                                <div className='mx-auto mt-8 flex w-fit justify-center gap-4'>
                                    <Button
                                        type='button'
                                        onClick={handleGridReset}
                                        variant='outline'
                                        className='px-8 py-2 font-medium shadow'>
                                        RESET
                                    </Button>
                                    <Button
                                        type='button'
                                        onClick={() => handleSaveScores(false)}
                                        disabled={selectedStudentIds.length === 0 || isSaving || hideSaveButton}
                                        className='px-8 py-2 font-medium text-white shadow hover:bg-green-700'>
                                        {isSaving ? 'SAVING...' : `SAVE (${selectedStudentIds.length} selected)`}
                                    </Button>
                                    <Button
                                        type='button'
                                        onClick={() => handleSaveScores(true)}
                                        disabled={selectedStudentIds.length === 0 || isSaving || hideSaveButton}
                                        className='px-8 py-2 font-medium text-white shadow hover:bg-red-700'>
                                        {isSaving ? 'VERIFYING...' : `VERIFY (${selectedStudentIds.length} selected)`}
                                    </Button>
                                </div>
                            </CollapsibleSection>
                        </div>
                    )}
                </div>
            </form>
        </FormProvider>
    );
}

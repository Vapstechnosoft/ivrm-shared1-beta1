import { Loader2 } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';

import { addOrUpdateExamStudentRemarks, getStudentDetails } from '@/server/exam/exam-module/marks-entry/exam-wise-student-remarks';
import type { IExamWiseRemarksGrid, IExamWiseStudentRemarksStudent } from '@/types/exam/exam-module/exam-mapping';

import { useExamWiseRemarksDataGrid } from '@/hooks/exam/exammodule/marks-entry';
import {
    getClassDropDownByAcademicYearlist,
    getExamsDropDownByAcademicYearandClassandSectionlist,
    getSectionsDropDownByAcademicYearandClasslist
} from '@/server/exam/exam-module/reports/cumulative-report';
import { getAcademicYearDropdown } from '@/server/fees/masters/class_yearly_category';
import { z } from 'zod';
import { ExamWiseStudentRemarksColumns } from './exam-wise-student-remarks-columns';

export const studentRemarksSchema = z.object({
    mI_Id: z.coerce.number().optional(),
    asmcL_Id: z.coerce.number(),
    emE_Id: z.coerce.number(),
    asmaY_Id: z.coerce.number(),
    asmS_Id: z.coerce.number(),
    studentdata_Remarks: z
        .array(
            z.object({
                amsT_Id: z.coerce.number(),
                emeR_Remarks: z
                    .string()
                    .max(250, 'Max 250 chars')
                    .nullable()
                    .transform((val) => val ?? '')
            })
        )
        .default([])
});

type FormFields = z.infer<typeof studentRemarksSchema>;

interface Props {
    orgId?: number;
    onSuccess?: () => void;
    rowData?: IExamWiseRemarksGrid;
}

export default function AddEditStudentRemarks({ orgId = 30, onSuccess, rowData }: Props) {
    // State for dropdown data
    const [academicYears, setAcademicYears] = useState<{ asmaY_Id: number; asmaY_Year: string }[]>([]);
    const [classes, setClasses] = useState<{ asmcL_Id: number; asmcL_ClassName: string }[]>([]);
    const [sections, setSections] = useState<{ asmS_Id: number; asmC_SectionName: string }[]>([]);
    const [exams, setExams] = useState<{ emE_Id: number; emE_ExamName: string }[]>([]);

    // Loading states for dropdowns
    const [loadingYears, setLoadingYears] = useState(false);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingExams, setLoadingExams] = useState(false);

    const [students, setStudents] = useState<IExamWiseStudentRemarksStudent[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<IExamWiseStudentRemarksStudent[]>([]);
    const [preSelectedStudentIds, setPreSelectedStudentIds] = useState<string[]>([]);
    const [tableProps, setTableProps] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isStudentsGridOpen, setIsStudentsGridOpen] = useState(false);
    const [isLoadingEditData, setIsLoadingEditData] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});

    const methods = useForm<FormFields>({
        resolver: zodResolver(studentRemarksSchema),
        mode: 'onChange',
        defaultValues: {
            mI_Id: orgId,
            asmcL_Id: 0,
            emE_Id: 0,
            asmaY_Id: 0,
            asmS_Id: 0,
            studentdata_Remarks: []
        }
    });

    const { control, handleSubmit, setValue, reset, getValues } = methods;

    const asmaY_Id = useWatch({ control, name: 'asmaY_Id' });
    const asmcL_Id = useWatch({ control, name: 'asmcL_Id' });
    const asmS_Id = useWatch({ control, name: 'asmS_Id' });
    const emE_Id = useWatch({ control, name: 'emE_Id' });
    const { refetchAll } = useExamWiseRemarksDataGrid();

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

    // Load Edit Data Orchestrator
    useEffect(() => {
        if (!rowData || !rowData.asmaY_Id) return;

        const loadEditDetails = async () => {
            setIsLoadingEditData(true);
            try {
                // 1. Reset everything to initial state
                setClasses([]);
                setSections([]);
                setExams([]);
                setStudents([]);
                setSelectedStudents([]);
                setPreSelectedStudentIds([]);
                setIsStudentsGridOpen(false);

                // Reset form to placeholders
                reset({
                    mI_Id: orgId,
                    asmcL_Id: 0,
                    emE_Id: 0,
                    asmaY_Id: 0,
                    asmS_Id: 0,
                    studentdata_Remarks: []
                });

                // 2. Fetch Dropdowns
                // Academic Year is already loaded on mount (or likely cached), so we set it first
                setValue('asmaY_Id', rowData.asmaY_Id);

                // Fetch Classes
                setLoadingClasses(true);
                const classRes = await getClassDropDownByAcademicYearlist(rowData.asmaY_Id);
                const classData = Array.isArray(classRes.data) ? classRes.data : [];
                setClasses(classData);
                // Set Class Value AFTER data is loaded
                setValue('asmcL_Id', rowData.asmcL_Id);
                setLoadingClasses(false);

                // Fetch Sections
                setLoadingSections(true);
                const sectionRes = await getSectionsDropDownByAcademicYearandClasslist(rowData.asmaY_Id, rowData.asmcL_Id);
                const sectionData = Array.isArray(sectionRes.data) ? sectionRes.data : [];
                setSections(sectionData);
                // Set Section Value AFTER data is loaded
                setValue('asmS_Id', rowData.asmS_Id);
                setLoadingSections(false);

                // Fetch Exams
                setLoadingExams(true);
                const examRes = await getExamsDropDownByAcademicYearandClassandSectionlist(
                    rowData.asmaY_Id,
                    rowData.asmcL_Id,
                    rowData.asmS_Id
                );
                const examData = Array.isArray(examRes.data) ? examRes.data : [];
                setExams(examData);
                // Set Exam Value AFTER data is loaded
                setValue('emE_Id', rowData.emE_Id);
                setLoadingExams(false);

                // Fetch Students
                setIsLoading(true);
                const studentRes = await getStudentDetails(rowData.asmaY_Id, rowData.asmcL_Id, rowData.asmS_Id, rowData.emE_Id);
                const studentList = Array.isArray(studentRes.data)
                    ? studentRes.data.map((s: any) => ({ ...s, emeR_Remarks: s.emeR_Remarks || '' }))
                    : [];

                const preSelected = studentList.reduce<string[]>((acc, s, ind) => {
                    if (s.emeR_Remarks && s.emeR_Remarks.trim().length > 0) {
                        acc.push(ind.toString());
                    }
                    return acc;
                }, []);

                setPreSelectedStudentIds(preSelected);
                setStudents(studentList);
                setTableProps(
                    useDataTableProps({
                        data: studentList,
                        total: studentList.length,
                        pageIndex: 0,
                        pageSize: 10
                    })
                );

                // Sync form remarks
                setValue(
                    'studentdata_Remarks',
                    studentList.map((s) => ({ amsT_Id: s.amsT_Id, emeR_Remarks: s.emeR_Remarks || '' }))
                );

                setIsStudentsGridOpen(true);
                setIsLoading(false);
            } catch (e) {
                console.error('Failed to load edit details', e);
                toast.error('Failed to load edit details');
            } finally {
                setIsLoadingEditData(false);
            }
        };

        loadEditDetails();
    }, [rowData, orgId, reset, setValue]);

    // 2. Fetch Classes when Year Changes
    useEffect(() => {
        if (isLoadingEditData) return;
        if (asmaY_Id) {
            const fetchClasses = async () => {
                try {
                    setLoadingClasses(true);

                    // Clear dependents
                    setClasses([]);
                    setSections([]);
                    setExams([]);

                    // Don't auto-reset values if we are editing/loading rowData and values match,
                    // but for new selection, we should reset.
                    if (!rowData) {
                        setValue('asmcL_Id', 0);
                        setValue('asmS_Id', 0);
                        setValue('emE_Id', 0);
                    }

                    const { data } = await getClassDropDownByAcademicYearlist(asmaY_Id);
                    const classData = Array.isArray(data) ? data : [];
                    setClasses(classData);

                    if (classData.length === 0) toast.info('No classes found for selected academic year');
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
    }, [asmaY_Id, setValue, rowData, isLoadingEditData]);

    // 3. Fetch Sections when Class Changes
    useEffect(() => {
        if (isLoadingEditData) return;
        if (asmaY_Id && asmcL_Id) {
            const fetchSections = async () => {
                try {
                    setLoadingSections(true);
                    // Clear dependents
                    setSections([]);
                    setExams([]);

                    if (!rowData) {
                        setValue('asmS_Id', 0);
                        setValue('emE_Id', 0);
                    }

                    const { data } = await getSectionsDropDownByAcademicYearandClasslist(asmaY_Id, asmcL_Id);
                    const sectionData = Array.isArray(data) ? data : [];
                    setSections(sectionData);

                    if (sectionData.length === 0) toast.info('No sections found for selected class');
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
    }, [asmaY_Id, asmcL_Id, setValue, rowData, isLoadingEditData]);

    // 4. Fetch Exams when Section Changes
    useEffect(() => {
        if (isLoadingEditData) return;
        if (asmaY_Id && asmcL_Id && asmS_Id) {
            const fetchExams = async () => {
                try {
                    setLoadingExams(true);
                    // Clear dependents
                    setExams([]);

                    if (!rowData) {
                        setValue('emE_Id', 0);
                    }

                    // Clear students Grid when section changes (unless loading rowData)
                    if (!rowData) {
                        setStudents([]);
                        setIsStudentsGridOpen(false);
                    }

                    const { data } = await getExamsDropDownByAcademicYearandClassandSectionlist(asmaY_Id, asmcL_Id, asmS_Id);
                    const examData = Array.isArray(data) ? data : [];
                    setExams(examData);

                    if (examData.length === 0) toast.info('No exams found for selected section');
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
    }, [asmaY_Id, asmcL_Id, asmS_Id, setValue, rowData, isLoadingEditData]);

    async function handleSearch() {
        if (!asmaY_Id || !asmcL_Id || !emE_Id || !asmS_Id) {
            toast.error('Please select all required fields before search');
            return;
        }

        setIsLoading(true);
        setIsStudentsGridOpen(true);
        try {
            const { data } = await getStudentDetails(asmaY_Id, asmcL_Id, asmS_Id, emE_Id);
            const studentList = Array.isArray(data) ? data.map((s: any) => ({ ...s, emeR_Remarks: s.emeR_Remarks || '' })) : [];

            const preSelectedStudentIds = studentList.reduce<string[]>((acc, s, ind) => {
                if (s.emeR_Remarks && s.emeR_Remarks.trim().length > 0) {
                    acc.push(ind.toString());
                }
                return acc;
            }, []);

            setPreSelectedStudentIds(preSelectedStudentIds);
            setStudents(studentList);
            setTableProps(
                useDataTableProps({
                    data: studentList,
                    total: studentList.length,
                    pageIndex: 0,
                    pageSize: 10
                })
            );

            setValue(
                'studentdata_Remarks',
                studentList.map((s) => ({ amsT_Id: s.amsT_Id, emeR_Remarks: s.emeR_Remarks || '' }))
            );
        } catch (err: any) {
            toast.error(err?.message || 'Failed to fetch students');
        } finally {
            setIsLoading(false);
        }
    }

    async function onSubmit(data: FormFields) {
        if (!selectedStudents.length) {
            setValidationErrors({});
            setTableProps((tp: any) => ({
                ...tp,
                lastUpdated: Date.now()
            }));
            toast.error('No students selected to save');
            return;
        }

        // Validate selected students have remarks
        const validationErrors: Record<number, string> = {};
        const currentStudentMap = new Map(students.map((s) => [s.amsT_Id, s]));

        selectedStudents.forEach((selected) => {
            const student = currentStudentMap.get(selected.amsT_Id);
            if (!student?.emeR_Remarks || student.emeR_Remarks.trim() === '') {
                validationErrors[selected.amsT_Id] = 'Remarks are required for selected students';
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            setValidationErrors(validationErrors);
            toast.error('Please add remarks for all selected students');
            return;
        }

        // Clear validation errors if validation passes
        setValidationErrors({});

        setIsSaving(true);
        try {
            const selectedIds = new Set(selectedStudents.map((s) => s.amsT_Id));

            const payload: FormFields = {
                ...data,
                studentdata_Remarks: students
                    .filter((s) => selectedIds.has(s.amsT_Id))
                    .map((s) => ({
                        amsT_Id: s.amsT_Id,
                        emeR_Remarks: s.emeR_Remarks?.trim() || ''
                    }))
            };

            const res = await addOrUpdateExamStudentRemarks(payload);
            if (res?.success) {
                toast.success(res.message || 'Remarks saved successfully');
                refetchAll();
                handleReset();
                onSuccess?.();
            } else {
                toast.error(res?.message || 'Failed to save remarks');
            }
        } catch (err: any) {
            toast.error(err?.message || 'Something went wrong');
        } finally {
            setIsSaving(false);
            setIsStudentsGridOpen(false);
        }
    }

    const handleReset = () => {
        reset({
            mI_Id: orgId,
            asmaY_Id: 0,
            asmcL_Id: 0,
            asmS_Id: 0,
            emE_Id: 0,
            studentdata_Remarks: []
        });

        // Clear all state
        setClasses([]);
        setSections([]);
        setExams([]);
        setStudents([]);
        setSelectedStudents([]);
        setPreSelectedStudentIds([]);
        setTableProps({});
        setIsStudentsGridOpen(false);
        setValidationErrors({});
    };

    const updateStudent = useCallback((id: number, remarks: string) => {
        setStudents((prev) => {
            const updated = prev.map((s) => (s.amsT_Id === id ? { ...s, emeR_Remarks: remarks } : s));

            // Clear validation error for this student if remarks are now filled
            if (remarks && remarks.trim() !== '') {
                setValidationErrors((prevErrors) => {
                    const newErrors = { ...prevErrors };
                    delete newErrors[id];
                    return newErrors;
                });
            }

            // also update table props
            setTableProps((tp: any) => ({
                ...tp,
                data: updated
            }));

            return updated;
        });
    }, []);

    // Pass to columns
    const columns = ExamWiseStudentRemarksColumns(updateStudent, validationErrors);

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className='relative space-y-6 rounded-xl bg-white p-6 shadow-md'>
                {isLoadingEditData && (
                    <div className='absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-white'>
                        <Loader2 className='h-10 w-10 animate-spin text-primary' />
                        <p className='mt-2 font-medium text-muted-foreground text-sm'>Loading edit details...</p>
                    </div>
                )}
                <div className='grid grid-cols-2 gap-6'>
                    {/* Academic Year */}
                    <Controller
                        control={control}
                        name='asmaY_Id'
                        render={({ field, fieldState }) => (
                            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                                <Label className='font-medium text-sm sm:w-32'>
                                    Academic Year <span className='text-red-500'>*</span>
                                </Label>
                                <div className='flex-1'>
                                    <Select
                                        key={field.value}
                                        onValueChange={(val) => {
                                            field.onChange(Number(val));
                                        }}
                                        value={field.value && field.value !== 0 ? String(field.value) : ''}>
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
                                                academicYears.map((item) => (
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
                        render={({ field, fieldState }) => (
                            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                                <Label className='font-medium text-sm sm:w-32'>
                                    Class <span className='text-red-500'>*</span>
                                </Label>
                                <div className='flex-1'>
                                    <Select
                                        key={field.value}
                                        onValueChange={(val) => {
                                            field.onChange(Number(val));
                                        }}
                                        value={field.value && field.value !== 0 ? String(field.value) : ''}>
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
                                                classes.map((c) => (
                                                    <SelectItem key={c.asmcL_Id} value={String(c.asmcL_Id)}>
                                                        {c.asmcL_ClassName}
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

                    {/* Section */}
                    <Controller
                        control={control}
                        name='asmS_Id'
                        render={({ field, fieldState }) => (
                            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                                <Label className='font-medium text-sm sm:w-32'>
                                    Section <span className='text-red-500'>*</span>
                                </Label>
                                <div className='flex-1'>
                                    <Select
                                        key={field.value}
                                        onValueChange={(val) => {
                                            field.onChange(Number(val));
                                        }}
                                        value={field.value && field.value !== 0 ? String(field.value) : ''}>
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
                                                sections.map((s) => (
                                                    <SelectItem key={s.asmS_Id} value={String(s.asmS_Id)}>
                                                        {s.asmC_SectionName}
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

                    {/* Exam */}
                    <Controller
                        control={control}
                        name='emE_Id'
                        render={({ field, fieldState }) => (
                            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                                <Label className='font-medium text-sm sm:w-32'>
                                    Exam Name <span className='text-red-500'>*</span>
                                </Label>
                                <div className='flex-1'>
                                    <Select
                                        key={field.value}
                                        onValueChange={(val) => {
                                            field.onChange(Number(val));
                                        }}
                                        value={field.value && field.value !== 0 ? String(field.value) : ''}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingExams ? 'Loading exams...' : 'Select Exam'} />
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
                                                exams.map((e) => (
                                                    <SelectItem key={e.emE_Id} value={String(e.emE_Id)}>
                                                        {e.emE_ExamName}
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

                    <div className='col-span-2 flex w-fit items-center justify-center gap-3'>
                        <Button type='button' variant='outline' onClick={handleReset}>
                            Reset
                        </Button>
                        <Button type='button' onClick={handleSearch}>
                            Search Students
                        </Button>
                    </div>
                </div>

                {isStudentsGridOpen && (
                    <>
                        <div className='mt-6'>
                            <GenericDataTable
                                {...tableProps}
                                columns={columns}
                                isLoading={isLoading}
                                onRowSelectionChange={(selectedRows: IExamWiseStudentRemarksStudent[]) => {
                                    const selectedRowIds = selectedRows.map((r) => String(r.amsT_Id));
                                    const selected = students.filter((s) => {
                                        return selectedRowIds.includes(s.amsT_Id.toString());
                                    });
                                    setSelectedStudents(selected);
                                }}
                                defaultSelectedRowIds={preSelectedStudentIds}
                            />
                        </div>

                        <div className='flex w-fit justify-center gap-2'>
                            <Button type='submit' disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Student Remarks'}
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </FormProvider>
    );
}

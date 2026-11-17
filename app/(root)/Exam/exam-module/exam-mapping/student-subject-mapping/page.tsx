// app/exam/student-subject-mapping/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { getCategoryDropDowByExamYearCategoryList } from '@/server/exam/exam-module/exam-mapping/exam-subject-group-mapping';
import {
    addOrUpdateStudentSubjectMappings,
    getSectionListbyClassSectionSubjectGroup,
    getStudentsForSubjectMapping,
    getSubjectlistByCatGroupClass
} from '@/server/exam/exam-module/exam-mapping/student-subject-mapping';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import StudentSubjectMappingTable, { type StudentMappingTableHandle } from './_components/student-mapping-table';

type FormValues = {
    asmaY_Id?: number;
    asmcL_Id?: number;
    asmS_Id?: number;
    emcA_Id?: number;
    eme_Id?: number;
    subject_group_id?: number;
    Left_Flag?: boolean;
    Deactive_Flag?: boolean;
};

interface Subject {
    id: number;
    name: string;
}

interface StudentSubjectMapping {
    id: number;
    estsU_ElecetiveFlag?: boolean;
    estsU_ActiveFlg?: boolean;
    estsU_CreatedBy?: number;
    estsU_UpdatedBy?: number;
    createdDate?: string;
    updatedDate?: string;
    name?: string;
    abc?: boolean;
}

interface Student {
    amsT_Id: number;
    amsT_FirstName: string;
    amsT_AdmNo: string;
    amaY_RollNo: number;
    sub_list: StudentSubjectMapping[];
    sub_list_view: StudentSubjectMapping[];
}

interface Payload {
    estsU_Id: number;
    // mI_Id: number;
    asmaY_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    emG_Id: number;
    emE_Id: number;
    userId: number;
    left_Flag: boolean;
    deactive_Flag: boolean;
    get_list: Array<{
        amsT_Id: number;
        sub_list: StudentSubjectMapping[];
    }>;
    get_Removed_list: Array<{
        amsT_Id: number;
        sub_list: StudentSubjectMapping[];
    }>;
}

export default function StudentSubjectMappingPage() {
    return <StudentSubjectMappingContent />;
}

function StudentSubjectMappingContent() {
    const methods = useForm<FormValues>({
        defaultValues: {
            asmaY_Id: undefined,
            asmcL_Id: undefined,
            asmS_Id: undefined,
            emcA_Id: undefined,
            eme_Id: 0,
            subject_group_id: undefined,
            Left_Flag: true,
            Deactive_Flag: true
        }
    });

    const { control, watch, setValue, reset, getValues } = methods;

    const watchedAcademicYear = watch('asmaY_Id');
    const watchedClass = watch('asmcL_Id');
    const watchedCategory = watch('emcA_Id');

    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();

    const [classes, setClasses] = useState<{ asmcL_Id: number; asmcL_ClassName: string }[]>([]);
    const [sections, setSections] = useState<{ asmS_Id: number; asmC_SectionName: string }[]>([]);
    const [categories, setCategories] = useState<{ emcA_Id: number; emcA_CategoryName: string }[]>([]);
    const [payload, setPayload] = useState<Payload | null>(null);
    const [subjectGroups, setSubjectGroups] = useState<any[]>([]);

    const [loadingClasses] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingSG, setLoadingSG] = useState(false);

    const [students, setStudents] = useState<Student[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isGridOpen, setIsGridOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userId] = useState<number>(1); // You should get this from auth context
    const tableRef = useRef<StudentMappingTableHandle>(null);

    // const MI_Id = 30;

    // Set default academic year
    useEffect(() => {
        if (academicYear?.data && academicYear.data.length > 0 && !getValues('asmaY_Id')) {
            setValue('asmaY_Id', academicYear.data[0].asmaY_Id);
        }
    }, [academicYear, setValue, getValues]);

    // Load sections
    useEffect(() => {
        if (!watchedAcademicYear || !watchedClass) {
            setSections([]);
            setValue('asmS_Id', undefined);
            return;
        }

        const fetchSections = async () => {
            setLoadingSections(true);
            try {
                const { data } = await getSectionListbyClassSectionSubjectGroup(
                    watchedAcademicYear,
                    watchedCategory as number,
                    watchedClass
                );
                setSections(Array.isArray(data) ? data : []);
                if (data.length === 0) toast.info('No sections found for selected class');
                setValue('asmS_Id', undefined);
            } catch (err: any) {
                console.error(err);
                toast.error('Failed to load sections');
            } finally {
                setLoadingSections(false);
            }
        };

        fetchSections();
    }, [watchedAcademicYear, watchedClass, setValue]);

    // Load categories
    useEffect(() => {
        if (!watchedAcademicYear) {
            setCategories([]);
            setValue('emcA_Id', undefined);
            return;
        }

        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const { data: response } = await getCategoryDropDowByExamYearCategoryList(watchedAcademicYear);
                const cats: any[] = Array.isArray(response) ? response : [];
                console.info('cats', cats);
                const normalized = cats.map((c) => ({
                    emcA_Id: c.emcA_Id ?? c.eyC_Id,
                    emcA_CategoryName: c.emcA_CategoryName ?? c.eyC_CategoryName
                }));
                if (normalized.length === 0) {
                    toast.info('No categories found for selected academic year');
                }
                setCategories(normalized);
                setValue('emcA_Id', undefined);
                setValue('subject_group_id', undefined);
            } catch (err: any) {
                console.error(err);
                toast.error(err?.message ?? 'Failed to load categories');
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, [watchedAcademicYear, setValue]);

    // Load subject groups
    useEffect(() => {
        if (!watchedAcademicYear || !watchedCategory) {
            setSubjectGroups([]);
            setValue('subject_group_id', undefined);
            return;
        }

        const fetchSubjectGroups = async () => {
            setLoadingSG(true);
            try {
                console.info('watchedAcademicYear', watchedAcademicYear);
                console.info('watchedCategory', watchedCategory);
                const data = await getSubjectlistByCatGroupClass(watchedAcademicYear, watchedCategory);
                const safeData = Array.isArray(data) ? data : (data?.data ?? []);
                console.info('safeData', safeData);
                setSubjectGroups(safeData.grouplist);
                setClasses(safeData.classlist);
                if (safeData.classlist.length === 0) {
                    toast.info('No classes found for selected category');
                }
                if (safeData.grouplist.length === 0) {
                    toast.info('No subject groups found for selected category');
                }
                setValue('subject_group_id', undefined);
                setValue('asmcL_Id', undefined);
            } catch (err: any) {
                console.error(err);
                toast.error(err?.message ?? 'Failed to load subject groups');
            } finally {
                setLoadingSG(false);
            }
        };

        fetchSubjectGroups();
    }, [watchedAcademicYear, watchedCategory, setValue]);

    // Handle search
    const handleSearch = async () => {
        const form = getValues();

        if (!form.asmaY_Id || !form.asmcL_Id || !form.asmS_Id || !form.emcA_Id) {
            toast.info('Please select Academic Year, Class, Section and Category');
            return;
        }

        setIsLoading(true);
        setIsGridOpen(false);

        try {
            const params = {
                // MI_Id,
                ASMAY_Id: form.asmaY_Id,
                ASMCL_Id: form.asmcL_Id,
                ASMS_Id: form.asmS_Id,
                EME_Id: form.eme_Id ?? 0,
                //  EMCA_Id: form.emcA_Id,
                Left_Flag: form.Left_Flag ?? true,
                Deactive_Flag: form.Deactive_Flag ?? true,
                EMG_Id: form.subject_group_id ?? 0
            };
            const response = await getStudentsForSubjectMapping(params);
            const success = response?.success ?? false;
            const data = Array.isArray(response?.data) ? response?.data : [];
            console.info('search response **', data);

            if (!success || data?.length === 0) {
                toast.error(response?.message ?? 'No data found');
                setStudents([]);
                setSubjects([]);
                setIsLoading(false);
                return;
            }

            // Extract subjects from first student
            const firstStudent = data[0];
            const subjectList = firstStudent.sub_list_view ?? firstStudent.sub_list ?? [];

            // Transform subjects
            const transformedSubjects = subjectList.map((s: any) => ({
                id: s.id,
                name: s.name || `Subject ${s.id}`
            }));

            // Transform students data
            const transformedStudents = data.map((student: any) => ({
                amsT_Id: student.amsT_Id || 0,
                amsT_FirstName: student.amsT_FirstName || '',
                amsT_AdmNo: student.amsT_AdmNo || '',
                amaY_RollNo: student.amaY_RollNo || 0,
                sub_list: (student.sub_list || []).map((sub: any) => ({
                    id: sub.id,
                    name: sub.name,
                    abc: sub.abc || false,
                    estsU_ElecetiveFlag: sub.estsU_ElecetiveFlag || true,
                    estsU_ActiveFlg: sub.estsU_ActiveFlg || true,
                    estsU_CreatedBy: sub.estsU_CreatedBy || 0,
                    estsU_UpdatedBy: sub.estsU_UpdatedBy || 0,
                    createdDate: sub.createdDate || new Date().toISOString(),
                    updatedDate: sub.updatedDate || new Date().toISOString()
                })),
                sub_list_view: (student.sub_list_view || []).map((sub: any) => ({
                    id: sub.id,
                    name: sub.name,
                    abc: sub.abc || false
                }))
            }));

            setStudents(transformedStudents);
            setSubjects(transformedSubjects);
            setIsGridOpen(true);
            toast.success(`Loaded ${transformedStudents.length} students`);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message ?? 'Failed to fetch students');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle update mapping from table
    const handleUpdateMapping = useCallback(
        async (payload: Payload) => {
            try {
                setPayload(payload);
            } catch (error: any) {
                console.error('Error saving mapping:', error);
                toast.error(error.message || 'Failed to save mapping');
            }
        },
        [isGridOpen]
    );

    // Save mapping
    const handleSave = async () => {
        if (students.length === 0) {
            toast.error('No students to save');
            return;
        }
        try {
            console.info('Payload:', payload);
            const response = await addOrUpdateStudentSubjectMappings(payload);
            if (response.success) {
                toast.success(response.message || 'Mapping saved successfully');

                // Close the grid and reset all related state
                setIsGridOpen(false);
                setStudents([]);
                setSubjects([]);
                setPayload(null);

                // Reset the table if ref is available
                if (tableRef.current) {
                    tableRef.current.reset();
                }
            } else {
                toast.error(response.message || 'Failed to save mapping');
            }
        } catch (error: any) {
            console.error('Error preparing save:', error);
            toast.error('Failed to prepare save data');
        }
    };

    // Close grid
    const handleCloseGrid = () => {
        setIsGridOpen(false);
        setStudents([]);
        setSubjects([]);
        setPayload(null);
    };

    return (
        <FormProvider {...methods}>
            <div className='min-h-screen bg-gray-50 p-4'>
                <div className='container mx-auto space-y-4'>
                    <div className='rounded-md border bg-white p-4 shadow-sm'>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            {/* LEFT */}
                            <div className='space-y-4'>
                                <Controller
                                    control={control}
                                    name='asmaY_Id'
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <Label className='mb-1 block font-medium text-slate-700 text-sm'>
                                                Academic Year <span className='text-red-500'>*</span>
                                            </Label>
                                            <Select
                                                key={field.value}
                                                value={field.value ? String(field.value) : undefined}
                                                onValueChange={(v) => field.onChange(Number(v))}>
                                                <SelectTrigger className='h-10'>
                                                    <SelectValue placeholder='Select Academic Year' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {academicYearLoading ? (
                                                        <SelectItem value='loading' disabled>
                                                            Loading...
                                                        </SelectItem>
                                                    ) : academicYearError ? (
                                                        <SelectItem value='error' disabled>
                                                            Error loading
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
                                            {fieldState.error && <p className='mt-1 text-red-500 text-xs'>{fieldState.error.message}</p>}
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name='asmcL_Id'
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <Label className='mb-1 block font-medium text-slate-700 text-sm'>
                                                Class <span className='text-red-500'>*</span>
                                            </Label>
                                            <Select
                                                key={field.value}
                                                value={field.value ? String(field.value) : undefined}
                                                onValueChange={(v) => field.onChange(Number(v))}>
                                                <SelectTrigger className='h-10'>
                                                    <SelectValue placeholder='Select Class' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {!watchedCategory ? (
                                                        <SelectItem value='error' disabled>
                                                            Select Category
                                                        </SelectItem>
                                                    ) : loadingClasses ? (
                                                        <SelectItem value='loading' disabled>
                                                            Loading...
                                                        </SelectItem>
                                                    ) : classes.length === 0 ? (
                                                        <SelectItem value='error' disabled>
                                                            No classes found
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
                                            {fieldState.error && <p className='mt-1 text-red-500 text-xs'>{fieldState.error.message}</p>}
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name='eme_Id'
                                    render={({ field }) => (
                                        <div>
                                            <Label className='mb-1 block font-medium text-slate-700 text-sm'>Exam</Label>
                                            <Select
                                                key={field.value}
                                                value={field.value !== undefined ? String(field.value) : undefined}
                                                onValueChange={(v) => field.onChange(Number(v))}>
                                                <SelectTrigger className='h-10'>
                                                    <SelectValue placeholder='Select Exam (optional)' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='0'>Default (0)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                />
                            </div>

                            {/* RIGHT */}
                            <div className='space-y-4'>
                                <Controller
                                    control={control}
                                    name='emcA_Id'
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <Label className='mb-1 block font-medium text-slate-700 text-sm'>
                                                Exam Category <span className='text-red-500'>*</span>
                                            </Label>
                                            <Select
                                                key={field.value}
                                                value={field.value ? String(field.value) : undefined}
                                                onValueChange={(v) => field.onChange(Number(v))}>
                                                <SelectTrigger className='h-10'>
                                                    <SelectValue placeholder='Select Category' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {loadingCategories ? (
                                                        <SelectItem value='loading' disabled>
                                                            Loading...
                                                        </SelectItem>
                                                    ) : categories.length === 0 ? (
                                                        <SelectItem value='error' disabled>
                                                            No categories found
                                                        </SelectItem>
                                                    ) : (
                                                        categories.map((c) => (
                                                            <SelectItem key={c.emcA_Id} value={String(c.emcA_Id)}>
                                                                {c.emcA_CategoryName}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <p className='mt-1 text-red-500 text-xs'>{fieldState.error.message}</p>}
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name='asmS_Id'
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <Label className='mb-1 block font-medium text-slate-700 text-sm'>
                                                Section <span className='text-red-500'>*</span>
                                            </Label>
                                            <Select
                                                key={field.value}
                                                value={field.value ? String(field.value) : undefined}
                                                onValueChange={(v) => field.onChange(Number(v))}>
                                                <SelectTrigger className='h-10'>
                                                    <SelectValue placeholder='Select Section' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {loadingSections ? (
                                                        <SelectItem value='loading' disabled>
                                                            Loading...
                                                        </SelectItem>
                                                    ) : !watchedClass ? (
                                                        <SelectItem value='error' disabled>
                                                            Select Class
                                                        </SelectItem>
                                                    ) : sections.length === 0 ? (
                                                        <SelectItem value='error' disabled>
                                                            No sections found
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
                                            {fieldState.error && <p className='mt-1 text-red-500 text-xs'>{fieldState.error.message}</p>}
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name='subject_group_id'
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <Label className='mb-1 block font-medium text-slate-700 text-sm'>
                                                Subject Group <span className='text-red-500'>*</span>
                                            </Label>
                                            <Select
                                                key={field.value}
                                                value={field.value ? String(field.value) : undefined}
                                                onValueChange={(v) => field.onChange(Number(v))}>
                                                <SelectTrigger className='h-10'>
                                                    <SelectValue placeholder={loadingSG ? 'Loading...' : 'Select Subject Group'} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {loadingSG ? (
                                                        <SelectItem value='loading' disabled>
                                                            Loading...
                                                        </SelectItem>
                                                    ) : (
                                                        subjectGroups.map((g: any) => (
                                                            <SelectItem key={g.emG_Id} value={String(g.emG_Id)}>
                                                                {g.emG_GroupName}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <p className='mt-1 text-red-500 text-xs'>{fieldState.error.message}</p>}
                                        </div>
                                    )}
                                />

                                <div className='mt-4 flex flex-wrap gap-8'>
                                    {/* LEFT STUDENTS */}
                                    <Controller
                                        control={control}
                                        name='Left_Flag'
                                        render={({ field }) => (
                                            <div className='flex items-center gap-2'>
                                                <Checkbox
                                                    id='leftFlag'
                                                    checked={!!field.value}
                                                    onCheckedChange={(c) => field.onChange(!!c)}
                                                />

                                                <label htmlFor='leftFlag' className='cursor-pointer text-sm'>
                                                    Include Left Students
                                                </label>
                                            </div>
                                        )}
                                    />

                                    {/* DEACTIVE STUDENTS */}
                                    <Controller
                                        control={control}
                                        name='Deactive_Flag'
                                        render={({ field }) => (
                                            <div className='flex items-center gap-2'>
                                                <Checkbox
                                                    id='deactiveFlag'
                                                    checked={!!field.value}
                                                    onCheckedChange={(c) => field.onChange(!!c)}
                                                />

                                                <label htmlFor='deactiveFlag' className='cursor-pointer text-sm'>
                                                    Include Deactive Students
                                                </label>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className='mt-6 flex w-fit justify-center'>
                            <Button
                                type='button'
                                variant='outline'
                                size='lg'
                                onClick={() => {
                                    reset({
                                        asmaY_Id: undefined,
                                        asmcL_Id: undefined,
                                        asmS_Id: undefined,
                                        emcA_Id: undefined,
                                        eme_Id: 0,
                                        subject_group_id: undefined,
                                        Left_Flag: true,
                                        Deactive_Flag: true
                                    } as any);
                                    setClasses([]);
                                    setCategories([]);
                                    setSections([]);
                                    setSubjectGroups([]);
                                    setStudents([]);
                                }}>
                                Cancel
                            </Button>
                            <Button type='button' className='px-8 py-2 shadow-lg' onClick={handleSearch} disabled={isLoading}>
                                {isLoading ? 'Searching...' : 'Search'}
                            </Button>
                        </div>
                    </div>

                    {/* Grid */}
                    {isGridOpen && (
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={handleCloseGrid}
                                variant='ghost'
                                size='sm'
                                className='absolute top-[10px] right-2 z-10 flex w-fit border bg-white shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <CollapsibleSection defaultOpen variant='default' size='lg' className='shadow-lg'>
                                <StudentSubjectMappingTable
                                    ref={tableRef}
                                    students={students}
                                    subjects={subjects}
                                    onUpdateMapping={handleUpdateMapping}
                                    isloading={isLoading}
                                    // Pass required metadata
                                    estsU_Id={0}
                                    // mI_Id={MI_Id}
                                    asmaY_Id={getValues('asmaY_Id') || 0}
                                    asmcL_Id={getValues('asmcL_Id') || 0}
                                    asmS_Id={getValues('asmS_Id') || 0}
                                    emG_Id={getValues('subject_group_id') || 0}
                                    emE_Id={getValues('eme_Id') || 0}
                                    userId={userId}
                                    left_Flag={getValues('Left_Flag') ?? true}
                                    deactive_Flag={getValues('Deactive_Flag') ?? true}
                                />

                                {payload !== null && (
                                    <div className='flex w-fit justify-end gap-3 border-t p-4'>
                                        <Button variant='outline' onClick={() => tableRef.current?.reset()}>
                                            Reset
                                        </Button>
                                        <Button type='submit' onClick={handleSave}>
                                            Save Mapping
                                        </Button>
                                    </div>
                                )}
                            </CollapsibleSection>
                        </div>
                    )}
                </div>
            </div>
        </FormProvider>
    );
}

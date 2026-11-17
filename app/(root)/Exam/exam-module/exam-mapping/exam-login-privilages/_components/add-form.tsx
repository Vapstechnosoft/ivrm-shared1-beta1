'use client';

import { Button } from '@/components/ui/button';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterClassDropdown, useMasterSectionDropdown } from '@/hooks/admission/preadmission/useMasters';
import {
    useClassTeacherDropdownList,
    useEmployeeDropdownList,
    useExamLoginPrivileges,
    useUserDropdownList
} from '@/hooks/exam/exammodule/exam-mapping';
import { useGetMasterSubjectDropdownList, useMasterSubSubjectDropdownList } from '@/hooks/exam/exammodule/usemasters';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { examLoginPrivilegesSchema } from '@/schemas/exam/exam-module/exam-mapping';
import { getTeacherClassSection } from '@/server/admission/preadmission/masters/class_teacher';
import {
    addorUpdateExamLoginPrivileges,
    getExamLoginPrivilegesEditDetails
} from '@/server/exam/exam-module/exam-mapping/exam-login-privilages';
import type { IMasterClassSectionDropDown } from '@/types/admission/preadmission/masters';
import type { IExamLoginPrivileges } from '@/types/exam/exam-module/exam-mapping';
import type { IClass } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Trash2, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

// form fields type
type FormFields = z.infer<typeof examLoginPrivilegesSchema.addOrUpdate>;

/** Row stored in details table (internal) */
type DetailRow = {
    id: string;
    yearid: number;
    user_id: number;
    year: string;
    emp_name: string;
    emp_Id: number;
    elpflg: string;
    clas: any;
    secs: any;
    sub: any[];
    ssub: any[];
};

export default function AddExamLoginPrivileges({ onSuccess, rowData }: { onSuccess?: () => void; rowData?: IExamLoginPrivileges }) {
    const methods = useForm<FormFields>({
        resolver: zodResolver(examLoginPrivilegesSchema.addOrUpdate),
        defaultValues: {
            asmaY_Id: 0,
            hrmE_Id: 0,
            ivrmulF_Id: 0,
            asmcL_Id: 0,
            sectionList: [],
            subjectList: [],
            subSubjectList: [],
            entryType: 'BY_CLASS_TEACHER',
            remarks: '',
            elp_ActiveFlag: true
        }
    });

    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const { control, handleSubmit, reset, watch, setValue, getValues, formState, trigger } = methods;
    const { errors, isSubmitted } = formState;

    useEffect(() => {
        if (isSubmitted && Object.keys(errors).length > 0) {
            Object.values(errors).forEach((err: any) => {
                if (err?.message) toast.error(err.message);
            });
        }
    }, [errors, isSubmitted]);

    const [classes, setClasses] = useState<IClass[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [subSubjects, setSubSubjects] = useState<any[]>([]);
    // const [userLogins, setUserLogins] = useState<any[]>([]);
    const [userLogins, setUserLogins] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [details, setDetails] = useState<DetailRow[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [disableClassSection, setDisableClassSection] = useState(false);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const [editMode, setEditMode] = useState<'add' | 'edit'>('add');
    const [isLoadingEditData, setIsLoadingEditData] = useState(false);
    const [originalDetails, setOriginalDetails] = useState<DetailRow[]>([]);

    const asmaY_Id = watch('asmaY_Id');
    const hrmE_Id = watch('hrmE_Id');

    const { data: academicYear, isLoading: academicYearLoading } = useAcademicYearDropdown();
    const { data: classTeachersData, isLoading: classTeacherLoading } = useClassTeacherDropdownList();
    const { data: employeeData, isLoading: employeeDataLoading } = useEmployeeDropdownList();
    const { data: userList, isLoading: userListLoading } = useUserDropdownList();
    const { data: masterSection, isLoading: masterSectionLoading } = useMasterSectionDropdown();
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const { data: masterClass, isLoading: masterClassLoading, refetchAll: refetchMasterClass } = useMasterClassDropdown();
    const { data: masterSubject, isLoading: masterSubjectLoading } = useGetMasterSubjectDropdownList();
    const { data: masterSubSubject, isLoading: masterSubSubjectLoading } = useMasterSubSubjectDropdownList();
    const { refetchAll } = useExamLoginPrivileges();

    // Effect to handle edit when rowData is provided
    useEffect(() => {
        const fetchEditData = async () => {
            if (!rowData?.elP_Id || employeeData?.data.length === 0 || classTeachersData?.data.length === 0 || subjects.length === 0)
                return;
            reset();
            setIsLoadingEditData(true);
            try {
                // Set edit mode
                setEditMode('edit');
                setDisableClassSection(true);
                console.info(rowData.elP_Id, rowData.asmcL_Id, rowData.asmS_Id);
                console.log("selected rowData", rowData);
                // Call API to get edit details
                const editData = await getExamLoginPrivilegesEditDetails(rowData.elP_Id, rowData.asmcL_Id, rowData.asmS_Id);
                console.log("editData", editData);
                if (editData?.success && Array.isArray(editData.data) && editData.data.length > 0) {
                    const editList = Array.isArray(editData.data) ? editData.data : [editData.data];
                    const isSubjectTeacherOrOthers = editList?.[0]?.elP_Flg === 'st' || editList?.[0]?.elP_Flg === 'others';

                    const s_Data = isSubjectTeacherOrOthers ? employeeData : classTeachersData;
                    const sourceData = Array.isArray(s_Data?.data) ? s_Data.data : s_Data?.data;
                    const employee = sourceData?.find((emp: any) => {
                        if (!editList?.length) return false;
                        return emp.hrmE_Id === editList[0]?.hrmE_Id;
                    });

                    const employeeName = employee?.hrmE_EmployeeName ?? rowData?.hrmE_EmployeeName ?? '';

                    const userId = editList[0].ivrmulF_Id;
                    const subSubjectItem = subSubjects?.find((sub: any) => sub.ismSS_Id === editList[0].ismSS_Id);
                    console.info(employee);
                    // Determine entry type based on elP_Flg
                    let entryType = 'BY_CLASS_TEACHER';
                    if (editList[0].elP_Flg === 'st') {
                        entryType = 'BY_SUBJECT_TEACHER';
                        setActiveTab(1);
                    } else if (editList[0].elP_Flg === 'others') {
                        entryType = 'BY_OTHERS';
                        setActiveTab(2);
                    } else {
                        setActiveTab(0);
                    }

                    // Extract unique classes, sections, subjects, and sub-subjects
                    const uniqueClasses = new Map();
                    const uniqueSections = new Map();
                    const selectedSubjects = new Map();
                    const selectedSubSubjects = new Map();
                    const selectedSections: any[] = [];

                    editList.forEach((item: any) => {
                        // Add class
                        console.log("item", item);
                        const classItem = classes.find((c) => c.asmcL_Id === item.asmcL_Id);
                        const subject = subjects.find((s) => s.ismS_Id === item.ismS_Id);
                        const subSubject = subSubjects.find((ss) => ss.emsS_Id === item.emsS_Id);
                        const sectionItem = sections.find((s) => s.asmS_Id === item.asmS_Id);

                        if (item.asmcL_Id && !uniqueClasses.has(item.asmcL_Id)) {
                            uniqueClasses.set(item.asmcL_Id, {
                                asmcL_Id: item.asmcL_Id,
                                asmcL_ClassName: classItem?.asmcL_ClassName ?? ''
                            });
                        }

                        // Add section
                        if (item.asmS_Id && !uniqueSections.has(item.asmS_Id)) {
                            const section = {
                                asmS_Id: item.asmS_Id,
                                asmC_SectionName: sectionItem?.asmC_SectionName ?? ''
                            };
                            uniqueSections.set(item.asmS_Id, section);
                            selectedSections.push(section);
                        }

                        // Add subject
                        if (item.ismS_Id && !selectedSubjects.has(item.ismS_Id)) {
                            selectedSubjects.set(item.ismS_Id, {
                                ismS_Id: item.ismS_Id,
                                ismS_SubjectName: subject?.ismS_SubjectName ?? ''
                            });
                        }
                        // Add sub-subject
                        if (item.emsS_Id && !selectedSubSubjects.has(item.emsS_Id)) {
                            // const subSubjectItem = subSubjects?.find((sub: any) => sub.emsS_Id === item.emsS_Id);

                            selectedSubSubjects.set(item.emsS_Id, {
                                emsS_Id: item.emsS_Id,
                                emsS_SubSubjectName: subSubject?.emsS_SubSubjectName ?? ''
                            });
                        }
                    });
                    const yearInfo = academicYear?.data?.find((y: any) => y.asmaY_Id === editList[0]?.asmaY_Id);
                    setValue('entryType', entryType as any);
                    const detailRows: DetailRow[] = [];
                    const classSectionMap = new Map();

                    editList.forEach((item: any) => {
                        const key = `${item.asmcL_Id}_${item.asmS_Id}`;
                        if (!classSectionMap.has(key)) {
                            classSectionMap.set(key, {
                                class: uniqueClasses.get(item.asmcL_Id),
                                section: uniqueSections.get(item.asmS_Id),
                                subjects: new Set(),
                                subSubjects: new Set()
                            });
                        }

                        const group = classSectionMap.get(key);
                        if (item.ismS_Id) {
                            group.subjects.add(selectedSubjects.get(item.ismS_Id));
                        }
                        if (item.emsS_Id) {
                            group.subSubjects.add(selectedSubSubjects.get(item.emsS_Id));
                        }
                    });
                    console.log("classSectionMap", classSectionMap);
                    // Create detail rows
                    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
                    classSectionMap.forEach((group, key) => {
                        detailRows.push({
                            id: makeUniqueId(),
                            yearid: 231,
                            user_id: userId,
                            year: yearInfo?.asmaY_Year || '',
                            emp_name: employeeName,
                            emp_Id: employee?.hrmE_Id || editList[0]?.hrmE_Id || 0,
                            elpflg: entryType,
                            clas: group.class,
                            secs: group.section,
                            sub: Array.from(group.subjects),
                            ssub: Array.from(group.subSubjects)
                        });
                    });

                    setDetails(detailRows);
                    setOriginalDetails(JSON.parse(JSON.stringify(detailRows))); // Deep copy to prevent reference issues
                } else {
                    toast.error('No record found for editing');
                    resetToAddMode();
                }
            } catch (error: any) {
                console.error('Error loading edit data:', error);
                toast.error(error.message || 'Failed to load edit data');
                resetToAddMode();
            } finally {
                setIsLoadingEditData(false);
            }
        };

        fetchEditData();
    }, [rowData, academicYear?.data, employeeData?.data, classTeachersData?.data, subjects, subSubjects, classes, sections]);

    // Reset to add mode function
    const resetToAddMode = () => {
        setEditMode('add');
        setDetails([]);
        reset();
        setActiveTab(0);
        setDisableClassSection(false);
        setEditingId(null);
    };

    // Cancel edit function
    const handleCancelEdit = () => {
        resetToAddMode();
        toast.info('Edit cancelled');
    };

    useEffect(() => {
        if (masterSection && Array.isArray(masterSection.data)) {
            setSections(masterSection.data);
        }
    }, [masterSection]);

    useEffect(() => {
        if (masterClass && Array.isArray(masterClass.data)) {
            setClasses(masterClass.data);
        }
    }, [masterClass]);

    useEffect(() => {
        if (masterSubject && Array.isArray(masterSubject.data)) {
            setSubjects(masterSubject.data);
        }
    }, [masterSubject]);

    useEffect(() => {
        if (masterSubSubject && Array.isArray(masterSubSubject.data)) {
            setSubSubjects(masterSubSubject.data);
        }
    }, [masterSubSubject]);

    useEffect(() => {
        if (userList && Array.isArray(userList.data)) {
            setUserLogins(userList.data);
            console.info('userLogins', userList?.data);
        }
    }, [classTeachersData, userList]);

    useEffect(() => {
        async function fetchTeacherMapping() {
            if (!asmaY_Id || !hrmE_Id) return;

            try {
                setValue('sectionList', []);
                setValue('classList', []);
                const { data } = await getTeacherClassSection(asmaY_Id, hrmE_Id);

                if (!Array.isArray(data) || data.length === 0) {
                    setDisableClassSection(false);
                    toast.info('No classes and sections are mapped for the selected Class Teacher');
                    return;
                }

                const classMap = new Map<number, IMasterClassSectionDropDown>();
                const sectionList: { asmS_Id: number }[] = [];

                data.forEach((item) => {
                    if (!classMap.has(item.asmcL_Id)) {
                        classMap.set(item.asmcL_Id, {
                            asmcL_Id: item.asmcL_Id,
                            asmcL_ClassName: item.asmcL_ClassName,
                            asmS_Id: item.asmS_Id,
                            asmC_SectionName: item.asmC_SectionName,
                            imcT_Id: item.imcT_Id
                        });
                    }
                    sectionList.push({ asmS_Id: item.asmS_Id });
                });

                const classList = Array.from(classMap.values());
                setValue(
                    'classList',
                    classList.map((c) => ({
                        asmcL_Id: c.asmcL_Id,
                        asmcL_ClassName: c.asmcL_ClassName
                    }))
                );
                setValue('asmcL_Id', classList[0]?.asmcL_Id ?? 0);
                setValue('sectionList', sectionList);
                setDisableClassSection(true);
            } catch (err: any) {
                toast.error(err.message || 'Failed to fetch teacher mapping');
                setDisableClassSection(false);
            }
        }

        if (activeTab === 0) {
            fetchTeacherMapping();
        } else {
            setDisableClassSection(false);
        }
    }, [asmaY_Id, hrmE_Id, activeTab]);

    const extractCode = (value: string): string => {
        if (!value) return '';
        const parts = value.split(':');
        return parts.length > 1 ? parts[1].trim() : value;
    };

    const makeUniqueId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    function computeDetailRowsForAdd(): DetailRow[] {
        const v = getValues();

        const requiredErrors = [];
        if (!v.asmaY_Id) requiredErrors.push('Academic Year');
        if (!v.hrmE_Id) requiredErrors.push('Employee');
        if (!v.ivrmulF_Id) requiredErrors.push('User Login');
        if ((!v.asmcL_Id || v.asmcL_Id === 0) && (!v.classList || v.classList.length === 0)) requiredErrors.push('Class');
        if (!v.sectionList || v.sectionList.length === 0) requiredErrors.push('Section');

        if (requiredErrors.length > 0) {
            toast.error(`Please select: ${requiredErrors.join(', ')}`);
            return [];
        }

        const rawClasses: any[] =
            Array.isArray(v.classList) && v.classList.length
                ? v.classList
                : v.asmcL_Id
                    ? classes.filter((c) => c.asmcL_Id === v.asmcL_Id)
                    : [];

        if (rawClasses.length === 0) {
            toast.error('No classes selected');
            return [];
        }

        const selectedClassesFromForm = Array.from(new Map(rawClasses.map((c: any) => [c.asmcL_Id, c])).values());
        const rawSections: any[] = Array.isArray(v.sectionList) && v.sectionList.length ? v.sectionList : [];

        if (rawSections.length === 0) {
            toast.error('No sections selected');
            return [];
        }

        const selectedSectionsFromForm = Array.from(new Map(rawSections.map((s: any) => [s.asmS_Id, s])).values());
        const selectedSubjects: any[] = Array.isArray(v.subjectList) ? v.subjectList : [];

        // FIXED: Use emsS_Id instead of issS_Id
        const selectedSSubjects: any[] = Array.isArray(v.subSubjectList)
            ? v.subSubjectList.map((ss: any) => ({
                emsS_Id: ss.emsS_Id,
                emsS_SubSubjectName: ss.emsS_SubSubjectName || ''
            }))
            : [];

        const rows: DetailRow[] = [];

        selectedClassesFromForm.forEach((cls: any) => {
            selectedSectionsFromForm.forEach((sec: any) => {
                rows.push({
                    id: makeUniqueId(),
                    yearid: v.asmaY_Id ?? 0,
                    user_id: v.ivrmulF_Id ?? 0,
                    year: academicYear?.data?.find((y: any) => y.asmaY_Id === v.asmaY_Id)?.asmaY_Year ?? '',
                    emp_name: (activeTab === 0 ? classTeachersData?.data : employeeData?.data)?.find((e: any) => e.hrmE_Id === v.hrmE_Id)?.hrmE_EmployeeName ?? '',
                    emp_Id: v.hrmE_Id ?? 0,
                    elpflg: activeTab === 0 ? 'ct' : activeTab === 1 ? 'st' : 'others',
                    clas: cls,
                    secs: sec,
                    sub: selectedSubjects,
                    ssub: selectedSSubjects
                });
            });
        });

        return rows;
    }

    function handleAddRows() {
        const isValid = trigger(['asmaY_Id', 'hrmE_Id', 'ivrmulF_Id', 'sectionList', 'subjectList']);

        if (!isValid) {
            toast.error('Please fix all validation errors before adding');
            return;
        }

        const rowsToAdd = computeDetailRowsForAdd();

        if (rowsToAdd.length === 0) {
            return;
        }

        const existingPairs = new Set(details.map((d) => `${d.clas?.asmcL_Id}_${d.secs?.asmS_Id}_${d.yearid}_${d.user_id}_${d.emp_Id}`));
        const filtered = rowsToAdd.filter(
            (r) => !existingPairs.has(`${r.clas?.asmcL_Id}_${r.secs?.asmS_Id}_${r.yearid}_${r.user_id}_${r.emp_Id}`)
        );

        if (filtered.length === 0) {
            toast.error('Selected Class-Section combination(s) already added');
            return;
        }

        setDetails((prev) => [...prev, ...filtered]);
        reset();
        toast.info(`${filtered.length} Login Privileges added`);
    }

    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    function handleDeleteRow(id: string) {
        setDetails((prev) => prev.filter((r) => r.id !== id));
    }

    function handleEditRow(id: string) {
        const row = details.find((r) => r.id === id);
        if (!row) return;
        setEditingId(id);
        setValue('asmaY_Id', row.yearid);
        setValue('hrmE_Id', row.emp_Id);
        setValue('ivrmulF_Id', row.user_id);
        setValue('sectionList', [row.secs]);
        setValue('classList', [row.clas]);
        setValue('subjectList', row.sub);
        setValue('subSubjectList', row.ssub);

        // Set active tab based on elpflg
        if (row.elpflg === 'ct') {
            setActiveTab(0);
        } else if (row.elpflg === 'st') {
            setActiveTab(1);
        } else {
            setActiveTab(2);
        }

        setDisableClassSection(row.elpflg === 'ct');
        if (formRef.current) {
            const topPosition = formRef.current.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: topPosition - 70, behavior: 'smooth' });
        }
    }

    function handleUpdateRow() {
        if (!editingId) return;
        const rowIndex = details.findIndex((r) => r.id === editingId);
        if (rowIndex === -1) return;

        const v = getValues();
        const updated: DetailRow = {
            ...details[rowIndex],
            sub: Array.isArray(v.subjectList) ? v.subjectList : details[rowIndex].sub,
            ssub: Array.isArray(v.subSubjectList) ? v.subSubjectList : details[rowIndex].ssub,
            yearid: v.asmaY_Id ?? details[rowIndex].yearid,
            user_id: v.ivrmulF_Id ?? details[rowIndex].user_id,
            emp_name: (activeTab === 0 ? classTeachersData?.data : employeeData?.data)?.find((e: any) => e.hrmE_Id === v.hrmE_Id)?.hrmE_EmployeeName ?? details[rowIndex].emp_name,
            emp_Id: v.hrmE_Id ?? details[rowIndex].emp_Id,
            elpflg: activeTab === 0 ? 'ct' : activeTab === 1 ? 'st' : 'others'
        };

        setDetails((prev) => prev.map((r) => (r.id === editingId ? updated : r)));
        setEditingId(null);
        setDisableClassSection(activeTab === 0);
        toast.success('Row updated');
    }

    function cancelEdit() {
        setEditingId(null);
        setDisableClassSection(activeTab === 0);
        reset();
    }

    const handleDeleteRowByIndex = (index: number) => {
        setDetails((prev) => prev.filter((_, i) => i !== index));
        if (editingId === details[index]?.id) setEditingId(null);
        toast.info('Row deleted successfully');
    };

    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        if (details.length === 0) {
            toast.error('Add at least one row to save');
            return;
        }

        setIsSubmitting(true);

        try {
            const selectedclass = details.map((d) => {
                const sub = (d.sub || []).map((s: any) => ({
                    ismS_Id: s.ismS_Id ?? 0,
                    ismS_SubjectName: s.ismS_SubjectName || ''
                }));

                // FIXED: Use emsS_Id instead of issS_Id
                const ssub = (d.ssub || []).map((ss: any) => ({
                    emsS_Id: ss.emsS_Id ?? 0,
                    emsS_SubSubjectName: ss.emsS_SubSubjectName || ''
                }));

                return {
                    yearid: d.yearid,
                    user_id: d.user_id,
                    year: d.year,
                    emp_name: d.emp_name,
                    elpflg: d.elpflg,
                    clas: {
                        asmcL_Id: d.clas?.asmcL_Id ?? 0,
                        asmcL_ClassName: d.clas?.asmcL_ClassName || ''
                    },
                    secs: {
                        asmS_Id: d.secs?.asmS_Id ?? 0,
                        asmC_SectionName: d.secs?.asmC_SectionName || ''
                    },
                    sub: sub,
                    ssub: ssub
                };
            });

            const payload = {
                mI_Id: 0,
                selectedclass,
                action: editMode === 'edit' ? 'edit' : 'ADD'
            };

            console.info('Login privileges payload:', payload);

            const res = await addorUpdateExamLoginPrivileges(payload as any);

            if (res?.success) {
                toast.success(`${editMode === 'edit' ? 'Updated' : 'Saved'} successfully`);
                setDetails([]);
                reset();
                setEditMode('add');
                onSuccess?.();
                refetchAll();
            } else {
                toast.error(res?.message || `${editMode === 'edit' ? 'Update' : 'Save'} failed`);
            }
        } catch (err: any) {
            console.error('Save error:', err);
            toast.error(err.message || `Failed to ${editMode === 'edit' ? 'update' : 'save'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const tableRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (details.length > 0 && tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [details]);

    const detailsTable = useMemo(
        () => (
            <div ref={tableRef}>
                <table className='w-full border-collapse text-sm'>
                    <thead>
                        <tr style={{ background: 'hsl(277 90% 52%)', color: '#fff' }}>
                            <th className='border p-2'>SLNO</th>
                            <th className='border p-2'>Academic Year</th>
                            <th className='border p-2'>User ID</th>
                            <th className='border p-2'>Employee Name</th>
                            <th className='border p-2'>Class</th>
                            <th className='border p-2'>Section</th>
                            <th className='border p-2'>Subject</th>
                            <th className='border p-2'>Sub Subject</th>
                            <th className='border p-2'>Entry Type</th>
                            <th className='border p-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.map((d, idx) => (
                            <tr key={d.id} className='even:bg-gray-50'>
                                <td className='border p-2 text-center'>{idx + 1}</td>
                                <td className='border p-2 text-center'>{d.year}</td>
                                <td className='border p-2 text-center'>{d.user_id}</td>
                                <td className='border p-2'>{d.emp_name}</td>
                                <td className='border p-2'>{d.clas?.asmcL_ClassName ?? ''}</td>
                                <td className='border p-2'>
                                    {sections.find((s) => s.asmS_Id === d.secs?.asmS_Id)?.asmC_SectionName ?? ''}
                                </td>
                                <td className='border p-2'>{(d.sub || []).map((s) => s.ismS_SubjectName).join(', ')}</td>
                                {/* FIXED: Display emsS_SubSubjectName */}
                                <td className='border p-2'>{(d.ssub || []).map((ss) => ss.emsS_SubSubjectName).join(', ')}</td>
                                <td className='border p-2 text-center'>
                                    {d.elpflg === 'BY_CLASS_TEACHER' || d.elpflg === 'ct' ? 'Class Teacher' : d.elpflg === 'BY_SUBJECT_TEACHER' || d.elpflg === 'st' ? 'Subject Teacher' : 'Others'}
                                </td>
                                <td className='border p-2'>
                                    <div className='flex justify-center gap-2'>
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => handleEditRow(d.id)}
                                            className='h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600'>
                                            <Edit className='h-4 w-4' />
                                        </Button>
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => {
                                                setDeleteIndex(idx);
                                                setConfirmOpen(true);
                                            }}
                                            className='h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600'>
                                            <Trash2 className='h-4 w-4' />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {details.length === 0 && (
                            <tr>
                                <td className='border p-4 text-center' colSpan={10}>
                                    No rows added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        ),
        [details, sections]
    );

    const formRef = useRef<HTMLDivElement>(null);
    const dropdownData = activeTab === 0 ? classTeachersData?.data : employeeData?.data;

    const isLoading = activeTab === 0 ? classTeacherLoading : employeeDataLoading;

    // Check for any data loading
    const isDataLoading =
        academicYearLoading ||
        classTeacherLoading ||
        employeeDataLoading ||
        userListLoading ||
        masterSectionLoading ||
        masterClassLoading ||
        masterSubjectLoading ||
        masterSubSubjectLoading ||
        isLoadingEditData;

    if (isDataLoading) {
        return (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                <RefreshCw className='h-8 w-8 animate-spin text-secondary' />
                <p className='text-muted-foreground text-sm'>Loading data...</p>
            </div>
        );
    }

    return (
        <div className='w-full space-y-6' ref={formRef}>
            <FormProvider {...methods}>
                <form className='space-y-6'>
                    <div className='rounded bg-white p-3 shadow'>
                        <div className='mb-4 flex items-center justify-between'>
                            <div className='flex w-max gap-2 rounded-full bg-gray-200 p-1'>
                                <button
                                    type='button'
                                    className={`rounded-full px-6 py-2 font-medium text-sm transition-colors duration-200 ${activeTab === 0 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                                    onClick={() => {
                                        setActiveTab(0);
                                        setDisableClassSection(false);
                                        setValue('sectionList', []);
                                        setValue('hrmE_Id', 0);
                                        setValue('classList', []);
                                        setValue('subjectList', []);
                                        setValue('subSubjectList', []);
                                        setEditingId(null);
                                    }}>
                                    Entry By Class teacher
                                </button>
                                <button
                                    type='button'
                                    className={`rounded-full px-6 py-2 font-medium text-sm transition-colors duration-200 ${activeTab === 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                                    onClick={() => {
                                        setActiveTab(1);
                                        setDisableClassSection(false);
                                        setValue('sectionList', []);
                                        setValue('classList', []);
                                        setValue('hrmE_Id', 0);
                                        setValue('ivrmulF_Id', 0);
                                        setValue('asmaY_Id', 0);
                                        setValue('subjectList', []);
                                        setValue('subSubjectList', []);
                                        setEditingId(null);
                                    }}>
                                    Entry By Subject Teacher
                                </button>
                                <button
                                    type='button'
                                    className={`rounded-full px-6 py-2 font-medium text-sm transition-colors duration-200 ${activeTab === 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                                    onClick={() => {
                                        setActiveTab(2);
                                        setDisableClassSection(false);
                                        setValue('sectionList', []);
                                        setValue('classList', []);
                                        setValue('hrmE_Id', 0);
                                        setValue('subjectList', []);
                                        setValue('subSubjectList', []);
                                        setEditingId(null);
                                    }}>
                                    Entry By Others
                                </button>
                            </div>
                            {editMode === 'edit' && (
                                <Button className='flex w-fit' type='button' variant='outline' onClick={handleCancelEdit}>
                                    Cancel Edit
                                </Button>
                            )}
                        </div>

                        <div className='grid grid-cols-2 gap-6'>
                            <div className='flex flex-col gap-6'>
                                <Controller
                                    control={control}
                                    name='asmaY_Id'
                                    disabled={editingId !== null || editMode === 'edit'}
                                    render={({ field, fieldState }) => (
                                        <div className='w-full'>
                                            <Label>
                                                Academic Year <span className='text-red-500'>*</span>
                                            </Label>
                                            <Select
                                                key={field.value}
                                                onValueChange={(v) => field.onChange(Number(v))}
                                                value={field.value ? String(field.value) : ''}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select Academic Year' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {academicYearLoading ? (
                                                        <SelectItem value='0' disabled>
                                                            Loading...
                                                        </SelectItem>
                                                    ) : academicYear?.data?.length === 0 ? (
                                                        <SelectItem value='0' disabled>
                                                            No academic years
                                                        </SelectItem>
                                                    ) : (
                                                        academicYear?.data?.map((y: any) => (
                                                            <SelectItem key={y.asmaY_Id} value={String(y.asmaY_Id)}>
                                                                {y.asmaY_Year}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name='hrmE_Id'
                                    disabled={editingId !== null || editMode === 'edit'}
                                    render={({ field, fieldState }) => (
                                        <div className='w-full'>
                                            <Label>
                                                Employee Name <span className='text-red-500'>*</span>
                                            </Label>

                                            <Select
                                                key={field.value}
                                                value={field.value ? String(field.value) : ''}
                                                onValueChange={(v) => {
                                                    const selectedId = Number(v);
                                                    field.onChange(selectedId);

                                                    const selectedEmployee = dropdownData?.find((e: any) => e.hrmE_Id === selectedId);

                                                    if (!selectedEmployee?.hrmE_EmployeeName) {
                                                        setValue('ivrmulF_Id', 0);
                                                        return;
                                                    }

                                                    const userCode = extractCode(selectedEmployee.hrmE_EmployeeName);

                                                    const user = userLogins.find((u: any) => extractCode(u.hrmE_EmployeeName) === userCode);
                                                    console.info('user', user);

                                                    setValue('ivrmulF_Id', user?.ivrmulF_Id ?? 0);
                                                }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select Employee' />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {isLoading ? (
                                                        <SelectItem value='loading' disabled>
                                                            Loading...
                                                        </SelectItem>
                                                    ) : !dropdownData || dropdownData.length === 0 ? (
                                                        <SelectItem value='empty' disabled>
                                                            No Employee found
                                                        </SelectItem>
                                                    ) : (
                                                        dropdownData.map((e: any) => (
                                                            <SelectItem key={e.hrmE_Id} value={String(e.hrmE_Id)}>
                                                                {e.hrmE_EmployeeName}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>

                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name='classList'
                                    render={({ field, fieldState }) => {
                                        const options = classes.map((c: any) => ({ label: c.asmcL_ClassName, value: String(c.asmcL_Id) }));
                                        const selectedValues = (field.value || []).map((c: any) => String(c?.asmcL_Id));
                                        return (
                                            <CustomMultiSelectBox
                                                options={options}
                                                value={selectedValues}
                                                onChange={(vals) => {
                                                    const selected = vals.map(
                                                        (v) =>
                                                            classes.find((c) => String(c.asmcL_Id) === v) || {
                                                                asmcL_Id: Number(v),
                                                                asmcL_ClassName: ''
                                                            }
                                                    );
                                                    field.onChange(selected);
                                                }}
                                                label='Classes'
                                                height='200px'
                                                isSearchRequired
                                                isRequired={true}
                                                disabled={disableClassSection || activeTab === 0 || editMode === 'edit'}
                                                error={fieldState?.error?.message}
                                                isLoading={masterClassLoading}
                                                resetKey={activeTab}
                                            />
                                        );
                                    }}
                                />

                                <Controller
                                    control={control}
                                    name='subjectList'
                                    render={({ field, fieldState }) => {
                                        const options = subjects.map((s: any) => ({ label: s.ismS_SubjectName, value: String(s.ismS_Id) }));
                                        const selectedValues = (field.value || []).map((s: any) => String(s?.ismS_Id));
                                        return (
                                            <CustomMultiSelectBox
                                                options={options}
                                                value={selectedValues}
                                                onChange={(vals) => {
                                                    const selected = vals.map(
                                                        (v) =>
                                                            subjects.find((s) => String(s.ismS_Id) === v) || {
                                                                ismS_Id: Number(v),
                                                                ismS_SubjectName: ''
                                                            }
                                                    );
                                                    field.onChange(selected);
                                                }}
                                                label='Subjects'
                                                height='200px'
                                                isSearchRequired
                                                isRequired={true}
                                                error={fieldState?.error?.message}
                                                isLoading={masterSubjectLoading}
                                                resetKey={activeTab}
                                            />
                                        );
                                    }}
                                />
                            </div>

                            <div className='flex flex-col gap-6'>
                                <Controller
                                    control={control}
                                    name='ivrmulF_Id'
                                    disabled={editingId !== null || editMode === 'edit'}
                                    render={({ field, fieldState }) => (
                                        <div className='w-full'>
                                            <Label>
                                                User Name <span className='text-red-500'>*</span>
                                            </Label>
                                            <Select
                                                key={field.value}
                                                onValueChange={(v) => field.onChange(Number(v))}
                                                value={field.value ? String(field.value) : ''}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select User' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {userListLoading ? (
                                                        <SelectItem value='0' disabled>
                                                            Loading...
                                                        </SelectItem>
                                                    ) : userLogins?.length === 0 ? (
                                                        <SelectItem value='0' disabled>
                                                            No users found
                                                        </SelectItem>
                                                    ) : (
                                                        userLogins?.map((u: any) => (
                                                            <SelectItem key={u.ivrmulF_Id} value={String(u.ivrmulF_Id)}>
                                                                {u.hrmE_EmployeeName}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name='sectionList'
                                    render={({ field, fieldState }) => {
                                        const options = sections.map((s: any) => ({ label: s.asmC_SectionName, value: String(s.asmS_Id) }));
                                        const selectedValues = (field.value || []).map((s: any) => String(s?.asmS_Id));
                                        return (
                                            <CustomMultiSelectBox
                                                options={options}
                                                value={selectedValues}
                                                onChange={(vals) => {
                                                    const selected = vals.map(
                                                        (v) =>
                                                            sections.find((s) => String(s.asmS_Id) === v) || {
                                                                asmS_Id: Number(v),
                                                                asmC_SectionName: ''
                                                            }
                                                    );
                                                    field.onChange(selected);
                                                }}
                                                label='Sections'
                                                height='200px'
                                                isSearchRequired
                                                isRequired={true}
                                                disabled={disableClassSection || activeTab === 0 || editMode === 'edit'}
                                                error={fieldState?.error?.message}
                                                isLoading={masterSectionLoading}
                                                resetKey={activeTab}
                                            />
                                        );
                                    }}
                                />

                                {/* FIXED: Sub-subjects Controller with emsS_Id */}
                                <Controller
                                    control={control}
                                    name='subSubjectList'
                                    render={({ field, fieldState }) => {
                                        const options = subSubjects.map((s: any) => ({
                                            label: s.emsS_SubSubjectName || s.issS_SubSubjectName || '',
                                            value: String(s.emsS_Id || s.issS_Id)
                                        }));

                                        const selectedValues = (field.value || []).map((s: any) => String(s?.emsS_Id || s?.issS_Id || s));

                                        return (
                                            <CustomMultiSelectBox
                                                options={options}
                                                value={selectedValues}
                                                onChange={(vals) => {
                                                    const selected = vals.map((v) => {
                                                        const sub = subSubjects.find((s: any) => String(s.emsS_Id || s.issS_Id) === v);
                                                        return {
                                                            emsS_Id: sub?.emsS_Id || sub?.issS_Id || Number(v),
                                                            emsS_SubSubjectName: sub?.emsS_SubSubjectName || sub?.issS_SubSubjectName || ''
                                                        };
                                                    });
                                                    field.onChange(selected);
                                                }}
                                                label='Sub-Subjects'
                                                height='200px'
                                                isSearchRequired
                                                error={fieldState?.error?.message}
                                                isLoading={masterSubSubjectLoading}
                                                resetKey={activeTab}
                                            />
                                        );
                                    }}
                                />

                                <Controller
                                    control={control}
                                    name='remarks'
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <InputText {...field} label='Remarks' placeholder='Enter remarks' />
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='mt-6 flex w-full justify-center'>
                            <div className='flex w-fit justify-center gap-3'>
                                {editingId ? (
                                    <>
                                        <Button type='button' onClick={handleUpdateRow}>
                                            Update Row
                                        </Button>
                                        <Button type='button' variant='outline' onClick={cancelEdit}>
                                            Cancel Edit
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button type='button' onClick={handleAddRows}>
                                            + ADD
                                        </Button>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            onClick={() => {
                                                reset({
                                                    asmaY_Id: 0,
                                                    hrmE_Id: 0,
                                                    ivrmulF_Id: 0,
                                                    asmcL_Id: 0,
                                                    sectionList: [],
                                                    subjectList: [],
                                                    subSubjectList: [],
                                                    entryType: 'BY_CLASS_TEACHER',
                                                    remarks: '',
                                                    elp_ActiveFlag: true
                                                });
                                                if (editMode !== 'edit') {
                                                    setDetails([]);
                                                    setEditMode('add');
                                                } else {
                                                    // Revert to original data in edit mode
                                                    setDetails(JSON.parse(JSON.stringify(originalDetails)));
                                                    toast.info('Reverted to original saved data');
                                                }
                                                setActiveTab(0);
                                                setDisableClassSection(false);
                                                setEditingId(null);
                                            }}>
                                            Reset
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {details.length > 0 && (
                        <div className='rounded bg-white p-4 shadow'>
                            <div className='mb-2 flex items-center justify-between'>
                                <h3 className='font-semibold text-lg'>DETAILS</h3>
                                {editMode === 'edit' && (
                                    <span className='rounded-full bg-purple-100 px-3 py-1 font-medium text-purple-800 text-sm'>
                                        Edit Mode
                                    </span>
                                )}
                            </div>
                            <div className='overflow-x-auto'>{detailsTable}</div>
                            <div className='mt-5 flex w-full justify-center'>
                                <div className='w-fit'>
                                    <Button type='button' disabled={isSubmitting} onClick={() => onSubmit(getValues())}>
                                        {isSubmitting
                                            ? editMode === 'edit'
                                                ? 'Updating...'
                                                : 'Saving...'
                                            : editMode === 'edit'
                                                ? 'Update'
                                                : 'Save'}
                                    </Button>

                                    {editMode === 'edit' && (
                                        <Button type='button' variant='outline' className='mt-2' onClick={handleCancelEdit}>
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </FormProvider>

            {confirmOpen && deleteIndex !== null && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
                    <div className='w-[360px] rounded-md bg-white p-6 text-center shadow-xl'>
                        <h2 className='mb-3 font-semibold text-lg'>Confirm Delete</h2>
                        <p className='mb-6 text-gray-700'>Are you sure you want to delete this row?</p>
                        <div className='flex justify-center gap-4'>
                            <Button
                                variant='outline'
                                onClick={() => {
                                    setConfirmOpen(false);
                                    setDeleteIndex(null);
                                }}>
                                Cancel
                            </Button>
                            <Button
                                variant='destructive'
                                onClick={() => {
                                    handleDeleteRowByIndex(deleteIndex);
                                    setConfirmOpen(false);
                                    setDeleteIndex(null);
                                }}>
                                Yes, Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

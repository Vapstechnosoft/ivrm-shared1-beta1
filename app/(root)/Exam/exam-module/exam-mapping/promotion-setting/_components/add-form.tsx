'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterGradeDropdownList } from '@/hooks/exam/exammodule/usemasters';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import {
    addOrUpdatePromotionSettings,
    getExamSubjectsByCategoryId,
    getIndividualPromotionDetailsById,
    getPromotionCategoryByAcademicYear
} from '@/server/exam/exam-module/exam-mapping/promotional-setting';
import type { IPromotionCategory, IPromotionSetting } from '@/types/exam/exam-module/exam-mapping';
import { Eye } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ViewExamsModal } from './group-mapped-exam-model';
import { ViewGroupsModal } from './group-mapping-model';
import { set } from 'date-fns';
import { usePromotionalSetting } from '@/hooks/exam/exammodule/exam-mapping';

/**
 * Types
 */
export type GroupItem = {
    id: number;
    EMPSG_Id?: number;
    EMPSG_GroupName: string;
    EMPSG_DisplayName: string;
    EMPSG_PercentValue: number;
    EMPSG_MarksValue: number;
    EMPSG_MaxOff: number;
    EMPSG_BestOff: number;
    EMPSG_Order: number;
    EMPSG_RoundOffFlag: boolean;
    Exm_M_Prom_Subj_Group_Exams_master: Array<{
        emE_Id: number;
        emE_ExamName: string;
        EMPSGE_ForMaxMarkrs: number;
        EMPSGE_ConvertionReqOrNot: boolean;
    }>;
};

export type SubjectRow = {
    ismS_Id: number;
    ismS_SubjectName: string;
    ismS_SubjectCode: string | null;
    EMPS_MaxMarks: number | null;
    EMPS_MinMarks: number | null;
    EMPS_ConvertForMarks: number | null;
    EMPS_AppToResultFlg: boolean;
    EMGR_Id: string | null;
    EMPS_Id?: number;
    EMPS_SubjOrder?: number;
    pro_exams_group_list?: GroupItem[];
    checkedvalue?: boolean;
};

type ExamItem = {
    emE_Id: number;
    emE_ExamName: string;
    emE_ExamCode?: string;
    checked?: boolean;
    ForMaxMarkrs?: number;
    ForMaxMarkrs_Temp?: number;
    ConvertionReqOrNot?: boolean;
};

type GradeItem = {
    emgR_Id: string;
    emgR_GradeName: string;
};

type PromotionPayload = {
    EMP_Id: number;
    ASMAY_Id: number;
    EYC_Id: number;
    EMGR_Id: string | null;
    EMP_PassToIndSubjectFlg: boolean;
    EMP_PassToOverallFlag: boolean;
    EMP_MarksPerFlg: 'M' | 'P' | 'T' | 'F';
    EMP_BestOfApplicableFlg: boolean;
    EMP_BestOf: number | null;
    pro_subjects_list: Array<{
        ismS_Id: number;
        EMPS_MaxMarks: number;
        EMPS_MinMarks: number;
        EMPS_ConvertForMarks: number;
        EMPS_AppToResultFlg: boolean;
        EMGR_Id: string;
        EMPS_SubjOrder?: number;
        pro_exams_group_list?: GroupItem[];
    }>;
};

/**
 * Main component
 */
export default function AddPromotionalSettingForm({
    rowData,
    onSuccess
}: {
    rowData?: IPromotionSetting;
    onSuccess?: () => void;
}) {
    // Form state
    const [selectedYear, setSelectedYear] = useState<number>(0);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

    // Toggle states
    const [passToIndividual, setPassToIndividual] = useState<boolean>(false);
    const [passToOverall, setPassToOverall] = useState<boolean>(false);
    const [bestApplicable, setBestApplicable] = useState<boolean>(false);
    const [bestOff, setBestOff] = useState<number | null>(null);
    const [isDataSaving, setIsDataSaving] = useState<boolean>(false);

    // Mode state
    const [promotionType, setPromotionType] = useState<'M' | 'P' | 'T' | 'F'>('P');

    // Data state
    const [categories, setCategories] = useState<IPromotionCategory[]>([]);

    // Grades hook
    const { data: gradeDataList, error: gradeError } = useMasterGradeDropdownList();
    const { refetchAll } = usePromotionalSetting();
    const grades = gradeDataList?.data || [];

    const [subjects, setSubjects] = useState<SubjectRow[]>([]);
    const [exams, setExams] = useState<ExamItem[]>([]);

    // UI state
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [headerMaxMarks, setHeaderMaxMarks] = useState<string>('');
    const [headerMinMarks, setHeaderMinMarks] = useState<string>('');
    const [headerConvertMarks, setHeaderConvertMarks] = useState<string>('');
    const [headerApplyToResult, setHeaderApplyToResult] = useState<boolean>(true);
    const [headerGrade, setHeaderGrade] = useState<string>('__none');

    // Modal state
    const [activeSubject, setActiveSubject] = useState<SubjectRow | null>(null);
    const [isGroupsOpen, setIsGroupsOpen] = useState(false);
    const [isExamsOpen, setIsExamsOpen] = useState(false);
    const [activeGroup, setActiveGroup] = useState<GroupItem | null>(null);

    // Loading
    const { data: academicYear, isLoading: academicYearLoading } = useAcademicYearDropdown();
    const [isEditLoading, setIsEditLoading] = useState(false);

    // Save initial state for reset in edit mode
    const [initialState, setInitialState] = useState<any>(null);

    // Load categories
    const fetchCategories = useCallback(async (yearId: number, categoryName?: string, categoryId?: number) => {
        try {
            const response = await getPromotionCategoryByAcademicYear(yearId, 0);
            const safeCats = Array.isArray(response?.data) ? response.data : [];
            if (categoryName && categoryId) {
                safeCats.push({ emcA_CategoryName: categoryName, eyC_Id: categoryId });
            }
            setCategories(safeCats);
        } catch (error) {
            console.error('Error loading categories:', error);
            toast.error('Failed to load categories');
        }
    }, []);

    // Load categories when year changes (only for non-initialization case)
    useEffect(() => {
        if (!selectedYear || isEditLoading || rowData) return;
        fetchCategories(selectedYear);
        setSelectedCategory(null);
        setSubjects([]);
    }, [selectedYear, fetchCategories, isEditLoading]);

    // Load subjects when category changes
    const loadSubjects = useCallback(async (categoryId: number) => {
        try {
            const response = await getExamSubjectsByCategoryId(categoryId);
            const payload = response.data as {
                subjectlist?: any[];
                examlist?: ExamItem[];
            };

            const subjectsData = Array.isArray(payload.subjectlist)
                ? payload.subjectlist.map(
                    (subject: any): SubjectRow => ({
                        ismS_Id: subject.ismS_Id,
                        ismS_SubjectName: subject.ismS_SubjectName,
                        ismS_SubjectCode: subject.ismS_SubjectCode || null,
                        EMPS_MaxMarks: subject.empS_MaxMarks || subject.ismS_Max_Marks || null,
                        EMPS_MinMarks: subject.empS_MinMarks || subject.ismS_Min_Marks || null,
                        EMPS_ConvertForMarks: subject.empS_ConvertForMarks || null,
                        EMPS_AppToResultFlg: subject.empS_AppToResultFlg ?? true,
                        EMGR_Id: subject.emgR_Id || null,
                        EMPS_Id: subject.empS_Id,
                        checkedvalue: false
                    })
                )
                : [];

            const examsData = Array.isArray(payload.examlist)
                ? payload.examlist.map(
                    (exam: any): ExamItem => ({
                        emE_Id: exam.emE_Id,
                        emE_ExamName: exam.emE_ExamName,
                        emE_ExamCode: exam.emE_ExamCode,
                        checked: false,
                        ForMaxMarkrs: 0,
                        ForMaxMarkrs_Temp: 0,
                        ConvertionReqOrNot: false
                    })
                )
                : [];

            setSubjects(subjectsData);
            setExams(examsData);

            // Reset header inputs
            setHeaderMaxMarks('');
            setHeaderMinMarks('');
            setHeaderConvertMarks('');
            setHeaderGrade('__none');

            return { subjectsData, examsData };
        } catch (error) {
            console.error('Error loading subjects:', error);
            toast.error('Failed to load subjects and exams');
            return null;
        }
    }, []);

    useEffect(() => {
        if (selectedCategory && !rowData) {
            loadSubjects(selectedCategory);
        }
    }, [selectedCategory, loadSubjects, rowData]);

    // Initialize Edit Mode
    useEffect(() => {
        if (rowData) {
            const initEdit = async () => {
                try {
                    setIsEditLoading(true);
                    // Set basic fields
                    setSelectedYear(rowData.asmaY_Id);

                    // Fetch categories for this year
                    await fetchCategories(rowData.asmaY_Id, rowData.emcA_CategoryName, rowData.eyC_Id);

                    setSelectedCategory(rowData.eyC_Id);
                    setSelectedGrade(String(rowData.emgR_Id));

                    setPassToIndividual(rowData.emP_PassToIndSubjectFlg);
                    setPassToOverall(rowData.emP_PassToOverallFlag);
                    setPromotionType(rowData.emP_MarksPerFlg as any);

                    setBestApplicable(rowData.emP_BestOfApplicableFlg);
                    setBestOff(rowData.emP_BestOf);

                    // Fetch fresh subjects for the category
                    const masterData = await loadSubjects(rowData.eyC_Id);
                    if (!masterData) {
                        setIsEditLoading(false);
                        return;
                    }

                    // Fetch saved details
                    const response = await getIndividualPromotionDetailsById(rowData.emP_Id);

                    let finalSubjects = masterData.subjectsData;

                    if (response.success && response.data) {
                        const { categoryDetails, promotionSubjects } = response.data;

                        if (categoryDetails) {
                            setSelectedYear(categoryDetails.asmaY_Id);
                            setSelectedCategory(categoryDetails.eyC_Id);
                            setSelectedGrade(String(categoryDetails.emgR_Id));
                            setPassToIndividual(categoryDetails.emP_PassToIndSubjectFlg);
                            setPassToOverall(categoryDetails.emP_PassToOverallFlag);
                            setPromotionType(categoryDetails.emP_MarksPerFlg as any);
                            setBestApplicable(categoryDetails.emP_BestOfApplicableFlg);
                            setBestOff(categoryDetails.emP_BestOf);
                        }

                        if (promotionSubjects) {
                            const { promotion_Subject_List, promotion_SubGroup_List, group_Exam_List } = promotionSubjects;

                            finalSubjects = masterData.subjectsData.map((subject) => {
                                const savedSub = promotion_Subject_List?.find((s: any) => s.ismS_Id === subject.ismS_Id);
                                if (savedSub) {
                                    // Map groups for this subject
                                    const groups = promotion_SubGroup_List
                                        ?.filter((g: any) => g.empS_Id === savedSub.empS_Id)
                                        .map((g: any) => {
                                            // Map exams for this group
                                            const exams = group_Exam_List
                                                ?.filter((e: any) => e.empsG_Id === g.empsG_Id)
                                                .map((e: any) => ({
                                                    emE_Id: e.emE_Id,
                                                    emE_ExamName: e.emE_ExamName,
                                                    EMPSGE_ForMaxMarkrs: e.empsgE_ForMaxMarkrs,
                                                    EMPSGE_ConvertionReqOrNot: e.empsgE_ConvertionReqOrNot
                                                }));

                                            return {
                                                id: g.empsG_Id,
                                                EMPSG_Id: g.empsG_Id,
                                                EMPSG_GroupName: g.empsG_GroupName,
                                                EMPSG_DisplayName: g.empsG_DisplayName,
                                                EMPSG_PercentValue: g.empsG_PercentValue,
                                                EMPSG_MarksValue: g.empsG_MarksValue,
                                                EMPSG_MaxOff: g.empsG_MaxOff,
                                                EMPSG_BestOff: g.empsG_BestOff,
                                                EMPSG_Order: g.empsG_Order,
                                                EMPSG_RoundOffFlag: g.empsG_RoundOffFlag,
                                                Exm_M_Prom_Subj_Group_Exams_master: exams || []
                                            };
                                        });

                                    return {
                                        ...subject,
                                        checkedvalue: true,
                                        EMPS_MaxMarks: savedSub.empS_MaxMarks,
                                        EMPS_MinMarks: savedSub.empS_MinMarks,
                                        EMPS_ConvertForMarks: savedSub.empS_ConvertForMarks,
                                        EMPS_AppToResultFlg: savedSub.empS_AppToResultFlg,
                                        EMGR_Id: savedSub.emgR_Id ? String(savedSub.emgR_Id) : subject.EMGR_Id,
                                        EMPS_SubjOrder: savedSub.empS_SubjOrder,
                                        EMPS_Id: savedSub.empS_Id,
                                        pro_exams_group_list: groups || []
                                    };
                                }
                                return subject;
                            });
                        }
                    }

                    setSubjects(finalSubjects);
                    console.log('finalSubjects', finalSubjects);
                    setInitialState({
                        selectedYear: rowData.asmaY_Id,
                        selectedCategory: rowData.eyC_Id,
                        selectedGrade: String(rowData.emgR_Id),
                        passToIndividual: rowData.emP_PassToIndSubjectFlg,
                        passToOverall: rowData.emP_PassToOverallFlag,
                        promotionType: rowData.emP_MarksPerFlg as any,
                        bestApplicable: rowData.emP_BestOfApplicableFlg,
                        bestOff: rowData.emP_BestOf,
                        subjects: finalSubjects
                    });
                } catch (error) {
                    console.error('Error initializing edit:', error);
                    toast.error('Failed to load details for editing');
                } finally {
                    setIsEditLoading(false);
                }
            };

            initEdit();
        }
    }, [rowData, loadSubjects, fetchCategories]);

    // Toggle all subjects
    const toggleAllSubjects = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        setSubjects((prev) =>
            prev.map((subject) => ({
                ...subject,
                checkedvalue: newSelectAll
            }))
        );
    };

    // Toggle individual subject
    const toggleSubject = (subjectId: number) => {
        setSubjects((prev) =>
            prev.map((subject) => (subject.ismS_Id === subjectId ? { ...subject, checkedvalue: !subject.checkedvalue } : subject))
        );

        // Update selectAll based on new state
        const updatedSubjects = subjects.map((subject) =>
            subject.ismS_Id === subjectId ? { ...subject, checkedvalue: !subject.checkedvalue } : subject
        );

        const allSelected = updatedSubjects.every((s) => s.checkedvalue);
        setSelectAll(allSelected);
    };

    // Apply header values to selected subjects
    const applyHeaderValues = () => {
        setSubjects((prev) =>
            prev.map((subject) => {
                if (!subject.checkedvalue) return subject;

                const updatedSubject = { ...subject };

                if (headerMaxMarks !== '') {
                    const maxMarks = Number.parseFloat(headerMaxMarks);
                    if (!Number.isNaN(maxMarks)) {
                        updatedSubject.EMPS_MaxMarks = maxMarks;
                    }
                }

                if (headerMinMarks !== '') {
                    const minMarks = Number.parseFloat(headerMinMarks);
                    if (!Number.isNaN(minMarks)) {
                        updatedSubject.EMPS_MinMarks = minMarks;
                    }
                }

                if (headerConvertMarks !== '') {
                    const convertMarks = Number.parseFloat(headerConvertMarks);
                    if (!Number.isNaN(convertMarks)) {
                        updatedSubject.EMPS_ConvertForMarks = convertMarks;
                    }
                }

                if (headerGrade !== '__none') {
                    updatedSubject.EMGR_Id = headerGrade === '__keep' ? subject.EMGR_Id : headerGrade;
                }

                updatedSubject.EMPS_AppToResultFlg = headerApplyToResult;

                return updatedSubject;
            })
        );

        toast.info('Applied header values to selected subjects');
    };

    // Open group modal for a subject
    const openGroupModal = (subject: SubjectRow) => {
        // Check if required fields are filled
        if (!subject.EMPS_MaxMarks || !subject.EMPS_MinMarks || !subject.EMPS_ConvertForMarks) {
            toast.error('Please fill Max Marks, Min Marks, and Converted Marks first');
            return;
        }

        setActiveSubject(subject);
        setIsGroupsOpen(true);
    };

    // Update subject groups - This is the missing onAddGroup function
    const updateSubjectGroups = (groups: GroupItem[]) => {
        if (!activeSubject) return;

        console.info('Updating groups for subject:', activeSubject.ismS_SubjectName, groups);

        setSubjects((prev) =>
            prev.map((subject) => (subject.ismS_Id === activeSubject.ismS_Id ? { ...subject, pro_exams_group_list: groups } : subject))
        );

        // Also update activeSubject to reflect changes
        setActiveSubject((prev) => (prev ? { ...prev, pro_exams_group_list: groups } : null));

        toast.success(`Groups updated for ${activeSubject.ismS_SubjectName}`);
    };

    // Add a single group to a subject
    const addGroupToSubject = (group: GroupItem) => {
        if (!activeSubject) return;

        const currentGroups = activeSubject.pro_exams_group_list || [];
        const updatedGroups = [...currentGroups, group];

        console.info('Adding group to subject:', activeSubject.ismS_SubjectName, group);

        setSubjects((prev) =>
            prev.map((subject) =>
                subject.ismS_Id === activeSubject.ismS_Id ? { ...subject, pro_exams_group_list: updatedGroups } : subject
            )
        );

        // Update activeSubject to reflect changes
        setActiveSubject((prev) => (prev ? { ...prev, pro_exams_group_list: updatedGroups } : null));

        toast.success(`Group "${group.EMPSG_GroupName}" added to ${activeSubject.ismS_SubjectName}`);
    };

    // Open exams modal
    const openExamsModal = (group: GroupItem) => {
        setActiveGroup(group);
        setIsExamsOpen(true);
    };

    // Build payload for save
    const buildPayload = (): PromotionPayload => {
        const selectedSubjects = subjects
            .filter((subject) => subject.checkedvalue)
            .map((subject) => ({
                ismS_Id: subject.ismS_Id,
                EMPS_MaxMarks: subject.EMPS_MaxMarks || 0,
                EMPS_MinMarks: subject.EMPS_MinMarks || 0,
                EMPS_ConvertForMarks: subject.EMPS_ConvertForMarks || 0,
                EMPS_AppToResultFlg: subject.EMPS_AppToResultFlg,
                EMGR_Id: subject.EMGR_Id || (grades[0]?.emgR_Id ? String(grades[0]?.emgR_Id) : '') || '',
                EMPS_SubjOrder: subject.EMPS_SubjOrder || 1,
                pro_exams_group_list: subject.pro_exams_group_list || []
            }));

        return {
            EMP_Id: rowData ? rowData.emP_Id : 0, // Use rowData.emP_Id for edit, 0 for new
            ASMAY_Id: selectedYear,
            EYC_Id: selectedCategory || 0,
            EMGR_Id: selectedGrade,
            EMP_PassToIndSubjectFlg: passToIndividual,
            EMP_PassToOverallFlag: passToOverall,
            EMP_MarksPerFlg: promotionType,
            EMP_BestOfApplicableFlg: bestApplicable,
            EMP_BestOf: bestApplicable ? bestOff : null,
            pro_subjects_list: selectedSubjects
        };
    };

    // Handle save
    const handleSave = async () => {
        // Validate required fields
        if (!selectedYear) {
            toast.error('Please select Academic Year');
            return;
        }

        if (!selectedCategory) {
            toast.error('Please select Category');
            return;
        }

        if (!selectedGrade) {
            toast.error('Please select Grade');
            return;
        }

        if (bestApplicable && (!bestOff || bestOff <= 0)) {
            toast.error('Please enter Best Off value');
            return;
        }

        // Check if any subject is selected
        const selectedSubjects = subjects.filter((s) => s.checkedvalue);
        if (selectedSubjects.length === 0) {
            toast.error('Please select at least one subject');
            return;
        }

        // Validate selected subjects
        const invalidSubjects = selectedSubjects.filter((subject) => {
            if (promotionType !== 'F') {
                return !subject.EMPS_MaxMarks || !subject.EMPS_MinMarks || !subject.EMPS_ConvertForMarks;
            }
            return false;
        });

        if (invalidSubjects.length > 0) {
            toast.error('Please fill all marks fields for selected subjects');
            return;
        }

        // Check groups for Marks/Percentage mode
        if (promotionType === 'M' || promotionType === 'P') {
            const subjectsWithoutGroups = selectedSubjects.filter(
                (subject) => !subject.pro_exams_group_list || subject.pro_exams_group_list.length === 0
            );

            if (subjectsWithoutGroups.length > 0) {
                const subjectNames = subjectsWithoutGroups.map((s) => s.ismS_SubjectName).join(', ');
                toast.error(`Please add groups for subjects: ${subjectNames}`);
                return;
            }
        }
        setIsDataSaving(true);
        const payload = buildPayload();
        console.info('Save payload:', JSON.stringify(payload, null, 2));
        const response = await addOrUpdatePromotionSettings(payload);
        setIsDataSaving(false);
        if (response.success) {
            toast.success('Promotion Setting saved successfully');
            refetchAll();
            if (onSuccess) onSuccess();
            else handleReset();
        } else {
            toast.error(response.message || 'Failed to save Promotion Setting');
        }
    };

    // Handle reset
    const handleReset = useCallback(() => {
        if (rowData && initialState) {
            // Revert to initial state in edit mode
            setSelectedYear(initialState.selectedYear);
            setSelectedCategory(initialState.selectedCategory);
            setSelectedGrade(initialState.selectedGrade);
            setPassToIndividual(initialState.passToIndividual);
            setPassToOverall(initialState.passToOverall);
            setPromotionType(initialState.promotionType);
            setBestApplicable(initialState.bestApplicable);
            setBestOff(initialState.bestOff);
            setSubjects(initialState.subjects);
            toast.info('Reverted to original values');
        } else {
            // Clear all for Add mode
            setSelectedYear(0);
            setSelectedCategory(null);
            setSelectedGrade(null);
            setSubjects([]);
            setSelectAll(false);
            setPassToIndividual(false);
            setPassToOverall(false);
            setBestApplicable(false);
            setBestOff(null);
            setPromotionType('P');
            setPromotionType('P');
            // Only show toast if something was reset (e.g. year was selected)
            if (selectedYear !== 0) {
                toast.info('Form reset');
            }
        }
    }, [rowData, initialState, selectedYear]);

    // Check if table should be visible
    const isTableVisible = promotionType !== 'F' && selectedCategory && subjects.length > 0;

    // Calculate total percentage for all groups in a subject (for validation)
    const getSubjectTotalPercentage = useCallback((subject: SubjectRow) => {
        if (!subject.pro_exams_group_list) return 0;
        return subject.pro_exams_group_list.reduce((total, group) => total + group.EMPSG_PercentValue, 0);
    }, []);

    return (
        <div className='relative'>
            {isEditLoading && (
                <div className='absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm'>
                    <div className='flex flex-col items-center gap-2'>
                        {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
                        <div className='h-8 w-8 animate-spin rounded-full border-primary border-t-2 border-b-2'></div>
                        <p className='font-medium text-sm'>Loading data...</p>
                    </div>
                </div>
            )}
            <CollapsibleSection defaultOpen>
                {/* TOP SECTION - 2 columns */}
                <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                    {/* LEFT SIDE - Dropdowns */}
                    <div className='space-y-4'>
                        {/* Academic Year */}
                        <div>
                            <Label>Academic Year *</Label>
                            <Select
                                key={selectedYear}
                                value={selectedYear !== 0 ? String(selectedYear) : undefined}
                                onValueChange={(v) => setSelectedYear(Number(v))}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Academic Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='0' disabled>
                                        --Select--
                                    </SelectItem>
                                    {academicYearLoading ? (
                                        <SelectItem value='__loading' disabled>
                                            Loading Academic Year...
                                        </SelectItem>
                                    ) : (
                                        academicYear?.data?.map((item: any) => (
                                            <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                {item.asmaY_Year}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category */}
                        <div>
                            <Label>Category *</Label>
                            <Select
                                key={selectedCategory}
                                value={selectedCategory ? String(selectedCategory) : '__none'}
                                onValueChange={(v) => setSelectedCategory(v && v !== '__none' ? Number(v) : null)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Category' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='__none' disabled>
                                        --Select--
                                    </SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem key={c.eyC_Id} value={c.eyC_Id.toString()}>
                                            {c.emcA_CategoryName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Grade */}
                        <div>
                            <Label>Grade *</Label>
                            <Select
                                key={selectedGrade}
                                value={selectedGrade || '__none'}
                                onValueChange={(v) => setSelectedGrade(v && v !== '__none' ? v : null)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Grade' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='__none' disabled>
                                        --Select--
                                    </SelectItem>
                                    {grades.map((grade) => (
                                        <SelectItem key={grade.emgR_Id} value={grade.emgR_Id.toString()}>
                                            {grade.emgR_GradeName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* RIGHT SIDE - Radio buttons and checkboxes */}
                    <div className='space-y-6'>
                        {/* Radio buttons for promotion type */}
                        <div className='rounded-lg border p-4'>
                            <div className='mb-2 font-medium text-sm'>Promotion Type *</div>
                            <div className='flex flex-wrap gap-4'>
                                <label className='flex items-center space-x-2'>
                                    <input
                                        type='radio'
                                        checked={promotionType === 'M'}
                                        onChange={() => {
                                            setPromotionType('M');
                                            toast.info('Marks mode selected. Please configure groups for selected subjects.');
                                        }}
                                        className='h-4 w-4'
                                    />
                                    <span className='text-sm'>Marks</span>
                                </label>
                                <label className='flex items-center space-x-2'>
                                    <input
                                        type='radio'
                                        checked={promotionType === 'P'}
                                        onChange={() => {
                                            setPromotionType('P');
                                            toast.info('Percentage mode selected. Please configure groups for selected subjects.');
                                        }}
                                        className='h-4 w-4'
                                    />
                                    <span className='text-sm'>Percentage</span>
                                </label>
                                <label className='flex items-center space-x-2'>
                                    <input
                                        type='radio'
                                        checked={promotionType === 'T'}
                                        onChange={() => {
                                            setPromotionType('T');
                                            toast.info('Total mode selected. Groups not required.');
                                        }}
                                        className='h-4 w-4'
                                    />
                                    <span className='text-sm'>Total</span>
                                </label>
                                <label className='flex items-center space-x-2'>
                                    <input
                                        type='radio'
                                        checked={promotionType === 'F'}
                                        onChange={() => {
                                            setPromotionType('F');
                                            toast.info('Final Exam mode selected. No subject configuration needed.');
                                        }}
                                        className='h-4 w-4'
                                    />
                                    <span className='text-sm'>Final Exam</span>
                                </label>
                            </div>
                        </div>

                        {/* Checkboxes */}
                        <div className='rounded-lg border p-4'>
                            <div className='mb-2 font-medium text-sm'>Options</div>
                            <div className='space-y-3'>
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        id='passIndividual'
                                        checked={passToIndividual}
                                        onCheckedChange={(checked) => setPassToIndividual(checked as boolean)}
                                    />
                                    <label htmlFor='passIndividual' className='text-sm'>
                                        Pass to Individual Subjects
                                    </label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        id='passOverall'
                                        checked={passToOverall}
                                        onCheckedChange={(checked) => setPassToOverall(checked as boolean)}
                                    />
                                    <label htmlFor='passOverall' className='text-sm'>
                                        Pass to Overall Subjects
                                    </label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        id='bestApplicable'
                                        checked={bestApplicable}
                                        onCheckedChange={(checked) => {
                                            setBestApplicable(checked as boolean);
                                            if (!checked) setBestOff(null);
                                        }}
                                    />
                                    <label htmlFor='bestApplicable' className='text-sm'>
                                        Best Applicable
                                    </label>
                                </div>
                                {bestApplicable && (
                                    <div className='ml-6 flex items-center space-x-2'>
                                        <Label htmlFor='bestOff' className='w-20'>
                                            Best Off:
                                        </Label>
                                        <Input
                                            id='bestOff'
                                            type='number'
                                            value={bestOff || ''}
                                            onChange={(e) => {
                                                const value = e.target.value ? Number.parseInt(e.target.value) : null;
                                                if (value && value <= 0) {
                                                    toast.error('Best Off must be greater than 0');
                                                    return;
                                                }
                                                setBestOff(value);
                                            }}
                                            className='w-32'
                                            min='1'
                                            max='99'
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SUBJECTS TABLE */}
                {isTableVisible ? (
                    <div className='mb-6 overflow-x-auto rounded-lg border'>
                        <table className='w-full'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th className='w-12 p-3 text-center'>
                                        <div className='flex flex-col items-center'>
                                            <span className='text-xs'>SLNO</span>
                                        </div>
                                    </th>
                                    <th className='w-12 p-3 text-center'>
                                        <div className='flex flex-col items-center'>
                                            <span className='text-xs'>Select</span>
                                            <Checkbox checked={selectAll} onCheckedChange={toggleAllSubjects} />
                                        </div>
                                    </th>
                                    <th className='p-3'>
                                        <div className='text-xs'>Subject Name (Code)</div>
                                    </th>
                                    <th className='w-40 p-3'>
                                        <div className='flex flex-col items-center'>
                                            <span className='text-xs'>Max Marks</span>
                                            <Input
                                                type='number'
                                                value={headerMaxMarks}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value && Number.parseFloat(value) > 1000) {
                                                        toast.error('Max Marks cannot exceed 1000');
                                                        return;
                                                    }
                                                    setHeaderMaxMarks(value);
                                                }}
                                                placeholder='All'
                                                className='h-8 text-sm'
                                            />
                                        </div>
                                    </th>
                                    <th className='w-40 p-3'>
                                        <div className='flex flex-col items-center'>
                                            <span className='text-xs'>Min Marks</span>
                                            <Input
                                                type='number'
                                                value={headerMinMarks}
                                                onChange={(e) => setHeaderMinMarks(e.target.value)}
                                                placeholder='All'
                                                className='h-8 text-sm'
                                                disabled={!headerMaxMarks}
                                            />
                                        </div>
                                    </th>
                                    <th className='w-40 p-3'>
                                        <div className='flex flex-col items-center'>
                                            <span className='text-xs'>Convert Marks For</span>
                                            <Input
                                                type='number'
                                                value={headerConvertMarks}
                                                onChange={(e) => setHeaderConvertMarks(e.target.value)}
                                                placeholder='All'
                                                className='h-8 text-sm'
                                                disabled={!headerMaxMarks}
                                            />
                                        </div>
                                    </th>
                                    <th className='w-32 p-3'>
                                        <div className='flex flex-col items-center'>
                                            <span className='text-xs'>Apply to Result</span>
                                            <Checkbox
                                                checked={headerApplyToResult}
                                                onCheckedChange={(checked) => setHeaderApplyToResult(checked as boolean)}
                                            />
                                        </div>
                                    </th>
                                    <th className='w-40 p-3'>
                                        <div className='flex flex-col items-center'>
                                            <span className='text-xs'>Grade</span>
                                            <Select value={headerGrade} onValueChange={setHeaderGrade}>
                                                <SelectTrigger className='h-8 text-sm'>
                                                    <SelectValue placeholder='All' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='__keep'>— Keep existing —</SelectItem>
                                                    {grades.map((grade) => (
                                                        <SelectItem key={grade.emgR_Id} value={grade.emgR_Id.toString()}>
                                                            {grade.emgR_GradeName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </th>
                                    {(promotionType === 'M' || promotionType === 'P') && (
                                        <th className='w-20 p-3 text-center'>
                                            <div className='text-xs'>Action</div>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((subject, index) => {
                                    const totalPercentage = getSubjectTotalPercentage(subject);
                                    const hasGroups = subject.pro_exams_group_list && subject.pro_exams_group_list.length > 0;

                                    return (
                                        <tr key={subject.ismS_Id} className={`border-t hover:bg-gray-50 ${hasGroups ? 'bg-green-50' : ''}`}>
                                            <td className='p-3 text-center'>{index + 1}</td>
                                            <td className='p-3 text-center'>
                                                <Checkbox
                                                    checked={!!subject.checkedvalue}
                                                    onCheckedChange={() => toggleSubject(subject.ismS_Id)}
                                                />
                                            </td>
                                            <td className='p-3'>
                                                <div className='flex items-center gap-2'>
                                                    <span>{subject.ismS_SubjectName}</span>
                                                    {subject.ismS_SubjectCode && (
                                                        <span className='text-gray-500 text-sm'>({subject.ismS_SubjectCode})</span>
                                                    )}
                                                    {hasGroups && (
                                                        <span className='ml-2 rounded-full bg-green-100 px-2 py-1 text-green-800 text-xs'>
                                                            {subject.pro_exams_group_list?.length || 0} groups
                                                            {promotionType === 'P' && ` (${totalPercentage}%)`}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className='p-3'>
                                                <Input
                                                    type='number'
                                                    value={subject.EMPS_MaxMarks || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value ? Number.parseFloat(e.target.value) : null;
                                                        if (value && value > 1000) {
                                                            toast.error('Max Marks cannot exceed 1000');
                                                            return;
                                                        }
                                                        setSubjects((prev) =>
                                                            prev.map((s) =>
                                                                s.ismS_Id === subject.ismS_Id ? { ...s, EMPS_MaxMarks: value } : s
                                                            )
                                                        );
                                                    }}
                                                    className='h-8 text-sm'
                                                />
                                            </td>
                                            <td className='p-3'>
                                                <Input
                                                    type='number'
                                                    value={subject.EMPS_MinMarks || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value ? Number.parseFloat(e.target.value) : null;
                                                        if (value && subject.EMPS_MaxMarks && value > subject.EMPS_MaxMarks) {
                                                            toast.error('Min Marks cannot exceed Max Marks');
                                                            return;
                                                        }
                                                        setSubjects((prev) =>
                                                            prev.map((s) =>
                                                                s.ismS_Id === subject.ismS_Id ? { ...s, EMPS_MinMarks: value } : s
                                                            )
                                                        );
                                                    }}
                                                    className='h-8 text-sm'
                                                    disabled={!subject.EMPS_MaxMarks}
                                                />
                                            </td>
                                            <td className='p-3'>
                                                <Input
                                                    type='number'
                                                    value={subject.EMPS_ConvertForMarks || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value ? Number.parseFloat(e.target.value) : null;
                                                        if (value && value > 1000) {
                                                            toast.error('Converted Marks cannot exceed 1000');
                                                            return;
                                                        }
                                                        if (value && subject.EMPS_MinMarks && value < subject.EMPS_MinMarks) {
                                                            toast.error('Converted Marks cannot be less than Min Marks');
                                                            return;
                                                        }
                                                        setSubjects((prev) =>
                                                            prev.map((s) =>
                                                                s.ismS_Id === subject.ismS_Id ? { ...s, EMPS_ConvertForMarks: value } : s
                                                            )
                                                        );
                                                    }}
                                                    className='h-8 text-sm'
                                                    disabled={!subject.EMPS_MaxMarks}
                                                />
                                            </td>
                                            <td className='p-3 text-center'>
                                                <Checkbox
                                                    checked={subject.EMPS_AppToResultFlg}
                                                    onCheckedChange={(checked) => {
                                                        setSubjects((prev) =>
                                                            prev.map((s) =>
                                                                s.ismS_Id === subject.ismS_Id
                                                                    ? { ...s, EMPS_AppToResultFlg: checked as boolean }
                                                                    : s
                                                            )
                                                        );
                                                    }}
                                                />
                                            </td>
                                            <td className='p-3'>
                                                <Select
                                                    value={subject.EMGR_Id || '__none'}
                                                    onValueChange={(value) => {
                                                        setSubjects((prev) =>
                                                            prev.map((s) =>
                                                                s.ismS_Id === subject.ismS_Id
                                                                    ? { ...s, EMGR_Id: value === '__none' ? null : value }
                                                                    : s
                                                            )
                                                        );
                                                    }}>
                                                    <SelectTrigger className='h-8 text-sm'>
                                                        <SelectValue placeholder='--Select--' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value='__none'>--Select--</SelectItem>
                                                        {grades.map((grade) => (
                                                            <SelectItem key={grade.emgR_Id} value={grade.emgR_Id.toString()}>
                                                                {grade.emgR_GradeName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                            {(promotionType === 'M' || promotionType === 'P') && (
                                                <td className='p-3 text-center'>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() => openGroupModal(subject)}
                                                        title='View/Edit Groups'
                                                        className={hasGroups ? 'text-green-600 hover:text-green-800' : ''}>
                                                        <Eye className='h-4 w-4' />
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Apply Header Values Button */}
                        <div className='border-t p-3'>
                            <Button
                                onClick={applyHeaderValues}
                                variant='outline'
                                size='sm'
                                disabled={subjects.filter((s) => s.checkedvalue).length === 0}>
                                Apply Header Values to Selected Rows
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className='mb-6 rounded-lg border p-8 text-center text-gray-500'>
                        {promotionType === 'F' ? 'Table hidden for Final Exam mode' : 'Select Category to display subjects'}
                    </div>
                )}

                {/* ACTION BUTTONS */}
                <div className='flex justify-center space-x-4'>
                    <Button className={isDataSaving ? 'cursor-not-allowed' : ''} onClick={handleSave}>{isDataSaving ? 'Saving...' : 'Save'}</Button>
                    <Button onClick={handleReset} variant='outline'>
                        Cancel
                    </Button>
                </div>
            </CollapsibleSection>

            {/* MODALS */}
            {isGroupsOpen && activeSubject && (
                <ViewGroupsModal
                    subject={activeSubject}
                    exams={exams}
                    //existingGroups={activeSubject.pro_exams_group_list || []}
                    onClose={() => {
                        setIsGroupsOpen(false);
                        setActiveSubject(null);
                    }}
                    onSave={updateSubjectGroups}
                    onAddGroup={addGroupToSubject}
                    onOpenExams={openExamsModal}
                    promotionType={promotionType}
                />
            )}

            {isExamsOpen && activeGroup && activeSubject !== null && (
                <ViewExamsModal
                    group={activeGroup}
                    onClose={() => {
                        setIsExamsOpen(false);
                        setActiveGroup(null);
                    }}
                />
            )}
        </div>
    );
}



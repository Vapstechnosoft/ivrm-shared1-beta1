'use client';

import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import {
    addOrUpdateTermWiseRemarks,
    getDropdownTermNamesByIds,
    getStudentListForTermWiseRemarks
} from '@/server/exam/exam-module/marks-entry/exam-term-wise-remarks-entry';
import {
    getClassDropDownByAcademicYearlist,
    getSectionsDropDownByAcademicYearandClasslist
} from '@/server/exam/exam-module/reports/cumulative-report';
import type { IPromotionRemarksGrid } from '@/types/exam/exam-module/exam-mapping';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { PromotionRemarksColumns } from './_components/columns';

// Zod Schema for validation
const PromotionRemarksSchema = z.object({
    academicYear: z
        .number({
            required_error: 'Academic year is required',
            invalid_type_error: 'Academic year must be a number'
        })
        .positive('Please select a valid academic year'),
    class: z
        .number({
            required_error: 'Class is required',
            invalid_type_error: 'Class must be a number'
        })
        .positive('Please select a class'),
    section: z
        .number({
            required_error: 'Section is required',
            invalid_type_error: 'Section must be a number'
        })
        .positive('Please select a section'),
    term: z
        .number({
            invalid_type_error: 'Term must be a number'
        })
        .positive('Please select a term')
        .optional()
});

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
type FormData = z.infer<typeof PromotionRemarksSchema>;

const MI_ID = 30; // You might want to get this from user context or environment

/* -------------------------
   Main Component
   ------------------------- */
export default function PromotionRemarksPage() {
    return <PromotionRemarksContent />;
}

function PromotionRemarksContent() {
    // Tabs
    const [activeTab, setActiveTab] = useState<number>(0);

    // Dropdown data
    const { data: academicDropdownData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();
    const [academicYears, setAcademicYears] = useState<{ asmaY_Id: number; asmaY_Year: string }[]>([]);
    const [classes, setClasses] = useState<{ asmcL_Id: number; asmcL_ClassName: string }[]>([]);
    const [sections, setSections] = useState<{ asmS_Id: number; asmC_SectionName: string }[]>([]);
    const [terms, setTerms] = useState<{ ecT_Id: number; ecT_TermName: string }[]>([]);

    // Selected values
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | undefined>();
    const [selectedClass, setSelectedClass] = useState<number | undefined>();
    const [selectedSectionId, setSelectedSectionId] = useState<number | undefined>();
    const [selectedTerm, setSelectedTerm] = useState<number | undefined>();

    // Form errors
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [students, setStudents] = useState<IPromotionRemarksGrid[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<IPromotionRemarksGrid[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [preSelectedStudentIds, setPreSelectedStudentIds] = useState<string[]>([]);
    const [tableProps, setTableProps] = useState<ReturnType<typeof useDataTableProps> | null>(null);
    const [isStudentsGridOpen, setIsStudentsGridOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});

    // Loading flags
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingTerms, setLoadingTerms] = useState(false);
    const [filteredStudents, setFilteredStudents] = useState<IPromotionRemarksGrid[]>([]);

    const handleRowSelectionChange = useCallback((rows: IPromotionRemarksGrid[]) => {
        setSelectedStudents(rows);
    }, []);

    /* -------------------------
       Effect for search filtering
       ------------------------- */
    useEffect(() => {
        const filtered = students.filter(
            (s) =>
                s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || s.admNo.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStudents(filtered);

        // Auto-select students who have remarks
        const preSelected = filtered
            .map((s, index) => (s.remarks && s.remarks.trim() !== '' ? index.toString() : null))
            .filter((id): id is string => id !== null);

        setPreSelectedStudentIds(preSelected);

        setTableProps(
            useDataTableProps({
                data: filtered,
                total: filtered.length,
                pageIndex: 0,
                pageSize: 10
            })
        );
    }, [students, searchQuery]);

    /* -------------------------
       Load academic years
       ------------------------- */
    useEffect(() => {
        if (academicError) {
            toast.error('Failed to load academic years');
            return;
        }

        if (academicDropdownData?.data && Array.isArray(academicDropdownData.data)) {
            const yrs = academicDropdownData.data.map((y: any) => ({
                asmaY_Id: y.asmaY_Id,
                asmaY_Year: y.asmaY_Year
            }));
            setAcademicYears(yrs);
            if (yrs.length > 0 && !selectedAcademicYear) {
                setSelectedAcademicYear(yrs[0].asmaY_Id);
            }
        }
    }, [academicDropdownData, academicError, selectedAcademicYear]);

    /* -------------------------
       Load classes when academic year changes
       ------------------------- */
    useEffect(() => {
        if (!selectedAcademicYear) {
            setClasses([]);
            setSelectedClass(undefined);
            return;
        }

        (async () => {
            setLoadingClasses(true);
            try {
                const { data } = await getClassDropDownByAcademicYearlist(selectedAcademicYear);
                setClasses(Array.isArray(data) ? data : []);
                setSections([]);
                setSelectedSectionId(undefined);
                setTerms([]);
                setSelectedTerm(undefined);
                // Clear form errors when academic year changes
                setFormErrors((prev) => ({ ...prev, academicYear: '' }));
                // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            } catch (err) {
                toast.error('Failed to load classes');
            } finally {
                setLoadingClasses(false);
            }
        })();
    }, [selectedAcademicYear]);

    /* -------------------------
       Load sections when class changes
       ------------------------- */
    useEffect(() => {
        if (!selectedAcademicYear || !selectedClass) {
            setSections([]);
            setSelectedSectionId(undefined);
            return;
        }

        (async () => {
            setLoadingSections(true);
            try {
                const { data } = await getSectionsDropDownByAcademicYearandClasslist(selectedAcademicYear, selectedClass);
                setSections(Array.isArray(data) ? data : []);
                setSelectedSectionId(undefined);
                setTerms([]);
                setSelectedTerm(undefined);
                // Clear form errors when class changes
                setFormErrors((prev) => ({ ...prev, class: '' }));
                // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            } catch (err) {
                toast.error('Failed to load sections');
            } finally {
                setLoadingSections(false);
            }
        })();
    }, [selectedAcademicYear, selectedClass]);

    /* -------------------------
       Load terms when section changes (only for Individual Term Wise)
       ------------------------- */
    useEffect(() => {
        if (activeTab !== 0 || !selectedAcademicYear || !selectedClass || !selectedSectionId) {
            setTerms([]);
            setSelectedTerm(undefined);
            return;
        }

        (async () => {
            setLoadingTerms(true);
            try {
                const response = await getDropdownTermNamesByIds(selectedAcademicYear, selectedClass, selectedSectionId);

                if (response?.data && Array.isArray(response.data)) {
                    const termData = response.data.map((term: any) => ({
                        ecT_Id: term.ecT_Id,
                        ecT_TermName: term.ecT_TermName
                    }));
                    setTerms(termData);

                    if (termData.length > 0) {
                        setSelectedTerm(termData[0].ecT_Id);
                    } else {
                        toast.info('No terms found for selected class and section');
                    }
                } else {
                    toast.info('No terms available');
                    setTerms([]);
                }
            } catch (err) {
                console.error('Error loading terms:', err);
                toast.error('Failed to load terms');
                setTerms([]);
                setSelectedTerm(undefined);
            } finally {
                setLoadingTerms(false);
            }
        })();
    }, [activeTab, selectedAcademicYear, selectedClass, selectedSectionId]);

    /* -------------------------
       Handle search manually with validation
       ------------------------- */
    const handleSearch = async () => {
        // Clear previous errors
        setFormErrors({});

        // Basic validation
        if (selectedAcademicYear == null || selectedClass == null || selectedSectionId == null) {
            const newErrors: Record<string, string> = {};
            if (selectedAcademicYear == null) newErrors.academicYear = 'Academic year is required';
            if (selectedClass == null) newErrors.class = 'Class is required';
            if (selectedSectionId == null) newErrors.section = 'Section is required';
            setFormErrors(newErrors);
            toast.error('Please fill all required fields');
            return;
        }

        // For Individual Term Wise, term is required
        if (activeTab === 0 && selectedTerm == null) {
            setFormErrors((prev) => ({ ...prev, term: 'Term is required for Individual Term Wise' }));
            toast.error('Please select a term');
            return;
        }

        // Validate with Zod schema
        const validationData = {
            academicYear: selectedAcademicYear,
            class: selectedClass,
            section: selectedSectionId,
            term: selectedTerm
        };

        const result = PromotionRemarksSchema.safeParse(validationData);

        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                const path = err.path[0];
                if (typeof path === 'string') {
                    newErrors[path] = err.message;
                }
            });
            setFormErrors(newErrors);
            toast.error('Please fix validation errors');
            return;
        }

        // Proceed with search if validation passes
        setIsLoading(true);
        setIsStudentsGridOpen(true);

        try {
            const requestData = {
                asmaY_Id: selectedAcademicYear!,
                asmcL_Id: selectedClass!,
                asmS_Id: selectedSectionId!,
                ecT_Id: activeTab === 0 ? selectedTerm! : 0 // For overall, we can pass 0 or a special value
                // mI_Id: MI_ID
            };

            const response = await getStudentListForTermWiseRemarks(requestData);

            if (response?.data) {
                // Transform the API response to match IPromotionRemarksGrid
                const studentList: IPromotionRemarksGrid[] = response.data.map((student: any, index: number) => ({
                    slNo: index + 1,
                    admNo: student.admNo || student.amsT_AdmNo || '',
                    studentName: student.studentName || student.amsT_FirstName || '',
                    studentId: student.amsT_Id || 0,
                    remarks: student.ecterE_Remarks || '', // Ensure it's never undefined
                    estmP_Id: student.estmP_Id || 0,
                    ecT_Id: activeTab === 0 ? selectedTerm! : undefined
                }));

                console.log('studentList', studentList);
                setStudents(studentList);

                toast.success('Student data loaded successfully');
            } else {
                toast.error('No student data found');
            }
        } catch (err: any) {
            console.error('Error fetching students:', err);
            toast.error(err?.message || 'Failed to fetch students');
            setStudents([]);
        } finally {
            setIsLoading(false);
        }
    };

    /* -------------------------
       Update student remarks
       ------------------------- */
    const updateStudent = (id: number, remarks: string) => {
        setStudents((prev) => {
            const updated = prev.map((s) => (s.studentId === id ? { ...s, remarks: remarks } : s));
            return updated;
        });

        // Clear validation error if exists
        if (remarks && remarks.trim() !== '') {
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    /* -------------------------
       Save remarks
       ------------------------- */
    const handleSave = async () => {
        if (selectedAcademicYear == null || selectedClass == null || selectedSectionId == null) {
            toast.error('Please select all required fields');
            return;
        }

        if (activeTab === 0 && selectedTerm == null) {
            toast.error('Please select a term for Individual Term Wise');
            return;
        }

        // Validate selected students have remarks
        const currentValidationErrors: Record<number, string> = {};
        const selectedIds = new Set(selectedStudents.map((s) => s.studentId));

        // Check current main 'students' state for latest remarks using selectedIds
        students.forEach((student) => {
            if (selectedIds.has(student.studentId)) {
                if (!student.remarks || student.remarks.trim() === '') {
                    currentValidationErrors[student.studentId] = 'Please select remarks';
                }
            }
        });

        if (Object.keys(currentValidationErrors).length > 0) {
            setValidationErrors(currentValidationErrors);
            toast.error('Please select remarks for all selected students');
            return;
        }

        // Get only valid students to save
        const studentsToSave = students.filter((s) => selectedIds.has(s.studentId) && s.remarks && s.remarks.trim() !== '');

        if (studentsToSave.length === 0) {
            toast.error('No valid students to save');
            return;
        }

        // Clear errors if valid
        setValidationErrors({});

        setIsSaving(true);

        try {
            const saveData = {
                // mI_Id: MI_ID,
                asmcL_Id: selectedClass,
                asmaY_Id: selectedAcademicYear,
                asmS_Id: selectedSectionId,
                indiorfinal: activeTab === 0 ? 'I' : 'F',
                ecT_Id: activeTab === 0 ? selectedTerm! : 0,
                studentTerm_Remarks: studentsToSave.map((student) => ({
                    amsT_Id: student.studentId,
                    ecterE_Remarks: student.remarks || '' // Ensure it's always a string
                }))
            };
            console.info('payload saveData', saveData);
            const response = await addOrUpdateTermWiseRemarks(saveData);

            if (response.success) {
                toast.success('Remarks saved successfully');
                await handleSearch();
            } else {
                toast.error(response.message || 'Failed to save remarks');
            }
        } catch (err: any) {
            console.error('Error saving remarks:', err);
            toast.error(err?.message || 'Failed to save remarks');
        } finally {
            setIsSaving(false);
        }
    };

    /* -------------------------
       Clear errors when field changes
       ------------------------- */
    const handleAcademicYearChange = (value: string) => {
        const numValue = value !== 'none' ? Number(value) : undefined;
        setSelectedAcademicYear(numValue);
        setClasses([]);
        setSelectedClass(undefined);
        setSections([]);
        setSelectedSectionId(undefined);
        setTerms([]);
        setSelectedTerm(undefined);
        setStudents([]);
        setIsStudentsGridOpen(false);
        setFormErrors((prev) => ({ ...prev, academicYear: '' }));
    };

    const handleClassChange = (value: string) => {
        const numValue = value !== 'none' ? Number(value) : undefined;
        setSelectedClass(numValue);
        setSections([]);
        setSelectedSectionId(undefined);
        setTerms([]);
        setSelectedTerm(undefined);
        setStudents([]);
        setIsStudentsGridOpen(false);
        setFormErrors((prev) => ({ ...prev, class: '' }));
    };

    const handleSectionChange = (value: string) => {
        const numValue = value !== 'none' ? Number(value) : undefined;
        setSelectedSectionId(numValue);
        setTerms([]);
        setSelectedTerm(undefined);
        setStudents([]);
        setIsStudentsGridOpen(false);
        setFormErrors((prev) => ({ ...prev, section: '' }));
    };

    const handleTermChange = (value: string) => {
        const numValue = value !== 'none' && value !== 'disabled' ? Number(value) : undefined;
        setSelectedTerm(numValue);
        setStudents([]);
        setIsStudentsGridOpen(false);
        setFormErrors((prev) => ({ ...prev, term: '' }));
    };

    const columns = PromotionRemarksColumns(updateStudent, validationErrors);

    /* -------------------------
       Render
       ------------------------- */
    return (
        <div className='min-h-screen bg-gray-50 p-4'>
            <div className='container mx-auto space-y-4'>
                {/* Tabs */}
                <div className='flex items-center justify-center'>
                    <div className='mb-4 flex w-max gap-2 rounded-full bg-gray-200 p-1'>
                        <button
                            type='button'
                            className={`rounded-full px-6 py-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 0 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}
                            onClick={() => {
                                setActiveTab(0);
                                setSelectedTerm(undefined);
                                setTerms([]);
                                setStudents([]);
                                setFormErrors((prev) => ({ ...prev, term: '' }));
                                setIsStudentsGridOpen(false);
                            }}>
                            Individual Term Wise
                        </button>
                        <button
                            type='button'
                            className={`rounded-full px-6 py-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}
                            onClick={() => {
                                setActiveTab(1);
                                setSelectedTerm(undefined);
                                setTerms([]);
                                setStudents([]);
                                setFormErrors((prev) => ({ ...prev, term: '' }));
                                setIsStudentsGridOpen(false);
                            }}>
                            Overall Term Wise
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className='rounded-md border bg-white p-4 shadow-sm'>
                    <div className='grid grid-cols-1 items-end gap-4 md:grid-cols-4'>
                        {/* Academic Year */}
                        <div>
                            <label htmlFor='academic-year-trigger' className='mb-1 block font-medium text-slate-700 text-sm'>
                                Academic Year <span className='text-red-500'>*</span>
                            </label>
                            <Select
                                value={selectedAcademicYear ? String(selectedAcademicYear) : ''}
                                onValueChange={handleAcademicYearChange}>
                                <SelectTrigger className='h-10' id='academic-year-trigger'>
                                    <SelectValue placeholder={loadingAcademic ? 'loading.....' : 'Select Academic Year'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {loadingAcademic
                                        ? [
                                              <SelectItem value='loading' key='loading'>
                                                  loading.....
                                              </SelectItem>
                                          ]
                                        : academicYears.length === 0
                                          ? [
                                                <SelectItem value='none' key='empty'>
                                                    -- No academic years --
                                                </SelectItem>
                                            ]
                                          : academicYears.map((y) => (
                                                <SelectItem key={y.asmaY_Id} value={String(y.asmaY_Id)}>
                                                    {y.asmaY_Year}
                                                </SelectItem>
                                            ))}
                                </SelectContent>
                            </Select>
                            {formErrors.academicYear && <p className='mt-1 text-red-500 text-sm'>{formErrors.academicYear}</p>}
                        </div>

                        {/* Class */}
                        <div>
                            <label htmlFor='class-select-trigger' className='mb-1 block font-medium text-slate-700 text-sm'>
                                Class <span className='text-red-500'>*</span>
                            </label>
                            <Select
                                value={selectedClass ? String(selectedClass) : ''}
                                onValueChange={handleClassChange}
                                disabled={!selectedAcademicYear || loadingClasses}>
                                <SelectTrigger className='h-10' id='class-select-trigger'>
                                    <SelectValue placeholder={loadingClasses ? 'loading.....' : 'Select Class'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {!selectedAcademicYear
                                        ? [
                                              <SelectItem value='none' key='empty'>
                                                  -- Select Academic Year first --
                                              </SelectItem>
                                          ]
                                        : loadingClasses
                                          ? [
                                                <SelectItem value='loading' key='loading'>
                                                    loading.....
                                                </SelectItem>
                                            ]
                                          : classes.length === 0
                                            ? [
                                                  <SelectItem value='none' key='empty'>
                                                      -- No classes --
                                                  </SelectItem>
                                              ]
                                            : classes.map((c) => (
                                                  <SelectItem key={c.asmcL_Id} value={String(c.asmcL_Id)}>
                                                      {c.asmcL_ClassName}
                                                  </SelectItem>
                                              ))}
                                </SelectContent>
                            </Select>
                            {formErrors.class && <p className='mt-1 text-red-500 text-sm'>{formErrors.class}</p>}
                        </div>

                        {/* Section */}
                        <div>
                            <label htmlFor='section-select-trigger' className='mb-1 block font-medium text-slate-700 text-sm'>
                                Section <span className='text-red-500'>*</span>
                            </label>
                            <Select
                                value={selectedSectionId ? String(selectedSectionId) : ''}
                                onValueChange={handleSectionChange}
                                disabled={!selectedClass || loadingSections}>
                                <SelectTrigger className='h-10' id='section-select-trigger'>
                                    <SelectValue placeholder={loadingSections ? 'loading.....' : 'Select Section'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {loadingSections
                                        ? [
                                              <SelectItem value='loading' key='loading'>
                                                  loading.....
                                              </SelectItem>
                                          ]
                                        : sections.length === 0
                                          ? [
                                                <SelectItem value='none' key='empty'>
                                                    -- No sections --
                                                </SelectItem>
                                            ]
                                          : sections.map((s) => (
                                                <SelectItem key={s.asmS_Id} value={String(s.asmS_Id)}>
                                                    {s.asmC_SectionName}
                                                </SelectItem>
                                            ))}
                                </SelectContent>
                            </Select>
                            {formErrors.section && <p className='mt-1 text-red-500 text-sm'>{formErrors.section}</p>}
                        </div>

                        {/* Term */}
                        <div>
                            <label htmlFor='term-select-trigger' className='mb-1 block font-medium text-slate-700 text-sm'>
                                Term <span className='text-red-500'>*</span>
                            </label>
                            <Select
                                value={selectedTerm ? String(selectedTerm) : ''}
                                onValueChange={handleTermChange}
                                disabled={activeTab === 1 || loadingTerms}>
                                <SelectTrigger className='h-10' id='term-select-trigger'>
                                    <SelectValue
                                        placeholder={
                                            activeTab === 1 ? '-- Disabled for Overall --' : loadingTerms ? 'loading.....' : 'Select Term'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {activeTab === 1
                                        ? [
                                              <SelectItem value='disabled' key='disabled'>
                                                  -- Disabled for Overall --
                                              </SelectItem>
                                          ]
                                        : loadingTerms
                                          ? [
                                                <SelectItem value='loading' key='loading'>
                                                    loading.....
                                                </SelectItem>
                                            ]
                                          : terms.length === 0
                                            ? [
                                                  <SelectItem value='none' key='empty'>
                                                      -- No terms --
                                                  </SelectItem>
                                              ]
                                            : terms.map((t) => (
                                                  <SelectItem key={t.ecT_Id} value={String(t.ecT_Id)}>
                                                      {t.ecT_TermName}
                                                  </SelectItem>
                                              ))}
                                </SelectContent>
                            </Select>
                            {formErrors.term && <p className='mt-1 text-red-500 text-sm'>{formErrors.term}</p>}
                        </div>
                    </div>

                    <div className='mx-auto mt-6 flex w-fit gap-4'>
                        <Button type='button' className='px-6 py-2 shadow' onClick={handleSearch}>
                            SEARCH
                        </Button>

                        {isStudentsGridOpen && students.length > 0 && (
                            <Button
                                type='button'
                                className='bg-green-600 px-6 py-2 shadow hover:bg-green-700'
                                onClick={handleSave}
                                disabled={isSaving}>
                                {isSaving ? 'SAVING...' : 'SAVE REMARKS'}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Students Grid */}
                {isStudentsGridOpen && tableProps && (
                    <CollapsibleSection
                        defaultOpen
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <div className='mb-4 flex justify-end px-4 pt-4'>
                            <div className='relative w-full max-w-sm'>
                                <Search className='absolute top-2.5 left-3 h-4 w-4 text-slate-400' />
                                <Input
                                    placeholder='Search by Student Name or Admission No...'
                                    className='pl-9'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <GenericDataTable<IPromotionRemarksGrid>
                            {...tableProps}
                            columns={columns}
                            isLoading={isLoading}
                            defaultSelectedRowIds={preSelectedStudentIds}
                            onRowSelectionChange={handleRowSelectionChange}
                            columnPinning={{ right: ['actions'] }}
                            loadingMessage='Loading remarks...'
                            noDataTitle='No Records Found'
                            noDataDescription='Click SEARCH to view remarks'
                            errorTitle='Error Loading Remarks'
                        />
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}

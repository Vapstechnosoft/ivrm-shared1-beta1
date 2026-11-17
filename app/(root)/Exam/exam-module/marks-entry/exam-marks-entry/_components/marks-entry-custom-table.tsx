'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { GetExamMarksEntryOnSearch, addOrUpdateStudentMarks } from '@/server/exam/exam-module/marks-entry/exam-marks-entry';
import { Loader2, RotateCcw, Save } from 'lucide-react';
import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

/* ============================================
   Types
   ============================================ */
interface SubSubjectData {
    emsS_Id: number;
    emsS_SubSubjectName: string;
    eycessS_MaxMarks: number;
    eycessS_MinMarks?: number;
    eycessS_MarksEntryMax: number;
}

interface SubExamData {
    emsE_Id: number;
    emsE_SubExamName: string;
    eycessE_MaxMarks: number;
    eycessE_MinMarks?: number;
    eycessE_MarksEntryMax: number;
}

interface StudentMarksEntry {
    amsT_Id: number;
    amsT_FirstName: string;
    amsT_AdmNo: string;
    amsT_RegistrationNo: string;
    amaY_RollNo: number;
    ismS_Id: number;
    ismS_SubjectName: string;
    eyceS_MaxMarks: number;
    eyceS_MinMarks: number;
    eyceS_MarksEntryMax: number;
    estM_Marks?: number;
    estM_Grade?: string;
    estM_Flg?: string;
    estM_Id?: number;
    estmanssH_AnswerSheet?: string | null;
    estmanssH_FileLocation?: string | null;
    selected?: boolean;
    ESTM_Marks?: string | number;
    ESTMSS_Marks?: { [key: number]: string } | { [key: number]: { [key: number]: string } }; // For sub-subject or sub-exam marks
    papertype?: string;
    papertypeid?: number;
    estM_Flg_new?: string;
    estM_Grade_new?: string;
    estM_Marks_new?: number;
}

interface Configuration {
    exmConfig_RegnoColumnDisplay: boolean;
    exmConfig_AdmnoColumnDisplay: boolean;
    exmConfig_RollnoColumnDisplay: boolean;
    exmConfig_Recordsearchtype: 'Name' | 'AdmNo' | 'RollNo' | 'RegNo';
}

interface SavedMarksEntry {
    estmsS_Id?: number;
    AMST_Id: number;
    ISMS_Id: number;
    EMSS_Id?: number;
    EMSE_Id?: number;
    ESTM_MarksGradeFlg: string;
    ESTM_ID: number;
    ESTM_Marks?: number;
    ESTM_Grade?: string | null;
    ESTM_Flg?: string | null;
    ESTMSS_Marks?: number;
    ESTMSS_Grade?: string | null;
    ESTMSS_Flg?: string | null;
    estmsS_ActiveFlg?: boolean;
}

interface SubjectMeta {
    subjectId: number;
    subjectName: string;
    subsubFlag: boolean;
    subexamFlag: boolean;
    maxMarks: number;
    minMarks: number;
    marksEntryMax: number;
    marksGradeEntryFlg: 'M' | 'G';
    subsubData: Array<{
        subsubId: number;
        subsubName: string;
        maxMarks: number;
        minMarks?: number;
        marksEntryMax: number;
    }>;
    subexamData: Array<{
        subexamId: number;
        subexamName: string;
        maxMarks: number;
        minMarks?: number;
        marksEntryMax: number;
    }>;
    saved_sub_subjectOrExam_list: SavedMarksEntry[];
    saved_sub_subject_list: SavedMarksEntry[];
}

interface MarksCustomTableProps {
    ASMAY_Id: number | null;
    ASMCL_Id: number | null;
    ASMS_Id: number | null;
    EME_Id: number | null;
    ISMS_Id: number | null;
    onSave?: (data: any) => Promise<void>;
    onClose: () => void;
    userPrivileges?: any;
}

/* ============================================
   Table Cell Components
   ============================================ */
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children?: React.ReactNode;
}

const TableCell = ({ className, children, ...props }: TableCellProps) => {
    const isCheckbox = React.isValidElement(children) && (children.type as any)?.displayName === 'Checkbox';

    return (
        <td
            className={`whitespace-nowrap p-2 align-middle text-[#0C0A09] text-[14px] ${isCheckbox ? 'pr-0' : ''} ${className || ''}`}
            {...props}>
            {isCheckbox ? <Checkbox {...(children as any).props} /> : children}
        </td>
    );
};

const TableHeaderCell = ({ className, children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className={`whitespace-nowrap bg-[#7C3AED] p-2 text-center align-middle text-white ${className || ''}`} {...props}>
        {children}
    </th>
);

/* ============================================
   MarksInputCell with Validation and Arrow Navigation
   ============================================ */
interface MarksInputCellProps {
    value: number | '' | string | undefined;
    max: number;
    min?: number;
    onChange: (v: number | '' | string) => void;
    placeholder?: string;
    marksGradeEntryFlg: 'M' | 'G';
    gradeDetails: string[];
    papertypeid?: number;
    papertypeGradeDetails?: Array<{ empatY_Id: number; emgD_Name: string }>;
    onArrow?: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

const MarksInputCell = React.forwardRef<HTMLInputElement, MarksInputCellProps>(
    ({ value, max, min, onChange, placeholder, marksGradeEntryFlg, gradeDetails, papertypeid, papertypeGradeDetails, onArrow }, ref) => {
        const [local, setLocal] = useState<string>(value === '' || value === undefined ? '' : String(value));
        const [error, setError] = useState<string>('');

        useEffect(() => {
            setLocal(value === '' || value === undefined ? '' : String(value));
            setError('');
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value;
            setLocal(raw);

            // Allow empty
            if (raw.trim() === '') {
                setError('');
                onChange('');
                return;
            }

            if (marksGradeEntryFlg === 'G') {
                // Grade validation
                const grade = raw.trim().toUpperCase();
                const validFlags = ['AB', 'L', 'M', 'OD'];

                // Check for valid flags
                if (validFlags.includes(grade)) {
                    setError('');
                    onChange(grade);
                    return;
                }

                // Check against grade details
                let isValidGrade = false;

                // First check paper type specific grades
                if (papertypeid && papertypeGradeDetails) {
                    isValidGrade = papertypeGradeDetails.some((gradeDetail) => gradeDetail.emgD_Name.toUpperCase() === grade);
                }

                // If not found in paper type grades, check general grades
                if (!isValidGrade && gradeDetails.length > 0) {
                    isValidGrade = gradeDetails.some((g) => g.toUpperCase() === grade);
                }

                if (!isValidGrade) {
                    const errorMsg = 'Entered Grade cant be out of master setting...!';
                    setError(errorMsg);
                    onChange('');
                    return;
                }

                setError('');
                onChange(grade);
            } else {
                // Marks validation
                if (raw.match(/[a-z]/i)) {
                    // Check for valid flags in marks mode
                    const flag = raw.trim().toUpperCase();
                    const validFlags = ['AB', 'L', 'M', 'OD'];

                    if (validFlags.includes(flag)) {
                        setError('');
                        onChange(flag);
                        return;
                    }

                    const errorMsg = 'Entered value cant be out of master setting...!';
                    setError(errorMsg);
                    onChange('');
                    return;
                }

                // Numeric validation
                if (!/^\d*\.?\d*$/.test(raw.trim())) {
                    const errorMsg = 'Only numbers and decimal point allowed';
                    setError(errorMsg);
                    return;
                }

                const num = Number.parseFloat(raw.trim());

                if (Number.isNaN(num)) {
                    setError('');
                    onChange('');
                    return;
                }

                if (num < 0) {
                    const errorMsg = 'Entered marks cant be in negative values...!';
                    setError(errorMsg);
                    return;
                }

                if (num > max) {
                    const errorMsg = `Entered marks cant exceed ${max}`;
                    setError(errorMsg);
                    return;
                }

                setError('');
                onChange(num.toString());
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!onArrow) return;

            switch (e.key) {
                case 'ArrowRight':
                    onArrow('right');
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    onArrow('left');
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    onArrow('down');
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    onArrow('up');
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        };

        return (
            <div className='flex flex-col items-start'>
                <Input
                    ref={ref}
                    className={`w-[120px] rounded border px-2 py-1 text-sm ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
                    placeholder={placeholder}
                    value={local}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    style={{
                        fontSize: '14px'
                    }}
                />
                {error ? <div className='mt-[2px] text-[11px] text-red-600 leading-none'>{error}</div> : null}
            </div>
        );
    }
);

MarksInputCell.displayName = 'MarksInputCell';

/* ============================================
   Main Component
   ============================================ */
export function MarksCustomTable({ ASMAY_Id, ASMCL_Id, ASMS_Id, EME_Id, ISMS_Id, onSave, onClose, userPrivileges }: MarksCustomTableProps) {
    // State
    const [isLoading, setIsLoading] = useState(false);
    const [isStudentsGridOpen, setIsStudentsGridOpen] = useState(false);
    const [students, setStudents] = useState<StudentMarksEntry[]>([]);
    const [subjectMeta, setSubjectMeta] = useState<SubjectMeta | null>(null);
    const [config, setConfig] = useState<Configuration | null>(null);
    const [marksDeleteFlag, setMarksDeleteFlag] = useState(false);
    const [lastDateEntryFlag, setLastDateEntryFlag] = useState(true);
    const [lastDateExamFlag, setLastDateExamFlag] = useState(true);
    const [tempSubsMarksList, setTempSubsMarksList] = useState<SavedMarksEntry[]>([]);
    const [allSelected, setAllSelected] = useState(false);
    const [gradeDetails, setGradeDetails] = useState<string[]>([]);
    const [paperTypeGradeDetails, setPaperTypeGradeDetails] = useState<any[]>([]);
    const [subSubjectGradeDetails, setSubSubjectGradeDetails] = useState<any[]>([]);
    const [subExamGradeDetails, setSubExamGradeDetails] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);

    // Ref for input navigation
    const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

    const handleSearch = useCallback(async () => {
        if (!ASMS_Id || !ASMCL_Id || !ASMAY_Id || !EME_Id || !ISMS_Id) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await GetExamMarksEntryOnSearch({
                ASMS_Id: ASMS_Id,
                ASMCL_Id: ASMCL_Id,
                ASMAY_Id: ASMAY_Id,
                EME_Id: EME_Id,
                ISMS_Id: ISMS_Id
            });
            const data = Array.isArray(response.data) ? response.data[0] : response.data;
            console.log('Search response **', data);

            if (data === null) {
                toast.error('This Subject Is Not Mapped With Students');
                setIsStudentsGridOpen(false);
                setIsLoading(false);
                return;
            }

            if (data.eyceS_SubSubjectFlg && data.subject_subsubjects.length === 0) {
                setShowInfoDialog(true);
                return;
            }
            // Check for date restrictions
            // if (!data.lastDateExamFlag) {
            //     setIsStudentsGridOpen(false);
            //     toast.error(`From ${new Date(data.marksEntryStateDate || '').toLocaleDateString()} You Can Start Enter The Marks`);
            //     setIsLoading(false);
            //     return;
            // }

            // if (!data.lastDateEntryFlag) {
            //     toast.error('Marks Entry Last Date Completed You Can Not Enter Marks');
            //     setIsStudentsGridOpen(false);
            //     setIsLoading(false);
            //     return;
            // }

            if (!data.studentList || data.studentList.length === 0) {
                toast.error('This Subject Is Not Mapped With Students');
                setIsStudentsGridOpen(false);
                setIsLoading(false);
                return;
            }

            // Set configuration
            if (data.configuration && data.configuration.length > 0) {
                setConfig(data.configuration[0]);
            }

            // Set flags
            setMarksDeleteFlag(data.marksdeleteflag);
            setLastDateEntryFlag(data.lastDateEntryFlag);
            setLastDateExamFlag(data.lastDateExamFlag);

            // Set grade details
            setGradeDetails(data.grade_details || []);
            setPaperTypeGradeDetails(data.get_papertype_grade_details || []);
            setSubSubjectGradeDetails(data.subsubject_gradedetails || []);
            setSubExamGradeDetails(data.subexam_gradedetails || []);

            // Process student list
            let processedStudents = data.studentList.map((student: StudentMarksEntry) => ({
                ...student,
                selected: false,
                ESTM_Marks: '',
                ESTMSS_Marks: {} // Initialize empty object for sub-subject/sub-exam marks
            }));

            // Add paper type info if available
            if (data.get_student_wise_papertype_list) {
                processedStudents = processedStudents.map((student: StudentMarksEntry) => {
                    const paperType = data.get_student_wise_papertype_list!.find((pt: any) => pt.amsT_Id === student.amsT_Id);
                    return {
                        ...student,
                        papertype: paperType?.empatY_PaperTypeName,
                        papertypeid: paperType?.empatY_Id
                    };
                });
            }

            // Set subject meta FIRST (we need it for mapping)
            const subjectData = data.subject_details[0];
            const newSubjectMeta = {
                subjectId: subjectData.ismS_Id,
                subjectName: processedStudents[0]?.ismS_SubjectName || '',
                subsubFlag: data.eyceS_SubSubjectFlg,
                subexamFlag: data.eyceS_SubExamFlg,
                maxMarks: subjectData.eyceS_MaxMarks,
                minMarks: subjectData.eyceS_MinMarks,
                marksEntryMax: subjectData.eyceS_MarksEntryMax,
                marksGradeEntryFlg: data.eyceS_MarksGradeEntryFlg,
                subsubData:
                    data.subject_subsubjects?.map((ss: SubSubjectData) => ({
                        subsubId: ss.emsS_Id,
                        subsubName: ss.emsS_SubSubjectName,
                        maxMarks: ss.eycessS_MaxMarks,
                        minMarks: ss.eycessS_MinMarks,
                        marksEntryMax: ss.eycessS_MarksEntryMax
                    })) || [],
                subexamData:
                    data.subject_subexams?.map((se: SubExamData) => ({
                        subexamId: se.emsE_Id,
                        subexamName: se.emsE_SubExamName,
                        maxMarks: se.eycessE_MaxMarks,
                        minMarks: se.eycessE_MinMarks,
                        marksEntryMax: se.eycessE_MarksEntryMax
                    })) || [],
                saved_sub_subjectOrExam_list:
                    data.saved_sub_subjectOrExam_list?.map((s: any) => ({
                        estmsS_Id: s.estmsS_Id,

                        AMST_Id: s.estM_Id, // Exam/Test Master Id
                        ISMS_Id: s.emsS_Id, // Sub-subject / subject mapping
                        EMSS_Id: s.emsS_Id ?? undefined,
                        EMSE_Id: s.emsE_Id ?? undefined,
                        ESTM_ID: s.estM_Id,
                        ESTM_MarksGradeFlg: s.estmsS_MarksGradeFlg,

                        ESTM_Marks: s.estmsS_Marks ?? undefined,
                        ESTM_Grade: s.estmsS_Grade || null,
                        ESTM_Flg: s.estmsS_Flg || null,

                        ESTMSS_Marks: s.estmsS_Marks ?? undefined,
                        ESTMSS_Grade: s.estmsS_Grade || null,
                        ESTMSS_Flg: s.estmsS_Flg || null,

                        estmsS_ActiveFlg: s.estmsS_ActiveFlg ?? true
                    })) || [],
                saved_sub_subject_list: data.saved_sub_subject_list?.map((s: any) => ({
                    estmsS_Id: s.estmsS_Id,

                    AMST_Id: s.estM_Id, // Exam/Test Master Id
                    ISMS_Id: s.emsS_Id, // Sub-subject / subject mapping
                    EMSS_Id: s.emsS_Id ?? undefined,
                    EMSE_Id: s.emsE_Id ?? undefined,
                    ESTM_ID: s.estM_Id,
                    ESTM_MarksGradeFlg: s.estmsS_MarksGradeFlg,

                    ESTM_Marks: s.estmsS_Marks ?? undefined,
                    ESTM_Grade: s.estmsS_Grade || null,
                    ESTM_Flg: s.estmsS_Flg || null,

                    ESTMSS_Marks: s.estmsS_Marks ?? undefined,
                    ESTMSS_Grade: s.estmsS_Grade || null,
                    ESTMSS_Flg: s.estmsS_Flg || null,

                    estmsS_ActiveFlg: s.estmsS_ActiveFlg ?? true
                }))
            };

            setSubjectMeta(newSubjectMeta);

            // Clear existing temp marks list
            setTempSubsMarksList([]);

            // Map saved marks if available
            if (data.saved_studentList && data.saved_studentList.length > 0) {
                if (!newSubjectMeta.subsubFlag && !newSubjectMeta.subexamFlag) {
                    // Simple subject case
                    processedStudents = mapMarksSimple(processedStudents, data.saved_studentList, data.answer_sheet, newSubjectMeta);
                } else if (newSubjectMeta.subsubFlag && !newSubjectMeta.subexamFlag) {
                    // Sub-subject case
                    if (data.saved_ss_list && data.saved_ss_list.length > 0) {
                        processedStudents = mapMarksSS(processedStudents, data.saved_ss_list, newSubjectMeta);
                    }
                } else if (newSubjectMeta.subexamFlag && !newSubjectMeta.subsubFlag) {
                    // Sub-exam case
                    if (data.saved_se_list && data.saved_se_list.length > 0) {
                        processedStudents = mapMarksSE(processedStudents, data.saved_se_list, newSubjectMeta);
                    }
                }
            }

            setStudents(processedStudents);
            setIsStudentsGridOpen(true);
            toast.info('Data loaded successfully');
        } catch (error: any) {
            console.error('Search error:', error);
            toast.error(error?.message || 'Failed to fetch data');
            setIsStudentsGridOpen(false);
        } finally {
            setIsLoading(false);
        }
    }, [ASMAY_Id, ASMCL_Id, ASMS_Id, EME_Id, ISMS_Id]);

    const isFirstLoad = useRef(true);

    /* Close page only on parameter change (not first load) */
    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false; // skip first render
            return;
        }

        onClose?.(); // close on subsequent param changes
    }, [ASMAY_Id, ASMCL_Id, ASMS_Id, EME_Id, ISMS_Id]);

    /* Run search whenever parameters change */
    useEffect(() => {
        handleSearch();
    }, [handleSearch]);

    /* ============================================
       Mapping Functions
       ============================================ */
    const mapMarksSimple = (
        students: StudentMarksEntry[],
        savedStudents: StudentMarksEntry[],
        answerSheets?: any[],
        subjectMeta?: SubjectMeta
    ): StudentMarksEntry[] => {
        return students.map((student) => {
            const saved = savedStudents.find((s) => s.amsT_Id === student.amsT_Id);
            if (saved) {
                let marksValue = '';

                if (subjectMeta?.marksGradeEntryFlg === 'M') {
                    if (saved.estM_Flg && saved.estM_Flg.trim() !== '') {
                        marksValue = saved.estM_Flg;
                    } else if (saved.estM_Marks !== undefined && saved.estM_Marks !== null) {
                        marksValue = String(saved.estM_Marks);
                    }
                } else if (subjectMeta?.marksGradeEntryFlg === 'G') {
                    if (saved.estM_Flg && saved.estM_Flg.trim() !== '') {
                        marksValue = saved.estM_Flg;
                    } else if (saved.estM_Grade) {
                        marksValue = saved.estM_Grade;
                    }
                }

                // Add answer sheet info
                if (answerSheets) {
                    const answerSheet = answerSheets.find((as) => as.estM_Id === saved.estM_Id);
                    if (answerSheet) {
                        student.estmanssH_FileLocation = answerSheet.estmanssH_FileLocation;
                    }
                }

                // Update temp marks list
                setTempSubsMarksList((prev) => {
                    const existingIndex = prev.findIndex((item) => item.AMST_Id === student.amsT_Id && item.ISMS_Id === student.ismS_Id);

                    const newEntry: SavedMarksEntry = {
                        AMST_Id: student.amsT_Id,
                        ISMS_Id: student.ismS_Id,
                        ESTM_ID: saved.estM_Id ?? student.estM_Id ?? 0,
                        ESTM_MarksGradeFlg: subjectMeta?.marksGradeEntryFlg ?? 'M',
                        ESTM_Marks: saved.estM_Marks || Number(student.ESTM_Marks ?? ''),
                        ESTM_Grade: saved.estM_Grade || student.estM_Grade,
                        ESTM_Flg: saved.estM_Flg || student.estM_Flg
                    };

                    if (existingIndex >= 0) {
                        const updated = [...prev];
                        updated[existingIndex] = newEntry;
                        return updated;
                    } else {
                        return [...prev, newEntry];
                    }
                });

                return {
                    ...student,
                    selected: true,
                    ESTM_Marks: marksValue,
                    estM_Marks_new: saved.estM_Marks,
                    estM_Grade_new: saved.estM_Grade,
                    estM_Flg_new: saved.estM_Flg
                };
            }
            return student;
        });
    };

    const mapMarksSS = (students: StudentMarksEntry[], savedSSList: any[], subjectMeta: SubjectMeta): StudentMarksEntry[] => {
        const updatedStudents = [...students];
        const updatedTempMarks: SavedMarksEntry[] = [];

        students.forEach((student, studentIndex) => {
            const studentSSMarks = savedSSList.filter((ss) => ss.AMST_Id === student.amsT_Id);

            if (studentSSMarks.length > 0) {
                updatedStudents[studentIndex] = {
                    ...student,
                    selected: true,
                    ESTMSS_Marks: {}
                };

                // Initialize ESTMSS_Marks object
                const estmssMarks: { [key: number]: string } = {};

                studentSSMarks.forEach((ssMark) => {
                    let markValue = '';
                    if (subjectMeta.marksGradeEntryFlg === 'M') {
                        if (ssMark.ESTMSS_Flg && ssMark.ESTMSS_Flg.trim() !== '') {
                            markValue = ssMark.ESTMSS_Flg;
                        } else if (ssMark.ESTMSS_Marks !== undefined && ssMark.ESTMSS_Marks !== null) {
                            markValue = String(ssMark.ESTMSS_Marks);
                        }
                    } else if (subjectMeta.marksGradeEntryFlg === 'G') {
                        if (ssMark.ESTMSS_Flg && ssMark.ESTMSS_Flg.trim() !== '') {
                            markValue = ssMark.ESTMSS_Flg;
                        } else if (ssMark.ESTMSS_Grade) {
                            markValue = ssMark.ESTMSS_Grade;
                        }
                    }

                    estmssMarks[ssMark.EMSS_Id] = markValue;

                    // Add to temp marks list
                    updatedTempMarks.push({
                        AMST_Id: student.amsT_Id,
                        ISMS_Id: student.ismS_Id,
                        EMSS_Id: ssMark.EMSS_Id,
                        ESTM_ID: student.estM_Id ?? 0,
                        ESTM_MarksGradeFlg: subjectMeta.marksGradeEntryFlg,
                        ESTMSS_Marks: ssMark.ESTMSS_Marks || 0,
                        ESTMSS_Grade: ssMark.ESTMSS_Grade || '',
                        ESTMSS_Flg: ssMark.ESTMSS_Flg || ''
                    });
                });

                updatedStudents[studentIndex].ESTMSS_Marks = estmssMarks;

                // Calculate total marks
                const totalMarks = calculateTotalMarksForStudent(updatedStudents[studentIndex], subjectMeta);
                updatedStudents[studentIndex].ESTM_Marks = totalMarks.toString();
                updatedStudents[studentIndex].estM_Marks_new = totalMarks;
            }
        });

        // Update temp marks list
        setTempSubsMarksList(updatedTempMarks);

        return updatedStudents;
    };

    const mapMarksSE = (students: StudentMarksEntry[], savedSEList: any[], subjectMeta: SubjectMeta): StudentMarksEntry[] => {
        const updatedStudents = [...students];
        const updatedTempMarks: SavedMarksEntry[] = [];

        students.forEach((student, studentIndex) => {
            const studentSEMarks = savedSEList.filter((se) => se.AMST_Id === student.amsT_Id);

            if (studentSEMarks.length > 0) {
                updatedStudents[studentIndex] = {
                    ...student,
                    selected: true,
                    ESTMSS_Marks: {}
                };

                // Initialize ESTMSS_Marks object
                const estmssMarks: { [key: number]: string } = {};

                studentSEMarks.forEach((seMark) => {
                    let markValue = '';
                    if (subjectMeta.marksGradeEntryFlg === 'M') {
                        if (seMark.ESTMSS_Flg && seMark.ESTMSS_Flg.trim() !== '') {
                            markValue = seMark.ESTMSS_Flg;
                        } else if (seMark.ESTMSS_Marks !== undefined && seMark.ESTMSS_Marks !== null) {
                            markValue = String(seMark.ESTMSS_Marks);
                        }
                    } else if (subjectMeta.marksGradeEntryFlg === 'G') {
                        if (seMark.ESTMSS_Flg && seMark.ESTMSS_Flg.trim() !== '') {
                            markValue = seMark.ESTMSS_Flg;
                        } else if (seMark.ESTMSS_Grade) {
                            markValue = seMark.ESTMSS_Grade;
                        }
                    }

                    estmssMarks[seMark.EMSE_Id] = markValue;

                    // Add to temp marks list
                    updatedTempMarks.push({
                        AMST_Id: student.amsT_Id,
                        ISMS_Id: student.ismS_Id,
                        EMSE_Id: seMark.EMSE_Id,
                        ESTM_ID: student.estM_Id ?? 0,
                        ESTM_MarksGradeFlg: subjectMeta.marksGradeEntryFlg,
                        ESTMSS_Marks: seMark.ESTMSS_Marks || 0,
                        ESTMSS_Grade: seMark.ESTMSS_Grade || '',
                        ESTMSS_Flg: seMark.ESTMSS_Flg || ''
                    });
                });

                updatedStudents[studentIndex].ESTMSS_Marks = estmssMarks;

                // Calculate total marks
                const totalMarks = calculateTotalMarksForStudent(updatedStudents[studentIndex], subjectMeta);
                updatedStudents[studentIndex].ESTM_Marks = totalMarks.toString();
                updatedStudents[studentIndex].estM_Marks_new = totalMarks;
            }
        });

        // Update temp marks list
        setTempSubsMarksList(updatedTempMarks);

        return updatedStudents;
    };

    /* ============================================
       Calculate Total Marks for Student
       ============================================ */
    const calculateTotalMarksForStudent = (student: StudentMarksEntry, subjectMeta: SubjectMeta): number => {
        if (!subjectMeta) return 0;

        let total = 0;

        if (subjectMeta.subsubFlag && student.ESTMSS_Marks && typeof student.ESTMSS_Marks === 'object') {
            // Calculate sum of sub-subject marks
            Object.values(student.ESTMSS_Marks).forEach((markValue) => {
                if (typeof markValue === 'string' && !Number.isNaN(Number.parseFloat(markValue))) {
                    total += Number.parseFloat(markValue);
                }
            });
        } else if (subjectMeta.subexamFlag && student.ESTMSS_Marks && typeof student.ESTMSS_Marks === 'object') {
            // Calculate sum of sub-exam marks
            Object.values(student.ESTMSS_Marks).forEach((markValue) => {
                if (typeof markValue === 'string' && !Number.isNaN(Number.parseFloat(markValue))) {
                    total += Number.parseFloat(markValue);
                }
            });
        }

        return total;
    };

    /* ============================================
       Update Functions
       ============================================ */
    const updateSimpleMark = (studentId: number, newMark: number | '' | string) => {
        setStudents((prev) =>
            prev.map((student) => {
                if (student.amsT_Id === studentId) {
                    return {
                        ...student,
                        ESTM_Marks: newMark
                    };
                }
                return student;
            })
        );

        // Update temp marks list
        updateTempMarksListSimple(studentId, newMark);
    };

    const updateSubSubjectMark = (studentId: number, subSubjectId: number, newMark: number | '' | string) => {
        setStudents((prev) =>
            prev.map((student) => {
                if (student.amsT_Id === studentId) {
                    const updatedMarks = { ...((student.ESTMSS_Marks as { [key: number]: string }) || {}) };
                    updatedMarks[subSubjectId] = newMark.toString();

                    // Calculate new total
                    let total = 0;
                    Object.values(updatedMarks).forEach((markValue) => {
                        if (typeof markValue === 'string' && !Number.isNaN(Number.parseFloat(markValue))) {
                            total += Number.parseFloat(markValue);
                        }
                    });

                    return {
                        ...student,
                        ESTMSS_Marks: updatedMarks,
                        ESTM_Marks: total.toString(),
                        estM_Marks_new: total
                    };
                }
                return student;
            })
        );

        // Update temp marks list
        updateTempMarksListSubSubject(studentId, subSubjectId, newMark);
    };

    const updateSubExamMark = (studentId: number, subExamId: number, newMark: number | '' | string) => {
        setStudents((prev) =>
            prev.map((student) => {
                if (student.amsT_Id === studentId) {
                    const updatedMarks = { ...((student.ESTMSS_Marks as { [key: number]: string }) || {}) };
                    updatedMarks[subExamId] = newMark.toString();

                    // Calculate new total
                    let total = 0;
                    Object.values(updatedMarks).forEach((markValue) => {
                        if (typeof markValue === 'string' && !Number.isNaN(Number.parseFloat(markValue))) {
                            total += Number.parseFloat(markValue);
                        }
                    });

                    return {
                        ...student,
                        ESTMSS_Marks: updatedMarks,
                        ESTM_Marks: total.toString(),
                        estM_Marks_new: total
                    };
                }
                return student;
            })
        );

        // Update temp marks list
        updateTempMarksListSubExam(studentId, subExamId, newMark);
    };

    const updateTempMarksListSimple = (studentId: number, value: number | '' | string) => {
        const student = students.find((s) => s.amsT_Id === studentId);
        if (!student || !subjectMeta) return;

        if (value === '') {
            // Remove from temp list
            setTempSubsMarksList((prev) => prev.filter((item) => !(item.AMST_Id === studentId && item.ISMS_Id === student.ismS_Id)));
            return;
        }

        const newEntry: SavedMarksEntry = {
            AMST_Id: studentId,
            ISMS_Id: student.ismS_Id,
            ESTM_ID: student.estM_Id ?? 0,
            ESTM_MarksGradeFlg: subjectMeta.marksGradeEntryFlg,
            ESTM_Marks: 0,
            ESTM_Grade: '',
            ESTM_Flg: ''
        };

        if (subjectMeta.marksGradeEntryFlg === 'M') {
            if (typeof value === 'string' && ['AB', 'L', 'M', 'OD'].includes(value.toUpperCase())) {
                newEntry.ESTM_Flg = value.toUpperCase();
                newEntry.ESTM_Marks = 0;
            } else {
                const numValue = Number.parseFloat(value as string);
                if (!Number.isNaN(numValue)) {
                    newEntry.ESTM_Marks = numValue;
                    newEntry.ESTM_Flg = '';
                }
            }
        } else {
            if (typeof value === 'string' && ['AB', 'L', 'M', 'OD'].includes(value.toUpperCase())) {
                newEntry.ESTM_Flg = value.toUpperCase();
                newEntry.ESTM_Grade = '';
            } else {
                newEntry.ESTM_Grade = value.toString();
                newEntry.ESTM_Flg = '';
            }
        }

        setTempSubsMarksList((prev) => {
            const existingIndex = prev.findIndex((item) => item.AMST_Id === studentId && item.ISMS_Id === student.ismS_Id);

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = newEntry;
                return updated;
            } else {
                return [...prev, newEntry];
            }
        });
    };

    const updateTempMarksListSubSubject = (studentId: number, subSubjectId: number, value: number | '' | string) => {
        const student = students.find((s) => s.amsT_Id === studentId);
        if (!student || !subjectMeta) return;

        if (value === '') {
            // Remove from temp list
            setTempSubsMarksList((prev) => prev.filter((item) => !(item.AMST_Id === studentId && item.EMSS_Id === subSubjectId)));
            return;
        }

        const newEntry: SavedMarksEntry = {
            AMST_Id: studentId,
            ISMS_Id: student.ismS_Id,
            EMSS_Id: subSubjectId,
            ESTM_ID: student.estM_Id ?? 0,
            ESTM_MarksGradeFlg: subjectMeta.marksGradeEntryFlg,
            ESTMSS_Marks: 0,
            ESTMSS_Grade: '',
            ESTMSS_Flg: ''
        };

        if (subjectMeta.marksGradeEntryFlg === 'M') {
            if (typeof value === 'string' && ['AB', 'L', 'M', 'OD'].includes(value.toUpperCase())) {
                newEntry.ESTMSS_Flg = value.toUpperCase();
                newEntry.ESTMSS_Marks = 0;
            } else {
                const numValue = Number.parseFloat(value as string);
                if (!Number.isNaN(numValue)) {
                    newEntry.ESTMSS_Marks = numValue;
                    newEntry.ESTMSS_Flg = '';
                }
            }
        } else {
            if (typeof value === 'string' && ['AB', 'L', 'M', 'OD'].includes(value.toUpperCase())) {
                newEntry.ESTMSS_Flg = value.toUpperCase();
                newEntry.ESTMSS_Grade = '';
            } else {
                newEntry.ESTMSS_Grade = value.toString();
                newEntry.ESTMSS_Flg = '';
            }
        }

        setTempSubsMarksList((prev) => {
            const existingIndex = prev.findIndex((item) => item.AMST_Id === studentId && item.EMSS_Id === subSubjectId);

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = newEntry;
                return updated;
            } else {
                return [...prev, newEntry];
            }
        });
    };

    const updateTempMarksListSubExam = (studentId: number, subExamId: number, value: number | '' | string) => {
        const student = students.find((s) => s.amsT_Id === studentId);
        if (!student || !subjectMeta) return;

        if (value === '') {
            // Remove from temp list
            setTempSubsMarksList((prev) => prev.filter((item) => !(item.AMST_Id === studentId && item.EMSE_Id === subExamId)));
            return;
        }

        const newEntry: SavedMarksEntry = {
            AMST_Id: studentId,
            ISMS_Id: student.ismS_Id,
            EMSE_Id: subExamId,
            ESTM_ID: student.estM_Id ?? 0,
            ESTM_MarksGradeFlg: subjectMeta.marksGradeEntryFlg,
            ESTMSS_Marks: 0,
            ESTMSS_Grade: '',
            ESTMSS_Flg: ''
        };

        if (subjectMeta.marksGradeEntryFlg === 'M') {
            if (typeof value === 'string' && ['AB', 'L', 'M', 'OD'].includes(value.toUpperCase())) {
                newEntry.ESTMSS_Flg = value.toUpperCase();
                newEntry.ESTMSS_Marks = 0;
            } else {
                const numValue = Number.parseFloat(value as string);
                if (!Number.isNaN(numValue)) {
                    newEntry.ESTMSS_Marks = numValue;
                    newEntry.ESTMSS_Flg = '';
                }
            }
        } else {
            if (typeof value === 'string' && ['AB', 'L', 'M', 'OD'].includes(value.toUpperCase())) {
                newEntry.ESTMSS_Flg = value.toUpperCase();
                newEntry.ESTMSS_Grade = '';
            } else {
                newEntry.ESTMSS_Grade = value.toString();
                newEntry.ESTMSS_Flg = '';
            }
        }

        setTempSubsMarksList((prev) => {
            const existingIndex = prev.findIndex((item) => item.AMST_Id === studentId && item.EMSE_Id === subExamId);

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = newEntry;
                return updated;
            } else {
                return [...prev, newEntry];
            }
        });
    };

    /* ============================================
       Arrow Navigation Functions
       ============================================ */
    const handleArrowNavigation = (rowIndex: number, colIndex: number, direction: 'left' | 'right' | 'up' | 'down') => {
        let nextRow = rowIndex;
        let nextCol = colIndex;

        if (direction === 'left') {
            nextCol = Math.max(0, colIndex - 1);
        } else if (direction === 'right') {
            nextCol = Math.min(getMaxColumnIndex(), colIndex + 1);
        } else if (direction === 'up') {
            nextRow = Math.max(0, rowIndex - 1);
        } else if (direction === 'down') {
            nextRow = Math.min(students.length - 1, rowIndex + 1);
        }

        inputRefs.current[nextRow]?.[nextCol]?.focus();
    };

    const getMaxColumnIndex = () => {
        if (!subjectMeta) return 0;

        if (!subjectMeta.subsubFlag && !subjectMeta.subexamFlag) {
            return 0; // Simple marks column
        } else if (subjectMeta.subsubFlag) {
            return subjectMeta.subsubData.length - 1;
        } else if (subjectMeta.subexamFlag) {
            return subjectMeta.subexamData.length - 1;
        }
        return 0;
    };

    /* ============================================
       Selection Functions
       ============================================ */
    const toggleAllSelection = () => {
        const newAllSelected = !allSelected;
        setAllSelected(newAllSelected);
        setStudents((prev) =>
            prev.map((student) => ({
                ...student,
                selected: newAllSelected
            }))
        );
    };

    const toggleStudentSelection = (studentId: number) => {
        setStudents((prev) => {
            const updated = prev.map((student) => (student.amsT_Id === studentId ? { ...student, selected: !student.selected } : student));

            const isAllSelected = updated.length > 0 && updated.every((s) => s.selected === true);

            setAllSelected(isAllSelected);

            return updated;
        });
    };

    /* ============================================
       Save Functions
       ============================================ */
    const handleSave = async (verifyflg?: string) => {
        if (!subjectMeta) {
            toast.info('No subject data available');
            return;
        }

        const selectedStudents = students.filter((s) => s.selected);
        if (selectedStudents.length === 0) {
            toast.info('Select Students For Saving Marks...');
            return;
        }

        // Validation for marks
        let hasErrors = false;
        const validationErrors: string[] = [];

        // Check based on subject type
        if (!subjectMeta.subsubFlag && !subjectMeta.subexamFlag) {
            // Simple subject check
            selectedStudents.forEach((student) => {
                const tempMark = tempSubsMarksList.find((t) => t.AMST_Id === student.amsT_Id && t.ISMS_Id === student.ismS_Id);
                if (tempMark) {
                    // Check for special flags in marks mode
                    if (subjectMeta.marksGradeEntryFlg === 'M') {
                        if (tempMark.ESTM_Flg && !['AB', 'L', 'M', 'OD'].includes(tempMark.ESTM_Flg.toUpperCase())) {
                            hasErrors = true;
                            validationErrors.push(`Invalid flag for ${student.amsT_FirstName}`);
                        }
                    }
                    // Check for invalid grades in grade mode
                    else if (subjectMeta.marksGradeEntryFlg === 'G') {
                        if (tempMark.ESTM_Grade) {
                            const grade = tempMark.ESTM_Grade.toUpperCase();
                            const validFlags = ['AB', 'L', 'M', 'OD'];

                            if (!validFlags.includes(grade)) {
                                let isValidGrade = false;

                                // Check paper type grades
                                if (student.papertypeid && paperTypeGradeDetails.length > 0) {
                                    isValidGrade = paperTypeGradeDetails.some(
                                        (gradeDetail) => gradeDetail.emgD_Name.toUpperCase() === grade
                                    );
                                }

                                // Check general grades
                                if (!isValidGrade && gradeDetails.length > 0) {
                                    isValidGrade = gradeDetails.some((g) => g.toUpperCase() === grade);
                                }

                                if (!isValidGrade) {
                                    hasErrors = true;
                                    validationErrors.push(`Invalid grade for ${student.amsT_FirstName}`);
                                }
                            }
                        }
                    }
                }
            });
        } else if (subjectMeta.subsubFlag || subjectMeta.subexamFlag) {
            // For sub-subject or sub-exam, check each entry
            selectedStudents.forEach((student) => {
                const studentSubMarks = tempSubsMarksList.filter((t) => t.AMST_Id === student.amsT_Id);
                studentSubMarks.forEach((mark) => {
                    if (subjectMeta.marksGradeEntryFlg === 'M') {
                        if (mark.ESTMSS_Flg && !['AB', 'L', 'M', 'OD'].includes(mark.ESTMSS_Flg.toUpperCase())) {
                            hasErrors = true;
                            validationErrors.push(`Invalid flag for ${student.amsT_FirstName}`);
                        }
                    } else if (subjectMeta.marksGradeEntryFlg === 'G') {
                        if (mark.ESTMSS_Grade) {
                            const grade = mark.ESTMSS_Grade.toUpperCase();
                            const validFlags = ['AB', 'L', 'M', 'OD'];

                            if (!validFlags.includes(grade)) {
                                let isValidGrade = false;
                                const gradeDetailsList = subjectMeta.subsubFlag ? subSubjectGradeDetails : subExamGradeDetails;

                                if (gradeDetailsList.length > 0) {
                                    isValidGrade = gradeDetailsList.some((g: any) => g.emgD_Name.toUpperCase() === grade);
                                }

                                if (!isValidGrade) {
                                    hasErrors = true;
                                    validationErrors.push(`Invalid grade for ${student.amsT_FirstName}`);
                                }
                            }
                        }
                    }
                });
            });
        }

        if (hasErrors) {
            toast.error(`Validation errors: ${validationErrors.join(', ')}`);
            return;
        }

        setIsSubmitting(true);

        // Get current timestamp
        const currentTimestamp = new Date().toISOString();

        // Prepare main_save_list based on scenario
        const mainSaveList = selectedStudents.map((student) => {
            // For sub-subject/sub-exam, calculate total marks
            let totalMarks = 0;
            let mainFlag = '';
            let mainGrade = '';

            if (subjectMeta.subsubFlag || subjectMeta.subexamFlag) {
                const studentSubMarks = tempSubsMarksList.filter((t) => t.AMST_Id === student.amsT_Id);

                // Calculate total marks
                studentSubMarks.forEach((mark) => {
                    if (mark.ESTMSS_Marks) {
                        totalMarks += mark.ESTMSS_Marks;
                    }
                    if (mark.ESTMSS_Flg && ['AB', 'L', 'M', 'OD'].includes(mark.ESTMSS_Flg)) {
                        mainFlag = mark.ESTMSS_Flg;
                    }
                    if (mark.ESTMSS_Grade) {
                        mainGrade = mark.ESTMSS_Grade;
                    }
                });
            } else {
                // Simple subject
                const tempMark = tempSubsMarksList.find((t) => t.AMST_Id === student.amsT_Id && t.ISMS_Id === student.ismS_Id);
                if (tempMark) {
                    totalMarks = tempMark.ESTM_Marks || 0;
                    mainFlag = tempMark.ESTM_Flg || '';
                    mainGrade = tempMark.ESTM_Grade || '';
                } else {
                    // If no temp mark, then use the student's existing marks
                    totalMarks = student.estM_Marks_new || student.estM_Marks || 0;
                    mainFlag = student.estM_Flg_new || student.estM_Flg || '';
                    mainGrade = student.estM_Grade_new || student.estM_Grade || '';
                }
            }

            return {
                amsT_Id: student.amsT_Id,
                amsT_FirstName: student.amsT_FirstName,
                amsT_AdmNo: student.amsT_AdmNo,
                amsT_RegistrationNo: student.amsT_RegistrationNo || '',
                amaY_RollNo: student.amaY_RollNo,
                ismS_Id: student.ismS_Id,
                ismS_SubjectName: student.ismS_SubjectName,
                eyceS_MaxMarks: student.eyceS_MaxMarks,
                eyceS_MinMarks: student.eyceS_MinMarks,
                eyceS_MarksEntryMax: student.eyceS_MarksEntryMax,
                estM_Marks: totalMarks,
                estM_Grade: mainGrade || '',
                estM_Flg: mainFlag || '',
                estM_Id: student.estM_Id || 0,
                param: '',
                amsT_Sex: '',
                estmanssH_Id: 0,
                estmanssH_AnswerSheet: student.estmanssH_AnswerSheet || '',
                estmanssH_FileLocation: student.estmanssH_FileLocation || ''
            };
        });

        // Prepare temp_subs_marks_list based on scenario
        let tempSubsMarksListFormatted: any[] = [];

        if (subjectMeta.subsubFlag || subjectMeta.subexamFlag) {
            // Filter only marks for selected students
            const selectedStudentIds = selectedStudents.map((s) => s.amsT_Id);
            const selectedSubMarks = tempSubsMarksList.filter(
                (mark) => selectedStudentIds.includes(mark.AMST_Id) && (mark.EMSS_Id !== undefined || mark.EMSE_Id !== undefined)
            );

            tempSubsMarksListFormatted = selectedSubMarks.map((mark) => ({
                estmsS_Id: mark.estmsS_Id || 0,
                amsT_Id: mark.AMST_Id,
                emsS_Id: mark.EMSS_Id || 0,
                ismS_Id: mark.ISMS_Id,
                emsE_Id: mark.EMSE_Id || 0,
                estmsS_Marks: mark.ESTMSS_Marks || 0,
                estmsS_MarksGradeFlg: subjectMeta.marksGradeEntryFlg,
                estmsS_Grade: mark.ESTMSS_Grade || '',
                estmsS_Flg: mark.ESTMSS_Flg || '',
                estmsS_ActiveFlg: true,
                iP4: ''
            }));
        }

        // Build the complete payload
        const saveData: any = {
            createdDate: currentTimestamp,
            updatedDate: currentTimestamp,
            emsS_Id: 0,
            asmaY_Id: ASMAY_Id!,
            asmcL_Id: ASMCL_Id!,
            asmS_Id: ASMS_Id!,
            emE_Id: EME_Id!,
            ismS_Id: ISMS_Id!,
            subject_details: [
                {
                    createdDate: currentTimestamp,
                    updatedDate: currentTimestamp,
                    eyceS_Id: 0,
                    eycE_Id: 0,
                    ismS_Id: ISMS_Id!,
                    emgR_Id: 0,
                    eyceS_MarksEntryMax: selectedStudents[0]?.eyceS_MarksEntryMax || 0,
                    eyceS_MaxMarks: selectedStudents[0]?.eyceS_MaxMarks || 0,
                    eyceS_MinMarks: selectedStudents[0]?.eyceS_MinMarks || 0,
                    eyceS_SubExamFlg: subjectMeta.subexamFlag,
                    eyceS_SubSubjectFlg: subjectMeta.subsubFlag,
                    eyceS_MarksGradeEntryFlg: subjectMeta.marksGradeEntryFlg,
                    eyceS_MarksDisplayFlg: true,
                    eyceS_GradeDisplayFlg: true,
                    eyceS_AplResultFlg: true,
                    eyceS_ActiveFlg: true,
                    eyceS_SubjectOrder: 0
                }
            ],
            eyceS_MarksGradeEntryFlg: subjectMeta.marksGradeEntryFlg,
            eyceS_SubSubjectFlg: subjectMeta.subsubFlag,
            subject_subsubjects: subjectMeta.subsubFlag
                ? subjectMeta.subsubData.map((ss) => ({
                      eycessS_Id: 0,
                      eyceS_Id: 0,
                      emsS_Id: ss.subsubId,
                      emgR_Id: 0,
                      eycessS_MaxMarks: ss.maxMarks,
                      eycessS_MinMarks: ss.minMarks || 0,
                      eycessS_MarksEntryMax: ss.marksEntryMax,
                      eycessS_ExemptedFlg: false,
                      eycessS_ExemptedPer: '',
                      eycessS_ActiveFlg: true,
                      eycessS_SubSubjectOrder: 0,
                      emsS_SubSubjectName: ss.subsubName,
                      emsS_SubSubjectCode: ''
                  }))
                : [],
            eyceS_SubExamFlg: subjectMeta.subexamFlag,
            subject_subexams: subjectMeta.subexamFlag
                ? subjectMeta.subexamData.map((se) => ({
                      eycessE_Id: 0,
                      eyceS_Id: 0,
                      emsE_Id: se.subexamId,
                      emgR_Id: 0,
                      eycessE_MaxMarks: se.maxMarks,
                      eycessE_MinMarks: se.minMarks || 0,
                      eycessE_MarksEntryMax: se.marksEntryMax,
                      eycessE_ExemptedFlg: false,
                      eycessE_ExemptedPer: '',
                      eycessE_ActiveFlg: true,
                      eycessE_SubExamOrder: 0,
                      emsE_SubExamName: se.subexamName,
                      emsE_SubExamCode: ''
                  }))
                : [],
            emgR_Id: 0,
            grade_details: gradeDetails,
            amaY_RollNo: 0,
            iP4: '',
            studentList: [],
            get_student_wise_papertype_list: [],
            subsubject_gradedetails: subSubjectGradeDetails,
            subexam_gradedetails: subExamGradeDetails,
            main_save_list: mainSaveList,
            temp_subs_marks_list: tempSubsMarksListFormatted,
            saved_studentList: [],
            marksdeleteflag: marksDeleteFlag,
            saved_sub_subject_exam_list: [],
            saved_sub_subject_list: [],
            saved_sub_subjectOrExam_list: [],
            configuration: config ? [config] : [],
            subsubjectlist: subjectMeta.subsubFlag
                ? subjectMeta.subsubData.map((ss) => ({
                      emsS_Id: ss.subsubId,
                      emsS_SubSubjectName: ss.subsubName,
                      emsS_SubSubjectOrder: 0
                  }))
                : [],
            subexamlist: subjectMeta.subexamFlag
                ? subjectMeta.subexamData.map((se) => ({
                      emsE_Id: se.subexamId,
                      emsE_SubExamName: se.subexamName,
                      emsE_SubExamOrder: 0
                  }))
                : [],
            savedMarksCount: mainSaveList.length,
            lastDateEntry: 1000,
            lastDateEntryFlag: lastDateEntryFlag,
            lastDateExam: 2000,
            lastDateExamFlag: lastDateExamFlag,
            marksEntryStateDate: currentTimestamp,
            pagename: 'School',
            ivrmmaP_AddFlg: true,
            ivrmmaP_UpdateFlg: true,
            get_papertype_grade_details: paperTypeGradeDetails,
            answer_sheet: []
        };

        // Add orderflag for verification if provided
        if (verifyflg) {
            saveData.orderflag = verifyflg;
        }

        console.log('Save payload:', saveData);

        try {
            const response = await addOrUpdateStudentMarks(saveData);

            if (response.success || response.returnval === true) {
                toast.success(response.message || 'Marks saved successfully');
                // Clear temp marks list after successful save
                setTempSubsMarksList([]);

                // Refresh data
                await handleSearch();

                if (onSave) {
                    await onSave(saveData);
                }
            } else {
                toast.error(response.message || 'Failed to save data');
            }
        } catch (error: any) {
            console.error('Error saving marks:', error);
            toast.error(error.message || 'Failed to save data');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveVerify = () => {
        toast.custom((t) => (
            <div className='rounded-lg border bg-white p-4 shadow-lg'>
                <h3 className='mb-2 font-semibold text-lg'>Are You Sure?</h3>
                <p className='mb-4'>
                    Once verified, the marks will be frozen and cannot be updated. Do you want to proceed with verification?
                </p>
                <div className='flex justify-end gap-2'>
                    <Button variant='outline' onClick={() => toast.dismiss(t)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            handleSave('V');
                            toast.dismiss(t);
                        }}>
                        Yes, Verify It!
                    </Button>
                </div>
            </div>
        ));
    };

    const handleSaveMarks = () => {
        if (marksDeleteFlag) {
            setShowConfirmPopup(true);
        } else {
            handleSave('');
        }
    };

    /* ============================================
       Render Table
       ============================================ */
    const renderTable = () => {
        if (!subjectMeta || students.length === 0) {
            return null;
        }

        // Initialize input refs array
        if (!inputRefs.current.length) {
            inputRefs.current = Array(students.length)
                .fill(null)
                .map(() => []);
        }

        const baseColumnsCount = 6; // Select, SL NO, Name, RegNo, AdmNo, RollNo
        let totalColumns = baseColumnsCount;

        if (subjectMeta.subsubFlag) {
            totalColumns += subjectMeta.subsubData.length + 1; // Sub subjects + TOTAL
        } else if (subjectMeta.subexamFlag) {
            totalColumns += subjectMeta.subexamData.length + 1; // Sub exams + TOTAL
        } else {
            totalColumns += 1; // Simple marks
        }

        return (
            <div className='mt-4 overflow-x-auto rounded border bg-white shadow-sm'>
                <table className='min-w-full table-fixed border-collapse border border-gray-300 [&_td]:border [&_td]:border-gray-300 [&_th]:border'>
                    <thead>
                        <tr>
                            <TableHeaderCell rowSpan={subjectMeta.subsubFlag || subjectMeta.subexamFlag ? 3 : 2}>
                                <div className='flex items-center justify-center'>
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={toggleAllSelection}
                                        className='border-violet-600 data-[state=checked]:bg-white data-[state=unchecked]:bg-white data-[state=checked]:text-violet-600'
                                    />
                                </div>
                            </TableHeaderCell>
                            <TableHeaderCell rowSpan={subjectMeta.subsubFlag || subjectMeta.subexamFlag ? 3 : 2}>SL NO</TableHeaderCell>
                            <TableHeaderCell rowSpan={subjectMeta.subsubFlag || subjectMeta.subexamFlag ? 3 : 2} className='text-left'>
                                Student Name
                            </TableHeaderCell>

                            {(!config || config.exmConfig_RegnoColumnDisplay) && (
                                <TableHeaderCell rowSpan={subjectMeta.subsubFlag || subjectMeta.subexamFlag ? 3 : 2}>
                                    Reg No
                                </TableHeaderCell>
                            )}

                            {(!config || config.exmConfig_AdmnoColumnDisplay) && (
                                <TableHeaderCell rowSpan={subjectMeta.subsubFlag || subjectMeta.subexamFlag ? 3 : 2}>
                                    Admission No
                                </TableHeaderCell>
                            )}

                            {(!config || config.exmConfig_RollnoColumnDisplay) && (
                                <TableHeaderCell rowSpan={subjectMeta.subsubFlag || subjectMeta.subexamFlag ? 3 : 2}>
                                    Roll No
                                </TableHeaderCell>
                            )}

                            {subjectMeta.subsubFlag ? (
                                <TableHeaderCell colSpan={subjectMeta.subsubData.length + 1}>
                                    <div className='font-semibold'>{`${subjectMeta.subjectName} (M-${subjectMeta.maxMarks})`}</div>
                                    <div className='text-[12px]'>{`(ME-${subjectMeta.minMarks})`}</div>
                                </TableHeaderCell>
                            ) : subjectMeta.subexamFlag ? (
                                <TableHeaderCell colSpan={subjectMeta.subexamData.length + 1}>
                                    <div className='font-semibold'>{`${subjectMeta.subjectName} (M-${subjectMeta.maxMarks})`}</div>
                                    <div className='text-[12px]'>{`(ME-${subjectMeta.minMarks})`}</div>
                                </TableHeaderCell>
                            ) : (
                                <TableHeaderCell>
                                    <div className='font-semibold'>{`${subjectMeta.subjectName} (M-${subjectMeta.maxMarks})`}</div>
                                    <div className='text-[12px]'>{`(ME-${subjectMeta.minMarks})`}</div>
                                </TableHeaderCell>
                            )}
                        </tr>

                        {(subjectMeta.subsubFlag || subjectMeta.subexamFlag) && (
                            <tr>
                                {subjectMeta.subsubFlag ? (
                                    <>
                                        {subjectMeta.subsubData.map((ss) => (
                                            <TableHeaderCell key={ss.subsubId}>
                                                <div className='font-semibold text-sm'>{ss.subsubName}</div>
                                                <div className='text-[11px]'>{`(M-${ss.maxMarks}) (ME-${ss.minMarks || 0})`}</div>
                                            </TableHeaderCell>
                                        ))}
                                        {/* <TableHeaderCell>
                                            <div className='font-semibold text-sm'>TOTAL</div>
                                            <div className='text-[11px]'>{`(M-${subjectMeta.maxMarks})`}</div>
                                        </TableHeaderCell> */}
                                    </>
                                ) : subjectMeta.subexamFlag ? (
                                    <>
                                        {subjectMeta.subexamData.map((se) => (
                                            <TableHeaderCell key={se.subexamId}>
                                                <div className='font-semibold text-sm'>{se.subexamName}</div>
                                                <div className='text-[11px]'>{`(M-${se.maxMarks}) (ME-${se.minMarks || 0})`}</div>
                                            </TableHeaderCell>
                                        ))}
                                        {/* <TableHeaderCell>
                                            <div className='font-semibold text-sm'>EXAM TOTAL</div>
                                            <div className='text-[11px]'>{`(M-${subjectMeta.maxMarks})`}</div>
                                        </TableHeaderCell> */}
                                    </>
                                ) : null}
                            </tr>
                        )}
                    </thead>

                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <TableCell colSpan={totalColumns} className='py-8 text-center text-gray-500 text-sm'>
                                    No Records Found
                                </TableCell>
                            </tr>
                        ) : (
                            students.map((student, rowIndex) => {
                                // Calculate totals
                                let subsum = 0;
                                let examsum = 0;
                                let subOver = false;
                                let examOver = false;

                                if (subjectMeta.subsubFlag && student.ESTMSS_Marks && typeof student.ESTMSS_Marks === 'object') {
                                    // Calculate sub-subject total
                                    Object.values(student.ESTMSS_Marks).forEach((markValue) => {
                                        if (typeof markValue === 'string' && !Number.isNaN(Number.parseFloat(markValue))) {
                                            subsum += Number.parseFloat(markValue);
                                        }
                                    });
                                    subOver = subsum > subjectMeta.maxMarks;
                                } else if (subjectMeta.subexamFlag && student.ESTMSS_Marks && typeof student.ESTMSS_Marks === 'object') {
                                    // Calculate sub-exam total
                                    Object.values(student.ESTMSS_Marks).forEach((markValue) => {
                                        if (typeof markValue === 'string' && !Number.isNaN(Number.parseFloat(markValue))) {
                                            examsum += Number.parseFloat(markValue);
                                        }
                                    });
                                    if (examsum === 0) {
                                        subjectMeta.saved_sub_subjectOrExam_list.forEach((ss) => {
                                            if (student.estM_Id === ss.ESTM_ID && ss.ESTMSS_Marks !== undefined) {
                                                examsum += Number.parseFloat(ss.ESTMSS_Marks.toString());
                                            }
                                        });
                                    }
                                    examOver = examsum > subjectMeta.maxMarks;
                                } else {
                                    // Simple marks
                                    if (
                                        student.ESTM_Marks &&
                                        typeof student.ESTM_Marks === 'string' &&
                                        !Number.isNaN(Number.parseFloat(student.ESTM_Marks))
                                    ) {
                                        subsum = Number.parseFloat(student.ESTM_Marks);
                                        subOver = subsum > subjectMeta.maxMarks;
                                    }
                                }

                                return (
                                    <tr key={student.amsT_Id} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <TableCell className='pr-2 text-center'>
                                            <Checkbox
                                                checked={student.selected || false}
                                                onCheckedChange={() => toggleStudentSelection(student.amsT_Id)}
                                                className='rounded accent-[#7C3AED]'
                                            />
                                        </TableCell>
                                        <TableCell className='text-center'>{rowIndex + 1}</TableCell>
                                        <TableCell className='font-center'>{student.amsT_FirstName}</TableCell>

                                        {(!config || config.exmConfig_RegnoColumnDisplay) && (
                                            <TableCell className='text-center'>{student.amsT_RegistrationNo}</TableCell>
                                        )}

                                        {(!config || config.exmConfig_AdmnoColumnDisplay) && (
                                            <TableCell className='text-center'>{student.amsT_AdmNo}</TableCell>
                                        )}

                                        {(!config || config.exmConfig_RollnoColumnDisplay) && (
                                            <TableCell className='text-center'>{student.amaY_RollNo}</TableCell>
                                        )}

                                        {subjectMeta.subsubFlag ? (
                                            <>
                                                {subjectMeta.subsubData.map((subsub, colIndex) => {
                                                    const subSubjObj = subjectMeta.saved_sub_subject_list.find(
                                                        (s) => s.EMSS_Id === subsub.subsubId && s.ESTM_ID === student.estM_Id
                                                    );
                                                    return (
                                                        <TableCell key={subsub.subsubId} className='text-center'>
                                                            <div className='flex justify-center'>
                                                                <MarksInputCell
                                                                    value={
                                                                        subSubjObj?.ESTM_Flg && subSubjObj.ESTM_Flg !== ''
                                                                            ? subSubjObj.ESTM_Flg
                                                                            : subjectMeta.marksGradeEntryFlg === 'M'
                                                                              ? (subSubjObj?.ESTMSS_Marks ?? '')
                                                                              : (subSubjObj?.ESTMSS_Grade ?? '')
                                                                    }
                                                                    max={subsub.maxMarks}
                                                                    min={subsub.minMarks}
                                                                    onChange={(v) =>
                                                                        updateSubSubjectMark(student.amsT_Id, subsub.subsubId, v)
                                                                    }
                                                                    placeholder={
                                                                        subjectMeta.marksGradeEntryFlg === 'M'
                                                                            ? 'Enter Marks...'
                                                                            : 'Enter Grade...'
                                                                    }
                                                                    marksGradeEntryFlg={subjectMeta.marksGradeEntryFlg}
                                                                    gradeDetails={subSubjectGradeDetails.map((g) => g.emgD_Name)}
                                                                    papertypeid={student.papertypeid}
                                                                    papertypeGradeDetails={paperTypeGradeDetails}
                                                                    onArrow={(dir) => handleArrowNavigation(rowIndex, colIndex, dir)}
                                                                    ref={(el) => {
                                                                        if (!inputRefs.current[rowIndex]) {
                                                                            inputRefs.current[rowIndex] = [];
                                                                        }
                                                                        inputRefs.current[rowIndex][colIndex] = el;
                                                                    }}
                                                                />
                                                            </div>
                                                        </TableCell>
                                                    );
                                                })}
                                                {/* <TableCell className='align-top'>
                                                    <div className='flex flex-col items-start'>
                                                        <div className={`px-3 py-1 text-sm ${subOver ? 'font-semibold text-red-600' : ''}`}>
                                                            {subsum}
                                                        </div>
                                                        {subOver && <div className='text-[11px] text-red-600'>Sum exceeds subject max</div>}
                                                    </div>
                                                </TableCell> */}
                                            </>
                                        ) : subjectMeta.subexamFlag ? (
                                            <>
                                                {subjectMeta.subexamData.map((subexam, colIndex) => {
                                                    const subExamObj = subjectMeta.saved_sub_subjectOrExam_list.find(
                                                        (s) => s.EMSE_Id === subexam.subexamId && s.ESTM_ID === student.estM_Id
                                                    );

                                                    return (
                                                        <TableCell key={subexam.subexamId} className='text-center'>
                                                            <div className='flex justify-center'>
                                                                <MarksInputCell
                                                                    value={
                                                                        subExamObj?.ESTM_Flg && subExamObj.ESTM_Flg !== ''
                                                                            ? subExamObj.ESTM_Flg
                                                                            : subjectMeta.marksGradeEntryFlg === 'M'
                                                                              ? (subExamObj?.ESTMSS_Marks ?? '')
                                                                              : (subExamObj?.ESTMSS_Grade ?? '')
                                                                    }
                                                                    max={subexam.maxMarks}
                                                                    min={subexam.minMarks}
                                                                    onChange={(v) =>
                                                                        updateSubExamMark(student.amsT_Id, subexam.subexamId, v)
                                                                    }
                                                                    placeholder={
                                                                        subjectMeta.marksGradeEntryFlg === 'M'
                                                                            ? 'Enter Marks...'
                                                                            : 'Enter Grade...'
                                                                    }
                                                                    marksGradeEntryFlg={subjectMeta.marksGradeEntryFlg}
                                                                    gradeDetails={subExamGradeDetails.map((g) => g.emgD_Name)}
                                                                    papertypeid={student.papertypeid}
                                                                    papertypeGradeDetails={paperTypeGradeDetails}
                                                                    onArrow={(dir) => handleArrowNavigation(rowIndex, colIndex, dir)}
                                                                    ref={(el) => {
                                                                        if (!inputRefs.current[rowIndex]) {
                                                                            inputRefs.current[rowIndex] = [];
                                                                        }
                                                                        inputRefs.current[rowIndex][colIndex] = el;
                                                                    }}
                                                                />
                                                            </div>
                                                        </TableCell>
                                                    );
                                                })}
                                                {/* <TableCell className='align-top'>
                                                    <div className='flex flex-col items-start'>
                                                        <div className={`px-3 py-1 text-sm ${examOver ? 'font-semibold text-red-600' : ''}`}>
                                                            {examsum}
                                                        </div>
                                                        {examOver && (
                                                            <div className='text-[11px] text-red-600'>Sum exceeds subject max</div>
                                                        )}
                                                    </div>
                                                </TableCell> */}
                                            </>
                                        ) : (
                                            <TableCell className='text-center'>
                                                <div className='flex justify-center'>
                                                    <MarksInputCell
                                                        value={
                                                            student.estM_Flg != null && student.estM_Flg !== ''
                                                                ? student.estM_Flg
                                                                : subjectMeta.marksGradeEntryFlg === 'G' && student.estM_Grade
                                                                  ? student.estM_Grade
                                                                  : subjectMeta.marksGradeEntryFlg === 'M' && student.estM_Marks
                                                                    ? (student.estM_Marks ?? '')
                                                                    : ''
                                                        }
                                                        max={subjectMeta.maxMarks}
                                                        min={subjectMeta.minMarks}
                                                        onChange={(v) => updateSimpleMark(student.amsT_Id, v)}
                                                        placeholder={
                                                            subjectMeta.marksGradeEntryFlg === 'M' ? 'Enter Marks...' : 'Enter Grade...'
                                                        }
                                                        marksGradeEntryFlg={subjectMeta.marksGradeEntryFlg}
                                                        gradeDetails={gradeDetails}
                                                        papertypeid={student.papertypeid}
                                                        papertypeGradeDetails={paperTypeGradeDetails}
                                                        onArrow={(dir) => handleArrowNavigation(rowIndex, 0, dir)}
                                                        ref={(el) => {
                                                            if (!inputRefs.current[rowIndex]) {
                                                                inputRefs.current[rowIndex] = [];
                                                            }
                                                            inputRefs.current[rowIndex][0] = el;
                                                        }}
                                                    />
                                                </div>
                                            </TableCell>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    /* ============================================
       Render
       ============================================ */
    return (
        <div className='space-y-4'>
            {/* Loader */}
            {isLoading && (
                <div className='flex items-center justify-center py-8'>
                    <Loader2 className='h-8 w-8 animate-spin text-[#7C3AED]' />
                    <span className='ml-2'>Loading data...</span>
                </div>
            )}

            {/* Students Grid */}
            {isStudentsGridOpen && !isLoading && (
                <div className='space-y-4'>
                    {renderTable()}

                    {/* Action Buttons */}
                    {students.length > 0 && (
                        <div className='flex justify-end gap-2'>
                            <Button
                                variant='outline'
                                onClick={() => {
                                    setStudents((prev) =>
                                        prev.map((s) => ({
                                            ...s,
                                            selected: false,
                                            ESTM_Marks: '',
                                            ESTMSS_Marks: {}
                                        }))
                                    );
                                    setAllSelected(false);
                                    setTempSubsMarksList([]);
                                }}>
                                <RotateCcw className='mr-2 h-4 w-4' />
                                Clear
                            </Button>

                            {userPrivileges?.canVerify && (
                                <Button onClick={handleSaveVerify} className='bg-green-600 text-white hover:bg-green-700'>
                                    <Save className='mr-2 h-4 w-4' />
                                    Verify & Save
                                </Button>
                            )}

                            <Button onClick={handleSaveMarks} className='bg-[#7C3AED] text-white hover:bg-[#6D28D9]'>
                                <Save className='mr-2 h-4 w-4' />
                                {isSubmitting ? 'Saving...' : 'Save Marks'}
                            </Button>
                        </div>
                    )}
                    <AlertDialog open={showConfirmPopup} onOpenChange={setShowConfirmPopup}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Marks are already calculated. If you update the marks, you will need to recalculate them again. Do you
                                    want to continue?
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        handleSave('');
                                        setShowConfirmPopup(false);
                                    }}>
                                    Yes, Update It!
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Information</AlertDialogTitle>
                                <AlertDialogDescription>
                                    For this user, sub-subject is not mapped for the selected subject. Kindly contact the administrator.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogAction onClick={() => setShowInfoDialog(false)}>OK</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}

            {/* No data message */}
            {!isLoading && !isStudentsGridOpen && (
                <div className='py-8 text-center text-gray-500'>No data available. Please check the selected parameters.</div>
            )}
        </div>
    );
}

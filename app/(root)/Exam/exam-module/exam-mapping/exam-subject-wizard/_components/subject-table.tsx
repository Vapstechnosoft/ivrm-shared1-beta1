// SubjectTableWithValidation.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { IMasterGrade } from '@/types/exam/exam-module/masters';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export const BaseExamSubjectSchema = {
    addOrUpdate: z
        .object({
            eycE_Id: z.number().int().nonnegative().optional().default(0),
            eyc_Id: z.number().int().positive({ message: 'eyc_Id is required' }),
            ismS_Id: z.number().int().positive({ message: 'ismS_Id is required' }),
            emcA_Id: z.number().int().positive({ message: 'emcA_Id is required' }),
            emgR_Id: z.number().int().positive({ message: 'emgR_Id is required' }),

            ismS_SubjectName: z.string().min(1, { message: 'Subject name is required' }),
            ismS_SubjectCode: z.string().min(1, { message: 'Subject code is required' }),

            // -------- MARKS UPDATED HERE --------
            // If val is '' or undefined or NaN or 0 → treat as undefined
            eyceS_MaxMarks: z.preprocess((val) => {
                const num = Number(val);
                return !val || Number.isNaN(num) || num === 0 ? undefined : num;
            }, z.number().min(1).max(100).optional()),
            eyceS_MinMarks: z.preprocess((val) => {
                const num = Number(val);
                return !val || Number.isNaN(num) || num === 0 ? undefined : num;
            }, z.number().min(1).max(100).optional()),
            eyceS_MarksEntryMax: z.preprocess((val) => {
                const num = Number(val);
                return !val || Number.isNaN(num) || num === 0 ? undefined : num;
            }, z.number().min(1).max(100).optional()),
            // -------------------------------------

            eyceS_SubExamFlg: z.boolean().optional().default(false),
            eyceS_SubSubjectFlg: z.boolean().optional().default(false),
            eyceS_MarksGradeEntryFlg: z.enum(['M', 'G'], { message: 'Invalid marks/grade entry flag' }),
            eyceS_MarksDisplayFlg: z.boolean().optional().default(true),
            eyceS_GradeDisplayFlg: z.boolean().optional().default(true),
            eyceS_AplResultFlg: z.boolean().optional().default(true),
            eyceS_ActiveFlg: z.boolean().optional().default(true),

            eyceS_SubjectOrder: z.number().int().min(1, { message: 'Subject order must be at least 1' }),

            PT_Count: z.number().int().nonnegative().optional().default(0),

            UserId: z.number().int().nonnegative().optional().default(0),
            MI_Id: z.number().int().nonnegative().optional().default(0),
            ASMAY_Id: z.number().int().nonnegative().optional().default(0),
            ASMAY_Year: z.string().optional().nullable()
        })

        // Identifier checks
        .refine((data) => data.eyc_Id > 0 && data.ismS_Id > 0 && data.emcA_Id > 0, {
            message: 'Required identifiers are missing',
            path: ['eyc_Id']
        })

        // Conditional cross-field validations
        .refine(
            (data) => data.eyceS_MinMarks === undefined || data.eyceS_MaxMarks === undefined || data.eyceS_MinMarks <= data.eyceS_MaxMarks,
            {
                message: 'Min marks must be ≤ Max marks',
                path: ['eyceS_MinMarks']
            }
        )
        .refine(
            (data) =>
                data.eyceS_MarksEntryMax === undefined ||
                data.eyceS_MaxMarks === undefined ||
                data.eyceS_MarksEntryMax <= data.eyceS_MaxMarks,
            {
                message: 'Marks entry max cannot exceed Max marks',
                path: ['eyceS_MarksEntryMax']
            }
        ),

    delete: z.object({
        eycE_Id: z.number({ required_error: 'eycE_Id is required' }).int().positive({ message: 'Invalid eycE_Id' })
    })
};

// ---------- Types ----------
type SubjectRowRaw = {
    ismS_Id: number;
    ismS_SubjectName?: string;
    ismS_SubjectCode?: string;
    // possible keys from backend / UI
    eyceS_MaxMarks?: number | string;
    eyceS_MinMarks?: number | string;
    eyceS_MarksEntryMax?: number | string;
    eyceS_MarksGradeEntryFlg?: 'M' | 'G' | string;
    eyceS_MarksDisplayFlg?: boolean;
    eyceS_GradeDisplayFlg?: boolean;
    eyceS_AplResultFlg?: boolean;
    eyceS_SubExamFlg?: boolean;
    eyceS_SubSubjectFlg?: boolean;
    // legacy keys
    ECYSES_MaxMarks?: number | string;
    ECYSES_MinMarks?: number | string;
    ECYSES_MarksEntryMax?: number | string;
    ECYSES_MarksGradeEntryFlg?: 'M' | 'G' | string;
    ECYSES_MarksDisplayFlg?: boolean;
    ECYSES_GradeDisplayFlg?: boolean;
    ECYSES_AplResultFlg?: boolean;
    ECYSES_SubExamFlg?: boolean;
    ECYSES_SubSubjectFlg?: boolean;

    // checked flag variations
    checkedvalue?: boolean;
    checkedValue?: boolean;
    checked?: boolean;

    // nested configs
    subExamConfig?: any[];
    subSubjectConfig?: any[];
    subSubjectSubExamConfig?: any[];
    exam_Subject_PT_GradeList?: any[];

    emgR_Id?: number | string;
    emgr_Id?: number | string;
    eyceS_Id?: number;
    eycE_Id?: number;
};

type NormalizedSubject = {
    ismS_Id: number;
    ismS_SubjectName?: string;
    ismS_SubjectCode?: string;
    eyceS_MaxMarks: number | '';
    eyceS_MinMarks: number | '';
    eyceS_MarksEntryMax: number | '';
    eyceS_MarksGradeEntryFlg: 'M' | 'G' | string;
    eyceS_MarksDisplayFlg: boolean;
    eyceS_GradeDisplayFlg: boolean;
    eyceS_AplResultFlg: boolean;
    eyceS_SubExamFlg: boolean;
    eyceS_SubSubjectFlg: boolean;
    checkedvalue: boolean;
    emgR_Id?: number | string;
    subExamConfig?: any[];
    subSubjectConfig?: any[];
    exam_Subject_PT_GradeList?: any[];
    eyceS_SubjectOrder?: number;
    eyceS_ActiveFlg?: boolean;
    eyceS_Id?: number;
    eycE_Id?: number;
};

// ---------- Helper utilities ----------
const coerceNumberForSchema = (val: number | '' | string | undefined): number => {
    // Zod expects numbers — empty string or undefined will be replaced by NaN so we must coerce carefully.
    if (val === '' || val === undefined || val === null) return Number.NaN;
    if (typeof val === 'number') return val;
    const n = Number(val);
    return Number.isFinite(n) ? n : Number.NaN;
};

const mapZodIssuePathToField = (path: (string | number)[]): string => {
    // zod error path might be ['eyceS_MinMarks'] or ['some','nested']
    if (path.length === 0) return '';
    return String(path[path.length - 1]);
};
const toNumOrEmpty = (v: any): number | '' => {
    if (v === '' || v === null || v === undefined) return '';
    const n = Number(v);
    return Number.isNaN(n) ? '' : n;
};

// ---------- Component ----------
export default function SubjectTableWithValidation({
    initialSubjects,
    setParentSubjects,
    showSubExamColumn = true,
    showSubSubjectColumn = true,
    onOpenSubExamModal,
    onOpenSubSubjectModal,
    onOpenSubSubjectSubExamModal,
    gradeList,
    onRegisterValidate,
    selectedGrade = 0
}: {
    initialSubjects: SubjectRowRaw[];
    setParentSubjects: (s: SubjectRowRaw[]) => void;
    showSubExamColumn?: boolean;
    showSubSubjectColumn?: boolean;
    onOpenSubExamModal: (subject: any) => void;
    onOpenSubSubjectModal: (subject: any) => void;
    onOpenSubSubjectSubExamModal: (subject: any) => void;
    onRegisterValidate?: (fn: () => boolean) => void;

    gradeList: IMasterGrade[];
    selectedGrade?: number;
}) {
    // ---------- local state ----------
    const [subjects, setSubjects] = useState<NormalizedSubject[]>([]);
    // errors: { [ismS_Id]: { fieldName: message } }
    const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});
    const isRemoteUpdate = useRef(false);

    // Global header state for checkboxes (Marks Display, Grade Display, Apply to Result)
    const [globalHeader, setGlobalHeader] = useState({
        selectAll: false,
        maxMarks: '',
        minMarks: '',
        maxEntry: '',
        subExam: false,
        subSubject: false,
        marksDisplay: false,
        gradeDisplay: false,
        applyToResult: false
    });

    // ---------- helpers ----------
    const firstDefinedNumber = (...vals: any[]) => {
        for (const v of vals) {
            if (v !== undefined && v !== null && v !== '') return Number(v);
        }
        return '';
    };

    const firstDefinedBoolean = (...vals: any[]) => {
        for (const v of vals) {
            if (v !== undefined && v !== null) return Boolean(v);
        }
        return false;
    };

    // normalize a single raw subject to a stable shape
    const normalizeSubject = (raw: SubjectRowRaw, idx = 0): NormalizedSubject => {
        const checked = Boolean(raw.checkedvalue ?? raw.checkedValue ?? raw.checked ?? false);

        const maxMarks = firstDefinedNumber(raw.eyceS_MaxMarks, raw.ECYSES_MaxMarks);
        const minMarks = firstDefinedNumber(raw.eyceS_MinMarks, raw.ECYSES_MinMarks);
        const marksEntry = firstDefinedNumber(raw.eyceS_MarksEntryMax, raw.ECYSES_MarksEntryMax);

        const marksGradeFlag = (raw.eyceS_MarksGradeEntryFlg ?? raw.ECYSES_MarksGradeEntryFlg ?? 'M') as 'M' | 'G' | string;

        const marksDisplay = firstDefinedBoolean(raw.eyceS_MarksDisplayFlg, raw.ECYSES_MarksDisplayFlg, true);
        const gradeDisplay = firstDefinedBoolean(raw.eyceS_GradeDisplayFlg, raw.ECYSES_GradeDisplayFlg, true);
        const applyToResult = firstDefinedBoolean(raw.eyceS_AplResultFlg, raw.ECYSES_AplResultFlg, true);

        const subExamFlg = firstDefinedBoolean(raw.eyceS_SubExamFlg, raw.ECYSES_SubExamFlg, false);
        const subSubjectFlg = firstDefinedBoolean(raw.eyceS_SubSubjectFlg, raw.ECYSES_SubSubjectFlg, false);

        return {
            ismS_Id: raw.ismS_Id,
            ismS_SubjectName: raw.ismS_SubjectName,
            ismS_SubjectCode: raw.ismS_SubjectCode ?? undefined,
            eyceS_MaxMarks: maxMarks,
            eyceS_MinMarks: minMarks,
            eyceS_MarksEntryMax: marksEntry,
            eyceS_MarksGradeEntryFlg: (marksGradeFlag as 'M' | 'G') ?? 'M',
            eyceS_MarksDisplayFlg: marksDisplay,
            eyceS_GradeDisplayFlg: gradeDisplay,
            eyceS_AplResultFlg: applyToResult,
            eyceS_SubExamFlg: subExamFlg,
            eyceS_SubSubjectFlg: subSubjectFlg,
            checkedvalue: checked,
            emgR_Id: raw.emgR_Id ?? raw.emgr_Id,
            subExamConfig: raw.subExamConfig ?? [],
            subSubjectConfig: raw.subSubjectConfig ?? [],
            exam_Subject_PT_GradeList: raw.exam_Subject_PT_GradeList ?? [],
            eyceS_SubjectOrder: idx + 1,
            eyceS_ActiveFlg: firstDefinedBoolean(true),
            eyceS_Id: raw.eyceS_Id ?? 0,
            eycE_Id: raw.eycE_Id ?? 0
        };
    };

    // ---------- normalize when initialSubjects changes ----------
    useEffect(() => {
        if (!Array.isArray(initialSubjects)) {
            setSubjects([]);
            return;
        }
        const normalized = initialSubjects.map((r, i) => normalizeSubject(r, i));

        if (JSON.stringify(normalized) !== JSON.stringify(subjects)) {
            isRemoteUpdate.current = true;
            setSubjects(normalized);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialSubjects]);

    // ---------- avoid repeated parent updates: only call when payload actually changes ----------
    const lastSentRef = useRef<string | null>(null);
    useEffect(() => {
        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
            return;
        }
        const mappedBack = subjects.map((s) => ({
            ismS_Id: s.ismS_Id,
            ismS_SubjectName: s.ismS_SubjectName,
            ismS_SubjectCode: s.ismS_SubjectCode,
            eyceS_MaxMarks: s.eyceS_MaxMarks === '' ? '' : String(s.eyceS_MaxMarks),
            eyceS_MinMarks: s.eyceS_MinMarks === '' ? '' : String(s.eyceS_MinMarks),
            eyceS_MarksEntryMax: s.eyceS_MarksEntryMax === '' ? '' : String(s.eyceS_MarksEntryMax),
            eyceS_MarksGradeEntryFlg: s.eyceS_MarksGradeEntryFlg,
            eyceS_MarksDisplayFlg: s.eyceS_MarksDisplayFlg,
            eyceS_GradeDisplayFlg: s.eyceS_GradeDisplayFlg,
            eyceS_AplResultFlg: s.eyceS_AplResultFlg,
            eyceS_SubExamFlg: s.eyceS_SubExamFlg,
            eyceS_SubSubjectFlg: s.eyceS_SubSubjectFlg,
            checkedvalue: s.checkedvalue,
            emgR_Id: s.emgR_Id,
            subExamConfig: s.subExamConfig,
            subSubjectConfig: s.subSubjectConfig,
            exam_Subject_PT_GradeList: s.exam_Subject_PT_GradeList,
            eyceS_SubjectOrder: s.eyceS_SubjectOrder,
            eyceS_ActiveFlg: s.eyceS_ActiveFlg,
            eyceS_Id: s.eyceS_Id,
            eycE_Id: s.eycE_Id
        }));

        const str = JSON.stringify(mappedBack);
        if (lastSentRef.current !== str) {
            lastSentRef.current = str;
            setParentSubjects(mappedBack);
        }
    }, [subjects, setParentSubjects]);

    // propagate grade changes into subjects state
    useEffect(() => {
        if (selectedGrade) {
            setSubjects((prev) => prev.map((s) => ({ ...s, emgR_Id: Number(selectedGrade) || s.emgR_Id })));
        }
    }, [selectedGrade]);

    // ---------- Derived header logic ----------
    const derivedHeader = useMemo(() => {
        if (subjects.length === 0) {
            return {
                allSelected: false,
                allSubExam: false,
                allSubSubject: false,
                allMarksDisplay: false,
                allGradeDisplay: false,
                allApplyToResult: false,
                headerMaxMarks: '',
                headerMinMarks: '',
                headerMaxEntry: ''
            };
        }

        const allSelected = subjects.every((s) => !!s.checkedvalue);
        const allSubExam = subjects.every((s) => !!s.eyceS_SubExamFlg);
        const allSubSubject = subjects.every((s) => !!s.eyceS_SubSubjectFlg);
        const allMarksDisplay = subjects.every((s) => !!s.eyceS_MarksDisplayFlg);
        const allGradeDisplay = subjects.every((s) => !!s.eyceS_GradeDisplayFlg);
        const allApplyToResult = subjects.every((s) => !!s.eyceS_AplResultFlg);

        const allMaxMarksSame = subjects.every((s) => s.eyceS_MaxMarks === subjects[0].eyceS_MaxMarks);
        const allMinMarksSame = subjects.every((s) => s.eyceS_MinMarks === subjects[0].eyceS_MinMarks);
        const allMaxEntrySame = subjects.every((s) => s.eyceS_MarksEntryMax === subjects[0].eyceS_MarksEntryMax);

        return {
            allSelected,
            allSubExam,
            allSubSubject,
            allMarksDisplay,
            allGradeDisplay,
            allApplyToResult,
            headerMaxMarks: allMaxMarksSame ? String(subjects[0]?.eyceS_MaxMarks ?? '') : '',
            headerMinMarks: allMinMarksSame ? String(subjects[0]?.eyceS_MinMarks ?? '') : '',
            headerMaxEntry: allMaxEntrySame ? String(subjects[0]?.eyceS_MarksEntryMax ?? '') : ''
        };
    }, [subjects]);

    useEffect(() => {
        setGlobalHeader((prev) => ({
            ...prev,
            selectAll: derivedHeader.allSelected,
            subExam: derivedHeader.allSubExam,
            subSubject: derivedHeader.allSubSubject,
            marksDisplay: derivedHeader.allMarksDisplay,
            gradeDisplay: derivedHeader.allGradeDisplay,
            applyToResult: derivedHeader.allApplyToResult,
            maxMarks: derivedHeader.headerMaxMarks,
            minMarks: derivedHeader.headerMinMarks,
            maxEntry: derivedHeader.headerMaxEntry
        }));
    }, [derivedHeader]);

    // ---------- Update helpers ----------
    const setSubjectChecked = (id: number, checked: boolean) => {
        setSubjects((prev) => prev.map((s) => (s.ismS_Id === id ? { ...s, checkedvalue: checked } : s)));
    };

    // Validate a single row using Zod — this returns an object mapping field->message (or empty object)
    const validateRowWithZod = (row: NormalizedSubject): Record<string, string> => {
        // Build a payload that matches the schema's expectations.
        // We must supply required numeric fields as numbers (or NaN will cause parse issues).
        // Some schema fields such as eyc_Id, emcA_Id are not present in UI; these are required by schema.
        // For safe local validation, we'll provide placeholder positive numbers for those missing required ids.
        // IMPORTANT: For final server submit, ensure the parent populates real eyc_Id / emcA_Id values.
        const payloadForZod = {
            // schema-required identifiers (we set safe >0 placeholders if missing)
            eycE_Id: Number(row.eycE_Id ?? 0),
            eyc_Id: 1, // **placeholder** — schema requires >0. In real submit, parent must include real eyc_Id.
            ismS_Id: Number(row.ismS_Id ?? 0),
            emcA_Id: 1, // **placeholder**
            emgR_Id: coerceNumberForSchema(row.emgR_Id) || 0,

            // Subject Info
            ismS_SubjectName: row.ismS_SubjectName ?? 'Unknown',
            ismS_SubjectCode: row.ismS_SubjectCode ?? 'Unknown',

            // Marks — coerce values
            eyceS_MaxMarks: coerceNumberForSchema(row.eyceS_MaxMarks),
            eyceS_MinMarks: coerceNumberForSchema(row.eyceS_MinMarks),
            eyceS_MarksEntryMax: coerceNumberForSchema(row.eyceS_MarksEntryMax),

            // Flags
            eyceS_SubExamFlg: !!row.eyceS_SubExamFlg,
            eyceS_SubSubjectFlg: !!row.eyceS_SubSubjectFlg,
            eyceS_MarksGradeEntryFlg: (row.eyceS_MarksGradeEntryFlg as 'M' | 'G') ?? 'M',
            eyceS_MarksDisplayFlg: !!row.eyceS_MarksDisplayFlg,
            eyceS_GradeDisplayFlg: !!row.eyceS_GradeDisplayFlg,
            eyceS_AplResultFlg: !!row.eyceS_AplResultFlg,

            // Order
            eyceS_SubjectOrder: Number(row.eyceS_SubjectOrder ?? 1),

            // Optional + meta (defaults)
            PT_Count: 0,
            UserId: 0,
            MI_Id: 0,
            ASMAY_Id: 0,
            ASMAY_Year: null
        };

        // Run safeParse
        const result = BaseExamSubjectSchema.addOrUpdate.safeParse(payloadForZod);

        if (result.success) {
            return {};
        }

        // Map zod issues to our error shape
        const rowErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
            const field = mapZodIssuePathToField(issue.path);
            if (!field) {
                // fallback: put generic message under eyceS_MaxMarks to show something
                rowErrors['eyceS_MaxMarks'] = issue.message;
            } else {
                rowErrors[field] = issue.message;
            }
        });

        return rowErrors;
    };

    // updateSubjectField: updates the subjects array and immediately runs validation for that row (live validation)
    const updateSubjectField = (id: number, key: keyof NormalizedSubject, value: any) => {
        setSubjects((prev) => prev.map((s) => (s.ismS_Id === id ? { ...s, [key]: value } : s)));
    };

    // handleHeaderChange (keeps behavior, and runs validation for affected rows)
    const handleHeaderChange = (field: string, value: any) => {
        setGlobalHeader((prev) => ({ ...prev, [field]: value }));

        if (field === 'selectAll') {
            setSubjects((s) => s.map((row) => ({ ...row, checkedvalue: !!value })));
            return;
            // biome-ignore lint/style/noUselessElse: <explanation>
        } else if (field === 'subExam') {
            setSubjects((s) => s.map((row) => ({ ...row, eyceS_SubExamFlg: !!value })));
            return;
            // biome-ignore lint/style/noUselessElse: <explanation>
        } else if (field === 'subSubject') {
            setSubjects((s) => s.map((row) => ({ ...row, eyceS_SubSubjectFlg: !!value })));
            return;
            // biome-ignore lint/style/noUselessElse: <explanation>
        } else if (field === 'marksDisplay') {
            setSubjects((s) => s.map((row) => ({ ...row, eyceS_MarksDisplayFlg: !!value })));
            return;
            // biome-ignore lint/style/noUselessElse: <explanation>
        } else if (field === 'gradeDisplay') {
            setSubjects((s) => s.map((row) => ({ ...row, eyceS_GradeDisplayFlg: !!value })));
            return;
            // biome-ignore lint/style/noUselessElse: <explanation>
        } else if (field === 'applyToResult') {
            setSubjects((s) => s.map((row) => ({ ...row, eyceS_AplResultFlg: !!value })));
            return;
            // biome-ignore lint/style/noUselessElse: <explanation>
        } else if (field === 'maxMarks') {
            // Bulk update and validate all rows
            const numOrEmpty = value === '' ? '' : Number(value);
            setSubjects((prev) =>
                prev.map((row) => ({
                    ...row,
                    eyceS_MaxMarks: toNumOrEmpty(value)
                }))
            );

            // run validation after state update
            setTimeout(() => {
                setErrors((prevErrs) => {
                    const copy: Record<number, Record<string, string>> = { ...prevErrs };
                    subjects.forEach((row) => {
                        const candidate = { ...row, eyceS_MaxMarks: numOrEmpty } as NormalizedSubject;
                        const rowValidation = validateRowWithZod(candidate);
                        if (Object.keys(rowValidation).length === 0) {
                            if (copy[row.ismS_Id]) delete copy[row.ismS_Id];
                        } else {
                            copy[row.ismS_Id] = { ...copy[row.ismS_Id], ...rowValidation };
                        }
                    });
                    return copy;
                });
            }, 0);

            return;
            // biome-ignore lint/style/noUselessElse: <explanation>
        } else if (field === 'minMarks') {
            const numOrEmpty = value === '' ? '' : Number(value);
            setSubjects((s) => s.map((row) => ({ ...row, eyceS_MinMarks: numOrEmpty })));

            setTimeout(() => {
                setErrors((prevErrs) => {
                    const copy: Record<number, Record<string, string>> = { ...prevErrs };
                    subjects.forEach((row) => {
                        const candidate = { ...row, eyceS_MinMarks: numOrEmpty } as NormalizedSubject;
                        const rowValidation = validateRowWithZod(candidate);
                        if (Object.keys(rowValidation).length === 0) {
                            if (copy[row.ismS_Id]) delete copy[row.ismS_Id];
                        } else {
                            copy[row.ismS_Id] = { ...copy[row.ismS_Id], ...rowValidation };
                        }
                    });
                    return copy;
                });
            }, 0);

            return;
            // biome-ignore lint/style/noUselessElse: <explanation>
        } else if (field === 'maxEntry') {
            const numOrEmpty = value === '' ? '' : Number(value);
            setSubjects((s) => s.map((row) => ({ ...row, eyceS_MarksEntryMax: numOrEmpty })));

            setTimeout(() => {
                setErrors((prevErrs) => {
                    const copy: Record<number, Record<string, string>> = { ...prevErrs };
                    subjects.forEach((row) => {
                        const candidate = { ...row, eyceS_MarksEntryMax: numOrEmpty } as NormalizedSubject;
                        const rowValidation = validateRowWithZod(candidate);
                        if (Object.keys(rowValidation).length === 0) {
                            if (copy[row.ismS_Id]) delete copy[row.ismS_Id];
                        } else {
                            copy[row.ismS_Id] = { ...copy[row.ismS_Id], ...rowValidation };
                        }
                    });
                    return copy;
                });
            }, 0);

            return;
        }
    };

    // ---------- Full-form validation using Zod (used on final submit and exposed on window) ----------
    // ✅ Validate ONLY selected subjects on Save
    const validateSelectedSubjects = (): boolean => {
        const rowErrors: Record<number, Record<string, string>> = {};

        subjects.forEach((row) => {
            // 🚫 Skip unselected rows
            if (!row.checkedvalue) return;

            const errorsForRow: Record<string, string> = {};

            // ---- REQUIRED checks for selected rows ----
            if (!row.eyceS_MaxMarks || Number(row.eyceS_MaxMarks) <= 0) {
                errorsForRow.eyceS_MaxMarks = 'Max marks is required';
            }

            if (!row.eyceS_MinMarks || Number(row.eyceS_MinMarks) <= 0) {
                errorsForRow.eyceS_MinMarks = 'Min marks is required';
            }

            if (!row.eyceS_MarksEntryMax || Number(row.eyceS_MarksEntryMax) <= 0) {
                errorsForRow.eyceS_MarksEntryMax = 'Max entry marks is required';
            }

            // ---- Cross-field validation (only if all present) ----
            if (row.eyceS_MinMarks && row.eyceS_MaxMarks && Number(row.eyceS_MinMarks) > Number(row.eyceS_MaxMarks)) {
                errorsForRow.eyceS_MinMarks = 'Min marks must be ≤ Max marks';
            }

            if (row.eyceS_MarksEntryMax && row.eyceS_MaxMarks && Number(row.eyceS_MarksEntryMax) > Number(row.eyceS_MaxMarks)) {
                errorsForRow.eyceS_MarksEntryMax = 'Max entry marks cannot exceed Max marks';
            }

            if (Object.keys(errorsForRow).length > 0) {
                rowErrors[row.ismS_Id] = errorsForRow;
            }
        });

        setErrors(rowErrors);

        return Object.keys(rowErrors).length === 0;
    };

    // expose validator to window for external trigger
    useEffect(() => {
        (window as any).validateSubjectTable = validateSelectedSubjects;
    }, [subjects]);

    // ---------- handleMapClick ----------
    const handleMapClick = (subject: any) => {
        if (subject.eyceS_SubExamFlg && subject.eyceS_SubSubjectFlg) {
            onOpenSubSubjectSubExamModal(subject);
        } else if (showSubExamColumn && subject.eyceS_SubExamFlg) {
            onOpenSubExamModal(subject);
        } else if (showSubSubjectColumn && subject.eyceS_SubSubjectFlg) {
            onOpenSubSubjectModal(subject);
        } else {
            toast.error('Enable SubExam or SubSubject for mapping first.');
        }
    };

    // ---------- small UX helpers ----------
    const renderFieldError = (rowId: number, field: string) => {
        if (!errors[rowId]) return null;
        const msg = errors[rowId][field];
        if (!msg) return null;
        return <div className='mt-1 text-red-500 text-xs'>{msg}</div>;
    };

    useEffect(() => {
        onRegisterValidate?.(validateSelectedSubjects);
    }, [onRegisterValidate, subjects]);

    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (subjects.length > 0) {
            // Scroll to the table
            tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [subjects]);
    //     const newErrors: Record<number, Record<string, string>> = {};

    //     subjects.forEach((row) => {
    //         const result = BaseExamSubjectSchema.addOrUpdate.safeParse(row);

    //         if (!result.success) {
    //             // Build an error object for this row
    //             const rowErrors: Record<string, string> = {};

    //             result.error.issues.forEach((issue) => {
    //                 const field = issue.path[0];
    //                 rowErrors[field] = issue.message;
    //             });

    //             newErrors[row.ismS_Id] = rowErrors;
    //         }
    //     });

    //     setErrors(newErrors);
    // }, [subjects]);

    // ---------- table rendering ----------
    return (
        <div className='overflow-x-auto rounded-md bg-white p-2 shadow-sm'>
            {subjects.length !== 0 && (
                <>
                    <div className='mb-3 flex items-center justify-between gap-4'>
                        <div>
                            <h3 className='font-semibold text-lg'>Subjects</h3>
                            <p className='text-slate-500 text-sm'>Select subjects and configure marks / grade settings.</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Button
                                size='sm'
                                variant='ghost'
                                onClick={() => {
                                    const ok = validateSelectedSubjects();
                                    if (ok) toast.success('All rows are valid');
                                    else toast.error('Please fix validation errors');
                                }}>
                                Validate All
                            </Button>
                        </div>
                    </div>
                    <table ref={tableRef} className='w-full table-auto border-collapse text-sm'>
                        <thead>
                            <tr className='bg-gray-50 text-left text-[13px] text-slate-700'>
                                <th className='w-10 border p-2 text-center'>SLNO</th>
                                <th className='w-16 border p-2 text-center'>
                                    <div className='flex flex-col items-center'>
                                        <div className='mb-1 text-[13px]'>Select</div>
                                        <Checkbox
                                            checked={!!globalHeader.selectAll}
                                            onCheckedChange={(v) => handleHeaderChange('selectAll', !!v)}
                                        />
                                    </div>
                                </th>
                                <th className='border p-2 text-left'>Subject Name (Code)</th>

                                <th className='w-32 border p-2 text-center'>
                                    <div className='flex flex-col items-center'>
                                        <div className='mb-1 text-[13px]'>Max. Marks</div>
                                        <Input
                                            value={
                                                globalHeader.maxMarks === '' || Number(globalHeader.maxMarks) === 0
                                                    ? ''
                                                    : globalHeader.maxMarks
                                            }
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (/^\d*$/.test(val)) handleHeaderChange('maxMarks', val);
                                            }}
                                            className='h-7 text-center text-sm'
                                            inputMode='numeric'
                                            placeholder='Max Marks'
                                        />
                                    </div>
                                </th>

                                <th className='w-28 border p-2 text-center'>
                                    <div className='flex flex-col items-center'>
                                        <div className='mb-1 text-[13px]'>Min. Marks</div>
                                        <Input
                                            value={
                                                globalHeader.minMarks === '' || Number(globalHeader.minMarks) === 0
                                                    ? ''
                                                    : globalHeader.minMarks
                                            }
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (/^\d*$/.test(val)) handleHeaderChange('minMarks', val);
                                            }}
                                            className='h-7 text-center text-sm'
                                            inputMode='numeric'
                                            placeholder='Min Marks'
                                        />
                                    </div>
                                </th>

                                <th className='w-32 border p-2 text-center'>
                                    <div className='flex flex-col items-center'>
                                        <div className='mb-1 text-[13px]'>Max. Entry Marks</div>
                                        <Input
                                            value={
                                                globalHeader.maxEntry === '' || Number(globalHeader.maxEntry) === 0
                                                    ? ''
                                                    : globalHeader.maxEntry
                                            }
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (/^\d*$/.test(val)) handleHeaderChange('maxEntry', val);
                                            }}
                                            className='h-7 text-center text-sm'
                                            inputMode='numeric'
                                            placeholder='Max Entry'
                                        />
                                    </div>
                                </th>

                                {showSubExamColumn && (
                                    <th className='w-20 border p-2 text-center'>
                                        <div className='flex flex-col items-center'>
                                            <div className='mb-1 text-[13px]'>Sub Exam</div>
                                            <Checkbox
                                                checked={!!globalHeader.subExam}
                                                onCheckedChange={(v) => handleHeaderChange('subExam', !!v)}
                                            />
                                        </div>
                                    </th>
                                )}

                                {showSubSubjectColumn && (
                                    <th className='w-20 border p-2 text-center'>
                                        <div className='flex flex-col items-center'>
                                            <div className='mb-1 text-[13px]'>Sub Subject</div>
                                            <Checkbox
                                                checked={!!globalHeader.subSubject}
                                                onCheckedChange={(v) => handleHeaderChange('subSubject', !!v)}
                                            />
                                        </div>
                                    </th>
                                )}

                                {(showSubExamColumn || showSubSubjectColumn) && <th className='w-20 border p-2 text-center'>Map</th>}

                                <th className='w-48 border p-2 text-center'>Marks / Grade</th>

                                <th className='w-20 border p-2 text-center'>
                                    <div className='flex flex-col items-center'>
                                        <div className='mb-1 text-[13px]'>Marks Display</div>
                                        <Checkbox
                                            checked={!!globalHeader.marksDisplay}
                                            onCheckedChange={(v) => handleHeaderChange('marksDisplay', !!v)}
                                        />
                                    </div>
                                </th>

                                <th className='w-20 border p-2 text-center'>
                                    <div className='flex flex-col items-center'>
                                        <div className='mb-1 text-[13px]'>Grade Display</div>
                                        <Checkbox
                                            checked={!!globalHeader.gradeDisplay}
                                            onCheckedChange={(v) => handleHeaderChange('gradeDisplay', !!v)}
                                        />
                                    </div>
                                </th>

                                <th className='w-28 border p-2 text-center'>
                                    <div className='flex flex-col items-center'>
                                        <div className='mb-1 text-[13px]'>Apply to Result</div>
                                        <Checkbox
                                            checked={!!globalHeader.applyToResult}
                                            onCheckedChange={(v) => handleHeaderChange('applyToResult', !!v)}
                                        />
                                    </div>
                                </th>

                                <th className='w-36 border p-2 text-center'>Grade</th>
                            </tr>
                        </thead>

                        <tbody>
                            {subjects.map((s, index) => {
                                // Check if marks fields are filled to enable SubExam/SubSubject checkboxes
                                const hasMaxMarks =
                                    s.eyceS_MaxMarks !== '' &&
                                    s.eyceS_MaxMarks !== null &&
                                    s.eyceS_MaxMarks !== undefined &&
                                    s.eyceS_MaxMarks !== 0;
                                const hasMinMarks =
                                    s.eyceS_MinMarks !== '' &&
                                    s.eyceS_MinMarks !== null &&
                                    s.eyceS_MinMarks !== undefined &&
                                    s.eyceS_MinMarks !== 0;
                                const hasEntryMax =
                                    s.eyceS_MarksEntryMax !== '' &&
                                    s.eyceS_MarksEntryMax !== null &&
                                    s.eyceS_MarksEntryMax !== undefined &&
                                    s.eyceS_MarksEntryMax !== 0;

                                const canToggleSubFlags = hasMaxMarks && hasMinMarks && hasEntryMax;

                                return (
                                    <tr key={s.ismS_Id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                        <td className='border p-2 text-center align-top'>{index + 1}</td>

                                        <td className='border p-2 text-center align-top'>
                                            <Checkbox
                                                checked={!!s.checkedvalue}
                                                onCheckedChange={(v) => setSubjectChecked(s.ismS_Id, !!v)}
                                            />
                                        </td>

                                        <td className='border p-2 align-top'>
                                            <div className='text-sm'>
                                                <div className='font-medium'>{s.ismS_SubjectName}</div>
                                                <div className='text-slate-500 text-xs'>{s.ismS_SubjectCode ?? ''}</div>
                                            </div>
                                        </td>

                                        {/* Max Marks */}
                                        <td className='w-28 border p-2 align-top'>
                                            <Input
                                                value={s.eyceS_MaxMarks === '' || s.eyceS_MaxMarks === 0 ? '' : String(s.eyceS_MaxMarks)}
                                                onChange={(e) => {
                                                    // allow only digits
                                                    const raw = e.target.value.replace(/\D/g, '');

                                                    updateSubjectField(s.ismS_Id, 'eyceS_MaxMarks', raw === '' ? '' : Number(raw));

                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        [s.ismS_Id]: {
                                                            ...(prev[s.ismS_Id] ?? {}),
                                                            eyceS_MinMarks: '',
                                                            eyceS_MarksEntryMax: ''
                                                        }
                                                    }));
                                                }}
                                                onBlur={() => {
                                                    const row = subjects.find((r) => r.ismS_Id === s.ismS_Id);
                                                    if (!row) return;

                                                    const rowErrors = validateRowWithZod(row);
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        [s.ismS_Id]: rowErrors
                                                    }));
                                                }}
                                                placeholder='Enter Max Marks'
                                                inputMode='numeric'
                                                className={`text-center ${errors[s.ismS_Id]?.eyceS_MaxMarks ? 'border-red-500' : ''}`}
                                            />
                                            {renderFieldError(s.ismS_Id, 'eyceS_MaxMarks')}
                                        </td>

                                        {/* Min Marks */}
                                        {/* Min Marks */}
                                        <td className='w-24 border p-2 align-top'>
                                            <Input
                                                value={s.eyceS_MinMarks === '' || s.eyceS_MinMarks === 0 ? '' : String(s.eyceS_MinMarks)}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/\D/g, '');

                                                    updateSubjectField(s.ismS_Id, 'eyceS_MinMarks', raw === '' ? '' : Number(raw));

                                                    // min only depends on max
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        [s.ismS_Id]: {
                                                            ...(prev[s.ismS_Id] ?? {}),
                                                            eyceS_MaxMarks: ''
                                                        }
                                                    }));
                                                }}
                                                onBlur={() => {
                                                    const row = subjects.find((r) => r.ismS_Id === s.ismS_Id);
                                                    if (!row) return;

                                                    const rowErrors = validateRowWithZod(row);
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        [s.ismS_Id]: rowErrors
                                                    }));
                                                }}
                                                placeholder='Enter Min Marks'
                                                inputMode='numeric'
                                                className={`text-center ${errors[s.ismS_Id]?.eyceS_MinMarks ? 'border-red-500' : ''}`}
                                            />
                                            {renderFieldError(s.ismS_Id, 'eyceS_MinMarks')}
                                        </td>

                                        {/* Max Entry */}
                                        {/* Max Entry */}
                                        <td className='w-28 border p-2 align-top'>
                                            <Input
                                                value={
                                                    s.eyceS_MarksEntryMax === '' || s.eyceS_MarksEntryMax === 0
                                                        ? ''
                                                        : String(s.eyceS_MarksEntryMax)
                                                }
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/\D/g, '');

                                                    updateSubjectField(s.ismS_Id, 'eyceS_MarksEntryMax', raw === '' ? '' : Number(raw));

                                                    // entry max only depends on max marks
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        [s.ismS_Id]: {
                                                            ...(prev[s.ismS_Id] ?? {}),
                                                            eyceS_MaxMarks: ''
                                                        }
                                                    }));
                                                }}
                                                onBlur={() => {
                                                    const row = subjects.find((r) => r.ismS_Id === s.ismS_Id);
                                                    if (!row) return;

                                                    const rowErrors = validateRowWithZod(row);
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        [s.ismS_Id]: rowErrors
                                                    }));
                                                }}
                                                placeholder='Enter Max Entry'
                                                inputMode='numeric'
                                                className={`text-center ${errors[s.ismS_Id]?.eyceS_MarksEntryMax ? 'border-red-500' : ''}`}
                                            />
                                            {renderFieldError(s.ismS_Id, 'eyceS_MarksEntryMax')}
                                        </td>

                                        {/* SubExam */}
                                        {showSubExamColumn && (
                                            <td className='border p-2 text-center align-top'>
                                                <Checkbox
                                                    checked={!!s.eyceS_SubExamFlg}
                                                    onCheckedChange={(v) => updateSubjectField(s.ismS_Id, 'eyceS_SubExamFlg', !!v)}
                                                    disabled={!canToggleSubFlags}
                                                />
                                            </td>
                                        )}

                                        {/* SubSubject */}
                                        {showSubSubjectColumn && (
                                            <td className='border p-2 text-center align-top'>
                                                <Checkbox
                                                    checked={!!s.eyceS_SubSubjectFlg}
                                                    onCheckedChange={(v) => updateSubjectField(s.ismS_Id, 'eyceS_SubSubjectFlg', !!v)}
                                                    disabled={!canToggleSubFlags}
                                                />
                                            </td>
                                        )}

                                        {/* Map Button */}
                                        {(showSubExamColumn || showSubSubjectColumn) && (
                                            <td className='border p-2 text-center align-top'>
                                                <Button
                                                    size='sm'
                                                    variant='outline'
                                                    onClick={() => handleMapClick(s)}
                                                    disabled={!canToggleSubFlags || !(s.eyceS_SubExamFlg || s.eyceS_SubSubjectFlg)}>
                                                    Map
                                                </Button>
                                            </td>
                                        )}

                                        {/* Marks / Grade options */}
                                        <td className='border p-2 align-top'>
                                            <RadioGroup
                                                value={s.eyceS_MarksGradeEntryFlg ?? 'M'}
                                                onValueChange={(val) => updateSubjectField(s.ismS_Id, 'eyceS_MarksGradeEntryFlg', val)}
                                                className='flex items-center justify-center gap-6'>
                                                <div className='flex items-center gap-2'>
                                                    <RadioGroupItem value='M' id={`marks-${s.ismS_Id}`} />
                                                    <label
                                                        htmlFor={`marks-${s.ismS_Id}`}
                                                        className='cursor-pointer select-none font-medium text-sm leading-none'>
                                                        Marks
                                                    </label>
                                                </div>

                                                <div className='flex items-center gap-2'>
                                                    <RadioGroupItem value='G' id={`grade-${s.ismS_Id}`} />
                                                    <label
                                                        htmlFor={`grade-${s.ismS_Id}`}
                                                        className='cursor-pointer select-none font-medium text-sm leading-none'>
                                                        Grade
                                                    </label>
                                                </div>
                                            </RadioGroup>
                                        </td>

                                        {/* Marks Display */}
                                        <td className='border p-2 text-center align-top'>
                                            <Checkbox
                                                checked={!!s.eyceS_MarksDisplayFlg}
                                                onCheckedChange={(v) => updateSubjectField(s.ismS_Id, 'eyceS_MarksDisplayFlg', !!v)}
                                            />
                                        </td>

                                        {/* Grade Display */}
                                        <td className='border p-2 text-center align-top'>
                                            <Checkbox
                                                checked={!!s.eyceS_GradeDisplayFlg}
                                                onCheckedChange={(v) => updateSubjectField(s.ismS_Id, 'eyceS_GradeDisplayFlg', !!v)}
                                            />
                                        </td>

                                        {/* Apply to Result */}
                                        <td className='border p-2 text-center align-top'>
                                            <Checkbox
                                                checked={!!s.eyceS_AplResultFlg}
                                                onCheckedChange={(v) => updateSubjectField(s.ismS_Id, 'eyceS_AplResultFlg', !!v)}
                                            />
                                        </td>

                                        <td className='w-44 border p-2 align-top'>
                                            <Select
                                                value={s.emgR_Id ? String(s.emgR_Id) : ''}
                                                onValueChange={(val) => {
                                                    const num = Number(val);

                                                    updateSubjectField(s.ismS_Id, 'emgR_Id', num);

                                                    // ✅ clear grade error immediately
                                                    setErrors((prev) => {
                                                        const rowErrors = prev[s.ismS_Id];
                                                        if (!rowErrors?.emgR_Id) return prev;

                                                        const { emgR_Id, ...rest } = rowErrors;

                                                        if (Object.keys(rest).length === 0) {
                                                            const { [s.ismS_Id]: _, ...remaining } = prev;
                                                            return remaining;
                                                        }

                                                        return {
                                                            ...prev,
                                                            [s.ismS_Id]: rest
                                                        };
                                                    });
                                                }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select Grade' />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {gradeList.map((g) => (
                                                        <SelectItem key={g.emgR_Id} value={String(g.emgR_Id)}>
                                                            {g.emgR_GradeName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {renderFieldError(s.ismS_Id, 'emgR_Id')}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

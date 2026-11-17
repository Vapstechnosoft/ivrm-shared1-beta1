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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { forwardRef } from 'react';
import { toast } from 'sonner';

/* Reusable Cells */
const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn(
            'whitespace-nowrap border-gray-300 border-t border-r border-b p-2 align-middle text-[#0C0A09] text-[14px]',
            className
        )}
        {...props}
    />
));
TableCell.displayName = 'TableCell';

const TableHeaderCell = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            'border border-black-300 bg-[hsl(277_90%_52%)] p-2 text-center align-middle font-medium text-sm text-white',
            className
        )}
        {...props}
    />
));
TableHeaderCell.displayName = 'TableHeaderCell';

/* ================== TYPES ================== */
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

interface Props {
    students: Student[];
    subjects: Subject[];
    isloading?: boolean;
    onUpdateMapping: (payload: Payload) => Promise<void>;
    maxApplicableSubjects?: number;
    // Additional props for payload
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
}

export interface StudentMappingTableHandle {
    reset: () => void;
}

/* ================== MAIN COMPONENT ================== */
const StudentSubjectMappingTable = forwardRef<StudentMappingTableHandle, Props>(
    (
        {
            students,
            subjects,
            onUpdateMapping,
            isloading = false,
            estsU_Id,
            // mI_Id,
            asmaY_Id,
            asmcL_Id,
            asmS_Id,
            emG_Id,
            emE_Id,
            userId,
            left_Flag,
            deactive_Flag,
            maxApplicableSubjects = 2
        },
        ref
    ) => {
        const [searchTerm, setSearchTerm] = useState('');
        const [localStudents, setLocalStudents] = useState<Student[]>([]);
        // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        const [getList, setGetList] = useState<Map<number, Set<number>>>(new Map());
        // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        const [getRemovedList, setGetRemovedList] = useState<Map<number, Set<number>>>(new Map());
        const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
        const [disabledStudents, setDisabledStudents] = useState<Set<number>>(new Set());
        const [studentToDelete, setStudentToDelete] = useState<{ id: number; name: string } | null>(null);
        const [showDeleteDialog, setShowDeleteDialog] = useState(false);

        // Track initial mappings to show delete icon only for initially mapped students
        const [initialMappedStudents, setInitialMappedStudents] = useState<Set<number>>(new Set());

        // Use refs to track changes without re-rendering
        const getListRef = useRef<Map<number, Set<number>>>(new Map());
        const getRemovedListRef = useRef<Map<number, Set<number>>>(new Map());

        // Initialize local state from props
        // Initialize local state from props (Logic extracted for reuse)
        const initializeState = useCallback(() => {
            if (students && students.length > 0) {
                setLocalStudents(students);

                // Initialize get_list from existing mappings where abc is true
                const initialGetList = new Map<number, Set<number>>();
                const initialMapped = new Set<number>();
                const initiallySelected = new Set<number>();

                students.forEach((student) => {
                    const activeSubjects = student.sub_list.filter((sub) => sub.abc).map((sub) => sub.id);

                    if (activeSubjects.length > 0) {
                        initialGetList.set(student.amsT_Id, new Set(activeSubjects));
                        initialMapped.add(student.amsT_Id);
                        // Auto-select student if they have at least one subject checked initially
                        initiallySelected.add(student.amsT_Id);
                    }
                });

                setGetList(initialGetList);
                getListRef.current = new Map(initialGetList);
                setInitialMappedStudents(initialMapped);
                setSelectedStudents(initiallySelected);

                // Initialize get_Removed_list as empty
                setGetRemovedList(new Map());
                getRemovedListRef.current = new Map();
                setDisabledStudents(new Set());
            }
        }, [students]);

        useEffect(() => {
            initializeState();
        }, [initializeState]);

        useImperativeHandle(ref, () => ({
            reset: () => {
                initializeState();
                toast.info('Grid selection reset');
            }
        }));

        /** 🔍 SEARCH FILTER */
        const normalize = (value: string) =>
            value
                .trim()
                .replace(/\s+/g, ' ') // collapse multiple spaces
                .toLowerCase();

        const filteredStudents = useMemo(() => {
            const query = normalize(searchTerm);
            if (!query) return localStudents;

            return localStudents.filter((s) => {
                const name = normalize(s.amsT_FirstName || '');
                const admNo = normalize(s.amsT_AdmNo || '');
                const rollNo = String(s.amaY_RollNo || '');

                return name.includes(query) || admNo.includes(query) || rollNo.includes(query);
            });
        }, [localStudents, searchTerm]);

        /** Get current checked state for a student-subject */
        const getCurrentCheckedState = useCallback(
            (studentId: number, subjectId: number): boolean => {
                const inRemovedList = getRemovedListRef.current.get(studentId)?.has(subjectId) || false;
                if (inRemovedList) return false;
                const inGetList = getListRef.current.get(studentId)?.has(subjectId) || false;
                if (inGetList) return true;
                const student = localStudents.find((s) => s.amsT_Id === studentId);
                if (!student) return false;

                const subject = student.sub_list.find((s) => s.id === subjectId);
                return subject?.abc || false;
            },
            [localStudents]
        );

        /** Get count of checked subjects for a student */
        const getCheckedSubjectCount = useCallback(
            (studentId: number): number => {
                let count = 0;
                subjects.forEach((subject) => {
                    if (getCurrentCheckedState(studentId, subject.id)) {
                        count++;
                    }
                });
                return count;
            },
            [subjects, getCurrentCheckedState]
        );

        /** Handle individual checkbox change */
        const handleIndividualChange = useCallback(
            async (studentId: number, subjectId: number, checked: boolean) => {
                // Check if student is selected and not disabled
                if (!selectedStudents.has(studentId) || disabledStudents.has(studentId)) return;

                // Check max applicable subjects limit
                const currentCount = getCheckedSubjectCount(studentId);
                if (checked && currentCount >= maxApplicableSubjects) {
                    toast.error(`Beyond The Max.Applicable Subjects You can't Select`);
                    return 'beyond';
                }

                // Get original state from localStudents
                const student = localStudents.find((s) => s.amsT_Id === studentId);
                if (!student) return;

                const originalSubject = student.sub_list.find((s) => s.id === subjectId);
                const wasOriginallyChecked = originalSubject?.abc || false;

                if (checked) {
                    // If we're checking the box
                    if (!wasOriginallyChecked) {
                        // Add to get_list (new addition)
                        setGetList((prev) => {
                            const newMap = new Map(prev);
                            const studentSubjects = newMap.get(studentId) || new Set<number>();
                            studentSubjects.add(subjectId);
                            newMap.set(studentId, studentSubjects);
                            getListRef.current = newMap;
                            return newMap;
                        });

                        // Remove from get_Removed_list if it was there (undoing a removal)
                        setGetRemovedList((prev) => {
                            const newMap = new Map(prev);
                            const studentSubjects = newMap.get(studentId);
                            if (studentSubjects) {
                                studentSubjects.delete(subjectId);
                                if (studentSubjects.size === 0) {
                                    newMap.delete(studentId);
                                } else {
                                    newMap.set(studentId, studentSubjects);
                                }
                            }
                            getRemovedListRef.current = newMap;
                            return newMap;
                        });
                    } else {
                        // If it was originally checked, we're just removing it from get_Removed_list (undoing removal)
                        setGetRemovedList((prev) => {
                            const newMap = new Map(prev);
                            const studentSubjects = newMap.get(studentId);
                            if (studentSubjects) {
                                studentSubjects.delete(subjectId);
                                if (studentSubjects.size === 0) {
                                    newMap.delete(studentId);
                                } else {
                                    newMap.set(studentId, studentSubjects);
                                }
                            }
                            getRemovedListRef.current = newMap;
                            return newMap;
                        });
                    }
                } else {
                    // If we're unchecking the box
                    if (wasOriginallyChecked) {
                        // Add to get_Removed_list (removing an existing mapping)
                        setGetRemovedList((prev) => {
                            const newMap = new Map(prev);
                            const studentSubjects = newMap.get(studentId) || new Set<number>();
                            studentSubjects.add(subjectId);
                            newMap.set(studentId, studentSubjects);
                            getRemovedListRef.current = newMap;
                            return newMap;
                        });

                        // Remove from get_list if it was there (undoing an addition)
                        setGetList((prev) => {
                            const newMap = new Map(prev);
                            const studentSubjects = newMap.get(studentId);
                            if (studentSubjects) {
                                studentSubjects.delete(subjectId);
                                if (studentSubjects.size === 0) {
                                    newMap.delete(studentId);
                                } else {
                                    newMap.set(studentId, studentSubjects);
                                }
                            }
                            getListRef.current = newMap;
                            return newMap;
                        });
                    } else {
                        // If it was originally unchecked, remove from get_list (undoing addition)
                        setGetList((prev) => {
                            const newMap = new Map(prev);
                            const studentSubjects = newMap.get(studentId);
                            if (studentSubjects) {
                                studentSubjects.delete(subjectId);
                                if (studentSubjects.size === 0) {
                                    newMap.delete(studentId);
                                } else {
                                    newMap.set(studentId, studentSubjects);
                                }
                            }
                            getListRef.current = newMap;
                            return newMap;
                        });
                    }
                }

                // Auto-select student if at least one subject is checked
                const newCount = checked ? currentCount + 1 : currentCount - 1;
                if (newCount > 0 && !selectedStudents.has(studentId)) {
                    setSelectedStudents((prev) => {
                        const newSet = new Set(prev);
                        newSet.add(studentId);
                        return newSet;
                    });
                } else if (newCount === 0 && selectedStudents.has(studentId)) {
                    setSelectedStudents((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(studentId);
                        return newSet;
                    });
                }

                sendUpdatePayload();
            },
            [localStudents, selectedStudents, disabledStudents, getCheckedSubjectCount, maxApplicableSubjects]
        );

        /** Toggle all subjects for all filtered students */
        const toggleSubjectAll = useCallback(
            async (subjectId: number, checked: boolean) => {
                // biome-ignore lint/correctness/noUnusedVariables: <explanation>
                const toastShown = false;

                for (const student of filteredStudents) {
                    if (!selectedStudents.has(student.amsT_Id) || disabledStudents.has(student.amsT_Id)) {
                        continue;
                    }

                    const response = await handleIndividualChange(student.amsT_Id, subjectId, checked);

                    if (response === 'beyond') {
                        break; // 🛑 STOP immediately
                    }
                }
            },
            [filteredStudents, handleIndividualChange, selectedStudents, disabledStudents]
        );

        /** Create a subject mapping object */
        const createSubjectMapping = useCallback(
            (subjectId: number, isActive: boolean): StudentSubjectMapping => {
                const now = new Date().toISOString();
                const subject = subjects.find((s) => s.id === subjectId);

                return {
                    id: subjectId,
                    name: subject?.name || `Subject ${subjectId}`,
                    estsU_ElecetiveFlag: true,
                    estsU_ActiveFlg: isActive,
                    estsU_CreatedBy: userId,
                    estsU_UpdatedBy: userId,
                    createdDate: now,
                    updatedDate: now
                };
            },
            [subjects, userId]
        );

        /** Send update payload to API */
        const sendUpdatePayload = useCallback(async () => {
            try {
                // Convert Maps to arrays for payload using refs to ensure we have latest data
                const getListArray: Array<{ amsT_Id: number; sub_list: StudentSubjectMapping[] }> = [];
                const getRemovedListArray: Array<{ amsT_Id: number; sub_list: StudentSubjectMapping[] }> = [];

                for (const [studentId, subjectIds] of getListRef.current.entries()) {
                    if (subjectIds && subjectIds.size > 0) {
                        const subList = Array.from(subjectIds).map((subjectId) => createSubjectMapping(subjectId, true));
                        getListArray.push({
                            amsT_Id: studentId,
                            sub_list: subList
                        });
                    }
                }

                for (const [studentId, subjectIds] of getRemovedListRef.current.entries()) {
                    if (subjectIds && subjectIds.size > 0) {
                        const subList = Array.from(subjectIds).map((subjectId) => createSubjectMapping(subjectId, false));
                        getRemovedListArray.push({
                            amsT_Id: studentId,
                            sub_list: subList
                        });
                    }
                }

                const payload: Payload = {
                    estsU_Id,
                    asmaY_Id,
                    asmcL_Id,
                    asmS_Id,
                    emG_Id,
                    emE_Id,
                    userId,
                    left_Flag,
                    deactive_Flag,
                    get_list: getListArray,
                    get_Removed_list: getRemovedListArray
                };

                // Send to parent
                if (onUpdateMapping) {
                    await onUpdateMapping(payload);
                }
            } catch (error) {
                console.error('Error sending update payload:', error);
            }
        }, [
            createSubjectMapping,
            estsU_Id,
            asmaY_Id,
            asmcL_Id,
            asmS_Id,
            emG_Id,
            emE_Id,
            userId,
            left_Flag,
            deactive_Flag,
            onUpdateMapping
        ]);

        /** Check if all students have this subject checked */
        const isSubjectAllChecked = useCallback(
            (subjectId: number): boolean => {
                if (filteredStudents.length === 0) return false;

                return filteredStudents.every(
                    (student) => selectedStudents.has(student.amsT_Id) && getCurrentCheckedState(student.amsT_Id, subjectId)
                );
            },
            [filteredStudents, getCurrentCheckedState, selectedStudents]
        );

        /** Handle student selection checkbox change */
        const handleStudentSelectionChange = useCallback((studentId: number, checked: boolean) => {
            setSelectedStudents((prev) => {
                const newSet = new Set(prev);
                if (checked) {
                    newSet.add(studentId);
                } else {
                    newSet.delete(studentId);
                }
                return newSet;
            });
        }, []);

        /** Handle select all students checkbox */
        const handleSelectAllStudents = useCallback(
            (checked: boolean) => {
                setSelectedStudents((prev) => {
                    const newSet = new Set(prev);
                    if (checked) {
                        filteredStudents.forEach((student) => {
                            if (!disabledStudents.has(student.amsT_Id)) {
                                newSet.add(student.amsT_Id);
                            }
                        });
                    } else {
                        filteredStudents.forEach((student) => {
                            newSet.delete(student.amsT_Id);
                        });
                    }
                    return newSet;
                });
            },
            [filteredStudents, disabledStudents]
        );

        /** Check if all filtered students are selected */
        const isAllStudentsSelected = useMemo(() => {
            if (filteredStudents.length === 0) return false;
            return filteredStudents.every((student) => selectedStudents.has(student.amsT_Id) || disabledStudents.has(student.amsT_Id));
        }, [filteredStudents, selectedStudents, disabledStudents]);

        /** Check if student has at least one subject checked */
        const hasAtLeastOneSubjectChecked = useCallback(
            (studentId: number) => {
                return getCheckedSubjectCount(studentId) > 0;
            },
            [getCheckedSubjectCount]
        );

        /** Handle delete student confirmation */
        const handleDeleteStudent = useCallback((student: Student) => {
            setStudentToDelete({ id: student.amsT_Id, name: student.amsT_FirstName });
            setShowDeleteDialog(true);
        }, []);

        /** Confirm delete student */
        const confirmDeleteStudent = useCallback(() => {
            if (studentToDelete) {
                // Disable the student row
                setDisabledStudents((prev) => {
                    const newSet = new Set(prev);
                    newSet.add(studentToDelete.id);
                    return newSet;
                });

                // Remove student from selected list
                setSelectedStudents((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(studentToDelete.id);
                    return newSet;
                });

                // Show success message
                toast.success(`Student ${studentToDelete.name} has been removed`);

                setShowDeleteDialog(false);
                setStudentToDelete(null);
            }
        }, [studentToDelete]);

        /** Check if delete icon should be shown for student */
        const shouldShowDeleteIcon = useCallback(
            (student: Student) => {
                // Only show for initially mapped students who are not already disabled
                return initialMappedStudents.has(student.amsT_Id) && !disabledStudents.has(student.amsT_Id);
            },
            [initialMappedStudents, disabledStudents]
        );

        if (isloading) {
            return (
                <div className='flex items-center justify-center p-8'>
                    <div className='text-center'>
                        <div className='mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-[hsl(277_90%_52%)] border-b-2'>
                            Loading student-subject mappings...
                        </div>
                    </div>
                </div>
            );
        }

        if (!subjects || subjects.length === 0) {
            return <div className='p-8 text-center text-gray-500'>No subjects available</div>;
        }

        if (!localStudents || localStudents.length === 0) {
            return <div className='p-8 text-center text-gray-500'>No students available</div>;
        }

        return (
            <div className='space-y-4'>
                {/* 🔎 SEARCH AND ACTIONS */}
                <div className='flex items-center justify-between border-b bg-gray-50 p-3'>
                    <div>
                        <span className='font-medium text-gray-700'>
                            Total Students: {localStudents.length} | Filtered: {filteredStudents.length}
                        </span>
                    </div>

                    <div className='flex items-center gap-3'>
                        <Input
                            placeholder='Search student by name, admission no, or roll no...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-80'
                        />
                    </div>
                </div>

                <div className='overflow-x-auto rounded border bg-white shadow-sm'>
                    <table className='min-w-full border-collapse border border-gray-300'>
                        <thead>
                            <tr>
                                <TableHeaderCell rowSpan={2}>Sl No</TableHeaderCell>
                                <TableHeaderCell rowSpan={2}>
                                    <div className='flex items-center justify-center gap-2'>
                                        <Checkbox
                                            checked={isAllStudentsSelected}
                                            onCheckedChange={(c) => handleSelectAllStudents(!!c)}
                                            className='h-5 w-5 bg-white data-[state=checked]:bg-white'
                                        />
                                        {/* <span>Select Student</span> */}
                                    </div>
                                </TableHeaderCell>
                                <TableHeaderCell rowSpan={2}>Student Details</TableHeaderCell>

                                {subjects.map((sub) => (
                                    <TableHeaderCell key={`subject-header-${sub.id}`}>
                                        <div className='flex flex-col items-center px-2'>
                                            <span className='mb-2 font-semibold text-sm'>{sub.name}</span>
                                            {/* TOGGLE ALL Column for this Subject */}
                                            <Checkbox
                                                checked={isSubjectAllChecked(sub.id)}
                                                onCheckedChange={(c) => toggleSubjectAll(sub.id, !!c)}
                                                className='h-5 w-5 bg-white data-[state=checked]:bg-white'
                                            />
                                        </div>
                                    </TableHeaderCell>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <TableCell colSpan={subjects.length + 3} className='py-8 text-center text-gray-500'>
                                        No students found matching your search criteria
                                    </TableCell>
                                </tr>
                            ) : (
                                filteredStudents.map((student, index) => {
                                    const isDisabled = disabledStudents.has(student.amsT_Id);
                                    const isSelected = selectedStudents.has(student.amsT_Id);
                                    const showDelete = shouldShowDeleteIcon(student);
                                    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
                                    const hasSubjectsChecked = hasAtLeastOneSubjectChecked(student.amsT_Id);

                                    return (
                                        <tr
                                            key={`student-${student.amsT_Id}`}
                                            className={cn(
                                                'bg-white transition-colors duration-200 hover:bg-gray-50',
                                                isDisabled && 'bg-gray-100 opacity-50'
                                            )}>
                                            <TableCell className='text-center font-medium'>{index + 1}</TableCell>
                                            <TableCell className='text-center'>
                                                <div className='flex items-center justify-center gap-2'>
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={(c) => handleStudentSelectionChange(student.amsT_Id, !!c)}
                                                        disabled={isDisabled}
                                                        className='h-5 w-5'
                                                    />
                                                    {showDelete && (
                                                        // biome-ignore lint/a11y/useButtonType: <explanation>
                                                        <button
                                                            onClick={() => handleDeleteStudent(student)}
                                                            disabled={isDisabled}
                                                            className='text-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50'
                                                            title='Remove student mappings'
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className={cn(isDisabled && 'opacity-50')}>
                                                <div className='font-semibold text-gray-800'>{student.amsT_FirstName}</div>
                                                <div className='space-y-0.5 text-gray-600 text-xs'>
                                                    <div>Admission No: {student.amsT_AdmNo}</div>
                                                    <div>Roll No: {student.amaY_RollNo}</div>
                                                    <div className='text-[10px] text-gray-400'>ID: {student.amsT_Id}</div>
                                                </div>
                                            </TableCell>

                                            {subjects.map((subject) => (
                                                <TableCell
                                                    key={`student-${student.amsT_Id}-subject-${subject.id}`}
                                                    className={cn('text-center', isDisabled && 'opacity-50')}>
                                                    <div className='flex justify-center'>
                                                        <Checkbox
                                                            checked={getCurrentCheckedState(student.amsT_Id, subject.id)}
                                                            onCheckedChange={(checked) =>
                                                                handleIndividualChange(student.amsT_Id, subject.id, !!checked)
                                                            }
                                                            disabled={!isSelected || isDisabled}
                                                        />
                                                    </div>
                                                </TableCell>
                                            ))}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>Do You Want To Remove This Record</AlertDialogDescription>
                        </AlertDialogHeader>
                        {studentToDelete && (
                            <div className='py-4'>
                                <div className='font-medium text-gray-800'>{studentToDelete.name}</div>
                                <div className='mt-2 text-gray-600 text-sm'>
                                    This action will disable the student row and you won't be able to access it anymore.
                                </div>
                            </div>
                        )}
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteStudent} className='bg-red-500 text-white hover:bg-red-600'>
                                Yes, Remove it!
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        );
    }
);

StudentSubjectMappingTable.displayName = 'StudentSubjectMappingTable';

export default StudentSubjectMappingTable;

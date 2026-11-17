'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MasterViewDetails } from '@/components/ui/set-order/generic-set-order';
import type { IMasterGrade } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, GitCompareArrows } from 'lucide-react';
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

// ----------------------------------
// Interfaces
// ----------------------------------
interface SubExamItem {
    emsE_Id: number;
    emsE_SubExamName: string;
    emsE_SubExamCode?: string;
    checkedvalue?: boolean;
    eycessS_MaxMarks?: string | number;
    eycessS_MinMarks?: string | number;
    emgR_Id?: string | number;
    eycessS_ExemptedFlg?: boolean;
    eycessS_ExemptedPer?: string | number;
    eycessS_SubSubjectOrder?: string | number;
    eycessS_ActiveFlg?: boolean;
    eycessS_GradesFlg?: boolean;
    eycessS_MarksFlg?: boolean;
    eycessS_AplResultFlg?: boolean;
    eycessS_MarksEntryMax?: string | number;
    EYCESSE_Id?: number;
    EYCESSS_Id?: number;
    emsE_SubExamOrder?: number;
}

interface FormData {
    subexam_list: SubExamItem[];
}

interface SubExamModalProps {
    open: boolean;
    subject?: any;
    onClose: (subjectId: number) => void;
    onSave: (subjectId: number, selectedList: any[], subExamList: any[]) => void;
    schema: z.ZodType<any>;
    gradeList: IMasterGrade[];
}

const ITEMS_PER_PAGE = 10;

// ----------------------------------
// Optimized Row Component
// ----------------------------------
const SubExamRow = React.memo(({
    row,
    index,
    totalIndex,
    errors,
    parentMaxMarks,
    gradeList,
    onUpdate,
    isRowChecked
}: {
    row: SubExamItem;
    index: number;
    totalIndex: number;
    errors: any;
    parentMaxMarks: number;
    gradeList: IMasterGrade[];
    onUpdate: (id: number, field: keyof SubExamItem, value: any) => void;
    isRowChecked: boolean;
}) => {
    const [localMax, setLocalMax] = useState<string>(row.eycessS_MaxMarks?.toString() || '');
    const [localMin, setLocalMin] = useState<string>(row.eycessS_MinMarks?.toString() || '');
    const [localEntry, setLocalEntry] = useState<string>(row.eycessS_MarksEntryMax?.toString() || '');
    const [localExemptedPer, setLocalExemptedPer] = useState<string>(row.eycessS_ExemptedPer?.toString() || '');

    const maxDebounceRef = useRef<NodeJS.Timeout>();
    const minDebounceRef = useRef<NodeJS.Timeout>();
    const entryDebounceRef = useRef<NodeJS.Timeout>();
    const exemptedPerDebounceRef = useRef<NodeJS.Timeout>();

    // Handle checkbox change
    const handleCheckboxChange = (checked: boolean) => {
        onUpdate(row.emsE_Id, 'checkedvalue', checked);
    };

    // Handle max marks change with debounce
    const handleMaxChange = (value: string) => {
        setLocalMax(value);
        if (maxDebounceRef.current) clearTimeout(maxDebounceRef.current);
        maxDebounceRef.current = setTimeout(() => {
            const numValue = value === '' ? '' : Number(value);
            onUpdate(row.emsE_Id, 'eycessS_MaxMarks', numValue);
        }, 50);
    };

    // Handle min marks change with debounce
    const handleMinChange = (value: string) => {
        setLocalMin(value);
        if (minDebounceRef.current) clearTimeout(minDebounceRef.current);
        minDebounceRef.current = setTimeout(() => {
            const numValue = value === '' ? '' : Number(value);
            onUpdate(row.emsE_Id, 'eycessS_MinMarks', numValue);
        }, 50);
    };

    // Handle entry marks change with debounce
    const handleEntryChange = (value: string) => {
        setLocalEntry(value);
        if (entryDebounceRef.current) clearTimeout(entryDebounceRef.current);
        entryDebounceRef.current = setTimeout(() => {
            const numValue = value === '' ? '' : Number(value);
            onUpdate(row.emsE_Id, 'eycessS_MarksEntryMax', numValue);
        }, 50);
    };

    // Handle grade change (immediate)
    const handleGradeChange = (value: string) => {
        onUpdate(row.emsE_Id, 'emgR_Id', value);
    };

    // Handle exempted change (immediate)
    const handleExemptedChange = (checked: boolean) => {
        onUpdate(row.emsE_Id, 'eycessS_ExemptedFlg', checked);
        if (!checked) {
            setLocalExemptedPer('');
            onUpdate(row.emsE_Id, 'eycessS_ExemptedPer', '');
        }
    };

    // Handle exempted percentage change with debounce
    const handleExemptedPerChange = (value: string) => {
        setLocalExemptedPer(value);
        if (exemptedPerDebounceRef.current) clearTimeout(exemptedPerDebounceRef.current);
        exemptedPerDebounceRef.current = setTimeout(() => {
            const numValue = value === '' ? '' : Number(value);
            onUpdate(row.emsE_Id, 'eycessS_ExemptedPer', numValue);
        }, 50);
    };

    // Handle flag changes (immediate)
    const handleMarksFlagChange = (checked: boolean) => onUpdate(row.emsE_Id, 'eycessS_MarksFlg', checked);
    const handleGradesFlagChange = (checked: boolean) => onUpdate(row.emsE_Id, 'eycessS_GradesFlg', checked);
    const handleAplResultChange = (checked: boolean) => onUpdate(row.emsE_Id, 'eycessS_AplResultFlg', checked);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (maxDebounceRef.current) clearTimeout(maxDebounceRef.current);
            if (minDebounceRef.current) clearTimeout(minDebounceRef.current);
            if (entryDebounceRef.current) clearTimeout(entryDebounceRef.current);
            if (exemptedPerDebounceRef.current) clearTimeout(exemptedPerDebounceRef.current);
        };
    }, []);

    // Update local state when row props change
    useEffect(() => {
        setLocalMax(row.eycessS_MaxMarks?.toString() || '');
        setLocalMin(row.eycessS_MinMarks?.toString() || '');
        setLocalEntry(row.eycessS_MarksEntryMax?.toString() || '');
        setLocalExemptedPer(row.eycessS_ExemptedPer?.toString() || '');
    }, [row.eycessS_MaxMarks, row.eycessS_MinMarks, row.eycessS_MarksEntryMax, row.eycessS_ExemptedPer]);

    return (
        <tr className={totalIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
            <td className='border p-2 text-center'>{totalIndex + 1}</td>

            {/* Checkbox */}
            <td className='border p-2 text-center'>
                <Checkbox
                    checked={!!row.checkedvalue}
                    onCheckedChange={handleCheckboxChange}
                />
            </td>

            {/* Sub-Exam Name (Code) */}
            <td className='border p-2 text-left'>
                <div className='text-sm'>
                    <div className='font-medium'>{row.emsE_SubExamName}</div>
                    {row.emsE_SubExamCode && (
                        <div className='text-slate-500 text-xs'>{row.emsE_SubExamCode}</div>
                    )}
                </div>
            </td>

            {/* Max Marks */}
            <td className='w-28 border p-2'>
                <Input
                    type='text'
                    value={localMax}
                    disabled={!isRowChecked}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        handleMaxChange(raw === '' ? '' : raw);
                    }}
                    className={errors?.eycessS_MaxMarks ? 'border-red-500 text-center' : 'text-center'}
                    placeholder='Enter Max Marks'
                    inputMode='numeric'
                />
                {errors?.eycessS_MaxMarks && (
                    <p className='mt-1 text-[11px] text-red-500'>{String(errors.eycessS_MaxMarks)}</p>
                )}
            </td>

            {/* Min Marks */}
            <td className='w-28 border p-2'>
                <Input
                    type='text'
                    value={localMin}
                    disabled={!isRowChecked}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        handleMinChange(raw === '' ? '' : raw);
                    }}
                    className={errors?.eycessS_MinMarks ? 'border-red-500 text-center' : 'text-center'}
                    placeholder='Enter Min Marks'
                    inputMode='numeric'
                />
                {errors?.eycessS_MinMarks && (
                    <p className='mt-1 text-[11px] text-red-500'>{String(errors.eycessS_MinMarks)}</p>
                )}
            </td>

            {/* Marks Entry Max */}
            <td className='w-28 border p-2'>
                <Input
                    type='text'
                    value={localEntry}
                    disabled={!isRowChecked}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        handleEntryChange(raw === '' ? '' : raw);
                    }}
                    className={errors?.eycessS_MarksEntryMax ? 'border-red-500 text-center' : 'text-center'}
                    placeholder='Enter Max Entry'
                    inputMode='numeric'
                />
                {errors?.eycessS_MarksEntryMax && (
                    <p className='mt-1 text-[11px] text-red-500'>{String(errors.eycessS_MarksEntryMax)}</p>
                )}
            </td>

            {/* Grade */}
            <td className='w-40 border p-2'>
                <Select
                    value={row.emgR_Id?.toString() ?? ''}
                    disabled={!isRowChecked}
                    onValueChange={handleGradeChange}
                >
                    <SelectTrigger className={errors?.emgR_Id ? 'border-red-500' : ''}>
                        <SelectValue placeholder='Select Grade' />
                    </SelectTrigger>
                    <SelectContent>
                        {gradeList.map((g) => (
                            <SelectItem key={g.emgR_Id} value={g.emgR_Id.toString()}>
                                {g.emgR_GradeName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors?.emgR_Id && (
                    <p className='mt-1 text-[11px] text-red-500'>{String(errors.emgR_Id)}</p>
                )}
            </td>

            {/* Exempted */}
            <td className='border p-2 text-center'>
                <Checkbox
                    checked={!!row.eycessS_ExemptedFlg}
                    onCheckedChange={handleExemptedChange}
                />
            </td>

            {/* Exempt % */}
            <td className='w-24 border p-2'>
                <Input
                    type='text'
                    disabled={!row.eycessS_ExemptedFlg}
                    value={localExemptedPer}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        handleExemptedPerChange(raw === '' ? '' : raw);
                    }}
                    className='text-center'
                    placeholder='%'
                    inputMode='numeric'
                />
            </td>

            {/* Marks Flag */}
            <td className='border p-2 text-center'>
                <Checkbox
                    checked={!!row.eycessS_MarksFlg}
                    onCheckedChange={handleMarksFlagChange}
                />
            </td>

            {/* Grades Flag */}
            <td className='border p-2 text-center'>
                <Checkbox
                    checked={!!row.eycessS_GradesFlg}
                    onCheckedChange={handleGradesFlagChange}
                />
            </td>

            {/* Apl Result */}
            <td className='border p-2 text-center'>
                <Checkbox
                    checked={!!row.eycessS_AplResultFlg}
                    onCheckedChange={handleAplResultChange}
                />
            </td>
        </tr>
    );
});

SubExamRow.displayName = 'SubExamRow';

// ----------------------------------
// Main Component with Optimized Updates
// ----------------------------------
export default function SubExamModal({ open, subject, onClose, onSave, schema, gradeList }: SubExamModalProps) {
    const methods = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { subexam_list: [] },
        mode: 'onChange'
    });

    const { control, reset, getValues, setValue, formState, setError, clearErrors, watch } = methods;
    const { errors } = formState;

    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
    const [isOrderSaving, setIsOrderSaving] = useState(false);
    const [isOrderloading, setIsOrderloading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [validationErrors, setValidationErrors] = useState<Record<number, any>>({});

    // Store data in ref for immediate access
    const dataRef = useRef<Map<number, SubExamItem>>(new Map());
    const validationErrorsRef = useRef<Record<number, any>>({});

    // Get form data
    const formData = watch('subexam_list') || [];

    // Parent max marks
    const parentMaxMarks = useMemo(() => Number(subject?.eyceS_MaxMarks ?? 0), [subject]);

    // ----------------------------------
    // Populate initial list
    // ----------------------------------
    useEffect(() => {
        if (!open) return;

        if (!subject) {
            reset({ subexam_list: [] });
            dataRef.current.clear();
            setValidationErrors({});
            validationErrorsRef.current = {};
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            const rawList = subject.list ?? [];

            const list = rawList.map((l: any) => ({
                ...l,
                emsE_Id: l.emsE_Id,
                emsE_SubExamName: l.emsE_SubExamName,
                emsE_SubExamCode: l.emsE_SubExamCode,
                checkedvalue: Boolean(l.checkedvalue),
                eycessS_MaxMarks: l.eycessS_MaxMarks ?? '',
                eycessS_MinMarks: l.eycessS_MinMarks ?? '',
                emgR_Id: l.emgR_Id ?? '',
                eycessS_ExemptedFlg: !!l.eycessS_ExemptedFlg,
                eycessS_ExemptedPer: l.eycessS_ExemptedPer ?? '',
                eycessS_ActiveFlg: !!l.eycessS_ActiveFlg,
                eycessS_GradesFlg: !!l.eycessS_GradesFlg,
                eycessS_MarksFlg: !!l.eycessS_MarksFlg,
                eycessS_AplResultFlg: !!l.eycessS_AplResultFlg,
                eycessS_MarksEntryMax: l.eycessS_MarksEntryMax ?? '',
                emsE_SubExamOrder: l.emsE_SubExamOrder
            }));

            //  SORT HERE 
            const sortedList = [...list].sort(
                (a, b) =>
                    Number(a.emsE_SubExamOrder ?? 0) -
                    Number(b.emsE_SubExamOrder ?? 0)
            );

            // Update ref
            dataRef.current = new Map(
                sortedList.map(item => [item.emsE_Id, item])
            );

            // Update form
            reset({ subexam_list: sortedList });

            setValidationErrors({});
            validationErrorsRef.current = {};
            setIsLoading(false);
        }, 0);
    }, [open, subject, reset]);

    // Filtered data (memoized)
    const filteredData = useMemo(() => {
        const allData = formData || [];
        const term = searchTerm.trim().toLowerCase();
        if (!term) return allData;
        return allData.filter((item) => {
            return (
                (item.emsE_SubExamName ?? '').toString().toLowerCase().includes(term) ||
                (item.emsE_SubExamCode ?? '').toString().toLowerCase().includes(term)
            );
        });
    }, [formData, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));

    useEffect(() => {
        setCurrentPage((p) => Math.min(Math.max(1, p), totalPages));
    }, [totalPages]);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length);
    const paginatedData = useMemo(() => filteredData.slice(startIndex, endIndex), [filteredData, startIndex, endIndex]);

    // ----------------------------------
    // Optimized Update Function using emsE_Id
    // ----------------------------------
    const updateRowValue = useCallback((emsE_Id: number, field: keyof SubExamItem, value: any) => {
        // Find the index of the item with this emsE_Id
        const currentList = getValues('subexam_list') || [];
        const itemIndex = currentList.findIndex(item => item.emsE_Id === emsE_Id);

        if (itemIndex === -1) return;

        // Update the value in the form
        setValue(`subexam_list.${itemIndex}.${field}`, value, {
            shouldDirty: true,
            shouldValidate: false
        });

        // Update the ref
        const currentItem = dataRef.current.get(emsE_Id);
        if (currentItem) {
            dataRef.current.set(emsE_Id, {
                ...currentItem,
                [field]: value
            });
        }

        // Validate the field
        validateField(emsE_Id, field, value);
    }, [getValues, setValue]);

    // ----------------------------------
    // Validation Functions
    // ----------------------------------
    const validateField = useCallback((emsE_Id: number, field: keyof SubExamItem, value: any) => {
        const item = dataRef.current.get(emsE_Id);
        if (!item) return;

        const currentList = getValues('subexam_list') || [];
        const itemIndex = currentList.findIndex(item => item.emsE_Id === emsE_Id);

        let error = '';
        const numValue = value === '' ? undefined : Number(value);

        // Validation based on field
        switch (field) {
            case 'eycessS_MaxMarks': {
                if (numValue !== undefined && numValue > subject.eycessS_MaxMarks) {
                    error = `Max marks cannot exceed parent subject max (${subject.eycessS_MaxMarks})`;
                }
                // Validate against min marks
                const minVal = item.eycessS_MinMarks === '' ? undefined : Number(item.eycessS_MinMarks);
                if (minVal !== undefined && numValue !== undefined && minVal > numValue) {
                    error = 'Max marks cannot be less than Min marks';
                }
                break;
            }

            case 'eycessS_MinMarks': {
                if (numValue !== undefined && numValue > subject.eycessS_MinMarks) {
                    error = `Min marks cannot exceed parent subject max (${subject.eycessS_MinMarks})`;
                }
                // Validate against max marks
                const maxVal = item.eycessS_MaxMarks === '' ? undefined : Number(item.eycessS_MaxMarks);
                if (maxVal !== undefined && numValue !== undefined && numValue > maxVal) {
                    error = 'Min marks cannot be greater than Max marks';
                }
                break;
            }

            case 'eycessS_MarksEntryMax':
                if (numValue !== undefined && numValue > subject.eycessS_MarksEntryMax) {
                    error = `Marks entry max cannot exceed parent subject max (${subject.eycessS_MarksEntryMax})`;
                }
                // Validate against max marks
                // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
                const maxVal2 = item.eycessS_MaxMarks === '' ? undefined : Number(item.eycessS_MaxMarks);
                if (maxVal2 !== undefined && numValue !== undefined && numValue > maxVal2) {
                    error = 'Marks entry max cannot be greater than Max marks';
                }
                break;

            case 'emgR_Id':
                if (item.checkedvalue && (!value || value === '')) {
                    error = 'Grade is required';
                }
                break;

            case 'checkedvalue':
                if (value) {
                    // If checked, validate required fields
                    if (!item.eycessS_MaxMarks || item.eycessS_MaxMarks === '') {
                        setValidationErrors(prev => ({
                            ...prev,
                            [emsE_Id]: {
                                ...prev[emsE_Id],
                                eycessS_MaxMarks: 'Max marks is required'
                            }
                        }));
                    }
                    if (!item.eycessS_MinMarks || item.eycessS_MinMarks === '') {
                        setValidationErrors(prev => ({
                            ...prev,
                            [emsE_Id]: {
                                ...prev[emsE_Id],
                                eycessS_MinMarks: 'Min marks is required'
                            }
                        }));
                    }
                    if (!item.eycessS_MarksEntryMax || item.eycessS_MarksEntryMax === '') {
                        setValidationErrors(prev => ({
                            ...prev,
                            [emsE_Id]: {
                                ...prev[emsE_Id],
                                eycessS_MarksEntryMax: 'Marks entry max is required'
                            }
                        }));
                    }
                    if (!item.emgR_Id || item.emgR_Id === '') {
                        setValidationErrors(prev => ({
                            ...prev,
                            [emsE_Id]: {
                                ...prev[emsE_Id],
                                emgR_Id: 'Grade is required'
                            }
                        }));
                    }
                } else {
                    // If unchecked, clear errors for this row
                    setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors[emsE_Id];
                        return newErrors;
                    });
                }
                break;
        }

        // Update validation errors
        if (error) {
            setValidationErrors(prev => ({
                ...prev,
                [emsE_Id]: {
                    ...prev[emsE_Id],
                    [field]: error
                }
            }));
        } else {
            setValidationErrors(prev => {
                if (!prev[emsE_Id]) return prev;
                const newErrors = { ...prev[emsE_Id] };
                delete newErrors[field];
                if (Object.keys(newErrors).length === 0) {
                    const newState = { ...prev };
                    delete newState[emsE_Id];
                    return newState;
                }
                return {
                    ...prev,
                    [emsE_Id]: newErrors
                };
            });
        }
    }, [parentMaxMarks, getValues]);

    // ----------------------------------
    // Set Order Functions
    // ----------------------------------
    const handleSetOrder = useCallback(() => {
        const currentList = getValues('subexam_list');
        if (!currentList || currentList.length === 0) {
            toast.info('Sub-exams are still loading...');
            return;
        }
        setIsOrderDetailsOpen(true);
        setIsOrderloading(false);
    }, [getValues]);

    const handleOrderSave = useCallback(async (updatedData: any) => {
        setIsOrderSaving(true);

        setTimeout(() => {
            const currentList = getValues('subexam_list') ?? [];
            const currentMap = new Map(currentList.map(item => [item.emsE_Id, item]));

            // Build the reordered list preserving ALL original values
            const reorderedList = (updatedData ?? []).map((updatedItem: any, index: number) => {
                const itemId = updatedItem.emsE_Id || updatedItem.id;
                const existingItem = currentMap.get(itemId);

                if (existingItem) {
                    return {
                        ...existingItem,
                        emsE_SubExamOrder: index + 1
                    };
                }

                return {
                    ...updatedItem,
                    emsE_Id: itemId,
                    emsE_SubExamOrder: index + 1,
                    emgR_Id: updatedItem.emgR_Id || ''
                };
            });

            // Update ref with new order
            reorderedList.forEach((item: SubExamItem) => {
                dataRef.current.set(item.emsE_Id, item);
            });

            // Update form
            setValue('subexam_list', reorderedList, { shouldDirty: true, shouldValidate: false });

            toast.success('Sub-Exam order saved successfully.');
            setIsOrderSaving(false);
            setIsOrderDetailsOpen(false);
        }, 0);
    }, [getValues, setValue]);

    const closeOrderDetails = useCallback(() => {
        setIsOrderDetailsOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // ----------------------------------
    // Save Handler
    // ----------------------------------
    const handleSave = useCallback(() => {
        const currentList = getValues('subexam_list') || [];
        const selected = currentList.filter((r) => r.checkedvalue);

        // Validate all selected rows
        let hasErrors = false;
        const newErrors: Record<number, any> = {};

        selected.forEach((row) => {
            const rowErrors: any = {};
            const max = Number(row.eycessS_MaxMarks) || 0;
            const min = Number(row.eycessS_MinMarks) || 0;
            const entry = Number(row.eycessS_MarksEntryMax) || 0;

            // Required fields
            if (!row.eycessS_MaxMarks || row.eycessS_MaxMarks === '') {
                rowErrors.eycessS_MaxMarks = 'Max marks is required';
                hasErrors = true;
            }
            if (!row.eycessS_MinMarks || row.eycessS_MinMarks === '') {
                rowErrors.eycessS_MinMarks = 'Min marks is required';
                hasErrors = true;
            }
            if (!row.eycessS_MarksEntryMax || row.eycessS_MarksEntryMax === '') {
                rowErrors.eycessS_MarksEntryMax = 'Marks entry max is required';
                hasErrors = true;
            }
            if (!row.emgR_Id || row.emgR_Id === '') {
                rowErrors.emgR_Id = 'Grade is required';
                hasErrors = true;
            }

            // Numeric validation
            if (max > parentMaxMarks) {
                rowErrors.eycessS_MaxMarks = `Max marks cannot exceed parent subject max (${parentMaxMarks})`;
                hasErrors = true;
            }
            if (min > parentMaxMarks) {
                rowErrors.eycessS_MinMarks = `Min marks cannot exceed parent subject max (${parentMaxMarks})`;
                hasErrors = true;
            }
            if (entry > parentMaxMarks) {
                rowErrors.eycessS_MarksEntryMax = `Marks entry max cannot exceed parent subject max (${parentMaxMarks})`;
                hasErrors = true;
            }
            if (min > max) {
                rowErrors.eycessS_MinMarks = 'Min marks cannot be greater than Max marks';
                hasErrors = true;
            }
            if (entry > max) {
                rowErrors.eycessS_MarksEntryMax = 'Marks entry max cannot be greater than Max marks';
                hasErrors = true;
            }

            if (Object.keys(rowErrors).length > 0) {
                newErrors[row.emsE_Id] = rowErrors;
            }
        });

        if (hasErrors) {
            setValidationErrors(newErrors);
            toast.error('Please fix validation errors before saving.');
            return;
        }

        if (selected.length === 0) {
            toast.error('Select at least one sub-exam before saving.');
            return;
        }

        const parentMax = Number(subject?.eyceS_MaxMarks ?? 0);
        const parentMin = Number(subject?.eyceS_MinMarks ?? 0);
        const totMax = selected.reduce((acc, cur) => acc + Number(cur.eycessS_MaxMarks || 0), 0);
        const totMin = selected.reduce((acc, cur) => acc + Number(cur.eycessS_MinMarks || 0), 0);

        if (selected.length > 0 && (totMax !== parentMax || totMin !== parentMin)) {
            toast.error(
                `Sum of selected sub-exams (Max: ${totMax}, Min: ${totMin}) must equal subject marks (Max: ${parentMax}, Min: ${parentMin})`
            );
            return;
        }

        const formatted = selected.map((r, index) => ({
            eycessE_Id: r.EYCESSE_Id ?? 0,
            eyceS_Id: subject.eyceS_Id,
            emsE_Id: r.emsE_Id,
            emgR_Id: Number(r.emgR_Id) || null,
            eycessS_MaxMarks: Number(r.eycessS_MaxMarks) || 0,
            eycessS_MinMarks: Number(r.eycessS_MinMarks) || 0,
            eycessS_ExemptedFlg: !!r.eycessS_ExemptedFlg,
            eycessS_ExemptedPer: Number(r.eycessS_ExemptedPer) || 0,
            eycessS_ActiveFlg: !!r.eycessS_ActiveFlg,
            emsE_SubExamOrder: index + 1,
            eycessS_SubSubjectOrder: index + 1,
            eycessS_MarksFlg: !!r.eycessS_MarksFlg,
            eycessS_GradesFlg: !!r.eycessS_GradesFlg,
            eycessS_AplResultFlg: !!r.eycessS_AplResultFlg,
            eycessS_MarksEntryMax: Number(r.eycessS_MarksEntryMax) || 0
        }));

        onSave(subject.ismS_Id, formatted, currentList);
    }, [getValues, subject, parentMaxMarks, onSave]);

    const renderSkeletonTable = () => (
        <div className='w-full rounded-md'>
            <table className='w-full table-auto border-collapse border border-gray-200'>
                <tbody>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i} className='hover:bg-transparent'>
                            {Array.from({ length: 12 }).map((_, j) => (
                                <td key={j} className='border px-3 py-2'>
                                    <div className='h-6 w-full animate-pulse rounded bg-slate-200' />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // ----------------------------------
    // Loading States
    // ----------------------------------
    if (!open) return null;

    if (open && !subject) {
        return (
            <Dialog open={open} onOpenChange={(val) => !val && onClose(0)}>
                <DialogContent className='max-h-[80vh] w-full min-w-[80vw] overflow-hidden pt-0'>
                    <DialogHeader className='bg-white pt-4'>
                        <DialogTitle>Loading Sub-Exams...</DialogTitle>
                        <DialogDescription>Please wait while we load the data</DialogDescription>
                    </DialogHeader>
                    <div className='flex h-[400px] items-center justify-center'>
                        <div className='text-center'>
                            <div className='mx-auto h-12 w-12 animate-spin rounded-full border-blue-500 border-t-2 border-b-2'>.</div>
                            <p className='mt-4 text-muted-foreground'>Loading sub-exam data...</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={(val) => !val && onClose(subject?.ismS_Id)}>
                <DialogContent className='max-h-[80vh] w-full min-w-[80vw] overflow-hidden pt-0'>
                    <DialogHeader className='bg-white pt-4'>
                        <DialogTitle>{`Map Sub-Exam — ${subject?.ismS_SubjectName}`}</DialogTitle>
                        <DialogDescription>Loading sub-exam details...</DialogDescription>
                    </DialogHeader>
                    <div className='max-h-[55vh] overflow-auto'>
                        {renderSkeletonTable()}
                    </div>
                    <div className='z-10 mt-4 flex w-fit justify-end gap-2 border-t bg-white p-2'>
                        <Button type='button' variant='ghost' disabled>
                            Cancel
                        </Button>
                        <Button type='button' disabled className='w-fit'>
                            <GitCompareArrows className='h-4 w-4' />
                            Set Order
                        </Button>
                        <Button type='button' className='w-fit' disabled>
                            Save & Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!subject) return null;

    // ----------------------------------
    // Main Render
    // ----------------------------------
    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose(subject.ismS_Id)}>
            <DialogContent className='flex h-[90vh] w-full min-w-[80vw] flex-col overflow-hidden pt-0'>
                <DialogHeader className='shrink-0 border-b bg-white pt-4 pb-2'>
                    <DialogTitle>{`Map Sub-Exam — ${subject.ismS_SubjectName}`}</DialogTitle>
                    <DialogDescription>Fill details and save mapping</DialogDescription>
                </DialogHeader>

                {/* Search & pagination controls */}
                <div className='flex shrink-0 items-center justify-between border-b bg-white p-2'>
                    <div className='text-muted-foreground text-sm'>
                        Showing {filteredData.length === 0 ? 0 : startIndex + 1}-{endIndex} of {filteredData.length} items
                    </div>
                    <Input
                        placeholder='Search sub-exam...'
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className='w-64'
                    />
                </div>

                <FormProvider {...methods}>
                    {/* Table container */}
                    <div className='flex flex-1 flex-col overflow-hidden'>
                        <div className='flex-1 overflow-x-auto overflow-y-auto'>
                            <table className='w-full table-auto border-collapse'>
                                <thead className='sticky top-0 z-10 bg-slate-50 text-sm'>
                                    <tr>
                                        <th className='border bg-slate-50 p-2'>SLNO</th>
                                        <th className='border bg-slate-50 p-2'>Select</th>
                                        <th className='border bg-slate-50 p-2'>Sub-Exam (Code)</th>
                                        <th className='border bg-slate-50 p-2'>Max Marks</th>
                                        <th className='border bg-slate-50 p-2'>Min Marks</th>
                                        <th className='border bg-slate-50 p-2'>Marks Entry Max</th>
                                        <th className='border bg-slate-50 p-2'>Grade</th>
                                        <th className='border bg-slate-50 p-2'>Exempted</th>
                                        <th className='border bg-slate-50 p-2'>Exempt %</th>
                                        <th className='border bg-slate-50 p-2'>Marks Flag</th>
                                        <th className='border bg-slate-50 p-2'>Grades Flag</th>
                                        <th className='border bg-slate-50 p-2'>Apl Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subject && subject.list === undefined && (
                                        <tr>
                                            <td colSpan={12} className='p-6'>
                                                {renderSkeletonTable()}
                                            </td>
                                        </tr>
                                    )}

                                    {subject?.list?.length === 0 && (
                                        <tr>
                                            <td colSpan={12} className='py-6 text-center text-muted-foreground text-sm'>
                                                No records found.
                                            </td>
                                        </tr>
                                    )}

                                    {paginatedData.map((row, i) => (
                                        <SubExamRow
                                            key={row.emsE_Id}
                                            row={row}
                                            index={i}
                                            totalIndex={startIndex + i}
                                            errors={validationErrors[row.emsE_Id] || {}}
                                            parentMaxMarks={parentMaxMarks}
                                            gradeList={gradeList}
                                            onUpdate={updateRowValue}
                                            isRowChecked={!!row.checkedvalue}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination Footer */}
                    {totalPages > 1 && (
                        <div className='flex shrink-0 items-center justify-end space-x-2 border-t bg-white p-4'>
                            <Button variant='outline' size='sm' onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                                First
                            </Button>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}>
                                <ChevronLeft className='h-4 w-4' />
                                Previous
                            </Button>

                            <div className='flex items-center space-x-1'>
                                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? 'default' : 'outline'}
                                            size='sm'
                                            className='h-8 w-8 p-0'
                                            onClick={() => setCurrentPage(pageNum)}>
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}>
                                Next
                                <ChevronLeft className='h-4 w-4 rotate-180' />
                            </Button>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}>
                                Last
                            </Button>
                        </div>
                    )}

                    {/* Footer Buttons */}
                    <div className='ml-auto flex w-fit shrink-0 justify-end gap-2 border-t bg-white p-2'>
                        <Button type='button' variant='ghost' onClick={() => onClose(subject.ismS_Id)}>
                            Cancel
                        </Button>
                        <Button
                            type='button'
                            onClick={handleSetOrder}
                            className='w-fit transition-all duration-200 hover:scale-90'
                            disabled={formData.length === 0}>
                            <GitCompareArrows className='h-4 w-4 transition-transform duration-200 group-hover:rotate-90' />
                            Set Order
                        </Button>
                        <Button type='button' className='w-fit' onClick={handleSave}>
                            Save & Close
                        </Button>
                    </div>
                </FormProvider>

                {/* Order Modal */}
                {isOrderDetailsOpen && (
                    <MasterViewDetails
                        isOpen={isOrderDetailsOpen}
                        onClose={closeOrderDetails}
                        data={formData.map((d) => ({ ...d, id: d.emsE_Id }))}
                        isLoading={isOrderloading}
                        isSaving={isOrderSaving}
                        columns={[
                            { key: 'id', label: 'SLNO', className: 'text-center w-12' },
                            { key: 'emsE_SubExamName', label: 'Sub-Exam Name', className: 'text-left' },
                            { key: 'emsE_SubExamCode', label: 'Sub-Exam Code', className: 'text-left' },
                            { key: 'emsE_SubExamOrder', label: 'Order', className: 'text-left' }
                        ]}
                        onSave={handleOrderSave}
                        tableHeight='500px'
                        title='Set Sub-Exam Order'
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MasterViewDetails } from '@/components/ui/set-order/generic-set-order';
import type { IMasterGrade } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, GitCompareArrows } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type SubSubject = {
    emsS_Id: number;
    emsS_SubSubjectName: string;
    emsS_SubSubjectCode?: string;
    checkedvalue?: boolean;
    eycessS_MaxMarks?: number | '';
    eycessS_MinMarks?: number | '';
    eycessS_MarksEntryMax?: number | '';
    emgR_Id?: string | number;
    eycessS_ExemptedFlg?: boolean;
    eycessS_ExemptedPer?: number | '';
    eycessS_MarksDisplayFlg?: boolean;
    eycessS_GradeDisplayFlg?: boolean;
    eycessS_AplResultFlg?: boolean;
    eycessS_SubSubjectOrder?: number;
};

type SubSubjectFormValues = {
    subsubject_list: SubSubject[];
};

const ITEMS_PER_PAGE = 10;

// ----------------------------------
// Optimized Row Component
// ----------------------------------
const SubSubjectRow = React.memo(({
    row,
    index,
    totalIndex,
    errors,
    gradeList,
    onUpdate,
    isRowChecked
}: {
    row: SubSubject;
    index: number;
    totalIndex: number;
    errors: any;
    gradeList: IMasterGrade[];
    onUpdate: (id: number, field: keyof SubSubject, value: any) => void;
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
        onUpdate(row.emsS_Id, 'checkedvalue', checked);
    };

    // Handle max marks change with debounce
    const handleMaxChange = (value: string) => {
        setLocalMax(value);
        if (maxDebounceRef.current) clearTimeout(maxDebounceRef.current);
        maxDebounceRef.current = setTimeout(() => {
            const numValue = value === '' ? '' : Number(value);
            onUpdate(row.emsS_Id, 'eycessS_MaxMarks', numValue);
        }, 50);
    };

    // Handle min marks change with debounce
    const handleMinChange = (value: string) => {
        setLocalMin(value);
        if (minDebounceRef.current) clearTimeout(minDebounceRef.current);
        minDebounceRef.current = setTimeout(() => {
            const numValue = value === '' ? '' : Number(value);
            onUpdate(row.emsS_Id, 'eycessS_MinMarks', numValue);
        }, 50);
    };

    // Handle entry marks change with debounce
    const handleEntryChange = (value: string) => {
        setLocalEntry(value);
        if (entryDebounceRef.current) clearTimeout(entryDebounceRef.current);
        entryDebounceRef.current = setTimeout(() => {
            const numValue = value === '' ? '' : Number(value);
            onUpdate(row.emsS_Id, 'eycessS_MarksEntryMax', numValue);
        }, 50);
    };

    // Handle grade change (immediate)
    const handleGradeChange = (value: string) => {
        onUpdate(row.emsS_Id, 'emgR_Id', value);
    };

    // Handle exempted change (immediate)
    const handleExemptedChange = (checked: boolean) => {
        onUpdate(row.emsS_Id, 'eycessS_ExemptedFlg', checked);
        if (!checked) {
            setLocalExemptedPer('');
            onUpdate(row.emsS_Id, 'eycessS_ExemptedPer', '');
        }
    };

    // Handle exempted percentage change with debounce
    const handleExemptedPerChange = (value: string) => {
        setLocalExemptedPer(value);
        if (exemptedPerDebounceRef.current) clearTimeout(exemptedPerDebounceRef.current);
        exemptedPerDebounceRef.current = setTimeout(() => {
            const numValue = value === '' ? '' : Number(value);
            onUpdate(row.emsS_Id, 'eycessS_ExemptedPer', numValue);
        }, 50);
    };

    // Handle flag changes (immediate)
    const handleMarksFlagChange = (checked: boolean) => onUpdate(row.emsS_Id, 'eycessS_MarksDisplayFlg', checked);
    const handleGradesFlagChange = (checked: boolean) => onUpdate(row.emsS_Id, 'eycessS_GradeDisplayFlg', checked);
    const handleAplResultChange = (checked: boolean) => onUpdate(row.emsS_Id, 'eycessS_AplResultFlg', checked);

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

            {/* Select */}
            <td className='border p-2 text-center'>
                <Checkbox
                    checked={!!row.checkedvalue}
                    onCheckedChange={handleCheckboxChange}
                />
            </td>

            {/* Name (Code) */}
            <td className='border p-2'>
                <div className='text-sm'>
                    <div className='font-medium'>{row.emsS_SubSubjectName}</div>
                    {row.emsS_SubSubjectCode && (
                        <div className='text-slate-500 text-xs'>{row.emsS_SubSubjectCode}</div>
                    )}
                </div>
            </td>

            {/* Max Marks */}
            <td className='w-28 border p-2'>
                <Input
                    type='text'
                    value={localMax}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        handleMaxChange(raw === '' ? '' : raw);
                    }}
                    inputMode='numeric'
                    disabled={!isRowChecked}
                    placeholder='Enter Max'
                    className={errors?.eycessS_MaxMarks ? 'border-red-500 text-center' : 'text-center'}
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
                    onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        handleMinChange(raw === '' ? '' : raw);
                    }}
                    inputMode='numeric'
                    disabled={!isRowChecked}
                    placeholder='Enter Min'
                    className={errors?.eycessS_MinMarks ? 'border-red-500 text-center' : 'text-center'}
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
                    onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        handleEntryChange(raw === '' ? '' : raw);
                    }}
                    inputMode='numeric'
                    disabled={!isRowChecked}
                    placeholder='Enter Max'
                    className={errors?.eycessS_MarksEntryMax ? 'border-red-500 text-center' : 'text-center'}
                />
                {errors?.eycessS_MarksEntryMax && (
                    <p className='mt-1 text-[11px] text-red-500'>{String(errors.eycessS_MarksEntryMax)}</p>
                )}
            </td>

            {/* Grade */}
            <td className='w-40 border p-2'>
                <Select
                    value={row.emgR_Id?.toString() ?? ''}
                    onValueChange={handleGradeChange}
                    disabled={!isRowChecked}
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

            {/* Exempted Flag */}
            <td className='border p-2 text-center'>
                <Checkbox
                    checked={!!row.eycessS_ExemptedFlg}
                    onCheckedChange={handleExemptedChange}
                />
            </td>

            {/* Exempted Percentage */}
            <td className='w-24 border p-2'>
                <Input
                    type='text'
                    disabled={!row.eycessS_ExemptedFlg}
                    value={localExemptedPer}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        handleExemptedPerChange(raw === '' ? '' : raw);
                    }}
                    inputMode='numeric'
                    className='text-center'
                />
            </td>

            {/* Marks Display */}
            <td className='border p-2 text-center'>
                <Checkbox
                    checked={!!row.eycessS_MarksDisplayFlg}
                    onCheckedChange={handleMarksFlagChange}
                />
            </td>

            {/* Grade Display */}
            <td className='border p-2 text-center'>
                <Checkbox
                    checked={!!row.eycessS_GradeDisplayFlg}
                    onCheckedChange={handleGradesFlagChange}
                />
            </td>

            {/* Apply Result */}
            <td className='border p-2 text-center'>
                <Checkbox
                    checked={!!row.eycessS_AplResultFlg}
                    onCheckedChange={handleAplResultChange}
                />
            </td>
        </tr>
    );
});

SubSubjectRow.displayName = 'SubSubjectRow';

// ----------------------------------
// Main Component with Optimized Updates
// ----------------------------------
export default function SubSubjectModal({
    open,
    subject,
    onClose,
    onSave,
    schema,
    gradeList
}: {
    open: boolean;
    subject?: any;
    onClose: () => void;
    onSave: (subjectId: number, selectedList: any[], subSubjectList: any[]) => void;
    schema: z.ZodType<any>;
    gradeList: IMasterGrade[];
}) {
    const methods = useForm<SubSubjectFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { subsubject_list: [] },
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

    // Store data in ref for immediate access using emsS_Id
    const dataRef = useRef<Map<number, SubSubject>>(new Map());
    const validationErrorsRef = useRef<Record<number, any>>({});

    // Get form data
    const formData = watch('subsubject_list') || [];

    // Parent max and min marks
    const parentMaxMarks = useMemo(() => Number(subject?.eyceS_MaxMarks ?? 0), [subject]);
    const parentMinMarks = useMemo(() => Number(subject?.eyceS_MinMarks ?? 0), [subject]);
    const parentMarksEntryMax = useMemo(() => Number(subject?.eyceS_MarksEntryMax ?? 0), [subject]);

    // ----------------------------------
    // Populate initial list
    // ----------------------------------
    useEffect(() => {
        if (!open) return;

        // If subject is empty → clean reset
        if (!subject) {
            reset({ subsubject_list: [] });
            dataRef.current.clear();
            setValidationErrors({});
            validationErrorsRef.current = {};
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const rawList = subject.list ?? [];
        console.log('subject in subsubject modal', subject);

        // Map once (cheap)
        const mappedList = rawList.map((l: any) => ({
            emsS_Id: l.emsS_Id,
            emsS_SubSubjectName: l.emsS_SubSubjectName,
            emsS_SubSubjectCode: l.emsS_SubSubjectCode,
            checkedvalue: Boolean(l.checkedvalue),

            eycessS_MaxMarks: l.eycessS_MaxMarks ?? '',
            eycessS_MinMarks: l.eycessS_MinMarks ?? '',
            eycessS_MarksEntryMax: l.eycessS_MarksEntryMax ?? '',
            emgR_Id: l.emgR_Id ?? '',

            eycessS_ExemptedFlg: l.eycessS_ExemptedFlg,
            eycessS_ExemptedPer: l.eycessS_ExemptedPer ?? '',
            eycessS_MarksDisplayFlg: l.eycessS_MarksDisplayFlg,
            eycessS_GradeDisplayFlg: l.eycessS_GradeDisplayFlg,
            eycessS_AplResultFlg: l.eycessS_AplResultFlg,

            eycessS_SubSubjectOrder: l.eycessS_SubSubjectOrder ?? 0
        }));

        // ✅ YOUR REQUIRED SORT STYLE
        const sortedList = [...mappedList].sort(
            (a, b) =>
                (a.eycessS_SubSubjectOrder ?? 0) -
                (b.eycessS_SubSubjectOrder ?? 0)
        );

        // Update ref (O(n), fast lookup later)
        dataRef.current = new Map(
            sortedList.map(item => [item.emsS_Id, item])
        );

        // Update react-hook-form once
        reset({ subsubject_list: sortedList });

        // Clear validation
        setValidationErrors({});
        validationErrorsRef.current = {};

        setIsLoading(false);
    }, [open, subject, reset]);


    // Filtered data (memoized)
    const filteredData = useMemo(() => {
        const allData = formData || [];
        const term = searchTerm.trim().toLowerCase();
        if (!term) return allData;
        return allData.filter((item) => {
            return (
                (item.emsS_SubSubjectName ?? '').toString().toLowerCase().includes(term) ||
                (item.emsS_SubSubjectCode ?? '').toString().toLowerCase().includes(term)
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
    // Optimized Update Function using emsS_Id
    // ----------------------------------
    const updateRowValue = useCallback((emsS_Id: number, field: keyof SubSubject, value: any) => {
        // Find the index of the item with this emsS_Id
        const currentList = getValues('subsubject_list') || [];
        const itemIndex = currentList.findIndex(item => item.emsS_Id === emsS_Id);

        if (itemIndex === -1) return;

        // Update the value in the form
        setValue(`subsubject_list.${itemIndex}.${field}`, value, {
            shouldDirty: true,
            shouldValidate: false
        });

        // Update the ref
        const currentItem = dataRef.current.get(emsS_Id);
        if (currentItem) {
            dataRef.current.set(emsS_Id, {
                ...currentItem,
                [field]: value
            });
        }

        // Validate the field
        validateField(emsS_Id, field, value);
    }, [getValues, setValue]);

    // ----------------------------------
    // Validation Functions
    // ----------------------------------
    const validateField = useCallback((emsS_Id: number, field: keyof SubSubject, value: any) => {
        const item = dataRef.current.get(emsS_Id);
        if (!item) return;

        let error = '';
        const numValue = value === '' ? undefined : Number(value);

        // Validation based on field
        switch (field) {
            case 'eycessS_MaxMarks': {
                if (numValue !== undefined && numValue > parentMaxMarks) {
                    error = `Max marks cannot exceed parent subject max (${parentMaxMarks})`;
                }
                // Validate against min marks
                const minVal = item.eycessS_MinMarks === '' ? undefined : Number(item.eycessS_MinMarks);
                if (minVal !== undefined && numValue !== undefined && minVal > numValue) {
                    error = 'Max marks cannot be less than Min marks';
                }
                break;
            }

            case 'eycessS_MinMarks': {
                if (numValue !== undefined && numValue > parentMaxMarks) {
                    error = `Min marks cannot exceed parent subject max (${parentMaxMarks})`;
                }
                // Validate against max marks
                const maxVal = item.eycessS_MaxMarks === '' ? undefined : Number(item.eycessS_MaxMarks);
                if (maxVal !== undefined && numValue !== undefined && numValue > maxVal) {
                    error = 'Min marks cannot be greater than Max marks';
                }
                break;
            }

            case 'eycessS_MarksEntryMax': {
                if (numValue !== undefined && numValue > parentMarksEntryMax) {
                    error = `Marks entry max cannot exceed parent subject max (${parentMarksEntryMax})`;
                }
                // Validate against max marks
                const maxVal2 = item.eycessS_MaxMarks === '' ? undefined : Number(item.eycessS_MaxMarks);
                if (maxVal2 !== undefined && numValue !== undefined && numValue > maxVal2) {
                    error = 'Marks entry max cannot be greater than Max marks';
                }
                break;
            }

            case 'emgR_Id':
                if (item.checkedvalue && (!value || value === '')) {
                    error = 'Grade is required';
                }
                break;

            case 'checkedvalue':
                if (value) {
                    // If checked, validate required fields
                    if (!item.eycessS_MaxMarks) {
                        setValidationErrors(prev => ({
                            ...prev,
                            [emsS_Id]: {
                                ...prev[emsS_Id],
                                eycessS_MaxMarks: 'Max marks is required'
                            }
                        }));
                    }
                    if (!item.eycessS_MinMarks) {
                        setValidationErrors(prev => ({
                            ...prev,
                            [emsS_Id]: {
                                ...prev[emsS_Id],
                                eycessS_MinMarks: 'Min marks is required'
                            }
                        }));
                    }
                    if (!item.eycessS_MarksEntryMax) {
                        setValidationErrors(prev => ({
                            ...prev,
                            [emsS_Id]: {
                                ...prev[emsS_Id],
                                eycessS_MarksEntryMax: 'Marks entry max is required'
                            }
                        }));
                    }
                    if (!item.emgR_Id || item.emgR_Id === '') {
                        setValidationErrors(prev => ({
                            ...prev,
                            [emsS_Id]: {
                                ...prev[emsS_Id],
                                emgR_Id: 'Grade is required'
                            }
                        }));
                    }
                } else {
                    // If unchecked, clear errors for this row
                    setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors[emsS_Id];
                        return newErrors;
                    });
                }
                break;
        }

        // Update validation errors
        if (error) {
            setValidationErrors(prev => ({
                ...prev,
                [emsS_Id]: {
                    ...prev[emsS_Id],
                    [field]: error
                }
            }));
        } else {
            setValidationErrors(prev => {
                if (!prev[emsS_Id]) return prev;
                const newErrors = { ...prev[emsS_Id] };
                delete newErrors[field];
                if (Object.keys(newErrors).length === 0) {
                    const newState = { ...prev };
                    delete newState[emsS_Id];
                    return newState;
                }
                return {
                    ...prev,
                    [emsS_Id]: newErrors
                };
            });
        }
    }, [parentMaxMarks]);

    // ----------------------------------
    // Set Order Functions
    // ----------------------------------
    const handleSetOrder = useCallback(() => {
        const currentList = getValues('subsubject_list');
        if (!currentList || currentList.length === 0) {
            toast.info('Sub-subjects are loading...');
            return;
        }
        setIsOrderDetailsOpen(true);
        setIsOrderloading(false);
    }, [getValues]);

    const handleOrderSave = useCallback(async (updatedData: any) => {
        setIsOrderSaving(true);

        setTimeout(() => {
            const currentList = getValues('subsubject_list') ?? [];
            const currentMap = new Map(currentList.map(item => [item.emsS_Id, item]));

            // Build the reordered list preserving ALL original values
            const reorderedList = (updatedData ?? []).map((updatedItem: any, index: number) => {
                const itemId = updatedItem.emsS_Id || updatedItem.id;
                const existingItem = currentMap.get(itemId);

                if (existingItem) {
                    return {
                        ...existingItem,
                        eycessS_SubSubjectOrder: index + 1
                    };
                }

                return {
                    ...updatedItem,
                    emsS_Id: itemId,
                    eycessS_SubSubjectOrder: index + 1,
                    emgR_Id: updatedItem.emgR_Id || ''
                };
            });

            // Update ref with new order
            reorderedList.forEach((item: SubSubject) => {
                dataRef.current.set(item.emsS_Id, item);
            });

            // Update form
            setValue('subsubject_list', reorderedList, { shouldDirty: true, shouldValidate: false });

            toast.success('Sub-Subject order saved successfully.');
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
        const currentList = getValues('subsubject_list') || [];
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
            if (!row.eycessS_MaxMarks) {
                rowErrors.eycessS_MaxMarks = 'Max marks is required';
                hasErrors = true;
            }
            if (!row.eycessS_MinMarks) {
                rowErrors.eycessS_MinMarks = 'Min marks is required';
                hasErrors = true;
            }
            if (!row.eycessS_MarksEntryMax) {
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
                newErrors[row.emsS_Id] = rowErrors;
            }
        });

        if (hasErrors) {
            setValidationErrors(newErrors);
            toast.error('Please fix validation errors before saving.');
            return;
        }

        if (selected.length === 0) {
            toast.error('Select at least one sub-subject before saving.');
            return;
        }

        const totMax = selected.reduce((acc, cur) => acc + Number(cur.eycessS_MaxMarks || 0), 0);
        const totMin = selected.reduce((acc, cur) => acc + Number(cur.eycessS_MinMarks || 0), 0);
        const tolMaxEntry = selected.reduce((acc, cur) => acc + Number(cur.eycessS_MarksEntryMax || 0), 0);

        if (selected.length > 0 && (totMax !== parentMaxMarks || totMin !== parentMinMarks || tolMaxEntry !== parentMarksEntryMax)) {
            toast.error(
                `Sum of selected sub-subjects (Max: ${totMax}, Min: ${totMin}) must equal subject marks (Max: ${parentMaxMarks}, Min: ${parentMinMarks}, Entry: ${parentMarksEntryMax})`
            );
            return;
        }

        const formatted = selected.map((r, index) => ({
            eycessS_Id: r.emsS_Id, // Use emsS_Id as the identifier
            eyceS_Id: subject.eyceS_Id,
            emsS_Id: r.emsS_Id,
            emgR_Id: Number(r.emgR_Id) || null,
            eycessS_MaxMarks: Number(r.eycessS_MaxMarks) || 0,
            eycessS_MinMarks: Number(r.eycessS_MinMarks) || 0,
            eycessS_ExemptedFlg: !!r.eycessS_ExemptedFlg,
            eycessS_ExemptedPer: Number(r.eycessS_ExemptedPer) || 0,
            eycessS_MarksDisplayFlg: !!r.eycessS_MarksDisplayFlg,
            eycessS_GradeDisplayFlg: !!r.eycessS_GradeDisplayFlg,
            eycessS_AplResultFlg: !!r.eycessS_AplResultFlg,
            eycessS_MarksEntryMax: Number(r.eycessS_MarksEntryMax) || 0,
            eycessS_SubSubjectOrder: index + 1
        }));

        onSave(subject.ismS_Id, formatted, currentList);
        onClose();
    }, [getValues, subject, parentMaxMarks, parentMinMarks, onSave, onClose]);

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
            <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
                <DialogContent className='max-h-[80vh] w-full min-w-[80vw] overflow-hidden pt-0'>
                    <DialogHeader className='bg-white pt-4'>
                        <DialogTitle>Loading Sub-Subjects...</DialogTitle>
                        <div className='text-muted-foreground text-sm'>Please wait while we load the data</div>
                    </DialogHeader>
                    <div className='flex h-[400px] items-center justify-center'>
                        <div className='text-center'>
                            <div className='mx-auto h-12 w-12 animate-spin rounded-full border-blue-500 border-t-2 border-b-2'>.</div>
                            <p className='mt-4 text-muted-foreground'>Loading sub-subject data...</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
                <DialogContent className='max-h-[80vh] w-full min-w-[80vw] overflow-hidden pt-0'>
                    <DialogHeader className='bg-white pt-4'>
                        <DialogTitle>{`Map Sub-Subjects — ${subject?.ISMS_SubjectName}`}</DialogTitle>
                        <div className='text-muted-foreground text-sm'>Loading sub-subject details...</div>
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
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className='flex h-[90vh] w-full min-w-[80vw] flex-col overflow-hidden pt-0'>
                <DialogHeader className='shrink-0 border-b bg-white pt-4 pb-2'>
                    <DialogTitle>{`Map Sub-Subjects — ${subject.ismS_SubjectName}`}</DialogTitle>
                    <div className='text-muted-foreground text-sm'>
                        Parent Subject: Max={parentMaxMarks}, Min={parentMinMarks}
                    </div>
                </DialogHeader>

                {/* Search & pagination controls */}
                <div className='flex shrink-0 items-center justify-between border-b bg-white p-2'>
                    <div className='text-muted-foreground text-sm'>
                        Showing {filteredData.length === 0 ? 0 : startIndex + 1}-{endIndex} of {filteredData.length} items
                    </div>
                    <Input
                        placeholder='Search sub-subject...'
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
                                        <th className='border bg-slate-50 p-2'>Sub-Subject Name(Code)</th>
                                        <th className='border bg-slate-50 p-2'>Max Marks</th>
                                        <th className='border bg-slate-50 p-2'>Min Marks</th>
                                        <th className='border bg-slate-50 p-2'>Marks Entry Max</th>
                                        <th className='border bg-slate-50 p-2'>Grade</th>
                                        <th className='border bg-slate-50 p-2'>Exempted Flag</th>
                                        <th className='border bg-slate-50 p-2'>Exempted %</th>
                                        <th className='border bg-slate-50 p-2'>Marks Display</th>
                                        <th className='border bg-slate-50 p-2'>Grade Display</th>
                                        <th className='border bg-slate-50 p-2'>Apply Result</th>
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

                                    {filteredData.length === 0 && searchTerm && (
                                        <tr>
                                            <td colSpan={12} className='py-6 text-center text-muted-foreground text-sm'>
                                                No results found for "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}

                                    {paginatedData.map((row, i) => (
                                        <SubSubjectRow
                                            key={row.emsS_Id}
                                            row={row}
                                            index={i}
                                            totalIndex={startIndex + i}
                                            errors={validationErrors[row.emsS_Id] || {}}
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

                    <div className='ml-auto flex w-fit shrink-0 justify-end gap-2 border-t bg-white p-4'>
                        <Button className='w-fit' type='button' variant='ghost' onClick={onClose}>
                            Cancel
                        </Button>

                        <Button
                            type='button'
                            onClick={handleSetOrder}
                            className='w-fit transition-all duration-200 hover:scale-90'
                            disabled={formData.length === 0}>
                            <GitCompareArrows className='mr-2 h-4 w-4' />
                            Set Order
                        </Button>

                        <Button className='w-fit' type='button' onClick={handleSave}>
                            Save & Close
                        </Button>
                    </div>
                </FormProvider>

                {/* Order Modal */}
                {isOrderDetailsOpen && (
                    <MasterViewDetails
                        isOpen={isOrderDetailsOpen}
                        onClose={closeOrderDetails}
                        data={formData.map((d, index) => ({
                            ...d,
                            id: d.emsS_Id,
                            order: d.eycessS_SubSubjectOrder ?? index + 1
                        }))}
                        isLoading={isOrderloading}
                        isSaving={isOrderSaving}
                        columns={[
                            { key: 'id', label: 'ID', className: 'text-center w-12' },
                            { key: 'emsS_SubSubjectName', label: 'Sub-Subject Name', className: 'text-left' },
                            { key: 'emsS_SubSubjectCode', label: 'Sub-Subject Code', className: 'text-left' },
                            { key: 'order', label: 'Current Order', className: 'text-left' }
                        ]}
                        onSave={handleOrderSave}
                        tableHeight='500px'
                        title='Set Sub-Subject Order'
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
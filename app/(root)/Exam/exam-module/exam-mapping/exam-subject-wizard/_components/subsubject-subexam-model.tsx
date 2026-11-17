'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MasterViewDetails } from '@/components/ui/set-order/generic-set-order';
import type { SubSubjectSubExamSchema } from '@/schemas/exam/exam-module/exam-mapping';
import type { IMasterGrade } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, GitCompareArrows } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type SubSubjectSubExam = z.infer<typeof SubSubjectSubExamSchema>;

type SubSubjectSubExamFormValues = {
    list: SubSubjectSubExam[];
};

const ITEMS_PER_PAGE = 10;

export default function SubSubjectSubExamModal({
    open,
    subject,
    onClose,
    onSave,
    gradeList,
    schema
}: {
    open: boolean;
    subject?: any;
    onClose: () => void;
    onSave: (subjectId: number, selectedList: SubSubjectSubExam[]) => void;
    gradeList: IMasterGrade[];
    schema: z.ZodType<any>;
}) {
    const methods = useForm<SubSubjectSubExamFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { list: [] },
        mode: 'onTouched'
    });

    const { control, reset, getValues, setValue, formState, clearErrors, setError } = methods;
    const { errors } = formState;

    // Live watch for the `list` value (efficient)
    const watchedList = useWatch({ control, name: 'list' }) || [];

    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
    const [isOrderSaving, setIsOrderSaving] = useState(false);
    const [isOrderloading, setIsOrderloading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Parent marks (defensive)
    const parentMaxMarks = Number(subject?.EYCES_MaxMarks ?? 0);
    const parentMinMarks = Number(subject?.EYCES_MinMarks ?? 0);

    // Populate/reset when subject changes
    // Populate/reset when subject changes
    useEffect(() => {
        if (!subject) {
            reset({ list: [] });
            setCurrentPage(1);
            setSearchTerm('');
            return;
        }

        const list = (subject.list ?? []).map((l: any) => ({
            eycessS_Id: l.eycessS_Id ?? undefined,
            eyceS_Id: l.eyceS_Id ?? undefined,
            ismS_Id: subject.ISMS_Id,
            emsS_Id: l.emsS_Id,
            emsE_Id: l.emsE_Id,
            compositeId: `${l.emsS_Id}_${l.emsE_Id}`, // <-- Add this
            checkedvalue: Boolean(l.checkedvalue) ?? false,
            emgR_GradeName: l.emgR_GradeName ?? '',
            ismS_SubjectName: subject.ISMS_SubjectName ?? '',
            ismS_SubjectCode: subject.ISMS_SubjectCode ?? '',
            emsS_SubSubjectName: l.emsS_SubSubjectName ?? '',
            emsS_SubSubjectCode: l.emsS_SubSubjectCode ?? '',
            emsE_SubExamName: l.emsE_SubExamName ?? '',
            emsE_SubExamCode: l.emsE_SubExamCode ?? '',
            eycessS_MaxMarks: l.eycessS_MaxMarks ?? '',
            eycessS_MinMarks: l.eycessS_MinMarks ?? '',
            eycessS_MarksEntryMax: l.eycessS_MarksEntryMax ?? '',
            eycessS_ExemptedFlg: !!l.eycessS_ExemptedFlg,
            eycessS_ExemptedPer: l.eycessS_ExemptedPer ?? '',
            eycessS_MarksFlg: !!l.eycessS_MarksFlg,
            eycessS_GradesFlg: !!l.eycessS_GradesFlg,
            eycessS_ActiveFlg: !!l.eycessS_ActiveFlg,
            eycessS_SubSubjectOrder: l.eycessS_SubSubjectOrder ?? 0
        }));

        reset({ list });
        setCurrentPage(1);
        setSearchTerm('');
    }, [subject, reset]);

    // Filtered data (memoized)
    const filteredData = useMemo(() => {
        const allData = watchedList || [];
        const term = searchTerm.trim().toLowerCase();
        if (!term) return allData;
        return allData.filter((item: any) => {
            return (
                (item.emsS_SubSubjectName ?? '').toString().toLowerCase().includes(term) ||
                (item.emsS_SubSubjectCode ?? '').toString().toLowerCase().includes(term) ||
                (item.emsE_SubExamName ?? '').toString().toLowerCase().includes(term) ||
                (item.emsE_SubExamCode ?? '').toString().toLowerCase().includes(term)
            );
        });
    }, [watchedList, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));

    useEffect(() => {
        setCurrentPage((p) => Math.min(Math.max(1, p), totalPages));
    }, [totalPages]);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length);
    const paginatedData = useMemo(() => filteredData.slice(startIndex, endIndex), [filteredData, startIndex, endIndex]);

    // Validation helpers
    const validateRowManually = useCallback(
        (row: SubSubjectSubExam) => {
            const rowErrs: Record<string, string> = {};

            const max = row.eycessS_MaxMarks === 0 || row.eycessS_MaxMarks === null ? undefined : Number(row.eycessS_MaxMarks);
            const min = row.eycessS_MinMarks === 0 || row.eycessS_MinMarks === null ? undefined : Number(row.eycessS_MinMarks);
            const entry =
                row.eycessS_MarksEntryMax === 0 || row.eycessS_MarksEntryMax === null ? undefined : Number(row.eycessS_MarksEntryMax);
            const exemptPer =
                row.eycessS_ExemptedPer === 0 || row.eycessS_ExemptedPer === null ? undefined : Number(row.eycessS_ExemptedPer);

            // 1) Parent max
            if (max !== undefined && max > parentMaxMarks) {
                rowErrs.eycessS_MaxMarks = `Max marks cannot exceed parent subject max (${parentMaxMarks})`;
            }
            if (min !== undefined && min > parentMaxMarks) {
                rowErrs.eycessS_MinMarks = `Min marks cannot exceed parent subject max (${parentMaxMarks})`;
            }
            if (entry !== undefined && entry > parentMaxMarks) {
                rowErrs.eycessS_MarksEntryMax = `Marks entry max cannot exceed parent subject max (${parentMaxMarks})`;
            }

            // 2) Min <= Max
            if (min !== undefined && max !== undefined && min > max) {
                rowErrs.eycessS_MinMarks = 'Min marks cannot be greater than Max marks';
                rowErrs.eycessS_MaxMarks = 'Max marks cannot be less than Min marks';
            }

            // 3) Entry <= Max
            if (entry !== undefined && max !== undefined && entry > max) {
                rowErrs.eycessS_MarksEntryMax = 'Marks entry max cannot be greater than Max marks';
            }

            // 4) Exempt %
            if (exemptPer !== undefined && (exemptPer < 0 || exemptPer > 100)) {
                rowErrs.eycessS_ExemptedPer = 'Exempt percentage must be between 0 and 100';
            }

            // 5) Required when checked
            if (row.checkedvalue) {
                if (max === undefined || max === null || max === 0) {
                    rowErrs.eycessS_MaxMarks = 'Max marks is required';
                }
                if (min === undefined || min === null || min === 0) {
                    rowErrs.eycessS_MinMarks = 'Min marks is required';
                }
                if (entry === undefined || entry === null || entry === 0) {
                    rowErrs.eycessS_MarksEntryMax = 'Marks entry max is required';
                }
                if (!row.emgR_GradeName) {
                    rowErrs.emgR_GradeName = 'Grade is required';
                }
            }

            return rowErrs;
        },
        [parentMaxMarks]
    );

    // Validate entire list and set errors
    const validateAllBeforeSave = useCallback((): boolean => {
        const all = getValues('list') ?? [];
        let hasError = false;

        clearErrors();

        all.forEach((row: SubSubjectSubExam, idx: number) => {
            const rowErrs = validateRowManually(row);
            Object.keys(rowErrs).forEach((field) => {
                hasError = true;
                setError(`list.${idx}.${field}` as any, {
                    type: 'manual',
                    message: rowErrs[field]
                });
            });
        });

        return !hasError;
    }, [getValues, setError, clearErrors, validateRowManually]);

    // Real-time handlers
    const handleMaxChange = useCallback(
        (idx: number, rawVal: string, onChange: (value: any) => void) => {
            const val = rawVal === '' ? '' : Number(rawVal);
            onChange(val);

            if (val !== '' && Number(val) > parentMaxMarks) {
                setError(`list.${idx}.eycessS_MaxMarks` as any, {
                    type: 'manual',
                    message: `Max marks cannot exceed parent subject max (${parentMaxMarks})`
                });
            } else {
                clearErrors([`list.${idx}.eycessS_MaxMarks`, `list.${idx}.eycessS_MinMarks`, `list.${idx}.eycessS_MarksEntryMax`] as any);
            }
        },
        [parentMaxMarks, setError, clearErrors]
    );

    const handleMinChange = useCallback(
        (idx: number, rawVal: string, onChange: (value: any) => void) => {
            const val = rawVal === '' ? '' : Number(rawVal);
            onChange(val);

            if (val !== '' && Number(val) > parentMaxMarks) {
                setError(`list.${idx}.eycessS_MinMarks` as any, {
                    type: 'manual',
                    message: `Min marks cannot exceed parent subject max (${parentMaxMarks})`
                });
            } else {
                clearErrors([`list.${idx}.eycessS_MinMarks`] as any);
            }

            const maxVal = getValues(`list.${idx}.eycessS_MaxMarks`);
            const maxNum = maxVal === 0 || maxVal === null ? undefined : Number(maxVal);
            if (val !== '' && maxNum !== undefined && Number(val) > maxNum) {
                setError(`list.${idx}.eycessS_MinMarks` as any, {
                    type: 'manual',
                    message: 'Min marks cannot be greater than Max marks'
                });
                setError(`list.${idx}.eycessS_MaxMarks` as any, {
                    type: 'manual',
                    message: 'Max marks cannot be less than Min marks'
                });
            } else {
                if (maxNum !== undefined) clearErrors([`list.${idx}.eycessS_MaxMarks`] as any);
            }
        },
        [parentMaxMarks, getValues, setError, clearErrors]
    );

    const handleEntryChange = useCallback(
        (idx: number, rawVal: string, onChange: (value: any) => void) => {
            const val = rawVal === '' ? '' : Number(rawVal);
            onChange(val);

            if (val !== '' && Number(val) > parentMaxMarks) {
                setError(`list.${idx}.eycessS_MarksEntryMax` as any, {
                    type: 'manual',
                    message: `Marks entry max cannot exceed parent subject max (${parentMaxMarks})`
                });
                return;
            }

            const maxVal = getValues(`list.${idx}.eycessS_MaxMarks`);
            const maxNum = maxVal === 0 || maxVal === null ? undefined : Number(maxVal);
            if (maxNum !== undefined && val !== '' && Number(val) > maxNum) {
                setError(`list.${idx}.eycessS_MarksEntryMax` as any, {
                    type: 'manual',
                    message: 'Marks entry max cannot be greater than Max marks'
                });
            } else {
                clearErrors([`list.${idx}.eycessS_MarksEntryMax`] as any);
            }
        },
        [parentMaxMarks, getValues, setError, clearErrors]
    );

    const handleExemptPerChange = useCallback(
        (idx: number, rawVal: string, onChange: (value: any) => void) => {
            const val = rawVal === '' ? '' : Number(rawVal);
            onChange(val);

            if (val !== '' && (Number(val) < 0 || Number(val) > 100)) {
                setError(`list.${idx}.eycessS_ExemptedPer` as any, {
                    type: 'manual',
                    message: 'Exempt percentage must be between 0 and 100'
                });
            } else {
                clearErrors([`list.${idx}.eycessS_ExemptedPer`] as any);
            }
        },
        [setError, clearErrors]
    );

    // Save order modal
    const handleSetOrder = useCallback(async () => {
        if (!watchedList || watchedList.length === 0) {
            toast.info('Sub-subjects are loading...');
            return;
        }
        setIsOrderloading(false);
        setIsOrderDetailsOpen(true);
    }, [watchedList]);

    const handleOrderSave = useCallback(
        async (updatedData: any) => {
            setIsOrderSaving(true);
            try {
                const currentList = getValues('list') ?? [];
                const reorderedList = (updatedData ?? []).map((item: any, index: number) => {
                    // Find by composite match
                    const compositeId = `${item.emsS_Id}_${item.emsE_Id}`;
                    const original = currentList.find((x: any) => `${x.emsS_Id}_${x.emsE_Id}` === compositeId) ?? item;

                    return {
                        ...original,
                        eycessS_SubSubjectOrder: index + 1
                    };
                });

                const reorderedIds = new Set(reorderedList.map((r: any) => `${r.emsS_Id}_${r.emsE_Id}`));

                const remaining = currentList.filter((x: any) => !reorderedIds.has(`${x.emsS_Id}_${x.emsE_Id}`));

                const finalList = [...reorderedList, ...remaining].sort(
                    (a: any, b: any) => Number(a.eycessS_SubSubjectOrder ?? 0) - Number(b.eycessS_SubSubjectOrder ?? 0)
                );

                setValue('list', finalList, { shouldDirty: true, shouldValidate: true });
                toast.success('Sub-Subjects order saved successfully.');
                setIsOrderDetailsOpen(false);
            } catch (err) {
                console.error(err);
                toast.error('Failed to save order.');
            } finally {
                setIsOrderSaving(false);
                setIsOrderloading(false);
            }
        },
        [getValues, setValue]
    );

    const closeOrderDetails = useCallback(() => {
        setIsOrderDetailsOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Save handler
    const handleSave = useCallback(() => {
        const values = getValues();
        const selected = values.list.filter((r: any) => r.checkedvalue);

        const ok = validateAllBeforeSave();
        if (!ok) {
            toast.error('Please fix validation errors before saving.');
            return;
        }

        if (selected.length === 0) {
            toast.error('Select at least one sub-subject before saving.');
            return;
        }

        const totMax = selected.reduce((acc: number, cur: any) => acc + Number(cur.eycessS_MaxMarks || 0), 0);
        const totMin = selected.reduce((acc: number, cur: any) => acc + Number(cur.eycessS_MinMarks || 0), 0);

        if (selected.length > 0 && (totMax !== parentMaxMarks || totMin !== parentMinMarks)) {
            toast.error(
                `Sum of selected sub-subjects (max/min) must equal parent subject marks (Max: ${parentMaxMarks}, Min: ${parentMinMarks}).`
            );
            return;
        }
        console.log(selected);
        console.log('subject', subject);

        onSave(subject.ISMS_Id, selected);
        onClose();
    }, [getValues, validateAllBeforeSave, parentMaxMarks, parentMinMarks, onSave, onClose, subject]);

    const renderSkeletonTable = () => (
        <div className='w-full rounded-md'>
            <table className='w-full table-auto border-collapse border border-gray-200'>
                <tbody>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i} className='hover:bg-transparent'>
                            {Array.from({ length: 13 }).map((_, j) => (
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

    if (!subject) return null;

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className='flex h-[90vh] w-full min-w-[80vw] flex-col overflow-hidden pt-0'>
                {/* Top header */}
                <DialogHeader className='shrink-0 border-b bg-white pt-4 pb-2'>
                    <DialogTitle className='text-lg'>{`Map Sub-Subject and Sub-Exam — ${subject.ISMS_SubjectName}`}</DialogTitle>
                    <DialogDescription>Fill details and save sub-exam mapping</DialogDescription>
                </DialogHeader>

                {/* Search & pagination controls */}
                <div className='flex shrink-0 items-center justify-between border-b bg-white p-2'>
                    <div className='text-muted-foreground text-sm'>
                        Showing {filteredData.length === 0 ? 0 : startIndex + 1}-{endIndex} of {filteredData.length} items
                    </div>
                    <Input
                        placeholder='Search sub-subject or sub-exam...'
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className='w-64'
                    />
                </div>

                <FormProvider {...methods}>
                    {/* Table container - flex-1 to fill available space */}
                    <div className='flex flex-1 flex-col overflow-hidden'>
                        {/* Scrollable table wrapper */}
                        <div className='flex-1 overflow-x-auto overflow-y-auto'>
                            <table className='w-full table-auto border-collapse'>
                                <thead className='sticky top-0 z-10 bg-slate-50 text-sm'>
                                    <tr>
                                        <th className='border bg-slate-50 p-2'>SLNO</th>
                                        <th className='border bg-slate-50 p-2'>Select</th>
                                        <th className='border bg-slate-50 p-2'>Sub-Subject Name (Code)</th>
                                        <th className='border bg-slate-50 p-2'>Sub-Exam Name (Code)</th>
                                        <th className='border bg-slate-50 p-2'>Max. Marks</th>
                                        <th className='border bg-slate-50 p-2'>Min. Marks</th>
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
                                            <td colSpan={13} className='p-6'>
                                                {renderSkeletonTable()}
                                            </td>
                                        </tr>
                                    )}

                                    {subject?.list?.length === 0 && (
                                        <tr>
                                            <td colSpan={13} className='py-6 text-center text-muted-foreground text-sm'>
                                                No records found.
                                            </td>
                                        </tr>
                                    )}

                                    {filteredData.length === 0 && searchTerm && (
                                        <tr>
                                            <td colSpan={13} className='py-6 text-center text-muted-foreground text-sm'>
                                                No results found for "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}

                                    {paginatedData.map((row, idx) => {
                                        // Use composite ID to find the correct index
                                        const compositeId = `${row.emsS_Id}_${row.emsE_Id}`;
                                        const formIndex = (watchedList || []).findIndex(
                                            (x: any) => `${x.emsS_Id}_${x.emsE_Id}` === compositeId
                                        );

                                        // Fallback: if not found, use the paginated position
                                        const safeIndex = formIndex === -1 ? startIndex + idx : formIndex;

                                        const rowErrors: any = errors.list?.[safeIndex];
                                        const visibleSerial = startIndex + idx + 1;

                                        return (
                                            <tr
                                                key={compositeId ?? `row-${visibleSerial}`}
                                                className={visibleSerial % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                                <td className='border p-2 text-center'>{visibleSerial}</td>

                                                <td className='border p-2 text-center'>
                                                    <Controller
                                                        control={control}
                                                        name={`list.${safeIndex}.checkedvalue`}
                                                        render={({ field }) => (
                                                            <Checkbox
                                                                checked={!!field.value}
                                                                onCheckedChange={(v) => {
                                                                    field.onChange(!!v);
                                                                    if (!v) {
                                                                        clearErrors([
                                                                            `list.${safeIndex}.eycessS_MaxMarks`,
                                                                            `list.${safeIndex}.eycessS_MinMarks`,
                                                                            `list.${safeIndex}.eycessS_MarksEntryMax`,
                                                                            `list.${safeIndex}.emgR_GradeName`
                                                                        ] as any);
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </td>

                                                {/* Sub-Subject Name (Code) */}
                                                <td className='border p-2'>
                                                    <div className='text-sm'>
                                                        <div className='font-medium'>{row.emsS_SubSubjectName}</div>
                                                        {row.emsS_SubSubjectCode && (
                                                            <div className='text-slate-500 text-xs'>{row.emsS_SubSubjectCode}</div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Sub-Exam Name (Code) */}
                                                <td className='border p-2'>
                                                    <div className='text-sm'>
                                                        <div className='font-medium'>{row.emsE_SubExamName}</div>
                                                        {row.emsE_SubExamCode && (
                                                            <div className='text-slate-500 text-xs'>{row.emsE_SubExamCode}</div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Max Marks */}
                                                <td className='w-28 border p-2'>
                                                    <Controller
                                                        control={control}
                                                        name={`list.${safeIndex}.eycessS_MaxMarks`}
                                                        render={({ field }) => (
                                                            <Input
                                                                type='text'
                                                                disabled={!row.checkedvalue}
                                                                {...field}
                                                                value={field.value ?? ''}
                                                                onChange={(e) => {
                                                                    const raw = e.target.value.replace(/\D/g, '');
                                                                    handleMaxChange(safeIndex, raw === '' ? '' : raw, field.onChange);
                                                                }}
                                                                onBlur={() => {
                                                                    field.onBlur();
                                                                    const rowVal = getValues('list')[safeIndex];
                                                                    const rowErrs = validateRowManually(rowVal);
                                                                    if (rowErrs.eycessS_MaxMarks) {
                                                                        setError(`list.${safeIndex}.eycessS_MaxMarks` as any, {
                                                                            type: 'manual',
                                                                            message: rowErrs.eycessS_MaxMarks
                                                                        });
                                                                    } else {
                                                                        clearErrors([`list.${safeIndex}.eycessS_MaxMarks`] as any);
                                                                    }
                                                                }}
                                                                className={
                                                                    rowErrors?.eycessS_MaxMarks
                                                                        ? 'border-red-500 text-center'
                                                                        : 'text-center'
                                                                }
                                                                placeholder='Max'
                                                                inputMode='numeric'
                                                            />
                                                        )}
                                                    />
                                                    {rowErrors?.eycessS_MaxMarks && (
                                                        <p className='mt-1 text-[11px] text-red-500'>
                                                            {String(rowErrors.eycessS_MaxMarks.message ?? rowErrors.eycessS_MaxMarks)}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Min Marks */}
                                                <td className='w-28 border p-2'>
                                                    <Controller
                                                        control={control}
                                                        name={`list.${safeIndex}.eycessS_MinMarks`}
                                                        render={({ field }) => (
                                                            <Input
                                                                type='text'
                                                                disabled={!row.checkedvalue}
                                                                {...field}
                                                                value={field.value ?? ''}
                                                                onChange={(e) => {
                                                                    const raw = e.target.value.replace(/\D/g, '');
                                                                    handleMinChange(safeIndex, raw === '' ? '' : raw, field.onChange);
                                                                }}
                                                                onBlur={() => {
                                                                    field.onBlur();
                                                                    const rowVal = getValues('list')[safeIndex];
                                                                    const rowErrs = validateRowManually(rowVal);
                                                                    if (rowErrs.eycessS_MinMarks) {
                                                                        setError(`list.${safeIndex}.eycessS_MinMarks` as any, {
                                                                            type: 'manual',
                                                                            message: rowErrs.eycessS_MinMarks
                                                                        });
                                                                    } else {
                                                                        clearErrors([`list.${safeIndex}.eycessS_MinMarks`] as any);
                                                                    }
                                                                }}
                                                                className={
                                                                    rowErrors?.eycessS_MinMarks
                                                                        ? 'border-red-500 text-center'
                                                                        : 'text-center'
                                                                }
                                                                placeholder='Min'
                                                                inputMode='numeric'
                                                            />
                                                        )}
                                                    />
                                                    {rowErrors?.eycessS_MinMarks && (
                                                        <p className='mt-1 text-[11px] text-red-500'>
                                                            {String(rowErrors.eycessS_MinMarks.message ?? rowErrors.eycessS_MinMarks)}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Marks Entry Max */}
                                                <td className='w-28 border p-2'>
                                                    <Controller
                                                        control={control}
                                                        name={`list.${safeIndex}.eycessS_MarksEntryMax`}
                                                        render={({ field }) => (
                                                            <Input
                                                                type='text'
                                                                disabled={!row.checkedvalue}
                                                                {...field}
                                                                value={field.value ?? ''}
                                                                onChange={(e) => {
                                                                    const raw = e.target.value.replace(/\D/g, '');
                                                                    handleEntryChange(safeIndex, raw === '' ? '' : raw, field.onChange);
                                                                }}
                                                                onBlur={() => {
                                                                    field.onBlur();
                                                                    const rowVal = getValues('list')[safeIndex];
                                                                    const rowErrs = validateRowManually(rowVal);
                                                                    if (rowErrs.eycessS_MarksEntryMax) {
                                                                        setError(`list.${safeIndex}.eycessS_MarksEntryMax` as any, {
                                                                            type: 'manual',
                                                                            message: rowErrs.eycessS_MarksEntryMax
                                                                        });
                                                                    } else {
                                                                        clearErrors([`list.${safeIndex}.eycessS_MarksEntryMax`] as any);
                                                                    }
                                                                }}
                                                                className={
                                                                    rowErrors?.eycessS_MarksEntryMax
                                                                        ? 'border-red-500 text-center'
                                                                        : 'text-center'
                                                                }
                                                                placeholder='Entry'
                                                                inputMode='numeric'
                                                            />
                                                        )}
                                                    />
                                                    {rowErrors?.eycessS_MarksEntryMax && (
                                                        <p className='mt-1 text-[11px] text-red-500'>
                                                            {String(
                                                                rowErrors.eycessS_MarksEntryMax.message ?? rowErrors.eycessS_MarksEntryMax
                                                            )}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Grade */}
                                                <td className='w-40 border p-2'>
                                                    <Controller
                                                        control={control}
                                                        name={`list.${safeIndex}.emgR_GradeName`}
                                                        render={({ field }) => (
                                                            <Select
                                                                value={field.value ?? ''}
                                                                onValueChange={(val) => {
                                                                    field.onChange(val);
                                                                    clearErrors([`list.${safeIndex}.emgR_GradeName`] as any);
                                                                }}
                                                                disabled={!row.checkedvalue}>
                                                                <SelectTrigger
                                                                    className={rowErrors?.emgR_GradeName ? 'border-red-500' : ''}>
                                                                    <SelectValue placeholder='Select Grade' />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {gradeList.map((g) => (
                                                                        <SelectItem key={g.emgR_Id} value={g.emgR_GradeName}>
                                                                            {g.emgR_GradeName}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                    {rowErrors?.emgR_GradeName && (
                                                        <p className='mt-1 text-[11px] text-red-500'>
                                                            {String(rowErrors.emgR_GradeName.message ?? rowErrors.emgR_GradeName)}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Exempted Flag */}
                                                <td className='border p-2 text-center'>
                                                    <Controller
                                                        control={control}
                                                        name={`list.${safeIndex}.eycessS_ExemptedFlg`}
                                                        render={({ field }) => (
                                                            <Checkbox
                                                                checked={!!field.value}
                                                                onCheckedChange={(v) => {
                                                                    field.onChange(!!v);
                                                                    if (!v) {
                                                                        setValue(`list.${safeIndex}.eycessS_ExemptedPer`, 0);
                                                                        clearErrors([`list.${safeIndex}.eycessS_ExemptedPer`] as any);
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </td>

                                                {/* Exempted Percentage */}
                                                <td className='w-24 border p-2'>
                                                    <Controller
                                                        control={control}
                                                        name={`list.${safeIndex}.eycessS_ExemptedPer`}
                                                        render={({ field }) => (
                                                            <Input
                                                                type='text'
                                                                // use row.eycessS_ExemptedFlg to decide disabled (row is the displayed data)
                                                                disabled={!row.eycessS_ExemptedFlg}
                                                                value={field.value ?? ''}
                                                                onChange={(e) => {
                                                                    const raw = e.target.value.replace(/\D/g, '');
                                                                    handleExemptPerChange(safeIndex, raw === '' ? '' : raw, field.onChange);
                                                                }}
                                                                onBlur={() => {
                                                                    field.onBlur();
                                                                    const rowVal = getValues('list')[safeIndex];
                                                                    const rowErrs = validateRowManually(rowVal);
                                                                    if (rowErrs.eycessS_ExemptedPer) {
                                                                        setError(`list.${safeIndex}.eycessS_ExemptedPer` as any, {
                                                                            type: 'manual',
                                                                            message: rowErrs.eycessS_ExemptedPer
                                                                        });
                                                                    } else {
                                                                        clearErrors([`list.${safeIndex}.eycessS_ExemptedPer`] as any);
                                                                    }
                                                                }}
                                                                className='text-center'
                                                                placeholder='%'
                                                                inputMode='numeric'
                                                            />
                                                        )}
                                                    />
                                                    {rowErrors?.eycessS_ExemptedPer && (
                                                        <p className='mt-1 text-[11px] text-red-500'>
                                                            {String(rowErrors.eycessS_ExemptedPer.message ?? rowErrors.eycessS_ExemptedPer)}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Marks display / Grades display / Apply result */}
                                                <td className='border p-2 text-center'>
                                                    <Controller
                                                        control={control}
                                                        name={`list.${safeIndex}.eycessS_MarksFlg`}
                                                        render={({ field }) => (
                                                            <Checkbox
                                                                checked={!!field.value}
                                                                onCheckedChange={(v) => {
                                                                    field.onChange(!!v);
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </td>

                                                <td className='border p-2 text-center'>
                                                    <Controller
                                                        control={control}
                                                        name={`list.${safeIndex}.eycessS_GradesFlg`}
                                                        render={({ field }) => (
                                                            <Checkbox
                                                                checked={!!field.value}
                                                                onCheckedChange={(v) => {
                                                                    field.onChange(!!v);
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </td>

                                                <td className='border p-2 text-center'>
                                                    <Controller
                                                        control={control}
                                                        name={`list.${safeIndex}.eycessS_ActiveFlg`}
                                                        render={({ field }) => (
                                                            <Checkbox
                                                                checked={!!field.value}
                                                                onCheckedChange={(v) => {
                                                                    field.onChange(!!v);
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination Footer - Only show if more than 1 page */}
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
                                <ChevronRight className='h-4 w-4' />
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
                    <div className='ml-auto flex w-fit shrink-0 justify-end gap-2 border-t bg-white p-4'>
                        <Button type='button' variant='ghost' onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type='button'
                            onClick={handleSetOrder}
                            className='w-fit transition-all duration-200 hover:scale-90'
                            disabled={!watchedList || watchedList.length === 0}>
                            <GitCompareArrows className='h-4 w-4 transition-transform duration-200 group-hover:rotate-90' />
                            Set Order
                        </Button>

                        <Button type='button' className='flex w-fit' onClick={handleSave}>
                            Save & Close
                        </Button>
                    </div>
                </FormProvider>

                {/* Order modal */}
                {isOrderDetailsOpen && (
                    <MasterViewDetails
                        isOpen={isOrderDetailsOpen}
                        onClose={closeOrderDetails}
                        data={watchedList.map((d: any) => ({
                            ...d,
                            // Pass both IDs for proper matching
                            id: `${d.emsS_Id}_${d.emsE_Id}` // <-- Use composite ID
                        }))}
                        isLoading={isOrderloading}
                        isSaving={isOrderSaving}
                        columns={[
                            { key: 'id', label: 'SLNO', className: 'text-center w-12' },
                            { key: 'emsS_SubSubjectName', label: 'Sub-Subject Name', className: 'text-left' },
                            { key: 'emsE_SubExamName', label: 'Sub-Exam Name', className: 'text-left' },
                            { key: 'eycessS_SubSubjectOrder', label: 'Subject-SubSubject-SubExam Order', className: 'text-left' }
                        ]}
                        onSave={handleOrderSave}
                        tableHeight='500px'
                        title='Set Master Subject Order'
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

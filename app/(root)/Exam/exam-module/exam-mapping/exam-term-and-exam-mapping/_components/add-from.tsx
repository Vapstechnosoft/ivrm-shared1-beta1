'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DateField } from '@/components/ui/dateField';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExamTermAndExamMapping } from '@/hooks/exam/exammodule/exam-mapping';
import { useMasterGradeDropdownList } from '@/hooks/exam/exammodule/usemasters';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { ExamTermAndExamMappingSchema } from '@/schemas/exam/exam-module/exam-mapping';
import { getExamGroupsByCategory } from '@/server/exam/exam-module/exam-mapping/exam-subject-group-mapping';
import { addOrUpdateExamTermAndExamMapping } from '@/server/exam/exam-module/exam-mapping/examTerm-and-exam-mappiong';
import { getCategoryDropDownByAcademicYearlist } from '@/server/exam/exam-module/exam-mapping/yearly-category-dates-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof ExamTermAndExamMappingSchema.addOrUpdate>;

export default function AddExamTermAndExamMapping({ onSuccess }: { onSuccess?: () => void }) {
    // const orgId = 30;

    const methods = useForm<FormFields>({
        resolver: zodResolver(ExamTermAndExamMappingSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            ecT_Id: 0,
            mI_Id: 0,
            asmaY_Id: undefined,
            emcA_Id: 0,
            ecT_TermName: '',
            ecT_TermStartDate: '',
            ecT_TermEndDate: '',
            ecT_Marks: 0,
            ecT_MinMarks: 0,
            ecT_MarksPublishDate: '',
            emgR_Id: 0,
            exam_term: []
        }
    });

    const { refetchAll } = useExamTermAndExamMapping();
    const { control, handleSubmit, reset, setValue, formState, watch } = methods;
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const { isSubmitting, errors } = formState;

    const [addedRows, setAddedRows] = useState<FormFields['exam_term']>([]);
    const [categories, setCategories] = useState<{ emcA_Id: number; emcA_CategoryName: string }[]>([]);
    const [exams, setExams] = useState<{ emE_Id: number; emE_ExamName: string }[]>([]);

    const { replace } = useFieldArray({ control, name: 'exam_term' });

    const asmaY_Id = useWatch({ control, name: 'asmaY_Id' });
    const emcA_Id = useWatch({ control, name: 'emcA_Id' });
    const ecT_TermName = useWatch({ control, name: 'ecT_TermName' });
    const ecT_Marks = useWatch({ control, name: 'ecT_Marks' });
    const ecT_MinMarks = useWatch({ control, name: 'ecT_MinMarks' });
    const ecT_TermStartDate = useWatch({ control, name: 'ecT_TermStartDate' });
    const ecT_TermEndDate = useWatch({ control, name: 'ecT_TermEndDate' });
    const ecT_MarksPublishDate = useWatch({ control, name: 'ecT_MarksPublishDate' });
    const emgR_Id = useWatch({ control, name: 'emgR_Id' });

    const [entryExamId, setEntryExamId] = useState<number>(0);
    const [entryMarksFlag, setEntryMarksFlag] = useState<'M' | 'P'>('M');
    const [entryValue, setEntryValue] = useState<number | ''>('');
    const [entryRoundOff, setEntryRoundOff] = useState<boolean>(false);
    const [entryConversion, setEntryConversion] = useState<boolean>(false);
    const [entryNotApplicable, setEntryNotApplicable] = useState<boolean>(false);
    const [rowToDelete, setRowToDelete] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const topLocked = addedRows.length > 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();
    const { data: masterGrade, isLoading: masterGradeLoading, error: masterGradeError } = useMasterGradeDropdownList();

    useEffect(() => {
        if (!asmaY_Id || topLocked) return;
        async function fetchRelated() {
            try {
                const { data: cats } = await getCategoryDropDownByAcademicYearlist(asmaY_Id);
                setCategories(Array.isArray(cats) ? cats : []);
                if (Array.isArray(cats) && cats.length === 0) {
                    toast.info('No categories found for selected academic year');
                }
            } catch (err: any) {
                toast.error(err?.message ?? 'Failed to load related lists');
            }
        }
        fetchRelated();
    }, [asmaY_Id, topLocked, setValue]);

    useEffect(() => {
        if (!emcA_Id || !asmaY_Id || topLocked) return;
        async function fetchExams() {
            try {
                const { data: exs } = await getExamGroupsByCategory(asmaY_Id, emcA_Id);
                setExams(Array.isArray(exs) ? exs : []);
                if (Array.isArray(exs) && exs.length === 0) {
                    toast.info('No exams found for selected category');
                }
            } catch (err: any) {
                toast.error(err?.message ?? 'Failed to load exams');
            }
        }
        fetchExams();
    }, [asmaY_Id, emcA_Id, topLocked]);

    const topLevelValid =
        asmaY_Id !== null &&
        asmaY_Id !== undefined &&
        Number(asmaY_Id) > 0 &&
        emcA_Id !== null &&
        emcA_Id !== undefined &&
        Number(emcA_Id) > 0 &&
        ecT_TermName?.trim()?.length > 0 &&
        ecT_Marks !== null &&
        ecT_Marks !== undefined &&
        Number(ecT_Marks) > 0 &&
        ecT_MinMarks !== null &&
        ecT_MinMarks !== undefined &&
        Number(ecT_MinMarks) >= 0 &&
        ecT_TermStartDate?.trim()?.length > 0 &&
        ecT_TermEndDate?.trim()?.length > 0 &&
        ecT_MarksPublishDate?.trim()?.length > 0 &&
        emgR_Id !== null &&
        emgR_Id !== undefined &&
        Number(emgR_Id) > 0;

    const currentEntryValid = entryExamId !== null && entryExamId !== undefined && entryValue !== '' && Number(entryValue) > 0;

    function handleAddExamRow() {
        if (!topLevelValid) {
            toast.error('Please fill all required top-level fields before adding exam.');
            return;
        }

        if (!currentEntryValid) {
            toast.error('Please fill all required exam entry fields before adding.');
            return;
        }

        // Prevent duplicate exams
        const examAlreadyAdded = addedRows.some((row) => row.emE_Id === entryExamId);
        if (examAlreadyAdded) {
            toast.error('This exam is already added!');
            return;
        }

        const totalMarksOrPercentage = addedRows.reduce((acc, curr) => acc + Number(curr.ecteX_MarksPercentValue || 0), 0);
        const newTotal = totalMarksOrPercentage + Number(entryValue || 0);

        if (newTotal > Number(ecT_Marks || 0)) {
            toast.error(`Total (${newTotal}) cannot exceed term marks (${ecT_Marks})`);
            return;
        }

        const selectedExam = exams.find((e) => e.emE_Id === entryExamId);
        if (!selectedExam) {
            toast.error('Invalid exam selected');
            return;
        }

        const newRow = {
            emE_Id: entryExamId,
            emE_ExamName: selectedExam.emE_ExamName,
            ecteX_MarksPerFlag: entryMarksFlag,
            ecteX_MarksPercentValue: Number(entryValue),
            ecteX_RoundOffReqFlg: entryRoundOff,
            ecteX_ConversionReqFlg: entryConversion,
            ecteX_NotApplicableToTotal: entryNotApplicable
        };

        const updatedRows = [...addedRows, newRow];
        setAddedRows(updatedRows);
        setValue('exam_term', updatedRows); // Keep RHF in sync

        // Reset entry
        setEntryExamId(0);
        setEntryValue('');
        setEntryMarksFlag('M');
        setEntryRoundOff(false);
        setEntryConversion(false);
        setEntryNotApplicable(false);

        toast.success('Exam added successfully');
    }

    function handleDeleteRow(index: number) {
        setAddedRows((prev) => prev.filter((_, i) => i !== index));
    }

    const onSubmit = async (data: FormFields) => {
        if (!addedRows.length) {
            toast.error('Add at least one exam row before saving');
            return;
        }

        // Sync to field array for validation
        replace(addedRows);

        // // Wait a tick for validation
        // await new Promise((resolve) => setTimeout(resolve, 0));

        // // Check for validation errors
        // if (Object.keys(errors).length > 0) {
        //     toast.error('Please fix form errors before submitting');
        //     return;
        // }

        try {
            // Build API payload matching the required structure
            const payload = {
                ecT_Id: data.ecT_Id ?? 0,
                mI_Id: 0,
                asmaY_Id: data.asmaY_Id,
                emcA_Id: data.emcA_Id,
                emgR_Id: data.emgR_Id,
                ecT_TermName: data.ecT_TermName.trim(),
                ecT_TermStartDate: data.ecT_TermStartDate,
                ecT_TermEndDate: data.ecT_TermEndDate,
                ecT_MarksPublishDate: data.ecT_MarksPublishDate,
                ecT_Marks: data.ecT_Marks,
                ecT_MinMarks: data.ecT_MinMarks,

                exam_term: addedRows.map((r) => ({
                    emE_Id: r.emE_Id,
                    emE_ExamName: r.emE_ExamName,
                    ecteX_MarksPerFlag: r.ecteX_MarksPerFlag,
                    ecteX_MarksPercentValue: r.ecteX_MarksPercentValue,
                    ecteX_RoundOffReqFlg: r.ecteX_RoundOffReqFlg, // boolean
                    ecteX_ConversionReqFlg: r.ecteX_ConversionReqFlg, // boolean
                    ecteX_NotApplicableToTotal: r.ecteX_NotApplicableToTotal // boolean
                }))
            };
            const res = await addOrUpdateExamTermAndExamMapping(payload);
            if (res?.success) {
                toast.success('Exam term mapping saved successfully');
                reset();
                setAddedRows([]);
                onSuccess?.();
                refetchAll?.();
            } else {
                toast.error(res?.message ?? 'Save failed');
            }
        } catch (err: any) {
            console.error('Submit error:', err);
            toast.error(err?.message ?? 'Failed to save');
        }
    };
    function handleReset() {
        // Reset all form fields to initial state
        reset({
            ecT_Id: 0,
            mI_Id: 0,
            asmaY_Id: undefined,
            emcA_Id: 0,
            ecT_TermName: '',
            ecT_TermStartDate: '',
            ecT_TermEndDate: '',
            ecT_MarksPublishDate: '',
            ecT_Marks: 0,
            ecT_MinMarks: 0,
            emgR_Id: 0,
            exam_term: []
        });

        // Clear all local state
        setAddedRows([]);
        setEntryExamId(0);
        setEntryMarksFlag('M');
        setEntryValue('');
        setEntryRoundOff(false);
        setEntryConversion(false);
        setEntryNotApplicable(false);

        // Optional: refresh dropdown data
        setCategories([]);
        setExams([]);

        toast.info('Form has been reset');
    }
    function handleCancel() {
        setAddedRows([]);
        setEntryExamId(0);
        setEntryMarksFlag('M');
        setEntryValue('');
        setEntryRoundOff(false);
        setEntryConversion(false);
        setEntryNotApplicable(false);
    }
    // Add this function near other handler functions (after handleDeleteRow)
    function handleConfirmDelete() {
        if (rowToDelete !== null) {
            // Get the exam name before deleting for toast message
            const examName = addedRows[rowToDelete]?.emE_ExamName || 'the exam';

            // Call the existing delete function
            handleDeleteRow(rowToDelete);

            // Show success message
            toast.success(`"${examName}" deleted successfully`);

            // Close the modal
            setShowDeleteConfirm(false);
            setRowToDelete(null);
        }
    }
    useEffect(() => {
        if (addedRows.length > 0) {
            tableRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [addedRows]);
    const tableRef = useRef<HTMLDivElement>(null);

    return (
        <div className='flex w-full flex-col gap-6'>
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(onSubmit, (errs) => {
                        const firstErrorKey = Object.keys(errs)[0];
                        const firstError = firstErrorKey && (errs as Record<string, any>)[firstErrorKey];
                        const errorMessage = firstError?.message || 'Something went wrong';
                        toast.error(errorMessage);
                    })}
                    className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md'
                    noValidate>
                    <div className='grid grid-cols-2 gap-6'>
                        {/* Left Column */}
                        <div>
                            <Controller
                                control={control}
                                name='asmaY_Id'
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>
                                            Academic Year <span className='text-red-500'>*</span>
                                        </Label>

                                        <Select
                                            key={field.value} // <— forces remount when value changes
                                            value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            disabled={topLocked}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Academic Year' />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {academicYearLoading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading Academic Year...
                                                    </SelectItem>
                                                ) : academicYearError ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading Academic Year
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

                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />

                            <Controller
                                control={control}
                                name='ecT_TermName'
                                render={({ field, fieldState }) => (
                                    <div className='mt-4'>
                                        <Label>
                                            Term Name <span className='text-red-500'>*</span>
                                        </Label>
                                        <Input {...field} placeholder='Enter Term Name' disabled={topLocked} />
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />
                            <div className='flex w-full flex-row gap-4'>
                                <div className='flex-1'>
                                    <Controller
                                        control={control}
                                        name='ecT_Marks'
                                        render={({ field, fieldState }) => (
                                            <div className='mt-4 w-full'>
                                                <Label>
                                                    Term Marks <span className='text-red-500'>*</span>
                                                </Label>
                                                <Input
                                                    type='number'
                                                    {...field}
                                                    value={field.value || ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                                                        field.onChange(val);
                                                    }}
                                                    placeholder='Enter Marks'
                                                    disabled={topLocked}
                                                    className='w-full'
                                                />
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className='flex-1'>
                                    <Controller
                                        control={control}
                                        name='ecT_MinMarks'
                                        render={({ field, fieldState }) => (
                                            <div className='mt-4 w-full'>
                                                <Label>
                                                    Min Marks <span className='text-red-500'>*</span>
                                                </Label>
                                                <Input
                                                    type='number'
                                                    {...field}
                                                    value={field.value || ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                                                        field.onChange(val);
                                                    }}
                                                    placeholder='Enter Min Marks'
                                                    disabled={topLocked}
                                                    className='w-full'
                                                />
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            <Controller
                                control={control}
                                name='emcA_Id'
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>
                                            Category <span className='text-red-500'>*</span>
                                        </Label>

                                        <Select
                                            key={field.value} // <— forces remount when value changes
                                            value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            disabled={topLocked}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Category' />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {categories.map((c) => (
                                                    <SelectItem key={c.emcA_Id} value={String(c.emcA_Id)}>
                                                        {c.emcA_CategoryName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />

                            <div className='flex flex-rows-3 gap-4'>
                                <Controller
                                    control={control}
                                    name='ecT_TermStartDate'
                                    render={({ field, fieldState }) => (
                                        <DateField
                                            field={field}
                                            fieldState={fieldState}
                                            label='Term Start Date'
                                            placeholder='Select Date'
                                            fromDate={today}
                                            toDate={watch('ecT_TermEndDate') ? new Date(watch('ecT_TermEndDate')) : undefined}
                                            restricted_tofieldName='Term End Date'
                                            restricted_fromfieldName='Today'
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name='ecT_TermEndDate'
                                    render={({ field, fieldState }) => (
                                        <DateField
                                            field={field}
                                            fieldState={fieldState}
                                            label='Term End Date'
                                            placeholder='Select Date'
                                            fromDate={
                                                methods.watch('ecT_TermStartDate') === '' ? today : new Date(watch('ecT_TermStartDate'))
                                            }
                                            restricted_fromfieldName='Term Start Date'
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name='ecT_MarksPublishDate'
                                    render={({ field, fieldState }) => (
                                        <DateField
                                            field={field}
                                            fieldState={fieldState}
                                            label='Term Publish Date'
                                            placeholder='Select Date'
                                            fromDate={methods.watch('ecT_TermEndDate') === '' ? today : new Date(watch('ecT_TermEndDate'))}
                                            restricted_fromfieldName='Term End Date'
                                        />
                                    )}
                                />
                            </div>

                            <Controller
                                control={control}
                                name='emgR_Id'
                                render={({ field, fieldState }) => (
                                    <div className='mt-4'>
                                        <Label>
                                            Grade <span className='text-red-500'>*</span>
                                        </Label>
                                        <Select
                                            onValueChange={(val) => !topLocked && field.onChange(Number(val))}
                                            value={field.value ? String(field.value) : undefined}
                                            disabled={topLocked}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Grade' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {masterGradeLoading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading Grades...
                                                    </SelectItem>
                                                ) : masterGradeError ? (
                                                    <SelectItem value='error' disabled>
                                                        Error Loading Grades
                                                    </SelectItem>
                                                ) : (
                                                    Array.isArray(masterGrade?.data) &&
                                                    masterGrade?.data?.map((item: { emgR_Id: number; emgR_GradeName: string }) => (
                                                        <SelectItem key={item.emgR_Id} value={item.emgR_Id.toString()}>
                                                            {item.emgR_GradeName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    {/* Exam entry editor */}
                    <div className='mt-6 rounded-lg border bg-gray-50 p-4'>
                        <div className='grid grid-cols-5 items-end gap-3'>
                            <div>
                                <Label>
                                    Exam <span className='text-red-500'>*</span>
                                </Label>
                                <Select
                                    key={entryExamId}
                                    value={entryExamId && entryExamId !== 0 ? String(entryExamId) : undefined}
                                    onValueChange={(val) => setEntryExamId(Number(val))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Exam' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {exams.map((ex) => (
                                            <SelectItem key={ex.emE_Id} value={String(ex.emE_Id)}>
                                                {ex.emE_ExamName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>
                                    Marks / Percentage <span className='text-red-500'>*</span>
                                </Label>
                                <div className='mt-1 flex items-center gap-2'>
                                    <label className='flex items-center gap-1'>
                                        <input
                                            type='radio'
                                            name='entryMarksFlag'
                                            checked={entryMarksFlag === 'M'}
                                            onChange={() => setEntryMarksFlag('M')}
                                        />
                                        <span>Marks</span>
                                    </label>
                                    <label className='flex items-center gap-1'>
                                        <input
                                            type='radio'
                                            name='entryMarksFlag'
                                            checked={entryMarksFlag === 'P'}
                                            onChange={() => setEntryMarksFlag('P')}
                                        />
                                        <span>Percentage</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <Label>
                                    Value <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    type='number'
                                    value={entryValue === '' ? '' : entryValue}
                                    onChange={(e) => setEntryValue(e.target.value === '' ? '' : Number(e.target.value))}
                                    placeholder='Enter value'
                                    onKeyDown={(e) => {
                                        if (['e', 'E', '+', '-'].includes(e.key)) {
                                            e.preventDefault(); // 🚫 Block unwanted chars
                                        }
                                    }}
                                />
                            </div>
                            <div className='col-span-2'>
                                <div className='flex flex-wrap items-center gap-4'>
                                    <div className='flex items-center gap-2'>
                                        <Checkbox
                                            id='roundoff'
                                            checked={entryRoundOff}
                                            onCheckedChange={(checked) => setEntryRoundOff(checked === true)}
                                        />
                                        <label htmlFor='roundoff' className='cursor-pointer text-sm'>
                                            Roundoff
                                        </label>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <Checkbox
                                            id='conversion'
                                            checked={entryConversion}
                                            onCheckedChange={(checked) => setEntryConversion(checked === true)}
                                        />
                                        <label htmlFor='conversion' className='cursor-pointer text-sm'>
                                            Conversion
                                        </label>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <Checkbox
                                            id='not-applicable'
                                            checked={entryNotApplicable}
                                            onCheckedChange={(checked) => setEntryNotApplicable(checked === true)}
                                        />
                                        <label htmlFor='not-applicable' className='cursor-pointer text-sm'>
                                            Not Applicable
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-5 mt-3 flex justify-center gap-4 '>
                                <Button type='button' onClick={handleAddExamRow} className='w-fit' disabled={!currentEntryValid}>
                                    Add Exam
                                </Button>
                                <Button className='flex w-fit' type='button' variant='outline' onClick={() => handleCancel()}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Table and errors */}
                    {addedRows.length > 0 && (
                        <div className='mt-6'>
                            <Label>Added Exams</Label>

                            <div className='mt-3 overflow-x-auto'>
                                <div className='overflow-hidden rounded-xl border border-gray-300 shadow-sm' ref={tableRef}>
                                    <table className='w-full border-separate border-spacing-0'>
                                        <thead>
                                            <tr className='border-gray-300 border-b bg-gray-50 text-left font-normal text-[#78716C]'>
                                                <th className='border-gray-300 border-r px-3 py-2 font-normal first:rounded-tl-xl'>SLNO</th>
                                                <th className='border-gray-300 border-r px-3 py-2 font-normal'>Exam</th>
                                                <th className='border-gray-300 border-r px-3 py-2 font-normal'>Type</th>
                                                <th className='border-gray-300 border-r px-3 py-2 font-normal'>Value</th>
                                                <th className='border-gray-300 border-r px-3 py-2 font-normal'>Round Off</th>
                                                <th className='border-gray-300 border-r px-3 py-2 font-normal'>Conversion</th>
                                                <th className='border-gray-300 border-r px-3 py-2 font-normal'>Not Applicable</th>
                                                <th className='px-3 py-2 font-normal last:rounded-tr-xl'>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {addedRows.map((r, idx) => (
                                                <tr
                                                    key={idx}
                                                    className='border-gray-300 border-t text-sm transition-colors duration-200 hover:bg-accent/90 [&>*]:px-2 [&>*]:py-1'>
                                                    <td className='border-gray-300 border-r px-3 '>{idx + 1}</td>
                                                    <td className='border-gray-300 border-r px-3'>{r.emE_ExamName}</td>
                                                    <td className='border-gray-300 border-r px-3'>
                                                        {r.ecteX_MarksPerFlag === 'M' ? 'Marks' : 'Percentage'}
                                                    </td>
                                                    <td className='border-gray-300 border-r px-3'>{r.ecteX_MarksPercentValue}</td>
                                                    <td className='border-gray-300 border-r px-3'>
                                                        {r.ecteX_RoundOffReqFlg ? 'Yes' : 'No'}
                                                    </td>
                                                    <td className='border-gray-300 border-r px-3'>
                                                        {r.ecteX_ConversionReqFlg ? 'Yes' : 'No'}
                                                    </td>
                                                    <td className='border-gray-300 border-r px-3'>
                                                        {r.ecteX_NotApplicableToTotal ? 'Yes' : 'No'}
                                                    </td>
                                                    <td className='px-3 py-2 text-center'>
                                                        <Button
                                                            variant='ghost'
                                                            size='sm'
                                                            onClick={() => {
                                                                setRowToDelete(idx);
                                                                setShowDeleteConfirm(true);
                                                            }}
                                                            className='group h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-600'>
                                                            <Trash2 className='h-4 w-4 transition-transform duration-200 group-hover:rotate-12' />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className='mt-6 flex w-fit gap-4'>
                        <Button type='submit' disabled={isSubmitting || addedRows.length === 0}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Button type='button' variant='outline' onClick={() => handleReset()}>
                            Reset
                        </Button>
                    </div>
                </form>
            </FormProvider>
            {/* Add this just before the closing </div> of the main container */}
            {showDeleteConfirm && (
                <div className='fixed inset-0 z-[9999] flex items-center justify-center p-6'>
                    {/* Backdrop */}
                    <div
                        className='absolute inset-0 bg-black/60'
                        onClick={() => {
                            setShowDeleteConfirm(false);
                            setRowToDelete(null);
                        }}
                    />

                    {/* Confirmation Popup */}
                    <div className='relative z-[10000] w-[90%] max-w-md overflow-hidden rounded-xl border bg-white shadow-2xl'>
                        <div className='p-6'>
                            <div className='mb-4 flex items-center gap-3'>
                                <div className='rounded-full bg-destructive/20 p-2'>
                                    <AlertTriangle className='h-6 w-6 text-destructive' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-lg'>Delete Exam</h3>
                                    <p className='text-muted-foreground text-sm'>This action cannot be undone</p>
                                </div>
                            </div>

                            <p className='mb-4'>
                                Are you sure you want to delete{' '}
                                <strong className='text-destructive'>
                                    "{rowToDelete !== null ? addedRows[rowToDelete]?.emE_ExamName : ''}"
                                </strong>
                                ?
                            </p>

                            <div className='space-y-2 text-muted-foreground text-sm'>
                                <div className='flex justify-between'>
                                    <span>Type:</span>
                                    <span className='font-medium'>
                                        {rowToDelete !== null && addedRows[rowToDelete]?.ecteX_MarksPerFlag === 'M'
                                            ? 'Marks'
                                            : 'Percentage'}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Value:</span>
                                    <span className='font-medium'>
                                        {rowToDelete !== null ? addedRows[rowToDelete]?.ecteX_MarksPercentValue : ''}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-end gap-3 border-t p-4'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setRowToDelete(null);
                                }}
                                className='min-w-[100px]'>
                                Cancel
                            </Button>
                            <Button type='button' variant='destructive' onClick={handleConfirmDelete} className='min-w-[100px]'>
                                <Trash2 className='mr-2 h-4 w-4' />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

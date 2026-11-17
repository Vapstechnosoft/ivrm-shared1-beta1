'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHallTicketGeneratedList } from '@/hooks/exam/exammodule/exam-mapping';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { hallTicketGenerationSchema } from '@/schemas/exam/exam-module/exam-mapping';
import { GenerateHalltickets } from '@/server/exam/exam-module/exam-mapping/hallTicket-generation';
import {
    getClassDropDownByAcademicYearlist,
    getExamsDropDownByAcademicYearandClassandSectionlist,
    getSectionsDropDownByAcademicYearandClasslist
} from '@/server/exam/exam-module/reports/cumulative-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

/**
 * Types
 *
 * Keep FormFields strongly typed by inferring from the imported zod schema.
 * If your schema doesn't include 'leadingzeros', TypeScript may complain.
 * If you prefer to avoid type friction while iterating, temporarily use `any`.
 */
type FormFields = z.infer<typeof hallTicketGenerationSchema>;

/**
 * NOTE:
 * If your schema currently does NOT include `leadingzeros`, please add it to the schema:
 *   leadingzeros: z.number().int().nonnegative().optional().default(0)
 *
 * Otherwise adapt the component to match your schema.
 */

/**
 * Component
 */
export default function HallTicketGenerationForm({ onSuccess }: { onSuccess?: () => void }) {
    // ---------- useForm / methods ----------
    // We capture the entire methods object and pass it into FormProvider
    // so that nested Controllers and other logic use the same form instance.
    const methods = useForm<FormFields>({
        resolver: zodResolver(hallTicketGenerationSchema) as any,
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            // Defaults — cast as any to tolerate slight schema mismatches while you iterate.
            // mI_Id: 30,
            asmaY_Id: 0,
            asmcL_Id: 0,
            classList: [],
            sectionList: [],
            emE_Id: 0,
            prefixNo: '',
            startingNo: '',
            increment: '',
            prefixNoFlag: 'N',
            leadingzeros: 0
        } as any
    });

    // Destructure commonly used helpers from the methods object (still keep methods to feed FormProvider)
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors, isSubmitting }
    } = methods;

    // ---------- Local state for dropdown options ----------
    const [classes, setClasses] = useState<{ asmcL_Id: number; asmcL_ClassName: string }[]>([]);
    const [sections, setSections] = useState<{ asmS_Id: number; asmC_SectionName: string }[]>([]);
    const [exams, setExams] = useState<{ emE_Id: number; emE_ExamName: string }[]>([]);

    // Loading indicators for each async dropdown
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingExams, setLoadingExams] = useState(false);

    // Hook for refreshing generated list after success (optional)
    const { refetchAll } = useHallTicketGeneratedList();

    // Academic year dropdown hook
    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();

    // ---------- Watchers (live) ----------
    // Watch fields — useWatch ensures we get updated values when user interacts
    const selectedYear = useWatch({ control, name: 'asmaY_Id' }) as number | undefined;
    const selectedClass = useWatch({ control, name: 'asmcL_Id' }) as number | undefined;
    const selectedSections = useWatch({ control, name: 'sectionList' }) as { asmS_Id: number }[] | undefined;

    // ---------- Helper: safeReadNumber ----------
    const safeNumber = (v: unknown, fallback = 0) => {
        const n = Number(v as any);
        return Number.isFinite(n) ? n : fallback;
    };

    // ---------- Load Classes when year changes ----------
    useEffect(() => {
        if (!selectedYear) return;

        let mounted = true;
        (async () => {
            try {
                setLoadingClasses(true);
                const { data } = await getClassDropDownByAcademicYearlist(selectedYear);
                if (!mounted) return;
                setClasses(Array.isArray(data) ? data : []);
                // reset dependent values: when year changes we clear selected sections and exam
                setValue('sectionList', [] as any[]);
                setValue('emE_Id', 0 as any);
                setExams([]);
            } catch (err) {
                console.error('load classes error', err);
                toast.error('Failed to load classes');
            } finally {
                if (mounted) setLoadingClasses(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [selectedYear, setValue]);

    // ---------- Load Sections when class changes ----------
    useEffect(() => {
        if (!selectedYear || !selectedClass) return;

        let mounted = true;
        (async () => {
            try {
                setLoadingSections(true);
                setSections([]);
                const { data } = await getSectionsDropDownByAcademicYearandClasslist(selectedYear, selectedClass);
                if (!mounted) return;
                setSections(Array.isArray(data) ? data : []);
                // reset dependent exam & section selection
                setValue('emE_Id', 0 as any);
                setValue('sectionList', [] as any);
            } catch (err) {
                console.error('load sections error', err);
                toast.error('Failed to load sections');
            } finally {
                if (mounted) setLoadingSections(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [selectedYear, selectedClass, setValue]);

    // ---------- Load Exams when section(s) selected ----------
    useEffect(() => {
        if (!selectedYear || !selectedClass || !selectedSections?.length) return;

        let mounted = true;
        (async () => {
            setLoadingExams(true);
            try {
                // For api we pick first selected section id (same as your code)
                const firstSectionId = selectedSections?.[0]?.asmS_Id ?? selectedSections?.[0];
                const { data } = await getExamsDropDownByAcademicYearandClassandSectionlist(
                    selectedYear,
                    selectedClass,
                    Number(firstSectionId)
                );
                if (!mounted) return;
                const safeData = Array.isArray(data) ? data : [];
                setExams(safeData);
                if (safeData.length === 0) {
                    toast.info('No exams are mapped for your selections');
                }
                setValue('emE_Id', 0 as any);
            } catch (err) {
                console.error('load exams error', err);
                toast.error('Failed to load exams');
            } finally {
                if (mounted) setLoadingExams(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [selectedYear, selectedClass, selectedSections, setValue]);

    // ---------- Helper: makePayload ----------
    const makePayload = (data: FormFields) => {
        // canonicalize section list (array of { asmS_Id })
        const sectionArray = Array.isArray((data as any).sectionList) ? (data as any).sectionList : [];
        const sectionlist = sectionArray.map((s: any) => ({ asmS_Id: Number(s.asmS_Id) || 0 }));
        const sectionids = sectionArray
            .map((s: any) => String(s.asmS_Id ?? ''))
            .filter(Boolean)
            .join(',');

        // read leadingzeros from the form if present (some schemas may call it 'leadingzeros')
        const leadingzerosVal = (data as any).leadingzeros !== undefined ? safeNumber((data as any).leadingzeros, 0) : 0;

        const payload = {
            mI_Id: safeNumber((data as any).mI_Id, 0),
            asmaY_Id: safeNumber((data as any).asmaY_Id, 0),
            asmcL_Id: safeNumber((data as any).asmcL_Id, 0),
            emE_Id: safeNumber((data as any).emE_Id, 0),
            prefixstr: (data as any).prefixNo ?? '',
            sectionids,
            startno: safeNumber((data as any).startingNo ?? (data as any).startno ?? 0, 0),
            increment: safeNumber((data as any).increment ?? 0, 0),
            leadingzeros: leadingzerosVal,
            sectionlist
        };

        return payload;
    };

    // ---------- Submit handler ----------
    const onSubmit = async (data: FormFields) => {
        try {
            // Build exact payload format you asked for
            const payload = makePayload(data);

            // Debug log
            console.info('HallTicket payload ->', payload);

            // Call server API (await)
            const res = await GenerateHalltickets(payload);

            // Expecting res.success / res.message
            // biome-ignore lint/complexity/useOptionalChain: <explanation>
            if (res && res.success) {
                toast.success(res.message || 'Hall tickets generated successfully!');
                // re-fetch generated list if available
                try {
                    refetchAll?.();
                    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
                } catch (e) {
                    // if refetchAll not available or fails, ignore
                }
                onSuccess?.();
                // Reset the form to default values but keep selected academic year for convenience
                const curYear = getValues('asmaY_Id');
                reset({
                    ...methods.getValues(),
                    mI_Id: 0,
                    asmaY_Id: curYear ?? 0,
                    asmcL_Id: 0,
                    classList: [],
                    sectionList: [],
                    emE_Id: 0,
                    prefixNo: '',
                    startingNo: '',
                    increment: '',
                    prefixNoFlag: 'N',
                    leadingzeros: 0
                } as any);
            } else {
                // biome-ignore lint/complexity/useOptionalChain: <explanation>
                toast.error((res && res.message) || 'Update failed');
            }
        } catch (err: any) {
            console.error('generate error', err);
            toast.error(err?.message || 'Failed to generate hall tickets');
        }
    };

    // ---------- Error logging (useEffect) ----------
    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            // Full object for debugging
            console.info('❌ Validation Errors object:', errors);

            // Human readable lines
            Object.entries(errors).forEach(([field, info]) => {
                // react-hook-form nested errors are objects; we stringify a helpful message
                if (!info) return;
                // simple shape: info.message
                const msg = (info as any)?.message ?? JSON.stringify(info);
                console.info(` - ${field}: ${msg}`);
            });
        }
    }, [errors]);

    // ---------- Small helper UI functions ----------
    const isEmptyArray = (a: any[]) => !Array.isArray(a) || a.length === 0;

    // ---------- Render ----------
    return (
        <div className='w-full rounded-2xl bg-white p-8 shadow-lg'>
            {/* Provide form methods to children */}
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-8' noValidate>
                    <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
                        {/* LEFT COLUMN */}
                        <div className='space-y-6'>
                            {/* Academic Year */}
                            <Controller
                                control={control}
                                name='asmaY_Id'
                                render={({ field, fieldState }) => (
                                    <div className='flex items-center gap-4'>
                                        <Label className='w-40 text-right'>
                                            Academic Year <span className='text-red-500'>*</span>
                                        </Label>
                                        <div className='flex-1'>
                                            <Select
                                                key={field.value}
                                                value={String(field.value)}
                                                onValueChange={(val) => field.onChange(Number(val))}>
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
                                                        academicYear?.data?.map((item: any) => (
                                                            <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                                {item.asmaY_Year}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    </div>
                                )}
                            />

                            {/* Class - Single Select */}
                            <Controller
                                control={control}
                                name='asmcL_Id'
                                render={({ field, fieldState }) => (
                                    <div className='flex items-center gap-4'>
                                        <Label className='w-40 text-right'>
                                            Class <span className='text-red-500'>*</span>
                                        </Label>
                                        <div className='flex-1'>
                                            <Select
                                                key={field.value}
                                                onValueChange={(v) => field.onChange(Number(v))}
                                                value={String(field.value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select Class' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {loadingClasses ? (
                                                        <SelectItem value='loading' disabled>
                                                            Loading classes...
                                                        </SelectItem>
                                                    ) : classes.length === 0 ? (
                                                        <SelectItem value='none' disabled>
                                                            No Classes available
                                                        </SelectItem>
                                                    ) : (
                                                        classes.map((c) => (
                                                            <SelectItem key={c.asmcL_Id} value={String(c.asmcL_Id)}>
                                                                {c.asmcL_ClassName}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    </div>
                                )}
                            />

                            {/* Section - Multi Select */}
                            <Controller
                                control={control}
                                name='sectionList'
                                render={({ field, fieldState }) => (
                                    <div className='flex items-start gap-4'>
                                        <Label className='w-40 pt-2 text-right'>
                                            Section <span className='text-red-500'>*</span>
                                        </Label>
                                        <div className='flex-1'>
                                            <CustomMultiSelectBox
                                                options={sections.map((s) => ({ label: s.asmC_SectionName, value: String(s.asmS_Id) }))}
                                                value={field.value?.map((s: any) => String(s.asmS_Id)) || []}
                                                onChange={(vals) =>
                                                    field.onChange(vals.map((id: string | number) => ({ asmS_Id: Number(id) })))
                                                }
                                                disabled={!selectedYear || sections.length === 0}
                                                height='200px'
                                                isSearchRequired
                                                isLoading={loadingSections}
                                                error={fieldState.error?.message}
                                            />
                                        </div>
                                    </div>
                                )}
                            />

                            {/* Exam Name */}
                            <Controller
                                control={control}
                                name='emE_Id'
                                render={({ field, fieldState }) => (
                                    <div className='flex items-center gap-4'>
                                        <Label className='w-40 text-right'>
                                            Exam Name <span className='text-red-500'>*</span>
                                        </Label>
                                        <div className='flex-1'>
                                            <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select Exam' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {loadingExams ? (
                                                        <SelectItem value='loading' disabled>
                                                            Loading exams...
                                                        </SelectItem>
                                                    ) : exams.length === 0 ? (
                                                        <SelectItem value='none' disabled>
                                                            No Exams available
                                                        </SelectItem>
                                                    ) : (
                                                        exams.map((e) => (
                                                            <SelectItem key={e.emE_Id} value={String(e.emE_Id)}>
                                                                {e.emE_ExamName}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    </div>
                                )}
                            />
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className='space-y-6'>
                            {/* Prefix */}
                            <div className='flex items-center gap-4'>
                                <Label className='w-40 text-right'>Prefix</Label>
                                <div className='flex-1'>
                                    <Controller
                                        control={control}
                                        name='prefixNo'
                                        render={({ field }) => <Input {...field} placeholder='Enter Prefix' className='w-full' />}
                                    />
                                </div>
                            </div>

                            {/* Starting No */}
                            <Controller
                                control={control}
                                name='startingNo'
                                render={({ field, fieldState }) => (
                                    <div className='flex items-center gap-4'>
                                        <Label className='w-40 text-right'>
                                            Starting No.notes <span className='text-red-500'>*</span>
                                        </Label>
                                        <div className='flex-1'>
                                            <Input {...field} placeholder='Enter Starting No.' className='w-full' />
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    </div>
                                )}
                            />

                            {/* Increment */}
                            <Controller
                                control={control}
                                name='increment'
                                render={({ field, fieldState }) => (
                                    <div className='flex items-center gap-4'>
                                        <Label className='w-40 text-right'>
                                            Increment <span className='text-red-500'>*</span>
                                        </Label>
                                        <div className='flex-1'>
                                            <Input {...field} placeholder='Enter Increment' className='w-full' />
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    </div>
                                )}
                            />

                            {/* Leading Zeros */}
                            <Controller
                                control={control}
                                name='leadingzeros'
                                defaultValue={0 as any}
                                render={({ field }) => (
                                    <div className='flex items-center gap-4'>
                                        <Label className='w-40 text-right'>Leading Zeros</Label>
                                        <div className='flex-1'>
                                            <Input
                                                type='number'
                                                placeholder='Enter Leading Zeros'
                                                className='w-full'
                                                value={field.value ?? 0}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value || 0);
                                                    field.onChange(Number.isFinite(val) ? val : 0);
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            />

                            {/* PrefixNo Yes/No */}
                            <div className='flex items-center gap-4'>
                                <Label className='w-40 text-right'>PrefixNo.</Label>
                                <div className='flex items-center gap-6'>
                                    <Controller
                                        control={control}
                                        name='prefixNoFlag'
                                        render={({ field }) => (
                                            <>
                                                {/* YES OPTION */}
                                                <div className='flex items-center gap-2'>
                                                    <Checkbox
                                                        id='prefixYes'
                                                        checked={field.value === 'Y'}
                                                        onCheckedChange={(checked) => field.onChange(checked ? 'Y' : 'N')}
                                                    />

                                                    <label htmlFor='prefixYes' className='cursor-pointer font-medium text-sm'>
                                                        Yes
                                                    </label>
                                                </div>

                                                {/* NO OPTION */}
                                                <div className='flex items-center gap-2'>
                                                    <Checkbox
                                                        id='prefixNo'
                                                        checked={field.value === 'N'}
                                                        onCheckedChange={(checked) => field.onChange(checked ? 'N' : 'Y')}
                                                    />

                                                    <label htmlFor='prefixNo' className='cursor-pointer font-medium text-sm'>
                                                        No
                                                    </label>
                                                </div>

                                                {/* INPUT BOX */}
                                                <Input
                                                    placeholder='Enter Prefix No.'
                                                    value={field.value === 'Y' ? getValues('prefixNo') : ''}
                                                    onChange={(e) => setValue('prefixNo', e.target.value)}
                                                    disabled={field.value !== 'Y'}
                                                    className='w-48 transition-opacity'
                                                />
                                            </>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className='flex w-fit justify-center gap-4 pt-6'>
                        <Button
                            type='button'
                            variant='outline'
                            size='lg'
                            onClick={() => {
                                reset({
                                    // mI_Id: 30,
                                    asmaY_Id: 0,
                                    asmcL_Id: 0,
                                    classList: [],
                                    sectionList: [],
                                    emE_Id: 0,
                                    prefixNo: '',
                                    startingNo: '',
                                    increment: '',
                                    prefixNoFlag: 'N',
                                    leadingzeros: 0
                                } as any);
                                setSections([]);
                                setClasses([]);
                                setExams([]);
                            }}
                            className='min-w-[120px]'>
                            CANCEL
                        </Button>

                        <Button type='submit' size='lg' disabled={isSubmitting} className='w-fit'>
                            {isSubmitting ? 'Generating...' : 'SAVE AND GENERATE'}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}

'use client';

import { Button } from '@/components/ui/button';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';
import { FormError } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { categoryClassMappingSchema } from '@/schemas/exam/exam-module/masters';
import {
    addOrUpdateCategoryClassMapping,
    getCategories,
    getClassMappedSections
} from '@/server/exam/exam-module/masters/category-class-mapping';
import { getOpeningClassDropdownData } from '@/server/fees/trasactions/fee_opening_balance';
import type { ICategory, IClass } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, Save, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof categoryClassMappingSchema.addOrUpdate>;

interface AddCategoryClassFormProps {
    onSuccess?: () => void;
    initialData?: FormFields;
}

export default function AddCategoryClassForm({ onSuccess, initialData }: AddCategoryClassFormProps) {
    // Dropdown Data States
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [classes, setClasses] = useState<IClass[]>([]);
    const [sections, setSections] = useState<{ asmS_Id: number; asmC_SectionName: string }[]>([]);

    // Loading States
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    const tableRef = useRef<HTMLDivElement>(null);
    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();
    const academicYears = academicYear?.data ? academicYear.data : [];

    const [mappingList, setMappingList] = useState<
        {
            asmaY_Id: number;
            emcA_Id: number;
            asmcL_Id: number;
            section_list: {
                asmC_SectionName: any;
                asmS_Id: number;
            }[];
        }[]
    >([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    // const { refetchAll } = useMasterCategoryClassMapping(); // Not used directly here, but could be useful if we were using it for list

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(categoryClassMappingSchema.addOrUpdate),
        defaultValues: initialData || {
            emcA_Id: 0,
            ecaC_Id: 0,
            asmaY_Id: undefined, // Or 0 based on schema
            asmcL_Id: 0,
            section_list: []
        }
    });

    const watchedYear = useWatch({ control, name: 'asmaY_Id' });
    const watchedClass = useWatch({ control, name: 'asmcL_Id' });
    const watchedCategory = useWatch({ control, name: 'emcA_Id' });
    const watchedSections = useWatch({ control, name: 'section_list' }) as { asmS_Id: number; asmC_SectionName?: string }[];

    // ---------- Load Initial Dropdowns (Categories & Classes) ----------
    useEffect(() => {
        const fetchInitialDropdowns = async () => {
            try {
                setLoadingCategories(true);
                setLoadingClasses(true);

                const [catsRes, clsRes] = await Promise.all([getCategories(), getOpeningClassDropdownData()]);

                setCategories(Array.isArray(catsRes?.data) ? catsRes.data : Array.isArray(catsRes) ? catsRes : []);
                setClasses(Array.isArray(clsRes?.data) ? clsRes.data : Array.isArray(clsRes) ? clsRes : []);
            } catch (err: any) {
                toast.error(err.message || 'Failed to load initial dropdowns');
            } finally {
                setLoadingCategories(false);
                setLoadingClasses(false);
            }
        };

        fetchInitialDropdowns();
    }, []);

    // ---------- Load Sections (Dependent on Year & Class) ----------
    useEffect(() => {
        const fetchSections = async () => {
            if (!watchedYear || !watchedClass || Number(watchedYear) === 0 || Number(watchedClass) === 0) {
                setSections([]);
                return;
            }

            try {
                setLoadingSections(true);
                const res = await getClassMappedSections(Number(watchedYear), Number(watchedClass));
                const sectionData = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];

                setSections(sectionData);
                // We typically don't show toast for "no sections" automatically as it might just be empty for valid reasons
                if (sectionData.length === 0) {
                    // toast.info('No sections found for selected Year and Class');
                }
            } catch (err: any) {
                toast.error(err.message || 'Failed to load sections');
                setSections([]);
            } finally {
                setLoadingSections(false);
            }
        };

        fetchSections();
    }, [watchedYear, watchedClass]);

    // ---------- Auto-populate Sections if Mapping Exists in Local List ----------
    useEffect(() => {
        if (!watchedYear || !watchedCategory || !watchedClass) {
            return;
        }

        // Only auto-populate if we are NOT editing (or check if this logic is desired during edit too)
        // If we are editing, the edit handler sets values.
        // If user changes dropdowns manually, we might want to check if that combo exists in the list to avoid duplicates or pre-fill.
        // Assuming this logic is to help user see if they've already added this combo.

        const found = mappingList.find(
            (m) =>
                Number(m.asmaY_Id) === Number(watchedYear) &&
                Number(m.emcA_Id) === Number(watchedCategory) &&
                Number(m.asmcL_Id) === Number(watchedClass)
        );

        if (found) {
            // Wait for sections to load before setting value?
            // Actually, simple way: check if sections in 'found' are compatible?
            // Since we just triggered section load, 'sections' state might not be ready yet.
            // But we can set the IDs. CustomMultiSelectBox handles values even if options aren't there yet?
            // Usually safest to rely on values.

            // Note: If we just changed year/class, 'sections' state is being fetched.
            // We might set value, but if sections aren't loaded, it might look empty.
            // But Form value is source of truth.

            const sectionIds = found.section_list.map((s) => ({ asmS_Id: s.asmS_Id }));
            // We need to be careful not to overwrite user input if they are just browsing
            // But the original requirement implies pre-selecting.
            // Let's check if the generic 'setValue' works.
            // We use a timeout to ensure it runs after any immediate resets from onChange
            setTimeout(() => {
                setValue('section_list', sectionIds);
            }, 0);
        } else {
            // New combination: Clear sections if not found (already handled by onChange resets, but good as backup)
            // But we shouldn't force clear if user is actively selecting.
            // The onChange handlers below handle the primary clearing.
        }
    }, [watchedYear, watchedCategory, watchedClass, mappingList, setValue]);

    // ---------- Handlers ----------
    const handleAddOrUpdate = () => {
        const year = Number(watchedYear || 0);
        const cat = Number(watchedCategory || 0);
        const cls = Number(watchedClass || 0);
        // const secs = (useWatch({ control, name: 'section_list' }) || []) as { asmS_Id: number; asmC_SectionName: string }[];
        const secs = watchedSections || [];

        if (!year || !cat || !cls || secs.length === 0) {
            toast.error('All fields (Year, Category, Class, Sections) are required');
            return;
        }

        const newEntry = {
            asmaY_Id: year,
            emcA_Id: cat,
            asmcL_Id: cls,
            section_list: secs.map((s) => {
                // Find name from current sections options if needed, but 's' might already have it if from multiselect?
                // The form value usually just has IDs if using some components, but `CustomMultiSelectBox`
                // usually returns what we give it or we mapping it.
                // In onChange below, we map to objects.
                const sectionName = sections.find((sec) => sec.asmS_Id === s.asmS_Id)?.asmC_SectionName || s.asmC_SectionName || 'Unknown';
                return {
                    asmS_Id: Number(s.asmS_Id),
                    asmC_SectionName: sectionName
                };
            })
        };

        if (editIndex !== null) {
            // Update existing
            setMappingList((prev) => {
                const updated = [...prev];
                updated[editIndex] = newEntry;
                return updated;
            });
            toast.info('Mapping updated');
            setEditIndex(null);
        } else {
            // Add new
            const existingIndex = mappingList.findIndex(
                (m) => Number(m.asmaY_Id) === year && Number(m.emcA_Id) === cat && Number(m.asmcL_Id) === cls
            );

            if (existingIndex !== -1) {
                // Update existing if match found
                setMappingList((prev) => {
                    const updated = [...prev];
                    updated[existingIndex] = newEntry;
                    return updated;
                });
                toast.info('Existing mapping updated');
            } else {
                setMappingList((prev) => [...prev, newEntry]);
                toast.success('Mapping added');
            }
        }

        // Reset fields partially to allow rapid entry
        // Keep Year and Category? Original code: reset class and sections.
        setValue('asmcL_Id', 0);
        setValue('section_list', []);
        setTimeout(scrollToBottom, 50);
    };

    const handleEdit = (index: number) => {
        const row = mappingList[index];
        if (!row) return;

        setEditIndex(index);
        setValue('asmaY_Id', row.asmaY_Id);
        setValue('emcA_Id', row.emcA_Id);
        setValue('asmcL_Id', row.asmcL_Id);
        // Sections will be set by the useEffect or manually
        // But to be sure:
        setValue(
            'section_list',
            row.section_list.map((s) => ({ asmS_Id: s.asmS_Id, asmC_SectionName: s.asmC_SectionName }))
        );
    };

    const handleDelete = (index: number) => {
        setMappingList((prev) => prev.filter((_, i) => i !== index));
        if (editIndex === index) setEditIndex(null);
        toast.info('Mapping removed');
    };

    const handleClear = () => {
        setValue('asmaY_Id', 0);
        setValue('emcA_Id', 0);
        setValue('asmcL_Id', 0);
        setValue('section_list', []);
        setEditIndex(null);
        setSections([]);
        setResetKey((prev) => prev + 1);
    };

    const handleResetAll = () => {
        handleClear();
        setMappingList([]);
    };

    const onSubmit: SubmitHandler<FormFields> = async () => {
        if (mappingList.length === 0) {
            toast.error('Please add at least one mapping before saving');
            return;
        }

        try {
            const payload = {
                ECAC_Id: 0,
                YearClassCategory: mappingList.map((m) => ({
                    ASMAY_Id: Number(m.asmaY_Id),
                    ASMCL_Id: Number(m.asmcL_Id),
                    EMCA_Id: Number(m.emcA_Id),
                    sections: m.section_list.map((s) => ({
                        ASMS_Id: Number(s.asmS_Id)
                    }))
                }))
            };

            const res = await addOrUpdateCategoryClassMapping(payload);

            if (res?.success) {
                toast.success(res.message || 'Saved successfully');
                onSuccess?.();
            } else {
                toast.error(res?.message || 'Failed to save mappings');
            }
        } catch (err: any) {
            toast.error(err?.message || 'Failed to save mapping');
        }
    };

    const scrollToBottom = () => {
        if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* LEFT SIDE */}
            <div className='space-y-4'>
                {/* Academic Year */}
                <div className='flex flex-col gap-1'>
                    <span className='font-normal text-sm'>
                        Academic Year <span className='text-red-600'>*</span>
                    </span>
                    <Controller
                        control={control}
                        name='asmaY_Id'
                        render={({ field }) => (
                            <>
                                <Select
                                    key={`year-${resetKey}`}
                                    value={field.value ? String(field.value) : ''}
                                    onValueChange={(val) => {
                                        field.onChange(Number(val));
                                        // Reset dependent fields
                                        setValue('section_list', []);
                                        // Also reset Class? In this specific module (category-class-mapping),
                                        // classes seem independent of year (fetched via getClasses which returns all).
                                        // But if logical dependency exists (only map classes active in that year?),
                                        // we might want to reset. Original code kept class. Use discretion.
                                        // Cumulative report pattern usually resets child dropdowns.
                                        // But here 'getClasses' is independent.
                                        // However, 'sections' ARE dependent.
                                    }}
                                    disabled={mappingList.length > 0 && field.value !== 0}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Academic Year' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYearLoading ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : academicYears.length === 0 ? (
                                            <SelectItem value='empty' disabled>
                                                No Academic Years
                                            </SelectItem>
                                        ) : (
                                            academicYears.map((y) => (
                                                <SelectItem key={y.asmaY_Id} value={String(y.asmaY_Id)}>
                                                    {y.asmaY_Year}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                            </>
                        )}
                    />
                </div>

                {/* Category */}
                <div className='flex flex-col gap-1'>
                    <span className='font-normal text-sm'>
                        Category <span className='text-red-600'>*</span>
                    </span>
                    <Controller
                        control={control}
                        name='emcA_Id'
                        render={({ field }) => (
                            <>
                                <Select
                                    key={`category-${resetKey}`}
                                    value={field.value && field.value !== 0 ? String(field.value) : ''}
                                    onValueChange={(val) => {
                                        field.onChange(Number(val));
                                        // Category change might not strictly require clearing others, but typically
                                        // in a mapping form you might want to keep the year/class selection.
                                    }}
                                    disabled={mappingList.length > 0 && field.value !== 0}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Category' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadingCategories ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : categories.length === 0 ? (
                                            <SelectItem value='empty' disabled>
                                                No Categories
                                            </SelectItem>
                                        ) : (
                                            categories.map((c) => (
                                                <SelectItem key={c.emcA_Id} value={String(c.emcA_Id)}>
                                                    {c.emcA_CategoryName}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.emcA_Id && <FormError>{errors.emcA_Id.message}</FormError>}
                            </>
                        )}
                    />
                </div>

                {/* Class */}
                <div className='flex flex-col gap-1'>
                    <span className='font-normal text-sm'>
                        Class <span className='text-red-600'>*</span>
                    </span>
                    <Controller
                        control={control}
                        name='asmcL_Id'
                        render={({ field }) => (
                            <>
                                <Select
                                    key={`class-${resetKey}`}
                                    value={field.value && field.value !== 0 ? String(field.value) : ''}
                                    onValueChange={(val) => {
                                        field.onChange(Number(val));
                                        // Class Changed -> Reset Sections
                                        setValue('section_list', []);
                                    }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Class' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadingClasses ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : classes.length === 0 ? (
                                            <SelectItem value='empty' disabled>
                                                No Classes
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
                                {errors.asmcL_Id && <FormError>{errors.asmcL_Id.message}</FormError>}
                            </>
                        )}
                    />
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className='space-y-2'>
                <span className='font-medium text-sm'>
                    Sections <span className='text-red-600'>*</span>
                </span>

                <Controller
                    control={control}
                    name='section_list'
                    render={({ field }) => (
                        <>
                            {loadingSections ? (
                                <div className='flex h-10 items-center gap-2 text-muted-foreground text-sm'>
                                    <Loader2 className='h-4 w-4 animate-spin' /> Loading Sections...
                                </div>
                            ) : sections.length > 0 ? (
                                <CustomMultiSelectBox
                                    options={sections.map((section) => ({
                                        label: section.asmC_SectionName,
                                        value: section.asmS_Id.toString()
                                    }))}
                                    value={field.value?.map((s) => String(s.asmS_Id)) ?? []}
                                    onChange={(vals) => {
                                        const selected = sections
                                            .filter((s) => vals.includes(s.asmS_Id.toString()))
                                            .map((s) => ({
                                                asmS_Id: s.asmS_Id,
                                                asmC_SectionName: s.asmC_SectionName
                                            }));
                                        field.onChange(selected);
                                    }}
                                    isSearchRequired
                                    placeholder='Select Sections'
                                    error={errors.section_list?.message}
                                />
                            ) : (
                                <div className='p-2 text-muted-foreground text-sm'>
                                    {!watchedYear || !watchedClass
                                        ? 'Select Academic Year and Class to load sections'
                                        : 'No sections available'}
                                </div>
                            )}
                            {errors.section_list && <FormError>{errors.section_list.message}</FormError>}
                        </>
                    )}
                />
            </div>

            {/* ACTION BUTTONS */}
            <div className='flex w-fit items-center justify-center gap-3 md:col-span-2'>
                <Button type='button' variant='outline' onClick={handleClear}>
                    <X className='mr-2 h-4 w-4 text-destructive' />
                    CLEAR
                </Button>
                <Button type='button' onClick={handleAddOrUpdate}>
                    {editIndex !== null ? 'Update Mapping' : '+ Add Mapping'}
                </Button>
            </div>

            {/* MAPPING LIST TABLE */}
            {mappingList.length > 0 && (
                <div className='flex flex-col gap-4 md:col-span-2'>
                    <div className='rounded border p-4' ref={tableRef}>
                        <h3 className='mb-2 font-semibold text-lg'>Detailed Mappings</h3>
                        <div className='overflow-x-auto'>
                            <table className='min-w-full border-collapse border text-sm'>
                                <thead className='bg-muted/50'>
                                    <tr>
                                        <th className='border p-2'>SLNO</th>
                                        <th className='border p-2'>Academic Year</th>
                                        <th className='border p-2'>Category</th>
                                        <th className='border p-2'>Class</th>
                                        <th className='border p-2'>Sections</th>
                                        <th className='border p-2'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mappingList.map((m, i) => (
                                        <tr key={i} className='even:bg-muted/20'>
                                            <td className='border p-2 text-center'>{i + 1}</td>
                                            <td className='border p-2 text-center'>
                                                {academicYears.find((y) => String(y.asmaY_Id) === String(m.asmaY_Id))?.asmaY_Year ||
                                                    m.asmaY_Id}
                                            </td>
                                            <td className='border p-2 text-center'>
                                                {categories.find((c) => Number(c.emcA_Id) === Number(m.emcA_Id))?.emcA_CategoryName ||
                                                    m.emcA_Id}
                                            </td>
                                            <td className='border p-2 text-center'>
                                                {classes.find((c) => Number(c.asmcL_Id) === Number(m.asmcL_Id))?.asmcL_ClassName ||
                                                    m.asmcL_Id}
                                            </td>
                                            <td className='border p-2'>{m.section_list.map((s) => s.asmC_SectionName).join(', ')}</td>
                                            <td className='border p-2 text-center'>
                                                <div className='flex justify-center gap-2'>
                                                    <Button
                                                        type='button'
                                                        variant='ghost'
                                                        size='icon'
                                                        onClick={() => handleEdit(i)}
                                                        className='h-8 w-8 hover:text-blue-600'>
                                                        <Edit className='h-4 w-4' />
                                                    </Button>
                                                    <Button
                                                        type='button'
                                                        variant='ghost'
                                                        size='icon'
                                                        onClick={() => {
                                                            setDeleteIndex(i);
                                                            setConfirmOpen(true);
                                                        }}
                                                        className='h-8 w-8 hover:text-red-600'>
                                                        <Trash2 className='h-4 w-4' />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                        <Button type='button' variant='outline' onClick={handleResetAll} disabled={isSubmitting}>
                            Reset All
                        </Button>

                        <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting} loadingText='Saving...'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Category Class Mapping
                        </Button>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION */}
            {confirmOpen && deleteIndex !== null && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
                    <div className='w-[360px] rounded-md bg-white p-6 shadow-xl'>
                        <h2 className='mb-3 font-semibold text-lg'>Confirm Delete</h2>
                        <p className='mb-6 text-gray-700'>Are you sure you want to delete this mapping?</p>
                        <div className='flex justify-end gap-3'>
                            <Button variant='outline' onClick={() => setConfirmOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant='destructive'
                                onClick={() => {
                                    if (deleteIndex !== null) handleDelete(deleteIndex);
                                    setConfirmOpen(false);
                                    setDeleteIndex(null);
                                }}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}

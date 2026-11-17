'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';

import { Input } from '@/components/ui/input';
import type { DataTableRef } from '@/components/ui/view-data-table/view-data-table';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { useMasterSubjectGroup } from '@/hooks/exam/exammodule/usemasters';
import { masterSubjectGroupSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateMasterSubjectGroup, getAllMasterSubjectDetails } from '@/server/exam/exam-module/masters/subject-group';
import type { IMasterSubjectGroup, IMasterSubjectGroupDetails } from '@/types/exam/exam-module/masters';
import { Search } from 'lucide-react';
import { MasterSubjectGroupDetailsColumns } from './subject-group-details-columns';

type FormFields = z.infer<typeof masterSubjectGroupSchema.addOrUpdate>;

interface MasterSubjectGroupFormProps {
    onSuccess?: () => void;
    className?: string;
    initialData?: IMasterSubjectGroup & { subjects?: IMasterSubjectGroupDetails[] };
}

export default function MasterSubjectGroupForm({ onSuccess, className = '', initialData }: MasterSubjectGroupFormProps) {
    const [allSubjects, setAllSubjects] = useState<IMasterSubjectGroupDetails[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<IMasterSubjectGroupDetails[]>([]);
    const [isSubjectsEnabled, setIsSubjectsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { refetchAll } = useMasterSubjectGroup();
    // Ref for the GenericDataTable to control selection reset
    const tableRef = React.useRef<DataTableRef>(null);

    // Filter subjects based on search term
    const filteredSubjects = useMemo(() => {
        if (!searchTerm.trim()) return allSubjects;

        const term = searchTerm.toLowerCase().trim();
        return allSubjects.filter(
            (subject) =>
                subject.ismS_SubjectName?.toLowerCase().includes(term) ||
                subject.ismS_SubjectCode?.toLowerCase().includes(term) ||
                subject.ismS_SubjectName?.toLowerCase().includes(term) ||
                subject.ismS_SubjectGroup?.toLowerCase().includes(term)
        );
    }, [allSubjects, searchTerm]);

    // -------------------------
    // GET SUBJECT LIST
    // -------------------------
    useEffect(() => {
        async function loadSubjects() {
            try {
                setIsLoading(true);
                const res = await getAllMasterSubjectDetails();
                const data = Array.isArray(res?.data) ? res.data : [];
                // Sort by OrderFlag to match Master Subject order
                const sortedData = data.sort((a, b) => (a.ismS_OrderFlag || 0) - (b.ismS_OrderFlag || 0));
                setAllSubjects(sortedData);

                if (initialData?.subjects?.length) {
                    const selected = data.filter((s) => initialData.subjects?.some((i) => i.ismS_Id === s.ismS_Id));
                    setSelectedSubjects(selected);
                }
            } catch (err: any) {
                toast.error(err.message || 'Failed to fetch subjects');
            } finally {
                setIsLoading(false);
            }
        }

        loadSubjects();
    }, [initialData]);

    // -------------------------
    // FORM SETUP + LIVE VALIDATION
    // -------------------------
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        trigger, // used to re-validate dependent fields immediately
        formState
    } = useForm<FormFields>({
        resolver: zodResolver(masterSubjectGroupSchema.addOrUpdate),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: initialData
            ? {
                  emG_GroupName: initialData.emG_GroupName,
                  emG_TotSubjects: initialData.emG_TotSubjects,
                  emG_MaxAplSubjects: initialData.emG_MaxAplSubjects,
                  emG_MinAplSubjects: initialData.emG_MinAplSubjects,
                  emG_BestOff: initialData.emG_BestOff,
                  subject_list: initialData.subjects?.map((s) => ({ ismS_Id: s.ismS_Id })) ?? []
              }
            : {
                  emG_GroupName: '',
                  emG_TotSubjects: 1,
                  emG_MaxAplSubjects: 1,
                  emG_MinAplSubjects: 1,
                  emG_BestOff: 1,
                  subject_list: []
              }
    });

    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const { errors, isSubmitting, touchedFields, isSubmitted } = formState;

    // -------------------------
    // Watch Dependent Fields
    // -------------------------
    const total = watch('emG_TotSubjects');
    const max = watch('emG_MaxAplSubjects');
    const min = watch('emG_MinAplSubjects');
    const best = watch('emG_BestOff');

    // Whenever dependent fields change -> revalidate to update errors immediately
    useEffect(() => {
        // trigger only the dependent fields to reduce overhead
        trigger(['emG_TotSubjects', 'emG_MaxAplSubjects', 'emG_MinAplSubjects', 'emG_BestOff']);
    }, [total, max, min, best, trigger]);

    // Enable subject selection only when values are logically valid
    useEffect(() => {
        setIsSubjectsEnabled(min > 0 && max > 0 && min <= max && max <= total);
    }, [total, max, min]);

    const tableProps = useDataTableProps({
        data: filteredSubjects,
        total: filteredSubjects.length,
        pageIndex: 0,
        pageSize: 10
    });

    // -------------------------
    // TABLE SELECTION
    // -------------------------
    const handleSelectedSubjectsChange = (rows: IMasterSubjectGroupDetails[]) => {
        setSelectedSubjects(rows);
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchTerm('');
    };

    // -------------------------
    // SUBMIT
    // -------------------------
    const onSubmit: SubmitHandler<FormFields> = async (d) => {
        if (!isSubjectsEnabled) {
            toast.error('Enter valid Min/Max subjects first');
            return;
        }

        if (selectedSubjects.length < d.emG_TotSubjects) {
            toast.error(`Select exactly ${d.emG_TotSubjects} subjects`);
            return;
        }

        const payload = {
            emG_Id: initialData?.emG_Id ?? 0,
            emG_GroupName: d.emG_GroupName,
            emG_TotSubjects: d.emG_TotSubjects,
            emG_MaxAplSubjects: d.emG_MaxAplSubjects,
            emG_MinAplSubjects: d.emG_MinAplSubjects,
            emG_BestOff: d.emG_BestOff,
            subject_list: selectedSubjects.map((s) => ({ ismS_Id: s.ismS_Id }))
        };

        try {
            const res = await addOrUpdateMasterSubjectGroup(payload);
            if (res.success) {
                toast.success(res.message || 'Saved successfully.');
                reset();
                setSearchTerm('');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(res.message || 'Failed to save');
            }
        } catch (e: any) {
            toast.error(e.message || 'Something went wrong');
        }
    };

    // -------------------------
    // UI
    // -------------------------
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {/* GROUP NAME */}
                <div>
                    <InputText label='Group Name' required placeholder='Enter Group Name' {...register('emG_GroupName')} />
                    {errors.emG_GroupName && <FormError>{errors.emG_GroupName.message}</FormError>}
                </div>

                {/* TOTAL SUBJECTS */}
                <div>
                    <Controller
                        name='emG_TotSubjects'
                        control={control}
                        render={({ field }) => (
                            <InputNumber
                                label='Max Subjects'
                                required
                                minValue={1}
                                value={field.value}
                                onChange={(v) => {
                                    field.onChange(v);
                                    trigger('emG_TotSubjects');
                                }}
                            />
                        )}
                    />
                    {errors.emG_TotSubjects && <FormError>{errors.emG_TotSubjects.message}</FormError>}
                </div>

                {/* MAX */}
                <div>
                    <Controller
                        name='emG_MaxAplSubjects'
                        control={control}
                        render={({ field }) => (
                            <InputNumber
                                label='Max Applicable Subjects'
                                required
                                minValue={1}
                                value={field.value}
                                onChange={(v) => {
                                    field.onChange(v);
                                    trigger('emG_MaxAplSubjects');
                                }}
                            />
                        )}
                    />
                    {errors.emG_MaxAplSubjects && <FormError>{errors.emG_MaxAplSubjects.message}</FormError>}
                </div>

                {/* MIN */}
                <div>
                    <Controller
                        name='emG_MinAplSubjects'
                        control={control}
                        render={({ field }) => (
                            <InputNumber
                                label='Min Applicable Subjects'
                                required
                                minValue={1}
                                value={field.value}
                                onChange={(v) => {
                                    field.onChange(v);
                                    trigger('emG_MinAplSubjects');
                                }}
                            />
                        )}
                    />
                    {errors.emG_MinAplSubjects && <FormError>{errors.emG_MinAplSubjects.message}</FormError>}
                </div>

                {/* BEST OFF */}
                <div>
                    <Controller
                        name='emG_BestOff'
                        control={control}
                        render={({ field }) => (
                            <InputNumber
                                label='Best Off Subjects'
                                required
                                minValue={0}
                                value={field.value}
                                onChange={(v) => {
                                    field.onChange(v);
                                    trigger('emG_BestOff');
                                }}
                            />
                        )}
                    />
                    {errors.emG_BestOff && <FormError>{errors.emG_BestOff.message}</FormError>}
                </div>
            </div>

            <CollapsibleSection title='Select Subjects' defaultOpen>
                {/* Search Box Section */}
                <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='text-gray-600 text-sm'>
                        Showing {filteredSubjects.length} of {allSubjects.length} subjects
                        {searchTerm && <span className='ml-2'>(Search: "{searchTerm}")</span>}
                    </div>

                    <div className='relative w-full sm:w-64'>
                        <div className='relative'>
                            <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400' />
                            <Input
                                type='text'
                                placeholder='Search subjects...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='pr-9 pl-9'
                            />
                            {searchTerm && (
                                <button
                                    type='button'
                                    onClick={handleClearSearch}
                                    className='-translate-y-1/2 absolute top-1/2 right-3 text-gray-400 hover:text-gray-600'
                                    aria-label='Clear search'>
                                    ✕
                                </button>
                            )}
                        </div>
                        {searchTerm && filteredSubjects.length === 0 && (
                            <p className='mt-1 text-red-500 text-xs'>No subjects found matching "{searchTerm}"</p>
                        )}
                    </div>
                </div>

                {/* Subjects Table */}
                <GenericDataTable
                    ref={tableRef}
                    {...tableProps}
                    columns={MasterSubjectGroupDetailsColumns}
                    isLoading={isLoading}
                    maxSelectableRows={total}
                    onRowSelectionChange={handleSelectedSubjectsChange}
                    noDataTitle={searchTerm ? 'No Subjects Found' : 'No Subjects Available'}
                    noDataDescription={searchTerm ? 'Try a different search term' : 'Please add subjects first'}
                />

                {/* Selection Summary */}
                {selectedSubjects.length > 0 && (
                    <div className='mt-4 rounded border bg-gray-50 p-3'>
                        <div className='flex flex-wrap items-center justify-between gap-2'>
                            <div className='font-medium text-sm'>
                                Selected: <span className='text-blue-600'>{selectedSubjects.length}</span> of {total} required subjects
                            </div>
                            <div className='text-gray-500 text-xs'>
                                {selectedSubjects.length >= total ? (
                                    <span className='text-green-600'>✓ Selection requirement met</span>
                                ) : (
                                    <span className='text-amber-600'>Select {total - selectedSubjects.length} more subject(s)</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </CollapsibleSection>

            <div className='flex justify-end gap-2'>
                <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                        reset();
                        setSearchTerm('');
                        setSelectedSubjects([]);
                        // Reset the table's internal selection state
                        tableRef.current?.resetSelection();
                    }}>
                    Cancel
                </Button>
                <Button type='submit' disabled={isSubmitting || !isSubjectsEnabled} isLoading={isSubmitting}>
                    Save
                </Button>
            </div>
        </form>
    );
}

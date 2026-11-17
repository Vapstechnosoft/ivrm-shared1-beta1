'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import {
    useMasterGetAllSubjectGroupDetails,
    useMasterSubjectGroup,
    useMasterSubjectGroupDetails
} from '@/hooks/exam/exammodule/usemasters';
import { masterSubjectGroupSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateMasterSubjectGroup } from '@/server/exam/exam-module/masters/subject-group';
import type { IMasterSubjectGroup, IMasterSubjectGroupDetails } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { SimpleSubjectTable } from './data-table';
import { DataStateHandler } from './generic-data-table';

type FormFields = z.infer<typeof masterSubjectGroupSchema.addOrUpdate>;

interface MasterSubjectGroupUpdateFormProps {
    initialData: IMasterSubjectGroup;
    onSuccess?: () => void;
    className?: string;
}

export default function MasterSubjectGroupUpdateForm({ initialData, onSuccess, className = '' }: MasterSubjectGroupUpdateFormProps) {
    const [selectedSubjects, setSelectedSubjects] = useState<IMasterSubjectGroupDetails[]>([]);
    const [allSubjects, setAllSubjects] = useState<IMasterSubjectGroupDetails[]>([]);
    const { refetchAll } = useMasterSubjectGroup();
    const [isLoading, setIsLoading] = useState(true);

    // Fetch group-specific subjects
    const { data: groupSubjectsResponse, isLoading: loadingGroupSubjects } = useMasterSubjectGroupDetails(initialData.emG_Id);

    // Fetch all available subjects
    const { data: allSubjectsResponse, isLoading: loadingAllSubjects } = useMasterGetAllSubjectGroupDetails();

    useEffect(() => {
        setIsLoading(true);
        setAllSubjects([]);
        setSelectedSubjects([]);
    }, [initialData]);

    // Normalize API data once
    useEffect(() => {
        if (loadingAllSubjects || loadingGroupSubjects) return;

        const normalizedAllSubjects = normalizeSubjects(allSubjectsResponse?.data);
        const normalizedGroupSubjects = normalizeSubjects(groupSubjectsResponse?.data);

        const timer = setTimeout(() => {
            setAllSubjects(normalizedAllSubjects);
            setSelectedSubjects(normalizedGroupSubjects);
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [allSubjectsResponse, groupSubjectsResponse, loadingAllSubjects, loadingGroupSubjects]);
    // Initialize form
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterSubjectGroupSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            emG_Id: initialData?.emG_Id || 0,
            emG_GroupName: initialData?.emG_GroupName || '',
            emG_TotSubjects: initialData?.emG_TotSubjects || 0,
            emG_MaxAplSubjects: initialData?.emG_MaxAplSubjects || 1,
            emG_MinAplSubjects: initialData?.emG_MinAplSubjects || 1,
            emG_BestOff: initialData?.emG_BestOff || 0,
            subject_list: []
        }
    });

    const maxSubjects = watch('emG_MaxAplSubjects');
    const minSubjects = watch('emG_MinAplSubjects');
    const isSubjectsEnabled = minSubjects > 0 && maxSubjects >= minSubjects;

    // Columns

    // Submit form
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (!isSubjectsEnabled) {
            toast.error('Enter valid Min/Max subjects before selecting subjects');
            return;
        }

        if (selectedSubjects.length === 0) {
            toast.error('Please select at least one subject');
            return;
        }

        const payload = {
            emG_Id: initialData?.emG_Id ?? 0,
            emG_GroupName: data.emG_GroupName,
            emG_TotSubjects: data.emG_TotSubjects,
            emG_MaxAplSubjects: data.emG_MaxAplSubjects,
            emG_MinAplSubjects: data.emG_MinAplSubjects,
            emG_BestOff: data.emG_BestOff,
            subject_list: selectedSubjects.map((s) => ({ ismS_Id: s.ismS_Id }))
        };

        try {
            const res = await addOrUpdateMasterSubjectGroup(payload);
            if (res.success) {
                toast.success(res.message || 'Saved successfully.');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(res.message || 'Failed to save.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong.');
        }
    };

    return (
        isLoading ? (
            <div className='flex h-64 items-center justify-center'>
                <div className='text-center'>
                    <RefreshCw className='mx-auto h-8 w-8 animate-spin text-primary' />
                    <p className='mt-2 text-gray-600 text-sm'>Loading data...</p>
                </div>
            </div>
        ) : (
            <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
                {/* Group Info */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <InputText label='Group Name' required {...register('emG_GroupName')} error={errors.emG_GroupName?.message} />
                    <InputText
                        label='Total Subjects'
                        type='number'
                        required
                        {...register('emG_TotSubjects', { valueAsNumber: true })}
                        error={errors.emG_TotSubjects?.message}
                    />
                    <InputText
                        label='Max Applicable Subjects'
                        type='number'
                        required
                        {...register('emG_MaxAplSubjects', { valueAsNumber: true })}
                        error={errors.emG_MaxAplSubjects?.message}
                    />
                    <InputText
                        label='Min Applicable Subjects'
                        type='number'
                        required
                        {...register('emG_MinAplSubjects', { valueAsNumber: true })}
                        error={errors.emG_MinAplSubjects?.message}
                    />
                    <InputText
                        label='Best Off Subjects'
                        type='number'
                        required
                        {...register('emG_BestOff', { valueAsNumber: true })}
                        error={errors.emG_BestOff?.message}
                    />
                </div>

                {/* Subjects Table */}
                <CollapsibleSection title='Select Subjects' defaultOpen>
                    <DataStateHandler
                        isLoading={false}
                        error={null}
                        success={!!allSubjects}
                        dataLength={allSubjects?.length ?? 0}
                        errorMessage='Failed to load subjects'
                        loadingMessage='Loading subjects...'
                        noDataTitle='No Subjects Found'
                        noDataDescription='Please add or fetch subjects to display here.'>
                        <SimpleSubjectTable
                            allSubjects={allSubjects}
                            preselectedSubjects={selectedSubjects}
                            maxSelectableRows={maxSubjects}
                            onSelectionChange={setSelectedSubjects}
                        />
                    </DataStateHandler>
                </CollapsibleSection>

                {/* Actions */}
                <div className='flex w-fit items-center justify-center gap-3'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={() => {
                            reset({
                                emG_Id: initialData?.emG_Id || 0,
                                emG_GroupName: initialData?.emG_GroupName || '',
                                emG_TotSubjects: initialData?.emG_TotSubjects || 0,
                                emG_MaxAplSubjects: initialData?.emG_MaxAplSubjects || 1,
                                emG_MinAplSubjects: initialData?.emG_MinAplSubjects || 1,
                                emG_BestOff: initialData?.emG_BestOff || 0,
                                subject_list: []
                            });

                            // Reset selected subjects to the original ones loaded
                            const normalizedGroupSubjects = normalizeSubjects(groupSubjectsResponse?.data);
                            setSelectedSubjects(normalizedGroupSubjects);
                        }}>
                        Reset
                    </Button>

                    <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting} loadingText='Updating...'>
                        Update
                    </Button>
                </div>
            </form>
        )
    );
}

function normalizeSubjects(data: any): IMasterSubjectGroupDetails[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if ('$values' in data && Array.isArray(data.$values)) return data.$values;
    return [];
}

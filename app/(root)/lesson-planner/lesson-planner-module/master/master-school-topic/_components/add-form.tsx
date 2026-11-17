'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getClassesByYear, getSubjectsByClass, saveSchoolTopic } from '@/server/lesson-planner/master/school-topic';
import type {
    IMasterClass,
    IMasterSchoolTopic,
    IMasterSubject,
    IMasterUnit,
    IMasterYear
} from '@/types/lesson-planner/master/school-topic';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type MasterSchoolTopicSchema, masterSchoolTopicSchema } from './schema';

interface AddMasterSchoolTopicFormProps {
    masterYear: IMasterYear[];
    masterUnit: IMasterUnit[];
    initialData?: IMasterSchoolTopic;
    initialClasses?: IMasterClass[];
    initialSubjects?: IMasterSubject[];
    onSuccess?: () => void;
    mI_Id: number;
    userId: number;
    className?: string;
}

export default function AddMasterSchoolTopicForm({
    masterYear,
    masterUnit,
    initialData,
    initialClasses = [],
    initialSubjects = [],
    onSuccess,
    className = ''
}: AddMasterSchoolTopicFormProps) {
    const [classes, setClasses] = useState<IMasterClass[]>(initialClasses);
    const [subjects, setSubjects] = useState<IMasterSubject[]>(initialSubjects);

    const findValue = (obj: any, keys: string[]) => {
        if (!obj) return 0;
        for (const key of keys) {
            if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
        }
        return 0;
    };

    const form = useForm<MasterSchoolTopicSchema>({
        resolver: zodResolver(masterSchoolTopicSchema),
        mode: 'onChange',
        defaultValues: {
            lpmmT_Id: findValue(initialData, ['lpmmT_Id', 'LPMMT_Id', 'lpmmT_ID', 'LPMMT_ID']),
            lpmmT_TopicName: findValue(initialData, ['lpmmT_TopicName', 'LPMMT_TopicName', 'lpmmT_Topicname', 'LPMMT_Topicname']) || '',
            lpmmT_TopicDescription:
                findValue(initialData, [
                    'lpmmT_TopicDescription',
                    'LPMMT_TopicDescription',
                    'lpmmT_Topicdescription',
                    'LPMMT_Topicdescription'
                ]) || '',
            lpmmT_TotalHrs: findValue(initialData, ['lpmmT_TotalHrs', 'LPMMT_TotalHrs', 'lpmmT_Totalhrs', 'LPMMT_Totalhrs']) || null,
            lpmmT_TotalPeriods:
                findValue(initialData, ['lpmmT_TotalPeriods', 'LPMMT_TotalPeriods', 'lpmmT_Totalperiods', 'LPMMT_Totalperiods']) || null,
            asmaY_Id: findValue(initialData, [
                'asmaY_Id',
                'ASMAY_Id',
                'asmaY_ID',
                'ASMAY_ID',
                'asmaY_id',
                'asmay_id',
                'yearId',
                'asmA_Id',
                'ASMA_Id'
            ]),
            asmcL_Id: findValue(initialData, [
                'asmcL_Id',
                'ASMCL_Id',
                'asmcL_ID',
                'ASMCL_ID',
                'asmcL_id',
                'asmcl_id',
                'classId',
                'asmC_Id',
                'ASMC_Id'
            ]),
            ismS_Id: findValue(initialData, [
                'ismS_Id',
                'ISMS_Id',
                'ismS_ID',
                'ISMS_ID',
                'ismS_id',
                'isms_id',
                'subjectId',
                'ismS_ID',
                'ISMS_ID'
            ]),
            lpmU_Id: findValue(initialData, ['lpmU_Id', 'LPMU_Id', 'lpmU_ID', 'LPMU_ID', 'lpmU_id', 'lpmu_id', 'unitId'])
        }
    });

    console.log('[AddMasterSchoolTopicForm] Render State:', {
        masterYearCount: masterYear?.length,
        classesCount: classes?.length,
        subjectsCount: subjects?.length,
        masterUnitCount: masterUnit?.length,
        hasInitialData: !!initialData,
        formValues: form.getValues()
    });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = form;

    const selectedYear = watch('asmaY_Id');
    const selectedClass = watch('asmcL_Id');

    // Initialize classes and subjects from props when in edit mode
    useEffect(() => {
        if (initialClasses.length > 0) {
            setClasses(initialClasses);
        }
    }, [initialClasses]);

    useEffect(() => {
        if (initialSubjects.length > 0) {
            setSubjects(initialSubjects);
        }
    }, [initialSubjects]);

    // Fetch classes when year changes (only in add mode)
    useEffect(() => {
        if (selectedYear && !initialData) {
            const fetchClasses = async () => {
                const res: any = await getClassesByYear(Number(selectedYear));
                setClasses((res?.data?.getclass || res?.data || []) as IMasterClass[]);
            };
            fetchClasses();
        } else if (!selectedYear) {
            setClasses([]);
        }
    }, [selectedYear, initialData]);

    // Fetch subjects when year or class changes
    useEffect(() => {
        // Always fetch subjects when year and class are available
        if (selectedYear && selectedClass) {
            const fetchSubjects = async () => {
                const res: any = await getSubjectsByClass(Number(selectedYear), Number(selectedClass));
                setSubjects((res?.data?.getsubject || res?.data || []) as IMasterSubject[]);
            };
            fetchSubjects();
        } else if (!selectedYear || !selectedClass) {
            setSubjects([]);
        }
    }, [selectedYear, selectedClass]);

    const onSubmit = async (data: MasterSchoolTopicSchema) => {
        try {
            const payload = {
                lpmmT_Id: data.lpmmT_Id || 0,
                lpmmT_TopicName: data.lpmmT_TopicName,
                lpmmT_TopicDescription: data.lpmmT_TopicDescription,
                lpmmT_TotalHrs: data.lpmmT_TotalHrs,
                lpmmT_TotalPeriods: data.lpmmT_TotalPeriods,
                ismS_Id: Number(data.ismS_Id),
                lpmU_Id: Number(data.lpmU_Id),
                asmaY_Id: Number(data.asmaY_Id),
                asmcL_Id: Number(data.asmcL_Id)
            };

            const res: any = await saveSchoolTopic(payload);
            const message = res?.message || res?.data?.message;
            const returnval = res?.returnval ?? res?.data?.returnval;
            const success = res?.success ?? res?.data?.success;

            if (message === 'Add' || message === 'Record Saved successfully') {
                toast.success('Record saved successfully');
                reset();
                onSuccess?.();
            } else if (message === 'Update') {
                toast.success('Record updated successfully');
                onSuccess?.();
            } else if (message === 'Duplicate') {
                toast.warning('Record already exists');
            } else if (success || returnval) {
                toast.success(initialData ? 'Record updated successfully' : 'Record saved successfully');
                if (!initialData) reset();
                onSuccess?.();
            } else {
                toast.error(message || 'Failed to save/update record');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to save');
        }
    };

    return (
        <div className={className}>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {/* Academic Year */}
                        <FormField
                            control={form.control}
                            name='asmaY_Id'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Academic Year <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Year' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {masterYear.map((year) => {
                                                const yearId = findValue(year, [
                                                    'asmaY_Id',
                                                    'ASMAY_Id',
                                                    'asmaY_ID',
                                                    'ASMAY_ID',
                                                    'asmaY_id',
                                                    'asmay_id',
                                                    'yearId'
                                                ]);
                                                const yearName = findValue(year, [
                                                    'asmaY_Year',
                                                    'ASMAY_Year',
                                                    'asmaY_year',
                                                    'ASMAY_YEAR',
                                                    'yearName',
                                                    'year'
                                                ]);
                                                return (
                                                    <SelectItem key={yearId} value={yearId.toString()}>
                                                        {yearName}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Class */}
                        <FormField
                            control={form.control}
                            name='asmcL_Id'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Class <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Class' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {classes.map((cls) => {
                                                const classId = findValue(cls, [
                                                    'asmcL_Id',
                                                    'ASMCL_Id',
                                                    'asmcL_ID',
                                                    'ASMCL_ID',
                                                    'asmcL_id',
                                                    'classId'
                                                ]);
                                                const className = findValue(cls, [
                                                    'asmcL_ClassName',
                                                    'ASMCL_ClassName',
                                                    'asmcL_Classname',
                                                    'className',
                                                    'class'
                                                ]);
                                                return (
                                                    <SelectItem key={classId} value={classId.toString()}>
                                                        {className}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Subject */}
                        <FormField
                            control={form.control}
                            name='ismS_Id'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Subject Name <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Subject' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {subjects.map((subj) => {
                                                const subjectId = findValue(subj, [
                                                    'ismS_Id',
                                                    'ISMS_Id',
                                                    'ismS_ID',
                                                    'ISMS_ID',
                                                    'ismS_id',
                                                    'msS_Id',
                                                    'isM_Id',
                                                    'subjectId'
                                                ]);
                                                const subjectName = findValue(subj, [
                                                    'ismS_SubjectName',
                                                    'ISMS_SubjectName',
                                                    'ismS_subjectName',
                                                    'subjectName',
                                                    'subject',
                                                    'smS_SubjectName'
                                                ]);
                                                return (
                                                    <SelectItem key={subjectId} value={subjectId.toString()}>
                                                        {subjectName}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Unit */}
                        <FormField
                            control={form.control}
                            name='lpmU_Id'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Unit Name <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Unit' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {masterUnit.map((unit) => {
                                                const unitId = findValue(unit, [
                                                    'lpmU_Id',
                                                    'LPMU_Id',
                                                    'lpmU_ID',
                                                    'LPMU_ID',
                                                    'lpmU_id',
                                                    'unitId'
                                                ]);
                                                const unitName = findValue(unit, [
                                                    'lpmU_UnitName',
                                                    'LPMU_UnitName',
                                                    'lpmU_Unitname',
                                                    'unitName',
                                                    'unit'
                                                ]);
                                                return (
                                                    <SelectItem key={unitId} value={unitId.toString()}>
                                                        {unitName}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Topic Name */}
                        <InputText label='Topic Name' required {...register('lpmmT_TopicName')} error={errors.lpmmT_TopicName?.message} />

                        {/* Topic Description */}
                        <InputText
                            label='Topic Description'
                            {...register('lpmmT_TopicDescription')}
                            error={errors.lpmmT_TopicDescription?.message}
                        />

                        {/* Total Hours */}
                        <InputText
                            label='Total No. Of Hours'
                            type='number'
                            {...register('lpmmT_TotalHrs')}
                            error={errors.lpmmT_TotalHrs?.message}
                        />

                        {/* Total Periods */}
                        <InputText
                            label='Total No. Of Periods'
                            type='number'
                            {...register('lpmmT_TotalPeriods')}
                            error={errors.lpmmT_TotalPeriods?.message}
                        />
                    </div>

                    <div className='flex justify-end gap-3'>
                        <Button type='button' variant='outline' onClick={() => reset()} disabled={isSubmitting}>
                            Clear
                        </Button>
                        <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting}>
                            <Save className='mr-2 h-4 w-4' /> Save
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

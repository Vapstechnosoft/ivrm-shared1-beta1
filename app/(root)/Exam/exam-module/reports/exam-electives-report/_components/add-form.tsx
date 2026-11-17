'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import {
    getCategoryDropDownByYearList,
    getClassDropDownByYearCategoryList,
    getSectionDropDownByYearCategoryClassList,
    getSubjectDropDownByYearCategorySubjectGroupList,
    getSubjectGroupDropDownByYearCategoryList
} from '@/server/exam/exam-module/reports/vvehpc_exam-report-card';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type ReportType = 'All' | 'Indi' | 'subj' | 'csw';

interface FormFields {
    Type: ReportType;
    asmaY_Id: number;
    emcA_Id: number | 'All';
    emG_Id: number;
    ismS_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    mob_flg: boolean;
    mail_flg: boolean;
    Left_Flag: boolean;
    Deactive_Flag: boolean;
}

interface Props {
    onSuccess?: (payload: any) => Promise<void> | void;
}

export default function ElectiveSubjectsReportForm({ onSuccess }: Props = {}) {
    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { isSubmitting }
    } = useForm<FormFields>({
        defaultValues: {
            Type: 'All',
            asmaY_Id: 0,
            emcA_Id: 0,
            emG_Id: 0,
            ismS_Id: 0,
            asmcL_Id: 0,
            asmS_Id: 0,
            mob_flg: false,
            mail_flg: false,
            Left_Flag: false,
            Deactive_Flag: false
        },
        mode: 'onChange'
    });

    // Watchers
    const type = useWatch({ control, name: 'Type' });
    const asmaY_Id = useWatch({ control, name: 'asmaY_Id' });
    const emcA_Id = useWatch({ control, name: 'emcA_Id' });
    const emG_Id = useWatch({ control, name: 'emG_Id' });
    const asmcL_Id = useWatch({ control, name: 'asmcL_Id' });

    // Dropdown state
    const [categories, setCategories] = useState<{ emcA_Id: number; emcA_CategoryName: string }[]>([]);
    const [groups, setGroups] = useState<{ emG_Id: number; emG_GroupName: string }[]>([]);
    const [subjects, setSubjects] = useState<{ ismS_Id: number; ismS_SubjectName: string }[]>([]);
    const [classes, setClasses] = useState<{ asmcL_Id: number; asmcL_ClassName: string }[]>([]);
    const [sections, setSections] = useState<{ asmS_Id: number; asmC_SectionName: string }[]>([]);

    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);

    // Reset dependent fields when Type changes
    useEffect(() => {
        setValue('emcA_Id', 0);
        setValue('emG_Id', 0);
        setValue('ismS_Id', 0);
        setValue('asmcL_Id', 0);
        setValue('asmS_Id', 0);
        setCategories([]);
        setGroups([]);
        setSubjects([]);
        setClasses([]);
        setSections([]);
    }, [type, setValue]);

    // Load Categories when Academic Year changes (except All)
    useEffect(() => {
        if (type === 'All' || !asmaY_Id) {
            setCategories([]);
            return;
        }
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const res = await getCategoryDropDownByYearList(asmaY_Id);
                setCategories(Array.isArray(res) ? res : []);
                if (Array.isArray(res) && res.length === 0) {
                    toast.info('No Categories are mapped');
                }
            } catch (err: any) {
                toast.error(err.message || 'Failed to load categories');
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [asmaY_Id, type]);

    // Load Groups & Classes when Category changes
    useEffect(() => {
        if ((type !== 'subj' && type !== 'csw') || !asmaY_Id || emcA_Id === undefined) {
            setGroups([]);
            setClasses([]);
            return;
        }
        const fetchData = async () => {
            try {
                setLoadingGroups(true);
                setLoadingClasses(true);
                const categoryId = emcA_Id === 'All' ? 'All' : emcA_Id;
                const [groupRes, classRes] = await Promise.all([
                    getSubjectGroupDropDownByYearCategoryList(asmaY_Id, categoryId),
                    type === 'csw' ? getClassDropDownByYearCategoryList(asmaY_Id, categoryId) : Promise.resolve([])
                ]);
                setGroups(Array.isArray(groupRes) ? groupRes : []);
                setClasses(Array.isArray(classRes) ? classRes : []);
            } catch {
                toast.error('Failed to load groups or classes');
            } finally {
                setLoadingGroups(false);
                setLoadingClasses(false);
            }
        };
        fetchData();
    }, [asmaY_Id, emcA_Id, type]);

    // Load Subjects when Group changes
    useEffect(() => {
        if (type !== 'subj' || !asmaY_Id || !emcA_Id || !emG_Id) {
            setSubjects([]);
            return;
        }
        const fetchSubjects = async () => {
            try {
                setLoadingSubjects(true);
                const categoryId = emcA_Id === 'All' ? 'All' : emcA_Id;
                const res = await getSubjectDropDownByYearCategorySubjectGroupList(asmaY_Id, categoryId, emG_Id);
                setSubjects(Array.isArray(res) ? res : []);
            } catch {
                toast.error('Failed to load subjects');
            } finally {
                setLoadingSubjects(false);
            }
        };
        fetchSubjects();
    }, [asmaY_Id, emcA_Id, emG_Id, type]);

    // Load Sections when Class changes
    useEffect(() => {
        if (type !== 'csw' || !asmaY_Id || !emcA_Id || !asmcL_Id) {
            setSections([]);
            return;
        }
        const fetchSections = async () => {
            try {
                setLoadingSections(true);
                const res = await getSectionDropDownByYearCategoryClassList(asmaY_Id, Number(emcA_Id), asmcL_Id);
                setSections(Array.isArray(res) ? res : []);
            } catch {
                toast.error('Failed to load sections');
            } finally {
                setLoadingSections(false);
            }
        };
        fetchSections();
    }, [asmaY_Id, emcA_Id, asmcL_Id, type]);

    const onSubmit = async (data: FormFields) => {
        try {
            const payload: any = {
                // mi_Id: 30,
                ASMAY_Id: data.asmaY_Id,
                Type: data.Type,
                mob_flg: data.mob_flg ? 1 : 0,
                mail_flg: data.mail_flg ? 1 : 0,
                Left_Flag: data.Left_Flag ? 1 : 0,
                Deactive_Flag: data.Deactive_Flag ? 1 : 0,
                EMCA_Id: 0,
                EMG_Id: 0,
                ISMS_Id: 0,
                ASMCL_Id: 0,
                ASMS_Id: 0
            };
            if (data.Type !== 'All') {
                if (data.emcA_Id === 'All') {
                    payload.EMCA_Id = 0; // backend treats 0 as All
                } else {
                    payload.EMCA_Id = data.emcA_Id;
                }
            }
            if (data.Type === 'subj') {
                payload.EMG_Id = data.emG_Id;
                payload.ISMS_Id = data.ismS_Id;
            }
            if (data.Type === 'csw') {
                payload.ASMCL_Id = data.asmcL_Id;
                payload.ASMS_Id = data.asmS_Id || 0;
            }
            console.info('Final Payload →', payload); // Debug

            // Wait for parent component to finish fetching data
            if (onSuccess) {
                await onSuccess(payload);
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to generate report');
        }
    };

    const handleClear = () => {
        reset({
            Type: type,
            asmaY_Id: 0,
            emcA_Id: 0,
            emG_Id: 0,
            ismS_Id: 0,
            asmcL_Id: 0,
            asmS_Id: 0,
            mob_flg: false,
            mail_flg: false,
            Left_Flag: false,
            Deactive_Flag: false
        });
        setCategories([]);
        setGroups([]);
        setSubjects([]);
        setClasses([]);
        setSections([]);
    };

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                    {/* biome-ignore lint/nursery/useSortedClasses: <explanation> */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8  mt-6'>
                        {/* Left Column */}
                        <div className='space-y-6'>
                            {/* Report Type */}
                            <div className='rounded-lg bg-muted/50 p-6'>
                                <Label>Report Type</Label>
                                <Controller
                                    name='Type'
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup value={field.value} onValueChange={field.onChange} className='mt-4'>
                                            <div className='grid grid-cols-2 gap-4'>
                                                {(['All', 'Indi', 'subj', 'csw'] as const).map((val) => (
                                                    <div key={val} className='flex items-center space-x-3'>
                                                        <RadioGroupItem value={val} id={`type-${val}`} />
                                                        <Label htmlFor={`type-${val}`} className='cursor-pointer font-normal'>
                                                            {val === 'All' && 'All'}
                                                            {val === 'Indi' && 'Category Wise'}
                                                            {val === 'subj' && 'Subject Wise'}
                                                            {val === 'csw' && 'Class-Section Wise'}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                            {/* Additional Options */}
                            <div className='rounded-lg bg-muted/50 p-6'>
                                <Label>Additional Options</Label>
                                <div className='mt-4 grid grid-cols-2 gap-4'>
                                    {[
                                        { key: 'mob_flg', label: 'Mobile No' },
                                        { key: 'mail_flg', label: 'Email-Id' },
                                        { key: 'Left_Flag', label: 'Include Left Students' },
                                        { key: 'Deactive_Flag', label: 'Include Deactive Students' }
                                    ].map((item) => (
                                        <Controller
                                            key={item.key}
                                            name={item.key as keyof FormFields}
                                            control={control}
                                            render={({ field }) => (
                                                <div className='flex items-center space-x-3'>
                                                    <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                                                    <Label className='cursor-pointer font-normal'>{item.label}</Label>
                                                </div>
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Right Column - Filters */}
                        <div className='space-y-6'>
                            {/* Academic Year */}
                            <Controller
                                control={control}
                                name='asmaY_Id'
                                render={({ field, fieldState }) => (
                                    <div>
                                        <Label>
                                            Academic Year <span className='text-red-500'>*</span>
                                        </Label>
                                        <Select
                                            key={field.value}
                                            value={field.value && field.value !== 0 ? String(field.value) : undefined}
                                            onValueChange={(val) => field.onChange(Number(val))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Academic Year' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {academicYearLoading ? (
                                                    <SelectItem value='0' disabled>
                                                        Academic Years are loading...
                                                    </SelectItem>
                                                ) : academicYear?.data?.length === 0 ? (
                                                    <SelectItem value='0' disabled>
                                                        No Academic Years found
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

                            {/* Category - ONLY CHANGE HERE */}
                            {(type === 'Indi' || type === 'subj' || type === 'csw') && (
                                <Controller
                                    name='emcA_Id'
                                    control={control}
                                    rules={{ required: 'Category is required' }}
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <Label>
                                                Category <span className='text-red-500'>*</span>
                                            </Label>
                                            <Select
                                                key={field.value}
                                                value={
                                                    field.value === 'All'
                                                        ? 'All'
                                                        : field.value && field.value !== 0
                                                            ? String(field.value)
                                                            : undefined
                                                }
                                                onValueChange={(v) => field.onChange(v === 'All' ? 'All' : Number(v))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select Category' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {loadingCategories ? (
                                                        <SelectItem value='0' disabled>
                                                            Categories are loading...
                                                        </SelectItem>
                                                    ) : (
                                                        <>
                                                            {type === 'subj' && <SelectItem value='All'>All Categories</SelectItem>}
                                                            {categories.length === 0 ? (
                                                                <SelectItem value='0' disabled>
                                                                    No Categories found
                                                                </SelectItem>
                                                            ) : (
                                                                categories.map((c) => (
                                                                    <SelectItem key={c.emcA_Id} value={String(c.emcA_Id)}>
                                                                        {c.emcA_CategoryName}
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    )}
                                />
                            )}
                            {/* Subject Group & Subject */}
                            {type === 'subj' && (
                                <>
                                    <Controller
                                        name='emG_Id'
                                        control={control}
                                        rules={{ required: 'Subject Group is required' }}
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Subject Group <span className='text-red-500'>*</span>
                                                </Label>
                                                <Select
                                                    key={field.value}
                                                    value={field.value && field.value !== 0 ? String(field.value) : ''}
                                                    onValueChange={(v) => field.onChange(Number(v))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Subject Group' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingGroups ? (
                                                            <SelectItem value='0' disabled>
                                                                Subject Groups are loading...
                                                            </SelectItem>
                                                        ) : groups.length === 0 ? (
                                                            <SelectItem value='0' disabled>
                                                                No Subject Groups found
                                                            </SelectItem>
                                                        ) : (
                                                            groups.map((g) => (
                                                                <SelectItem key={g.emG_Id} value={String(g.emG_Id)}>
                                                                    {g.emG_GroupName}
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
                                        name='ismS_Id'
                                        control={control}
                                        rules={{ required: 'Subject is required' }}
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Subject <span className='text-red-500'>*</span>
                                                </Label>
                                                <Select
                                                    key={field.value}
                                                    value={field.value ? String(field.value) : ''}
                                                    onValueChange={(v) => field.onChange(Number(v))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Subject' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingSubjects ? (
                                                            <SelectItem value='0' disabled>
                                                                Subjects are loading...
                                                            </SelectItem>
                                                        ) : subjects.length === 0 ? (
                                                            <SelectItem value='0' disabled>
                                                                No Subjects found
                                                            </SelectItem>
                                                        ) : (
                                                            subjects.map((s) => (
                                                                <SelectItem key={s.ismS_Id} value={String(s.ismS_Id)}>
                                                                    {s.ismS_SubjectName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />
                                </>
                            )}
                            {/* Class & Section */}
                            {type === 'csw' && (
                                <>
                                    <Controller
                                        name='asmcL_Id'
                                        control={control}
                                        rules={{ required: 'Class is required' }}
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Class <span className='text-red-500'>*</span>
                                                </Label>
                                                <Select
                                                    key={field.value}
                                                    value={field.value ? String(field.value) : ''}
                                                    onValueChange={(v) => field.onChange(Number(v))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Class' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingClasses ? (
                                                            <SelectItem value='0' disabled>
                                                                Classes are loading...
                                                            </SelectItem>
                                                        ) : classes.length === 0 ? (
                                                            <SelectItem value='0' disabled>
                                                                No Classes found
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
                                        )}
                                    />
                                    <Controller
                                        name='asmS_Id'
                                        control={control}
                                        rules={{ required: 'Section is required' }}
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>
                                                    Section <span className='text-red-500'>*</span>
                                                </Label>
                                                <Select
                                                    key={field.value}
                                                    value={field.value ? String(field.value) : ''}
                                                    onValueChange={(v) => field.onChange(Number(v))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Section' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingSections ? (
                                                            <SelectItem value='0' disabled>
                                                                Sections are loading...
                                                            </SelectItem>
                                                        ) : sections.length === 0 ? (
                                                            <SelectItem value='0' disabled>
                                                                No Sections found
                                                            </SelectItem>
                                                        ) : (
                                                            sections.map((s) => (
                                                                <SelectItem key={s.asmS_Id} value={String(s.asmS_Id)}>
                                                                    {s.asmC_SectionName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <hr className='my-8' />
                    <div className='flex justify-center gap-4'>
                        <Button type='submit' disabled={isSubmitting} className='flex'>
                            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' /> }
                            {isSubmitting ? 'Generating Report...' : 'Generate Report'}
                        </Button>
                        <Button type='button' variant='outline' onClick={handleClear}>
                            Clear
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

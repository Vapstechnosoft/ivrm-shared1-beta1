'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    type BifurcationConstraintsSchema,
    bifurcationConstraintsSchema,
    combinationTempSchema
} from '@/schemas/timetable/constraints/bifurcationconstraints';
import {
    getBifurcationConstraintsEditDetails,
    getClassDetails,
    getStaffSection,
    getSubjectStaff,
    saveBifurcationConstraintsDetail
} from '@/server/timetable/constraints/bifurcationconstraints';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface BifurcationConstraintsFormProps {
    initialData: any; // Contains lists: acdlist, categorylist, periodlist
    editData?: any; // For editing mode (passed as selectedRow)
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function BifurcationConstraintsForm({ initialData, editData, onSuccess, onCancel }: BifurcationConstraintsFormProps) {
    // Dropdown options
    const academicList = initialData?.acdlist || [];
    const categoryList = initialData?.categorylist || [];
    const periodList = initialData?.periodlist || [];

    // Local state for dropdowns
    const [classList, setClassList] = useState<any[]>([]);
    const [sectionList, setSectionList] = useState<any[]>([]);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [subjectList, setSubjectList] = useState<any[]>([]);

    // State for temp inputs
    const [tempCombination, setTempCombination] = useState({
        ASMCL_Id: 0,
        ASMS_Id: 0,
        HRME_Id: 0,
        ISMS_Id: 0
    });

    const form = useForm<BifurcationConstraintsSchema>({
        resolver: zodResolver(bifurcationConstraintsSchema),
        mode: 'onChange',
        defaultValues: {
            TTB_ID: 0,
            ASMAY_Id: 0,
            TTMC_Id: 0,
            TTB_BifurcationName: '',
            TTB_NoOfPeriods: 1,
            TTB_BefAftApplFlag: false,
            TTB_BefAftFalg: '',
            TTMP_Id: 0,
            TTB_ConsecutiveFlag: false,
            TTB_NoOfConPeriods: 0,
            TTB_NoOfConDays: 0,
            combinationlist: []
        }
    });

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'combinationlist'
    });

    // Watchers
    const watchedAcademicYear = watch('ASMAY_Id');
    const watchedCategory = watch('TTMC_Id');
    const watchedBefAftFlag = watch('TTB_BefAftApplFlag');
    const watchedConsecutiveFlag = watch('TTB_ConsecutiveFlag');

    // Fetch Edit Details
    useEffect(() => {
        const fetchEditDetails = async () => {
            if (Array.isArray(editData)) {
                try {
                    const apiResponse = await getBifurcationConstraintsEditDetails(editData[0].ttB_Id);

                    const detailsList = (apiResponse.detailslist as any[]) || [];
                    const editDetailsList = (apiResponse.editdetailslist as any[]) || [];

                    if (detailsList.length > 0) {
                        const mainRecord = detailsList[0];
                        reset({
                            TTB_ID: mainRecord.ttB_Id,
                            ASMAY_Id: mainRecord.asmaY_Id,
                            TTMC_Id: mainRecord.ttmC_Id,
                            TTB_BifurcationName: mainRecord.ttB_BifurcationName,
                            TTB_NoOfPeriods: mainRecord.ttB_NoOfPeriods,
                            TTB_BefAftApplFlag: mainRecord.ttB_BefAftApplFlag === 1,
                            TTB_BefAftFalg: mainRecord.ttB_BefAftFalg || '',
                            TTMP_Id: mainRecord.ttmP_Id || 0,
                            TTB_ConsecutiveFlag: mainRecord.ttB_ConsecutiveFlag === 1,
                            TTB_NoOfConPeriods: mainRecord.ttB_NoOfConPeriods || 0,
                            TTB_NoOfConDays: mainRecord.ttB_NoOfConDays || 0,
                            combinationlist: editDetailsList.map((d: any) => ({
                                ASMCL_Id: d.asmcL_Id || 0,
                                ASMS_Id: d.asmS_Id || 0,
                                HRME_Id: d.hrmE_Id || 0,
                                ISMS_Id: d.ismS_Id || 0,
                                className: d.className,
                                sectioname: d.sectioname,
                                staffname: d.staffname,
                                subjectname: d.subjectname
                            }))
                        });
                    }
                } catch (err) {
                    console.error('Failed to fetch edit details', err);
                    toast.error('Failed to load record details');
                }
            }
        };

        if (editData) {
            fetchEditDetails();
        }
    }, [editData, reset]);

    // Fetch Classes on Year/Category Change
    useEffect(() => {
        const fetchClassesHelper = async () => {
            if (watchedAcademicYear && watchedCategory) {
                try {
                    const res = await getClassDetails({
                        ASMAY_Id: watchedAcademicYear,
                        TTMC_Id: watchedCategory
                    });
                    if (Array.isArray(res) && res.classlist && Array.isArray(res.classlist)) {
                        setClassList(res.classlist);
                    } else {
                        setClassList([]);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchClassesHelper();
    }, [watchedAcademicYear, watchedCategory]);

    // Fetch Staff/Section on Class Selection (for Temp Row)
    const handleClassChange = async (classId: number) => {
        setTempCombination((prev) => ({ ...prev, ASMCL_Id: classId, ASMS_Id: 0, HRME_Id: 0, ISMS_Id: 0 }));
        setSectionList([]);
        setStaffList([]);
        setSubjectList([]);

        if (initialData?.sectionlist && Array.isArray(initialData.sectionlist)) {
            setSectionList(initialData.sectionlist);
        } else {
            setSectionList([]);
        }
    };

    const handleSectionChange = async (sectionId: number) => {
        setTempCombination((prev) => ({ ...prev, ASMS_Id: sectionId, HRME_Id: 0, ISMS_Id: 0 }));
        if (tempCombination.ASMCL_Id && sectionId && watchedAcademicYear && watchedCategory) {
            const payload = {
                ASMAY_Id: watchedAcademicYear,
                TTMC_Id: watchedCategory,
                ASMCL_Id: tempCombination.ASMCL_Id,
                ASMS_Id: sectionId
            };
            const res = await getStaffSection(payload);
            if (Array.isArray(res) && res.staffbyall && Array.isArray(res.staffbyall)) {
                setStaffList(res.staffbyall);
            } else {
                setStaffList([]);
                toast.info('No Staff Allocated');
            }
        }
    };

    const handleStaffChange = async (staffId: number) => {
        setTempCombination((prev) => ({ ...prev, HRME_Id: staffId, ISMS_Id: 0 }));
        if (tempCombination.ASMCL_Id && tempCombination.ASMS_Id && staffId && watchedAcademicYear && watchedCategory) {
            const payload = {
                ASMAY_Id: watchedAcademicYear,
                TTMC_Id: watchedCategory,
                ASMCL_Id: tempCombination.ASMCL_Id,
                ASMS_Id: tempCombination.ASMS_Id,
                HRME_Id: staffId
            };
            const res = await getSubjectStaff(payload);
            if (Array.isArray(res) && res.subjectbystaff && Array.isArray(res.subjectbystaff)) {
                setSubjectList(res.subjectbystaff);
            } else {
                setSubjectList([]);
                toast.info('No Subject Mapped');
            }
        }
    };

    const handleAddCombination = () => {
        const result = combinationTempSchema.safeParse(tempCombination);
        if (!result.success) {
            toast.error(result.error.errors[0].message);
            return;
        }

        // Duplicate Check
        const exists = fields.some(
            (f) =>
                f.ASMCL_Id === tempCombination.ASMCL_Id &&
                f.ASMS_Id === tempCombination.ASMS_Id &&
                f.HRME_Id === tempCombination.HRME_Id &&
                f.ISMS_Id === tempCombination.ISMS_Id
        );

        if (exists) {
            toast.warning('Combination already exists');
            return;
        }

        // Get Names for Display
        const className = classList.find((c) => c.asmcL_Id === tempCombination.ASMCL_Id)?.asmcL_ClassName;
        const sectionName = sectionList.find((c) => c.asmS_Id === tempCombination.ASMS_Id)?.asmC_SectionName;
        const staffName = staffList.find((c) => c.hrmE_Id === tempCombination.HRME_Id)?.staffName;
        const subjectName =
            subjectList.find((c) => c.ismS_Id === tempCombination.ISMS_Id)?.ismS_SubjectName ||
            subjectList.find((c) => c.ismS_Id === tempCombination.ISMS_Id)?.subjectName;

        append({
            ...tempCombination,
            className,
            sectioname: sectionName,
            staffname: staffName,
            subjectname: subjectName
        });

        // Reset Temp (Partial?)
        setTempCombination((prev) => ({ ...prev, HRME_Id: 0, ISMS_Id: 0 }));
    };

    const onSubmit: SubmitHandler<BifurcationConstraintsSchema> = async (data) => {
        try {
            const payload = {
                ...data,
                TTB_BefAftApplFlag: data.TTB_BefAftApplFlag ? 1 : 0,
                TTB_ConsecutiveFlag: data.TTB_ConsecutiveFlag ? 1 : 0
            };

            const res = await saveBifurcationConstraintsDetail(payload);
            if (res.returnMsg === 'Add' || res.returnMsg === 'update') {
                toast.success('Saved Successfully');
                onSuccess?.();
            } else if (res.returnduplicatestatus === 'Duplicate') {
                toast.warning('Record Already Exists');
            } else {
                toast.error('Failed to Save');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 rounded-md border bg-white p-6 shadow-sm'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Left Column */}
                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <Label>
                            Academic Year <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            control={control}
                            name='ASMAY_Id'
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='--Select--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicList.map((item: any) => (
                                            <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                {item.asmaY_Year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.ASMAY_Id && <FormError>{errors.ASMAY_Id.message}</FormError>}
                    </div>

                    <div className='space-y-2'>
                        <Label>
                            Bifurcation Name <span className='text-red-500'>*</span>
                        </Label>
                        <InputText {...register('TTB_BifurcationName')} error={errors.TTB_BifurcationName?.message} />
                    </div>

                    <div className='space-y-4 rounded-md border bg-gray-50 p-4'>
                        <div className='flex items-center space-x-2'>
                            <Controller
                                control={control}
                                name='TTB_BefAftApplFlag'
                                render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} id='ba_flag' />}
                            />
                            <Label htmlFor='ba_flag' className='font-semibold'>
                                Before After Constraints
                            </Label>
                        </div>

                        {watchedBefAftFlag && (
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label>
                                        Condition <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name='TTB_BefAftFalg'
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='--Select--' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='Before'>Before</SelectItem>
                                                    <SelectItem value='After'>After</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.TTB_BefAftFalg && <FormError>{errors.TTB_BefAftFalg.message}</FormError>}
                                </div>
                                <div className='space-y-2'>
                                    <Label>
                                        Period <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name='TTMP_Id'
                                        render={({ field }) => (
                                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='--Select--' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {periodList.map((item: any) => (
                                                        <SelectItem key={item.ttmP_Id} value={item.ttmP_Id.toString()}>
                                                            {item.ttmP_PeriodName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.TTMP_Id && <FormError>{errors.TTMP_Id.message}</FormError>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <Label>
                            Category <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            control={control}
                            name='TTMC_Id'
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='--Select--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoryList.map((item: any) => (
                                            <SelectItem key={item.ttmC_Id} value={item.ttmC_Id.toString()}>
                                                {item.ttmC_CategoryName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.TTMC_Id && <FormError>{errors.TTMC_Id.message}</FormError>}
                    </div>

                    <div className='space-y-2'>
                        <Label>
                            No of Period <span className='text-red-500'>*</span>
                        </Label>
                        <InputText type='number' {...register('TTB_NoOfPeriods')} error={errors.TTB_NoOfPeriods?.message} />
                    </div>

                    <div className='space-y-4 rounded-md border bg-gray-50 p-4'>
                        <div className='flex items-center space-x-2'>
                            <Controller
                                control={control}
                                name='TTB_ConsecutiveFlag'
                                render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} id='con_flag' />}
                            />
                            <Label htmlFor='con_flag' className='font-semibold'>
                                Consecutive Constraints
                            </Label>
                        </div>

                        {watchedConsecutiveFlag && (
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label>
                                        No of Consecutive Period <span className='text-red-500'>*</span>
                                    </Label>
                                    <InputText
                                        type='number'
                                        {...register('TTB_NoOfConPeriods')}
                                        error={errors.TTB_NoOfConPeriods?.message}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label>
                                        Day <span className='text-red-500'>*</span>
                                    </Label>
                                    <InputText type='number' {...register('TTB_NoOfConDays')} error={errors.TTB_NoOfConDays?.message} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <hr className='my-4' />

            {/* Combination Section */}
            <div className='space-y-4'>
                <h3 className='font-medium text-lg'>Combination Details</h3>
                <div className='grid grid-cols-1 items-end gap-4 rounded-md border bg-gray-50 p-4 md:grid-cols-5'>
                    <div className='space-y-2'>
                        <Label>
                            Class <span className='text-red-500'>*</span>
                        </Label>
                        <Select value={tempCombination.ASMCL_Id?.toString()} onValueChange={(val) => handleClassChange(Number(val))}>
                            <SelectTrigger>
                                <SelectValue placeholder='--Select--' />
                            </SelectTrigger>
                            <SelectContent>
                                {classList.map((item: any) => (
                                    <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                        {item.asmcL_ClassName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='space-y-2'>
                        <Label>
                            Section <span className='text-red-500'>*</span>
                        </Label>
                        <Select value={tempCombination.ASMS_Id?.toString()} onValueChange={(val) => handleSectionChange(Number(val))}>
                            <SelectTrigger>
                                <SelectValue placeholder='--Select--' />
                            </SelectTrigger>
                            <SelectContent>
                                {sectionList.map((item: any) => (
                                    <SelectItem key={item.asmS_Id} value={item.asmS_Id.toString()}>
                                        {item.asmC_SectionName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='space-y-2'>
                        <Label>
                            Staff <span className='text-red-500'>*</span>
                        </Label>
                        <Select value={tempCombination.HRME_Id?.toString()} onValueChange={(val) => handleStaffChange(Number(val))}>
                            <SelectTrigger>
                                <SelectValue placeholder='--Select--' />
                            </SelectTrigger>
                            <SelectContent>
                                {staffList.map((item: any) => (
                                    <SelectItem key={item.hrmE_Id} value={item.hrmE_Id.toString()}>
                                        {item.staffName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='space-y-2'>
                        <Label>
                            Subject <span className='text-red-500'>*</span>
                        </Label>
                        <Select
                            value={tempCombination.ISMS_Id?.toString()}
                            onValueChange={(val) => setTempCombination((prev) => ({ ...prev, ISMS_Id: Number(val) }))}>
                            <SelectTrigger>
                                <SelectValue placeholder='--Select--' />
                            </SelectTrigger>
                            <SelectContent>
                                {subjectList.map((item: any) => (
                                    <SelectItem key={item.ismS_Id} value={item.ismS_Id.toString()}>
                                        {item.ismS_SubjectName || item.subjectName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='pb-2'>
                        <Button type='button' onClick={handleAddCombination} variant='secondary'>
                            <Plus className='mr-2 h-4 w-4' /> Add
                        </Button>
                    </div>
                </div>

                {errors.combinationlist && <FormError>{errors.combinationlist.message}</FormError>}
                {errors.combinationlist?.root && <FormError>{errors.combinationlist.root.message}</FormError>}

                {fields.length > 0 && (
                    <Table className='border'>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Class</TableHead>
                                <TableHead>Section</TableHead>
                                <TableHead>Staff</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead className='w-[80px]'>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field: any, index) => (
                                <TableRow key={field.id}>
                                    <TableCell>{field.className}</TableCell>
                                    <TableCell>{field.sectioname}</TableCell>
                                    <TableCell>{field.staffname}</TableCell>
                                    <TableCell>{field.subjectname}</TableCell>
                                    <TableCell>
                                        <Button type='button' variant='ghost' size='icon' onClick={() => remove(index)}>
                                            <Trash className='h-4 w-4 text-red-500' />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <div className='flex justify-center gap-4 pt-4'>
                <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting}>
                    <Save className='mr-2 h-4 w-4' /> {editData ? 'Update' : 'Save'}
                </Button>
                <Button type='button' variant='destructive' onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}

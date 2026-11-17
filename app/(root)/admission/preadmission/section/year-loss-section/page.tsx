'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown, useMasterSectionHeld } from '@/hooks/admission/preadmission/useMasters';
import { useMasterChangeSectionTable, useMasterYearLossSection } from '@/hooks/admission/preadmission/useSection';
import { useAdmissionClassDropdown } from '@/hooks/admission/preadmission/useTransactions';
import { masterYearLossSectionSchema } from '@/schemas/admission/preadmission/section';
import { addOrUpdateMasterYearLossSection } from '@/server/admission/preadmission/section/sections';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, RefreshCw, Save } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { masterYearLossSectionColumns } from './_components/columns';

type FormFields = z.infer<typeof masterYearLossSectionSchema>;

interface Student {
    amsT_Id: number;
    student_name: string;
    asmcL_Id: number;
    asmcL_ClassName: string;
    asmS_Id: number;
    asmC_SectionName: string;
    amaY_RollNo: number;
    amsT_AdmNo: string;
    student_id: number;
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterYearLossSectionPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = use(props.searchParams);

    const [leftStudents, setLeftStudents] = useState<Student[]>([]);
    const [rightStudents, setRightStudents] = useState<Student[]>([]);
    const [leftSelectedStudents, setLeftSelectedStudents] = useState<Set<number>>(new Set());
    const [rightSelectedStudents, setRightSelectedStudents] = useState<Set<number>>(new Set());
    const [leftSelectAll, setLeftSelectAll] = useState(false);
    const [rightSelectAll, setRightSelectAll] = useState(false);

    const [showLeftTable, setShowLeftTable] = useState(false);
    const [showRightTable, setShowRightTable] = useState(false);
    const [showTransferSection, setShowTransferSection] = useState(false);

    const { data: academicYear, isLoading: ayLoading } = useAcademicYearDropdown();

    const { data: masterClass, isLoading: preadmissionClassLoading, isError: preadmissionClassError } = useAdmissionClassDropdown();

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterYearLossSectionSchema),
        defaultValues: {
            leftAcademicYear: 0,
            leftClassAdmitted: '',
            leftSection: '',
            rightAcademicYear: 0,
            rightClass: '',
            rightSection: ''
        },
        mode: 'onChange'
    });

    const leftAcademicYear = watch('leftAcademicYear');
    const leftClassAdmitted = watch('leftClassAdmitted');
    const leftSection = watch('leftSection');
    const rightClass = watch('rightClass');
    const rightSection = watch('rightSection');

    const {
        data: leftSectionData,
        isLoading: leftSectionLoading,
        isError: leftSectionError
    } = useMasterSectionHeld(Number(leftClassAdmitted));

    const { data: rightSectionData, isLoading: rightSectionLoading, isError: rightSectionError } = useMasterSectionHeld(Number(rightClass));

    const {
        data: leftStudentsData,
        isLoading: leftStudentsLoading,
        isError: leftStudentsError
    } = useMasterYearLossSection(Number(leftAcademicYear), Number(leftClassAdmitted), Number(leftSection));

    const {
        data: StudentsData,
        isLoading: StudentsLoading,
        isError: StudentsError
    } = useMasterChangeSectionTable(searchParams, Number(leftAcademicYear), Number(rightClass), Number(rightSection));

    const tableProps = useDataTableProps(StudentsData);

    const recalculateSiNo = (students: Student[]): Student[] => {
        return students.map((student, index) => ({
            ...student,
            amaY_RollNo: index + 1
        }));
    };

    // Load left students from API
    useEffect(() => {
        if (leftSection && leftStudentsData?.data) {
            const studentsWithSiNo = recalculateSiNo([...leftStudentsData.data]);
            setLeftStudents(studentsWithSiNo);
            setShowLeftTable(true);
        } else {
            setLeftStudents([]);
            setShowLeftTable(false);
        }
        setLeftSelectedStudents(new Set());
        setLeftSelectAll(false);
    }, [leftSection, leftStudentsData]);

    // Handle right section selection
    useEffect(() => {
        if (rightSection) {
            setShowRightTable(true);
        } else {
            setRightStudents([]);
            setShowRightTable(false);
        }
        setRightSelectedStudents(new Set());
        setRightSelectAll(false);
    }, [rightSection]);

    useEffect(() => {
        setShowTransferSection(showLeftTable || showRightTable);
    }, [showLeftTable, showRightTable]);

    useEffect(() => {
        setLeftSelectAll(leftStudents.length > 0 && leftSelectedStudents.size === leftStudents.length);
    }, [leftSelectedStudents, leftStudents]);

    useEffect(() => {
        setRightSelectAll(rightStudents.length > 0 && rightSelectedStudents.size === rightStudents.length);
    }, [rightSelectedStudents, rightStudents]);

    const handleLeftAcademicYearChange = (value: string) => {
        const numValue = Number(value);

        const selected = academicYear?.data?.find((y) => y.asmaY_Id === numValue);

        if (!selected) {
            toast.error('Invalid academic year selected');
            return;
        }

        const nextYear = academicYear?.data?.find((y) => y.asmaY_Order === selected.asmaY_Order + 1);

        if (!nextYear) {
            toast.error('Generated Academic Year not present in database');
            return;
        }
        setValue('leftAcademicYear', numValue);
        setValue('rightAcademicYear', numValue);
        setValue('leftClassAdmitted', '');
        setValue('leftSection', '');
        setValue('rightClass', '');
        setValue('rightSection', '');
        setLeftStudents([]);
        setRightStudents([]);
        setShowLeftTable(false);
        setShowRightTable(false);
        setShowTransferSection(false);
        clearErrors('leftAcademicYear');
    };

    const handleLeftClassChange = (value: string) => {
        setValue('leftClassAdmitted', value);
        setValue('rightClass', value);
        setValue('leftSection', '');
        setValue('rightSection', '');
        setLeftStudents([]);
        setRightStudents([]);
        setLeftSelectedStudents(new Set());
        setRightSelectedStudents(new Set());
        setLeftSelectAll(false);
        setRightSelectAll(false);
        setShowLeftTable(false);
        setShowRightTable(false);
        setShowTransferSection(false);
        clearErrors(['leftClassAdmitted', 'rightClass']);
    };

    const handleLeftSectionChange = (value: string) => {
        setValue('leftSection', value);
        setValue('rightSection', value);
        clearErrors(['leftSection', 'rightSection']);
    };

    const handleRightClassChange = (value: string) => {
        setValue('rightClass', value);
        setValue('leftClassAdmitted', value);
        setValue('rightSection', '');
        setRightStudents([]);
        setRightSelectedStudents(new Set());
        setRightSelectAll(false);
        setShowRightTable(false);
        clearErrors('rightClass');
    };

    const handleRightSectionChange = (value: string) => {
        setValue('rightSection', value);
        clearErrors('rightSection');
    };

    const handleLeftSelectAll = (checked: boolean) => {
        const isChecked = checked === true;
        setLeftSelectAll(isChecked);
        if (isChecked) {
            setLeftSelectedStudents(new Set(leftStudents.map((s) => s.student_id)));
        } else {
            setLeftSelectedStudents(new Set());
        }
    };

    const handleRightSelectAll = (checked: boolean) => {
        setRightSelectAll(checked);
        if (checked) {
            setRightSelectedStudents(new Set(rightStudents.map((s) => s.student_id)));
        } else {
            setRightSelectedStudents(new Set());
        }
    };

    const handleLeftSelectStudent = (studentId: number, checked: boolean) => {
        const newSelected = new Set(leftSelectedStudents);
        if (checked) {
            newSelected.add(studentId);
        } else {
            newSelected.delete(studentId);
        }
        setLeftSelectedStudents(newSelected);
    };

    const handleRightSelectStudent = (studentId: number, checked: boolean) => {
        const newSelected = new Set(rightSelectedStudents);
        if (checked) {
            newSelected.add(studentId);
        } else {
            newSelected.delete(studentId);
        }
        setRightSelectedStudents(newSelected);
    };

    const moveToRight = () => {
        if (leftSelectedStudents.size === 0) {
            toast.error('Please select students to move');
            return;
        }

        if (!rightSection) {
            toast.error('Please select a destination section');
            return;
        }

        const studentsToMove = leftStudents.filter((s) => leftSelectedStudents.has(s.student_id));

        const remainingLeft = leftStudents.filter((s) => !leftSelectedStudents.has(s.student_id));

        const existingRightIds = new Set(rightStudents.map((s) => s.student_id));
        const newStudents = studentsToMove.filter((s) => !existingRightIds.has(s.student_id));

        setLeftStudents(recalculateSiNo(remainingLeft));
        setRightStudents(recalculateSiNo([...rightStudents, ...newStudents]));
        setLeftSelectedStudents(new Set());
        clearErrors('leftSection');
    };

    const moveToLeft = () => {
        if (rightSelectedStudents.size === 0) {
            toast.error('Please select students to move');
            return;
        }

        const originalSectionName = leftSectionData?.data?.find((s: any) => s.asmS_Id === Number(leftSection))?.asmC_SectionName;

        const studentsToMove = rightStudents
            .filter((s) => rightSelectedStudents.has(s.student_id))
            .map((student) => ({
                ...student,
                asmS_Id: Number(leftSection),
                asmC_SectionName: originalSectionName || student.asmC_SectionName
            }));

        const remainingRight = rightStudents.filter((s) => !rightSelectedStudents.has(s.student_id));

        setLeftStudents(recalculateSiNo([...leftStudents, ...studentsToMove]));
        setRightStudents(recalculateSiNo(remainingRight));
        setRightSelectedStudents(new Set());
        clearErrors('leftSection');
    };

    const onSubmit = async (data: FormFields) => {
        try {
            if (rightStudents.length === 0) {
                toast.error('Please move at least one student to the destination section');
                return;
            }

            const payload = {
                asmaY_Id: data.rightAcademicYear,
                asmcL_Id: Number(data.leftClassAdmitted),
                asmS_Id: Number(data.leftSection),
                students: rightStudents.map((student) => ({
                    amsT_Id: student.student_id
                }))
            };

            const response = await addOrUpdateMasterYearLossSection(payload);

            if (response.success) {
                toast.success(response.message || 'Year loss section updated successfully!');
                reset();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update year loss section');
        }
    };

    const handleReset = () => {
        reset({
            leftAcademicYear: 0,
            leftClassAdmitted: '',
            leftSection: '',
            rightAcademicYear: 0,
            rightClass: '',
            rightSection: ''
        });
        setLeftStudents([]);
        setRightStudents([]);
        setLeftSelectedStudents(new Set());
        setRightSelectedStudents(new Set());
        setLeftSelectAll(false);
        setRightSelectAll(false);
        setShowLeftTable(false);
        setShowRightTable(false);
        setShowTransferSection(false);
    };

    const getAcademicYearDisplay = (id: number) => {
        const selected = academicYear?.data?.find((y) => y.asmaY_Id === id);

        if (!selected) return '';

        const nextYear = academicYear?.data?.find((y) => y.asmaY_Order === selected.asmaY_Order + 1);

        return nextYear?.asmaY_Year || '';
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='container space-y-4 p-4'>
                <CollapsibleSection
                    title='Year Loss Section'
                    description='Select criteria and transfer students between sections'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <div className='space-y-6'>
                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                            <div className='space-y-4 rounded-lg border p-4'>
                                <div className='space-y-4'>
                                    <div className='flex flex-col gap-1.5'>
                                        <Label htmlFor='leftAcademicYear'>
                                            Academic Year <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='leftAcademicYear'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={handleLeftAcademicYearChange}
                                                    value={field.value > 0 ? field.value.toString() : ''}>
                                                    <SelectTrigger className='w-full bg-white'>
                                                        <SelectValue placeholder='Select Academic Year' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ayLoading ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
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
                                            )}
                                        />
                                        {errors.leftAcademicYear && <FormError>{errors.leftAcademicYear.message}</FormError>}
                                    </div>

                                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                        <div className='flex flex-col gap-1.5'>
                                            <Label htmlFor='leftClassAdmitted'>
                                                Class Admitted <span className='text-red-500'>*</span>
                                            </Label>
                                            <Controller
                                                name='leftClassAdmitted'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        onValueChange={handleLeftClassChange}
                                                        value={field.value}
                                                        disabled={!leftAcademicYear || leftAcademicYear === 0}>
                                                        <SelectTrigger className='w-full bg-white'>
                                                            <SelectValue placeholder='Select Class' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {preadmissionClassLoading ? (
                                                                <SelectItem value='loading' disabled>
                                                                    Loading...
                                                                </SelectItem>
                                                            ) : preadmissionClassError ? (
                                                                <SelectItem value='error' disabled>
                                                                    Error loading
                                                                </SelectItem>
                                                            ) : (
                                                                masterClass?.data?.map((item) => (
                                                                    <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                                        {item.asmcL_ClassName}
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.leftClassAdmitted && <FormError>{errors.leftClassAdmitted.message}</FormError>}
                                        </div>

                                        <div className='flex flex-col gap-1.5'>
                                            <Label htmlFor='leftSection'>
                                                Section <span className='text-red-500'>*</span>
                                            </Label>
                                            <Controller
                                                name='leftSection'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        onValueChange={handleLeftSectionChange}
                                                        value={field.value}
                                                        disabled={!leftClassAdmitted}>
                                                        <SelectTrigger className='w-full bg-white'>
                                                            <SelectValue placeholder='Select Section' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {leftSectionLoading ? (
                                                                <SelectItem value='loading' disabled>
                                                                    Loading...
                                                                </SelectItem>
                                                            ) : leftSectionError ? (
                                                                <SelectItem value='error' disabled>
                                                                    Error loading
                                                                </SelectItem>
                                                            ) : (
                                                                leftSectionData?.data?.map((opt: any) => (
                                                                    <SelectItem key={opt.asmS_Id} value={opt.asmS_Id.toString()}>
                                                                        {opt.asmC_SectionName}
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.leftSection && <FormError>{errors.leftSection.message}</FormError>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-4 rounded-lg border p-4'>
                                <div className='flex flex-col gap-1.5'>
                                    <Label htmlFor='rightAcademicYear'>
                                        Academic Year <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        name='rightAcademicYear'
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value > 0 ? field.value.toString() : ''} disabled>
                                                <SelectTrigger className='w-full cursor-not-allowed bg-gray-100'>
                                                    <SelectValue placeholder='Select Academic Year first'>
                                                        {field.value > 0
                                                            ? getAcademicYearDisplay(field.value)
                                                            : 'Select Academic Year first'}
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                    <div className='flex flex-col gap-1.5'>
                                        <Label htmlFor='rightClass'>
                                            Class <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='rightClass'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value}
                                                    onValueChange={handleRightClassChange}
                                                    disabled={(leftClassAdmitted as any) || leftClassAdmitted === ''}>
                                                    <SelectTrigger
                                                        className={`w-full ${
                                                            !leftClassAdmitted || leftClassAdmitted === ''
                                                                ? 'cursor-not-allowed bg-gray-100'
                                                                : 'bg-gray-100'
                                                        }`}>
                                                        <SelectValue placeholder='Select Class'>
                                                            {field.value &&
                                                                masterClass?.data?.find((item) => item.asmcL_Id.toString() === field.value)
                                                                    ?.asmcL_ClassName}
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {preadmissionClassLoading ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : preadmissionClassError ? (
                                                            <SelectItem value='error' disabled>
                                                                Error loading
                                                            </SelectItem>
                                                        ) : (
                                                            masterClass?.data?.map((item) => (
                                                                <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                                    {item.asmcL_ClassName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.rightClass && <FormError>{errors.rightClass.message}</FormError>}
                                    </div>

                                    <div className='flex flex-col gap-1.5'>
                                        <Label htmlFor='rightSection'>
                                            Section <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='rightSection'
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={handleRightSectionChange} value={field.value} disabled={!rightClass}>
                                                    <SelectTrigger className='w-full bg-white'>
                                                        <SelectValue placeholder='Select Section' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {rightSectionLoading ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : rightSectionError ? (
                                                            <SelectItem value='error' disabled>
                                                                Error loading
                                                            </SelectItem>
                                                        ) : (
                                                            rightSectionData?.data?.map((opt: any) => (
                                                                <SelectItem key={opt.asmS_Id} value={opt.asmS_Id.toString()}>
                                                                    {opt.asmC_SectionName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.rightSection && <FormError>{errors.rightSection.message}</FormError>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection
                    title='Students List'
                    description='Select and transfer students between sections'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <div className='space-y-4'>
                        <div className='grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_auto_1fr]'>
                            <div className='space-y-2'>
                                <div className='overflow-x-auto rounded-lg border bg-white'>
                                    <table className='w-full'>
                                        <thead className='border-b bg-gray-50'>
                                            <tr>
                                                <th className='p-3 text-left font-semibold text-sm'>SI. No</th>
                                                <th className='w-12 p-3 text-left font-semibold text-sm'>
                                                    <Checkbox
                                                        checked={leftSelectAll}
                                                        onCheckedChange={handleLeftSelectAll}
                                                        disabled={leftStudents.length === 0}
                                                        className='h-4 w-4 cursor-pointer rounded border-gray-300'
                                                    />
                                                </th>
                                                <th className='p-3 text-left font-semibold text-sm'>Student Name</th>
                                                <th className='p-3 text-left font-semibold text-sm'>Class</th>
                                                <th className='p-3 text-left font-semibold text-sm'>Section</th>
                                                <th className='p-3 text-left font-semibold text-sm'>Adm. No</th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y'>
                                            {leftStudentsLoading ? (
                                                <tr>
                                                    <td colSpan={6} className='p-8 text-center text-gray-500'>
                                                        <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                                                            <RefreshCw className='h-8 w-8 animate-spin text-secondary' />
                                                            <p className='text-muted-foreground text-sm'>Loading students...</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : leftStudentsError ? (
                                                <tr>
                                                    <td colSpan={6} className='p-8 text-center text-red-500'>
                                                        Error loading students
                                                    </td>
                                                </tr>
                                            ) : leftStudents.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className='p-8 text-center text-gray-500'>
                                                        No students available in this section
                                                    </td>
                                                </tr>
                                            ) : (
                                                leftStudents.map((student) => (
                                                    <tr key={student.student_id} className='hover:bg-gray-50'>
                                                        <td className='p-3 text-sm'>{student.amaY_RollNo}</td>
                                                        <td className='p-3'>
                                                            <Checkbox
                                                                checked={leftSelectedStudents.has(student.student_id)}
                                                                onCheckedChange={(checked: boolean) =>
                                                                    handleLeftSelectStudent(student.student_id, checked)
                                                                }
                                                                className='h-4 w-4 cursor-pointer rounded border-gray-300'
                                                            />
                                                        </td>
                                                        <td className='p-3 font-medium text-sm'>{student.student_name}</td>
                                                        <td className='p-3 text-sm'>{student.asmcL_ClassName}</td>
                                                        <td className='p-3 text-sm'>{student.asmC_SectionName}</td>
                                                        <td className='p-3 text-sm'>{student.amsT_AdmNo}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className='flex flex-col items-center justify-center gap-2 py-8'>
                                <Button
                                    type='button'
                                    onClick={moveToRight}
                                    disabled={leftSelectedStudents.size === 0 || !rightSection}
                                    className='w-full lg:w-auto'
                                    variant='outline'
                                    title='Move selected students to destination'>
                                    <ArrowRight className='h-4 w-4' />
                                </Button>
                                <Button
                                    type='button'
                                    onClick={moveToLeft}
                                    disabled={rightSelectedStudents.size === 0 || !leftSection}
                                    className='w-full lg:w-auto'
                                    variant='outline'
                                    title='Move selected students to source'>
                                    <ArrowLeft className='h-4 w-4' />
                                </Button>
                            </div>

                            <div className='space-y-2'>
                                <div className='overflow-x-auto rounded-lg border bg-white'>
                                    <table className='w-full'>
                                        <thead className='border-b bg-gray-50'>
                                            <tr>
                                                <th className='p-3 text-left font-semibold text-sm'>SI. No</th>
                                                <th className='w-12 p-3 text-left font-semibold text-sm'>
                                                    <Checkbox
                                                        checked={rightSelectAll}
                                                        onCheckedChange={handleRightSelectAll}
                                                        disabled={rightStudents.length === 0}
                                                        className='h-4 w-4 cursor-pointer rounded border-gray-300'
                                                    />
                                                </th>
                                                <th className='p-3 text-left font-semibold text-sm'>Student Name</th>
                                                <th className='p-3 text-left font-semibold text-sm'>Class</th>
                                                <th className='p-3 text-left font-semibold text-sm'>Section</th>
                                                <th className='p-3 text-left font-semibold text-sm'>Adm. No</th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y'>
                                            {rightStudents.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className='p-8 text-center text-gray-500'>
                                                        No students in this section
                                                    </td>
                                                </tr>
                                            ) : (
                                                rightStudents.map((student) => (
                                                    <tr key={student.student_id} className='hover:bg-gray-50'>
                                                        <td className='p-3 text-sm'>{student.amaY_RollNo}</td>
                                                        <td className='p-3'>
                                                            <Checkbox
                                                                checked={rightSelectedStudents.has(student.student_id)}
                                                                onCheckedChange={(checked) =>
                                                                    handleRightSelectStudent(student.student_id, checked as boolean)
                                                                }
                                                                className='h-4 w-4 cursor-pointer rounded border-gray-300'
                                                            />
                                                        </td>
                                                        <td className='p-3 font-medium text-sm'>{student.student_name}</td>
                                                        <td className='p-3 text-sm'>{student.asmcL_ClassName}</td>
                                                        <td className='p-3 text-sm'>{student.asmC_SectionName}</td>
                                                        <td className='p-3 text-sm'>{student.amsT_AdmNo}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                            <>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleReset}
                                    disabled={isSubmitting}
                                    className='w-fit transition-all duration-200 hover:scale-105'>
                                    Reset
                                </Button>
                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={isSubmitting}
                                    className='w-fit transition-all duration-200 hover:scale-105'>
                                    <div className='flex items-center'>
                                        <Save className='mr-2 h-4 w-4' />
                                        {isSubmitting ? 'Saving...' : 'Save'}
                                    </div>
                                </Button>
                            </>
                        </div>
                    </div>
                </CollapsibleSection>
                {showTransferSection && (
                    <CollapsibleSection
                        title='Section Allotted Student List'
                        description='Final list of students in the destination section'
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <div className='space-y-4'>
                            <GenericDataTable<Student>
                                {...tableProps}
                                columns={masterYearLossSectionColumns as any}
                                isLoading={StudentsLoading}
                                error={StudentsError as any}
                                showViewOptions={false}
                                columnPinning={{ right: ['actions'] }}
                                loadingMessage='Loading Students...'
                                noDataTitle='No Students Found'
                                noDataDescription='Select a section to view students'
                                errorTitle='Error Loading Students'
                            />
                        </div>
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}

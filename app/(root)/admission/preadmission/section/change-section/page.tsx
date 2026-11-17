'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown, useMasterSectionHeld } from '@/hooks/admission/preadmission/useMasters';
import { useMasterChangeSectionTable, useMasterStudents } from '@/hooks/admission/preadmission/useSection';
import { useAdmissionClassDropdown } from '@/hooks/admission/preadmission/useTransactions';
import { masterChangeSectionSchema } from '@/schemas/admission/preadmission/section';
import { addOrUpdateMasterChangeSection } from '@/server/admission/preadmission/section/sections';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, RefreshCw, Save } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { masterChangeSectionColumns } from './_components/columns';

type FormFields = z.infer<typeof masterChangeSectionSchema>;

interface Student {
    asysT_Id: number;
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

export default function MasterChangeSectionPage(props: {
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
    const [disableRightClass, setDisableRightClass] = useState(false);

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
        resolver: zodResolver(masterChangeSectionSchema),
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
    } = useMasterStudents(Number(leftAcademicYear), Number(leftClassAdmitted), Number(leftSection));

    const {
        data: rightStudentsData,
        isLoading: rightStudentsLoading,
        isError: rightStudentsError
    } = useMasterChangeSectionTable(searchParams, Number(leftAcademicYear), Number(rightClass), Number(rightSection));

    const tableProps = useDataTableProps(rightStudentsData);

    const recalculateSiNo = (students: Student[]): Student[] => {
        return students.map((student, index) => ({
            ...student,
            amaY_RollNo: index + 1
        }));
    };

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

    useEffect(() => {
        if (rightSection) {
            setShowRightTable(true);
            setShowLeftTable(true);
        } else {
            setRightStudents([]);
            setShowRightTable(false);
            setShowLeftTable(false);
        }
        setRightSelectedStudents(new Set());
        setRightSelectAll(false);
    }, [rightSection]);

    useEffect(() => {
        setShowTransferSection(showLeftTable && showRightTable);
    }, [showLeftTable, showRightTable]);

    useEffect(() => {
        setLeftSelectAll(leftStudents.length > 0 && leftSelectedStudents.size === leftStudents.length);
    }, [leftSelectedStudents, leftStudents]);

    useEffect(() => {
        setRightSelectAll(rightStudents.length > 0 && rightSelectedStudents.size === rightStudents.length);
    }, [rightSelectedStudents, rightStudents]);

    useEffect(() => {
        setLeftSelectAll(leftStudents.length > 0 && leftSelectedStudents.size === leftStudents.length);
    }, [leftSelectedStudents, leftStudents]);

    const handleLeftAcademicYearChange = (value: string) => {
        const numValue = Number(value);
        setValue('leftAcademicYear', numValue);
        setValue('rightAcademicYear', numValue);
        setValue('leftClassAdmitted', '');
        setValue('leftSection', '');
        setValue('rightClass', '');
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
        setDisableRightClass(true);
    };

    const handleLeftSectionChange = (value: string) => {
        setValue('leftSection', value);
        if (value === rightSection) {
            setRightStudents([]);
            setRightSelectedStudents(new Set());
            setRightSelectAll(false);
            setShowRightTable(false);
            setValue('rightSection', '');
        }
        clearErrors('leftSection');
    };

    const handleRightClassChange = (value: string) => {
        if (disableRightClass) {
            toast.error('Cannot change class while students are in transfer list');
            return;
        }
        setValue('rightClass', value);
        setValue('leftClassAdmitted', value);
        setValue('rightSection', '');
        setRightStudents([]);
        setRightSelectedStudents(new Set());
        setRightSelectAll(false);
        setShowRightTable(false);
        setDisableRightClass(true);
    };

    const handleRightSectionChange = (value: string) => {
        if (value === leftSection) {
            toast.error('Selected Section Is Already Assigned. Please Select Different One!');
            return;
        }
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

        const newSectionName = rightSectionData?.data?.find((s: any) => s.asmS_Id === Number(rightSection))?.asmC_SectionName;

        const studentsToMove = leftStudents
            .filter((s) => leftSelectedStudents.has(s.student_id))
            .map((student) => ({
                ...student,
                asmS_Id: Number(rightSection),
                asmC_SectionName: newSectionName || student.asmC_SectionName
            }));

        const remainingLeft = leftStudents.filter((s) => !leftSelectedStudents.has(s.student_id));

        setLeftStudents(recalculateSiNo(remainingLeft));
        setRightStudents(recalculateSiNo([...rightStudents, ...studentsToMove]));
        setLeftSelectedStudents(new Set());
        setDisableRightClass(true);

        toast.success(`Moved ${studentsToMove.length} student(s) to destination section`);
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

        if (remainingRight.length === 0) {
            setDisableRightClass(false);
        }

        toast.success(`Moved ${studentsToMove.length} student(s) back to source section`);
    };

    const onSubmit = async (data: FormFields) => {
        try {
            const payload = {
                asmaY_Id: data.leftAcademicYear,
                asmcL_Id: Number(data.leftClassAdmitted),
                olD_ASMS_Id: Number(data.leftSection),
                neW_ASMS_Id: Number(data.rightSection),
                students: rightStudents.map((student) => ({
                    amsT_Id: student.student_id
                }))
            };

            const response = await addOrUpdateMasterChangeSection(payload);
            if (response.success) {
                toast.success(response.message || 'Section transfer completed successfully!');
                reset();
            } else {
                toast.error(response.message);
            }
        } catch (_error: any) {
            // Igonre
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
        setDisableRightClass(false);
    };

    const getAcademicYearDisplay = (id: number) => {
        const year = academicYear?.data?.find((y) => y.asmaY_Id === id);
        return year?.asmaY_Year || '';
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='container space-y-4 p-4'>
                <CollapsibleSection
                    title='Change Section'
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
                                                            masterClass?.data?.map((item: any) => (
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
                                                    disabled={disableRightClass || !leftAcademicYear || leftAcademicYear === 0}>
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
                                                            masterClass?.data?.map((item: any) => (
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
                    title='Update Students To New Section'
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
                                                <th className='p-3 text-left font-semibold text-sm'>Roll No</th>
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
                                    title='Move selected students to destination section'>
                                    <ArrowRight className='h-4 w-4' />
                                </Button>
                                <Button
                                    type='button'
                                    onClick={moveToLeft}
                                    disabled={rightSelectedStudents.size === 0}
                                    className='w-full lg:w-auto'
                                    variant='outline'
                                    title='Move selected students back to source section'>
                                    <ArrowLeft className='h-4 w-4' />
                                </Button>
                            </div>

                            {/* {showRightTable && ( */}
                            <div className='space-y-2'>
                                <div className='overflow-x-auto rounded-lg border bg-white'>
                                    <table className='w-full'>
                                        <thead className='border-b bg-gray-50'>
                                            <tr>
                                                <th className='p-3 text-left font-semibold text-sm'>Roll No</th>
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
                                                        No students moved yet
                                                    </td>
                                                </tr>
                                            ) : (
                                                rightStudents.map((student) => (
                                                    <tr key={student.student_id} className='hover:bg-gray-50'>
                                                        <td className='p-3 text-sm'>{student.amaY_RollNo}</td>
                                                        <td className='p-3'>
                                                            <Checkbox
                                                                checked={rightSelectedStudents.has(student.student_id)}
                                                                onCheckedChange={(checked: boolean) =>
                                                                    handleRightSelectStudent(student.student_id, checked)
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
                            {/* )} */}
                        </div>

                        <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handleReset}
                                disabled={isSubmitting}
                                className='w-fit transition-all duration-200 hover:scale-105'>
                                Reset
                            </Button>
                            <Button onClick={handleSubmit(onSubmit)} className='w-fit transition-all duration-200 hover:scale-105'>
                                <div className='flex items-center'>
                                    <Save className='mr-2 h-4 w-4' />
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </div>
                            </Button>
                        </div>
                    </div>
                </CollapsibleSection>

                {showTransferSection && (
                    <CollapsibleSection
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <GenericDataTable<Student>
                            {...tableProps}
                            columns={masterChangeSectionColumns as any}
                            isLoading={rightStudentsLoading}
                            error={rightStudentsError as any}
                            showViewOptions={false}
                            columnPinning={{ right: ['actions'] }}
                            loadingMessage='Loading Students...'
                            noDataTitle='No Students Found'
                            noDataDescription='Select a section to view students'
                            errorTitle='Error Loading Students'
                        />
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}

'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown, useMasterSectionHeld } from '@/hooks/admission/preadmission/useMasters';
import { useMasterChangeSectionTable } from '@/hooks/admission/preadmission/useSection';
import { useAdmissionClassDropdown } from '@/hooks/admission/preadmission/useTransactions';
import { masterPromotionSectionSchema } from '@/schemas/admission/preadmission/section';
import { getPromotionSection, postPromotionSection } from '@/server/admission/preadmission/section/sections';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { masterPromotionSectionColumns } from './_components/columns';

type FormFields = z.infer<typeof masterPromotionSectionSchema>;

interface Student {
    studentId: number;
    siNo: number;
    studentName: string;
    admNo: string;
    className: string;
    sectionName: string;
    classId: number;
    sectionId: number;
}

interface ApiStudent {
    asysT_Id: number;
    student_id: number;
    student_name: string;
    asmcL_Id: number;
    asmcL_ClassName: string;
    asmS_Id: number;
    asmC_SectionName: string;
    amaY_RollNo: number;
    amsT_AdmNo: string;
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterPromotionSectionPage(props: {
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
    // const [isLoadingLeftStudents, setIsLoadingLeftStudents] = useState(false);

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
        resolver: zodResolver(masterPromotionSectionSchema),
        defaultValues: {
            leftAcademicYear: 0,
            noOfYears: 0,
            leftClassAdmitted: '',
            leftSection: '',
            rightAcademicYear: 0,
            rightClass: '',
            rightSection: ''
        },
        mode: 'onChange'
    });

    const leftAcademicYear = watch('leftAcademicYear');
    const rightAcademicYear = watch('rightAcademicYear');
    const noOfYears = watch('noOfYears');
    const leftClassAdmitted = watch('leftClassAdmitted');
    const leftSection = watch('leftSection');
    const rightClass = watch('rightClass');
    const rightSection = watch('rightSection');

    const {
        data: leftSectionData,
        isLoading: leftSectionLoading,
        isError: leftSectionError
    } = useMasterSectionHeld(Number(leftClassAdmitted));

    const {
        data: rightSectionData,
        isLoading: rightSectionLoading,
        isError: rightSectionError,
        refetch: refetchRightSection
    } = useMasterSectionHeld(Number(rightClass));

    const {
        data: StudentsData,
        isLoading: StudentsLoading,
        isError: StudentsError
    } = useMasterChangeSectionTable(searchParams, Number(rightAcademicYear), Number(rightClass), Number(rightSection));

    const tableProps = useDataTableProps(StudentsData);

    const recalculateSiNo = (students: Student[]): Student[] => {
        return students.map((student, index) => ({
            ...student,
            siNo: index + 1
        }));
    };

    // Convert API student data to internal format
    const convertApiStudentToInternal = (apiStudent: ApiStudent): Student => {
        return {
            studentId: apiStudent.student_id,
            siNo: apiStudent.amaY_RollNo,
            studentName: apiStudent.student_name,
            admNo: apiStudent.amsT_AdmNo,
            className: apiStudent.asmcL_ClassName,
            sectionName: apiStudent.asmC_SectionName,
            classId: apiStudent.asmcL_Id,
            sectionId: apiStudent.asmS_Id
        };
    };

    useEffect(() => {
        const fetchLeftStudents = async () => {
            if (leftAcademicYear && leftClassAdmitted && leftSection && rightAcademicYear && rightClass && rightSection) {
                // setIsLoadingLeftStudents(true);
                try {
                    const payload = {
                        presenT_ASMAY_Id: Number(leftAcademicYear),
                        presenT_ASMCL_Id: Number(leftClassAdmitted),
                        presenT_ASMS_Id: Number(leftSection),
                        promotioN_ASMAY_Id: Number(rightAcademicYear),
                        promotioN_ASMCL_Id: rightClass,
                        promotioN_ASMS_Id: rightSection
                    };

                    const response = await getPromotionSection(payload);

                    if (response?.data) {
                        const convertedStudents = response.data.map(convertApiStudentToInternal);
                        const studentsWithSiNo = recalculateSiNo(convertedStudents);
                        setLeftStudents(studentsWithSiNo);
                        setShowLeftTable(true);
                    } else {
                        setLeftStudents([]);
                        setShowLeftTable(false);
                    }
                } catch (error) {
                    console.error('Error fetching left students:', error);
                    toast.error('Failed to fetch students');
                    setLeftStudents([]);
                    setShowLeftTable(false);
                } finally {
                    // Ignore
                    // setIsLoadingLeftStudents(false);
                }
            } else {
                setLeftStudents([]);
                setShowLeftTable(false);
            }
            setLeftSelectedStudents(new Set());
            setLeftSelectAll(false);
        };

        fetchLeftStudents();
    }, [leftAcademicYear, leftClassAdmitted, leftSection, rightAcademicYear, rightClass, rightSection]);

    useEffect(() => {
        if (rightSection) {
            setRightStudents([]);
            setShowRightTable(true);
        } else {
            setRightStudents([]);
            setShowRightTable(false);
        }
        setRightSelectedStudents(new Set());
        setRightSelectAll(false);
    }, [rightSection]);

    useEffect(() => {
        if (leftAcademicYear && noOfYears > 0 && leftClassAdmitted) {
            if (masterClass?.data) {
                const currentClass = masterClass.data.find((c) => c.asmcL_Id.toString() === leftClassAdmitted);

                if (currentClass) {
                    const targetClassOrder = currentClass.asmcL_Order + noOfYears;
                    const targetClass = masterClass.data.find((c) => c.asmcL_Order === targetClassOrder);

                    if (targetClass) {
                        const newRightClass = targetClass.asmcL_Id.toString();
                        setValue('rightClass', newRightClass);
                        setValue('rightSection', '');
                        setRightStudents([]);
                        setRightSelectedStudents(new Set());
                        setRightSelectAll(false);
                        setShowRightTable(false);
                    } else {
                        toast.error(`No class found for ${noOfYears} year(s) promotion.`);
                        setValue('rightClass', '');
                        setValue('rightSection', '');
                    }
                }
            }
        } else if (noOfYears === 0) {
            setValue('rightClass', '');
            setValue('rightSection', '');
        }
    }, [leftAcademicYear, noOfYears, leftClassAdmitted, masterClass, setValue]);

    useEffect(() => {
        if (rightClass && Number(rightClass) > 0) {
            if (refetchRightSection) {
                refetchRightSection();
            }
        }
    }, [rightClass, refetchRightSection]);

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
        setValue('noOfYears', 0);
        setValue('leftClassAdmitted', '');
        setValue('leftSection', '');
        setValue('rightClass', '');
        setValue('rightSection', '');
        setLeftStudents([]);
        setRightStudents([]);
        setShowTransferSection(false);
        clearErrors('leftAcademicYear');
    };

    const handleNoOfYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value === '' || /^[1-9]$/.test(value)) {
            const numValue = value === '' ? 0 : Number(value);
            setValue('noOfYears', numValue);
            clearErrors('noOfYears');

            if (numValue > 0 && leftAcademicYear && academicYear?.data) {
                const currentYear = academicYear.data.find((y) => y.asmaY_Id === leftAcademicYear);

                if (currentYear) {
                    const targetOrder = currentYear.asmaY_Order + numValue;
                    const targetYear = academicYear.data.find((y) => y.asmaY_Order === targetOrder);

                    if (targetYear) {
                        setValue('rightAcademicYear', targetYear.asmaY_Id);
                    } else {
                        toast.error(`No academic year found for ${numValue} year(s) ahead.`);
                        setValue('rightAcademicYear', 0);
                    }
                }
            } else {
                setValue('rightAcademicYear', 0);
            }

            setValue('rightClass', '');
            setValue('rightSection', '');
        }
    };

    const handleLeftClassChange = (value: string) => {
        setValue('leftClassAdmitted', value);
        setValue('leftSection', '');
        setValue('rightSection', '');
        setLeftStudents([]);
        setRightStudents([]);
        setLeftSelectedStudents(new Set());
        setRightSelectedStudents(new Set());
        setLeftSelectAll(false);
        setRightSelectAll(false);
        setShowTransferSection(false);
        clearErrors(['leftClassAdmitted', 'rightClass']);
    };

    const handleLeftSectionChange = (value: string) => {
        setValue('leftSection', value);
        if (!rightSection) {
            setValue('rightSection', '');
        }
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
        setValue('rightClass', value);
        setValue('rightSection', '');
        setRightStudents([]);
        setRightSelectedStudents(new Set());
        setRightSelectAll(false);
        setShowRightTable(false);
        clearErrors('rightClass');
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
        setLeftSelectAll(checked);
        if (checked) {
            setLeftSelectedStudents(new Set(leftStudents.map((s) => s.studentId)));
        } else {
            setLeftSelectedStudents(new Set());
        }
    };

    const handleRightSelectAll = (checked: boolean) => {
        setRightSelectAll(checked);
        if (checked) {
            setRightSelectedStudents(new Set(rightStudents.map((s) => s.studentId)));
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

        if (!rightClass || !rightSection) {
            toast.error('Please select destination class and section');
            return;
        }

        const studentsToMove = leftStudents.filter((s) => leftSelectedStudents.has(s.studentId));
        const remainingLeft = leftStudents.filter((s) => !leftSelectedStudents.has(s.studentId));

        // Update students with new class and section info
        const updatedStudents = studentsToMove.map((student) => ({
            ...student,
            classId: Number(rightClass),
            sectionId: Number(rightSection),
            className: getClassDisplay(rightClass),
            sectionName: getSectionDisplay(rightSection)
        }));

        setLeftStudents(recalculateSiNo(remainingLeft));
        setRightStudents(recalculateSiNo([...rightStudents, ...updatedStudents]));
        setLeftSelectedStudents(new Set());

        toast.success(`Moved ${studentsToMove.length} student(s) to destination`);
    };

    const moveToLeft = () => {
        if (rightSelectedStudents.size === 0) {
            toast.error('Please select students to move');
            return;
        }

        const studentsToMove = rightStudents.filter((s) => rightSelectedStudents.has(s.studentId));
        const remainingRight = rightStudents.filter((s) => !rightSelectedStudents.has(s.studentId));

        const updatedStudents = studentsToMove.map((student) => ({
            ...student,
            classId: Number(leftClassAdmitted),
            sectionId: Number(leftSection),
            className: getClassDisplay(leftClassAdmitted),
            sectionName: getSectionDisplay(leftSection)
        }));

        setLeftStudents(recalculateSiNo([...leftStudents, ...updatedStudents]));
        setRightStudents(recalculateSiNo(remainingRight));
        setRightSelectedStudents(new Set());

        toast.success(`Moved ${studentsToMove.length} student(s) to source`);
    };

    const onSubmit = async (data: FormFields) => {
        try {
            if (rightStudents.length === 0) {
                toast.error('No students to promote');
                return;
            }

            const payload = {
                asmaY_Id: Number(data.rightAcademicYear),
                asmcL_Id: Number(data.rightClass),
                asmS_Id: Number(data.rightSection),
                students: rightStudents.map((student) => ({
                    amsT_Id: student.studentId
                }))
            };

            const response = await postPromotionSection(payload);
            if (response?.success) {
                toast.success(response.message || 'Section promotion completed successfully!');
                handleReset();
            } else {
                toast.error(response?.message || 'Failed to promote students');
            }
        } catch (_error: any) {
            // Ignore
        }
    };

    const handleReset = () => {
        reset({
            leftAcademicYear: 0,
            noOfYears: 0,
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
        const year = academicYear?.data?.find((y) => y.asmaY_Id === id);
        return year?.asmaY_Year || '';
    };

    const getClassDisplay = (id: string) => {
        const cls = masterClass?.data?.find((c) => c.asmcL_Id.toString() === id);
        return cls?.asmcL_ClassName || '';
    };

    const getSectionDisplay = (section: string) => {
        const leftSec = leftSectionData?.data?.find((s: any) => s.asmS_Id.toString() === section);
        if (leftSec) return leftSec.asmC_SectionName;

        const rightSec = rightSectionData?.data?.find((s: any) => s.asmS_Id.toString() === section);
        return rightSec?.asmC_SectionName || '';
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='container space-y-4 p-4'>
                <CollapsibleSection
                    title='Promotion Section'
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
                                        <Label htmlFor='noOfYears'>
                                            No Of Years to Promoted <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='noOfYears'
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id='noOfYears'
                                                    type='text'
                                                    inputMode='numeric'
                                                    placeholder='Enter years (1-9)'
                                                    value={field.value === 0 ? '' : field.value}
                                                    onChange={handleNoOfYearsChange}
                                                    disabled={!leftAcademicYear || leftAcademicYear === 0}
                                                    maxLength={1}
                                                    className='w-full bg-white'
                                                />
                                            )}
                                        />
                                        {errors.noOfYears && <FormError>{errors.noOfYears.message}</FormError>}
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
                                                        disabled={!noOfYears || noOfYears === 0}>
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
                                            <Select value={field.value > 0 ? field.value.toString() : ''} disabled={true}>
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
                                            Class Admitted <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='rightClass'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value}
                                                    onValueChange={handleRightClassChange}
                                                    disabled={!rightAcademicYear || rightAcademicYear === 0}>
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
                                        {errors.rightClass && <FormError>{errors.rightClass.message}</FormError>}
                                    </div>

                                    {/* Section */}
                                    <div className='flex flex-col gap-1.5'>
                                        <Label htmlFor='rightSection'>
                                            Section <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='rightSection'
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={handleRightSectionChange} value={field.value}>
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
                                            {leftStudents.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className='p-8 text-center text-gray-500'>
                                                        No students available in this section
                                                    </td>
                                                </tr>
                                            ) : (
                                                leftStudents.map((student) => (
                                                    <tr key={student.studentId} className='hover:bg-gray-50'>
                                                        <td className='p-3 text-sm'>{student.siNo}</td>
                                                        <td className='p-3'>
                                                            <Checkbox
                                                                checked={leftSelectedStudents.has(student.studentId)}
                                                                onCheckedChange={(checked: boolean) =>
                                                                    handleLeftSelectStudent(student.studentId, checked)
                                                                }
                                                                className='h-4 w-4 cursor-pointer rounded border-gray-300'
                                                            />
                                                        </td>
                                                        <td className='p-3 font-medium text-sm'>{student.studentName}</td>
                                                        <td className='p-3 text-sm'>{getClassDisplay(leftClassAdmitted)}</td>
                                                        <td className='p-3 text-sm'>{getSectionDisplay(leftSection)}</td>
                                                        <td className='p-3 text-sm'>{student.admNo}</td>
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
                                    disabled={leftSelectedStudents.size === 0}
                                    className='w-full lg:w-auto'
                                    variant='outline'
                                    title='Move selected students to destination'>
                                    <ArrowRight className='h-4 w-4' />
                                </Button>
                                <Button
                                    type='button'
                                    onClick={moveToLeft}
                                    disabled={rightSelectedStudents.size === 0}
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
                                                    <tr key={student.studentId} className='hover:bg-gray-50'>
                                                        <td className='p-3 text-sm'>{student.siNo}</td>
                                                        <td className='p-3'>
                                                            <Checkbox
                                                                checked={rightSelectedStudents.has(student.studentId)}
                                                                onCheckedChange={(checked) =>
                                                                    handleRightSelectStudent(student.studentId, checked as boolean)
                                                                }
                                                                className='h-4 w-4 cursor-pointer rounded border-gray-300'
                                                            />
                                                        </td>
                                                        <td className='p-3 font-medium text-sm'>{student.studentName}</td>
                                                        <td className='p-3 text-sm'>{getClassDisplay(rightClass)}</td>
                                                        <td className='p-3 text-sm'>{getSectionDisplay(rightSection)}</td>
                                                        <td className='p-3 text-sm'>{student.admNo}</td>
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
                                columns={masterPromotionSectionColumns as any}
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

'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown, useMasterSectionHeld } from '@/hooks/admission/preadmission/useMasters';
import { useMasterChangeSectionTable, useMasterStudentList } from '@/hooks/admission/preadmission/useSection';
import { useAdmissionClassDropdown } from '@/hooks/admission/preadmission/useTransactions';
import { masterDeleteStudentSectionSchema } from '@/schemas/admission/preadmission/section';
import { deleteSection } from '@/server/admission/preadmission/section/sections';
import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCw, Trash2 } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { masterDeleteStudentSectionColumns } from './_components/columns';

type FormFields = z.infer<typeof masterDeleteStudentSectionSchema>;

interface Student {
    asysT_Id: number;
    student_id: number;
    student_name: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    amsT_AdmNo: string;
    amaY_RollNo: number;
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterDeleteStudentSectionPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = use(props.searchParams);

    const [academicYearId, setAcademicYearId] = useState<number>(0);
    const [classId, setClassId] = useState<number>(0);
    const [sectionId, setSectionId] = useState<number>(0);
    const [showTable, setShowTable] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
    const [selectAll, setSelectAll] = useState(false);

    const { data: academicYear, isLoading: ayLoading } = useAcademicYearDropdown();

    const { data: masterClass, isLoading: preadmissionClassLoading, isError: preadmissionClassError } = useAdmissionClassDropdown();

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterDeleteStudentSectionSchema),
        defaultValues: {
            asmaY_Id: 0,
            classCategory: '',
            section: '',
            students: []
        },
        mode: 'onChange'
    });

    const { data: SectionData, isLoading: SectionLoading, isError: SectionError } = useMasterSectionHeld(classId);

    const {
        data: StudentListData,
        isLoading: StudentListLoading,
        isError: StudentListError
    } = useMasterStudentList(academicYearId, classId, sectionId);

    const {
        data: StudentsData,
        isLoading: StudentsLoading,
        isError: StudentsError
    } = useMasterChangeSectionTable(searchParams, academicYearId, classId, sectionId);

    const tableProps = useDataTableProps(StudentsData);

    const students = StudentListData?.data || [];

    useEffect(() => {
        if (students.length > 0) {
            setSelectAll(selectedStudents.size === students.length);
        }
    }, [selectedStudents, students]);

    const handleAcademicYearChange = (value: string) => {
        const numValue = Number(value);
        setAcademicYearId(numValue);
        setValue('asmaY_Id', numValue);

        setClassId(0);
        setSectionId(0);
        setShowTable(false);
        setValue('classCategory', '');
        setValue('section', '');
        setSelectedStudents(new Set());
        setSelectAll(false);
        clearErrors('asmaY_Id');
    };

    const handleClassChange = (value: string) => {
        const numValue = Number(value);
        setClassId(numValue);
        setValue('classCategory', value);

        setSectionId(0);
        setShowTable(false);
        setValue('section', '');
        setSelectedStudents(new Set());
        setSelectAll(false);
        clearErrors('classCategory');
    };

    const handleSectionChange = (value: string) => {
        const numValue = Number(value);
        setSectionId(numValue);
        setValue('section', value);
        setShowTable(true);
        setSelectedStudents(new Set());
        setSelectAll(false);
        clearErrors('section');
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        if (checked) {
            const allIds = new Set(students.map((s: Student) => s.asysT_Id));
            setSelectedStudents(allIds as any);
            clearErrors('students');
        } else {
            setSelectedStudents(new Set());
            clearErrors('students');
        }
    };

    const handleSelectStudent = (asysT_Id: number, checked: boolean) => {
        const newSelected = new Set(selectedStudents);
        if (checked) {
            newSelected.add(asysT_Id);
            clearErrors('students');
        } else {
            newSelected.delete(asysT_Id);
            clearErrors('students');
        }
        setSelectedStudents(newSelected);

        const studentsArray = Array.from(newSelected).map((id) => {
            const student = students.find((s: any) => s.asysT_Id === id);
            return {
                asysT_Id: id,
                amsT_Id: student?.student_id || 0,
                student_name: student?.student_name || ''
            };
        });
        setValue('students', studentsArray);
        clearErrors('students');
    };

    const onSubmit = async (data: FormFields) => {
        if (selectedStudents.size === 0) {
            toast.error('Please select at least one student to delete');
            return;
        }

        try {
            const studentsToDelete = Array.from(selectedStudents).map((asysT_Id) => {
                const student = students.find((s: any) => s.asysT_Id === asysT_Id);
                return {
                    asysT_Id: asysT_Id,
                    amsT_Id: student?.student_id || 0,
                    student_name: student?.student_name || ''
                };
            });

            const payload = {
                asmaY_Id: data.asmaY_Id,
                asmcL_Id: classId,
                asmS_Id: sectionId,
                students: studentsToDelete
            };

            const response = await deleteSection(payload);
            if (response.success) {
                toast.success(response.message || 'Delete section successfully!');
                handleReset();
            } else {
                toast.error(response.message);
            }

            setSelectedStudents(new Set());
            setSelectAll(false);
        } catch (_error: any) {
            toast.error('Failed to delete students');
        }
    };

    const handleReset = () => {
        reset({
            asmaY_Id: 0,
            classCategory: '',
            section: '',
            students: []
        });
        setAcademicYearId(0);
        setClassId(0);
        setSectionId(0);
        setShowTable(false);
        setSelectedStudents(new Set());
        setSelectAll(false);
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='container space-y-4 p-4'>
                <div className='space-y-4'>
                    <CollapsibleSection
                        title='Delete Student Section'
                        description='Select academic year, class, and section to delete students'
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <div className='space-y-6'>
                            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                                <div className='group flex flex-col gap-1.5'>
                                    <Label htmlFor='asmaY_Id'>
                                        Academic Year <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        name='asmaY_Id'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={handleAcademicYearChange}
                                                value={field.value > 0 ? field.value.toString() : ''}>
                                                <SelectTrigger className='w-full'>
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
                                    {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                                </div>

                                <div className='group flex flex-col gap-1.5'>
                                    <Label htmlFor='classCategory'>
                                        Class <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        name='classCategory'
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={handleClassChange} value={field.value} disabled={academicYearId === 0}>
                                                <SelectTrigger className='w-full'>
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
                                    {errors.classCategory && <FormError>{errors.classCategory.message}</FormError>}
                                </div>

                                <div className='group flex flex-col gap-1.5'>
                                    <Label htmlFor='section'>
                                        Section <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        name='section'
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={handleSectionChange} value={field.value} disabled={classId === 0}>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select Section' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SectionLoading ? (
                                                        <SelectItem value='loading' disabled>
                                                            Loading...
                                                        </SelectItem>
                                                    ) : SectionError ? (
                                                        <SelectItem value='error' disabled>
                                                            Error loading
                                                        </SelectItem>
                                                    ) : (
                                                        SectionData?.data?.map((opt: any) => (
                                                            <SelectItem key={opt.asmS_Id} value={opt.asmS_Id.toString()}>
                                                                {opt.asmC_SectionName}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.section && <FormError>{errors.section.message}</FormError>}
                                </div>
                            </div>
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                        title='Student List'
                        description='Select students and delete them from the section'
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <div className='space-y-4'>
                            <div className='overflow-x-auto rounded-lg border'>
                                <table className='w-full'>
                                    <thead className='border-b bg-gray-50'>
                                        <tr>
                                            <th className='p-3 text-left font-semibold'>SI. No</th>
                                            <th className='w-12 p-3 text-left font-semibold'>
                                                <Checkbox
                                                    checked={selectAll}
                                                    onCheckedChange={handleSelectAll}
                                                    className='h-4 w-4 cursor-pointer rounded border-gray-300'
                                                />
                                            </th>
                                            <th className='p-3 text-left font-semibold'>Student Name</th>
                                            <th className='p-3 text-left font-semibold'>Class</th>
                                            <th className='p-3 text-left font-semibold'>Section</th>
                                            <th className='p-3 text-left font-semibold'>Adm. No</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y'>
                                        {students.map((student: any, index: any) => (
                                            <tr key={student.asysT_Id} className='hover:bg-gray-50'>
                                                <td className='p-3'>{index + 1}</td>
                                                <td className='p-3'>
                                                    <Checkbox
                                                        checked={selectedStudents.has(student.asysT_Id)}
                                                        onCheckedChange={(checked) =>
                                                            handleSelectStudent(student.asysT_Id, checked as boolean)
                                                        }
                                                        className='h-4 w-4 cursor-pointer rounded border-gray-300'
                                                    />
                                                </td>
                                                <td className='p-3 font-medium'>{student.student_name}</td>
                                                <td className='p-3'>{student.asmcL_ClassName}</td>
                                                <td className='p-3'>{student.asmC_SectionName}</td>
                                                <td className='p-3'>{student.amsT_AdmNo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {StudentListLoading &&
                                    (StudentListError ? (
                                        <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                                            <RefreshCw className='h-8 w-8 animate-spin text-secondary' />
                                            <p className='text-muted-foreground text-sm'>Loading students...</p>
                                        </div>
                                    ) : (
                                        <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                                            <RefreshCw className='h-8 w-8 animate-spin text-secondary' />
                                            <p className='text-muted-foreground text-sm'>Loading students...</p>
                                        </div>
                                    ))}
                            </div>

                            {errors.students && <FormError>{errors.students.message}</FormError>}

                            <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleReset}
                                    disabled={isSubmitting}
                                    className='w-fit transition-all duration-200 hover:scale-105'>
                                    Reset
                                </Button>
                                <Button
                                    type='button'
                                    variant='destructive'
                                    onClick={handleSubmit(onSubmit)}
                                    // disabled={selectedStudents.size === 0 || isSubmitting}
                                    className='w-fit transition-all duration-200 hover:scale-105'
                                >
                                    <div className='flex items-center'>
                                        <Trash2 className='mr-2 h-4 w-4' />
                                        {isSubmitting ? 'Deleting...' : 'Delete'}
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </CollapsibleSection>
                    {showTable && (
                        <CollapsibleSection
                            title='Section Allotted Student List'
                            defaultOpen={true}
                            variant='default'
                            size='lg'
                            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                            <div className='space-y-4'>
                                <GenericDataTable<Student>
                                    {...tableProps}
                                    columns={masterDeleteStudentSectionColumns as any}
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
        </div>
    );
}

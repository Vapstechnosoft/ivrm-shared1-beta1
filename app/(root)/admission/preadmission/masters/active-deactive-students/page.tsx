'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useAcademicYearDropdown,
    useMasterClass,
    useMasterSectionDropdown,
    useMasterStudentList
} from '@/hooks/admission/preadmission/useMasters';
import { masterActiveDeactiveStudentSchema } from '@/schemas/admission/preadmission/masters';
import { ActiveDeactive } from '@/server/admission/preadmission/masters/active_deactive_student';
import type { ApiSearchparams } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { use, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { UpdateStudentStatusDialog } from './_components/active-deactive-student-update';
import { activedeactiveColumns } from './_components/columns';

type FormFields = z.infer<typeof masterActiveDeactiveStudentSchema>;

interface Student {
    amst_sol: string;
    amsT_SOL: number;
    student_id: number;
    student_name: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    amsT_AdmNo: string;
    amaY_RollNo: number;
    registration_no: string;
    admission_no: string;
}

interface StudentData {
    student_id: number;
    reason: string;
    remark: string;
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterActiveDeactiveStudentPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = use(props.searchParams);
    const tableRef = useRef<any>(null);

    const [academicYearId, setAcademicYearId] = useState<number>(0);
    const [amst_sol, setAmst_sol] = useState<string>('S');
    const [classId, setClassId] = useState<number>(0);
    const [sectionId, setSectionId] = useState<number>(0);
    const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
    const [studentData, setStudentData] = useState<Map<number, StudentData>>(new Map());
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

    const { data: academicYear, isLoading: ayLoading } = useAcademicYearDropdown();

    const { data: masterClass, isLoading: preadmissionClassLoading, isError: preadmissionClassError } = useMasterClass();

    const {
        control,
        reset,
        setValue,
        formState: { errors }
    } = useForm<FormFields>({
        resolver: zodResolver(masterActiveDeactiveStudentSchema),
        defaultValues: {
            amsT_SOL: 'S' as any,
            asmaY_Id: 0,
            asmcL_Id: 0,
            asmS_Id: 0,
            students: []
        },
        mode: 'onChange'
    });

    const { data: SectionData, isLoading: SectionLoading, isError: SectionError } = useMasterSectionDropdown();
    const apiSearchParams: ApiSearchparams | undefined = searchParams
        ? {
              page: Number(searchParams.page) || 1,
              page_size: Number(searchParams.page_size) || 10,
              sort_column: String(searchParams.sort_column || ''),
              sort_direction: String(searchParams.sort_direction || 'asc'),
              search_query: String(searchParams.search_query || ''),
              search_columns: String(searchParams.search_columns || '')
          }
        : undefined;

    const {
        data: StudentListData,
        isLoading: StudentListLoading,
        isError: StudentListError
    } = useMasterStudentList(amst_sol, academicYearId, classId, sectionId, apiSearchParams);

    const students = StudentListData?.data;

    const handleAcademicYearChange = (value: string) => {
        const numValue = Number(value);
        setAcademicYearId(numValue);
        setValue('asmaY_Id', numValue);

        setClassId(0);
        setSectionId(0);
        setValue('asmcL_Id', 0);
        setValue('asmS_Id', 0);
        setSelectedStudents(new Set());
        setStudentData(new Map());
    };

    const handleClassChange = (value: string) => {
        const numValue = Number(value);
        setClassId(numValue);
        setValue('asmcL_Id', numValue);

        setSectionId(0);
        setValue('asmS_Id', 0);
        setSelectedStudents(new Set());
        setStudentData(new Map());
    };

    const handleSectionChange = (value: string) => {
        const numValue = Number(value);
        setSectionId(numValue);
        setValue('asmS_Id', numValue);
        setSelectedStudents(new Set());
        setStudentData(new Map());
    };

    const handleStatus = (value: string) => {
        setAmst_sol(value);
        setValue('amsT_SOL', value as any);
    };

    const handleSelectStudent = (selectedRows: Student[]) => {
        const selectedIds = new Set(selectedRows.map((student) => student.student_id));

        setSelectedStudents(selectedIds);

        // Update form students array
        const studentsArray = selectedRows.map((student) => {
            const sd = studentData.get(student.student_id) || {
                student_id: student.student_id,
                reason: '',
                remark: ''
            };
            return {
                amsT_Id: student.student_id,
                reason: sd.reason || '',
                remarks: sd.remark || ''
            };
        });
        setValue('students', studentsArray as any);
    };

    const tableProps = {
        data: students,
        enableRowSelection: true,
        getRowId: (row: Student) => row.student_id.toString()
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='container space-y-4 p-4'>
                <div className='space-y-4'>
                    <CollapsibleSection
                        title='Active Deactive Students'
                        description='Select academic year, class, and section students'
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <div className='space-y-6'>
                            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                                <div className='group flex flex-col gap-1.5'>
                                    <Label>
                                        Student Status <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <RadioGroup onValueChange={handleStatus} value={amst_sol} className='flex items-center gap-6'>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='S' id='active_students' />
                                            <Label htmlFor='active_students' className='cursor-pointer font-normal'>
                                                Active Students
                                            </Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='D' id='deactive_students' />
                                            <Label htmlFor='deactive_students' className='cursor-pointer font-normal'>
                                                Deactive Students
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
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
                                    <Label htmlFor='asmcL_Id'>
                                        Class <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        name='asmcL_Id'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={handleClassChange}
                                                value={field.value > 0 ? field.value.toString() : ''}
                                                disabled={academicYearId === 0}>
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
                                    {errors.asmcL_Id && <FormError>{errors.asmcL_Id.message}</FormError>}
                                </div>

                                <div className='group flex flex-col gap-1.5'>
                                    <Label htmlFor='asmS_Id'>
                                        Section <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        name='asmS_Id'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={handleSectionChange}
                                                value={field.value > 0 ? field.value.toString() : ''}
                                                disabled={classId === 0}>
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
                                    {errors.asmS_Id && <FormError>{errors.asmS_Id.message}</FormError>}
                                </div>
                            </div>
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                        title='Student List'
                        description='Select students to activate/deactivate'
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        {selectedStudents.size > 0 && (
                            <div className='mb-3 flex justify-end'>
                                <Button onClick={() => setIsUpdateDialogOpen(true)} className='w-fit'>
                                    Update Selected ({selectedStudents.size})
                                </Button>
                            </div>
                        )}
                        <div className='space-y-4'>
                            <GenericDataTable<Student>
                                {...tableProps}
                                ref={tableRef}
                                columns={activedeactiveColumns}
                                isLoading={StudentListLoading}
                                error={StudentListError ? new Error('Failed to load students') : null}
                                showViewOptions={false}
                                loadingMessage='Loading students...'
                                noDataTitle='No Students Found'
                                noDataDescription='Try adjusting your filters.'
                                onRowSelectionChange={handleSelectStudent}
                            />
                            <UpdateStudentStatusDialog
                                isOpen={isUpdateDialogOpen}
                                onClose={() => setIsUpdateDialogOpen(false)}
                                selectedStudents={Array.from(selectedStudents)
                                    .map((id) => students.find((s: Student) => s.student_id === id))
                                    .filter(Boolean)}
                                amsT_SOL={amst_sol}
                                asmaY_Id={academicYearId}
                                asmcL_Id={classId}
                                asmS_Id={sectionId}
                                onSubmit={async (updates) => {
                                    // Your API call here

                                    try {
                                        const response = await ActiveDeactive(updates);
                                        if (response.success) {
                                            toast.success(response.message || 'Students updated successfully!');
                                        } else {
                                            toast.error(response.message || 'Failed to update students');
                                        }
                                    } catch (error: any) {
                                        toast.error(error.message || 'Failed to update students');
                                    }
                                    setIsUpdateDialogOpen(false);
                                    setSelectedStudents(new Set());
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            </div>
        </div>
    );
}

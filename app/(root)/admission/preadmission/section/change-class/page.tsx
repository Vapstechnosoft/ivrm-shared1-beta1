'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAcademicYearDropdown, useMasterSectionHeld } from '@/hooks/admission/preadmission/useMasters';
import { useMasterChangeClassStudents } from '@/hooks/admission/preadmission/useSection';
import { useAdmissionClassDropdown } from '@/hooks/admission/preadmission/useTransactions';
import { masterChangeClassSchema } from '@/schemas/admission/preadmission/section';
import { addChangeClass, getMasterChangeClassStudentDetails } from '@/server/admission/preadmission/section/sections';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterChangeClassSchema.add>;

interface FeeStructureRow {
    id: number;
    className: string;
    feeCategory: string;
    asmcL_Id: number;
    feeDeleteFlag: number;
}

interface StudentDetails {
    name: string;
    admissionNo: string;
    currentClass: string;
    currentSection: string;
    rollNo: string;
    asysT_Id: number;
    studentAttendanceCount: number;
    studentExamCount: number;
    attendanceDone: boolean;
    examMarksDone: boolean;
}

export default function MasterChangeClassPage() {
    const [academicYearId, setAcademicYearId] = useState<number>(0);
    const [oldClassId, setOldClassId] = useState<number>();
    const [sectionId, setSectionId] = useState<number>();
    const [newClassId, setNewClassId] = useState<number>();
    const [studentId, setStudentId] = useState<number>();
    const [showDetails, setShowDetails] = useState(false);
    const [feeStructure, setFeeStructure] = useState<FeeStructureRow[]>([]);
    const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const { data: academicYear, isLoading: ayLoading } = useAcademicYearDropdown();

    const { data: masterClass, isLoading: preadmissionClassLoading, isError: preadmissionClassError } = useAdmissionClassDropdown();

    const { data: SectionData, isLoading: SectionLoading, isError: SectionError } = useMasterSectionHeld(Number(oldClassId));

    const {
        data: StudentsData,
        isLoading: StudentsLoading,
        isError: StudentsError
    } = useMasterChangeClassStudents(Number(academicYearId), Number(oldClassId), Number(sectionId));

    useEffect(() => {
        const fetchStudentDetails = async () => {
            if (studentId && academicYearId && oldClassId && sectionId && newClassId) {
                setIsLoadingDetails(true);
                try {
                    const payload = {
                        amsT_Id: Number(studentId),
                        presenT_ASMAY_Id: Number(academicYearId),
                        presenT_ASMCL_Id: Number(oldClassId),
                        presenT_ASMS_Id: Number(sectionId),
                        changE_ASMCL_Id: Number(newClassId)
                    };

                    const response = await getMasterChangeClassStudentDetails(payload);

                    if (response?.success && response?.data) {
                        const {
                            student_details,
                            fee_category_details,
                            student_attendance_count,
                            student_exam_count,
                            attendance_done,
                            exam_marks_done
                        } = response.data;

                        setStudentDetails({
                            name: student_details.studentName,
                            admissionNo: student_details.amsT_AdmNo,
                            currentClass: student_details.asmcL_ClassName,
                            currentSection: student_details.asmC_SectionName,
                            rollNo: student_details.amaY_RollNo.toString(),
                            asysT_Id: student_details.asysT_Id,
                            studentAttendanceCount: student_attendance_count,
                            studentExamCount: student_exam_count,
                            attendanceDone: attendance_done,
                            examMarksDone: exam_marks_done
                        });

                        const feeStructureData: FeeStructureRow[] = fee_category_details.map((fee: any, index: number) => ({
                            id: index + 1,
                            className: fee.asmcL_ClassName,
                            feeCategory: fee.fmcC_ClassCategoryName,
                            asmcL_Id: fee.asmcL_Id,
                            feeDeleteFlag: fee.feeDeleteFlag
                        }));
                        setFeeStructure(feeStructureData);
                        setShowDetails(true);
                    }
                } catch (error) {
                    console.error('Error fetching student details:', error);
                    toast.error('Failed to fetch student details');
                    setShowDetails(false);
                    setStudentDetails(null);
                    setFeeStructure([]);
                } finally {
                    setIsLoadingDetails(false);
                }
            }
        };

        fetchStudentDetails();
    }, [studentId]);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterChangeClassSchema.add),
        defaultValues: {
            asmaY_Id: 0,
            oldClass: '',
            section: '',
            newClass: '',
            studentId: '',
            remarks: '',
            feeStructure: []
        },
        mode: 'onChange'
    });

    useEffect(() => {
        setValue('feeStructure', feeStructure, { shouldValidate: true });
    }, [feeStructure, setValue]);

    const handleDeleteFeeRow = (id: number) => {
        setFeeStructure((prev) => prev.filter((row) => row.id !== id));
    };

    const onSubmit = async (data: FormFields) => {
        try {
            if (!studentDetails) {
                toast.error('Student details not available');
                return;
            }

            const payload = {
                asysT_Id: studentDetails.asysT_Id,
                olD_ASMCL_Id: Number(oldClassId),
                neW_ASMCL_Id: Number(newClassId),
                remarks: data.remarks
            };

            const response = await addChangeClass(payload);
            if (response.success) {
                toast.success(response.message || 'Class change saved successfully!');
                reset();
                handleReset();
            } else {
                toast.error(response.message);
            }
        } catch (_error: any) {
            // Igonre
        }
    };

    const handleReset = () => {
        reset({
            asmaY_Id: 0,
            oldClass: '',
            section: '',
            newClass: '',
            studentId: '',
            remarks: '',
            feeStructure: []
        });
        setAcademicYearId(0);
        setOldClassId(undefined);
        setSectionId(undefined);
        setNewClassId(undefined);
        setStudentId(undefined);
        setShowDetails(false);
        setFeeStructure([]);
        setStudentDetails(null);
    };

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <CollapsibleSection
                        title='Change Class'
                        description='Change student class information'
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <div className='space-y-6'>
                            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                                <div className='space-y-4'>
                                    <div className='flex flex-col gap-1.5'>
                                        <Label htmlFor='asmaY_Id'>
                                            Academic Year <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='asmaY_Id'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={(value) => {
                                                        const numValue = Number(value);
                                                        field.onChange(numValue);
                                                        setAcademicYearId(numValue);
                                                        setOldClassId(undefined);
                                                        setSectionId(undefined);
                                                        setNewClassId(undefined);
                                                        setStudentId(undefined);
                                                        setValue('oldClass', '');
                                                        setValue('section', '');
                                                        setValue('newClass', '');
                                                        setValue('studentId', '');
                                                        setShowDetails(false);
                                                        setStudentDetails(null);
                                                        setFeeStructure([]);
                                                    }}
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

                                    <div className='flex flex-col gap-1.5'>
                                        <Label htmlFor='oldClass'>
                                            Old Class <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='oldClass'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        setOldClassId(Number(value));
                                                        setSectionId(undefined);
                                                        setStudentId(undefined);
                                                        setValue('section', '');
                                                        setValue('studentId', '');
                                                        setShowDetails(false);
                                                        setStudentDetails(null);
                                                        setFeeStructure([]);
                                                    }}
                                                    value={field.value}
                                                    disabled={!academicYearId}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select Old Class' />
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
                                        {errors.oldClass && <FormError>{errors.oldClass.message}</FormError>}
                                    </div>

                                    <div className='flex flex-col gap-1.5'>
                                        <Label htmlFor='section'>
                                            Section <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='section'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        setSectionId(Number(value));
                                                        setStudentId(undefined);
                                                        setValue('studentId', '');
                                                        setShowDetails(false);
                                                        setStudentDetails(null);
                                                        setFeeStructure([]);
                                                    }}
                                                    value={field.value}
                                                    disabled={!oldClassId}>
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

                                <div className='space-y-4'>
                                    <div className='flex flex-col gap-1.5'>
                                        <Label htmlFor='newClass'>
                                            New Class <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='newClass'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        setNewClassId(Number(value));
                                                        setShowDetails(false);
                                                        setStudentDetails(null);
                                                        setFeeStructure([]);
                                                    }}
                                                    value={field.value}
                                                    disabled={!sectionId}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select New Class' />
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
                                                            masterClass?.data
                                                                ?.filter((item) => item.asmcL_Id !== Number(oldClassId))
                                                                ?.map((item) => (
                                                                    <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                                        {item.asmcL_ClassName}
                                                                    </SelectItem>
                                                                ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.newClass && <FormError>{errors.newClass.message}</FormError>}
                                    </div>

                                    <div className='flex flex-col gap-1.5'>
                                        <Label htmlFor='studentId'>
                                            Student <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='studentId'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        setStudentId(Number(value));
                                                    }}
                                                    value={field.value}
                                                    disabled={!newClassId}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select Student' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {StudentsLoading ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : StudentsError ? (
                                                            <SelectItem value='error' disabled>
                                                                Error loading students
                                                            </SelectItem>
                                                        ) : StudentsData?.data && StudentsData.data.length > 0 ? (
                                                            StudentsData.data.map((student: any) => (
                                                                <SelectItem key={student.student_id} value={student.student_id.toString()}>
                                                                    {student.student_name} - {student.amsT_AdmNo}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem value='no-students' disabled>
                                                                No students available
                                                            </SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.studentId && <FormError>{errors.studentId.message}</FormError>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CollapsibleSection>

                    {isLoadingDetails && (
                        <div className='flex justify-center py-8'>
                            <p className='text-muted-foreground'>Loading student details...</p>
                        </div>
                    )}

                    {showDetails && studentDetails && !isLoadingDetails && (
                        <CollapsibleSection
                            title='Student Details'
                            description='View student information and fee structure'
                            defaultOpen={true}
                            variant='default'
                            size='lg'
                            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                            <div className='space-y-6'>
                                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                                    {/* Left Side - Student Details */}
                                    <div className='space-y-4'>
                                        <div className='flex flex-col gap-1.5'>
                                            <Label>Student Name:</Label>
                                            <Input value={studentDetails.name} disabled className='bg-muted' />
                                        </div>
                                        <div className='flex flex-col gap-1.5'>
                                            <Label>Admission No.:</Label>
                                            <Input value={studentDetails.admissionNo} disabled className='bg-muted' />
                                        </div>
                                        <div className='flex flex-col gap-1.5'>
                                            <Label>Current Class:</Label>
                                            <Input value={studentDetails.currentClass} disabled className='bg-muted' />
                                        </div>
                                        <div className='flex flex-col gap-1.5'>
                                            <Label>Current Section:</Label>
                                            <Input value={studentDetails.currentSection} disabled className='bg-muted' />
                                        </div>
                                        <div className='flex flex-col gap-1.5'>
                                            <Label>Roll No.:</Label>
                                            <Input value={studentDetails.rollNo} disabled className='bg-muted' />
                                        </div>

                                        {/* Additional Info */}
                                        <div className='mt-4 space-y-2 rounded-lg border bg-muted/30 p-4'>
                                            <div className='flex justify-between text-sm'>
                                                <span className='font-medium'>Attendance Count:</span>
                                                <span>{studentDetails.studentAttendanceCount}</span>
                                            </div>
                                            <div className='flex justify-between text-sm'>
                                                <span className='font-medium'>Exam Count:</span>
                                                <span>{studentDetails.studentExamCount}</span>
                                            </div>
                                            <div className='flex justify-between text-sm'>
                                                <span className='font-medium'>Attendance Done:</span>
                                                <span className={studentDetails.attendanceDone ? 'text-green-600' : 'text-red-600'}>
                                                    {studentDetails.attendanceDone ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                            <div className='flex justify-between text-sm'>
                                                <span className='font-medium'>Exam Marks Done:</span>
                                                <span className={studentDetails.examMarksDone ? 'text-green-600' : 'text-red-600'}>
                                                    {studentDetails.examMarksDone ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='space-y-4'>
                                        <div>
                                            <Label className='font-semibold text-base'>Fee Structure:</Label>
                                        </div>
                                        <div className='overflow-x-auto rounded-lg border'>
                                            <table className='w-full'>
                                                <thead>
                                                    <tr className='border-b bg-muted/50'>
                                                        <th className='p-2 text-left font-medium text-sm'>SI.No</th>
                                                        <th className='p-2 text-left font-medium text-sm'>Class Name</th>
                                                        <th className='p-2 text-left font-medium text-sm'>Fee Category</th>
                                                        <th className='p-2 text-center font-medium text-sm'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {feeStructure.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={4} className='p-4 text-center text-muted-foreground'>
                                                                No fee structure available for selected class combination.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        feeStructure.map((row, index) => (
                                                            <tr key={row.id} className='border-b hover:bg-muted/30'>
                                                                <td className='p-2 text-sm'>{index + 1}</td>
                                                                <td className='p-2 text-sm'>{row.className}</td>
                                                                <td className='p-2 text-sm'>{row.feeCategory}</td>
                                                                <td className='p-2 text-center'>
                                                                    <Button
                                                                        type='button'
                                                                        variant='ghost'
                                                                        size='sm'
                                                                        onClick={() => handleDeleteFeeRow(row.id)}
                                                                        className='text-red-500 hover:bg-red-50 hover:text-red-700'>
                                                                        <Trash2 className='h-4 w-4' />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className='flex flex-col gap-1.5'>
                                            <Label htmlFor='remarks'>
                                                Remarks <span className='text-red-500'>*</span>
                                            </Label>
                                            <Controller
                                                name='remarks'
                                                control={control}
                                                render={({ field }) => (
                                                    <Textarea {...field} placeholder='Enter remarks...' className='min-h-[80px]' />
                                                )}
                                            />
                                            {errors.remarks && <FormError>{errors.remarks.message}</FormError>}
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        onClick={handleReset}
                                        disabled={isSubmitting}
                                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                                        Reset
                                    </Button>
                                    <Button
                                        type='submit'
                                        disabled={isSubmitting}
                                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'>
                                        <div className='flex items-center'>
                                            <Save className='mr-2 h-4 w-4' />
                                            {isSubmitting ? 'Saving...' : 'Save'}
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </CollapsibleSection>
                    )}
                </form>
            </div>
        </div>
    );
}

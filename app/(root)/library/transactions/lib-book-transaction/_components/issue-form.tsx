'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useAvailableBooks,
    useBookIssueInitialData,
    useCalculateDueDate,
    useIssueBook,
    useStaffDetails,
    useStudentDetails
} from '@/hooks/library/useBookIssue';
import type { MemberType } from '@/types/library/transactions/book-transaction';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Loader2, User, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const issueFormSchema = z.object({
    memberType: z.enum(['std', 'stf', 'dep', 'gst']),

    // IDs
    ASMAY_Id: z.coerce.number().optional(),
    ASMCL_Id: z.coerce.number().optional(),
    ASMS_Id: z.coerce.number().optional(),
    AMST_Id: z.coerce.number().optional(),

    HRMD_Id: z.coerce.number().optional(),
    HRMDES_Id: z.coerce.number().optional(),
    HRME_Id: z.coerce.number().optional(),

    // Book
    LMB_Id: z.coerce.number().min(1, 'Book is required'),
    LMBANO_Id: z.coerce.number().min(1, 'Book is required'),

    // Dates
    issueDate: z.string().min(1, 'Issue Date is required'),
    dueDate: z.string().min(1, 'Due Date is required'),
    returnDate: z.string().optional(), // For logic, usually same as issue date initially or due date?

    // Guest
    LBTR_GuestName: z.string().optional(),
    LBTR_GuestContactNo: z.string().optional(),
    LBTR_GuestEmailId: z.string().email().optional()
});

type IssueFormValues = z.infer<typeof issueFormSchema>;

interface IssueFormProps {
    onSuccess: () => void;
}

export const IssueForm = ({ onSuccess }: IssueFormProps) => {
    const [memberType, setMemberType] = useState<MemberType>('std');
    const [availableBooks, setAvailableBooks] = useState<any[]>([]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<IssueFormValues>({
        resolver: zodResolver(issueFormSchema),
        defaultValues: {
            memberType: 'std',
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date().toISOString().split('T')[0]
        }
    });

    // Hooks
    const { data: initialData } = useBookIssueInitialData({
        booktype: 'issue',
        issuertype: memberType,
        bookcat_type: 'book'
    });

    const studentDetailsMutation = useStudentDetails();
    const staffDetailsMutation = useStaffDetails();
    const issueBookMutation = useIssueBook();
    const availableBooksMutation = useAvailableBooks();
    const calculateDueDateMutation = useCalculateDueDate();

    const watchMemberType = watch('memberType');
    const watchYear = watch('ASMAY_Id');
    const watchClass = watch('ASMCL_Id');
    const watchSection = watch('ASMS_Id');
    const watchStudent = watch('AMST_Id');
    const watchStaff = watch('HRME_Id');
    const watchIssueDate = watch('issueDate');

    // Sync member type
    useEffect(() => {
        setMemberType(watchMemberType);
        setValue('AMST_Id', undefined);
        setValue('HRME_Id', undefined);
        setValue('HRMD_Id', undefined);
    }, [watchMemberType, setValue]);

    // Fetch Student Details
    useEffect(() => {
        if (memberType === 'std' && watchStudent && watchYear) {
            studentDetailsMutation.mutate({
                AMST_Id: watchStudent,
                ASMAY_Id: watchYear,
                booktype: 'issue',
                issuertype: 'std',
                bookcat_type: 'book'
            });
            // Also load available books if needed, or maybe load them generally?
            loadBooks();
        }
    }, [watchStudent, memberType]);

    // Fetch Staff Details
    useEffect(() => {
        if (memberType === 'stf' && watchStaff) {
            staffDetailsMutation.mutate({
                HRME_Id: watchStaff,
                booktype: 'issue',
                issuertype: 'stf',
                bookcat_type: 'book'
            });
            loadBooks();
        }
    }, [watchStaff, memberType]);

    const loadBooks = () => {
        availableBooksMutation.mutate(
            {
                // Pass necessary params to filter available books if needed
            },
            {
                // onSuccess: (data) => {
                //     setAvailableBooks(data.avilbooktitle || []);
                // }
            }
        );
    };

    // Load books on mount or when logical for general availability
    useEffect(() => {
        loadBooks();
    }, []);

    // Calculate Due Date
    useEffect(() => {
        if (watchIssueDate) {
            // Logic to calculate due date.
            // Typically depends on student/staff policy fetched in studentDetailsMutation/staffDetailsMutation
            // For now, we can calculate based on default days or call server
            // Assuming default 7 days if not configured
            const date = new Date(watchIssueDate);
            date.setDate(date.getDate() + 7);
            setValue('dueDate', date.toISOString().split('T')[0]);
        }
    }, [watchIssueDate]);

    const onSubmit = async (data: IssueFormValues) => {
        const payload = {
            ...data,
            booktype: 'issue' as const,
            issuertype: data.memberType,
            bookcat_type: 'book' as const,
            Issue_Date: data.issueDate,
            Due_Date: data.dueDate,
            Return_Date: data.issueDate, // Required by type but not relevant for issue? Or acts as transaction date
            LMBANO_Id: data.LMBANO_Id,
            LMB_Id: data.LMB_Id,
            AMST_Id: data.AMST_Id || 0,
            HRME_Id: data.HRME_Id || 0,
            HRMD_Id: data.HRMD_Id || 0,
            ASMAY_Id: data.ASMAY_Id || 0,
            ASMCL_Id: data.ASMCL_Id || 0,
            ASMS_Id: data.ASMS_Id || 0
        };

        //     issueBookMutation.mutate(payload, {
        //         onSuccess: () => {
        //             reset();
        //             onSuccess();
        //         }
        //     });
        // };

        return (
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Member Type Selection similar to ReturnForm */}
                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg'>Member Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={memberType}
                            onValueChange={(value) => setValue('memberType', value as MemberType)}
                            className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                            <div className='flex cursor-pointer items-center space-x-2 rounded-lg border p-3 hover:bg-accent/50'>
                                <RadioGroupItem value='std' id='std_i' />
                                <Label htmlFor='std_i' className='flex cursor-pointer items-center gap-2'>
                                    <User className='h-4 w-4' /> Student
                                </Label>
                            </div>
                            <div className='flex cursor-pointer items-center space-x-2 rounded-lg border p-3 hover:bg-accent/50'>
                                <RadioGroupItem value='stf' id='stf_i' />
                                <Label htmlFor='stf_i' className='flex cursor-pointer items-center gap-2'>
                                    <User className='h-4 w-4' /> Staff
                                </Label>
                            </div>
                            <div className='flex cursor-pointer items-center space-x-2 rounded-lg border p-3 hover:bg-accent/50'>
                                <RadioGroupItem value='dep' id='dep_i' />
                                <Label htmlFor='dep_i' className='flex cursor-pointer items-center gap-2'>
                                    <Building2 className='h-4 w-4' /> Department
                                </Label>
                            </div>
                            <div className='flex cursor-pointer items-center space-x-2 rounded-lg border p-3 hover:bg-accent/50'>
                                <RadioGroupItem value='gst' id='gst_i' />
                                <Label htmlFor='gst_i' className='flex cursor-pointer items-center gap-2'>
                                    <UserPlus className='h-4 w-4' /> Guest
                                </Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* Member Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg'>Member Details</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        {memberType === 'std' && (
                            <>
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                    <div>
                                        <Label>Academic Year</Label>
                                        <Select onValueChange={(v) => setValue('ASMAY_Id', Number(v))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Year' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.isArray(initialData?.yearlist) &&
                                                    initialData?.yearlist?.map((item) => (
                                                        <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                            {item.asmaY_Year}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* Add Class/Section logic similar to ReturnForm if needed, or assume simple layout */}
                                    <div>
                                        <Label>Class</Label>
                                        <Select onValueChange={(v) => setValue('ASMCL_Id', Number(v))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Class' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.isArray(initialData?.classlist) &&
                                                    initialData?.classlist?.map((item) => (
                                                        <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                            {item.asmcL_ClassName}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Section</Label>
                                        <Select onValueChange={(v) => setValue('ASMS_Id', Number(v))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Section' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.isArray(initialData?.sectionlist) &&
                                                    initialData?.sectionlist?.map((item) => (
                                                        <SelectItem key={item.asmS_Id} value={item.asmS_Id.toString()}>
                                                            {item.asmC_SectionName}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label>Student</Label>
                                    <Select onValueChange={(v) => setValue('AMST_Id', Number(v))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Student' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.isArray(initialData?.studentlist) &&
                                                initialData?.studentlist?.map((item) => (
                                                    <SelectItem key={item.amsT_Id} value={item.amsT_Id.toString()}>
                                                        {item.amsT_FirstName} ({item.amsT_AdmNo})
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}

                        {memberType === 'stf' && (
                            <>
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                    <div>
                                        <Label>Department</Label>
                                        <Select onValueChange={(v) => setValue('HRMD_Id', Number(v))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Dept' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.isArray(initialData?.departmentlist) &&
                                                    initialData?.departmentlist?.map((item) => (
                                                        <SelectItem key={item.hrmD_Id} value={item.hrmD_Id.toString()}>
                                                            {item.hrmD_DepartmentName}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Designation</Label>
                                        <Select onValueChange={(v) => setValue('HRMDES_Id', Number(v))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Desg' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.isArray(initialData?.filldesignation) &&
                                                    initialData?.filldesignation?.map((item) => (
                                                        <SelectItem key={item.hrmdeS_Id} value={item.hrmdeS_Id.toString()}>
                                                            {item.hrmdeS_DesignationName}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label>Staff</Label>
                                    <Select onValueChange={(v) => setValue('HRME_Id', Number(v))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Staff' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.isArray(initialData?.stafftlist) &&
                                                initialData?.stafftlist?.map((item) => (
                                                    <SelectItem key={item.hrmE_Id} value={item.hrmE_Id.toString()}>
                                                        {item.hrmE_EmployeeFirstName}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Book Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg'>Book Details</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div>
                            <Label>Book</Label>
                            <Select
                                onValueChange={(v) => {
                                    const book = availableBooks.find((b) => b.lmB_Id.toString() === v);
                                    if (book) {
                                        setValue('LMB_Id', book.lmB_Id);
                                        setValue('LMBANO_Id', book.lmbanO_Id);
                                    }
                                }}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Available Book' />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableBooks.map((book) => (
                                        <SelectItem key={`${book.lmB_Id}-${book.lmbanO_Id}`} value={book.lmB_Id.toString()}>
                                            {book.lmB_BookTitle} ({book.lmbanO_AccessionNo})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Dates */}
                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg'>Dates</CardTitle>
                    </CardHeader>
                    <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText label='Issue Date' type='date' {...register('issueDate')} />
                        <InputText label='Due Date' type='date' {...register('dueDate')} />
                    </CardContent>
                </Card>

                <div className='flex justify-end gap-2'>
                    <Button type='button' variant='outline' onClick={() => reset()}>
                        Reset
                    </Button>
                    <Button type='submit' disabled={isSubmitting || issueBookMutation.isPending}>
                        {issueBookMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        Issue Book
                    </Button>
                </div>
            </form>
        );
    };
};

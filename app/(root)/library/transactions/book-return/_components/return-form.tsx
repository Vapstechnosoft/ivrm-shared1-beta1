'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useBarcodeSearch,
    useBookReturnInitialData,
    useLostBook,
    useRenewBook,
    useReturnBook,
    useStaffDetails,
    useStudentDetails
} from '@/hooks/library/useBookReturn';
import type { BookType, MemberType } from '@/types/library/transactions/book-transaction';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Loader2, User, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { LostBookModal } from './lost-book-modal';

// Schema matching API payload structure where possible
const returnFormSchema = z.object({
    memberType: z.enum(['std', 'stf', 'dep', 'gst']),
    bookType: z.enum(['issue', 'ref']),
    bookCategory: z.enum(['book', 'nonbook']),
    barcode: z.string().optional(),

    // IDs for selections
    ASMAY_Id: z.coerce.number().optional(), // Academic Year
    ASMCL_Id: z.coerce.number().optional(), // Class
    ASMS_Id: z.coerce.number().optional(), // Section
    AMST_Id: z.coerce.number().optional(), // Student

    HRMD_Id: z.coerce.number().optional(), // Department
    HRMDES_Id: z.coerce.number().optional(), // Designation
    HRME_Id: z.coerce.number().optional(), // Staff

    // Guest
    LBTR_GuestName: z.string().optional(),
    LBTR_GuestContactNo: z.string().optional(),
    LBTR_GuestEmailId: z.string().email().optional(),

    // Book Transaction
    LMB_Id: z.coerce.number().optional(),
    LMBANO_Id: z.coerce.number().optional(),
    Book_Trans_Id: z.coerce.number().optional(),

    // Dates
    issueDate: z.string().optional(),
    returnDate: z.string().optional(),
    dueDate: z.string().optional(),

    // Fine
    fineAmount: z.coerce.number().default(0),
    fineCollected: z.coerce.number().default(0)
});

type ReturnFormValues = z.infer<typeof returnFormSchema>;

interface ReturnFormProps {
    onSuccess: () => void;
}

export const ReturnForm = ({ onSuccess }: ReturnFormProps) => {
    const [memberType, setMemberType] = useState<MemberType>('std');
    const [bookType, setBookType] = useState<BookType>('issue');
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [isLostBookModalOpen, setIsLostBookModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ReturnFormValues>({
        resolver: zodResolver(returnFormSchema),
        defaultValues: {
            memberType: 'std',
            bookType: 'issue',
            bookCategory: 'book',
            fineAmount: 0,
            fineCollected: 0,
            returnDate: new Date().toISOString().split('T')[0]
        }
    });

    // Hooks for data
    const { data: initialData, isLoading: isInitialLoading } = useBookReturnInitialData({
        booktype: bookType,
        issuertype: memberType,
        bookcat_type: 'book'
    });

    const studentDetailsMutation = useStudentDetails();
    const staffDetailsMutation = useStaffDetails();
    const returnBookMutation = useReturnBook();
    const renewBookMutation = useRenewBook();
    const lostBookMutation = useLostBook();
    const barcodeMutation = useBarcodeSearch();

    const watchMemberType = watch('memberType');
    const watchBookType = watch('bookType');
    const watchYear = watch('ASMAY_Id');
    const watchClass = watch('ASMCL_Id');
    const watchSection = watch('ASMS_Id');
    const watchDept = watch('HRMD_Id');
    const watchDesg = watch('HRMDES_Id');
    const watchStudent = watch('AMST_Id');
    const watchStaff = watch('HRME_Id');

    // Sync state with form
    useEffect(() => {
        setMemberType(watchMemberType);
        // Reset dependent fields when type changes
        setValue('AMST_Id', undefined);
        setValue('HRME_Id', undefined);
        setValue('HRMD_Id', undefined);
        setSelectedBook(null);
    }, [watchMemberType, setValue]);

    useEffect(() => {
        setBookType(watchBookType);
    }, [watchBookType]);

    // Fetch Student Details when selections change
    useEffect(() => {
        if (memberType === 'std' && watchStudent) {
            studentDetailsMutation.mutate({
                AMST_Id: watchStudent,
                ASMAY_Id: watchYear,
                booktype: bookType,
                issuertype: 'std',
                bookcat_type: 'book'
            });
        }
    }, [watchStudent, memberType]);

    // Fetch Staff Details
    useEffect(() => {
        if (memberType === 'stf' && watchStaff) {
            staffDetailsMutation.mutate({
                HRME_Id: watchStaff,
                booktype: bookType,
                issuertype: 'stf',
                bookcat_type: 'book'
            });
        }
    }, [watchStaff, memberType]);

    // Derived book list based on member type
    const issuedBooks = (
        memberType === 'std' ? studentDetailsMutation.data?.alldata : memberType === 'stf' ? staffDetailsMutation.data?.alldata : []
    ) as any[]; // TODO: Handle Guest/Dept if needed

    // Update book selection logic
    const handleBookSelect = (bookId: string) => {
        const book = issuedBooks?.find((b: any) => b.lmB_Id.toString() === bookId);

        if (book) {
            setSelectedBook(book);
            setValue('LMB_Id', book.lmB_Id);
            setValue('LMBANO_Id', book.lmbanO_Id);
            setValue('Book_Trans_Id', book.book_Trans_Id);

            // Set dates
            if (book.issue_Date) setValue('issueDate', book.issue_Date.split('T')[0]);
            if (book.due_Date) setValue('dueDate', book.due_Date.split('T')[0]);

            // Set Fine if available (or calculate)
            if (book.fine_Amount) setValue('fineAmount', book.fine_Amount);

            // Calculate late days/fine logic here if needed
        }
    };

    const onSubmit = async (data: ReturnFormValues) => {
        if (!data.Book_Trans_Id || !data.LMBANO_Id || !data.LMB_Id) {
            toast.error('Please select a valid transaction/book first');
            return;
        }

        const payload = {
            Book_Trans_Id: data.Book_Trans_Id,
            LMBANO_Id: data.LMBANO_Id,
            LMB_Id: data.LMB_Id,
            Due_Date: data.dueDate || '',
            Return_Date: data.returnDate || new Date().toISOString(),
            booktype: data.bookType,
            issuertype: data.memberType,
            bookcat_type: 'book' as const,
            LBTR_FineCollected: data.fineCollected
        };

        //     returnBookMutation.mutate(payload, {
        //         onSuccess: () => {
        //             reset();
        //             onSuccess();
        //         }
        //     });
        // };

        const handleRenewal = () => {
            const data = watch();
            if (!data.Book_Trans_Id || !data.LMBANO_Id || !data.LMB_Id) {
                toast.error('Please select a valid transaction/book first');
                return;
            }

            const payload = {
                Book_Trans_Id: data.Book_Trans_Id,
                LMBANO_Id: data.LMBANO_Id,
                LMB_Id: data.LMB_Id,
                Issue_Date: data.issueDate || '',
                Due_Date: data.dueDate || '',
                Return_Date: data.returnDate || new Date().toISOString(),
                Max_No_Renewals: 3, // Default or fetch from config
                issuertype: data.memberType,
                bookcat_type: 'book' as const,
                LBTR_FineCollected: data.fineCollected
            };

            renewBookMutation.mutate(payload, {
                onSuccess: () => {
                    reset();
                    onSuccess();
                }
            });
        };

        const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const barcode = watch('barcode');
                if (!barcode) return;

                // 1. Try to find in issuedBooks locally
                const localBook = issuedBooks?.find(
                    (b: any) =>
                        b.lmB_BookTitle.toLowerCase() === barcode.toLowerCase() ||
                        b.lmbanO_AccessionNo.toLowerCase() === barcode.toLowerCase() ||
                        b.LMBANO_QRCode?.toLowerCase() === barcode.toLowerCase()
                );

                if (localBook) {
                    handleBookSelect(localBook.lmB_Id.toString());
                    toast.success('Book found');
                    return;
                }

                // 2. Server search
                barcodeMutation.mutate(
                    {
                        searchfilter: barcode,
                        booktype: bookType,
                        issuertype: memberType,
                        bookcat_type: 'book'
                    },
                    {
                        onSuccess: (res) => {
                            const data = res as any;
                            if (data.getalldata && data.getalldata.length > 0) {
                                const found = data.getalldata[0];
                                // Verify if this book belongs to the current user's issued books
                                const matchingIssued = issuedBooks?.find((b: any) => b.lmB_Id === found.lmB_Id);

                                if (matchingIssued) {
                                    handleBookSelect(matchingIssued.lmB_Id.toString());
                                    toast.success('Book found');
                                } else {
                                    toast.warning('Book found but not issued to this member');
                                }
                            } else {
                                toast.error('Book not found');
                            }
                        }
                    }
                );
            }
        };

        const handleLostBookClick = () => {
            const data = watch();
            if (!data.Book_Trans_Id || !data.LMBANO_Id || !data.LMB_Id) {
                toast.error('Please select a valid transaction/book first');
                return;
            }
            setIsLostBookModalOpen(true);
        };

        const onLostBookConfirm = (modalData: any) => {
            const formData = watch();
            const payload = {
                Book_Trans_Id: formData.Book_Trans_Id,
                LMBANO_Id: formData.LMBANO_Id,
                LMB_Id: formData.LMB_Id,
                issuertype: formData.memberType,
                bookcat_type: 'book',
                LMB_BookTitle: selectedBook?.lmB_BookTitle,
                LBTR_FineCollected: modalData.collected,
                LBTR_TotalFine: modalData.fine
            };

            lostBookMutation.mutate(payload, {
                onSuccess: () => {
                    setIsLostBookModalOpen(false);
                    reset();
                    onSuccess();
                }
            });
        };

        return (
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Member Type Selection */}
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
                                <RadioGroupItem value='std' id='std' />
                                <Label htmlFor='std' className='flex cursor-pointer items-center gap-2'>
                                    <User className='h-4 w-4' /> Student
                                </Label>
                            </div>
                            <div className='flex cursor-pointer items-center space-x-2 rounded-lg border p-3 hover:bg-accent/50'>
                                <RadioGroupItem value='stf' id='stf' />
                                <Label htmlFor='stf' className='flex cursor-pointer items-center gap-2'>
                                    <User className='h-4 w-4' /> Staff
                                </Label>
                            </div>
                            <div className='flex cursor-pointer items-center space-x-2 rounded-lg border p-3 hover:bg-accent/50'>
                                <RadioGroupItem value='dep' id='dep' />
                                <Label htmlFor='dep' className='flex cursor-pointer items-center gap-2'>
                                    <Building2 className='h-4 w-4' /> Department
                                </Label>
                            </div>
                            <div className='flex cursor-pointer items-center space-x-2 rounded-lg border p-3 hover:bg-accent/50'>
                                <RadioGroupItem value='gst' id='gst' />
                                <Label htmlFor='gst' className='flex cursor-pointer items-center gap-2'>
                                    <UserPlus className='h-4 w-4' /> Guest
                                </Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* Dynamic Member Selection Fields */}
                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg'>
                            {memberType === 'std' && 'Student Details'}
                            {memberType === 'stf' && 'Staff Details'}
                            {memberType === 'dep' && 'Department Details'}
                            {memberType === 'gst' && 'Guest Details'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        {/* Student Fields */}
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
                                    <Label>Student Name</Label>
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

                        {/* Staff Fields */}
                        {memberType === 'stf' && (
                            <>
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                    <div>
                                        <Label>Department</Label>
                                        <Select onValueChange={(v) => setValue('HRMD_Id', Number(v))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Department' />
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
                                                <SelectValue placeholder='Select Designation' />
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
                                    <Label>Staff Name</Label>
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

                        {/* Guest Fields - Simplified for now */}
                        {memberType === 'gst' && (
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                <InputText label='Guest Name' {...register('LBTR_GuestName')} />
                                <InputText label='Mobile No' {...register('LBTR_GuestContactNo')} />
                                <InputText label='Email ID' {...register('LBTR_GuestEmailId')} />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Member Details Panel */}
                {memberType === 'std' && (studentDetailsMutation.data as any)?.studentdata?.[0] && (
                    <Card className='bg-muted/50'>
                        <CardHeader className='py-3'>
                            <CardTitle className='font-medium text-base'>Selected Student Details</CardTitle>
                        </CardHeader>
                        <CardContent className='grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
                            <div>
                                <span className='font-semibold text-muted-foreground'>Name:</span>{' '}
                                <div>{(studentDetailsMutation.data as any).studentdata[0].amsT_FirstName}</div>
                            </div>
                            <div>
                                <span className='font-semibold text-muted-foreground'>Adm No:</span>{' '}
                                <div>{(studentDetailsMutation.data as any).studentdata[0].amsT_AdmNo}</div>
                            </div>
                            <div>
                                <span className='font-semibold text-muted-foreground'>Class:</span>{' '}
                                <div>{(studentDetailsMutation.data as any).studentdata[0].asmcL_ClassName}</div>
                            </div>
                            <div>
                                <span className='font-semibold text-muted-foreground'>Section:</span>{' '}
                                <div>{(studentDetailsMutation.data as any).studentdata[0].asmC_SectionName}</div>
                            </div>
                            <div>
                                <span className='font-semibold text-muted-foreground'>Roll No:</span>{' '}
                                <div>{(studentDetailsMutation.data as any).studentdata[0].amaY_RollNo}</div>
                            </div>
                            <div>
                                <span className='font-semibold text-muted-foreground'>Reg No:</span>{' '}
                                <div>{(studentDetailsMutation.data as any).studentdata[0].amsT_RegistrationNo}</div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {memberType === 'stf' && (staffDetailsMutation.data as any)?.selctstaffdata?.[0] && (
                    <Card className='bg-muted/50'>
                        <CardHeader className='py-3'>
                            <CardTitle className='font-medium text-base'>Selected Staff Details</CardTitle>
                        </CardHeader>
                        <CardContent className='grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
                            <div>
                                <span className='font-semibold text-muted-foreground'>Name:</span>{' '}
                                <div>{(staffDetailsMutation.data as any).selctstaffdata[0].hrmE_EmployeeFirstName}</div>
                            </div>
                            <div>
                                <span className='font-semibold text-muted-foreground'>Code:</span>{' '}
                                <div>{(staffDetailsMutation.data as any).selctstaffdata[0].hrmE_EmployeeCode}</div>
                            </div>
                            <div>
                                <span className='font-semibold text-muted-foreground'>Department:</span>{' '}
                                <div>{(staffDetailsMutation.data as any).selctstaffdata[0].hrmD_DepartmentName}</div>
                            </div>
                            <div>
                                <span className='font-semibold text-muted-foreground'>Designation:</span>{' '}
                                <div>{(staffDetailsMutation.data as any).selctstaffdata[0].hrmdeS_DesignationName}</div>
                            </div>
                            <div>
                                <span className='font-semibold text-muted-foreground'>Mobile:</span>{' '}
                                <div>{(staffDetailsMutation.data as any).selctstaffdata[0].hrmE_MobileNo}</div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {memberType === 'gst' && watch('LBTR_GuestName') && (
                    <Card className='bg-muted/50'>
                        <CardHeader className='py-3'>
                            <CardTitle className='font-medium text-base'>Guest Details</CardTitle>
                        </CardHeader>
                        <CardContent className='grid grid-cols-1 gap-4 text-sm md:grid-cols-3'>
                            <div>
                                <span className='font-semibold text-muted-foreground'>Name:</span> <div>{watch('LBTR_GuestName')}</div>
                            </div>
                            <div>
                                <span className='font-semibold text-muted-foreground'>Contact:</span>{' '}
                                <div>{watch('LBTR_GuestContactNo')}</div>
                            </div>
                            <div>
                                <span className='font-semibold text-muted-foreground'>Email:</span> <div>{watch('LBTR_GuestEmailId')}</div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Book & Dates Section */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg'>Book Selection</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <InputText
                                label='Barcode'
                                placeholder='Scan barcode and press Enter...'
                                {...register('barcode')}
                                onKeyDown={handleBarcodeKeyDown}
                            />
                            <div>
                                <Label>Book Title (Issued Books)</Label>
                                <Select onValueChange={handleBookSelect}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Book' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {issuedBooks?.map((item: any) => (
                                            <SelectItem key={`${item.lmB_Id}-${item.lmbanO_Id}`} value={item.lmB_Id.toString()}>
                                                {item.lmB_BookTitle} ({item.lmbanO_AccessionNo})
                                            </SelectItem>
                                        ))}
                                        {(!issuedBooks || issuedBooks.length === 0) && (
                                            <div className='p-2 text-center text-muted-foreground text-sm'>No issued books found</div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            {selectedBook && (
                                <div className='space-y-2 rounded-md bg-muted p-4 text-sm'>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <div>
                                            <strong>Title:</strong> {selectedBook.lmB_BookTitle}
                                        </div>
                                        <div>
                                            <strong>Accession No:</strong> {selectedBook.lmbanO_AccessionNo}
                                        </div>
                                        <div>
                                            <strong>Author:</strong> {selectedBook.authorname || '--'}
                                        </div>
                                        <div>
                                            <strong>Issue Date:</strong>{' '}
                                            {selectedBook.issue_Date ? new Date(selectedBook.issue_Date).toLocaleDateString() : '--'}
                                        </div>
                                        <div>
                                            <strong>Due Date:</strong>{' '}
                                            {selectedBook.due_Date ? new Date(selectedBook.due_Date).toLocaleDateString() : '--'}
                                        </div>
                                        <div className='col-span-2 text-red-600'>
                                            <strong>Fine:</strong> {selectedBook.fine_Amount || 0}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg'>Transaction Dates</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <InputText label='Issue Date' type='date' {...register('issueDate')} />
                            <InputText label='Due Date' type='date' {...register('dueDate')} />
                            <InputText label='Return Date' type='date' {...register('returnDate')} />
                        </CardContent>
                    </Card>
                </div>

                {/* Fine Section */}
                <Card className='border-red-200 bg-red-50/50'>
                    <CardHeader>
                        <CardTitle className='text-lg text-red-700'>Fine Details</CardTitle>
                    </CardHeader>
                    <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <InputText label='Fine Amount' type='number' disabled {...register('fineAmount')} />
                        <InputText label='Fine Collected' type='number' {...register('fineCollected', { valueAsNumber: true })} />
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className='flex justify-end gap-2 border-t pt-4'>
                    <Button type='button' variant='outline' onClick={() => reset()}>
                        Reset
                    </Button>
                    <Button
                        type='button'
                        variant='destructive'
                        onClick={handleLostBookClick}
                        disabled={isSubmitting || lostBookMutation.isPending}>
                        Lost Book
                    </Button>
                    <Button
                        type='button'
                        variant='secondary'
                        onClick={handleRenewal}
                        disabled={isSubmitting || renewBookMutation.isPending}>
                        {renewBookMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        Renewal
                    </Button>
                    <Button type='submit' disabled={isSubmitting || returnBookMutation.isPending}>
                        {(isSubmitting || returnBookMutation.isPending) && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        Return Book
                    </Button>
                </div>

                <LostBookModal
                    isOpen={isLostBookModalOpen}
                    onClose={() => setIsLostBookModalOpen(false)}
                    onConfirm={onLostBookConfirm}
                    isProcessing={lostBookMutation.isPending}
                    bookTitle={selectedBook?.lmB_BookTitle}
                    accessionNo={selectedBook?.lmbanO_AccessionNo}
                />
            </form>
        );
    };
};

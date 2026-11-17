'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { useBookTransaction, useIssueBook, useStudentDetails, useStudentsByClassSection } from '@/hooks/library/useBookTransaction';
import type { BookCategory, BookType } from '@/types/library/transactions/book-transaction';
import { Loader2, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface StudentIssueFormProps {
    bookType: BookType;
    bookCategory: BookCategory;
}

export function StudentIssueForm({ bookType, bookCategory }: StudentIssueFormProps) {
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
    const [selectedBooks, setSelectedBooks] = useState<any[]>([]);

    const { control, watch, setValue } = useForm({
        defaultValues: {
            ASMAY_Id: '',
            ASMCL_Id: '',
            ASMS_Id: '',
            AMST_Id: '',
            searchBook: ''
        }
    });

    const yearId = watch('ASMAY_Id');
    const classId = watch('ASMCL_Id');
    const sectionId = watch('ASMS_Id');
    const studentId = watch('AMST_Id');

    // Get initial data
    const { data: initialData, isLoading: isLoadingInitial } = useBookTransaction({
        booktype: bookType,
        issuertype: 'std',
        bookcat_type: bookCategory,
        ASMAY_Id: yearId ? Number(yearId) : undefined,
        ASMCL_Id: classId ? Number(classId) : undefined,
        ASMS_Id: sectionId ? Number(sectionId) : undefined
    });

    // Get students by class/section
    const { data: studentsData } = useStudentsByClassSection(
        {
            ASMAY_Id: Number(yearId),
            ASMCL_Id: Number(classId),
            ASMS_Id: Number(sectionId)
        },
        !!(yearId && classId && sectionId)
    );

    // Get student details when selected
    const { data: studentDetails, isLoading: isLoadingStudent } = useStudentDetails(
        {
            ASMAY_Id: Number(yearId),
            AMST_Id: Number(studentId),
            booktype: bookType,
            issuertype: 'std',
            bookcat_type: bookCategory
        },
        !!studentId
    );

    const issueBookMutation = useIssueBook();

    const handleAddBook = (book: any) => {
        if (selectedBooks.find((b) => b.lmbanO_Id === book.lmbanO_Id)) {
            toast.error('Book already added');
            return;
        }
        setSelectedBooks([...selectedBooks, book]);
    };

    const handleRemoveBook = (bookId: number) => {
        setSelectedBooks(selectedBooks.filter((b) => b.lmbanO_Id !== bookId));
    };

    const handleIssueBooks = () => {
        if (!studentId || selectedBooks.length === 0) {
            toast.error('Please select a student and at least one book');
            return;
        }

        // Issue each book
        selectedBooks.forEach((book) => {
            const issueDate = new Date();
            const dueDate = new Date();
            const maxDays = studentDetails?.data?.circularparamdetails?.[0]?.max_Issue_Days || 15;
            dueDate.setDate(dueDate.getDate() + maxDays);

            issueBookMutation.mutate({
                LMBANO_Id: book.lmbanO_Id,
                LMB_Id: book.lmB_Id,
                LMB_BookTitle: book.lmB_BookTitle,
                LMB_Price: book.lmB_Price || 0,
                Issue_Date: issueDate,
                Due_Date: dueDate,
                Return_Date: new Date(),
                Book_Trans_Status: 'Issue',
                booktype: bookType,
                issuertype: 'std',
                bookcat_type: bookCategory,
                AMST_Id: Number(studentId),
                ASMCL_Id: Number(classId),
                //ASMAY_Id: Number(yearId),
                maxitem: studentDetails?.data?.circularparamdetails?.[0]?.max_Issue_Items || 5
            });
        });

        // Clear selection after issue
        setSelectedBooks([]);
    };

    return (
        <div className='space-y-6'>
            {/* Student Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Student Selection</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <div>
                            <Label>Academic Year *</Label>
                            <Controller
                                name='ASMAY_Id'
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
                                        <option value=''>Select Year</option>
                                        {initialData?.data?.yearlist?.map((year) => (
                                            <option key={year.asmaY_Id} value={year.asmaY_Id}>
                                                {year.asmaY_Year}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                        </div>
                        <div>
                            <Label>Class *</Label>
                            <Controller
                                name='ASMCL_Id'
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                        disabled={!yearId}>
                                        <option value=''>Select Class</option>
                                        {initialData?.data?.classlist?.map((cls) => (
                                            <option key={cls.asmcL_Id} value={cls.asmcL_Id}>
                                                {cls.asmcL_ClassName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                        </div>
                        <div>
                            <Label>Section *</Label>
                            <Controller
                                name='ASMS_Id'
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                        disabled={!classId}>
                                        <option value=''>Select Section</option>
                                        {initialData?.data?.sectionlist?.map((section) => (
                                            <option key={section.asmS_Id} value={section.asmS_Id}>
                                                {section.asmC_SectionName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Student *</Label>
                        <Controller
                            name='AMST_Id'
                            control={control}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                    disabled={!sectionId}>
                                    <option value=''>Select Student</option>
                                    {studentsData?.data?.studentlist?.map((student) => (
                                        <option key={student.amsT_Id} value={student.amsT_Id}>
                                            {student.amsT_FirstName} ({student.amsT_AdmNo})
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Student Details */}
            {studentDetails?.data?.studentdata?.[0] && (
                <Card>
                    <CardHeader>
                        <CardTitle>Student Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
                            <div>
                                <p className='text-muted-foreground'>Name</p>
                                <p className='font-medium'>{studentDetails.data.studentdata[0].amsT_FirstName}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground'>Admission No</p>
                                <p className='font-medium'>{studentDetails.data.studentdata[0].amsT_AdmNo}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground'>Class</p>
                                <p className='font-medium'>{studentDetails.data.studentdata[0].asmcL_ClassName}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground'>Section</p>
                                <p className='font-medium'>{studentDetails.data.studentdata[0].asmC_SectionName}</p>
                            </div>
                        </div>
                        {studentDetails.data.circularparamdetails?.[0] && (
                            <div className='mt-4 rounded-md bg-muted p-3'>
                                <p className='mb-2 font-medium text-sm'>Issue Limits</p>
                                <div className='grid grid-cols-3 gap-4 text-sm'>
                                    <div>
                                        <p className='text-muted-foreground'>Max Books</p>
                                        <p className='font-medium'>{studentDetails.data.circularparamdetails[0].max_Issue_Items}</p>
                                    </div>
                                    <div>
                                        <p className='text-muted-foreground'>Max Days</p>
                                        <p className='font-medium'>{studentDetails.data.circularparamdetails[0].max_Issue_Days}</p>
                                    </div>
                                    <div>
                                        <p className='text-muted-foreground'>Max Renewals</p>
                                        <p className='font-medium'>{studentDetails.data.circularparamdetails[0].max_No_Renewals}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Book Selection */}
            {studentId && (
                <Card>
                    <CardHeader>
                        <CardTitle>Book Selection</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div>
                            <Label>Search Books</Label>
                            <div className='flex gap-2'>
                                <Controller
                                    name='searchBook'
                                    control={control}
                                    render={({ field }) => (
                                        <InputText {...field} placeholder='Search by title or accession number' className='flex-1' />
                                    )}
                                />
                                <Button variant='outline' size='icon'>
                                    <Search className='h-4 w-4' />
                                </Button>
                            </div>
                        </div>

                        {/* Selected Books */}
                        {selectedBooks.length > 0 && (
                            <div className='space-y-2'>
                                <Label>Selected Books ({selectedBooks.length})</Label>
                                {selectedBooks.map((book) => (
                                    <div key={book.lmbanO_Id} className='flex items-center justify-between rounded-md border p-3'>
                                        <div>
                                            <p className='font-medium'>{book.lmB_BookTitle}</p>
                                            <p className='text-muted-foreground text-sm'>Acc No: {book.lmbanO_AccessionNo}</p>
                                        </div>
                                        <Button variant='ghost' size='icon' onClick={() => handleRemoveBook(book.lmbanO_Id)}>
                                            <X className='h-4 w-4' />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button
                            onClick={handleIssueBooks}
                            disabled={selectedBooks.length === 0 || issueBookMutation.isPending}
                            className='w-full'>
                            {issueBookMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                            Issue {selectedBooks.length} Book{selectedBooks.length !== 1 ? 's' : ''}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

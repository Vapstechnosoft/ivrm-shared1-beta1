'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { useBookTransaction, useDesignationsByDepartment, useIssueBook, useStaffByDepartment } from '@/hooks/library/useBookTransaction';
import type { BookCategory, BookType } from '@/types/library/transactions/book-transaction';
import { Loader2, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface StaffIssueFormProps {
    bookType: BookType;
    bookCategory: BookCategory;
}

export function StaffIssueForm({ bookType, bookCategory }: StaffIssueFormProps) {
    const [selectedBooks, setSelectedBooks] = useState<any[]>([]);

    const { control, watch } = useForm({
        defaultValues: {
            HRMD_Id: '',
            HRMDES_Id: '',
            HRME_Id: '',
            searchBook: ''
        }
    });

    const departmentId = watch('HRMD_Id');
    const designationId = watch('HRMDES_Id');
    const staffId = watch('HRME_Id');

    // Get initial data
    const { data: initialData } = useBookTransaction({
        booktype: bookType,
        issuertype: 'stf',
        bookcat_type: bookCategory
    });

    // Get designations by department
    const { data: designationsData } = useDesignationsByDepartment(
        {
            HRMD_Id: Number(departmentId)
        },
        !!departmentId
    );

    // Get staff by department/designation
    const { data: staffData } = useStaffByDepartment(
        {
            HRMD_Id: Number(departmentId),
            HRMDES_Id: Number(designationId)
        },
        !!(departmentId && designationId)
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
        if (!staffId || selectedBooks.length === 0) {
            toast.error('Please select a staff member and at least one book');
            return;
        }

        selectedBooks.forEach((book) => {
            const issueDate = new Date();
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 15); // Default 15 days

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
                issuertype: 'stf',
                bookcat_type: bookCategory,
                HRME_Id: Number(staffId),
                HRMD_Id: Number(departmentId),
                //HRMDES_Id: Number(designationId),
                maxitem: 10 // Default max items for staff
            });
        });

        setSelectedBooks([]);
    };

    return (
        <div className='space-y-6'>
            {/* Staff Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Staff Selection</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <div>
                            <Label>Department *</Label>
                            <Controller
                                name='HRMD_Id'
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
                                        <option value=''>Select Department</option>
                                        {initialData?.data?.departmentlist?.map((dept) => (
                                            <option key={dept.hrmD_Id} value={dept.hrmD_Id}>
                                                {dept.hrmD_DepartmentName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                        </div>
                        <div>
                            <Label>Designation *</Label>
                            <Controller
                                name='HRMDES_Id'
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                        disabled={!departmentId}>
                                        <option value=''>Select Designation</option>
                                        {designationsData?.data?.filldesignation?.map((desig) => (
                                            <option key={desig.hrmdeS_Id} value={desig.hrmdeS_Id}>
                                                {desig.hrmdeS_DesignationName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                        </div>
                        <div>
                            <Label>Staff Member *</Label>
                            <Controller
                                name='HRME_Id'
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                        disabled={!designationId}>
                                        <option value=''>Select Staff</option>
                                        {staffData?.data?.stafftlist?.map((staff) => (
                                            <option key={staff.hrmE_Id} value={staff.hrmE_Id}>
                                                {staff.hrmE_EmployeeFirstName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Book Selection */}
            {staffId && (
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

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { useIssueBook } from '@/hooks/library/useBookTransaction';
import { type GuestFormValues, guestFormSchema } from '@/schemas/library/transactions';
import type { BookCategory, BookType } from '@/types/library/transactions/book-transaction';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface GuestIssueFormProps {
    bookType: BookType;
    bookCategory: BookCategory;
}

export function GuestIssueForm({ bookType, bookCategory }: GuestIssueFormProps) {
    const [selectedBooks, setSelectedBooks] = useState<any[]>([]);
    const [guestVerified, setGuestVerified] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<GuestFormValues>({
        resolver: zodResolver(guestFormSchema),
        defaultValues: {
            LBTR_GuestName: '',
            LBTR_GuestContactNo: '',
            LBTR_GuestEmailId: ''
        }
    });

    const guestName = watch('LBTR_GuestName');
    const guestContact = watch('LBTR_GuestContactNo');
    const guestEmail = watch('LBTR_GuestEmailId');

    const issueBookMutation = useIssueBook();

    const onVerifyGuest = (data: GuestFormValues) => {
        setGuestVerified(true);
        toast.success('Guest information verified');
    };

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
        if (!guestVerified || selectedBooks.length === 0) {
            toast.error('Please verify guest information and select at least one book');
            return;
        }

        selectedBooks.forEach((book) => {
            const issueDate = new Date();
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7); // Default 7 days for guests

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
                issuertype: 'gst',
                bookcat_type: bookCategory,
                LBTR_GuestName: guestName,
                LBTR_GuestContactNo: guestContact,
                LBTR_GuestEmailId: guestEmail,
                maxitem: 3 // Default max items for guests
            });
        });

        setSelectedBooks([]);
    };

    return (
        <div className='space-y-6'>
            {/* Guest Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Guest Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onVerifyGuest)} className='space-y-4'>
                        <div>
                            <Label>Guest Name *</Label>
                            <Controller
                                name='LBTR_GuestName'
                                control={control}
                                render={({ field }) => (
                                    <InputText
                                        {...field}
                                        placeholder='Enter guest name'
                                        error={errors.LBTR_GuestName?.message}
                                        disabled={guestVerified}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Label>Contact Number *</Label>
                            <Controller
                                name='LBTR_GuestContactNo'
                                control={control}
                                render={({ field }) => (
                                    <InputText
                                        {...field}
                                        placeholder='Enter 10-digit mobile number'
                                        error={errors.LBTR_GuestContactNo?.message}
                                        disabled={guestVerified}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Label>Email Address *</Label>
                            <Controller
                                name='LBTR_GuestEmailId'
                                control={control}
                                render={({ field }) => (
                                    <InputText
                                        {...field}
                                        type='email'
                                        placeholder='Enter email address'
                                        error={errors.LBTR_GuestEmailId?.message}
                                        disabled={guestVerified}
                                    />
                                )}
                            />
                        </div>

                        {!guestVerified ? (
                            <Button type='submit' className='w-full'>
                                Verify Guest Information
                            </Button>
                        ) : (
                            <div className='rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950'>
                                <p className='font-medium text-green-800 text-sm dark:text-green-200'>✓ Guest information verified</p>
                                <Button type='button' variant='ghost' size='sm' onClick={() => setGuestVerified(false)} className='mt-2'>
                                    Edit Information
                                </Button>
                            </div>
                        )}

                        {guestVerified && (
                            <div className='rounded-md bg-muted p-3'>
                                <p className='mb-2 font-medium text-sm'>Guest Issue Limits</p>
                                <div className='grid grid-cols-2 gap-4 text-sm'>
                                    <div>
                                        <p className='text-muted-foreground'>Max Books</p>
                                        <p className='font-medium'>3</p>
                                    </div>
                                    <div>
                                        <p className='text-muted-foreground'>Max Days</p>
                                        <p className='font-medium'>7</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* Book Selection */}
            {guestVerified && (
                <Card>
                    <CardHeader>
                        <CardTitle>Book Selection</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div>
                            <Label>Search Books</Label>
                            <div className='flex gap-2'>
                                <InputText placeholder='Search by title or accession number' className='flex-1' />
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

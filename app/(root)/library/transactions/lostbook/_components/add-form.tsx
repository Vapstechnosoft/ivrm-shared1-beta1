// app/dashboard/transaction/lostbook/_components/add-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { useLostBookList } from '@/hooks/library/useTransactions';
import { lostBookSchema } from '@/schemas/library/transactions';
import { getAuthorNameDropdown, getBookListDropdown, saveLostBookRecord } from '@/server/library/transactions/lost-book';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Loader2, Save, X } from 'lucide-react';

type FormFields = z.infer<typeof lostBookSchema.addOrUpdate>;

interface AddLostBookFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    className?: string;
}

export default function AddLostBookForm({ onSuccess, onCancel, className = '' }: AddLostBookFormProps) {
    const { refetchAll } = useLostBookList();

    const [loading, setLoading] = useState(false);
    const [bookOptions, setBookOptions] = useState<any[]>([]);
    const [authorOptions, setAuthorOptions] = useState<{ id: number; name: string }[]>([]);

    // Add state for book category and type filters
    const [bookCategory, setBookCategory] = useState<'book' | 'nonbook'>('book');
    const [bookType, setBookType] = useState<'issue' | 'ref'>('issue');

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(lostBookSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            LMBANO_AvialableStatus: 'lost',
            LMBANO_LostDamagedDate: format(new Date(), 'yyyy-MM-dd'),
            LMBANO_LostDamagedReason: '',
            LMBANO_ModeOfPayment: undefined
        }
    });

    // Load book options when category or type changes
    useEffect(() => {
        loadBookOptions();
    }, [bookCategory, bookType]);

    const loadBookOptions = async () => {
        try {
            const response = await getBookListDropdown(bookCategory, bookType);
            if (response.success && Array.isArray(response.data)) {
                setBookOptions(response.data);
                // Clear selected book when filters change
                setValue('LMBANO_Id', undefined as any);
                setAuthorOptions([]);
            }
        } catch (error) {
            console.error('Failed to load book options:', error);
            toast.error('Failed to load book options');
        }
    };

    const handleBookSelect = async (bookId: number) => {
        // Set the book ID in the form
        setValue('LMBANO_Id', bookId.toString());

        try {
            const response = await getAuthorNameDropdown(bookId);

            if (response.success && Array.isArray(response.data)) {
                setAuthorOptions(response.data);
            }
        } catch (error) {
            console.error('Failed to load authors:', error);
            toast.error('Failed to load author information');
        }
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            setLoading(true);

            // Add user ID and other required fields
            const submitData = {
                ...data
            };

            const response = await saveLostBookRecord(submitData);

            if (response.success) {
                toast.success('Lost book record saved successfully');
                reset();
                setAuthorOptions([]);
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to save record');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        reset({
            LMBANO_AvialableStatus: 'lost',
            LMBANO_LostDamagedDate: format(new Date(), 'yyyy-MM-dd'),
            LMBANO_LostDamagedReason: '',
            LMBANO_ModeOfPayment: undefined
        });
        setAuthorOptions([]);
        setBookCategory('book');
        setBookType('issue');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 p-4 ${className}`}>
            <div className='mb-6 text-center'>
                <h2 className='font-bold text-2xl'>LOST BOOK</h2>
            </div>

            {/* Book Category Selection - BOOK/NON-BOOK */}
            <div className='space-y-4'>
                <Label className='font-semibold text-lg'>Book Category</Label>
                <RadioGroup
                    value={bookCategory}
                    onValueChange={(value: 'book' | 'nonbook') => setBookCategory(value)}
                    className='flex space-x-4'>
                    <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='book' id='book-category' />
                        <Label htmlFor='book-category'>BOOK</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='nonbook' id='nonbook-category' />
                        <Label htmlFor='nonbook-category'>NON-BOOK</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Book Type Selection - ISSUE/REFERENCE */}
            <div className='space-y-4'>
                <Label className='font-semibold text-lg'>Book Type</Label>
                <RadioGroup value={bookType} onValueChange={(value: 'issue' | 'ref') => setBookType(value)} className='flex space-x-4'>
                    <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='issue' id='issue-type' />
                        <Label htmlFor='issue-type'>ISSUE</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='ref' id='ref-type' />
                        <Label htmlFor='ref-type'>REFERENCE</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Book Selection */}
            <div className='space-y-4'>
                <Label htmlFor='LMBANO_Id'>
                    Book Title: <span className='text-red-500'>*</span>
                </Label>
                <Select onValueChange={(value) => handleBookSelect(Number.parseInt(value))}>
                    <SelectTrigger>
                        <SelectValue placeholder={`Select ${bookCategory === 'book' ? 'book' : 'non-book'}...`} />
                    </SelectTrigger>
                    <SelectContent>
                        {bookOptions.length > 0 ? (
                            bookOptions.map((book) => (
                                <SelectItem key={book.lmbanO_Id} value={book.lmbanO_Id.toString()}>
                                    {book.lmbanO_AccessionNo} :: {book.lmB_BookTitle}
                                </SelectItem>
                            ))
                        ) : (
                            <div className='p-2 text-center text-gray-500'>
                                No {bookCategory === 'book' ? 'books' : 'non-books'} available
                            </div>
                        )}
                    </SelectContent>
                </Select>
                {errors.LMBANO_Id && <p className='text-red-500 text-sm'>{errors.LMBANO_Id.message}</p>}
            </div>

            {/* Author Name */}
            <div className='space-y-4'>
                <Label htmlFor='AuthorId'>Author Name:</Label>
                <Select disabled={authorOptions.length === 0}>
                    <SelectTrigger>
                        <SelectValue placeholder={authorOptions.length === 0 ? 'Select book first' : 'Select author...'} />
                    </SelectTrigger>
                    <SelectContent>
                        {authorOptions.map((author) => (
                            <SelectItem key={author.id} value={author.id.toString()}>
                                {author.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Lost Date */}
            <div className='space-y-4'>
                <Label htmlFor='LMBANO_LostDamagedDate'>
                    Lost Date: <span className='text-red-500'>*</span>
                </Label>
                <Input id='LMBANO_LostDamagedDate' type='date' {...register('LMBANO_LostDamagedDate')} className='w-full' />
                {errors.LMBANO_LostDamagedDate && <p className='text-red-500 text-sm'>{errors.LMBANO_LostDamagedDate.message}</p>}
            </div>

            {/* Price */}
            <div className='space-y-4'>
                <Label htmlFor='LMBANO_AmountCollected'>
                    Price: <span className='text-red-500'>*</span>
                </Label>
                <Input id='LMBANO_AmountCollected' placeholder='Enter Lost/Damage Price' {...register('LMBANO_AmountCollected')} />
                {errors.LMBANO_AmountCollected && <p className='text-red-500 text-sm'>{errors.LMBANO_AmountCollected.message}</p>}
            </div>

            {/* Mode of Payment */}
            <div className='space-y-4'>
                <Label className='font-semibold text-lg'>
                    Mode Of Payment: <span className='text-red-500'>*</span>
                </Label>
                <RadioGroup
                    onValueChange={(value) => setValue('LMBANO_ModeOfPayment', value as 'Cash' | 'Bank')}
                    className='flex space-x-6'>
                    <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='Cash' id='cash' />
                        <Label htmlFor='cash'>Cash</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='Bank' id='bank' />
                        <Label htmlFor='bank'>Bank</Label>
                    </div>
                </RadioGroup>
                {errors.LMBANO_ModeOfPayment && <p className='text-red-500 text-sm'>{errors.LMBANO_ModeOfPayment.message}</p>}
            </div>

            {/* Delete Reason */}
            <div className='space-y-4'>
                <Label htmlFor='LMBANO_LostDamagedReason'>Delete Reason:</Label>
                <Textarea
                    id='LMBANO_LostDamagedReason'
                    placeholder='Enter the Remarks'
                    {...register('LMBANO_LostDamagedReason')}
                    rows={3}
                />
                {errors.LMBANO_LostDamagedReason && <p className='text-red-500 text-sm'>{errors.LMBANO_LostDamagedReason.message}</p>}
            </div>

            {/* Book Status */}
            <div className='space-y-4'>
                <Label className='font-semibold text-lg'>
                    Book Status: <span className='text-red-500'>*</span>
                </Label>
                <RadioGroup
                    defaultValue='lost'
                    onValueChange={(value) => setValue('LMBANO_AvialableStatus', value as 'lost' | 'damaged')}
                    className='flex space-x-6'>
                    <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='lost' id='lost' />
                        <Label htmlFor='lost'>Lost</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='damaged' id='damaged' />
                        <Label htmlFor='damaged'>Damaged</Label>
                    </div>
                </RadioGroup>
                {errors.LMBANO_AvialableStatus && <p className='text-red-500 text-sm'>{errors.LMBANO_AvialableStatus.message}</p>}
            </div>

            {/* Buttons */}
            <div className='flex justify-end space-x-4 pt-6'>
                {onCancel && (
                    <Button type='button' variant='outline' onClick={onCancel} className='flex items-center gap-2'>
                        <X className='h-4 w-4' />
                        CANCEL
                    </Button>
                )}
                <Button type='button' variant='outline' onClick={handleReset} className='flex items-center gap-2'>
                    RESET
                </Button>
                <Button type='submit' disabled={isSubmitting || loading} className='flex items-center gap-2'>
                    {isSubmitting || loading ? (
                        <>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            SAVING...
                        </>
                    ) : (
                        <>
                            <Save className='h-4 w-4' />
                            SAVE
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

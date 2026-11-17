'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { useReturnBook } from '@/hooks/library/useBookTransaction';
import { differenceInDays, format } from 'date-fns';
import { Calendar, Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function ReturnBookForm() {
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
    const [fineAmount, setFineAmount] = useState(0);
    const [fineCollected, setFineCollected] = useState(0);

    const { control, watch } = useForm({
        defaultValues: {
            searchType: 'ACN', // Accession Number
            searchValue: '',
            returnDate: format(new Date(), 'yyyy-MM-dd')
        }
    });

    const searchValue = watch('searchValue');
    const searchType = watch('searchType');
    const returnDate = watch('returnDate');

    const returnBookMutation = useReturnBook();

    const handleSearch = () => {
        if (!searchValue) {
            toast.error('Please enter a search value');
            return;
        }

        // Mock search results - in real implementation, this would call the API
        // For now, showing placeholder
        toast.info('Search functionality will connect to API');
    };

    const calculateFine = (dueDate: string, returnDate: string) => {
        const due = new Date(dueDate);
        const ret = new Date(returnDate);
        const daysLate = differenceInDays(ret, due);

        if (daysLate <= 0) return 0;

        // Simple fine calculation: ₹5 per day
        return daysLate * 5;
    };

    const handleSelectTransaction = (transaction: any) => {
        setSelectedTransaction(transaction);
        const fine = calculateFine(transaction.due_Date, returnDate);
        setFineAmount(fine);
        setFineCollected(0);
    };

    const handleReturnBook = () => {
        if (!selectedTransaction) {
            toast.error('Please select a transaction to return');
            return;
        }

        returnBookMutation.mutate({
            Book_Trans_Id: selectedTransaction.book_Trans_Id,
            LMBANO_Id: selectedTransaction.lmbanO_Id,
            LMB_Id: selectedTransaction.lmB_Id,
            Due_Date: new Date(selectedTransaction.due_Date),
            Return_Date: new Date(returnDate),
            booktype: 'issue',
            issuertype: 'std', // This should come from the transaction
            bookcat_type: 'book',
            LBTR_FineCollected: fineCollected
        });

        setSelectedTransaction(null);
        setFineAmount(0);
        setFineCollected(0);
    };

    return (
        <div className='space-y-6'>
            {/* Search Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Search Transaction</CardTitle>
                    <CardDescription>Search by accession number, student name, or admission number</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <div>
                            <Label>Search By</Label>
                            <Controller
                                name='searchType'
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
                                        <option value='ACN'>Accession Number</option>
                                        <option value='SN'>Student Name</option>
                                        <option value='ADN'>Admission Number</option>
                                        <option value='TL'>Book Title</option>
                                    </select>
                                )}
                            />
                        </div>
                        <div>
                            <Label>Search Value</Label>
                            <Controller
                                name='searchValue'
                                control={control}
                                render={({ field }) => <InputText {...field} placeholder='Enter search value' />}
                            />
                        </div>
                        <div>
                            <Label>Return Date</Label>
                            <Controller
                                name='returnDate'
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type='date'
                                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <Button onClick={handleSearch} className='w-full'>
                        <Search className='mr-2 h-4 w-4' />
                        Search Transactions
                    </Button>
                </CardContent>
            </Card>

            {/* Selected Transaction Details */}
            {selectedTransaction && (
                <Card>
                    <CardHeader>
                        <CardTitle>Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
                            <div>
                                <p className='text-muted-foreground'>Book Title</p>
                                <p className='font-medium'>{selectedTransaction.lmB_BookTitle}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground'>Accession No</p>
                                <p className='font-medium'>{selectedTransaction.lmbanO_AccessionNo}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground'>Issue Date</p>
                                <p className='font-medium'>{format(new Date(selectedTransaction.issue_Date), 'dd/MM/yyyy')}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground'>Due Date</p>
                                <p className='font-medium'>{format(new Date(selectedTransaction.due_Date), 'dd/MM/yyyy')}</p>
                            </div>
                        </div>

                        {/* Member Details */}
                        <div className='rounded-md bg-muted p-3'>
                            <p className='mb-2 font-medium text-sm'>Member Details</p>
                            <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-3'>
                                <div>
                                    <p className='text-muted-foreground'>Name</p>
                                    <p className='font-medium'>{selectedTransaction.amsT_FirstName || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className='text-muted-foreground'>Admission No</p>
                                    <p className='font-medium'>{selectedTransaction.AMST_AdmNo || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className='text-muted-foreground'>Class</p>
                                    <p className='font-medium'>{selectedTransaction.asmcL_ClassName || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Fine Calculation */}
                        {fineAmount > 0 && (
                            <div className='rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950'>
                                <div className='mb-3 flex items-center justify-between'>
                                    <div>
                                        <p className='font-medium text-red-800 text-sm dark:text-red-200'>Fine Amount</p>
                                        <p className='font-bold text-2xl text-red-900 dark:text-red-100'>₹{fineAmount.toFixed(2)}</p>
                                    </div>
                                    <Calendar className='h-8 w-8 text-red-600 dark:text-red-400' />
                                </div>
                                <div className='mt-3'>
                                    <Label>Fine Collected</Label>
                                    <InputText
                                        type='number'
                                        value={fineCollected}
                                        onChange={(e) => setFineCollected(Number(e.target.value))}
                                        placeholder='Enter amount collected'
                                        className='mt-1'
                                    />
                                </div>
                            </div>
                        )}

                        <Button onClick={handleReturnBook} disabled={returnBookMutation.isPending} className='w-full' size='lg'>
                            {returnBookMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                            Process Return
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Placeholder for search results */}
            {!selectedTransaction && searchResults.length === 0 && (
                <Card>
                    <CardContent className='py-12'>
                        <div className='text-center text-muted-foreground'>
                            <Search className='mx-auto mb-4 h-12 w-12 opacity-50' />
                            <p>Search for a transaction to process return</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

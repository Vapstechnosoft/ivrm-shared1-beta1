'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookCheck, BookOpen, RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';
import { IssueBookForm } from './_components/issue-book-form';
import { ReturnBookForm } from './_components/return-book-form';

export default function BookTransactionPage() {
    const [activeTab, setActiveTab] = useState('issue');

    return (
        <div className='container mx-auto space-y-6 py-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-3xl tracking-tight'>Book Transaction</h1>
                    <p className='text-muted-foreground'>Manage book issue, return, and renewal operations</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                <TabsList className='grid w-full grid-cols-4'>
                    <TabsTrigger value='issue' className='flex items-center gap-2'>
                        <BookOpen className='h-4 w-4' />
                        Issue Book
                    </TabsTrigger>
                    <TabsTrigger value='return' className='flex items-center gap-2'>
                        <BookCheck className='h-4 w-4' />
                        Return Book
                    </TabsTrigger>
                    <TabsTrigger value='renew' className='flex items-center gap-2'>
                        <RefreshCw className='h-4 w-4' />
                        Renew Book
                    </TabsTrigger>
                    <TabsTrigger value='availability' className='flex items-center gap-2'>
                        <Search className='h-4 w-4' />
                        Book Availability
                    </TabsTrigger>
                </TabsList>

                <TabsContent value='issue' className='mt-6'>
                    <IssueBookForm />
                </TabsContent>

                <TabsContent value='return' className='mt-6'>
                    <ReturnBookForm />
                </TabsContent>

                <TabsContent value='renew' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Renew Book</CardTitle>
                            <CardDescription>Renew book loans for eligible members</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='flex h-64 items-center justify-center text-muted-foreground'>
                                Renew book form will be implemented here
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='availability' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Book Availability</CardTitle>
                            <CardDescription>Check book availability and current status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='flex h-64 items-center justify-center text-muted-foreground'>
                                Book availability search will be implemented here
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

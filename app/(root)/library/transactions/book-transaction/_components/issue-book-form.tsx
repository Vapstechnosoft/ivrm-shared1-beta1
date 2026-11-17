'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { BookCategory, BookType, MemberType } from '@/types/library/transactions/book-transaction';
import { Briefcase, Building2, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { DepartmentIssueForm } from './department-issue-form';
import { GuestIssueForm } from './guest-issue-form';
import { StaffIssueForm } from './staff-issue-form';
import { StudentIssueForm } from './student-issue-form';

export function IssueBookForm() {
    const [memberType, setMemberType] = useState<MemberType>('std');
    const [bookType, setBookType] = useState<BookType>('issue');
    const [bookCategory] = useState<BookCategory>('book');

    const handleMemberTypeChange = (value: string) => {
        setMemberType(value as MemberType);
    };

    const renderMemberForm = () => {
        switch (memberType) {
            case 'std':
                return <StudentIssueForm bookType={bookType} bookCategory={bookCategory} />;
            case 'stf':
                return <StaffIssueForm bookType={bookType} bookCategory={bookCategory} />;
            case 'dep':
                return <DepartmentIssueForm bookType={bookType} bookCategory={bookCategory} />;
            case 'gst':
                return <GuestIssueForm bookType={bookType} bookCategory={bookCategory} />;
            default:
                return null;
        }
    };

    return (
        <div className='space-y-6'>
            {/* Member Type Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Select Member Type</CardTitle>
                    <CardDescription>Choose the type of member to issue a book to</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={memberType} onValueChange={handleMemberTypeChange} className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                        <div>
                            <RadioGroupItem value='std' id='std' className='peer sr-only' />
                            <Label
                                htmlFor='std'
                                className='flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'>
                                <Users className='mb-3 h-6 w-6' />
                                <span className='font-medium text-sm'>Student</span>
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value='stf' id='stf' className='peer sr-only' />
                            <Label
                                htmlFor='stf'
                                className='flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'>
                                <Briefcase className='mb-3 h-6 w-6' />
                                <span className='font-medium text-sm'>Staff</span>
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value='dep' id='dep' className='peer sr-only' />
                            <Label
                                htmlFor='dep'
                                className='flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'>
                                <Building2 className='mb-3 h-6 w-6' />
                                <span className='font-medium text-sm'>Department</span>
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value='gst' id='gst' className='peer sr-only' />
                            <Label
                                htmlFor='gst'
                                className='flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'>
                                <UserPlus className='mb-3 h-6 w-6' />
                                <span className='font-medium text-sm'>Guest</span>
                            </Label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Book Type Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Book Type</CardTitle>
                    <CardDescription>Select the type of book transaction</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={bookType} onValueChange={(v) => setBookType(v as BookType)} className='flex gap-4'>
                        <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='issue' id='issue' />
                            <Label htmlFor='issue' className='cursor-pointer'>
                                Issue (Circulation)
                            </Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='ref' id='ref' />
                            <Label htmlFor='ref' className='cursor-pointer'>
                                Reference (In-Library)
                            </Label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Member-Specific Form */}
            {renderMemberForm()}
        </div>
    );
}

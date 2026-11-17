'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { IAlumniBirthday, IBatch } from '@/types/alumni/alumni-dashboard';
import { format } from 'date-fns';
import { Eye, Search } from 'lucide-react';
import { useState } from 'react';

interface DashboardTabsProps {
    batchData: IBatch[];
    birthdayData: IAlumniBirthday[];
    onViewYearwise: (asmaY_Id: number) => void;
    showAdminDetails?: boolean;
}

export default function DashboardTabs({ batchData, birthdayData, onViewYearwise, showAdminDetails = false }: DashboardTabsProps) {
    const [searchBirthday, setSearchBirthday] = useState('');

    const filteredBirthdays = birthdayData.filter(
        (b) =>
            b.studentname?.toLowerCase().includes(searchBirthday.toLowerCase()) ||
            b.ASMAY_Year?.toLowerCase().includes(searchBirthday.toLowerCase()) ||
            b.classname?.toLowerCase().includes(searchBirthday.toLowerCase())
    );

    return (
        <Tabs defaultValue='batch-count' className='w-full'>
            <TabsList className='mb-4'>
                {showAdminDetails && <TabsTrigger value='batch-count'>BATCHWISE ALUMNI COUNT</TabsTrigger>}
                <TabsTrigger value='birthday-list'>BIRTHDAY LIST</TabsTrigger>
            </TabsList>

            {showAdminDetails && (
                <TabsContent value='batch-count'>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg'>Batchwise Alumni Count</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='overflow-x-auto'>
                                <table className='w-full border-collapse text-sm'>
                                    <thead>
                                        <tr className='border-b bg-muted/50'>
                                            <th className='p-3 text-left'>SL.NO.</th>
                                            <th className='p-3 text-left'>BATCH</th>
                                            <th className='p-3 text-left'>FROM</th>
                                            <th className='p-3 text-left'>TO</th>
                                            <th className='p-3 text-center'>COUNT</th>
                                            <th className='p-3 text-center'>VIEW</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {batchData.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className='p-8 text-center text-muted-foreground'>
                                                    No Records Found
                                                </td>
                                            </tr>
                                        ) : (
                                            batchData.map((b, idx) => (
                                                <tr key={idx} className='border-b transition-colors hover:bg-muted/10'>
                                                    <td className='p-3'>{idx + 1}</td>
                                                    <td className='p-3'>{b.BATCHES}</td>
                                                    <td className='p-3'>
                                                        {b.ASMAY_From_Date ? format(new Date(b.ASMAY_From_Date), 'dd-MM-yyyy') : '-'}
                                                    </td>
                                                    <td className='p-3'>
                                                        {b.ASMAY_To_Date ? format(new Date(b.ASMAY_To_Date), 'dd-MM-yyyy') : '-'}
                                                    </td>
                                                    <td className='p-3 text-center'>{b.NOofstudents}</td>
                                                    <td className='p-3 text-center'>
                                                        <button
                                                            onClick={() => onViewYearwise(b.ASMAY_Id)}
                                                            className='inline-flex items-center text-primary transition-colors hover:text-primary/80'>
                                                            <Eye className='mr-1 h-4 w-4' /> View Yearwise
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            )}

            <TabsContent value='birthday-list'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
                        <CardTitle className='text-lg'>Upcoming Birthdays</CardTitle>
                        <div className='relative w-64 text-sm'>
                            <Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
                            <Input
                                placeholder='Search birthdays...'
                                value={searchBirthday}
                                onChange={(e) => setSearchBirthday(e.target.value)}
                                className='pl-8'
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='overflow-x-auto'>
                            <table className='w-full border-collapse text-sm'>
                                <thead>
                                    <tr className='border-b bg-muted/50'>
                                        <th className='p-3 text-left'>SL.NO.</th>
                                        <th className='p-3 text-left'>STUDENT NAME</th>
                                        <th className='p-3 text-center'>DOB</th>
                                        {showAdminDetails && <th className='p-3 text-center'>ADM NO</th>}
                                        <th className='p-3 text-center'>YEAR</th>
                                        <th className='p-3 text-center'>CLASS</th>
                                        {showAdminDetails && <th className='p-3 text-left'>EMAIL ID</th>}
                                        {showAdminDetails && <th className='p-3 text-left'>MOBILE</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBirthdays.length === 0 ? (
                                        <tr>
                                            <td colSpan={showAdminDetails ? 8 : 5} className='p-8 text-center text-muted-foreground'>
                                                No Records Found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredBirthdays.map((b, idx) => (
                                            <tr key={idx} className='border-b transition-colors hover:bg-muted/10'>
                                                <td className='p-3'>{idx + 1}</td>
                                                <td className='p-3 font-medium'>{b.studentname}</td>
                                                <td className='p-3 text-center'>
                                                    {b.ALMST_DOB ? format(new Date(b.ALMST_DOB), 'dd-MM-yyyy') : '-'}
                                                </td>
                                                {showAdminDetails && <td className='p-3 text-center'>{b.ALMST_AdmNo}</td>}
                                                <td className='p-3 text-center'>{b.ASMAY_Year}</td>
                                                <td className='p-3 text-center'>{b.classname}</td>
                                                {showAdminDetails && <td className='p-3 text-left'>{b.ALMST_emailId}</td>}
                                                {showAdminDetails && <td className='p-3 text-left'>{b.ALMST_MobileNo}</td>}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}

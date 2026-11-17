'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { getCOEData } from '../actions';
import type { COELoadData, COEReport } from '../types';
import { columns } from './columns';

interface COEClientProps {
    initialData: COELoadData;
}

export default function COEClient({ initialData }: COEClientProps) {
    const [academicYear, setAcademicYear] = useState<string>(String(initialData.currentyear?.[0]?.asmaY_Id || ''));
    const [month, setMonth] = useState<string>(('0' + (new Date().getMonth() + 1)).slice(-2));
    const [events, setEvents] = useState<COEReport[]>([]);
    const [loading, setLoading] = useState(false);

    // Initial load handling
    useEffect(() => {
        if (academicYear && month) {
            handleSearch(academicYear, month);
        }
    }, []);

    const handleSearch = async (year: string, mth: string) => {
        setLoading(true);
        try {
            const response = await getCOEData({
                ASMAY_Id: Number(year),
                month: mth
            });
            setEvents(response.coereportlist || []);
        } catch (error) {
            console.error('Error fetching COE data:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleYearChange = (val: string) => {
        setAcademicYear(val);
        handleSearch(val, month);
    };

    const handleMonthChange = (val: string) => {
        setMonth(val);
        handleSearch(academicYear, val);
    };

    const months = [
        { value: '01', label: 'JANUARY' },
        { value: '02', label: 'FEBRUARY' },
        { value: '03', label: 'MARCH' },
        { value: '04', label: 'APRIL' },
        { value: '05', label: 'MAY' },
        { value: '06', label: 'JUNE' },
        { value: '07', label: 'JULY' },
        { value: '08', label: 'AUGUST' },
        { value: '09', label: 'SEPTEMBER' },
        { value: '10', label: 'OCTOBER' },
        { value: '11', label: 'NOVEMBER' },
        { value: '12', label: 'DECEMBER' }
    ];

    return (
        <div className='space-y-6'>
            <Card>
                <CardHeader>
                    <CardTitle>Calendar of Events</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <div className='space-y-2'>
                            <div className='font-semibold text-sm'>
                                Academic Year <span className='text-red-500'>*</span>
                            </div>
                            <Select value={academicYear} onValueChange={handleYearChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {initialData.coeyearlist.map((year) => (
                                        <SelectItem key={year.asmaY_Id} value={String(year.asmaY_Id)}>
                                            {year.asmaY_Year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2'>
                            <div className='font-semibold text-sm'>
                                Month <span className='text-red-500'>*</span>
                            </div>
                            <Select value={month} onValueChange={handleMonthChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Month' />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((m) => (
                                        <SelectItem key={m.value} value={m.value}>
                                            {m.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className='pt-6'>
                    <DataTable columns={columns} data={events} totalItems={events.length} isLoading={loading} />
                </CardContent>
            </Card>
        </div>
    );
}

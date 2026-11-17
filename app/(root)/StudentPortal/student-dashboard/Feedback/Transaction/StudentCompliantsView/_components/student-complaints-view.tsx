'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { getStudentComplaintsReport } from '../actions';
import type { AcademicYear, StudentComplaint } from '../types';
import { columns } from './columns';

interface StudentComplaintsViewClientProps {
    initialYears: AcademicYear[];
    initialData: StudentComplaint[];
    initialYearId: number;
}

export default function StudentComplaintsViewClient({ initialYears, initialData, initialYearId }: StudentComplaintsViewClientProps) {
    const [years] = useState<AcademicYear[]>(initialYears);
    const [selectedYear, setSelectedYear] = useState<string>(String(initialYearId));
    const [data, setData] = useState<StudentComplaint[]>(initialData);
    const [isLoading, setIsLoading] = useState(false);

    const handleYearChange = async (yearId: string) => {
        setSelectedYear(yearId);
        setIsLoading(true);
        try {
            const response = await getStudentComplaintsReport({ ASMAY_Id: Number(yearId) });
            if (response?.studentdivlist) {
                setData(response.studentdivlist);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='space-y-6'>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center justify-between'>
                        <span>STUDENT DISCIPLINE</span>
                        {/* Collapse button logic is typically handled by Collapsible component, omitting for MVP unless requested */}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex justify-center'>
                        <div className='w-full max-w-md space-y-2'>
                            <div className='flex items-center space-x-2'>
                                <span className='whitespace-nowrap font-semibold'>
                                    Year:<span className='text-red-500'>*</span>
                                </span>
                                <Select value={selectedYear} onValueChange={handleYearChange}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='--Select--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year.asmaY_Id} value={String(year.asmaY_Id)}>
                                                {year.asmaY_Year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {data.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable<StudentComplaint, unknown>
                            columns={columns}
                            data={data}
                            isSearchRequired={true}
                            isPaginationRequired={true}
                            isLoading={isLoading}
                            totalItems={data.length}
                            manualPagination={false}
                        />
                    </CardContent>
                </Card>
            )}

            {data.length === 0 && !isLoading && <div className='p-4 text-center text-muted-foreground'>No Records Found</div>}
        </div>
    );
}

'use client';

import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeeDefaulterReport } from '@/hooks/fees/useReports';
import { getTransportApprovedHistory } from '@/server/transport/transport-module/transaction/transport-approve';
import { useEffect, useState } from 'react';
import { approvedListColumns } from './columns';

export default function ApprovedList() {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);

    const { data: yearsResponse } = useFeeDefaulterReport();
    const academicYears = Array.isArray(yearsResponse) ? yearsResponse : yearsResponse?.data || [];

    useEffect(() => {
        if (academicYears.length > 0 && !selectedYear) {
            const defaultYear = academicYears[0].asmaY_Id;
            setSelectedYear(defaultYear);
        }
    }, [academicYears, selectedYear]);

    useEffect(() => {
        if (selectedYear) {
            loadHistory(selectedYear);
        }
    }, [selectedYear]);

    const loadHistory = async (yearId: number) => {
        setIsLoading(true);
        try {
            const response = await getTransportApprovedHistory(yearId);
            if (response && response.data) {
                setData(response.data);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error(error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleYearChange = (val: string) => {
        const year = Number(val);
        setSelectedYear(year);
    };

    return (
        <div className='space-y-4'>
            <div className='flex w-full items-center space-x-4 md:w-1/3'>
                <label className='font-medium text-sm'>Academic Year:</label>
                <Select value={selectedYear?.toString()} onValueChange={handleYearChange}>
                    <SelectTrigger>
                        <SelectValue placeholder='Select Year' />
                    </SelectTrigger>
                    <SelectContent>
                        {academicYears.map((year: any) => (
                            <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                {year.asmaY_Year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <GenericDataTable
                data={data}
                columns={approvedListColumns}
                total={data.length}
                isLoading={isLoading}
                loadingMessage='Loading history...'
                noDataTitle='No Approved/Rejected Records'
            />
        </div>
    );
}

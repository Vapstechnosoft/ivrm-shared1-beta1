'use client';

import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IFeeDetailsData } from '@/types/student-portal/masters/cumulative-fee-analysis';

interface StudentFeeDetailsTableProps {
    data: IFeeDetailsData[];
}

export function StudentFeeDetailsTable({ data }: StudentFeeDetailsTableProps) {
    const [sortConfig, setSortConfig] = useState<{ key: keyof IFeeDetailsData; direction: 'asc' | 'desc' } | null>(null);

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof IFeeDetailsData) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    if (!data || data.length === 0) return null;

    return (
        <Card className='mt-6 overflow-hidden'>
            <CardContent className='overflow-x-auto p-0'>
                <Table className='bordered min-w-max text-center'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='border text-center'>
                                <Button
                                    variant='ghost'
                                    onClick={() => handleSort('fmH_FeeName')}
                                    className='font-bold hover:bg-transparent'>
                                    FEE HEAD <ArrowUpDown className='ml-2 h-4 w-4' />
                                </Button>
                            </TableHead>
                            <TableHead className='border text-center'>
                                <Button variant='ghost' onClick={() => handleSort('ftI_Name')} className='font-bold hover:bg-transparent'>
                                    TERM <ArrowUpDown className='ml-2 h-4 w-4' />
                                </Button>
                            </TableHead>
                            <TableHead className='border text-center'>
                                <Button
                                    variant='ghost'
                                    onClick={() => handleSort('fsS_CurrentYrCharges')}
                                    className='font-bold hover:bg-transparent'>
                                    NET AMOUNT <ArrowUpDown className='ml-2 h-4 w-4' />
                                </Button>
                            </TableHead>
                            <TableHead className='border text-center'>
                                <Button
                                    variant='ghost'
                                    onClick={() => handleSort('fsS_ConcessionAmount')}
                                    className='font-bold hover:bg-transparent'>
                                    CONCESSION <ArrowUpDown className='ml-2 h-4 w-4' />
                                </Button>
                            </TableHead>
                            <TableHead className='border text-center'>
                                <Button
                                    variant='ghost'
                                    onClick={() => handleSort('fsS_PaidAmount')}
                                    className='font-bold hover:bg-transparent'>
                                    PAID <ArrowUpDown className='ml-2 h-4 w-4' />
                                </Button>
                            </TableHead>
                            <TableHead className='border text-center'>
                                <Button
                                    variant='ghost'
                                    onClick={() => handleSort('fsS_ToBePaid')}
                                    className='font-bold hover:bg-transparent'>
                                    BALANCE <ArrowUpDown className='ml-2 h-4 w-4' />
                                </Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className='border'>{item.fmH_FeeName}</TableCell>
                                <TableCell className='border'>{item.ftI_Name}</TableCell>
                                <TableCell className='border'>{item.fsS_CurrentYrCharges}</TableCell>
                                <TableCell className='border'>{item.fsS_ConcessionAmount}</TableCell>
                                <TableCell className='border'>{item.fsS_PaidAmount}</TableCell>
                                <TableCell className='border'>{item.fsS_ToBePaid}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

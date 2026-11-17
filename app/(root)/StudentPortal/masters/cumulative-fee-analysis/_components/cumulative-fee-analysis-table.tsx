'use client';

import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IFeeAnalysisData } from '@/types/student-portal/masters/cumulative-fee-analysis';

interface CumulativeFeeAnalysisTableProps {
    data: IFeeAnalysisData[];
}

export function CumulativeFeeAnalysisTable({ data }: CumulativeFeeAnalysisTableProps) {
    const [sortConfig, setSortConfig] = useState<{ key: keyof IFeeAnalysisData; direction: 'asc' | 'desc' } | null>(null);

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof IFeeAnalysisData) => {
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
                                <Button variant='ghost' onClick={() => handleSort('asmaY_Year')} className='font-bold hover:bg-transparent'>
                                    ACADEMIC YEAR <ArrowUpDown className='ml-2 h-4 w-4' />
                                </Button>
                            </TableHead>
                            <TableHead className='border text-center'>
                                <Button variant='ghost' onClick={() => handleSort('receivable')} className='font-bold hover:bg-transparent'>
                                    SCHOOL RECEIVABLE <ArrowUpDown className='ml-2 h-4 w-4' />
                                </Button>
                            </TableHead>
                            <TableHead className='border text-center'>
                                <Button variant='ghost' onClick={() => handleSort('concession')} className='font-bold hover:bg-transparent'>
                                    CONCESSION <ArrowUpDown className='ml-2 h-4 w-4' />
                                </Button>
                            </TableHead>
                            <TableHead className='border text-center'>
                                <Button variant='ghost' onClick={() => handleSort('collection')} className='font-bold hover:bg-transparent'>
                                    COLLECTION <ArrowUpDown className='ml-2 h-4 w-4' />
                                </Button>
                            </TableHead>
                            <TableHead className='border text-center'>
                                <Button variant='ghost' onClick={() => handleSort('adjusted')} className='font-bold hover:bg-transparent'>
                                    ADJUSTMENT <ArrowUpDown className='ml-2 h-4 w-4' />
                                </Button>
                            </TableHead>
                            <TableHead className='border text-center'>
                                <Button variant='ghost' onClick={() => handleSort('balance')} className='font-bold hover:bg-transparent'>
                                    BALANCE <ArrowUpDown className='ml-2 h-4 w-4' />
                                </Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className='border'>{item.asmaY_Year}</TableCell>
                                <TableCell className='border'>{item.receivable}</TableCell>
                                <TableCell className='border'>{item.concession}</TableCell>
                                <TableCell className='border'>{item.collection}</TableCell>
                                <TableCell className='border'>{item.adjusted}</TableCell>
                                <TableCell className='border'>{item.balance}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

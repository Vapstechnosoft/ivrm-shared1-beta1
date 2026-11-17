'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { IAlumniList } from '@/types/alumni/alumni-dashboard';
import { ChevronLeft, ChevronRight, Search, Users } from 'lucide-react';
import { useState } from 'react';

interface TotalAlumniListProps {
    alumni: IAlumniList[];
    totalCount: number;
}

export default function TotalAlumniList({ alumni, totalCount }: TotalAlumniListProps) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredAlumni = alumni.filter(
        (a) =>
            a.Name?.toLowerCase().includes(search.toLowerCase()) ||
            a.ALMST_AdmNo?.toLowerCase().includes(search.toLowerCase()) ||
            a.ASMAY_Year?.toLowerCase().includes(search.toLowerCase()) ||
            a.classname?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAlumni = filteredAlumni.slice(startIndex, startIndex + itemsPerPage);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    return (
        <Card className='mt-8 border-none shadow-xl ring-1 ring-black/5'>
            <CardHeader className='flex flex-row items-center justify-between border-b bg-indigo-50/50 p-6'>
                <div className='space-y-1'>
                    <CardTitle className='flex items-center font-bold text-2xl text-indigo-900'>
                        <Users className='mr-3 h-8 w-8 text-indigo-600' />
                        TOTAL ALUMNI LIST
                    </CardTitle>
                    <p className='text-muted-foreground text-sm'>
                        Showing <span className='font-bold text-indigo-600'>{totalCount}</span> registered alumni
                    </p>
                </div>
                <div className='relative w-80'>
                    <Search className='absolute top-3 left-3 h-4 w-4 text-muted-foreground' />
                    <Input
                        placeholder='Search alumni by name, admin no...'
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className='border-indigo-100 bg-white pl-10 focus:border-indigo-300 focus:ring-indigo-100'
                    />
                </div>
            </CardHeader>
            <CardContent className='p-0'>
                <div className='max-h-[600px] overflow-auto'>
                    <table className='w-full border-collapse text-sm'>
                        <thead className='sticky top-0 z-10'>
                            <tr className='bg-indigo-50 font-bold text-indigo-900'>
                                <th className='p-4 text-left'>SL.NO.</th>
                                <th className='p-4 text-left'>STUDENT NAME</th>
                                <th className='p-4 text-left'>ADMISSION NO.</th>
                                <th className='p-4 text-center'>YEAR</th>
                                <th className='p-4 text-left'>CLASS</th>
                                <th className='p-4 text-left'>MOBILE</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-indigo-50'>
                            {paginatedAlumni.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className='p-20 text-center text-muted-foreground'>
                                        <div className='flex animate-pulse flex-col items-center justify-center opacity-40'>
                                            <Users className='mb-4 h-16 w-16 text-indigo-300' />
                                            <p className='font-medium text-lg'>No alumni found matching your search</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedAlumni.map((a, idx) => (
                                    <tr key={idx} className='group transition-all hover:bg-indigo-50/30'>
                                        <td className='w-16 p-4 text-center font-medium text-muted-foreground'>{startIndex + idx + 1}</td>
                                        <td className='p-4 font-semibold text-indigo-900 duration-200 group-hover:text-indigo-600'>
                                            {a.Name}
                                        </td>
                                        <td className='p-4 text-muted-foreground'>{a.ALMST_AdmNo}</td>
                                        <td className='p-4 text-center'>
                                            <span className='inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 font-medium text-indigo-700 text-xs ring-1 ring-indigo-700/10 ring-inset'>
                                                {a.ASMAY_Year}
                                            </span>
                                        </td>
                                        <td className='p-4 text-muted-foreground'>{a.classname}</td>
                                        <td className='p-4 font-mono text-indigo-600 text-xs'>{a.ALMST_MobileNo}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {filteredAlumni.length > itemsPerPage && (
                    <div className='flex items-center justify-between border-indigo-50 border-t bg-white px-6 py-4'>
                        <div className='text-muted-foreground text-sm'>
                            Showing <span className='font-medium text-indigo-600'>{startIndex + 1}</span> to{' '}
                            <span className='font-medium text-indigo-600'>
                                {Math.min(startIndex + itemsPerPage, filteredAlumni.length)}
                            </span>{' '}
                            of <span className='font-medium text-indigo-600'>{filteredAlumni.length}</span> results
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className='border-indigo-100 hover:bg-indigo-50'>
                                <ChevronLeft className='mr-1 h-4 w-4' /> Previous
                            </Button>
                            <div className='flex items-center space-x-1'>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum: number;
                                    if (totalPages <= 5) pageNum = i + 1;
                                    else if (currentPage <= 3) pageNum = i + 1;
                                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                    else pageNum = currentPage - 2 + i;

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? 'default' : 'outline'}
                                            size='sm'
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-9 ${currentPage === pageNum ? 'bg-indigo-600' : 'border-indigo-100 hover:bg-indigo-50'}`}>
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className='border-indigo-100 hover:bg-indigo-50'>
                                Next <ChevronRight className='ml-1 h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

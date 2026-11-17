'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IMobileMasterPage } from '@/types/super-admin/configuration-setting/mobilemasterpage';
import { ChevronLeft, ChevronRight, Pencil, Search, Trash2 } from 'lucide-react';

interface MobileMasterPageGridProps {
    data: IMobileMasterPage[];
    total: number;
    currentPage: number;
    pageSize: number;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onPageChange: (page: number) => void;
    onEdit: (row: IMobileMasterPage) => void;
    onDelete: (row: IMobileMasterPage) => void;
}

export function MobileMasterPageGrid({
    data,
    total,
    currentPage,
    pageSize,
    searchTerm,
    onSearchChange,
    onPageChange,
    onEdit,
    onDelete
}: MobileMasterPageGridProps) {
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (currentPage - 1) * pageSize;

    return (
        <Card className='w-full'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
                <CardTitle className='font-bold text-[#7C3AED] text-xl'>Mobile App Master Pages</CardTitle>
                <div className='relative w-72'>
                    <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
                    <Input
                        placeholder='Search here...'
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className='border-[#7C3AED]/20 pl-9 focus:border-[#7C3AED]'
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className='overflow-hidden rounded-md border border-[#7C3AED]/10'>
                    <Table>
                        <TableHeader className='bg-[#7C3AED] hover:bg-[#7C3AED]'>
                            <TableRow>
                                <TableHead className='w-20 text-center font-bold text-white'>SL.NO</TableHead>
                                <TableHead className='font-bold text-white'>Page Name</TableHead>
                                <TableHead className='font-bold text-white'>Page Displayname</TableHead>
                                <TableHead className='w-32 text-center font-bold text-white'>Edit/Delete</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((row, index) => (
                                    <TableRow key={row.ivrmmaP_Id} className='border-[#7C3AED]/5 border-b hover:bg-[#F3E8FF]/50'>
                                        <TableCell className='text-center font-medium'>{startIndex + index + 1}</TableCell>
                                        <TableCell className='font-medium text-[#1E293B]'>{row.ivrmmaP_AppPageName}</TableCell>
                                        <TableCell className='text-[#475569]'>{row.ivrmmaP_Displayname}</TableCell>
                                        <TableCell className='text-center'>
                                            <div className='flex justify-center gap-2'>
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    onClick={() => onEdit(row)}
                                                    className='h-8 w-8 text-[#7C3AED] hover:bg-[#F3E8FF] hover:text-[#6D28D9]'
                                                    title='Edit'>
                                                    <Pencil className='h-4 w-4' />
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    onClick={() => onDelete(row)}
                                                    className='h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700'
                                                    title='Delete'>
                                                    <Trash2 className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className='h-24 text-center text-muted-foreground'>
                                        No master pages found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className='flex items-center justify-between space-x-2 py-4'>
                        <div className='text-muted-foreground text-sm'>
                            Showing {startIndex + 1} to {Math.min(startIndex + data.length, total)} of {total} entries
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className='border-[#7C3AED] text-[#7C3AED] hover:bg-[#F3E8FF]'>
                                <ChevronLeft className='mr-1 h-4 w-4' />
                                Previous
                            </Button>
                            <div className='flex items-center gap-1'>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    // Basic pagination window logic
                                    let pageNum = currentPage;
                                    if (currentPage <= 3) pageNum = i + 1;
                                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                    else pageNum = currentPage - 2 + i;

                                    if (pageNum <= 0 || pageNum > totalPages) return null;

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? 'default' : 'outline'}
                                            size='sm'
                                            onClick={() => onPageChange(pageNum)}
                                            className={
                                                currentPage === pageNum
                                                    ? 'bg-[#7C3AED] hover:bg-[#6D28D9]'
                                                    : 'border-[#7C3AED] text-[#7C3AED] hover:bg-[#F3E8FF]'
                                            }>
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className='border-[#7C3AED] text-[#7C3AED] hover:bg-[#F3E8FF]'>
                                Next
                                <ChevronRight className='ml-1 h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

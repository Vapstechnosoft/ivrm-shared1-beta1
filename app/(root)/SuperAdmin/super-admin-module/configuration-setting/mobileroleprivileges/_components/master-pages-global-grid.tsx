'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { IMasterPageRecord } from '@/types/super-admin/configuration-setting/mobileroleprivileges';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';

interface MasterPagesGlobalGridProps {
    data: IMasterPageRecord[];
    totalCount: number;
    onSelect: (item: IMasterPageRecord, isChecked: boolean) => void;
    isLoading?: boolean;
}

export function MasterPagesGlobalGrid({ data, totalCount, onSelect, isLoading }: MasterPagesGlobalGridProps) {
    // These states are synced with page.tsx
    const [page, setPage] = useQueryState('mp_page', parseAsInteger.withDefault(1));
    const [pageSize, setPageSize] = useQueryState('mp_page_size', parseAsInteger.withDefault(10));
    const [search, setSearch] = useQueryState('mp_search', parseAsString.withDefault(''));

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <Card className='w-full border-blue-500 border-t-4 shadow-lg transition-all duration-300 hover:shadow-xl'>
            <CardHeader className='bg-slate-50/50 pb-4'>
                <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
                    <CardTitle className='flex items-center font-bold text-slate-800 text-xl'>
                        <div className='mr-3 h-8 w-2 rounded-full bg-blue-500' />
                        Master Pages
                    </CardTitle>
                    <div className='relative w-full md:w-72'>
                        <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-slate-400' />
                        <InputText
                            placeholder='Search master pages...'
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1); // Reset to first page on search
                            }}
                            className='border-slate-200 bg-white pl-10'
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className='p-0'>
                <div className='overflow-x-auto'>
                    <Table>
                        <TableHeader>
                            <TableRow className='bg-slate-50/50 hover:bg-slate-50/50'>
                                <TableHead className='w-20 font-bold text-slate-700'>SL.NO</TableHead>
                                <TableHead className='font-bold text-slate-700'>Page Name</TableHead>
                                <TableHead className='w-24 text-center font-bold text-slate-700'>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={3} className='h-12 animate-pulse bg-slate-50/30' />
                                    </TableRow>
                                ))
                            ) : data.length > 0 ? (
                                data.map((item, index) => (
                                    <TableRow key={item.ivrmmaP_Id} className='transition-colors hover:bg-slate-50/40'>
                                        <TableCell className='font-medium text-slate-600'>{(page - 1) * pageSize + index + 1}</TableCell>
                                        <TableCell className='text-slate-700'>{item.ivrmmaP_AppPageName}</TableCell>
                                        <TableCell className='flex justify-center'>
                                            <Checkbox onCheckedChange={(checked) => onSelect(item, !!checked)} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className='h-32 text-center text-slate-400 italic'>
                                        No master pages found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Custom Pagination */}
                <div className='flex flex-col items-center justify-between gap-4 border-t bg-slate-50/30 p-4 sm:flex-row'>
                    <p className='font-medium text-slate-500 text-sm'>
                        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} entries
                    </p>
                    <div className='flex items-center gap-2'>
                        <Button variant='outline' size='icon' className='h-8 w-8' onClick={() => setPage(1)} disabled={page === 1}>
                            <ChevronsLeft className='h-4 w-4' />
                        </Button>
                        <Button
                            variant='outline'
                            size='icon'
                            className='h-8 w-8'
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}>
                            <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <span className='px-2 font-bold text-slate-700 text-sm'>
                            Page {page} of {totalPages || 1}
                        </span>
                        <Button
                            variant='outline'
                            size='icon'
                            className='h-8 w-8'
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages || totalPages === 0}>
                            <ChevronRight className='h-4 w-4' />
                        </Button>
                        <Button
                            variant='outline'
                            size='icon'
                            className='h-8 w-8'
                            onClick={() => setPage(totalPages)}
                            disabled={page === totalPages || totalPages === 0}>
                            <ChevronsRight className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

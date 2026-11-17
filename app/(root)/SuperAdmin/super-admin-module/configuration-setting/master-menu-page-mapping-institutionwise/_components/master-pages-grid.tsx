'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { MasterPageDTO } from '@/types/super-admin/configuration-setting/master-menu-page-mapping-institutionwise';
import { Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MasterPagesGridProps {
    data: MasterPageDTO[];
    onToggleRow: (row: MasterPageDTO) => void;
    onDisplayNameChange: (row: MasterPageDTO, displayName: string) => void;
    isLoading?: boolean;
}

export default function MasterPagesGrid({ data, onToggleRow, onDisplayNameChange, isLoading }: MasterPagesGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState<MasterPageDTO[]>(data);

    useEffect(() => {
        const filtered = data.filter((item) => item.pagename.toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredData(filtered);
    }, [searchQuery, data]);

    return (
        <div className='mt-6 space-y-4 border-slate-200 border-t pt-6'>
            <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
                <h3 className='font-bold text-primary text-xl'>Master Pages</h3>
                <div className='relative w-full md:w-72'>
                    <Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
                    <Input
                        placeholder='search here...'
                        className='pl-8'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className='relative min-h-[150px] overflow-hidden rounded-md border shadow-sm'>
                {isLoading && (
                    <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/50'>
                        <Loader2 className='h-10 w-10 animate-spin text-primary' />
                    </div>
                )}
                <Table>
                    <TableHeader className='bg-slate-50 font-bold'>
                        <TableRow>
                            <TableHead className='w-16 text-center font-bold text-primary'>SL.NO</TableHead>
                            <TableHead className='font-bold text-primary'>Page Name</TableHead>
                            <TableHead className='font-bold text-primary'>Display Name</TableHead>
                            <TableHead className='w-20 text-center font-bold text-primary'>Select</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <TableRow key={item.ivrmP_Id}>
                                    <TableCell className='text-center'>{index + 1}</TableCell>
                                    <TableCell className='font-medium'>{item.pagename}</TableCell>
                                    <TableCell>
                                        <Input
                                            value={item.displayname || ''}
                                            onChange={(e) => onDisplayNameChange(item, e.target.value)}
                                            placeholder='Enter Display Name'
                                            className='h-8 max-w-[250px]'
                                        />
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        <Checkbox checked={!!item.checked} onCheckedChange={() => onToggleRow(item)} title='Add Cart' />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className='h-24 text-center text-muted-foreground italic'>
                                    {isLoading ? 'Fetching pages...' : 'No pages found.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

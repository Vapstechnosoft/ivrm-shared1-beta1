'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { SavedMappingDTO } from '@/types/super-admin/configuration-setting/master-menu-page-mapping-institutionwise';
import { Eraser, ListOrdered, Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SavedMappingGridProps {
    data: SavedMappingDTO[];
    isLoading?: boolean;
    onSetOrder: () => void;
    onClear: () => void;
}

export default function SavedMappingGrid({ data, isLoading, onSetOrder, onClear }: SavedMappingGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState<SavedMappingDTO[]>(data);

    useEffect(() => {
        const filtered = data.filter(
            (item) =>
                item.pagename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.submenuname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.modulename.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchQuery, data]);

    return (
        <div className='mt-6 space-y-4 border-slate-200 border-t pt-6'>
            <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
                <h3 className='font-bold text-primary text-xl'>Saved Master Menu/Sub Menu Mapping</h3>
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
                            <TableHead className='font-bold text-primary'>Sub Menu Name</TableHead>
                            <TableHead className='font-bold text-primary'>Module Name</TableHead>
                            <TableHead className='font-bold text-primary'>Page Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <TableRow key={`${item.ivrmmmpmI_Id || 'saved'}-${item.ivrmP_Id}-${item.ivrmmmI_Id}`}>
                                    <TableCell className='text-center'>{index + 1}</TableCell>
                                    <TableCell>{item.submenuname}</TableCell>
                                    <TableCell>{item.modulename}</TableCell>
                                    <TableCell>{item.displayname || item.pagename}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className='h-24 text-center text-muted-foreground italic'>
                                    {isLoading ? 'Fetching mappings...' : 'No saved record available'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className='flex justify-center gap-4 pt-4'>
                {data.length > 0 && (
                    <Button onClick={onSetOrder} className='flex items-center gap-2 px-8'>
                        <ListOrdered className='h-4 w-4' />
                        Set order
                    </Button>
                )}
                <Button variant='outline' onClick={onClear} className='flex items-center gap-2 px-8'>
                    <Eraser className='h-4 w-4' />
                    Clear
                </Button>
            </div>
        </div>
    );
}

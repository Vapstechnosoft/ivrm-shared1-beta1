'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { GridDetailDTO } from '@/types/super-admin/configuration-setting/master-menu-page-mapping-institutionwise';
import { Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DeleteMappingGridProps {
    data: GridDetailDTO[];
    onDelete: (data: GridDetailDTO[]) => void;
    onCancel: () => void;
}

export default function DeleteMappingGrid({ data, onDelete, onCancel }: DeleteMappingGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState<GridDetailDTO[]>(data);

    useEffect(() => {
        const filtered = data.filter(
            (item) =>
                item.pagename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.submenuname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.modulename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.mI_Name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchQuery, data]);

    if (data.length === 0) return null;

    return (
        <div className='mt-6 space-y-4 border-red-100 border-t-2 pt-6'>
            <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
                <h3 className='font-bold text-red-600 text-xl'>Deleting Saved Pages</h3>
                <div className='relative w-full md:w-72'>
                    <Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
                    <Input
                        placeholder='search here..'
                        className='border-red-200 pl-8 focus-visible:ring-red-500'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className='overflow-hidden rounded-md border border-red-200 bg-red-50/10 shadow-sm'>
                <Table>
                    <TableHeader className='bg-red-50 font-bold'>
                        <TableRow>
                            <TableHead className='w-16 border-red-200 text-center font-bold text-red-700'>SL.NO</TableHead>
                            <TableHead className='border-red-200 font-bold text-red-700'>Institution Name</TableHead>
                            <TableHead className='border-red-200 font-bold text-red-700'>Sub Menu Name</TableHead>
                            <TableHead className='border-red-200 font-bold text-red-700'>Module Name</TableHead>
                            <TableHead className='border-red-200 font-bold text-red-700'>Page Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((item, index) => (
                            <TableRow key={item.ivrmmmpmI_Id} className='border-red-100 hover:bg-red-50/50'>
                                <TableCell className='text-center'>{index + 1}</TableCell>
                                <TableCell>{item.mI_Name}</TableCell>
                                <TableCell>{item.submenuname}</TableCell>
                                <TableCell>{item.modulename}</TableCell>
                                <TableCell>{item.pagename}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className='mt-6 flex justify-center gap-4 border-red-100 border-t pt-4'>
                <Button onClick={() => onDelete(data)} variant='destructive' className='flex items-center gap-2 px-8 shadow-md'>
                    <Trash2 className='h-4 w-4' />
                    Delete
                </Button>
                <Button variant='outline' onClick={onCancel} className='flex items-center gap-2 border-slate-300 px-8 hover:bg-slate-100'>
                    <X className='h-4 w-4' />
                    Cancel
                </Button>
            </div>
        </div>
    );
}

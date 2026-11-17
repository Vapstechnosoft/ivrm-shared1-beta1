'use client';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import type { MasterMainMenuINSDTO } from '@/types/super-admin/configuration-setting/master-main-menu-ins';
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Minus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MainMenuGridProps {
    data: MasterMainMenuINSDTO[];
    onDelete: (item: MasterMainMenuINSDTO) => void;
    onOrder?: () => void;
    onClear?: () => void;
}

export default function MainMenuGrid({ data: initialData, onDelete, onOrder, onClear }: MainMenuGridProps) {
    const [data, setData] = useState<MasterMainMenuINSDTO[]>(initialData);
    const [isOpen, setIsOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    // Filtering
    const filteredData = data.filter((item) =>
        Object.values(item).some((val) => typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (key: keyof MasterMainMenuINSDTO) => {
        const sorted = [...data].sort((a, b) => {
            const valA = a[key] ?? '';
            const valB = b[key] ?? '';
            if (valA < valB) return -1;
            if (valA > valB) return 1;
            return 0;
        });
        setData(sorted);
    };

    return (
        <div className='box box-primary mt-4 rounded-md border shadow-sm'>
            <div className='box-header with-border flex items-center justify-between border-b bg-gray-50 p-3'>
                <h3 className='box-title font-medium text-lg'>Institute Main Menu List</h3>
                <div className='box-tools pull-right'>
                    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                        <CollapsibleTrigger asChild>
                            <Button variant='ghost' size='sm' className='btn-box-tool'>
                                <Minus className='h-4 w-4' />
                            </Button>
                        </CollapsibleTrigger>
                    </Collapsible>
                </div>
            </div>

            <Collapsible open={isOpen}>
                <CollapsibleContent>
                    <div className='box-body p-4'>
                        {/* Search Bar */}
                        <div className='row mb-4 flex justify-end'>
                            <div className='col-sm-4'>
                                <div className='form-group'>
                                    <div className='relative'>
                                        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                                            <Search className='h-4 w-4 text-gray-400' />
                                        </div>
                                        <Input
                                            type='text'
                                            className='pl-10'
                                            placeholder='search here...'
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className='overflow-x-auto'>
                            <table className='table-hover table-bordered table w-full border-collapse text-left text-sm'>
                                <thead className='bg-gray-100 text-center font-bold'>
                                    <tr>
                                        <th className='border p-2'>SL.NO</th>
                                        <th className='cursor-pointer border p-2 text-blue-600' onClick={() => handleSort('mI_Name')}>
                                            Institution Name <ArrowUpDown className='ml-1 inline h-3 w-3' />
                                        </th>
                                        <th className='cursor-pointer border p-2 text-blue-600' onClick={() => handleSort('modulename')}>
                                            Module Name <ArrowUpDown className='ml-1 inline h-3 w-3' />
                                        </th>
                                        <th
                                            className='cursor-pointer border p-2 text-blue-600'
                                            onClick={() => handleSort('ivrmmmI_MenuName')}>
                                            Main Menu Name <ArrowUpDown className='ml-1 inline h-3 w-3' />
                                        </th>
                                        <th className='border p-2 text-center'>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((item, index) => (
                                        <tr key={`main-${item.ivrmmmI_Id}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className='border p-2 text-center'>{startIndex + index + 1}</td>
                                            <td className='border p-2 text-center'>{item.mI_Name}</td>
                                            <td className='border p-2 text-center'>{item.modulename}</td>
                                            <td className='border p-2 text-center'>{item.ivrmmmI_MenuName}</td>
                                            <td className='border p-2 text-center'>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    className='text-red-500 hover:bg-red-50 hover:text-red-700'
                                                    onClick={() => onDelete(item)}>
                                                    <Trash2 className='h-4 w-4' />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {paginatedData.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className='p-4 text-center'>
                                                No Data Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className='mt-4 mb-4 flex items-center justify-between'>
                            <div className='text-muted-foreground text-sm'>
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of{' '}
                                {filteredData.length} entries
                            </div>
                            <div className='flex items-center space-x-2'>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='h-8 w-8'
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}>
                                    <ChevronsLeft className='h-4 w-4' />
                                </Button>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='h-8 w-8'
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}>
                                    <ChevronLeft className='h-4 w-4' />
                                </Button>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='h-8 w-8'
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}>
                                    <ChevronRight className='h-4 w-4' />
                                </Button>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='h-8 w-8'
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}>
                                    <ChevronsRight className='h-4 w-4' />
                                </Button>
                            </div>
                        </div>

                        <hr className='my-4' />

                        {/* Footer Buttons */}
                        {data.length > 0 && (
                            <div className='flex justify-center gap-4'>
                                {onOrder && (
                                    <Button className='bg-blue-600 text-white hover:bg-blue-700' onClick={onOrder}>
                                        Set order
                                    </Button>
                                )}
                                {onClear && (
                                    <Button variant='secondary' className='bg-red-500 text-white hover:bg-red-600' onClick={onClear}>
                                        <X className='mr-2 h-4 w-4' /> Clear
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}

'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';

import type { IMappingGridItem } from '@/types/lesson-planner/transactions/school-master-unit-topic-mapping';

interface MappingListProps {
    data: IMappingGridItem[];
    onToggleActive: (item: IMappingGridItem) => Promise<void>;
}

export default function MappingList({ data, onToggleActive }: MappingListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [itemToToggle, setItemToToggle] = useState<IMappingGridItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const findValue = (obj: any, keys: string[]) => {
        if (!obj) return null;
        for (const key of keys) {
            if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
        }
        return null; // Return null instead of empty string for consistency
    };

    // Filter data
    const filteredData = data.filter((item) => {
        const unitName = findValue(item, ['lpmU_UnitName', 'LPMU_UnitName', 'unitName']) || '';
        const topicName = findValue(item, ['lpmT_TopicName', 'LPMT_TopicName', 'topicName']) || '';

        const searchLower = searchTerm.toLowerCase();
        return unitName.toLowerCase().includes(searchLower) || topicName.toLowerCase().includes(searchLower);
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleConfirmToggle = async () => {
        if (itemToToggle) {
            await onToggleActive(itemToToggle);
            setItemToToggle(null);
            setIsDialogOpen(false);
        }
    };

    const initiateToggle = (item: IMappingGridItem) => {
        setItemToToggle(item);
        setIsDialogOpen(true);
    };

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <div className='flex w-full max-w-sm items-center space-x-2'>
                    <Search className='h-4 w-4 text-muted-foreground' />
                    <Input
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                        className='max-w-xs'
                    />
                </div>
                <div className='flex items-center space-x-2'>
                    <span className='text-muted-foreground text-sm'>Rows per page</span>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(val) => {
                            setItemsPerPage(Number(val));
                            setCurrentPage(1);
                        }}>
                        <SelectTrigger className='w-[70px]'>
                            <SelectValue placeholder='10' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='5'>5</SelectItem>
                            <SelectItem value='10'>10</SelectItem>
                            <SelectItem value='15'>15</SelectItem>
                            <SelectItem value='20'>20</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className='overflow-hidden rounded-md border'>
                <Table>
                    <TableHeader className='bg-muted/50'>
                        <TableRow>
                            <TableHead className='w-[60px] text-center'>SL.NO.</TableHead>
                            <TableHead>Unit Name</TableHead>
                            <TableHead>Topic Name</TableHead>
                            <TableHead className='w-[100px] text-center'>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, index) => {
                                const unitName = findValue(item, ['lpmU_UnitName', 'LPMU_UnitName', 'unitName']);
                                const topicName = findValue(item, ['lpmT_TopicName', 'LPMT_TopicName', 'topicName']);
                                const isActive = findValue(item, ['lpmuT_ActiveFlag', 'activeFlag', 'isActive']);

                                return (
                                    <TableRow key={index}>
                                        <TableCell className='text-center'>{startIndex + index + 1}</TableCell>
                                        <TableCell>{unitName}</TableCell>
                                        <TableCell>{topicName}</TableCell>
                                        <TableCell className='text-center'>
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                className={
                                                    isActive ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'
                                                }
                                                onClick={() => initiateToggle(item)}
                                                title={isActive ? 'Deactivate' : 'Activate'}>
                                                {isActive ? <ToggleRight className='h-6 w-6' /> : <ToggleLeft className='h-6 w-6' />}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className='h-24 text-center'>
                                    No records found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className='flex items-center justify-end space-x-2'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}>
                        <ChevronLeft className='h-4 w-4' />
                        Previous
                    </Button>
                    <div className='font-medium text-sm'>
                        Page {currentPage} of {totalPages}
                    </div>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}>
                        Next
                        <ChevronRight className='h-4 w-4' />
                    </Button>
                </div>
            )}

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Do you want to {itemToToggle?.lpmuT_ActiveFlag ? 'Deactivate' : 'Activate'} this record?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmToggle}
                            className={itemToToggle?.lpmuT_ActiveFlag ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}>
                            Yes, {itemToToggle?.lpmuT_ActiveFlag ? 'Deactivate' : 'Activate'} it!
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

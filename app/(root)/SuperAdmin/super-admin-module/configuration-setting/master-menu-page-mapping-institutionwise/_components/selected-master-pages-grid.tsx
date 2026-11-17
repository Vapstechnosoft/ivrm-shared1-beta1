'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { MasterPageDTO } from '@/types/super-admin/configuration-setting/master-menu-page-mapping-institutionwise';
import { Save, Trash2, X } from 'lucide-react';

interface SelectedMasterPagesGridProps {
    data: MasterPageDTO[];
    onRemove: (row: MasterPageDTO) => void;
    onSave: () => void;
    onCancel: () => void;
    isSaveDisabled?: boolean;
}

export default function SelectedMasterPagesGrid({ data, onRemove, onSave, onCancel, isSaveDisabled }: SelectedMasterPagesGridProps) {
    if (data.length === 0) return null;

    return (
        <div className='mt-6 space-y-6 border-slate-200 border-t pt-6'>
            <div className='flex items-center justify-between'>
                <h3 className='font-bold text-primary text-xl'>Selected Master Pages</h3>
            </div>

            <div className='overflow-hidden rounded-md border shadow-sm'>
                <Table>
                    <TableHeader className='bg-slate-50 font-bold'>
                        <TableRow>
                            <TableHead className='w-16 text-center font-bold text-primary'>SL.NO</TableHead>
                            <TableHead className='font-bold text-primary'>Page Name</TableHead>
                            <TableHead className='font-bold text-primary'>Display Name</TableHead>
                            <TableHead className='w-20 text-center font-bold text-primary'>Remove</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={item.ivrmP_Id}>
                                <TableCell className='text-center'>{index + 1}</TableCell>
                                <TableCell className='font-medium'>{item.pagename}</TableCell>
                                <TableCell>{item.displayname}</TableCell>
                                <TableCell className='text-center'>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        className='text-red-500 hover:bg-red-50 hover:text-red-700'
                                        onClick={() => onRemove(item)}
                                        title='Remove'>
                                        <Trash2 className='h-4 w-4' />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className='flex justify-center gap-4 pt-4'>
                <Button onClick={onSave} disabled={isSaveDisabled} className='flex items-center gap-2 px-8'>
                    <Save className='h-4 w-4' />
                    Save
                </Button>
                <Button variant='outline' onClick={onCancel} className='flex items-center gap-2 px-8'>
                    <X className='h-4 w-4' />
                    Cancel
                </Button>
            </div>
        </div>
    );
}

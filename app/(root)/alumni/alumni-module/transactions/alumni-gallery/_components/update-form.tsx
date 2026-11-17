'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/extension/field';
import { cn } from '@/lib/utils';
import { getCoverModelDetails, toggleAlumniGalleryItem } from '@/server/alumni/alumni-gallery';
import type { IAlumniGallery, IAlumniGalleryDetail } from '@/types/alumni/alumni-gallery';
import { format } from 'date-fns';
import { Eye, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UpdateAlumniGalleryFormProps {
    selectedRow: IAlumniGallery;
    onSuccess?: () => void;
    mI_Id: number;
    className?: string;
}

export default function UpdateAlumniGalleryForm({ selectedRow, className = '' }: UpdateAlumniGalleryFormProps) {
    const [viewData, setViewData] = useState<IAlumniGalleryDetail[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDetails = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getCoverModelDetails(selectedRow.algA_Id);
            console.info('Gallery Detail Response:', res?.data);
            setViewData(res?.data || []);
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        } catch (err: any) {
            toast.error('Failed to load gallery details');
        } finally {
            setLoading(false);
        }
    }, [selectedRow.algA_Id]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleToggleItem = async (itemId: number, type: 'P' | 'V') => {
        try {
            const algaPId = type === 'P' ? itemId : 0;
            const algaVId = type === 'V' ? itemId : 0;
            const res = await toggleAlumniGalleryItem(selectedRow.algA_Id, algaPId, algaVId);
            if (res) {
                toast.success('Item status updated successfully');
                fetchDetails(); // Refresh to show changes if any (or just remove from list if it deactivates)
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to update item status');
        }
    };

    return (
        <div className={cn('space-y-6', className)}>
            <div className='flex flex-col gap-2'>
                <Label className='font-bold text-lg'>Gallery: {selectedRow.algA_GalleryName}</Label>
                <p className='text-muted-foreground text-sm'>Viewing items in this gallery.</p>
            </div>

            {loading ? (
                <div className='flex justify-center p-8'>Loading details...</div>
            ) : (
                <div className='overflow-x-auto'>
                    <table className='w-full border-collapse text-left text-sm'>
                        <thead className='bg-muted/50'>
                            <tr>
                                <th className='border-b p-2 font-medium'>Sl.No</th>
                                <th className='border-b p-2 font-medium'>Gallery Name</th>
                                <th className='border-b p-2 font-medium'>Date</th>
                                <th className='border-b p-2 font-medium'>Time</th>
                                <th className='border-b p-2 font-medium'>Status</th>
                                <th className='border-b p-2 text-center font-medium'>Files</th>
                                <th className='border-b p-2 text-center font-medium'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className='p-4 text-center text-muted-foreground'>
                                        No images or videos found.
                                    </td>
                                </tr>
                            ) : (
                                viewData.map((item, index) => (
                                    <tr key={index} className='transition-colors hover:bg-muted/30'>
                                        <td className='border-b p-2'>{index + 1}</td>
                                        <td className='border-b p-2'>{item.algA_GalleryName}</td>
                                        <td className='border-b p-2'>
                                            {item.algA_Date ? format(new Date(item.algA_Date), 'dd/MM/yyyy') : ''}
                                        </td>
                                        <td className='border-b p-2'>{item.algA_Time}</td>
                                        <td className='border-b p-2'>
                                            <span
                                                className={cn(
                                                    'rounded px-2 py-1 font-semibold text-xs',
                                                    item.algA_ActiveFlag ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                )}>
                                                {item.algA_ActiveFlag ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className='border-b p-2 text-center'>
                                            <div className='flex justify-center'>
                                                {item.algaP_Photos || item.algaV_Videos ? (
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        title='View & Download'
                                                        onClick={() => window.open(item.algaP_Photos || item.algaV_Videos, '_blank')}
                                                        className='h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700'>
                                                        <Eye className='h-4 w-4' />
                                                    </Button>
                                                ) : (
                                                    <span className='text-muted-foreground'>-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className='border-b p-2 text-center'>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() =>
                                                    handleToggleItem((item.algaP_Id || item.algaV_Id)!, item.algaP_Id ? 'P' : 'V')
                                                }
                                                className='text-destructive hover:bg-destructive/10'>
                                                {item.algA_ActiveFlag ? <Trash2 className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

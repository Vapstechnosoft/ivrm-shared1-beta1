'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useMasterEarningsDeductionsOrder } from '@/hooks/hrms/useMasters';
import type { IMasterEarningsDeductionsList } from '@/types/hrms/hrms-config/master';
import { GitCompareArrows, GripVertical } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ReorderEarningsDeductionsForm() {
    const { data: orderListResponse, isFetching, refetchAll, saveOrderMutation } = useMasterEarningsDeductionsOrder();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [orderedItems, setOrderedItems] = useState<IMasterEarningsDeductionsList[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
        refetchAll();
    };

    useEffect(() => {
        if (orderListResponse && isDialogOpen) {
            const list = Array.isArray(orderListResponse) ? orderListResponse : (orderListResponse as any)?.data || [];
            // Sort by order initially if needed, assuming API returns sorted or we sort here
            const sortedList = [...list].sort((a, b) => (a.hrmeD_Order || 0) - (b.hrmeD_Order || 0));
            setOrderedItems(sortedList);
        }
    }, [orderListResponse, isDialogOpen]);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        const newItems = [...orderedItems];
        const draggedItem = newItems[draggedIndex];
        newItems.splice(draggedIndex, 1);
        newItems.splice(index, 0, draggedItem);
        setOrderedItems(newItems);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const onSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        try {
            const payload = orderedItems.map((item, index) => ({
                id: item.hrmeD_Id,
                order: index + 1
            }));

            await saveOrderMutation.mutateAsync(payload);
            toast.success('Order saved successfully');
            setIsDialogOpen(false);
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save order');
        }
    };

    return (
        <>
            <Button type='button' onClick={handleOpenDialog} className='w-fit transition-all duration-200 hover:scale-90'>
                <GitCompareArrows className='h-4 w-4 transition-transform duration-200 group-hover:rotate-90' />
                Set Order
            </Button>

            <AdaptiveDialog title='Reorder Master Earnings & Deductions' isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                    <AdaptiveBody className='flex flex-col gap-5'>
                        {isFetching && orderedItems.length === 0 ? (
                            <div className='flex items-center justify-center p-4'>Loading...</div>
                        ) : (
                            <div className='my-6 max-h-96 space-y-3 overflow-y-auto'>
                                {orderedItems.map((item, index) => (
                                    <div
                                        key={`${item.hrmeD_Id}-${index}`}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className={`flex cursor-move items-center gap-3 rounded-md bg-muted/50 p-3 transition-all ${draggedIndex === index ? 'opacity-50' : 'hover:bg-muted'
                                            }`}>
                                        <GripVertical className='size-4' />
                                        <div className='flex-1 font-medium text-sm'>{item.hrmeD_Name}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </AdaptiveBody>
                    <AdaptiveFooter>
                        <Button variant='secondary' onClick={() => setIsDialogOpen(false)} type='button'>
                            Cancel
                        </Button>
                        <Button type='submit' isLoading={saveOrderMutation.isPending}>
                            Save
                        </Button>
                    </AdaptiveFooter>
                </form>
            </AdaptiveDialog>
        </>
    );
}

'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useCourseSetOrder } from '@/hooks/hrms/useMasters';
import type { IMasterCourseSetOrderList } from '@/types/hrms/hrms-config/master';
import { GitCompareArrows, GripVertical } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ReorderCourseForm() {
    const { data: orderResponse, refetchAll, saveOrderMutation } = useCourseSetOrder();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [orderedItems, setOrderedItems] = useState<IMasterCourseSetOrderList[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleOpenDialog = () => {
        console.log('🔵 [ReorderCourseForm] Opening dialog. Full orderResponse:', JSON.stringify(orderResponse, null, 2));
        const courses = Array.isArray(orderResponse?.data) ? orderResponse.data : [];
        console.log('🔵 [ReorderCourseForm] Extracted courses:', JSON.stringify(courses, null, 2));
        setOrderedItems(courses);
        setIsDialogOpen(true);
    };

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
                id: item.hrmC_Id,
                order: index + 1
            }));

            console.log('📤 [ReorderCourseForm] Submitting payload:', JSON.stringify(payload, null, 2));
            await saveOrderMutation.mutateAsync(payload as any);
            console.log('✅ [ReorderCourseForm] Reorder successful');
            toast.success('Order saved successfully');
            setIsDialogOpen(false);
        } catch (error: any) {
            console.error('❌ [ReorderCourseForm] Reorder failed:', error);
            toast.error(error?.message ?? 'An error occurred');
        }
    };

    return (
        <>
            <Button type='button' onClick={handleOpenDialog} className='w-fit transition-all duration-200 hover:scale-90'>
                <GitCompareArrows className='h-4 w-4 transition-transform duration-200 group-hover:rotate-90' />
                Set Order
            </Button>
            {orderedItems && (
                <AdaptiveDialog title='Reorder Master Course' isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                    <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                        <AdaptiveBody className='flex flex-col gap-5'>
                            <div className='my-6 max-h-96 space-y-3 overflow-y-auto'>
                                {orderedItems.map((item, index) => (
                                    <div
                                        key={`${item.hrmC_Id}-${index}`}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className={`flex cursor-move items-center gap-3 rounded-md bg-muted/50 p-3 transition-all ${draggedIndex === index ? 'opacity-50' : 'hover:bg-muted'
                                            }`}>
                                        <GripVertical className='size-4' />
                                        <div className='flex-1 font-medium text-sm'>{item.hrmC_QulaificationName}</div>
                                    </div>
                                ))}
                            </div>
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
            )}
        </>
    );
}

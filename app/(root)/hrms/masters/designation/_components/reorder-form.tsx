'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useDesignationSetOrder } from '@/hooks/hrms/useMasters';
import { getDesignationSetOrder, updateDesignationSetorder } from '@/server/hrms/hrmsConfig/master/designation';
import type { IMasterDesignationSetOrderList } from '@/types/hrms/hrms-config/master';
import { GitCompareArrows, GripVertical } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ReorderDesignationForm() {
    const { refetchAll } = useDesignationSetOrder();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [orderedItems, setOrderedItems] = useState<IMasterDesignationSetOrderList[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleOpenDialog = async () => {
        try {
            const orderResponse = await getDesignationSetOrder();
            // API returns { success, message, data, total, page, page_size }
            // Extract the data array from the response
            const designations = Array.isArray(orderResponse?.data) ? orderResponse.data : [];
            setOrderedItems(designations);
            setIsDialogOpen(true);
        } catch (error: any) {
            toast.error(error?.message || 'Failed to load designations for reordering');
        }
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
        setIsSaving(true);
        try {
            const payload = orderedItems.map((item, index) => ({
                id: item.hrmdeS_Id,
                order: index + 1
            }));

            const response = await updateDesignationSetorder(payload as any);

            if (response?.success) {
                toast.success(response?.message || 'Order saved successfully');
                setIsDialogOpen(false);
                refetchAll();
            } else {
                toast.error(response?.message || 'Failed to save order');
            }
        } catch (error: any) {
            toast.error(error?.message ?? 'An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Button type='button' onClick={handleOpenDialog} className='w-fit transition-all duration-200 hover:scale-90'>
                <GitCompareArrows className='h-4 w-4 transition-transform duration-200 group-hover:rotate-90' />
                Set Order
            </Button>
            {orderedItems && (
                <AdaptiveDialog title='Reorder Master Designation' isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                    <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                        <AdaptiveBody className='flex flex-col gap-5'>
                            <div className='my-6 max-h-96 space-y-3 overflow-y-auto'>
                                {orderedItems.map((item, index) => (
                                    <div
                                        key={`${item.hrmdeS_Id}-${index}`}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className={`flex cursor-move items-center gap-3 rounded-md bg-muted/50 p-3 transition-all ${
                                            draggedIndex === index ? 'opacity-50' : 'hover:bg-muted'
                                        }`}>
                                        <GripVertical className='size-4' />
                                        <div className='flex-1 font-medium text-sm'>{item.hrmdeS_DesignationName}</div>
                                    </div>
                                ))}
                            </div>
                        </AdaptiveBody>
                        <AdaptiveFooter>
                            <Button variant='secondary' onClick={() => setIsDialogOpen(false)} type='button'>
                                Cancel
                            </Button>
                            <Button type='submit' isLoading={isSaving}>
                                Save
                            </Button>
                        </AdaptiveFooter>
                    </form>
                </AdaptiveDialog>
            )}
        </>
    );
}

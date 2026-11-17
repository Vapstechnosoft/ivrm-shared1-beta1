'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { usePreAdmissionAcademicYear, usePreAdmissionAcademicYearSetOrder } from '@/hooks/admission/preadmission/useConfigurations';
import { getPreAdmissionSetOrder, updateAcademicYearSetorder } from '@/server/admission/preadmission/configuration/academic_year_master';
import type { IMasterSetOrderList } from '@/types/admission/preadmission/configaration';
import { GitCompareArrows, GripVertical } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ReorderAcademicYearForm() {
    const { refetchAll: refetchSetOrder } = usePreAdmissionAcademicYearSetOrder();
    const { refetchAll: refetchMainList } = usePreAdmissionAcademicYear();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [orderedItems, setOrderedItems] = useState<IMasterSetOrderList[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleOpenDialog = async () => {
        try {
            const orderResponse = await getPreAdmissionSetOrder();
            console.log('🔵 [ReorderAcademicYearForm] API Response:', orderResponse);
            const data = orderResponse?.data;
            const items = Array.isArray(data) ? data : (data as any)?.academic_year_order_list || (data as any)?.records || [];
            console.log('🔵 [ReorderAcademicYearForm] Extracted Items:', items);
            setOrderedItems(items);
            setIsDialogOpen(true);
        } catch (error) {
            console.error('🔴 [ReorderAcademicYearForm] Failed to open dialog:', error);
            toast.error('Failed to load academic years for reordering');
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
            // build a simple payload with new order; adjust shape as your API expects
            const payload = orderedItems.map((item, index) => ({
                asmaY_Id: Number(item.asmaY_Id),
                asmaY_Order: index + 1
            }));

            const response = await updateAcademicYearSetorder(payload as any);

            if (response.success) {
                toast.success(response.message || 'Order updated successfully');
                refetchSetOrder();
                refetchMainList();
                setIsDialogOpen(false);
            } else {
                toast.error(response.message || 'Failed to update order');
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
                <AdaptiveDialog title='Reorder Master Academic Year' isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                    <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                        <AdaptiveBody className='flex flex-col gap-5'>
                            <div className='my-6 max-h-96 space-y-3 overflow-y-auto'>
                                {orderedItems.map((item, index) => (
                                    <div
                                        key={`${item.asmaY_Id}-${index}`}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className={`flex cursor-move items-center gap-3 rounded-md bg-muted/50 p-3 transition-all ${draggedIndex === index ? 'opacity-50' : 'hover:bg-muted'
                                            }`}>
                                        <GripVertical className='size-4' />
                                        <div className='flex-1 font-medium text-sm'>{item.asmaY_Year}</div>
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

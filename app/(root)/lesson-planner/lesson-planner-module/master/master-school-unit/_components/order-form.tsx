'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { saveUnitOrder } from '@/server/lesson-planner/master/school-master-unit';
import type { IMasterSchoolUnit } from '@/types/lesson-planner/master/school-master-unit';
import { DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface OrderMasterSchoolUnitFormProps {
    isOpen: boolean;
    onClose: () => void;
    units: IMasterSchoolUnit[];
    onSuccess: () => void;
}

function SortableRow({ unit, index }: { unit: IMasterSchoolUnit; index: number }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: unit.lpmU_Id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <tr ref={setNodeRef} style={style} className='border-b transition-colors hover:bg-muted/30'>
            <td className='p-2 text-left'>{index + 1}</td>
            <td className='p-2 text-left font-medium'>{unit.lpmU_UnitName}</td>
            <td className='p-2 text-left'>{unit.lpmU_UnitDescription || '-'}</td>
            <td className='p-2 text-center'>{unit.lpmU_Order || index + 1}</td>
            <td className='p-2 text-center'>
                <button type='button' {...attributes} {...listeners} className='cursor-grab active:cursor-grabbing'>
                    <GripVertical className='h-5 w-5 text-muted-foreground' />
                </button>
            </td>
        </tr>
    );
}

export default function OrderMasterSchoolUnitForm({ isOpen, onClose, units: initialUnits, onSuccess }: OrderMasterSchoolUnitFormProps) {
    const [units, setUnits] = useState<IMasterSchoolUnit[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    useEffect(() => {
        if (isOpen) {
            setUnits([...initialUnits].sort((a, b) => (a.lpmU_Order || 0) - (b.lpmU_Order || 0)));
        }
    }, [isOpen, initialUnits]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setUnits((items) => {
                const oldIndex = items.findIndex((item) => item.lpmU_Id === active.id);
                const newIndex = items.findIndex((item) => item.lpmU_Id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                // Update order numbers
                return newItems.map((item, index) => ({ ...item, lpmU_Order: index + 1 }));
            });
        }
    };

    const handleSaveOrder = async () => {
        if (units.length === 0) return;
        setIsSaving(true);
        try {
            const orderArray = units.map((unit) => ({
                lpmU_Id: unit.lpmU_Id
            }));

            const res: any = await saveUnitOrder(orderArray);
            if (res?.success || res?.returnval || res?.data?.returnval) {
                toast.success('Order updated successfully');
                onSuccess();
                onClose();
            } else {
                toast.error('Failed to update order');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='flex max-h-[80vh] max-w-4xl flex-col'>
                <DialogHeader>
                    <DialogTitle>Set Unit Order</DialogTitle>
                </DialogHeader>

                <div className='flex-1 overflow-auto rounded-lg border'>
                    {units.length === 0 ? (
                        <div className='flex justify-center p-8 text-muted-foreground'>No units found.</div>
                    ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <table className='w-full border-collapse text-sm'>
                                <thead className='sticky top-0 bg-muted/50'>
                                    <tr>
                                        <th className='border-b p-2 text-left font-medium'>SLNO</th>
                                        <th className='border-b p-2 text-left font-medium'>Unit Name</th>
                                        <th className='border-b p-2 text-left font-medium'>Unit Description</th>
                                        <th className='border-b p-2 text-center font-medium'>Unit Order</th>
                                        <th className='border-b p-2 text-center font-medium'>Drag</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <SortableContext items={units.map((u) => u.lpmU_Id)} strategy={verticalListSortingStrategy}>
                                        {units.map((unit, index) => (
                                            <SortableRow key={unit.lpmU_Id} unit={unit} index={index} />
                                        ))}
                                    </SortableContext>
                                </tbody>
                            </table>
                        </DndContext>
                    )}
                </div>

                <div className='flex justify-end gap-3 pt-4'>
                    <Button type='button' variant='outline' onClick={onClose} disabled={isSaving}>
                        Close
                    </Button>
                    <Button type='button' onClick={handleSaveOrder} disabled={isSaving || units.length === 0} isLoading={isSaving}>
                        <Save className='mr-2 h-4 w-4' /> Save Order
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

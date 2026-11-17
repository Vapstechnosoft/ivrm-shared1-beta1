'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog as ShadcnDialog,
    DialogContent as ShadcnDialogContent,
    DialogFooter as ShadcnDialogFooter,
    DialogHeader as ShadcnDialogHeader,
    DialogTitle as ShadcnDialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { SetOrderDTO } from '@/types/super-admin/configuration-setting/master-menu-page-mapping-institutionwise';
import { DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowDown, ArrowUp, GripVertical, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SortableRowProps {
    id: number;
    item: SetOrderDTO;
    index: number;
    onDisplayNameChange: (id: number, val: string) => void;
    onOrderChange: (id: number, val: number) => void;
}

function SortableRow({ id, item, index, onDisplayNameChange, onOrderChange }: SortableRowProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        position: 'relative' as const,
        backgroundColor: isDragging ? 'rgba(var(--primary), 0.05)' : undefined
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell className='text-center'>{index + 1}</TableCell>
            <TableCell>
                <div className='flex items-center gap-2'>
                    <button {...attributes} {...listeners} className='cursor-grab rounded p-1 hover:bg-slate-100 active:cursor-grabbing'>
                        <GripVertical className='h-4 w-4 text-slate-400' />
                    </button>
                    <Input
                        value={item.displayname}
                        onChange={(e) => onDisplayNameChange(item.ivrmmmpmI_Id, e.target.value)}
                        className='h-8'
                        placeholder='Enter Page Name'
                    />
                </div>
            </TableCell>
            <TableCell className='w-24'>
                <Input
                    type='number'
                    value={item.pageorder}
                    onChange={(e) => onOrderChange(item.ivrmmmpmI_Id, Number.parseInt(e.target.value) || 0)}
                    className='h-8 text-center'
                    maxLength={10}
                />
            </TableCell>
        </TableRow>
    );
}

interface SetOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: SetOrderDTO[]) => void;
    data: SetOrderDTO[];
    institutionName?: string;
}

export default function SetOrderModal({ isOpen, onClose, onSave, data, institutionName }: SetOrderModalProps) {
    const [items, setItems] = useState<SetOrderDTO[]>([]);

    useEffect(() => {
        setItems(data);
    }, [data, isOpen]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((i) => i.ivrmmmpmI_Id === active.id);
                const newIndex = items.findIndex((i) => i.ivrmmmpmI_Id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);
                // After moving, update the pageorder values to match the new indexes
                return newItems.map((item, idx) => ({ ...item, pageorder: idx }));
            });
        }
    }

    const handleDisplayNameChange = (id: number, val: string) => {
        setItems((prev) => prev.map((item) => (item.ivrmmmpmI_Id === id ? { ...item, displayname: val } : item)));
    };

    const handleOrderChange = (id: number, val: number) => {
        setItems((prev) => prev.map((item) => (item.ivrmmmpmI_Id === id ? { ...item, pageorder: val } : item)));
    };

    return (
        <ShadcnDialog open={isOpen} onOpenChange={onClose}>
            <ShadcnDialogContent className='max-w-2xl'>
                <ShadcnDialogHeader className='-m-6 mb-4 rounded-t-lg bg-primary p-4 text-white'>
                    <ShadcnDialogTitle className='text-center text-xl'>{institutionName || 'Set Order'}</ShadcnDialogTitle>
                </ShadcnDialogHeader>

                <div className='mb-4 border-b bg-slate-50 py-2 text-center'>
                    <p className='flex items-center justify-center gap-2 font-medium text-slate-600 text-sm'>
                        Note: Drag Records <ArrowUp className='h-3 w-3' /> up or <ArrowDown className='h-3 w-3' /> down to set orders!!
                    </p>
                </div>

                <div className='max-h-[50vh] overflow-y-auto'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-16 text-center'>SLNO</TableHead>
                                <TableHead>Page Name</TableHead>
                                <TableHead className='text-center'>Page Order</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={items.map((i) => i.ivrmmmpmI_Id)} strategy={verticalListSortingStrategy}>
                                    {items.map((item, index) => (
                                        <SortableRow
                                            key={item.ivrmmmpmI_Id}
                                            id={item.ivrmmmpmI_Id}
                                            item={item}
                                            index={index}
                                            onDisplayNameChange={handleDisplayNameChange}
                                            onOrderChange={handleOrderChange}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className='h-24 text-center text-muted-foreground italic'>
                                        No records to display.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <ShadcnDialogFooter className='mt-6 gap-2'>
                    <Button onClick={() => onSave(items)} className='flex items-center gap-2'>
                        <Save className='h-4 w-4' />
                        Save
                    </Button>
                    <Button variant='outline' onClick={onClose} className='flex items-center gap-2'>
                        <X className='h-4 w-4' />
                        Close
                    </Button>
                </ShadcnDialogFooter>
            </ShadcnDialogContent>
        </ShadcnDialog>
    );
}

'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SortableItem } from './sort-table-item';

interface Column {
    key: string;
    label: string;
    className?: string;
}

interface MasterOrderViewProps<T extends { id: number }> {
    isOpen: boolean;
    onClose: () => void;
    data: T[];
    columns: Column[];
    onSave: (updatedData: T[]) => void;
    tableHeight?: string;
    title: string;
    isLoading?: boolean;
    isSaving?: boolean;
}

export function MasterViewDetails<T extends { id: number }>({
    isOpen,
    onClose,
    data,
    columns,
    onSave,
    tableHeight = '50vh',
    title,
    isLoading = false,
    isSaving = false
}: MasterOrderViewProps<T>) {
    const [items, setItems] = useState<T[]>([]);

    useEffect(() => {
        setItems(data.map((d) => ({ ...d })));
    }, [data]);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            const newItems = arrayMove(items, oldIndex, newIndex);

            // Dynamically find the order key from columns (e.g., label containing "Order")
            const orderColumn = [...columns].reverse().find((col) => col.label.toLowerCase().includes('order'));
            const orderKey = orderColumn?.key;

            const updatedItems = newItems.map((item, index) => {
                if (orderKey && orderKey !== 'id') {
                    return { ...item, [orderKey]: index + 1 };
                }
                return item;
            });

            setItems(updatedItems);
        }
    };

    const handleSave = () => {
        onSave(items);
    };

    const renderSkeletonTable = () => (
        <div className='w-full rounded-md'>
            <ScrollArea className='h-[calc(40dvh-110px)] rounded-md border md:h-[calc(45dvh-110px)]'>
                <Table>
                    <TableBody>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <TableRow key={i} className='hover:bg-transparent'>
                                {columns.map((_, j) => (
                                    <TableCell key={j}>
                                        <Skeleton className='h-8 w-full' />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ScrollBar orientation='horizontal' />
            </ScrollArea>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='flex max-h-[90vh] w-full max-w-6xl flex-col'>
                {/* Fixed Header */}
                <DialogHeader className='sticky top-0 z-10 border-b bg-white'>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>Drag and drop to reorder</DialogDescription>
                </DialogHeader>

                {/* Scrollable Table Section */}
                <ScrollArea className='max-h-[70vh] flex-1 overflow-y-auto rounded-md border'>
                    {isLoading ? (
                        <div className='flex flex-col items-center justify-center space-y-3 py-12'>{renderSkeletonTable()}</div>
                    ) : items.length === 0 ? (
                        <div className='flex flex-col items-center justify-center space-y-3 py-12'>
                            <p className='text-muted-foreground text-sm'>No records found.</p>
                        </div>
                    ) : (
                        <div className={cn('rounded-md')}>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                                    <table className='w-full table-auto border-collapse border border-gray-200'>
                                        <thead className='sticky top-0 z-10 bg-gray-100'>
                                            <tr>
                                                {columns.map((col) => (
                                                    <th key={col.key} className={`border px-4 py-2 text-left ${col.className || ''}`}>
                                                        {col.label}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((row, index) => (
                                                <SortableItem key={row.id} id={row.id} row={row} columns={columns} index={index} />
                                            ))}
                                        </tbody>
                                    </table>
                                </SortableContext>
                            </DndContext>
                        </div>
                    )}
                    <ScrollBar orientation='horizontal' />
                </ScrollArea>

                {/* Fixed Footer */}
                <DialogFooter className='mt-4 flex w-fit w-full justify-end gap-2 border-t bg-white py-3'>
                    <Button className='w-fit' variant='outline' onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button className='w-fit' onClick={handleSave} disabled={isSaving || isLoading}>
                        {isSaving ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Saving...
                            </>
                        ) : (
                            'Save'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

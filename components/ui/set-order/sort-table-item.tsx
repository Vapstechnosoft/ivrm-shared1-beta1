'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Column {
    key: string;
    label: string;
    className?: string;
}

interface SortableItemProps<T> {
    id: string | number;
    row: T;
    columns: Column[];
    index: number;
    onHoverChange?: (hovered: boolean) => void; // notify parent
}

export function SortableItem<T>({ id, row, columns, index, onHoverChange }: SortableItemProps<T>) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab'
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className='hover:bg-[#dfb8f8]'
            onMouseEnter={() => onHoverChange?.(true)}
            onMouseLeave={() => onHoverChange?.(false)}>
            {columns.map((col) => (
                <td key={col.key} className={`border px-4 py-2 ${col.className || ''}`}>
                    {col.key === 'id' ? (
                        <span className='font-bold'>{index + 1}</span>
                    ) : (
                        (row as any)[col.key]
                    )}
                </td>
            ))}
        </tr>
    );
}

'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight } from 'lucide-react';

interface NestedSelectItemProps {
    item: {
        id: number;
        code: string;
        name: string;
        children?: NestedSelectItemProps['item'][];
    };
    level?: number;
    onSelect: (id: number, checked: boolean) => void;
    onExpand: (id: number, isExpanded: boolean) => void;
    selectedIds: number[];
    expandedIds: Set<number>;
    isSingleSelect?: boolean;
}

export function NestedSelectItem({ item, level = 0, onSelect, onExpand, selectedIds, expandedIds, isSingleSelect }: NestedSelectItemProps) {
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedIds.includes(item.id);
    const isExpanded = expandedIds.has(item.id);

    const handleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        onExpand(item.id, !isExpanded);
    };

    const handleSelect = (checked: boolean) => {
        onSelect(item.id, checked);
        if (checked && hasChildren) {
            onExpand(item.id, true);
        }
    };

    return (
        <div>
            <div
                className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-accent hover:text-accent-foreground'
                style={{ paddingLeft: `${level * 16 + 8}px` }}>
                {hasChildren && (
                    <ChevronRight
                        className={`h-4 w-4 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        onClick={handleExpand}
                    />
                )}
                <Checkbox checked={isSelected} onCheckedChange={handleSelect} className='h-4 w-4' />
                <span className='truncate'>
                    {item.code} - {item.name}
                </span>
            </div>

            {hasChildren && isExpanded && (
                <div>
                    {item?.children?.map((child) => (
                        <NestedSelectItem
                            key={child.id}
                            item={child}
                            level={level + 1}
                            onSelect={onSelect}
                            onExpand={onExpand}
                            selectedIds={selectedIds}
                            expandedIds={expandedIds}
                            isSingleSelect={isSingleSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

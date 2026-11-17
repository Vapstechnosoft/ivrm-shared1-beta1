'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MasterSubMenuINSDTO, SetOrderRequest } from '@/types/super-admin/configuration-setting/master-sub-menu-ins';
import { ArrowUp, ArrowDown, Save } from 'lucide-react';
import { toast } from 'sonner';

interface SetOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: MasterSubMenuINSDTO[];
    onSave: (payload: SetOrderRequest) => Promise<void>;
}

export default function SetOrderModal({ isOpen, onClose, data, onSave }: SetOrderModalProps) {
    const [items, setItems] = useState<MasterSubMenuINSDTO[]>([]);

    useEffect(() => {
        if (isOpen) {
            // Create a copy and sort by current order
            setItems([...data].sort((a, b) => a.ivrmmmI_MenuOrder - b.ivrmmmI_MenuOrder));
        }
    }, [isOpen, data]);

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newItems = [...items];
        if (direction === 'up') {
            if (index === 0) return;
            [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        } else {
            if (index === newItems.length - 1) return;
            [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
        }
        setItems(newItems);
    };

    const handleSave = async () => {
        const payload: SetOrderRequest = {
            menuList: items.map((item, index) => ({
                ivrmmmI_Id: item.ivrmmmI_Id,
                ivrmmmI_MenuName: item.ivrmmmI_MenuName,
                ivrmmmI_MenuOrder: index + 1 // New Order
            }))
        };
        await onSave(payload);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Set Order</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto border rounded-md p-2">
                    <ul className="space-y-2">
                        {items.map((item, index) => (
                            <li key={`${item.ivrmmmI_Id}-${index}`} className="flex items-center justify-between bg-secondary/20 p-2 rounded-md border">
                                <span className="text-sm font-medium">{index + 1}. {item.ivrmmmI_MenuName} (Module: {item.modulename})</span>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={index === 0}
                                        onClick={() => moveItem(index, 'up')}
                                        title="Move Up"
                                    >
                                        <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={index === items.length - 1}
                                        onClick={() => moveItem(index, 'down')}
                                        title="Move Down"
                                    >
                                        <ArrowDown className="h-4 w-4" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <DialogFooter className="sm:justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button type="button" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Save className="mr-2 h-4 w-4" /> Save Order
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

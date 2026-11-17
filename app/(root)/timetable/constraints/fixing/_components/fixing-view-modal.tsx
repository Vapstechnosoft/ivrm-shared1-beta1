'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ColumnDef } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';

interface FixingViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    data: any[];
    columns: ColumnDef<any>[];
    isLoading: boolean;
}

export function FixingViewModal({ isOpen, onClose, title, data, columns, isLoading }: FixingViewModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='max-h-[80vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className='py-4'>
                    {isLoading ? (
                        <div className='flex h-40 items-center justify-center'>
                            <Loader2 className='h-8 w-8 animate-spin text-primary' />
                        </div>
                    ) : data && data.length > 0 ? (
                        <DataTable data={data} columns={columns} totalItems={data.length} />
                    ) : (
                        <div className='py-8 text-center text-muted-foreground'>No details found.</div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

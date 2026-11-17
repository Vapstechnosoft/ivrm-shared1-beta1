'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const lostBookSchema = z.object({
    fine: z.coerce.number().min(0, 'Fine cannot be negative'),
    collected: z.coerce.number().min(0, 'Collected amount cannot be negative')
});

type LostBookValues = z.infer<typeof lostBookSchema>;

interface LostBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: LostBookValues) => void;
    isProcessing: boolean;
    bookTitle?: string;
    accessionNo?: string;
}

export const LostBookModal = ({ isOpen, onClose, onConfirm, isProcessing, bookTitle, accessionNo }: LostBookModalProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<LostBookValues>({
        resolver: zodResolver(lostBookSchema),
        defaultValues: {
            fine: 0,
            collected: 0
        }
    });

    const onSubmit = (data: LostBookValues) => {
        onConfirm(data);
        reset(); // Reset form after successful submission (or handle in parent)
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Mark Book as Lost</DialogTitle>
                    <DialogDescription>Confirm marking the book as lost. Enter fine and collected amounts.</DialogDescription>
                </DialogHeader>

                {bookTitle && (
                    <div className='mb-4 rounded-md bg-muted p-3 text-sm'>
                        <div>
                            <strong>Book:</strong> {bookTitle}
                        </div>
                        <div>
                            <strong>Acc No:</strong> {accessionNo}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='fine' className='text-right'>
                                Fine
                            </Label>
                            <div className='col-span-3'>
                                <InputText id='fine' {...register('fine')} type='number' />
                                {errors.fine && <p className='text-red-500 text-xs'>{errors.fine.message}</p>}
                            </div>
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='collected' className='text-right'>
                                Collected
                            </Label>
                            <div className='col-span-3'>
                                <InputText id='collected' {...register('collected')} type='number' />
                                {errors.collected && <p className='text-red-500 text-xs'>{errors.collected.message}</p>}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type='button' variant='outline' onClick={onClose} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <Button type='submit' variant='destructive' disabled={isProcessing}>
                            {isProcessing && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                            Confirm Lost
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

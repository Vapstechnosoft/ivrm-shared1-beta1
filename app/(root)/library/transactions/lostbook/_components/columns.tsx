// app/dashboard/transaction/lostbook/_components/columns.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ILostBookList } from '@/types/library/transactions/transactions';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';

export const lostBookColumns: ColumnDef<ILostBookList>[] = [
    {
        accessorKey: 'index',
        header: 'SL.No.',
        cell: ({ row }) => {
            return row.index + 1;
        },
        size: 80
    },
    {
        accessorKey: 'lmbanO_AccessionNo',
        header: 'Accession No.',
        cell: ({ row }) => {
            return <div className='font-medium text-blue-600'>{row.getValue('lmbanO_AccessionNo')}</div>;
        }
    },
    {
        accessorKey: 'lmB_BookTitle',
        header: 'Book Title',
        cell: ({ row }) => {
            return (
                <div className='max-w-xs truncate' title={row.getValue('lmB_BookTitle')}>
                    {row.getValue('lmB_BookTitle')}
                </div>
            );
        }
    },
    {
        accessorKey: 'lmbanO_AvialableStatus',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('lmbanO_AvialableStatus') as string;
            return (
                <Badge variant={status === 'lost' ? 'destructive' : 'outline'} className='capitalize'>
                    {status}
                </Badge>
            );
        }
    },
    {
        accessorKey: 'lmbanO_AmountCollected',
        header: 'Fine Amount',
        cell: ({ row }) => {
            const amount = row.getValue('lmbanO_AmountCollected') as number;
            return <div className='font-medium'>₹{amount?.toLocaleString('en-IN') || '0'}</div>;
        }
    },
    {
        accessorKey: 'lmbanO_ModeOfPayment',
        header: 'Payment Mode',
        cell: ({ row }) => {
            const mode = row.getValue('lmbanO_ModeOfPayment') as string;
            return <Badge variant='secondary'>{mode}</Badge>;
        }
    },
    {
        accessorKey: 'lmbanO_LostDamagedDate',
        header: 'Lost Date',
        cell: ({ row }) => {
            const date = row.getValue('lmbanO_LostDamagedDate') as string;
            return date ? format(new Date(date), 'dd/MM/yyyy') : '-';
        }
    },
    {
        accessorKey: 'borrowerType',
        header: 'Borrower Type',
        cell: ({ row }) => {
            const book = row.original;
            let type = '';
            if (book.std) type = 'Student';
            else if (book.staff)
                type = 'Staff'; // Changed to lowercase
            else if (book.dept) type = 'Department'; // Changed to lowercase

            return type ? <Badge variant='outline'>{type}</Badge> : '-';
        }
    },
    {
        accessorKey: 'borrowerName',
        header: 'Borrower Name',
        cell: ({ row }) => {
            const book = row.original;
            let name = '';
            if (book.std) name = book.std;
            else if (book.staff) name = book.staff;
            else if (book.dept) name = book.dept;

            return <div>{name || '-'}</div>;
        }
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const { openEditForm, openDeleteForm } = useFormContext<ILostBookList>();
            const book = row.original;

            return (
                <div className='flex items-center gap-2'>
                    <Button variant='ghost' size='sm' onClick={() => openEditForm(book)} title='Edit'>
                        <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => openDeleteForm(book)}
                        title='Delete'
                        className='text-red-600 hover:bg-red-50 hover:text-red-700'>
                        <Trash2 className='h-4 w-4' />
                    </Button>
                </div>
            );
        },
        size: 120
    }
];

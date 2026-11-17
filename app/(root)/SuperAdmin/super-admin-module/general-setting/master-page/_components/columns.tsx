'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader as ColumnHeader } from '@/components/ui/data-table-column-header';
import { useFormContext } from '@/components/ui/form/form-provider';
import { deleteMasterPage } from '@/server/super-admin/super-admin-module/general-setting/master-page';
import type { IMasterPage } from '@/types/super-admin/super-admin-module/general-setting/master-page';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { usePageContext } from './page-context';

const ActionCell = ({ row }: { row: any }) => {
    const { openEditForm } = useFormContext<IMasterPage>();
    const [open, setOpen] = useState(false);
    const { refreshData } = usePageContext();

    const handleConfirm = async () => {
        const result = await deleteMasterPage(row.original.ivrmP_Id);
        if (result.success) {
            toast.success(result.message);
            refreshData();
        } else {
            toast.error(result.message);
        }
        setOpen(false);
    };

    return (
        <>
            <div className='flex items-center justify-center gap-2'>
                <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 text-primary'
                    onClick={() => openEditForm(row.original)}
                    title="Edit"
                >
                    <Pencil className='h-4 w-4' />
                </Button>
                <span className='text-gray-300'>|</span>
                <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 text-destructive'
                    onClick={() => setOpen(true)}
                    title="Delete"
                >
                    <Trash2 className='h-4 w-4' />
                </Button>
            </div>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Do you want to delete this page? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            className='bg-destructive hover:bg-destructive/90'
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export const columns: ColumnDef<IMasterPage>[] = [
    {
        id: 'serialNumber',
        header: ({ column }) => <ColumnHeader column={column} title='SL.NO' />,
        cell: ({ row }) => <div className='text-center'>{row.index + 1}</div>,
        enableSorting: false,
    },
    {
        accessorKey: 'ivrmmP_PageName',
        header: ({ column }) => <ColumnHeader column={column} title='Page Name' />,
    },
    {
        accessorKey: 'ivrmP_PageDesc',
        header: ({ column }) => <ColumnHeader column={column} title='Page Description' />,
    },
    {
        accessorKey: 'ivrmP_MandatoryFlag',
        header: ({ column }) => <ColumnHeader column={column} title='Page Mandatory' />,
        cell: ({ row }) => <div className='text-center'>{row.original.ivrmP_MandatoryFlag ? 'Yes' : 'No'}</div>,
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => <ActionCell row={row} />,
    },
];

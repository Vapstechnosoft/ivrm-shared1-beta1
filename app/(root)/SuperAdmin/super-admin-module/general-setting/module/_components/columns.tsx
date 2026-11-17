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
import { activateDeactivateMasterModule } from '@/server/super-admin/super-admin-module/general-setting/module';
import type { IMasterModule } from '@/types/super-admin/super-admin-module/general-setting/module';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useModuleContext } from './module-context';

// Separate component to use hooks
const ActionCell = ({ row }: { row: any }) => {
    const { openEditForm } = useFormContext<IMasterModule>();
    const [open, setOpen] = useState(false);
    const { refreshData } = useModuleContext();

    const isActive = row.original.module_ActiveFlag === 1;
    const action = isActive ? 'Deactivate' : 'Activate';

    const handleConfirm = async () => {
        const result = await activateDeactivateMasterModule(row.original.ivrmM_Id);
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
                >
                    <Pencil className='h-4 w-4' />
                </Button>
                <span className='text-gray-300'>|</span>
                <Button
                    variant='ghost'
                    size='sm'
                    className={isActive ? 'text-destructive hover:text-destructive' : 'text-green-600 hover:text-green-700'}
                    onClick={() => setOpen(true)}
                >
                    {action}
                </Button>
            </div>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Do you want to {action.toLowerCase()} this module?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} className={isActive ? 'bg-destructive hover:bg-destructive/90' : 'bg-green-600 hover:bg-green-700'}>
                            Yes, {action}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export const columns: ColumnDef<IMasterModule>[] = [
    {
        id: 'serialNumber',
        header: ({ column }) => <ColumnHeader column={column} title='SL.NO' />,
        cell: ({ row }) => <div className='text-center'>{row.index + 1}</div>,
        enableSorting: false,
    },
    {
        accessorKey: 'ivrmM_ModuleName',
        header: ({ column }) => <ColumnHeader column={column} title='Module Name' />,
    },
    {
        accessorKey: 'ivrmM_ModuleDesc',
        header: ({ column }) => <ColumnHeader column={column} title='Description' />,
    },
    {
        id: 'actions',
        header: 'Edit/Activate/Deactivate',
        cell: ({ row }) => <ActionCell row={row} />,
    },
];

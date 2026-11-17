'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IMasterRole } from '@/types/super-admin/super-admin-module/general-setting/master-role';
import { Button } from '@/components/ui/button';
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
import { useFormContext } from '@/components/ui/form/form-provider';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteMasterRole } from '@/server/super-admin/super-admin-module/general-setting/master-role';

const ActionCell = ({ row }: { row: any }) => {
    const { openEditForm } = useFormContext<IMasterRole>();
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        const result = await deleteMasterRole(row.original.id);
        if (result.success) {
            toast.success(result.message);
            window.location.reload();
        } else {
            toast.error(result.message);
        }
        setOpen(false);
    };

    return (
        <>
            <div className="flex items-center justify-center gap-2">
                <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80" title="Edit" onClick={() => openEditForm(row.original)}>
                    <Pencil className="h-4 w-4" />
                </Button>
                <span className="text-gray-300">|</span>
                {row.original.activeFlag === 0 ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 px-2"
                        title="Activate"
                        onClick={() => setOpen(true)}
                    >
                        Activate
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                        title="Deactivate"
                        onClick={() => setOpen(true)}
                    >
                        Deactivate
                    </Button>
                )}
            </div>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Do you want to {row.original.activeFlag === 0 ? 'Activate' : 'Deactivate'} this role?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className={row.original.activeFlag === 0 ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                        >
                            {row.original.activeFlag === 0 ? 'Activate' : 'Deactivate'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export const masterRoleColumns: ColumnDef<IMasterRole>[] = [
    {
        accessorKey: 'slno',
        header: 'SL.NO',
        cell: ({ row, table }) => {
            const { pagination } = table.getState();
            return pagination.pageIndex * pagination.pageSize + row.index + 1;
        },
        enableSorting: false,
    },
    {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
        cell: ({ row }) => <div className="text-left">{row.original.name}</div>
    },
    {
        accessorKey: 'normalizedName',
        header: 'Description',
        enableSorting: true,
        cell: ({ row }) => <div className="text-left">{row.original.normalizedName}</div>
    },
    {
        id: 'actions',
        header: 'Edit | Activate/Deactivate',
        cell: ({ row }) => <ActionCell row={row} />,
        enableSorting: false,
    }
];

'use client';

import { Button } from '@/components/ui/button';
import { useFormContext } from '@/components/ui/form/form-provider';
import { Switch } from '@/components/ui/switch';
import { deactivateConsecutiveConstraints, deleteConsecutiveConstraints } from '@/server/timetable/constraints/consecutive';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export interface IConsecutiveConstraintList {
    ttC_Id: number;
    asmaY_Id: number;
    ttmC_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    hrmE_Id: number;
    ismS_Id: number;
    ttC_NoOfConDays: number;
    ttC_NoOfConPeriods: number;
    ttC_NoOfPeriods: number;
    ttC_ActiveFlag: boolean;
    asmayYear: string;
    categoryName: string;
    className: string;
    sectionName: string;
    staffName: string;
    subjectName: string;
}

export const columns: ColumnDef<IConsecutiveConstraintList>[] = [
    {
        accessorKey: 'asmayYear',
        header: 'Academic Year'
    },
    {
        accessorKey: 'categoryName',
        header: 'Category'
    },
    {
        accessorKey: 'className',
        header: 'Class'
    },
    {
        accessorKey: 'sectionName',
        header: 'Section'
    },
    {
        accessorKey: 'staffName',
        header: 'Staff'
    },
    {
        accessorKey: 'subjectName',
        header: 'Subject'
    },
    {
        accessorKey: 'ttC_NoOfPeriods',
        header: 'Total Periods'
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const { openEditForm } = useFormContext();

            const handleDelete = async () => {
                if (confirm('Are you sure you want to delete this record?')) {
                    try {
                        const res = await deleteConsecutiveConstraints(row.original.ttC_Id);
                        if (res.returnval === true) {
                            toast.success('Record Deleted Successfully');
                            window.location.reload();
                        } else {
                            toast.error('Failed to Delete Record');
                        }
                    } catch (error) {
                        console.error(error);
                        toast.error('An error occurred while deleting');
                    }
                }
            };

            const handleStatusChange = async (checked: boolean) => {
                try {
                    const payload = { ...row.original, ttC_ActiveFlag: !checked };
                    // API expects the whole object or specific ID/Flag? Controller says: expects entity
                    // Swapping logic: checked=true means we want to active.
                    // The component Switch checked state reflects current state.
                    // OnChange, if it was true, it becomes false.

                    // We need to send the object. existing logic:
                    // apiService.create("Consecutive/deactivate", employee)
                    const res = await deactivateConsecutiveConstraints(row.original);
                    if (res.returnval === true) {
                        toast.success(row.original.ttC_ActiveFlag ? 'Deactivated Successfully' : 'Activated Successfully');
                        window.location.reload();
                    } else {
                        toast.error('Failed to Update Status');
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('An error occurred');
                }
            };

            return (
                <div className='flex items-center space-x-2'>
                    <Button variant='ghost' size='icon' onClick={() => openEditForm(row.original)}>
                        <Pencil className='h-4 w-4 text-blue-500' />
                    </Button>
                    <Switch checked={row.original.ttC_ActiveFlag} onCheckedChange={handleStatusChange} />
                    <Button variant='ghost' size='icon' onClick={handleDelete}>
                        <Trash2 className='h-4 w-4 text-red-500' />
                    </Button>
                </div>
            );
        }
    }
];

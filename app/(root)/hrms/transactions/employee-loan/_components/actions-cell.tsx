'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { EmployeeLoanItem } from '@/types/hrms/employee-loan';
import type { Row } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Power } from 'lucide-react';
interface ActionsCellProps {
    row: Row<EmployeeLoanItem>;
    onToggleActive: (id: number, currentStatus: boolean) => void;
}
export function ActionsCell({ row, onToggleActive }: ActionsCellProps) {
    const { openEditForm } = useFormContext<EmployeeLoanItem>();
    const loan = row.original;
    const isActive = loan.HREL_ActiveFlag === true;
    return (
        <div className='flex justify-end'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => {
                            openEditForm(loan);
                        }}>
                        <Edit className='mr-2 h-4 w-4' />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onToggleActive(loan.HREL_Id, isActive)}
                        className={isActive ? 'text-orange-600' : 'text-green-600'}>
                        <Power className='mr-2 h-4 w-4' />
                        {isActive ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

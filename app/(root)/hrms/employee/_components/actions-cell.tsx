'use client';
import { Button } from '@/components/ui/button';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IEmployeeList } from '@/types/hrms/hrms-config/employee';
import type { Row } from '@tanstack/react-table';
import { Edit } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ActionsCellProps {
    row: Row<IEmployeeList>;
}

export function ActionsCell({ row }: ActionsCellProps) {
    const employee = row.original;
    const { openEditForm, openToggleForm } = useFormContext<IEmployeeList>();

    const handleEdit = () => {
        openEditForm(employee);
    };

    const handleToggle = () => {
        openToggleForm(employee);
    };

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                onClick={handleEdit}
                title="Edit Employee"
            >
                <Edit className='h-4 w-4' />
                <span className="sr-only">Edit</span>
            </Button>

            <div className="flex items-center gap-2" title={employee.hrmE_ActiveFlag ? 'Deactivate Employee' : 'Activate Employee'}>
                <Switch
                    checked={employee.hrmE_ActiveFlag}
                    onCheckedChange={handleToggle}
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-400"
                />
            </div>
        </div>
    );
}

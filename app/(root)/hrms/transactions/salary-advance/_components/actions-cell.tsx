'use client';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useToggleSalaryAdvanceStatus } from '@/hooks/hrms/useTransactions';
import type { SalaryAdvanceGridItem } from '@/types/hrms/salary-advance';
import { toast } from 'sonner';

interface ActionsCellProps {
    rowData: SalaryAdvanceGridItem;
}

export function ActionsCell({ rowData }: ActionsCellProps) {
    const { openEditForm } = useFormContext<SalaryAdvanceGridItem>();
    const toggleMutation = useToggleSalaryAdvanceStatus();

    return (
        <ActionButtons
            rowData={rowData}
            buttons={{ edit: true, toggle: true, delete: false }}
            onEdit={(data: SalaryAdvanceGridItem) => {
                openEditForm(data);
            }}
            onToggle={(data: SalaryAdvanceGridItem, newState: boolean) => {
                toggleMutation.mutate(
                    {
                        hresaId: data.hresA_Id,
                        activeFlag: newState
                    },
                    {
                        onSuccess: () => {
                            toast.success(`Successfully ${newState ? 'activated' : 'deactivated'} the salary advance record`);
                        }
                    }
                );
            }}
            toggleConditionKey='hresA_ActiveFlag'
        />
    );
}

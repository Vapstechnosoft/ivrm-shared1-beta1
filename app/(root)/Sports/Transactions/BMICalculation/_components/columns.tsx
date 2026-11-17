'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IBMICalculation } from '@/types/sports/transactions/bmi-calculation';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useFormContext } from '@/components/ui/form/form-provider';
import { useBMICalculation } from '@/hooks/sports/useBMICalculation';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const bmiCalculationColumns: ColumnDef<IBMICalculation>[] = [
    {
        id: 'slno',
        header: 'Sl.No.',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'asmaY_Year',
        header: 'Year',
    },
    {
        accessorKey: 'studentName',
        header: 'Student Name',
    },
    {
        accessorKey: 'amsT_AdmNo',
        header: 'Adm No.',
    },
    {
        accessorKey: 'asmcL_ClassName',
        header: 'Class',
    },
    {
        accessorKey: 'asmC_SectionName',
        header: 'Section',
    },
    {
        accessorKey: 'asondate',
        header: 'As On Date',
    },
    {
        accessorKey: 'spccshW_Height',
        header: 'Height',
    },
    {
        accessorKey: 'spccshW_Weight',
        header: 'Weight',
    },
    {
        accessorKey: 'spccshW_BMI',
        header: 'BMI',
    },
    {
        accessorKey: 'spccshW_BMIRemark',
        header: 'Remark',
        cell: ({ row }) => {
            const remark = row.original.spccshW_BMIRemark || row.original.SPCCSHW_BMIRemark;
            let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
            if (remark === 'Normal') variant = 'default';
            if (remark === 'Overweight') variant = 'secondary';
            if (remark === 'Obese' || remark === 'Extreme Obese') variant = 'destructive';

            return <Badge variant={variant}>{remark}</Badge>;
        }
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const { edit, deactivate } = useBMICalculation();
            const { openEditForm } = useFormContext<IBMICalculation>();
            const isActive = row.original.spccmhW_ActiveFlag || row.original.SPCCMHW_ActiveFlag;

            return (
                <div key={row.id} className='flex items-center gap-3'>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => openEditForm(row.original)}
                        className='h-8 w-8 p-0 text-primary hover:bg-primary/10'>
                        <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                        variant='link'
                        size='sm'
                        onClick={() => deactivate.mutate(row.original.spccshW_Id || row.original.SPCCSHW_Id || 0)}
                        className={cn(
                            'h-auto p-0 font-medium text-xs',
                            isActive ? 'text-destructive hover:text-destructive/80' : 'text-green-600 hover:text-green-700'
                        )}>
                        {isActive ? 'De-Activate' : 'Activate'}
                    </Button>
                </div>
            );
        },
    },
];

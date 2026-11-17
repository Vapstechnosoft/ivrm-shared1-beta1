'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import type { CirculationParameterGridData } from '@/types/library/transactions/circulationParameter';

interface ToggleCirculationParameterDialogProps {
    isOpen: boolean;
    rowData: CirculationParameterGridData | null;
    isLoading?: boolean;
    onClose: () => void;
    onConfirm: (data: CirculationParameterGridData) => void;
}

export function ToggleCirculationParameterDialog({
    isOpen,
    rowData,
    isLoading = false,
    onClose,
    onConfirm
}: ToggleCirculationParameterDialogProps) {
    if (!rowData) return null;

    const isActive =
        rowData.circ_ActiveFlag ??
        rowData.lbcpaS_ActiveFlg ??
        rowData.lbcpa_ActiveFlg ??
        rowData.lnbcpa_ActiveFlg ??
        rowData.lmC_ActiveFlag ??
        (rowData as any).asmcL_ActiveFlag ??
        (rowData as any).hrmgT_ActiveFlag ??
        (rowData as any).activeFlag ??
        true;

    const typeLabel =
        rowData.lmB_BookTypeflag === 'BP' || rowData.BOOKFLAG === 'BP'
            ? `Book (${rowData.lmB_BookType || rowData.lmC_CategoryName || 'Book'})`
            : `Non-Book (${rowData.lmC_CategoryName || 'Non-Book'})`;

    const targetLabel =
        rowData.asmcL_ClassName
            ? `Class ${rowData.asmcL_ClassName}`
            : rowData.hrmgT_EmployeeGroupType ||
              rowData.hrmD_DepartmentName ||
              rowData.guest_Name ||
              rowData.schclgflag ||
              '';

    const handleConfirm = () => {
        onConfirm(rowData);
    };

    return (
        <AdaptiveDialog title='Toggle Circulation Parameter Status' isOpen={isOpen} onClose={onClose} size='md'>
            <div className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-4 text-sm'>
                    <p className='text-gray-700'>
                        Are you sure you want to{' '}
                        <span className={`font-semibold ${isActive ? 'text-red-600' : 'text-green-600'}`}>
                            {isActive ? 'deactivate' : 'activate'}
                        </span>{' '}
                        this circulation parameter?
                    </p>

                    <div className='rounded-md border bg-slate-50 p-3 text-xs space-y-1.5'>
                        <div className='flex justify-between'>
                            <span className='text-muted-foreground'>Type:</span>
                            <span className='font-medium text-slate-800'>{typeLabel}</span>
                        </div>
                        {targetLabel && (
                            <div className='flex justify-between'>
                                <span className='text-muted-foreground'>Member / Group:</span>
                                <span className='font-medium text-slate-800'>{targetLabel}</span>
                            </div>
                        )}
                        <div className='flex justify-between'>
                            <span className='text-muted-foreground'>Current Status:</span>
                            <span className={`font-semibold ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                                {isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </AdaptiveBody>

                <AdaptiveFooter className='flex justify-end gap-2'>
                    <Button variant='secondary' onClick={onClose} type='button' disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        type='button'
                        isLoading={isLoading}
                        onClick={handleConfirm}
                        className={
                            isActive
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                        }>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </div>
        </AdaptiveDialog>
    );
}

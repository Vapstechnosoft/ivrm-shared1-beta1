'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { deactivateSchoolMasterUnit } from '@/server/lesson-planner/master/school-master-unit';
import type { IMasterSchoolUnit } from '@/types/lesson-planner/master/school-master-unit';
import type React from 'react';
import { toast } from 'sonner';

interface ToggleMasterSchoolUnitFormProps {
    rowData: IMasterSchoolUnit;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ToggleMasterSchoolUnitForm({ rowData, onClose, onSuccess }: ToggleMasterSchoolUnitFormProps) {
    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log(`[Toggle-Unit] rowData.lpmU_Id: ${rowData.lpmU_Id}, activeFlag: ${rowData.lpmU_ActiveFlag}`);
            const res: any = await deactivateSchoolMasterUnit(rowData.lpmU_Id, rowData.lpmU_ActiveFlag);
            console.log('[Toggle-Unit] Deactivate Response:', res);

            const getVal = (obj: any, keys: string[]) => {
                if (!obj) return null;
                for (const key of keys) {
                    if (key.includes('.')) {
                        const parts = key.split('.');
                        let current = obj;
                        for (const part of parts) {
                            current = current?.[part];
                        }
                        if (current !== undefined && current !== null) return current;
                    } else {
                        if (obj[key] !== undefined && obj[key] !== null) return obj[key];
                    }
                }
                return null;
            };

            const resMessage = getVal(res, ['message', 'Message', 'data.message', 'data.Message']) || (typeof res === 'string' ? res : '');
            const resSuccess = getVal(res, ['success', 'Success', 'data.success', 'data.Success']);
            const resReturnval = getVal(res, ['returnval', 'Returnval', 'returnVal', 'ReturnVal', 'data.returnval', 'data.Returnval']);

            const lowerMessage = resMessage.toString().toLowerCase();
            const isSuccess =
                resSuccess === true ||
                resSuccess === 'true' ||
                resReturnval === true ||
                resReturnval === 'true' ||
                lowerMessage.includes('successfully') ||
                lowerMessage.includes('success') ||
                lowerMessage.includes('activated') ||
                lowerMessage.includes('inactivated') ||
                lowerMessage.includes('delete') ||
                lowerMessage.includes('update');

            if (isSuccess) {
                toast.success(resMessage || `Record ${rowData.lpmU_ActiveFlag ? 'deactivated' : 'activated'} successfully`);
                onSuccess?.();
                onClose();
            } else if (lowerMessage === 'exists' || lowerMessage.includes('dependency')) {
                toast.error('You Can Not Deactivate This Record, It Has Dependency');
            } else {
                toast.error(resMessage || 'Operation failed');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update record status');
        }
    };

    return (
        <AdaptiveDialog title={`${rowData.lpmU_ActiveFlag ? 'Deactivate' : 'Activate'} Record?`} isOpen={true} onClose={onClose}>
            <form onSubmit={handleConfirm} className='flex flex-col gap-4'>
                <AdaptiveBody>
                    Are you sure you want to {rowData.lpmU_ActiveFlag ? 'deactivate' : 'activate'} "{rowData.lpmU_UnitName}"?
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={onClose} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' variant={rowData.lpmU_ActiveFlag ? 'destructive' : 'default'}>
                        {rowData.lpmU_ActiveFlag ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}

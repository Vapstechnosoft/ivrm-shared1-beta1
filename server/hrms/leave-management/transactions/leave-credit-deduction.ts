'use server';
import { createLocalCrud } from '@/lib/localdb';
import type { LeaveCreditDeduction } from '@/types/hrms/leave-management/leave-credit-types';
export async function getLeaveCreditDeduction() {
    const db = createLocalCrud<LeaveCreditDeduction>('leaveCreditDeduction');
    const data = db.list();
    return {
        success: true,
        data: data,
        message: 'Data fetched successfully'
    };
}
export async function addOrUpdateLeaveCreditDeduction(deduction: LeaveCreditDeduction) {
    const db = createLocalCrud<LeaveCreditDeduction>('leaveCreditDeduction');
    if (deduction.id) {
        db.update(deduction.id, deduction);
        return {
            success: true,
            data: deduction,
            message: 'Leave credit deduction updated successfully'
        };
    } else {
        const newDeduction = db.create(deduction);
        return {
            success: true,
            data: newDeduction,
            message: 'Leave credit deduction created successfully'
        };
    }
}
export async function deleteLeaveCreditDeduction(id: number) {
    const db = createLocalCrud<LeaveCreditDeduction>('leaveCreditDeduction');
    db.remove(id);
    return {
        success: true,
        message: 'Leave credit deduction deleted successfully'
    };
}

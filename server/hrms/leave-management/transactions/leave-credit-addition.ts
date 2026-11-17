'use server';
import { createLocalCrud } from '@/lib/localdb';
import type { LeaveCreditAddition } from '@/types/hrms/leave-management/leave-credit-types';
export async function getLeaveCreditAddition() {
    const db = createLocalCrud<LeaveCreditAddition>('leaveCreditAddition');
    const data = db.list();
    return {
        success: true,
        data: data,
        message: 'Data fetched successfully'
    };
}
export async function addOrUpdateLeaveCreditAddition(addition: LeaveCreditAddition) {
    const db = createLocalCrud<LeaveCreditAddition>('leaveCreditAddition');
    if (addition.id) {
        db.update(addition.id, addition);
        return {
            success: true,
            data: addition,
            message: 'Leave credit addition updated successfully'
        };
    } else {
        const newAddition = db.create(addition);
        return {
            success: true,
            data: newAddition,
            message: 'Leave credit addition created successfully'
        };
    }
}
export async function deleteLeaveCreditAddition(id: number) {
    const db = createLocalCrud<LeaveCreditAddition>('leaveCreditAddition');
    db.remove(id);
    return {
        success: true,
        message: 'Leave credit addition deleted successfully'
    };
}

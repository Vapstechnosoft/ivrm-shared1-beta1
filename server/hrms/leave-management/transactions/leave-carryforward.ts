'use server';
import { createLocalCrud } from '@/lib/localdb';
import type { LeaveCarryForward } from '@/types/hrms/leave-management/leave-credit-types';
export async function getLeaveCarryForward() {
    const db = createLocalCrud<LeaveCarryForward>('leaveCarryForward');
    const data = db.list();
    return {
        success: true,
        data: data,
        message: 'Data fetched successfully'
    };
}
export async function addOrUpdateLeaveCarryForward(carryForward: LeaveCarryForward) {
    const db = createLocalCrud<LeaveCarryForward>('leaveCarryForward');
    if (carryForward.id) {
        db.update(carryForward.id, carryForward);
        return {
            success: true,
            data: carryForward,
            message: 'Leave carry forward updated successfully'
        };
    } else {
        const newCarryForward = db.create(carryForward);
        return {
            success: true,
            data: newCarryForward,
            message: 'Leave carry forward created successfully'
        };
    }
}
export async function deleteLeaveCarryForward(id: number) {
    const db = createLocalCrud<LeaveCarryForward>('leaveCarryForward');
    db.remove(id);
    return {
        success: true,
        message: 'Leave carry forward deleted successfully'
    };
}

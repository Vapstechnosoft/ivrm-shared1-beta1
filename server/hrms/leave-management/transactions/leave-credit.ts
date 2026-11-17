'use server';
import { createLocalCrud } from '@/lib/localdb';
import type { LeaveCredit } from '@/app/(root)/hrms/leave-management/transaction/leave-transfer/_components/columns';
export async function getLeaveCredit() {
    const db = createLocalCrud<LeaveCredit>('leaveCredit');
    const data = db.list();
    return {
        success: true,
        data: data,
        message: 'Data fetched successfully'
    };
}
export async function addOrUpdateLeaveCredit(credit: LeaveCredit) {
    const db = createLocalCrud<LeaveCredit>('leaveCredit');
    if (credit.id) {
        db.update(credit.id, credit);
        return {
            success: true,
            data: credit,
            message: 'Leave credit updated successfully'
        };
    } else {
        const newCredit = db.create(credit);
        return {
            success: true,
            data: newCredit,
            message: 'Leave credit created successfully'
        };
    }
}
export async function deleteLeaveCredit(id: number) {
    const db = createLocalCrud<LeaveCredit>('leaveCredit');
    db.remove(id);
    return {
        success: true,
        message: 'Leave credit deleted successfully'
    };
}

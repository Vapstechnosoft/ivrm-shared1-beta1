'use server';
import { createLocalCrud } from '@/lib/localdb';
import type { CompOffApproval } from '@/app/(root)/hrms/leave-management/transaction/comp-off-approval/_components/columns';
export async function getCompOffApproval() {
    const db = createLocalCrud<CompOffApproval>('compOffApproval');
    const data = db.list();
    return {
        success: true,
        data: data,
        message: 'Data fetched successfully'
    };
}
export async function updateCompOffApprovalStatus(id: number, hrStatus: string, approverRemarks?: string) {
    const db = createLocalCrud<CompOffApproval>('compOffApproval');
    const item = db.findById(id);
    if (item) {
        db.update(id, { 
            ...item, 
            hrStatus: hrStatus as 'Pending' | 'Approved' | 'Rejected',
            approverRemarks: approverRemarks || item.approverRemarks
        });
        return {
            success: true,
            message: 'Comp off approval status updated successfully'
        };
    }
    return {
        success: false,
        message: 'Comp off approval not found'
    };
}

'use server';
import { createLocalCrud } from '@/lib/localdb';
import type { CompOffRequest, CompOffRequestItem, EmployeeLeaveDetail } from '@/types/hrms/leave-management/comp-off-request';
export async function getCompOffRequestData(employeeId?: number) {
    // In a real implementation, this would fetch from API
    // For now, using local storage as placeholder
    const db = createLocalCrud<CompOffRequestItem>('compOffRequest');
    const leaveDb = createLocalCrud<EmployeeLeaveDetail>('employeeLeaveDetails');
    const requests = db.list();
    const leaveDetails = leaveDb.list();
    return {
        success: true,
        data: {
            employeeDetails: {
                employeeName: 'MS Adarsh',
                doj: '02-11-2022',
                designation: 'Jr Software Developer',
                email: '',
                phone: '0'
            },
            compOffRequests: employeeId ? requests.filter(r => r.employeeId === employeeId) : requests,
            leaveDetails: employeeId ? leaveDetails.filter(l => l.employeeId === employeeId) : leaveDetails
        },
        message: 'Data fetched successfully'
    };
}
export async function submitCompOffRequest(selectedIds: number[]) {
    const db = createLocalCrud<CompOffRequestItem>('compOffRequest');
    // Update status of selected items to 'Pending'
    selectedIds.forEach(id => {
        const item = db.findById(id);
        if (item) {
            db.update(id, { ...item, status: 'Pending' });
        }
    });
    return {
        success: true,
        message: 'Comp off request submitted successfully'
    };
}
export async function cancelCompOffRequest(selectedIds: number[]) {
    const db = createLocalCrud<CompOffRequestItem>('compOffRequest');
    // Update status of selected items to 'Cancelled'
    selectedIds.forEach(id => {
        const item = db.findById(id);
        if (item) {
            db.update(id, { ...item, status: 'Cancelled' });
        }
    });
    return {
        success: true,
        message: 'Comp off request cancelled successfully'
    };
}

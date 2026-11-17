'use server';
import { createLocalCrud } from '@/lib/localdb';
export interface EmployeeMissingLog {
    id: number;
    employeeName: string;
    date: string;
    time: string;
    inOut: 'IN' | 'OUT';
    file?: string;
    remarks?: string;
    reportedBy?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: Date;
}
const store = createLocalCrud<EmployeeMissingLog>('employeeMissingLogs');
export async function getEmployeeMissingLogs() {
    return {
        success: true,
        data: store.list(),
        message: 'Employee missing logs retrieved successfully'
    };
}
export async function addOrUpdateEmployeeMissingLog(data: {
    id?: number;
    employeeName: string;
    date: string;
    time: string;
    inOut: 'IN' | 'OUT';
    file?: string;
    remarks?: string;
    reportedBy?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}) {
    try {
        if (data.id) {
            const updated = store.update(data.id, {
                employeeName: data.employeeName,
                date: data.date,
                time: data.time,
                inOut: data.inOut,
                file: data.file,
                remarks: data.remarks,
                reportedBy: data.reportedBy,
                status: data.status
            });
            if (updated) {
                return {
                    success: true,
                    data: updated,
                    message: 'Employee missing log updated successfully'
                };
            }
            return {
                success: false,
                message: 'Employee missing log not found'
            };
        } else {
            const created = store.create({
                employeeName: data.employeeName,
                date: data.date,
                time: data.time,
                inOut: data.inOut,
                file: data.file,
                remarks: data.remarks,
                reportedBy: data.reportedBy,
                status: data.status
            });
            return {
                success: true,
                data: created,
                message: 'Employee missing log created successfully'
            };
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Failed to save employee missing log'
        };
    }
}
export async function deleteEmployeeMissingLog(id: number) {
    try {
        const removed = store.remove(id);
        if (removed) {
            return {
                success: true,
                message: 'Employee missing log deleted successfully'
            };
        }
        return {
            success: false,
            message: 'Employee missing log not found'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Failed to delete employee missing log'
        };
    }
}

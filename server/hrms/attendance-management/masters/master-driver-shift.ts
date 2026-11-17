'use server';
import { createLocalCrud } from '@/lib/localdb';
export interface MasterDriverShift {
    id: number;
    shift: string;
    driver: string;
    fromDate: string;
    toDate: string;
    remarks?: string;
    saturdayOff: boolean;
    sundayWorking: boolean;
    isActive?: boolean;
    createdAt: Date;
}
const store = createLocalCrud<MasterDriverShift>('attendance:master-driver-shift');
export async function getMasterDriverShift() {
    return {
        success: true,
        data: store.list(),
        message: 'Master driver shifts retrieved successfully'
    };
}
export async function addOrUpdateMasterDriverShift(data: {
    id?: number;
    shift: string;
    driver: string;
    fromDate: string;
    toDate: string;
    remarks?: string;
    saturdayOff: boolean;
    sundayWorking: boolean;
    isActive?: boolean;
}) {
    try {
        if (data.id) {
            const updated = store.update(data.id, {
                shift: data.shift,
                driver: data.driver,
                fromDate: data.fromDate,
                toDate: data.toDate,
                remarks: data.remarks,
                saturdayOff: data.saturdayOff,
                sundayWorking: data.sundayWorking,
                isActive: data.isActive
            });
            if (updated) {
                return {
                    success: true,
                    data: updated,
                    message: 'Master driver shift updated successfully'
                };
            }
            return {
                success: false,
                message: 'Master driver shift not found'
            };
        } else {
            const created = store.create({
                shift: data.shift,
                driver: data.driver,
                fromDate: data.fromDate,
                toDate: data.toDate,
                remarks: data.remarks,
                saturdayOff: data.saturdayOff,
                sundayWorking: data.sundayWorking,
                isActive: data.isActive ?? true
            });
            return {
                success: true,
                data: created,
                message: 'Master driver shift created successfully'
            };
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Failed to save master driver shift'
        };
    }
}
export async function deleteMasterDriverShift(id: number) {
    try {
        const removed = store.remove(id);
        if (removed) {
            return {
                success: true,
                message: 'Master driver shift deleted successfully'
            };
        }
        return {
            success: false,
            message: 'Master driver shift not found'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Failed to delete master driver shift'
        };
    }
}

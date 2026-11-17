'use server';
import { createLocalCrud } from '@/lib/localdb';
export interface MasterShift {
    id: number;
    shiftName: string;
    startTime: string;
    endTime: string;
    remarks: string;
    specificDay: boolean;
    createdAt: Date;
}
const store = createLocalCrud<MasterShift>('attendance:master-shift');
// Initialize with sample data if empty
function initializeSampleData() {
    const shifts = store.list();
    if (shifts.length === 0) {
        const sampleShifts: Omit<MasterShift, 'id' | 'createdAt'>[] = [
            {
                shiftName: 'Office Staffs',
                startTime: '08:00',
                endTime: '16:00',
                remarks: 'Standard office hours',
                specificDay: false
            },
            {
                shiftName: 'Teaching Staff',
                startTime: '08:00',
                endTime: '14:00',
                remarks: 'Teaching staff shift',
                specificDay: false
            },
            {
                shiftName: 'Morning Shift',
                startTime: '06:00',
                endTime: '14:00',
                remarks: 'Early morning shift',
                specificDay: false
            },
            {
                shiftName: 'Evening Shift',
                startTime: '14:00',
                endTime: '22:00',
                remarks: 'Evening shift',
                specificDay: false
            },
            {
                shiftName: 'Night Shift',
                startTime: '22:00',
                endTime: '06:00',
                remarks: 'Night shift',
                specificDay: false
            }
        ];
        sampleShifts.forEach((shift) => {
            store.create(shift);
        });
    }
}
export async function getMasterShift() {
    initializeSampleData();
    return {
        success: true,
        data: store.list(),
        message: 'Master shift retrieved successfully'
    };
}
export async function addOrUpdateMasterShift(data: {
    id?: number;
    shiftName: string;
    startTime: string;
    endTime: string;
    remarks: string;
    specificDay: boolean;
}) {
    try {
        // Check for uniqueness of shift name (case-insensitive)
        const existingShifts = store.list();
        const duplicateShift = existingShifts.find(
            (shift) => shift.id !== data.id && shift.shiftName.toLowerCase().trim() === data.shiftName.toLowerCase().trim()
        );
        if (duplicateShift) {
            return {
                success: false,
                message: 'Shift Name must be unique. A shift with this name already exists.'
            };
        }
        if (data.id) {
            const updated = store.update(data.id, {
                shiftName: data.shiftName,
                startTime: data.startTime,
                endTime: data.endTime,
                remarks: data.remarks,
                specificDay: data.specificDay
            });
            if (updated) {
                return {
                    success: true,
                    data: updated,
                    message: 'Master shift updated successfully'
                };
            }
            return {
                success: false,
                message: 'Master shift not found'
            };
        } else {
            const created = store.create({
                shiftName: data.shiftName,
                startTime: data.startTime,
                endTime: data.endTime,
                remarks: data.remarks,
                specificDay: data.specificDay
            });
            return {
                success: true,
                data: created,
                message: 'Master shift created successfully'
            };
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Failed to save master shift'
        };
    }
}
export async function deleteMasterShift(id: number) {
    try {
        const removed = store.remove(id);
        if (removed) {
            return {
                success: true,
                message: 'Master shift deleted successfully'
            };
        }
        return {
            success: false,
            message: 'Master shift not found'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Failed to delete master shift'
        };
    }
}

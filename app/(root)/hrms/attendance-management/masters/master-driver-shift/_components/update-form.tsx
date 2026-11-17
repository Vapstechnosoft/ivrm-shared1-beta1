'use client';
import { useMasterDriverShift, useSaveMasterDriverShift } from '@/hooks/hrms/attendance-management/useMasters';
import type { DriverShift } from './columns';
import { DriverShiftForm } from './driver-shift-form';
import type { DriverShiftForm as DriverShiftFormType } from './driver-shift-form';
interface UpdateMasterDriverShiftFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: DriverShift;
}
export default function UpdateMasterDriverShiftForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterDriverShiftFormProps) {
    const { refetchAll } = useMasterDriverShift();
    const { mutate: saveDriverShift } = useSaveMasterDriverShift();
    const editingShift: DriverShiftFormType = {
        shift: row.shift || '',
        driver: row.driver || '',
        fromDate: row.fromDate || '',
        toDate: row.toDate || '',
        remarks: row.remarks || '',
        saturdayOff: row.saturdayOff || false,
        sundayWorking: row.sundayWorking || false
    };
    const handleSubmit = (data: DriverShiftFormType) => {
        saveDriverShift(
            {
                id: row.id,
                shift: data.shift,
                driver: data.driver,
                fromDate: data.fromDate,
                toDate: data.toDate,
                remarks: data.remarks,
                saturdayOff: data.saturdayOff ?? false,
                sundayWorking: data.sundayWorking ?? false,
                isActive: row.isActive ?? true
            },
            {
                onSuccess: () => {
                    refetchAll();
                    onSuccess?.();
                }
            }
        );
    };
    return (
        <div className={className}>
            <DriverShiftForm editingShift={editingShift} onSubmit={handleSubmit} onCancel={() => onSuccess?.()} />
        </div>
    );
}

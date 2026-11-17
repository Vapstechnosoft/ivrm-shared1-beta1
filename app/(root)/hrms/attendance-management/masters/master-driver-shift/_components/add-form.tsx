'use client';
import { useMasterDriverShift, useSaveMasterDriverShift } from '@/hooks/hrms/attendance-management/useMasters';
import { DriverShiftForm } from './driver-shift-form';
import type { DriverShiftForm as DriverShiftFormType } from './driver-shift-form';
interface AddMasterDriverShiftFormProps {
    onSuccess?: () => void;
    className?: string;
}
export default function AddMasterDriverShiftForm({ onSuccess, className = '' }: AddMasterDriverShiftFormProps) {
    const { refetchAll } = useMasterDriverShift();
    const { mutate: saveDriverShift } = useSaveMasterDriverShift();
    const handleSubmit = (data: DriverShiftFormType) => {
        saveDriverShift(
            {
                shift: data.shift,
                driver: data.driver,
                fromDate: data.fromDate,
                toDate: data.toDate,
                remarks: data.remarks,
                saturdayOff: data.saturdayOff ?? false,
                sundayWorking: data.sundayWorking ?? false,
                isActive: true
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
            <DriverShiftForm editingShift={null} onSubmit={handleSubmit} onCancel={() => onSuccess?.()} />
        </div>
    );
}

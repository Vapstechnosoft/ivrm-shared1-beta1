'use client';
import { useEmployeeMissingLogs, useSaveEmployeeMissingLog } from '@/hooks/hrms/attendance-management/useMasters';
import { MissingLogForm } from './missing-log-form';
import type { MissingLogFormData } from './missing-log-form';
interface AddEmployeeMissingLogFormProps {
    onSuccess?: () => void;
    className?: string;
}
export default function AddEmployeeMissingLogForm({ onSuccess, className = '' }: AddEmployeeMissingLogFormProps) {
    const { refetchAll } = useEmployeeMissingLogs();
    const { mutate: saveMissingLog } = useSaveEmployeeMissingLog();
    const handleSubmit = (data: MissingLogFormData) => {
        // Create one record per entry
        data.entries.forEach((entry) => {
            saveMissingLog(
                {
                    employeeName: data.employeeName,
                    date: data.date,
                    time: entry.time,
                    inOut: entry.inOut,
                    remarks: entry.remarks,
                    file: entry.file,
                    reportedBy: 'VTSPD',
                    status: 'Approved' as const
                },
                {
                    onSuccess: () => {
                        refetchAll();
                        onSuccess?.();
                    }
                }
            );
        });
    };
    return (
        <div className={className}>
            <MissingLogForm editingMissingLog={null} onSubmit={handleSubmit} onCancel={() => onSuccess?.()} />
        </div>
    );
}

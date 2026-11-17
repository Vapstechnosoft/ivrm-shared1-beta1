'use client';
import { useEmployeeMissingLogs, useSaveEmployeeMissingLog } from '@/hooks/hrms/attendance-management/useMasters';
import type { MissingLog } from './columns';
import { MissingLogForm } from './missing-log-form';
import type { MissingLogFormData } from './missing-log-form';
interface UpdateEmployeeMissingLogFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: MissingLog;
}
export default function UpdateEmployeeMissingLogForm({ onSuccess, className = '', selectedRow: row }: UpdateEmployeeMissingLogFormProps) {
    const { refetchAll } = useEmployeeMissingLogs();
    const { mutate: saveMissingLog } = useSaveEmployeeMissingLog();
    const editingMissingLog: MissingLog = {
        ...row
    };
    const handleSubmit = (data: MissingLogFormData) => {
        // For editing, update the single entry
        const entry = data.entries[0];
        saveMissingLog(
            {
                id: row.id,
                employeeName: data.employeeName,
                date: data.date,
                time: entry.time,
                inOut: entry.inOut,
                remarks: entry.remarks,
                file: entry.file,
                reportedBy: row.reportedBy || 'VTSPD',
                status: row.status
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
            <MissingLogForm editingMissingLog={editingMissingLog} onSubmit={handleSubmit} onCancel={() => onSuccess?.()} />
        </div>
    );
}

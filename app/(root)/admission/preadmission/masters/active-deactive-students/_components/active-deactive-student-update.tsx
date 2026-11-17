import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Trash } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

type Student = { student_id: number; student_name: string };

// Mock data for demonstration
const REASON_OPTIONS: { key: string; name: string }[] = [
    { key: 'Fee Due', name: 'Fee Due' },
    { key: 'Long Absent', name: 'Long Absent' },
    { key: 'Medical', name: 'Medical' }
];

const Select: React.FC<{
    value: string | number;
    onChange: (v: string) => void;
    options: { key: string; name: string }[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    error?: boolean;
}> = ({ value, onChange, options, placeholder = '', disabled, className = '', error = false }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}>
        <option value=''>{placeholder}</option>
        {options.map((opt) => (
            <option key={opt.key} value={opt.key}>
                {opt.name}
            </option>
        ))}
    </select>
);

const Input: React.FC<{
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    className?: string;
    error?: boolean;
    disabled?: boolean;
}> = ({ value, onChange, placeholder = '', className = '', error = false, disabled = false }) => (
    <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
    />
);

// Update Student Status Dialog Component
type UpdateItem = {
    amsT_Id: number;
    reason: string;
    remarks: string;
    student_name: string;
};

type UpdatesMap = Record<number, UpdateItem>;
type ErrorsMap = Record<number, string>;

interface UpdateStudentStatusDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedStudents: Student[];
    amsT_SOL: string;
    asmaY_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    onSubmit: (payload: {
        amsT_SOL: string;
        asmaY_Id: number;
        asmcL_Id: number;
        asmS_Id: number;
        students: Array<{
            amsT_Id: number;
            reason: string;
            remarks: string;
        }>;
    }) => Promise<void> | void;
}

export const UpdateStudentStatusDialog: React.FC<UpdateStudentStatusDialogProps> = ({
    isOpen,
    onClose,
    selectedStudents,
    amsT_SOL,
    asmaY_Id,
    asmcL_Id,
    asmS_Id,
    onSubmit
}) => {
    const [updates, setUpdates] = useState<UpdatesMap>({});
    const [errors, setErrors] = useState<ErrorsMap>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen && selectedStudents.length > 0) {
            setUpdates((prev) => {
                const map: UpdatesMap = { ...prev };
                selectedStudents.forEach((s) => {
                    if (!map[s.student_id]) {
                        map[s.student_id] = {
                            amsT_Id: s.student_id,
                            reason: '',
                            remarks: '',
                            student_name: s.student_name
                        };
                    }
                });
                return map;
            });
        } else if (!isOpen) {
            setUpdates({});
            setErrors({});
        }
    }, [isOpen, selectedStudents]);

    const setReason = (key: number, reason: string) => {
        setUpdates((p) => ({ ...p, [key]: { ...p[key], reason } }));
        setErrors((e) => ({ ...e, [key]: '' }));
    };

    const setRemarks = (id: number, remarks: string) => {
        setUpdates((p) => ({ ...p, [id]: { ...p[id], remarks } }));
        setErrors((e) => ({ ...e, [id]: '' }));
    };

    const removeStudent = (id: number) => {
        setUpdates((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    };

    const validate = (): boolean => {
        const err: ErrorsMap = {};
        let ok = true;

        Object.values(updates).forEach((u) => {
            if (!u.reason) {
                err[u.amsT_Id] = 'Please select a reason';
                ok = false;
            } else if (!u.remarks.trim()) {
                err[u.amsT_Id] = 'Remarks are required';
                ok = false;
            }
        });

        setErrors(err);
        return ok;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsSubmitting(true);
        const payload = {
            amsT_SOL: amsT_SOL,
            asmaY_Id: asmaY_Id,
            asmcL_Id: asmcL_Id,
            asmS_Id: asmS_Id,
            students: Object.values(updates).map((u) => ({
                amsT_Id: u.amsT_Id,
                reason: u.reason,
                remarks: u.remarks
            }))
        };

        await onSubmit(payload);
        setIsSubmitting(false);
    };

    const completedCount = Object.values(updates).filter((u) => u.reason && u.remarks.trim()).length;

    const allValid = completedCount === Object.keys(updates).length;

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
            <div className='flex max-h-[90vh] w-full max-w-5xl flex-col rounded-lg bg-white shadow-xl'>
                {/* Header */}
                <div className='border-b bg-gray-50 p-6'>
                    <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                            <h2 className='font-semibold text-gray-900 text-xl'>Update Student Status</h2>
                            <div className='mt-3 space-y-1'>
                                <div className='text-gray-600 text-sm'>
                                    Total selected: <strong>{Object.keys(updates).length}</strong>
                                </div>
                                <div className='flex items-center gap-2 text-sm'>
                                    <span className='text-gray-500'>
                                        {completedCount} / {Object.keys(updates).length} completed
                                    </span>
                                    {allValid && <CheckCircle2 className='h-5 w-5 text-green-500' />}
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={onClose}
                            className='w-fit text-gray-400 transition-colors hover:text-gray-600'
                            disabled={isSubmitting}>
                            <Trash className='h-6 w-6' />
                        </Button>
                    </div>
                </div>

                {/* Body */}
                <div className='flex-1 overflow-auto p-6'>
                    {Object.keys(updates).length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-12 text-gray-500'>
                            <AlertCircle className='mb-3 h-12 w-12' />
                            <p>No students selected</p>
                        </div>
                    ) : (
                        <div className='overflow-hidden rounded-lg border border-gray-200'>
                            <table className='w-full'>
                                <thead className='border-gray-200 border-b bg-gray-50'>
                                    <tr>
                                        <th className='w-16 px-4 py-3 text-left font-medium text-gray-700 text-xs uppercase tracking-wider'>
                                            Sl.
                                        </th>
                                        <th className='min-w-[200px] px-4 py-3 text-left font-medium text-gray-700 text-xs uppercase tracking-wider'>
                                            Student Name
                                        </th>
                                        <th className='min-w-[220px] px-4 py-3 text-left font-medium text-gray-700 text-xs uppercase tracking-wider'>
                                            Reason <span className='text-red-500'>*</span>
                                        </th>
                                        <th className='min-w-[280px] px-4 py-3 text-left font-medium text-gray-700 text-xs uppercase tracking-wider'>
                                            Remarks <span className='text-red-500'>*</span>
                                        </th>
                                        <th className='w-20 px-4 py-3 text-left font-medium text-gray-700 text-xs uppercase tracking-wider'>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200 bg-white'>
                                    {Object.values(updates).map((u, idx) => (
                                        <tr key={u.amsT_Id} className='transition-colors hover:bg-gray-50'>
                                            <td className='px-4 py-3 text-gray-900 text-sm'>{idx + 1}</td>
                                            <td className='px-4 py-3 font-medium text-gray-900 text-sm'>{u.student_name}</td>
                                            <td className='px-4 py-3'>
                                                <Select
                                                    value={u.reason}
                                                    onChange={(v) => setReason(u.amsT_Id, v)}
                                                    options={REASON_OPTIONS}
                                                    placeholder='Select reason'
                                                    error={!!errors[u.amsT_Id] && !u.reason}
                                                    disabled={isSubmitting}
                                                />
                                            </td>
                                            <td className='px-4 py-3'>
                                                <div>
                                                    <Input
                                                        value={u.remarks}
                                                        onChange={(v) => setRemarks(u.amsT_Id, v)}
                                                        placeholder='Enter remarks...'
                                                        error={!!errors[u.amsT_Id] && !u.remarks.trim()}
                                                        disabled={isSubmitting}
                                                    />
                                                    {errors[u.amsT_Id] && <p className='mt-1 text-red-500 text-xs'>{errors[u.amsT_Id]}</p>}
                                                </div>
                                            </td>
                                            <td className='px-4 py-3'>
                                                <Button
                                                    onClick={() => removeStudent(u.amsT_Id)}
                                                    className='rounded p-2 text-red-600 transition-colors hover:bg-red-50'
                                                    disabled={isSubmitting}>
                                                    <Trash className='h-4 w-4' />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className='flex justify-end gap-3 border-t bg-gray-50 p-6'>
                    <Button className='w-fit' variant='outline' onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        className='w-fit'
                        onClick={handleSubmit}
                        disabled={!allValid || isSubmitting || Object.keys(updates).length === 0}>
                        {isSubmitting ? (
                            <>
                                <span className='mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                                Updating...
                            </>
                        ) : (
                            <>Update {Object.keys(updates).length} Student(s)</>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Demo wrapper to show the dialog
export default function UpdateDialogDemo() {
    const [isOpen, setIsOpen] = useState(true);

    const handleSubmit = async (updates: {
        amsT_SOL: string;
        asmaY_Id: number;
        asmcL_Id: number;
        asmS_Id: number;
        students: Array<{
            amsT_Id: number;
            reason: string;
            remarks: string;
        }>;
    }) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        alert(`Successfully updated ${updates.students.length} student(s)!`);
        setIsOpen(false);
    };

    return (
        <div className='min-h-screen bg-gray-100 p-8'>
            <div className='mx-auto max-w-2xl rounded-lg bg-white p-6 shadow'>
                <h1 className='mb-4 font-bold text-2xl'>Update Student Status Dialog Demo</h1>
                <p className='mb-4 text-gray-600'>Configure the dialog with your data and click the button below to open it.</p>
                <Button onClick={() => setIsOpen(true)}>Open Update Dialog</Button>
            </div>

            <UpdateStudentStatusDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                selectedStudents={[]}
                amsT_SOL=''
                asmaY_Id={0}
                asmcL_Id={0}
                asmS_Id={0}
                onSubmit={handleSubmit}
            />
        </div>
    );
}

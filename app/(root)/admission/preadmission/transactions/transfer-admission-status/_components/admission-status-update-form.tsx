'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { isAlphabetsOnly } from '@/schemas/validationSchemas';
import type { IPreadmissionApplicationList } from '@/types/admission/preadmission/transactions';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdmissionStatusUpdate {
    pasr_id: number;
    status_id: number;
    remarks: string;
    student_name: string;
    current_status: string;
}

interface AdmissionStatusUpdateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedStudents: IPreadmissionApplicationList[];
    admissionStatuses: Array<{ pamsT_Id: number; pamsT_Status: string }>;
    onSubmit: (updates: Array<{ pasr_id: number; status_id: number; remarks: string }>) => Promise<void>;
    onDeselectStudent: (pasrId: number) => void;
}

export function AdmissionStatusUpdateDialog({
    isOpen,
    onClose,
    selectedStudents,
    admissionStatuses,
    onSubmit,
    onDeselectStudent
}: AdmissionStatusUpdateDialogProps) {
    const [admissionStatusUpdates, setAdmissionStatusUpdates] = useState<Record<number, AdmissionStatusUpdate>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<number, string>>({});

    // Initialize status updates when dialog opens
    useEffect(() => {
        if (isOpen && selectedStudents.length > 0) {
            setAdmissionStatusUpdates((prev) => {
                const newUpdates = { ...prev };

                // Add new students that aren't already in the updates
                selectedStudents.forEach((student) => {
                    if (!newUpdates[student.pasr_id]) {
                        newUpdates[student.pasr_id] = {
                            pasr_id: student.pasr_id,
                            status_id: 0,
                            remarks: '',
                            student_name: student.student_name,
                            current_status: student.current_status
                        };
                    }
                });

                return newUpdates;
            });
        } else if (!isOpen) {
            // Reset when dialog closes
            setAdmissionStatusUpdates({});
            setErrors({});
        }
    }, [isOpen, selectedStudents]);

    const handleStatusChange = (pasrId: number, statusId: number) => {
        setAdmissionStatusUpdates((prev) => ({
            ...prev,
            [pasrId]: { ...prev[pasrId], status_id: statusId }
        }));
        setErrors((prev) => ({ ...prev, [pasrId]: '' }));
    };

    const handleRemarksChange = (pasrId: number, remarks: string) => {
        if (remarks && !isAlphabetsOnly(remarks)) {
            setErrors((prev) => ({
                ...prev,
                [pasrId]: 'Remarks should contain only alphabets'
            }));
            return;
        }

        setAdmissionStatusUpdates((prev) => ({
            ...prev,
            [pasrId]: { ...prev[pasrId], remarks }
        }));
        setErrors((prev) => ({ ...prev, [pasrId]: '' }));
    };

    const handleDeselect = (pasrId: number) => {
        const newUpdates = { ...admissionStatusUpdates };
        delete newUpdates[pasrId];
        setAdmissionStatusUpdates(newUpdates);
        onDeselectStudent(pasrId);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<number, string> = {};
        let isValid = true;

        Object.entries(admissionStatusUpdates).forEach(([pasrId, update]) => {
            if (!update.status_id || update.status_id === 0) {
                newErrors[Number(pasrId)] = 'Please select a status';
                isValid = false;
            } else if (!update.remarks.trim()) {
                newErrors[Number(pasrId)] = 'Please enter remarks';
                isValid = false;
            } else if (!isAlphabetsOnly(update.remarks)) {
                newErrors[Number(pasrId)] = 'Remarks should contain only alphabets';
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const updates = Object.values(admissionStatusUpdates).map((update) => ({
                pasr_id: update.pasr_id,
                status_id: update.status_id,
                remarks: update.remarks
            }));

            await onSubmit(updates);
            setErrors({});
        } catch (error) {
            console.error('Error updating statuses:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getAvailableStatuses = (currentStatus: string) => {
        return admissionStatuses.filter((status) => status.pamsT_Status !== currentStatus);
    };

    const allValid = Object.values(admissionStatusUpdates).every((update) => update.status_id !== 0 && update.remarks.trim() !== '');

    const completedCount = Object.values(admissionStatusUpdates).filter(
        (update) => update.status_id !== 0 && update.remarks.trim() !== ''
    ).length;

    return (
        <AdaptiveDialog
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className='flex items-center justify-start gap-6'>
                    <span>Update Admission Status</span>
                </div>
            }
            description={
                <span className='flex flex-col gap-2'>
                    <span>
                        Total selected students: <b>{Object.keys(admissionStatusUpdates).length}</b>
                    </span>

                    <span className='flex items-center gap-2 font-normal text-sm'>
                        <span className='text-muted-foreground'>
                            {completedCount} / {Object.keys(admissionStatusUpdates).length} completed
                        </span>
                        {allValid && <CheckCircle2 className='h-5 w-5 text-green-500' />}
                    </span>
                </span>
            }
            size='5xl'>
            <AdaptiveBody className='max-h-[60vh]'>
                <div className='space-y-4'>
                    {Object.keys(admissionStatusUpdates).length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-8 text-center'>
                            <AlertCircle className='mb-2 h-12 w-12 text-muted-foreground' />
                            <p className='text-muted-foreground'>No students selected</p>
                        </div>
                    ) : (
                        <div className='overflow-hidden rounded-lg border'>
                            <Table>
                                <TableHeader>
                                    <TableRow className='bg-muted/50'>
                                        <TableHead className='w-[40px]'>Sl.No</TableHead>
                                        <TableHead className='min-w-[200px]'>Student Name</TableHead>
                                        <TableHead className='min-w-[150px]'>Current Status</TableHead>
                                        <TableHead className='min-w-[200px] text-center'>
                                            New Status<span className='ml-1 text-red-500'>*</span>
                                        </TableHead>
                                        <TableHead className='min-w-[300px] text-center'>
                                            Remarks<span className='ml-1 text-red-500'>*</span>
                                        </TableHead>
                                        <TableHead className='w-[80px]'>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.values(admissionStatusUpdates).map((update, index) => (
                                        <TableRow key={update.pasr_id} className='group'>
                                            <TableCell className='font-medium'>{index + 1}</TableCell>
                                            <TableCell className='font-medium'>{update.student_name}</TableCell>
                                            <TableCell>
                                                <span className='inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-800 text-xs'>
                                                    {update.current_status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={update.status_id?.toString()}
                                                    onValueChange={(value) => handleStatusChange(update.pasr_id, Number(value))}>
                                                    <SelectTrigger
                                                        className={errors[update.pasr_id] && !update.status_id ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder='Select new status' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {getAvailableStatuses(update.current_status).map((status) => (
                                                            <SelectItem key={status.pamsT_Id} value={status.pamsT_Id.toString()}>
                                                                {status.pamsT_Status}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <InputTextarea
                                                    placeholder='Enter remarks...'
                                                    value={update.remarks}
                                                    onChange={(e) => handleRemarksChange(update.pasr_id, e.target.value)}
                                                    className={`resize-none ${
                                                        errors[update.pasr_id] && !update.remarks.trim() ? 'border-red-500' : ''
                                                    }`}
                                                    minHeight={20}
                                                />
                                                {errors[update.pasr_id] && (
                                                    <p className='mt-1 text-red-500 text-xs'>{errors[update.pasr_id]}</p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    onClick={() => handleDeselect(update.pasr_id)}
                                                    className='h-8 w-8 bg-gray-200 p-0 text-red-500 hover:bg-red-50 hover:text-red-600'>
                                                    <X className='h-4 w-4' />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </AdaptiveBody>

            <AdaptiveFooter className='flex w-full justify-end gap-4'>
                <Button variant='outline' className='w-fit' onClick={onClose} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button
                    className='w-fit'
                    onClick={handleSubmit}
                    disabled={!allValid || isSubmitting || Object.keys(admissionStatusUpdates).length === 0}>
                    {isSubmitting ? (
                        <>
                            <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                            Updating...
                        </>
                    ) : (
                        `Update ${Object.keys(admissionStatusUpdates).length} Student(s)`
                    )}
                </Button>
            </AdaptiveFooter>
        </AdaptiveDialog>
    );
}

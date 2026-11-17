'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IPreadmissionApplicationList } from '@/types/admission/preadmission/transactions';
import { AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ExportPreadmissionToAdmission {
    pasr_id: number;
    pasR_RegistrationNo: string;
    student_name: string;
    pasR_Sex: string;
    applied_class_name: string;
}

interface ExportPreadmissionToAdmissionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedStudents: IPreadmissionApplicationList[];
    onSubmit: (updates: Array<{ pasr_id: number }>) => Promise<void>;
    onDeselectStudent: (pasrId: number) => void;
}

export function ExportPreadmissionToAdmissionDialog({
    isOpen,
    onClose,
    selectedStudents,
    onSubmit,
    onDeselectStudent
}: ExportPreadmissionToAdmissionDialogProps) {
    const [exportPreadmissionToAdmissions, setExportPreadmissionToAdmissions] = useState<Record<number, ExportPreadmissionToAdmission>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize status updates when dialog opens
    useEffect(() => {
        if (isOpen && selectedStudents.length > 0) {
            const initialUpdates: Record<number, ExportPreadmissionToAdmission> = {};
            selectedStudents.forEach((student) => {
                initialUpdates[student.pasr_id] = {
                    pasr_id: student.pasr_id,
                    pasR_RegistrationNo: student.pasR_RegistrationNo,
                    student_name: student.student_name,
                    pasR_Sex: student.pasR_Sex,
                    applied_class_name: student.applied_class_name
                };
            });
            setExportPreadmissionToAdmissions(initialUpdates);
        }
    }, [isOpen, selectedStudents]);

    const handleDeselect = (pasrId: number) => {
        const newUpdates = { ...exportPreadmissionToAdmissions };
        delete newUpdates[pasrId];
        setExportPreadmissionToAdmissions(newUpdates);
        onDeselectStudent(pasrId);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const updates = Object.values(exportPreadmissionToAdmissions).map((update) => ({
                pasr_id: update.pasr_id
            }));

            await onSubmit(updates);
        } catch (error) {
            console.error('Error updating statuses:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdaptiveDialog
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className='flex items-center justify-start gap-6'>
                    <span>Export Preadmission to Admission</span>
                </div>
            }
            description={
                <span className='flex flex-col gap-2'>
                    <span>
                        Total selected students: <b>{Object.keys(exportPreadmissionToAdmissions).length}</b>
                    </span>
                </span>
            }
            size='5xl'>
            <AdaptiveBody className='max-h-[60vh]'>
                <div className='space-y-4'>
                    {Object.keys(exportPreadmissionToAdmissions).length === 0 ? (
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
                                        <TableHead className='min-w-[150px]'>Registration No</TableHead>
                                        <TableHead className='min-w-[200px]'>Student Name</TableHead>
                                        <TableHead className='min-w-[100px]'>Gender</TableHead>
                                        <TableHead className='min-w-[100px]'>Applied Class</TableHead>
                                        <TableHead className='w-[80px]'>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.values(exportPreadmissionToAdmissions).map((update, index) => (
                                        <TableRow key={update.pasr_id} className='group'>
                                            <TableCell className='font-medium'>{index + 1}</TableCell>
                                            <TableCell className='font-medium'>{update.pasR_RegistrationNo ?? 'N.A'}</TableCell>
                                            <TableCell className='font-medium'>{update.student_name}</TableCell>
                                            <TableCell className='font-medium'>{update.pasR_Sex}</TableCell>
                                            <TableCell className='font-medium'>{update.applied_class_name}</TableCell>
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
                    disabled={isSubmitting || Object.keys(exportPreadmissionToAdmissions).length === 0}>
                    {isSubmitting ? (
                        <>
                            <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                            Exporting...
                        </>
                    ) : (
                        `Export ${Object.keys(exportPreadmissionToAdmissions).length} Student(s)`
                    )}
                </Button>
            </AdaptiveFooter>
        </AdaptiveDialog>
    );
}

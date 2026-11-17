'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { IClassWorkMarksList, classWorkMarksListSchema } from '@/schemas/upload/transactions/ivrm-classwork.schema';
import { fetchClassWorkStudents, saveClassWorkMarks } from '@/server/upload/transactions/ivrm-classwork/server-action';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, RefreshCw, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function MarksEntryForm() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm<IClassWorkMarksList>({
        resolver: zodResolver(classWorkMarksListSchema),
        mode: 'onChange',
        defaultValues: {
            icW_Id: 0,
            students: []
        }
    });

    const { fields } = useFieldArray({
        control,
        name: 'students'
    });

    // This would typically come from context or props
    const loadStudents = async (id: number) => {
        setIsLoading(true);
        try {
            const students = await fetchClassWorkStudents(id);
            reset({
                icW_Id: id,
                students: students
            });
        } catch (error) {
            toast.error('Failed to load students');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit: SubmitHandler<IClassWorkMarksList> = async (data) => {
        try {
            setIsSubmitting(true);
            // Filter only checked students
            const checkedStudents = data.students.filter(s => s.checked);

            if (checkedStudents.length === 0) {
                toast.warning('Please select at least one student to save.');
                return;
            }

            const result = await saveClassWorkMarks(checkedStudents);
            if (result.success) {
                toast.success(result.message);
                handleClose();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to save marks');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        if (selectedRow?.icW_Id) {
            loadStudents(selectedRow.icW_Id);
            toast.info('Form reset to original values');
        }
    };

    const handleClose = () => {
        // This would typically be passed as a prop
        console.log('Closing form');
    };

    // Mock data for example - remove this in production
    useEffect(() => {
        // Simulate loading a selected row
        const mockRow = {
            icW_Id: 1,
            icW_Topic: 'Mathematics Assignment',
            icW_FromDate: new Date().toISOString()
        };
        setSelectedRow(mockRow);
        loadStudents(mockRow.icW_Id);
    }, []);

    if (!selectedRow) return null;

    return (
        <div className='flex w-full flex-col gap-4 rounded-md border bg-white p-4 shadow-sm'>
            <div className='flex items-center justify-between border-b pb-4'>
                <div>
                    <h2 className='text-lg font-semibold'>ClassWork Marks Entry</h2>
                    <p className='text-sm text-muted-foreground'>
                        Topic: {selectedRow.icW_Topic} | Date: {new Date(selectedRow.icW_FromDate).toLocaleDateString()}
                    </p>
                </div>
                <Button variant='ghost' size='icon' onClick={handleClose}>
                    <X className='h-4 w-4' />
                </Button>
            </div>

            {isLoading ? (
                <div className='flex h-40 items-center justify-center text-muted-foreground'>
                    Loading students...
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                    <div className='overflow-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-[50px]'>Select</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Adm No</TableHead>
                                    <TableHead>Roll No</TableHead>
                                    <TableHead>Student Upload</TableHead>
                                    <TableHead>Enter Marks</TableHead>
                                    <TableHead>Staff Remarks</TableHead>
                                    <TableHead>Staff Upload</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.map((field, index) => {
                                    const isChecked = watch(`students.${index}.checked`);
                                    return (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <Controller
                                                    name={`students.${index}.checked`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <input
                                                            type='checkbox'
                                                            checked={field.value}
                                                            onChange={field.onChange}
                                                            className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>{watch(`students.${index}.studentName`)}</TableCell>
                                            <TableCell>{watch(`students.${index}.admNo`)}</TableCell>
                                            <TableCell>{watch(`students.${index}.rollNo`)}</TableCell>
                                            <TableCell>
                                                {/* Student Upload View */}
                                                {watch(`students.${index}.studentUploads`)?.map((upload: any, uIdx: number) => (
                                                    <Button
                                                        key={upload.icwupl_Id || uIdx}
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="mb-1 mr-1 h-6 px-2 text-xs"
                                                        onClick={() => {
                                                            if (upload.icwupl_Attachment) {
                                                                window.open(upload.icwupl_Attachment, '_blank');
                                                            } else {
                                                                toast.error('No attachment link available.');
                                                            }
                                                        }}
                                                    >
                                                        <Eye className="mr-1 h-3 w-3" />
                                                        {upload.icwupl_FileName || 'View'}
                                                    </Button>
                                                ))}
                                                {(!watch(`students.${index}.studentUploads`) || watch(`students.${index}.studentUploads`)?.length === 0) && (
                                                    <span className="text-xs text-muted-foreground">No file</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className='group flex flex-col gap-1'>
                                                    <input
                                                        type="text"
                                                        {...register(`students.${index}.icwupl_Marks`)}
                                                        placeholder="Marks"
                                                        className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                                                        disabled={!isChecked}
                                                    />
                                                    {errors.students?.[index]?.icwupl_Marks && (
                                                        <FormError className='text-xs'>
                                                            {errors.students[index]?.icwupl_Marks?.message}
                                                        </FormError>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className='group flex flex-col gap-1'>
                                                    <textarea
                                                        {...register(`students.${index}.icwupl_StaffRemarks`)}
                                                        placeholder="Remarks"
                                                        className='min-h-[40px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                                                        disabled={!isChecked}
                                                    />
                                                    {errors.students?.[index]?.icwupl_StaffRemarks && (
                                                        <FormError className='text-xs'>
                                                            {errors.students[index]?.icwupl_StaffRemarks?.message}
                                                        </FormError>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="file"
                                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                        disabled={!isChecked}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                // Mock saving file URL for view
                                                                const url = URL.createObjectURL(file);
                                                                setValue(`students.${index}.icwupl_StaffUpload`, url);
                                                                setValue(`students.${index}.icwupl_FileName`, file.name);
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title="View Upload"
                                                        disabled={!isChecked || !watch(`students.${index}.icwupl_StaffUpload`)}
                                                        onClick={() => {
                                                            const url = watch(`students.${index}.icwupl_StaffUpload`);
                                                            if (url) window.open(url, '_blank');
                                                            else toast.error("No staff upload to view");
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Buttons */}
                    <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={handleReset}
                            disabled={isSubmitting}
                            className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                            <RefreshCw className='mr-2 h-4 w-4' />
                            Reset
                        </Button>

                        <Button
                            type='submit'
                            disabled={isSubmitting}
                            className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                            isLoading={isSubmitting}
                            loadingText='Saving...'>
                            <div className='flex items-center'>
                                <Save className='mr-2 h-4 w-4' />
                                Save Marks
                            </div>
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
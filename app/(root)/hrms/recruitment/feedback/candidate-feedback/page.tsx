// Refactored by automation script on 2025-10-28T15:40:35.920Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/candidate-feedback-form.tsx
// 3. Extract column definitions and form to the respective files
// 4. Update handlers to use the new structure
'use client';
import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BaseEntity, createLocalCrud } from '@/lib/localdb';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
interface CandidateFeedback extends BaseEntity {
    candidateName: string;
    interviewType: string;
    interviewDate: string;
    status: 'Selected' | 'Rejected' | 'On Hold' | 'In Progress';
    comments?: string;
}
type FeedbackForm = {
    candidateName: string;
    interviewType: string;
    interviewDate: string;
    status: CandidateFeedback['status'];
    comments?: string;
};
export default function CandidateFeedbackPage() {
    const [rows, setRows] = useState<CandidateFeedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editing, setEditing] = useState<CandidateFeedback | null>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const store = createLocalCrud<CandidateFeedback>('recruitment:candidate-feedback');
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FeedbackForm>({ mode: 'onChange' });
    useEffect(() => {
        setRows(store.list());
        setIsLoading(false);
    }, []);
    const handleAdd = () => {
        setIsFormOpen(true);
        setEditing(null);
        reset();
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };
    const onSubmit: SubmitHandler<FeedbackForm> = async (data) => {
        try {
            if (editing) {
                store.update(editing.id, data);
                toast.success('Feedback updated');
            } else {
                store.create({ ...data });
                toast.success('Feedback saved');
            }
            setIsFormOpen(false);
            setEditing(null);
            setRows(store.list());
        } catch (e: any) {
            toast.error(e.message || 'Operation failed');
        }
    };
    const handleEdit = (row: CandidateFeedback) => {
        setEditing(row);
        reset({ ...row });
        setIsFormOpen(true);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };
    const handleDelete = (row: CandidateFeedback) => {
        store.remove(row.id);
        toast.success('Deleted');
        setRows(store.list());
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading title='Candidate Interview Feedback' description='Track feedback and interview status' />
                    </div>
                    <Button
                        type='button'
                        onClick={handleAdd}
                        size='lg'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Feedback
                    </Button>
                </div>
                <CollapsibleSection
                    title='Candidate Feedback List'
                    description='Browse feedback records'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <FeedbackTable data={rows} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
                </CollapsibleSection>
                {isFormOpen && (
                    <div ref={formRef}>
                        <CollapsibleSection
                            title={editing ? 'Edit Feedback' : 'Add Feedback'}
                            description='Fill feedback details'
                            defaultOpen={true}
                            variant='default'
                            size='lg'
                            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                            <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <span className='font-medium text-sm'>
                                        Candidate Name <span className='text-red-500'>*</span>
                                    </span>
                                    <InputText
                                        placeholder='Enter candidate name'
                                        {...register('candidateName', { required: 'Required' })}
                                        error={errors.candidateName?.message}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <span className='font-medium text-sm'>
                                        Interview Type <span className='text-red-500'>*</span>
                                    </span>
                                    <Select onValueChange={(v) => setValue('interviewType', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='Phone'>Phone</SelectItem>
                                            <SelectItem value='Virtual'>Virtual</SelectItem>
                                            <SelectItem value='In-Person'>In-Person</SelectItem>
                                            <SelectItem value='Technical'>Technical</SelectItem>
                                            <SelectItem value='HR'>HR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='space-y-2'>
                                    <span className='font-medium text-sm'>
                                        Interview Date <span className='text-red-500'>*</span>
                                    </span>
                                    <InputText
                                        type='date'
                                        {...register('interviewDate', { required: 'Required' })}
                                        error={errors.interviewDate?.message}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <span className='font-medium text-sm'>
                                        Interview Status <span className='text-red-500'>*</span>
                                    </span>
                                    <Select onValueChange={(v) => setValue('status', v as any)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='Selected'>Selected</SelectItem>
                                            <SelectItem value='Rejected'>Rejected</SelectItem>
                                            <SelectItem value='On Hold'>On Hold</SelectItem>
                                            <SelectItem value='In Progress'>In Progress</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='space-y-2 md:col-span-2'>
                                    <span className='font-medium text-sm'>Comments</span>
                                    <InputText placeholder='Add any notes' {...register('comments')} />
                                </div>
                                <div className='flex justify-center gap-4 border-t pt-6 md:col-span-2'>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        onClick={() => {
                                            setIsFormOpen(false);
                                            setEditing(null);
                                        }}>
                                        <X className='mr-2 h-4 w-4' />
                                        Cancel
                                    </Button>
                                    <Button type='submit' disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <div className='flex items-center'>
                                                <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                                                Saving...
                                            </div>
                                        ) : (
                                            <div className='flex items-center'>
                                                <Save className='mr-2 h-4 w-4' />
                                                Save
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CollapsibleSection>
                    </div>
                )}
            </div>
        </div>
    );
}
interface TableProps {
    data: CandidateFeedback[];
    isLoading: boolean;
    onEdit: (row: CandidateFeedback) => void;
    onDelete: (row: CandidateFeedback) => void;
}
function FeedbackTable({ data, isLoading, onEdit, onDelete }: TableProps) {
    const columns: ColumnDef<CandidateFeedback>[] = [
        {
            id: 'sl',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl No' />,
            cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
            enableSorting: false
        },
        { accessorKey: 'candidateName', header: ({ column }) => <DataTableColumnHeader column={column} title='Candidate Name' /> },
        { accessorKey: 'interviewType', header: ({ column }) => <DataTableColumnHeader column={column} title='Interview Type' /> },
        { accessorKey: 'interviewDate', header: ({ column }) => <DataTableColumnHeader column={column} title='Interview Date' /> },
        { accessorKey: 'status', header: ({ column }) => <DataTableColumnHeader column={column} title='Interview Status' /> },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const r = row.original;
                return (
                    <div className='flex items-center gap-2'>
                        <Button variant='outline' size='sm' onClick={() => onEdit(r)}>
                            <Edit className='h-4 w-4' />
                        </Button>
                        <Button variant='outline' size='sm' className='text-red-600' onClick={() => onDelete(r)}>
                            <Trash2 className='h-4 w-4' />
                        </Button>
                    </div>
                );
            }
        }
    ];
    return <GenericDataTable isLoading={isLoading} columns={columns} data={data} totalItems={data.length} showViewOptions />;
}

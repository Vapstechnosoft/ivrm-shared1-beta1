// Refactored by automation script on 2025-10-28T15:40:35.878Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/job-form.tsx
// 3. Extract column definitions and form to the respective files
// 4. Update handlers to use the new structure
'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BaseEntity, createLocalCrud } from '@/lib/localdb';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
interface MasterJob extends BaseEntity {
    jobCode: string;
    jobTitle: string;
    jobLocation: string;
    isActive: boolean;
}
type MasterJobForm = {
    jobCode: string;
    jobTitle: string;
    jobLocation: string;
    isActive: boolean;
};
const jobLocations = ['Bangalore', 'coimbatore', 'Chennai', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Kolkata'];
export default function MasterJobPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [jobs, setJobs] = useState<MasterJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const formRef = useRef<HTMLDivElement>(null);
    const jobDB = createLocalCrud<MasterJob>('master:job');
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<MasterJobForm>({
        mode: 'onChange',
        defaultValues: {
            isActive: true
        }
    });
    const jobLocation = watch('jobLocation');
    // Load data on component mount
    useEffect(() => {
        loadJobs();
    }, []);
    const loadJobs = () => {
        try {
            setJobs(jobDB.list());
        } catch (_error) {
            toast.error('Failed to load jobs');
        } finally {
            setIsLoading(false);
        }
    };
    const handleAddClick = () => {
        setIsFormOpen(true);
        setEditingId(null);
        reset({ isActive: true });
        // Scroll to form after state update
        setTimeout(() => {
            formRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }, 100);
    };
    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingId(null);
        reset({ isActive: true });
    };
    const onSubmit: SubmitHandler<MasterJobForm> = async (data: MasterJobForm) => {
        try {
            if (editingId) {
                jobDB.update(editingId, data);
                toast.success('Job updated successfully');
            } else {
                jobDB.create(data as Omit<MasterJob, 'id' | 'createdAt'>);
                toast.success('Job created successfully');
            }
            loadJobs();
            handleFormClose();
        } catch (error: any) {
            toast.error(error.message || 'Operation failed');
        }
    };
    const handleEdit = (job: MasterJob) => {
        setEditingId(job.id);
        setValue('jobCode', job.jobCode);
        setValue('jobTitle', job.jobTitle);
        setValue('jobLocation', job.jobLocation);
        setValue('isActive', job.isActive);
        setIsFormOpen(true);
        // Scroll to form after state update
        setTimeout(() => {
            formRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }, 100);
    };
    const handleDelete = (id: number) => {
        try {
            jobDB.remove(id);
            toast.success('Job deleted successfully');
            loadJobs();
        } catch (_error: any) {
            toast.error('Failed to delete job');
        }
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <Button
                        type='button'
                        onClick={handleAddClick}
                        size='lg'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Master Job
                    </Button>
                </div>
                {/* Data Table Section - Collapsible but default open */}
                <CollapsibleSection
                    // title='Master Jobs Data'
                    // description='View, search, and manage all job positions in the system'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <JobTable jobs={jobs} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
                </CollapsibleSection>
                {/* Add Form Section - Conditionally Rendered */}
                {isFormOpen && (
                    <div ref={formRef} className='slide-in-from-top-4 animate-in duration-300'>
                        <CollapsibleSection
                            title={editingId ? 'Update Master Job' : 'Add New Master Job'}
                            description='Fill in the details below to create a new job position'
                            defaultOpen={true}
                            variant='outline'
                            size='md'
                            className='shadow-lg'
                            headerClassName=''>
                            <div className='relative'>
                                <Button
                                    onClick={handleFormClose}
                                    variant='ghost'
                                    size='sm'
                                    className='-top-[4rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                    <X className='h-4 w-4 text-destructive' /> Close
                                </Button>
                                <form onSubmit={handleSubmit(onSubmit)} className='max-w-full space-y-6'>
                                    {/* Primary Information Section */}
                                    <div className='space-y-4'>
                                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                                            <InputText
                                                label='Job Code'
                                                required
                                                id='jobCode'
                                                {...register('jobCode', { required: 'Job Code is required' })}
                                                error={errors.jobCode?.message}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                            <InputText
                                                label='Job Title'
                                                required
                                                id='jobTitle'
                                                {...register('jobTitle', { required: 'Job Title is required' })}
                                                error={errors.jobTitle?.message}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                        </div>
                                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                                            <div className='space-y-2'>
                                                <span className='font-medium text-sm'>
                                                    Job Location <span className='text-red-500'>*</span>
                                                </span>
                                                <Select value={jobLocation || ''} onValueChange={(value) => setValue('jobLocation', value)}>
                                                    <SelectTrigger className={errors.jobLocation ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder='--Select--' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {jobLocations.map((location) => (
                                                            <SelectItem key={location} value={location}>
                                                                {location}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {!jobLocation && (
                                                    <input
                                                        type='hidden'
                                                        {...register('jobLocation', {
                                                            required: 'Job Location is required'
                                                        })}
                                                    />
                                                )}
                                                {errors.jobLocation && <FormError>{errors.jobLocation.message}</FormError>}
                                            </div>
                                        </div>
                                        {/* Root Error */}
                                        {errors.root && <FormError>{errors.root.message}</FormError>}
                                    </div>
                                    {/* Action Buttons */}
                                    <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            onClick={handleFormClose}
                                            disabled={isSubmitting}
                                            className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                                            Cancel
                                        </Button>
                                        <Button
                                            type='submit'
                                            disabled={isSubmitting}
                                            className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'>
                                            {isSubmitting ? (
                                                <div className='flex items-center'>
                                                    <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                                                    Saving...
                                                </div>
                                            ) : (
                                                <div className='flex items-center'>
                                                    <Save className='mr-2 h-4 w-4' />
                                                    {editingId ? 'Update Master Job' : 'Save Master Job'}
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </CollapsibleSection>
                    </div>
                )}
            </div>
        </div>
    );
}
interface JobTableProps {
    jobs: MasterJob[];
    isLoading: boolean;
    onEdit: (job: MasterJob) => void;
    onDelete: (id: number) => void;
}
function JobTable({ jobs, isLoading, onEdit, onDelete }: JobTableProps) {
    const jobColumns: ColumnDef<MasterJob>[] = [
        {
            accessorKey: 'jobCode',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Job Code' />,
            cell: ({ row }) => <div className='font-medium'>{row.getValue('jobCode')}</div>
        },
        {
            accessorKey: 'jobTitle',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Job Title' />,
            cell: ({ row }) => <div>{row.getValue('jobTitle')}</div>
        },
        {
            accessorKey: 'jobLocation',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Job Location' />,
            cell: ({ row }) => <div>{row.getValue('jobLocation')}</div>
        },
        {
            accessorKey: 'isActive',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
            cell: ({ row }) => {
                const isActive = row.getValue('isActive') as boolean;
                return <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? 'Active' : 'Inactive'}</Badge>;
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const job = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                                <MoreHorizontal className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Button variant='ghost' size='sm' onClick={() => onEdit(job)} className='w-full justify-start'>
                                <Edit className='mr-2 h-4 w-4' />
                                Edit
                            </Button>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => onDelete(job.id)}
                                className='w-full justify-start text-red-600 hover:text-red-900'>
                                <Trash2 className='mr-2 h-4 w-4' />
                                Delete
                            </Button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];
    return <GenericDataTable isLoading={isLoading} columns={jobColumns} data={jobs} totalItems={jobs.length} showViewOptions={true} />;
}

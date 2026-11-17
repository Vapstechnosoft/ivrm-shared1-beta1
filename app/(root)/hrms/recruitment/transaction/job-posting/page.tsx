// Refactored by automation script on 2025-10-28T15:40:35.953Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/job-posting-form.tsx
// 3. Extract column definitions and form to the respective files
// 4. Update handlers to use the new structure
'use client';
import { Heading } from '@/components/layout/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BaseEntity, createLocalCrud } from '@/lib/localdb';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Plus, RefreshCw, Save, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
interface JobPosting extends BaseEntity {
    position: string;
    location: string;
    locationType: 'HO' | 'Client' | 'Location';
    department: string;
    priority: string;
    qualification: string;
    positionType: string;
    mrfNo: string;
    skill: string;
    experienceFrom: number;
    experienceTo: number;
    gender: string;
    noOfPositions: number;
    jobDescription: string;
    age: string;
    reason: string;
    jobAttachment?: string;
    tests: {
        written: boolean;
        online: boolean;
        technical: boolean;
    };
    status: 'Draft' | 'Published' | 'Closed';
}
type JobPostingForm = {
    position: string;
    location: string;
    locationType: 'HO' | 'Client' | 'Location';
    department: string;
    priority: string;
    qualification: string;
    positionType: string;
    mrfNo: string;
    skill: string;
    experienceFrom: string;
    experienceTo: string;
    gender: string;
    noOfPositions: string;
    jobDescription: string;
    age: string;
    reason: string;
};
export default function JobPostingPage() {
    const [postings, setPostings] = useState<JobPosting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPosting, setEditingPosting] = useState<JobPosting | null>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const postingDB = createLocalCrud<JobPosting>('recruitment:job-posting');
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
        watch
    } = useForm<JobPostingForm>({ mode: 'onChange' });
    const [tests, setTests] = useState({ written: false, online: false, technical: false });
    useEffect(() => {
        loadData();
    }, []);
    const loadData = () => {
        try {
            setPostings(postingDB.list());
        } catch {
            toast.error('Failed to load job postings');
        } finally {
            setIsLoading(false);
        }
    };
    const handleAddClick = () => {
        setIsFormOpen(true);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };
    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingPosting(null);
        reset();
        setTests({ written: false, online: false, technical: false });
    };
    const onSubmit: SubmitHandler<JobPostingForm> = async (data) => {
        try {
            const posting: Omit<JobPosting, 'id' | 'createdAt'> = {
                position: data.position,
                location: data.location,
                locationType: data.locationType,
                department: data.department,
                priority: data.priority,
                qualification: data.qualification,
                positionType: data.positionType,
                mrfNo: data.mrfNo,
                skill: data.skill,
                experienceFrom: Number(data.experienceFrom || 0),
                experienceTo: Number(data.experienceTo || 0),
                gender: data.gender,
                noOfPositions: Number(data.noOfPositions || 0),
                jobDescription: data.jobDescription,
                age: data.age,
                reason: data.reason,
                tests,
                status: 'Draft'
            };
            if (editingPosting) {
                postingDB.update(editingPosting.id, posting);
                toast.success('Job posting updated');
            } else {
                postingDB.create(posting);
                toast.success('Job posting created');
            }
            handleFormClose();
            loadData();
        } catch (e: any) {
            toast.error(e.message || 'Operation failed');
        }
    };
    const handleEdit = (p: JobPosting) => {
        setEditingPosting(p);
        reset({
            position: p.position,
            location: p.location,
            locationType: p.locationType,
            department: p.department,
            priority: p.priority,
            qualification: p.qualification,
            positionType: p.positionType,
            mrfNo: p.mrfNo,
            skill: p.skill,
            experienceFrom: String(p.experienceFrom),
            experienceTo: String(p.experienceTo),
            gender: p.gender,
            noOfPositions: String(p.noOfPositions),
            jobDescription: p.jobDescription,
            age: p.age,
            reason: p.reason
        });
        setTests(p.tests || { written: false, online: false, technical: false });
        setIsFormOpen(true);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };
    const handleDelete = (p: JobPosting) => {
        postingDB.remove(p.id);
        toast.success('Job posting deleted');
        loadData();
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading title='Job Posting' description='Create and manage job postings' />
                    </div>
                    <Button
                        type='button'
                        onClick={handleAddClick}
                        size='lg'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        New Job Posting
                    </Button>
                </div>
                {/* Table */}
                <CollapsibleSection
                    title='New Job Posting List'
                    description='View, search and manage job postings'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <JobPostingTable postings={postings} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
                </CollapsibleSection>
                {/* Form */}
                {isFormOpen && (
                    <div ref={formRef}>
                        <CollapsibleSection
                            title={editingPosting ? 'Edit Job Posting' : 'New Job Posting'}
                            description='Fill the job posting information'
                            defaultOpen={true}
                            variant='default'
                            size='lg'
                            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                    <div className='space-y-4'>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>
                                                Position <span className='text-red-500'>*</span>
                                            </span>
                                            <Select onValueChange={(v) => setValue('position', v)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='--Select--' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='Software Engineer'>Software Engineer</SelectItem>
                                                    <SelectItem value='Senior Developer'>Senior Developer</SelectItem>
                                                    <SelectItem value='Project Manager'>Project Manager</SelectItem>
                                                    <SelectItem value='HR Executive'>HR Executive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.position && <FormError>Position is required</FormError>}
                                        </div>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>
                                                Priority <span className='text-red-500'>*</span>
                                            </span>
                                            <Select onValueChange={(v) => setValue('priority', v)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='--Select--' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='High'>High</SelectItem>
                                                    <SelectItem value='Medium'>Medium</SelectItem>
                                                    <SelectItem value='Low'>Low</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>
                                                Qualification <span className='text-red-500'>*</span>
                                            </span>
                                            <Select onValueChange={(v) => setValue('qualification', v)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='--Select--' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='B.Tech'>B.Tech</SelectItem>
                                                    <SelectItem value='M.Tech'>M.Tech</SelectItem>
                                                    <SelectItem value='BCA'>BCA</SelectItem>
                                                    <SelectItem value='MCA'>MCA</SelectItem>
                                                    <SelectItem value='MBA'>MBA</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>
                                                No. of Position <span className='text-red-500'>*</span>
                                            </span>
                                            <InputText
                                                placeholder='e.g. 3'
                                                {...register('noOfPositions', { required: 'Required' })}
                                                error={errors.noOfPositions?.message}
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>
                                                Job Description <span className='text-red-500'>*</span>
                                            </span>
                                            <InputText
                                                placeholder='Short description'
                                                {...register('jobDescription', { required: 'Required' })}
                                                error={errors.jobDescription?.message}
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>
                                                Age <span className='text-red-500'>*</span>
                                            </span>
                                            <InputText
                                                placeholder='e.g. 22-30'
                                                {...register('age', { required: 'Required' })}
                                                error={errors.age?.message}
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>
                                                Reason <span className='text-red-500'>*</span>
                                            </span>
                                            <InputText
                                                placeholder='Reason'
                                                {...register('reason', { required: 'Required' })}
                                                error={errors.reason?.message}
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>Job Attachment</span>
                                            <Button type='button' variant='outline' size='sm'>
                                                <Upload className='mr-2 h-4 w-4' />
                                                Upload Document
                                            </Button>
                                        </div>
                                    </div>
                                    <div className='space-y-4'>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>
                                                Location <span className='text-red-500'>*</span>
                                            </span>
                                            <InputText
                                                placeholder='City / Site'
                                                {...register('location', { required: 'Required' })}
                                                error={errors.location?.message}
                                            />
                                            <div className='flex items-center gap-6 pt-1'>
                                                <div className='flex items-center gap-2 text-sm'>
                                                    <Checkbox
                                                        id='locTypeHO'
                                                        checked={watch('locationType') === 'HO'}
                                                        onCheckedChange={(_v) => setValue('locationType', 'HO')}
                                                    />
                                                    <label htmlFor='locTypeHO' className='cursor-pointer'>
                                                        HO
                                                    </label>
                                                </div>
                                                <div className='flex items-center gap-2 text-sm'>
                                                    <Checkbox
                                                        id='locTypeClient'
                                                        checked={watch('locationType') === 'Client'}
                                                        onCheckedChange={(_v) => setValue('locationType', 'Client')}
                                                    />
                                                    <label htmlFor='locTypeClient' className='cursor-pointer'>
                                                        Client
                                                    </label>
                                                </div>
                                                <div className='flex items-center gap-2 text-sm'>
                                                    <Checkbox
                                                        id='locTypeLocation'
                                                        checked={watch('locationType') === 'Location'}
                                                        onCheckedChange={(_v) => setValue('locationType', 'Location')}
                                                    />
                                                    <label htmlFor='locTypeLocation' className='cursor-pointer'>
                                                        Location
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>
                                                Department <span className='text-red-500'>*</span>
                                            </span>
                                            <Select onValueChange={(v) => setValue('department', v)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='--Select--' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='IT'>IT</SelectItem>
                                                    <SelectItem value='HR'>HR</SelectItem>
                                                    <SelectItem value='Finance'>Finance</SelectItem>
                                                    <SelectItem value='Operations'>Operations</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>
                                                Position Type <span className='text-red-500'>*</span>
                                            </span>
                                            <Select onValueChange={(v) => setValue('positionType', v)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='--Select--' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='Permanent'>Permanent</SelectItem>
                                                    <SelectItem value='Contract'>Contract</SelectItem>
                                                    <SelectItem value='Intern'>Intern</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>
                                                MRF No. <span className='text-red-500'>*</span>
                                            </span>
                                            <InputText
                                                placeholder='Enter MRF number'
                                                {...register('mrfNo', { required: 'Required' })}
                                                error={errors.mrfNo?.message}
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>
                                                Skill <span className='text-red-500'>*</span>
                                            </span>
                                            <InputText
                                                placeholder='Primary skills'
                                                {...register('skill', { required: 'Required' })}
                                                error={errors.skill?.message}
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>
                                                Experience (Year) <span className='text-red-500'>*</span>
                                            </span>
                                            <div className='grid grid-cols-3 items-center gap-2'>
                                                <InputText
                                                    placeholder='From'
                                                    {...register('experienceFrom', { required: 'Required' })}
                                                    error={errors.experienceFrom?.message}
                                                />
                                                <span className='text-center'>to</span>
                                                <InputText
                                                    placeholder='To'
                                                    {...register('experienceTo', { required: 'Required' })}
                                                    error={errors.experienceTo?.message}
                                                />
                                            </div>
                                        </div>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>
                                                Gender <span className='text-red-500'>*</span>
                                            </span>
                                            <Select onValueChange={(v) => setValue('gender', v)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='--Select--' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='Male'>Male</SelectItem>
                                                    <SelectItem value='Female'>Female</SelectItem>
                                                    <SelectItem value='Any'>Any</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className='space-y-2'>
                                            <span className='font-medium text-sm'>Remark</span>
                                            <InputText placeholder='Remark' {...register('reason')} />
                                        </div>
                                        <div className='flex gap-6 pt-2'>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <Checkbox
                                                    id='testWritten'
                                                    checked={tests.written}
                                                    onCheckedChange={(v) => setTests((s) => ({ ...s, written: Boolean(v) }))}
                                                />
                                                <label htmlFor='testWritten' className='cursor-pointer'>
                                                    Written Test
                                                </label>
                                            </div>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <Checkbox
                                                    id='testOnline'
                                                    checked={tests.online}
                                                    onCheckedChange={(v) => setTests((s) => ({ ...s, online: Boolean(v) }))}
                                                />
                                                <label htmlFor='testOnline' className='cursor-pointer'>
                                                    Online Test
                                                </label>
                                            </div>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <Checkbox
                                                    id='testTechnical'
                                                    checked={tests.technical}
                                                    onCheckedChange={(v) => setTests((s) => ({ ...s, technical: Boolean(v) }))}
                                                />
                                                <label htmlFor='testTechnical' className='cursor-pointer'>
                                                    Technical Interview
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-center gap-4 border-t pt-6'>
                                    <Button type='button' variant='outline' onClick={handleFormClose}>
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
                                                Save & Publish
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
interface JobPostingTableProps {
    postings: JobPosting[];
    isLoading: boolean;
    onEdit: (p: JobPosting) => void;
    onDelete: (p: JobPosting) => void;
}
function JobPostingTable({ postings, isLoading, onEdit, onDelete }: JobPostingTableProps) {
    const columns: ColumnDef<JobPosting>[] = [
        {
            id: 'sl',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
            cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
            enableSorting: false
        },
        { accessorKey: 'position', header: ({ column }) => <DataTableColumnHeader column={column} title='Position' /> },
        { accessorKey: 'location', header: ({ column }) => <DataTableColumnHeader column={column} title='Location' /> },
        { accessorKey: 'department', header: ({ column }) => <DataTableColumnHeader column={column} title='Department' /> },
        { accessorKey: 'priority', header: ({ column }) => <DataTableColumnHeader column={column} title='Priority' /> },
        { accessorKey: 'noOfPositions', header: ({ column }) => <DataTableColumnHeader column={column} title='No. of Positions' /> },
        {
            accessorKey: 'status',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                const map: Record<string, string> = {
                    Draft: 'bg-yellow-100 text-yellow-800',
                    Published: 'bg-green-100 text-green-800',
                    Closed: 'bg-red-100 text-red-800'
                };
                return <Badge className={map[status] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const p = row.original;
                return (
                    <div className='flex items-center gap-2'>
                        <Button variant='outline' size='sm' onClick={() => onEdit(p)}>
                            <Edit className='h-4 w-4' />
                        </Button>
                        <Button variant='outline' size='sm' className='text-red-600' onClick={() => onDelete(p)}>
                            <Trash2 className='h-4 w-4' />
                        </Button>
                    </div>
                );
            }
        }
    ];
    return <GenericDataTable isLoading={isLoading} columns={columns} data={postings} totalItems={postings.length} showViewOptions />;
}

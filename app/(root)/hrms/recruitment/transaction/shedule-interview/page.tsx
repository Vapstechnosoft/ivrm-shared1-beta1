// Refactored by automation script on 2025-10-28T15:40:36.042Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/schedule-interview-form.tsx
// 3. Extract column definitions and form to the respective files
// 4. Update handlers to use the new structure
'use client';
import { Heading } from '@/components/layout/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { DatePickerWithYear } from '@/components/ui/date-picker-year';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type BaseEntity, createLocalCrud } from '@/lib/localdb';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Edit, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
interface Interview extends BaseEntity {
    candidateName: string;
    candidateId: number;
    interviewDate: string;
    interviewTime: string;
    interviewRounds: string;
    interviewerName: string;
    interviewerId: number;
    interviewVenue: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
    notifyByEmail: boolean;
    notifyBySMS: boolean;
    remarks?: string;
    createdDate: string;
    updatedDate?: string;
}
interface Candidate extends BaseEntity {
    firstName: string;
    middleName?: string;
    lastName: string;
    emailId: string;
    mobileNo: string;
    jobTitle: string;
    status: string;
}
interface Interviewer extends BaseEntity {
    name: string;
    email: string;
    department: string;
    designation: string;
}
type InterviewForm = {
    candidateId: string;
    interviewDate: Date | undefined;
    interviewTime: string;
    interviewRounds: string;
    interviewerId: string;
    interviewVenue: string;
    status: string;
    notifyByEmail: boolean;
    notifyBySMS: boolean;
    remarks?: string;
};
export default function ScheduleInterviewPage() {
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const interviewDB = createLocalCrud<Interview>('recruitment:interview');
    const candidateDB = createLocalCrud<Candidate>('recruitment:candidate');
    const interviewerDB = createLocalCrud<Interviewer>('recruitment:interviewer');
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors, isSubmitting }
    } = useForm<InterviewForm>({
        mode: 'onChange',
        defaultValues: {
            interviewDate: undefined,
            interviewTime: '10:00',
            status: 'Scheduled',
            notifyByEmail: true,
            notifyBySMS: false
        }
    });
    // Load data on component mount
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            setInterviews(interviewDB.list());
            setCandidates(candidateDB.list());
            // Create sample interviewers if none exist
            const existingInterviewers = interviewerDB.list();
            if (existingInterviewers.length === 0) {
                const sampleInterviewers: Omit<Interviewer, 'id' | 'createdAt'>[] = [
                    { name: 'John Smith', email: 'john.smith@company.com', department: 'HR', designation: 'HR Manager' },
                    { name: 'Sarah Johnson', email: 'sarah.j@company.com', department: 'IT', designation: 'Technical Lead' },
                    { name: 'Mike Wilson', email: 'mike.w@company.com', department: 'Engineering', designation: 'Senior Developer' },
                    { name: 'Lisa Brown', email: 'lisa.b@company.com', department: 'Operations', designation: 'Operations Manager' }
                ];
                sampleInterviewers.forEach((interviewer) => {
                    interviewerDB.create(interviewer);
                });
            }
            setInterviewers(interviewerDB.list());
        } catch (_error) {
            toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };
    const handleAddClick = () => {
        setIsFormOpen(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };
    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingInterview(null);
        reset({
            interviewDate: undefined,
            interviewTime: '10:00',
            status: 'Scheduled',
            notifyByEmail: true,
            notifyBySMS: false
        });
    };
    const onSubmit: SubmitHandler<InterviewForm> = async (data: InterviewForm) => {
        try {
            if (!data.interviewDate) {
                toast.error('Please select an interview date');
                return;
            }
            const candidate = candidates.find((c) => c.id.toString() === data.candidateId);
            const interviewer = interviewers.find((i) => i.id.toString() === data.interviewerId);
            if (!candidate || !interviewer) {
                toast.error('Please select valid candidate and interviewer');
                return;
            }
            const interviewData: Omit<Interview, 'id' | 'createdAt'> = {
                candidateName: `${candidate.firstName} ${candidate.middleName || ''} ${candidate.lastName}`.trim(),
                candidateId: candidate.id,
                interviewDate: format(data.interviewDate, 'yyyy-MM-dd'),
                interviewTime: data.interviewTime,
                interviewRounds: data.interviewRounds,
                interviewerName: interviewer.name,
                interviewerId: interviewer.id,
                interviewVenue: data.interviewVenue,
                status: data.status as Interview['status'],
                notifyByEmail: data.notifyByEmail,
                notifyBySMS: data.notifyBySMS,
                remarks: data.remarks,
                createdDate: new Date().toISOString(),
                updatedDate: editingInterview ? new Date().toISOString() : undefined
            };
            if (editingInterview) {
                interviewDB.update(editingInterview.id, interviewData);
                toast.success('Interview updated successfully');
            } else {
                interviewDB.create(interviewData);
                toast.success('Interview scheduled successfully');
            }
            handleFormClose();
            loadData();
        } catch (error: any) {
            toast.error(error.message || 'Operation failed');
        }
    };
    const handleClear = () => {
        handleFormClose();
        toast.info('Form cleared');
    };
    const handleEdit = (interview: Interview) => {
        setEditingInterview(interview);
        reset({
            candidateId: interview.candidateId.toString(),
            interviewDate: new Date(interview.interviewDate),
            interviewTime: interview.interviewTime,
            interviewRounds: interview.interviewRounds,
            interviewerId: interview.interviewerId.toString(),
            interviewVenue: interview.interviewVenue,
            status: interview.status,
            notifyByEmail: interview.notifyByEmail,
            notifyBySMS: interview.notifyBySMS,
            remarks: interview.remarks
        });
        setIsFormOpen(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };
    const handleDelete = async (interview: Interview) => {
        try {
            interviewDB.remove(interview.id);
            toast.success('Interview deleted successfully');
            loadData();
        } catch (_error) {
            toast.error('Failed to delete interview');
        }
    };
    const getCandidateName = (candidateId: number) => {
        const candidate = candidates.find((c) => c.id === candidateId);
        return candidate ? `${candidate.firstName} ${candidate.middleName || ''} ${candidate.lastName}`.trim() : 'Unknown';
    };
    const getInterviewerName = (interviewerId: number) => {
        const interviewer = interviewers.find((i) => i.id === interviewerId);
        return interviewer?.name || 'Unknown';
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading title='Interview Schedule Management' description='Schedule and manage candidate interviews efficiently' />
                    </div>
                    <Button
                        type='button'
                        onClick={handleAddClick}
                        size='lg'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Schedule Interview
                    </Button>
                </div>
                {/* Data Table Section - Collapsible but default open */}
                <CollapsibleSection
                    title='Scheduled Interviews'
                    description='View, search, and manage all scheduled interviews'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <InterviewTable
                        interviews={interviews}
                        isLoading={isLoading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        getCandidateName={getCandidateName}
                        getInterviewerName={getInterviewerName}
                    />
                </CollapsibleSection>
                {/* Add Form Section - Conditionally Rendered */}
                {isFormOpen && (
                    <div ref={formRef}>
                        <CollapsibleSection
                            title={editingInterview ? 'Edit Interview Schedule' : 'Schedule New Interview'}
                            description={
                                editingInterview
                                    ? 'Update interview details and scheduling information'
                                    : 'Fill in interview scheduling information'
                            }
                            defaultOpen={true}
                            variant='default'
                            size='lg'
                            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                    {/* Candidate Selection */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Candidate Name <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(value) => setValue('candidateId', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select OR Search Candidate in the list...' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {candidates.map((candidate) => (
                                                    <SelectItem key={candidate.id} value={candidate.id.toString()}>
                                                        {`${candidate.firstName} ${candidate.middleName || ''} ${candidate.lastName}`.trim()}{' '}
                                                        - {candidate.jobTitle}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.candidateId && <FormError>Candidate is required</FormError>}
                                    </div>
                                    {/* Interview Date */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Interview Date <span className='text-red-500'>*</span>
                                        </span>
                                        <Controller
                                            control={control}
                                            name='interviewDate'
                                            rules={{ required: 'Interview date is required' }}
                                            render={({ field }) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant='outline'
                                                            className={cn(
                                                                'w-full justify-start text-left font-normal',
                                                                !field.value && 'text-muted-foreground'
                                                            )}>
                                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                                            {field.value ? format(field.value, 'PPP') : 'Interview Date'}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className='w-auto p-0' align='start'>
                                                        <DatePickerWithYear
                                                            mode='single'
                                                            selected={field.value}
                                                            onDayClick={(day) => field.onChange(day)}
                                                            disabled={(date) => date < new Date()}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                        {errors.interviewDate && <FormError>{errors.interviewDate.message}</FormError>}
                                    </div>
                                    {/* Interview Time */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Interview Time <span className='text-red-500'>*</span>
                                        </span>
                                        <InputText
                                            type='time'
                                            {...register('interviewTime', { required: 'Interview time is required' })}
                                            error={errors.interviewTime?.message}
                                        />
                                    </div>
                                    {/* Interview Rounds */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Interview Rounds <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(value) => setValue('interviewRounds', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Technical Round'>Technical Round</SelectItem>
                                                <SelectItem value='HR Round'>HR Round</SelectItem>
                                                <SelectItem value='Management Round'>Management Round</SelectItem>
                                                <SelectItem value='Technical + HR'>Technical + HR</SelectItem>
                                                <SelectItem value='All Rounds'>All Rounds</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.interviewRounds && <FormError>Interview rounds selection is required</FormError>}
                                    </div>
                                    {/* Interviewer Name */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Interviewer Name <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(value) => setValue('interviewerId', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select OR Search Interviewer in the list...' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {interviewers.map((interviewer) => (
                                                    <SelectItem key={interviewer.id} value={interviewer.id.toString()}>
                                                        {interviewer.name} - {interviewer.designation}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.interviewerId && <FormError>Interviewer is required</FormError>}
                                    </div>
                                    {/* Interview Venue */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Interview Venue <span className='text-red-500'>*</span>
                                        </span>
                                        <InputText
                                            placeholder='Enter interview venue'
                                            {...register('interviewVenue', { required: 'Interview venue is required' })}
                                            error={errors.interviewVenue?.message}
                                        />
                                    </div>
                                    {/* Status */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Status <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(value) => setValue('status', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Scheduled'>Scheduled</SelectItem>
                                                <SelectItem value='Completed'>Completed</SelectItem>
                                                <SelectItem value='Cancelled'>Cancelled</SelectItem>
                                                <SelectItem value='Rescheduled'>Rescheduled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <FormError>Status is required</FormError>}
                                    </div>
                                </div>
                                {/* Notify Candidate By */}
                                <div className='space-y-4'>
                                    <span className='font-medium text-gray-700 text-sm'>Notify Candidate By</span>
                                    <div className='flex items-center space-x-6'>
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox id='notifyByEmail' {...register('notifyByEmail')} />
                                            <label htmlFor='notifyByEmail' className='text-sm'>
                                                E-Mail
                                            </label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox id='notifyBySMS' {...register('notifyBySMS')} />
                                            <label htmlFor='notifyBySMS' className='text-sm'>
                                                SMS
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/* Remarks */}
                                <div className='space-y-2'>
                                    <span className='font-medium text-gray-700 text-sm'>Remarks</span>
                                    <Textarea
                                        placeholder='Additional notes or remarks about the interview'
                                        rows={3}
                                        {...register('remarks')}
                                    />
                                </div>
                                {/* Form Actions */}
                                <div className='flex justify-center gap-4 border-t pt-6'>
                                    <Button type='button' variant='outline' onClick={handleClear}>
                                        <X className='mr-2 h-4 w-4' />
                                        Close
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
                                                {editingInterview ? 'Update & Schedule' : 'Save & Schedule'}
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
interface InterviewTableProps {
    interviews: Interview[];
    isLoading: boolean;
    onEdit: (interview: Interview) => void;
    onDelete: (interview: Interview) => void;
    getCandidateName: (candidateId: number) => string;
    getInterviewerName: (interviewerId: number) => string;
}
function InterviewTable({
    interviews,
    isLoading,
    onEdit,
    onDelete,
    getCandidateName: _getCandidateName,
    getInterviewerName: _getInterviewerName
}: InterviewTableProps) {
    const interviewColumns: ColumnDef<Interview>[] = [
        {
            id: 'serialNumber',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
            cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
            enableSorting: false
        },
        {
            accessorKey: 'candidateName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Candidate Name' />,
            cell: ({ row }) => <div className='font-medium'>{row.getValue('candidateName')}</div>
        },
        {
            accessorKey: 'interviewDate',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Interview Date' />,
            cell: ({ row }) => <div>{new Date(row.getValue('interviewDate')).toLocaleDateString()}</div>
        },
        {
            accessorKey: 'interviewTime',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Time' />,
            cell: ({ row }) => <div>{row.getValue('interviewTime')}</div>
        },
        {
            accessorKey: 'interviewRounds',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Interview Rounds' />,
            cell: ({ row }) => <div>{row.getValue('interviewRounds')}</div>
        },
        {
            accessorKey: 'interviewerName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Interviewer Name' />,
            cell: ({ row }) => <div>{row.getValue('interviewerName')}</div>
        },
        {
            accessorKey: 'interviewVenue',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Interview Venue' />,
            cell: ({ row }) => <div>{row.getValue('interviewVenue')}</div>
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                const statusColors = {
                    Scheduled: 'bg-blue-100 text-blue-800',
                    Completed: 'bg-green-100 text-green-800',
                    Cancelled: 'bg-red-100 text-red-800',
                    Rescheduled: 'bg-yellow-100 text-yellow-800'
                };
                return <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
            }
        },
        {
            id: 'actions',
            header: 'Action',
            cell: ({ row }) => {
                const interview = row.original;
                return (
                    <div className='flex items-center gap-2'>
                        <Button variant='ghost' size='sm' onClick={() => onEdit(interview)} className='text-blue-600 hover:text-blue-800'>
                            <Edit className='h-4 w-4' />
                        </Button>
                        <Button variant='ghost' size='sm' onClick={() => onDelete(interview)} className='text-red-600 hover:text-red-800'>
                            <Trash2 className='h-4 w-4' />
                        </Button>
                    </div>
                );
            }
        }
    ];
    return (
        <GenericDataTable
            isLoading={isLoading}
            columns={interviewColumns}
            data={interviews}
            totalItems={interviews.length}
            showViewOptions={true}
        />
    );
}

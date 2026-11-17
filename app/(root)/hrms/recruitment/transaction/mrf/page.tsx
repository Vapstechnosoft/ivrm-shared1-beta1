// Refactored by automation script on 2025-10-28T15:40:36.036Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/mrf-form.tsx
// 3. Extract column definitions and form to the respective files
// 4. Update handlers to use the new structure
'use client';
import { Heading } from '@/components/layout/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
interface MRF extends BaseEntity {
    department: string;
    position: string;
    priority: string;
    positionType: string;
    qualification: string;
    noOfPosition: number;
    age: string;
    gender: string;
    expFrom: number;
    expTo: number;
    payScaleFrom?: string;
    payScaleTo?: string;
    skill: string;
    jobDescription: string;
    locationType: 'HO' | 'Client' | 'Location';
    country: string;
    state: string;
    remark?: string;
    reason: string;
    tests: { written: boolean; online: boolean; technical: boolean };
    status: 'Pending' | 'Approved' | 'Rejected';
}
type MRFForm = {
    department: string;
    position: string;
    priority: string;
    positionType: string;
    qualification: string;
    noOfPosition: string;
    age: string;
    gender: string;
    expFrom: string;
    expTo: string;
    payScaleFrom?: string;
    payScaleTo?: string;
    skill: string;
    jobDescription: string;
    locationType: 'HO' | 'Client' | 'Location';
    country: string;
    state: string;
    remark?: string;
    reason: string;
};
export default function MRFPage() {
    const [mrfList, setMrfList] = useState<MRF[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMRF, setEditingMRF] = useState<MRF | null>(null);
    const [tests, setTests] = useState({ written: false, online: false, technical: false });
    const formRef = useRef<HTMLDivElement>(null);
    const mrfDB = createLocalCrud<MRF>('recruitment:mrf');
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<MRFForm>({ mode: 'onChange' });
    useEffect(() => {
        loadData();
    }, []);
    const loadData = () => {
        try {
            setMrfList(mrfDB.list());
        } catch {
            toast.error('Failed to load MRFs');
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
        setEditingMRF(null);
        reset();
        setTests({ written: false, online: false, technical: false });
    };
    const onSubmit: SubmitHandler<MRFForm> = async (data) => {
        try {
            const mrf: Omit<MRF, 'id' | 'createdAt'> = {
                department: data.department,
                position: data.position,
                priority: data.priority,
                positionType: data.positionType,
                qualification: data.qualification,
                noOfPosition: Number(data.noOfPosition || 0),
                age: data.age,
                gender: data.gender,
                expFrom: Number(data.expFrom || 0),
                expTo: Number(data.expTo || 0),
                payScaleFrom: data.payScaleFrom,
                payScaleTo: data.payScaleTo,
                skill: data.skill,
                jobDescription: data.jobDescription,
                locationType: data.locationType,
                country: data.country,
                state: data.state,
                remark: data.remark,
                reason: data.reason,
                tests,
                status: 'Pending'
            };
            if (editingMRF) {
                mrfDB.update(editingMRF.id, mrf);
                toast.success('MRF updated');
            } else {
                mrfDB.create(mrf);
                toast.success('MRF saved');
            }
            handleFormClose();
            loadData();
        } catch (e: any) {
            toast.error(e.message || 'Operation failed');
        }
    };
    const handleEdit = (m: MRF) => {
        setEditingMRF(m);
        reset({
            department: m.department,
            position: m.position,
            priority: m.priority,
            positionType: m.positionType,
            qualification: m.qualification,
            noOfPosition: String(m.noOfPosition),
            age: m.age,
            gender: m.gender,
            expFrom: String(m.expFrom),
            expTo: String(m.expTo),
            payScaleFrom: m.payScaleFrom,
            payScaleTo: m.payScaleTo,
            skill: m.skill,
            jobDescription: m.jobDescription,
            locationType: m.locationType,
            country: m.country,
            state: m.state,
            remark: m.remark,
            reason: m.reason
        });
        setTests(m.tests || { written: false, online: false, technical: false });
        setIsFormOpen(true);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };
    const handleDelete = (m: MRF) => {
        mrfDB.remove(m.id);
        toast.success('MRF deleted');
        loadData();
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading title='HRMS - MRF Requisition' description='Create and manage manpower requisitions' />
                    </div>
                    <Button
                        type='button'
                        onClick={handleAddClick}
                        size='lg'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        New MRF
                    </Button>
                </div>
                <CollapsibleSection
                    title='MRF Requisition Details'
                    description='Search and manage MRF records'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <MRFTable data={mrfList} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
                </CollapsibleSection>
                {isFormOpen && (
                    <div ref={formRef}>
                        <CollapsibleSection
                            title={editingMRF ? 'Edit MRF' : 'New MRF'}
                            description='Fill requisition details'
                            defaultOpen={true}
                            variant='default'
                            size='lg'
                            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                    <div className='space-y-3'>
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
                                        <span className='font-medium text-sm'>
                                            Position <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(v) => setValue('position', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Software Engineer'>Software Engineer</SelectItem>
                                                <SelectItem value='Project Manager'>Project Manager</SelectItem>
                                                <SelectItem value='HR Executive'>HR Executive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <span className='font-medium text-sm'>
                                            Priority <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(v) => setValue('priority', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Critical'>Critical</SelectItem>
                                                <SelectItem value='High'>High</SelectItem>
                                                <SelectItem value='Medium'>Medium</SelectItem>
                                                <SelectItem value='Low'>Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <span className='font-medium text-sm'>
                                            Position Type <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(v) => setValue('positionType', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Full Time'>Full Time</SelectItem>
                                                <SelectItem value='Part Time'>Part Time</SelectItem>
                                                <SelectItem value='Contract'>Contract</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                                <SelectItem value='MBA'>MBA</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <span className='font-medium text-sm'>
                                            No of Position <span className='text-red-500'>*</span>
                                        </span>
                                        <InputText
                                            placeholder='1'
                                            {...register('noOfPosition', { required: 'Required' })}
                                            error={errors.noOfPosition?.message}
                                        />
                                        <span className='font-medium text-sm'>
                                            Age <span className='text-red-500'>*</span>
                                        </span>
                                        <InputText
                                            placeholder='e.g. 22-30'
                                            {...register('age', { required: 'Required' })}
                                            error={errors.age?.message}
                                        />
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
                                        <span className='font-medium text-sm'>
                                            Experience <span className='text-red-500'>*</span>
                                        </span>
                                        <div className='grid grid-cols-3 items-center gap-2'>
                                            <InputText
                                                placeholder='From'
                                                {...register('expFrom', { required: 'Required' })}
                                                error={errors.expFrom?.message}
                                            />
                                            <span className='text-center'>To</span>
                                            <InputText
                                                placeholder='To'
                                                {...register('expTo', { required: 'Required' })}
                                                error={errors.expTo?.message}
                                            />
                                        </div>
                                        <span className='font-medium text-sm'>Pay Scale</span>
                                        <div className='grid grid-cols-3 items-center gap-2'>
                                            <InputText placeholder='From' {...register('payScaleFrom')} />
                                            <span className='text-center'>To</span>
                                            <InputText placeholder='To' {...register('payScaleTo')} />
                                        </div>
                                    </div>
                                    <div className='space-y-3'>
                                        <span className='font-medium text-sm'>
                                            Skill <span className='text-red-500'>*</span>
                                        </span>
                                        <InputText
                                            placeholder='Primary skills'
                                            {...register('skill', { required: 'Required' })}
                                            error={errors.skill?.message}
                                        />
                                        <span className='font-medium text-sm'>
                                            Job Description <span className='text-red-500'>*</span>
                                        </span>
                                        <InputText
                                            placeholder='Enter description'
                                            {...register('jobDescription', { required: 'Required' })}
                                            error={errors.jobDescription?.message}
                                        />
                                        <span className='font-medium text-sm'>
                                            Location <span className='text-red-500'>*</span>
                                        </span>
                                        <div className='flex items-center gap-6 pt-1'>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <Checkbox
                                                    id='mrfLocHO'
                                                    checked={watch('locationType') === 'HO'}
                                                    onCheckedChange={(_v) => setValue('locationType', 'HO')}
                                                />
                                                <label htmlFor='mrfLocHO' className='cursor-pointer'>
                                                    HO
                                                </label>
                                            </div>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <Checkbox
                                                    id='mrfLocClient'
                                                    checked={watch('locationType') === 'Client'}
                                                    onCheckedChange={(_v) => setValue('locationType', 'Client')}
                                                />
                                                <label htmlFor='mrfLocClient' className='cursor-pointer'>
                                                    Client
                                                </label>
                                            </div>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <Checkbox
                                                    id='mrfLocLocation'
                                                    checked={watch('locationType') === 'Location'}
                                                    onCheckedChange={(_v) => setValue('locationType', 'Location')}
                                                />
                                                <label htmlFor='mrfLocLocation' className='cursor-pointer'>
                                                    Location
                                                </label>
                                            </div>
                                        </div>
                                        <span className='font-medium text-sm'>
                                            Country <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(v) => setValue('country', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='India'>India</SelectItem>
                                                <SelectItem value='USA'>USA</SelectItem>
                                                <SelectItem value='UK'>UK</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <span className='font-medium text-sm'>
                                            State <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(v) => setValue('state', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Karnataka'>Karnataka</SelectItem>
                                                <SelectItem value='Maharashtra'>Maharashtra</SelectItem>
                                                <SelectItem value='Tamil Nadu'>Tamil Nadu</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <span className='font-medium text-sm'>Remark</span>
                                        <InputText placeholder='Enter remark' {...register('remark')} />
                                        <span className='font-medium text-sm'>
                                            Reason <span className='text-red-500'>*</span>
                                        </span>
                                        <InputText
                                            placeholder='Enter reason'
                                            {...register('reason', { required: 'Required' })}
                                            error={errors.reason?.message}
                                        />
                                        <div className='flex gap-6 pt-2'>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <Checkbox
                                                    id='mrfTestWritten'
                                                    checked={tests.written}
                                                    onCheckedChange={(v) => setTests((s) => ({ ...s, written: Boolean(v) }))}
                                                />
                                                <label htmlFor='mrfTestWritten' className='cursor-pointer'>
                                                    Written Test
                                                </label>
                                            </div>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <Checkbox
                                                    id='mrfTestOnline'
                                                    checked={tests.online}
                                                    onCheckedChange={(v) => setTests((s) => ({ ...s, online: Boolean(v) }))}
                                                />
                                                <label htmlFor='mrfTestOnline' className='cursor-pointer'>
                                                    Online Test
                                                </label>
                                            </div>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <Checkbox
                                                    id='mrfTestTechnical'
                                                    checked={tests.technical}
                                                    onCheckedChange={(v) => setTests((s) => ({ ...s, technical: Boolean(v) }))}
                                                />
                                                <label htmlFor='mrfTestTechnical' className='cursor-pointer'>
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
interface MRFTableProps {
    data: MRF[];
    isLoading: boolean;
    onEdit: (m: MRF) => void;
    onDelete: (m: MRF) => void;
}
function MRFTable({ data, isLoading, onEdit, onDelete }: MRFTableProps) {
    const columns: ColumnDef<MRF>[] = [
        {
            id: 'sl',
            header: ({ column }) => <DataTableColumnHeader column={column} title='SL.NO.' />,
            cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
            enableSorting: false
        },
        { accessorKey: 'department', header: ({ column }) => <DataTableColumnHeader column={column} title='Department' /> },
        { accessorKey: 'position', header: ({ column }) => <DataTableColumnHeader column={column} title='Position' /> },
        { accessorKey: 'priority', header: ({ column }) => <DataTableColumnHeader column={column} title='Priority' /> },
        { accessorKey: 'positionType', header: ({ column }) => <DataTableColumnHeader column={column} title='Position Type' /> },
        { accessorKey: 'noOfPosition', header: ({ column }) => <DataTableColumnHeader column={column} title='No of Position' /> },
        { accessorKey: 'gender', header: ({ column }) => <DataTableColumnHeader column={column} title='Gender' /> },
        { accessorKey: 'locationType', header: ({ column }) => <DataTableColumnHeader column={column} title='Location' /> },
        {
            accessorKey: 'status',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                const map: Record<string, string> = {
                    Pending: 'bg-yellow-100 text-yellow-800',
                    Approved: 'bg-green-100 text-green-800',
                    Rejected: 'bg-red-100 text-red-800'
                };
                return <Badge className={map[status] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
            }
        },
        {
            id: 'action',
            header: 'Action',
            cell: ({ row }) => {
                const m = row.original;
                return (
                    <div className='flex items-center gap-2'>
                        <Button variant='outline' size='sm' onClick={() => onEdit(m)}>
                            <Edit className='h-4 w-4' />
                        </Button>
                        <Button variant='outline' size='sm' className='text-red-600' onClick={() => onDelete(m)}>
                            <Trash2 className='h-4 w-4' />
                        </Button>
                    </div>
                );
            }
        }
    ];
    return <GenericDataTable isLoading={isLoading} columns={columns} data={data} totalItems={data.length} showViewOptions />;
}

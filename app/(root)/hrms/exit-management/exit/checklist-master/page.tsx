// Refactored by automation script on 2025-10-28T15:40:35.688Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/checklist-form.tsx
// 3. Extract column definitions and form to the respective files
// 4. Update handlers to use the new structure
'use client';
import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
type ChecklistItem = {
    id: string;
    title: string;
    checklistType: string;
    department: string;
    designation: string;
    company: string;
    isCompulsory: boolean;
    isActive: boolean;
};
type Approver = {
    id: string;
    company: string;
    department: string;
    designation: string;
};
type ChecklistFormData = {
    title: string;
    checklistType: string;
    remark: string;
    company: string;
    department: string;
    designation: string;
    isCompulsory: boolean;
    approvers: Approver[];
};
export default function ChecklistMasterPage() {
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<ChecklistFormData>({
        mode: 'onChange',
        defaultValues: {
            isCompulsory: false,
            approvers: []
        }
    });
    const [approvers, setApprovers] = useState<Approver[]>([]);
    useEffect(() => {
        const seed: ChecklistItem[] = [
            {
                id: '1',
                title: 'KT Process & Handover',
                checklistType: 'Relieving',
                department: 'Software',
                designation: 'Software Developer',
                company: 'Vayu Knowledge Services Pvt Ltd',
                isCompulsory: true,
                isActive: true
            }
        ];
        setItems(seed);
    }, []);
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return items;
        return items.filter(
            (x) =>
                x.title.toLowerCase().includes(q) ||
                x.checklistType.toLowerCase().includes(q) ||
                x.department.toLowerCase().includes(q) ||
                x.designation.toLowerCase().includes(q) ||
                x.company.toLowerCase().includes(q)
        );
    }, [items, search]);
    const handleAddClick = () => {
        setEditingItem(null);
        reset();
        setIsFormOpen(true);
    };
    const handleEditClick = (item: ChecklistItem) => {
        setEditingItem(item);
        setValue('title', item.title);
        setValue('checklistType', item.checklistType);
        setValue('remark', '');
        setValue('department', item.department);
        setValue('designation', item.designation);
        setValue('company', item.company);
        setValue('isCompulsory', item.isCompulsory);
        setApprovers([]);
        setIsFormOpen(true);
    };
    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingItem(null);
        setApprovers([]);
        reset();
    };
    const addApprover = () => {
        const newApprover: Approver = {
            id: Date.now().toString(),
            company: '',
            department: '',
            designation: ''
        };
        setApprovers((prev) => [...prev, newApprover]);
    };
    const removeApprover = (id: string) => {
        setApprovers((prev) => prev.filter((approver) => approver.id !== id));
    };
    const updateApprover = (id: string, field: keyof Approver, value: string) => {
        setApprovers((prev) => prev.map((approver) => (approver.id === id ? { ...approver, [field]: value } : approver)));
    };
    const onSubmit = (data: ChecklistFormData) => {
        const itemData = {
            ...data,
            approvers: approvers
        };
        if (editingItem) {
            // Update existing item
            setItems((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, ...itemData, isActive: item.isActive } : item)));
        } else {
            // Add new item
            const newItem: ChecklistItem = {
                id: Date.now().toString(),
                ...itemData,
                isActive: true
            };
            setItems((prev) => [...prev, newItem]);
        }
        handleFormClose();
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading
                            title='Checklist Master'
                            description='Manage exit checklist items for different departments and designations'
                        />
                    </div>
                    <Button
                        type='button'
                        onClick={handleAddClick}
                        size='lg'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='mr-2 h-4 w-4' />
                        Add New Checklist
                    </Button>
                </div>
                {/* Search and Filters */}
                <div className='flex items-center justify-between gap-3'>
                    <Input
                        placeholder='Search by title, type, department, designation, company'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='max-w-sm'
                    />
                </div>
                {/* Data Table */}
                <div className='space-y-4'>
                    <GenericDataTable
                        columns={[
                            {
                                accessorKey: 'title',
                                header: 'Title'
                            },
                            {
                                accessorKey: 'checklistType',
                                header: 'CheckList Type'
                            },
                            {
                                accessorKey: 'department',
                                header: 'Department'
                            },
                            {
                                accessorKey: 'designation',
                                header: 'Designation'
                            },
                            {
                                accessorKey: 'company',
                                header: 'Company'
                            },
                            {
                                accessorKey: 'isCompulsory',
                                header: 'Compulsory',
                                cell: ({ row }) => (row.original.isCompulsory ? '✔️' : '—')
                            },
                            {
                                accessorKey: 'isActive',
                                header: 'Status',
                                cell: ({ row }) => (row.original.isActive ? 'Active' : 'Inactive')
                            },
                            {
                                id: 'actions',
                                header: 'Action',
                                cell: ({ row }) => (
                                    <div className='flex gap-2'>
                                        <Button size='sm' variant='ghost' onClick={() => handleEditClick(row.original)}>
                                            Edit
                                        </Button>
                                        <Button
                                            size='sm'
                                            variant='ghost'
                                            onClick={() => {
                                                setItems((prev) =>
                                                    prev.map((item) =>
                                                        item.id === row.original.id ? { ...item, isActive: !item.isActive } : item
                                                    )
                                                );
                                            }}>
                                            {row.original.isActive ? 'Deactivate' : 'Activate'}
                                        </Button>
                                    </div>
                                )
                            }
                        ]}
                        data={filtered}
                        totalItems={filtered.length}
                        isLoading={false}
                    />
                </div>
                {/* Add/Edit Form Section */}
                {isFormOpen && (
                    <div ref={formRef} className='slide-in-from-top-4 animate-in duration-300'>
                        <CollapsibleSection
                            title={editingItem ? 'Edit Checklist Item' : 'Add New Checklist Item'}
                            description={
                                editingItem ? 'Update checklist item details' : 'Fill in the details below to create a new checklist item'
                            }
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
                                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                        {/* Checklist Title */}
                                        <div className='space-y-2'>
                                            <label htmlFor='checklist-title-input' className='font-medium text-gray-700 text-sm'>
                                                Checklist Title <span className='text-red-500'>*</span>
                                            </label>
                                            <InputText
                                                id='checklist-title-input'
                                                placeholder='Enter Checklist Title'
                                                {...register('title', { required: 'Title is required' })}
                                                error={errors.title?.message}
                                            />
                                        </div>
                                        {/* Checklist Type */}
                                        <div className='space-y-2'>
                                            <label htmlFor='checklist-type-select' className='font-medium text-gray-700 text-sm'>
                                                Checklist Type <span className='text-red-500'>*</span>
                                            </label>
                                            <Select
                                                value={watch('checklistType')}
                                                onValueChange={(value) => setValue('checklistType', value)}>
                                                <SelectTrigger id='checklist-type-select'>
                                                    <SelectValue placeholder='--Select Checklist Type--' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='NOC'>NOC</SelectItem>
                                                    <SelectItem value='Relieving'>Relieving</SelectItem>
                                                    <SelectItem value='Resignation'>Resignation</SelectItem>
                                                    <SelectItem value='Termination'>Termination</SelectItem>
                                                    <SelectItem value='Retirement'>Retirement</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.checklistType && <p className='text-red-500 text-sm'>{errors.checklistType.message}</p>}
                                        </div>
                                        {/* Remark */}
                                        <div className='space-y-2 md:col-span-2'>
                                            <label htmlFor='remark-textarea' className='font-medium text-gray-700 text-sm'>
                                                Remark
                                            </label>
                                            <textarea
                                                id='remark-textarea'
                                                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                rows={3}
                                                placeholder='Enter remarks'
                                                {...register('remark')}
                                            />
                                        </div>
                                        {/* Company */}
                                        <div className='space-y-2'>
                                            <label htmlFor='company-select' className='font-medium text-gray-700 text-sm'>
                                                Company <span className='text-red-500'>*</span>
                                            </label>
                                            <Select value={watch('company')} onValueChange={(value) => setValue('company', value)}>
                                                <SelectTrigger id='company-select'>
                                                    <SelectValue placeholder='Select or search company Name in the list...' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='Vaps Technosoft Pvt Ltd'>Vaps Technosoft Pvt Ltd</SelectItem>
                                                    <SelectItem value='Vayu Knowledge Services Pvt Ltd'>
                                                        Vayu Knowledge Services Pvt Ltd
                                                    </SelectItem>
                                                    <SelectItem value='Other Company'>Other Company</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.company && <p className='text-red-500 text-sm'>{errors.company.message}</p>}
                                        </div>
                                        {/* Department */}
                                        <div className='space-y-2'>
                                            <label htmlFor='department-select' className='font-medium text-gray-700 text-sm'>
                                                Department <span className='text-red-500'>*</span>
                                            </label>
                                            <Select value={watch('department')} onValueChange={(value) => setValue('department', value)}>
                                                <SelectTrigger id='department-select'>
                                                    <SelectValue placeholder='Select or search DepartmentName Name in the list...' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='Software'>Software</SelectItem>
                                                    <SelectItem value='HR'>HR</SelectItem>
                                                    <SelectItem value='Finance'>Finance</SelectItem>
                                                    <SelectItem value='Marketing'>Marketing</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.department && <p className='text-red-500 text-sm'>{errors.department.message}</p>}
                                        </div>
                                        {/* Designation */}
                                        <div className='space-y-2'>
                                            <label htmlFor='designation-select' className='font-medium text-gray-700 text-sm'>
                                                Designation <span className='text-red-500'>*</span>
                                            </label>
                                            <Select value={watch('designation')} onValueChange={(value) => setValue('designation', value)}>
                                                <SelectTrigger id='designation-select'>
                                                    <SelectValue placeholder='Select or search Designation Name in the list...' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='Software Developer'>Software Developer</SelectItem>
                                                    <SelectItem value='Jr Software Developer'>Jr Software Developer</SelectItem>
                                                    <SelectItem value='Senior Software Developer'>Senior Software Developer</SelectItem>
                                                    <SelectItem value='Team Lead'>Team Lead</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.designation && <p className='text-red-500 text-sm'>{errors.designation.message}</p>}
                                        </div>
                                        {/* Compulsory Flag */}
                                        <div className='space-y-2'>
                                            <div className='flex items-center space-x-2'>
                                                <Checkbox
                                                    id='compulsory-flag-checkbox'
                                                    checked={watch('isCompulsory')}
                                                    onCheckedChange={(checked) => setValue('isCompulsory', checked as boolean)}
                                                />
                                                <label htmlFor='compulsory-flag-checkbox' className='font-medium text-sm'>
                                                    Compulsory
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Approval Checklist Settings */}
                                    <div className='space-y-4'>
                                        <h3 className='font-semibold text-gray-800 text-lg'>APPROVAL CHICKLIST SETTINGS</h3>
                                        <div className='overflow-hidden rounded-lg border'>
                                            <table className='w-full'>
                                                <thead className='bg-gray-50'>
                                                    <tr>
                                                        <th className='px-4 py-2 text-left font-medium text-gray-700 text-sm'>SL NO</th>
                                                        <th className='px-4 py-2 text-left font-medium text-gray-700 text-sm'>
                                                            Approver Company
                                                        </th>
                                                        <th className='px-4 py-2 text-left font-medium text-gray-700 text-sm'>
                                                            Approver Department
                                                        </th>
                                                        <th className='px-4 py-2 text-left font-medium text-gray-700 text-sm'>
                                                            Approver Designation
                                                        </th>
                                                        <th className='px-4 py-2 text-left font-medium text-gray-700 text-sm'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {approvers.map((approver, index) => (
                                                        <tr key={approver.id} className='border-t'>
                                                            <td className='px-4 py-2 text-sm'>{index + 1}</td>
                                                            <td className='px-4 py-2'>
                                                                <Select
                                                                    value={approver.company}
                                                                    onValueChange={(value) =>
                                                                        updateApprover(approver.id, 'company', value)
                                                                    }>
                                                                    <SelectTrigger className='w-full'>
                                                                        <SelectValue placeholder='Select Company' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value='Vaps Technosoft Pvt Ltd'>
                                                                            Vaps Technosoft Pvt Ltd
                                                                        </SelectItem>
                                                                        <SelectItem value='Vayu Knowledge Services Pvt Ltd'>
                                                                            Vayu Knowledge Services Pvt Ltd
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </td>
                                                            <td className='px-4 py-2'>
                                                                <Select
                                                                    value={approver.department}
                                                                    onValueChange={(value) =>
                                                                        updateApprover(approver.id, 'department', value)
                                                                    }>
                                                                    <SelectTrigger className='w-full'>
                                                                        <SelectValue placeholder='Select Department' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value='Software'>Software</SelectItem>
                                                                        <SelectItem value='HR'>HR</SelectItem>
                                                                        <SelectItem value='Finance'>Finance</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </td>
                                                            <td className='px-4 py-2'>
                                                                <Select
                                                                    value={approver.designation}
                                                                    onValueChange={(value) =>
                                                                        updateApprover(approver.id, 'designation', value)
                                                                    }>
                                                                    <SelectTrigger className='w-full'>
                                                                        <SelectValue placeholder='Select Designation' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value='Software Developer'>
                                                                            Software Developer
                                                                        </SelectItem>
                                                                        <SelectItem value='Team Lead'>Team Lead</SelectItem>
                                                                        <SelectItem value='Manager'>Manager</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </td>
                                                            <td className='px-4 py-2'>
                                                                <Button
                                                                    type='button'
                                                                    variant='ghost'
                                                                    size='sm'
                                                                    onClick={() => removeApprover(approver.id)}
                                                                    className='text-red-500 hover:text-red-700'>
                                                                    <X className='h-4 w-4' />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan={5} className='px-4 py-2'>
                                                            <Button
                                                                type='button'
                                                                variant='outline'
                                                                size='sm'
                                                                onClick={addApprover}
                                                                className='w-full'>
                                                                <Plus className='mr-2 h-4 w-4' />
                                                                Add Approver
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {/* Form Actions */}
                                    <div className='flex justify-end gap-3 pt-4'>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            onClick={handleFormClose}
                                            className='border-orange-500 bg-orange-500 text-white hover:bg-orange-600'>
                                            <X className='mr-2 h-4 w-4' />
                                            CANCEL
                                        </Button>
                                        <Button type='submit' disabled={isSubmitting} className='bg-blue-600 text-white hover:bg-blue-700'>
                                            <svg className='mr-2 h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                                                <path
                                                    fillRule='evenodd'
                                                    d='M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                            SAVE
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </CollapsibleSection>
                    </div>
                )}
                <div className='text-muted-foreground text-sm'>Need to configure approvers? Add them from the form in the next phase.</div>
            </div>
        </div>
    );
}

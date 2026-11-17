// Refactored by automation script on 2025-10-28T15:40:35.719Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/leaving-reason-form.tsx
// 3. Extract column definitions and form to the respective files
// 4. Update handlers to use the new structure
'use client';
import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Plus, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
type LeavingReason = {
    id: string;
    company: string;
    reason: string;
    reasonType: string;
    noticePeriodInDays: number | null;
    isActive: boolean;
};
type LeavingReasonFormData = {
    company: string;
    reason: string;
    reasonType: string;
    noticePeriodInDays: number | null;
};
export default function LeavingReasonPage() {
    const [items, setItems] = useState<LeavingReason[]>([]);
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<LeavingReason | null>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<LeavingReasonFormData>({
        mode: 'onChange',
        defaultValues: {
            noticePeriodInDays: null
        }
    });
    useEffect(() => {
        const seed: LeavingReason[] = [
            {
                id: '1',
                company: 'Vaps Technosoft Pvt Ltd',
                reason: 'test',
                reasonType: 'Resignation',
                noticePeriodInDays: 10,
                isActive: true
            },
            {
                id: '2',
                company: 'Vaps Technosoft Pvt Ltd',
                reason: 'retest',
                reasonType: 'Relieving',
                noticePeriodInDays: 22,
                isActive: true
            },
            {
                id: '3',
                company: 'Vaps Technosoft Pvt Ltd',
                reason: 'olg',
                reasonType: 'Resignation',
                noticePeriodInDays: 15,
                isActive: false
            },
            {
                id: '4',
                company: 'Vaps Technosoft Pvt Ltd',
                reason: 'old',
                reasonType: 'Relieving',
                noticePeriodInDays: 90,
                isActive: true
            },
            {
                id: '5',
                company: 'Vaps Technosoft Pvt Ltd',
                reason: 'new1',
                reasonType: 'Resignation',
                noticePeriodInDays: null,
                isActive: true
            },
            {
                id: '6',
                company: 'Vaps Technosoft Pvt Ltd',
                reason: 'marriage',
                reasonType: 'Relieving',
                noticePeriodInDays: 30,
                isActive: true
            },
            {
                id: '7',
                company: 'Vaps Technosoft Pvt Ltd',
                reason: 'new',
                reasonType: 'Resignation',
                noticePeriodInDays: null,
                isActive: false
            }
        ];
        setItems(seed);
    }, []);
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return items;
        return items.filter(
            (x) => x.company.toLowerCase().includes(q) || x.reason.toLowerCase().includes(q) || x.reasonType.toLowerCase().includes(q)
        );
    }, [items, search]);
    const handleAddClick = () => {
        setEditingItem(null);
        reset();
        setIsFormOpen(true);
        // Scroll to form after state update
        setTimeout(() => {
            formRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }, 100);
    };
    const handleEditClick = (item: LeavingReason) => {
        setEditingItem(item);
        setValue('company', item.company);
        setValue('reason', item.reason);
        setValue('reasonType', item.reasonType);
        setValue('noticePeriodInDays', item.noticePeriodInDays);
        setIsFormOpen(true);
    };
    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingItem(null);
        reset();
    };
    // Define columns with proper sorting
    const columns: ColumnDef<LeavingReason>[] = [
        {
            accessorKey: 'id',
            header: ({ column }) => <DataTableColumnHeader column={column} title='SL NO' />,
            cell: ({ row, table }) => {
                const pageIndex = table.getState().pagination.pageIndex;
                const pageSize = table.getState().pagination.pageSize;
                const continuousIndex = pageIndex * pageSize + row.index + 1;
                return <div>{continuousIndex}</div>;
            },
            enableSorting: true,
            enableHiding: false
        },
        {
            accessorKey: 'company',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Company name' />,
            enableSorting: true
        },
        {
            accessorKey: 'reason',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Reason' />,
            enableSorting: true
        },
        {
            accessorKey: 'reasonType',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Reason Type' />,
            enableSorting: true
        },
        {
            accessorKey: 'noticePeriodInDays',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Notice Period In Days' />,
            cell: ({ row }) => row.original.noticePeriodInDays || '-',
            enableSorting: true
        },
        {
            accessorKey: 'isActive',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
            cell: ({ row }) => (row.original.isActive ? 'Active' : 'Deactivate'),
            enableSorting: true
        },
        {
            id: 'actions',
            header: 'Action',
            cell: ({ row }) => (
                <div className='flex gap-2'>
                    <Button size='sm' variant='ghost' onClick={() => handleEditClick(row.original)} className='h-8 w-8 p-1'>
                        <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => {
                            setItems((prev) =>
                                prev.map((item) => (item.id === row.original.id ? { ...item, isActive: !item.isActive } : item))
                            );
                        }}
                        className='h-8 w-8 p-1'>
                        <Eye className='h-4 w-4' />
                    </Button>
                </div>
            ),
            enableSorting: false
        }
    ];
    const onSubmit = (data: LeavingReasonFormData) => {
        if (editingItem) {
            // Update existing item
            setItems((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, ...data, isActive: item.isActive } : item)));
        } else {
            // Add new item
            const newItem: LeavingReason = {
                id: Date.now().toString(),
                ...data,
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
                            title='Leaving Reason Management'
                            description='Manage and organize leaving reasons with advanced filtering and controls'
                        />
                    </div>
                    <Button
                        type='button'
                        onClick={handleAddClick}
                        size='lg'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Leaving Reason
                    </Button>
                </div>
                {/* Data Table Section - Collapsible but default open */}
                <CollapsibleSection
                    title='Leaving Reasons Data'
                    description='View, search, and manage all leaving reasons in the system'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <LeavingReasonTable
                        columns={columns}
                        data={filtered}
                        search={search}
                        setSearch={setSearch}
                        totalItems={filtered.length}
                    />
                </CollapsibleSection>
                {/* Add Form Section - Conditionally Rendered */}
                {isFormOpen && (
                    <div ref={formRef} className='slide-in-from-top-4 animate-in duration-300'>
                        <CollapsibleSection
                            title={editingItem ? 'Edit Leaving Reason' : 'Add New Leaving Reason'}
                            description={
                                editingItem ? 'Update leaving reason details' : 'Fill in the details below to create a new leaving reason'
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
                                        {/* Company Name */}
                                        <div className='space-y-2'>
                                            <label htmlFor='company-select' className='font-medium text-gray-700 text-sm'>
                                                Company Name <span className='text-red-500'>*</span>
                                            </label>
                                            <Select value={watch('company')} onValueChange={(value) => setValue('company', value)}>
                                                <SelectTrigger id='company-select'>
                                                    <SelectValue placeholder='Search Companys here...' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='Vaps Technosoft Pvt Ltd'>Vaps Technosoft Pvt Ltd</SelectItem>
                                                    <SelectItem value='Vaps Knowledge Services Pvt Ltd'>
                                                        Vaps Knowledge Services Pvt Ltd
                                                    </SelectItem>
                                                    <SelectItem value='Vayu Knowledge Services Pvt Ltd'>
                                                        Vayu Knowledge Services Pvt Ltd
                                                    </SelectItem>
                                                    <SelectItem value='Other Company'>Other Company</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.company && <p className='text-red-500 text-sm'>{errors.company.message}</p>}
                                        </div>
                                        {/* Leaving Reason */}
                                        <div className='space-y-2'>
                                            <label htmlFor='leaving-reason-input' className='font-medium text-gray-700 text-sm'>
                                                Leaving Reason <span className='text-red-500'>*</span>
                                            </label>
                                            <InputText
                                                id='leaving-reason-input'
                                                placeholder='Enter Leaving Reason'
                                                {...register('reason', { required: 'Leaving reason is required' })}
                                                error={errors.reason?.message}
                                            />
                                        </div>
                                        {/* Reason Type */}
                                        <div className='space-y-2'>
                                            <label htmlFor='reason-type-select' className='font-medium text-gray-700 text-sm'>
                                                Reason Type <span className='text-red-500'>*</span>
                                            </label>
                                            <Select value={watch('reasonType')} onValueChange={(value) => setValue('reasonType', value)}>
                                                <SelectTrigger id='reason-type-select'>
                                                    <SelectValue placeholder='--Select Checklist Type--' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='Resignation'>Resignation</SelectItem>
                                                    <SelectItem value='Relieving'>Relieving</SelectItem>
                                                    <SelectItem value='Termination'>Termination</SelectItem>
                                                    <SelectItem value='Retirement'>Retirement</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.reasonType && <p className='text-red-500 text-sm'>{errors.reasonType.message}</p>}
                                        </div>
                                        {/* Notice Period In Days */}
                                        <div className='space-y-2'>
                                            <label htmlFor='notice-period-input' className='font-medium text-gray-700 text-sm'>
                                                Notice Period In Days
                                            </label>
                                            <InputText
                                                id='notice-period-input'
                                                type='number'
                                                placeholder='Enter notice period in days'
                                                {...register('noticePeriodInDays', {
                                                    valueAsNumber: true,
                                                    min: { value: 0, message: 'Notice period must be positive' }
                                                })}
                                                error={errors.noticePeriodInDays?.message}
                                            />
                                        </div>
                                    </div>
                                    {/* Form Actions */}
                                    <div className='flex justify-end gap-3 pt-4'>
                                        <Button type='button' variant='outline' onClick={handleFormClose}>
                                            Cancel
                                        </Button>
                                        <Button type='submit' disabled={isSubmitting}>
                                            {isSubmitting ? 'Saving...' : editingItem ? 'Update' : 'Create'}
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
function LeavingReasonTable({
    columns,
    data,
    search,
    setSearch,
    totalItems
}: {
    columns: ColumnDef<LeavingReason>[];
    data: LeavingReason[];
    search: string;
    setSearch: (value: string) => void;
    totalItems: number;
}) {
    return (
        <div className='space-y-4'>
            {/* Search and Total Records */}
            <div className='flex items-center justify-between'>
                <div className='text-gray-600 text-sm'>Total Grid Records: {totalItems}</div>
                <div className='relative max-w-sm flex-1'>
                    <Input placeholder='search here...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-10' />
                    <svg
                        className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                        />
                    </svg>
                </div>
            </div>
            {/* Data Table */}
            <GenericDataTable columns={columns} data={data} totalItems={totalItems} isLoading={false} />
        </div>
    );
}

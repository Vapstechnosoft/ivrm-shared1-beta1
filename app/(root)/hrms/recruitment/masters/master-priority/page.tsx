// Refactored by automation script on 2025-10-28T15:40:35.907Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/priority-form.tsx
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
interface MasterPriority extends BaseEntity {
    institution: string;
    priority: string;
    order: string;
    isActive: boolean;
}
type MasterPriorityForm = {
    institution: string;
    priority: string;
    order: string;
    isActive: boolean;
};
const institutions = ['VAPS School', 'VAPS College', 'VAPS University', 'VAPS Institute', 'VAPS Academy'];
export default function MasterPriorityPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [priorities, setPriorities] = useState<MasterPriority[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const formRef = useRef<HTMLDivElement>(null);
    const priorityDB = createLocalCrud<MasterPriority>('master:priority');
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<MasterPriorityForm>({
        mode: 'onChange',
        defaultValues: {
            isActive: true
        }
    });
    const institution = watch('institution');
    // Load data on component mount
    useEffect(() => {
        loadPriorities();
    }, []);
    const loadPriorities = () => {
        try {
            setPriorities(priorityDB.list());
        } catch (_error) {
            toast.error('Failed to load priorities');
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
    const onSubmit: SubmitHandler<MasterPriorityForm> = async (data: MasterPriorityForm) => {
        try {
            if (editingId) {
                priorityDB.update(editingId, data);
                toast.success('Priority updated successfully');
            } else {
                priorityDB.create(data as Omit<MasterPriority, 'id' | 'createdAt'>);
                toast.success('Priority created successfully');
            }
            loadPriorities();
            handleFormClose();
        } catch (error: any) {
            toast.error(error.message || 'Operation failed');
        }
    };
    const handleEdit = (priority: MasterPriority) => {
        setEditingId(priority.id);
        setValue('institution', priority.institution);
        setValue('priority', priority.priority);
        setValue('order', priority.order);
        setValue('isActive', priority.isActive);
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
            priorityDB.remove(id);
            toast.success('Priority deleted successfully');
            loadPriorities();
        } catch (_error: any) {
            toast.error('Failed to delete priority');
        }
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    {/* <div className='space-y-1'>
                        <Heading
                            title='Master Priority Management'
                            description='Manage priority levels and their ordering for recruitment processes'
                        />
                    </div> */}
                    <Button
                        type='button'
                        onClick={handleAddClick}
                        size='lg'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Master Priority
                    </Button>
                </div>
                {/* Data Table Section - Collapsible but default open */}
                <CollapsibleSection
                    // title='Master Priorities Data'
                    // description='View, search, and manage all priority levels in the system'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <PriorityTable priorities={priorities} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
                </CollapsibleSection>
                {/* Add Form Section - Conditionally Rendered */}
                {isFormOpen && (
                    <div ref={formRef} className='slide-in-from-top-4 animate-in duration-300'>
                        <CollapsibleSection
                            // title={editingId ? 'Update Master Priority' : 'Add New Master Priority'}
                            // description='Fill in the details below to create a new priority level'
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
                                            <div className='space-y-2'>
                                                <span className='font-medium text-sm'>
                                                    Institution <span className='text-red-500'>*</span>
                                                </span>
                                                <Select value={institution || ''} onValueChange={(value) => setValue('institution', value)}>
                                                    <SelectTrigger className={errors.institution ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder='Select Institution' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {institutions.map((inst) => (
                                                            <SelectItem key={inst} value={inst}>
                                                                {inst}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {!institution && (
                                                    <input
                                                        type='hidden'
                                                        {...register('institution', {
                                                            required: 'Institution is required'
                                                        })}
                                                    />
                                                )}
                                                {errors.institution && <FormError>{errors.institution.message}</FormError>}
                                            </div>
                                            <InputText
                                                label='Order'
                                                required
                                                id='order'
                                                {...register('order', { required: 'Order is required' })}
                                                error={errors.order?.message}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                        </div>
                                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                                            <InputText
                                                label='Priority'
                                                required
                                                id='priority'
                                                {...register('priority', { required: 'Priority is required' })}
                                                error={errors.priority?.message}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                            <div className='flex items-center space-y-2 pt-6'>
                                                <input
                                                    type='checkbox'
                                                    id='isActive'
                                                    {...register('isActive')}
                                                    className='mr-2 border-border text-primary focus:ring-primary'
                                                />
                                                <label htmlFor='isActive' className='font-medium text-foreground text-sm'>
                                                    Active
                                                </label>
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
                                                    {editingId ? 'Update Master Priority' : 'Save Master Priority'}
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
interface PriorityTableProps {
    priorities: MasterPriority[];
    isLoading: boolean;
    onEdit: (priority: MasterPriority) => void;
    onDelete: (id: number) => void;
}
function PriorityTable({ priorities, isLoading, onEdit, onDelete }: PriorityTableProps) {
    const priorityColumns: ColumnDef<MasterPriority>[] = [
        {
            id: 'serialNumber',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl No' />,
            cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
            enableSorting: false
        },
        {
            accessorKey: 'priority',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Priority' />,
            cell: ({ row }) => <div className='font-medium'>{row.getValue('priority')}</div>
        },
        {
            accessorKey: 'order',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Order' />,
            cell: ({ row }) => <div>{row.getValue('order')}</div>
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
                const priority = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                                <MoreHorizontal className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Button variant='ghost' size='sm' onClick={() => onEdit(priority)} className='w-full justify-start'>
                                <Edit className='mr-2 h-4 w-4' />
                                Edit
                            </Button>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => onDelete(priority.id)}
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
    return (
        <GenericDataTable
            isLoading={isLoading}
            columns={priorityColumns}
            data={priorities}
            totalItems={priorities.length}
            showViewOptions={true}
        />
    );
}

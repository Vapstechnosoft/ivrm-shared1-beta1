// Refactored by automation script on 2025-10-28T15:40:35.895Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/position-form.tsx
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
interface MasterPosition extends BaseEntity {
    institution: string;
    skill: string;
    positionName: string;
    description: string;
    isActive: boolean;
}
type MasterPositionForm = {
    institution: string;
    skill: string;
    positionName: string;
    description: string;
    isActive: boolean;
};
const institutions = ['VAPS School', 'VAPS College', 'VAPS University', 'VAPS Institute', 'VAPS Academy'];
export default function MasterPositionPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [positions, setPositions] = useState<MasterPosition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const formRef = useRef<HTMLDivElement>(null);
    const positionDB = createLocalCrud<MasterPosition>('master:position');
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<MasterPositionForm>({
        mode: 'onChange',
        defaultValues: {
            isActive: true
        }
    });
    const institution = watch('institution');
    // Load data on component mount
    useEffect(() => {
        loadPositions();
    }, []);
    const loadPositions = () => {
        try {
            setPositions(positionDB.list());
        } catch (_error) {
            toast.error('Failed to load positions');
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
    const onSubmit: SubmitHandler<MasterPositionForm> = async (data: MasterPositionForm) => {
        try {
            if (editingId) {
                positionDB.update(editingId, data);
                toast.success('Position updated successfully');
            } else {
                positionDB.create(data as Omit<MasterPosition, 'id' | 'createdAt'>);
                toast.success('Position created successfully');
            }
            loadPositions();
            handleFormClose();
        } catch (error: any) {
            toast.error(error.message || 'Operation failed');
        }
    };
    const handleEdit = (position: MasterPosition) => {
        setEditingId(position.id);
        setValue('institution', position.institution);
        setValue('skill', position.skill);
        setValue('positionName', position.positionName);
        setValue('description', position.description);
        setValue('isActive', position.isActive);
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
            positionDB.remove(id);
            toast.success('Position deleted successfully');
            loadPositions();
        } catch (_error: any) {
            toast.error('Failed to delete position');
        }
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    {/* <div className='space-y-1'>
                        <Heading title='Master Position Management' description='Manage position details with skills and descriptions' />
                    </div> */}
                    <Button
                        type='button'
                        onClick={handleAddClick}
                        size='lg'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Master Position
                    </Button>
                </div>
                {/* Data Table Section - Collapsible but default open */}
                <CollapsibleSection
                    // title='Master Positions Data'
                    // description='View, search, and manage all position details in the system'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <PositionTable positions={positions} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
                </CollapsibleSection>
                {/* Add Form Section - Conditionally Rendered */}
                {isFormOpen && (
                    <div ref={formRef} className='slide-in-from-top-4 animate-in duration-300'>
                        <CollapsibleSection
                            title={editingId ? 'Update Master Position' : 'Add New Master Position'}
                            description='Fill in the details below to create a new position'
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
                                                label='Position Name'
                                                required
                                                id='positionName'
                                                {...register('positionName', { required: 'Position Name is required' })}
                                                error={errors.positionName?.message}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                        </div>
                                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                                            <InputText
                                                label='Skill'
                                                required
                                                id='skill'
                                                {...register('skill', { required: 'Skill is required' })}
                                                error={errors.skill?.message}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                            <InputText
                                                label='Description'
                                                required
                                                id='description'
                                                {...register('description', { required: 'Description is required' })}
                                                error={errors.description?.message}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                        </div>
                                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
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
                                                    {editingId ? 'Update Master Position' : 'Save Master Position'}
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
interface PositionTableProps {
    positions: MasterPosition[];
    isLoading: boolean;
    onEdit: (position: MasterPosition) => void;
    onDelete: (id: number) => void;
}
function PositionTable({ positions, isLoading, onEdit, onDelete }: PositionTableProps) {
    const positionColumns: ColumnDef<MasterPosition>[] = [
        {
            id: 'serialNumber',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl No' />,
            cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
            enableSorting: false
        },
        {
            accessorKey: 'positionName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Position Name' />,
            cell: ({ row }) => <div className='font-medium'>{row.getValue('positionName')}</div>
        },
        {
            accessorKey: 'skill',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Skill' />,
            cell: ({ row }) => <div>{row.getValue('skill')}</div>
        },
        {
            accessorKey: 'description',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
            cell: ({ row }) => <div>{row.getValue('description')}</div>
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
                const position = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                                <MoreHorizontal className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Button variant='ghost' size='sm' onClick={() => onEdit(position)} className='w-full justify-start'>
                                <Edit className='mr-2 h-4 w-4' />
                                Edit
                            </Button>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => onDelete(position.id)}
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
            columns={positionColumns}
            data={positions}
            totalItems={positions.length}
            showViewOptions={true}
        />
    );
}

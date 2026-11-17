// Refactored by automation script on 2025-10-28T15:40:35.903Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/position-type-form.tsx
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
interface MasterPositionType extends BaseEntity {
    institution: string;
    positionType: string;
    description: string;
    isActive: boolean;
}
type MasterPositionTypeForm = {
    institution: string;
    positionType: string;
    description: string;
    isActive: boolean;
};
const institutions = ['VAPS School', 'VAPS College', 'VAPS University', 'VAPS Institute', 'VAPS Academy'];
export default function MasterPositionTypePage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [positionTypes, setPositionTypes] = useState<MasterPositionType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const formRef = useRef<HTMLDivElement>(null);
    const positionTypeDB = createLocalCrud<MasterPositionType>('master:positionType');
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<MasterPositionTypeForm>({
        mode: 'onChange',
        defaultValues: {
            isActive: true
        }
    });
    const institution = watch('institution');
    // Load data on component mount
    useEffect(() => {
        loadPositionTypes();
    }, []);
    const loadPositionTypes = () => {
        try {
            setPositionTypes(positionTypeDB.list());
        } catch (_error) {
            toast.error('Failed to load position types');
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
    const onSubmit: SubmitHandler<MasterPositionTypeForm> = async (data: MasterPositionTypeForm) => {
        try {
            if (editingId) {
                positionTypeDB.update(editingId, data);
                toast.success('Position type updated successfully');
            } else {
                positionTypeDB.create(data as Omit<MasterPositionType, 'id' | 'createdAt'>);
                toast.success('Position type created successfully');
            }
            loadPositionTypes();
            handleFormClose();
        } catch (error: any) {
            toast.error(error.message || 'Operation failed');
        }
    };
    const handleEdit = (positionType: MasterPositionType) => {
        setEditingId(positionType.id);
        setValue('institution', positionType.institution);
        setValue('positionType', positionType.positionType);
        setValue('description', positionType.description);
        setValue('isActive', positionType.isActive);
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
            positionTypeDB.remove(id);
            toast.success('Position type deleted successfully');
            loadPositionTypes();
        } catch (_error: any) {
            toast.error('Failed to delete position type');
        }
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    {/* <div className='space-y-1'>
                        <Heading
                            title='Master Position Type Management'
                            description='Manage different types of positions and their descriptions'
                        />
                    </div> */}
                    <Button
                        type='button'
                        onClick={handleAddClick}
                        size='lg'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Master Position Type
                    </Button>
                </div>
                {/* Data Table Section - Collapsible but default open */}
                <CollapsibleSection
                    // title='Master Position Types Data'
                    // description='View, search, and manage all position type details in the system'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <PositionTypeTable positionTypes={positionTypes} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
                </CollapsibleSection>
                {/* Add Form Section - Conditionally Rendered */}
                {isFormOpen && (
                    <div ref={formRef} className='slide-in-from-top-4 animate-in duration-300'>
                        <CollapsibleSection
                            title={editingId ? 'Update Master Position Type' : 'Add New Master Position Type'}
                            description='Fill in the details below to create a new position type'
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
                                                label='Description'
                                                required
                                                id='description'
                                                {...register('description', { required: 'Description is required' })}
                                                error={errors.description?.message}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                        </div>
                                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                                            <InputText
                                                label='Position Type'
                                                required
                                                id='positionType'
                                                {...register('positionType', { required: 'Position Type is required' })}
                                                error={errors.positionType?.message}
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
                                                    {editingId ? 'Update Master Position Type' : 'Save Master Position Type'}
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
interface PositionTypeTableProps {
    positionTypes: MasterPositionType[];
    isLoading: boolean;
    onEdit: (positionType: MasterPositionType) => void;
    onDelete: (id: number) => void;
}
function PositionTypeTable({ positionTypes, isLoading, onEdit, onDelete }: PositionTypeTableProps) {
    const positionTypeColumns: ColumnDef<MasterPositionType>[] = [
        {
            id: 'serialNumber',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl No' />,
            cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
            enableSorting: false
        },
        {
            accessorKey: 'positionType',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Position Type' />,
            cell: ({ row }) => <div className='font-medium'>{row.getValue('positionType')}</div>
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
                const positionType = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                                <MoreHorizontal className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Button variant='ghost' size='sm' onClick={() => onEdit(positionType)} className='w-full justify-start'>
                                <Edit className='mr-2 h-4 w-4' />
                                Edit
                            </Button>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => onDelete(positionType.id)}
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
            columns={positionTypeColumns}
            data={positionTypes}
            totalItems={positionTypes.length}
            showViewOptions={true}
        />
    );
}

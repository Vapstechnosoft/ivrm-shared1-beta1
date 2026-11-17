// Refactored by automation script on 2025-10-28T15:40:35.887Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/location-form.tsx
// 3. Extract column definitions and form to the respective files
// 4. Update handlers to use the new structure
'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BaseEntity, createLocalCrud } from '@/lib/localdb';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
interface MasterLocation extends BaseEntity {
    institution: string;
    locationName: string;
    locationDesc: string;
    isActive: boolean;
}
type MasterLocationForm = {
    institution: string;
    locationName: string;
    locationDesc: string;
    isActive: boolean;
};
const institutions = ['VAPS School', 'VAPS College', 'VAPS University', 'VAPS Institute', 'VAPS Academy'];
export default function MasterLocationPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [locations, setLocations] = useState<MasterLocation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const formRef = useRef<HTMLDivElement>(null);
    const locationDB = createLocalCrud<MasterLocation>('master:location');
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<MasterLocationForm>({
        mode: 'onChange',
        defaultValues: {
            isActive: true
        }
    });
    const institution = watch('institution');
    // Load data on component mount
    useEffect(() => {
        loadLocations();
    }, []);
    const loadLocations = () => {
        try {
            setLocations(locationDB.list());
        } catch (_error) {
            toast.error('Failed to load locations');
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
    const onSubmit: SubmitHandler<MasterLocationForm> = async (data: MasterLocationForm) => {
        try {
            if (editingId) {
                locationDB.update(editingId, data);
                toast.success('Location updated successfully');
            } else {
                locationDB.create(data as Omit<MasterLocation, 'id' | 'createdAt'>);
                toast.success('Location created successfully');
            }
            loadLocations();
            handleFormClose();
        } catch (error: any) {
            toast.error(error.message || 'Operation failed');
        }
    };
    const handleEdit = (location: MasterLocation) => {
        setEditingId(location.id);
        setValue('institution', location.institution);
        setValue('locationName', location.locationName);
        setValue('locationDesc', location.locationDesc);
        setValue('isActive', location.isActive);
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
            locationDB.remove(id);
            toast.success('Location deleted successfully');
            loadLocations();
        } catch (_error: any) {
            toast.error('Failed to delete location');
        }
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    {/* <div className='space-y-1'>
                        <Heading title='Master Location Management' description='Manage location details for different institutions' />
                    </div> */}
                    <Button
                        type='button'
                        onClick={handleAddClick}
                        size='lg'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Master Location
                    </Button>
                </div>
                {/* Data Table Section - Collapsible but default open */}
                <CollapsibleSection
                    // title='Master Locations Data'
                    // description='View, search, and manage all location details in the system'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <LocationTable locations={locations} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
                </CollapsibleSection>
                {/* Add Form Section - Conditionally Rendered */}
                {isFormOpen && (
                    <div ref={formRef} className='slide-in-from-top-4 animate-in duration-300'>
                        <CollapsibleSection
                            title={editingId ? 'Update Master Location' : 'Add New Master Location'}
                            description='Fill in the details below to create a new location'
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
                                            <div className='flex flex-col gap-1.5'>
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
                                                label='Location Name'
                                                required
                                                id='locationName'
                                                {...register('locationName', { required: 'Location Name is required' })}
                                                error={errors.locationName?.message}
                                                className='mt-0 transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                        </div>
                                        <div className='grid grid-cols-1 items-start gap-4 lg:grid-cols-2'>
                                            <InputText
                                                label='Location Desc.'
                                                required
                                                id='locationDesc'
                                                {...register('locationDesc', { required: 'Location Description is required' })}
                                                error={errors.locationDesc?.message}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                            <div className='group flex flex-col gap-1.5'>
                                                <Label htmlFor='isActive' className='invisible'>
                                                    Location Desc. <span className='ml-1 text-red-500'>*</span>
                                                </Label>
                                                <div className='flex h-9 items-center'>
                                                    <input
                                                        type='checkbox'
                                                        id='isActive'
                                                        {...register('isActive')}
                                                        className='mr-2 h-4 w-4 border-border text-primary focus:ring-primary'
                                                    />
                                                    <label htmlFor='isActive' className='cursor-pointer font-medium text-sm'>
                                                        Active
                                                    </label>
                                                </div>
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
                                                    {editingId ? 'Update Master Location' : 'Save Master Location'}
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
interface LocationTableProps {
    locations: MasterLocation[];
    isLoading: boolean;
    onEdit: (location: MasterLocation) => void;
    onDelete: (id: number) => void;
}
function LocationTable({ locations, isLoading, onEdit, onDelete }: LocationTableProps) {
    const locationColumns: ColumnDef<MasterLocation>[] = [
        {
            id: 'serialNumber',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl No' />,
            cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
            enableSorting: false
        },
        {
            accessorKey: 'locationName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Location Name' />,
            cell: ({ row }) => <div className='font-medium'>{row.getValue('locationName')}</div>
        },
        {
            accessorKey: 'locationDesc',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Location Description' />,
            cell: ({ row }) => <div>{row.getValue('locationDesc')}</div>
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
                const location = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                                <MoreHorizontal className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Button variant='ghost' size='sm' onClick={() => onEdit(location)} className='w-full justify-start'>
                                <Edit className='mr-2 h-4 w-4' />
                                Edit
                            </Button>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => onDelete(location.id)}
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
            columns={locationColumns}
            data={locations}
            totalItems={locations.length}
            showViewOptions={true}
        />
    );
}

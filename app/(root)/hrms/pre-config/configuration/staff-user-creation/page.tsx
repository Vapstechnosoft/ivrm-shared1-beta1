// Refactored by automation script on 2025-10-28T15:40:35.858Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/staff-user-form.tsx
// 3. Extract column definitions and form to the respective files
// 4. Update handlers to use the new structure
'use client';
import { Heading } from '@/components/layout/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Plus, RefreshCw, Save, Trash2, UserPlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
interface StaffUser {
    id: number;
    roleType: string;
    institutionName: string;
    userName: string;
    modules: string[];
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
}
type StaffUserForm = {
    roleType: string;
    institutionName: string;
    userName: string;
    modules: string[];
};
export default function StaffUserCreationPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const formRef = useRef<HTMLDivElement>(null);
    // Mock data for dropdowns
    const roleTypes = ['COORDINATOR', 'ADMIN', 'TEACHER', 'STAFF', 'MANAGER'];
    const institutions = ['VAPS SCHOOL', 'VAPS COLLEGE', 'VAPS UNIVERSITY'];
    const modules = [
        'Preadmission',
        'Admission',
        'Fees',
        'Exam',
        'Library',
        'Birthday',
        'COE',
        'Front Office',
        'HRMS',
        'Inventory',
        'Leave Management',
        'Recruitment'
    ];
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<StaffUserForm>({
        mode: 'onChange',
        defaultValues: {
            modules: []
        }
    });
    const watchedModules = watch('modules');
    // Load mock data on component mount
    useEffect(() => {
        loadStaffUsers();
    }, []);
    const loadStaffUsers = async () => {
        try {
            setIsLoading(true);
            // Mock data
            const mockData: StaffUser[] = [
                {
                    id: 1,
                    roleType: 'COORDINATOR',
                    institutionName: 'VAPS SCHOOL',
                    userName: 'sachin',
                    modules: ['Preadmission', 'Admission', 'Fees'],
                    isActive: true,
                    createdAt: '2024-01-15',
                    lastLogin: '2024-10-14'
                },
                {
                    id: 2,
                    roleType: 'ADMIN',
                    institutionName: 'VAPS COLLEGE',
                    userName: 'admin_user',
                    modules: ['HRMS', 'Inventory', 'Leave Management'],
                    isActive: true,
                    createdAt: '2024-02-20',
                    lastLogin: '2024-10-13'
                },
                {
                    id: 3,
                    roleType: 'TEACHER',
                    institutionName: 'VAPS SCHOOL',
                    userName: 'teacher_01',
                    modules: ['Exam', 'Library'],
                    isActive: false,
                    createdAt: '2024-03-10',
                    lastLogin: '2024-09-15'
                }
            ];
            setStaffUsers(mockData);
            toast.success(`Loaded ${mockData.length} staff users`);
        } catch (_error) {
            toast.error('Failed to load staff users');
            setStaffUsers([]);
        } finally {
            setIsLoading(false);
        }
    };
    const handleAddClick = () => {
        setIsFormOpen(true);
        setEditingId(null);
        reset({
            modules: []
        });
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
        reset({
            modules: []
        });
    };
    const onSubmit: SubmitHandler<StaffUserForm> = async (data: StaffUserForm) => {
        try {
            if (!data.roleType || !data.institutionName || !data.userName || data.modules.length === 0) {
                toast.error('Please fill in all required fields');
                return;
            }
            const newStaffUser: StaffUser = {
                id: editingId || Date.now(),
                roleType: data.roleType,
                institutionName: data.institutionName,
                userName: data.userName,
                modules: data.modules,
                isActive: true,
                createdAt: new Date().toISOString().split('T')[0],
                lastLogin: undefined
            };
            if (editingId) {
                setStaffUsers((prev) => prev.map((user) => (user.id === editingId ? newStaffUser : user)));
                toast.success('Staff user updated successfully');
            } else {
                setStaffUsers((prev) => [...prev, newStaffUser]);
                toast.success('Staff user created successfully');
            }
            handleFormClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save staff user');
        }
    };
    const handleModuleChange = (module: string, checked: boolean) => {
        const currentModules = watchedModules || [];
        if (checked) {
            setValue('modules', [...currentModules, module]);
        } else {
            setValue(
                'modules',
                currentModules.filter((m) => m !== module)
            );
        }
    };
    const handleEdit = (user: StaffUser) => {
        setEditingId(user.id);
        setValue('roleType', user.roleType);
        setValue('institutionName', user.institutionName);
        setValue('userName', user.userName);
        setValue('modules', user.modules);
        setIsFormOpen(true);
        // Scroll to form after state update
        setTimeout(() => {
            formRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }, 100);
    };
    const handleDelete = async (id: number) => {
        try {
            setStaffUsers((prev) => prev.filter((user) => user.id !== id));
            toast.success('Staff user deleted successfully');
        } catch (_error) {
            toast.error('Failed to delete staff user');
        }
    };
    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        try {
            const newStatus = !currentStatus;
            setStaffUsers((prev) => prev.map((user) => (user.id === id ? { ...user, isActive: newStatus } : user)));
            toast.success(`Staff user ${newStatus ? 'activated' : 'deactivated'} successfully`);
        } catch (_error) {
            toast.error('Failed to toggle user status');
        }
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading
                            title='Staff User Creation Management'
                            description='Create and manage staff user accounts with role-based access'
                        />
                    </div>
                    <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                        <Button
                            type='button'
                            onClick={loadStaffUsers}
                            variant='outline'
                            size='lg'
                            className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                            <RefreshCw className='h-4 w-4' />
                            Reload
                        </Button>
                        <Button
                            type='button'
                            onClick={handleAddClick}
                            size='lg'
                            className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                            <Plus className='h-4 w-4' />
                            Add Staff User
                        </Button>
                    </div>
                </div>
                {/* Data Table Section - Always visible */}
                <CollapsibleSection
                    title='Staff Users Data'
                    description='View, search, and manage all staff user accounts in the system'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <StaffUserTable
                        staffUsers={staffUsers}
                        isLoading={isLoading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                    />
                </CollapsibleSection>
                {/* Add Form Section - Conditionally Rendered */}
                {isFormOpen && (
                    <div ref={formRef} className='slide-in-from-top-4 animate-in duration-300'>
                        <CollapsibleSection
                            title={editingId ? 'Update Staff User' : 'Add New Staff User'}
                            description='Create a new staff user account with role-based module access'
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
                                <StaffUserForm
                                    onSubmit={handleSubmit(onSubmit)}
                                    onCancel={handleFormClose}
                                    formData={watch()}
                                    setValue={setValue}
                                    register={register}
                                    watchedModules={watchedModules}
                                    handleModuleChange={handleModuleChange}
                                    errors={errors}
                                    isSubmitting={isSubmitting}
                                    editingId={editingId}
                                    roleTypes={roleTypes}
                                    institutions={institutions}
                                    modules={modules}
                                />
                            </div>
                        </CollapsibleSection>
                    </div>
                )}
            </div>
        </div>
    );
}
interface StaffUserFormProps {
    onSubmit: any;
    onCancel: () => void;
    formData: StaffUserForm;
    setValue: any;
    register: any;
    watchedModules: string[];
    handleModuleChange: (module: string, checked: boolean) => void;
    errors: any;
    isSubmitting: boolean;
    editingId: number | null;
    roleTypes: string[];
    institutions: string[];
    modules: string[];
}
interface StaffUserTableProps {
    staffUsers: StaffUser[];
    isLoading: boolean;
    onEdit: (user: StaffUser) => void;
    onDelete: (id: number) => void;
    onToggleActive: (id: number, currentStatus: boolean) => void;
}
function StaffUserForm({
    onSubmit,
    onCancel,
    formData,
    setValue,
    register,
    watchedModules,
    handleModuleChange,
    errors,
    isSubmitting,
    editingId,
    roleTypes,
    institutions,
    modules
}: StaffUserFormProps) {
    return (
        <form onSubmit={onSubmit} className='max-w-full space-y-6'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {/* Left Column */}
                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <span className='font-medium text-sm'>
                            Select Role Type :<span className='text-red-500'>*</span>
                        </span>
                        <Select onValueChange={(value) => setValue('roleType', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder='--SELECT ROLE--' />
                            </SelectTrigger>
                            <SelectContent>
                                {roleTypes.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='space-y-2'>
                        <span className='font-medium text-sm'>
                            Institution Name :<span className='text-red-500'>*</span>
                        </span>
                        <Select onValueChange={(value) => setValue('institutionName', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder='--SELECT INSTITUTION--' />
                            </SelectTrigger>
                            <SelectContent>
                                {institutions.map((institution) => (
                                    <SelectItem key={institution} value={institution}>
                                        {institution}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {/* Right Column */}
                <div className='space-y-4'>
                    <InputText
                        label='User Name :'
                        required
                        id='userName'
                        placeholder='Enter User Name'
                        {...register('userName', {
                            required: 'User name is required'
                        })}
                        error={errors.userName?.message}
                    />
                    {/* Role Type Display */}
                    {formData.roleType && (
                        <div className='rounded-md border border-blue-200 bg-blue-50 p-3'>
                            <p className='text-blue-800 text-sm'>
                                This User is Of RoleType: <span className='font-semibold underline'>{formData.roleType}</span>
                            </p>
                            <p className='mt-1 cursor-pointer text-red-600 text-sm underline'>Change Username!!</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Module Selection */}
            <div className='space-y-2'>
                <span className='font-medium text-sm'>
                    Module Name :<span className='text-red-500'>*</span>
                </span>
                <div className='max-h-40 space-y-2 overflow-y-auto rounded-md border bg-gray-50 p-3'>
                    {modules.map((module) => (
                        <div key={module} className='flex items-center space-x-2'>
                            <Checkbox
                                id={module}
                                checked={watchedModules?.includes(module) || false}
                                onCheckedChange={(checked) => handleModuleChange(module, checked as boolean)}
                            />
                            <label htmlFor={module} className='cursor-pointer text-sm'>
                                {module}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            {/* Action Buttons */}
            <div className='flex gap-3 border-t pt-4'>
                <Button type='submit' disabled={isSubmitting} className='bg-blue-600 hover:bg-blue-700'>
                    {isSubmitting ? (
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4 animate-spin' />
                            Saving...
                        </div>
                    ) : (
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            {editingId ? 'Update Staff User' : 'Save Staff User'}
                        </div>
                    )}
                </Button>
                <Button
                    type='button'
                    variant='outline'
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className='w-fit transition-all duration-200 hover:scale-105'>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
function StaffUserTable({ staffUsers, isLoading, onEdit, onDelete, onToggleActive }: StaffUserTableProps) {
    const staffUserColumns: ColumnDef<StaffUser>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label='Select all'
                />
            ),
            cell: ({ row }) => (
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 24
        },
        {
            accessorKey: 'id',
            header: ({ column }) => <DataTableColumnHeader column={column} title='SL.NO.' />,
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
            accessorKey: 'userName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='User Name' />,
            cell: ({ row }) => <div className='font-medium'>{row.getValue('userName')}</div>,
            enableSorting: true
        },
        {
            accessorKey: 'roleType',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Role Type' />,
            cell: ({ row }) => (
                <Badge variant='secondary' className='capitalize'>
                    {row.getValue('roleType')}
                </Badge>
            ),
            enableSorting: true
        },
        {
            accessorKey: 'institutionName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Institution' />,
            cell: ({ row }) => <div>{row.getValue('institutionName')}</div>,
            enableSorting: true
        },
        {
            accessorKey: 'modules',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Modules' />,
            cell: ({ row }) => {
                const modules = row.getValue('modules') as string[];
                return (
                    <div className='max-w-32'>
                        <div className='flex flex-wrap gap-1'>
                            {modules.slice(0, 2).map((module) => (
                                <Badge key={module} variant='outline' className='text-xs'>
                                    {module}
                                </Badge>
                            ))}
                            {modules.length > 2 && (
                                <Badge variant='outline' className='text-xs'>
                                    +{modules.length - 2} more
                                </Badge>
                            )}
                        </div>
                    </div>
                );
            },
            enableSorting: false
        },
        {
            accessorKey: 'isActive',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
            cell: ({ row }) => (
                <Badge variant={row.getValue('isActive') ? 'success' : 'destructive'}>
                    {row.getValue('isActive') ? 'Active' : 'Inactive'}
                </Badge>
            ),
            enableSorting: true
        },
        {
            accessorKey: 'lastLogin',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Last Login' />,
            cell: ({ row }) => {
                const lastLogin = row.getValue('lastLogin') as string;
                return <div>{lastLogin || 'Never'}</div>;
            },
            enableSorting: true
        },
        {
            id: 'actions',
            header: 'Actions',
            accessorFn: (row: any) => {
                return row;
            },
            enableSorting: false,
            cell: ({ cell }: { cell: any }) => {
                const user = cell.getValue() as StaffUser;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                                <MoreHorizontal className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <div className='flex-justify-between flex-wrap gap-2'>
                                <Button variant='ghost' onClick={() => onEdit(user)} className='w-full justify-start'>
                                    <Edit className='mr-2 h-4 w-4' />
                                    Edit
                                </Button>
                                <Button
                                    variant='ghost'
                                    onClick={() => onToggleActive(user.id, user.isActive)}
                                    className={`w-full justify-start ${user.isActive ? 'text-orange-600' : 'text-green-600'}`}>
                                    <UserPlus className='mr-2 h-4 w-4' />
                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                                <Button variant='ghost' onClick={() => onDelete(user.id)} className='w-full justify-start text-destructive'>
                                    <Trash2 className='mr-2 h-4 w-4' />
                                    Delete
                                </Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];
    return (
        <div className='overflow-hidden rounded-lg bg-card'>
            <GenericDataTable
                isLoading={isLoading}
                columns={staffUserColumns}
                data={staffUsers}
                totalItems={staffUsers.length}
                showViewOptions={true}
                columnPinning={{ right: ['actions'] }}
            />
        </div>
    );
}

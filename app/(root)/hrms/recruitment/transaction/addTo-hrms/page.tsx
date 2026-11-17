// Refactored by automation script on 2025-10-28T15:40:35.936Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/add-to-hrms-form.tsx
// 3. Extract column definitions and form to the respective files
// 4. Update handlers to use the new structure
'use client';
import { Heading } from '@/components/layout/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BaseEntity, createLocalCrud } from '@/lib/localdb';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
interface HRMSEmployee extends BaseEntity {
    candidateName: string;
    candidateId: number;
    companyName: string;
    employeeType: string;
    religion: string;
    caste: string;
    maritalStatus: string;
    employeeDepartment: string;
    employeeDesignation: string;
    employeeGrade: string;
    groupType: string;
    employeeCode: string;
    hidCardNo: string;
    status: 'Active' | 'Inactive' | 'Pending';
    addedDate: string;
    updatedDate?: string;
}
interface Candidate extends BaseEntity {
    firstName: string;
    middleName?: string;
    lastName: string;
    emailId: string;
    mobileNo: string;
    jobTitle: string;
    religion: string;
    caste: string;
    maritalStatus: string;
    status: string;
}
interface Company extends BaseEntity {
    companyName: string;
    companyCode: string;
}
interface Department extends BaseEntity {
    departmentName: string;
    departmentCode: string;
}
interface Designation extends BaseEntity {
    designationName: string;
    designationCode: string;
}
interface EmployeeGrade extends BaseEntity {
    gradeName: string;
    gradeCode: string;
}
interface GroupType extends BaseEntity {
    groupTypeName: string;
    groupTypeCode: string;
}
type HRMSForm = {
    candidateId: string;
    companyName: string;
    employeeType: string;
    religion: string;
    caste: string;
    maritalStatus: string;
    employeeDepartment: string;
    employeeDesignation: string;
    employeeGrade: string;
    groupType: string;
    employeeCode: string;
    hidCardNo: string;
};
export default function AddToHRMSPage() {
    const [hrmsEmployees, setHRMSEmployees] = useState<HRMSEmployee[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [designations, setDesignations] = useState<Designation[]>([]);
    const [employeeGrades, setEmployeeGrades] = useState<EmployeeGrade[]>([]);
    const [groupTypes, setGroupTypes] = useState<GroupType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<HRMSEmployee | null>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const hrmsDB = createLocalCrud<HRMSEmployee>('recruitment:hrms-employee');
    const candidateDB = createLocalCrud<Candidate>('recruitment:candidate');
    const companyDB = createLocalCrud<Company>('hrms:company');
    const departmentDB = createLocalCrud<Department>('hrms:department');
    const designationDB = createLocalCrud<Designation>('hrms:designation');
    const employeeGradeDB = createLocalCrud<EmployeeGrade>('hrms:employee-grade');
    const groupTypeDB = createLocalCrud<GroupType>('hrms:group-type');
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<HRMSForm>({
        mode: 'onChange'
    });
    // Load data on component mount
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            setHRMSEmployees(hrmsDB.list());
            setCandidates(candidateDB.list());
            // Create sample data if none exists
            initializeSampleData();
            setCompanies(companyDB.list());
            setDepartments(departmentDB.list());
            setDesignations(designationDB.list());
            setEmployeeGrades(employeeGradeDB.list());
            setGroupTypes(groupTypeDB.list());
        } catch (_error) {
            toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };
    const initializeSampleData = () => {
        // Initialize Companies
        if (companyDB.list().length === 0) {
            const sampleCompanies: Omit<Company, 'id' | 'createdAt'>[] = [
                { companyName: 'Tech Solutions Ltd', companyCode: 'TSL001' },
                { companyName: 'Innovation Corp', companyCode: 'IC002' },
                { companyName: 'Digital Systems', companyCode: 'DS003' }
            ];
            sampleCompanies.forEach((company) => companyDB.create(company));
        }
        // Initialize Departments
        if (departmentDB.list().length === 0) {
            const sampleDepartments: Omit<Department, 'id' | 'createdAt'>[] = [
                { departmentName: 'Information Technology', departmentCode: 'IT' },
                { departmentName: 'Human Resources', departmentCode: 'HR' },
                { departmentName: 'Finance', departmentCode: 'FIN' },
                { departmentName: 'Operations', departmentCode: 'OPS' },
                { departmentName: 'Marketing', departmentCode: 'MKT' }
            ];
            sampleDepartments.forEach((dept) => departmentDB.create(dept));
        }
        // Initialize Designations
        if (designationDB.list().length === 0) {
            const sampleDesignations: Omit<Designation, 'id' | 'createdAt'>[] = [
                { designationName: 'Software Engineer', designationCode: 'SE' },
                { designationName: 'Senior Software Engineer', designationCode: 'SSE' },
                { designationName: 'Team Lead', designationCode: 'TL' },
                { designationName: 'Project Manager', designationCode: 'PM' },
                { designationName: 'HR Executive', designationCode: 'HRE' },
                { designationName: 'Manager', designationCode: 'MGR' }
            ];
            sampleDesignations.forEach((desig) => designationDB.create(desig));
        }
        // Initialize Employee Grades
        if (employeeGradeDB.list().length === 0) {
            const sampleGrades: Omit<EmployeeGrade, 'id' | 'createdAt'>[] = [
                { gradeName: 'Grade A', gradeCode: 'GA' },
                { gradeName: 'Grade B', gradeCode: 'GB' },
                { gradeName: 'Grade C', gradeCode: 'GC' },
                { gradeName: 'Grade D', gradeCode: 'GD' }
            ];
            sampleGrades.forEach((grade) => employeeGradeDB.create(grade));
        }
        // Initialize Group Types
        if (groupTypeDB.list().length === 0) {
            const sampleGroupTypes: Omit<GroupType, 'id' | 'createdAt'>[] = [
                { groupTypeName: 'Technical', groupTypeCode: 'TECH' },
                { groupTypeName: 'Administrative', groupTypeCode: 'ADMIN' },
                { groupTypeName: 'Management', groupTypeCode: 'MGMT' },
                { groupTypeName: 'Support', groupTypeCode: 'SUPP' }
            ];
            sampleGroupTypes.forEach((group) => groupTypeDB.create(group));
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
        setEditingEmployee(null);
        reset();
    };
    const onSubmit: SubmitHandler<HRMSForm> = async (data: HRMSForm) => {
        try {
            const candidate = candidates.find((c) => c.id.toString() === data.candidateId);
            if (!candidate) {
                toast.error('Please select a valid candidate');
                return;
            }
            const hrmsEmployeeData: Omit<HRMSEmployee, 'id' | 'createdAt'> = {
                candidateName: `${candidate.firstName} ${candidate.middleName || ''} ${candidate.lastName}`.trim(),
                candidateId: candidate.id,
                companyName: data.companyName,
                employeeType: data.employeeType,
                religion: data.religion,
                caste: data.caste,
                maritalStatus: data.maritalStatus,
                employeeDepartment: data.employeeDepartment,
                employeeDesignation: data.employeeDesignation,
                employeeGrade: data.employeeGrade,
                groupType: data.groupType,
                employeeCode: data.employeeCode,
                hidCardNo: data.hidCardNo,
                status: 'Active',
                addedDate: new Date().toISOString(),
                updatedDate: editingEmployee ? new Date().toISOString() : undefined
            };
            if (editingEmployee) {
                hrmsDB.update(editingEmployee.id, hrmsEmployeeData);
                toast.success('HRMS employee updated successfully');
            } else {
                hrmsDB.create(hrmsEmployeeData);
                toast.success('Employee added to HRMS successfully');
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
    const handleEdit = (employee: HRMSEmployee) => {
        setEditingEmployee(employee);
        reset({
            candidateId: employee.candidateId.toString(),
            companyName: employee.companyName,
            employeeType: employee.employeeType,
            religion: employee.religion,
            caste: employee.caste,
            maritalStatus: employee.maritalStatus,
            employeeDepartment: employee.employeeDepartment,
            employeeDesignation: employee.employeeDesignation,
            employeeGrade: employee.employeeGrade,
            groupType: employee.groupType,
            employeeCode: employee.employeeCode,
            hidCardNo: employee.hidCardNo
        });
        setIsFormOpen(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };
    const handleDelete = async (employee: HRMSEmployee) => {
        try {
            hrmsDB.remove(employee.id);
            toast.success('HRMS employee deleted successfully');
            loadData();
        } catch (_error) {
            toast.error('Failed to delete employee');
        }
    };
    const getCandidateName = (candidateId: number) => {
        const candidate = candidates.find((c) => c.id === candidateId);
        return candidate ? `${candidate.firstName} ${candidate.middleName || ''} ${candidate.lastName}`.trim() : 'Unknown';
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading title='Add To HRMS' description='Convert recruited candidates to HRMS employees' />
                    </div>
                    <Button
                        type='button'
                        onClick={handleAddClick}
                        size='lg'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add To HRMS
                    </Button>
                </div>
                {/* Data Table Section - Collapsible but default open */}
                <CollapsibleSection
                    title='HRMS Employees Data'
                    description='View, search, and manage all HRMS employees converted from candidates'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <HRMSEmployeeTable
                        employees={hrmsEmployees}
                        isLoading={isLoading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        getCandidateName={getCandidateName}
                    />
                </CollapsibleSection>
                {/* Add Form Section - Conditionally Rendered */}
                {isFormOpen && (
                    <div ref={formRef}>
                        <CollapsibleSection
                            title={editingEmployee ? 'Edit HRMS Employee' : 'Add To HRMS'}
                            description={editingEmployee ? 'Update HRMS employee information' : 'Convert candidate to HRMS employee'}
                            defaultOpen={true}
                            variant='default'
                            size='lg'
                            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                    {/* Candidate Name */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Candidate Name <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(value) => setValue('candidateId', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select or Search Candidate' />
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
                                        {errors.candidateId && <FormError>Candidate selection is required</FormError>}
                                    </div>
                                    {/* Employee Department */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Employee Department <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(value) => setValue('employeeDepartment', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.departmentName}>
                                                        {dept.departmentName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.employeeDepartment && <FormError>Department is required</FormError>}
                                    </div>
                                    {/* Company Name */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Company Name <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(value) => setValue('companyName', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companies.map((company) => (
                                                    <SelectItem key={company.id} value={company.companyName}>
                                                        {company.companyName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.companyName && <FormError>Company is required</FormError>}
                                    </div>
                                    {/* Employee Designation */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Employee Designation <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(value) => setValue('employeeDesignation', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {designations.map((desig) => (
                                                    <SelectItem key={desig.id} value={desig.designationName}>
                                                        {desig.designationName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.employeeDesignation && <FormError>Designation is required</FormError>}
                                    </div>
                                    {/* Employee Type */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Employee Type <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(value) => setValue('employeeType', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Permanent'>Permanent</SelectItem>
                                                <SelectItem value='Contract'>Contract</SelectItem>
                                                <SelectItem value='Temporary'>Temporary</SelectItem>
                                                <SelectItem value='Intern'>Intern</SelectItem>
                                                <SelectItem value='Consultant'>Consultant</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.employeeType && <FormError>Employee type is required</FormError>}
                                    </div>
                                    {/* Employee Grade */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Employee Grade <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(value) => setValue('employeeGrade', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employeeGrades.map((grade) => (
                                                    <SelectItem key={grade.id} value={grade.gradeName}>
                                                        {grade.gradeName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.employeeGrade && <FormError>Employee grade is required</FormError>}
                                    </div>
                                    {/* Religion */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Religion <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(value) => setValue('religion', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Hindu'>Hindu</SelectItem>
                                                <SelectItem value='Muslim'>Muslim</SelectItem>
                                                <SelectItem value='Christian'>Christian</SelectItem>
                                                <SelectItem value='Sikh'>Sikh</SelectItem>
                                                <SelectItem value='Buddhist'>Buddhist</SelectItem>
                                                <SelectItem value='Other'>Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.religion && <FormError>Religion is required</FormError>}
                                    </div>
                                    {/* Group Type */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Group Type <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(value) => setValue('groupType', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {groupTypes.map((group) => (
                                                    <SelectItem key={group.id} value={group.groupTypeName}>
                                                        {group.groupTypeName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.groupType && <FormError>Group type is required</FormError>}
                                    </div>
                                    {/* Caste */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Caste <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(value) => setValue('caste', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='General'>General</SelectItem>
                                                <SelectItem value='OBC'>OBC</SelectItem>
                                                <SelectItem value='SC'>SC</SelectItem>
                                                <SelectItem value='ST'>ST</SelectItem>
                                                <SelectItem value='Other'>Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.caste && <FormError>Caste is required</FormError>}
                                    </div>
                                    {/* Employee Code */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Employee Code <span className='text-red-500'>*</span>
                                        </span>
                                        <InputText
                                            placeholder='Enter employee code'
                                            {...register('employeeCode', { required: 'Employee code is required' })}
                                            error={errors.employeeCode?.message}
                                        />
                                    </div>
                                    {/* Marital Status */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            Marital Status <span className='text-red-500'>*</span>
                                        </span>
                                        <Select onValueChange={(value) => setValue('maritalStatus', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='--Select--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Single'>Single</SelectItem>
                                                <SelectItem value='Married'>Married</SelectItem>
                                                <SelectItem value='Divorced'>Divorced</SelectItem>
                                                <SelectItem value='Widowed'>Widowed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.maritalStatus && <FormError>Marital status is required</FormError>}
                                    </div>
                                    {/* HID Card No */}
                                    <div className='space-y-2'>
                                        <span className='font-medium text-gray-700 text-sm'>
                                            HID Card No. <span className='text-red-500'>*</span>
                                        </span>
                                        <InputText
                                            placeholder='Enter HID card number'
                                            {...register('hidCardNo', { required: 'HID card number is required' })}
                                            error={errors.hidCardNo?.message}
                                        />
                                    </div>
                                </div>
                                {/* Form Actions */}
                                <div className='flex justify-center gap-4 border-t pt-6'>
                                    <Button type='button' variant='outline' onClick={handleClear}>
                                        <X className='mr-2 h-4 w-4' />
                                        Clear
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
                                                {editingEmployee ? 'Update Employee' : 'Add To HRMS'}
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
interface HRMSEmployeeTableProps {
    employees: HRMSEmployee[];
    isLoading: boolean;
    onEdit: (employee: HRMSEmployee) => void;
    onDelete: (employee: HRMSEmployee) => void;
    getCandidateName: (candidateId: number) => string;
}
function HRMSEmployeeTable({ employees, isLoading, onEdit, onDelete, getCandidateName: _getCandidateName }: HRMSEmployeeTableProps) {
    const employeeColumns: ColumnDef<HRMSEmployee>[] = [
        {
            id: 'serialNumber',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' />,
            cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>,
            enableSorting: false
        },
        {
            accessorKey: 'candidateName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Name' />,
            cell: ({ row }) => <div className='font-medium'>{row.getValue('candidateName')}</div>
        },
        {
            accessorKey: 'employeeCode',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Code' />,
            cell: ({ row }) => <div>{row.getValue('employeeCode')}</div>
        },
        {
            accessorKey: 'companyName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Company' />,
            cell: ({ row }) => <div>{row.getValue('companyName')}</div>
        },
        {
            accessorKey: 'employeeDepartment',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Department' />,
            cell: ({ row }) => <div>{row.getValue('employeeDepartment')}</div>
        },
        {
            accessorKey: 'employeeDesignation',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Designation' />,
            cell: ({ row }) => <div>{row.getValue('employeeDesignation')}</div>
        },
        {
            accessorKey: 'employeeType',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Employee Type' />,
            cell: ({ row }) => <div>{row.getValue('employeeType')}</div>
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                const statusColors = {
                    Active: 'bg-green-100 text-green-800',
                    Inactive: 'bg-red-100 text-red-800',
                    Pending: 'bg-yellow-100 text-yellow-800'
                };
                return <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
            }
        },
        {
            accessorKey: 'addedDate',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Added Date' />,
            cell: ({ row }) => <div>{new Date(row.getValue('addedDate')).toLocaleDateString()}</div>
        },
        {
            id: 'actions',
            header: 'Action',
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <div className='flex items-center gap-2'>
                        <Button variant='ghost' size='sm' onClick={() => onEdit(employee)} className='text-blue-600 hover:text-blue-800'>
                            <Edit className='h-4 w-4' />
                        </Button>
                        <Button variant='ghost' size='sm' onClick={() => onDelete(employee)} className='text-red-600 hover:text-red-800'>
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
            columns={employeeColumns}
            data={employees}
            totalItems={employees.length}
            showViewOptions={true}
        />
    );
}

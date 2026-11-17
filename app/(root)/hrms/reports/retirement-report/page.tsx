'use client';
import { Button } from '@/components/ui/button';
import { CalendarYear } from '@/components/ui/calendar_year';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterDepartments, useMasterDesignations, useMasterEmployeeTypes, useMasterGroupTypes } from '@/hooks/hrms/useReports';
import { cn } from '@/lib/utils';
import { EmployeeDetailSchema } from '@/schemas/hrms/employee-category-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof EmployeeDetailSchema>;
const mockletter = [
    { key: '1', value: 'Date of Birth' },
    { key: '2', value: 'Date of Joining' },
    { key: '3', value: 'Date of Leaving' }
];
const formated = [
    { key: 'format1', value: 'Format 1' },
    { key: 'format2', value: 'Format 2' }
];
const status = [
    { key: 'all', value: 'All' },
    { key: 'individual', value: 'Individual' }
];
const typeOrEmployee = [
    { key: 'type', value: 'Type' },
    { key: 'employee', value: 'Employee' }
];
const mockEmployees = [
    { key: '1208', value: 'ANUSHA T' },
    { key: 'EMP002', value: 'KIRAN KUMAR' },
    { key: 'EMP003', value: 'PALLAVI C' },
    { key: 'EMP004', value: 'RAFIQ' },
    { key: 'EMP005', value: 'NATARAJA' }
];
const availableHeaders = [
    'Employee Code',
    'Employee Name',
    'Father Name,	Mobile No.',
    'Email Id',
    'Date Of Birth',
    'Employee Type',
    'Group Type',
    'Department',
    'Designation	Grade',
    'Biometric',
    'Code',
    'Photo',
    'Date Of Join',
    'Date Of Left',
    'Date Of Confirmation',
    'Expected Retirement Date',
    'Blood Group',
    'PAN Card No.',
    'Aadhar Card No'
];
const mockApiResponse = {
    employeeSalaryslipDetails: [
        {
            hrmD_Id: 80,
            hrmD_code: 'EMP001',
            hrmD_Name: 'John Doe',
            hrmD_FatherName: 'Father Name 1',
            hrmD_MobileNo: '9876543210',
            hrmD_EmailId: 'john@example.com',
            hrmD_DateOfBirth: '1990-01-01',
            hrmD_EmergencyContact: '9876543211',
            hrmD_DateOfConfirmation: '2023-01-01',
            hrmD_EmployeeType: 'Permanent',
            hrmD_GroupType: 'Teaching Staff',
            hrmD_DepartmentName: 'Teaching',
            hrmD_Designation: 'Senior Teacher',
            hrmD_Status: 'Active',
            hrmD_DateOfJoining: '2022-01-01',
            hrmD_DateOfLeaving: '',
            hrmD_ReasonForLeaving: '',
            hrmD_Remarks: 'Good performance',
            hrmD_Address: '123 Main St',
            hrmD_Qualification: 'M.Ed',
            hrmD_Experience: '5 years',
            hrmD_WorkingDays: 22,
            hrmD_Lop: 0
        },
        {
            hrmD_Id: 84,
            hrmD_code: 'EMP002',
            hrmD_Name: 'John Smith',
            hrmD_FatherName: 'Father Name 2',
            hrmD_MobileNo: '9876543220',
            hrmD_EmailId: 'smith@example.com',
            hrmD_DateOfBirth: '1985-05-15',
            hrmD_EmergencyContact: '9876543221',
            hrmD_DateOfConfirmation: '2023-06-01',
            hrmD_EmployeeType: 'Contract',
            hrmD_GroupType: 'Non Teaching Staff',
            hrmD_DepartmentName: 'Non Teaching',
            hrmD_Designation: 'Admin',
            hrmD_Status: 'Active',
            hrmD_DateOfJoining: '2023-01-01',
            hrmD_DateOfLeaving: '',
            hrmD_ReasonForLeaving: '',
            hrmD_Remarks: '',
            hrmD_Address: '456 Oak Ave',
            hrmD_Qualification: 'B.Com',
            hrmD_Experience: '3 years',
            hrmD_WorkingDays: 31,
            hrmD_Lop: 5
        },
        {
            hrmD_Id: 84,
            hrmD_code: 'EMP002',
            hrmD_Name: 'John Smith',
            hrmD_FatherName: 'Father Name 2',
            hrmD_MobileNo: '9876543220',
            hrmD_EmailId: 'smith@example.com',
            hrmD_DateOfBirth: '1985-05-15',
            hrmD_EmergencyContact: '9876543221',
            hrmD_DateOfConfirmation: '2023-06-01',
            hrmD_EmployeeType: 'Contract',
            hrmD_GroupType: 'Non Teaching Staff',
            hrmD_DepartmentName: 'Non Teaching',
            hrmD_Designation: 'Admin',
            hrmD_Status: 'Active',
            hrmD_DateOfJoining: '2023-01-01',
            hrmD_DateOfLeaving: '',
            hrmD_ReasonForLeaving: '',
            hrmD_Remarks: '',
            hrmD_Address: '456 Oak Ave',
            hrmD_Qualification: 'B.Com',
            hrmD_Experience: '3 years',
            hrmD_WorkingDays: 31,
            hrmD_Lop: 5
        },
        {
            hrmD_Id: 84,
            hrmD_code: 'EMP002',
            hrmD_Name: 'John Smith',
            hrmD_FatherName: 'Father Name 2',
            hrmD_MobileNo: '9876543220',
            hrmD_EmailId: 'smith@example.com',
            hrmD_DateOfBirth: '1985-05-15',
            hrmD_EmergencyContact: '9876543221',
            hrmD_DateOfConfirmation: '2023-06-01',
            hrmD_EmployeeType: 'Contract',
            hrmD_GroupType: 'Non Teaching Staff',
            hrmD_DepartmentName: 'Non Teaching',
            hrmD_Designation: 'Admin',
            hrmD_Status: 'Active',
            hrmD_DateOfJoining: '2023-01-01',
            hrmD_DateOfLeaving: '',
            hrmD_ReasonForLeaving: '',
            hrmD_Remarks: '',
            hrmD_Address: '456 Oak Ave',
            hrmD_Qualification: 'B.Com',
            hrmD_Experience: '3 years',
            hrmD_WorkingDays: 31,
            hrmD_Lop: 5
        }
    ]
};

export default function DepartmentSalaryReportPage() {
    const [isSearching, setIsSearching] = useState(false);
    const [reportData, setReportData] = useState<any[]>([]);
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [selectedRangeTypes, setSelectedRangeTypes] = useState<string[]>([]);

    const { data: masterGroupTypes, isLoading: masterGroupTypesLoading, isError: masterGroupTypesError } = useMasterGroupTypes();

    const { data: masterDepartments, isLoading: masterDepartmentsLoading, isError: masterDepartmentsError } = useMasterDepartments();

    const { data: masterDesignations, isLoading: masterDesignationsLoading, isError: masterDesignationsError } = useMasterDesignations();
    const { data: masterEmployeeTypes, isLoading: masterEmployeeTypeLoading, isError: masterEmployeeTypeError } = useMasterEmployeeTypes();

    const groupTypeOptions =
        masterGroupTypes?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];

    const DeaparmentsOptions =
        masterDepartments?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];
    const employeeTypeOptions =
        masterEmployeeTypes?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];

    const DesignationOptions =
        masterDesignations?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];

    const MockLetterOptions =
        mockletter?.map((emp) => ({
            value: emp.key,
            label: emp.value
        })) || [];

    const formatedOptions =
        formated?.map((emp) => ({
            value: emp.key,
            label: emp.value
        })) || [];
    const statusOptions =
        status?.map((emp) => ({
            value: emp.key,
            label: emp.value
        })) || [];
    const typeOrEmployeeOptions =
        typeOrEmployee?.map((emp) => ({
            value: emp.key,
            label: emp.value
        })) || [];
    const EmployeeOptions = mockEmployees.map((emp) => ({
        value: emp.key,
        label: emp.value
    }));

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(EmployeeDetailSchema),
        defaultValues: {
            groupType: [],
            department: [],
            designation: [],
            fromdate: '',
            status: 'all',
            mockLetter: '1',
            todate: '',
            formated: 'format1',
            typeOrEmployee: 'type',
            type: '',
            employee: '',
            selectedHeaders: []
        },
        mode: 'onChange'
    });

    const selectedFormat = watch('formated') as string;
    const selectedstatus = watch('status') as string;
    const selectedtypeOrEmployee = watch('typeOrEmployee') as string;
    const selectedHeaders = (watch('selectedHeaders') as string[]) || [];

    // Mapping of header names to data field keys
    const headerFieldMap: { [key: string]: string } = {
        'Employee Code': 'hrmD_code',
        'Employee Name': 'hrmD_Name',
        'Father Name': 'hrmD_FatherName',
        'Mobile No.': 'hrmD_MobileNo',
        'Email Id': 'hrmD_EmailId',
        'Date Of Birth': 'hrmD_DateOfBirth',
        'Emergency Contact Number': 'hrmD_EmergencyContact',
        'Date Of confirmation': 'hrmD_DateOfConfirmation',
        'Employee Type': 'hrmD_EmployeeType',
        'Group Type': 'hrmD_GroupType',
        Department: 'hrmD_DepartmentName',
        Designation: 'hrmD_Designation',
        Status: 'hrmD_Status',
        'Date Of Joining': 'hrmD_DateOfJoining',
        'Date Of Leaving': 'hrmD_DateOfLeaving',
        'Reason For Leaving': 'hrmD_ReasonForLeaving',
        Remarks: 'hrmD_Remarks',
        Address: 'hrmD_Address',
        Qualification: 'hrmD_Qualification',
        Experience: 'hrmD_Experience'
    };

    const onSearch = async () => {
        setIsSearching(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success('Report generated successfully!');
            setReportData(mockApiResponse.employeeSalaryslipDetails);
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate report');
        } finally {
            setIsSearching(false);
        }
    };

    const handleReset = () => {
        reset({
            groupType: [],
            department: [],
            designation: [],
            fromdate: '',
            todate: '',
            formated: '',
            typeOrEmployee: 'type'
        });
        setReportData([]);
        toast.info('Form has been reset');
    };

    return (
        <div className='min-h-screen p-8'>
            <div className='container space-y-4 p-1'>
                <CollapsibleSection
                    title='Employee Details'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                    <div className=''>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            {/* Header Selection */}
                            <div className='space-y-3'>
                                <Label className='font-semibold'>
                                    Header: <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    name='selectedHeaders'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={availableHeaders.map((header) => ({
                                                label: header,
                                                value: header
                                            }))}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            placeholder='Select headers to include in report'
                                            className='w-full'
                                            maxHeight={240}
                                        />
                                    )}
                                />
                            </div>
                            <div className='space-y-3'>
                                <div className='flex justify-center'>
                                    <div className='space-y-3'>
                                        <div className=''>
                                            <Controller
                                                name='formated'
                                                control={control}
                                                render={({ field }) => (
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value as string}
                                                        className='flex justify-center gap-4 rounded-md p-3 shadow-md '>
                                                        {formatedOptions.map((option) => (
                                                            <div
                                                                key={option.value}
                                                                className='flex cursor-pointer items-center space-x-3 transition-colors hover:bg-accent/50'>
                                                                <RadioGroupItem value={option.value} id={`format-${option.value}`} />
                                                                <Label
                                                                    htmlFor={`format-${option.value}`}
                                                                    className='flex-1 cursor-pointer font-normal text-sm'>
                                                                    {option.label}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                )}
                                            />
                                        </div>
                                        {selectedFormat !== 'format2' && (
                                            <div className=''>
                                                <Controller
                                                    name='mockLetter'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                            className='flex justify-center gap-4 rounded-md p-3 shadow-md '>
                                                            {MockLetterOptions.map((option) => (
                                                                <div
                                                                    key={option.value}
                                                                    className='flex cursor-pointer items-center space-x-3 transition-colors hover:bg-accent/50'>
                                                                    <RadioGroupItem value={option.value} id={`letter-${option.value}`} />
                                                                    <Label
                                                                        htmlFor={`letter-${option.value}`}
                                                                        className='flex-1 cursor-pointer font-normal text-sm'>
                                                                        {option.label}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </RadioGroup>
                                                    )}
                                                />
                                            </div>
                                        )}
                                        {selectedFormat !== 'format2' && (
                                            <div className='flex justify-center gap-2 '>
                                                <div>
                                                    <Label className='font-medium text-sm text-white-900'>
                                                        From Date<span className='text-red-600'>*</span>
                                                    </Label>

                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                type='button'
                                                                variant='outline'
                                                                className={cn(
                                                                    'w-full justify-start text-left font-normal',
                                                                    !fromDate && 'text-muted-foreground'
                                                                )}>
                                                                <CalendarIcon className='mr-2 h-4 w-4' />
                                                                {fromDate ? format(new Date(fromDate), 'dd/MM/yyyy') : 'From date'}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className='w-auto p-0' align='start'>
                                                            <CalendarYear
                                                                mode='single'
                                                                selected={fromDate ? new Date(fromDate) : undefined}
                                                                onSelect={(date: Date | undefined) =>
                                                                    setFromDate(date?.toISOString() ?? '')
                                                                }
                                                                captionLayout='dropdown'
                                                                fromYear={2000}
                                                                toYear={2050}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                <div>
                                                    <Label className='font-medium text-sm text-white-900'>
                                                        To Date<span className='text-red-600'>*</span>
                                                    </Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                type='button'
                                                                variant='outline'
                                                                className={cn(
                                                                    'w-full justify-start text-left font-normal',
                                                                    !toDate && 'text-muted-foreground'
                                                                )}>
                                                                <CalendarIcon className='mr-2 h-4 w-4' />
                                                                {toDate ? format(new Date(toDate), 'dd/MM/yyyy') : 'To date'}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className='w-auto p-0' align='start'>
                                                            <CalendarYear
                                                                mode='single'
                                                                selected={toDate ? new Date(toDate) : undefined}
                                                                onSelect={(date: Date | undefined) => setToDate(date?.toISOString() ?? '')}
                                                                captionLayout='dropdown'
                                                                fromYear={2000}
                                                                toYear={2050}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>
                                        )}
                                        <div className='mt-2 flex items-center justify-center gap-6 rounded-md p-2 shadow-md'>
                                            <div className='flex items-center space-x-2'>
                                                <Checkbox
                                                    checked={selectedRangeTypes.includes('working')}
                                                    onCheckedChange={(checked) => {
                                                        setSelectedRangeTypes((prev) =>
                                                            checked ? [...prev, 'working'] : prev.filter((x) => x !== 'working')
                                                        );
                                                    }}
                                                />
                                                <Label htmlFor='working' className='cursor-pointer font-normal'>
                                                    Working
                                                </Label>
                                            </div>

                                            <div className='flex items-center space-x-2'>
                                                <Checkbox
                                                    checked={selectedRangeTypes.includes('left')}
                                                    onCheckedChange={(checked) =>
                                                        setSelectedRangeTypes((prev) =>
                                                            checked ? [...prev, 'left'] : prev.filter((x) => x !== 'left')
                                                        )
                                                    }
                                                />
                                                <Label htmlFor='left' className='cursor-pointer font-normal'>
                                                    Left
                                                </Label>
                                            </div>
                                        </div>
                                        {selectedFormat !== 'format2' && (
                                            <div className=''>
                                                <Controller
                                                    name='status'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            value={field.value as string}
                                                            className='flex justify-center gap-4 rounded-md p-3 shadow-md '>
                                                            {statusOptions.map((option) => (
                                                                <div
                                                                    key={option.value}
                                                                    className='flex cursor-pointer items-center space-x-3 transition-colors hover:bg-accent/50'>
                                                                    <RadioGroupItem value={option.value} id={`status-${option.value}`} />
                                                                    <Label
                                                                        htmlFor={`status-${option.value}`}
                                                                        className='flex-1 cursor-pointer font-normal text-sm'>
                                                                        {option.label}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </RadioGroup>
                                                    )}
                                                />
                                            </div>
                                        )}
                                        {selectedFormat !== 'format2' && selectedstatus !== 'all' && (
                                            <div className=''>
                                                <Controller
                                                    name='typeOrEmployee'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            value={field.value as string}
                                                            className='flex justify-center gap-4 rounded-md p-3 shadow-md '>
                                                            {typeOrEmployeeOptions.map((option) => (
                                                                <div
                                                                    key={option.value}
                                                                    className='flex cursor-pointer items-center space-x-3 transition-colors hover:bg-accent/50'>
                                                                    <RadioGroupItem value={option.value} id={`type-emp-${option.value}`} />
                                                                    <Label
                                                                        htmlFor={`type-emp-${option.value}`}
                                                                        className='flex-1 cursor-pointer font-normal text-sm'>
                                                                        {option.label}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </RadioGroup>
                                                    )}
                                                />
                                            </div>
                                        )}
                                        {selectedFormat !== 'format2' && selectedstatus !== 'all' && (
                                            <div>
                                                {selectedtypeOrEmployee === 'type' && (
                                                    <div className='space-y-2'>
                                                        <Label htmlFor='type' className='font-medium text-sm text-white-900'>
                                                            Type: <span className='text-red-500'>*</span>
                                                        </Label>
                                                        <Controller
                                                            name='type'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select onValueChange={field.onChange} value={field.value as string}>
                                                                    <SelectTrigger className='w-full'>
                                                                        <SelectValue placeholder='Select Employee Type' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {masterEmployeeTypeError ? (
                                                                            <SelectItem value='loading' disabled>
                                                                                Loading...
                                                                            </SelectItem>
                                                                        ) : masterEmployeeTypeLoading ? (
                                                                            <SelectItem value='error' disabled>
                                                                                Error loading data
                                                                            </SelectItem>
                                                                        ) : (
                                                                            employeeTypeOptions?.map((opt: any) => (
                                                                                <SelectItem key={opt.value} value={opt.value}>
                                                                                    {opt.label}
                                                                                </SelectItem>
                                                                            ))
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.type && <FormError>{errors.type.message}</FormError>}
                                                    </div>
                                                )}
                                                {selectedtypeOrEmployee === 'employee' && (
                                                    <div className=' mt-3 space-y-2'>
                                                        <Label htmlFor='employee' className='font-medium text-sm text-white-900'>
                                                            Employee: <span className='text-red-500'>*</span>
                                                        </Label>
                                                        <Controller
                                                            name='employee'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select onValueChange={field.onChange} value={field.value as string}>
                                                                    <SelectTrigger className='w-full'>
                                                                        <SelectValue placeholder='Select Employee' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {EmployeeOptions.map((opt: any) => (
                                                                            <SelectItem key={opt.value} value={opt.value}>
                                                                                {opt.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                    {/* <SelectContent>
                                                                    {masterEmployeeLoading ? (
                                                                        <SelectItem value='loading' disabled>
                                                                            Loading...
                                                                        </SelectItem>
                                                                    ) : masterEmployeeError ? (
                                                                        <SelectItem value='error' disabled>
                                                                            Error loading data
                                                                        </SelectItem>
                                                                    ) : (
                                                                        EmployeeOptions?.map((opt: any) => (
                                                                            <SelectItem key={opt.value} value={opt.value}>
                                                                                {opt.label}
                                                                            </SelectItem>
                                                                        ))
                                                                    )}
                                                                </SelectContent> */}
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.employee && <FormError>{errors.employee.message}</FormError>}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mb-5 grid grid-cols-1 gap-6 lg:grid-cols-3'>
                            {selectedFormat !== 'format1' && (
                                <div className='space-y-2'>
                                    <Label htmlFor='group-type' className='font-medium text-sm text-white-900'>
                                        Group Type: <span className='text-red-500'>*</span>
                                    </Label>
                                    {masterGroupTypesLoading ? (
                                        <div className='h-10 w-full animate-pulse rounded-md bg-white-200' />
                                    ) : groupTypeOptions.length === 0 ? (
                                        <div className='text-sm text-white-500'>No group types available</div>
                                    ) : masterGroupTypesError ? (
                                        <SelectItem value='error' disabled>
                                            Error loading data
                                        </SelectItem>
                                    ) : (
                                        <div>
                                            <Controller
                                                name='groupType'
                                                control={control}
                                                render={({ field }) => (
                                                    <MultiSelect
                                                        options={groupTypeOptions}
                                                        defaultValue={field.value}
                                                        onValueChange={field.onChange}
                                                        placeholder='Select Group Types'
                                                        className='w-full'
                                                        maxHeight={240}
                                                    />
                                                )}
                                            />
                                            {errors.groupType && <FormError>{errors.groupType.message}</FormError>}
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedFormat !== 'format1' && (
                                <div className='space-y-2'>
                                    <Label htmlFor='department' className='font-medium text-sm text-white-900'>
                                        Department: <span className='text-red-500'>*</span>
                                    </Label>
                                    {masterDepartmentsLoading ? (
                                        <div className='h-10 w-full animate-pulse rounded-md bg-white-200' />
                                    ) : DeaparmentsOptions.length === 0 ? (
                                        <div className='text-sm text-white-500'>No departments available</div>
                                    ) : masterDepartmentsError ? (
                                        <SelectItem value='error' disabled>
                                            Error loading data
                                        </SelectItem>
                                    ) : (
                                        <div>
                                            <Controller
                                                name='department'
                                                control={control}
                                                render={({ field }) => (
                                                    <MultiSelect
                                                        options={DeaparmentsOptions}
                                                        defaultValue={field.value}
                                                        onValueChange={field.onChange}
                                                        placeholder='Select Departments'
                                                        className='w-full'
                                                        maxHeight={240}
                                                    />
                                                )}
                                            />
                                            {errors.department && <FormError>{errors.department.message}</FormError>}
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedFormat !== 'format1' && (
                                <div className='space-y-2'>
                                    <Label htmlFor='designation' className='font-medium text-sm text-white-900'>
                                        Designation: <span className='text-red-500'>*</span>
                                    </Label>
                                    {masterDesignationsLoading ? (
                                        <div className='h-10 w-full animate-pulse rounded-md bg-white-200' />
                                    ) : DesignationOptions.length === 0 ? (
                                        <div className='text-sm text-white-500'>No designations available</div>
                                    ) : masterDesignationsError ? (
                                        <SelectItem value='error' disabled>
                                            Error loading data
                                        </SelectItem>
                                    ) : (
                                        <div>
                                            <Controller
                                                name='designation'
                                                control={control}
                                                render={({ field }) => (
                                                    <MultiSelect
                                                        options={DesignationOptions}
                                                        defaultValue={field.value}
                                                        onValueChange={field.onChange}
                                                        placeholder='Select Designations'
                                                        className='w-full'
                                                        maxHeight={240}
                                                    />
                                                )}
                                            />
                                            {errors.designation && <FormError>{errors.designation.message}</FormError>}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-center'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handleReset}
                                disabled={isSearching || isSubmitting}
                                className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                                Reset
                            </Button>
                            <Button
                                type='button'
                                onClick={handleSubmit(onSearch)}
                                disabled={isSearching || isSubmitting}
                                className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'>
                                {isSearching ? (
                                    <div>
                                        <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                                        Searching...
                                    </div>
                                ) : (
                                    <div className='flex items-center'>
                                        <Search className='mr-2 h-4 w-4' />
                                        Search
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </CollapsibleSection>

                {reportData.length > 0 && (
                    <CollapsibleSection
                        title='Employee Details'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <div className='mt-2 space-x-4'>
                            <div className='mb-4 text-center'>
                                <h4 className='font-semibold'>Vidya Vikasa Vidya Samsthe (R)</h4>
                                <p className='text-sm'>Basaveshwara Talkies rd,Gayatri circle,karantaka</p>
                                <p className='text-sm'>Chitradurga - 577501.</p>
                                <h5 className='font-semibold'>Employee Details Report</h5>
                            </div>
                            <div className='overflow-x-auto rounded-lg border'>
                                <table className='w-full border-collapse'>
                                    <thead>
                                        <tr className='border-white-300 border-b-2 bg-white-100'>
                                            <th className='border border-white-300 px-3 py-3 text-center font-semibold text-sm'>S.No</th>
                                            {selectedHeaders && selectedHeaders.length > 0 ? (
                                                selectedHeaders.map((header: string) => (
                                                    <th
                                                        key={header}
                                                        className='border border-white-300 px-3 py-3 text-center font-semibold text-sm'>
                                                        {header}
                                                    </th>
                                                ))
                                            ) : (
                                                <th className='border border-white-300 px-3 py-3 text-center font-semibold text-sm'>
                                                    No headers selected
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.map((row: any, index: number) => (
                                            <tr key={index} className='hover:bg-white-50'>
                                                <td className='border border-white-300 px-3 py-2 text-center text-sm'>{index + 1}</td>
                                                {selectedHeaders && selectedHeaders.length > 0 ? (
                                                    selectedHeaders.map((header: string) => {
                                                        const fieldKey = headerFieldMap[header];
                                                        const cellValue = fieldKey ? row[fieldKey] : '';
                                                        return (
                                                            <td
                                                                key={`${index}-${header}`}
                                                                className='border border-white-300 px-3 py-2 text-left text-sm'>
                                                                {cellValue || '-'}
                                                            </td>
                                                        );
                                                    })
                                                ) : (
                                                    <td className='border border-white-300 px-3 py-2 text-left text-sm'>
                                                        No headers selected
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}

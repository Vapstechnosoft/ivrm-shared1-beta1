'use client';

import { Button } from '@/components/ui/button';
import { CalendarYear } from '@/components/ui/calendar_year';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterDepartments, useMasterDesignations, useMasterGroupTypes } from '@/hooks/hrms/useReports';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Printer, RefreshCw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { EmployeeOfferLaterFields, EmployeeOfferLaterSchema } from './schemas';

// Define the form schema and types


const mockEmployees = [
    { key: '1208', value: 'ANUSHA T' },
    { key: 'EMP002', value: 'KIRAN KUMAR' },
    { key: 'EMP003', value: 'PALLAVI C' },
    { key: 'EMP004', value: 'RAFIQ' },
    { key: 'EMP005', value: 'NATARAJA' }
];

const mockletter = [
    //   { key: "1", value: "Teaching Staff Offer Letter" },
    //   { key: "2", value: "Non Teaching Staff Offer Letter" },
    { key: '3', value: 'Experience Certificate' }
    //   { key: "4", value: "Service Certificate" },
    //   { key: "5", value: "Teaching Staff Appointment Letter" },
    //   { key: "6", value: "Non Teaching Staff Appointment Letter" },
    //   { key: "7", value: "Confirmation Letter" },
    //   { key: "8", value: "Termination Letter" },
    //   { key: "9", value: "Relieving Letter" },
    //   { key: "10", value: "Account Opening" },
];
const mockApiResponse = {
    institutionDetails: {
        mI_Name: 'Vidya Vikasa Vidya Samsthe (R)',
        mI_Address1: 'Basaveshwara Talkies rd',
        mI_Address2: 'Gayatri circle',
        mI_Address3: 'karantaka',
        mI_Pincode: 577501,
        mI_ContactDetails: 'Ph No: 8194220904 Email Id : vvvsoffice@gmail.com'
    },
    currentemployeeDetails: {
        hrmE_EmployeeFirstName: 'ANUSHA ',
        hrmE_EmployeeLastName: 'T',
        hrmE_EmployeeCode: 'VVS015'
    },
    designationName: 'Asst. Teacher',
    employeeSalaryslipDetails: [
        {
            HRMED_EarnDedFlag: 'Earning',
            HRMED_Name: 'BASIC PAY',
            Amount: 7020.0
        },
        {
            HRMED_EarnDedFlag: 'Earning',
            HRMED_Name: 'HRA',
            Amount: 1404.0
        },
        {
            HRMED_EarnDedFlag: 'Earning',
            HRMED_Name: 'DA',
            Amount: 2808.0
        },
        {
            HRMED_EarnDedFlag: 'Earning',
            HRMED_Name: 'OTHER ALLOWANCE',
            Amount: 2268.0
        },
        {
            HRMED_EarnDedFlag: 'Deduction',
            HRMED_Name: 'PF CONT',
            Amount: 1179.0
        },
        {
            HRMED_EarnDedFlag: 'Deduction',
            HRMED_Name: 'ESIC CONT',
            Amount: 0.0
        },
        {
            HRMED_EarnDedFlag: 'Deduction',
            HRMED_Name: 'PT',
            Amount: 0.0
        },
        {
            HRMED_EarnDedFlag: 'Deduction',
            HRMED_Name: 'TDS',
            Amount: 0.0
        }
    ]
};

export default function SalaryCertificatePage() {
    const [isSearching, setIsSearching] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const [currentDate, setCurrentDate] = useState<string>('');
    const [joiningDate, setJoiningDate] = useState<string>('');
    const [interviewDate, setInterviewDate] = useState<string>('');
    const [responseDate, setResponseDate] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [workingDay, setWorkingDay] = useState<string>('');
    const [probationDate, setProbationDate] = useState<string>('');
    const [resignationDate, setResignationDate] = useState<string>('');

    const { data: masterGroupTypes, isLoading: masterGroupTypesLoading, isError: masterGroupTypesError } = useMasterGroupTypes();

    const { data: masterDepartments, isLoading: masterDepartmentsLoading, isError: masterDepartmentsError } = useMasterDepartments();

    const { data: masterDesignations, isLoading: masterDesignationsLoading, isError: masterDesignationsError } = useMasterDesignations();

    const groupTypeOptions =
        masterGroupTypes?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];
    const MockLetterOptions =
        mockletter.map((emp) => ({
            value: emp.key,
            label: emp.value
        })) || [];

    const DepartmentsOptions =
        masterDepartments?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];

    const DesignationOptions =
        masterDesignations?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
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
    } = useForm<EmployeeOfferLaterFields>({
        resolver: zodResolver(EmployeeOfferLaterSchema),
        defaultValues: {
            groupType: '',
            department: '',
            designation: '',
            month: '',
            year: '',
            employee: '',
            mockLetter: '3'
        },
        mode: 'onChange'
    });

    const selectedMockLetter = watch('mockLetter');

    useEffect(() => {
        const today = new Date().toISOString();
        setCurrentDate(today);
    }, []);

    const onSearch = async () => {
        setIsSearching(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success('Salary certificate generated successfully!');
            setReportData(mockApiResponse);
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate certificate');
        } finally {
            setIsSearching(false);
        }
    };

    const handleReset = () => {
        reset({
            groupType: '',
            department: '',
            designation: '',
            month: '',
            year: '',
            employee: '',
            mockLetter: '3'
        });
        setReportData(null);
        toast.info('Form has been reset');
    };
    const handlePrint = () => {
        window.print();
        toast.success('Print dialog opened');
    };

    const calculateGrossEarning = () => {
        if (!reportData) return 0;
        return reportData.employeeSalaryslipDetails
            .filter((item: any) => item.HRMED_EarnDedFlag === 'Earning')
            .reduce((sum: number, item: any) => sum + item.Amount, 0);
    };

    const calculateTotalDeductions = () => {
        if (!reportData) return 0;
        return reportData.employeeSalaryslipDetails
            .filter((item: any) => item.HRMED_EarnDedFlag === 'Deduction')
            .reduce((sum: number, item: any) => sum + item.Amount, 0);
    };

    const calculateNetSalary = () => {
        return calculateGrossEarning() - calculateTotalDeductions();
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const grossEarning = calculateGrossEarning();
    const totalDeductions = calculateTotalDeductions();
    const netSalary = calculateNetSalary();

    return (
        <div className='min-h-screen p-8'>
            <div className='container space-y-4 p-1'>
                <CollapsibleSection
                    title='Salary Certificate'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                    <div className='space-y-6'>
                        <div className=''>
                            <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3'>
                                <div className=''>
                                    <div className='space-y-2'>
                                        <Label htmlFor='groupType' className='font-medium text-sm text-white-900'>
                                            Group Type: <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='groupType'
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select GroupType' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {masterGroupTypesLoading ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : masterGroupTypesError ? (
                                                            <SelectItem value='error' disabled>
                                                                Error loading data
                                                            </SelectItem>
                                                        ) : (
                                                            groupTypeOptions?.map((opt: any) => (
                                                                <SelectItem key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.groupType && <FormError>{errors.groupType.message}</FormError>}
                                    </div>

                                    <div className='mt-3 space-y-2'>
                                        <Label htmlFor='department' className='font-medium text-sm text-white-900'>
                                            Department: <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='department'
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select department' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {masterDepartmentsLoading ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : masterDepartmentsError ? (
                                                            <SelectItem value='error' disabled>
                                                                Error loading data
                                                            </SelectItem>
                                                        ) : (
                                                            DepartmentsOptions?.map((opt: any) => (
                                                                <SelectItem key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.department && <FormError>{errors.department.message}</FormError>}
                                    </div>
                                    <div className='mt-3 space-y-2'>
                                        <Label htmlFor='designation' className='font-medium text-sm text-white-900'>
                                            Designation: <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='designation'
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select designation' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {masterDesignationsLoading ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : masterDesignationsError ? (
                                                            <SelectItem value='error' disabled>
                                                                Error loading data
                                                            </SelectItem>
                                                        ) : (
                                                            DesignationOptions?.map((opt: any) => (
                                                                <SelectItem key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.designation && <FormError>{errors.designation.message}</FormError>}
                                    </div>

                                    <div className=' mt-3 space-y-2'>
                                        <Label htmlFor='employee' className='font-medium text-sm text-white-900'>
                                            Employee: <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='employee'
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
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
                                </div>

                                <div className='grid grid-cols-1 gap-4'>
                                    <div>
                                        <Label className='font-medium text-sm text-white-900'>
                                            Current Date<span className='text-red-600'>*</span>
                                        </Label>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !currentDate && 'text-muted-foreground'
                                                    )}>
                                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                                    {currentDate ? format(new Date(currentDate), 'dd/MM/yyyy') : 'Current date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className='w-auto p-0' align='start'>
                                                <CalendarYear
                                                    mode='single'
                                                    selected={currentDate ? new Date(currentDate) : undefined}
                                                    onSelect={(date: Date | undefined) => setCurrentDate(date?.toISOString() ?? '')}
                                                    captionLayout='dropdown'
                                                    fromYear={2000}
                                                    toYear={2050}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {selectedMockLetter !== '3' &&
                                        selectedMockLetter !== '4' &&
                                        selectedMockLetter !== '10' &&
                                        selectedMockLetter !== '9' && (
                                            <div className='space-y-3'>
                                                {selectedMockLetter !== '8' && (
                                                    <>
                                                        <div>
                                                            <Label className='font-medium text-sm text-white-900'>
                                                                Date Of Joining
                                                                <span className='text-red-600'>*</span>
                                                            </Label>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        type='button'
                                                                        variant='outline'
                                                                        className={cn(
                                                                            'w-full justify-start text-left font-normal',
                                                                            !joiningDate && 'text-muted-foreground'
                                                                        )}>
                                                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                                                        {joiningDate
                                                                            ? format(new Date(joiningDate), 'dd/MM/yyyy')
                                                                            : 'joining Date'}
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className='w-auto p-0' align='start'>
                                                                    <CalendarYear
                                                                        mode='single'
                                                                        selected={joiningDate ? new Date(joiningDate) : undefined}
                                                                        onSelect={(date: Date | undefined) =>
                                                                            setJoiningDate(date?.toISOString() ?? '')
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
                                                                Date Of Interview
                                                                <span className='text-red-600'>*</span>
                                                            </Label>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        type='button'
                                                                        variant='outline'
                                                                        className={cn(
                                                                            'w-full justify-start text-left font-normal',
                                                                            !interviewDate && 'text-muted-foreground'
                                                                        )}>
                                                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                                                        {interviewDate
                                                                            ? format(new Date(interviewDate), 'dd/MM/yyyy')
                                                                            : 'Interview Date'}
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className='w-auto p-0' align='start'>
                                                                    <CalendarYear
                                                                        mode='single'
                                                                        selected={interviewDate ? new Date(interviewDate) : undefined}
                                                                        onSelect={(date: Date | undefined) =>
                                                                            setInterviewDate(date?.toISOString() ?? '')
                                                                        }
                                                                        captionLayout='dropdown'
                                                                        fromYear={2000}
                                                                        toYear={2050}
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                    </>
                                                )}
                                                {selectedMockLetter !== '7' && (
                                                    <div>
                                                        {selectedMockLetter !== '8' && (
                                                            <div>
                                                                <div>
                                                                    <Label className='font-medium text-sm text-white-900'>
                                                                        Date Of Response
                                                                        <span className='text-red-600'>*</span>
                                                                    </Label>
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                type='button'
                                                                                variant='outline'
                                                                                className={cn(
                                                                                    'w-full justify-start text-left font-normal',
                                                                                    !responseDate && 'text-muted-foreground'
                                                                                )}>
                                                                                <CalendarIcon className='mr-2 h-4 w-4' />
                                                                                {responseDate
                                                                                    ? format(new Date(responseDate), 'dd/MM/yyyy')
                                                                                    : 'Response Date'}
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className='w-auto p-0' align='start'>
                                                                            <CalendarYear
                                                                                mode='single'
                                                                                selected={responseDate ? new Date(responseDate) : undefined}
                                                                                onSelect={(date: Date | undefined) =>
                                                                                    setResponseDate(date?.toISOString() ?? '')
                                                                                }
                                                                                captionLayout='dropdown'
                                                                                fromYear={2000}
                                                                                toYear={2050}
                                                                            />
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {selectedMockLetter !== '1' &&
                                                            selectedMockLetter !== '2' &&
                                                            selectedMockLetter !== '5' &&
                                                            selectedMockLetter !== '6' && (
                                                                <div className='space-y-3'>
                                                                    <div>
                                                                        <Label className='font-medium text-sm text-white-900'>
                                                                            Date Of Due
                                                                            <span className='text-red-600'>*</span>
                                                                        </Label>
                                                                        <Popover>
                                                                            <PopoverTrigger asChild>
                                                                                <Button
                                                                                    type='button'
                                                                                    variant='outline'
                                                                                    className={cn(
                                                                                        'w-full justify-start text-left font-normal',
                                                                                        !dueDate && 'text-muted-foreground'
                                                                                    )}>
                                                                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                                                                    {dueDate
                                                                                        ? format(new Date(dueDate), 'dd/MM/yyyy')
                                                                                        : 'Due Date'}
                                                                                </Button>
                                                                            </PopoverTrigger>
                                                                            <PopoverContent className='w-auto p-0' align='start'>
                                                                                <CalendarYear
                                                                                    mode='single'
                                                                                    selected={dueDate ? new Date(dueDate) : undefined}
                                                                                    onSelect={(date: Date | undefined) =>
                                                                                        setDueDate(date?.toISOString() ?? '')
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
                                                                            Last Working Day
                                                                            <span className='text-red-600'>*</span>
                                                                        </Label>
                                                                        <Popover>
                                                                            <PopoverTrigger asChild>
                                                                                <Button
                                                                                    type='button'
                                                                                    variant='outline'
                                                                                    className={cn(
                                                                                        'w-full justify-start text-left font-normal',
                                                                                        !workingDay && 'text-muted-foreground'
                                                                                    )}>
                                                                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                                                                    {workingDay
                                                                                        ? format(new Date(workingDay), 'dd/MM/yyyy')
                                                                                        : 'Working Day'}
                                                                                </Button>
                                                                            </PopoverTrigger>
                                                                            <PopoverContent className='w-auto p-0' align='start'>
                                                                                <CalendarYear
                                                                                    mode='single'
                                                                                    selected={workingDay ? new Date(workingDay) : undefined}
                                                                                    onSelect={(date: Date | undefined) =>
                                                                                        setWorkingDay(date?.toISOString() ?? '')
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
                                                                            Date Of Probation
                                                                            <span className='text-red-600'>*</span>
                                                                        </Label>
                                                                        <Popover>
                                                                            <PopoverTrigger asChild>
                                                                                <Button
                                                                                    type='button'
                                                                                    variant='outline'
                                                                                    className={cn(
                                                                                        'w-full justify-start text-left font-normal',
                                                                                        !probationDate && 'text-muted-foreground'
                                                                                    )}>
                                                                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                                                                    {probationDate
                                                                                        ? format(new Date(probationDate), 'dd/MM/yyyy')
                                                                                        : 'Probation Date'}
                                                                                </Button>
                                                                            </PopoverTrigger>
                                                                            <PopoverContent className='w-auto p-0' align='start'>
                                                                                <CalendarYear
                                                                                    mode='single'
                                                                                    selected={
                                                                                        probationDate ? new Date(probationDate) : undefined
                                                                                    }
                                                                                    onSelect={(date: Date | undefined) =>
                                                                                        setProbationDate(date?.toISOString() ?? '')
                                                                                    }
                                                                                    captionLayout='dropdown'
                                                                                    fromYear={2000}
                                                                                    toYear={2050}
                                                                                />
                                                                            </PopoverContent>
                                                                        </Popover>
                                                                    </div>
                                                                </div>
                                                            )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    {selectedMockLetter === '9' && (
                                        <div>
                                            <Label className='font-medium text-sm text-white-900'>
                                                Date Of Resignation
                                                <span className='text-red-600'>*</span>
                                            </Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        type='button'
                                                        variant='outline'
                                                        className={cn(
                                                            'w-full justify-start text-left font-normal',
                                                            !resignationDate && 'text-muted-foreground'
                                                        )}>
                                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                                        {resignationDate
                                                            ? format(new Date(resignationDate), 'dd/MM/yyyy')
                                                            : 'Probation Date'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-auto p-0' align='start'>
                                                    <CalendarYear
                                                        mode='single'
                                                        selected={resignationDate ? new Date(resignationDate) : undefined}
                                                        onSelect={(date: Date | undefined) => setResignationDate(date?.toISOString() ?? '')}
                                                        captionLayout='dropdown'
                                                        fromYear={2000}
                                                        toYear={2050}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    )}
                                    {selectedMockLetter === '10' && (
                                        <InputText label='Enter Bank Address' required id='bankAddress' placeholder='Bank Adress' />
                                    )}
                                </div>
                                <div className=''>
                                    {masterGroupTypesLoading ? (
                                        <div className='h-10 w-full animate-pulse rounded-md bg-white-200' />
                                    ) : MockLetterOptions.length === 0 ? (
                                        <div className='text-sm text-white-500'>No group types available</div>
                                    ) : masterGroupTypesError ? (
                                        <SelectItem value='error' disabled>
                                            Error loading data
                                        </SelectItem>
                                    ) : (
                                        <>
                                            <Controller
                                                name='mockLetter'
                                                control={control}
                                                render={({ field }) => (
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className='grid max-h-64 grid-cols-1 gap-4 overflow-y-auto rounded-md border border-purple-500 p-3'>
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
                                            {errors.mockLetter && <FormError>{errors.mockLetter.message}</FormError>}
                                        </>
                                    )}
                                </div>
                            </div>
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
                                    <>
                                        <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                                        Searching...
                                    </>
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

                {reportData && (
                    <CollapsibleSection
                        title='Salary Certificate'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <div className='space-y-6 p-6 '>
                            <div className='space-y-4'>
                                <Label className='mx-auto block text-center text-gray-600 underline'>Salary Certificate</Label>

                                <p className='text-justify leading-relaxed'>
                                    This is to certify that Mr/Ms.{' '}
                                    <span className='font-semibold'>
                                        {reportData.currentemployeeDetails.hrmE_EmployeeFirstName}
                                        {reportData.currentemployeeDetails.hrmE_EmployeeLastName}
                                    </span>{' '}
                                    (Employee Code:{' '}
                                    <span className='font-semibold'>{reportData.currentemployeeDetails.hrmE_EmployeeCode}</span>) is working
                                    in Our Institution as a <span className='font-semibold'>{reportData.designationName}</span> and his/her
                                    monthly emoluments are as follows.
                                </p>
                            </div>

                            {/* Salary Table */}
                            <div className='overflow-x-auto rounded-lg border'>
                                <table className='w-full border-collapse'>
                                    <thead>
                                        <tr className='border-white-300 border-b-2 bg-white-100'>
                                            <th className='border border-white-300 px-4 py-3 text-left font-semibold text-sm'>
                                                Pay & Allowance
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-right font-semibold text-sm'>Amount</th>
                                            <th className='border border-white-300 px-4 py-3 text-left font-semibold text-sm'>
                                                Deductions
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-right font-semibold text-sm'>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            const earnings = reportData.employeeSalaryslipDetails.filter(
                                                (item: any) => item.HRMED_EarnDedFlag === 'Earning'
                                            );
                                            const deductions = reportData.employeeSalaryslipDetails.filter(
                                                (item: any) => item.HRMED_EarnDedFlag === 'Deduction'
                                            );
                                            const maxRows = Math.max(earnings.length, deductions.length);

                                            return Array.from({ length: maxRows }).map((_, index) => (
                                                <tr key={index} className='hover:bg-white-50'>
                                                    <td className='border border-white-300 px-4 py-2 text-sm'>
                                                        {earnings[index]?.HRMED_Name || ''}
                                                    </td>
                                                    <td className='border border-white-300 px-4 py-2 text-right text-sm'>
                                                        {earnings[index]
                                                            ? `₹${earnings[index].Amount.toLocaleString('en-IN', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            })}`
                                                            : ''}
                                                    </td>
                                                    <td className='border border-white-300 px-4 py-2 text-sm'>
                                                        {deductions[index]?.HRMED_Name || ''}
                                                    </td>
                                                    <td className='border border-white-300 px-4 py-2 text-right text-sm'>
                                                        {deductions[index]
                                                            ? `₹${deductions[index].Amount.toLocaleString('en-IN', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            })}`
                                                            : ''}
                                                    </td>
                                                </tr>
                                            ));
                                        })()}

                                        <tr className='border-white-400 border-t-2 bg-white-200 font-bold'>
                                            <td className='border border-white-300 px-4 py-3 text-sm'>Gross Earning:</td>
                                            <td className='border border-white-300 px-4 py-3 text-right text-sm'>
                                                ₹
                                                {grossEarning.toLocaleString('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </td>
                                            <td className='border border-white-300 px-4 py-3 text-sm'>Gross Deduction:</td>
                                            <td className='border border-white-300 px-4 py-3 text-right text-sm'>
                                                ₹
                                                {totalDeductions.toLocaleString('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className='flex justify-end'>
                                <div className='rounded-lg border bg-white-50 px-6 py-4'>
                                    <div className='flex items-center gap-4'>
                                        <span className='font-semibold text-lg'>Net Salary:</span>
                                        <span className='font-bold text-gray-600 text-xl'>
                                            ₹
                                            {netSalary.toLocaleString('en-IN', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className='flex items-end justify-between border-t pt-6'>
                                <div>
                                    <p className='font-medium text-sm'>Date: {getTodayDate()}</p>
                                </div>
                                <div className='text-right'>
                                    <div className='mb-16' />
                                    <p className='font-semibold'>Principal</p>
                                </div>
                            </div>

                            {/* Action Buttons at Bottom */}
                            <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-center'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleReset}
                                    className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                                    Cancel
                                </Button>
                                <Button
                                    type='button'
                                    onClick={handlePrint}
                                    className='no-print order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'>
                                    <Printer className='mr-2 h-4 w-4' />
                                    Print
                                </Button>
                            </div>
                        </div>
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}

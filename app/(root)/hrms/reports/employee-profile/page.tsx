'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { useMasterDepartments, useMasterDesignations, useMasterGroupTypes } from '@/hooks/hrms/useReports';

import { SelectItem } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Printer, RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import Footer from '../footer/footer';

const EmployeeProfileReportSchema = z.object({
    groupType: z.array(z.string()).min(1, 'Group Type is required'),
    department: z.array(z.string()).min(1, 'Department is required'),
    designation: z.array(z.string()).min(1, 'Designation is required')
});

type EmployeeProfileReportFields = z.infer<typeof EmployeeProfileReportSchema>;

const mockEmployees = [
    { key: '1447', value: 'Lavnya' },
    { key: '1208', value: 'ANUSHA T' },
    { key: 'EMP002', value: 'KIRAN KUMAR' },
    { key: 'EMP003', value: 'PALLAVI C' },
    { key: 'EMP004', value: 'RAFIQ' },
    { key: 'EMP005', value: 'NATARAJA' }
];

const mockApiData = {
    1447: {
        institutionDetails: {
            mI_Name: 'Vidya Vikasa Vidya Samsthe (R)',
            mI_Address1: 'Basaveshwara Talkies rd',
            mI_Address2: 'Gayatri circle',
            mI_Address3: 'karantaka',
            mI_Pincode: 577501,
            mI_ContactDetails: 'Ph No: 8194220904 Email Id : vvvsoffice@gmail.com'
        },
        currentemployeeDetails: {
            hrmE_EmployeeFirstName: 'Lavnya',
            hrmE_EmployeeLastName: 'L',
            hrmE_EmployeeCode: '14578',
            hrmE_Photo: 'https://kusumadata.blob.core.windows.net/files/30/EmployeeProfilePics/c026836d-f9ac-4ab7-9975-0b29a169312a.jpg',
            hrmE_DOB: '2001-10-28T00:00:00',
            hrmE_DOJ: '2024-05-01T00:00:00',
            hrmE_MobileNo: '8970133128',
            hrmE_EmailId: 'Staff78915@gmail.com',
            hrmE_BloodGroup: 'O+'
        },
        designationName: 'Asst. Teacher',
        hrmD_DepartmentName: 'Teaching',
        hrmgT_EmployeeGroupType: 'Teaching',
        ivrmmG_GenderName: 'Female',
        employeeclasssubject: [
            {
                asmcL_ClassName: 'I Std',
                asmC_SectionName: 'A',
                ismS_SubjectName: 'DANCE'
            },
            {
                asmcL_ClassName: 'II Std',
                asmC_SectionName: 'A',
                ismS_SubjectName: 'DANCE'
            },
            {
                asmcL_ClassName: 'III Std',
                asmC_SectionName: 'A',
                ismS_SubjectName: 'DANCE'
            }
        ]
    },
    1208: {
        institutionDetails: {
            mI_Name: 'Vidya Vikasa Vidya Samsthe (R)',
            mI_Address1: 'Basaveshwara Talkies rd',
            mI_Address2: 'Gayatri circle',
            mI_Address3: 'karantaka',
            mI_Pincode: 577501,
            mI_ContactDetails: 'Ph No: 8194220904 Email Id : vvvsoffice@gmail.com'
        },
        currentemployeeDetails: {
            hrmE_EmployeeFirstName: 'ANUSHA',
            hrmE_EmployeeLastName: 'T',
            hrmE_EmployeeCode: 'VVS015',
            hrmE_Photo: null,
            hrmE_DOB: '1990-05-15T00:00:00',
            hrmE_DOJ: '2020-06-01T00:00:00',
            hrmE_MobileNo: '9876543210',
            hrmE_EmailId: 'anusha@gmail.com',
            hrmE_BloodGroup: 'A+'
        },
        designationName: 'Senior Teacher',
        hrmD_DepartmentName: 'Teaching',
        hrmgT_EmployeeGroupType: 'Teaching',
        ivrmmG_GenderName: 'Female',
        employeeclasssubject: [
            {
                asmcL_ClassName: 'IV Std',
                asmC_SectionName: 'A',
                ismS_SubjectName: 'ENGLISH'
            },
            {
                asmcL_ClassName: 'V Std',
                asmC_SectionName: 'B',
                ismS_SubjectName: 'ENGLISH'
            }
        ]
    }
};

export default function EmployeeProfileReportPage() {
    const [isSearching, setIsSearching] = useState(false);
    const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [reportData, setReportData] = useState<any[]>([]);

    const { data: masterGroupTypes, isLoading: masterGroupTypesLoading, isError: masterGroupTypesError } = useMasterGroupTypes();

    const { data: masterDepartments, isLoading: masterDepartmentsLoading, isError: masterDepartmentsError } = useMasterDepartments();

    const { data: masterDesignations, isLoading: masterDesignationsLoading, isError: masterDesignationsError } = useMasterDesignations();

    const groupTypeOptions =
        masterGroupTypes?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
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
    } = useForm<EmployeeProfileReportFields>({
        resolver: zodResolver(EmployeeProfileReportSchema),
        defaultValues: {
            groupType: [],
            department: [],
            designation: []
        },
        mode: 'onChange'
    });

    const onSearch = async (data: EmployeeProfileReportFields) => {
        if (!showEmployeeDropdown) {
            setIsSearching(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 500));
                setShowEmployeeDropdown(true);
                toast.success('Please select employees to generate report');
            } catch (error: any) {
                toast.error(error.message || 'Failed to load employees');
            } finally {
                setIsSearching(false);
            }
        } else {
            if (selectedEmployees.length === 0) {
                toast.error('Please select at least one employee');
                return;
            }

            setIsSearching(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const reports = selectedEmployees.map((empId) => ({
                    ...mockApiData[empId as unknown as keyof typeof mockApiData],
                    empId
                }));

                setReportData(reports);
                toast.success(`Generated reports for ${selectedEmployees.length} employee(s)`);
            } catch (error: any) {
                toast.error(error.message || 'Failed to generate reports');
            } finally {
                setIsSearching(false);
            }
        }
    };

    const handleReset = () => {
        reset({
            groupType: [],
            department: [],
            designation: []
        });
        setShowEmployeeDropdown(false);
        setSelectedEmployees([]);
        setReportData([]);
        toast.info('Form has been reset');
    };
    const handlePrint = () => {
        window.print();
        toast.success('Print dialog opened');
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className='min-h-screen p-8'>
            <div className='container space-y-4 p-1'>
                <CollapsibleSection
                    title='Employee Profile Report'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                    <div className='space-y-6'>
                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                            <div className='space-y-2'>
                                <Label htmlFor='group-type' className='font-medium text-sm text-white-900'>
                                    Group Type: <span className='text-red-500'>*</span>
                                </Label>
                                {masterGroupTypesLoading ? (
                                    <div className='h-10 w-full animate-pulse rounded-md bg-white-200' />
                                ) : masterGroupTypesError ? (
                                    <SelectItem value='error' disabled>
                                        Error loading data
                                    </SelectItem>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='department' className='font-medium text-sm text-white-900'>
                                    Department: <span className='text-red-500'>*</span>
                                </Label>
                                {masterDepartmentsLoading ? (
                                    <div className='h-10 w-full animate-pulse rounded-md bg-white-200' />
                                ) : masterDepartmentsError ? (
                                    <SelectItem value='error' disabled>
                                        Error loading data
                                    </SelectItem>
                                ) : (
                                    <>
                                        <Controller
                                            name='department'
                                            control={control}
                                            render={({ field }) => (
                                                <MultiSelect
                                                    options={DepartmentsOptions}
                                                    defaultValue={field.value}
                                                    onValueChange={field.onChange}
                                                    placeholder='Select Departments'
                                                    className='w-full'
                                                    maxHeight={240}
                                                />
                                            )}
                                        />
                                        {errors.department && <FormError>{errors.department.message}</FormError>}
                                    </>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='designation' className='font-medium text-sm text-white-900'>
                                    Designation: <span className='text-red-500'>*</span>
                                </Label>
                                {masterDesignationsLoading ? (
                                    <div className='h-10 w-full animate-pulse rounded-md bg-white-200' />
                                ) : masterDesignationsError ? (
                                    <SelectItem value='error' disabled>
                                        Error loading data
                                    </SelectItem>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </div>

                        {showEmployeeDropdown && (
                            <div className='slide-in-from-top-4 flex animate-in justify-center duration-300'>
                                <div className='w-full max-w-md space-y-2'>
                                    <Label htmlFor='employee' className='font-medium text-sm text-white-900'>
                                        Employee: <span className='text-red-500'>*</span>
                                    </Label>
                                    <MultiSelect
                                        options={EmployeeOptions}
                                        defaultValue={selectedEmployees}
                                        onValueChange={setSelectedEmployees}
                                        placeholder='Select Employees'
                                        className='w-full'
                                        maxHeight={240}
                                    />
                                </div>
                            </div>
                        )}

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

                {reportData.length > 0 && (
                    <div className='space-y-6'>
                        {reportData.map((employee) => (
                            <CollapsibleSection
                                key={employee.empId}
                                title={'Employee Profile Report'}
                                defaultOpen={true}
                                variant='outline'
                                size='md'
                                className='no-print slide-in-from-top-4 animate-in shadow-lg duration-300'>
                                <div className='space-y-6 p-6'>
                                    <div className='border-b pb-4 text-center'>
                                        <h1 className='font-bold text-2xl'>{employee.institutionDetails.mI_Name}</h1>
                                        <p className='text-sm'>{employee.institutionDetails.mI_Address1}</p>
                                        <p className='text-sm'>
                                            {employee.institutionDetails.mI_Address2}, {employee.institutionDetails.mI_Address3}
                                        </p>
                                        <p className='text-sm'>Pincode: {employee.institutionDetails.mI_Pincode}</p>
                                    </div>

                                    <h2 className='text-center font-semibold text-xl underline'>Employee Profile</h2>

                                    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                                        <div className='md:col-span-2'>
                                            <div className='space-y-3'>
                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>Employee Code</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>{employee.currentemployeeDetails.hrmE_EmployeeCode || '-'}</p>
                                                </div>

                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>Name of Employee</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>
                                                        {employee.currentemployeeDetails.hrmE_EmployeeFirstName}{' '}
                                                        {employee.currentemployeeDetails.hrmE_EmployeeLastName || '-'}
                                                    </p>
                                                </div>

                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>Designation</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>{employee.designationName || '-'}</p>
                                                </div>

                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>Institution Name</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>{employee.institutionDetails.mI_Name || '-'}</p>
                                                </div>

                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>Contact Details</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>{employee.currentemployeeDetails.hrmE_MobileNo || '-'}</p>
                                                </div>

                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>Email-Id</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>{employee.currentemployeeDetails.hrmE_EmailId || '-'}</p>
                                                </div>

                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>Join Date</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>{formatDate(employee.currentemployeeDetails.hrmE_DOJ)}</p>
                                                </div>

                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>Left Date</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>
                                                        {formatDate(employee.currentemployeeDetails.hrmE_LeftDate) || '-'}
                                                    </p>
                                                </div>

                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>Total no. Of Service</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>{employee.currentemployeeDetails.totalService || '-'}</p>
                                                </div>

                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>Blood Group</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>{employee.currentemployeeDetails.hrmE_BloodGroup || '-'}</p>
                                                </div>

                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>Address</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>{employee.currentemployeeDetails.hrmE_Address || '-'}</p>
                                                </div>

                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>Age</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>{employee.currentemployeeDetails.age || '-'}</p>
                                                </div>

                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>Religion</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>{employee.currentemployeeDetails.hrmE_Religion || '-'}</p>
                                                </div>

                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>DOB</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>{formatDate(employee.currentemployeeDetails.hrmE_DOB)}</p>
                                                </div>

                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>AdharCard Number</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>{employee.currentemployeeDetails.hrmE_AadharNo || '-'}</p>
                                                </div>

                                                <div className='flex text-sm'>
                                                    <p className='w-64 font-medium text-muted-foreground'>Father Name</p>
                                                    <p className='px-4 font-medium text-muted-foreground'>:</p>
                                                    <p className='text-sm'>{employee.currentemployeeDetails.hrmE_FatherName || '-'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex flex-col items-center justify-start space-y-4'>
                                            <div className='flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-100'>
                                                {employee.currentemployeeDetails.hrmE_Photo ? (
                                                    <img
                                                        src={employee.currentemployeeDetails.hrmE_Photo}
                                                        alt='Employee'
                                                        className='h-full w-full object-cover'
                                                    />
                                                ) : (
                                                    <span className='text-gray-400'>No Photo</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-end justify-between border-t pt-6'>
                                        <div>
                                            <p className='font-medium text-sm'>Date: {getTodayDate()}</p>
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-center text-muted-foreground text-sm'>Signature of Nodal Officer</p>
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleSection>
                        ))}

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
                )}
                <Footer />
            </div>
        </div>
    );
}

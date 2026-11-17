'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMasterEventCoe } from '@/hooks/coe/usemMaster';
import type { MasterEventCoe } from '@/types/coe/masterevent';
import { Calendar, FileText, Printer } from 'lucide-react';
import { use, useState } from 'react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function staffBirthdayReport(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetch } = useMasterEventCoe(searchParams);

    return (
        <FormProvider<MasterEventCoe>>
            <MasterBirthdaypage response={response} isLoading={isLoading} error={error} refetch={refetch} />
        </FormProvider>
    );
}

function MasterBirthdaypage({
    response,
    isLoading,
    error,
    refetch
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetch?: () => void;
}) {
    const { openAddForm } = useFormContext<MasterEventCoe>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                {/* <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                      <div className='space-y-1'></div>
                      <Button
                          type='button'
                          onClick={openAddForm}
                          className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                          <Plus className='h-4 w-4' />
                          Add Master Event
                      </Button>
                  </div> */}

                {/* Data Table Section */}
                {/* <CollapsibleSection
                      defaultOpen={true}
                      variant='default'
                      size='lg'
                      className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                      <GenericDataTable<MasterEventCoe>
                          {...tableProps}
                          columns={masterMasterBirthdayColumn}
                          isLoading={isLoading}
                          error={error}
                          columnPinning={{ right: ['actions'] }}
                          loadingMessage='Loading master event...'
                          noDataTitle='No Master Event Found'
                          noDataDescription='Get started by creating your first Master Event'
                          errorTitle='Error Loading Master Event'
                      />
                  </CollapsibleSection> */}

                {/* Forms */}
                <FormSections refetch={refetch} />
            </div>
        </div>
    );
}

function FormSections({ refetch }: { refetch?: () => void }) {
    const {
        isAddFormOpen,
        isEditFormOpen,
        isToggleFormOpen,
        selectedRow,
        isDeleteFormOpen,
        closeDeleteForm,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        addFormRef,
        editFormRef
    } = useFormContext<MasterEventCoe>();

    // State for form fields
    const [reportType, setReportType] = useState<string>('betweenDays');
    const [activeType, setActiveType] = useState<string>('Studying');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [showDataTable, setShowDataTable] = useState<boolean>(false);

    // Static data matching your image
    const staticStaffBirthdayData = [
        {
            id: 1,
            staffName: 'DR. RAJESH KUMAR',
            employeeId: 'EMP001',
            designation: 'Principal',
            department: 'Administration',
            dateOfBirth: '15/Mar/1975',
            staffPhoto: '',
            address: 'NO. 123, MAHATMA GANDHI ROAD, BANGALORE, KARNATAKA, INDIA-560001'
        },
        {
            id: 2,
            staffName: 'MRS. SUNITA SHARMA',
            employeeId: 'EMP002',
            designation: 'HOD Mathematics',
            department: 'Mathematics',
            dateOfBirth: '22/Apr/1980',
            staffPhoto: '',
            address: 'PLOT NO. 45, JAYANAGAR, BANGALORE, KARNATAKA, INDIA-560041'
        },
        {
            id: 3,
            staffName: 'MR. VIJAY KUMAR',
            employeeId: 'EMP003',
            designation: 'Lab Assistant',
            department: 'Science',
            dateOfBirth: '10/May/1985',
            staffPhoto: '',
            address: 'NO. 78, BASVANAGUDI, BANGALORE, KARNATAKA, INDIA-560004'
        },
        {
            id: 4,
            staffName: 'MRS. GEETHA R',
            employeeId: 'EMP004',
            designation: 'Librarian',
            department: 'Library',
            dateOfBirth: '30/Jun/1982',
            staffPhoto: '',
            address: 'FLAT NO. 203, KORAMANGALA, BANGALORE, KARNATAKA, INDIA-560034'
        },
        {
            id: 5,
            staffName: 'MR. ANAND PATIL',
            employeeId: 'EMP005',
            designation: 'Sports Coach',
            department: 'Physical Education',
            dateOfBirth: '12/Jul/1988',
            staffPhoto: '',
            address: 'NO. 56, MALLESHWARAM, BANGALORE, KARNATAKA, INDIA-560003'
        },
        {
            id: 6,
            staffName: 'MRS. PREETHI NAIK',
            employeeId: 'EMP006',
            designation: 'Accountant',
            department: 'Accounts',
            dateOfBirth: '25/Aug/1983',
            staffPhoto: '',
            address: 'NO. 89, RAJAJINAGAR, BANGALORE, KARNATAKA, INDIA-560010'
        },
        {
            id: 7,
            staffName: 'MR. SURESH RAO',
            employeeId: 'EMP007',
            designation: 'Computer Teacher',
            department: 'Computer Science',
            dateOfBirth: '08/Sep/1979',
            staffPhoto: '',
            address: 'PLOT NO. 112, INDIRANAGAR, BANGALORE, KARNATAKA, INDIA-560038'
        },
        {
            id: 8,
            staffName: 'MRS. LAKSHMI DEVI',
            employeeId: 'EMP008',
            designation: 'Nurse',
            department: 'Health',
            dateOfBirth: '19/Oct/1984',
            staffPhoto: '',
            address: 'NO. 34, HSR LAYOUT, BANGALORE, KARNATAKA, INDIA-560102'
        },
        {
            id: 9,
            staffName: 'MR. RAMESH BABU',
            employeeId: 'EMP009',
            designation: 'Driver',
            department: 'Transport',
            dateOfBirth: '03/Nov/1978',
            staffPhoto: '',
            address: 'NO. 67, BTM LAYOUT, BANGALORE, KARNATAKA, INDIA-560076'
        },
        {
            id: 10,
            staffName: 'MRS. KAVITHA SHETTY',
            employeeId: 'EMP010',
            designation: 'Office Assistant',
            department: 'Administration',
            dateOfBirth: '14/Dec/1987',
            staffPhoto: '',
            address: 'FLAT NO. 501, WHITEFIELD, BANGALORE, KARNATAKA, INDIA-560066'
        }
    ];

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!fromDate || !toDate) {
            alert('Please fill in both From Date and To Date');
            return;
        }

        // Check if fromDate is before toDate
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);

        if (fromDateObj > toDateObj) {
            alert('From Date cannot be after To Date');
            return;
        }

        // Validation satisfied - show data table
        console.log({
            reportType,
            fromDate,
            toDate
        });

        setShowDataTable(true);
    };

    // Handle cancel
    const handleCancel = () => {
        setReportType('betweenDays');
        setActiveType('Studying');
        setFromDate('');
        setToDate('');
        setShowDataTable(false); // Hide data table on cancel
    };

    // Handle print
    const handlePrint = () => {
        window.print();
    };

    // Handle export to Excel
    const handleExportExcel = () => {
        console.log('Exporting to Excel...');
        // Add export functionality here
    };

    return (
        <>
            <div ref={addFormRef}>
                <CollapsibleSection
                    title='STAFF BIRTHDAY REPORT'
                    description='Generate birthday reports based on selected criteria'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                    <div className='relative'>
                        {/* Birthday Report Form */}
                        <Card className='p-6'>
                            <form onSubmit={handleSubmit} className='space-y-6'>
                                {/* Report Type Selection */}
                                <div className='space-y-4'>
                                    <Label className='font-semibold text-lg'>Select Report Type:</Label>
                                    <RadioGroup value={reportType} onValueChange={setReportType} className='flex space-x-6'>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='betweenDays' id='betweenDays' />
                                            <Label htmlFor='betweenDays' className='cursor-pointer font-medium'>
                                                Between Days
                                            </Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='monthWise' id='monthWise' />
                                            <Label htmlFor='monthWise' className='cursor-pointer font-medium'>
                                                Month Wise
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Date Selection */}
                                <div className='space-y-4'>
                                    {/* From Date */}
                                    <div className='space-y-2'>
                                        <Label htmlFor='fromDate' className='font-medium'>
                                            From Date: <span className='text-red-500'>*</span>
                                        </Label>
                                        <div className='relative'>
                                            <Calendar className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-500' />
                                            <Input
                                                id='fromDate'
                                                type='date'
                                                value={fromDate}
                                                onChange={(e) => setFromDate(e.target.value)}
                                                className='pl-10'
                                                placeholder='Enter date'
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* To Date */}
                                    <div className='space-y-2'>
                                        <Label htmlFor='toDate' className='font-medium'>
                                            To Date: <span className='text-red-500'>*</span>
                                        </Label>
                                        <div className='relative'>
                                            <Calendar className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-500' />
                                            <Input
                                                id='toDate'
                                                type='date'
                                                value={toDate}
                                                onChange={(e) => setToDate(e.target.value)}
                                                className='pl-10'
                                                placeholder='Enter date'
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex justify-end space-x-4 pt-6'>
                                    <Button type='button' variant='outline' onClick={handleCancel} className='px-8 font-medium'>
                                        CANCEL
                                    </Button>
                                    <Button type='submit' className='px-8 font-medium'>
                                        SUBMIT
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        {/* Data Table Section - Only shown after validation */}
                        {showDataTable && (
                            <div className='mt-8'>
                                <Card className='p-6'>
                                    {/* Table Header */}
                                    <div className='mb-4 flex items-center justify-between'>
                                        <h3 className='font-semibold text-lg'>Total Grid Records: {staticStaffBirthdayData.length}</h3>
                                        <div className='flex space-x-2'>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                onClick={handleExportExcel}
                                                className='flex items-center gap-2'>
                                                <FileText className='h-4 w-4' />
                                                EXPORT TO EXCEL
                                            </Button>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                onClick={handlePrint}
                                                className='flex items-center gap-2'>
                                                <Printer className='h-4 w-4' />
                                                PRINT
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Data Table */}
                                    <div className='overflow-x-auto'>
                                        <table className='w-full border-collapse border'>
                                            <thead>
                                                <tr className='bg-gray-100'>
                                                    <th className='border p-3 text-left font-semibold'>Staff Name</th>
                                                    <th className='border p-3 text-left font-semibold'>Employee ID</th>
                                                    <th className='border p-3 text-left font-semibold'>Designation</th>
                                                    <th className='border p-3 text-left font-semibold'>Department</th>
                                                    <th className='border p-3 text-left font-semibold'>Date of Birth</th>
                                                    <th className='border p-3 text-left font-semibold'>Staff Photo</th>
                                                    <th className='border p-3 text-left font-semibold'>Address</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {staticStaffBirthdayData.map((staff) => (
                                                    <tr key={staff.id} className='border-b hover:bg-gray-50'>
                                                        <td className='border p-3'>{staff.staffName}</td>
                                                        <td className='border p-3'>{staff.employeeId}</td>
                                                        <td className='border p-3'>{staff.designation}</td>
                                                        <td className='border p-3'>{staff.department}</td>
                                                        <td className='border p-3'>{staff.dateOfBirth}</td>
                                                        <td className='border p-3'>{staff.staffPhoto || '-'}</td>
                                                        <td className='border p-3 text-sm'>{staff.address}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                </CollapsibleSection>
            </div>
        </>
    );
}

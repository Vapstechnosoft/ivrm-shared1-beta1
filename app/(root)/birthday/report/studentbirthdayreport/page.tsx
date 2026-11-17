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

export default function StudentBirthdayReport(props: {
    searchParams: SearchParams;
}) {
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
    const staticBirthdayData = [
        {
            id: 1,
            studentName: 'KISHAN K S',
            admNo: '1629',
            class: 'X',
            section: 'C',
            dateOfBirth: '02/Jan/2010',
            studentPhoto: '',
            address: 'KOTWAL NAGARA, 3RD CROSS, MH ROAD,CHITRADURGA,CHITRADURGA,Karnataka,India-577501'
        },
        {
            id: 2,
            studentName: 'RISHITHA G',
            admNo: '932',
            class: 'X Std',
            section: 'A',
            dateOfBirth: '08/Jan/2010',
            studentPhoto: '',
            address: '80, MASTHAMMA LAYOUT,3RD CROSS, ONAKE OBAVVA STADIUM ROAD,CHITRADURGA,Karnataka,-577501'
        },
        {
            id: 3,
            studentName: 'NUTHANA A',
            admNo: '949',
            class: 'X Std',
            section: 'A',
            dateOfBirth: '11/Jan/2010',
            studentPhoto: '',
            address: 'CHITRADURGA,CHITRADURGA,CHITRADURGA,Karnataka,-577501'
        },
        {
            id: 4,
            studentName: 'SUHAS S',
            admNo: '862',
            class: 'X Std',
            section: 'A',
            dateOfBirth: '19/Jan/2010',
            studentPhoto: '',
            address: 'MURTHY RAO HOUSE, BESIDE M S TAILORS,NEAR GAREHATTI, KELAGOTE,,CHITRADURGA,Karnataka,India-577501'
        },
        {
            id: 5,
            studentName: 'CHINMAY M',
            admNo: '921',
            class: 'X Std',
            section: 'A',
            dateOfBirth: '23/Jan/2010',
            studentPhoto: '',
            address: 'CHOWDESHWARI BADAWANE,CHITRADURGA,CHITRADURGA,Karnataka,-577501'
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
            activeType,
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
                    title='STUDENT BIRTHDAY REPORT'
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
                                    <RadioGroup value={activeType} onValueChange={setActiveType} className='flex space-x-6'>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='Studying' id='Studying' />
                                            <Label htmlFor='Studying' className='cursor-pointer font-medium'>
                                                Studying
                                            </Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='left' id='left' />
                                            <Label htmlFor='left' className='cursor-pointer font-medium'>
                                                Left
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
                                        <h3 className='font-semibold text-lg'>Total Grid Records: {staticBirthdayData.length}</h3>
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
                                                    <th className='border p-3 text-left font-semibold'>Student Name</th>
                                                    <th className='border p-3 text-left font-semibold'>Adm.No.</th>
                                                    <th className='border p-3 text-left font-semibold'>Class</th>
                                                    <th className='border p-3 text-left font-semibold'>Section</th>
                                                    <th className='border p-3 text-left font-semibold'>Date of Birth</th>
                                                    <th className='border p-3 text-left font-semibold'>Student Photo</th>
                                                    <th className='border p-3 text-left font-semibold'>Address</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {staticBirthdayData.map((student) => (
                                                    <tr key={student.id} className='border-b hover:bg-gray-50'>
                                                        <td className='border p-3'>{student.studentName}</td>
                                                        <td className='border p-3'>{student.admNo}</td>
                                                        <td className='border p-3'>{student.class}</td>
                                                        <td className='border p-3'>{student.section}</td>
                                                        <td className='border p-3'>{student.dateOfBirth}</td>
                                                        <td className='border p-3'>{student.studentPhoto || '-'}</td>
                                                        <td className='border p-3 text-sm'>{student.address}</td>
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

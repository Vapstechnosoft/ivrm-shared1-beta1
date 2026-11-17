'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/admission/preadmission/useMasters';
import { api } from '@/lib/apiService';
import type { IAcademicYearDropDown } from '@/types/admission/preadmission/masters';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { type IStudentSearch, studentSearchColumns } from './_components/columns';

export default function StudentTCApplyPage() {
    const [data, setData] = useState<IStudentSearch[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<IStudentSearch | null>(null);
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [searchType, setSearchType] = useState<string>('all');
    const [studentStatus, setStudentStatus] = useState<string>('active');
    const [isTemporaryTC, setIsTemporaryTC] = useState<boolean>(false);
    const [searchOrder, setSearchOrder] = useState<string>('admno_name');

    // Fetch Academic Years
    const { data: academicYears } = useQuery({
        queryKey: ['academicYears'],
        queryFn: async () => {
            // Register a proxy base URL for client-side CORS avoidance
            api.addBaseUrl('admission', '/api/admission');

            const response = await api.get<IAcademicYearDropDown[]>(
                'admission_proxy' as any,
                'master_class_category/academic_year_drop_down_list'
            );
            return response.data || [];
        }
    });

    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();

    const handleSearch = () => {
        // In a real app, you would likely use the selectedYear in the search
        console.log('Searching in year:', selectedYear);

        setData([
            { id: 1, admNo: 'A001', studentName: 'John Doe', class: 'X', section: 'A' },
            { id: 2, admNo: 'A005', studentName: 'Alice', class: 'X', section: 'B' }
        ]);
        setSelectedStudent(null);
    };

    const handleSelect = (student: IStudentSearch) => {
        setSelectedStudent(student);
    };

    const tableProps = {
        data: data,
        totalItems: data.length,
        isLoading: false,
        error: null,
        success: true
    };

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <CollapsibleSection title='STUDENT TC' defaultOpen={true} variant='default' size='lg' className='shadow-lg'>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                        {/* Left Side Group */}
                        <div className='space-y-4'>
                            {/* Search Type Radio */}
                            <div className='rounded-md border p-3'>
                                <RadioGroup value={searchType} onValueChange={setSearchType} className='flex items-center gap-6'>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='all' id='st-all' />
                                        <Label htmlFor='st-all'>All</Label>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='individual' id='st-individual' />
                                        <Label htmlFor='st-individual'>Individual</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Academic Year */}
                            <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-[auto_1fr] md:gap-4'>
                                <Label
                                    htmlFor='academic-year-select'
                                    className='whitespace-nowrap text-left font-medium text-sm md:text-right'>
                                    Academic Year:<span className='text-red-500'>*</span>
                                </Label>
                                <div>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger id='academic-year-select'>
                                            <SelectValue placeholder='Select Academic Year' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* {academicYears?.map((year) => (
                                                <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                                    {year.asmaY_Year}
                                                </SelectItem>
                                            ))} */}

                                            {academicYearLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading Academic Year...
                                                </SelectItem>
                                            ) : academicYearError ? (
                                                <SelectItem value='error' disabled>
                                                    Error loading Academic Year
                                                </SelectItem>
                                            ) : (
                                                academicYear?.data?.map((item) => (
                                                    <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                        {item.asmaY_Year}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Student Name / Search Input */}
                            <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-[auto_1fr] md:gap-4'>
                                <Label htmlFor='tc-apply-search' className='whitespace-nowrap text-left font-medium text-sm md:text-right'>
                                    Student Name :<span className='text-red-500'>*</span>
                                </Label>
                                <div>
                                    <input
                                        id='tc-apply-search'
                                        className='flex h-10 w-full rounded-md border bg-background px-3 focus:outline-none focus:ring-1 focus:ring-ring'
                                        placeholder='Select or search Student in the list'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Side Group (Student Selection Box) */}
                        <div className='overflow-hidden rounded-md border border-blue-800'>
                            <div className='bg-blue-800 px-4 py-2 font-medium text-white'>Student Selection</div>
                            <div className='space-y-4 bg-white p-4'>
                                {/* Student Status Radio */}
                                <RadioGroup
                                    value={studentStatus}
                                    onValueChange={setStudentStatus}
                                    className='flex flex-wrap items-center gap-4'>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='active' id='ss-active' />
                                        <Label htmlFor='ss-active'>Active</Label>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='left' id='ss-left' />
                                        <Label htmlFor='ss-left'>Left</Label>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='deactive' id='ss-deactive' />
                                        <Label htmlFor='ss-deactive'>Deactive</Label>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='temporary' id='ss-temporary' />
                                        <Label htmlFor='ss-temporary'>Temporary Students</Label>
                                    </div>
                                </RadioGroup>

                                <div className='my-2 border-t' />

                                {/* Temporary TC Checkbox */}
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        id='temp-tc'
                                        checked={isTemporaryTC}
                                        onCheckedChange={(checked) => setIsTemporaryTC(checked as boolean)}
                                    />
                                    <Label htmlFor='temp-tc'>Temporary TC</Label>
                                </div>

                                <div className='my-2 border-t' />

                                {/* Search Order Radio */}
                                <RadioGroup value={searchOrder} onValueChange={setSearchOrder} className='flex items-center gap-6'>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='admno_name' id='so-adm' />
                                        <Label htmlFor='so-adm'>Adm. No:Name</Label>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='name_admno' id='so-name' />
                                        <Label htmlFor='so-name'>Name:Adm No.</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>

                    <div className='mt-6 flex justify-center'>
                        <Button onClick={handleSearch} className='w-full bg-orange-600 px-8 text-white hover:bg-orange-700 md:w-auto'>
                            <Search className='mr-2 h-4 w-4' /> Search
                        </Button>
                    </div>
                </CollapsibleSection>

                {data.length > 0 && !selectedStudent && (
                    <CollapsibleSection defaultOpen={true} variant='default' size='lg' className='shadow-lg'>
                        <GenericDataTable<IStudentSearch>
                            {...tableProps}
                            columns={studentSearchColumns(handleSelect)}
                            isLoading={false}
                            showViewOptions={false}
                            loadingMessage='Searching...'
                        />
                    </CollapsibleSection>
                )}

                {selectedStudent && (
                    <CollapsibleSection
                        title={`Apply TC for ${selectedStudent.studentName}`}
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg'>
                        <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2'>
                            <div className='space-y-2'>
                                <label htmlFor='tc-apply-reason' className='font-medium text-sm'>
                                    Reason for TC
                                </label>
                                <input id='tc-apply-reason' className='flex h-10 w-full rounded-md border bg-background px-3' />
                            </div>
                            <div className='space-y-2'>
                                <label htmlFor='tc-apply-date' className='font-medium text-sm'>
                                    TC Date
                                </label>
                                <input id='tc-apply-date' type='date' className='flex h-10 w-full rounded-md border bg-background px-3' />
                            </div>
                            <div className='space-y-2'>
                                <label htmlFor='tc-apply-remarks' className='font-medium text-sm'>
                                    Remarks
                                </label>
                                <textarea id='tc-apply-remarks' className='flex h-20 w-full rounded-md border bg-background px-3 py-2' />
                            </div>
                            <div className='col-span-full flex gap-4 pt-4'>
                                <Button>Submit Application</Button>
                                <Button variant='outline' onClick={() => setSelectedStudent(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}

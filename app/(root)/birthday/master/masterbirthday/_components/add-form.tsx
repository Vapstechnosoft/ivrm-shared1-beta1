'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search } from 'lucide-react';
import { useState } from 'react';

// Static birthday data matching your image
const birthdayData = [
    {
        id: 1,
        studentName: 'ANISH NAIK P',
        className: 'V Std',
        sectionName: 'A',
        mobileNumber: '0',
        emailId: '',
        dob: '28-01-2015'
    },
    {
        id: 2,
        studentName: 'NAINIKA C M',
        className: 'IX Std',
        sectionName: 'A',
        mobileNumber: '0',
        emailId: '',
        dob: '28-01-2011'
    },
    {
        id: 3,
        studentName: 'SHAMIKA OS',
        className: 'III ICSE',
        sectionName: 'C',
        mobileNumber: '0',
        emailId: '',
        dob: '28-01-2017'
    },
    {
        id: 4,
        studentName: 'SHRAVYA SAJIAN',
        className: 'III ICSE',
        sectionName: 'C',
        mobileNumber: '0',
        emailId: '',
        dob: '28-01-2017'
    },
    {
        id: 5,
        studentName: 'JOHN DOE',
        className: 'VII Std',
        sectionName: 'B',
        mobileNumber: '9876543210',
        emailId: 'john@example.com',
        dob: '28-01-2014'
    }
];

export default function BirthdayListForm() {
    const [filterType, setFilterType] = useState<string>('1'); // Student by default
    const [selectedCheckboxes, setSelectedCheckboxes] = useState({
        sms: false,
        email: false,
        whatsapp: false
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const handleFilterChange = (value: string) => {
        setFilterType(value);
    };

    const handleCheckboxChange = (key: keyof typeof selectedCheckboxes) => {
        setSelectedCheckboxes((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleRowSelect = (id: number) => {
        setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    const handleSelectAll = () => {
        if (selectedRows.length === birthdayData.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(birthdayData.map((row) => row.id));
        }
    };

    // Filter data based on search
    const filteredData = birthdayData.filter(
        (row) =>
            row.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.sectionName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='space-y-6'>
            <form className='space-y-6'>
                <div className='space-y-4'>
                    <Card className='p-4'>
                        <div className='space-y-4'>
                            <div className='flex items-center space-x-4'>
                                <Label className='font-semibold'>Please Select Radio Button:</Label>
                                <RadioGroup value={filterType} onValueChange={handleFilterChange} className='flex space-x-4'>
                                    {[
                                        { value: '1', label: 'Student' },
                                        { value: '2', label: 'Staff' },
                                        { value: '3', label: 'Alumni' }
                                    ].map((item) => (
                                        <div key={item.value} className='flex items-center space-x-2'>
                                            <RadioGroupItem value={item.value} id={`filter-${item.value}`} />
                                            <Label htmlFor={`filter-${item.value}`} className='cursor-pointer'>
                                                {item.label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className='flex items-center space-x-6 border-t pt-4'>
                                <Label className='font-semibold'>Please Select Check Box:</Label>
                                {[
                                    { key: 'sms', label: 'SMS' },
                                    { key: 'email', label: 'EMAIL' },
                                    { key: 'whatsapp', label: 'WHATSAPP' }
                                ].map((item) => (
                                    <div key={item.key} className='flex items-center space-x-2'>
                                        <Checkbox
                                            id={item.key}
                                            checked={selectedCheckboxes[item.key as keyof typeof selectedCheckboxes]}
                                            onCheckedChange={() => handleCheckboxChange(item.key as keyof typeof selectedCheckboxes)}
                                        />
                                        <Label htmlFor={item.key}>{item.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <CollapsibleSection defaultOpen={true} variant='default' size='lg' className='shadow-lg'>
                        <div className='flex items-center justify-between border-b px-8 py-6'>
                            <h2 className='font-bold text-2xl text-primary'>BIRTHDAY LIST</h2>
                        </div>

                        {/* Search Bar */}
                        <div className='border-b p-4'>
                            <div className='relative max-w-md'>
                                <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-500' />
                                <Input
                                    type='search'
                                    placeholder='Search here...'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className='pl-10'
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className='overflow-x-auto'>
                            <table className='w-full table-auto border-collapse'>
                                <thead className='bg-primary text-white'>
                                    <tr>
                                        <th className='border px-4 py-3'>
                                            <Checkbox
                                                checked={selectedRows.length === birthdayData.length}
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </th>
                                        <th className='border px-4 py-3'>No</th>
                                        <th className='border px-4 py-3'>Student Name</th>
                                        <th className='border px-4 py-3'>Class Name</th>
                                        <th className='border px-4 py-3'>Section Name</th>
                                        <th className='border px-4 py-3'>Mobile Number</th>
                                        <th className='border px-4 py-3'>Email Id</th>
                                        <th className='border px-4 py-3'>DOB</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((row) => (
                                        <tr key={row.id} className='border-b hover:bg-gray-50'>
                                            <td className='border px-4 py-3 text-center'>
                                                <Checkbox
                                                    checked={selectedRows.includes(row.id)}
                                                    onCheckedChange={() => handleRowSelect(row.id)}
                                                />
                                            </td>
                                            <td className='border px-4 py-3 text-center'>{row.id}</td>
                                            <td className='border px-4 py-3'>{row.studentName}</td>
                                            <td className='border px-4 py-3 text-center'>{row.className}</td>
                                            <td className='border px-4 py-3 text-center'>{row.sectionName}</td>
                                            <td className='border px-4 py-3 text-center'>{row.mobileNumber}</td>
                                            <td className='border px-4 py-3 text-center'>{row.emailId || '-'}</td>
                                            <td className='border px-4 py-3 text-center'>{row.dob}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CollapsibleSection>
                </div>

                <div className='flex justify-end space-x-4 border-t pt-6'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={() => {
                            setSelectedRows([]);
                            setSearchQuery('');
                            setSelectedCheckboxes({ sms: false, email: false, whatsapp: false });
                        }}>
                        Reset
                    </Button>
                    <Button type='submit'>Send Birthday Wishes</Button>
                </div>
            </form>
        </div>
    );
}

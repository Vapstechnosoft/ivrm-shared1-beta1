'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw } from 'lucide-react';
import type {
    IAttendanceReportInitialData,
    IAttendanceReportSearch,
    IClass,
    ISection
} from '@/types/staff-portal/attendance-report';
import { toast } from 'sonner';

interface AttendanceFilterProps {
    initialData?: IAttendanceReportInitialData;
    isLoading: boolean;
    onSearch: (params: IAttendanceReportSearch) => void;
    onReset: () => void;
    getClasses: (data: { ASMAY_Id: number; AMC_Id: number }) => Promise<IClass[]>;
    getSections: (data: { ASMAY_Id: number; ASMCL_Id: number }) => Promise<ISection[]>;
}

export default function AttendanceFilter({
    initialData,
    isLoading,
    onSearch,
    onReset,
    getClasses,
    getSections
}: AttendanceFilterProps) {
    const [reportType, setReportType] = useState<number>(1); // 1: All, 2: Individual
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('0');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [percentage, setPercentage] = useState<string>('100');

    const [classes, setClasses] = useState<IClass[]>([]);
    const [sections, setSections] = useState<ISection[]>([]);

    const categoryFlag = initialData?.categoryflag ?? false;

    // Set default year
    useEffect(() => {
        if (initialData?.academicList && initialData.academicList.length > 0) {
            const defaultYear = initialData.academicList.find(y => y.selected)?.asmaY_Id || initialData.academicList[0].asmaY_Id;
            setSelectedYear(String(defaultYear));
        }
    }, [initialData]);

    const handleYearChange = (value: string) => {
        setSelectedYear(value);
        if (reportType === 2) {
            fetchClasses(Number(value), Number(selectedCategory));
        }
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        if (reportType === 2) {
            fetchClasses(Number(selectedYear), Number(value));
        }
    };

    const handleTypeChange = (value: string) => {
        const type = Number(value);
        setReportType(type);
        if (type === 1) {
            setSelectedClass('');
            setSelectedSection('');
            setClasses([]);
            setSections([]);
        } else if (type === 2) {
            if (selectedYear) {
                fetchClasses(Number(selectedYear), Number(selectedCategory));
            }
        }
    };

    const fetchClasses = async (yearId: number, categoryId: number) => {
        try {
            const data = await getClasses({ ASMAY_Id: yearId, AMC_Id: categoryId });
            setClasses(data);
            setSelectedClass('');
            setSections([]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClassChange = async (value: string) => {
        setSelectedClass(value);
        try {
            const data = await getSections({ ASMAY_Id: Number(selectedYear), ASMCL_Id: Number(value) });
            setSections(data);
            setSelectedSection('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = () => {
        if (!selectedYear) {
            toast.error('Please select Academic Year');
            return;
        }
        if (!percentage) {
            toast.error('Please enter Percentage');
            return;
        }

        if (reportType === 2) {
            if (!selectedClass) {
                toast.error('Please select Class');
                return;
            }
            if (!selectedSection) {
                toast.error('Please select Section');
                return;
            }
        }

        onSearch({
            ASMAY_Id: Number(selectedYear),
            ASMCL_Id: reportType === 1 ? 0 : Number(selectedClass),
            ASMC_Id: reportType === 1 ? 0 : Number(selectedSection),
            AMC_Id: Number(selectedCategory),
            percentage: Number(percentage),
            type: reportType
        });
    };

    const handleReset = () => {
        setReportType(1);
        setSelectedClass('');
        setSelectedSection('');
        setPercentage('100');
        onReset();
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>Filter Criteria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-center space-x-6 pb-4">
                    <RadioGroup
                        defaultValue="1"
                        value={String(reportType)}
                        onValueChange={handleTypeChange}
                        className="flex space-x-6"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="all" />
                            <Label htmlFor="all" className="cursor-pointer">All</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="individual" />
                            <Label htmlFor="individual" className="cursor-pointer">Individual</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="year">Academic Year <span className="text-red-500">*</span></Label>
                            <Select value={selectedYear} onValueChange={handleYearChange}>
                                <SelectTrigger id="year">
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {initialData?.academicList.map((year) => (
                                        <SelectItem key={year.asmaY_Id} value={String(year.asmaY_Id)}>
                                            {year.asmaY_Year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {categoryFlag && (
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">All</SelectItem>
                                        {initialData?.category_list.map((cat) => (
                                            <SelectItem key={cat.amC_Id} value={String(cat.amC_Id)}>
                                                {cat.amC_Name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="class">Class <span className={reportType === 2 ? "text-red-500" : "hidden"}>*</span></Label>
                            <Select
                                value={selectedClass}
                                onValueChange={handleClassChange}
                                disabled={reportType === 1}
                            >
                                <SelectTrigger id="class">
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.asmcL_Id} value={String(cls.asmcL_Id)}>
                                            {cls.asmcL_ClassName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="percentage">Percentage <span className="text-red-500">*</span></Label>
                            <Input
                                id="percentage"
                                type="number"
                                value={percentage}
                                onChange={(e) => setPercentage(e.target.value)}
                                min="0"
                                max="100"
                                placeholder="Enter Percentage"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="section">Section <span className={reportType === 2 ? "text-red-500" : "hidden"}>*</span></Label>
                            <Select
                                value={selectedSection}
                                onValueChange={setSelectedSection}
                                disabled={reportType === 1}
                            >
                                <SelectTrigger id="section">
                                    <SelectValue placeholder="Select Section" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">All</SelectItem>
                                    {sections.map((sec) => (
                                        <SelectItem key={sec.asmS_Id} value={String(sec.asmS_Id)}>
                                            {sec.asmC_SectionName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 pt-4">
                    <Button onClick={handleSearch} disabled={isLoading}>
                        <Search className="mr-2 h-4 w-4" />
                        Report
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="text-red-500 hover:text-red-600">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

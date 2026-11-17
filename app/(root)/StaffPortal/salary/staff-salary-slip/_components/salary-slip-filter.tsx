
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileText, X } from 'lucide-react';
import type { ISalarySlipInitialData } from '@/types/staff-portal/salary-slip';

interface SalarySlipFilterProps {
    initialData?: ISalarySlipInitialData | null;
    onGenerate: (month: string, year: string) => void;
    isLoading: boolean;
}

const SalarySlipFilter: React.FC<SalarySlipFilterProps> = ({
    initialData,
    onGenerate,
    isLoading
}) => {
    const [month, setMonth] = React.useState<string>('');
    const [year, setYear] = React.useState<string>('');

    const handleGenerate = () => {
        if (month && year) {
            onGenerate(month, year);
        }
    };

    const handleCancel = () => {
        setMonth('');
        setYear('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Generate Employee Salary Slip</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Month <span className="text-destructive">*</span></label>
                        <Select onValueChange={setMonth} value={month}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Month" />
                            </SelectTrigger>
                            <SelectContent>
                                {initialData?.monthdropdown.map((m) => (
                                    <SelectItem key={m.ivrM_Month_Id} value={m.ivrM_Month_Name}>
                                        {m.ivrM_Month_Name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Year <span className="text-destructive">*</span></label>
                        <Select onValueChange={setYear} value={year}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {initialData?.leaveyeardropdown.map((y) => (
                                    <SelectItem key={y.hrmlY_Id} value={y.hrmlY_LeaveYear}>
                                        {y.hrmlY_LeaveYear}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <Button
                        onClick={handleGenerate}
                        className="bg-primary hover:bg-primary/90"
                        disabled={!month || !year || isLoading}
                    >
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Slip
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default SalarySlipFilter;

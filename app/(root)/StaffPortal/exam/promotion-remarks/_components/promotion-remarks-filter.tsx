'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type {
    IPromotionRemarksInitialData,
    IClass,
    ISection
} from '@/types/staff-portal/promotion-remarks';

interface PromotionRemarksFilterProps {
    initialData?: IPromotionRemarksInitialData;
    getClasses: (data: { ASMAY_Id: number }) => Promise<{ getclass: IClass[] }>;
    getSections: (data: { ASMAY_Id: number; ASMCL_Id: number }) => Promise<{ getsection: ISection[] }>;
    onSearch: (data: { ASMAY_Id: number; ASMCL_Id: number; ASMS_Id: number }) => void;
    onReset: () => void;
    isLoading?: boolean;
}

export default function PromotionRemarksFilter({
    initialData,
    getClasses,
    getSections,
    onSearch,
    onReset,
    isLoading
}: PromotionRemarksFilterProps) {
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');

    const [classes, setClasses] = useState<IClass[]>([]);
    const [sections, setSections] = useState<ISection[]>([]);

    useEffect(() => {
        if (initialData?.year_list && initialData.year_list.length > 0) {
            // Optional: Auto-select current year if logic exists, for now just load list
            const defaultYear = initialData.year_list[0].asmaY_Id;
            setSelectedYear(String(defaultYear));
            fetchClasses(defaultYear);
        }
    }, [initialData]);

    const fetchClasses = async (yearId: number) => {
        try {
            const res = await getClasses({ ASMAY_Id: yearId });
            setClasses(res.getclass || []);
        } catch (e) { console.error(e); }
    };

    const handleClassChange = async (value: string) => {
        setSelectedClass(value);
        setSelectedSection('');
        setSections([]);
        try {
            const res = await getSections({ ASMAY_Id: Number(selectedYear), ASMCL_Id: Number(value) });
            setSections(res.getsection || []);
        } catch (e) { console.error(e); }
    };

    const handleSearch = () => {
        if (!selectedYear || !selectedClass || !selectedSection) {
            toast.error('Please select all fields');
            return;
        }
        onSearch({
            ASMAY_Id: Number(selectedYear),
            ASMCL_Id: Number(selectedClass),
            ASMS_Id: Number(selectedSection)
        });
    };

    return (
        <Card className="mb-6">
            <CardHeader><CardTitle>Promotion Remarks Selection</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Academic Year <span className="text-red-500">*</span></Label>
                        <Select value={selectedYear} onValueChange={(v) => { setSelectedYear(v); fetchClasses(Number(v)); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {initialData?.year_list?.map(y => (
                                    <SelectItem key={y.asmaY_Id} value={String(y.asmaY_Id)}>{y.asmaY_Year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Class <span className="text-red-500">*</span></Label>
                        <Select value={selectedClass} onValueChange={handleClassChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map(c => (
                                    <SelectItem key={c.asmcL_Id} value={String(c.asmcL_Id)}>{c.asmcL_ClassName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Section <span className="text-red-500">*</span></Label>
                        <Select value={selectedSection} onValueChange={setSelectedSection}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Section" />
                            </SelectTrigger>
                            <SelectContent>
                                {sections.map(s => (
                                    <SelectItem key={s.asmS_Id} value={String(s.asmS_Id)}>{s.asmC_SectionName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex justify-center gap-4 pt-4">
                    <Button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Search
                    </Button>
                    <Button variant="outline" onClick={onReset} className="text-red-500">Cancel</Button>
                </div>
            </CardContent>
        </Card>
    );
}

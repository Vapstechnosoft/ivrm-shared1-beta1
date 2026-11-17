
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Search, X, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type {
    IFeeDefaulterInitialData,
    IAcademicYear,
    IClass,
    ISection,
    ICustomGroup,
    IFeeGroup,
    IFeeTerm,
    IFeeDefaulterSearchRequest
} from '@/types/staff-portal/fee-defaulter-report';

interface FilterProps {
    initialData?: IFeeDefaulterInitialData;
    onSearch: (params: IFeeDefaulterSearchRequest) => void;
    onReset: () => void;
    isLoading: boolean;
    getClasses: (y: number) => Promise<IClass[]>;
    getTerms: (y: number, r: string) => Promise<{ fillterms: IFeeTerm[], customlist: ICustomGroup[], grouplist: IFeeGroup[] }>;
    getSections: (y: number, c: number) => Promise<ISection[]>;
    getGroups: (ids: number[], r: string) => Promise<IFeeGroup[]>;
}

export default function FeeDefaulterFilter({
    initialData,
    onSearch,
    onReset,
    isLoading,
    getClasses,
    getTerms,
    getSections,
    getGroups
}: FilterProps) {
    const [result, setResult] = useState<'FGW' | 'FHW' | 'FCW' | 'FSW'>('FSW');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [customGroups, setCustomGroups] = useState<ICustomGroup[]>([]);
    const [feeGroups, setFeeGroups] = useState<IFeeGroup[]>([]);
    const [feeTerms, setFeeTerms] = useState<IFeeTerm[]>([]);
    const [classes, setClasses] = useState<IClass[]>([]);
    const [sections, setSections] = useState<ISection[]>([]);
    const [allTermsChecked, setAllTermsChecked] = useState(false);
    const [allGroupsChecked, setAllGroupsChecked] = useState(false);

    const [active, setActive] = useState(true);
    const [deactive, setDeactive] = useState(false);
    const [left, setLeft] = useState(false);
    const [remarks, setRemarks] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [due, setDue] = useState<'duedate' | 'tillduedate'>('duedate');

    const configGroupOrTerm = initialData?.accountdetails?.[0]?.fmC_GroupOrTermFlg || 'T';

    useEffect(() => {
        if (initialData?.adcyear) {
            // No auto-select
        }
    }, [initialData]);

    const handleYearChange = async (val: string) => {
        setSelectedYear(val);
        const [clsRes, termRes] = await Promise.all([
            getClasses(Number(val)),
            getTerms(Number(val), configGroupOrTerm)
        ]);
        setClasses(clsRes);
        setCustomGroups(termRes.customlist.map(c => ({ ...c, fmgG_Id_chk: true, fmgG_Id_chk1: true })));
        setFeeGroups(termRes.grouplist.map(g => ({ ...g, fmG_Id_chk: true, fmG_Id_chk1: true })));
        setFeeTerms(termRes.fillterms.map(t => ({ ...t, fmT_Id_chk: false })));
        setSelectedClass('');
        setSections([]);
    };

    const handleClassChange = async (val: string) => {
        setSelectedClass(val);
        const res = await getSections(Number(selectedYear), Number(val));
        setSections(res);
        setSelectedSection('');
    };

    const handleCustomGroupToggle = async (id: number, checked: boolean) => {
        const updated = customGroups.map(c => c.fmgG_Id === id ? { ...c, fmgG_Id_chk: checked, fmgG_Id_chk1: checked } : c);
        setCustomGroups(updated);

        const selectedIds = updated.filter(c => configGroupOrTerm === 'T' ? c.fmgG_Id_chk : c.fmgG_Id_chk1).map(c => c.fmgG_Id);
        if (selectedIds.length > 0) {
            const res = await getGroups(selectedIds, configGroupOrTerm);
            setFeeGroups(res.map(g => ({ ...g, fmG_Id_chk: true, fmG_Id_chk1: true })));
        } else {
            setFeeGroups([]);
        }
    };

    const handleFeeGroupToggle = (id: number, checked: boolean) => {
        setFeeGroups(prev => prev.map(g => g.fmG_Id === id ? { ...g, fmG_Id_chk: checked, fmG_Id_chk1: checked } : g));
    };

    const handleAllGroupsToggle = (checked: boolean) => {
        setAllGroupsChecked(checked);
        setFeeGroups(prev => prev.map(g => ({ ...g, fmG_Id_chk: checked, fmG_Id_chk1: checked })));
    };

    const handleAllTermsToggle = (checked: boolean) => {
        setAllTermsChecked(checked);
        setFeeTerms(prev => prev.map(t => ({ ...t, fmT_Id_chk: checked })));
    };

    const handleTermToggle = (id: number, checked: boolean) => {
        setFeeTerms(prev => prev.map(t => t.fmT_Id === id ? { ...t, fmT_Id_chk: checked } : t));
    };

    const handleSearch = () => {
        const params: IFeeDefaulterSearchRequest = {
            ASMAY_Id: Number(selectedYear),
            radioval: result,
            reporttype: 'date', // As per Angular "rpttyp" default or toggle
            active,
            deactive,
            left,
            ASMCL_Id: Number(selectedClass),
            AMSC_Id: Number(selectedSection),
            FMG_Ids: feeGroups.filter(g => configGroupOrTerm === 'T' ? g.fmG_Id_chk : g.fmG_Id_chk1).map(g => g.fmG_Id),
            FMT_Ids: feeTerms.filter(t => t.fmT_Id_chk).map(t => t.fmT_Id),
            From_Date: format(date, 'yyyy-MM-dd'),
            duedate: due,
            term_group: configGroupOrTerm as 'T' | 'G',
            Select_Button: 'Student'
        };
        onSearch(params);
    };

    return (
        <Card className="shadow-md border-primary/10">
            <CardHeader className="pb-3 px-6">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
                    <FileText className="h-5 w-5" />
                    Fee Defaulter Report Filter
                </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Academic Year</Label>
                        <Select value={selectedYear} onValueChange={handleYearChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {initialData?.adcyear?.map(yr => (
                                    <SelectItem key={yr.asmaY_Id} value={yr.asmaY_Id.toString()}>{yr.asmaY_Year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-end pb-1">
                        <RadioGroup
                            value={result}
                            onValueChange={setResult as any}
                            className="flex flex-wrap items-center gap-4 bg-muted/40 p-2 rounded-lg border px-4 w-full justify-between"
                        >
                            {[
                                { id: 'FGW', label: 'Group Wise' },
                                { id: 'FHW', label: 'Head Wise' },
                                { id: 'FCW', label: 'Class Wise' },
                                { id: 'FSW', label: 'Student Wise' }
                            ].map(opt => (
                                <div key={opt.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt.id} id={opt.id} />
                                    <Label htmlFor={opt.id} className="cursor-pointer text-xs font-medium">{opt.label}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <Label className="text-sm font-bold flex items-center gap-2">
                            Custom Group <span className="text-destructive">*</span>
                        </Label>
                        <div className="border rounded-md p-2 h-40 overflow-y-auto bg-card space-y-1">
                            {customGroups.map(cg => (
                                <div key={cg.fmgG_Id} className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded transition-colors">
                                    <Checkbox
                                        id={`cg-${cg.fmgG_Id}`}
                                        checked={configGroupOrTerm === 'T' ? cg.fmgG_Id_chk : cg.fmgG_Id_chk1}
                                        onCheckedChange={(val) => handleCustomGroupToggle(cg.fmgG_Id, !!val)}
                                    />
                                    <Label htmlFor={`cg-${cg.fmgG_Id}`} className="text-xs cursor-pointer truncate">{cg.fmg_groupname}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-bold flex items-center gap-2">
                                Fee Group <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="all-groups"
                                    checked={allGroupsChecked}
                                    onCheckedChange={(val) => handleAllGroupsToggle(!!val)}
                                />
                                <Label htmlFor="all-groups" className="text-[10px] uppercase font-bold text-muted-foreground">All</Label>
                            </div>
                        </div>
                        <div className="border rounded-md p-2 h-40 overflow-y-auto bg-card space-y-1">
                            {feeGroups.map(fg => (
                                <div key={fg.fmG_Id} className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded transition-colors">
                                    <Checkbox
                                        id={`fg-${fg.fmG_Id}`}
                                        checked={configGroupOrTerm === 'T' ? fg.fmG_Id_chk : fg.fmG_Id_chk1}
                                        onCheckedChange={(val) => handleFeeGroupToggle(fg.fmG_Id, !!val)}
                                    />
                                    <Label htmlFor={`fg-${fg.fmG_Id}`} className="text-xs cursor-pointer truncate">{fg.fmG_GroupName}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {configGroupOrTerm === 'T' && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-bold flex items-center gap-2">
                                    Term Name <span className="text-destructive">*</span>
                                </Label>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="all-terms"
                                        checked={allTermsChecked}
                                        onCheckedChange={(val) => handleAllTermsToggle(!!val)}
                                    />
                                    <Label htmlFor="all-terms" className="text-[10px] uppercase font-bold text-muted-foreground">All</Label>
                                </div>
                            </div>
                            <div className="border rounded-md p-2 h-40 overflow-y-auto bg-card space-y-1">
                                {feeTerms.map(ft => (
                                    <div key={ft.fmT_Id} className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded transition-colors">
                                        <Checkbox
                                            id={`ft-${ft.fmT_Id}`}
                                            checked={ft.fmT_Id_chk}
                                            onCheckedChange={(val) => handleTermToggle(ft.fmT_Id, !!val)}
                                        />
                                        <Label htmlFor={`ft-${ft.fmT_Id}`} className="text-xs cursor-pointer truncate">{ft.fmT_Name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label>Class <span className="text-destructive">*</span></Label>
                        <Select value={selectedClass} onValueChange={handleClassChange} disabled={!selectedYear}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map(c => (
                                    <SelectItem key={c.asmcL_Id} value={c.asmcL_Id.toString()}>{c.asmcL_ClassName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Section <span className="text-destructive">*</span></Label>
                        <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!selectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Section" />
                            </SelectTrigger>
                            <SelectContent>
                                {sections.map(s => (
                                    <SelectItem key={s.amsC_Id} value={s.amsC_Id.toString()}>{s.asmc_sectionname}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Report Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={(val) => val && setDate(val)} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                    <div className="flex flex-wrap gap-6 bg-muted/20 p-4 rounded-lg border border-primary/5">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="active" checked={active} onCheckedChange={(v) => setActive(!!v)} />
                            <Label htmlFor="active" className="text-sm cursor-pointer">Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="deactive" checked={deactive} onCheckedChange={(v) => setDeactive(!!v)} />
                            <Label htmlFor="deactive" className="text-sm cursor-pointer">Deactive</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="left" checked={left} onCheckedChange={(v) => setLeft(!!v)} />
                            <Label htmlFor="left" className="text-sm cursor-pointer">Left</Label>
                        </div>
                        {result === 'FSW' && (
                            <div className="flex items-center space-x-2 border-l pl-6 border-primary/10">
                                <Checkbox id="remarks" checked={remarks} onCheckedChange={(v) => setRemarks(!!v)} />
                                <Label htmlFor="remarks" className="text-sm cursor-pointer font-semibold text-primary/80">Show Remarks</Label>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <RadioGroup
                            value={due}
                            onValueChange={setDue as any}
                            className="flex items-center gap-8 bg-primary/5 p-4 rounded-full border border-primary/10 px-10"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="duedate" id="due-date" />
                                <Label htmlFor="due-date" className="cursor-pointer font-medium">Due Date</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="tillduedate" id="till-due-date" />
                                <Label htmlFor="till-due-date" className="cursor-pointer font-medium">Till Due Date</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={onReset}
                        className="flex items-center gap-2 hover:bg-destructive/10 text-destructive border border-destructive/20 min-w-[120px]"
                    >
                        <X className="h-4 w-4" />
                        Clear
                    </Button>
                    <Button
                        onClick={handleSearch}
                        disabled={isLoading || !selectedYear || !selectedClass}
                        className="bg-primary hover:bg-primary/90 flex items-center gap-2 min-w-[200px] shadow-lg shadow-primary/20"
                    >
                        <Search className="h-4 w-4" />
                        {isLoading ? 'Generating...' : 'Show Report'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

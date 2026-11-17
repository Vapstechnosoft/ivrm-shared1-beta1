'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Search } from 'lucide-react';
import { vacateReportSchema, type VacateReportSchema } from '@/schemas/hostel/reports/vacate-report.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getStudentListForReport, getVacateReport } from '@/server/hostel/hostel-management/reports/vacate-report';

interface ReportFormProps {
    initialData: {
        yerlist: any[];
        hostelist: any[];
        studentlist: any[];
        stafflist: any[];
        guestlist: any[];
    };
    onReportGenerated: (data: any[], type: string) => void;
}

export default function VacateReportForm({ initialData, onReportGenerated }: ReportFormProps) {
    const [dropdowns, setDropdowns] = useState(initialData);

    const methods = useForm<VacateReportSchema>({
        resolver: zodResolver(vacateReportSchema),
        mode: 'onSubmit',
        defaultValues: {
            type: 'student',
            type2: 'all',
            ASMAY_Id: null,
            Fromdate: new Date(),
            ToDate: new Date(),
            SelectedHostellist: [],
            SelectedStudentlist: [],
            Selectedstafflist: [],
            Selectedguestlist: [],
        }
    });

    const { control, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = methods;

    const selectedType = useWatch({ control, name: 'type' });
    const selectedFilter = useWatch({ control, name: 'type2' });
    const selectedYear = useWatch({ control, name: 'ASMAY_Id' });

    // Handle Year Change for Student List
    useEffect(() => {
        if (selectedType === 'student' && selectedYear) {
            (async () => {
                const res = await getStudentListForReport(Number(selectedYear));
                if (res) {
                    //setDropdowns({ ...dropdowns, studentlist: res });
                }
            })();
        }
    }, [selectedType, selectedYear]);

    // Handle Type change
    useEffect(() => {
        setValue('type2', 'all');
        setValue('SelectedHostellist', []);
        setValue('SelectedStudentlist', []);
        setValue('Selectedstafflist', []);
        setValue('Selectedguestlist', []);
    }, [selectedType, setValue]);

    const onSubmit = async (data: VacateReportSchema) => {
        try {
            const res = await getVacateReport(data);
            // if (res?.gridlistdata) {
            //     onReportGenerated(res.gridlistdata, data.type);
            // } else {
            //     toast.error('No records found');
            //     onReportGenerated([], data.type);
            // }
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate report');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Hostel Vacate Report</CardTitle>
            </CardHeader>
            <CardContent>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-col items-center gap-6">
                            {/* Occupant Type */}
                            <Controller
                                control={control}
                                name="type"
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex gap-8 border p-4 rounded-lg bg-gray-50"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="student" id="t1" />
                                            <Label htmlFor="t1">Student</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="staff" id="t2" />
                                            <Label htmlFor="t2">Staff</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="guest" id="t3" />
                                            <Label htmlFor="t3">Guest</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />

                            {/* Filter Type */}
                            <Controller
                                control={control}
                                name="type2"
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex gap-8 border p-4 rounded-lg bg-gray-50"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="all" id="f1" />
                                            <Label htmlFor="f1">All</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Hostel" id="f2" />
                                            <Label htmlFor="f2">Hostel</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="individual" id="f3" />
                                            <Label htmlFor="f3">Individual</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Academic Year for Students */}
                            {selectedType === 'student' && (
                                <div className="space-y-1">
                                    <Label>Academic Year <span className="text-red-500">*</span></Label>
                                    <Controller
                                        control={control}
                                        name="ASMAY_Id"
                                        render={({ field }) => (
                                            <Select
                                                value={String(field.value || '')}
                                                onValueChange={(v) => field.onChange(Number(v))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Year" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {dropdowns.yerlist?.map((y: any) => (
                                                        <SelectItem key={y.asmaY_Id} value={String(y.asmaY_Id)}>
                                                            {y.asmaY_Year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.ASMAY_Id && <FormError>{errors.ASMAY_Id.message}</FormError>}
                                </div>
                            )}

                            {/* Date Range */}
                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    control={control}
                                    name="Fromdate"
                                    render={({ field }) => (
                                        <div className="space-y-1">
                                            <Label>Start Date <span className="text-red-500">*</span></Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, "PPP") : <span>Start</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="ToDate"
                                    render={({ field }) => (
                                        <div className="space-y-1">
                                            <Label>End Date <span className="text-red-500">*</span></Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, "PPP") : <span>End</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Multi-Select Filters */}
                        {selectedFilter === 'Hostel' && (
                            <div className="space-y-2 border p-4 rounded-lg bg-gray-50 max-h-48 overflow-y-auto">
                                <Label>Hostels</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {dropdowns.hostelist?.map((h: any) => (
                                        <div key={h.hlmH_Id} className="flex items-center space-x-2">
                                            <Controller
                                                control={control}
                                                name="SelectedHostellist"
                                                render={({ field }) => (
                                                    <Checkbox
                                                        checked={field.value?.some((item: any) => item.HLMH_Id === h.hlmH_Id)}
                                                        onCheckedChange={(checked) => {
                                                            const current = field.value || [];
                                                            if (checked) field.onChange([...current, { HLMH_Id: h.hlmH_Id }]);
                                                            else field.onChange(current.filter((x: any) => x.HLMH_Id !== h.hlmH_Id));
                                                        }}
                                                    />
                                                )}
                                            />
                                            <span className="text-sm">{h.hlmH_Name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedFilter === 'individual' && (
                            <div className="space-y-2 border p-4 rounded-lg bg-gray-50 max-h-48 overflow-y-auto">
                                <Label>Individuals</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {selectedType === 'student' && dropdowns.studentlist?.map((s: any) => (
                                        <div key={s.amsT_Id} className="flex items-center space-x-2">
                                            <Controller
                                                control={control}
                                                name="SelectedStudentlist"
                                                render={({ field }) => (
                                                    <Checkbox
                                                        checked={field.value?.some((item: any) => item.AMST_Id === s.amsT_Id)}
                                                        onCheckedChange={(checked) => {
                                                            const current = field.value || [];
                                                            if (checked) field.onChange([...current, { AMST_Id: s.amsT_Id }]);
                                                            else field.onChange(current.filter((x: any) => x.AMST_Id !== s.amsT_Id));
                                                        }}
                                                    />
                                                )}
                                            />
                                            <span className="text-sm">{s.studentname}</span>
                                        </div>
                                    ))}
                                    {selectedType === 'staff' && dropdowns.stafflist?.map((s: any) => (
                                        <div key={s.hrmE_Id} className="flex items-center space-x-2">
                                            <Controller
                                                control={control}
                                                name="Selectedstafflist"
                                                render={({ field }) => (
                                                    <Checkbox
                                                        checked={field.value?.some((item: any) => item.HRME_Id === s.hrmE_Id)}
                                                        onCheckedChange={(checked) => {
                                                            const current = field.value || [];
                                                            if (checked) field.onChange([...current, { HRME_Id: s.hrmE_Id }]);
                                                            else field.onChange(current.filter((x: any) => x.HRME_Id !== s.hrmE_Id));
                                                        }}
                                                    />
                                                )}
                                            />
                                            <span className="text-sm">{s.hrmE_EmployeeFirstName}</span>
                                        </div>
                                    ))}
                                    {selectedType === 'guest' && dropdowns.guestlist?.map((g: any) => (
                                        <div key={g.hlhgstalT_Id} className="flex items-center space-x-2">
                                            <Controller
                                                control={control}
                                                name="Selectedguestlist"
                                                render={({ field }) => (
                                                    <Checkbox
                                                        checked={field.value?.some((item: any) => item.HLHGSTALT_Id === g.hlhgstalT_Id)}
                                                        onCheckedChange={(checked) => {
                                                            const current = field.value || [];
                                                            if (checked) field.onChange([...current, { HLHGSTALT_Id: g.hlhgstalT_Id }]);
                                                            else field.onChange(current.filter((x: any) => x.HLHGSTALT_Id !== g.hlhgstalT_Id));
                                                        }}
                                                    />
                                                )}
                                            />
                                            <span className="text-sm">{g.hlhgstalT_GuestName}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => reset()} className="w-32">Cancel</Button>
                            <Button type="submit" disabled={isSubmitting} className="w-32">
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                                Report
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
}

'use client';

import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IPointsRecordReportData, PointsRecordReportFormSchema, PointsRecordReportSchema } from '@/types/sports/reports/points-record-report';
import { usePointsRecordReport } from '@/hooks/sports/usePointsRecordReport';

interface ReportFormProps {
    setReportData: (data: IPointsRecordReportData[] | null) => void;
    setFormData: (data: PointsRecordReportFormSchema | null) => void;
}

export default function ReportForm({ setReportData, setFormData }: ReportFormProps) {
    const { loadData, generateReport } = usePointsRecordReport();

    // Local state for search filters
    const [searchValues, setSearchValues] = useState({
        house: '',
        section: '',
        event: '',
        sports: '',
        place: '',
    });

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<PointsRecordReportFormSchema>({
        resolver: zodResolver(PointsRecordReportSchema),
        defaultValues: {
            Type: 'House',
            ASMAY_Id: 0,
            selectedhouselist: [],
            selectedSectionlist: [],
            selectedEventlist: [],
            selectedSportslist: [],
            placListData: [],
        },
    });

    const watchType = useWatch({ control, name: 'Type' });
    const watchHouses = useWatch({ control, name: 'selectedhouselist' }) || [];
    const watchSections = useWatch({ control, name: 'selectedSectionlist' }) || [];
    const watchEvents = useWatch({ control, name: 'selectedEventlist' }) || [];
    const watchSports = useWatch({ control, name: 'selectedSportslist' }) || [];
    const watchPlaces = useWatch({ control, name: 'placListData' }) || [];

    // Reset dependents when Type changes
    useEffect(() => {
        setValue('selectedhouselist', []);
        setValue('selectedSectionlist', []);
        setValue('selectedEventlist', []);
        setValue('selectedSportslist', []);
        setValue('placListData', []);
        setValue('ASMCL_Id', undefined);
        setValue('SPCCMCC_Id', undefined);
        setReportData(null);
        setFormData(null);
    }, [watchType, setValue, setReportData, setFormData]);

    const onSubmit = (data: PointsRecordReportFormSchema) => {
        setFormData(data);
        generateReport.mutate(data, {
            onSuccess: (result) => {
                setReportData(result || null);
                if (result && result.length > 0) {
                    toast.success('Report generated successfully!');
                } else {
                    toast.info('No records found.');
                }
            },
            onError: (error) => {
                toast.error('Failed to generate report.');
            },
        });
    };

    const handleClear = () => {
        setValue('Type', 'House');
        setValue('ASMAY_Id', 0);
        setReportData(null);
        setFormData(null);
    };

    // Generic Multi-Select Helper
    const renderMultiSelect = (
        label: string,
        items: any[],
        idKey: string,
        nameKey: string,
        searchKey: keyof typeof searchValues,
        formField: any, // keyof PointsRecordReportFormSchema
        watchList: any[],
        idProp: string
    ) => {
        const filteredItems = items.filter(item =>
            item[nameKey].toLowerCase().includes(searchValues[searchKey].toLowerCase())
        );

        const isSelected = (id: number | string) => watchList.some((i: any) => i[idProp] == id);

        const toggleSelectAll = () => {
            if (watchList.length === filteredItems.length && filteredItems.length > 0) {
                setValue(formField, []);
            } else {
                const allSelected = filteredItems.map(item => ({ [idProp]: item[idKey] }));
                setValue(formField, allSelected);
            }
        };

        const toggleItem = (id: number | string) => {
            if (isSelected(id)) {
                setValue(formField, watchList.filter((i: any) => i[idProp] != id));
            } else {
                setValue(formField, [...watchList, { [idProp]: id }]);
            }
        };

        return (
            <div className="space-y-2">
                <Label>{label}</Label>
                <div className="rounded-md border p-2 bg-white">
                    <Input
                        placeholder={`Search ${label}...`}
                        className="mb-2 h-8"
                        value={searchValues[searchKey]}
                        onChange={(e) => setSearchValues(prev => ({ ...prev, [searchKey]: e.target.value }))}
                    />
                    <div className="mb-2 flex items-center space-x-2 border-b pb-1">
                        <Checkbox
                            id={`select-all-${searchKey}`}
                            checked={filteredItems.length > 0 && watchList.length === filteredItems.length}
                            onCheckedChange={toggleSelectAll}
                        />
                        <label htmlFor={`select-all-${searchKey}`} className="cursor-pointer text-sm font-semibold">
                            All
                        </label>
                    </div>
                    <ScrollArea className="h-32">
                        <div className="space-y-2">
                            {filteredItems.map((item) => (
                                <div key={item[idKey]} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${searchKey}-${item[idKey]}`}
                                        checked={isSelected(item[idKey])}
                                        onCheckedChange={() => toggleItem(item[idKey])}
                                    />
                                    <label htmlFor={`${searchKey}-${item[idKey]}`} className="cursor-pointer text-sm">
                                        {item[nameKey]}
                                    </label>
                                </div>
                            ))}
                            {filteredItems.length === 0 && (
                                <p className="text-center text-xs text-muted-foreground">No items found</p>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        );
    };

    const rankList = [
        { id: '1', name: '1' }, { id: '2', name: '2' }, { id: '3', name: '3' },
        { id: '4', name: '4' }, { id: '5', name: '5' }, { id: '6', name: '6' },
        { id: '7', name: '7' }, { id: '8', name: '8' }, { id: '9', name: '9' },
        { id: '10', name: '10' },
    ];

    return (
        <div className="rounded-md border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b pb-2">
                <h2 className="text-lg font-semibold">Points Record Report</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Radio Group type */}
                <div className="flex justify-center space-x-6 bg-slate-50 p-3 rounded-md border">
                    <Controller
                        control={control}
                        name="Type"
                        render={({ field }) => (
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex gap-8"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="House" id="r1" />
                                    <Label htmlFor="r1" className="cursor-pointer">By House</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="CS" id="r2" />
                                    <Label htmlFor="r2" className="cursor-pointer">By Class/Section</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="CC" id="r3" />
                                    <Label htmlFor="r3" className="cursor-pointer">Competition Category</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Academic Year - Always Visible */}
                    <div className="space-y-2">
                        <Label>Academic Year <span className="text-red-500">*</span></Label>
                        <Controller
                            control={control}
                            name="ASMAY_Id"
                            render={({ field }) => (
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value ? field.value.toString() : ''}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadData.data?.academicYear.map((item) => (
                                            <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                {item.asmaY_Year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.ASMAY_Id && <p className="text-sm font-medium text-destructive">{errors.ASMAY_Id.message}</p>}
                    </div>

                    {/* Class - Only for CS */}
                    {watchType === 'CS' && (
                        <div className="space-y-2">
                            <Label>Class Name <span className="text-red-500">*</span></Label>
                            <Controller
                                control={control}
                                name="ASMCL_Id"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value ? field.value.toString() : ''}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {loadData.data?.classList.map((item) => (
                                                <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                    {item.asmcL_ClassName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    )}

                    {/* Competition Category - Only for CC */}
                    {watchType === 'CC' && (
                        <div className="space-y-2">
                            <Label>Competition Category <span className="text-red-500">*</span></Label>
                            <Controller
                                control={control}
                                name="SPCCMCC_Id"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value ? field.value.toString() : ''}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {loadData.data?.categoryList.map((item) => (
                                                <SelectItem key={item.spccmcC_Id} value={item.spccmcC_Id.toString()}>
                                                    {item.spccmcC_CompitionCategory}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    )}

                    {/* Section - Only for CS */}
                    {watchType === 'CS' && renderMultiSelect('Section', loadData.data?.sectionList || [], 'asmS_Id', 'asmC_SectionName', 'section', 'selectedSectionlist', watchSections, 'asmS_Id')}

                    {/* Place - Only for CC */}
                    {watchType === 'CC' && renderMultiSelect('Place', rankList, 'id', 'name', 'place', 'placListData', watchPlaces, 'spccestR_Rank')}

                    {/* Common Filters */}
                    {renderMultiSelect('House Name', loadData.data?.houseList || [], 'spccmH_Id', 'spccmH_HouseName', 'house', 'selectedhouselist', watchHouses, 'spccmH_Id')}
                    {renderMultiSelect('Event Name', loadData.data?.eventList || [], 'spccmE_Id', 'spccmE_EventName', 'event', 'selectedEventlist', watchEvents, 'spccmE_Id')}
                    {renderMultiSelect('Sports Name', loadData.data?.sportsList || [], 'spccmscC_Id', 'spccmscC_SportsCCName', 'sports', 'selectedSportslist', watchSports, 'spccmscC_Id')}

                </div>

                <div className="flex justify-center gap-4 pt-4 border-t">
                    <Button type="submit" disabled={generateReport.isPending}>
                        {generateReport.isPending ? 'Generating...' : 'Report'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => toast.info('Excel Export functionality mock')}>
                        Export to Excel
                    </Button>
                    <Button type="button" variant="outline" onClick={() => toast.info('Print functionality mock')}>
                        Print
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleClear}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}

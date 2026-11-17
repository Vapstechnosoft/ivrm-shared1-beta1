'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { VenueWiseParticipationReportSchema, type VenueWiseParticipationReportFormSchema, type IVenueWiseReportData, type IVenueWiseReportDropdowns } from "@/types/sports/reports/venue-wise-participation-report";
import { useVenueWiseParticipationReport } from "@/hooks/sports/useVenueWiseParticipationReport";
import { getClass, getSection } from "@/server/sports/reports/venue-wise-participation-report";

interface ReportFormProps {
    dropdowns: IVenueWiseReportDropdowns;
    onReportGenerated: (data: IVenueWiseReportData[]) => void;
    onReset: () => void;
}

export const ReportForm = ({ dropdowns, onReportGenerated, onReset }: ReportFormProps) => {
    const { generateReport } = useVenueWiseParticipationReport();
    const [classList, setClassList] = useState<IVenueWiseReportDropdowns['classList']>([]);
    const [sectionList, setSectionList] = useState<IVenueWiseReportDropdowns['sectionList']>([]);
    const [houseList, setHouseList] = useState<IVenueWiseReportDropdowns['houseList']>([]);
    const [venueList, setVenueList] = useState<IVenueWiseReportDropdowns['venueList']>([]);

    const form = useForm<VenueWiseParticipationReportFormSchema>({
        resolver: zodResolver(VenueWiseParticipationReportSchema),
        defaultValues: {
            Type: 'House',
            ASMAY_Id: undefined,
            ASMCL_Id: undefined,
            selectedSectionlist: [],
            selectedhouselist: [],
            selectedVenuelist: [],
        },
    });

    const watchedType = useWatch({ control: form.control, name: 'Type' });
    const watchedYear = useWatch({ control: form.control, name: 'ASMAY_Id' });
    const watchedClass = useWatch({ control: form.control, name: 'ASMCL_Id' });

    // Reset dependent fields when Type changes
    useEffect(() => {
        form.setValue('ASMAY_Id', undefined as any);
        form.setValue('ASMCL_Id', undefined);
        form.setValue('selectedSectionlist', []);
        form.setValue('selectedhouselist', []);
        form.setValue('selectedVenuelist', []);
        setClassList([]);
        setSectionList([]);
        setHouseList([]);
        setVenueList([]);
    }, [watchedType, form]);

    // Fetch Classes when Year changes
    useEffect(() => {
        if (watchedYear) {
            const fetchClasses = async () => {
                try {
                    const data = await getClass(watchedYear);
                    setClassList(data.classList || []);
                    setHouseList(data.houseList || []);
                    setVenueList(data.venueList || []);
                } catch (error) {
                    console.error("Failed to fetch classes", error);
                    toast.error("Failed to load classes");
                }
            };
            fetchClasses();
        } else {
            setClassList([]);
            setHouseList([]);
            setVenueList([]);
        }
    }, [watchedYear]);

    // Fetch Sections when Class changes (and Type is CS)
    useEffect(() => {
        if (watchedYear && watchedClass && watchedType === 'CS') {
            const fetchSections = async () => {
                try {
                    const sections = await getSection(watchedYear, watchedClass);
                    setSectionList(sections || []);
                } catch (error) {
                    console.error("Failed to fetch sections", error);
                    toast.error("Failed to load sections");
                }
            };
            fetchSections();
        } else {
            setSectionList([]);
        }
    }, [watchedYear, watchedClass, watchedType]);


    const onSubmit = (data: VenueWiseParticipationReportFormSchema) => {
        generateReport.mutate(data, {
            onSuccess: (responseData) => {
                onReportGenerated(responseData || []);
                toast.success('Report generated successfully');
            },
            onError: (error) => {
                console.error("Report Generation Error:", error);
                toast.error('Failed to generate report');
            }
        });
    };

    // Helper for Select All
    const toggleAll = (list: any[], key: string, fieldName: any, checked: boolean) => {
        if (checked) {
            form.setValue(fieldName, list.map(item => ({ [key]: item[key] })));
        } else {
            form.setValue(fieldName, []);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Type Selection (Radio) */}
                <FormField
                    control={form.control}
                    name="Type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex justify-center space-x-4 p-4 border rounded-md bg-muted/20"
                                >
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="House" id="type-house" />
                                        <label htmlFor="type-house" className="font-normal cursor-pointer">
                                            By House
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="CS" id="type-cs" />
                                        <label htmlFor="type-cs" className="font-normal cursor-pointer">
                                            By Class/Section
                                        </label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Academic Year */}
                    <FormField
                        control={form.control}
                        name="ASMAY_Id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Academic Year <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Academic Year" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {dropdowns?.yearlist?.map((item) => (
                                            <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                {item.asmaY_Year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Class (Visible only for CS) */}
                    {watchedType === 'CS' && (
                        <FormField
                            control={form.control}
                            name="ASMCL_Id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class <span className="text-red-500">*</span></FormLabel>
                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Class" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {classList.map((item) => (
                                                <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                    {item.asmcL_ClassName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {/* Section (Visible only for CS - Multi Select) */}
                    {watchedType === 'CS' && (
                        <FormField
                            control={form.control}
                            name="selectedSectionlist"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Section Name <span className="text-red-500">*</span></FormLabel>
                                    <div className="border rounded-md p-2 bg-background">
                                        <div className="flex items-center space-x-2 p-2 border-b bg-muted/30">
                                            <Checkbox
                                                id="select-all-sections"
                                                checked={sectionList.length > 0 && field.value?.length === sectionList.length}
                                                onCheckedChange={(checked) => toggleAll(sectionList, 'asmS_Id', 'selectedSectionlist', !!checked)}
                                            />
                                            <label htmlFor="select-all-sections" className="text-sm font-medium">All</label>
                                        </div>
                                        <ScrollArea className="h-[150px] w-full p-2">
                                            {sectionList.length > 0 ? sectionList.map((item) => (
                                                <div key={item.asmS_Id} className="flex items-center space-x-3 mb-2">
                                                    <Checkbox
                                                        id={`section-${item.asmS_Id}`}
                                                        checked={field.value?.some(val => val.asmS_Id === item.asmS_Id)}
                                                        onCheckedChange={(checked) => {
                                                            const current = field.value || [];
                                                            if (checked) {
                                                                field.onChange([...current, { asmS_Id: item.asmS_Id }]);
                                                            } else {
                                                                field.onChange(current.filter(val => val.asmS_Id !== item.asmS_Id));
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor={`section-${item.asmS_Id}`} className="text-sm cursor-pointer">
                                                        {item.asmC_SectionName}
                                                    </label>
                                                </div>
                                            )) : <div className="text-muted-foreground text-sm p-2 text-center">No sections available</div>}
                                        </ScrollArea>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {/* House Name (Visible for both types) */}
                    <FormField
                        control={form.control}
                        name="selectedhouselist"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>House Name <span className="text-red-500">*</span></FormLabel>
                                <div className="border rounded-md p-2 bg-background">
                                    <div className="flex items-center space-x-2 p-2 border-b bg-muted/30">
                                        <Checkbox
                                            id="select-all-houses"
                                            checked={houseList.length > 0 && field.value?.length === houseList.length}
                                            onCheckedChange={(checked) => toggleAll(houseList, 'spccmH_Id', 'selectedhouselist', !!checked)}
                                        />
                                        <label htmlFor="select-all-houses" className="text-sm font-medium">All</label>
                                    </div>
                                    <ScrollArea className="h-[150px] w-full p-2">
                                        {houseList.length > 0 ? houseList.map((item) => (
                                            <div key={item.spccmH_Id} className="flex items-center space-x-3 mb-2">
                                                <Checkbox
                                                    id={`house-${item.spccmH_Id}`}
                                                    checked={field.value?.some(val => val.spccmH_Id === item.spccmH_Id)}
                                                    onCheckedChange={(checked) => {
                                                        const current = field.value || [];
                                                        if (checked) {
                                                            field.onChange([...current, { spccmH_Id: item.spccmH_Id }]);
                                                        } else {
                                                            field.onChange(current.filter(val => val.spccmH_Id !== item.spccmH_Id));
                                                        }
                                                    }}
                                                />
                                                <label htmlFor={`house-${item.spccmH_Id}`} className="text-sm cursor-pointer">
                                                    {item.spccmH_HouseName}
                                                </label>
                                            </div>
                                        )) : <div className="text-muted-foreground text-sm p-2 text-center">No houses available</div>}
                                    </ScrollArea>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Venue Name (Multi Select) */}
                    <FormField
                        control={form.control}
                        name="selectedVenuelist"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Venue Name <span className="text-red-500">*</span></FormLabel>
                                <div className="border rounded-md p-2 bg-background">
                                    <div className="flex items-center space-x-2 p-2 border-b bg-muted/30">
                                        <Checkbox
                                            id="select-all-venues"
                                            checked={venueList.length > 0 && field.value?.length === venueList.length}
                                            onCheckedChange={(checked) => toggleAll(venueList, 'spccmeV_Id', 'selectedVenuelist', !!checked)}
                                        />
                                        <label htmlFor="select-all-venues" className="text-sm font-medium">All</label>
                                    </div>
                                    <ScrollArea className="h-[150px] w-full p-2">
                                        {venueList.length > 0 ? venueList.map((item) => (
                                            <div key={item.spccmeV_Id} className="flex items-center space-x-3 mb-2">
                                                <Checkbox
                                                    id={`venue-${item.spccmeV_Id}`}
                                                    checked={field.value?.some(val => val.spccmeV_Id === item.spccmeV_Id)}
                                                    onCheckedChange={(checked) => {
                                                        const current = field.value || [];
                                                        if (checked) {
                                                            field.onChange([...current, { spccmeV_Id: item.spccmeV_Id }]);
                                                        } else {
                                                            field.onChange(current.filter(val => val.spccmeV_Id !== item.spccmeV_Id));
                                                        }
                                                    }}
                                                />
                                                <label htmlFor={`venue-${item.spccmeV_Id}`} className="text-sm cursor-pointer">
                                                    {item.spccmeV_EventVenue}
                                                </label>
                                            </div>
                                        )) : <div className="text-muted-foreground text-sm p-2 text-center">No venues available</div>}
                                    </ScrollArea>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

                <div className="flex justify-center gap-4">
                    <Button type="submit" disabled={generateReport.isPending} className="px-8">
                        {generateReport.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <i className="fa fa-list-alt mr-2" aria-hidden="true"></i>}
                        Report
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => {
                        form.reset();
                        setClassList([]);
                        setSectionList([]);
                        setHouseList([]);
                        setVenueList([]);
                        onReset();
                    }} className="px-8">
                        <i className="fa fa-times mr-2" aria-hidden="true"></i>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
};

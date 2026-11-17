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
import { Loader2, List, X, Search } from "lucide-react";
import { toast } from "sonner";
import { StudentAgeReportSchema, type StudentAgeReportFormSchema, type IStudentAgeReport, type IStudentAgeCalculationDropdowns } from "@/types/sports/reports/student-age-calculation";
import { useStudentAgeCalculationReport } from "@/hooks/sports/useStudentAgeCalculationReport";
import { getClassesForYear, getSectionsForClass } from "@/server/sports/reports/student-age-calculation";
import { Input } from "@/components/ui/input";

interface ReportFormProps {
    onReportGenerated: (data: IStudentAgeReport[]) => void;
    onReset: () => void;
}

export default function ReportForm({ onReportGenerated, onReset }: ReportFormProps) {
    const { initialData, generateReport } = useStudentAgeCalculationReport();

    const [classList, setClassList] = useState<IStudentAgeCalculationDropdowns['classList']>([]);
    const [sectionList, setSectionList] = useState<IStudentAgeCalculationDropdowns['sectionList']>([]);
    const [houseList, setHouseList] = useState<IStudentAgeCalculationDropdowns['houseList']>([]);

    const [houseFilter, setHouseFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');

    const form = useForm<StudentAgeReportFormSchema>({
        resolver: zodResolver(StudentAgeReportSchema),
        defaultValues: {
            type: 'House',
            asmaY_Id: undefined,
            spccmcC_Id: undefined,
            asmcL_Id: undefined,
            selectedSectionlist: [],
            selectedhouselist: [],
        },
    });

    const watchedType = useWatch({ control: form.control, name: 'type' });
    const watchedYear = useWatch({ control: form.control, name: 'asmaY_Id' });
    const watchedClass = useWatch({ control: form.control, name: 'asmcL_Id' });

    // Reset dependent fields when Type changes
    useEffect(() => {
        console.log("🔵 [UI] watchedType or initialData.houseList changed. watchedType =", watchedType);
        form.setValue('asmaY_Id', undefined as any);
        form.setValue('asmcL_Id', 0); // Legacy: asmcL_Id: 0 for House type
        form.setValue('selectedSectionlist', []);
        form.setValue('selectedhouselist', []);
        setClassList([]);
        setSectionList([]);
        setHouseList(initialData.data?.houseList || []);
        onReset();
    }, [watchedType, form, initialData.data?.houseList]);

    useEffect(() => {
        console.log("🔵 [UI] initialData Status:", initialData.status);
        if (initialData.data) {
            console.log("🔵 [UI] initialData received. Yearlist length =", initialData.data.yearlist?.length || 0);
        }
        if (initialData.error) {
            console.error("🔴 [UI] initialData Error:", initialData.error);
        }
    }, [initialData.status, initialData.data, initialData.error]);

    // Initial house list population
    useEffect(() => {
        if (initialData.data?.houseList) {
            setHouseList(initialData.data.houseList);
        }
    }, [initialData.data?.houseList]);

    // Fetch Classes and Houses when Year changes
    useEffect(() => {
        if (watchedYear) {
            const fetchData = async () => {
                try {
                    const data = await getClassesForYear(watchedYear);
                    setClassList(data.classList || []);
                    setHouseList(data.houseList || []);
                } catch (error) {
                    console.error("Failed to fetch classes/houses", error);
                    toast.error("Failed to load classes and houses");
                }
            };
            fetchData();
        } else {
            setClassList([]);
            form.setValue('asmcL_Id', 0);
        }
    }, [watchedYear, form]);

    // Fetch Sections when Class changes (and Type is CS)
    useEffect(() => {
        if (watchedYear && watchedClass && watchedClass !== 0 && watchedType === 'CS') {
            const fetchSections = async () => {
                try {
                    const data = await getSectionsForClass(watchedYear, watchedClass);
                    setSectionList(data.sectionList || []);
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

    const onSubmit = (data: StudentAgeReportFormSchema) => {
        // Prepare payload strictly matching legacy
        const payload = {
            ...data,
            asmcL_Id: data.type === 'House' ? 0 : data.asmcL_Id,
            selectedSectionlist: data.type === 'House' ? [] : data.selectedSectionlist,
        };

        generateReport.mutate(payload as any, {
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

    const handleCancel = () => {
        form.reset();
        setClassList([]);
        setSectionList([]);
        setHouseList(initialData.data?.houseList || []);
        onReset();
    };

    const toggleAll = (list: any[], key: string, fieldName: any, checked: boolean) => {
        if (checked) {
            form.setValue(fieldName, list.map(item => ({ [key]: item[key] })));
        } else {
            form.setValue(fieldName, []);
        }
    };

    const filteredHouses = houseList?.filter(h => h.spccmH_HouseName.toLowerCase().includes(houseFilter.toLowerCase())) || [];
    const filteredSections = sectionList?.filter(s => s.asmC_SectionName.toLowerCase().includes(sectionFilter.toLowerCase())) || [];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border p-6 rounded-lg bg-card shadow-sm">
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold">Student Age Calculation Report</h2>
                </div>

                {/* Type Selection */}
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex justify-center space-x-8 p-4 border rounded-md bg-muted/20"
                                >
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="House" id="type-house" />
                                        <label htmlFor="type-house" className="font-medium cursor-pointer">
                                            By House
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="CS" id="type-cs" />
                                        <label htmlFor="type-cs" className="font-medium cursor-pointer">
                                            By Class/Section
                                        </label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Academic Year */}
                        <FormField
                            control={form.control}
                            name="asmaY_Id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Academic Year <span className="text-red-500">*</span></FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value?.toString()}
                                        disabled={initialData.isLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={initialData.isLoading ? "Loading..." : "Select Academic Year"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {initialData.data?.yearlist?.map((item) => (
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

                        {/* Competition Category (Hidden if not used in legacy form, but keeping if it exists in data) */}
                        {initialData.data?.categoryList && initialData.data.categoryList.length > 0 && (
                            <FormField
                                control={form.control}
                                name="spccmcC_Id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Competition Category</FormLabel>
                                        <Select
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            value={field.value?.toString()}
                                            disabled={initialData.isLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={initialData.isLoading ? "Loading..." : "Select Category"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {initialData.data?.categoryList?.map((item) => (
                                                    <SelectItem key={item.spccmcC_Id} value={item.spccmcC_Id.toString()}>
                                                        {item.spccmcC_CompitionCategory}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Class (CS Only) */}
                        {watchedType === 'CS' && (
                            <FormField
                                control={form.control}
                                name="asmcL_Id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class <span className="text-red-500">*</span></FormLabel>
                                        <Select
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            value={(field.value && field.value !== 0) ? field.value.toString() : ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Class" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {classList?.map((item) => (
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
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* House Selection */}
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
                                                checked={houseList && houseList.length > 0 && field.value?.length === houseList.length}
                                                onCheckedChange={(checked) => toggleAll(houseList || [], 'spccmH_Id', 'selectedhouselist', !!checked)}
                                            />
                                            <label htmlFor="select-all-houses" className="text-sm font-medium">All</label>
                                            <div className="relative ml-auto w-1/2">
                                                <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search..."
                                                    className="h-7 pl-8 text-xs"
                                                    value={houseFilter}
                                                    onChange={(e) => setHouseFilter(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <ScrollArea className="h-[150px] w-full p-2">
                                            {filteredHouses.length > 0 ? filteredHouses.map((item) => (
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
                                                    <label htmlFor={`house-${item.spccmH_Id}`} className="text-sm cursor-pointer hover:text-primary">
                                                        {item.spccmH_HouseName}
                                                    </label>
                                                </div>
                                            )) : <div className="text-muted-foreground text-sm p-4 text-center">No houses found</div>}
                                        </ScrollArea>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Section Selection (CS Only) */}
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
                                                    checked={sectionList && sectionList.length > 0 && field.value?.length === sectionList.length}
                                                    onCheckedChange={(checked) => toggleAll(sectionList || [], 'asmS_Id', 'selectedSectionlist', !!checked)}
                                                />
                                                <label htmlFor="select-all-sections" className="text-sm font-medium">All</label>
                                                <div className="relative ml-auto w-1/2">
                                                    <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                                                    <Input
                                                        placeholder="Search..."
                                                        className="h-7 pl-8 text-xs"
                                                        value={sectionFilter}
                                                        onChange={(e) => setSectionFilter(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <ScrollArea className="h-[150px] w-full p-2">
                                                {filteredSections.length > 0 ? filteredSections.map((item) => (
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
                                                        <label htmlFor={`section-${item.asmS_Id}`} className="text-sm cursor-pointer hover:text-primary">
                                                            {item.asmC_SectionName}
                                                        </label>
                                                    </div>
                                                )) : <div className="text-muted-foreground text-sm p-4 text-center">No sections found</div>}
                                            </ScrollArea>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                </div>

                <div className="flex justify-center gap-4 pt-6 border-t">
                    <Button type="submit" disabled={generateReport.isPending} className="px-10">
                        {generateReport.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <List className="mr-2 h-4 w-4" />}
                        Report
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleCancel} className="px-10">
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}

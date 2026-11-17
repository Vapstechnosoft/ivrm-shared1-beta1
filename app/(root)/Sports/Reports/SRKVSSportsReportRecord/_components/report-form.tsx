'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useSRKVSSportsReportRecord } from '@/hooks/sports/useSRKVSSportsReportRecord';
import {
    SRKVSSportsReportRecordFormSchema,
    SRKVSSportsReportRecordSchema,
    ISRKVSReportData,
} from '@/types/sports/reports/srkvs-sports-report-record';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DatePicker } from '@/components/ui/date-picker';

interface ReportFormProps {
    onReportGenerated: (data: ISRKVSReportData[]) => void;
    onTypeChange: (type: any) => void;
}

export const ReportForm = ({ onReportGenerated, onTypeChange }: ReportFormProps) => {
    const { loadData, generateReport } = useSRKVSSportsReportRecord();
    const { data: dropdowns, isLoading: isDropdownsLoading } = loadData;

    const form = useForm<SRKVSSportsReportRecordFormSchema>({
        resolver: zodResolver(SRKVSSportsReportRecordSchema),
        defaultValues: {
            Type: 'Record',
            ASMAY_Id: undefined,
            SPCCME_Id: undefined,
            selectedCompetitionLevels: [],
            selectedCategories: [],
            selectedSubSubEvents: [],
        },
    });

    const watchedType = useWatch({ control: form.control, name: 'Type' });
    const watchedEvent = useWatch({ control: form.control, name: 'SPCCME_Id' });
    const isMultiSelectType = watchedType === 'Record' || watchedType === 'Start';
    const showLevelAndCategory = watchedType && watchedEvent;

    // Propagate type change up and reset fields
    useEffect(() => {
        onTypeChange(watchedType);

        // Reset dependent fields when Type changes
        form.setValue('selectedCompetitionLevels', []);
        form.setValue('selectedCategories', []);
        form.setValue('spccmcL_Id', undefined);
        form.setValue('spccmcC_Id', undefined);
        // Reset other conditionals if needed
        form.setValue('spccmsccG_Id', undefined);
        form.setValue('spccmscC_Id', undefined);
        form.setValue('spccmsccG_Idsub', undefined);
        form.setValue('selectedSubSubEvents', []);

    }, [watchedType, onTypeChange, form]);

    const onSubmit = (data: SRKVSSportsReportRecordFormSchema) => {
        generateReport.mutate(data, {
            onSuccess: (responseData) => {
                onReportGenerated(responseData || []);
                toast.success('Report generated successfully');
            },
            onError: (error) => {
                console.error(error);
                toast.error('Failed to generate report');
            },
        });
    };

    if (isDropdownsLoading) {
        return <div>Loading form data...</div>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-md shadow-sm bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Academic Year */}
                    <FormField
                        control={form.control}
                        name="ASMAY_Id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Academic Year <span className="text-red-500">*</span></FormLabel>
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Academic Year" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {dropdowns?.academicYear.map((item) => (
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

                    {/* Event */}
                    <FormField
                        control={form.control}
                        name="SPCCME_Id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event <span className="text-red-500">*</span></FormLabel>
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Event" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {dropdowns?.masterEvents.map((item) => (
                                            <SelectItem key={item.spccmE_Id} value={item.spccmE_Id.toString()}>
                                                {item.spccmE_EventName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Result Type */}
                    <FormField
                        control={form.control}
                        name="Type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Result <span className="text-red-500">*</span></FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Result Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Record">Records</SelectItem>
                                        <SelectItem value="Start">Start List</SelectItem>
                                        <SelectItem value="Finish">Finish</SelectItem>
                                        <SelectItem value="Consolidated">Consolidated</SelectItem>
                                        <SelectItem value="Indoor">Indoor</SelectItem>
                                        <SelectItem value="Outdoor">Outdoor</SelectItem>
                                        <SelectItem value="Team">Team</SelectItem>
                                        <SelectItem value="Externals">Externals</SelectItem>
                                        <SelectItem value="Selection">Selection</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Competition Level - Multi or Single */}
                    {showLevelAndCategory && (
                        <>
                            {isMultiSelectType ? (
                                <FormField
                                    control={form.control}
                                    name="selectedCompetitionLevels"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-2">
                                                <FormLabel>Competition Level <span className="text-red-500">*</span></FormLabel>
                                            </div>
                                            <ScrollArea className="h-[150px] w-full border rounded-md p-2">
                                                {dropdowns?.competitionLevels.map((item) => (
                                                    <FormField
                                                        key={item.spccmcL_Id}
                                                        control={form.control}
                                                        name="selectedCompetitionLevels"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={item.spccmcL_Id}
                                                                    className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.some(val => val.spccmcL_Id === item.spccmcL_Id)}
                                                                            onCheckedChange={(checked) => {
                                                                                const current = field.value || [];
                                                                                return checked
                                                                                    ? field.onChange([...current, { spccmcL_Id: item.spccmcL_Id }])
                                                                                    : field.onChange(current.filter(val => val.spccmcL_Id !== item.spccmcL_Id));
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">
                                                                        {item.spccmcL_CompitionLevel}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                ))}
                                            </ScrollArea>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="spccmcL_Id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Competition Level <span className="text-red-500">*</span></FormLabel>
                                            <Select
                                                onValueChange={(val) => field.onChange(Number(val))}
                                                value={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Competition Level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {dropdowns?.competitionLevels.map((item) => (
                                                        <SelectItem key={item.spccmcL_Id} value={item.spccmcL_Id.toString()}>
                                                            {item.spccmcL_CompitionLevel}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Competition Category - Multi or Single */}
                            {isMultiSelectType ? (
                                <FormField
                                    control={form.control}
                                    name="selectedCategories"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-2">
                                                <FormLabel>Competition Category <span className="text-red-500">*</span></FormLabel>
                                            </div>
                                            <ScrollArea className="h-[150px] w-full border rounded-md p-2">
                                                {dropdowns?.categories.map((item) => (
                                                    <FormField
                                                        key={item.spccmcC_Id}
                                                        control={form.control}
                                                        name="selectedCategories"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={item.spccmcC_Id}
                                                                    className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.some(val => val.spccmcC_Id === item.spccmcC_Id)}
                                                                            onCheckedChange={(checked) => {
                                                                                const current = field.value || [];
                                                                                return checked
                                                                                    ? field.onChange([...current, { spccmcC_Id: item.spccmcC_Id }])
                                                                                    : field.onChange(current.filter(val => val.spccmcC_Id !== item.spccmcC_Id));
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">
                                                                        {item.spccmcC_CompitionCategory}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                ))}
                                            </ScrollArea>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="spccmcC_Id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Competition Category <span className="text-red-500">*</span></FormLabel>
                                            <Select
                                                onValueChange={(val) => field.onChange(Number(val))}
                                                value={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {dropdowns?.categories.map((item) => (
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
                        </>
                    )}

                    {/* Meet Year */}
                    <FormField
                        control={form.control}
                        name="Meet_Year"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Meet Year</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Meet Year" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* From Date */}
                    <FormField
                        control={form.control}
                        name="FromDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <DatePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                        placeholder="Select Date"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Conditional Event Fields */}
                    {(watchedType === 'Start' || watchedType === 'Finish' || watchedType === 'Indoor' || watchedType === 'Outdoor' || watchedType === 'Team' || watchedType === 'Externals') && (
                        <>
                            {/* <FormField
                                control={form.control}
                                name="spccmsccG_Id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Main Event <span className="text-red-500">*</span></FormLabel>
                                        <Select
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Main Event" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {dropdowns?.mainEvents.map((item) => (
                                                    <SelectItem key={item.spccmsccG_Id} value={item.spccmsccG_Id.toString()}>
                                                        {item.spccmsccG_SportsCCGroupName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}


                            {/* <FormField
                                control={form.control}
                                name="spccmscC_Id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sub Event <span className="text-red-500">*</span></FormLabel>
                                        <Select
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Sub Event" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {dropdowns?.subEvents.map((item) => (
                                                    <SelectItem key={item.spccmscC_Id} value={item.spccmscC_Id.toString()}>
                                                        {item.spccmscC_SportsCCName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                        </>
                    )}

                </div>

                <div className="flex justify-center gap-2">
                    <Button type="submit" disabled={generateReport.isPending}>
                        {generateReport.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <i className="fa fa-list-alt mr-2" aria-hidden="true"></i>}
                        Report
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => form.reset()}>
                        <i className="fa fa-times mr-2" aria-hidden="true"></i>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
};

'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "@/components/ui/date-picker";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EventsMappingSchema, EventsMappingFormSchema, IEventsMappingDropdowns, IEventsMappingData } from "@/types/sports/events-mapping";
import { useEventsMapping } from "@/hooks/sports/useEventsMapping";

interface MappingFormProps {
    dropdowns: IEventsMappingDropdowns;
    onSuccess: () => void;
    editData?: IEventsMappingData | null;
    onCancel: () => void;
}

export const MappingForm = ({ dropdowns, onSuccess, editData, onCancel }: MappingFormProps) => {
    const { saveData } = useEventsMapping();

    const form = useForm<EventsMappingFormSchema>({
        resolver: zodResolver(EventsMappingSchema),
        defaultValues: {
            ASMAY_Id: undefined,
            SPCCME_Id: undefined,
            SPCCMEV_Id: undefined,
            SPCCE_Remarks: '',
            SPCCE_StartDate: undefined,
            SPCCE_EndDate: undefined,
            SPCCE_StartTime: '',
            SPCCE_EndTime: '',
            SPCCE_SponsorFlag: false,
            selectedSponsors: [],
        },
    });

    useEffect(() => {
        if (editData) {
            // Populate form with edit data (mocking population logic)
            // In a real app, map IEventsMappingData to FormSchema
            form.reset({
                ASMAY_Id: undefined, // Need ID mapping
                SPCCME_Id: undefined,
                SPCCMEV_Id: undefined,
                SPCCE_Remarks: editData.spccE_Remarks,
                SPCCE_StartDate: new Date(editData.spccE_StartDate),
                SPCCE_EndDate: new Date(editData.spccE_EndDate),
                SPCCE_StartTime: editData.spccE_StartTime,
                SPCCE_EndTime: editData.spccE_EndTime,
                SPCCE_SponsorFlag: editData.spccE_SponsorFlag,
                selectedSponsors: [],
            });
            toast.info("Edit mode loaded with mock data (IDs not mapped)");
        }
    }, [editData, form]);

    const watchedSponsorFlag = useWatch({ control: form.control, name: 'SPCCE_SponsorFlag' });

    const onSubmit = (data: EventsMappingFormSchema) => {
        saveData.mutate(data, {
            onSuccess: (result) => {
                toast.success('Record Saved Successfully');
                form.reset();
                onSuccess();
            },
            onError: (error) => {
                toast.error('Failed to save record');
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                                            <SelectValue placeholder="--Select--" />
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

                    {/* Venue */}
                    <FormField
                        control={form.control}
                        name="SPCCMEV_Id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Venue <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="--Select--" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {dropdowns?.venueList.map((item) => (
                                            <SelectItem key={item.spccmeV_Id} value={item.spccmeV_Id.toString()}>
                                                {item.spccmeV_EventVenue}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Event Name */}
                    <FormField
                        control={form.control}
                        name="SPCCME_Id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event /Competition Name <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="--Select--" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {dropdowns?.eventsList.map((item) => (
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

                    {/* Remarks */}
                    <FormField
                        control={form.control}
                        name="SPCCE_Remarks"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Remarks</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter Remarks..." className="resize-none" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Date */}
                    <FormField
                        control={form.control}
                        name="SPCCE_StartDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <DatePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                        placeholder="Select date..."
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* End Date */}
                    <FormField
                        control={form.control}
                        name="SPCCE_EndDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Date <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <DatePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                        placeholder="Select date..."
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Start Time */}
                    <FormField
                        control={form.control}
                        name="SPCCE_StartTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* End Time */}
                    <FormField
                        control={form.control}
                        name="SPCCE_EndTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sponsor Flag */}
                    <FormField
                        control={form.control}
                        name="SPCCE_SponsorFlag"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Sponsor Flag
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Sponsor List (Conditional) */}
                    {watchedSponsorFlag && (
                        <FormField
                            control={form.control}
                            name="selectedSponsors"
                            render={() => (
                                <FormItem>
                                    <div className="mb-2">
                                        <FormLabel>Sponsor <span className="text-red-500">*</span></FormLabel>
                                    </div>
                                    <ScrollArea className="h-[150px] w-full border rounded-md p-2">
                                        {dropdowns?.sponsorList.map((item) => (
                                            <FormField
                                                key={item.spccmsP_Id}
                                                control={form.control}
                                                name="selectedSponsors"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item.spccmsP_Id}
                                                            className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.some(val => val.spccmsP_Id === item.spccmsP_Id)}
                                                                    onCheckedChange={(checked) => {
                                                                        const current = field.value || [];
                                                                        return checked
                                                                            ? field.onChange([...current, { spccmsP_Id: item.spccmsP_Id }])
                                                                            : field.onChange(current.filter(val => val.spccmsP_Id !== item.spccmsP_Id));
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                {item.spccmsP_SponsorName}
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
                    )}
                </div>

                <div className="flex justify-center gap-2">
                    <Button type="submit" disabled={saveData.isPending}>
                        {saveData.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <i className="fa fa-floppy-o mr-2" aria-hidden="true"></i>}
                        Save
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => {
                        form.reset();
                        onCancel();
                    }}>
                        <i className="fa fa-times mr-2" aria-hidden="true"></i>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
};

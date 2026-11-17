"use client";


import { mappingEventCoeSchema } from "@/schemas/coe/master";
import { MappedEventCoe } from "@/types/coe/master-coe";
import { MasterEventCoe } from "@/types/coe/masterevent";
import { IMasterFeeClassDropDownList } from "@/types/fees/masters/masters";
import { IFeeAcademicYearDropdownList } from "@/types/fees/reports/reports";
import { IMasterDepartmentList } from "@/types/hrms/hrms-config/master";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Trash2, X, Eye, Upload, Minus } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMasterEventCoe } from "@/hooks/coe/usemMaster";
import { useFeeDefaulterReport } from "@/hooks/fees/useReports";
import { useStudentClassDropDown } from "@/hooks/fees/useMasters";
import { useMasterDepartment } from "@/hooks/hrms/useMasters";
import { EventDetailsById, saveMappedEvent } from "@/server/coe/masters/masterevent";


type FormValues = z.infer<typeof mappingEventCoeSchema.addOrUpdate>;

interface MappingFormProps {
    initialData?: MappedEventCoe;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function MappingForm({ initialData, onSuccess, onCancel }: MappingFormProps) {
    const { data: eventListData, isLoading: eventLoading } = useMasterEventCoe();
    const { data: academicYearData, isLoading: yearLoading } = useFeeDefaulterReport();
    const { data: classData, isLoading: classLoading } = useStudentClassDropDown(true);
    const { data: departmentData, isLoading: deptLoading } = useMasterDepartment();
    const { refetchAll } = useMasterEventCoe();

    const events: MasterEventCoe[] = eventListData?.data && Array.isArray(eventListData.data) ? eventListData.data : [];
    const academicYears: IFeeAcademicYearDropdownList[] = academicYearData?.data && Array.isArray(academicYearData.data) ? academicYearData.data : [];
    const classes: IMasterFeeClassDropDownList[] = classData?.data && Array.isArray(classData.data) ? classData.data : [];
    const departments: IMasterDepartmentList[] = departmentData?.data && Array.isArray(departmentData.data) ? departmentData.data : [];

    const isLoading = eventLoading || yearLoading || classLoading || deptLoading;
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    // Derived state for read-only fields (from getEventDetails
    const [eventDetails, setEventDetails] = useState<{
        smsMessage: string;
        mailSubject: string;
        mailHeader: string;
        mailFooter: string;
        mailMessage: string;
    } | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(mappingEventCoeSchema.addOrUpdate),
        defaultValues: {
            asmaY_Id: initialData?.asmaY_Id,
            coemE_Id: initialData?.coemE_Id,
            startDate: initialData?.coee_EStartDate ? new Date(initialData.coee_EStartDate) : undefined,
            endDate: initialData?.coee_EEndDate ? new Date(initialData.coee_EEndDate) : undefined,
            startTime: initialData?.coee_EStartTime ? new Date(`1970-01-01T${initialData.coee_EStartTime}`) : undefined,
            endTime: initialData?.coee_EEndTime ? new Date(`1970-01-01T${initialData.coee_EEndTime}`) : undefined,
            reminderDate: initialData?.coee_ReminderDate ? new Date(initialData.coee_ReminderDate) : undefined,
            reminderSchedule: initialData?.coee_ReminderSchedule || "",
            smsActiveFlag: initialData?.coee_SMSActiveFlag || false,
            mailActiveFlag: initialData?.coee_MailActiveFlag || false,
            repeatFlag: initialData?.coee_RepeatFlag || false,
            studentFlag: initialData?.coee_StudentFlag || false,
            alumniFlag: initialData?.coee_AlumniFlag || false,
            employeeFlag: initialData?.coee_EmployeeFlag || false,
            otherFlag: initialData?.coee_OtherFlag || false,
            classes: initialData?.stu_class_list?.map(c => c.asmcL_Id) || [],
            staffTypes: initialData?.emp_type_list?.map(s => s.hrmD_Id) || [],
            others: initialData?.others_list || [],
            uploads: initialData?.images_listCoe?.map(img => ({ name: img.COEEI_Images, fileKey: img.COEEI_Images })) || [],
            videos: initialData?.videos_list?.map(vid => ({ name: vid.COEEV_Videos, url: vid.COEEV_Videos })) || [],
            coee_Id: initialData?.coee_Id || 0,
            mailTemplate: initialData?.coee_MailHTMLTemplate || "",
            reminderDays: initialData?.coee_ReminderDays || "",
        },
    });

    const { fields: otherFields, append: appendOther, remove: removeOther } = useFieldArray({
        control: form.control,
        name: "others",
    });

    const { fields: uploadFields, append: appendUpload, remove: removeUpload } = useFieldArray({
        control: form.control,
        name: "uploads",
    });

    const { fields: videoFields, append: appendVideo, remove: removeVideo } = useFieldArray({
        control: form.control,
        name: "videos",
    });

    const asmaY_Id = form.watch("asmaY_Id");
    const watchEventId = form.watch("coemE_Id");
    const watchStudentFlag = form.watch("studentFlag");
    const watchEmployeeFlag = form.watch("employeeFlag");
    const watchAlumniFlag = form.watch("alumniFlag");
    const watchOtherFlag = form.watch("otherFlag");
    const watchRepeatFlag = form.watch("repeatFlag");

    // Ensure at least one row exists for uploads and videos
    useEffect(() => {
        if (uploadFields.length === 0) {
            appendUpload({ name: "", fileKey: "" });
        }
        if (videoFields.length === 0) {
            appendVideo({ name: "", url: "" });
        }
    }, [uploadFields.length, videoFields.length, appendUpload, appendVideo]);

    // Fetch event details when Event ID changes
    useEffect(() => {
        const fetchDetails = async () => {
            if (watchEventId) {
                setIsLoadingDetails(true);
                const res = await EventDetailsById(watchEventId);
                // biome-ignore lint/complexity/useOptionalChain: <explanation>
                if (res && res.data && res.data.length > 0) {
                    
                    const details = res.data[0];
                    setEventDetails({
                        smsMessage: details.coemE_SMSMessage,
                        mailSubject: details.coemE_MailSubject,
                        mailHeader: details.coemE_MailHeader,
                        mailFooter: details.coemE_MailFooter,
                        mailMessage: details.coemE_Mail_Message,
                    });
                    // Update form field for editing
                    form.setValue("mailTemplate", details.coemE_MailHTMLTemplate || "");

                }
                setIsLoadingDetails(false);
            }
        };
        fetchDetails();
    }, [watchEventId]);

    const [uploadingFiles, setUploadingFiles] = useState<Record<number, boolean>>({});

    const handleFileUpload = async (index: number, file: File) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploadingFiles(prev => ({ ...prev, [index]: true }));
        try {
            // Import dynamically or ensure it's imported at the top. 
            // Assuming we'll add the import at the top of the file.
            const { uploadDocument } = await import("@/server/document_upload");

            const response = await uploadDocument(formData);

            if (response.success && response.data) {
                // Update file key
                form.setValue(`uploads.${index}.fileKey`, response.data);

                // Auto-fill name if empty
                const currentName = form.getValues(`uploads.${index}.name`);
                if (!currentName) {
                    form.setValue(`uploads.${index}.name`, file.name);
                }
                toast.success("File uploaded successfully");
            } else {
                toast.error("Failed to upload file");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Error uploading file");
        } finally {
            setUploadingFiles(prev => ({ ...prev, [index]: false }));
        }
    };

    const handleDeleteUpload = async (index: number) => {
        const fileKey = form.getValues(`uploads.${index}.fileKey`);

        if (fileKey) {
            // If there's a file key, try to delete from server
            try {
                const { deleteDocument } = await import("@/server/document_upload");
                const response = await deleteDocument(fileKey);
                if (!response.success) {
                    toast.warning("File removed from list but cleanup on server failed");
                }
            } catch (error) {
                console.error("Delete error:", error);
                // We still remove it from the list even if server delete fails, 
                // but maybe warn the user?
            }
        }

        removeUpload(index);
    };

    const [uploadingVideos, setUploadingVideos] = useState<Record<number, boolean>>({});

    const handleVideoUpload = async (index: number, file: File) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploadingVideos(prev => ({ ...prev, [index]: true }));
        try {
            const { uploadDocument } = await import("@/server/document_upload");

            const response = await uploadDocument(formData);

            if (response.success && response.data) {
                // Update file key/url
                form.setValue(`videos.${index}.url`, response.data);

                // Auto-fill name if empty
                const currentName = form.getValues(`videos.${index}.name`);
                if (!currentName) {
                    form.setValue(`videos.${index}.name`, file.name);
                }
                toast.success("Video uploaded successfully");
            } else {
                toast.error("Failed to upload video");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Error uploading video");
        } finally {
            setUploadingVideos(prev => ({ ...prev, [index]: false }));
        }
    };

    const handleDeleteVideo = async (index: number) => {
        const fileKey = form.getValues(`videos.${index}.url`);

        if (fileKey) {
            try {
                const { deleteDocument } = await import("@/server/document_upload");
                const response = await deleteDocument(fileKey);
                if (!response.success) {
                    toast.warning("Video removed from list but cleanup on server failed");
                }
            } catch (error) {
                console.error("Delete error:", error);
            }
        }

        removeVideo(index);
    };

    const onSubmit = async (data: FormValues) => {
        if (asmaY_Id === null || asmaY_Id === undefined) {
            toast.error("Please select academic year");
            return;
        }
        if (data.coemE_Id === 0 || data.coemE_Id === undefined || data.coemE_Id === null) {
            toast.error("Please select event Name");
            return;
        }

        if (data.startDate === undefined || data.startDate === null) {
            toast.error("Please select event start date");
            return;
        }

        if (data.mailTemplate === undefined || data.mailTemplate === null || data.mailTemplate === "") {
            toast.error("Please select mail template");
            return;
        }

        if (data.endDate === undefined || data.endDate === null) {
            toast.error("Please select event end date");
            return;
        }

        if (data.startTime === undefined || data.startTime === null) {
            toast.error("Please select event start time");
            return;
        }

        if (data.endTime === undefined || data.endTime === null) {
            toast.error("Please select event end time");
            return;
        }

        console.log("Form Data:", data);
        const payload = {
            ASMAY_Id: data.asmaY_Id,
            COEME_Id: data.coemE_Id,
            COEE_Id: data.coee_Id,
            COEE_EStartDate: data.startDate ? data.startDate.toISOString() : null,
            COEE_EEndDate: data.endDate ? data.endDate.toISOString() : null,
            COEE_EStartTime: data.startTime ? format(data.startTime, "h:mm a") : "",
            COEE_EEndTime: data.endTime ? format(data.endTime, "h:mm a") : "",
            COEE_ReminderDate: data.reminderDate ? data.reminderDate.toISOString() : null,
            COEE_ReminderSchedule: data.reminderSchedule,
            COEE_ReminderDays: data.reminderDays,
            COEE_SMSActiveFlag: data.smsActiveFlag,
            COEE_MailActiveFlag: data.mailActiveFlag,
            COEE_RepeatFlag: data.repeatFlag,
            COEE_StudentFlag: data.studentFlag,
            COEE_AlumniFlag: data.alumniFlag,
            COEE_EmployeeFlag: data.employeeFlag,
            COEE_OtherFlag: data.otherFlag,
            COEE_ManagementFlag: false, // Defaulting as it wasn't in form state explicitly but present effectively in payload
            COEE_SMSMessage: eventDetails?.smsMessage || "",
            COEE_MailSubject: eventDetails?.mailSubject || "",
            COEE_MailHeader: eventDetails?.mailHeader || "",
            COEE_MailFooter: eventDetails?.mailFooter || "",
            COEE_Mail_Message: eventDetails?.mailMessage || "",
            COEE_MailHTMLTemplate: data.mailTemplate || "",

            // COEEC_Id: 0,
            // ASMCL_Id: 0,
            // COEEE_Id: 0,
            // HRMD_Id: 0,
            // ASMCL_ClassName: "",
            // HRMD_DepartmentName: "",

            stu_class_list: data.classes?.map(id => ({ ASMCL_Id: id })) || [],
            emp_type_list: data.staffTypes?.map(id => ({ HRMD_Id: id })) || [],
            others_list: data.others?.map(o => ({
                COEEO_Name: o.name,
                COEEO_MobileNo: Number(o.mobile),
                COEEO_Emailid: o.email
            })) || [],
            images_listCoe: data.uploads?.map(u => ({
                COEEI_Images: u.fileKey || u.name,
                COEEI_Id: 0,
                COEE_Id: data.coee_Id || 0
            })) || [],
            videos_list: data.videos?.map(v => v.url || v.name) || [],
        };
        console.log("Payload:", payload);
        const response = await saveMappedEvent(payload);
        console.log("Response:", response);
        if (response.success) {
            toast.success(response.message);
            onSuccess?.();
            refetchAll();
        } else {
            toast.error(response.message);
        }
    };

    const eventOptions = useMemo(() =>
        events.map(e => ({ label: e.coemE_EventName, value: e.coemE_Id.toString() }))
        , [events]);

    const academicYearOptions = useMemo(() =>
        academicYears.map(y => ({ label: y.asmaY_Year, value: y.asmaY_Id.toString() }))
        , [academicYears]);

    const classOptions = useMemo(() =>
        classes.map(c => ({ label: c.asmcL_ClassName, value: c.asmcL_Id.toString() }))
        , [classes]);

    const staffTypeOptions = useMemo(() =>
        departments.map(d => ({ label: d.hrmD_DepartmentName, value: d.hrmD_Id.toString() }))
        , [departments]);

    if (isLoading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log("Form Validation Errors:", errors);
                toast.error("Please fill in all required fields correctly.");
            })} className="space-y-4">
                {/* Row 1: Academic Year & Event Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <FormField
                        control={form.control}
                        name="asmaY_Id"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <FormLabel className="text-right">Academic Year: <span className="text-destructive">*</span></FormLabel>
                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="--Select--" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {academicYearOptions.map((year) => (
                                                <SelectItem key={year.value} value={year.value}>
                                                    {year.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage className="ml-[156px]" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="coemE_Id"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <FormLabel className="text-right">Event Name: <span className="text-destructive">*</span></FormLabel>
                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="--Select--" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {eventOptions.map((event) => (
                                                <SelectItem key={event.value} value={event.value}>
                                                    {event.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage className="ml-[156px]" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Row 2: Email Subject & Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <FormItem>
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <FormLabel className="text-right">Email Subject: <span className="text-destructive">*</span></FormLabel>
                            <Input value={eventDetails?.mailSubject || ""} disabled className="bg-muted/50" />
                        </div>
                    </FormItem>
                    <FormItem>
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <FormLabel className="text-right">Email Header: <span className="text-destructive">*</span></FormLabel>
                            <Input value={eventDetails?.mailHeader || ""} disabled className="bg-muted/50" />
                        </div>
                    </FormItem>
                </div>

                {/* Row 3: Email Footer & Message */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <FormItem>
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <FormLabel className="text-right">Email Footer: <span className="text-destructive">*</span></FormLabel>
                            <Input value={eventDetails?.mailFooter || ""} disabled className="bg-muted/50" />
                        </div>
                    </FormItem>
                    <FormItem>
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <FormLabel className="text-right">Email Message:</FormLabel>
                            <Input value={eventDetails?.mailMessage || ""} disabled className="bg-muted/50" />
                        </div>
                    </FormItem>
                </div>

                {/* Row 4: SMS Message & Email Template (Editable) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <FormItem>
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <FormLabel className="text-right">SMS Message:</FormLabel>
                            <Input value={eventDetails?.smsMessage || ""} disabled className="bg-muted/50" />
                        </div>
                    </FormItem>
                    <FormField
                        control={form.control}
                        name="mailTemplate"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <FormLabel className="text-right">Email Template: <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Email Template" />
                                    </FormControl>
                                </div>
                                <FormMessage className="ml-[156px]" />
                            </FormItem>
                        )}
                    />
                </div>


                {/* Row 5: Start Date & End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <FormLabel className="text-right">Start Date: <span className="text-destructive">*</span></FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    <span suppressHydrationWarning>{field.value ? format(field.value, "PPP") : "Enter date"}</span>
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <FormMessage className="ml-[156px]" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <FormLabel className="text-right">End Date: <span className="text-destructive">*</span></FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    <span suppressHydrationWarning>{field.value ? format(field.value, "PPP") : "Enter date"}</span>
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus required />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <FormMessage className="ml-[156px]" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Row 6: Start Time & End Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <FormLabel className="text-right">Start Time:</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center border rounded-md px-3 py-2 bg-background">
                                            <input
                                                type="time"
                                                suppressHydrationWarning
                                                className="w-full bg-transparent outline-none"
                                                value={field.value ? format(field.value, "HH:mm") : ""}
                                                onChange={(e) => {
                                                    const date = new Date();
                                                    const [hours, minutes] = e.target.value.split(':');
                                                    date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
                                                    field.onChange(date);
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                </div>
                                <FormMessage className="ml-[156px]" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <FormLabel className="text-right">End Time:</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center border rounded-md px-3 py-2 bg-background">
                                            <input
                                                type="time"
                                                suppressHydrationWarning
                                                className="w-full bg-transparent outline-none"
                                                value={field.value ? format(field.value, "HH:mm") : ""}
                                                onChange={(e) => {
                                                    const date = new Date();
                                                    const [hours, minutes] = e.target.value.split(':');
                                                    date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
                                                    field.onChange(date);
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                </div>
                                <FormMessage className="ml-[156px]" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Row 7: Reminder Days & Reminder Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <FormField
                        control={form.control}
                        name="reminderDays"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <FormLabel className="text-right">Reminder Days:</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="" />
                                    </FormControl>
                                </div>
                                <FormMessage className="ml-[156px]" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="reminderDate"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <FormLabel className="text-right">Reminder Date:</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    <span suppressHydrationWarning>{field.value ? format(field.value, "PPP") : "Enter date"}</span>
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <FormMessage className="ml-[156px]" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Row 8: Flags (Email/SMS) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <FormField
                        control={form.control}
                        name="mailActiveFlag"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <FormLabel className="text-right">Email:</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={(val) => field.onChange(val === "true")}
                                            defaultValue={field.value ? "true" : "false"}
                                            className="flex flex-row space-x-4"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="true" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Yes</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="false" />
                                                </FormControl>
                                                <FormLabel className="font-normal">No</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="smsActiveFlag"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <FormLabel className="text-right">SMS: <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={(val) => field.onChange(val === "true")}
                                            defaultValue={field.value ? "true" : "false"}
                                            className="flex flex-row space-x-4"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="true" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Yes</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="false" />
                                                </FormControl>
                                                <FormLabel className="font-normal">No</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Row 9: Uploads & Videos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Uploads Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-lg text-blue-600 mb-2">Upload File</h4>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">SL NO</TableHead>
                                        <TableHead>Upload File</TableHead>
                                        <TableHead>File Name</TableHead>
                                        <TableHead>View</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {uploadFields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Input
                                                        type="file"
                                                        id={`file-upload-${index}`}
                                                        className="hidden"
                                                        disabled={uploadingFiles[index]}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleFileUpload(index, file);
                                                            }
                                                            e.target.value = "";
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => document.getElementById(`file-upload-${index}`)?.click()}
                                                        disabled={uploadingFiles[index]}
                                                    >
                                                        {uploadingFiles[index] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {/* Using watch to get the current value for display as field.name might be stale or initial */}
                                                <Input
                                                    value={form.watch(`uploads.${index}.name`) || ""}
                                                    disabled
                                                    placeholder="No file selected"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {form.watch(`uploads.${index}.fileKey`) && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"

                                                        onClick={() => {
                                                            const key = form.getValues(`uploads.${index}.fileKey`);

                                                            window.open(key, '_blank');
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-1">
                                                    {uploadFields.length < 30 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => appendUpload({ name: "", fileKey: "" })}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteUpload(index)}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {uploadFields.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground">No files added</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Videos Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-lg text-blue-600 mb-2">Videos</h4>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">SL NO</TableHead>
                                        <TableHead>Upload/URL</TableHead>
                                        <TableHead>Video Name</TableHead>
                                        <TableHead>View</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {videoFields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Input
                                                        type="file"
                                                        id={`video-upload-${index}`}
                                                        className="hidden"
                                                        accept="video/*"
                                                        disabled={uploadingVideos[index]}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleVideoUpload(index, file);
                                                            }
                                                            e.target.value = "";
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => document.getElementById(`video-upload-${index}`)?.click()}
                                                        disabled={uploadingVideos[index]}
                                                    >
                                                        {uploadingVideos[index] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {/* For videos, user might want to edit name if they uploaded it? 
                                                     User reference had disabled input. I'll stick to disabled for consistency with Uploads. */}
                                                <Input
                                                    value={form.watch(`videos.${index}.name`) || ""}
                                                    disabled
                                                    placeholder="No video selected"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {form.watch(`videos.${index}.url`) && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            const url = form.getValues(`videos.${index}.url`);
                                                            window.open(url, '_blank');
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-1">
                                                    {videoFields.length < 30 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => appendVideo({ name: "", url: "" })}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteVideo(index)}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {videoFields.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground">No videos added</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                {/* Row 10: Repeat Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <FormField
                        control={form.control}
                        name="repeatFlag"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <FormLabel className="text-right">Repeat Schedule:</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={(val) => field.onChange(val === "true")}
                                            defaultValue={field.value ? "true" : "false"}
                                            className="flex flex-row space-x-4"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="true" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Yes</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="false" />
                                                </FormControl>
                                                <FormLabel className="font-normal">No</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="reminderSchedule"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <FormLabel className="text-right">Repeat Schedule: {watchRepeatFlag && <span className="text-destructive">*</span>}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="--Select--" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage className="ml-[156px]" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* To Whom Section */}
                <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                        <FormLabel className="text-right">To Whom:</FormLabel>
                        <div className="flex gap-6">
                            <FormField
                                control={form.control}
                                name="studentFlag"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel className="font-normal">Student</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="alumniFlag"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel className="font-normal">Alumni Student</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="employeeFlag"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel className="font-normal">Staff</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="otherFlag"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel className="font-normal">Others</FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {/* Student Class Selection */}
                        {watchStudentFlag && (
                            <FormField
                                control={form.control}
                                name="classes"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                                            <FormLabel className="text-right pt-2">Class: <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <MultiSelect
                                                    options={classOptions}
                                                    onValueChange={(vals) => field.onChange(vals.map(Number))}
                                                    defaultValue={field.value?.map(String) || []}
                                                    placeholder="Select Classes"
                                                    variant="default"
                                                    animation={2}
                                                    maxCount={3}
                                                    modalPopover={true}
                                                    className="min-h-[100px]"
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage className="ml-[156px]" />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Staff Type Selection */}
                        {watchEmployeeFlag && (
                            <FormField
                                control={form.control}
                                name="staffTypes"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                                            <FormLabel className="text-right pt-2">Staff: <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <MultiSelect
                                                    options={staffTypeOptions}
                                                    onValueChange={(vals) => field.onChange(vals.map(Number))}
                                                    defaultValue={field.value?.map(String) || []}
                                                    placeholder="Select Staff Types"
                                                    variant="default"
                                                    animation={2}
                                                    maxCount={3}
                                                    modalPopover={true}
                                                    className="min-h-[100px]"
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage className="ml-[156px]" />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {/* Alumni Year Selection */}
                        {watchAlumniFlag && (
                            <FormField
                                control={form.control}
                                name="alumniYear"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                            <FormLabel className="text-right">Academic Year Of Old Students: <span className="text-destructive">*</span></FormLabel>
                                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="--Select--" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {academicYearOptions.map((year) => (
                                                        <SelectItem key={year.value} value={year.value}>
                                                            {year.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <FormMessage className="ml-[156px]" />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Others - Dynamic List */}
                        {watchOtherFlag && (
                            <div className="col-span-2 space-y-4 ml-[156px]">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium text-sm">Other Recipients</h4>
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="h-7 px-2 text-xs"
                                        onClick={() => appendOther({ name: "", mobile: "", email: "" })}
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> Add
                                    </Button>
                                </div>
                                {otherFields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end border p-2 rounded">
                                        <FormField
                                            control={form.control}
                                            name={`others.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name: <span className="text-destructive">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Name" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`others.${index}.mobile`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mobile No: <span className="text-destructive">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input {...field} maxLength={10} placeholder="Mobile Start with 7,8 or 9" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`others.${index}.email`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email-Id: <span className="text-destructive">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Email-Id" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="button" variant="destructive" size="icon" onClick={() => removeOther(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center gap-2 pt-4">
                    <Button type="submit" className="bg-primary">Save</Button>
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                </div>
            </form>
        </Form>
    );
}

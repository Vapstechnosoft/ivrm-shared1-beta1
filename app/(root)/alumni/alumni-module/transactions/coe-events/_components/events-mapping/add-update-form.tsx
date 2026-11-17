'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPageDetailsMap, saveEventsMapData } from '@/server/alumni/master-coe';
import { uploadDocument } from '@/server/document_upload';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image as ImageIcon, Plus, RotateCcw, Save, Trash2, Video } from 'lucide-react';
import type React from 'react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type EventsMapFormValues, eventsMapSchema } from './schema';

interface EventsMappingFormProps {
    onSuccess?: () => void;
    initialData: any;
    editData?: any;
}

export default function EventsMappingForm({ onSuccess, initialData, editData }: EventsMappingFormProps) {
    const form = useForm<EventsMapFormValues>({
        resolver: zodResolver(eventsMapSchema),
        defaultValues: {
            COEE_Id: 0,
            ASMAY_Id: '',
            COEME_Id: '',
            COEE_EStartDate: undefined,
            COEE_EEndDate: undefined,
            COEE_EStartTime: '',
            COEE_EEndTime: '',
            COEE_StudentFlag: false,
            COEE_EmployeeFlag: false,
            COEE_OtherFlag: false,
            COEE_AlumniFlag: false,
            COEE_ManagementFlag: false,
            stu_class_list: [],
            emp_type_list: [],
            images_listCoe: [],
            videos_list: []
        }
    });

    const {
        fields: imageFields,
        append: appendImage,
        remove: removeImage
    } = useFieldArray({
        control: form.control,
        name: 'images_listCoe'
    });

    const {
        fields: videoFields,
        append: appendVideo,
        remove: removeVideo
    } = useFieldArray({
        control: form.control,
        name: 'videos_list'
    });

    useEffect(() => {
        if (editData) {
            const fetchDetails = async () => {
                try {
                    const coeeId = editData.coeE_Id || (editData as any).COEE_Id;
                    const res = await getPageDetailsMap(coeeId);

                    // Handle structured response
                    const responseData = (res as any).data || res;
                    const mapEventList = responseData.edit_map_event || responseData.event_mapping_list || [];

                    if (mapEventList && mapEventList.length > 0) {
                        const mainData = mapEventList[0];

                        // Extract related lists from the structured response
                        const classList = responseData.edit_stu_class_list || responseData.stu_class_list || [];
                        const empList = responseData.edit_emp_type_list || responseData.emp_type_list || [];
                        const imageList = responseData.edit_images_list || responseData.images_list || [];
                        const videoList = responseData.edit_videos_list || responseData.videos_list || [];

                        form.reset({
                            COEE_Id: mainData.coeE_Id || mainData.COEE_Id,
                            ASMAY_Id: (mainData.asmaY_Id || mainData.ASMAY_Id || '').toString(),
                            COEME_Id: (mainData.coemE_Id || mainData.COEME_Id || '').toString(),
                            COEE_EStartDate:
                                mainData.coeE_EStartDate || mainData.COEE_EStartDate
                                    ? new Date(mainData.coeE_EStartDate || mainData.COEE_EStartDate)
                                    : undefined,
                            COEE_EEndDate:
                                mainData.coeE_EEndDate || mainData.COEE_EEndDate
                                    ? new Date(mainData.coeE_EEndDate || mainData.COEE_EEndDate)
                                    : undefined,
                            COEE_EStartTime: mainData.coeE_EStartTime || mainData.COEE_EStartTime || '',
                            COEE_EEndTime: mainData.coeE_EEndTime || mainData.COEE_EEndTime || '',
                            COEE_StudentFlag: mainData.coeE_StudentFlag ?? mainData.COEE_StudentFlag ?? false,
                            COEE_EmployeeFlag: mainData.coeE_EmployeeFlag ?? mainData.COEE_EmployeeFlag ?? false,
                            COEE_OtherFlag: mainData.coeE_OtherFlag ?? mainData.COEE_OtherFlag ?? false,
                            COEE_AlumniFlag: mainData.coeE_AlumniFlag ?? mainData.COEE_AlumniFlag ?? false,
                            COEE_ManagementFlag: mainData.coeE_ManagementFlag ?? mainData.COEE_ManagementFlag ?? false,
                            stu_class_list: classList.map((c: any) => ({ ASMCL_Id: c.asmcL_Id || c.ASMCL_Id })),
                            emp_type_list: empList.map((d: any) => ({ HRMD_Id: d.hrmD_Id || d.HRMD_Id })),
                            images_listCoe: imageList.map((img: any) => ({
                                COEEI_Id: img.coeeI_Id,
                                COEEI_Images: img.coeeI_Images || img.intbfl_FilePath
                            })),
                            videos_list: videoList.map((v: any) => ({
                                COEEV_Id: v.coeeV_Id,
                                COEEV_VideoURL: v.coeeV_Videos || v.COEEV_VideoURL
                            }))
                        });
                    }
                } catch (error) {
                    toast.error('Failed to fetch mapping details');
                }
            };
            fetchDetails();
        }
    }, [editData, form]);

    const onSubmit = async (values: EventsMapFormValues) => {
        try {
            const payload = {
                ...values,
                COEME_Id: Number(values.COEME_Id),
                ASMAY_Id: Number(values.ASMAY_Id),
                COEE_EStartDate: values.COEE_EStartDate ? values.COEE_EStartDate.toISOString() : null,
                COEE_EEndDate: values.COEE_EEndDate ? values.COEE_EEndDate.toISOString() : null,
                videos_list: values.videos_list.map((v) => v.COEEV_VideoURL)
            };

            const res = await saveEventsMapData(payload);
            if (res.success || res.returnval === true) {
                toast.success(res.message || (editData ? 'Event mapping updated' : 'Event mapping saved'));
                form.reset();
                onSuccess?.();
            } else {
                toast.error(res.message || 'Failed to save mapping');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('File', file);
        formData.append('folder', 'COE_Events');

        try {
            const res = await uploadDocument(formData);
            let url = '';

            // Handle various response formats from uploadDocument
            if (typeof res === 'string') {
                url = res;
            } else if (Array.isArray(res) && res.length > 0) {
                url = res[0].path || res[0];
            } else if (res && typeof res === 'object') {
                const data = (res as any).data || res;
                if (Array.isArray(data) && data.length > 0) {
                    url = data[0].path || data[0];
                } else {
                    url = (data as any).url || (data as any).path || (typeof data === 'string' ? data : '');
                }
            }

            if (url) {
                appendImage({ COEEI_Images: url });
                toast.success('File uploaded successfully');
            } else {
                toast.error('Upload failed: Invalid response format');
                console.error('Upload response format unknown:', res);
            }
        } catch (error) {
            toast.error('Upload failed');
        }
    };

    const data = initialData?.data || initialData;
    const years = data?.yearlist || data?.year_list || [];
    const masterEvents = data?.master_eventlist || data?.master_event_list || [];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <CollapsibleSection title='Event Information'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <FormField
                            control={form.control}
                            name='ASMAY_Id'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Academic Year <span className='text-destructive'>*</span>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Year' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {years.map((y: any) => (
                                                <SelectItem key={y.asmaY_Id || y.ASMAY_Id} value={(y.asmaY_Id || y.ASMAY_Id).toString()}>
                                                    {y.asmaY_Year || y.ASMAY_Year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='COEME_Id'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Event Name <span className='text-destructive'>*</span>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Event' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {(Array.isArray(masterEvents) ? masterEvents : []).map((e: any) => (
                                                <SelectItem key={e.coemE_Id || e.COEME_Id} value={(e.coemE_Id || e.COEME_Id).toString()}>
                                                    {e.coemE_EventName || e.COEME_EventName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title='Schedule Details'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
                        <FormField
                            control={form.control}
                            name='COEE_EStartDate'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Start Date <span className='text-destructive'>*</span>
                                    </FormLabel>
                                    <DatePicker date={field.value} setDate={field.onChange} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='COEE_EEndDate'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        End Date <span className='text-destructive'>*</span>
                                    </FormLabel>
                                    <DatePicker date={field.value} setDate={field.onChange} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='COEE_EStartTime'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Start Time <span className='text-destructive'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder='09:00 AM' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='COEE_EEndTime'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        End Time <span className='text-destructive'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder='05:00 PM' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title='Participants Mapping'>
                    <div className='flex flex-wrap gap-8 pt-4'>
                        <FormField
                            control={form.control}
                            name='COEE_StudentFlag'
                            render={({ field }) => (
                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Student</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='COEE_EmployeeFlag'
                            render={({ field }) => (
                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Employee</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='COEE_AlumniFlag'
                            render={({ field }) => (
                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Alumni</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='COEE_OtherFlag'
                            render={({ field }) => (
                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Other</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='COEE_ManagementFlag'
                            render={({ field }) => (
                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Management</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='mt-6 grid grid-cols-1 gap-6'>
                        {form.watch('COEE_StudentFlag') && (
                            <div className='space-y-4 rounded-md border bg-muted/20 p-4'>
                                <FormLabel className='block font-semibold'>Select Classes</FormLabel>
                                <FormField
                                    control={form.control}
                                    name='stu_class_list'
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={(data?.classlist || []).map((c: any) => ({
                                                label: c.asmcL_ClassName || c.ASMCL_ClassName,
                                                value: (c.asmcL_Id || c.ASMCL_Id).toString()
                                            }))}
                                            defaultValue={
                                                field.value?.map((item) => (item.ASMCL_Id || (item as any).asmcL_Id || '').toString()) || []
                                            }
                                            onValueChange={(val) => field.onChange(val.map((id) => ({ ASMCL_Id: Number(id) })))}
                                            placeholder='Select Classes'
                                        />
                                    )}
                                />
                            </div>
                        )}

                        {form.watch('COEE_EmployeeFlag') && (
                            <div className='space-y-4 rounded-md border bg-muted/20 p-4'>
                                <FormLabel className='block font-semibold'>Select Departments</FormLabel>
                                <FormField
                                    control={form.control}
                                    name='emp_type_list'
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={(data?.stafftypelist || []).map((d: any) => ({
                                                label: d.hrmD_DepartmentName || d.HRMD_DepartmentName,
                                                value: (d.hrmD_Id || d.HRMD_Id).toString()
                                            }))}
                                            defaultValue={
                                                field.value?.map((item) => (item.HRMD_Id || (item as any).hrmD_Id || '').toString()) || []
                                            }
                                            onValueChange={(val) => field.onChange(val.map((id) => ({ HRMD_Id: Number(id) })))}
                                            placeholder='Select Departments'
                                        />
                                    )}
                                />
                            </div>
                        )}
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title='Media Assets'>
                    <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                        <div className='space-y-4'>
                            <FormLabel>Photos/Images</FormLabel>
                            <div className='flex items-center gap-4'>
                                <Input type='file' onChange={handleFileUpload} accept='image/*' />
                            </div>
                            <div className='mt-4 flex flex-wrap gap-2'>
                                {imageFields.map((field, idx) => (
                                    <div key={field.id} className='flex items-center gap-2 rounded border bg-muted/30 p-2'>
                                        <ImageIcon className='h-4 w-4 text-primary' />
                                        <span className='max-w-[150px] truncate text-xs'>
                                            {form.watch(`images_listCoe.${idx}.COEEI_Images`)}
                                        </span>
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='icon'
                                            className='h-6 w-6'
                                            onClick={() => removeImage(idx)}>
                                            <Trash2 className='h-3 w-3 text-destructive' />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='space-y-4'>
                            <div className='flex items-center justify-between'>
                                <FormLabel>Video URLs</FormLabel>
                                <Button type='button' size='sm' variant='outline' onClick={() => appendVideo({ COEEV_VideoURL: '' })}>
                                    <Plus className='mr-2 h-4 w-4' /> Add Video
                                </Button>
                            </div>
                            {videoFields.map((field, idx) => (
                                <div key={field.id} className='flex gap-2'>
                                    <FormField
                                        control={form.control}
                                        name={`videos_list.${idx}.COEEV_VideoURL`}
                                        render={({ field }) => (
                                            <FormItem className='flex-1'>
                                                <FormControl>
                                                    <div className='relative'>
                                                        <Video className='absolute top-2.5 left-3 h-4 w-4 text-muted-foreground' />
                                                        <Input placeholder='YouTube/Vimeo URL' className='pl-9' {...field} />
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='button' variant='ghost' size='icon' onClick={() => removeVideo(idx)}>
                                        <Trash2 className='h-4 w-4 text-destructive' />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CollapsibleSection>

                <div className='flex justify-end gap-3 pt-6'>
                    <Button type='button' variant='outline' onClick={() => form.reset()}>
                        <RotateCcw className='mr-2 h-4 w-4' /> Clear
                    </Button>
                    <Button type='submit' disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (
                            <>
                                <RotateCcw className='mr-2 h-4 w-4 animate-spin' /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className='mr-2 h-4 w-4' /> {editData ? 'Update Mapping' : 'Save Mapping'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

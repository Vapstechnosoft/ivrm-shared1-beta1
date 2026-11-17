'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    deactivateEvent,
    getCOEMappingDetails,
    getEventDetails,
    getPageDetailsMap,
    getViewRecords,
    saveEventsMapData,
    switch2
} from '@/server/alumni/master-coe';
import { uploadDocument } from '@/server/document_upload';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, Image as ImageIcon, Pencil, Plus, RotateCcw, Save, ToggleLeft, ToggleRight, Trash2, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type IEventsMapFormValues, eventsMapSchema } from './schema';

interface EventsMapTabProps {
    initialData: any;
}

export default function EventsMapTab({ initialData }: EventsMapTabProps) {
    const [mappingData, setMappingData] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loadingMappings, setLoadingMappings] = useState(false);
    const [viewDetails, setViewDetails] = useState<any[]>([]);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const fetchMappings = async () => {
        setLoadingMappings(true);
        try {
            const res = await getCOEMappingDetails();
            // Handle nested response structure
            const data = (res as any).data || res;
            setMappingData(data.event_mapping_list || data.mapped_eventlist || []);
        } catch (error) {
            console.error('Failed to fetch mapping details');
        } finally {
            setLoadingMappings(false);
        }
    };

    useEffect(() => {
        fetchMappings();
    }, []);

    const form = useForm<IEventsMapFormValues>({
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

    const watchEvent = form.watch('COEME_Id');
    const watchYear = form.watch('ASMAY_Id');

    useEffect(() => {
        if (watchEvent) {
            handleEventChange(Number(watchEvent));
        }
    }, [watchEvent]);

    const handleEventChange = async (id: number) => {
        try {
            const res = await getEventDetails(id);
            if (res && (res as any).master_event_list && (res as any).master_event_list.length > 0) {
                const details = (res as any).master_event_list[0];
                // Update form or preview state with fetched event details (e.g. description, message templates)
            }
        } catch (error) {
            console.error('Failed to fetch event details');
        }
    };

    const onSubmit = async (values: IEventsMapFormValues) => {
        try {
            const payload = {
                ...values,
                COEME_Id: Number(values.COEME_Id),
                ASMAY_Id: Number(values.ASMAY_Id),
                COEE_EStartDate: values.COEE_EStartDate.toISOString(),
                COEE_EEndDate: values.COEE_EEndDate.toISOString(),
                videos_list: values.videos_list.map((v) => v.COEEV_VideoURL)
            };

            const res = await saveEventsMapData(payload);
            if (res.returnval === true) {
                toast.success('Event mapping saved successfully');
                form.reset();
                setEditingId(null);
                fetchMappings();
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
            const url = res.success && res.data ? res.data : '';
            appendImage({ COEEI_Images: url });
            toast.success('File uploaded successfully');
        } catch (error) {
            toast.error('Upload failed');
        }
    };

    const columns = [
        { header: 'SL No', accessorKey: 'sno', cell: (info: any) => info.row.index + 1 },
        { header: 'Event Name', accessorKey: 'COEME_EventName' },
        { header: 'Start Date', accessorKey: 'COEE_EStartDate', cell: (info: any) => new Date(info.getValue()).toLocaleDateString() },
        { header: 'End Date', accessorKey: 'COEE_EEndDate', cell: (info: any) => new Date(info.getValue()).toLocaleDateString() },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }: { row: any }) => (
                <div className='flex gap-2'>
                    <Button variant='ghost' size='icon' onClick={() => handleEdit(row.original)} title='Edit'>
                        <Pencil className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='icon' onClick={() => handleView(row.original)} title='View Details'>
                        <Eye className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='icon' onClick={() => handleToggleStatus(row.original)} title='Toggle Status'>
                        {row.original.COEE_ActiveFlag ? (
                            <ToggleRight className='h-4 w-4 text-green-500' />
                        ) : (
                            <ToggleLeft className='h-4 w-4 text-destructive' />
                        )}
                    </Button>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleDeactivate(row.original)}
                        title='Deactivate'
                        className='text-destructive'>
                        <Trash2 className='h-4 w-4' />
                    </Button>
                </div>
            )
        }
    ];

    const handleView = async (row: any) => {
        setIsLoadingDetails(true);
        setIsViewOpen(true);
        try {
            const res = await getViewRecords(row.COEE_Id);
            // Support both naming conventions for the details list
            const details = (res as any).event_mapping_list || (res as any).view_records || (res as any).grid_details || [];
            setViewDetails(details);
        } catch (error) {
            toast.error('Failed to fetch record details');
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const handleDeactivate = async (row: any) => {
        try {
            const res = await deactivateEvent(row.COEE_Id);
            if (res.returnval === true) {
                toast.success('Event deactivated successfully');
                fetchMappings();
            } else {
                toast.error(res.message || 'Failed to deactivate event');
            }
        } catch (error) {
            toast.error('Failed to deactivate event');
        }
    };

    const handleEdit = async (row: any) => {
        try {
            const res = await getPageDetailsMap(row.COEE_Id);
            if (res && (res as any).event_mapping_list && (res as any).event_mapping_list.length > 0) {
                const data = (res as any).event_mapping_list[0];
                setEditingId(data.COEE_Id);
                form.reset({
                    COEE_Id: data.COEE_Id,
                    ASMAY_Id: data.ASMAY_Id.toString(),
                    COEME_Id: data.COEME_Id.toString(),
                    COEE_EStartDate: new Date(data.COEE_EStartDate),
                    COEE_EEndDate: new Date(data.COEE_EEndDate),
                    COEE_EStartTime: data.COEE_EStartTime,
                    COEE_EEndTime: data.COEE_EEndTime,
                    COEE_StudentFlag: data.COEE_StudentFlag,
                    COEE_EmployeeFlag: data.COEE_EmployeeFlag,
                    COEE_OtherFlag: data.COEE_OtherFlag,
                    COEE_AlumniFlag: data.COEE_AlumniFlag,
                    COEE_ManagementFlag: data.COEE_ManagementFlag,
                    stu_class_list: data.stu_class_list || [],
                    emp_type_list: data.emp_type_list || [],
                    images_listCoe: data.images_listCoe || [],
                    videos_list: (data.videos_list || []).map((v: string) => ({ COEEV_VideoURL: v }))
                });
            } else {
                toast.error('Failed to fetch mapping details');
            }
        } catch (error) {
            toast.error('An error occurred while fetching details');
        }
    };

    const handleToggleStatus = async (row: any) => {
        try {
            const res = await switch2(row.COEE_Id);
            if (res.returnval === true) {
                toast.success('Status updated');
                fetchMappings();
            } else {
                toast.error(res.message || 'Failed to update status');
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className='space-y-8'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <CollapsibleSection title='Event Information'>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
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
                                                {(initialData?.yearlist || initialData?.year_list)?.map((y: any) => (
                                                    <SelectItem key={y.asmaY_Id} value={y.asmaY_Id.toString()}>
                                                        {y.asmaY_Year}
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
                                                {(initialData?.mapped_eventlist || initialData?.master_event_list)?.map((e: any) => (
                                                    <SelectItem
                                                        key={e.coemE_Id || e.COEME_Id}
                                                        value={(e.coemE_Id || e.COEME_Id).toString()}>
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
                        <div className='flex flex-wrap gap-8 border-t pt-4'>
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

                        {form.watch('COEE_StudentFlag') && (
                            <div className='mt-4 rounded-md border bg-muted/20 p-4'>
                                <FormLabel className='mb-2 block font-semibold'>Select Classes</FormLabel>
                                <FormField
                                    control={form.control}
                                    name='stu_class_list'
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={
                                                initialData?.class_list?.map((c: any) => ({
                                                    label: c.asmcL_ClassName,
                                                    value: c.asmcL_Id.toString()
                                                })) || []
                                            }
                                            defaultValue={field.value?.map((item) => item.ASMCL_Id.toString()) || []}
                                            onValueChange={(val) => field.onChange(val.map((id) => ({ ASMCL_Id: Number(id) })))}
                                            placeholder='Select Classes'
                                        />
                                    )}
                                />
                            </div>
                        )}

                        {form.watch('COEE_EmployeeFlag') && (
                            <div className='mt-4 rounded-md border bg-muted/20 p-4'>
                                <FormLabel className='mb-2 block font-semibold'>Select Employee Types</FormLabel>
                                <FormField
                                    control={form.control}
                                    name='emp_type_list'
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={
                                                initialData?.department_list?.map((d: any) => ({
                                                    label: d.hrmD_DepartmentName,
                                                    value: d.hrmD_Id.toString()
                                                })) || []
                                            }
                                            defaultValue={field.value?.map((item) => item.HRMD_Id.toString()) || []}
                                            onValueChange={(val) => field.onChange(val.map((id) => ({ HRMD_Id: Number(id) })))}
                                            placeholder='Select Departments'
                                        />
                                    )}
                                />
                            </div>
                        )}
                    </CollapsibleSection>

                    <CollapsibleSection title='Media Assets'>
                        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                            <div className='space-y-4'>
                                <FormLabel>Photos/Images</FormLabel>
                                <div className='flex items-center gap-4'>
                                    <Input type='file' onChange={handleFileUpload} accept='image/*' />
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {imageFields.map((field, idx) => (
                                        <div key={field.id} className='flex items-center gap-2 rounded border bg-muted/30 p-2'>
                                            <ImageIcon className='h-4 w-4' />
                                            <span className='max-w-[150px] truncate text-xs'>
                                                {form.watch(`images_listCoe.${idx}.COEEI_Images`)}
                                            </span>
                                            <Button
                                                type='button'
                                                variant='ghost'
                                                size='icon'
                                                className='h-6 w-6'
                                                onClick={() => removeImage(idx)}>
                                                <Trash2 className='h-3 w-3' />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <FormLabel>Video URLs</FormLabel>
                                    <Button type='button' size='sm' variant='outline' onClick={() => appendVideo({ COEEV_VideoURL: '' })}>
                                        <Plus className='mr-2 h-4 w-4' /> Add Video URL
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

                    <div className='flex justify-center gap-4 pt-8'>
                        <Button type='submit' className='w-40 bg-primary' disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? (
                                <>
                                    <RotateCcw className='mr-2 h-4 w-4 animate-spin' /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className='mr-2 h-4 w-4' /> Save Mapping
                                </>
                            )}
                        </Button>
                        <Button type='button' variant='outline' className='w-40' onClick={() => form.reset()}>
                            <RotateCcw className='mr-2 h-4 w-4' /> Clear
                        </Button>
                    </div>
                </form>
            </Form>

            <CollapsibleSection title='Mapped Events List' defaultOpen={true}>
                <GenericDataTable columns={columns} data={mappingData} isLoading={false} />
            </CollapsibleSection>

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className='max-h-[80vh] max-w-4xl overflow-y-auto'>
                    <DialogHeader>
                        <DialogTitle>Event Record Details</DialogTitle>
                        <DialogDescription>Viewing detailed information for the mapped event.</DialogDescription>
                    </DialogHeader>
                    {isLoadingDetails ? (
                        <div className='flex h-32 items-center justify-center'>
                            <RotateCcw className='h-8 w-8 animate-spin text-primary' />
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {viewDetails.length > 0 ? (
                                <GenericDataTable
                                    isLoading={isLoadingDetails}
                                    columns={[
                                        { header: 'Event Name', accessorKey: 'COEME_EventName' },
                                        {
                                            header: 'Start Date',
                                            accessorKey: 'COEE_EStartDate',
                                            cell: (info) => new Date(info.getValue() as string).toLocaleDateString()
                                        },
                                        {
                                            header: 'End Date',
                                            accessorKey: 'COEE_EEndDate',
                                            cell: (info) => new Date(info.getValue() as string).toLocaleDateString()
                                        },
                                        { header: 'Year', accessorKey: 'ASMAY_Year' }
                                        // Add more detail columns if necessary based on API response
                                    ]}
                                    data={viewDetails}
                                />
                            ) : (
                                <div className='p-8 text-center text-muted-foreground'>No detailed records found.</div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setIsViewOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

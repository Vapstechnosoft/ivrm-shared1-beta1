'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { getPageDetails, getViewRecordsMaster, saveMasterEventsData, switch1 } from '@/server/alumni/master-coe';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, Pencil, RotateCcw, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type IMasterEventsFormValues, masterEventsSchema } from './schema';

interface MasterEventsTabProps {
    initialData: any;
    refreshData: () => void;
}

export default function MasterEventsTab({ initialData, refreshData }: MasterEventsTabProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewDetails, setViewDetails] = useState<any[]>([]);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const form = useForm<IMasterEventsFormValues>({
        resolver: zodResolver(masterEventsSchema),
        defaultValues: {
            COEME_Id: 0,
            radiotype: 'Manual',
            COEME_EventName: '',
            COEME_EventDesc: '',
            COEME_SMSMessage: '',
            COEME_MailSubject: '',
            COEME_MailHeader: '',
            COEME_Mail_Message: '',
            COEME_MailFooter: '',
            COEME_ActiveFlag: true
        }
    });

    const onSubmit = async (values: IMasterEventsFormValues) => {
        try {
            const res = await saveMasterEventsData(values);
            if (res.returnval === true) {
                toast.success(editingId ? 'Event updated successfully' : 'Event saved successfully');
                form.reset();
                setEditingId(null);
                refreshData();
            } else {
                toast.error(res.message || 'Failed to save event');
            }
        } catch (error) {
            toast.error('An error occurred while saving');
        }
    };

    const handleEdit = async (row: any) => {
        try {
            const res = await getPageDetails(row.COEME_Id);
            if (res && (res as any).master_event_list && (res as any).master_event_list.length > 0) {
                const data = (res as any).master_event_list[0];
                setEditingId(data.COEME_Id);
                form.reset({
                    COEME_Id: data.COEME_Id,
                    radiotype: data.COEME_ManualDefault_Flag === 'Default' ? 'Default' : 'Manual',
                    COEME_EventName: data.COEME_EventName,
                    COEME_EventDesc: data.COEME_EventDesc,
                    COEME_SMSMessage: data.COEME_SMSMessage || '',
                    COEME_MailSubject: data.COEME_MailSubject || '',
                    COEME_MailHeader: data.COEME_MailHeader || '',
                    COEME_Mail_Message: data.COEME_Mail_Message || '',
                    COEME_MailFooter: data.COEME_MailFooter || '',
                    COEME_ActiveFlag: data.COEME_ActiveFlag
                });
            } else {
                toast.error('Failed to fetch event details');
            }
        } catch (error) {
            toast.error('An error occurred while fetching details');
        }
    };

    const handleToggleStatus = async (row: any) => {
        try {
            const res = await switch1(row.COEME_Id);
            if (res.returnval === true) {
                toast.success('Status updated successfully');
                // refreshData();
                window.location.reload();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleView = async (row: any) => {
        setIsLoadingDetails(true);
        setIsViewOpen(true);
        try {
            const res = await getViewRecordsMaster(row.COEME_Id);
            const details = (res as any).event_mapping_list || (res as any).view_records || (res as any).details || [];
            setViewDetails(details);
        } catch (error) {
            toast.error('Failed to fetch details');
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const columns = [
        { header: 'SL No', accessorKey: 'sno', cell: (info: any) => info.row.index + 1 },
        { header: 'Event Name', accessorKey: 'coemE_EventName' },
        { header: 'Description', accessorKey: 'coemE_EventDesc' },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }: { row: any }) => (
                <div className='flex gap-2'>
                    <Button variant='ghost' size='icon' onClick={() => handleEdit(row.original)} title='Edit'>
                        <Pencil className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='icon' onClick={() => handleView(row.original)} title='View Mappings'>
                        <Eye className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='icon' onClick={() => handleToggleStatus(row.original)} title='Toggle Status'>
                        {row.original.COEME_ActiveFlag ? (
                            <ToggleRight className='h-4 w-4 text-green-500' />
                        ) : (
                            <ToggleLeft className='h-4 w-4 text-destructive' />
                        )}
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className='space-y-8'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <CollapsibleSection title={editingId ? 'Edit Event' : 'Create New Event'}>
                        <div className='grid grid-cols-1 gap-6'>
                            <div className='flex justify-center'>
                                <FormField
                                    control={form.control}
                                    name='radiotype'
                                    render={({ field }) => (
                                        <FormItem className='space-y-3'>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className='flex space-x-4'>
                                                    <FormItem className='flex items-center space-x-2 space-y-0'>
                                                        <FormControl>
                                                            <RadioGroupItem value='Manual' />
                                                        </FormControl>
                                                        <FormLabel className='font-normal'>Manual Content</FormLabel>
                                                    </FormItem>
                                                    <FormItem className='flex items-center space-x-2 space-y-0'>
                                                        <FormControl>
                                                            <RadioGroupItem value='Default' />
                                                        </FormControl>
                                                        <FormLabel className='font-normal'>Default Content</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <FormField
                                    control={form.control}
                                    name='COEME_EventName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Event Name <span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value as string} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='COEME_EventDesc'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Event Description <span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value as string} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {form.watch('radiotype') === 'Manual' && (
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                    <FormField
                                        control={form.control}
                                        name='COEME_SMSMessage'
                                        render={({ field }) => (
                                            <FormItem className='md:col-span-1'>
                                                <FormLabel>SMS Content</FormLabel>
                                                <FormControl>
                                                    <Textarea rows={4} {...field} value={field.value as string} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className='flex flex-wrap gap-2 pt-8'>
                                        {(initialData?.parameterlist || initialData?.parameter_list)?.map((p: any, idx: number) => (
                                            <Button
                                                key={`sms-param-${p.ismP_ID || p.id || idx}`}
                                                type='button'
                                                variant='outline'
                                                size='sm'
                                                onClick={() => {
                                                    const current = form.getValues('COEME_SMSMessage') || '';
                                                    form.setValue('COEME_SMSMessage', current + ` ${p.ismP_NAME || p.name} `);
                                                }}>
                                                {p.ismP_NAME || p.name}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <FormField
                                    control={form.control}
                                    name='COEME_MailSubject'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Email Subject <span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value as string} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='COEME_MailHeader'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Email Header <span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value as string} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {form.watch('radiotype') === 'Manual' && (
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                    <FormField
                                        control={form.control}
                                        name='COEME_Mail_Message'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Message</FormLabel>
                                                <FormControl>
                                                    <Textarea rows={4} {...field} value={field.value as string} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className='flex flex-wrap gap-2 pt-8'>
                                        {(initialData?.parameterlist || initialData?.parameter_list)?.map((p: any, idx: number) => (
                                            <Button
                                                key={`email-param-${p.ismP_ID || p.id || idx}`}
                                                type='button'
                                                variant='outline'
                                                size='sm'
                                                onClick={() => {
                                                    const current = form.getValues('COEME_Mail_Message') || '';
                                                    form.setValue('COEME_Mail_Message', current + ` ${p.ismP_NAME || p.name} `);
                                                }}>
                                                {p.ismP_NAME || p.name}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name='COEME_MailFooter'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Email Footer <span className='text-destructive'>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value as string} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex justify-center gap-4 pt-8'>
                            <Button type='submit' className='w-40'>
                                <Save className='mr-2 h-4 w-4' /> {editingId ? 'Update' : 'Save'}
                            </Button>
                            <Button
                                type='button'
                                variant='outline'
                                className='w-40'
                                onClick={() => {
                                    form.reset();
                                    setEditingId(null);
                                }}>
                                <RotateCcw className='mr-2 h-4 w-4' /> Cancel
                            </Button>
                        </div>
                    </CollapsibleSection>
                </form>
            </Form>

            <CollapsibleSection title='Master Events List' defaultOpen={true}>
                <GenericDataTable
                    columns={columns}
                    data={(() => {
                        // API returns data directly in response.data array
                        if (Array.isArray(initialData?.data)) {
                            return initialData.data;
                        }
                        // Fallback for other possible structures
                        return initialData?.master_eventlist || initialData?.master_event_list || initialData?.mapped_eventlist || [];
                    })()}
                    isLoading={false}
                />
            </CollapsibleSection>

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className='max-h-[80vh] max-w-4xl overflow-y-auto'>
                    <DialogHeader>
                        <DialogTitle>Mapped Event Records</DialogTitle>
                        <DialogDescription>Viewing mapping details for the selected master event.</DialogDescription>
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
                                        { header: 'Academic Year', accessorKey: 'ASMAY_Year' },
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
                                        { header: 'Start Time', accessorKey: 'COEE_EStartTime' },
                                        { header: 'End Time', accessorKey: 'COEE_EEndTime' }
                                    ]}
                                    data={viewDetails}
                                />
                            ) : (
                                <div className='p-8 text-center text-muted-foreground'>No mapping records found for this event.</div>
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

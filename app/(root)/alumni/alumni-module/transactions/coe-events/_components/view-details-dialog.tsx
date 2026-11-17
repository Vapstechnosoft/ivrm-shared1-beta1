'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Image as ImageIcon, Mail, MessageSquare, RotateCcw, Video } from 'lucide-react';

interface ViewDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    loading: boolean;
    data: any | null;
}

export default function ViewDetailsDialog({ isOpen, onClose, title, description, loading, data }: ViewDetailsDialogProps) {
    const isStructuredData = data && !Array.isArray(data) && (data.edit_m_event || data.edit_stu_class_list);
    const isArrayData = Array.isArray(data);

    // Extract data sections gracefully if structured
    // Extract data sections gracefully if structured
    // Prioritize edit_map_event for schedule details (Events Mapping), fallback to edit_m_event (Master Events)
    const mapEventInfo = isStructuredData ? data?.edit_map_event?.[0] || {} : {};
    const masterEventInfo = isStructuredData ? data?.edit_m_event?.[0] || {} : {};

    // Merge info: Prefer mapping info for specific schedule, master info for generic details
    const eventInfo = { ...masterEventInfo, ...mapEventInfo };
    const masterInfo = masterEventInfo;
    const classes = isStructuredData ? data?.edit_stu_class_list || [] : [];
    const employees = isStructuredData ? data?.edit_emp_type_list || [] : [];
    const others = isStructuredData ? data?.edit_oth_mobilenos_list || [] : [];
    const images = isStructuredData ? data?.edit_images_list || [] : [];
    const videos = isStructuredData ? data?.edit_videos_list || [] : [];

    const formatDate = (date: string) =>
        date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='flex max-h-[90vh] max-w-5xl flex-col overflow-hidden p-0'>
                <DialogHeader className='p-6 pb-0'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <DialogTitle className='font-bold text-2xl text-primary'>{title}</DialogTitle>
                            {description && <DialogDescription>{description}</DialogDescription>}
                        </div>
                        {isStructuredData && eventInfo?.coeE_ActiveFlag !== undefined && (
                            <Badge variant={eventInfo.coeE_ActiveFlag ? 'success' : 'destructive'} className='px-3 py-1'>
                                {eventInfo.coeE_ActiveFlag ? 'Active' : 'Inactive'}
                            </Badge>
                        )}
                    </div>
                </DialogHeader>

                <div className='flex-1 overflow-y-auto p-6 pt-2'>
                    {loading ? (
                        <div className='flex h-64 items-center justify-center'>
                            <div className='space-y-4 text-center'>
                                <RotateCcw className='mx-auto h-12 w-12 animate-spin text-primary' />
                                <p className='animate-pulse text-muted-foreground'>Fetching records...</p>
                            </div>
                        </div>
                    ) : !data || (isArrayData && data.length === 0) ? (
                        <div className='rounded-lg border-2 border-dashed bg-muted/30 p-12 text-center text-muted-foreground'>
                            No records found.
                        </div>
                    ) : isStructuredData ? (
                        <Tabs defaultValue='summary' className='w-full'>
                            <TabsList className='sticky top-0 z-10 mb-6 grid w-full grid-cols-5 bg-background shadow-sm'>
                                <TabsTrigger value='summary'>Summary</TabsTrigger>
                                <TabsTrigger value='classes'>Classes ({classes.length})</TabsTrigger>
                                <TabsTrigger value='employees'>Employees ({employees.length})</TabsTrigger>
                                <TabsTrigger value='others'>Others ({others.length})</TabsTrigger>
                                <TabsTrigger value='media'>Media ({images.length + videos.length})</TabsTrigger>
                            </TabsList>

                            <TabsContent value='summary' className='mt-0 space-y-6'>
                                <Card className='border-l-4 border-l-primary shadow-sm'>
                                    <CardContent className='grid grid-cols-1 gap-6 pt-6 md:grid-cols-2'>
                                        <div className='space-y-4'>
                                            <div className='flex items-start gap-3'>
                                                <Calendar className='mt-0.5 h-5 w-5 text-primary' />
                                                <div>
                                                    <p className='font-semibold text-muted-foreground text-xs uppercase tracking-wider'>
                                                        Event Period
                                                    </p>
                                                    <p className='font-medium text-lg'>
                                                        {formatDate(eventInfo.coeE_EStartDate)} - {formatDate(eventInfo.coeE_EEndDate)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='flex items-start gap-3'>
                                                <Clock className='mt-0.5 h-5 w-5 text-primary' />
                                                <div>
                                                    <p className='font-semibold text-muted-foreground text-xs uppercase tracking-wider'>
                                                        Timing
                                                    </p>
                                                    <p className='font-medium text-lg'>
                                                        {eventInfo.coeE_EStartTime || '-'} TO {eventInfo.coeE_EEndTime || '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='space-y-4'>
                                            <div className='flex items-center gap-3'>
                                                <MessageSquare
                                                    className={`h-5 w-5 ${eventInfo.coeE_SMSActiveFlag ? 'text-green-500' : 'text-muted-foreground'}`}
                                                />
                                                <span className='font-medium'>SMS Notifications: </span>
                                                <Badge variant={eventInfo.coeE_SMSActiveFlag ? 'success' : 'outline'}>
                                                    {eventInfo.coeE_SMSActiveFlag ? 'Enabled' : 'Disabled'}
                                                </Badge>
                                            </div>
                                            <div className='flex items-center gap-3'>
                                                <Mail
                                                    className={`h-5 w-5 ${eventInfo.coeE_MailActiveFlag ? 'text-blue-500' : 'text-muted-foreground'}`}
                                                />
                                                <span className='font-medium'>Email Notifications: </span>
                                                <Badge variant={eventInfo.coeE_MailActiveFlag ? 'info' : 'outline'}>
                                                    {eventInfo.coeE_MailActiveFlag ? 'Enabled' : 'Disabled'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {masterInfo.coemE_EventDesc && (
                                    <div className='rounded-lg border bg-muted/30 p-4'>
                                        <h4 className='mb-2 font-semibold text-primary'>Description</h4>
                                        <p className='text-sm leading-relaxed'>{masterInfo.coemE_EventDesc}</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value='classes' className='mt-0'>
                                <GenericDataTable
                                    columns={[
                                        {
                                            accessorKey: 'sno',
                                            header: 'SL No',
                                            cell: (info) => info.row.index + 1,
                                            size: 80
                                        },
                                        {
                                            accessorKey: 'asmcL_ClassName',
                                            header: 'Class Name'
                                        }
                                    ]}
                                    data={classes}
                                    isLoading={false}
                                    noDataTitle='No Classes Mapped'
                                    noDataDescription='This event is not restricted to specific classes.'
                                />
                            </TabsContent>

                            <TabsContent value='employees' className='mt-0'>
                                <GenericDataTable
                                    columns={[
                                        {
                                            accessorKey: 'sno',
                                            header: 'SL No',
                                            cell: (info) => info.row.index + 1,
                                            size: 80
                                        },
                                        {
                                            accessorKey: 'hrmgT_EmployeeGroupType',
                                            header: 'Employee Group'
                                        }
                                    ]}
                                    data={employees}
                                    isLoading={false}
                                    noDataTitle='No Staff Types Mapped'
                                    noDataDescription='This event is not restricted to specific staff groups.'
                                />
                            </TabsContent>

                            <TabsContent value='others' className='mt-0'>
                                <GenericDataTable
                                    columns={[
                                        {
                                            accessorKey: 'sno',
                                            header: 'SL No',
                                            cell: (info) => info.row.index + 1,
                                            size: 80
                                        },
                                        { accessorKey: 'coeeO_Name', header: 'Name' },
                                        { accessorKey: 'coeeO_MobileNo', header: 'Mobile' },
                                        { accessorKey: 'coeeO_Emailid', header: 'Email' }
                                    ]}
                                    data={others}
                                    isLoading={false}
                                    noDataTitle='No Other Contacts'
                                    noDataDescription='No external contacts mapped to this event.'
                                />
                            </TabsContent>

                            <TabsContent value='media' className='mt-0 space-y-6'>
                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                    <div className='space-y-3'>
                                        <div className='flex items-center gap-2 border-b pb-2 font-semibold text-primary'>
                                            <ImageIcon className='h-4 w-4' />
                                            <span>Images ({images.length})</span>
                                        </div>
                                        {images.length > 0 ? (
                                            <div className='grid grid-cols-2 gap-4'>
                                                {images.map((img: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className='group relative aspect-video overflow-hidden rounded-md border bg-muted'>
                                                        <img
                                                            src={img.coeeI_Images || img.intbfl_FilePath}
                                                            alt={`Event image ${idx + 1}`}
                                                            className='h-full w-full object-cover transition-transform group-hover:scale-110'
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className='rounded border border-dashed bg-muted/20 p-4 text-muted-foreground text-sm italic'>
                                                No images uploaded.
                                            </p>
                                        )}
                                    </div>
                                    <div className='space-y-3'>
                                        <div className='flex items-center gap-2 border-b pb-2 font-semibold text-primary'>
                                            <Video className='h-4 w-4' />
                                            <span>Videos ({videos.length})</span>
                                        </div>
                                        {videos.length > 0 ? (
                                            <ul className='space-y-2'>
                                                {videos.map((vid: any, idx: number) => (
                                                    <li key={idx} className='flex items-center gap-3 rounded-md border bg-muted/30 p-3'>
                                                        <div className='rounded bg-background p-2'>
                                                            <Video className='h-4 w-4 text-primary' />
                                                        </div>
                                                        <a
                                                            href={vid.coeeV_Videos}
                                                            target='_blank'
                                                            rel='noreferrer'
                                                            className='truncate font-medium text-primary text-sm hover:underline'>
                                                            {vid.coeeV_Videos || 'View Video'}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className='rounded border border-dashed bg-muted/20 p-4 text-muted-foreground text-sm italic'>
                                                No videos uploaded.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    ) : (
                        <div className='space-y-4'>
                            <GenericDataTable
                                isLoading={loading}
                                columns={[
                                    { header: 'SL No', cell: (info: any) => info.row.index + 1, size: 80 },
                                    { header: 'Event Name', accessorKey: 'coemE_EventName' },
                                    { header: 'Year', accessorKey: 'asmaY_Year' },
                                    {
                                        header: 'Start Date',
                                        accessorKey: 'coeE_EStartDate',
                                        cell: (info: any) => formatDate(info.getValue())
                                    },
                                    { header: 'End Date', accessorKey: 'coeE_EEndDate', cell: (info: any) => formatDate(info.getValue()) },
                                    {
                                        header: 'Status',
                                        accessorKey: 'coemE_ActiveFlag',
                                        cell: (info: any) =>
                                            info.getValue() ? (
                                                <Badge variant='success'>Active</Badge>
                                            ) : (
                                                <Badge variant='destructive'>Inactive</Badge>
                                            )
                                    }
                                ]}
                                data={data}
                                noDataTitle='No records'
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className='border-t bg-muted/10 p-6 pt-0'>
                    <Button variant='outline' onClick={onClose} className='min-w-[100px]'>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

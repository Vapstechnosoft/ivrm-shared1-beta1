'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { useLeaveDetailsById } from '@/hooks/hrms/leave-management/useAdminOnDutyApply';
import { Loader2, FileText, Calendar, Clock, User, Download, Info, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface ViewLeaveDetailsDialogProps {
    leaveId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ViewLeaveDetailsDialog({
    leaveId,
    open,
    onOpenChange
}: ViewLeaveDetailsDialogProps) {
    const { data, isLoading } = useLeaveDetailsById(leaveId);

    const leaveApp = data?.leaveApplication?.[0];
    const leaveDetails = data?.leaveApplicationDetails?.[0];

    const getStatusStyles = (status: string) => {
        if (status === 'Applied' || status === 'Requested') return 'bg-blue-100 text-blue-700 border-blue-200';
        if (status === 'Approved') return 'bg-green-100 text-green-700 border-green-200';
        if (status === 'Rejected') return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-muted text-muted-foreground';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-lg border-none shadow-2xl p-0 overflow-hidden'>
                <DialogHeader className='bg-primary/5 p-6 pb-4'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 rounded-lg bg-primary/10 text-primary'>
                            <FileText className='h-5 w-5' />
                        </div>
                        <div>
                            <DialogTitle className='text-xl'>Application Details</DialogTitle>
                            <DialogDescription className='text-xs'>
                                Comprehensive overview of the On Duty request.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className='p-6'>
                    {isLoading ? (
                        <div className='flex flex-col items-center justify-center py-12 gap-3'>
                            <Loader2 className='h-10 w-10 animate-spin text-primary opacity-50' />
                            <p className='text-sm font-medium text-muted-foreground'>Fetching details...</p>
                        </div>
                    ) : leaveApp ? (
                        <div className='space-y-6'>
                            {/* Header Info */}
                            <div className='flex items-center justify-between bg-muted/30 p-4 rounded-xl border'>
                                <div className='flex flex-col'>
                                    <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>Application ID</span>
                                    <span className='font-mono font-bold text-primary'>{leaveApp.hrelaP_ApplicationID}</span>
                                </div>
                                <Badge className={getStatusStyles(leaveApp.hrelaP_ApplicationStatus)}>
                                    {leaveApp.hrelaP_ApplicationStatus}
                                </Badge>
                            </div>

                            <div className='grid grid-cols-2 gap-x-8 gap-y-6'>
                                <DetailItem
                                    icon={<User className='h-4 w-4 text-blue-500' />}
                                    label="Employee ID"
                                    value={leaveApp.hrmE_Id}
                                />
                                <DetailItem
                                    icon={<Calendar className='h-4 w-4 text-orange-500' />}
                                    label="Applied Date"
                                    value={leaveApp.hrelaP_ApplicationDate ? format(new Date(leaveApp.hrelaP_ApplicationDate), 'dd MMM yyyy') : '-'}
                                />
                                <DetailItem
                                    icon={<Calendar className='h-4 w-4 text-purple-500' />}
                                    label="From Date"
                                    value={leaveApp.hrelaP_FromDate ? format(new Date(leaveApp.hrelaP_FromDate), 'dd MMM yyyy') : '-'}
                                />
                                <DetailItem
                                    icon={<Calendar className='h-4 w-4 text-purple-500' />}
                                    label="To Date"
                                    value={leaveApp.hrelaP_ToDate ? format(new Date(leaveApp.hrelaP_ToDate), 'dd MMM yyyy') : '-'}
                                />
                                <DetailItem
                                    icon={<Clock className='h-4 w-4 text-green-500' />}
                                    label="Timings"
                                    value={leaveDetails ? `${leaveDetails.hrelapD_InTime} - ${leaveDetails.hrelapD_OutTime}` : 'Full Day'}
                                />
                                <DetailItem
                                    icon={<Info className='h-4 w-4 text-yellow-600' />}
                                    label="Total Duration"
                                    value={`${leaveApp.hrelaP_TotalDays || 1} ${Number(leaveApp.hrelaP_TotalDays) === 1 ? 'Day' : 'Days'}`}
                                />
                            </div>

                            <Separator />

                            <div className='space-y-2'>
                                <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider block'>Reason for On Duty</span>
                                <div className='rounded-lg bg-orange-50/50 border border-orange-100 p-4 text-sm leading-relaxed text-slate-700 italic'>
                                    "{leaveApp.hrelaP_LeaveReason}"
                                </div>
                            </div>

                            {leaveApp.hrelaP_SupportingDocument && (
                                <div className='p-3 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <div className='p-2 rounded bg-white shadow-sm'><FileText className='h-4 w-4 text-primary' /></div>
                                        <div className='flex flex-col'>
                                            <span className='text-xs font-bold'>Supporting Document</span>
                                            <span className='text-[10px] text-muted-foreground'>Click to view attachment</span>
                                        </div>
                                    </div>
                                    <Button variant='ghost' size='sm' className='text-primary font-bold gap-2' asChild>
                                        <a href={leaveApp.hrelaP_SupportingDocument} target="_blank" rel="noopener noreferrer">
                                            <Download className='h-3.5 w-3.5' /> VIEW
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='py-12 text-center'>
                            <AlertCircle className='h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20' />
                            <p className='text-muted-foreground font-medium'>Application details not found.</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 p-6 pt-0">
                    <Button variant='outline' onClick={() => onOpenChange(false)} className='px-8 h-10'>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: any }) {
    return (
        <div className='flex gap-3'>
            <div className='flex-shrink-0 mt-0.5'>{icon}</div>
            <div className='flex flex-col'>
                <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>{label}</span>
                <span className='text-sm font-semibold truncate max-w-[150px]'>{value}</span>
            </div>
        </div>
    );
}
